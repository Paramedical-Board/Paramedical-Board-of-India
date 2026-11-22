import React from "react";
import A4Fit from "@/components/common/A4Fit";

const HINDI_FONT = { fontFamily: "'Noto Sans Devanagari', 'Mangal', sans-serif" } as const;

export interface AffiliationCertificateData {
  /** The Affiliation No. printed on the certificate — set by the admin specifically for this certificate. */
  affiliation_cert_no: string;
  name: string;
  hindi_name: string;
  district: string;
  state: string;
  address: string;
  affiliated_since: string;
  status: string;
  approved_programs: string[];
  contact_person?: string | null;
}

function Row({
  label,
  hindi,
  children,
}: {
  label: string;
  hindi: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-2 text-[12px] leading-snug">
      <div className="w-[230px] shrink-0 text-slate-700">
        <span className="font-semibold">{label}</span>
        <span className="block text-[10px] text-slate-500" style={HINDI_FONT}>
          {hindi}
        </span>
      </div>
      <span className="text-slate-600 font-semibold">:</span>
      <span className="flex-1 font-bold text-[#0b2545] break-words">{children}</span>
    </div>
  );
}

interface Props {
  institution: AffiliationCertificateData;
  className?: string;
}

export default function AffiliationCertificateLayout({ institution: c, className = "" }: Props) {
  const address = [c.address, c.district, c.state].filter(Boolean).join(", ");

  return (
    <A4Fit>
      <div
        className={`affil-cert-page-wrapper w-[794px] max-w-full bg-white mx-auto p-3 print:p-0 text-[#1e293b] relative font-sans ${className}`}
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
            .affil-cert-page-wrapper {
              width: 100% !important;
              max-width: 100% !important;
              padding: 0 !important;
              margin: 0 auto !important;
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }
          }
        `}</style>

        <div className="border-[3px] border-double border-[#8b0000] p-1.5">
          <div className="border border-[#0b2545] px-6 py-5 sm:px-8 relative overflow-hidden min-h-[1000px] print:min-h-[990px] flex flex-col">
            {/* Watermark */}
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center select-none z-0"
              aria-hidden="true"
            >
              <img
                src="/logo.png"
                alt=""
                style={{ width: "430px", height: "430px", maxWidth: "75%", objectFit: "contain", opacity: 0.1 }}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between gap-3 relative z-10">
              <img
                src="/logo.png"
                alt="Indian Paramedical Board of India Logo"
                style={{ width: "78px", height: "78px", objectFit: "contain" }}
              />
              <div className="flex-1 text-center px-2">
                <h1 className="text-[17px] sm:text-[18px] font-extrabold text-[#0b2545] tracking-normal uppercase leading-tight font-serif whitespace-nowrap">
                  INDIAN PARAMEDICAL BOARD OF INDIA
                </h1>
                <h2 className="text-[14px] font-bold text-[#8b0000] mt-0.5" style={HINDI_FONT}>
                  इण्डियन पैरामेडिकल बोर्ड ऑफ़ इण्डिया
                </h2>
                <p className="text-[10px] text-slate-700 font-semibold mt-0.5 leading-tight">
                  (An Autonomous Organization Under Section-8 Indian Trust Act 2013)
                </p>
                <p className="text-[9px] text-slate-600 font-medium leading-tight">
                  (An ISO 9001:2015 Certified Council)
                </p>
              </div>
              <div style={{ width: "78px" }} />
            </div>

            <div className="h-[2.5px] bg-[#8b0000] w-full my-3 relative z-10" />

            {/* Title */}
            <div className="text-center relative z-10 mb-3">
              <div className="text-[19px] font-extrabold text-[#8b0000]" style={HINDI_FONT}>
                संबद्धता प्रमाण-पत्र
              </div>
              <div className="text-[19px] font-extrabold text-[#8b0000] tracking-wide uppercase">
                Certificate of Affiliation
              </div>
            </div>

            <div className="relative z-10 text-[12px] mb-3 flex items-baseline gap-2">
              <span className="font-semibold text-slate-700">
                Affiliation No. / <span style={HINDI_FONT}>संबद्धता क्र.</span>
              </span>
              <span className="font-semibold text-slate-600">:</span>
              <span className="font-bold font-mono text-[#0b2545]">{c.affiliation_cert_no}</span>
            </div>

            {/* Details */}
            <div className="relative z-10 space-y-2">
              <Row label="1. Name of Institute" hindi="संस्थान का नाम">
                <span className="uppercase">{c.name}</span>
                {c.hindi_name && (
                  <span className="block font-normal text-[#0b2545]" style={HINDI_FONT}>
                    {c.hindi_name}
                  </span>
                )}
              </Row>
              <Row label="2. Director / Principal" hindi="निदेशक / प्राचार्य">
                {c.contact_person || "—"}
              </Row>
              <Row label="3. Address" hindi="पता">
                <span className="uppercase">{address || "—"}</span>
              </Row>
              <Row label="4. Approved Courses" hindi="अनुमोदित पाठ्यक्रम">
                <span className="uppercase">
                  {c.approved_programs.length > 0 ? c.approved_programs.join(", ") : "—"}
                </span>
              </Row>
              <Row label="5. Status" hindi="स्थिति">
                {c.status}
              </Row>
              <Row label="6. Affiliated Since" hindi="संबद्धता दिनांक">
                {c.affiliated_since}
              </Row>
            </div>

            {/* Certification statements */}
            <div className="relative z-10 mt-5 border-t border-slate-300 pt-3 space-y-2">
              <p className="text-[10.5px] leading-relaxed text-slate-800" style={HINDI_FONT}>
                &quot;यह प्रमाणित किया जाता है कि उपरोक्त विनिर्दिष्ट संस्थान को इण्डियन पैरामेडिकल बोर्ड ऑफ़ इण्डिया द्वारा
                उपरोक्त पाठ्यक्रमों के संचालन हेतु संबद्धता प्रदान की गई है, जो बोर्ड के मानकों के निरंतर अनुपालन के अधीन है।&quot;
              </p>
              <p className="text-[10.5px] leading-relaxed text-slate-800">
                &quot;This is to certify that the above-named institute has been granted affiliation by the Indian
                Paramedical Board of India to conduct the above-listed paramedical courses, subject to continued
                compliance with the Board&apos;s norms and periodic verification.&quot;
              </p>
            </div>

            {/* Place / date / registrar */}
            <div className="relative z-10 mt-8 flex items-end justify-between text-[12px] break-inside-avoid">
              <div className="space-y-0.5">
                <div>
                  <span className="font-semibold text-slate-700">Place / स्थान</span>
                  <span className="mx-1.5">:</span>
                  <span className="font-bold text-[#0b2545]">India</span>
                </div>
              </div>

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

            <p className="relative z-10 mt-6 text-[9px] text-center text-slate-500">
              This is a computer-generated certificate based on the Board&apos;s affiliation records.
            </p>

            {/* Bottom logos — pushed to the foot of the sheet (mt-auto), one on each side */}
            <div className="relative z-10 mt-auto pt-6 flex items-end justify-between break-inside-avoid">
              <div className="flex flex-col items-center text-center leading-tight">
                <img
                  src="/national-emblem.png"
                  alt="National Emblem of India"
                  style={{ width: "48px", height: "75px", objectFit: "contain" }}
                />
                <span className="mt-0.5 text-[9px] font-semibold text-slate-800" style={HINDI_FONT}>
                  नीति आयोग
                </span>
                <span className="text-[10px] font-bold text-slate-800">Recognized</span>
                <span className="text-[10px] font-bold text-slate-800 whitespace-nowrap">
                  MSME Trust - Education Act
                </span>
              </div>
              <img
                src="/azadi-ka-amrit-mahotsav.png"
                alt="Azadi Ka Amrit Mahotsav"
                style={{ width: "113px", height: "75px", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </div>
    </A4Fit>
  );
}
