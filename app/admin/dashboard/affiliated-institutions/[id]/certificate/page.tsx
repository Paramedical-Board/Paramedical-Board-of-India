"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import AffiliationCertificateLayout from "@/components/AffiliationCertificateLayout";
import AffiliationCertIssueCard from "@/components/admin/AffiliationCertIssueCard";

interface InstitutionRow {
  id: string;
  name: string;
  hindi_name: string;
  district: string;
  state: string;
  address: string;
  affiliated_since: string;
  status: string;
  approved_programs: string[];
  contact_person?: string | null;
  affiliation_cert_no?: string | null;
  affiliation_cert_issued_at?: string | null;
}

export default function AffiliationCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [institution, setInstitution] = useState<InstitutionRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/affiliated-institutions");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load institution");
        return;
      }
      const match = (data.institutions || []).find((i: { id: string }) => i.id === id);
      if (!match) {
        setError("Institution not found");
        return;
      }
      setInstitution(match);
      setError(null);
    } catch (err) {
      console.error("Load affiliation certificate error:", err);
      setError("Network error while loading institution.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <div className="flex-1 flex items-center justify-center py-20 text-sm text-slate-500">Loading…</div>;
  }

  if (error || !institution) {
    return (
      <div className="flex-1 max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-sm text-red-700 font-semibold mb-4">{error || "Institution not found"}</p>
        <Link href="/admin/dashboard/ui-modifications" className="text-[#143E66] text-sm font-bold hover:underline">
          ← Back to UI Modifications
        </Link>
      </div>
    );
  }

  const certNo = institution.affiliation_cert_no ?? null;

  return (
    <div className="flex-1 max-w-[900px] w-full mx-auto px-4 sm:px-6 py-8 print:p-0">
      <div className="mb-4 flex items-center justify-between no-print print:hidden">
        <Link
          href="/admin/dashboard/ui-modifications"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-[#143E66] border border-slate-300 rounded-md text-xs font-bold shadow-2xs transition-colors"
        >
          ← Back
        </Link>
        {certNo && <PrintButton label="Print / Download PDF" />}
      </div>

      <AffiliationCertIssueCard
        institutionId={institution.id}
        certNo={certNo}
        issuedAt={institution.affiliation_cert_issued_at ?? null}
        directorName={institution.contact_person ?? null}
        onChanged={(newCertNo, newIssuedAt, newDirectorName) =>
          setInstitution((prev) =>
            prev
              ? {
                  ...prev,
                  affiliation_cert_no: newCertNo,
                  affiliation_cert_issued_at: newIssuedAt,
                  contact_person: newDirectorName,
                }
              : prev
          )
        }
      />

      {certNo ? (
        <AffiliationCertificateLayout
          institution={{
            affiliation_cert_no: certNo,
            name: institution.name,
            hindi_name: institution.hindi_name,
            district: institution.district,
            state: institution.state,
            address: institution.address,
            affiliated_since: institution.affiliated_since,
            status: institution.status,
            approved_programs: institution.approved_programs,
            contact_person: institution.contact_person,
          }}
        />
      ) : (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center text-sm text-slate-500">
          Set an Affiliation No. above to preview and print this certificate.
        </div>
      )}
    </div>
  );
}
