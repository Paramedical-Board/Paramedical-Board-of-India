"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface CourseOption {
  id: string;
  code: string;
  title: string;
  course_type: "diploma" | "certificate";
  is_two_year: boolean;
  /** Canonical dropdown label: "Title (Code)" — matches registrationSchema strings */
  label: string;
}

interface CourseSelectorDropdownProps {
  value: string;
  onChange: (course: string) => void;
  placeholder?: string;
  hasError?: boolean;
  errorMessage?: string;
  id?: string;
  className?: string;
  buttonClassName?: string;
  helperText?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CourseSelectorDropdown({
  value,
  onChange,
  placeholder = "-- Select Desired Course / पाठ्यक्रम चुनें --",
  hasError = false,
  errorMessage,
  id,
  className = "",
  buttonClassName = "",
  helperText,
}: CourseSelectorDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "diploma" | "certificate">("all");
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [fetchError, setFetchError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ── Fetch courses from DB once ───────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/courses")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.courses) {
          const mapped: CourseOption[] = data.courses.map((c: {
            id: string;
            code: string;
            title: string;
            course_type: "diploma" | "certificate";
            is_two_year: boolean;
          }) => ({
            id: c.id,
            code: c.code,
            title: c.title,
            course_type: c.course_type,
            is_two_year: c.is_two_year,
            // canonical label matches registrationSchema.ts strings exactly
            label: `${c.title} (${c.code})`,
          }));
          setCourses(mapped);
        }
      })
      .catch(() => {
        if (!cancelled) setFetchError(true);
      });
    return () => { cancelled = true; };
  }, []);

  // ── Close on outside click / Escape ─────────────────────────────────────
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      if (typeof window !== "undefined" && window.innerWidth >= 640) {
        setTimeout(() => { searchInputRef.current?.focus(); }, 50);
      }
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // ── Derived lists ────────────────────────────────────────────────────────
  const diplomaCourses = useMemo(
    () => courses.filter((c) => c.course_type === "diploma"),
    [courses]
  );
  const certificateCourses = useMemo(
    () => courses.filter((c) => c.course_type === "certificate"),
    [courses]
  );

  const filteredDiploma = useMemo(() => {
    if (activeTab === "certificate") return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return diplomaCourses;
    return diplomaCourses.filter(
      (c) => c.label.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [activeTab, searchQuery, diplomaCourses]);

  const filteredCertificate = useMemo(() => {
    if (activeTab === "diploma") return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return certificateCourses;
    return certificateCourses.filter(
      (c) => c.label.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [activeTab, searchQuery, certificateCourses]);

  const totalFiltered = filteredDiploma.length + filteredCertificate.length;

  // ── Selected course info ─────────────────────────────────────────────────
  const selectedCourse = useMemo(
    () => courses.find((c) => c.label === value) ?? null,
    [courses, value]
  );
  const isSelectedTwoYear = selectedCourse?.is_two_year ?? false;

  const handleSelect = (label: string) => {
    onChange(label);
    setIsOpen(false);
    setSearchQuery("");
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-white border rounded-md text-left transition-all cursor-pointer select-none ${
          hasError
            ? "border-[#B13B1C] ring-1 ring-[#B13B1C]/30"
            : isOpen
            ? "border-[#143E66] ring-2 ring-[#143E66]/20 shadow-xs"
            : "border-slate-300 hover:border-slate-400"
        } ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {value ? (
            <>
              <span className="text-xs sm:text-sm font-semibold text-slate-900 truncate" title={value}>
                {value}
              </span>
              <span
                className={`text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                  isSelectedTwoYear
                    ? "bg-amber-50 text-amber-800 border border-amber-200"
                    : "bg-blue-50 text-[#143E66] border border-blue-200"
                }`}
              >
                {isSelectedTwoYear ? "2 Yrs" : "1 Yr"}
              </span>
            </>
          ) : (
            <span className="text-xs sm:text-sm text-slate-400 font-normal truncate">
              {placeholder}
            </span>
          )}
        </div>

        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#143E66]" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Helper / Error Text */}
      {hasError && errorMessage && (
        <p className="text-xs text-[#B13B1C] font-medium mt-1">{errorMessage}</p>
      )}
      {!hasError && helperText && (
        <p className="text-[11px] text-slate-500 mt-1">{helperText}</p>
      )}

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-[999] bg-white border border-slate-200 rounded-xl shadow-2xl p-2.5 sm:p-3 animate-in fade-in slide-in-from-top-1 duration-150 max-w-full">
          {/* Search */}
          <div className="relative mb-2">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses (e.g. CMLT, DOTT, 521)..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#143E66]/20 focus:border-[#143E66]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Tab Pills */}
          <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-slate-100 overflow-x-auto text-xs no-scrollbar select-none">
            {(
              [
                { key: "all", label: `All (${courses.length})` },
                { key: "diploma", label: `Diploma (${diplomaCourses.length})` },
                { key: "certificate", label: `Certificate (${certificateCourses.length})` },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === key
                    ? "bg-[#143E66] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Fetch error state */}
          {fetchError && (
            <div className="py-6 text-center text-red-500 text-xs font-semibold">
              Failed to load courses. Please refresh.
            </div>
          )}

          {/* Loading state */}
          {!fetchError && courses.length === 0 && (
            <div className="py-6 text-center">
              <div className="w-5 h-5 border-2 border-[#143E66] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Loading courses...</p>
            </div>
          )}

          {/* Course Options */}
          {courses.length > 0 && (
            <div className="max-h-56 sm:max-h-72 overflow-y-auto space-y-2 pr-1 text-xs sm:text-sm overscroll-contain">
              {totalFiltered === 0 ? (
                <div className="py-6 text-center text-slate-500">
                  <p className="text-xs">No courses match &quot;{searchQuery}&quot;</p>
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(""); setActiveTab("all"); }}
                    className="mt-2 text-xs text-[#143E66] font-bold hover:underline cursor-pointer"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <>
                  {/* Diploma Group */}
                  {filteredDiploma.length > 0 && (
                    <div>
                      <div className="px-2 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 rounded mb-1 flex items-center justify-between">
                        <span>Diploma Courses / डिप्लोमा पाठ्यक्रम</span>
                        <span className="text-[10px] font-semibold text-slate-400">{filteredDiploma.length}</span>
                      </div>
                      <div className="space-y-1">
                        {filteredDiploma.map((course) => {
                          const isSelected = value === course.label;
                          return (
                            <button
                              key={course.id}
                              type="button"
                              onClick={() => handleSelect(course.label)}
                              className={`w-full text-left px-3 py-2.5 sm:py-2 rounded-lg flex items-start sm:items-center justify-between gap-2.5 transition-colors cursor-pointer active:bg-slate-200 ${
                                isSelected
                                  ? "bg-blue-50 text-[#143E66] font-bold ring-1 ring-[#143E66]/20"
                                  : "text-slate-800 hover:bg-slate-100 font-medium"
                              }`}
                            >
                              <span className="flex-1 text-xs sm:text-sm leading-snug break-words">
                                {course.label}
                              </span>
                              <div className="flex items-center gap-1.5 shrink-0 mt-0.5 sm:mt-0">
                                <span
                                  className={`text-[9.5px] sm:text-[10px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap ${
                                    course.is_two_year
                                      ? "bg-amber-100/70 text-amber-800 border border-amber-200/60"
                                      : "bg-slate-100 text-slate-600 border border-slate-200/60"
                                  }`}
                                >
                                  {course.is_two_year ? "2 Yrs" : "1 Yr"}
                                </span>
                                {isSelected && (
                                  <svg className="w-4 h-4 text-[#143E66] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Certificate Group */}
                  {filteredCertificate.length > 0 && (
                    <div>
                      <div className="px-2 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 rounded mb-1 flex items-center justify-between">
                        <span>Certificate Courses / सर्टिफिकेट पाठ्यक्रम</span>
                        <span className="text-[10px] font-semibold text-slate-400">{filteredCertificate.length}</span>
                      </div>
                      <div className="space-y-1">
                        {filteredCertificate.map((course) => {
                          const isSelected = value === course.label;
                          return (
                            <button
                              key={course.id}
                              type="button"
                              onClick={() => handleSelect(course.label)}
                              className={`w-full text-left px-3 py-2.5 sm:py-2 rounded-lg flex items-start sm:items-center justify-between gap-2.5 transition-colors cursor-pointer active:bg-slate-200 ${
                                isSelected
                                  ? "bg-blue-50 text-[#143E66] font-bold ring-1 ring-[#143E66]/20"
                                  : "text-slate-800 hover:bg-slate-100 font-medium"
                              }`}
                            >
                              <span className="flex-1 text-xs sm:text-sm leading-snug break-words">
                                {course.label}
                              </span>
                              <div className="flex items-center gap-1.5 shrink-0 mt-0.5 sm:mt-0">
                                <span
                                  className={`text-[9.5px] sm:text-[10px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap ${
                                    course.is_two_year
                                      ? "bg-amber-100/70 text-amber-800 border border-amber-200/60"
                                      : "bg-slate-100 text-slate-600 border border-slate-200/60"
                                  }`}
                                >
                                  {course.is_two_year ? "2 Yrs" : "1 Yr"}
                                </span>
                                {isSelected && (
                                  <svg className="w-4 h-4 text-[#143E66] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
