import React from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { StudentRegistrationFormData } from "./registrationSchema";
import CourseSelectorDropdown from "@/components/common/CourseSelectorDropdown";

interface Props {
  register: UseFormRegister<StudentRegistrationFormData>;
  errors: FieldErrors<StudentRegistrationFormData>;
  setValue?: UseFormSetValue<StudentRegistrationFormData>;
  watch?: UseFormWatch<StudentRegistrationFormData>;
}

export default function CourseDetailsSection({ register, errors, setValue, watch }: Props) {
  const currentCourse = watch ? watch("course") : "";

  const handleCourseChange = (selected: string) => {
    if (setValue) {
      setValue("course", selected, { shouldValidate: true, shouldDirty: true });
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm mb-6 relative z-20">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-[#143E66] to-[#1E5285] px-5 py-3.5 flex items-center justify-between border-b border-[#0d2a45] rounded-t-lg">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-[#00031D] font-bold text-xs flex items-center justify-center shadow-xs">
            3
          </span>
          <h2 className="text-white font-bold text-sm sm:text-base tracking-wide uppercase">
            Course Selection / पाठ्यक्रम का चयन
          </h2>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div>
          <label className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5">
            Select Course / पाठ्यक्रम चुनें <span className="text-[#B13B1C]">*</span>
          </label>

          {/* Hidden input for react-hook-form registration & validation */}
          <input type="hidden" {...register("course")} />

          {/* Custom Searchable Dropdown */}
          <CourseSelectorDropdown
            value={currentCourse || ""}
            onChange={handleCourseChange}
            hasError={!!errors.course}
            errorMessage={errors.course?.message}
            placeholder="-- Select Course (Diploma / Certificate) --"
            helperText="ℹ Note: Ensure you meet the minimum educational eligibility criteria (10th / 10+2 or equivalent) for the selected diploma or certificate program."
          />
        </div>
      </div>
    </div>
  );
}
