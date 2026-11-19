import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registration Certificate Download",
  description:
    "Download your registration certificate (पंजीयन का प्रमाण-पत्र) issued by the Indian Paramedical Board of India using your enrollment number and date of birth.",
  alternates: { canonical: "/registration-certificate" },
};

export default function RegistrationCertificateRouteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
