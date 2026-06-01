"use client";

import React from "react";

export default function HeroText() {
  return (
    <div className="flex flex-col items-start gap-3">
      {/* Heavy geometric Sans name header */}
      <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[#111111] leading-[0.9]">
        David<br />Heckhoff
      </h1>
      
      {/* Vinyl sticker-style skewed blue solid badge box */}
      <div className="inline-block transform -rotate-1 skew-x-3 bg-[#005CA8] px-3.5 py-1.5 shadow-[2px_3px_0px_rgba(0,0,0,0.15)] rounded-sm">
        <span className="text-[11px] font-black tracking-[0.25em] text-white uppercase block">
          WEB DEVELOPER
        </span>
      </div>
    </div>
  );
}
