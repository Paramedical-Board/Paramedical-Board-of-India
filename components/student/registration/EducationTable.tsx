import React from "react";
import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from "react-hook-form";
import { StudentRegistrationFormData } from "./registrationSchema";

interface Props {
  register: UseFormRegister<StudentRegistrationFormData>;
  watch: UseFormWatch<StudentRegistrationFormData>;
  setValue: UseFormSetValue<StudentRegistrationFormData>;
  errors: FieldErrors<StudentRegistrationFormData>;
}

type EducationKey = "high_school" | "intermediate" | "graduation" | "other";

interface EducationRowDef {
  key: EducationKey;
  levelTitle: string;
  hindiTitle: string;
  required: boolean;
}

const ROWS: EducationRowDef[] = [
  {
    key: "high_school",
    levelTitle: "High School (10th)",
    hindiTitle: "हाई स्कूल",
    required: true,
  },
  {
    key: "intermediate",
    levelTitle: "Intermediate (12th / 10+2)",
    hindiTitle: "इंटरमीडिएट",
    required: true,
  },
  {
    key: "graduation",
    levelTitle: "Graduation",
    hindiTitle: "स्नातक",
    required: false,
  },
  {
    key: "other",
    levelTitle: "Other / Diploma",
    hindiTitle: "अन्य / डिप्लोमा",
    required: false,
  },
];

export default function EducationTable({ register, watch, setValue, errors }: Props) {
  // Handle auto-percentage calculation when obtained or total marks change
  const handleMarksChange = (
    key: EducationKey,
    type: "obtained" | "total",
    val: string
  ) => {
    const rawObtained = type === "obtained" ? parseFloat(val) : parseFloat(String(watch(`education.${key}.obtained`) || "0"));
    const rawTotal = type === "total" ? parseFloat(val) : parseFloat(String(watch(`education.${key}.total`) || "0"));

    if (!isNaN(rawObtained) && !isNaN(rawTotal) && rawTotal > 0 && rawObtained <= rawTotal) {
      const pct = parseFloat(((rawObtained / rawTotal) * 100).toFixed(2));
      setValue(`education.${key}.percentage`, pct, { shouldValidate: true });
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm overflow-hidden mb-6">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-[#143E66] to-[#1E5285] px-5 py-3.5 flex items-center justify-between border-b border-[#0d2a45]">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-[#00031D] font-bold text-xs flex items-center justify-center shadow-xs">
            4
          </span>
          <h2 className="text-white font-bold text-sm sm:text-base tracking-wide uppercase">
            Educational Qualifications / शैक्षणिक योग्यता
          </h2>
        </div>
        <span className="text-[11px] font-medium text-[#C2DCED] hidden sm:inline-block">
          High School & Intermediate are compulsory
        </span>
      </div>

      <div className="p-4 sm:p-6">
        {/* Desktop & Tablet Table View */}
        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#EBF4FA] border-b border-slate-300 text-[12.5px] font-bold text-[#00031D] uppercase">
                <th className="py-3 px-3.5 w-[22%]">Examination / परीक्षा</th>
                <th className="py-3 px-3.5 w-[28%]">Board / University</th>
                <th className="py-3 px-3.5 w-[15%]">Passing Year (YYYY)</th>
                <th className="py-3 px-3.5 w-[12%]">Total Marks</th>
                <th className="py-3 px-3.5 w-[12%]">Obtain Marks</th>
                <th className="py-3 px-3.5 w-[11%]">Percentage %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {ROWS.map((row) => (
                <tr key={row.key} className="hover:bg-slate-50/70 transition-colors">
                  {/* Exam Label */}
                  <td className="py-3 px-3.5 bg-slate-50/50">
                    <div className="font-semibold text-slate-800 text-xs sm:text-[13px]">
                      {row.levelTitle} {row.required && <span className="text-[#B13B1C]">*</span>}
                    </div>
                    <div className="text-[11px] text-slate-500">{row.hindiTitle}</div>
                  </td>

                  {/* Board / University */}
                  <td className="py-2.5 px-2.5">
                    <input
                      type="text"
                      placeholder="e.g. CBSE / UP Board / State Board"
                      className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#143E66] focus:border-[#143E66] placeholder:text-slate-400 text-slate-900"
                      {...register(`education.${row.key}.board`)}
                    />
                    {errors.education?.[row.key]?.board && (
                      <span className="text-[11px] text-[#B13B1C] block mt-0.5">
                        {errors.education[row.key]?.board?.message}
                      </span>
                    )}
                  </td>

                  {/* Passing Year */}
                  <td className="py-2.5 px-2.5">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="YYYY"
                      className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#143E66] focus:border-[#143E66] placeholder:text-slate-400 text-slate-900"
                      {...register(`education.${row.key}.year`)}
                    />
                    {errors.education?.[row.key]?.year && (
                      <span className="text-[11px] text-[#B13B1C] block mt-0.5">
                        {errors.education[row.key]?.year?.message}
                      </span>
                    )}
                  </td>

                  {/* Total Marks */}
                  <td className="py-2.5 px-2.5">
                    <input
                      type="number"
                      min={0}
                      placeholder="Total"
                      className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#143E66] focus:border-[#143E66] placeholder:text-slate-400 text-slate-900"
                      {...register(`education.${row.key}.total`, {
                        onChange: (e) => handleMarksChange(row.key, "total", e.target.value),
                      })}
                    />
                    {errors.education?.[row.key]?.total && (
                      <span className="text-[11px] text-[#B13B1C] block mt-0.5">
                        {errors.education[row.key]?.total?.message}
                      </span>
                    )}
                  </td>

                  {/* Obtain Marks */}
                  <td className="py-2.5 px-2.5">
                    <input
                      type="number"
                      min={0}
                      placeholder="Obtained"
                      className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#143E66] focus:border-[#143E66] placeholder:text-slate-400 text-slate-900"
                      {...register(`education.${row.key}.obtained`, {
                        onChange: (e) => handleMarksChange(row.key, "obtained", e.target.value),
                      })}
                    />
                    {errors.education?.[row.key]?.obtained && (
                      <span className="text-[11px] text-[#B13B1C] block mt-0.5">
                        {errors.education[row.key]?.obtained?.message}
                      </span>
                    )}
                  </td>

                  {/* Percentage */}
                  <td className="py-2.5 px-2.5">
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="%"
                        className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-slate-50/80 font-medium border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#143E66] focus:border-[#143E66] text-slate-900"
                        {...register(`education.${row.key}.percentage`)}
                      />
                    </div>
                    {errors.education?.[row.key]?.percentage && (
                      <span className="text-[11px] text-[#B13B1C] block mt-0.5">
                        {errors.education[row.key]?.percentage?.message}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {errors.education && (
          <p className="text-xs text-[#B13B1C] font-medium mt-2">
            Please fill in valid educational qualification details for High School & Intermediate.
          </p>
        )}
      </div>
    </div>
  );
}
