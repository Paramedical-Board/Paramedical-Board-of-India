/**
 * Helper utilities for course durations and academic session resolution
 */

export const TWO_YEAR_COURSES = [
  "Certificate in Medical Laboratory Technology (CMLT)",
  "Certificate in Operation Theatre Technology (COTT)",
  "Certificate in Medical Radiology & Imaging Technology (CMRIT)",
  "Community Medical Services & Essential Drugs (CMS & ED)",
  "Certificate in Dental Technician & Hygienist (CDTH)",
  "Certificate in Multipurpose Health Worker (CMHW)",
  // 2-Year Diploma Courses
  "Diploma in Dental Health Worker (PCC-523)",
  "Diploma in Veterinary Assistant (PCC-524)",
  "Diploma in Ayurvedic Pharmacy (PCC-526)",
  "D.N.A (Diploma in Nursing Assistant) (PCC-527)",
  "DVP (Diploma in veterinary Pharmacy) (PCC-528)",
  "Diploma in First Aid in Emergency (PCC-530)",
  "Diploma in Radiology Imaging Technology (DRIT) (PCC-531)",
  "Diploma in Operation Theater Technician- DOTT (PCC-533)",
];

export function isTwoYearCourse(courseName: string): boolean {
  if (!courseName) return false;
  const twoYearKeywords = [
    "cmlt",
    "cott",
    "cmrit",
    "cms & ed",
    "cdth",
    "cmhw",
    "pcc-523",
    "pcc-524",
    "pcc-526",
    "pcc-527",
    "pcc-528",
    "pcc-530",
    "pcc-531",
    "pcc-533",
  ];
  const lower = courseName.toLowerCase();
  if (twoYearKeywords.some((kw) => lower.includes(kw))) {
    return true;
  }
  return TWO_YEAR_COURSES.some((c) =>
    lower.includes(c.toLowerCase()) || c.toLowerCase().includes(lower)
  );
}

export interface CourseSessionOption {
  key: string;
  label: string;
  session_label: string;
  exam_year_label: string;
  academic_session: string;
  year_number: number;
}

export function getCourseSessionOptions(courseName: string): CourseSessionOption[] {
  const is2Year = isTwoYearCourse(courseName);
  const baseSessions = ["2026-2027", "2025-2026", "2024-2025", "2023-2024", "2022-2023"];
  const options: CourseSessionOption[] = [];

  for (const session of baseSessions) {
    const startYear = parseInt(session.split("-")[0], 10);
    const endYear = parseInt(session.split("-")[1], 10);

    if (is2Year) {
      // 1st Year option
      options.push({
        key: `${session}_1`,
        label: `Batch ${session} — 1st Year (${session})`,
        session_label: `${session} (1st Year)`,
        exam_year_label: String(endYear),
        academic_session: session,
        year_number: 1,
      });

      // 2nd Year option (e.g. for batch 2023-2024, 2nd year is 2024-2025)
      const secondYearStart = startYear + 1;
      const secondYearEnd = endYear + 1;
      const secondYearSession = `${secondYearStart}-${secondYearEnd}`;
      options.push({
        key: `${session}_2`,
        label: `Batch ${session} — 2nd Year (${secondYearSession})`,
        session_label: `${secondYearSession} (2nd Year)`,
        exam_year_label: String(secondYearEnd),
        academic_session: session,
        year_number: 2,
      });
    } else {
      // 1 Year course option
      options.push({
        key: `${session}_1`,
        label: `Session ${session} (1 Year)`,
        session_label: `${session} (1 Year)`,
        exam_year_label: String(endYear),
        academic_session: session,
        year_number: 1,
      });
    }
  }

  return options;
}

export function getBatchAcademicSessionFromSessionLabel(sessionLabel?: string | null): string | null {
  if (!sessionLabel) return null;
  const match = sessionLabel.match(/(\d{4})-(\d{4})/);
  if (!match) return null;
  const startYear = parseInt(match[1], 10);
  const endYear = parseInt(match[2], 10);

  if (sessionLabel.includes("2nd Year")) {
    return `${startYear - 1}-${endYear - 1}`;
  }
  return `${startYear}-${endYear}`;
}
