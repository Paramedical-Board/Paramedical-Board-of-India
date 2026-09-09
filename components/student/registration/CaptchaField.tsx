import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { StudentRegistrationFormData } from "./registrationSchema";

interface Props {
  register: UseFormRegister<StudentRegistrationFormData>;
  errors: FieldErrors<StudentRegistrationFormData>;
  captchaCode: string;
  onRefreshCaptcha: () => void;
}

export default function CaptchaField({
  register,
  errors,
  captchaCode,
  onRefreshCaptcha,
}: Props) {
  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm overflow-hidden mb-6">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-[#143E66] to-[#1E5285] px-5 py-3.5 flex items-center justify-between border-b border-[#0d2a45]">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-[#00031D] font-bold text-xs flex items-center justify-center shadow-xs">
            6
          </span>
          <h2 className="text-white font-bold text-sm sm:text-base tracking-wide uppercase">
            Security Verification & Declaration / सुरक्षा कोड एवं घोषणा
          </h2>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Captcha Block */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 sm:p-5">
          <label className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-2">
            Security Captcha / सुरक्षा कोड <span className="text-[#B13B1C]">*</span>
          </label>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Visual Captcha Box */}
            <div className="flex items-center gap-2">
              <div className="relative px-5 py-2.5 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 rounded select-none shadow-inner border border-slate-600 flex items-center tracking-[0.35em] font-mono text-lg font-extrabold text-[#D4AF37] line-through decoration-[#B13B1C]">
                {captchaCode}
              </div>

              {/* Refresh button */}
              <button
                type="button"
                onClick={onRefreshCaptcha}
                title="Generate new captcha"
                className="p-2 text-slate-600 hover:text-[#143E66] hover:bg-slate-200 rounded transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>

            {/* Input field */}
            <div className="w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Enter 6-character captcha"
                maxLength={6}
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-md transition-colors placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 ${
                  errors.captchaInput
                    ? "border-[#B13B1C] focus:ring-[#B13B1C]/20 focus:border-[#B13B1C]"
                    : "border-slate-300 focus:ring-[#143E66]/20 focus:border-[#143E66]"
                }`}
                {...register("captchaInput")}
              />
              {errors.captchaInput && (
                <p className="text-xs text-[#B13B1C] font-medium mt-1">
                  {errors.captchaInput.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Self Declaration Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-slate-300 text-[#143E66] focus:ring-[#143E66] cursor-pointer"
              {...register("declaration")}
            />
            <span className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
              <strong>Declaration / घोषणा:</strong> I hereby declare that all statements made in this application are true, complete and correct to the best of my knowledge and belief. I understand that in the event of any information being found false or incorrect, my candidature/admission is liable to be cancelled.
            </span>
          </label>
          {errors.declaration && (
            <p className="text-xs text-[#B13B1C] font-medium mt-1.5 ml-7">
              {errors.declaration.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
