import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getCareerBySlug, getAllCareerSlugs } from "@/data/careersData";
import CareerDetailClient from "./CareerDetailClient";

interface CareerPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: CareerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const career = getCareerBySlug(slug);

  if (!career) {
    return {
      title: "Career Not Found | Indian Paramedical Board of India",
      description: "The requested paramedical specialization could not be found.",
    };
  }

  return {
    title: `${career.en.title} | Career Guide | Indian Paramedical Board of India`,
    description: `${career.en.tagline} Discover job roles, eligibility, starting salary, career progression, and accredited courses.`,
    keywords: [
      career.en.title,
      career.hi.title,
      "Paramedical Career",
      "Allied Health Science",
      "Paramedical Board of India",
      "Paramedical Diploma",
    ],
  };
}

export async function generateStaticParams() {
  return getAllCareerSlugs().map((slug) => ({
    slug,
  }));
}

export default async function CareerPage({ params }: CareerPageProps) {
  const { slug } = await params;
  const career = getCareerBySlug(slug);

  if (!career) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <CareerDetailClient career={career} />
      <Footer />
    </div>
  );
}
