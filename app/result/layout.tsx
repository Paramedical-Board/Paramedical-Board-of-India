import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Result",
  description:
    "Check your examination result declared by the Indian Paramedical Board of India using your roll number and date of birth.",
  alternates: { canonical: "/result" },
};

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return children;
}
