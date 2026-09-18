import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import {
  StudentRegistrationFormData,
  INDIAN_STATES,
  SESSIONS,
} from "./registrationSchema";

interface Props {
  register: UseFormRegister<StudentRegistrationFormData>;
  errors: FieldErrors<StudentRegistrationFormData>;
  isEmailLocked?: boolean;
}

export default function ContactDetailsSection({ register, errors, isEmailLocked = false }: Props) {
  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm overflow-hidden mb-6">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-[#143E66] to-[#1E5285] px-5 py-3.5 flex items-center justify-between border-b border-[#0d2a45]">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-[#00031D] font-bold text-xs flex items-center justify-center shadow-xs">
            2
          </span>
          <h2 className="text-white font-bold text-sm sm:text-base tracking-wide uppercase">
            Contact & Communication Details / संपर्क विवरण
          </h2>
        </div>
      </div>

      <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Mobile Number */}
        <div>
          <label className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5">
            Mobile Number / मोबाइल नंबर <span className="text-[#B13B1C]">*</span>
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 border border-r-0 border-slate-300 rounded-l-md select-none">
              +91
            </span>
            <input
              type="tel"
              maxLength={10}
              placeholder="10-digit mobile number"
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-r-md transition-colors placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 ${
                errors.mobile
                  ? "border-[#B13B1C] focus:ring-[#B13B1C]/20 focus:border-[#B13B1C]"
                  : "border-slate-300 focus:ring-[#143E66]/20 focus:border-[#143E66]"
              }`}
              {...register("mobile")}
            />
          </div>
          {errors.mobile && (
            <p className="text-xs text-[#B13B1C] font-medium mt-1">
              {errors.mobile.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs sm:text-[13px] font-semibold text-slate-800">
              Email Address / ईमेल पता <span className="text-[#B13B1C]">*</span>
            </label>
            {isEmailLocked && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                Verified / सत्यापित
              </span>
            )}
          </div>
          <input
            type="email"
            readOnly={isEmailLocked}
            placeholder="e.g. candidate@example.com"
            className={`w-full px-3.5 py-2.5 text-sm rounded-md transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
              isEmailLocked
                ? "bg-slate-100 text-slate-700 font-medium cursor-not-allowed border-slate-300 select-none shadow-inner"
                : errors.email
                ? "bg-white text-slate-900 border-[#B13B1C] focus:ring-[#B13B1C]/20 focus:border-[#B13B1C]"
                : "bg-white text-slate-900 border-slate-300 focus:ring-[#143E66]/20 focus:border-[#143E66]"
            }`}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-[#B13B1C] font-medium mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Session */}
        <div>
          <label className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5">
            Academic Session / शैक्षणिक सत्र <span className="text-[#B13B1C]">*</span>
          </label>
          <select
            defaultValue={SESSIONS[0]}
            className={`w-full px-3.5 py-2.5 text-base sm:text-sm bg-white border rounded-md transition-colors text-slate-900 focus:outline-none focus:ring-2 cursor-pointer ${
              errors.academic_session
                ? "border-[#B13B1C] focus:ring-[#B13B1C]/20 focus:border-[#B13B1C]"
                : "border-slate-300 focus:ring-[#143E66]/20 focus:border-[#143E66]"
            }`}
            {...register("academic_session")}
          >
            {SESSIONS.map((sess) => (
              <option key={sess} value={sess}>
                {sess}
              </option>
            ))}
          </select>
          {errors.academic_session && (
            <p className="text-xs text-[#B13B1C] font-medium mt-1">
              {errors.academic_session.message}
            </p>
          )}
        </div>

        {/* Full Address */}
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5">
            Correspondence Address / पत्राचार का पता <span className="text-[#B13B1C]">*</span>
          </label>
          <textarea
            rows={2}
            placeholder="House / Flat No., Street, Landmark, Area"
            className={`w-full px-3.5 py-2 text-base sm:text-sm bg-white border rounded-md transition-colors placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 resize-y ${
              errors.address
                ? "border-[#B13B1C] focus:ring-[#B13B1C]/20 focus:border-[#B13B1C]"
                : "border-slate-300 focus:ring-[#143E66]/20 focus:border-[#143E66]"
            }`}
            {...register("address")}
          />
          {errors.address && (
            <p className="text-xs text-[#B13B1C] font-medium mt-1">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* District */}
        <div>
          <label className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5">
            District / जिला <span className="text-[#B13B1C]">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter District Name"
            className={`w-full px-3.5 py-2.5 text-base sm:text-sm bg-white border rounded-md transition-colors placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 ${
              errors.district
                ? "border-[#B13B1C] focus:ring-[#B13B1C]/20 focus:border-[#B13B1C]"
                : "border-slate-300 focus:ring-[#143E66]/20 focus:border-[#143E66]"
            }`}
            {...register("district")}
          />
          {errors.district && (
            <p className="text-xs text-[#B13B1C] font-medium mt-1">
              {errors.district.message}
            </p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5">
            State / राज्य <span className="text-[#B13B1C]">*</span>
          </label>
          <select
            defaultValue=""
            className={`w-full px-3.5 py-2.5 text-base sm:text-sm bg-white border rounded-md transition-colors text-slate-900 focus:outline-none focus:ring-2 cursor-pointer ${
              errors.state
                ? "border-[#B13B1C] focus:ring-[#B13B1C]/20 focus:border-[#B13B1C]"
                : "border-slate-300 focus:ring-[#143E66]/20 focus:border-[#143E66]"
            }`}
            {...register("state")}
          >
            <option value="" disabled>
              -- Select State / UT --
            </option>
            {INDIAN_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-xs text-[#B13B1C] font-medium mt-1">
              {errors.state.message}
            </p>
          )}
        </div>

        {/* Pin Code */}
        <div>
          <label className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5">
            PIN Code / पिन कोड <span className="text-[#B13B1C]">*</span>
          </label>
          <input
            type="text"
            maxLength={6}
            placeholder="6-digit PIN code"
            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-md transition-colors placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 ${
              errors.pincode
                ? "border-[#B13B1C] focus:ring-[#B13B1C]/20 focus:border-[#B13B1C]"
                : "border-slate-300 focus:ring-[#143E66]/20 focus:border-[#143E66]"
            }`}
            {...register("pincode")}
          />
          {errors.pincode && (
            <p className="text-xs text-[#B13B1C] font-medium mt-1">
              {errors.pincode.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
