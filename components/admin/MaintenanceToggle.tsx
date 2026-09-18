'use client';

import React, { useState, useEffect } from 'react';

interface MaintenanceToggleProps {
  variant?: 'compact' | 'full';
}

export default function MaintenanceToggle({ variant = 'compact' }: MaintenanceToggleProps) {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [pendingState, setPendingState] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch current maintenance setting on mount
  useEffect(() => {
    let mounted = true;
    async function fetchStatus() {
      try {
        const res = await fetch('/api/admin/system-settings', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (mounted && data.maintenance_mode) {
            setIsEnabled(Boolean(data.maintenance_mode.enabled));
          }
        }
      } catch (err) {
        console.error('Failed to load maintenance status:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchStatus();
    return () => {
      mounted = false;
    };
  }, []);

  const handleToggleClick = () => {
    if (updating || loading) return;
    const next = !isEnabled;
    if (next) {
      // Prompt confirmation before turning maintenance mode ON
      setPendingState(true);
      setShowConfirmModal(true);
    } else {
      // Turning OFF can be done directly or with simple confirmation
      executeToggle(false);
    }
  };

  const executeToggle = async (target: boolean) => {
    setUpdating(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/system-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: target }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update maintenance mode');
      }

      const data = await res.json();
      setIsEnabled(Boolean(data.maintenance_mode?.enabled));
      setShowConfirmModal(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating maintenance mode');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400">
        <div className="w-3 h-3 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
        <span>Syncing status...</span>
      </div>
    );
  }

  return (
    <>
      {/* Switch Component */}
      <div
        className={`flex items-center gap-2.5 ${
          variant === 'full'
            ? 'w-full justify-between p-3 rounded-xl bg-white/5 border border-white/10'
            : 'px-2.5 py-1.5 rounded-lg border bg-black/30'
        } ${
          isEnabled
            ? 'border-rose-500/50 bg-rose-950/20'
            : 'border-emerald-500/40 bg-emerald-950/20'
        } transition-all duration-200`}
      >
        <div className="flex items-center gap-2">
          {/* Pulsing indicator light */}
          <span className="relative flex h-2.5 w-2.5">
            {isEnabled ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            )}
          </span>

          <div className="flex flex-col">
            <span
              className={`text-[11px] sm:text-xs font-bold leading-tight ${
                isEnabled ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {isEnabled ? 'Maintenance Active' : 'Site Live'}
            </span>
            {variant === 'full' && (
              <span className="text-[10px] text-slate-400">
                {isEnabled
                  ? 'Main site is currently locked for visitors'
                  : 'All public pages and admissions are active'}
              </span>
            )}
          </div>
        </div>

        {/* Toggle Switch Button */}
        <button
          type="button"
          onClick={handleToggleClick}
          disabled={updating}
          aria-label={isEnabled ? 'Turn maintenance mode off' : 'Turn maintenance mode on'}
          className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-1 focus:ring-offset-black ${
            isEnabled ? 'bg-rose-600' : 'bg-slate-700'
          } ${updating ? 'opacity-60 cursor-wait' : ''}`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              isEnabled ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Confirmation Modal when turning ON */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-[#00031D] border border-rose-500/50 p-6 shadow-2xl text-white">
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <div className="p-2.5 rounded-full bg-rose-500/20 border border-rose-500/40">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Turn ON Maintenance Mode?</h3>
                <p className="text-xs text-rose-300">साइट मेंटेनेंस मोड चालू करें?</p>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-300 bg-white/5 p-3.5 rounded-xl border border-white/10 mb-4">
              <p>
                Activating this will <strong>immediately lock the public website</strong>.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-400 text-xs">
                <li>Visitors and students will see an official <strong>Under Maintenance</strong> screen.</li>
                <li>All courses, student registrations, results, and inquiries will be locked.</li>
                <li><strong>Admin Dashboard remains fully accessible</strong> so you can switch it off whenever ready.</li>
              </ul>
            </div>

            {errorMsg && (
              <div className="p-2.5 mb-4 text-xs rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300">
                {errorMsg}
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={updating}
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                Cancel / रद्द करें
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={() => executeToggle(true)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/40 transition-all flex items-center gap-2 cursor-pointer"
              >
                {updating ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Locking Site...</span>
                  </>
                ) : (
                  <span>Lock Site (Maintenance ON)</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
