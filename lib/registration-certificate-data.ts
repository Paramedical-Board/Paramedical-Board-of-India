import { supabaseAdmin } from "@/lib/supabase";
import { regNoFromSuffix, istDate } from "@/lib/cert-number";

/** Number of years a registration certificate stays valid from the registration date. */
export const REGISTRATION_VALIDITY_YEARS = 5;

export interface RegistrationCertificateData {
  certificate_no: string; // IPBI/REG/<number set by admin>
  enrollment_no: string;
  candidate_name: string;
  father_name: string;
  address: string;
  dob: string | null;
  course: string;
  institution_name: string;
  academic_session: string | null;
  photo_url: string | null;
  registration_date: string; // YYYY-MM-DD (the day the admin issued the number)
  valid_upto: string; // YYYY-MM-DD
}

export interface RegistrationCertificateResult {
  data: RegistrationCertificateData | null;
  error: string | null;
}

function addYears(isoDate: string, years: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCFullYear(d.getUTCFullYear() + years);
  // Validity ends the day before the anniversary (e.g. 06/04/2023 -> 05/04/2028)
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export async function getRegistrationCertificateData(
  registrationId: string
): Promise<RegistrationCertificateResult> {
  const { data: reg, error } = await supabaseAdmin
    .from("student_registrations")
    .select(
      "enrollment_no, candidate_name, father_name, dob, course, photo_url, status, address, district, state, pincode, academic_session, created_at, reg_cert_suffix, reg_cert_issued_at, colleges(college_name)"
    )
    .eq("id", registrationId)
    .single();

  if (error) {
    console.error("getRegistrationCertificateData error:", error.message);
    return { data: null, error: "Certificate is not available right now. Please try again later." };
  }
  if (!reg) {
    return { data: null, error: "Registration not found" };
  }

  if (reg.status !== "approved") {
    return {
      data: null,
      error: "Your registration has not been approved yet. Certificate is available only after approval.",
    };
  }

  const enrollmentNo = (reg as any).enrollment_no as string | null;
  if (!enrollmentNo) {
    return { data: null, error: "Enrollment number has not been allotted yet" };
  }

  // The admin decides who gets the certificate: nothing is shown until a number has been set.
  const suffix = ((reg as any).reg_cert_suffix as string | null)?.trim();
  if (!suffix) {
    return {
      data: null,
      error: "Your Registration Certificate has not been issued yet. Please contact your college or the Board.",
    };
  }

  const college = reg.colleges as unknown as { college_name?: string } | null;

  const address = [reg.address, reg.district, reg.state, reg.pincode]
    .map((p) => (typeof p === "string" ? p.trim() : ""))
    .filter(Boolean)
    .join(", ");

  const registrationDate = istDate((reg as any).reg_cert_issued_at ?? reg.created_at);

  return {
    data: {
      certificate_no: regNoFromSuffix(suffix),
      enrollment_no: enrollmentNo,
      candidate_name: reg.candidate_name,
      father_name: reg.father_name,
      address: address || "—",
      dob: reg.dob,
      course: reg.course,
      institution_name: college?.college_name || "—",
      academic_session: reg.academic_session,
      photo_url: reg.photo_url,
      registration_date: registrationDate,
      valid_upto: addYears(registrationDate, REGISTRATION_VALIDITY_YEARS),
    },
    error: null,
  };
}
