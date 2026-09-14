"use client";

import React, { useState, useEffect } from "react";
import RegistrationForm from "./RegistrationForm";

export default function StudentRegistrationGatedView() {
  const [verificationState, setVerificationState] = useState<"idle" | "otp_sent" | "verified">("idle");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Handler: Send OTP (State A -> State B)
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid student email address. / कृपया वैध ईमेल आईडी दर्ज करें।");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/student/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to send OTP. Please try again.");
        return;
      }

      setVerificationState("otp_sent");
      setOtp("");
      setError(null);
      setResendCooldown(60);
    } catch (err: any) {
      console.error("Send OTP error:", err);
      setError("Network error occurred while sending OTP. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Handler: Verify OTP (State B -> State C)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    if (!cleanOtp || cleanOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP. / कृपया 6 अंकों का ओटीपी दर्ज करें।");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/student/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: cleanEmail, otp: cleanOtp }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid OTP. Please try again.");
        return;
      }

      setEmail(cleanEmail);
      setVerificationState("verified");
      setError(null);
    } catch (err: any) {
      console.error("Verify OTP error:", err);
      setError("Network error occurred while verifying OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handler: Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resending) return;

    const cleanEmail = email.trim().toLowerCase();
    setResending(true);
    setError(null);

    try {
      const res = await fetch("/api/student/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to resend OTP. Please try again.");
        return;
      }

      setResendCooldown(60);
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  // Handler: Reset back to State A (Change Email)
  const handleChangeEmail = () => {
    setVerificationState("idle");
    setOtp("");
    setError(null);
    setResendCooldown(0);
  };

  return (
    <div className="w-full space-y-6">
      {/* State C: Verified Confirmation Strip */}
      {verificationState === "verified" && (
        <div className="bg-emerald-50 border-2 border-emerald-500/80 rounded-lg p-4 sm:p-4.5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                  Candidate Email Verified / ईमेल सत्यापित
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-200/80 text-emerald-800">
                  Step 1 Completed
                </span>
              </div>
              <p className="text-sm font-semibold text-emerald-950 font-mono mt-0.5">
                {email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleChangeEmail}
            className="self-start sm:self-auto text-xs font-bold text-slate-700 hover:text-red-700 bg-white hover:bg-red-50 border border-slate-300 hover:border-red-300 px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Change Email / ईमेल बदलें</span>
          </button>
        </div>
      )}

      {/* State A & B: Email Verification Gating Card (Form is NOT rendered) */}
      {verificationState !== "verified" && (
        <div className="w-full bg-white rounded-lg border-2 border-[#143E66]/30 shadow-md overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#143E66] to-[#1E5285] px-5 sm:px-6 py-4 border-b-2 border-[#D4AF37] flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#00031D] font-black text-sm flex items-center justify-center shadow-xs">
                1
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base uppercase tracking-wide">
                  Step 1: Student Email Verification / छात्र ईमेल सत्यापन
                </h3>
                <p className="text-xs text-[#C2DCED] font-medium">
                  Verify student&apos;s email to begin registration. / पंजीकरण शुरू करने के लिए छात्र का ईमेल सत्यापित करें।
                </p>
              </div>
            </div>

            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-[#00031D]/40 text-[#F1E4C3] border border-white/10">
              Mandatory Verification
            </span>
          </div>

          {/* Card Body */}
          <div className="p-5 sm:p-7 max-w-2xl mx-auto">
            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border-l-4 border-red-500 rounded-r text-red-800 text-xs sm:text-sm flex items-start gap-2.5">
                <svg
                  className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {verificationState === "idle" ? (
              /* State A: Email Entry Form */
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label
                    htmlFor="student-verify-email"
                    className="block text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider mb-1.5"
                  >
                    Candidate Email Address / छात्र का ईमेल आईडी <span className="text-[#B13B1C]">*</span>
                  </label>
                  <div className="relative rounded-md shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      id="student-verify-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. candidate@example.com"
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#143E66] focus:border-transparent transition-all"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">
                    A 6-digit OTP verification code will be sent to this email address to confirm authenticity.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#143E66] hover:bg-[#0d2a45] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        <span>Send OTP / ओटीपी भेजें</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* State B: OTP Verification Form */
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="bg-blue-50/80 border border-blue-200 rounded-md p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Code Sent To:
                    </span>
                    <span className="text-sm font-semibold text-slate-800 font-mono">
                      {email}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleChangeEmail}
                    className="text-xs font-semibold text-[#143E66] hover:underline cursor-pointer"
                  >
                    Change Email / बदलें
                  </button>
                </div>

                <div>
                  <label
                    htmlFor="student-otp"
                    className="block text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider mb-1.5 text-center"
                  >
                    Enter 6-Digit Code / 6 अंकों का ओटीपी दर्ज करें <span className="text-[#B13B1C]">*</span>
                  </label>
                  <div className="max-w-xs mx-auto">
                    <input
                      id="student-otp"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      autoFocus
                      required
                      value={otp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setOtp(val);
                      }}
                      placeholder="• • • • • •"
                      className="w-full py-3 px-4 text-center text-2xl font-mono font-bold tracking-[0.4em] bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-300 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#143E66] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#143E66] hover:bg-[#0d2a45] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      "Verify & Unlock Form / सत्यापित करें"
                    )}
                  </button>

                  <div className="text-xs">
                    {resendCooldown > 0 ? (
                      <span className="text-slate-400 font-medium">
                        Resend in <span className="text-[#143E66] font-bold">{resendCooldown}s</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resending}
                        className="text-[#143E66] hover:text-[#0d2a45] font-bold hover:underline cursor-pointer transition-colors disabled:opacity-50"
                      >
                        {resending ? "Sending OTP..." : "Resend OTP / पुनः भेजें"}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* State C: Registration Form is rendered ONLY after verification */}
      {verificationState === "verified" && (
        <RegistrationForm verifiedEmail={email} />
      )}
    </div>
  );
}