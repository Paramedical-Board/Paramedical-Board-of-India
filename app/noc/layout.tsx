import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "No Objection Certificate (NOC) Download",
  description:
    "Download your No Objection Certificate (NOC) issued by the Indian Paramedical Board of India using your enrollment number and date of birth.",
  alternates: { canonical: "/noc" },
};

export default function NocRouteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
