import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import {
  StudentRegistrationFormData,
  PARAMEDICAL_COURSES,
} from "./registrationSchema";

interface Props {
  register: UseFormRegister<StudentRegistrationFormData>;
  errors: FieldErrors<StudentRegistrationFormData>;
}

export default function CourseDetailsSection({ register, errors }: Props) {
  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm overflow-hidden mb-6">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-[#143E66] to-[#1E5285] px-5 py-3.5 flex items-center justify-between border-b border-[#0d2a45]">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-[#00031D] font-bold text-xs flex items-center justify-center shadow-xs">
            3
          </span>
          <h2 className="text-white font-bold text-sm sm:text-base tracking-wide uppercase">
            Course Selection / पाठ्यक्रम का चयन
          </h2>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div>
          <label className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5">
            Select Course / पाठ्यक्रम चुनें <span className="text-[#B13B1C]">*</span>
          </label>
          <select
            defaultValue=""
            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-md transition-colors text-slate-900 focus:outline-none focus:ring-2 cursor-pointer ${
              errors.course
                ? "border-[#B13B1C] focus:ring-[#B13B1C]/20 focus:border-[#B13B1C]"
                : "border-slate-300 focus:ring-[#143E66]/20 focus:border-[#143E66]"
            }`}
            {...register("course")}
          >
            <option value="" disabled>
              -- Select Desired Paramedical Diploma / Certificate Program --
            </option>
            {PARAMEDICAL_COURSES.map((crs) => (
              <option key={crs} value={crs}>
                {crs}
              </option>
            ))}
          </select>
          {errors.course && (
            <p className="text-xs text-[#B13B1C] font-medium mt-1">
              {errors.course.message}
            </p>
          )}
          <p className="text-[11px] text-slate-500 mt-2">
            ℹ Note: Ensure you meet the minimum educational eligibility criteria (10+2 with PCB/PCM or equivalent) for the selected diploma program.
          </p>
        </div>
      </div>
    </div>
  );
}
