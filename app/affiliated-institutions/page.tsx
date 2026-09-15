"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export interface AffiliatedInstitution {
  id: string;
  centerCode: string;
  name: string;
  hindiName: string;
  district: string;
  state: string;
  address: string;
  affiliatedSince: string;
  status: "Active & Recognized" | "Verified Center";
  approvedPrograms: string[];
  contactPerson?: string;
  phone?: string;
}

export const AFFILIATED_INSTITUTIONS_DATA: AffiliatedInstitution[] = [
  {
    id: "ahptc-nanpara-bahraich",
    centerCode: "IPBI-UP-2041",
    name: "Ameer Hasan Paramedical Training Centre",
    hindiName: "अमीर हसन पैरामेडिकल ट्रेनिंग सेन्टर",
    district: "Bahraich",
    state: "Uttar Pradesh",
    address: "Nanpara, District Bahraich, Uttar Pradesh - 271865",
    affiliatedSince: "2024",
    status: "Active & Recognized",
    approvedPrograms: [
      "Medical Laboratory Technology (CMLT)",
      "Operation Theatre Technology (COTT)",
      "ECG Technician (CECG)",
      "General Duty Assistant (CGDA)",
      "Community Medical Services & Essential Drugs (CMS & ED)",
      "First Aid & Nursing (CFAN)",
    ],
    contactPerson: "Centre Administrator",
  },
  {
    id: "ahpc-jamunaha-shravasti",
    centerCode: "IPBI-UP-2042",
    name: "Aamir Hasan Paramedical College",
    hindiName: "आमिर हसन पैरामेडिकल कॉलेज",
    district: "Shravasti",
    state: "Uttar Pradesh",
    address: "Jamunaha, District Shravasti, Uttar Pradesh - 271831",
    affiliatedSince: "2024",
    status: "Active & Recognized",
    approvedPrograms: [
      "Medical Laboratory Technology (CMLT)",
      "Operation Theatre Technology (COTT)",
      "Dialysis Technician (CDT)",
      "Radiology & Imaging (CMRIT)",
      "Emergency Medical Technician (CEMT)",
      "Community Health (CCOMH)",
    ],
    contactPerson: "Principal / Director",
  },
];

