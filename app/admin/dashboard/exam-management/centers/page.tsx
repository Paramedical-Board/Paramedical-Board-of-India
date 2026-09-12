"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface ExamCenter {
  id: string;
  center_name: string;
  center_code: string;
  address: string | null;
  city: string | null;
  created_at?: string;
}

export default function ExamCentersManagementPage() {
  const [centers, setCenters] = useState<ExamCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add Center Form State
  const [addName, setAddName] = useState("");
  const [addCode, setAddCode] = useState("");
  const [addAddress, setAddAddress] = useState("");
  const [addCity, setAddCity] = useState("");
  const [submittingAdd, setSubmittingAdd] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  // Edit Center Modal/State
  const [editingCenter, setEditingCenter] = useState<ExamCenter | null>(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editCity, setEditCity] = useState("");
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const fetchCenters = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/exam-centers");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to load exam centers");
        return;
      }

      setCenters(data.centers || []);
    } catch (err) {
      console.error("Fetch centers error:", err);
      setError("Network error loading exam centers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setAddSuccess(null);

    const name = addName.trim();
    const code = addCode.trim().toUpperCase();
    const address = addAddress.trim() || null;
    const city = addCity.trim() || null;

    if (!name || !code) {
      setAddError("Center Name and Center Code are required.");
      return;
    }

    setSubmittingAdd(true);

    try {
      const res = await fetch("/api/admin/exam-centers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          center_name: name,
          center_code: code,
          address,
          city,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAddError(data.error || "Failed to add exam center.");
        return;
      }

      setAddSuccess(`Exam center "${name}" added successfully!`);
      setAddName("");
      setAddCode("");
      setAddAddress("");
      setAddCity("");
      fetchCenters();
    } catch (err) {
      console.error("Add center error:", err);
      setAddError("Network error adding exam center.");
    } finally {
      setSubmittingAdd(false);
    }
  };

  const startEdit = (center: ExamCenter) => {
    setEditingCenter(center);
    setEditName(center.center_name);
    setEditCode(center.center_code);
    setEditAddress(center.address || "");
    setEditCity(center.city || "");
    setEditError(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCenter) return;

    setEditError(null);

    const name = editName.trim();
    const code = editCode.trim().toUpperCase();
    const address = editAddress.trim();
    const city = editCity.trim();

    if (!name || !code) {
      setEditError("Center Name and Center Code are required.");
      return;
    }

    const updates: Record<string, string | null> = {};
    if (name !== editingCenter.center_name) updates.center_name = name;
    if (code !== editingCenter.center_code) updates.center_code = code;
    if (address !== (editingCenter.address || "")) updates.address = address || null;
    if (city !== (editingCenter.city || "")) updates.city = city || null;

    if (Object.keys(updates).length === 0) {
      setEditingCenter(null);
      return;
    }

    setSubmittingEdit(true);

    try {
      const res = await fetch(`/api/admin/exam-centers/${editingCenter.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || "Failed to update exam center.");
        return;
      }

      setEditingCenter(null);
      fetchCenters();
    } catch (err) {
      console.error("Update center error:", err);
      setEditError("Network error updating exam center.");
    } finally {
      setSubmittingEdit(false);
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Top Breadcrumb & Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link
              href="/admin/dashboard"
              className="hover:text-[#143E66] font-medium transition-colors"
            >
              Dashboard
            </Link>
            <span>/</span>
            <Link
              href="/admin/dashboard/exam-management"
              className="hover:text-[#143E66] font-medium transition-colors"
            >
              Exam Management
            </Link>
            <span>/</span>
            <span className="font-bold text-[#143E66]">Exam Centers</span>
          </nav>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#143E66] text-white flex items-center justify-center shrink-0 shadow-xs">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#00031D] tracking-tight">
                Exam Centers Management / परीक्षा केंद्र प्रबंधन
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Add and manage official examination venue centers and codes used for roll number allotment.
              </p>
            </div>
          </div>
        </div>

        {/* Back Link Button */}
        <Link
          href="/admin/dashboard/exam-management"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded border border-slate-300 transition-colors self-start md:self-auto"
        >
          ← Back to Exam Hub
        </Link>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Centers List Table */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden">
          <div className="bg-[#143E66] px-5 py-3.5 text-white border-b-2 border-[#D4AF37] flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
              Existing Exam Centers ({centers.length})
            </h2>
            <button
              onClick={fetchCenters}
              disabled={loading}
              className="text-xs font-semibold text-slate-200 hover:text-white hover:underline flex items-center gap-1 cursor-pointer"
            >
              <svg className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <svg className="w-8 h-8 animate-spin mx-auto text-[#143E66] mb-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-xs font-semibold">Loading exam centers...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-600 bg-red-50 text-xs">
              <p className="font-bold mb-2">{error}</p>
              <button
                onClick={fetchCenters}
                className="px-3 py-1 bg-red-600 text-white rounded font-semibold text-xs"
              >
                Retry
              </button>
            </div>
          ) : centers.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              <p className="text-sm font-bold text-slate-700">No Exam Centers Configured</p>
              <p className="text-xs text-slate-400 mt-1">Use the form on the right to register your first exam center.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                    <th className="py-3 px-4">Center Code</th>
                    <th className="py-3 px-4">Center Name</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Address</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {centers.map((c) => (
                    <tr key={c.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#143E66]">
                        {c.center_code}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {c.center_name}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {c.city || "—"}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate" title={c.address || ""}>
                        {c.address || "—"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => startEdit(c)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-[#143E66] hover:text-white text-[#143E66] font-bold rounded border border-slate-300 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right 1 Col: Add Center Form Card */}
        <div className="bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden">
          <div className="bg-[#00031D] px-5 py-3.5 text-white border-b-2 border-[#D4AF37]">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Exam Center</span>
            </h2>
          </div>

          <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
            {addSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded text-xs font-semibold">
                {addSuccess}
              </div>
            )}
            {addError && (
              <div className="p-3 bg-red-50 border border-red-300 text-red-800 rounded text-xs font-semibold">
                {addError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Center Code / कोड <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={addCode}
                onChange={(e) => setAddCode(e.target.value.toUpperCase())}
                placeholder="e.g. SBSHE or IPB01"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66] focus:outline-hidden uppercase"
              />
              <p className="text-[10.5px] text-slate-400 mt-1">
                Prefix used to generate student Roll Numbers (e.g. SBSHE240001).
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Center Name / केंद्र का नाम <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                placeholder="e.g. SHAHEED BHAGAT SINGH HEALTH AND EDUCATION"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                City / शहर (Optional)
              </label>
              <input
                type="text"
                value={addCity}
                onChange={(e) => setAddCity(e.target.value)}
                placeholder="e.g. Lucknow or Delhi"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Address / पूरा पता (Optional)
              </label>
              <textarea
                rows={2}
                value={addAddress}
                onChange={(e) => setAddAddress(e.target.value)}
                placeholder="e.g. Main Campus, Sector 4, Vikas Nagar..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={submittingAdd}
              className="w-full py-2.5 px-4 bg-[#143E66] hover:bg-[#0c2a47] active:bg-[#081f34] text-white text-xs font-bold uppercase tracking-wider rounded shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submittingAdd ? "Saving Center..." : "Add Center / केंद्र जोड़ें"}
            </button>
          </form>
        </div>
      </div>

      {/* Edit Center Modal */}
      {editingCenter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setEditingCenter(null)}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full p-6 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-bold text-[#00031D] uppercase tracking-wider">
                Edit Exam Center / परीक्षा केंद्र संपादित करें
              </h3>
              <button
                onClick={() => setEditingCenter(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {editError && (
                <div className="p-3 bg-red-50 border border-red-300 text-red-800 rounded text-xs font-semibold">
                  {editError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Center Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66] uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Center Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  City (Optional)
                </label>
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Address (Optional)
                </label>
                <textarea
                  rows={2}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingCenter(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  className="px-4 py-2 bg-[#143E66] hover:bg-[#0c2a47] text-white text-xs font-bold rounded shadow-md disabled:opacity-50"
                >
                  {submittingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
