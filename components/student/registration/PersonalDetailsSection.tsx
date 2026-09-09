import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { StudentRegistrationFormData, CATEGORIES, GENDERS } from "./registrationSchema";

interface Props {
  register: UseFormRegister<StudentRegistrationFormData>;
  errors: FieldErrors<StudentRegistrationFormData>;
}

export default function PersonalDetailsSection({ register, errors }: Props) {
  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm overflow-hidden mb-6">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-[#143E66] to-[#1E5285] px-5 py-3.5 flex items-center justify-between border-b border-[#0d2a45]">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-[#00031D] font-bold text-xs flex items-center justify-center shadow-xs">
            1
          </span>
          <h2 className="text-white font-bold text-sm sm:text-base tracking-wide uppercase">
            Personal Details / व्यक्तिगत विवरण
          </h2>
        </div>
        <span className="text-[11px] font-medium text-[#C2DCED] hidden sm:inline-block">
          All fields marked with <span className="text-[#FF8A65] font-bold">*</span> are mandatory
        </span>
      </div>

      <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Candidate Name */}
        <div>
          <label className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5">
            Candidate Name / अभ्यर्थी का नाम <span className="text-[#B13B1C]">*</span>
          </label>
          <input
            type="text"
            placeholder="As per High School Certificate"
            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-md transition-colors placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 ${
              errors.candidate_name
                ? "border-[#B13B1C] focus:ring-[#B13B1C]/20 focus:border-[#B13B1C]"
                : "border-slate-300 focus:ring-[#143E66]/20 focus:border-[#143E66]"
            }`}
            {...register("candidate_name")}
          />
          {errors.candidate_name && (
            <p className="text-xs text-[#B13B1C] font-medium mt-1">
              {errors.candidate_name.message}
            </p>
          )}
        </div>

        {/* Father's Name */}
        <div>
          <label className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5">
            Father's Name / पिता का नाम <span className="text-[#B13B1C]">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Father's Name"
            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-md transition-colors placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 ${
              errors.father_name
                ? "border-[#B13B1C] focus:ring-[#B13B1C]/20 focus:border-[#B13B1C]"
                : "border-slate-300 focus:ring-[#143E66]/20 focus:border-[#143E66]"
            }`}
            {...register("father_name")}
          />
          {errors.father_name && (
            <p className="text-xs text-[#B13B1C] font-medium mt-1">
              {errors.father_name.message}
            </p>
          )}
        </div>

        {/* Mother's Name */}
        <div>
          <label className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5">
            Mother's Name / माता का नाम <span className="text-[#B13B1C]">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Mother's Name"
            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-md transition-colors placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 ${
              errors.mother_name
                ? "border-[#B13B1C] focus:ring-[#B13B1C]/20 focus:border-[#B13B1C]"
                : "border-slate-300 focus:ring-[#143E66]/20 focus:border-[#143E66]"
            }`}
            {...register("mother_name")}
          />
          {errors.mother_name && (
            <p className="text-xs text-[#B13B1C] font-medium mt-1">
              {errors.mother_name.message}
            </p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5">
            Date of Birth / जन्म तिथि <span className="text-[#B13B1C]">*</span>
          </label>
          <input
            type="date"
            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-md transition-colors text-slate-900 focus:outline-none focus:ring-2 ${
              errors.dob
                ? "border-[#B13B1C] focus:ring-[#B13B1C]/20 focus:border-[#B13B1C]"
                : "border-slate-300 focus:ring-[#143E66]/20 focus:border-[#143E66]"
            }`}
            {...register("dob")}
          />
          {errors.dob && (
            <p className="text-xs text-[#B13B1C] font-medium mt-1">
              {errors.dob.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5">
            Category / श्रेणी <span className="text-[#B13B1C]">*</span>
          </label>
          <select
            defaultValue=""
            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-md transition-colors text-slate-900 focus:outline-none focus:ring-2 cursor-pointer ${
              errors.category
                ? "border-[#B13B1C] focus:ring-[#B13B1C]/20 focus:border-[#B13B1C]"
                : "border-slate-300 focus:ring-[#143E66]/20 focus:border-[#143E66]"
            }`}
            {...register("category")}
          >
            <option value="" disabled>
              -- Select Category --
            </option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-[#B13B1C] font-medium mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5">
            Gender / लिंग <span className="text-[#B13B1C]">*</span>
          </label>
          <select
            defaultValue=""
            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-md transition-colors text-slate-900 focus:outline-none focus:ring-2 cursor-pointer ${
              errors.gender
                ? "border-[#B13B1C] focus:ring-[#B13B1C]/20 focus:border-[#B13B1C]"
                : "border-slate-300 focus:ring-[#143E66]/20 focus:border-[#143E66]"
            }`}
            {...register("gender")}
          >
            <option value="" disabled>
              -- Select Gender --
            </option>
            {GENDERS.map((gen) => (
              <option key={gen.value} value={gen.value}>
                {gen.label}
              </option>
            ))}
          </select>
          {errors.gender && (
            <p className="text-xs text-[#B13B1C] font-medium mt-1">
              {errors.gender.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
