"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  DIPLOMA_COURSES,
  CERTIFICATE_COURSES,
} from "@/components/student/registration/registrationSchema";
import { isTwoYearCourse } from "@/lib/course-session-utils";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      // Auto focus search input only on desktop (screen width >= 640px) to prevent mobile virtual keyboard popup
      if (typeof window !== "undefined" && window.innerWidth >= 640) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Filter courses based on tab and search query
  const filteredDiplomaCourses = useMemo(() => {
    if (activeTab === "certificate") return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return DIPLOMA_COURSES;
    return DIPLOMA_COURSES.filter((c) => c.toLowerCase().includes(q));
  }, [activeTab, searchQuery]);

  const filteredCertificateCourses = useMemo(() => {
    if (activeTab === "diploma") return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return CERTIFICATE_COURSES;
    return CERTIFICATE_COURSES.filter((c) => c.toLowerCase().includes(q));
  }, [activeTab, searchQuery]);

  const totalFilteredCount =
    filteredDiplomaCourses.length + filteredCertificateCourses.length;

  const handleSelect = (course: string) => {
    onChange(course);
    setIsOpen(false);
    setSearchQuery("");
  };

  const isSelectedTwoYear = value ? isTwoYearCourse(value) : false;

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

        {/* Chevron Icon */}
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

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-[999] bg-white border border-slate-200 rounded-xl shadow-2xl p-2.5 sm:p-3 animate-in fade-in slide-in-from-top-1 duration-150 max-w-full">
          {/* Search Box */}
          <div className="relative mb-2">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses (e.g. DMLT, COTT, 521)..."
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

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-slate-100 overflow-x-auto text-xs no-scrollbar select-none">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "all"
                  ? "bg-[#143E66] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All ({DIPLOMA_COURSES.length + CERTIFICATE_COURSES.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("diploma")}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "diploma"
                  ? "bg-[#143E66] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Diploma ({DIPLOMA_COURSES.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("certificate")}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "certificate"
                  ? "bg-[#143E66] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Certificate ({CERTIFICATE_COURSES.length})
            </button>
          </div>

          {/* Scrollable Course Options */}
          <div className="max-h-56 sm:max-h-72 overflow-y-auto space-y-2 pr-1 text-xs sm:text-sm overscroll-contain">
            {totalFilteredCount === 0 ? (
              <div className="py-6 text-center text-slate-500">
                <p className="text-xs">No courses match &quot;{searchQuery}&quot;</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveTab("all");
                  }}
                  className="mt-2 text-xs text-[#143E66] font-bold hover:underline cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <>
                {/* Diploma Group */}
                {filteredDiplomaCourses.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 rounded mb-1 flex items-center justify-between">
                      <span>Diploma Courses / डिप्लोमा पाठ्यक्रम</span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {filteredDiplomaCourses.length}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {filteredDiplomaCourses.map((course) => {
                        const isSelected = value === course;
                        const is2Yr = isTwoYearCourse(course);
                        return (
                          <button
                            key={course}
                            type="button"
                            onClick={() => handleSelect(course)}
                            className={`w-full text-left px-3 py-2.5 sm:py-2 rounded-lg flex items-start sm:items-center justify-between gap-2.5 transition-colors cursor-pointer active:bg-slate-200 ${
                              isSelected
                                ? "bg-blue-50 text-[#143E66] font-bold ring-1 ring-[#143E66]/20"
                                : "text-slate-800 hover:bg-slate-100 font-medium"
                            }`}
                          >
                            <span className="flex-1 text-xs sm:text-sm leading-snug break-words">{course}</span>
                            <div className="flex items-center gap-1.5 shrink-0 mt-0.5 sm:mt-0">
                              <span
                                className={`text-[9.5px] sm:text-[10px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap ${
                                  is2Yr
                                    ? "bg-amber-100/70 text-amber-800 border border-amber-200/60"
                                    : "bg-slate-100 text-slate-600 border border-slate-200/60"
                                }`}
                              >
                                {is2Yr ? "2 Yrs" : "1 Yr"}
                              </span>
                              {isSelected && (
                                <svg
                                  className="w-4 h-4 text-[#143E66] shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    d="M5 13l4 4L19 7"
                                  />
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
                {filteredCertificateCourses.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 rounded mb-1 flex items-center justify-between">
                      <span>Certificate Courses / सर्टिफिकेट पाठ्यक्रम</span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {filteredCertificateCourses.length}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {filteredCertificateCourses.map((course) => {
                        const isSelected = value === course;
                        const is2Yr = isTwoYearCourse(course);
                        return (
                          <button
                            key={course}
                            type="button"
                            onClick={() => handleSelect(course)}
                            className={`w-full text-left px-3 py-2.5 sm:py-2 rounded-lg flex items-start sm:items-center justify-between gap-2.5 transition-colors cursor-pointer active:bg-slate-200 ${
                              isSelected
                                ? "bg-blue-50 text-[#143E66] font-bold ring-1 ring-[#143E66]/20"
                                : "text-slate-800 hover:bg-slate-100 font-medium"
                            }`}
                          >
                            <span className="flex-1 text-xs sm:text-sm leading-snug break-words">{course}</span>
                            <div className="flex items-center gap-1.5 shrink-0 mt-0.5 sm:mt-0">
                              <span
                                className={`text-[9.5px] sm:text-[10px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap ${
                                  is2Yr
                                    ? "bg-amber-100/70 text-amber-800 border border-amber-200/60"
                                    : "bg-slate-100 text-slate-600 border border-slate-200/60"
                                }`}
                              >
                                {is2Yr ? "2 Yrs" : "1 Yr"}
                              </span>
                              {isSelected && (
                                <svg
                                  className="w-4 h-4 text-[#143E66] shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    d="M5 13l4 4L19 7"
                                  />
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
        </div>
      )}
    </div>
  );
}
