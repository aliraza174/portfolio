"use client";

import React from "react";

export default function CTAButton() {
  return (
    <div className="flex items-center gap-3 pointer-events-auto">
      {/* High-contrast orange capsule button */}
      <button className="px-6 py-3 rounded-full bg-[#FF923E] hover:bg-[#e07b2b] text-white text-[11px] font-black tracking-widest uppercase transition-all duration-300 shadow-[0_4px_15px_rgba(255,146,62,0.3)]">
        GET IN TOUCH
      </button>

      {/* Circular interactive Audio Toggle */}
      <button className="w-10 h-10 rounded-full bg-white hover:bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-600 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
        </svg>
      </button>
    </div>
  );
}
