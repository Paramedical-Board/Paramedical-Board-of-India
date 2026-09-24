import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementRow from "@/components/announcements/AnnouncementRow";
import { getAnnouncementsPage } from "@/lib/announcements";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Announcements | Indian Paramedical Board of India",
  description:
    "Official notices, exam schedules, affiliation circulars, and updates from the Indian Paramedical Board of India.",
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AnnouncementsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const rawPage = parseInt(sp.page || "1", 10);
  const currentPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const pageSize = 10;

  const { announcements, total, totalPages } = await getAnnouncementsPage(
    currentPage,
    pageSize
  );

  // If page is beyond totalPages, redirect to last page
  if (totalPages > 0 && currentPage > totalPages) {
    redirect(`/announcements?page=${totalPages}`);
  }

  const from = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const to = Math.min(total, currentPage * pageSize);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      {/* Hero Banner Header */}
      <section className="w-full bg-gradient-to-r from-[#134275] via-[#0E345F] to-[#0A2545] text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-12 relative overflow-hidden border-b-4 border-[#D4AF37]">
        {/* Glow Accents */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

        <div className="max-w-[1280px] mx-auto relative z-10">
          {/* Breadcrumb Bar */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 mb-4">
            <Link
              href="/"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </Link>
            <span className="text-slate-500">/</span>
            <span className="text-[#E5C158] font-semibold">Announcements</span>
          </nav>

          {/* Banner Title & Metric Pill */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-[#F1E4C3] mb-3">
                <span className="w-2 h-2 rounded-full bg-[#E5C158] animate-pulse" />
                Official Board Notifications
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase text-white font-sans">
                Announcements / घोषणाएं
              </h1>
              <p className="text-sm sm:text-base text-slate-200 mt-2 max-w-2xl leading-relaxed">
                Stay updated with the latest circulars, examination notifications, admission guidelines, and administrative orders issued by the Board.
              </p>
            </div>

            {/* Total Metric Pill */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-5 py-3 rounded-2xl flex items-center gap-4 self-start md:self-auto">
              <div className="w-12 h-12 rounded-xl bg-[#E5C158] text-[#0A2545] flex items-center justify-center font-black text-xl shadow-md">
                {total}
              </div>
              <div>
                <div className="text-sm font-bold text-white">Notifications</div>
                <div className="text-xs text-slate-300">Published Notices</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Results Counter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 text-xs sm:text-sm text-slate-600">
          <div>
            {total > 0 ? (
              <span>
                Showing <strong className="text-[#143E66]">{from}–{to}</strong> of{" "}
                <strong className="text-[#143E66]">{total}</strong> announcements
              </span>
            ) : (
              <span>No announcements</span>
            )}
          </div>
          {totalPages > 1 && (
            <div className="text-xs font-semibold text-slate-500">
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>

        {/* List of Announcements */}
        {announcements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-8 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-xl mb-3">
              📢
            </div>
            <h2 className="text-base font-bold text-slate-800 mb-1">
              No Announcements Found
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No announcements at the moment. / अभी कोई घोषणा उपलब्ध नहीं है।
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <AnnouncementRow key={announcement.id} announcement={announcement} />
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <nav
            aria-label="Announcements Pagination"
            className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-2"
          >
            {/* Prev Button */}
            {currentPage > 1 ? (
              <Link
                href={`/announcements?page=${currentPage - 1}`}
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-[#143E66] transition-colors shadow-2xs inline-flex items-center gap-1"
              >
                <span>←</span>
                <span>Previous</span>
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed inline-flex items-center gap-1"
              >
                <span>←</span>
                <span>Previous</span>
              </span>
            )}

            {/* Page Number Links */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const isActive = p === currentPage;
                return (
                  <Link
                    key={p}
                    href={`/announcements?page=${p}`}
                    aria-current={isActive ? "page" : undefined}
                    className={`min-w-9 h-9 px-2 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-[#143E66] text-white shadow-xs"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
            </div>

            {/* Next Button */}
            {currentPage < totalPages ? (
              <Link
                href={`/announcements?page=${currentPage + 1}`}
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-[#143E66] transition-colors shadow-2xs inline-flex items-center gap-1"
              >
                <span>Next</span>
                <span>→</span>
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed inline-flex items-center gap-1"
              >
                <span>Next</span>
                <span>→</span>
              </span>
            )}
          </nav>
        )}
      </main>

      <Footer />
    </div>
  );
}
