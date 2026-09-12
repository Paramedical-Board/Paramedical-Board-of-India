import React from "react";

export type ApplicationStatus =
  | "submitted"
  | "under_review"
  | "query_raised"
  | "approved"
  | "rejected";

interface StatusBadgeProps {
  status: ApplicationStatus | string;
  size?: "sm" | "md" | "lg";
  showHindi?: boolean;
}

const statusConfig: Record<
  ApplicationStatus,
  {
    en: string;
    hi: string;
    badgeClass: string;
    dotClass: string;
  }
> = {
  submitted: {
    en: "Submitted",
    hi: "प्रस्तुत",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
    dotClass: "bg-slate-500",
  },
  under_review: {
    en: "Under Review",
    hi: "समीक्षाधीन",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    dotClass: "bg-blue-500",
  },
  query_raised: {
    en: "Query Raised",
    hi: "प्रश्न उठाया गया",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-300",
    dotClass: "bg-amber-500",
  },
  approved: {
    en: "Approved",
    hi: "स्वीकृत",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-300",
    dotClass: "bg-emerald-500",
  },
  rejected: {
    en: "Rejected",
    hi: "अस्वीकृत",
    badgeClass: "bg-red-50 text-red-700 border-red-300",
    dotClass: "bg-red-500",
  },
};

export default function StatusBadge({
  status,
  size = "md",
  showHindi = true,
}: StatusBadgeProps) {
  const normalizedStatus = (status || "").toLowerCase() as ApplicationStatus;
  const config = statusConfig[normalizedStatus] || {
    en: status || "Unknown",
    hi: "",
    badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
    dotClass: "bg-slate-400",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-sm",
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-md border shadow-2xs whitespace-nowrap ${config.badgeClass} ${sizeClasses}`}
    >
      {normalizedStatus === "approved" ? (
        <svg
          className="w-3.5 h-3.5 text-emerald-600 shrink-0 -ml-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <span className={`w-2 h-2 rounded-full shrink-0 ${config.dotClass}`} />
      )}
      <span>{config.en}</span>
      {showHindi && config.hi && (
        <span className="opacity-80 text-[0.9em] font-normal">
          / {config.hi}
        </span>
      )}
    </span>
  );
}
