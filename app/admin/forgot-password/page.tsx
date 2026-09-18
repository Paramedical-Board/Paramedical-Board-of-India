"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter your username. / कृपया उपयोगकर्ता नाम दर्ज करें।");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok && !data.success) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error("Forgot password error:", err);
      setError("Network error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FA]">
      {/* Top Bar Banner */}
      <header className="w-full bg-[#00031D] border-b-4 border-[#D4AF37] py-3.5 px-4 sm:px-8 text-white shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 shrink-0">
              <Image
                src="/logo.png"
                alt="Indian Paramedical Board Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight uppercase leading-tight">
                INDIAN PARAMEDICAL BOARD OF INDIA
              </h1>
              <p className="text-xs sm:text-sm text-[#D4AF37] font-medium leading-tight mt-0.5">
                इण्डियन पैरामेडिकल बोर्ड of India • Super-Admin Portal
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-[#143E66] p-6 text-center text-white border-b-2 border-[#D4AF37]">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#00031D] text-[#D4AF37] mb-3 border border-[#D4AF37]/40 shadow-inner">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-wide uppercase">
              Forgot Password
            </h2>
            <p className="text-xs text-[#C2DCED] mt-1 font-medium">
              पासवर्ड रीसेट लिंक का अनुरोध करें
            </p>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-3.5 bg-red-50 border-l-4 border-red-500 rounded-r text-red-800 text-xs sm:text-sm flex items-start gap-2.5">
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

            {submitted ? (
              <div className="space-y-5 text-center">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900">
                  <div className="w-10 h-10 mx-auto mb-2 text-emerald-600 flex items-center justify-center rounded-full bg-emerald-100">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold mb-1">
                    Request Processed
                  </p>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    If that account exists, a reset link has been sent to its registered email.
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-2 border-t border-emerald-200/60 pt-2">
                    यदि वह खाता मौजूद है, तो उसके पंजीकृत ईमेल पर एक रीसेट लिंक भेज दिया गया है।
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href="/admin/login"
                    className="w-full inline-flex py-2.5 px-4 bg-[#143E66] hover:bg-[#0d2a45] active:bg-[#00031D] text-white text-sm font-bold uppercase tracking-wider rounded shadow-md hover:shadow-lg transition-all items-center justify-center gap-2"
                  >
                    Back to Login / लॉगिन पर वापस जाएं
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter your admin username below. We will send a secure password reset link to your registered email address.
                </p>

                {/* Username Field */}
                <div>
                  <label
                    htmlFor="admin-username"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Username / उपयोगकर्ता नाम <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-md shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <input
                      id="admin-username"
                      name="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter Admin Username"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#143E66] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-[#143E66] hover:bg-[#0d2a45] active:bg-[#00031D] text-white text-sm font-bold uppercase tracking-wider rounded shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
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
                        Sending Link...
                      </>
                    ) : (
                      "Send Reset Link / रीसेट लिंक भेजें"
                    )}
                  </button>
                </div>

                {/* Back to Login link */}
                <div className="text-center pt-2 border-t border-slate-100">
                  <Link
                    href="/admin/login"
                    className="text-xs text-slate-600 hover:text-[#143E66] font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back to Login / लॉगिन पर वापस जाएं</span>
                  </Link>
                </div>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-500">
                Restricted Area. Authorized administrative personnel only. All access logs are recorded.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200">
        © 2023 Indian Paramedical Board of India. All rights reserved.
      </footer>
    </div>
  );
}
