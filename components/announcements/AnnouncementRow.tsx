import React from 'react';
import Link from 'next/link';
import type { Announcement } from '@/lib/announcement-types';
import { splitDate, isNewAnnouncement } from '@/lib/announcement-format';

interface AnnouncementRowProps {
  announcement: Announcement;
  className?: string;
}

export default function AnnouncementRow({ announcement, className = '' }: AnnouncementRowProps) {
  const { day, month, year } = splitDate(announcement.announcement_date);
  const isNew = isNewAnnouncement(announcement.announcement_date);
  const description = announcement.description_hi || announcement.description_en;

  return (
    <Link
      href={`/announcements/${announcement.id}`}
      className={`group block bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 border-l-4 border-l-transparent hover:border-l-[#D4AF37] shadow-xs hover:shadow-md hover:bg-slate-50/70 transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#143E66]/30 ${className}`}
    >
      {/* Mobile Top Date Strip (< sm) */}
      <div className="sm:hidden flex items-center justify-between px-4 py-1.5 bg-[#143E66] text-white">
        <time
          dateTime={announcement.announcement_date}
          className="text-xs font-bold tracking-wider text-slate-100 flex items-center gap-1.5"
        >
          <span>{day}</span>
          <span className="text-[#E5C158] font-black">{month}</span>
          <span>{year}</span>
        </time>
        {isNew && (
          <span className="inline-flex items-center px-2 py-0.2 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#B13B1C] text-white shadow-xs">
            NEW
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
        {/* Desktop Date Block (left, >= sm) */}
        <div className="hidden sm:flex flex-col items-center justify-center shrink-0 w-24 md:w-28 bg-[#143E66] text-white py-4 px-3 text-center self-stretch transition-colors group-hover:bg-[#0f2e4d]">
          <time dateTime={announcement.announcement_date} className="flex flex-col items-center">
            <span className="text-3xl font-black text-white leading-none tracking-tight">
              {day}
            </span>
            <span className="text-[11px] font-bold text-[#E5C158] uppercase tracking-wider mt-1.5 leading-none">
              {month} {year}
            </span>
          </time>
        </div>

        {/* Middle Content */}
        <div className="flex-1 p-4 sm:p-5 min-w-0">
          <div className="flex items-start gap-2.5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-[#143E66] group-hover:text-[#0b243d] leading-snug transition-colors">
                  {announcement.title_en}
                </h3>
                {isNew && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#B13B1C] text-white shadow-xs shrink-0">
                    NEW
                  </span>
                )}
              </div>

              {announcement.title_hi && (
                <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 leading-snug">
                  {announcement.title_hi}
                </p>
              )}

              {description && (
                <p className="text-xs sm:text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Attachment / View Action */}
        <div className="flex items-center justify-between sm:justify-end gap-3 px-4 pb-4 sm:p-5 sm:pl-0 shrink-0">
          {announcement.attachment_url && (
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-red-50 text-red-700 border border-red-200"
              title="PDF attachment available"
            >
              <svg className="w-3.5 h-3.5 fill-current text-red-600" viewBox="0 0 20 20">
                <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7.414A2 2 0 0017.414 6L14 2.586A2 2 0 0012.586 2H4zm8 1.414L15.586 7H13a1 1 0 01-1-1V3.414zM6 9a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H7a1 1 0 01-1-1z" />
              </svg>
              <span>PDF</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#8B1F13] group-hover:text-[#6a150c] group-hover:translate-x-0.5 transition-all">
            <span>View</span>
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
