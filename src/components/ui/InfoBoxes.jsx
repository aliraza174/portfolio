"use client";

import React from "react";
import { useStore } from "@/store/useStore";

export default function InfoBoxes() {
  const headCoords = useStore((state) => state.headCoords);
  const chestCoords = useStore((state) => state.chestCoords);
  const phase = useStore((state) => state.phase);

  if (phase !== "about") return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 w-full h-full overflow-hidden">
      {/* Connecting Lines SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="glow-purple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#9333ea" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="glow-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Head Box Connector */}
        {headCoords.visible && (
          <>
            {/* Pulsing dot at the anchor point on character */}
            <circle cx={headCoords.x} cy={headCoords.y} r="4" fill="#c084fc" />
            <circle 
              cx={headCoords.x} 
              cy={headCoords.y} 
              r="10" 
              fill="none" 
              stroke="#c084fc" 
              strokeWidth="1.5" 
              className="animate-ping opacity-60" 
              style={{ transformOrigin: `${headCoords.x}px ${headCoords.y}px` }} 
            />
            
            {/* The line connecting head to card */}
            <path
              d={`M ${headCoords.x} ${headCoords.y} 
                  L ${headCoords.x + 80} ${headCoords.y - 60} 
                  L ${headCoords.x + 150} ${headCoords.y - 60}`}
              fill="none"
              stroke="url(#glow-purple)"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
          </>
        )}

        {/* Chest Box Connector */}
        {chestCoords.visible && (
          <>
            {/* Pulsing dot at the anchor point on character */}
            <circle cx={chestCoords.x} cy={chestCoords.y} r="4" fill="#60a5fa" />
            <circle 
              cx={chestCoords.x} 
              cy={chestCoords.y} 
              r="10" 
              fill="none" 
              stroke="#60a5fa" 
              strokeWidth="1.5" 
              className="animate-ping opacity-60" 
              style={{ transformOrigin: `${chestCoords.x}px ${chestCoords.y}px` }} 
            />
            
            {/* The line connecting chest to card */}
            <path
              d={`M ${chestCoords.x} ${chestCoords.y} 
                  L ${chestCoords.x - 80} ${chestCoords.y + 40} 
                  L ${chestCoords.x - 150} ${chestCoords.y + 40}`}
              fill="none"
              stroke="url(#glow-blue)"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
          </>
        )}
      </svg>

      {/* Floating Info Cards */}
      {headCoords.visible && (
        <div
          className="absolute pointer-events-auto transition-transform duration-100 ease-out"
          style={{
            left: `${headCoords.x + 150}px`,
            top: `${headCoords.y - 95}px`,
            width: "280px",
          }}
        >
          <div className="bg-[#0f0c19]/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-5 shadow-[0_12px_40px_rgba(147,51,234,0.15)] hover:border-purple-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest text-purple-400 uppercase">System Core</span>
            </div>
            <h3 className="text-white text-base font-bold tracking-wide mb-1 group-hover:text-purple-300 transition-colors">
              Creative Thinker
            </h3>
            <p className="text-zinc-300 text-xs leading-relaxed mb-3">
              Designing premium interfaces and orchestrating immersive web-based interactions.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["Python", "LangChain", "LLM Agents"].map((skill) => (
                <span key={skill} className="text-[9px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full font-mono">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {chestCoords.visible && (
        <div
          className="absolute pointer-events-auto transition-transform duration-100 ease-out"
          style={{
            left: `${chestCoords.x - 430}px`, // 150px offset + 280px card width = 430px
            top: `${chestCoords.y + 5}px`,
            width: "280px",
          }}
        >
          <div className="bg-[#090e1c]/80 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-5 shadow-[0_12px_40px_rgba(59,130,246,0.15)] hover:border-blue-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">Engine Specs</span>
            </div>
            <h3 className="text-white text-base font-bold tracking-wide mb-1 group-hover:text-blue-300 transition-colors">
              Full Stack Engineer
            </h3>
            <p className="text-zinc-300 text-xs leading-relaxed mb-3">
              Building ultra-fast responsive backends and fluid state-driven user flows.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["Next.js", "Flutter", "Swift"].map((skill) => (
                <span key={skill} className="text-[9px] bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-full font-mono">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
