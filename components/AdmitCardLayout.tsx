import React from "react";
import { AdmitCardData } from "@/lib/admit-card-data";

function formatDisplayDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const trimmed = dateStr.trim();
  // If YYYY-MM-DD format
  const parts = trimmed.split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
  }
  return trimmed;
}

interface AdmitCardLayoutProps {
  admitCard: AdmitCardData;
  className?: string;
}

export default function AdmitCardLayout({
  admitCard,
  className = "",
}: AdmitCardLayoutProps) {
  // Format center info
  const centerDisplay = [
    admitCard.center_name,
    admitCard.center_code ? `(Code: ${admitCard.center_code})` : null,
    admitCard.center_address,
    admitCard.center_city,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className={`admit-card-page-wrapper w-[794px] max-w-full bg-white mx-auto p-7 sm:p-9 text-[#1e293b] border border-slate-300 shadow-md print:shadow-none print:border-none relative font-sans ${className}`}
      style={{
        boxSizing: "border-box",
      }}
    >
      {/* Print Stylesheet Hook */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 14mm;
          }
          body {
            background-color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .admit-card-page-wrapper {
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 8px 12px !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>

      {/* 1. Header */}
      <div className="flex items-center justify-between gap-3 pb-2 relative">
        {/* Left Circular Logo */}
        <div className="w-[76px] h-[76px] shrink-0 relative flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Indian Paramedical Board Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Center Board Titles */}
        <div className="flex-1 text-center px-2">
          <h1 className="text-[19px] sm:text-[20px] font-extrabold text-[#0b2545] tracking-wide uppercase leading-tight font-serif">
            INDIAN PARAMEDICAL BOARD OF INDIA
          </h1>
          <h2
            className="text-[13.5px] sm:text-[14px] font-bold text-[#8b0000] mt-0.5"
            style={{ fontFamily: "'Noto Sans Devanagari', 'Mangal', sans-serif" }}
          >
            इण्डियन पैरामेडिकल बोर्ड ऑफ़ इण्डिया
          </h2>
          <p className="text-[10px] sm:text-[10.5px] text-slate-600 font-medium mt-0.5">
            An Autonomous Board Registered Under Govt. Act | Examination Division
          </p>
        </div>

        {/* Spacer to keep Title perfectly centered */}
        <div className="w-[76px] shrink-0 hidden sm:block"></div>
      </div>

      {/* Horizontal Maroon Divider */}
      <div className="h-[2.5px] bg-[#8b0000] w-full my-2"></div>

      {/* 2. Hall Ticket Title */}
      <div className="text-center font-bold text-[#0b2545] text-sm tracking-wider uppercase my-2.5">
        EXAMINATION HALL TICKET ({admitCard.session_label ? `SESSION ${admitCard.session_label.toUpperCase()}` : "EXAMINATION SESSION"})
      </div>

      {/* 3. Candidate & Examination Details Box */}
      <div className="border border-slate-300 rounded-md p-3 mb-3 bg-white">
        <div className="text-xs font-bold text-[#8b0000] uppercase tracking-wider mb-2.5">
          CANDIDATE & EXAMINATION DETAILS
        </div>

        <div className="flex items-start justify-between gap-4">
          {/* Details Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] sm:text-[11.5px] leading-snug">
            {/* Candidate Name */}
            <div className="flex items-baseline">
              <span className="text-slate-600 font-medium min-w-[110px] shrink-0">Candidate Name</span>
              <span className="text-slate-600 font-semibold mr-1.5">:</span>
              <span className="text-[#0b2545] font-bold uppercase">{admitCard.candidate_name}</span>
            </div>

            {/* Roll Number */}
            <div className="flex items-baseline">
              <span className="text-slate-600 font-medium min-w-[110px] shrink-0">Roll Number</span>
              <span className="text-slate-600 font-semibold mr-1.5">:</span>
              <span className="text-[#0b2545] font-bold font-mono tracking-wide">{admitCard.roll_no || "—"}</span>
            </div>

            {/* Father's Name */}
            <div className="flex items-baseline">
              <span className="text-slate-600 font-medium min-w-[110px] shrink-0">Father&apos;s Name</span>
              <span className="text-slate-600 font-semibold mr-1.5">:</span>
              <span className="text-[#0b2545] font-bold uppercase">{admitCard.father_name}</span>
            </div>

            {/* Registration No. */}
            <div className="flex items-baseline">
              <span className="text-slate-600 font-medium min-w-[110px] shrink-0">Registration No.</span>
              <span className="text-slate-600 font-semibold mr-1.5">:</span>
              <span className="text-[#0b2545] font-bold font-mono">{admitCard.registration_no}</span>
            </div>

            {/* Date of Birth */}
            <div className="flex items-baseline">
              <span className="text-slate-600 font-medium min-w-[110px] shrink-0">Date of Birth</span>
              <span className="text-slate-600 font-semibold mr-1.5">:</span>
              <span className="text-[#0b2545] font-bold">{formatDisplayDate(admitCard.dob)}</span>
            </div>

            {/* Exam Year / Session */}
            <div className="flex items-baseline">
              <span className="text-slate-600 font-medium min-w-[110px] shrink-0">Exam Year / Term</span>
              <span className="text-slate-600 font-semibold mr-1.5">:</span>
              <span className="text-[#0b2545] font-bold">{admitCard.exam_year_label || "—"}</span>
            </div>

            {/* Course Name (Full width) */}
            <div className="flex items-baseline sm:col-span-2">
              <span className="text-slate-600 font-medium min-w-[110px] shrink-0">Course Name</span>
              <span className="text-slate-600 font-semibold mr-1.5">:</span>
              <span className="text-[#0b2545] font-bold uppercase">{admitCard.course}</span>
            </div>

            {/* Exam Centre (Full width) */}
            <div className="flex items-baseline sm:col-span-2">
              <span className="text-slate-600 font-medium min-w-[110px] shrink-0">Exam Centre</span>
              <span className="text-slate-600 font-semibold mr-1.5">:</span>
              <span className="text-[#0b2545] font-bold uppercase">{centerDisplay || "—"}</span>
            </div>
          </div>

          {/* Photo Box */}
          <div className="w-[118px] h-[136px] shrink-0 border border-slate-400 rounded bg-[#f8fafc] overflow-hidden flex flex-col items-center justify-center p-1 text-center">
            {admitCard.photo_url ? (
              <img
                src={admitCard.photo_url}
                alt={admitCard.candidate_name}
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
                <span className="text-[9px] font-bold text-slate-700 uppercase leading-tight">
                  Affix / Upload Candidate Photo
                </span>
                <span className="text-[7.5px] text-slate-400 font-medium mt-0.5">
                  (Passport Size)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Exam Schedule Table */}
      <div className="border border-slate-300 rounded-xs overflow-hidden mb-3">
        <table className="w-full border-collapse text-[10.5px] sm:text-[11px] text-left">
          <thead>
            <tr className="bg-[#0b2545] text-white">
              <th className="py-1.5 px-2.5 font-bold text-center border-r border-[#1e3a6a] w-[8%]">
                S.NO.
              </th>
              <th className="py-1.5 px-3 font-bold border-r border-[#1e3a6a] w-[46%]">
                SUBJECT NAME
              </th>
              <th className="py-1.5 px-3 font-bold text-center border-r border-[#1e3a6a] w-[23%]">
                DATE OF EXAM
              </th>
              <th className="py-1.5 px-3 font-bold text-center w-[23%]">
                SHIFT / TIMING
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {admitCard.subjects && admitCard.subjects.length > 0 ? (
              admitCard.subjects.map((subj, index) => (
                <tr
                  key={subj.subject_code || index}
                  className={index % 2 === 1 ? "bg-[#f8fafc]" : "bg-white"}
                >
                  <td className="py-1.5 px-2.5 text-center font-semibold text-slate-700 border-r border-slate-200">
                    {index + 1}
                  </td>
                  <td className="py-1.5 px-3 font-bold text-[#0b2545] uppercase border-r border-slate-200">
                    {subj.subject_name}
                    {subj.subject_code ? ` (${subj.subject_code})` : ""}
                  </td>
                  <td className="py-1.5 px-3 text-center font-semibold text-slate-800 border-r border-slate-200 whitespace-nowrap">
                    {formatDisplayDate(subj.exam_date)}
                  </td>
                  <td className="py-1.5 px-3 text-center text-slate-700 font-medium">
                    {subj.exam_time || "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-3 text-center text-slate-500 italic">
                  No subjects scheduled
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 5. Instructions Card */}
      <div className="border border-slate-300 rounded-md p-2.5 sm:p-3 mb-4 bg-white">
        <div className="text-[11px] font-bold text-[#8b0000] uppercase tracking-wide mb-1.5">
          IMPORTANT INSTRUCTIONS FOR CANDIDATE / महत्वपूर्ण निर्देश
        </div>

        {/* English Instructions */}
        <ol className="list-decimal pl-4 text-[9px] sm:text-[9.5px] leading-normal text-slate-700 space-y-0.5">
          <li>
            Only BLACK or BLUE ballpoint pens are permitted in the exam hall. Mobile phones, iPads, calculators, or electronic devices are strictly prohibited.
          </li>
          <li>
            Admission to the examination is purely provisional. Candidature may be cancelled in case of any misconduct or incorrect information.
          </li>
          <li>
            Candidates must bring a printed copy of this Admit Card along with a valid Govt. Photo Identity Proof (Aadhaar Card, PAN Card, Voter ID, Driving License).
          </li>
          <li>
            No candidate will be admitted after 15 minutes from the start of the examination.
          </li>
        </ol>

        {/* Hindi Instructions */}
        <div className="my-1.5 border-t border-dashed border-slate-300"></div>

        <ol
          className="list-decimal pl-4 text-[9px] sm:text-[9.5px] leading-normal text-slate-700 space-y-0.5"
          style={{ fontFamily: "'Noto Sans Devanagari', 'Mangal', sans-serif" }}
        >
          <li>
            परीक्षा हॉल में केवल काले या नीले बॉल पेन की अनुमति है। मोबाइल फोन, आईपैड, कैलकुलेटर या अन्य इलेक्ट्रॉनिक उपकरण लाना सख्त मना है।
          </li>
          <li>
            परीक्षा में प्रवेश पूर्णतः अनंतिम (provisional) है। किसी भी प्रकार के दुर्व्यवहार या गलत जानकारी पाए जाने पर अभ्यर्थिता रद्द की जा सकती है।
          </li>
          <li>
            प्रवेश पत्र के साथ अभ्यर्थी को अपना वैध सरकारी फोटो पहचान पत्र (आधार कार्ड, पैन कार्ड, वोटर आईडी, ड्राइविंग लाइसेंस आदि) लाना अनिवार्य है।
          </li>
          <li>
            परीक्षा शुरू होने के 15 मिनट बाद किसी भी अभ्यर्थी को प्रवेश की अनुमति नहीं दी जाएगी।
          </li>
        </ol>
      </div>

      {/* 6. Signatures & Seal Section */}
      <div className="flex items-end justify-between px-2 pt-4 pb-1">
        {/* Student Signature */}
        <div className="text-center w-[180px]">
          <div className="h-[36px]"></div>
          <div className="border-t border-slate-400 pt-1">
            <span className="text-[10.5px] font-bold text-[#0b2545] block">
              Signature of Student
            </span>
            <span className="text-[9px] text-slate-500 block">
              (Sign in presence of Invigilator)
            </span>
          </div>
        </div>

        {/* Center Seal Box */}
        <div className="w-[140px] h-[54px] border border-dashed border-slate-400 rounded flex flex-col items-center justify-center bg-[#fafafa]">
          <span className="text-[9.5px] font-bold text-slate-700 uppercase">
            CENTRE SEAL
          </span>
          <span className="text-[8px] text-slate-400">
            Stamp & Signature
          </span>
        </div>

        {/* Controller of Examination */}
        <div className="text-center w-[180px]">
          <div className="h-[36px]"></div>
          <div className="border-t border-slate-400 pt-1">
            <span className="text-[10.5px] font-bold text-[#0b2545] block">
              Controller of Examination
            </span>
            <span className="text-[9px] text-slate-500 block">
              Indian Paramedical Board
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
