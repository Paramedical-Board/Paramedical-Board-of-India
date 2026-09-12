import { z } from 'zod';

const educationEntrySchema = z.object({
  board: z.string().min(1, 'Board/University is required'),
  year: z.string().regex(/^\d{4}$/, 'Enter a valid 4-digit year'),
  total: z.coerce.number().positive(),
  obtained: z.coerce.number().nonnegative(),
  percentage: z.coerce.number().min(0).max(100),
});

// Graduation and Other/Diploma are optional rows
const optionalEducationEntrySchema = educationEntrySchema.partial().optional();

export const registrationSchema = z.object({
  // Personal Details
  candidate_name: z.string().min(2, 'Candidate name is required'),
  father_name: z.string().min(2, "Father's name is required"),
  mother_name: z.string().min(2, "Mother's name is required"),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'DOB must be in YYYY-MM-DD format'),
  category: z.enum(['General', 'OBC', 'SC', 'ST', 'EWS']),
  gender: z.enum(['Male', 'Female', 'Other']),

  // Contact Details
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Enter a valid email address'),
  academic_session: z.string().min(1),
  address: z.string().min(5, 'Address is too short'),
  district: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/, 'PIN code must be 6 digits'),

  // Course
  course: z.string().min(1, 'Please select a course'),

  // Educational Qualifications
  education: z.object({
    high_school: educationEntrySchema,
    intermediate: educationEntrySchema,
    graduation: optionalEducationEntrySchema,
    other: optionalEducationEntrySchema,
  }),

  // Documents — these are ImageKit URLs, already uploaded by this point
  photo_url: z.string().url(),
  signature_url: z.string().url(),
  aadhaar_url: z.string().url(),
  marksheet_10th_url: z.string().url(),
  marksheet_12th_url: z.string().url(),
  affidavit_url: z.string().url(),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
