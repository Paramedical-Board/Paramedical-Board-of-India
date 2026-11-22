"use client";

import React, { useState } from "react";
import {
  parseAffilCertNo,
  affilSuffixOf,
  parsePersonName,
  AFFIL_PREFIX,
  AFFIL_SUFFIX_MAX,
  PERSON_NAME_MAX,
} from "@/lib/cert-number";

interface Props {
  institutionId: string;
  certNo: string | null;
  issuedAt: string | null;
  /** Director / Principal name printed on the certificate (stored as the institution's contact_person). */
  directorName: string | null;
  /**
   * Called after a successful save (values set) or withdraw (number + date null, name kept)
   * so the page can update itself.
   */
  onChanged: (certNo: string | null, issuedAt: string | null, directorName: string | null) => void;
}

/**
 * Admin control: decides the Affiliation No. printed on this institution's certificate, and
 * whether the certificate can be printed at all. Kept separate from the institution's public
 * "Center Code" badge — this number is typed in full by the admin, specifically for the certificate.
 */
export default function AffiliationCertIssueCard({
  institutionId,
  certNo,
  issuedAt,
  directorName,
  onChanged,
}: Props) {
  // Only the part after the fixed "IPBO-" prefix is editable.
  const [value, setValue] = useState(affilSuffixOf(certNo));
  const [name, setName] = useState(directorName ?? "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const isIssued = !!certNo;
  const cleaned = parseAffilCertNo(value);
  const cleanedName = parsePersonName(name);
  const isDirty = cleaned !== certNo || cleanedName !== (directorName ?? "");

  const save = async () => {
    setMessage(null);
    if (!cleaned) {
      setMessage({
        type: "err",
        text: `Enter 1–${AFFIL_SUFFIX_MAX} characters after ${AFFIL_PREFIX}: letters, digits, spaces and / _ . - only.`,
      });
      return;
    }
    if (cleanedName === null) {
      setMessage({
        type: "err",
        text: `Director / Principal name must start with a letter and be up to ${PERSON_NAME_MAX} characters (letters, spaces and . , ' ( ) / - only).`,
      });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/affiliation-certificates/${institutionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cert_no: affilSuffixOf(cleaned), director_name: cleanedName }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Could not save." });
        return;
      }
      const savedName: string | null = data.director_name ?? (cleanedName || null);
      setValue(affilSuffixOf(data.cert_no ?? cleaned));
      setName(savedName ?? "");
      setMessage({ type: "ok", text: "Saved. The Affiliation Certificate can now be printed." });
      onChanged(data.cert_no ?? cleaned, data.issued_at ?? issuedAt ?? new Date().toISOString(), savedName);
    } catch {
      setMessage({ type: "err", text: "Network error. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  const revoke = async () => {
    if (!confirm("Withdraw the Affiliation Certificate for this institution? It can no longer be printed until re-issued.")) {
      return;
    }
    setMessage(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/affiliation-certificates/${institutionId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Could not withdraw." });
        return;
      }
      setValue("");
      setMessage({ type: "ok", text: "Withdrawn. The certificate can no longer be printed." });
      onChanged(null, null, directorName);
    } catch {
      setMessage({ type: "err", text: "Network error. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-6 bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden no-print">
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-xs font-black uppercase tracking-wider text-[#143E66]">
          Affiliation Certificate / संबद्धता प्रमाण-पत्र
        </h2>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            isIssued
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-slate-100 text-slate-500 border-slate-200"
          }`}
        >
          {isIssued ? "Issued" : "Not issued"}
        </span>
      </div>

      <div className="p-5 space-y-3">
        <p className="text-xs text-slate-500">
          The certificate below can be printed <strong>only after</strong> you set an Affiliation No. here. This is
          separate from the institution&apos;s public Center Code badge.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 max-w-2xl">
          <label className="block">
            <span className="block text-[11px] font-bold text-slate-700 mb-1">
              Affiliation No. / संबद्धता क्र. <span className="text-red-600">*</span>
            </span>
            <div className="flex w-full min-w-0 rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#143E66]">
              <span
                className="px-3 py-2 bg-slate-100 border-r border-slate-300 text-sm font-mono font-bold text-slate-600 select-none"
                aria-hidden="true"
              >
                {AFFIL_PREFIX}
              </span>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value.toUpperCase())}
                maxLength={AFFIL_SUFFIX_MAX + AFFIL_PREFIX.length}
                placeholder="UP-2044"
                aria-label={`Affiliation No. after ${AFFIL_PREFIX}`}
                className="flex-1 min-w-0 px-3 py-2 bg-transparent text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
              />
            </div>
          </label>

          <label className="block">
            <span className="block text-[11px] font-bold text-slate-700 mb-1">
              Director / Principal Name / निदेशक / प्राचार्य
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={PERSON_NAME_MAX}
              placeholder="e.g. Dr. Ramesh Kumar"
              className="w-full min-w-0 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#143E66]"
            />
          </label>
        </div>

        <p className="text-[11px] text-slate-500">
          The name is saved as the institution&apos;s Contact Person and printed on the certificate. Leave it blank
          to print &ldquo;—&rdquo;.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={busy || !cleaned || cleanedName === null || !isDirty}
              className="px-4 py-2 bg-[#143E66] hover:bg-[#0a233a] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isIssued ? "Save Changes" : "Issue Certificate"}
            </button>
            {isIssued && (
              <button
                type="button"
                onClick={revoke}
                disabled={busy}
                className="px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-300 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
              >
                Withdraw
              </button>
            )}
          </div>
        </div>

        {isIssued && issuedAt && (
          <div className="text-[11px] text-slate-600">
            Issued on:{" "}
            <strong className="text-slate-800">
              {new Date(issuedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </strong>
          </div>
        )}

        {message && (
          <div
            role="status"
            className={`p-2.5 rounded text-xs font-semibold border-l-4 ${
              message.type === "ok"
                ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                : "bg-red-50 border-red-500 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
