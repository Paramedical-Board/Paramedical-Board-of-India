"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

  // Step 1: Submit Credentials
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password. / कृपया उपयोगकर्ता नाम और पासवर्ड दर्ज करें।");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        setError(res.status === 404 ? "Login service endpoint not found (404). Please refresh the page." : "Server error occurred. Please try again.");
        return;
      }

      if (!res.ok || !data.success) {
        setError(data?.error || "Invalid credentials. Please try again.");
        return;
      }

      if (data.otpRequired) {
        setStep("otp");
        setOtp("");
        setError(null);
        setResendCooldown(60);
      }
    } catch (err: any) {
      console.error("Admin login error:", err);
      setError("Network error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP. / कृपया 6 अंकों का ओटीपी दर्ज करें।");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: username.trim(),
          otp: cleanOtp,
        }),
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        setError("Server error during OTP verification. Please try again.");
        return;
      }

      if (!res.ok || !data.success) {
        setError(data?.error || "Verification failed. Please try again.");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error("Admin OTP verify error:", err);
      setError("Network error occurred during verification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resending) return;

    setResending(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        setError("Failed to resend OTP. Server error occurred.");
        return;
      }

      if (!res.ok || !data.success) {
        setError(data?.error || "Failed to resend OTP. Please try again.");
        return;
      }

      setResendCooldown(60);
    } catch (err: any) {
      console.error("Admin resend OTP error:", err);
      setError("Failed to resend OTP. Please check your connection.");
    } finally {
      setResending(false);
    }
  };

  // Back to Step 1
  const handleBackToStep1 = () => {
    setStep("credentials");
    setOtp("");
    setError(null);
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

      {/* Main Login Form Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-[#143E66] p-6 text-center text-white border-b-2 border-[#D4AF37]">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#00031D] text-[#D4AF37] mb-3 border border-[#D4AF37]/40 shadow-inner">
              {step === "credentials" ? (
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              ) : (
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-wide uppercase">
              {step === "credentials" ? "Super-Admin Login" : "Two-Factor Authentication"}
            </h2>
            <p className="text-xs text-[#C2DCED] mt-1 font-medium">
              {step === "credentials"
                ? "सुपर-व्यवस्थापक लॉगिन पोर्टल"
                : "सुरक्षित दो-चरणीय सत्यापन"}
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

            {step === "credentials" ? (
              /* STEP 1: USERNAME & PASSWORD FORM */
              <form onSubmit={handleCredentialsSubmit} className="space-y-5">
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

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="admin-password"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Password / पासवर्ड <span className="text-red-500">*</span>
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
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <input
                      id="admin-password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#143E66] focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="mt-1.5 flex justify-end">
                    <Link
                      href="/admin/forgot-password"
                      className="text-xs text-[#143E66] hover:text-[#0d2a45] hover:underline font-medium transition-colors"
                    >
                      Forgot password? / पासवर्ड भूल गए?
                    </Link>
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
                        Authenticating...
                      </>
                    ) : (
                      "Secure Admin Login / लॉगिन"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* STEP 2: OTP VERIFICATION FORM */
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="bg-blue-50/80 border border-blue-200 rounded-md p-3.5 text-center">
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    We&apos;ve sent a 6-digit code to your registered email.
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Logged as: <span className="font-semibold text-slate-700">{username}</span>
                  </p>
                </div>

                {/* OTP Input Field */}
                <div>
                  <label
                    htmlFor="admin-otp"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-center"
                  >
                    Enter 6-Digit OTP / ओटीपी दर्ज करें <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="admin-otp"
                      name="otp"
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
                      className="w-full py-3 px-4 text-center text-2xl font-mono font-bold tracking-[0.5em] bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-300 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#143E66] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Verify Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
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
                        Verifying OTP...
                      </>
                    ) : (
                      "Verify & Login / सत्यापित करें"
                    )}
                  </button>
                </div>

                {/* Resend OTP & Back options */}
                <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleBackToStep1}
                    className="text-slate-600 hover:text-[#143E66] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back / वापस जाएं</span>
                  </button>

                  <div className="flex items-center">
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
        © {new Date().getFullYear()} Indian Paramedical Board of India. All rights reserved.
      </footer>
    </div>
  );
}
