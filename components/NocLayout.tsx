"use client";

import React from "react";
import { NocData } from "@/lib/noc-data";
import { useDynamicDomain } from "@/components/common/DynamicDomain";
import A4Fit from "@/components/common/A4Fit";

function formatDisplayDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const parts = dateStr.trim().split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  }
  return dateStr;
}

const HINDI_FONT = { fontFamily: "'Noto Sans Devanagari', 'Mangal', sans-serif" } as const;
const SERIF = { fontFamily: "'Times New Roman', Georgia, serif" } as const;

/** A filled-in value on a dotted line, like the handwritten blanks on the reference. */
function Fill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`noc-fill inline-block border-b border-dotted border-slate-600 px-1.5 font-sans font-bold text-[#0b2545] text-[13.5px] leading-snug align-baseline break-words ${className}`}
    >
      {children}
    </span>
  );
}

interface Props {
  noc: NocData;
  className?: string;
}

export default function NocLayout({ noc: n, className = "" }: Props) {
  const { email, webDisplay } = useDynamicDomain();

  return (
    <A4Fit>
    <div
      className={`noc-page-wrapper w-[794px] max-w-full bg-white mx-auto p-3 print:p-0 text-[#1e293b] relative font-sans ${className}`}
      style={{ boxSizing: "border-box" }}
    >
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 8mm; }
          html, body {
            background-color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print { display: none !important; }
          .noc-page-wrapper {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 auto !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      <div className="noc-frame border-[3px] border-[#c0392b] rounded-lg px-8 py-6 relative overflow-hidden min-h-[1020px] print:min-h-[990px]">
        {/* Watermark */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center select-none z-0"
          aria-hidden="true"
        >
          <img
            src="/logo.png"
            alt=""
            style={{ width: "430px", height: "430px", maxWidth: "75%", objectFit: "contain", opacity: 0.07 }}
          />
        </div>

        {/* Top row: S.NO | logo | photo */}
        <div className="noc-top relative z-10 flex items-start justify-between">
          <div className="noc-sno w-[170px] pt-1 text-[13px]" style={SERIF}>
            <div className="font-semibold">S.NO.</div>
            <div className="noc-sno-val font-sans font-bold text-[12px] text-[#0b2545] break-all leading-tight">{n.serial_no}</div>
          </div>

          <img
            className="noc-logo"
            src="/logo.png"
            alt="Indian Paramedical Board of India Logo"
            style={{ width: "96px", height: "96px", objectFit: "contain" }}
          />

          <div
            className="noc-photo-col w-[170px] flex justify-end"
          >
            <div
              className="noc-photo border border-slate-400 bg-[#f8fafc] overflow-hidden flex items-center justify-center"
              style={{ width: "92px", height: "112px" }}
            >
              {n.photo_url ? (
                <img
                  src={n.photo_url}
                  alt={n.candidate_name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span className="text-[8px] font-bold text-slate-500 text-center uppercase px-1">
                  Candidate Photo
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Board name */}
        <div className="noc-board relative z-10 mt-2 text-center">
          <h1 className="noc-board-h1 text-[22px] font-extrabold text-[#c0392b] tracking-wide uppercase leading-tight font-serif whitespace-nowrap">
            INDIAN PARAMEDICAL BOARD OF INDIA
          </h1>
          <h2 className="noc-board-h2 text-[15px] font-bold text-[#c0392b]" style={HINDI_FONT}>
            इण्डियन पैरामेडिकल बोर्ड ऑफ़ इण्डिया
          </h2>
        </div>

        {/* Office heading */}
        <div className="noc-office relative z-10 mt-6 text-center" style={SERIF}>
          <div className="noc-office-title text-[21px] font-bold tracking-wide text-[#0b2545] uppercase">
            Secretary, Indian Paramedical Board of India
          </div>
          <div className="noc-office-addr mt-1 text-[13.5px] text-slate-700">
            Globe Heritage, 454/4, Bandra (East), Mumbai - 400051
          </div>
        </div>

        <div className="noc-links relative z-10 mt-3 flex items-center justify-between text-[12px] text-blue-800 underline">
          <span>{webDisplay}</span>
          <span>{email}</span>
        </div>
        <div className="noc-phone relative z-10 mt-0.5 text-[11.5px] font-semibold text-slate-800">☎ 022 2346 3113</div>

        {/* Title */}
        <div className="noc-title-wrap relative z-10 mt-9 text-center" style={SERIF}>
          <span className="noc-title text-[24px] font-bold tracking-wide uppercase border-b-2 border-slate-900 pb-0.5">
            No Objection Certificate
          </span>
        </div>

        {/* Body */}
        <div className="noc-body relative z-10 mt-9 text-[17px] leading-[2.5] text-slate-900 text-left" style={SERIF}>
          <p>
            The Indian Paramedical Board of India hereby grants <Fill className="uppercase">No Objection</Fill>{" "}
            Certificate to <Fill className="uppercase">
              {n.salutation} {n.candidate_name}
            </Fill>{" "}
            {n.relation} <Fill className="uppercase">{n.father_name}</Fill> who passed the examination for{" "}
            <Fill className="uppercase">{n.course}</Fill> course from{" "}
            <Fill className="uppercase">{n.institution_name}</Fill>.
          </p>
          <p>
            Applicant is registered in Indian Paramedical Board of India bearing registration No.{" "}
            <Fill>{n.registration_no}</Fill> Dated <Fill>{formatDisplayDate(n.registration_date)}</Fill> to obtain
            registration from any other Council/Board or State.
          </p>
        </div>

        {/* Place / date / signature */}
        <div className="noc-signrow relative z-10 mt-24 flex items-end justify-between break-inside-avoid" style={SERIF}>
          <div className="text-[15px] leading-relaxed">
            <div>Place : Mumbai</div>
            <div>Date : {formatDisplayDate(n.issue_date)}</div>
          </div>

          {/* Secretary signature — same as the result sheet */}
          <div className="noc-sign text-center min-w-[200px] font-sans">
            <div className="h-[48px] flex items-end justify-center pb-1">
              <img
                src="/Signature.png"
                alt="Secretary Signature"
                style={{ height: "44px", maxWidth: "150px", objectFit: "contain", display: "block" }}
              />
            </div>
            <div className="border-t border-slate-400 pt-1">
              <span className="text-[11px] font-bold text-[#0b2545] block">Secretary / सचिव</span>
              <span className="text-[9px] text-slate-500 block whitespace-nowrap">
                Indian Paramedical Board of India
              </span>
            </div>
          </div>
        </div>

        <p className="relative z-10 mt-8 text-[9px] text-center text-slate-500 font-sans">
          This is a computer-generated certificate based on the Board&apos;s records and should be printed in colour.
        </p>
      </div>
    </div>
    </A4Fit>
  );
}
