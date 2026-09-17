"use client";

import React, { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    category: "student",
    fullName: "",
    email: "",
    phone: "",
    rollNo: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg("Please fill in all mandatory fields (Name, Email, and Message).");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to submit inquiry. Please try again.");
        return;
      }

      setSubmittedId(data.id || null);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Inquiry submission error:", err);
      setErrorMsg("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      category: "student",
      fullName: "",
      email: "",
      phone: "",
      rollNo: "",
      subject: "",
      message: "",
    });
    setIsSubmitted(false);
    setErrorMsg("");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 hover:shadow-md transition-shadow">
      <div className="border-b border-slate-100 pb-4 mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#134275]/10 text-[#134275] text-xs font-bold uppercase tracking-wider mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#134275]" />
          Official Communication
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#143E66] tracking-tight">
          Inquiry &amp; Support Form
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Submit your query or official request directly to the board administration.
        </p>
      </div>

      {isSubmitted ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              Inquiry Submitted Successfully!
            </h3>
            {submittedId && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold mt-2 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Reference ID: #{submittedId.slice(0, 8).toUpperCase()}</span>
              </div>
            )}
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
              Thank you for reaching out to the Indian Paramedical Board of India. Your message has been received by our administration.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#134275] text-white text-sm font-semibold hover:bg-[#0E345F] transition-colors shadow-sm"
          >
            Submit Another Inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Inquiry Category */}
          <div>
            <label htmlFor="category" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
              Inquiry Type / विषय श्रेणी <span className="text-rose-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#134275] focus:border-transparent font-medium"
            >
              <option value="student">Student Query (Admit Card / Examination / Results)</option>
              <option value="affiliation">Institutional / College Affiliation Inquiry</option>
              <option value="verification">Document / Marksheet Verification</option>
              <option value="general">General Inquiry / Other</option>
            </select>
          </div>

          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                Full Name / पूरा नाम <span className="text-rose-500">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#134275] focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                Contact Number / संपर्क सूत्र
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#134275] focus:border-transparent"
              />
            </div>
          </div>

          {/* Email & Optional Roll Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                Email Address / ईमेल <span className="text-rose-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#134275] focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="rollNo" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                Roll / Enrollment No. <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="rollNo"
                name="rollNo"
                type="text"
                value={formData.rollNo}
                onChange={handleChange}
                placeholder="For registered students"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#134275] focus:border-transparent"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
              Subject / विषय
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Brief summary of your inquiry"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#134275] focus:border-transparent"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
              Message / विस्तृत विवरण <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="Please describe your query or requirement in detail..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#134275] focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#134275] to-[#0A2545] hover:from-[#0E345F] hover:to-[#081F3B] text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <span>Sending Inquiry...</span>
                </>
              ) : (
                <>
                  <span>Send Inquiry</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
