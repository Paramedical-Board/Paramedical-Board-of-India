import React, { useState, useRef } from "react";
import Image from "next/image";

export type DocType = "photo" | "signature" | "aadhaar" | "marksheet_10th" | "marksheet_12th" | "affidavit";

interface Props {
  label: string;
  hindiLabel?: string;
  subText?: string;
  docType: DocType;
  maxSizeKB: number; // e.g. 200 for photo/sig, 2048 for docs
  value?: string;
  onChange: (url: string) => void;
  error?: string;
  aspectRatio?: "square" | "signature" | "document";
  queryMessage?: string;
  isAdmin?: boolean;
}

export default function FileUploadField({
  label,
  hindiLabel,
  subText,
  docType,
  maxSizeKB,
  value,
  onChange,
  error,
  aspectRatio = "document",
  queryMessage,
  isAdmin = false,
}: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultSubText =
    subText || (docType === "affidavit" ? "PDF only (Max size: 2 MB)" : "JPG/JPEG only (Max size: 200 KB)");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Client-side Validation: type check
    if (docType === "affidavit") {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        setUploadError("Only PDF files are allowed (केवल PDF मान्य है)");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    } else {
      const validMimes = ["image/jpeg", "image/jpg"];
      const fileExt = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      const isValidExt = fileExt === ".jpg" || fileExt === ".jpeg";
      const isValidMime = validMimes.includes(file.type);

      if (!isValidMime && !isValidExt) {
        setUploadError("Only JPG/JPEG files are allowed (केवल JPG/JPEG मान्य है)");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }

    // 2. Client-side Validation: size limit
    const maxBytes = maxSizeKB * 1024;
    if (file.size > maxBytes) {
      const displayLimit = maxSizeKB >= 1024 ? `${(maxSizeKB / 1024).toFixed(0)} MB` : `${maxSizeKB} KB`;
      setUploadError(`File size must be under ${displayLimit} (अधिकतम सीमा: ${displayLimit})`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // 3. Valid: Proceed to upload
    setFileName(file.name);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("docType", docType);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.status === 401) {
        setUploadError("Session expired, please log in again / सत्र समाप्त हो गया है, कृपया पुनः लॉगिन करें");
        setTimeout(() => {
          window.location.href = isAdmin ? "/admin/login" : "/college/login";
        }, 1500);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed. Please try again.");
      }

      if (data.url) {
        onChange(data.url);
      } else {
        throw new Error("Invalid response from upload server.");
      }
    } catch (err: any) {
      console.error("File upload failed:", err);
      setUploadError(err.message || "Failed to upload file. Please try again.");
      onChange("");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange("");
    setFileName("");
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayError = uploadError || error;

  return (
    <div className="flex flex-col">
      <label className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5">
        {label} {hindiLabel && <span className="font-normal text-slate-600">/ {hindiLabel}</span>}
        <span className="text-[#B13B1C] ml-0.5">*</span>
      </label>

      {queryMessage && (
        <div className="mb-2 p-2 bg-amber-50 border border-amber-300 rounded text-xs text-amber-900 flex items-start gap-1.5 shadow-2xs">
          <span className="text-amber-600 font-bold shrink-0">⚠️ Board Query:</span>
          <span>{queryMessage}</span>
        </div>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-3.5 sm:p-4 flex flex-col items-center justify-center transition-colors min-h-[140px] ${
          displayError
            ? "border-[#B13B1C] bg-red-50/30"
            : queryMessage
            ? "border-amber-500 bg-amber-50/20"
            : value
            ? "border-emerald-500 bg-emerald-50/20"
            : "border-slate-300 hover:border-[#143E66]/50 bg-slate-50/60"
        }`}
      >
        {isUploading ? (
          /* Loading / Spinner state during upload */
          <div className="flex flex-col items-center justify-center gap-2 py-4">
            <svg
              className="animate-spin h-7 w-7 text-[#143E66]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-xs font-semibold text-[#143E66]">
              Uploading {label}... / अपलोड हो रहा है...
            </span>
          </div>
        ) : value ? (
          /* Success state with green checkmark + selected filename / preview */
          <div className="flex flex-col items-center gap-2.5 w-full">
            {/* Green Checkmark Banner */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-medium w-full max-w-xs justify-center border border-emerald-300">
              <span className="text-emerald-600 font-bold text-sm">✅</span>
              <span className="truncate font-semibold">{fileName || `${label}.${docType === "affidavit" ? "pdf" : "jpg"}`}</span>
            </div>

            {/* Thumbnail / Document Preview */}
            {docType === "affidavit" ? (
              <div className="flex flex-col items-center justify-center w-32 h-24 rounded border border-slate-300 bg-red-50/50 shadow-xs p-2 text-center">
                <svg className="w-8 h-8 text-[#B13B1C]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                  <path d="M8 12h8v2H8zm0 4h5v2H8z" />
                </svg>
                <span className="text-[10px] font-bold text-[#B13B1C] mt-1 uppercase tracking-wider">PDF Document</span>
              </div>
            ) : (
              <div
                className={`relative overflow-hidden rounded border border-slate-300 bg-white shadow-xs ${
                  aspectRatio === "signature"
                    ? "w-44 h-14"
                    : aspectRatio === "document"
                    ? "w-32 h-24"
                    : "w-24 h-28"
                }`}
              >
                <Image
                  src={value}
                  alt={label}
                  fill
                  className="object-contain p-1"
                  unoptimized
                />
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2.5 mt-0.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-[#143E66] hover:underline cursor-pointer"
              >
                Change File / बदलें
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={handleRemove}
                className="text-xs font-semibold text-[#B13B1C] hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span>✕</span> Remove / हटाएं
              </button>
            </div>
          </div>
        ) : (
          /* Empty / Upload Prompt State */
          <div className="flex flex-col items-center text-center p-1">
            <div className="w-9 h-9 rounded-full bg-[#C2DCED]/40 flex items-center justify-center text-[#143E66] mb-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>
            <p className="text-xs font-semibold text-slate-800 mb-0.5">
              {label}
            </p>
            <p className="text-[11px] text-slate-500 mb-2.5">{defaultSubText}</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 bg-white border border-[#143E66] text-[#143E66] hover:bg-[#143E66] hover:text-white rounded text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              {docType === "affidavit" ? "Choose PDF File" : "Choose JPG File"}
            </button>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={docType === "affidavit" ? "application/pdf,.pdf" : ".jpg,.jpeg,image/jpeg,image/jpg"}
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {displayError && (
        <p className="text-xs text-[#B13B1C] font-medium mt-1">
          {displayError}
        </p>
      )}
    </div>
  );
}
