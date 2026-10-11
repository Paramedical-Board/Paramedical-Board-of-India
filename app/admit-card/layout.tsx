import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admit Card Download",
  description:
    "Download your examination admit card issued by the Indian Paramedical Board of India using your registration number and date of birth.",
  alternates: { canonical: "/admit-card" },
};

export default function AdmitCardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
