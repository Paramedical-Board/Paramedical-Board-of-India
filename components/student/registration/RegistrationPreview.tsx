import React from "react";
import Image from "next/image";
import { StudentRegistrationFormData } from "./registrationSchema";

interface Props {
  formData: StudentRegistrationFormData;
  onEdit: () => void;
  onConfirm: () => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  submitErrorDetails?: Record<string, any> | null;
}

export default function RegistrationPreview({
  formData,
  onEdit,
  onConfirm,
  isSubmitting,
  submitError,
  submitErrorDetails,
}: Props) {
  return (
    <div className="w-full space-y-6">
      {/* Instructions / Notice */}
      <div className="bg-[#FFF9E6] border-l-4 border-[#D4AF37] p-4 rounded-r-md shadow-xs text-xs sm:text-sm text-slate-800">
        <h4 className="font-bold text-[#00031D] mb-1 flex items-center gap-1.5">
          <svg className="w-4 h-4 text-[#B13B1C]" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          Review Your Application / अपने आवेदन की समीक्षा करें:
        </h4>
        <p className="text-slate-700">
          Please verify all details carefully before final submission. Click <strong>Edit / संपादित करें</strong> to make changes or <strong>Confirm Submission / पुष्टि करें</strong> to finalize your registration.
        </p>
      </div>

      {/* Inline Error Alert if submission failed */}
      {submitError && (
        <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded-r-md shadow-xs">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-red-900">
                Submission Failed / पंजीकरण विफल
              </h4>
              <p className="text-xs text-red-700 mt-1">{submitError}</p>
              {submitErrorDetails && (
                <pre className="mt-2 p-2 bg-red-100 text-red-800 text-[11px] rounded font-mono overflow-x-auto">
                  {JSON.stringify(submitErrorDetails, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 1. Personal Details Review */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#143E66] to-[#1E5285] px-5 py-3 border-b border-[#0d2a45]">
          <h3 className="text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#00031D] font-bold text-xs flex items-center justify-center">
              1
            </span>
            Personal Details / व्यक्तिगत विवरण
          </h3>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div>
            <span className="text-slate-500 block text-xs">Candidate Name / अभ्यर्थी का नाम</span>
            <span className="font-semibold text-slate-900">{formData.candidate_name || "—"}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">Father's Name / पिता का नाम</span>
            <span className="font-semibold text-slate-900">{formData.father_name || "—"}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">Mother's Name / माता का नाम</span>
            <span className="font-semibold text-slate-900">{formData.mother_name || "—"}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">Date of Birth / जन्म तिथि</span>
            <span className="font-semibold text-slate-900">{formData.dob || "—"}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">Category / श्रेणी</span>
            <span className="font-semibold text-slate-900">{formData.category || "—"}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">Gender / लिंग</span>
            <span className="font-semibold text-slate-900">{formData.gender || "—"}</span>
          </div>
        </div>
      </div>

      {/* 2. Contact Details Review */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#143E66] to-[#1E5285] px-5 py-3 border-b border-[#0d2a45]">
          <h3 className="text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#00031D] font-bold text-xs flex items-center justify-center">
              2
            </span>
            Contact & Communication Details / संपर्क विवरण
          </h3>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div>
            <span className="text-slate-500 block text-xs">Mobile Number / मोबाइल नंबर</span>
            <span className="font-semibold text-slate-900">+91 {formData.mobile || "—"}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">Email Address / ईमेल पता</span>
            <span className="font-semibold text-slate-900">{formData.email || "—"}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">Academic Session / शैक्षणिक सत्र</span>
            <span className="font-semibold text-slate-900">{formData.academic_session || "—"}</span>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <span className="text-slate-500 block text-xs">Correspondence Address / पत्राचार का पता</span>
            <span className="font-semibold text-slate-900">{formData.address || "—"}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">District / जिला</span>
            <span className="font-semibold text-slate-900">{formData.district || "—"}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">State / राज्य</span>
            <span className="font-semibold text-slate-900">{formData.state || "—"}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">PIN Code / पिन कोड</span>
            <span className="font-semibold text-slate-900">{formData.pincode || "—"}</span>
          </div>
        </div>
      </div>

      {/* 3. Course Details Review */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#143E66] to-[#1E5285] px-5 py-3 border-b border-[#0d2a45]">
          <h3 className="text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#00031D] font-bold text-xs flex items-center justify-center">
              3
            </span>
            Course Selection / पाठ्यक्रम का चयन
          </h3>
        </div>
        <div className="p-5 text-xs sm:text-sm">
          <span className="text-slate-500 block text-xs">Selected Paramedical Program / चयनित पाठ्यक्रम</span>
          <span className="font-bold text-[#143E66] text-sm sm:text-base mt-0.5 block">
            {formData.course || "—"}
          </span>
        </div>
      </div>

      {/* 4. Education Review */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#143E66] to-[#1E5285] px-5 py-3 border-b border-[#0d2a45]">
          <h3 className="text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#00031D] font-bold text-xs flex items-center justify-center">
              4
            </span>
            Educational Qualifications / शैक्षणिक योग्यता
          </h3>
        </div>
        <div className="p-4 sm:p-5 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px] text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#EBF4FA] border-b border-slate-300 font-bold text-[#00031D]">
                <th className="py-2.5 px-3">Examination</th>
                <th className="py-2.5 px-3">Board / University</th>
                <th className="py-2.5 px-3">Year</th>
                <th className="py-2.5 px-3">Total</th>
                <th className="py-2.5 px-3">Obtained</th>
                <th className="py-2.5 px-3">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800">High School (10th)</td>
                <td className="py-2.5 px-3 text-slate-700">{formData.education.high_school.board}</td>
                <td className="py-2.5 px-3 text-slate-700">{formData.education.high_school.year}</td>
                <td className="py-2.5 px-3 text-slate-700">{formData.education.high_school.total}</td>
                <td className="py-2.5 px-3 text-slate-700">{formData.education.high_school.obtained}</td>
                <td className="py-2.5 px-3 font-bold text-[#143E66]">{formData.education.high_school.percentage}%</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800">Intermediate (12th / 10+2)</td>
                <td className="py-2.5 px-3 text-slate-700">{formData.education.intermediate.board}</td>
                <td className="py-2.5 px-3 text-slate-700">{formData.education.intermediate.year}</td>
                <td className="py-2.5 px-3 text-slate-700">{formData.education.intermediate.total}</td>
                <td className="py-2.5 px-3 text-slate-700">{formData.education.intermediate.obtained}</td>
                <td className="py-2.5 px-3 font-bold text-[#143E66]">{formData.education.intermediate.percentage}%</td>
              </tr>
              {formData.education.graduation?.board && (
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Graduation</td>
                  <td className="py-2.5 px-3 text-slate-700">{formData.education.graduation.board}</td>
                  <td className="py-2.5 px-3 text-slate-700">{formData.education.graduation.year || "—"}</td>
                  <td className="py-2.5 px-3 text-slate-700">{formData.education.graduation.total || "—"}</td>
                  <td className="py-2.5 px-3 text-slate-700">{formData.education.graduation.obtained || "—"}</td>
                  <td className="py-2.5 px-3 font-bold text-[#143E66]">{formData.education.graduation.percentage ? `${formData.education.graduation.percentage}%` : "—"}</td>
                </tr>
              )}
              {formData.education.other?.board && (
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Other / Diploma</td>
                  <td className="py-2.5 px-3 text-slate-700">{formData.education.other.board}</td>
                  <td className="py-2.5 px-3 text-slate-700">{formData.education.other.year || "—"}</td>
                  <td className="py-2.5 px-3 text-slate-700">{formData.education.other.total || "—"}</td>
                  <td className="py-2.5 px-3 text-slate-700">{formData.education.other.obtained || "—"}</td>
                  <td className="py-2.5 px-3 font-bold text-[#143E66]">{formData.education.other.percentage ? `${formData.education.other.percentage}%` : "—"}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Documents & Photographs Upload Review */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#143E66] to-[#1E5285] px-5 py-3 border-b border-[#0d2a45]">
          <h3 className="text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#00031D] font-bold text-xs flex items-center justify-center">
              5
            </span>
            Uploaded Documents & Photographs / अपलोड किए गए दस्तावेज़ एवं फोटो
          </h3>
        </div>
        <div className="p-5 space-y-5">
          {/* Photos & Signatures Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col items-center">
              <span className="text-xs font-semibold text-slate-700 mb-2">Passport Photo / फोटो</span>
              {formData.photo_url ? (
                <div className="relative w-24 h-28 border border-slate-300 rounded overflow-hidden bg-white shadow-xs">
                  <Image
                    src={formData.photo_url}
                    alt="Candidate Photo"
                    fill
                    className="object-contain p-1"
                    unoptimized
                  />
                </div>
              ) : (
                <span className="text-xs text-red-500">Not Uploaded</span>
              )}
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col items-center">
              <span className="text-xs font-semibold text-slate-700 mb-2">Signature / हस्ताक्षर</span>
              {formData.signature_url ? (
                <div className="relative w-44 h-16 border border-slate-300 rounded overflow-hidden bg-white shadow-xs">
                  <Image
                    src={formData.signature_url}
                    alt="Candidate Signature"
                    fill
                    className="object-contain p-1"
                    unoptimized
                  />
                </div>
              ) : (
                <span className="text-xs text-red-500">Not Uploaded</span>
              )}
            </div>
          </div>

          {/* Academic & Identity Documents Status */}
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Document Upload Status / दस्तावेज़ स्थिति:
            </h4>
            
            {/* Aadhaar */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              {formData.aadhaar_url ? (
                <span className="text-emerald-700 font-medium">
                  ✅ Aadhaar Card uploaded / आधार कार्ड अपलोड हो गया
                </span>
              ) : (
                <span className="text-red-600 font-medium">
                  ❌ Aadhaar Card not uploaded / आधार कार्ड अपलोड नहीं हुआ
                </span>
              )}
            </div>

            {/* 10th Marksheet */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              {formData.marksheet_10th_url ? (
                <span className="text-emerald-700 font-medium">
                  ✅ 10th Marksheet uploaded / 10वीं की अंकतालिका अपलोड हो गई
                </span>
              ) : (
                <span className="text-red-600 font-medium">
                  ❌ 10th Marksheet not uploaded / 10वीं की अंकतालिका अपलोड नहीं हुई
                </span>
              )}
            </div>

            {/* 12th Marksheet */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              {formData.marksheet_12th_url ? (
                <span className="text-emerald-700 font-medium">
                  ✅ 12th Marksheet uploaded / 12वीं की अंकतालिका अपलोड हो गई
                </span>
              ) : (
                <span className="text-red-600 font-medium">
                  ❌ 12th Marksheet not uploaded / 12वीं की अंकतालिका अपलोड नहीं हुई
                </span>
              )}
            </div>

            {/* Affidavit */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              {formData.affidavit_url ? (
                <span className="text-emerald-700 font-medium">
                  ✅ Affidavit uploaded / शपथ पत्र अपलोड हो गया
                </span>
              ) : (
                <span className="text-red-600 font-medium">
                  ❌ Affidavit not uploaded / शपथ पत्र अपलोड नहीं हुआ
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Inline Error Alert if submission failed */}
      {submitError && (
        <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded-r-md shadow-xs">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-red-900">
                Submission Failed / पंजीकरण विफल
              </h4>
              <p className="text-xs text-red-700 mt-1">{submitError}</p>
              {submitErrorDetails && (
                <pre className="mt-2 p-2 bg-red-100 text-red-800 text-[11px] rounded font-mono overflow-x-auto">
                  {JSON.stringify(submitErrorDetails, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons: Edit and Confirm Submission */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onEdit}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-3 border-2 border-[#143E66] text-[#143E66] hover:bg-[#143E66] hover:text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded transition-colors cursor-pointer disabled:opacity-50"
        >
          Edit / संपादित करें
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3 bg-[#B13B1C] hover:bg-[#962f14] disabled:bg-slate-400 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting Registration...
            </>
          ) : (
            "Confirm Submission / पुष्टि करें"
          )}
        </button>
      </div>
    </div>
  );
}