export default function AffiliatedInstitutionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Distinct Filter Options
  const states = useMemo(() => {
    const list = Array.from(new Set(AFFILIATED_INSTITUTIONS_DATA.map((i) => i.state)));
    return ["All States", ...list];
  }, []);

  const districts = useMemo(() => {
    const list = Array.from(new Set(AFFILIATED_INSTITUTIONS_DATA.map((i) => i.district)));
    return ["All Districts", ...list];
  }, []);

  // Filter Logic
  const filteredInstitutions = useMemo(() => {
    return AFFILIATED_INSTITUTIONS_DATA.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hindiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.centerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesState = selectedState === "All States" || item.state === selectedState;
      const matchesDistrict = selectedDistrict === "All Districts" || item.district === selectedDistrict;

      return matchesSearch && matchesState && matchesDistrict;
    });
  }, [searchQuery, selectedState, selectedDistrict]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800 selection:bg-[#143E66] selection:text-white">
      {/* Universal Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1">
        
        {/* ======================================================== */}
        {/* HERO BANNER: Institutional Verification & Network         */}
        {/* ======================================================== */}
        <section className="bg-gradient-to-br from-[#143E66] via-[#103456] to-[#0A2545] rounded-2xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs font-bold text-[#E5C158] border border-white/15 mb-3.5 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              National Affiliation Registry • सम्बद्ध संस्थान सूची
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Affiliated Institutions &amp; Training Centres
            </h1>

            <p className="text-sm sm:text-base text-slate-200 mt-2.5 font-medium leading-relaxed">
              Official roster of paramedical colleges and authorized clinical study centres accredited by the Indian Paramedical Board of India for conducting certified paramedical education and practical training.
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 pt-5 border-t border-white/15 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-slate-200">
                <span className="w-2 h-2 rounded-full bg-[#E5C158]" />
                Authorized Examination Centers
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Verified Clinical Infrastructure
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="w-2 h-2 rounded-full bg-cyan-300" />
                Valid Academic Autonomy
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SEARCH, FILTER & VIEW CONTROLS                           */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by Institution Name, Center Code (e.g. IPBI-UP-2041), City or District..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:bg-white focus:border-[#143E66] focus:ring-2 focus:ring-[#143E66]/10 outline-none transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dropdown Filters & View Switcher */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* State Filter */}
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                aria-label="Filter by state"
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-700 focus:bg-white focus:border-[#143E66] outline-none transition-all cursor-pointer"
              >
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {/* District Filter */}
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                aria-label="Filter by district"
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-700 focus:bg-white focus:border-[#143E66] outline-none transition-all cursor-pointer"
              >
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    viewMode === "grid"
                      ? "bg-white text-[#143E66] shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Cards
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    viewMode === "table"
                      ? "bg-white text-[#143E66] shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Table
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Results Count Header */}
        <div className="flex items-center justify-between mb-6 text-xs sm:text-sm text-slate-600">
          <div>
            Showing <strong className="text-[#143E66]">{filteredInstitutions.length}</strong> of {AFFILIATED_INSTITUTIONS_DATA.length} Affiliated Institutions
          </div>
          {(searchQuery || selectedState !== "All States" || selectedDistrict !== "All Districts") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedState("All States");
                setSelectedDistrict("All Districts");
              }}
              className="text-[#8B1F13] font-bold hover:underline text-xs"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* ======================================================== */}
        {/* VIEW 1: GRID CARDS VIEW                                   */}
        {/* ======================================================== */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredInstitutions.map((inst) => (
              <div
                key={inst.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Top Blue Accent Strip */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#143E66] via-[#1E5285] to-[#2B6CB0]" />

                <div className="p-5 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header: Center Code & Status Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-black bg-[#143E66] text-white tracking-wide shadow-2xs">
                        Center Code: {inst.centerCode}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {inst.status}
                      </span>
                    </div>

                    {/* Institution Title (English) */}
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#143E66] leading-snug group-hover:text-[#0d2a45] transition-colors mb-1">
                      {inst.name}
                    </h2>

                    {/* Institution Title (Hindi) */}
                    <p className="text-sm font-semibold text-[#8B1F13] mb-4">
                      {inst.hindiName}
                    </p>

                    {/* Location Box */}
                    <div className="bg-[#F8FAFC] rounded-xl p-3.5 space-y-2 border border-slate-100 mb-4 text-xs">
                      <div className="flex items-start gap-2 text-slate-700">
                        <svg className="w-4 h-4 text-[#143E66] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <strong className="text-slate-900 block text-xs">Campus Address:</strong>
                          <span className="text-slate-600 leading-relaxed">{inst.address}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                        <div>
                          <span className="text-slate-400 block text-[10.5px]">District / State:</span>
                          <strong className="text-slate-800 font-semibold">{inst.district}, {inst.state}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10.5px]">Affiliated Since:</span>
                          <strong className="text-slate-800 font-semibold">{inst.affiliatedSince}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Approved Paramedical Programs */}
                    <div className="mb-4">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Approved Paramedical Certificate Programs:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {inst.approvedPrograms.map((prog, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200/60"
                          >
                            • {prog}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Verification Indicator */}
                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-[#143E66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Indian Paramedical Board Accredited
                    </span>
                    <span className="text-[10.5px] font-semibold text-[#143E66] bg-[#143E66]/10 px-2.5 py-1 rounded-md">
                      {inst.district}, UP
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: TABLE LIST MATRIX VIEW                            */}
        {/* ======================================================== */}
        {viewMode === "table" && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#143E66] text-white text-xs font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Center Code</th>
                    <th className="py-3.5 px-4">Institution Name &amp; Address</th>
                    <th className="py-3.5 px-4">District / State</th>
                    <th className="py-3.5 px-4">Approved Courses</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredInstitutions.map((inst, idx) => (
                    <tr
                      key={inst.id}
                      className={`hover:bg-[#F8FAFC] transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                      }`}
                    >
                      {/* Code */}
                      <td className="py-3.5 px-4 font-black text-[#143E66] whitespace-nowrap">
                        <span className="bg-[#143E66]/10 px-2.5 py-1 rounded text-xs">
                          {inst.centerCode}
                        </span>
                      </td>

                      {/* Institution Name */}
                      <td className="py-3.5 px-4 max-w-[320px]">
                        <div className="font-bold text-slate-900 text-sm">{inst.name}</div>
                        <div className="text-xs text-[#8B1F13] font-medium mt-0.5">
                          {inst.hindiName}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          {inst.address}
                        </div>
                      </td>

                      {/* District & State */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded font-semibold text-[11px]">
                          {inst.district}, {inst.state}
                        </span>
                      </td>

                      {/* Approved Courses */}
                      <td className="py-3.5 px-4 text-slate-600 max-w-[280px]">
                        <div className="text-[11px] line-clamp-2" title={inst.approvedPrograms.join(", ")}>
                          {inst.approvedPrograms.join(", ")}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-semibold text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {inst.status}
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
        {filteredInstitutions.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-xl mb-3">
              🔍
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              No Affiliated Institutions Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              No institution matches your current search criteria. Try clearing the search query or filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedState("All States");
                setSelectedDistrict("All Districts");
              }}
              className="px-4 py-2 rounded-lg bg-[#143E66] text-white text-xs font-bold hover:bg-[#0d2a45] transition-colors"
            >
              Reset Search &amp; Filters
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* BOTTOM AFFILIATION INQUIRY CTA STRIP                     */}
        {/* ======================================================== */}
        <section className="mt-12 bg-gradient-to-r from-[#143E66] to-[#0E345F] rounded-2xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#E5C158] border border-white/15">
                Institutional Affiliation Portal
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                Seeking Affiliation with Indian Paramedical Board?
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                Colleges, hospitals, and educational trusts can apply for national recognition to conduct certified paramedical and healthcare training programs with standard curricula.
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
                href="/courses"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all text-center"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
