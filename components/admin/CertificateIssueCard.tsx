"use client";

import React, { useState } from "react";
import { REG_PREFIX, NOC_PREFIX, parseCertSuffix } from "@/lib/cert-number";

interface Props {
  registrationId: string;
  status: string;
  suffix: string | null;
  issuedAt: string | null;
  /** Called after a successful save (values set) or withdraw (both null) so the page can update itself. */
  onChanged: (suffix: string | null, issuedAt: string | null) => void;
}

/**
 * Admin control: decides whether THIS student can download the Registration Certificate and NOC.
 * The admin types only the part after "IPBI/REG/"; the NOC number follows automatically.
 */
export default function CertificateIssueCard({ registrationId, status, suffix, issuedAt, onChanged }: Props) {
  const [value, setValue] = useState(suffix ?? "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const isIssued = !!suffix;
  const isApproved = status === "approved";
  const cleaned = parseCertSuffix(value);

  const save = async () => {
    setMessage(null);
    if (!cleaned) {
      setMessage({ type: "err", text: "Enter 1–30 characters: letters, digits and / _ . - only." });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/registration-certificates/${registrationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suffix: cleaned }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Could not save the number." });
        return;
      }
      setMessage({ type: "ok", text: "Saved. The student can now download the Registration Certificate and NOC." });
      onChanged(data.suffix ?? cleaned, data.issued_at ?? issuedAt ?? new Date().toISOString());
    } catch {
      setMessage({ type: "err", text: "Network error. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  const revoke = async () => {
    if (!confirm("Withdraw the Registration Certificate and NOC for this student? They will no longer be able to download them.")) {
      return;
    }
    setMessage(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/registration-certificates/${registrationId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Could not withdraw." });
        return;
      }
      setValue("");
      setMessage({ type: "ok", text: "Withdrawn. The student can no longer download them." });
      onChanged(null, null);
    } catch {
      setMessage({ type: "err", text: "Network error. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-6 bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-xs font-black uppercase tracking-wider text-[#143E66]">
          Registration Certificate &amp; NOC / पंजीयन प्रमाण-पत्र एवं NOC
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
        {!isApproved ? (
          <p className="text-xs text-slate-500">
            Available only after the application is approved. The student cannot download anything until then.
          </p>
        ) : (
          <>
            <p className="text-xs text-slate-500">
              The student can download the Registration Certificate and NOC <strong>only after</strong> you set a
              number here. Type just the part after <span className="font-mono">{REG_PREFIX}</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <div className="flex items-stretch flex-1 max-w-md">
                <span className="inline-flex items-center px-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg text-xs font-mono font-bold text-slate-600">
                  {REG_PREFIX}
                </span>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  maxLength={30}
                  placeholder="e.g. 2404"
                  aria-label="Registration number after IPBI/REG/"
                  className="flex-1 min-w-0 px-3 py-2 bg-white border border-slate-300 rounded-r-lg text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#143E66]"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={save}
                  disabled={busy || !cleaned || cleaned === suffix}
                  className="px-4 py-2 bg-[#143E66] hover:bg-[#0a233a] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isIssued ? "Update Number" : "Issue to Student"}
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

            {(cleaned || isIssued) && (
              <div className="text-[11px] text-slate-600 space-y-0.5">
                <div>
                  Certificate No.: <span className="font-mono font-bold text-slate-800">{REG_PREFIX}{cleaned ?? suffix}</span>
                </div>
                <div>
                  NOC No. (automatic): <span className="font-mono font-bold text-slate-800">{NOC_PREFIX}{cleaned ?? suffix}</span>
                </div>
                {isIssued && issuedAt && (
                  <div>
                    Issued on:{" "}
                    <strong className="text-slate-800">
                      {new Date(issuedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </strong>
                  </div>
                )}
              </div>
            )}
          </>
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
