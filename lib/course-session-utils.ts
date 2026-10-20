/**
 * Helper utilities for course durations and academic session resolution.
 *
 * isTwoYearCourse() now accepts an optional DB-sourced boolean so it no longer
 * relies on fragile keyword-matching. Pass `dbIsTwoYear` whenever you have the
 * courses row available (e.g. from /api/public/courses). The keyword fallback
 * is kept only for legacy call-sites that have not yet been migrated.
 */

// ── Legacy keyword-based lookup (kept for backward compat) ────────────────────
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

/**
 * Returns true if the given course is a 2-year course.
 *
 * Preferred usage: pass `dbIsTwoYear` (the `is_two_year` boolean from the DB)
 * and the function will return it directly without any string-matching.
 *
 * Fallback: when `dbIsTwoYear` is undefined (legacy call-sites), the old
 * keyword-matching logic is used so nothing breaks.
 */
export function isTwoYearCourse(
  courseName: string,
  dbIsTwoYear?: boolean
): boolean {
  // ① Preferred path — DB value available, use it directly
  if (typeof dbIsTwoYear === "boolean") return dbIsTwoYear;

  // ② Legacy fallback — keyword matching
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
    "dmlt",
    "dmlt-520",
  ];
  const lower = courseName.toLowerCase();
  if (twoYearKeywords.some((kw) => lower.includes(kw))) return true;
  return TWO_YEAR_COURSES.some(
    (c) => lower.includes(c.toLowerCase()) || c.toLowerCase().includes(lower)
  );
}

// ── Session option types & helpers ────────────────────────────────────────────

export interface CourseSessionOption {
  key: string;
  label: string;
  session_label: string;
  exam_year_label: string;
  academic_session: string;
  year_number: number;
}

export const DEFAULT_BASE_SESSIONS = [
  "2026-2027",
  "2025-2026",
  "2024-2025",
  "2023-2024",
  "2022-2023",
  "2021-2022",
  "2020-2021",
  "2019-2020",
  "2018-2019",
  "2017-2018",
];

export function getCourseSessionOptions(
  courseName: string,
  dbIsTwoYear?: boolean,
  extraSessions?: string[]
): CourseSessionOption[] {
  const is2Year = isTwoYearCourse(courseName, dbIsTwoYear);
  const combined = [...(extraSessions || []), ...DEFAULT_BASE_SESSIONS];
  
  // Deduplicate preserving trimmed strings
  const uniqueSessions: string[] = [];
  const seen = new Set<string>();
  for (const s of combined) {
    const trimmed = (s || "").trim();
    if (trimmed && !seen.has(trimmed)) {
      seen.add(trimmed);
      uniqueSessions.push(trimmed);
    }
  }

  // Sort sessions descending by start year
  uniqueSessions.sort((a, b) => {
    const startA = parseInt(a.split("-")[0], 10) || 0;
    const startB = parseInt(b.split("-")[0], 10) || 0;
    return startB - startA;
  });

  const options: CourseSessionOption[] = [];

  for (const session of uniqueSessions) {
    const parts = session.split("-");
    const startYear = parseInt(parts[0], 10);
    const endYear = parts.length > 1 ? parseInt(parts[1], 10) : startYear + 1;

    if (is2Year) {
      // 1st Year option
      options.push({
        key: `${session}_1`,
        label: `Batch ${session} — 1st Year (${session})`,
        session_label: `${session} (1st Year)`,
        exam_year_label: !isNaN(endYear) ? String(endYear) : session,
        academic_session: session,
        year_number: 1,
      });

      // 2nd Year option (e.g. batch 2023-2024 → 2nd year is 2024-2025)
      const secondYearStart = !isNaN(startYear) ? startYear + 1 : startYear;
      const secondYearEnd = !isNaN(endYear) ? endYear + 1 : endYear;
      const secondYearSession =
        !isNaN(startYear) && !isNaN(endYear)
          ? `${secondYearStart}-${secondYearEnd}`
          : `${session} (2nd Year)`;

      options.push({
        key: `${session}_2`,
        label: `Batch ${session} — 2nd Year (${secondYearSession})`,
        session_label: `${secondYearSession} (2nd Year)`,
        exam_year_label: !isNaN(secondYearEnd) ? String(secondYearEnd) : String(secondYearSession),
        academic_session: session,
        year_number: 2,
      });
    } else {
      options.push({
        key: `${session}_1`,
        label: `Session ${session} (1 Year)`,
        session_label: `${session} (1 Year)`,
        exam_year_label: !isNaN(endYear) ? String(endYear) : session,
        academic_session: session,
        year_number: 1,
      });
    }
  }

  return options;
}

export function getBatchAcademicSessionFromSessionLabel(
  sessionLabel?: string | null
): string | null {
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
