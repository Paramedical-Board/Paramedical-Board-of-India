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

export const regNoFromSuffix = (suffix: string) => `${REG_PREFIX}${suffix}`;
export const nocNoFromSuffix = (suffix: string) => `${NOC_PREFIX}${suffix}`;

/** Calendar date (YYYY-MM-DD) of an instant in Indian Standard Time. Today's date when omitted. */
export function istDate(iso?: string | null): string {
  const d = iso ? new Date(iso) : new Date();
  const safe = Number.isNaN(d.getTime()) ? new Date() : d;
  // en-CA formats as YYYY-MM-DD
  return safe.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}
