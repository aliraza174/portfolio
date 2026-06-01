"use client";

import React from "react";
import { useStore } from "@/store/useStore";

export default function Navbar() {
  const phase = useStore((state) => state.phase);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { label: "HOME", id: "hero", matchPhase: "home" },
    { label: "ABOUT", id: "about", matchPhase: "about" },
    { label: "PROJECTS", id: "projects", matchPhase: "projects" },
    { label: "CONTACT", id: "contact", matchPhase: "contact" },
  ];

  const isMusicPlaying = useStore((state) => state.isMusicPlaying);
  const toggleMusic = useStore((state) => state.toggleMusic);

  return (
    <div className="fixed top-4 md:top-6 left-1/2 md:left-24 -translate-x-1/2 md:translate-x-0 w-[calc(100%-2rem)] md:w-auto z-[100] pointer-events-auto flex items-center justify-center md:justify-start">
      <nav className="flex items-center justify-between md:justify-start gap-0.5 md:gap-1 bg-[#0f0c19]/70 backdrop-blur-xl px-2.5 md:px-4 py-1 md:py-1.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.37)] border border-purple-500/15 w-full md:w-auto">
        {navItems.map((item) => {
          const isActive = phase === item.matchPhase;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`text-[9px] md:text-xs font-bold tracking-[0.08em] md:tracking-[0.15em] px-2.5 md:px-4 py-1.5 md:py-2 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                  : "text-zinc-400 hover:text-white border border-transparent"
              }`}
            >
              {item.label}
            </a>
          );
        })}

        {/* Bouncing Lo-Fi Equalizer Toggler */}
        <button
          onClick={toggleMusic}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 10px",
            background: isMusicPlaying ? "rgba(34, 211, 238, 0.12)" : "rgba(255, 255, 255, 0.05)",
            border: isMusicPlaying ? "1px solid rgba(34, 211, 238, 0.3)" : "1px solid rgba(255, 255, 255, 0.1)",
            color: isMusicPlaying ? "#22d3ee" : "#a1a1aa",
            cursor: "pointer",
            borderRadius: "9999px",
            transition: "all 0.3s ease",
            marginLeft: "4px",
          }}
          className="group hover:scale-[1.05] shrink-0"
          title="Toggle Ambient Audio Beats Animation"
        >
          <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "10px", width: "12px" }}>
            <div style={{
              width: "2px",
              background: "currentColor",
              animation: isMusicPlaying ? "eqPulse 1.2s ease-in-out infinite" : "none",
              height: isMusicPlaying ? "100%" : "30%",
            }} />
            <div style={{
              width: "2px",
              background: "currentColor",
              animation: isMusicPlaying ? "eqPulse 0.8s ease-in-out infinite 0.2s" : "none",
              height: isMusicPlaying ? "100%" : "60%",
            }} />
            <div style={{
              width: "2px",
              background: "currentColor",
              animation: isMusicPlaying ? "eqPulse 1.0s ease-in-out infinite 0.4s" : "none",
              height: isMusicPlaying ? "100%" : "40%",
            }} />
          </div>
          <span className="hidden sm:inline font-bold tracking-[0.1em] text-[9px]">
            {isMusicPlaying ? "BEATS ON" : "MUTED"}
          </span>

          <style>{`
            @keyframes eqPulse {
              0%, 100% { height: 30%; }
              50% { height: 100%; }
            }
          `}</style>
        </button>
      </nav>
    </div>
  );
}
