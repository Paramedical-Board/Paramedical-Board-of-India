/** Fixed prefixes of the certificate numbers. The admin only types the part after the prefix. */
export const REG_PREFIX = "IPBI/REG/";
export const NOC_PREFIX = "IPBI/NOC/";

/** Letters, digits and / _ . - ; must start with a letter or digit; 1–30 characters. */
const SUFFIX_RE = /^[A-Za-z0-9][A-Za-z0-9/_.-]{0,29}$/;

/** Returns the trimmed suffix if valid, otherwise null. */
export function parseCertSuffix(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const s = input.trim();
  if (!SUFFIX_RE.test(s) || s.includes("//")) return null;
  return s;
}

/** Fixed prefix of every Affiliation No. The admin only types the part after it, e.g. "UP-2044". */
export const AFFIL_PREFIX = "IPBO-";
export const AFFIL_SUFFIX_MAX = 35;

/** Letters, digits, spaces and / _ . - ; must start with a letter or digit; 1–35 characters. */
const AFFIL_SUFFIX_RE = /^[A-Z0-9][A-Z0-9 /_.-]{0,34}$/;

/**
 * Builds the full Affiliation No. from what the admin typed after the fixed "IPBO-" prefix,
 * upper-cased. A pasted full number is accepted too: a leading "IPBO-" is dropped, never doubled.
 * Returns e.g. "IPBO-UP-2044", or null if invalid.
 */
export function parseAffilCertNo(input: unknown): string | null {
  if (typeof input !== "string") return null;
  let s = input.trim().replace(/\s+/g, " ").toUpperCase();
  if (s.startsWith(AFFIL_PREFIX)) s = s.slice(AFFIL_PREFIX.length).trim();
  if (!AFFIL_SUFFIX_RE.test(s) || s.includes("//")) return null;
  return AFFIL_PREFIX + s;
}

/** The editable part of a saved Affiliation No. (without the "IPBO-" prefix). */
export function affilSuffixOf(certNo: string | null | undefined): string {
  if (!certNo) return "";
  return certNo.toUpperCase().startsWith(AFFIL_PREFIX) ? certNo.slice(AFFIL_PREFIX.length) : certNo;
}

/** Max length of a person's name printed on a certificate (e.g. Director / Principal). */
export const PERSON_NAME_MAX = 80;
/** Letters (any script, incl. Hindi), digits, spaces and . , ' ( ) / - ; must start with a letter. */
const PERSON_NAME_RE = /^\p{L}[\p{L}\p{M}\p{N} .,'()/-]*$/u;

/**
 * Validates a person's name typed by the admin for a certificate.
 * Returns the trimmed name, "" when left blank (field cleared), or null when invalid.
 */
export function parsePersonName(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const s = input.trim().replace(/\s+/g, " ");
  if (s === "") return "";
  if (s.length > PERSON_NAME_MAX || !PERSON_NAME_RE.test(s)) return null;
  return s;
}

export const regNoFromSuffix = (suffix: string) => `${REG_PREFIX}${suffix}`;
export const nocNoFromSuffix = (suffix: string) => `${NOC_PREFIX}${suffix}`;

/** Calendar date (YYYY-MM-DD) of an instant in Indian Standard Time. Today's date when omitted. */
export function istDate(iso?: string | null): string {
  const d = iso ? new Date(iso) : new Date();
  const safe = Number.isNaN(d.getTime()) ? new Date() : d;
  // en-CA formats as YYYY-MM-DD
  return safe.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}
