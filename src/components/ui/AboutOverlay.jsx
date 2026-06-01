"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { personalInfo } from "@/data/portfolioData";

/**
 * AboutOverlay — Staggered three-box profile cards and dynamic SVG connectors,
 * rendered as a fixed overlay outside the WebGL canvas.
 *
 * Sequence:
 * - System Core: Head anchor (slides from right, delay 0.2s)
 * - Engine Specs: Chest anchor (slides from left, delay 0.4s)
 * - Ops & Deployment: Hips anchor (slides from right, delay 0.6s)
 */
export default function AboutOverlay() {
  const phase = useStore((state) => state.phase);
  const [revealed, setRevealed] = useState(false);

  // Stagger reveal trigger slightly after mounting the About scene
  useEffect(() => {
    if (phase === "about") {
      const timer = setTimeout(() => setRevealed(true), 300);
      return () => clearTimeout(timer);
    } else {
      setRevealed(false);
    }
  }, [phase]);

  const isVisible = phase === "about";

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 w-full h-full md:overflow-hidden flex flex-row md:block items-center md:items-stretch gap-6 md:gap-0 px-6 md:px-0 py-24 md:py-0 md:pt-[15vh] overflow-x-auto md:overflow-y-hidden snap-x snap-mandatory scrollbar-none"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.4s ease",
        pointerEvents: isVisible ? "auto" : "none",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>
      {/* ── SVG CONNECTOR LINES ──────────────────────────────────── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="glow-purple" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="glow-blue" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="glow-green" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* 1. Head anchor + connector (0.2s delay) */}
        <g
          id="about-head-line"
          style={{
            opacity: revealed ? 1 : 0,
            transition: "opacity 0.5s ease 0.2s",
          }}
        >
          <circle id="about-head-dot" r="5" fill="#c084fc" />
          <circle
            id="about-head-ping"
            r="14"
            fill="none"
            stroke="#c084fc"
            strokeWidth="1.5"
            opacity="0.35"
          >
            <animate attributeName="r" from="6" to="18" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.6" to="0" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <path
            id="about-head-line-path"
            fill="none"
            stroke="url(#glow-purple)"
            strokeWidth="1.5"
            strokeDasharray="6 3"
          />
        </g>

        {/* 2. Chest anchor + connector (0.4s delay) */}
        <g
          id="about-chest-line"
          style={{
            opacity: revealed ? 1 : 0,
            transition: "opacity 0.5s ease 0.4s",
          }}
        >
          <circle id="about-chest-dot" r="5" fill="#60a5fa" />
          <circle
            id="about-chest-ping"
            r="14"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="1.5"
            opacity="0.35"
          >
            <animate attributeName="r" from="6" to="18" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.6" to="0" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <path
            id="about-chest-line-path"
            fill="none"
            stroke="url(#glow-blue)"
            strokeWidth="1.5"
            strokeDasharray="6 3"
          />
        </g>

        {/* 3. Hips anchor + connector (0.6s delay) */}
        <g
          id="about-hips-line"
          style={{
            opacity: revealed ? 1 : 0,
            transition: "opacity 0.5s ease 0.6s",
          }}
        >
          <circle id="about-hips-dot" r="5" fill="#34d399" />
          <circle
            id="about-hips-ping"
            r="14"
            fill="none"
            stroke="#34d399"
            strokeWidth="1.5"
            opacity="0.35"
          >
            <animate attributeName="r" from="6" to="18" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.6" to="0" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <path
            id="about-hips-line-path"
            fill="none"
            stroke="url(#glow-green)"
            strokeWidth="1.5"
            strokeDasharray="6 3"
          />
        </g>
      </svg>

      {/* ── CARD 1: HEAD INFO BOX (slides in from right, delay 0.2s) ─────── */}
      <div
        id="about-head-box"
        className="relative md:absolute pointer-events-auto w-[85vw] max-w-[320px] md:w-[300px] shrink-0 snap-center"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translate3d(0, 0, 0)" : "translate3d(40px, 0, 0)",
          transition:
            "opacity 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s",
          willChange: "transform, opacity",
        }}
      >
        <div className="bg-[#1a1a2e]/85 backdrop-blur-2xl border border-purple-500/25 rounded-2xl p-6 shadow-[0_16px_48px_rgba(147,51,234,0.18)] hover:border-purple-400/45 hover:shadow-[0_20px_60px_rgba(147,51,234,0.25)] transition-all duration-300 group">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.6)]" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-purple-400 uppercase">System Core</span>
          </div>
          <h3 className="text-white text-lg font-bold tracking-wide mb-1.5 group-hover:text-purple-300 transition-colors duration-200">
            {personalInfo.competencies.systemCore.title}
          </h3>
          <p className="text-zinc-400 text-[13px] leading-relaxed mb-4">
            {personalInfo.competencies.systemCore.desc}
          </p>
          <div className="flex flex-wrap gap-2">
            {personalInfo.competencies.systemCore.skills.map((skill) => (
              <span
                key={skill}
                className="text-[10px] bg-purple-500/8 text-purple-300 border border-purple-500/20 px-2.5 py-1 rounded-full font-mono tracking-wide"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── CARD 2: CHEST INFO BOX (slides in from left, delay 0.4s) ─────── */}
      <div
        id="about-chest-box"
        className="relative md:absolute pointer-events-auto w-[85vw] max-w-[320px] md:w-[300px] shrink-0 snap-center"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translate3d(0, 0, 0)" : "translate3d(-40px, 0, 0)",
          transition:
            "opacity 0.6s cubic-bezier(0.16,1,0.3,1) 0.4s, transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.4s",
          willChange: "transform, opacity",
        }}
      >
        <div className="bg-[#1a1a2e]/85 backdrop-blur-2xl border border-blue-500/25 rounded-2xl p-6 shadow-[0_16px_48px_rgba(59,130,246,0.18)] hover:border-blue-400/45 hover:shadow-[0_20px_60px_rgba(59,130,246,0.25)] transition-all duration-300 group">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-blue-400 uppercase">Engine Specs</span>
          </div>
          <h3 className="text-white text-lg font-bold tracking-wide mb-1.5 group-hover:text-blue-300 transition-colors duration-200">
            {personalInfo.competencies.engineSpecs.title}
          </h3>
          <p className="text-zinc-400 text-[13px] leading-relaxed mb-4">
            {personalInfo.competencies.engineSpecs.desc}
          </p>
          <div className="flex flex-wrap gap-2">
            {personalInfo.competencies.engineSpecs.skills.map((skill) => (
              <span
                key={skill}
                className="text-[10px] bg-blue-500/8 text-blue-300 border border-blue-500/20 px-2.5 py-1 rounded-full font-mono tracking-wide"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── CARD 3: HIPS INFO BOX (slides in from right, delay 0.6s) ─────── */}
      <div
        id="about-hips-box"
        className="relative md:absolute pointer-events-auto w-[85vw] max-w-[320px] md:w-[300px] shrink-0 snap-center"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translate3d(0, 0, 0)" : "translate3d(40px, 0, 0)",
          transition:
            "opacity 0.6s cubic-bezier(0.16,1,0.3,1) 0.6s, transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.6s",
          willChange: "transform, opacity",
        }}
      >
        <div className="bg-[#1a1a2e]/85 backdrop-blur-2xl border border-emerald-500/25 rounded-2xl p-6 shadow-[0_16px_48px_rgba(16,185,129,0.18)] hover:border-emerald-400/45 hover:shadow-[0_20px_60px_rgba(16,185,129,0.25)] transition-all duration-300 group">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 uppercase">Ops & Deploy</span>
          </div>
          <h3 className="text-white text-lg font-bold tracking-wide mb-1.5 group-hover:text-emerald-300 transition-colors duration-200">
            {personalInfo.competencies.opsDeployment.title}
          </h3>
          <p className="text-zinc-400 text-[13px] leading-relaxed mb-4">
            {personalInfo.competencies.opsDeployment.desc}
          </p>
          <div className="flex flex-wrap gap-2">
            {personalInfo.competencies.opsDeployment.skills.map((skill) => (
              <span
                key={skill}
                className="text-[10px] bg-emerald-500/8 text-emerald-300 border border-emerald-500/20 px-2.5 py-1 rounded-full font-mono tracking-wide"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
