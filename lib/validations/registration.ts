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

const draftEducationEntrySchema = z.object({
  board: z.string().optional().default(''),
  year: z.string().optional().default(''),
  total: z.union([z.coerce.number(), z.literal(''), z.null()]).optional(),
  obtained: z.union([z.coerce.number(), z.literal(''), z.null()]).optional(),
  percentage: z.union([z.coerce.number(), z.literal(''), z.null()]).optional(),
}).partial();

export const draftRegistrationSchema = z.object({
  candidate_name: z.string().optional(),
  father_name: z.string().optional(),
  mother_name: z.string().optional(),
  dob: z.string().optional(),
  category: z.string().optional(),
  gender: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().optional(),
  academic_session: z.string().optional(),
  address: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  course: z.string().optional(),
  education: z.object({
    high_school: draftEducationEntrySchema.optional(),
    intermediate: draftEducationEntrySchema.optional(),
    graduation: draftEducationEntrySchema.optional(),
    other: draftEducationEntrySchema.optional(),
  }).partial().optional(),
  photo_url: z.string().optional(),
  signature_url: z.string().optional(),
  aadhaar_url: z.string().optional(),
  marksheet_10th_url: z.string().optional(),
  marksheet_12th_url: z.string().optional(),
  affidavit_url: z.string().optional(),
}).passthrough();

export type DraftRegistrationInput = z.infer<typeof draftRegistrationSchema>;
