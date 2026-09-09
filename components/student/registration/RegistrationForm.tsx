"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  studentRegistrationSchema,
  StudentRegistrationFormData,
  RegistrationPayload,
} from "./registrationSchema";
import PersonalDetailsSection from "./PersonalDetailsSection";
import ContactDetailsSection from "./ContactDetailsSection";
import CourseDetailsSection from "./CourseDetailsSection";
import EducationTable from "./EducationTable";
import FileUploadField from "./FileUploadField";
import CaptchaField from "./CaptchaField";
import RegistrationPreview from "./RegistrationPreview";

export default function RegistrationForm() {
  const [view, setView] = useState<"form" | "preview" | "success">("form");
  const [isFinalSubmitting, setIsFinalSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitErrorDetails, setSubmitErrorDetails] = useState<Record<string, any> | null>(null);
  const [successData, setSuccessData] = useState<{
    registration_no: string;
    candidate_name: string;
    course: string;
  } | null>(null);

  // Captcha Generator State
  const [captchaCode, setCaptchaCode] = useState<string>("7K9X2B");

  const generateCaptcha = useCallback(() => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
  }, []);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<StudentRegistrationFormData>({
    resolver: zodResolver(studentRegistrationSchema),
    defaultValues: {
      academic_session: "2026-2027",
      declaration: false,
      education: {
        high_school: { board: "", year: "", total: "" as any, obtained: "" as any, percentage: "" as any },
        intermediate: { board: "", year: "", total: "" as any, obtained: "" as any, percentage: "" as any },
        graduation: { board: "", year: "", total: "" as any, obtained: "" as any, percentage: "" as any },
        other: { board: "", year: "", total: "" as any, obtained: "" as any, percentage: "" as any },
      },
    },
  });

  const photoUrl = watch("photo_url");
  const signatureUrl = watch("signature_url");
  const aadhaarUrl = watch("aadhaar_url");
  const marksheet10thUrl = watch("marksheet_10th_url");
  const marksheet12thUrl = watch("marksheet_12th_url");

  // "Submit Registration" button stays disabled until all 5 URL fields are populated
  const allUploadsComplete = Boolean(
    photoUrl && signatureUrl && aadhaarUrl && marksheet10thUrl && marksheet12thUrl
  );

  // Task 3: On "Submit Registration" click -> Validation -> Switch to Preview
  const onSubmitForm = (data: StudentRegistrationFormData) => {
    // Verify captcha
    if (data.captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setError("captchaInput", {
        type: "manual",
        message: "Captcha does not match. Please enter the correct code. / सुरक्षा कोड सही नहीं है।",
      });
      generateCaptcha();
      return;
    }

    setSubmitError(null);
    setSubmitErrorDetails(null);
    setView("preview");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Task 4: Confirm submission click -> POST /api/student/registration
  const handleConfirmSubmission = async () => {
    if (isFinalSubmitting) return;

    setIsFinalSubmitting(true);
    setSubmitError(null);
    setSubmitErrorDetails(null);

    try {
      const formValues = watch();

      // Clean up payload shape to match RegistrationPayload
      const payload: RegistrationPayload = {
        candidate_name: formValues.candidate_name,
        father_name: formValues.father_name,
        mother_name: formValues.mother_name,
        dob: formValues.dob,
        category: formValues.category,
        gender: formValues.gender,
        mobile: formValues.mobile,
        email: formValues.email,
        academic_session: formValues.academic_session,
        address: formValues.address,
        district: formValues.district,
        state: formValues.state,
        pincode: formValues.pincode,
        course: formValues.course,
        education: {
          high_school: {
            board: formValues.education.high_school.board,
            year: formValues.education.high_school.year,
            total: Number(formValues.education.high_school.total),
            obtained: Number(formValues.education.high_school.obtained),
            percentage: Number(formValues.education.high_school.percentage),
          },
          intermediate: {
            board: formValues.education.intermediate.board,
            year: formValues.education.intermediate.year,
            total: Number(formValues.education.intermediate.total),
            obtained: Number(formValues.education.intermediate.obtained),
            percentage: Number(formValues.education.intermediate.percentage),
          },
        },
        photo_url: formValues.photo_url,
        signature_url: formValues.signature_url,
        aadhaar_url: formValues.aadhaar_url,
        marksheet_10th_url: formValues.marksheet_10th_url,
        marksheet_12th_url: formValues.marksheet_12th_url,
      };

      // Add optional graduation if populated
      if (formValues.education.graduation?.board?.trim()) {
        payload.education.graduation = {
          board: formValues.education.graduation.board.trim(),
          year: formValues.education.graduation.year || undefined,
          total: formValues.education.graduation.total ? Number(formValues.education.graduation.total) : undefined,
          obtained: formValues.education.graduation.obtained ? Number(formValues.education.graduation.obtained) : undefined,
          percentage: formValues.education.graduation.percentage ? Number(formValues.education.graduation.percentage) : undefined,
        };
      }

      // Add optional other if populated
      if (formValues.education.other?.board?.trim()) {
        payload.education.other = {
          board: formValues.education.other.board.trim(),
          year: formValues.education.other.year || undefined,
          total: formValues.education.other.total ? Number(formValues.education.other.total) : undefined,
          obtained: formValues.education.other.obtained ? Number(formValues.education.other.obtained) : undefined,
          percentage: formValues.education.other.percentage ? Number(formValues.education.other.percentage) : undefined,
        };
      }

      const res = await fetch("/api/student/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setSubmitError(data.error || "Registration submission failed. Please check details and try again.");
        if (data.details) {
          setSubmitErrorDetails(data.details);
        }
        return;
      }

      // Success
      setSuccessData({
        registration_no: data.registration?.registration_no || "PMBI-REG-CONFIRMED",
        candidate_name: formValues.candidate_name,
        course: formValues.course,
      });
      setView("success");
      reset();
      generateCaptcha();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Submission error:", err);
      setSubmitError(err.message || "An unexpected error occurred while submitting. Please try again.");
    } finally {
      setIsFinalSubmitting(false);
    }
  };

  const handleResetForm = () => {
    reset();
    generateCaptcha();
    setView("form");
    setSubmitError(null);
    setSubmitErrorDetails(null);
    setSuccessData(null);
  };

  return (
    <div className="w-full">
      {/* View 1: Success View */}
      {view === "success" && successData && (
        <div className="p-6 sm:p-8 bg-white border-2 border-emerald-500 rounded-lg shadow-lg animate-fadeIn">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-sm">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#00031D] mb-2">
              Registration Successful! / पंजीकरण सफल रहा!
            </h2>

            <p className="text-sm sm:text-base text-slate-700 mb-6">
              Your registration application has been submitted successfully to the Indian Paramedical Board of India.
            </p>

            {/* Prominent Registration Number Box */}
            <div className="w-full p-5 bg-[#EBF4FA] border-2 border-[#143E66] rounded-lg text-center mb-6">
              <span className="text-xs font-bold text-[#143E66] uppercase tracking-wider block mb-1">
                Your Official Registration Number / आपका पंजीकरण क्रमांक
              </span>
              <span className="text-xl sm:text-3xl font-black text-[#B13B1C] font-mono tracking-wide">
                {successData.registration_no}
              </span>
            </div>

            <div className="w-full bg-slate-50 border border-slate-200 rounded p-4 text-xs sm:text-sm text-left space-y-1.5 mb-6">
              <div>
                <span className="text-slate-500">Candidate Name / अभ्यर्थी:</span>{" "}
                <strong className="text-slate-900">{successData.candidate_name}</strong>
              </div>
              <div>
                <span className="text-slate-500">Selected Program / पाठ्यक्रम:</span>{" "}
                <strong className="text-slate-900">{successData.course}</strong>
              </div>
              <div className="pt-2 text-slate-600 text-xs border-t border-slate-200 mt-2">
                ℹ Please preserve this registration number for all future correspondence, admit cards, and verification.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-3 bg-[#143E66] hover:bg-[#0d2a45] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded shadow-md transition-colors cursor-pointer"
              >
                Print Application / प्रिंट करें
              </button>
              <button
                type="button"
                onClick={handleResetForm}
                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs sm:text-sm font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
              >
                Register Another Candidate / नया आवेदन करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Preview Mode */}
      {view === "preview" && (
        <RegistrationPreview
          formData={watch()}
          onEdit={() => {
            setView("form");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onConfirm={handleConfirmSubmission}
          isSubmitting={isFinalSubmitting}
          submitError={submitError}
          submitErrorDetails={submitErrorDetails}
        />
      )}

      {/* View 3: Editable Form Mode */}
      {view === "form" && (
        <form onSubmit={handleSubmit(onSubmitForm)} noValidate>
          {/* 1. Personal Details */}
          <PersonalDetailsSection register={register} errors={errors} />

          {/* 2. Contact Details */}
          <ContactDetailsSection register={register} errors={errors} />

          {/* 3. Course Details */}
          <CourseDetailsSection register={register} errors={errors} />

          {/* 4. Education Table */}
          <EducationTable
            register={register}
            watch={watch}
            setValue={setValue}
            errors={errors}
          />

          {/* 5. Documents & Photographs Upload Section */}
          <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-[#143E66] to-[#1E5285] px-5 py-3.5 flex items-center justify-between border-b border-[#0d2a45]">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-[#00031D] font-bold text-xs flex items-center justify-center shadow-xs">
                  5
                </span>
                <h2 className="text-white font-bold text-sm sm:text-base tracking-wide uppercase">
                  Documents & Photographs Upload / दस्तावेज़ एवं फोटो अपलोड
                </h2>
              </div>
              <span className="text-[11px] font-medium text-[#C2DCED] hidden sm:inline-block">
                Max: 200KB (Photo/Sign), 2MB (Docs) • JPG/JPEG only
              </span>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              {/* Part A: Photo & Signature */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#143E66]"></span>
                  Photograph & Specimen Signature / फोटो एवं हस्ताक्षर
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FileUploadField
                    label="Passport Size Photograph"
                    hindiLabel="पासपोर्ट साइज फोटो"
                    subText="JPG/JPEG only (Max size: 200 KB)"
                    docType="photo"
                    maxSizeKB={200}
                    aspectRatio="square"
                    value={photoUrl}
                    onChange={(url) => setValue("photo_url", url, { shouldValidate: true })}
                    error={errors.photo_url?.message}
                  />

                  <FileUploadField
                    label="Candidate Signature"
                    hindiLabel="अभ्यर्थी के हस्ताक्षर"
                    subText="JPG/JPEG only (Max size: 200 KB)"
                    docType="signature"
                    maxSizeKB={200}
                    aspectRatio="signature"
                    value={signatureUrl}
                    onChange={(url) => setValue("signature_url", url, { shouldValidate: true })}
                    error={errors.signature_url?.message}
                  />
                </div>
              </div>

              {/* Part B: 3 Required Documents (Aadhaar, 10th Marksheet, 12th Marksheet) */}
              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B13B1C]"></span>
                  Required Academic & Identity Documents / अनिवार्य शैक्षणिक एवं पहचान दस्तावेज़
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* 1. Aadhaar Card */}
                  <FileUploadField
                    label="Aadhaar Card"
                    hindiLabel="आधार कार्ड"
                    subText="Front & back JPG/JPEG (Max: 2 MB)"
                    docType="aadhaar"
                    maxSizeKB={2048}
                    aspectRatio="document"
                    value={aadhaarUrl}
                    onChange={(url) => setValue("aadhaar_url", url, { shouldValidate: true })}
                    error={errors.aadhaar_url?.message}
                  />

                  {/* 2. 10th Marksheet */}
                  <FileUploadField
                    label="10th Marksheet"
                    hindiLabel="10वीं की अंकतालिका"
                    subText="High School Certificate JPG/JPEG (Max: 2 MB)"
                    docType="marksheet_10th"
                    maxSizeKB={2048}
                    aspectRatio="document"
                    value={marksheet10thUrl}
                    onChange={(url) => setValue("marksheet_10th_url", url, { shouldValidate: true })}
                    error={errors.marksheet_10th_url?.message}
                  />

                  {/* 3. 12th Marksheet */}
                  <FileUploadField
                    label="12th Marksheet"
                    hindiLabel="12वीं की अंकतालिका"
                    subText="Intermediate Certificate JPG/JPEG (Max: 2 MB)"
                    docType="marksheet_12th"
                    maxSizeKB={2048}
                    aspectRatio="document"
                    value={marksheet12thUrl}
                    onChange={(url) => setValue("marksheet_12th_url", url, { shouldValidate: true })}
                    error={errors.marksheet_12th_url?.message}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 6. Security & Declaration */}
          <CaptchaField
            register={register}
            errors={errors}
            captchaCode={captchaCode}
            onRefreshCaptcha={generateCaptcha}
          />

          {/* Form Action Buttons */}
          <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3.5">
            <button
              type="button"
              onClick={handleResetForm}
              className="w-full sm:w-auto px-6 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm uppercase tracking-wider rounded transition-colors cursor-pointer"
            >
              Reset Form / रीसेट करें
            </button>

            <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">
              <button
                type="submit"
                disabled={!allUploadsComplete}
                title={
                  !allUploadsComplete
                    ? "Please upload all 5 required documents to proceed / कृपया सभी 5 दस्तावेज़ अपलोड करें"
                    : "Proceed to Review Application"
                }
                className={`w-full sm:w-auto px-8 py-3 font-bold text-xs sm:text-sm uppercase tracking-wider rounded shadow-md transition-all duration-200 flex items-center justify-center gap-2 ${
                  allUploadsComplete
                    ? "bg-[#B13B1C] hover:bg-[#962f14] text-white cursor-pointer hover:shadow-lg"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                }`}
              >
                Submit Registration / आवेदन जमा करें
              </button>
              {!allUploadsComplete && (
                <span className="text-[11px] text-slate-500 mt-1.5">
                  * Button is active once all 5 documents/photos are uploaded
                </span>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

