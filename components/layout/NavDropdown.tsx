"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface DropdownItem {
  name: string;
  href?: string;
  isPlaceholder?: boolean;
  badge?: string;
}

interface NavDropdownProps {
  name: string;
  items: DropdownItem[];
  active?: boolean;
}

export default function NavDropdown({ name, items, active = false }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block text-left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`px-3.5 sm:px-4 py-2 transition-all duration-150 rounded-[2px] flex items-center gap-1.5 cursor-pointer text-[13.5px] font-medium ${
          active
            ? "bg-[#0d2a45] text-white font-bold border-b-2 border-[#D4AF37]"
            : isOpen
            ? "bg-[#0d2a45]/80 text-white font-semibold"
            : "hover:bg-white/15 text-white/95 hover:text-white"
        }`}
      >
        <span>{name}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#D4AF37]" : active ? "text-[#D4AF37]" : "text-white/80"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-0.5 w-60 origin-top-left bg-white rounded-b-md shadow-xl border-t-2 border-[#D4AF37] border-x border-b border-slate-200/80 py-1 z-50 animate-fadeIn divide-y divide-slate-100">
          <div className="py-1">
            {items.map((item) => {
              if (item.isPlaceholder || !item.href) {
                return (
                  <div
                    key={item.name}
                    className="px-4 py-2.5 text-xs sm:text-[13px] text-slate-400 flex items-center justify-between cursor-not-allowed select-none bg-slate-50/50"
                  >
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="text-[10px] font-semibold bg-slate-200/80 text-slate-500 px-1.5 py-0.5 rounded">
                        {item.badge}
                      </span>
                    )}
                  </div>
                );
              }

              const isItemActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 text-xs sm:text-[13px] flex items-center justify-between transition-colors group ${
                    isItemActive
                      ? "bg-[#EBF4FA] text-[#143E66] font-bold border-l-3 border-[#D4AF37]"
                      : "font-semibold text-slate-700 hover:text-[#143E66] hover:bg-[#EBF4FA]"
                  }`}
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">
                    {item.name}
                  </span>
                  {item.badge ? (
                    <span className="text-[10px] font-bold bg-[#B13B1C] text-white px-1.5 py-0.5 rounded shadow-2xs">
                      {item.badge}
                    </span>
                  ) : (
                    <svg
                      className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#143E66] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
