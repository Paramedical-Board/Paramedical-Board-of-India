'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface SystemSettingsData {
  maintenance_mode?: {
    enabled: boolean;
    message?: string;
  };
}

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMaintenanceActive, setIsMaintenanceActive] = useState<boolean>(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState<string>('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [hasChecked, setHasChecked] = useState<boolean>(false);

  // Exclude admin routes and API routes from any blocking
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api');

  useEffect(() => {
    if (isAdminRoute) {
      setHasChecked(true);
      return;
    }

    let isSubscribed = true;

    async function checkMaintenanceStatus() {
      try {
        // Quick check for admin cookie
        const hasAdminCookie =
          typeof document !== 'undefined' &&
          document.cookie.split('; ').some((row) => row.startsWith('admin_session_token='));
        if (isSubscribed) setIsAdminLoggedIn(hasAdminCookie);

        const res = await fetch('/api/public/system-settings', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        });

        if (res.ok) {
          const data: SystemSettingsData = await res.json();
          if (isSubscribed && data.maintenance_mode) {
            setIsMaintenanceActive(Boolean(data.maintenance_mode.enabled));
            if (data.maintenance_mode.message) {
              setMaintenanceMessage(data.maintenance_mode.message);
            }
          }
        }
      } catch (err) {
        console.error('Failed checking maintenance status:', err);
      } finally {
        if (isSubscribed) setHasChecked(true);
      }
    }

    checkMaintenanceStatus();

    // Check periodically every 30 seconds
    const interval = setInterval(checkMaintenanceStatus, 30000);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [pathname, isAdminRoute]);

  // If on admin or API route, pass through directly
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // If maintenance is active
  if (isMaintenanceActive) {
    // If admin is logged in, allow browsing with a persistent warning banner
    if (isAdminLoggedIn) {
      return (
        <>
          <div className="bg-rose-700 text-white px-4 py-2 text-xs font-bold flex items-center justify-between sticky top-0 z-50 shadow-md border-b-2 border-[#D4AF37]">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <span>
                ⚠️ <strong>ADMIN PREVIEW</strong>: Site Maintenance Mode is ACTIVE. Public visitors are completely locked out.
              </span>
            </div>
            <Link
              href="/admin/dashboard"
              className="bg-white text-rose-800 px-3 py-1 rounded text-[11px] font-black uppercase hover:bg-slate-100 transition-colors shrink-0 ml-4"
            >
              Go to Dashboard / Turn OFF
            </Link>
          </div>
          {children}
        </>
      );
    }

    // Full screen official lock barrier for all public visitors
    return (
      <div className="fixed inset-0 z-99999 bg-[#00031D] text-white overflow-y-auto">
        {/* Subtle decorative background glow */}
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#143E66]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="min-h-screen w-full flex flex-col items-center justify-start py-8 sm:py-12 px-4 sm:px-6">
          <div className="relative z-10 max-w-2xl w-full flex flex-col items-center text-center space-y-4 my-auto">
            {/* Official Emblem & Logo */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 drop-shadow-2xl">
              <Image
                src="/logo.png"
                alt="Indian Paramedical Board of India Emblem"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Institutional Title */}
            <div className="space-y-1">
              <h2 className="text-sm sm:text-base md:text-lg font-black tracking-widest text-[#D4AF37] uppercase leading-tight">
                INDIAN PARAMEDICAL BOARD OF INDIA
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-semibold">
                इण्डियन पैरामेडिकल बोर्ड ऑफ इण्डिया
              </p>
            </div>

            {/* Maintenance Status Card */}
            <div className="w-full bg-black/60 border border-[#D4AF37]/30 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4">
              {/* Pulsing Alert Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                </span>
                Under Scheduled Maintenance / पोर्टल रखरखाव
              </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                Portal Is Temporarily Offline
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
                {maintenanceMessage ||
                  'The Indian Paramedical Board of India portal is currently undergoing scheduled system upgrades and database maintenance to serve you better.'}
              </p>
            </div>

            {/* Notice Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
              <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl">
                <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-xs mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Protected Services</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  All admissions, verification, admit card generation, and results services are safely paused.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Data Security</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  All applicant records, submitted forms, and institutional credentials remain completely safe and intact.
                </p>
              </div>
            </div>

            {/* Helpline / Contact info */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>For emergency board inquiries: contact the administrative desk.</span>
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                Status Code: 503 SERVICE_MAINTENANCE
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

  // Normal flow
  return <>{children}</>;
}
