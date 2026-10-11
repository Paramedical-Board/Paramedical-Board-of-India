import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import MaintenanceGuard from "@/components/common/MaintenanceGuard";
import { SITE_NAME, PRIMARY_DOMAIN, getSiteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const SITE_DESCRIPTION =
  "Indian Paramedical Board of India Official Portal. Empowering professionals, accrediting institutions, and ensuring the highest standards of paramedical care.";

const ALTERNATE_NAMES = ["IPMBOI", "IPBI", "Indian Paramedical Board"];

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = await getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    applicationName: SITE_NAME,
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: [SITE_NAME, ...ALTERNATE_NAMES],
    icons: {
      icon: [
        { url: "/favicon-32.png", sizes: "32x32" },
        { url: "/favicon-512.png", sizes: "512x512" },
      ],
      shortcut: "/favicon-32.png",
      apple: "/favicon-512.png",
    },
    openGraph: {
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: siteUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: "/favicon-512.png",
          width: 512,
          height: 512,
          alt: `${SITE_NAME} Logo`,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: ["/favicon-512.png"],
    },
  };
}

function buildJsonLd(siteUrl: string) {
  // The Board is one organization; its primary domain stays the Organization URL on every domain.
  const orgUrl = `https://www.${PRIMARY_DOMAIN}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": SITE_NAME,
        "alternateName": ALTERNATE_NAMES,
        "description": SITE_DESCRIPTION,
        "publisher": {
          "@id": `${orgUrl}/#organization`,
        },
      },
      {
        "@type": "Organization",
        "@id": `${orgUrl}/#organization`,
        "name": SITE_NAME,
        "alternateName": ALTERNATE_NAMES,
        "url": orgUrl,
        "logo": `${orgUrl}/favicon-512.png`,
        "sameAs": [],
      },
    ],
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = buildJsonLd(await getSiteUrl());

  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoDevanagari.variable} font-sans antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <MaintenanceGuard>
          {children}
        </MaintenanceGuard>
      </body>
    </html>
  );
}
