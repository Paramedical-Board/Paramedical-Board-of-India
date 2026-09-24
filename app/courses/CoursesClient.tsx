"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CourseItem {
  id: string;
  code: string;
  title: string;
  hindiTitle: string;
  courseType: "diploma" | "certificate";
  category: string;
  duration: string;
  isTwoYear: boolean;
  eligibility: string;
  mode: string;
  description: string;
  careerScope: string[];
  isFeatured?: boolean;
  displayOrder: number;
}

const CATEGORIES = [
  "Diagnostics & Lab",
  "Radiology & Imaging",
  "Clinical & OT Care",
  "Community & Primary Health",
  "Specialized Care",
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function CoursesClient({ courses }: { courses: CourseItem[] }) {
  const [activeTab, setActiveTab] = useState<"certificate" | "diploma">("certificate");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Certificate Courses");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const certificateCourses = useMemo(
    () => courses.filter((c) => c.courseType === "certificate"),
    [courses]
  );
  const diplomaCourses = useMemo(
    () => courses.filter((c) => c.courseType === "diploma"),
    [courses]
  );

  const currentDataset = activeTab === "certificate" ? certificateCourses : diplomaCourses;
  const allCategoryLabel =
    activeTab === "certificate" ? "All Certificate Courses" : "All Diploma Courses";

  const categories = useMemo(() => {
    const fromDataset = Array.from(
      new Set(currentDataset.map((c) => c.category).filter(Boolean))
    );
    const combined = Array.from(new Set([...CATEGORIES, ...fromDataset]));
    return [allCategoryLabel, ...combined];
  }, [allCategoryLabel, currentDataset]);

  const featuredCertificate = useMemo(
    () => certificateCourses.find((c) => c.isFeatured) ?? certificateCourses[0] ?? null,
    [certificateCourses]
  );
  const featuredDiploma = useMemo(
    () => diplomaCourses.find((c) => c.isFeatured) ?? diplomaCourses[0] ?? null,
    [diplomaCourses]
  );

  const handleTabChange = (tab: "certificate" | "diploma") => {
    setActiveTab(tab);
    setSelectedCategory(tab === "certificate" ? "All Certificate Courses" : "All Diploma Courses");
    setSearchQuery("");
  };

  const filteredCourses = useMemo(() => {
    return currentDataset.filter((course) => {
      const matchesCategory =
        selectedCategory === allCategoryLabel || course.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        course.title.toLowerCase().includes(q) ||
        course.code.toLowerCase().includes(q) ||
        course.hindiTitle.toLowerCase().includes(q) ||
        course.eligibility.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [currentDataset, selectedCategory, allCategoryLabel, searchQuery]);

  const featured = activeTab === "certificate" ? featuredCertificate : featuredDiploma;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Header Navigation */}
      <Navbar />

      {/* Hero Banner */}
      <section className="w-full bg-gradient-to-r from-[#134275] via-[#0E345F] to-[#0A2545] text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-12 relative overflow-hidden border-b-4 border-[#D4AF37]">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

        <div className="max-w-[1280px] mx-auto relative z-10">
          {/* Tab Switcher */}
          <div className="sm:absolute sm:top-0 sm:right-0 mb-4 sm:mb-0 flex justify-end z-20">
            <div className="inline-flex p-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xs">
              <button
                type="button"
                onClick={() => handleTabChange("certificate")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all duration-200 cursor-pointer ${
                  activeTab === "certificate"
                    ? "bg-white text-[#0A2545] shadow-sm font-black"
                    : "text-slate-200 hover:text-white hover:bg-white/10"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Certificate</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${activeTab === "certificate" ? "bg-[#0A2545]/10 text-[#0A2545]" : "bg-white/15 text-slate-200"}`}>
                  {certificateCourses.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("diploma")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all duration-200 cursor-pointer ${
                  activeTab === "diploma"
                    ? "bg-white text-[#0A2545] shadow-sm font-black"
                    : "text-slate-200 hover:text-white hover:bg-white/10"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
                <span>Diploma</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${activeTab === "diploma" ? "bg-[#0A2545]/10 text-[#0A2545]" : "bg-white/15 text-slate-200"}`}>
                  {diplomaCourses.length}
                </span>
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 mb-4">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <span className="text-slate-500">/</span>
            <span className="text-[#E5C158] font-semibold">
              {activeTab === "certificate" ? "Certificate Courses" : "Diploma Courses"}
            </span>
          </nav>

          {/* Banner Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-[#F1E4C3] mb-3">
                <span className="w-2 h-2 rounded-full bg-[#E5C158] animate-pulse" />
                Industry-Recognized Programs
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase text-white font-sans">
                {activeTab === "certificate" ? "Certificate Courses" : "Diploma Courses"}
              </h1>
              <p className="text-sm sm:text-base text-slate-200 mt-2 max-w-2xl leading-relaxed">
                {activeTab === "certificate"
                  ? "Skill-based, job-oriented paramedical certificate programs standardized for hospital, diagnostic laboratory, and clinical careers across India."
                  : "Standardized 1-Year and 2-Year paramedical diploma programs designed for advanced diagnostic, clinical care, and specialized medical professions across India."}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-5 py-3 rounded-2xl flex items-center gap-4 self-start md:self-auto">
              <div className="w-12 h-12 rounded-xl bg-[#E5C158] text-[#0A2545] flex items-center justify-center font-black text-xl shadow-md">
                {currentDataset.length}
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  {activeTab === "certificate" ? "Certificate Programs" : "Diploma Programs"}
                </div>
                <div className="text-xs text-slate-300">Standardized Curricula</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* ── Featured Course Spotlight ── */}
        {featured && (
          <section className="bg-gradient-to-br from-[#143E66] via-[#103456] to-[#0A2545] rounded-2xl p-6 sm:p-8 lg:p-9 text-white shadow-md relative overflow-hidden mb-8">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 left-1/3 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
              <div className="flex-1 max-w-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-slate-200 border border-white/15">
                    Course Code: {featured.code}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-snug">
                  {featured.title}
                </h2>
                <p className="text-sm sm:text-base font-semibold text-[#F1E4C3] mt-1.5">
                  {featured.hindiTitle}
                </p>
                <p className="text-xs sm:text-sm text-slate-200 mt-3 leading-relaxed">
                  {featured.description}
                </p>
              </div>
              <div className="w-full lg:w-auto shrink-0 grid grid-cols-2 gap-3 min-w-[280px] sm:min-w-[320px]">
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3">
                  <span className="text-[11px] text-slate-300 block font-medium">Program Duration</span>
                  <strong className="text-sm font-bold text-[#E5C158]">{featured.duration}</strong>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3">
                  <span className="text-[11px] text-slate-300 block font-medium">Eligibility Criteria</span>
                  <strong className="text-sm font-bold text-white">{featured.eligibility}</strong>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3">
                  <span className="text-[11px] text-slate-300 block font-medium">Practice Scope</span>
                  <strong className="text-sm font-bold text-white">
                    {featured.careerScope[0] ?? "Hospitals & Clinics"}
                  </strong>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3">
                  <span className="text-[11px] text-slate-300 block font-medium">Accreditation</span>
                  <strong className="text-sm font-bold text-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    IPBI Certified
                  </strong>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Search & Filter Bar ── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === "certificate"
                    ? "Search certificate course by name or code (e.g. CMLT, Dialysis, ECG)..."
                    : "Search diploma course by name or code (e.g. DOTT, DRIT, 521)..."
                }
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#143E66]/20 focus:border-[#143E66] transition-all"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
            {/* View Toggle */}
            <div className="flex items-center gap-2 self-end lg:self-auto">
              <span className="text-xs font-semibold text-slate-500 mr-1">View:</span>
              {(["grid", "table"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    viewMode === mode
                      ? "bg-[#143E66] text-white border-[#143E66] shadow-2xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {mode === "grid" ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  )}
                  {mode === "grid" ? "Grid" : "Table"}
                </button>
              ))}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#143E66] text-white shadow-xs"
                    : "bg-[#F1F5F9] text-slate-700 hover:bg-slate-200/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6 text-xs sm:text-sm text-slate-600">
          <div>
            Showing <strong className="text-[#143E66]">{filteredCourses.length}</strong> of {currentDataset.length}{" "}
            {activeTab === "certificate" ? "Certificate Courses" : "Diploma Courses"}
          </div>
          {(searchQuery || selectedCategory !== allCategoryLabel) && (
            <button
              type="button"
              onClick={() => { setSearchQuery(""); setSelectedCategory(allCategoryLabel); }}
              className="text-[#8B1F13] font-bold hover:underline text-xs cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* ── Grid View ── */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="h-1.5 w-full bg-gradient-to-r from-[#143E66] via-[#1E5285] to-[#2B6CB0]" />
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-black bg-[#143E66] text-white tracking-wide shadow-2xs">
                        {course.code}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {course.category}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#143E66] leading-snug group-hover:text-[#0d2a45] transition-colors mb-1">
                      {course.title}
                    </h3>
                    <p className="text-xs font-medium text-[#8B1F13] mb-3.5">{course.hindiTitle}</p>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                      {course.description}
                    </p>
                    <div className="bg-[#F8FAFC] rounded-xl p-3 space-y-2 border border-slate-100 mb-4 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-[#143E66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Duration:
                        </span>
                        <strong className="text-slate-800">{course.duration}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-[#8B1F13]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                          </svg>
                          Eligibility:
                        </span>
                        <strong className="text-slate-800">{course.eligibility}</strong>
                      </div>
                    </div>
                    {course.careerScope.length > 0 && (
                      <div className="mb-4">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Work Areas / Career Scope:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {course.careerScope.map((scope, idx) => (
                            <span key={idx} className="text-[10.5px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                              • {scope}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      IPBI Certified
                    </span>
                    <span className="text-[10.5px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Affiliated Centers
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Table View ── */}
        {viewMode === "table" && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#143E66] text-white text-xs font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Code</th>
                    <th className="py-3.5 px-4">Course Name &amp; Specialization</th>
                    <th className="py-3.5 px-4">Duration</th>
                    <th className="py-3.5 px-4">Eligibility</th>
                    <th className="py-3.5 px-4">Career Scope</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredCourses.map((course, idx) => (
                    <tr
                      key={course.id}
                      className={`hover:bg-[#F8FAFC] transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}
                    >
                      <td className="py-3.5 px-4 font-black text-[#143E66] whitespace-nowrap">
                        <span className="bg-[#143E66]/10 px-2 py-1 rounded text-xs">{course.code}</span>
                      </td>
                      <td className="py-3.5 px-4 max-w-[280px]">
                        <div className="font-bold text-slate-900">{course.title}</div>
                        <div className="text-[11px] text-[#8B1F13] font-medium mt-0.5">{course.hindiTitle}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                        {course.duration}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="bg-amber-50 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded font-semibold text-[11px]">
                          {course.eligibility}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-[220px]">
                        <div className="truncate" title={course.careerScope.join(", ")}>
                          {course.careerScope.join(", ")}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-semibold text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          IPBI Certified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-xl mb-3">
              🔍
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              No {activeTab === "certificate" ? "Certificate" : "Diploma"} Courses Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              No courses match your current search or category filter.
            </p>
            <button
              type="button"
              onClick={() => { setSearchQuery(""); setSelectedCategory(allCategoryLabel); }}
              className="px-4 py-2 rounded-lg bg-[#143E66] text-white text-xs font-bold hover:bg-[#0d2a45] transition-colors cursor-pointer"
            >
              Reset Search &amp; Filters
            </button>
          </div>
        )}

        {/* ── Bottom CTA ── */}
        <section className="mt-12 bg-gradient-to-r from-[#143E66] to-[#0E345F] rounded-2xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#E5C158] border border-white/15">
                Institutional Paramedical Network
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                Want to Enroll in a Paramedical {activeTab === "certificate" ? "Certificate" : "Diploma"} Course?
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                Candidate admissions and enrollment registrations are processed directly through authorized affiliated institutions across India.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                href="/about-us"
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#c4a02e] text-[#00031D] font-black text-xs sm:text-sm transition-all shadow-md text-center inline-flex items-center justify-center"
              >
                Visit Us
              </Link>
              <Link
                href="/about-us"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all text-center"
              >
                Learn About Board
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
