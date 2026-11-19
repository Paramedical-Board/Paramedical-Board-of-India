import { supabaseAdmin } from "@/lib/supabase";

/** Number of years a registration certificate stays valid from the registration date. */
export const REGISTRATION_VALIDITY_YEARS = 5;

export interface RegistrationCertificateData {
  certificate_no: string;
  enrollment_no: string;
  candidate_name: string;
  father_name: string;
  address: string;
  dob: string | null;
  course: string;
  institution_name: string;
  academic_session: string | null;
  photo_url: string | null;
  registration_date: string; // YYYY-MM-DD
  valid_upto: string; // YYYY-MM-DD
  generated_at: string; // ISO timestamp of when this copy was generated
}

export interface RegistrationCertificateResult {
  data: RegistrationCertificateData | null;
  error: string | null;
}

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addYears(isoDate: string, years: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCFullYear(d.getUTCFullYear() + years);
  // Validity ends the day before the anniversary (e.g. 06/04/2023 -> 05/04/2028)
  d.setUTCDate(d.getUTCDate() - 1);
  return toIsoDate(d);
}

export async function getRegistrationCertificateData(
  registrationId: string
): Promise<RegistrationCertificateResult> {
  const { data: reg, error } = await supabaseAdmin
    .from("student_registrations")
    .select(
      "enrollment_no, candidate_name, father_name, dob, course, photo_url, status, address, district, state, pincode, academic_session, created_at, colleges(college_name)"
    )
    .eq("id", registrationId)
    .single();

  if (error || !reg) {
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

  const college = reg.colleges as unknown as { college_name?: string } | null;

  const address = [reg.address, reg.district, reg.state, reg.pincode]
    .map((p) => (typeof p === "string" ? p.trim() : ""))
    .filter(Boolean)
    .join(", ");

  const registrationDate = reg.created_at
    ? toIsoDate(new Date(reg.created_at))
    : toIsoDate(new Date());

  return {
    data: {
      certificate_no: `IPBI/REG/${enrollmentNo}`,
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
      generated_at: new Date().toISOString(),
    },
    error: null,
  };
}
