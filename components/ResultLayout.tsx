import React from "react";
import { ResultData } from "@/lib/result-data";

function formatDisplayDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const trimmed = dateStr.trim();
  const parts = trimmed.split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
  }
  return trimmed;
}

interface ResultLayoutProps {
  result: ResultData;
  className?: string;
}

export default function ResultLayout({
  result,
  className = "",
}: ResultLayoutProps) {
  const overallPercentage =
    result.grand_total_max > 0
      ? (Math.round((result.grand_total_obtained / result.grand_total_max) * 10000) / 100).toFixed(2)
      : "0.00";

  return (
    <div
      className={`result-marksheet-page-wrapper w-[794px] max-w-full bg-white mx-auto p-7 sm:p-8 text-[#1e293b] border border-slate-300 shadow-md print:shadow-none print:border-none relative font-sans ${className}`}
      style={{
        boxSizing: "border-box",
      }}
    >
      {/* Print Stylesheet Hook */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 12mm;
          }
          body {
            background-color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .result-marksheet-page-wrapper {
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 8px 10px !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>

      {/* 1. Header with Board Logo & Titles */}
      <div className="flex items-center justify-between gap-3 pb-2 relative">
        {/* Left Circular Logo */}
        <div className="w-[74px] h-[74px] shrink-0 relative flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Indian Paramedical Board Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Center Board Titles */}
        <div className="flex-1 text-center px-2">
          <h1 className="text-[18.5px] sm:text-[19.5px] font-extrabold text-[#0b2545] tracking-wide uppercase leading-tight font-serif">
            INDIAN PARAMEDICAL BOARD OF INDIA
          </h1>
          <h2
            className="text-[13px] sm:text-[13.5px] font-bold text-[#8b0000] mt-0.5"
            style={{ fontFamily: "'Noto Sans Devanagari', 'Mangal', sans-serif" }}
          >
            इण्डियन पैरामेडिकल बोर्ड ऑफ़ इण्डिया
          </h2>
          <p className="text-[9.5px] sm:text-[10px] text-slate-700 font-semibold mt-0.5 leading-tight">
            (An Autonomous Organization Under Section-8 Indian Trust Act 2013)
          </p>
          <p className="text-[8.5px] sm:text-[9px] text-slate-600 font-medium leading-tight">
            (An ISO 9001:2015 Certified Council)
          </p>
        </div>

        {/* Right Spacer / Seal Placeholder for balance */}
        <div className="w-[74px] shrink-0 hidden sm:flex items-center justify-end">
          <div className="w-14 h-14 border border-slate-300 rounded-full flex flex-col items-center justify-center text-[7.5px] text-slate-400 font-bold uppercase text-center p-1 leading-tight">
            <span>OFFICIAL</span>
            <span>SEAL</span>
          </div>
        </div>
      </div>

      {/* Maroon Divider */}
      <div className="h-[2.5px] bg-[#8b0000] w-full my-2"></div>

      {/* 2. Statement of Marks Title Banner */}
      <div className="text-center my-2">
        <div className="inline-block px-6 py-1 bg-[#0b2545] text-white font-bold text-xs sm:text-sm tracking-wider uppercase rounded-xs">
          STATEMENT OF MARKS / अंक तालिका
        </div>
        <p className="text-[10.5px] sm:text-[11px] font-semibold text-slate-700 mt-1 uppercase tracking-wide">
          {result.session_label ? `SESSION: ${result.session_label.toUpperCase()}` : "EXAMINATION SESSION"}{" "}
          {result.exam_year_label ? `• ${result.exam_year_label.toUpperCase()}` : ""}
        </p>
      </div>

      {/* 3. Candidate & Examination Details Box */}
      <div className="border border-slate-300 rounded-md p-3 mb-3 bg-white">
        <div className="text-[11px] font-bold text-[#8b0000] uppercase tracking-wider mb-2">
          CANDIDATE &amp; EXAMINATION PARTICULARS
        </div>

        <div className="flex items-start justify-between gap-4">
          {/* Details Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] sm:text-[11.5px] leading-snug">
            {/* Candidate Name */}
            <div className="flex items-baseline">
              <span className="text-slate-600 font-medium min-w-[110px] shrink-0">Candidate Name</span>
              <span className="text-slate-600 font-semibold mr-1.5">:</span>
              <span className="text-[#0b2545] font-bold uppercase">{result.candidate_name || "—"}</span>
            </div>

            {/* Roll Number */}
            <div className="flex items-baseline">
              <span className="text-slate-600 font-medium min-w-[110px] shrink-0">Roll Number</span>
              <span className="text-slate-600 font-semibold mr-1.5">:</span>
              <span className="text-[#0b2545] font-bold font-mono tracking-wide">{result.roll_no || "—"}</span>
            </div>

            {/* Father's Name */}
            <div className="flex items-baseline">
              <span className="text-slate-600 font-medium min-w-[110px] shrink-0">Father&apos;s Name</span>
              <span className="text-slate-600 font-semibold mr-1.5">:</span>
              <span className="text-[#0b2545] font-bold uppercase">{result.father_name || "—"}</span>
            </div>

            {/* Registration No. */}
            <div className="flex items-baseline">
              <span className="text-slate-600 font-medium min-w-[110px] shrink-0">Registration No.</span>
              <span className="text-slate-600 font-semibold mr-1.5">:</span>
              <span className="text-[#0b2545] font-bold font-mono">{result.registration_no || "—"}</span>
            </div>

            {/* Mother's Name */}
            <div className="flex items-baseline">
              <span className="text-slate-600 font-medium min-w-[110px] shrink-0">Mother&apos;s Name</span>
              <span className="text-slate-600 font-semibold mr-1.5">:</span>
              <span className="text-[#0b2545] font-bold uppercase">{result.mother_name || "—"}</span>
            </div>

            {/* Date of Birth */}
            <div className="flex items-baseline">
              <span className="text-slate-600 font-medium min-w-[110px] shrink-0">Date of Birth</span>
              <span className="text-slate-600 font-semibold mr-1.5">:</span>
              <span className="text-[#0b2545] font-bold">{formatDisplayDate(result.dob)}</span>
            </div>

            {/* Course Name (Full width) */}
            <div className="flex items-baseline sm:col-span-2">
              <span className="text-slate-600 font-medium min-w-[110px] shrink-0">Course Name</span>
              <span className="text-slate-600 font-semibold mr-1.5">:</span>
              <span className="text-[#0b2545] font-bold uppercase">{result.course || "—"}</span>
            </div>

            {/* Center / Institution (Full width) */}
            <div className="flex items-baseline sm:col-span-2">
              <span className="text-slate-600 font-medium min-w-[110px] shrink-0">Institution / Centre</span>
              <span className="text-slate-600 font-semibold mr-1.5">:</span>
              <span className="text-[#0b2545] font-bold uppercase">{result.center_name || "—"}</span>
            </div>
          </div>

          {/* Photo Box */}
          <div className="w-[110px] h-[126px] shrink-0 border border-slate-400 rounded bg-[#f8fafc] overflow-hidden flex flex-col items-center justify-center p-1 text-center">
            {result.photo_url ? (
              <img
                src={result.photo_url}
                alt={result.candidate_name}
                className="w-full h-full object-cover rounded-xs"
              />
            ) : (
              <div className="w-full h-full border border-dashed border-slate-400 rounded-xs flex flex-col items-center justify-center p-1.5 text-slate-500">
                <svg
                  className="w-6 h-6 text-slate-400 mb-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                <span className="text-[8.5px] font-bold text-slate-700 uppercase leading-tight">
                  Candidate Photo
                </span>
                <span className="text-[7px] text-slate-400 font-medium mt-0.5">
                  (Passport Size)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Subject Marks Table */}
      <div className="border border-slate-300 rounded-xs overflow-hidden mb-3">
        <table className="w-full border-collapse text-[10.5px] sm:text-[11px] text-left">
          <thead>
            <tr className="bg-[#0b2545] text-white">
              <th className="py-2 px-2.5 font-bold border-r border-[#1e3a6a] w-[14%] text-center">
                CODE
              </th>
              <th className="py-2 px-3 font-bold border-r border-[#1e3a6a] w-[34%]">
                SUBJECT NAME
              </th>
              <th className="py-2 px-2 font-bold border-r border-[#1e3a6a] w-[10%] text-center">
                MAX
              </th>
              <th className="py-2 px-2 font-bold border-r border-[#1e3a6a] w-[9%] text-center">
                THEORY
              </th>
              <th className="py-2 px-2 font-bold border-r border-[#1e3a6a] w-[9%] text-center">
                PRACTICAL
              </th>
              <th className="py-2 px-2 font-bold border-r border-[#1e3a6a] w-[8%] text-center">
                CA
              </th>
              <th className="py-2 px-2 font-bold border-r border-[#1e3a6a] w-[8%] text-center">
                TOTAL
              </th>
              <th className="py-2 px-2 font-bold w-[8%] text-center">
                GRADE
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {result.subjects && result.subjects.length > 0 ? (
              result.subjects.map((subj, index) => {
                const isFail = subj.subject_result === "FAIL";
                return (
                  <tr
                    key={subj.subject_id || subj.subject_code || index}
                    className={index % 2 === 1 ? "bg-[#f8fafc]" : "bg-white"}
                  >
                    <td className="py-2 px-2 text-center font-mono font-bold text-[#0b2545] border-r border-slate-200">
                      {subj.subject_code}
                    </td>
                    <td className="py-2 px-3 font-bold text-slate-800 uppercase border-r border-slate-200">
                      {subj.subject_name}
                    </td>
                    <td className="py-2 px-2 text-center font-semibold text-slate-700 border-r border-slate-200">
                      {subj.total_max}
                    </td>
                    <td className="py-2 px-2 text-center font-mono text-slate-800 border-r border-slate-200">
                      {subj.theory_marks !== null ? subj.theory_marks : "—"}
                    </td>
                    <td className="py-2 px-2 text-center font-mono text-slate-800 border-r border-slate-200">
                      {subj.practical_marks !== null ? subj.practical_marks : "—"}
                    </td>
                    <td className="py-2 px-2 text-center font-mono text-slate-800 border-r border-slate-200">
                      {subj.ca_marks !== null ? subj.ca_marks : "—"}
                    </td>
                    <td
                      className={`py-2 px-2 text-center font-mono font-bold border-r border-slate-200 ${
                        isFail ? "text-red-700 bg-red-50" : "text-[#0b2545]"
                      }`}
                    >
                      {subj.total_marks !== null ? subj.total_marks : "—"}
                    </td>
                    <td
                      className={`py-2 px-2 text-center font-bold font-mono ${
                        isFail ? "text-red-700" : "text-emerald-700"
                      }`}
                    >
                      {subj.grade || "—"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-4 text-center text-slate-500 italic">
                  No subjects found
                </td>
              </tr>
            )}

            {/* Grand Total Row */}
            <tr className="bg-slate-100 font-bold border-t-2 border-slate-400 text-slate-900">
              <td colSpan={2} className="py-2.5 px-3 text-right uppercase tracking-wider border-r border-slate-300">
                Grand Total / कुल प्राप्तांक:
              </td>
              <td className="py-2.5 px-2 text-center border-r border-slate-300 font-bold">
                {result.grand_total_max}
              </td>
              <td colSpan={3} className="py-2.5 px-2 text-center border-r border-slate-300 text-slate-500 text-[10px]">
                {result.final_result === "INCOMPLETE" ? "Incomplete Marks Entry" : "Combined Total"}
              </td>
              <td className="py-2.5 px-2 text-center font-mono text-sm text-[#0b2545] font-extrabold border-r border-slate-300">
                {result.grand_total_obtained}
              </td>
              <td className="py-2.5 px-2 text-center font-bold text-xs">
                {result.final_result === "PASS" ? "PASS" : result.final_result === "FAIL" ? "FAIL" : "—"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 5. Summary & Result Box */}
      <div className="border border-slate-300 rounded-md p-3 mb-3 bg-[#fafafa] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-6 text-xs font-semibold text-slate-700">
          <div>
            <span>Total Marks: </span>
            <strong className="text-slate-900 font-mono text-sm">
              {result.grand_total_obtained} / {result.grand_total_max}
            </strong>
          </div>
          <div>
            <span>Percentage: </span>
            <strong className="text-slate-900 font-mono text-sm">
              {result.final_result === "INCOMPLETE" ? "—" : `${overallPercentage}%`}
            </strong>
          </div>
        </div>

        {/* Final Result Status Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-slate-600">Final Result:</span>
          {result.final_result === "PASS" ? (
            <span className="px-4 py-1.5 bg-emerald-100 border border-emerald-400 text-emerald-800 font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded">
              PASS / उत्तीर्ण ✓
            </span>
          ) : result.final_result === "FAIL" ? (
            <span className="px-4 py-1.5 bg-red-100 border border-red-400 text-red-800 font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded">
              FAIL / अनुत्तीर्ण ✕
            </span>
          ) : (
            <span className="px-4 py-1.5 bg-amber-100 border border-amber-400 text-amber-800 font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded">
              INCOMPLETE / अपूर्ण
            </span>
          )}
        </div>
      </div>

      {/* 6. Grading Criteria Legend */}
      <div className="border border-slate-200 rounded p-2 mb-3 bg-white text-[9px] text-slate-600">
        <div className="font-bold text-slate-700 uppercase mb-1">
          Grading Scale &amp; Passing Criteria:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 leading-tight">
          <div><strong>A+</strong>: 90% - 100% (Outstanding)</div>
          <div><strong>A</strong>: 80% - 89% (Excellent)</div>
          <div><strong>B+</strong>: 70% - 79% (Very Good)</div>
          <div><strong>B</strong>: 60% - 69% (Good)</div>
          <div><strong>C</strong>: 50% - 59% (Average)</div>
          <div><strong>D</strong>: 40% - 49% (Pass)</div>
          <div><strong>F</strong>: Below 40% (Fail)</div>
          <div className="text-slate-800 font-bold">Min. Pass Marks: 40% combined</div>
        </div>
      </div>

      {/* 7. Signatures & Controller Block */}
      <div className="flex items-end justify-between px-2 pt-4 pb-1 mt-2">
        {/* Tabulator / Prepared By */}
        <div className="text-center w-[160px]">
          <div className="h-[34px]"></div>
          <div className="border-t border-slate-400 pt-1">
            <span className="text-[10.5px] font-bold text-[#0b2545] block">
              Tabulator / Prepared By
            </span>
            <span className="text-[8.5px] text-slate-500 block">
              Examination Division
            </span>
          </div>
        </div>

        {/* Center Board Seal */}
        <div className="w-[120px] h-[50px] border border-dashed border-slate-400 rounded flex flex-col items-center justify-center bg-[#fafafa]">
          <span className="text-[9px] font-bold text-slate-700 uppercase">
            BOARD SEAL
          </span>
          <span className="text-[7.5px] text-slate-400">
            Stamp &amp; Verification
          </span>
        </div>

        {/* Controller of Examination */}
        <div className="text-center min-w-[190px]">
          <div className="h-[34px]"></div>
          <div className="border-t border-slate-400 pt-1">
            <span className="text-[10.5px] font-bold text-[#0b2545] block">
              Controller of Examination
            </span>
            <span className="text-[8.5px] text-slate-500 block whitespace-nowrap">
              Indian Paramedical Board of India
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
