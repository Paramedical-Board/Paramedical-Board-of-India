import React from "react";
import { RegistrationCertificateData } from "@/lib/registration-certificate-data";
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

interface Props {
  certificate: RegistrationCertificateData;
  className?: string;
}

/** One numbered line: "label : value". `sub` indents sub-items (A)…(D); `pad` leaves room for the photo. */
function Row({
  label,
  children,
  sub,
  pad,
  hindi,
}: {
  label: string;
  children?: React.ReactNode;
  sub?: boolean;
  pad?: boolean;
  hindi?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline gap-2 ${sub ? "pl-5" : ""} ${pad ? "pr-[128px]" : ""}`}
      style={hindi ? HINDI_FONT : undefined}
    >
      <span className={`${sub ? "w-[255px]" : "w-[275px]"} shrink-0 text-slate-700`}>{label}</span>
      {children !== undefined && (
        <>
          <span className="text-slate-500">:</span>
          <span className="flex-1 font-bold text-[#0b2545] break-words" style={{ fontFamily: "inherit" }}>
            {children}
          </span>
        </>
      )}
    </div>
  );
}

export default function RegistrationCertificateLayout({ certificate: c, className = "" }: Props) {
  const place = "India";
  const issued = formatDisplayDate(c.registration_date);

  return (
    <A4Fit>
    <div
      className={`reg-cert-page-wrapper w-[794px] max-w-full bg-white mx-auto p-3 print:p-0 text-[#1e293b] relative font-sans ${className}`}
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
          .reg-cert-page-wrapper {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 auto !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      <div className="border border-[#d33] px-7 py-5 relative overflow-hidden">
        {/* Watermark */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center select-none z-0"
          aria-hidden="true"
        >
          <img
            src="/logo.png"
            alt=""
            style={{ width: "420px", height: "420px", maxWidth: "75%", objectFit: "contain", opacity: 0.08 }}
          />
        </div>

        {/* Header banner */}
        <div className="relative z-10 flex items-center justify-center gap-4">
          <img
            src="/logo.png"
            alt="Indian Paramedical Board of India Logo"
            style={{ width: "74px", height: "74px", objectFit: "contain" }}
          />
          <div className="text-center">
            <h1 className="text-[20px] font-extrabold text-[#8b0000] tracking-wide uppercase leading-tight font-serif whitespace-nowrap">
              INDIAN PARAMEDICAL BOARD OF INDIA
            </h1>
            <h2 className="text-[16px] font-bold text-[#8b0000] mt-0.5" style={HINDI_FONT}>
              इण्डियन पैरामेडिकल बोर्ड ऑफ़ इण्डिया
            </h2>
            <p className="text-[9.5px] text-slate-700 font-semibold mt-0.5 leading-tight">
              (An Autonomous Organization Under Section-8 Indian Trust Act 2013) · (An ISO 9001:2015 Certified Council)
            </p>
          </div>
        </div>

        {/* ───────────── Hindi section ───────────── */}
        <div className="relative z-10 mt-3">
          {/* Photo (top right, like the reference) */}
          <div
            className="absolute right-0 top-0 border border-slate-400 bg-[#f8fafc] overflow-hidden flex items-center justify-center"
            style={{ width: "112px", height: "136px" }}
          >
            {c.photo_url ? (
              <img
                src={c.photo_url}
                alt={c.candidate_name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span className="text-[8px] font-bold text-slate-500 text-center uppercase px-1">Candidate Photo</span>
            )}
          </div>

          <div className="text-center text-[18px] font-extrabold text-[#8b0000] leading-tight" style={HINDI_FONT}>
            पंजीयन का प्रमाण-पत्र
          </div>

          <div className="mt-1 space-y-[5px] text-[11.5px] leading-snug" style={HINDI_FONT}>
            <Row hindi pad label="प्रमाण-पत्र क्र.">
              <span className="font-mono">{c.certificate_no}</span>
            </Row>
            <Row hindi pad label="1. नाम">
              <span className="uppercase">{c.candidate_name}</span>
            </Row>
            <Row hindi pad label="2. पिता/पति का नाम">
              <span className="uppercase">{c.father_name}</span>
            </Row>
            <Row hindi pad label="3. पता">
              <span className="uppercase">{c.address}</span>
            </Row>
            <Row hindi label="4. अर्हताएं" />
            <Row hindi sub label="(अ) पाठ्यक्रम">
              <span className="uppercase">{c.course}</span>
            </Row>
            <Row hindi sub label="(ब) नामांकन क्रमांक">
              <span className="font-mono">{c.enrollment_no}</span>
            </Row>
            <Row hindi sub label="(स) संस्था का नाम">
              <span className="uppercase">{c.institution_name}</span>
            </Row>
            <Row hindi sub label="(द) शैक्षणिक सत्र">
              {c.academic_session || "—"}
            </Row>
            <Row hindi label="5. जन्मतिथि">
              {formatDisplayDate(c.dob)}
            </Row>
            <Row hindi label="6. पंजीयन की तारीख">
              {formatDisplayDate(c.registration_date)}
            </Row>
            <Row hindi label="7. वैधता (तक)">
              {formatDisplayDate(c.valid_upto)}
            </Row>
          </div>

          <p className="mt-2 text-[10px] leading-relaxed text-slate-800" style={HINDI_FONT}>
            &quot;यह प्रमाणित किया जाता है कि इण्डियन पैरामेडिकल बोर्ड ऑफ़ इण्डिया द्वारा संधारित अभ्यर्थियों के रजिस्टर
            में उपरोक्त विनिर्दिष्ट नाम की प्रविष्टि की यह एक सत्यप्रति है।&quot;
          </p>

          <div className="mt-1.5 text-[10.5px] text-slate-700" style={HINDI_FONT}>
            <div>स्थान : {place}</div>
            <div>दिनांक : {issued}</div>
          </div>
        </div>

        {/* ───────────── English section ───────────── */}
        <div className="relative z-10 mt-4 border-t border-slate-300 pt-3">
          <div className="text-center text-[18px] font-extrabold text-[#8b0000] tracking-wide uppercase leading-tight">
            Certificate of Registration
          </div>

          <div className="mt-1 space-y-[5px] text-[11.5px] leading-snug">
            <Row label="Certificate No.">
              <span className="font-mono">{c.certificate_no}</span>
            </Row>
            <Row label="1. Name">
              <span className="uppercase">{c.candidate_name}</span>
            </Row>
            <Row label="2. Father's/Husband Name">
              <span className="uppercase">{c.father_name}</span>
            </Row>
            <Row label="3. Address">
              <span className="uppercase">{c.address}</span>
            </Row>
            <Row label="4. Qualification" />
            <Row sub label="(A) Course Enrolled">
              <span className="uppercase">{c.course}</span>
            </Row>
            <Row sub label="(B) Enrollment Number">
              <span className="font-mono">{c.enrollment_no}</span>
            </Row>
            <Row sub label="(C) Name of Institution">
              <span className="uppercase">{c.institution_name}</span>
            </Row>
            <Row sub label="(D) Academic Session">
              {c.academic_session || "—"}
            </Row>
            <Row label="5. Date of Birth">{formatDisplayDate(c.dob)}</Row>
            <Row label="6. Date of Registration">{formatDisplayDate(c.registration_date)}</Row>
            <Row label="7. Valid Upto">{formatDisplayDate(c.valid_upto)}</Row>
          </div>

          <p className="mt-2 text-[10px] leading-relaxed text-slate-800">
            &quot;It is certified that this is a true copy of entry of the above specified name in the Register of
            Candidates maintained by the Indian Paramedical Board of India.&quot;
          </p>

          <div className="mt-2 flex items-end justify-between break-inside-avoid">
            <div className="text-[11.5px] text-slate-800 leading-snug">
              <div>Place : {place}</div>
              <div>Date : {issued}</div>
            </div>

            {/* Secretary signature — same as the result sheet */}
            <div className="text-center min-w-[190px]">
              <div className="h-[44px] flex items-end justify-center pb-1">
                <img
                  src="/Signature.png"
                  alt="Secretary Signature"
                  style={{ height: "40px", maxWidth: "140px", objectFit: "contain", display: "block" }}
                />
              </div>
              <div className="border-t border-slate-400 pt-1">
                <span className="text-[10.5px] font-bold text-[#0b2545] block">Secretary / सचिव</span>
                <span className="text-[8.5px] text-slate-500 block whitespace-nowrap">
                  Indian Paramedical Board of India
                </span>
              </div>
            </div>
          </div>

          <p className="mt-3 text-[8.5px] text-center text-slate-500">
            This is a computer-generated certificate based on the Board&apos;s registration records.
          </p>
        </div>
      </div>
    </div>
    </A4Fit>
  );
}
