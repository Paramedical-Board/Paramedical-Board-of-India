import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CAREERS_DATA } from "@/data/careersData";

export const metadata: Metadata = {
  title: "Paramedical Careers & Specializations | Indian Paramedical Board of India",
  description:
    "Explore high-demand healthcare careers and paramedical specializations with eligibility, job duties, salary expectations, and accredited board diplomas.",
};

export default function CareersIndexPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      {/* Hero Header */}
      <section className="w-full bg-gradient-to-r from-[#134275] via-[#0E345F] to-[#0A2545] text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-12 relative overflow-hidden border-b-4 border-[#D4AF37]">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="max-w-[1360px] mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-[#F1E4C3] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#E5C158] animate-pulse" />
            Paramedical Career Guidance
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase text-white font-sans">
            Paramedical Specializations
          </h1>
          <p className="text-sm sm:text-base text-slate-200 mt-2 max-w-2xl mx-auto leading-relaxed">
            पैरामेडिकल करियर मार्गदर्शिका — Choose a rewarding allied health career with high hospital demand, competitive starting salaries, and nationwide board recognition.
          </p>
        </div>
      </section>

      {/* Careers Grid */}
      <main className="max-w-[1360px] mx-auto py-10 sm:py-14 px-4 sm:px-6 lg:px-12 flex-grow w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CAREERS_DATA.map((career) => (
            <div
              key={career.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-[#134275]/40 transition-all duration-300 flex flex-col"
            >
              <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
                <Image
                  src={career.image}
                  alt={career.en.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#0A2545]/80 backdrop-blur-xs text-[#E5C158] text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border border-white/15">
                  {career.stats.durationEn}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#0A2545] group-hover:text-[#134275] transition-colors leading-snug">
                    {career.en.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {career.hi.title}
                  </p>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {career.en.tagline}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Salary: <strong className="text-slate-700">{career.stats.salaryEn.split("/")[0]}</strong></span>
                    <span className="text-emerald-600 font-semibold">High Demand</span>
                  </div>
                </div>

                <Link
                  href={`/careers/${career.slug}`}
                  className="mt-4 w-full py-2 rounded-xl bg-[#F0F5FA] hover:bg-[#134275] text-[#134275] hover:text-white font-bold text-xs uppercase tracking-wider transition-colors duration-150 text-center flex items-center justify-center gap-1"
                >
                  <span>Learn More / विवरण देखें</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
