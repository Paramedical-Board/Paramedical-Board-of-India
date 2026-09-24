import { supabaseAdmin } from "@/lib/supabase";
import AffiliatedInstitutionsClient, {
  AffiliatedInstitution,
} from "./AffiliatedInstitutionsClient";

export const dynamic = "force-dynamic";

export default async function AffiliatedInstitutionsPage() {
  const { data, error } = await supabaseAdmin
    .from("affiliated_institutions")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch affiliated institutions:", error.message);
  }

  const institutions: AffiliatedInstitution[] = (data || []).map((row) => ({
    id: row.id,
    centerCode: row.center_code,
    name: row.name,
    hindiName: row.hindi_name,
    district: row.district,
    state: row.state,
    address: row.address,
    affiliatedSince: row.affiliated_since,
    status: row.status,
    approvedPrograms: row.approved_programs || [],
    contactPerson: row.contact_person || undefined,
    phone: row.phone || undefined,
  }));

  return <AffiliatedInstitutionsClient institutions={institutions} />;
}
