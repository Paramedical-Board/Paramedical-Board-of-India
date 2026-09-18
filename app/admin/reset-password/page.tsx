"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="space-y-5 text-center">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-900">
          <div className="w-10 h-10 mx-auto mb-2 text-red-600 flex items-center justify-center rounded-full bg-red-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-sm font-semibold mb-1">Invalid Reset Link</p>
          <p className="text-xs text-red-700 leading-relaxed">
            The reset token is missing from your link. Please request a new password reset link.
          </p>
          <p className="text-[11px] text-red-600 mt-2 border-t border-red-200/60 pt-2">
            अमान्य रीसेट लिंक। कृपया एक नया पासवर्ड रीसेट लिंक का अनुरोध करें।
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/admin/forgot-password"
            className="w-full inline-flex py-2.5 px-4 bg-[#143E66] hover:bg-[#0d2a45] active:bg-[#00031D] text-white text-sm font-bold uppercase tracking-wider rounded shadow-md hover:shadow-lg transition-all items-center justify-center gap-2"
          >
            Request New Link / नया लिंक अनुरोध करें
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields. / कृपया दोनों पासवर्ड फ़ील्ड भरें।");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long. / पासवर्ड कम से कम 8 वर्णों का होना चाहिए।");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. / पासवर्ड मेल नहीं खाते।");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to reset password. The link may have expired or already been used.");
        return;
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Reset password error:", err);
      setError("Network error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-5 text-center">
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900">
          <div className="w-10 h-10 mx-auto mb-2 text-emerald-600 flex items-center justify-center rounded-full bg-emerald-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-semibold mb-1">
            Password Reset Successful!
          </p>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Your admin password has been updated successfully. Please log in with your new password.
          </p>
          <p className="text-[11px] text-emerald-700 mt-2 border-t border-emerald-200/60 pt-2">
            आपका पासवर्ड सफलतापूर्वक बदल दिया गया है। कृपया नए पासवर्ड के साथ लॉगिन करें।
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/admin/login"
            className="w-full inline-flex py-2.5 px-4 bg-[#143E66] hover:bg-[#0d2a45] active:bg-[#00031D] text-white text-sm font-bold uppercase tracking-wider rounded shadow-md hover:shadow-lg transition-all items-center justify-center gap-2"
          >
            Go to Login / लॉगिन पर जाएं
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3.5 bg-red-50 border-l-4 border-red-500 rounded-r text-red-800 text-xs sm:text-sm flex items-start gap-2.5">
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

      {/* New Password Field */}
      <div>
        <label
          htmlFor="new-password"
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          New Password / नया पासवर्ड <span className="text-red-500">*</span>
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
            id="new-password"
            name="newPassword"
            type="password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min. 8 characters"
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#143E66] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Confirm Password Field */}
      <div>
        <label
          htmlFor="confirm-password"
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          Confirm Password / पासवर्ड की पुष्टि करें <span className="text-red-500">*</span>
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
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
              Updating Password...
            </>
          ) : (
            "Reset Password / पासवर्ड रीसेट करें"
          )}
        </button>
      </div>

      {/* Link back to login */}
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
  );
}

export default function ResetPasswordPage() {
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-wide uppercase">
              Set New Password
            </h2>
            <p className="text-xs text-[#C2DCED] mt-1 font-medium">
              नया पासवर्ड सेट करें
            </p>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-8">
            <Suspense fallback={
              <div className="py-8 text-center text-slate-500 text-sm">
                Loading password reset...
              </div>
            }>
              <ResetPasswordForm />
            </Suspense>

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
