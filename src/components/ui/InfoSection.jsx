"use client";

import React from "react";

export default function InfoSection({ title, subtitle, children, className = "" }) {
  return (
    <div className={`max-w-xl rounded-2xl border border-white/5 bg-black/30 p-8 backdrop-blur-md ${className}`}>
      {/* Title */}
      <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
        {title}
      </h2>
      
      {/* Subtitle */}
      {subtitle && (
        <p className="mt-2 text-xs uppercase tracking-widest text-purple-400 font-bold">
          {subtitle}
        </p>
      )}

      {/* Children content */}
      <div className="mt-6 text-sm text-zinc-300 leading-relaxed font-light">
        {children}
      </div>
    </div>
  );
}
