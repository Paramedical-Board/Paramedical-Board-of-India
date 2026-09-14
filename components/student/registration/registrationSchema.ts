import { z } from "zod";

export const educationEntryFormSchema = z.object({
  board: z.string().min(1, "Board/University is required"),
  year: z.string().regex(/^\d{4}$/, "Enter a valid 4-digit year (YYYY)"),
  total: z.coerce.number({ message: "Total marks required" }).positive("Total marks must be greater than 0"),
  obtained: z.coerce.number({ message: "Obtained marks required" }).nonnegative("Obtained marks cannot be negative"),
  percentage: z.coerce.number({ message: "Percentage required" }).min(0, "Min 0%").max(100, "Max 100%"),
});

export const optionalEducationEntryFormSchema = z.object({
  board: z.string().optional().default(""),
  year: z.string().optional().default(""),
  total: z.union([z.coerce.number(), z.literal(""), z.nan()]).optional(),
  obtained: z.union([z.coerce.number(), z.literal(""), z.nan()]).optional(),
  percentage: z.union([z.coerce.number(), z.literal(""), z.nan()]).optional(),
});

export const studentRegistrationSchema = z.object({
  // Personal Details
  candidate_name: z
    .string()
    .min(2, "Candidate Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s.]+$/, "Name should contain only letters and spaces"),
  father_name: z
    .string()
    .min(2, "Father's Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s.]+$/, "Name should contain only letters and spaces"),
  mother_name: z
    .string()
    .min(2, "Mother's Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s.]+$/, "Name should contain only letters and spaces"),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of Birth must be in YYYY-MM-DD format"),
  category: z.enum(["General", "OBC", "SC", "ST", "EWS"], {
    message: "Please select a category",
  }),
  gender: z.enum(["Male", "Female", "Other"], {
    message: "Please select a gender",
  }),

  // Contact Details
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number (starts with 6-9)"),
  email: z.string().email("Please enter a valid email address"),
  academic_session: z.string().min(1, "Academic session is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  district: z.string().min(2, "District name is required"),
  state: z.string().min(2, "Please select a state"),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "PIN Code must be exactly 6 digits"),

  // Course Details
  course: z.string().min(1, "Please select a course"),

  // Educational Qualifications
  education: z.object({
    high_school: educationEntryFormSchema,
    intermediate: educationEntryFormSchema,
    graduation: optionalEducationEntryFormSchema.optional(),
    other: optionalEducationEntryFormSchema.optional(),
  }),

  // Document Uploads (Image URLs)
  photo_url: z.string().min(1, "Passport-size photograph is required"),
  signature_url: z.string().min(1, "Candidate signature is required"),
  aadhaar_url: z.string().min(1, "Aadhaar Card document is required"),
  marksheet_10th_url: z.string().min(1, "10th Marksheet is required"),
  marksheet_12th_url: z.string().min(1, "12th Marksheet is required"),
  affidavit_url: z.string().min(1, "Affidavit document is required"),

  // Captcha & Declaration
  captchaInput: z.string().min(1, "Captcha code is required"),
  declaration: z.boolean().refine((val) => val === true, {
    message: "You must confirm that information provided is correct",
  }),
});

export type StudentRegistrationFormData = z.infer<typeof studentRegistrationSchema>;

export interface RegistrationPayload {
  candidate_name: string;
  father_name: string;
  mother_name: string;
  dob: string;
  category: "General" | "OBC" | "SC" | "ST" | "EWS";
  gender: "Male" | "Female" | "Other";
  mobile: string;
  email: string;
  academic_session: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  course: string;
  education: {
    high_school: { board: string; year: string; total: number; obtained: number; percentage: number };
    intermediate: { board: string; year: string; total: number; obtained: number; percentage: number };
    graduation?: { board?: string; year?: string; total?: number; obtained?: number; percentage?: number };
    other?: { board?: string; year?: string; total?: number; obtained?: number; percentage?: number };
  };
  photo_url: string;
  signature_url: string;
  aadhaar_url: string;
  marksheet_10th_url: string;
  marksheet_12th_url: string;
  affidavit_url: string;
}

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (NCT)",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export const PARAMEDICAL_COURSES = [
  "Certificate in Medical Laboratory Technology (CMLT)",
  "Certificate in Operation Theatre Technology (COTT)",
  "Certificate in Dialysis Technician (CDT)",
  "Certificate in General Duty Assistant (CGDA)",
  "Certificate in ECG Technician (CECG)",
  "Certificate in Medical Radiology & Imaging Technology (CMRIT)",
  "Certificate in Emergency Medical Technician (CEMT)",
  "Certificate in Child Care & Education (CCCE)",
  "Certificate in Community Medical Services & Essential Drugs (CCMS & ED)",
  "Certificate in First Aid & CPR (First Aid & CPR)",
  "Certificate in Blood Bank Technology (CBBT)",
  "Certificate in Multipurpose Health Worker (CMHW)",
  "Certificate in Dental Technician & Hygienist (CDTH)",
  "Certificate in X-ray (Cert. X-ray)",
  "Certificate in Ultrasonography (CU)",
  "Certificate in Phlebotomy Technology (CPT)",
  "Certificate in CT Scan Technician (Cert. CT Scan)",
  "Certificate in Sanitary Inspector (CSI)",
  "Certificate in Medical Dressing (CMD)",
];

export const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"] as const;

export const GENDERS = [
  { value: "Male", label: "Male / पुरुष" },
  { value: "Female", label: "Female / महिला" },
  { value: "Other", label: "Other / अन्य" },
] as const;

export const SESSIONS = ["2026-2027", "2025-2026", "2024-2025", "2023-2024"];
