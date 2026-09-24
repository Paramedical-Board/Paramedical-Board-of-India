"use client";

import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Announcement } from "@/lib/announcement-types";
import { splitDate } from "@/lib/announcement-format";

// ─── Types ────────────────────────────────────────────────────────────────────

interface InstitutionItem {
  id: string;
  name: string;
  hindi_name: string;
  center_code: string;
  district: string;
  state: string;
  address: string;
  affiliated_since: string;
  status: "Active & Recognized" | "Verified Center";
  approved_programs: string[];
  contact_person?: string;
  phone?: string;
  display_order: number;
  is_active: boolean;
}

interface CourseItem {
  id: string;
  code: string;
  title: string;
  hindi_title: string;
  course_type: "diploma" | "certificate";
  category: string;
  duration_display: string;
  is_two_year: boolean;
  eligibility: string;
  mode: string;
  description: string;
  career_scope: string[];
  is_featured: boolean;
  display_order: number;
  is_active: boolean;
}

const COURSE_CATEGORIES = [
  "Diagnostics & Lab",
  "Radiology & Imaging",
  "Clinical & OT Care",
  "Community & Primary Health",
  "Specialized Care",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Empty form state – shared between Add and Edit */
const emptyForm = () => ({
  name: "",
  hindi_name: "",
  center_code: "",
  district: "",
  state: "",
  address: "",
  affiliated_since: "",
  status: "Active & Recognized" as "Active & Recognized" | "Verified Center",
  approved_programs: [] as string[],
  contact_person: "",
  phone: "",
  display_order: 0,
});

const emptyCourseForm = () => ({
  code: "",
  title: "",
  hindi_title: "",
  course_type: "certificate" as "diploma" | "certificate",
  category: "",
  duration_display: "",
  is_two_year: false,
  eligibility: "",
  mode: "",
  description: "",
  career_scope: [] as string[],
  is_featured: false,
  display_order: 0,
});

const emptyAnnouncementForm = () => ({
  title_en: "",
  title_hi: "",
  description_en: "",
  description_hi: "",
  announcement_date: new Date().toISOString().split("T")[0],
  attachment_url: null as string | null,
  attachment_file_id: null as string | null,
  link_url: "",
  is_published: true,
});

// ─── Inline SVGs ──────────────────────────────────────────────────────────────

const ErrorIcon = () => (
  <svg className="w-4 h-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SpinnerIcon = ({ cls = "w-3.5 h-3.5" }: { cls?: string }) => (
  <span className={`${cls} border-2 border-current border-t-transparent rounded-full animate-spin inline-block`} />
);

// ─── Reusable: Programs chip input ───────────────────────────────────────────

interface ProgramsInputProps {
  programs: string[];
  onChange: (updated: string[]) => void;
}

function ProgramsInput({ programs, onChange }: ProgramsInputProps) {
  const [input, setInput] = useState("");

  const addProgram = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (programs.includes(trimmed)) {
      setInput("");
      return;
    }
    onChange([...programs, trimmed]);
    setInput("");
  };

  const removeProgram = (idx: number) => {
    onChange(programs.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addProgram();
            }
          }}
          placeholder="e.g. B.Sc. Medical Imaging Technology"
          className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#143E66] focus:bg-white transition"
        />
        <button
          type="button"
          onClick={addProgram}
          className="w-full sm:w-auto px-3.5 py-2.5 bg-[#143E66] hover:bg-[#0f2e4d] text-white text-xs font-bold rounded-lg whitespace-nowrap transition cursor-pointer"
        >
          + Add Program
        </button>
      </div>
      {programs.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2.5">
          {programs.map((prog, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#143E66]/10 border border-[#143E66]/20 text-[#143E66] text-xs font-semibold rounded-full"
            >
              {prog}
              <button
                type="button"
                onClick={() => removeProgram(idx)}
                className="text-[#143E66]/60 hover:text-red-600 transition cursor-pointer leading-none"
                aria-label={`Remove ${prog}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Reusable: Career scope chip input ────────────────────────────────────────

interface CareerScopeInputProps {
  items: string[];
  onChange: (updated: string[]) => void;
}

function CareerScopeInput({ items, onChange }: CareerScopeInputProps) {
  const [input, setInput] = React.useState("");

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed || items.includes(trimmed)) { setInput(""); return; }
    onChange([...items, trimmed]);
    setInput("");
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="e.g. Pathology Diagnostic Centers"
          className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#143E66] focus:bg-white transition"
        />
        <button type="button" onClick={add}
          className="w-full sm:w-auto px-3.5 py-2.5 bg-[#143E66] hover:bg-[#0f2e4d] text-white text-xs font-bold rounded-lg whitespace-nowrap transition cursor-pointer">
          + Add Scope
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2.5">
          {items.map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#143E66]/10 border border-[#143E66]/20 text-[#143E66] text-xs font-semibold rounded-full">
              {item}
              <button type="button" onClick={() => onChange(items.filter((_, i) => i !== idx))}
                className="text-[#143E66]/60 hover:text-red-600 transition cursor-pointer leading-none">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Reusable: Course form fields ─────────────────────────────────────────────

interface CourseFormFieldsProps {
  form: ReturnType<typeof emptyCourseForm>;
  onChange: (patch: Partial<ReturnType<typeof emptyCourseForm>>) => void;
}

function CourseFormFields({ form, onChange }: CourseFormFieldsProps) {
  const inputCls = "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#143E66] focus:bg-white transition";
  const labelCls = "block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label className={labelCls}>Course Type <span className="text-red-500">*</span></label>
        <select value={form.course_type} onChange={(e) => onChange({ course_type: e.target.value as "diploma" | "certificate" })} required className={inputCls}>
          <option value="certificate">Certificate</option>
          <option value="diploma">Diploma</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>Category <span className="text-red-500">*</span></label>
        <input
          type="text"
          list="course-category-suggestions"
          value={form.category}
          onChange={(e) => onChange({ category: e.target.value })}
          placeholder="e.g. Diagnostics & Lab, Specialized Care, etc."
          required
          className={inputCls}
        />
        <datalist id="course-category-suggestions">
          {COURSE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat} />
          ))}
        </datalist>
        <p className="text-[11px] text-slate-500 font-medium mt-1">
          Type any custom category name or choose from suggestions.
        </p>
      </div>
      <div>
        <label className={labelCls}>Course Code <span className="text-red-500">*</span></label>
        <input type="text" value={form.code} onChange={(e) => onChange({ code: e.target.value })} placeholder="e.g. CMLT or PCC-521" required className={`${inputCls} font-mono`} />
        <p className="text-[11px] text-slate-500 font-medium mt-1">Used in dropdown label: &quot;Title (Code)&quot;</p>
      </div>
      <div>
        <label className={labelCls}>Duration Display <span className="text-red-500">*</span></label>
        <input type="text" value={form.duration_display} onChange={(e) => onChange({ duration_display: e.target.value })} placeholder="e.g. 1 Year / 2 Year" required className={inputCls} />
      </div>
      <div className="md:col-span-2">
        <label className={labelCls}>Course Title (English) <span className="text-red-500">*</span></label>
        <input type="text" value={form.title} onChange={(e) => onChange({ title: e.target.value })} placeholder="e.g. Certificate in Medical Laboratory Technology" required className={inputCls} />
      </div>
      <div className="md:col-span-2">
        <label className={labelCls}>Course Title (Hindi) <span className="text-red-500">*</span></label>
        <input type="text" value={form.hindi_title} onChange={(e) => onChange({ hindi_title: e.target.value })} placeholder="e.g. मेडिकल लैबोरेट्री टेक्नोलॉजी में सर्टिफिकेट" required className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Eligibility</label>
        <input type="text" value={form.eligibility} onChange={(e) => onChange({ eligibility: e.target.value })} placeholder="e.g. 10th / 10+2 Pass" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Mode / Practical Info</label>
        <input type="text" value={form.mode} onChange={(e) => onChange({ mode: e.target.value })} placeholder="e.g. Theory + Hands-on Clinical Lab Practical" className={inputCls} />
      </div>
      <div className="md:col-span-2">
        <label className={labelCls}>Description</label>
        <textarea value={form.description} onChange={(e) => onChange({ description: e.target.value })} placeholder="Brief course description..." rows={3} className={`${inputCls} resize-none`} />
      </div>
      <div>
        <label className={labelCls}>Display Order <span className="text-slate-400 font-normal">(default 0)</span></label>
        <input type="number" value={form.display_order} onChange={(e) => onChange({ display_order: parseInt(e.target.value, 10) || 0 })} min={0} className={`${inputCls} font-mono`} />
      </div>
      <div className="flex flex-col gap-3 justify-center">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input type="checkbox" checked={form.is_two_year} onChange={(e) => onChange({ is_two_year: e.target.checked })} className="w-4 h-4 rounded accent-[#143E66] cursor-pointer" />
          <div>
            <span className="text-xs font-bold text-slate-800 block">Is 2-Year Course?</span>
            <span className="text-[11px] text-slate-500">Controls session options in Exam Management &amp; roll-number generation</span>
          </div>
        </label>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input type="checkbox" checked={form.is_featured} onChange={(e) => onChange({ is_featured: e.target.checked })} className="w-4 h-4 rounded accent-[#143E66] cursor-pointer" />
          <div>
            <span className="text-xs font-bold text-slate-800 block">Featured Course?</span>
            <span className="text-[11px] text-slate-500">Shown in spotlight banner on public Courses page</span>
          </div>
        </label>
      </div>
      <div className="md:col-span-2">
        <label className={labelCls}>Career Scope / Work Areas</label>
        <CareerScopeInput items={form.career_scope} onChange={(updated) => onChange({ career_scope: updated })} />
        <p className="text-[11px] text-slate-500 font-medium mt-1">Type a career area and click &ldquo;+ Add Scope&rdquo; or press Enter.</p>
      </div>
    </div>
  );
}

// ─── Reusable: Status badge ───────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  if (status === "Active & Recognized") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Active &amp; Recognized
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
      Verified Center
    </span>
  );
}

// ─── Reusable: Active toggle switch ──────────────────────────────────────────

interface ToggleSwitchProps {
  checked: boolean;
  loading: boolean;
  onToggle: () => void;
  label?: string;
}

function ToggleSwitch({ checked, loading, onToggle, label }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label ?? (checked ? "Deactivate" : "Activate")}
      disabled={loading}
      onClick={onToggle}
      className={`relative inline-flex items-center h-6 w-11 shrink-0 rounded-full border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#143E66] focus:ring-offset-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        checked ? "bg-emerald-500 border-emerald-500" : "bg-slate-200 border-slate-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <SpinnerIcon cls="w-3 h-3 text-white" />
        </span>
      )}
    </button>
  );
}

// ─── Reusable: Institution form fields (shared Add/Edit) ─────────────────────

interface InstitutionFormFieldsProps {
  form: ReturnType<typeof emptyForm>;
  onChange: (patch: Partial<ReturnType<typeof emptyForm>>) => void;
}

function InstitutionFormFields({ form, onChange }: InstitutionFormFieldsProps) {
  const inputCls =
    "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#143E66] focus:bg-white transition";
  const labelCls = "block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* College / Institution Name */}
      <div className="md:col-span-2">
        <label className={labelCls}>
          College / Institution Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g. National Paramedical Institute, Delhi"
          required
          className={inputCls}
        />
      </div>

      {/* Hindi Name */}
      <div className="md:col-span-2">
        <label className={labelCls}>
          Hindi Name (हिंदी नाम) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.hindi_name}
          onChange={(e) => onChange({ hindi_name: e.target.value })}
          placeholder="e.g. राष्ट्रीय पैरामेडिकल संस्थान, दिल्ली"
          required
          className={inputCls}
        />
      </div>

      {/* Center Code */}
      <div>
        <label className={labelCls}>
          Center Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.center_code}
          onChange={(e) => onChange({ center_code: e.target.value })}
          placeholder="e.g. IPBI-DL-0001"
          required
          className={`${inputCls} font-mono`}
        />
        <p className="text-[11px] text-slate-500 font-medium mt-1">
          Format: IPBI-XX-0000 (state abbreviation + serial number)
        </p>
      </div>

      {/* Affiliated Since */}
      <div>
        <label className={labelCls}>
          Affiliated Since <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.affiliated_since}
          onChange={(e) => onChange({ affiliated_since: e.target.value })}
          placeholder="e.g. 2024"
          required
          className={`${inputCls} font-mono`}
        />
      </div>

      {/* District */}
      <div>
        <label className={labelCls}>
          District <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.district}
          onChange={(e) => onChange({ district: e.target.value })}
          placeholder="e.g. New Delhi"
          required
          className={inputCls}
        />
      </div>

      {/* State */}
      <div>
        <label className={labelCls}>
          State <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.state}
          onChange={(e) => onChange({ state: e.target.value })}
          placeholder="e.g. Delhi"
          required
          className={inputCls}
        />
      </div>

      {/* Full Address */}
      <div className="md:col-span-2">
        <label className={labelCls}>
          Full Address <span className="text-red-500">*</span>
        </label>
        <textarea
          value={form.address}
          onChange={(e) => onChange({ address: e.target.value })}
          placeholder="Street, Area, City, PIN"
          required
          rows={3}
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* Status */}
      <div>
        <label className={labelCls}>
          Status <span className="text-red-500">*</span>
        </label>
        <select
          value={form.status}
          onChange={(e) =>
            onChange({ status: e.target.value as "Active & Recognized" | "Verified Center" })
          }
          required
          className={inputCls}
        >
          <option value="Active & Recognized">Active &amp; Recognized</option>
          <option value="Verified Center">Verified Center</option>
        </select>
      </div>

      {/* Display Order */}
      <div>
        <label className={labelCls}>
          Display Order{" "}
          <span className="text-slate-400 font-normal">(Optional, default 0)</span>
        </label>
        <input
          type="number"
          value={form.display_order}
          onChange={(e) => onChange({ display_order: parseInt(e.target.value, 10) || 0 })}
          placeholder="0"
          min={0}
          className={`${inputCls} font-mono`}
        />
        <p className="text-[11px] text-slate-500 font-medium mt-1">
          Lower numbers appear first on the public site.
        </p>
      </div>

      {/* Approved Programs */}
      <div className="md:col-span-2">
        <label className={labelCls}>
          Approved Programs{" "}
          <span className="text-red-500">*</span>{" "}
          <span className="text-slate-400 font-normal normal-case">(at least 1)</span>
        </label>
        <ProgramsInput
          programs={form.approved_programs}
          onChange={(updated) => onChange({ approved_programs: updated })}
        />
        <p className="text-[11px] text-slate-500 font-medium mt-1">
          Type a program name and click &ldquo;+ Add Program&rdquo; or press Enter.
        </p>
      </div>

      {/* Contact Person */}
      <div>
        <label className={labelCls}>
          Contact Person{" "}
          <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <input
          type="text"
          value={form.contact_person}
          onChange={(e) => onChange({ contact_person: e.target.value })}
          placeholder="e.g. Dr. Ramesh Kumar"
          className={inputCls}
        />
      </div>

      {/* Phone */}
      <div>
        <label className={labelCls}>
          Phone{" "}
          <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <input
          type="text"
          value={form.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder="e.g. +91-9876543210"
          className={`${inputCls} font-mono`}
        />
      </div>
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function UIModificationsPage() {
  const router = useRouter();

  // ── Add-new form state ──
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm());
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addFormError, setAddFormError] = useState<string | null>(null);

  // ── List state ──
  const [institutions, setInstitutions] = useState<InstitutionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [tableActionError, setTableActionError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // ── Edit modal state ──
  const [editTarget, setEditTarget] = useState<InstitutionItem | null>(null);
  const [editForm, setEditForm] = useState(emptyForm());
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editModalError, setEditModalError] = useState<string | null>(null);

  // ── Refs ──
  const addFormRef = useRef<HTMLDivElement | null>(null);

  // ── Courses State ──
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [coursesListError, setCoursesListError] = useState<string | null>(null);
  const [coursesActionError, setCoursesActionError] = useState<string | null>(null);
  const [togglingCourseId, setTogglingCourseId] = useState<string | null>(null);

  // ── Add Course form state ──
  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [addCourseForm, setAddCourseForm] = useState(emptyCourseForm());
  const [addCourseSubmitting, setAddCourseSubmitting] = useState(false);
  const [addCourseError, setAddCourseError] = useState<string | null>(null);
  const addCourseFormRef = useRef<HTMLDivElement | null>(null);

  // ── Edit Course modal state ──
  const [editCourseTarget, setEditCourseTarget] = useState<CourseItem | null>(null);
  const [editCourseForm, setEditCourseForm] = useState(emptyCourseForm());
  const [editCourseSubmitting, setEditCourseSubmitting] = useState(false);
  const [editCourseModalError, setEditCourseModalError] = useState<string | null>(null);

  // ── Announcements State ──
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [announcementsError, setAnnouncementsError] = useState<string | null>(null);
  const [announcementsActionError, setAnnouncementsActionError] = useState<string | null>(null);
  const [togglingAnnouncementId, setTogglingAnnouncementId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ── Announcement Modal & Form State ──
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [announcementForm, setAnnouncementForm] = useState(emptyAnnouncementForm());
  const [announcementSubmitting, setAnnouncementSubmitting] = useState(false);
  const [announcementFormError, setAnnouncementFormError] = useState<string | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  // ── Course admin list filters ──
  const [courseFilterTab, setCourseFilterTab] = useState<"all" | "diploma" | "certificate">("all");
  const [courseSearch, setCourseSearch] = useState("");

  // ── Collapsible Section State (default hidden for compact view and easy scrolling) ──
  const [showInstitutions, setShowInstitutions] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [showAnnouncements, setShowAnnouncements] = useState(false);

  const filteredAdminCourses = useMemo(() => {
    return courses.filter((c) => {
      if (courseFilterTab !== "all" && c.course_type !== courseFilterTab) return false;
      if (!courseSearch.trim()) return true;
      const q = courseSearch.toLowerCase().trim();
      return (
        c.title.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.hindi_title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    });
  }, [courses, courseFilterTab, courseSearch]);

  // ── Fetch all institutions ──
  const fetchInstitutions = useCallback(async () => {
    try {
      setLoading(true);
      setListError(null);
      const res = await fetch("/api/admin/affiliated-institutions");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setListError(data.error || "Failed to load institutions");
        return;
      }
      setInstitutions(data.institutions || []);
    } catch (err) {
      console.error("Error fetching institutions:", err);
      setListError("Network error while loading institutions");
    } finally {
      setLoading(false);
    }
  }, [router]);

  // ── Fetch all courses ──
  const fetchCourses = useCallback(async () => {
    try {
      setLoadingCourses(true);
      setCoursesListError(null);
      const res = await fetch("/api/admin/courses");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setCoursesListError(data.error || "Failed to load courses");
        return;
      }
      setCourses(data.courses || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCoursesListError("Network error while loading courses");
    } finally {
      setLoadingCourses(false);
    }
  }, [router]);

  // ── Fetch all announcements ──
  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoadingAnnouncements(true);
      setAnnouncementsError(null);
      const res = await fetch("/api/admin/announcements", { credentials: "include" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setAnnouncementsError(data.error || "Failed to load announcements");
        return;
      }
      setAnnouncements(data.announcements || []);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setAnnouncementsError("Network error while loading announcements");
    } finally {
      setLoadingAnnouncements(false);
    }
  }, [router]);

  useEffect(() => {
    fetchInstitutions();
    fetchCourses();
    fetchAnnouncements();
  }, [fetchInstitutions, fetchCourses, fetchAnnouncements]);

  // ── Add-new form helpers ──
  const patchAddForm = (patch: Partial<ReturnType<typeof emptyForm>>) =>
    setAddForm((prev) => ({ ...prev, ...patch }));

  const resetAddForm = () => {
    setAddForm(emptyForm());
    setAddFormError(null);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddFormError(null);

    if (addForm.approved_programs.length === 0) {
      setAddFormError("Please add at least one Approved Program.");
      return;
    }

    try {
      setAddSubmitting(true);
      const res = await fetch("/api/admin/affiliated-institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addForm.name.trim(),
          hindi_name: addForm.hindi_name.trim(),
          center_code: addForm.center_code.trim(),
          district: addForm.district.trim(),
          state: addForm.state.trim(),
          address: addForm.address.trim(),
          affiliated_since: addForm.affiliated_since.trim(),
          status: addForm.status,
          approved_programs: addForm.approved_programs,
          contact_person: addForm.contact_person?.trim() || undefined,
          phone: addForm.phone?.trim() || undefined,
          display_order: addForm.display_order,
        }),
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setAddFormError(data.error || "Failed to create institution");
        return;
      }

      // Success
      resetAddForm();
      setAddFormOpen(false);
      fetchInstitutions();
    } catch (err) {
      console.error("Add institution error:", err);
      setAddFormError("A network error occurred. Please try again.");
    } finally {
      setAddSubmitting(false);
    }
  };

  // ── Active toggle ──
  const handleToggleActive = async (inst: InstitutionItem) => {
    setTableActionError(null);
    try {
      setTogglingId(inst.id);
      const res = await fetch(`/api/admin/affiliated-institutions/${inst.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !inst.is_active }),
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setTableActionError(data.error || "Failed to toggle active status");
        return;
      }
      setInstitutions((prev) =>
        prev.map((i) => (i.id === inst.id ? { ...i, is_active: !inst.is_active } : i))
      );
    } catch (err) {
      console.error("Toggle active error:", err);
      setTableActionError("Network error while updating status");
    } finally {
      setTogglingId(null);
    }
  };

  // ── Edit modal ──
  const handleOpenEditModal = (inst: InstitutionItem) => {
    setEditTarget(inst);
    setEditForm({
      name: inst.name,
      hindi_name: inst.hindi_name,
      center_code: inst.center_code,
      district: inst.district,
      state: inst.state,
      address: inst.address,
      affiliated_since: inst.affiliated_since,
      status: inst.status,
      approved_programs: [...inst.approved_programs],
      contact_person: inst.contact_person ?? "",
      phone: inst.phone ?? "",
      display_order: inst.display_order,
    });
    setEditModalError(null);
    setTableActionError(null);
  };

  const handleCloseEditModal = () => {
    setEditTarget(null);
    setEditForm(emptyForm());
    setEditModalError(null);
    setEditSubmitting(false);
  };

  const patchEditForm = (patch: Partial<ReturnType<typeof emptyForm>>) =>
    setEditForm((prev) => ({ ...prev, ...patch }));

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setEditModalError(null);

    if (editForm.approved_programs.length === 0) {
      setEditModalError("Please add at least one Approved Program.");
      return;
    }

    try {
      setEditSubmitting(true);
      const res = await fetch(`/api/admin/affiliated-institutions/${editTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name.trim(),
          hindi_name: editForm.hindi_name.trim(),
          center_code: editForm.center_code.trim(),
          district: editForm.district.trim(),
          state: editForm.state.trim(),
          address: editForm.address.trim(),
          affiliated_since: editForm.affiliated_since.trim(),
          status: editForm.status,
          approved_programs: editForm.approved_programs,
          contact_person: editForm.contact_person?.trim() || undefined,
          phone: editForm.phone?.trim() || undefined,
          display_order: editForm.display_order,
        }),
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setEditModalError(data.error || "Failed to update institution");
        return;
      }

      handleCloseEditModal();
      fetchInstitutions();
    } catch (err) {
      console.error("Edit institution error:", err);
      setEditModalError("Network error while updating institution.");
    } finally {
      setEditSubmitting(false);
    }
  };

  // ── Delete ──
  const handleDelete = async (inst: InstitutionItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove "${inst.name}" from the public site? / क्या आप वाकई "${inst.name}" को सार्वजनिक साइट से हटाना चाहते हैं?`
    );
    if (!confirmed) return;

    setTableActionError(null);
    try {
      const res = await fetch(`/api/admin/affiliated-institutions/${inst.id}`, {
        method: "DELETE",
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setTableActionError(data.error || "Failed to delete institution");
        return;
      }
      fetchInstitutions();
    } catch (err) {
      console.error("Delete institution error:", err);
      setTableActionError("Network error while deleting institution");
    }
  };

  // ── Course Handlers ──
  const patchAddCourseForm = (patch: Partial<ReturnType<typeof emptyCourseForm>>) =>
    setAddCourseForm((prev) => ({ ...prev, ...patch }));

  const resetAddCourseForm = () => {
    setAddCourseForm(emptyCourseForm());
    setAddCourseError(null);
  };

  const handleAddCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddCourseError(null);

    try {
      setAddCourseSubmitting(true);
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: addCourseForm.code.trim(),
          title: addCourseForm.title.trim(),
          hindi_title: addCourseForm.hindi_title.trim(),
          course_type: addCourseForm.course_type,
          category: addCourseForm.category,
          duration_display: addCourseForm.duration_display.trim(),
          is_two_year: addCourseForm.is_two_year,
          eligibility: addCourseForm.eligibility.trim(),
          mode: addCourseForm.mode.trim(),
          description: addCourseForm.description.trim(),
          career_scope: addCourseForm.career_scope,
          is_featured: addCourseForm.is_featured,
          display_order: addCourseForm.display_order,
        }),
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setAddCourseError(data.error || "Failed to create course");
        return;
      }

      resetAddCourseForm();
      setAddCourseOpen(false);
      fetchCourses();
    } catch (err) {
      console.error("Add course error:", err);
      setAddCourseError("A network error occurred. Please try again.");
    } finally {
      setAddCourseSubmitting(false);
    }
  };

  const handleToggleCourseActive = async (course: CourseItem) => {
    setCoursesActionError(null);
    try {
      setTogglingCourseId(course.id);
      const res = await fetch(`/api/admin/courses/${course.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !course.is_active }),
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setCoursesActionError(data.error || "Failed to toggle active status");
        return;
      }
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? { ...c, is_active: !course.is_active } : c))
      );
    } catch (err) {
      console.error("Toggle course active error:", err);
      setCoursesActionError("Network error while updating course status");
    } finally {
      setTogglingCourseId(null);
    }
  };

  const handleOpenEditCourseModal = (course: CourseItem) => {
    setEditCourseTarget(course);
    setEditCourseForm({
      code: course.code,
      title: course.title,
      hindi_title: course.hindi_title,
      course_type: course.course_type,
      category: course.category,
      duration_display: course.duration_display,
      is_two_year: course.is_two_year,
      eligibility: course.eligibility,
      mode: course.mode,
      description: course.description,
      career_scope: [...course.career_scope],
      is_featured: course.is_featured,
      display_order: course.display_order,
    });
    setEditCourseModalError(null);
    setCoursesActionError(null);
  };

  const handleCloseEditCourseModal = () => {
    setEditCourseTarget(null);
    setEditCourseForm(emptyCourseForm());
    setEditCourseModalError(null);
    setEditCourseSubmitting(false);
  };

  const patchEditCourseForm = (patch: Partial<ReturnType<typeof emptyCourseForm>>) =>
    setEditCourseForm((prev) => ({ ...prev, ...patch }));

  const handleEditCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCourseTarget) return;
    setEditCourseModalError(null);

    try {
      setEditCourseSubmitting(true);
      const res = await fetch(`/api/admin/courses/${editCourseTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: editCourseForm.code.trim(),
          title: editCourseForm.title.trim(),
          hindi_title: editCourseForm.hindi_title.trim(),
          course_type: editCourseForm.course_type,
          category: editCourseForm.category,
          duration_display: editCourseForm.duration_display.trim(),
          is_two_year: editCourseForm.is_two_year,
          eligibility: editCourseForm.eligibility.trim(),
          mode: editCourseForm.mode.trim(),
          description: editCourseForm.description.trim(),
          career_scope: editCourseForm.career_scope,
          is_featured: editCourseForm.is_featured,
          display_order: editCourseForm.display_order,
        }),
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setEditCourseModalError(data.error || "Failed to update course");
        return;
      }

      handleCloseEditCourseModal();
      fetchCourses();
    } catch (err) {
      console.error("Edit course error:", err);
      setEditCourseModalError("Network error while updating course.");
    } finally {
      setEditCourseSubmitting(false);
    }
  };

  const handleDeleteCourse = async (course: CourseItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove "${course.title} (${course.code})" from courses? / क्या आप वाकई इस पाठ्यक्रम को हटाना चाहते हैं?`
    );
    if (!confirmed) return;

    setCoursesActionError(null);
    try {
      const res = await fetch(`/api/admin/courses/${course.id}`, {
        method: "DELETE",
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setCoursesActionError(data.error || "Failed to delete course");
        return;
      }
      fetchCourses();
    } catch (err) {
      console.error("Delete course error:", err);
      setCoursesActionError("Network error while deleting course");
    }
  };

  // ── Announcement Handlers ──
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 4000);
  };

  const handleOpenAddAnnouncementModal = () => {
    setEditingAnnouncement(null);
    setAnnouncementForm(emptyAnnouncementForm());
    setAnnouncementFormError(null);
    setUploadError(null);
    setUploadedFileName(null);
    setAnnouncementModalOpen(true);
  };

  const handleOpenEditAnnouncementModal = (item: Announcement) => {
    setEditingAnnouncement(item);
    setAnnouncementForm({
      title_en: item.title_en,
      title_hi: item.title_hi || "",
      description_en: item.description_en || "",
      description_hi: item.description_hi || "",
      announcement_date: item.announcement_date,
      attachment_url: item.attachment_url,
      attachment_file_id: item.attachment_file_id || null,
      link_url: item.link_url || "",
      is_published: item.is_published,
    });
    setAnnouncementFormError(null);
    setUploadError(null);
    setUploadedFileName(item.attachment_url ? "Current PDF attached" : null);
    setAnnouncementModalOpen(true);
  };

  const handleCloseAnnouncementModal = () => {
    setAnnouncementModalOpen(false);
    setEditingAnnouncement(null);
    setAnnouncementForm(emptyAnnouncementForm());
    setAnnouncementFormError(null);
    setUploadError(null);
    setUploadedFileName(null);
    setAnnouncementSubmitting(false);
    setUploadingPdf(false);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setUploadError("Only PDF files are allowed (.pdf).");
      return;
    }
    if (file.size > 1024 * 1024) {
      setUploadError("PDF file size must not exceed 1 MB.");
      return;
    }

    setUploadingPdf(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/announcements/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Failed to upload PDF");
        return;
      }

      setAnnouncementForm((prev) => ({
        ...prev,
        attachment_url: data.url,
        attachment_file_id: data.fileId,
      }));
      setUploadedFileName(data.originalName || file.name);
    } catch (err) {
      console.error("PDF upload error:", err);
      setUploadError("Network error while uploading PDF");
    } finally {
      setUploadingPdf(false);
      if (pdfInputRef.current) pdfInputRef.current.value = "";
    }
  };

  const handleRemovePdf = () => {
    setAnnouncementForm((prev) => ({
      ...prev,
      attachment_url: null,
      attachment_file_id: null,
    }));
    setUploadedFileName(null);
    setUploadError(null);
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnnouncementFormError(null);

    const titleEn = announcementForm.title_en.trim();
    if (!titleEn) {
      setAnnouncementFormError("Title (English) is required.");
      return;
    }
    if (titleEn.length > 200) {
      setAnnouncementFormError("Title (English) must be at most 200 characters.");
      return;
    }
    if (announcementForm.title_hi && announcementForm.title_hi.length > 200) {
      setAnnouncementFormError("Title (Hindi) must be at most 200 characters.");
      return;
    }
    if (announcementForm.description_en && announcementForm.description_en.length > 1000) {
      setAnnouncementFormError("Description (English) must be at most 1000 characters.");
      return;
    }
    if (announcementForm.description_hi && announcementForm.description_hi.length > 1000) {
      setAnnouncementFormError("Description (Hindi) must be at most 1000 characters.");
      return;
    }

    const linkUrl = announcementForm.link_url.trim();
    if (linkUrl && !linkUrl.startsWith("http://") && !linkUrl.startsWith("https://")) {
      setAnnouncementFormError("External link must start with http:// or https://");
      return;
    }

    setAnnouncementSubmitting(true);
    try {
      const payload = {
        title_en: titleEn,
        title_hi: announcementForm.title_hi.trim() || null,
        description_en: announcementForm.description_en.trim() || null,
        description_hi: announcementForm.description_hi.trim() || null,
        announcement_date: announcementForm.announcement_date || new Date().toISOString().split("T")[0],
        attachment_url: announcementForm.attachment_url,
        attachment_file_id: announcementForm.attachment_file_id,
        link_url: linkUrl || null,
        is_published: announcementForm.is_published,
      };

      const url = editingAnnouncement
        ? `/api/admin/announcements/${editingAnnouncement.id}`
        : `/api/admin/announcements`;
      const method = editingAnnouncement ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setAnnouncementFormError(data.error || "Failed to save announcement");
        return;
      }

      handleCloseAnnouncementModal();
      showToast("Announcement saved");
      fetchAnnouncements();
    } catch (err) {
      console.error("Save announcement error:", err);
      setAnnouncementFormError("Network error while saving announcement");
    } finally {
      setAnnouncementSubmitting(false);
    }
  };

  const handleToggleAnnouncementPublish = async (item: Announcement) => {
    setAnnouncementsActionError(null);
    const nextState = !item.is_published;
    setTogglingAnnouncementId(item.id);

    try {
      const res = await fetch(`/api/admin/announcements/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: nextState }),
        credentials: "include",
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setAnnouncementsActionError(data.error || "Failed to update status");
        return;
      }

      setAnnouncements((prev) =>
        prev.map((a) => (a.id === item.id ? { ...a, is_published: nextState } : a))
      );
      showToast(nextState ? "Announcement published" : "Announcement saved as draft");
    } catch (err) {
      console.error("Toggle publish error:", err);
      setAnnouncementsActionError("Network error while updating publish status");
    } finally {
      setTogglingAnnouncementId(null);
    }
  };

  const handleDeleteAnnouncement = async (item: Announcement) => {
    const confirmed = window.confirm(
      "Delete this announcement? This cannot be undone. / क्या आप यह घोषणा हटाना चाहते हैं?"
    );
    if (!confirmed) return;

    setAnnouncementsActionError(null);
    try {
      const res = await fetch(`/api/admin/announcements/${item.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAnnouncementsActionError(data.error || "Failed to delete announcement");
        return;
      }

      showToast("Announcement deleted");
      fetchAnnouncements();
    } catch (err) {
      console.error("Delete announcement error:", err);
      setAnnouncementsActionError("Network error while deleting announcement");
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

      {/* ── Top Banner & Header ── */}
      <div className="bg-white rounded-lg shadow-xs border border-slate-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full mb-2 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Super-Admin Control • UI Modifications
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#00031D] tracking-tight">
              UI Modifications / यूआई परिवर्तन
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Manage public-facing content blocks. / सार्वजनिक सामग्री प्रबंधित करें।
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          Section 1 — Affiliated Institutions
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden mb-8">

        {/* Card header */}
        <div
          onClick={() => setShowInstitutions((prev) => !prev)}
          className={`p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-50/60 transition ${
            showInstitutions ? "border-b border-slate-100" : ""
          }`}
        >
          <div>
            <h2 className="text-lg font-bold text-[#00031D] flex items-center gap-2">
              <svg className="w-5 h-5 text-[#143E66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Affiliated Institutions / सम्बद्ध संस्थान
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Institutions publicly listed as affiliated with the Board on the website.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
            <div className="text-xs font-semibold text-slate-600 bg-slate-50 px-3.5 py-1.5 rounded-lg border border-slate-200">
              Total: <strong className="text-slate-900">{institutions.length}</strong>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowInstitutions((prev) => !prev);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                showInstitutions
                  ? "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                  : "bg-[#143E66] text-white border-[#143E66] hover:bg-[#0f2e4d] shadow-xs"
              }`}
            >
              <span>{showInstitutions ? "Hide Table / छुपाएं" : "Show Table / देखें"}</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${showInstitutions ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {showInstitutions && (
          <div className="animate-in fade-in duration-200">

        {/* ── Collapsible "+ Add New" section ── */}
        <div className="p-6 sm:p-8 border-b border-slate-100">
          {/* Toggle button */}
          <button
            type="button"
            onClick={() => {
              setAddFormOpen((prev) => {
                if (!prev) {
                  // Opening — scroll to form after render
                  setTimeout(() => {
                    addFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 80);
                } else {
                  resetAddForm();
                }
                return !prev;
              });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#143E66] hover:bg-[#0f2e4d] text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
          >
            <svg
              className={`w-4 h-4 text-[#D4AF37] transition-transform duration-200 ${addFormOpen ? "rotate-45" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {addFormOpen ? "Collapse Form / फ़ॉर्म बंद करें" : "+ Add New Institution / नई संस्था जोड़ें"}
          </button>

          {/* Collapsible body */}
          {addFormOpen && (
            <div ref={addFormRef} className="mt-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h3 className="text-base font-bold text-[#00031D] flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Institution Details / नई संस्था का विवरण
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fill all required fields. The institution will appear on the public site immediately.
                </p>
              </div>

              {/* Error banner above form */}
              {addFormError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs font-semibold text-red-700 animate-in fade-in duration-200">
                  <ErrorIcon />
                  <span>{addFormError}</span>
                </div>
              )}

              <form onSubmit={handleAddSubmit} className="space-y-5">
                <InstitutionFormFields form={addForm} onChange={patchAddForm} />

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={addSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#143E66] hover:bg-[#0f2e4d] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    {addSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Create Institution / संस्था बनाएं
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* ── Table/List area ── */}

        {/* Table-level action error banner */}
        {tableActionError && (
          <div className="mx-6 mt-6 p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <ErrorIcon />
              <span>{tableActionError}</span>
            </div>
            <button
              type="button"
              onClick={() => setTableActionError(null)}
              className="text-red-500 hover:text-red-800 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* List error */}
        {listError && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center gap-2">
            <ErrorIcon />
            <span>{listError}</span>
          </div>
        )}

        {/* Loading / empty / data states */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-[#143E66] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-500">Loading institutions...</p>
          </div>
        ) : institutions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-600">No institutions added yet.</p>
            <p className="text-xs text-slate-400 mt-1">
              Use the &ldquo;+ Add New Institution&rdquo; button above to get started.
            </p>
          </div>
        ) : (
          <>
            {/* ── 1. Mobile Card View (< md) ── */}
            <div className="md:hidden divide-y divide-slate-100">
              {institutions.map((inst) => {
                const isToggling = togglingId === inst.id;
                return (
                  <div key={inst.id} className="p-4 hover:bg-slate-50/80 transition-colors space-y-3">
                    {/* Top row: Order badge + Status */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs font-mono font-bold text-slate-600">
                        #{inst.display_order}
                      </span>
                      <StatusBadge status={inst.status} />
                    </div>

                    {/* Center code */}
                    <div>
                      <span className="px-2.5 py-0.5 bg-blue-50 border border-blue-200 rounded text-xs font-mono font-bold text-[#143E66]">
                        {inst.center_code}
                      </span>
                    </div>

                    {/* Name */}
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{inst.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{inst.hindi_name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {inst.district}, {inst.state}
                      </p>
                    </div>

                    {/* Programs chips (preview) */}
                    {inst.approved_programs.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {inst.approved_programs.slice(0, 3).map((prog, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-[#143E66]/10 text-[#143E66] text-[10px] font-semibold rounded-full border border-[#143E66]/20"
                          >
                            {prog}
                          </span>
                        ))}
                        {inst.approved_programs.length > 3 && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-semibold rounded-full border border-slate-200">
                            +{inst.approved_programs.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Active toggle row */}
                    <div className="flex items-center gap-2">
                      <ToggleSwitch
                        checked={inst.is_active}
                        loading={isToggling}
                        onToggle={() => handleToggleActive(inst)}
                      />
                      <span className="text-xs font-medium text-slate-600">
                        {inst.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(inst)}
                        className="py-2 px-3 bg-slate-100 hover:bg-[#143E66] active:bg-[#0f2e4d] hover:text-white text-[#143E66] border border-slate-300 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(inst)}
                        className="py-2 px-3 bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── 2. Desktop/Tablet Table View (hidden on mobile, md+) ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px] tracking-wider">
                    <th className="py-3 px-4 w-16">Order</th>
                    <th className="py-3 px-4 w-36">Center Code</th>
                    <th className="py-3 px-4 sm:px-6">Name</th>
                    <th className="py-3 px-4">District / State</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Active</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {institutions.map((inst) => {
                    const isToggling = togglingId === inst.id;
                    return (
                      <tr key={inst.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Display Order */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-500 text-xs">
                          #{inst.display_order}
                        </td>

                        {/* Center Code */}
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 rounded text-xs font-mono font-bold text-[#143E66]">
                            {inst.center_code}
                          </span>
                        </td>

                        {/* Name + Hindi name */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <p className="font-semibold text-slate-900 leading-snug">{inst.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5 leading-snug">{inst.hindi_name}</p>
                          {inst.approved_programs.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {inst.approved_programs.slice(0, 2).map((prog, i) => (
                                <span
                                  key={i}
                                  className="px-1.5 py-0.5 bg-[#143E66]/10 text-[#143E66] text-[10px] font-semibold rounded border border-[#143E66]/15"
                                >
                                  {prog}
                                </span>
                              ))}
                              {inst.approved_programs.length > 2 && (
                                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-semibold rounded border border-slate-200">
                                  +{inst.approved_programs.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* District / State */}
                        <td className="py-3.5 px-4 text-slate-700">
                          <p className="font-medium">{inst.district}</p>
                          <p className="text-xs text-slate-500">{inst.state}</p>
                        </td>

                        {/* Status badge */}
                        <td className="py-3.5 px-4">
                          <StatusBadge status={inst.status} />
                        </td>

                        {/* Active toggle */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex justify-center">
                            <ToggleSwitch
                              checked={inst.is_active}
                              loading={isToggling}
                              onToggle={() => handleToggleActive(inst)}
                              label={`Toggle active for ${inst.name}`}
                            />
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(inst)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-[#143E66] hover:text-white text-[#143E66] border border-slate-300 rounded text-xs font-bold transition cursor-pointer"
                              title="Edit institution"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDelete(inst)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-xs font-bold transition cursor-pointer"
                              title="Delete institution"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          Section 2 — Courses / पाठ्यक्रम प्रबंधन
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden mb-8">
        {/* Card header */}
        <div
          onClick={() => setShowCourses((prev) => !prev)}
          className={`p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-50/60 transition ${
            showCourses ? "border-b border-slate-100" : ""
          }`}
        >
          <div>
            <h2 className="text-lg font-bold text-[#00031D] flex items-center gap-2">
              <svg className="w-5 h-5 text-[#143E66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Courses / पाठ्यक्रम प्रबंधन
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Standardized diploma and certificate programs. Newly added courses automatically appear in Exam Management and College Registration.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600 self-start sm:self-center">
            <span className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              Total: <strong className="text-slate-900">{courses.length}</strong>
            </span>
            <span className="bg-blue-50 text-[#143E66] px-3 py-1.5 rounded-lg border border-blue-200">
              Diploma: <strong>{courses.filter((c) => c.course_type === "diploma").length}</strong>
            </span>
            <span className="bg-amber-50 text-amber-800 px-3 py-1.5 rounded-lg border border-amber-200">
              Certificate: <strong>{courses.filter((c) => c.course_type === "certificate").length}</strong>
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowCourses((prev) => !prev);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ml-1 ${
                showCourses
                  ? "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                  : "bg-[#143E66] text-white border-[#143E66] hover:bg-[#0f2e4d] shadow-xs"
              }`}
            >
              <span>{showCourses ? "Hide Table / छुपाएं" : "Show Table / देखें"}</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${showCourses ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {showCourses && (
          <div className="animate-in fade-in duration-200">

        {/* Collapsible "+ Add New Course" section */}
        <div className="p-6 sm:p-8 border-b border-slate-100">
          <button
            type="button"
            onClick={() => {
              setAddCourseOpen((prev) => {
                if (!prev) {
                  setTimeout(() => {
                    addCourseFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 80);
                } else {
                  resetAddCourseForm();
                }
                return !prev;
              });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#143E66] hover:bg-[#0f2e4d] text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
          >
            <svg
              className={`w-4 h-4 text-[#D4AF37] transition-transform duration-200 ${addCourseOpen ? "rotate-45" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {addCourseOpen ? "Collapse Form / फ़ॉर्म बंद करें" : "+ Add New Course / नया पाठ्यक्रम जोड़ें"}
          </button>

          {addCourseOpen && (
            <div ref={addCourseFormRef} className="mt-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h3 className="text-base font-bold text-[#00031D] flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Course Details / नए पाठ्यक्रम का विवरण
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fill in the details. The course will be live on public /courses and dropdowns immediately.
                </p>
              </div>

              {addCourseError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs font-semibold text-red-700 animate-in fade-in duration-200">
                  <ErrorIcon />
                  <span>{addCourseError}</span>
                </div>
              )}

              <form onSubmit={handleAddCourseSubmit} className="space-y-5">
                <CourseFormFields form={addCourseForm} onChange={patchAddCourseForm} />

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={addCourseSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#143E66] hover:bg-[#0f2e4d] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    {addCourseSubmitting ? (
                      <>
                        <SpinnerIcon cls="w-4 h-4 text-white" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Create Course / पाठ्यक्रम बनाएं
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar select-none">
            <button
              type="button"
              onClick={() => setCourseFilterTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                courseFilterTab === "all"
                  ? "bg-[#143E66] text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              All ({courses.length})
            </button>
            <button
              type="button"
              onClick={() => setCourseFilterTab("diploma")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                courseFilterTab === "diploma"
                  ? "bg-[#143E66] text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              Diploma ({courses.filter((c) => c.course_type === "diploma").length})
            </button>
            <button
              type="button"
              onClick={() => setCourseFilterTab("certificate")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                courseFilterTab === "certificate"
                  ? "bg-[#143E66] text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              Certificate ({courses.filter((c) => c.course_type === "certificate").length})
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
              placeholder="Search by code or title..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#143E66]"
            />
            {courseSearch && (
              <button
                type="button"
                onClick={() => setCourseSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Action Error Banner */}
        {coursesActionError && (
          <div className="mx-6 mt-6 p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <ErrorIcon />
              <span>{coursesActionError}</span>
            </div>
            <button
              type="button"
              onClick={() => setCoursesActionError(null)}
              className="text-red-500 hover:text-red-800 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* List Error */}
        {coursesListError && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center gap-2">
            <ErrorIcon />
            <span>{coursesListError}</span>
          </div>
        )}

        {/* Loading / Empty / Data states */}
        {loadingCourses ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-[#143E66] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-500">Loading courses...</p>
          </div>
        ) : filteredAdminCourses.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-600">No courses match your filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px] tracking-wider">
                  <th className="py-3 px-4 w-14">Order</th>
                  <th className="py-3 px-4 w-28">Code</th>
                  <th className="py-3 px-4 sm:px-6">Course Title</th>
                  <th className="py-3 px-4">Type / Cat</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-center">Active</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAdminCourses.map((c) => {
                  const isToggling = togglingCourseId === c.id;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-500 text-xs">
                        #{c.display_order}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 rounded text-xs font-mono font-bold text-[#143E66]">
                          {c.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <p className="font-semibold text-slate-900 leading-snug">{c.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5 leading-snug">{c.hindi_title}</p>
                        {c.career_scope.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {c.career_scope.slice(0, 2).map((s, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded border border-slate-200"
                              >
                                {s}
                              </span>
                            ))}
                            {c.career_scope.length > 2 && (
                              <span className="px-1.5 py-0.5 bg-slate-50 text-slate-400 text-[10px] font-semibold rounded">
                                +{c.career_scope.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                            c.course_type === "diploma"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-teal-50 text-teal-700 border border-teal-200"
                          }`}
                        >
                          {c.course_type}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-1">{c.category}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <p className="font-medium text-xs">{c.duration_display}</p>
                        <span
                          className={`inline-block mt-1 text-[10px] px-1.5 py-0.2 rounded font-bold ${
                            c.is_two_year
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {c.is_two_year ? "2 Years" : "1 Year"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {c.is_featured ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            ★ Spotlight
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex justify-center">
                          <ToggleSwitch
                            checked={c.is_active}
                            loading={isToggling}
                            onToggle={() => handleToggleCourseActive(c)}
                            label={`Toggle active for ${c.title}`}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditCourseModal(c)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-[#143E66] hover:text-white text-[#143E66] border border-slate-300 rounded text-xs font-bold transition cursor-pointer"
                            title="Edit course"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCourse(c)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-xs font-bold transition cursor-pointer"
                            title="Delete course"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          Section 3 — Announcements / घोषणाएं
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden mb-8">
        {/* Card Header */}
        <div
          onClick={() => setShowAnnouncements((prev) => !prev)}
          className={`p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-50/60 transition ${
            showAnnouncements ? "border-b border-slate-100" : ""
          }`}
        >
          <div>
            <h2 className="text-lg font-bold text-[#00031D] flex items-center gap-2">
              <svg className="w-5 h-5 text-[#143E66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Announcements / घोषणाएं
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Official board notices and circulars. Displayed dynamically on the landing page and the public /announcements page.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600 self-start sm:self-center">
            <span className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              Total: <strong className="text-slate-900">{announcements.length}</strong>
            </span>
            <span className="bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200">
              Published: <strong>{announcements.filter((a) => a.is_published).length}</strong>
            </span>
            <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200">
              Drafts: <strong>{announcements.filter((a) => !a.is_published).length}</strong>
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowAnnouncements((prev) => !prev);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ml-1 ${
                showAnnouncements
                  ? "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                  : "bg-[#143E66] text-white border-[#143E66] hover:bg-[#0f2e4d] shadow-xs"
              }`}
            >
              <span>{showAnnouncements ? "Hide Table / छुपाएं" : "Show Table / देखें"}</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${showAnnouncements ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {showAnnouncements && (
          <div className="animate-in fade-in duration-200">

        {/* Action Bar with "+ Add Announcement" button */}
        <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleOpenAddAnnouncementModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#143E66] hover:bg-[#0f2e4d] text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            + Add Announcement / नई घोषणा जोड़ें
          </button>
        </div>

        {/* Action Error Banner */}
        {announcementsActionError && (
          <div className="mx-6 mt-6 p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <ErrorIcon />
              <span>{announcementsActionError}</span>
            </div>
            <button
              type="button"
              onClick={() => setAnnouncementsActionError(null)}
              className="text-red-500 hover:text-red-800 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* List Error Banner */}
        {announcementsError && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center gap-2">
            <ErrorIcon />
            <span>{announcementsError}</span>
          </div>
        )}

        {/* Loading skeleton / Empty / Table states */}
        {loadingAnnouncements ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-14 bg-slate-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-600">No announcements yet.</p>
            <p className="text-xs text-slate-400 mt-1">
              Click &lsquo;+ Add Announcement&rsquo; above to create one.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px] tracking-wider">
                  <th className="py-3 px-4 w-28">Date</th>
                  <th className="py-3 px-4 sm:px-6">Title</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Attachments</th>
                  <th className="py-3 px-4 text-center">Published</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {announcements.map((item) => {
                  const { day, month, year } = splitDate(item.announcement_date);
                  const isToggling = togglingAnnouncementId === item.id;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {day} {month} {year}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <p className="font-semibold text-slate-900 leading-snug">{item.title_en}</p>
                        {item.title_hi && (
                          <p className="text-xs text-slate-400 mt-0.5 leading-snug">{item.title_hi}</p>
                        )}
                        {(item.description_en || item.description_hi) && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                            {item.description_en || item.description_hi}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {item.is_published ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {item.attachment_url && (
                            <a
                              href={item.attachment_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-[10px] font-bold hover:bg-red-100 transition"
                              title="View PDF"
                            >
                              PDF
                            </a>
                          )}
                          {item.link_url && (
                            <a
                              href={item.link_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-bold hover:bg-blue-100 transition"
                              title="External Link"
                            >
                              Link
                            </a>
                          )}
                          {!item.attachment_url && !item.link_url && (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex justify-center">
                          <ToggleSwitch
                            checked={item.is_published}
                            loading={isToggling}
                            onToggle={() => handleToggleAnnouncementPublish(item)}
                            label={`Toggle publish for ${item.title_en}`}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditAnnouncementModal(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-[#143E66] hover:text-white text-[#143E66] border border-slate-300 rounded text-xs font-bold transition cursor-pointer"
                            title="Edit announcement"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAnnouncement(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-xs font-bold transition cursor-pointer"
                            title="Delete announcement"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          Edit Institution Modal
      ══════════════════════════════════════════════════════════════════════ */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#00031D] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b-2 border-[#D4AF37] shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#143E66] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">
                    Edit Institution / संस्था संपादित करें
                  </h3>
                  <p className="text-[11px] text-slate-300 truncate">
                    {editTarget.center_code} — {editTarget.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseEditModal}
                disabled={editSubmitting}
                className="text-slate-400 hover:text-white text-lg font-bold transition p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleEditSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
              {/* Error */}
              {editModalError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center gap-2">
                  <ErrorIcon />
                  <span>{editModalError}</span>
                </div>
              )}

              <InstitutionFormFields form={editForm} onChange={patchEditForm} />

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  disabled={editSubmitting}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#143E66] hover:bg-[#0f2e4d] disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold shadow-sm transition cursor-pointer"
                >
                  {editSubmitting ? (
                    <>
                      <SpinnerIcon cls="w-3.5 h-3.5 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes / परिवर्तन सहेजें
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          Edit Course Modal
      ══════════════════════════════════════════════════════════════════════ */}
      {editCourseTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#00031D] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b-2 border-[#D4AF37] shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#143E66] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">
                    Edit Course / पाठ्यक्रम संपादित करें
                  </h3>
                  <p className="text-[11px] text-slate-300 truncate">
                    {editCourseTarget.code} — {editCourseTarget.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseEditCourseModal}
                disabled={editCourseSubmitting}
                className="text-slate-400 hover:text-white text-lg font-bold transition p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleEditCourseSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
              {editCourseModalError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center gap-2">
                  <ErrorIcon />
                  <span>{editCourseModalError}</span>
                </div>
              )}

              <CourseFormFields form={editCourseForm} onChange={patchEditCourseForm} />

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseEditCourseModal}
                  disabled={editCourseSubmitting}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editCourseSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#143E66] hover:bg-[#0f2e4d] disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold shadow-sm transition cursor-pointer"
                >
                  {editCourseSubmitting ? (
                    <>
                      <SpinnerIcon cls="w-3.5 h-3.5 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes / परिवर्तन सहेजें
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ══════════════════════════════════════════════════════════════════════
          Add / Edit Announcement Modal
      ══════════════════════════════════════════════════════════════════════ */}
      {announcementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#00031D] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b-2 border-[#D4AF37] shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#143E66] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">
                    {editingAnnouncement
                      ? "Edit Announcement / घोषणा संपादित करें"
                      : "Add Announcement / नई घोषणा जोड़ें"}
                  </h3>
                  <p className="text-[11px] text-slate-300 truncate">
                    {editingAnnouncement
                      ? editingAnnouncement.title_en
                      : "Create a new announcement for students and colleges."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseAnnouncementModal}
                disabled={announcementSubmitting}
                className="text-slate-400 hover:text-white text-lg font-bold transition p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveAnnouncement} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              {announcementFormError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center gap-2">
                  <ErrorIcon />
                  <span>{announcementFormError}</span>
                </div>
              )}

              {/* Title (English) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Title (English) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {announcementForm.title_en.length}/200
                  </span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={announcementForm.title_en}
                  onChange={(e) =>
                    setAnnouncementForm((prev) => ({ ...prev, title_en: e.target.value }))
                  }
                  placeholder="e.g. Admission Open for Academic Session 2024-25"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#143E66] focus:bg-white transition"
                />
              </div>

              {/* Title (Hindi) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Title (Hindi) <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {announcementForm.title_hi.length}/200
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={200}
                  value={announcementForm.title_hi}
                  onChange={(e) =>
                    setAnnouncementForm((prev) => ({ ...prev, title_hi: e.target.value }))
                  }
                  placeholder="e.g. शैक्षणिक सत्र 2024-25 के लिए प्रवेश प्रारंभ"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#143E66] focus:bg-white transition"
                />
              </div>

              {/* Date & Publish Toggle Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Announcement Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={announcementForm.announcement_date}
                    onChange={(e) =>
                      setAnnouncementForm((prev) => ({ ...prev, announcement_date: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#143E66] focus:bg-white transition font-mono"
                  />
                </div>

                <div className="flex flex-col justify-center pt-1 sm:pt-4">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={announcementForm.is_published}
                      onChange={(e) =>
                        setAnnouncementForm((prev) => ({ ...prev, is_published: e.target.checked }))
                      }
                      className="w-4 h-4 rounded accent-[#143E66] cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Publish Immediately
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {announcementForm.is_published
                          ? "Visible to public on landing page & /announcements"
                          : "Saved as Draft (hidden from public)"}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Description (English) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Description (English) <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {announcementForm.description_en.length}/1000
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={announcementForm.description_en}
                  onChange={(e) =>
                    setAnnouncementForm((prev) => ({ ...prev, description_en: e.target.value }))
                  }
                  placeholder="Enter detailed English description or instructions..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#143E66] focus:bg-white transition resize-none"
                />
              </div>

              {/* Description (Hindi) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Description (Hindi) <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {announcementForm.description_hi.length}/1000
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={announcementForm.description_hi}
                  onChange={(e) =>
                    setAnnouncementForm((prev) => ({ ...prev, description_hi: e.target.value }))
                  }
                  placeholder="विवरण हिंदी में दर्ज करें..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#143E66] focus:bg-white transition resize-none"
                />
              </div>

              {/* PDF Attachment Upload */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  PDF Attachment <span className="text-slate-400 font-normal">(Optional, max 1 MB)</span>
                </label>

                {announcementForm.attachment_url ? (
                  <div className="flex items-center justify-between gap-3 p-2.5 bg-white border border-emerald-200 rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                        ✓
                      </span>
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {uploadedFileName || "PDF Attached"}
                      </span>
                      <a
                        href={announcementForm.attachment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-[#143E66] hover:underline shrink-0"
                      >
                        [Preview]
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePdf}
                      className="text-xs font-bold text-red-600 hover:text-red-800 px-2 py-1 bg-red-50 hover:bg-red-100 rounded transition cursor-pointer shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      ref={pdfInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handlePdfUpload}
                      disabled={uploadingPdf}
                      className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#143E66] file:text-white hover:file:bg-[#0f2e4d] file:cursor-pointer cursor-pointer"
                    />
                    {uploadingPdf && (
                      <p className="text-xs text-[#143E66] font-semibold mt-1.5 flex items-center gap-1.5">
                        <SpinnerIcon cls="w-3 h-3 text-[#143E66]" />
                        Uploading PDF to cloud...
                      </p>
                    )}
                  </div>
                )}

                {uploadError && (
                  <p className="text-xs text-red-600 font-medium">{uploadError}</p>
                )}
              </div>

              {/* External Link */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  External Link <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={announcementForm.link_url}
                  onChange={(e) =>
                    setAnnouncementForm((prev) => ({ ...prev, link_url: e.target.value }))
                  }
                  placeholder="https://example.com/circular"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#143E66] focus:bg-white transition font-mono text-xs"
                />
                <p className="text-[11px] text-slate-400 mt-1">Must start with http:// or https://</p>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseAnnouncementModal}
                  disabled={announcementSubmitting}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={announcementSubmitting || uploadingPdf}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#143E66] hover:bg-[#0f2e4d] disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold shadow-sm transition cursor-pointer"
                >
                  {announcementSubmitting ? (
                    <>
                      <SpinnerIcon cls="w-3.5 h-3.5 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Save Announcement / घोषणा सहेजें
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Success Toast Banner ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00031D] text-white px-4 sm:px-5 py-3 rounded-xl shadow-2xl border-2 border-[#D4AF37] flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
            {toastMessage}
          </span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white text-xs font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
