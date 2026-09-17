import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.indianparamedicalboardofindia.com"),
  title: {
    default: "Indian Paramedical Board of India",
    template: "%s | Indian Paramedical Board of India",
  },
  description:
    "Indian Paramedical Board of India Official Portal. Empowering professionals, accrediting institutions, and ensuring the highest standards of paramedical care.",
  keywords: [
    "Indian Paramedical Board of India",
    "Indian Paramedical Board",
    "IPBI",
    "Paramedical Board of India",
    "Paramedical Council",
    "Paramedical Diploma",
    "Paramedical Certificate",
    "Paramedical Courses",
  ],
  icons: {
    icon: [
      { url: "/logo.png" },
      { url: "/icon.png" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Indian Paramedical Board of India",
    description:
      "Indian Paramedical Board of India Official Portal. Empowering professionals, accrediting institutions, and ensuring the highest standards of paramedical care.",
    url: "https://www.indianparamedicalboardofindia.com",
    siteName: "Indian Paramedical Board of India",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Indian Paramedical Board of India Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Indian Paramedical Board of India",
    description:
      "Indian Paramedical Board of India Official Portal. Empowering professionals, accrediting institutions, and ensuring the highest standards of paramedical care.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoDevanagari.variable} font-sans antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>{children}</body>
    </html>
  );
}
