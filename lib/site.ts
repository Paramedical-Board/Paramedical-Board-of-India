import { headers } from "next/headers";

export const SITE_NAME = "Indian Paramedical Board of India";
export const PRIMARY_DOMAIN = "indianparamedicalboardofindia.com";

// Every domain this deployment serves. Each one gets its own canonical URLs,
// sitemap.xml and robots.txt so search engines can index it under its own name.
const SITE_DOMAINS = [PRIMARY_DOMAIN, "ipmboi.com"];

/**
 * Returns the canonical origin (https://www.<domain>) for the current request.
 * Unknown hosts (localhost, *.vercel.app previews) fall back to the primary domain.
 */
export async function getSiteUrl(): Promise<string> {
  const headersList = await headers();
  const host = (headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "")
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "")
    .replace(/^www\./, "");

  const domain = SITE_DOMAINS.includes(host) ? host : PRIMARY_DOMAIN;
  return `https://www.${domain}`;
}
