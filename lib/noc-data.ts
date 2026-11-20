import { supabaseAdmin } from "@/lib/supabase";
import { nocNoFromSuffix, regNoFromSuffix, istDate } from "@/lib/cert-number";

export interface NocData {
  serial_no: string; // IPBI/NOC/<same number as the registration certificate>
  registration_no: string; // IPBI/REG/<number set by admin>
  enrollment_no: string;
  candidate_name: string;
  salutation: string; // Mr. / Ms. / Mr./Ms.
  relation: string; // S/O / D/O / S/O, D/O
  father_name: string;
  course: string;
  institution_name: string;
  photo_url: string | null;
  registration_date: string; // YYYY-MM-DD (the day the admin issued the registration number)
  issue_date: string; // YYYY-MM-DD (today, IST)
}

export interface NocResult {
  data: NocData | null;
  error: string | null;
}

/**
 * The NOC is generated automatically for a student as soon as the admin has set a
 * registration number for them; it carries the same number with the NOC prefix.
 */
export async function getNocData(registrationId: string): Promise<NocResult> {
  const { data: reg, error } = await supabaseAdmin
    .from("student_registrations")
    .select(
      "enrollment_no, candidate_name, father_name, gender, course, photo_url, status, created_at, reg_cert_suffix, reg_cert_issued_at, colleges(college_name)"
    )
    .eq("id", registrationId)
    .single();

  if (error) {
    console.error("getNocData error:", error.message);
    return { data: null, error: "NOC is not available right now. Please try again later." };
  }
  if (!reg) {
    return { data: null, error: "Registration not found" };
  }

  if (reg.status !== "approved") {
    return { data: null, error: "Your registration has not been approved yet." };
  }

  const enrollmentNo = (reg as any).enrollment_no as string | null;
  if (!enrollmentNo) {
    return { data: null, error: "Enrollment number has not been allotted yet" };
  }

  const suffix = ((reg as any).reg_cert_suffix as string | null)?.trim();
  if (!suffix) {
    return {
      data: null,
      error: "Your NOC has not been issued yet. Please contact your college or the Board.",
    };
  }

  const gender = String((reg as any).gender ?? "").trim().toLowerCase();
  const isFemale = gender.startsWith("f");
  const isMale = gender.startsWith("m");

  const college = reg.colleges as unknown as { college_name?: string } | null;

  return {
    data: {
      serial_no: nocNoFromSuffix(suffix),
      registration_no: regNoFromSuffix(suffix),
      enrollment_no: enrollmentNo,
      candidate_name: reg.candidate_name,
      salutation: isFemale ? "Ms." : isMale ? "Mr." : "Mr./Ms.",
      relation: isFemale ? "D/O" : isMale ? "S/O" : "S/O, D/O",
      father_name: reg.father_name,
      course: reg.course,
      institution_name: college?.college_name || "—",
      photo_url: reg.photo_url,
      registration_date: istDate((reg as any).reg_cert_issued_at ?? reg.created_at),
      issue_date: istDate(),
    },
    error: null,
  };
}
