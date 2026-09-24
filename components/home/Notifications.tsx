import React from "react";
import Link from "next/link";
import { getLatestAnnouncements } from "@/lib/announcements";
import AnnouncementRow from "@/components/announcements/AnnouncementRow";

export default async function Notifications() {
  const announcements = await getLatestAnnouncements(4);

  return (
    <section className="w-full bg-white pt-6 sm:pt-8 md:pt-10 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto">
        {/* Heading & View All Button Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8 pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5 sm:gap-4 text-center sm:text-left">
            <span className="hidden xs:inline-block w-6 sm:w-10 h-[2px] bg-[#D4AF37]" />
            <h2 className="text-[15px] xs:text-base sm:text-lg md:text-[22px] font-black text-[#143E66] tracking-wider uppercase font-sans">
              NEW ANNOUNCEMENTS / नई घोषणाएं
            </h2>
            <span className="hidden xs:inline-block w-6 sm:w-10 h-[2px] bg-[#D4AF37]" />
          </div>

          {announcements.length > 0 && (
            <Link
              href="/announcements"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#8B1F13] hover:text-[#6a150c] px-4 py-2 rounded-lg border border-[#8B1F13]/25 hover:border-[#8B1F13] hover:bg-[#8B1F13]/5 transition-all shadow-2xs"
            >
              <span>View All / सभी देखें</span>
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

        {/* Announcements List or Empty State */}
        {announcements.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-2xl bg-slate-50 border border-slate-200/80">
            <p className="text-sm font-semibold text-slate-500">
              No announcements at the moment. / अभी कोई घोषणा उपलब्ध नहीं है।
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <AnnouncementRow key={announcement.id} announcement={announcement} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
