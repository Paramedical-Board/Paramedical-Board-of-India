"use client";

import React, { useEffect, useRef, useState } from "react";

/** Width of an A4 sheet at 96dpi — the certificates are designed at this width. */
const A4_PX = 794;

/**
 * Shows its children as a full A4 sheet exactly like on a laptop. On narrower screens (phones)
 * the whole sheet is scaled down to fit the available width instead of reflowing.
 * When printing / saving as PDF the scaling is switched off.
 */
export default function A4Fit({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const update = () => {
      const s = Math.min(1, outer.clientWidth / A4_PX);
      setScale(s);
      setHeight(s < 1 ? inner.offsetHeight * s : undefined);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(outer);
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={outerRef}
      className="a4fit-outer w-full max-w-[794px] mx-auto overflow-hidden"
      style={{ height }}
    >
      <style>{`
        @media print {
          .a4fit-outer { height: auto !important; max-width: none !important; overflow: visible !important; }
          .a4fit-inner { width: 100% !important; transform: none !important; }
        }
      `}</style>
      <div
        ref={innerRef}
        className="a4fit-inner"
        style={{
          width: A4_PX,
          transform: scale < 1 ? `scale(${scale})` : undefined,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
