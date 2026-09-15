"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

interface CollegeItem {
  id: string;
  college_name: string;
  username: string;
  college_code?: string;
  is_active: boolean;
  created_at: string;
}

interface ActiveCredentials {
  id: string;
  college_name: string;
  username: string;
  college_code?: string;
  is_active: boolean;
  created_at: string;
  password?: string;
  source: "register" | "regenerate";
}

export default function AdminCollegesPage() {
  const router = useRouter();
  const successPanelRef = useRef<HTMLDivElement | null>(null);

  // Form State (Register New College)
  const [collegeName, setCollegeName] = useState("");
  const [username, setUsername] = useState("");
  const [collegeCode, setCollegeCode] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Credentials Success Panel State (Reused for Register & Regenerate)
  const [activeCredentials, setActiveCredentials] = useState<ActiveCredentials | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Colleges List State
  const [colleges, setColleges] = useState<CollegeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [tableActionError, setTableActionError] = useState<string | null>(null);

  // Modal State for Regenerate/Custom Password
  const [selectedCollegeForPassword, setSelectedCollegeForPassword] = useState<CollegeItem | null>(null);
  const [customNewPassword, setCustomNewPassword] = useState("");
  const [savingCustomPassword, setSavingCustomPassword] = useState(false);
  const [modalPasswordError, setModalPasswordError] = useState<string | null>(null);

  // Fetch all colleges
  const fetchColleges = useCallback(async () => {
    try {
      setLoading(true);
      setListError(null);
      const res = await fetch("/api/admin/colleges");

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setListError(data.error || "Failed to load colleges");
        return;
      }

      setColleges(data.colleges || []);
    } catch (err) {
      console.error("Error fetching colleges:", err);
      setListError("Network error while loading colleges");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  // Secure Password Generator helper
  const generateRandomPassword = () => {
    const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lower = "abcdefghijkmnopqrstuvwxyz";
    const digits = "23456789";
    const all = upper + lower + digits;

    const array = new Uint32Array(12);
    window.crypto.getRandomValues(array);

    const passwordArr: string[] = [
      upper[array[0] % upper.length],
      lower[array[1] % lower.length],
      digits[array[2] % digits.length],
    ];

    for (let i = 3; i < 12; i++) {
      passwordArr.push(all[array[i] % all.length]);
    }

    // Shuffle using Fisher-Yates
    for (let i = passwordArr.length - 1; i > 0; i--) {
      const j = array[i] % (i + 1);
      const temp = passwordArr[i];
      passwordArr[i] = passwordArr[j];
      passwordArr[j] = temp;
    }

    return passwordArr.join("");
  };

  // Generate for registration form
  const handleGenerateRegistrationPassword = () => {
    const generated = generateRandomPassword();
    setPassword(generated);
    if (formError && password.length < 8) {
      setFormError(null);
    }
  };

  // Generate for password modal
  const handleGenerateModalPassword = () => {
    const generated = generateRandomPassword();
    setCustomNewPassword(generated);
    setModalPasswordError(null);
  };

  // Open Regenerate/Set Password Modal
  const handleOpenPasswordModal = (college: CollegeItem) => {
    setSelectedCollegeForPassword(college);
    // Pre-fill with a fresh generated password for convenience, while allowing full editing/typing
    const generated = generateRandomPassword();
    setCustomNewPassword(generated);
    setModalPasswordError(null);
    setTableActionError(null);
  };

  // Close Password Modal
  const handleClosePasswordModal = () => {
    setSelectedCollegeForPassword(null);
    setCustomNewPassword("");
    setModalPasswordError(null);
    setSavingCustomPassword(false);
  };

  // Submit Password Change from Modal
  const handleSaveModalPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCollegeForPassword) return;

    const trimmed = customNewPassword.trim();
    if (!trimmed) {
      setModalPasswordError("Password cannot be empty.");
      return;
    }

    if (trimmed.length < 8) {
      setModalPasswordError("Password must be at least 8 characters.");
      return;
    }

    try {
      setSavingCustomPassword(true);
      setModalPasswordError(null);

      const res = await fetch(`/api/admin/colleges/${selectedCollegeForPassword.id}/regenerate-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: trimmed }),
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setModalPasswordError(data.error || "Failed to update password.");
        return;
      }

      // Success: Close modal and show in reusable top credentials panel
      handleClosePasswordModal();

      setActiveCredentials({
        ...data.college,
        password: data.password || trimmed,
        source: "regenerate",
      });

      setTimeout(() => {
        successPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } catch (err) {
      console.error("Save modal password error:", err);
      setModalPasswordError("Network error while updating password.");
    } finally {
      setSavingCustomPassword(false);
    }
  };

  // Form Submission for New College Registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setTableActionError(null);

    const trimmedName = collegeName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedUsername || !trimmedPassword) {
      setFormError("All fields are required.");
      return;
    }

    if (trimmedPassword.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/admin/colleges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          college_name: trimmedName,
          username: trimmedUsername,
          password: trimmedPassword,
          college_code: collegeCode.trim() || undefined,
        }),
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Failed to register college");
        return;
      }

      // Show credentials in reusable panel
      setActiveCredentials({
        ...data.college,
        password: data.password || trimmedPassword,
        source: "register",
      });

      // Clear the form
      setCollegeName("");
      setUsername("");
      setCollegeCode("");
      setPassword("");
      setFormError(null);

      // Refresh the colleges list
      fetchColleges();

      // Scroll to credentials panel if needed
      setTimeout(() => {
        successPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    } catch (err) {
      console.error("Registration error:", err);
      setFormError("A network error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Copy to clipboard helper
  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => {
        setCopiedKey((curr) => (curr === key ? null : curr));
      }, 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  // Copy all formatted block
  const handleCopyAll = () => {
    if (!activeCredentials) return;
    const block = `College: ${activeCredentials.college_name}\nUsername: ${activeCredentials.username}\nPassword: ${activeCredentials.password || ""}`;
    copyToClipboard(block, "all");
  };

  // Toggle Active/Inactive status
  const handleToggleStatus = async (college: CollegeItem) => {
    const nextStatus = !college.is_active;
    const actionLabel = nextStatus ? "activate" : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionLabel} "${college.college_name}"?`
    );
    if (!confirmed) return;

    setTableActionError(null);

    try {
      setTogglingId(college.id);
      const res = await fetch(`/api/admin/colleges/${college.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: nextStatus }),
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setTableActionError(data.error || `Failed to ${actionLabel} college`);
        return;
      }

      // Update that row's status in place
      setColleges((prev) =>
        prev.map((c) => (c.id === college.id ? { ...c, is_active: nextStatus } : c))
      );
    } catch (err) {
      console.error(`Toggle status error for ${college.id}:`, err);
      setTableActionError(`Network error while trying to ${actionLabel} college`);
    } finally {
      setTogglingId(null);
    }
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-lg shadow-xs border border-slate-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full mb-2 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Super-Admin Control • Affiliated Institutions
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#00031D] tracking-tight">
              Colleges Management / कॉलेज प्रबंधन
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Register new affiliated colleges, set or regenerate credentials, and control access permissions.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: "Register New College" Form */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 sm:p-8 mb-8">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h2 className="text-lg font-bold text-[#00031D] flex items-center gap-2">
            <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Register New College / नया कॉलेज पंजीकृत करें
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create an official college portal account with username and temporary password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. College Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                College Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g. National Institute of Paramedical Sciences"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#143E66] focus:bg-white transition"
              />
            </div>

            {/* 2. Username */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. nips_delhi"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#143E66] focus:bg-white transition"
              />
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                This will be the college&apos;s login username.
              </p>
            </div>

            {/* 3. College Code */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                College Code (कोड) <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={collegeCode}
                onChange={(e) => setCollegeCode(e.target.value)}
                placeholder="e.g. 07 (Leave blank to auto-generate)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#143E66] focus:bg-white transition"
              />
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Used in registration numbers (e.g. IPMB<strong>01</strong>232401).
              </p>
            </div>

            {/* 4. Password */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password (Visible / Editable) <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateRegistrationPassword}
                  className="text-xs font-bold text-[#143E66] hover:text-[#00031D] flex items-center gap-1 hover:underline transition cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Generate Password
                </button>
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Type password or click Generate (min 8 chars)"
                  required
                  minLength={8}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#143E66] focus:bg-white transition"
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Minimum 8 characters. You can type manually or generate a strong random password.
              </p>
            </div>
          </div>

          {/* Inline Error Message */}
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs font-semibold text-red-700 animate-in fade-in duration-200">
              <svg className="w-4 h-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formError}</span>
            </div>
          )}

          {/* 4. Submit Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#143E66] hover:bg-[#0f2e4d] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Register College
                </>
              )}
            </button>
          </div>
        </form>

        {/* Reusable "Credentials success panel" component (Registration & Password Regeneration) */}
        {activeCredentials && (
          <div
            ref={successPanelRef}
            className="mt-8 bg-emerald-50/70 border-2 border-emerald-500/80 rounded-xl p-5 sm:p-6 shadow-xs animate-in fade-in duration-300"
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-emerald-200/70">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-emerald-950">
                    {activeCredentials.source === "regenerate"
                      ? "Password Successfully Updated / नया पासवर्ड सेट हो गया"
                      : "College Successfully Registered / कॉलेज सफलतापूर्वक पंजीकृत"}
                  </h3>
                  <p className="text-xs text-emerald-800">
                    Copy the login credentials below and securely share them with the college administrator.
                  </p>
                </div>
              </div>

              {/* Copy All Button */}
              <button
                type="button"
                onClick={handleCopyAll}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold shadow-xs transition cursor-pointer"
              >
                {copiedKey === "all" ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Copied All!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span>Copy All</span>
                  </>
                )}
              </button>
            </div>

            {/* Credential rows */}
            <div className="mt-4 space-y-2.5">
              {/* College Name */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-white/80 border border-emerald-200 rounded-lg">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide w-28">College:</span>
                  <span className="text-sm font-bold text-slate-900">{activeCredentials.college_name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(activeCredentials.college_name, "college")}
                  className="self-end sm:self-center px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 rounded border border-emerald-300 transition cursor-pointer"
                >
                  {copiedKey === "college" ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* College Code */}
              {activeCredentials.college_code && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-white/80 border border-emerald-200 rounded-lg">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide w-28">College Code:</span>
                    <span className="text-sm font-mono font-bold text-[#143E66]">{activeCredentials.college_code}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 italic">Used in Registration No</span>
                </div>
              )}

              {/* Username */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-white/80 border border-emerald-200 rounded-lg">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide w-28">Username:</span>
                  <span className="text-sm font-mono font-bold text-slate-900">{activeCredentials.username}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(activeCredentials.username, "username")}
                  className="self-end sm:self-center px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 rounded border border-emerald-300 transition cursor-pointer"
                >
                  {copiedKey === "username" ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* Password */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-white/80 border border-emerald-200 rounded-lg">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide w-28">Password:</span>
                  <span className="text-sm font-mono font-bold text-slate-900">{activeCredentials.password}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(activeCredentials.password || "", "password")}
                  className="self-end sm:self-center px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 rounded border border-emerald-300 transition cursor-pointer"
                >
                  {copiedKey === "password" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Warning Line */}
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-amber-900 bg-amber-50/90 border border-amber-300/80 p-2.5 rounded-lg">
              <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>This password will not be shown again. Copy it now before leaving this page.</span>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: "Registered Colleges" Table / List */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#00031D] flex items-center gap-2">
              <svg className="w-5 h-5 text-[#143E66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Registered Colleges / पंजीकृत कॉलेज सूची
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Official affiliated paramedical colleges with access to the student admission portal.
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-600 bg-slate-50 px-3.5 py-1.5 rounded-lg border border-slate-200 self-start sm:self-center">
            Total Colleges: <strong className="text-slate-900">{colleges.length}</strong>
          </div>
        </div>

        {/* Global/Table Action Error Inline Banner */}
        {tableActionError && (
          <div className="mx-6 mt-6 p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{tableActionError}</span>
            </div>
            <button
              type="button"
              onClick={() => setTableActionError(null)}
              className="text-red-500 hover:text-red-800 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* List Error State */}
        {listError && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{listError}</span>
          </div>
        )}

        {/* Table Content */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-[#143E66] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs font-semibold text-slate-500">Loading colleges...</p>
          </div>
        ) : colleges.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-600">No colleges registered yet.</p>
            <p className="text-xs text-slate-400 mt-1">
              Use the form above to register your first affiliated college.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px] tracking-wider">
                  <th className="py-3 px-4 w-20">Code</th>
                  <th className="py-3 px-4 sm:px-6">College Name</th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Registered On</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {colleges.map((college) => {
                  const isToggling = togglingId === college.id;

                  return (
                    <tr key={college.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#143E66]">
                        <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 rounded text-xs">
                          {college.college_code || "—"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">
                        {college.college_name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {college.username}
                      </td>
                      <td className="py-3.5 px-4">
                        {college.is_active ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        {formatDate(college.created_at)}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* 1. Activate / Deactivate Button */}
                          <button
                            type="button"
                            disabled={isToggling}
                            onClick={() => handleToggleStatus(college)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                              college.is_active
                                ? "bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 hover:border-red-200"
                                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            {isToggling ? (
                              <span className="inline-flex items-center gap-1">
                                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                                Updating...
                              </span>
                            ) : college.is_active ? (
                              "Deactivate"
                            ) : (
                              "Activate"
                            )}
                          </button>

                          {/* 2. Reset / Regenerate Password Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenPasswordModal(college)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 rounded text-xs font-bold transition cursor-pointer"
                            title="Change or regenerate password for this college"
                          >
                            <svg className="w-3 h-3 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                            Reset Password
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog: Reset / Set College Password */}
      {selectedCollegeForPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#00031D] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#D4AF37]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#143E66] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Reset College Password / पासवर्ड बदलें
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Set a custom password or auto-generate a new one.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClosePasswordModal}
                disabled={savingCustomPassword}
                className="text-slate-400 hover:text-white text-lg font-bold transition p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveModalPassword} className="p-6 space-y-5">
              {/* College Info Summary */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-500 uppercase tracking-wide w-20">College:</span>
                  <span className="font-bold text-slate-900">{selectedCollegeForPassword.college_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-500 uppercase tracking-wide w-20">Username:</span>
                  <span className="font-mono font-semibold text-slate-700">{selectedCollegeForPassword.username}</span>
                </div>
              </div>

              {/* Password Input & Generator */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    New Password (Visible) <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateModalPassword}
                    className="text-xs font-bold text-[#143E66] hover:text-[#00031D] flex items-center gap-1 hover:underline transition cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  value={customNewPassword}
                  onChange={(e) => {
                    setCustomNewPassword(e.target.value);
                    if (modalPasswordError) setModalPasswordError(null);
                  }}
                  placeholder="Type custom password or click Auto-Generate"
                  required
                  minLength={8}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#143E66] focus:bg-white transition"
                  autoFocus
                />
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  Type any password you want (minimum 8 characters) or click &apos;Auto-Generate&apos;.
                </p>
              </div>

              {/* Warning Notice */}
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-xs text-amber-900">
                <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>This will overwrite the college&apos;s current password immediately.</span>
              </div>

              {/* Modal Error State */}
              {modalPasswordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{modalPasswordError}</span>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClosePasswordModal}
                  disabled={savingCustomPassword}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCustomPassword || customNewPassword.trim().length < 8}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#143E66] hover:bg-[#0f2e4d] disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold shadow-sm transition cursor-pointer"
                >
                  {savingCustomPassword ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Set New Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
