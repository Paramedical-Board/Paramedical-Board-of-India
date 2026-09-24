import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getAnnouncementById } from "@/lib/announcements";
import { splitDate, isNewAnnouncement } from "@/lib/announcement-format";

export const dynamic = "force-dynamic";

interface DetailProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DetailProps): Promise<Metadata> {
  const { id } = await params;
  const item = await getAnnouncementById(id);
  if (!item) {
    return {
      title: "Announcement Not Found | Indian Paramedical Board of India",
    };
  }
  return {
    title: `${item.title_en} | Announcements | Indian Paramedical Board of India`,
    description: item.description_en || item.description_hi || undefined,
  };
}

export default async function AnnouncementDetailPage({ params }: DetailProps) {
  const { id } = await params;
  const item = await getAnnouncementById(id);

  if (!item) {
    notFound();
  }

  const { day, month, year } = splitDate(item.announcement_date);
  const isNew = isNewAnnouncement(item.announcement_date);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      {/* Hero / Header Band */}
      <section className="w-full bg-gradient-to-r from-[#134275] via-[#0E345F] to-[#0A2545] text-white py-6 sm:py-8 px-4 sm:px-6 lg:px-12 border-b-4 border-[#D4AF37]">
        <div className="max-w-[1000px] mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
              Home
            </Link>
            <span className="text-slate-500">/</span>
            <Link href="/announcements" className="hover:text-white transition-colors">
              Announcements
            </Link>
            <span className="text-slate-500">/</span>
            <span className="text-[#E5C158] font-semibold truncate max-w-[200px] sm:max-w-[360px]">
              {item.title_en}
            </span>
          </nav>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/announcements"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#143E66] hover:text-[#0b243d] transition-colors"
          >
            <span aria-hidden="true">←</span>
            <span>All Announcements / सभी घोषणाएं</span>
          </Link>
        </div>

        {/* Announcement Detail Card */}
        <article className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 md:p-10 overflow-hidden">
          {/* Top Meta Strip: Date Badge & NEW Pill */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#143E66] text-white flex items-center justify-center font-black text-sm shrink-0">
                📅
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Announcement Date / जारी तिथि
                </span>
                <time
                  dateTime={item.announcement_date}
                  className="text-xs sm:text-sm font-bold text-[#143E66]"
                >
                  {day} {month} {year}
                </time>
              </div>
            </div>

            {isNew && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#B13B1C] text-white shadow-xs">
                NEW NOTICE
              </span>
            )}
          </div>

          {/* Titles */}
          <div className="pt-6 pb-6 border-b border-slate-100 space-y-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#143E66] leading-snug tracking-tight">
              {item.title_en}
            </h1>
            {item.title_hi && (
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-700 leading-snug">
                {item.title_hi}
              </h2>
            )}
          </div>

          {/* Description Paragraphs (whitespace-pre-line) */}
          <div className="py-6 space-y-5 text-sm sm:text-base text-slate-700 leading-relaxed">
            {item.description_en && (
              <div className="whitespace-pre-line bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200/70">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  English Description / विवरण (अंग्रेज़ी)
                </h3>
                <p className="text-slate-800">{item.description_en}</p>
              </div>
            )}

            {item.description_hi && (
              <div className="whitespace-pre-line bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200/70">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Hindi Description / विवरण (हिंदी)
                </h3>
                <p className="text-slate-800 font-hindi">{item.description_hi}</p>
              </div>
            )}

            {!item.description_en && !item.description_hi && (
              <p className="text-slate-500 italic text-sm">
                No detailed description provided. Please refer to the official document or link below.
              </p>
            )}
          </div>

          {/* Action Buttons (PDF / Link) */}
          {(item.attachment_url || item.link_url) && (
            <div className="pt-6 mt-2 border-t border-slate-100 flex flex-wrap items-center gap-3">
              {item.attachment_url && (
                <a
                  href={item.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B1F13] hover:bg-[#70170d] text-white font-bold text-xs sm:text-sm transition-all shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7.414A2 2 0 0017.414 6L14 2.586A2 2 0 0012.586 2H4zm8 1.414L15.586 7H13a1 1 0 01-1-1V3.414zM6 9a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H7a1 1 0 01-1-1z" />
                  </svg>
                  <span>View / Download PDF</span>
                </a>
              )}

              {item.link_url && (
                <a
                  href={item.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#143E66] hover:bg-[#0f2e4d] text-white font-bold text-xs sm:text-sm transition-all shadow-xs"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <span>Open External Link</span>
                </a>
              )}
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
