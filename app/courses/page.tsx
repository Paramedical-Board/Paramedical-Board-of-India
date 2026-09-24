import { supabaseAdmin } from "@/lib/supabase";
import CoursesClient, { CourseItem } from "./CoursesClient";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const { data, error } = await supabaseAdmin
    .from("courses")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch courses:", error.message);
  }

  const courses: CourseItem[] = (data || []).map((row) => ({
    id: row.id,
    code: row.code,
    title: row.title,
    hindiTitle: row.hindi_title,
    courseType: row.course_type as "diploma" | "certificate",
    category: row.category,
    duration: row.duration_display,
    isTwoYear: row.is_two_year,
    eligibility: row.eligibility,
    mode: row.mode,
    description: row.description,
    careerScope: row.career_scope || [],
    isFeatured: row.is_featured,
    displayOrder: row.display_order,
  }));

  return <CoursesClient courses={courses} />;
}
