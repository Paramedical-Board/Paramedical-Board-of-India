"use client";

import React, { useState, useEffect } from "react";

export const DEFAULT_DOMAIN = "indianparamedicalboardofindia.com";

/**
 * Custom hook to get the active domain, dynamic email (info@<domain>), and website URL.
 * Detects window.location.hostname in browser. If on localhost/IP, falls back to DEFAULT_DOMAIN.
 */
export function useDynamicDomain(defaultDomain: string = DEFAULT_DOMAIN) {
  const [domain, setDomain] = useState<string>(defaultDomain);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      // Exclude localhost and private IPs so local development displays the official domain
      if (
        host &&
        host !== "localhost" &&
        host !== "127.0.0.1" &&
        !host.startsWith("192.168.") &&
        !host.startsWith("10.")
      ) {
        setDomain(host.replace(/^www\./, "").toLowerCase());
      }
    }
  }, [defaultDomain]);

  return {
    domain,
    email: `info@${domain}`,
    mailto: `mailto:info@${domain}`,
    webDisplay: `www.${domain}`,
    webHref: `https://www.${domain}`,
  };
}

/**
 * Footer Email Item with icon & hover styling
 */
export function FooterEmailLink() {
  const { email, mailto } = useDynamicDomain();

  return (
    <a href={mailto} className="flex items-center gap-2.5 group cursor-pointer min-w-0">
      <div className="w-7 h-7 rounded-lg bg-white/[0.08] flex items-center justify-center text-[#E5C158] shrink-0 border border-white/10 group-hover:bg-[#E5C158] group-hover:text-[#0A2545] transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <span className="group-hover:text-white transition-colors text-[11.5px] truncate">
        {email}
      </span>
    </a>
  );
}

/**
 * Footer Website Item with icon & hover styling
 */
export function FooterWebLink() {
  const { webDisplay, webHref } = useDynamicDomain();

  return (
    <a href={webHref} className="flex items-center gap-2.5 group cursor-pointer min-w-0">
      <div className="w-7 h-7 rounded-lg bg-white/[0.08] flex items-center justify-center text-[#E5C158] shrink-0 border border-white/10 group-hover:bg-[#E5C158] group-hover:text-[#0A2545] transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 014-10z" />
        </svg>
      </div>
      <span className="group-hover:text-white transition-colors text-[11.5px] truncate">
        {webDisplay}
      </span>
    </a>
  );
}

/**
 * Contact Us Page Email link component
 */
export function ContactPageEmailLink() {
  const { email, mailto } = useDynamicDomain();

  return (
    <a href={mailto} className="text-white hover:text-[#E5C158] transition-colors font-medium">
      {email}
    </a>
  );
}

/**
 * Contact Us Page Website link component
 */
export function ContactPageWebLink() {
  const { webDisplay, webHref } = useDynamicDomain();

  return (
    <a href={webHref} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#E5C158] transition-colors font-medium">
      {webDisplay}
    </a>
  );
}
