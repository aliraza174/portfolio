"use client";

import React from "react";

export default function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl rounded-full border border-white/10 bg-black/40 px-8 py-4 backdrop-blur-md flex items-center justify-between">
      {/* Brand logo */}
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-purple-500 animate-pulse" />
        <span className="font-bold tracking-widest text-sm bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          ANTIGRAVITY
        </span>
      </div>

      {/* Navigation links */}
      <div className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-widest text-zinc-400">
        <a href="#intro" className="hover:text-white transition-colors">Intro</a>
        <a href="#about" className="hover:text-white transition-colors">About</a>
        <a href="#projects" className="hover:text-white transition-colors">Projects</a>
        <a href="#contact" className="hover:text-white transition-colors">Contact</a>
      </div>

      {/* CTA Button */}
      <button className="rounded-full border border-purple-500/30 bg-purple-500/10 px-5 py-2 text-xs font-medium uppercase tracking-widest text-purple-300 hover:bg-purple-500 hover:text-white transition-all duration-300">
        Connect
      </button>
    </nav>
  );
}
