"use client";

import React from "react";
import { useStore } from "@/store/useStore";
import { projects as portfolioProjects } from "@/data/portfolioData";

/**
 * ProjectSection — Split-screen cinematic projects layout.
 * Left: Project card list sliding in based on active phase status.
 * Right: Blank column to frame the 3D floating ProjectBox inside the WebGL canvas.
 */
export default function ProjectSection() {
  const phase = useStore((state) => state.phase);

  const projects = portfolioProjects.map((p, idx) => ({
    ...p,
    color: "border-slate-700/50 shadow-[0_8px_32px_rgba(15,23,42,0.45)]",
    badgeColor: "bg-[#1e1b4b]/60 text-[#22d3ee] border-[#818cf8]/25",
    dot: idx % 2 === 0
      ? "bg-[#22d3ee] shadow-[0_0_10px_rgba(34,211,238,0.65)]"
      : "bg-[#818cf8] shadow-[0_0_10px_rgba(129,140,248,0.65)]",
  }));

  const isVisible = phase === "projects";

  // Prevent scroll events from propagating to the main window, stopping scroll snapping from hijacking card list scrolling
  const stopScrollPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 w-full h-full overflow-hidden transition-opacity duration-500 flex items-center"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full px-6 md:px-24 items-center">
        {/* ── LEFT COLUMN: SCROLL-BASED CARD SLIDER ────────────────── */}
        <div style={{ paddingTop: "65px", paddingBottom: "20px" }} className="flex flex-col justify-center h-full max-w-xl pointer-events-auto relative">
          {/* Header */}
          <div
            style={{
              transform: isVisible ? "translate3d(0, 0, 0)" : "translate3d(-40px, 0, 0)",
              opacity: isVisible ? 1 : 0,
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out",
            }}
            className="mb-4"
          >
            <h2 className="text-[#f8fafc] text-3xl font-extrabold tracking-wide">Projects</h2>
          </div>

          {/* Cards container with scroll lock propagation protection */}
          <div
            onWheel={stopScrollPropagation}
            onTouchStart={stopScrollPropagation}
            onTouchMove={stopScrollPropagation}
            style={{
              transform: isVisible ? "translate3d(0, 0, 0)" : "translate3d(-100%, 0, 0)",
              opacity: isVisible ? 1 : 0,
              transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out",
            }}
            className="space-y-6 max-h-[72vh] overflow-y-auto -mx-4 px-4 py-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
          >
            {projects.map((project, idx) => (
              <div
                key={idx}
                onClick={() => window.open(project.link, "_blank")}
                style={{
                  background: "rgba(30, 41, 59, 0.7)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  cursor: "pointer",
                }}
                className={`border ${project.color} rounded-2xl p-6 hover:scale-[1.025] hover:border-[#22d3ee]/80 hover:shadow-[0_0_25px_rgba(34,211,238,0.25)] transition-all duration-300 group relative`}
              >
                {/* Modern CTA indicator */}
                <div className="absolute top-6 right-6 text-[#22d3ee] text-[10px] font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                  <span>View Project</span>
                  <span>↗</span>
                </div>

                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className={`w-2 h-2 rounded-full ${project.dot}`} />
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Project 0{idx + 1}</span>
                </div>
                <h3 className="text-[#f8fafc] text-lg font-bold tracking-wide mb-1.5 group-hover:text-[#22d3ee] transition-colors duration-200">
                  {project.title}
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  {project.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((skill) => (
                    <span
                      key={skill}
                      className={`text-[9px] border px-2 py-0.5 rounded-full font-mono tracking-wide ${project.badgeColor}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN: TRANSPARENT FRAME FOR 3D CANVAS ────────── */}
        <div className="hidden md:block h-full w-full pointer-events-none" />
      </div>
    </div>
  );
}
