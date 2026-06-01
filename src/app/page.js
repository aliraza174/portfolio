"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useStore } from "@/store/useStore";
import NetworkConstellation from "@/components/ui/NetworkConstellation";
import Navbar from "@/components/ui/Navbar";
import AboutOverlay from "@/components/ui/AboutOverlay";
import ProjectSection from "@/components/ui/ProjectSection";
import { personalInfo, contactInfo, skillsData } from "@/data/portfolioData";

const HeroScene = dynamic(() => import("@/components/scene/HeroScene"), {
  ssr: false,
});

export default function Home() {
  const setScrollProgress = useStore((state) => state.setScrollProgress);
  const phase = useStore((state) => state.phase);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress  = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setScrollProgress]);

  const isAmbientTheme = phase === "projects" || phase === "contact";
  const isContactPhase = phase === "contact";
  const bgColor = isAmbientTheme ? "#0f172a" : "#1a1a2e";

  return (
    <div
      className="relative w-full transition-colors duration-700 ease-in-out"
      style={{ backgroundColor: bgColor }}
    >
      {/* â”€â”€ FIXED 3D CANVAS BACKGROUND â”€â”€ */}
      <div
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100vw", height: "100vh",
          zIndex: 10, // Sits above background constellation to allow clicks and scrolling on overlays
          pointerEvents: "none",
        }}
      >
        <div style={{ width: "100%", height: "100%", pointerEvents: "auto" }}>
          <HeroScene />
        </div>
      </div>

      {/* â”€â”€ GLOBAL FIXED CONSTELLATION BACKGROUND FOR PROJECTS & CONTACT â”€â”€ */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 2, // Sits above canvas but below active UI overlays
          opacity: isAmbientTheme ? 0.65 : 0,
          pointerEvents: isAmbientTheme ? "auto" : "none",
          transition: "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <NetworkConstellation />
      </div>

      {/* â”€â”€ HERO floating text block on the LEFT (home phase only) matching David Heckhoff's reference layout! â”€â”€ */}
      <HeroTextCard />
      <HeroNameTag />

      {/* â”€â”€ SCROLL SECTIONS â”€â”€ */}
      <div className="relative z-10 w-full pointer-events-none">
        {/* Home spacer â€” 200vh so the camera has room to feel the parallax */}
        <section id="hero" className="w-full h-[200vh]" />

        {/* About spacer */}
        <section id="about" className="w-full h-[200vh]" />

        {/* Projects spacer */}
        <section id="projects" className="w-full h-[200vh]" />

        {/* Contact spacer â€” simple spacer to transition smoothly into contact phase */}
        <section id="contact" className="w-full h-[120vh]" />
      </div>

      {/* â”€â”€ FIXED SLIDING CONTACT OVERLAY (Slides up from downside) â”€â”€ */}
      <ContactOverlay />

      {/* â”€â”€ GLOBAL SCROLL PROGRESS BAR â”€â”€ */}
      <ScrollProgressBar />

      {/* â”€â”€ PERSISTENT UI OVERLAYS ELEVATED TO ROOT LEVEL â”€â”€ */}
      <Navbar />
      <AboutOverlay />
      <ProjectSection />

      {/* â”€â”€ SOOTHING GENERATIVE AMBIENT AUDIO SOUNDSCAPE â”€â”€ */}
      <LoFiAmbientAudio />
    </div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   HeroTextCard â€” Floating introduction card on the LEFT-side
   blank space of the home phase, matching David Heckhoff exactly.
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function HeroTextCard() {
  const scrollProgress = useStore((s) => s.scrollProgress);
  const opacity = Math.max(0, 1 - scrollProgress * 7);

  // Split name for two-line rendering
  const nameParts = personalInfo.name.split(" ");
  const firstName = nameParts[0] || "Ali";
  const lastName = nameParts.slice(1).join(" ") || "Raza";

  return (
    <div
      style={{
        position: "fixed",
        top: "26vh",
        left: "6vw", // Positioned on the LEFT side of the screen
        zIndex: 30,
        opacity,
        transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
        transform: `translateY(${scrollProgress * -50}px)`,
        pointerEvents: opacity > 0.1 ? "auto" : "none",
        maxWidth: "480px",
        fontFamily: "inherit",
      }}
    >
      {/* 1. Large Two-Line Name matching reference */}
      <h1
        style={{
          color: "#1a1a2e", // Deep high-contrast dark color
          fontSize: "clamp(3.8rem, 6vw, 5.5rem)",
          fontWeight: "900",
          lineHeight: "0.85",
          marginBottom: "16px",
          letterSpacing: "-0.03em",
          textTransform: "uppercase",
        }}
      >
        {firstName}<br />{lastName}
      </h1>
      
      {/* 2. Slanted Tag matching reference (FULL STACK DEVELOPER) */}
      <div
        style={{
          display: "inline-block",
          background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", // Stunning blue gradient matching reference
          color: "#ffffff",
          padding: "8px 20px",
          fontSize: "13px",
          fontWeight: "800",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          transform: "rotate(-3.5deg)", // Beautiful slanted angle
          boxShadow: "0 8px 20px rgba(59,130,246,0.3)",
          borderRadius: "4px",
          marginBottom: "32px",
          marginLeft: "6px",
        }}
      >
        {personalInfo.title}
      </div>
      
      {/* 3. Elegant Description */}
      <p
        style={{
          color: "#0f172a", // Deep high-contrast slate-900 for absolute readability
          fontSize: "14px",
          lineHeight: "1.65",
          fontWeight: "600", // Semi-bold to stand out perfectly against the 3D canvas
          maxWidth: "360px",
          marginLeft: "6px",
          textShadow: "0 1px 2px rgba(255, 255, 255, 0.95), 0 0 12px rgba(255, 255, 255, 0.5)", // Double drop shadow glow to pop text off any underlying background!
        }}
      >
        {personalInfo.summary}
      </p>
    </div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   HeroNameTag â€” floating text overlay on the home phase.
   Fades out as soon as the user starts scrolling.
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function HeroNameTag() {
  const scrollProgress = useStore((s) => s.scrollProgress);
  const opacity = Math.max(0, 1 - scrollProgress * 12);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "10vh",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 30,
        opacity,
        transition: "opacity 0.3s ease-out",
        pointerEvents: "none",
        textAlign: "center",
      }}
    >
      {/* Scroll cue */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          color: "rgba(255,255,255,0.45)",
          fontSize: "11px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          fontFamily: "inherit",
        }}
      >
        <span>Scroll to explore</span>
        <ScrollChevron />
      </div>
    </div>
  );
}

function ScrollChevron() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      style={{ animation: "scrollBounce 2s ease-in-out infinite" }}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="rgba(168,139,250,0.7)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50%       { transform: translateY(4px); opacity: 1; }
        }
      `}</style>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   ContactCard — full-featured dark-themed contact section.
───────────────────────────────────────────────────────────── */
function ContactCard() {
  const phase = useStore((state) => state.phase);
  const isAmbientTheme = phase === "projects" || phase === "contact";

  // Split heading for two-line style
  const headingParts = contactInfo.heading.split(". ");
  const headingLine1 = headingParts[0] ? headingParts[0] + "." : "Let's build something remarkable.";
  const headingLine2 = headingParts[1] || "";

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "600px", // reduced from 680px for a more compact and elegant profile
        margin: "0 auto",
        padding: "24px 28px", // reduced padding to shrink card size
        background: "rgba(30, 41, 59, 0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: "20px", // slightly rounder corners for a modern feel
        border: "1px solid rgba(71, 85, 105, 0.35)",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        transition: "border-color 0.4s ease, box-shadow 0.4s ease",
      }}
    >
      {/* Eyebrow */}
      <p
        style={{
          color: "#22d3ee",
          fontSize: "11px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: "8px",
          fontFamily: "inherit",
          fontWeight: "700",
        }}
      >
        04 / Contact
      </p>

      {/* Heading */}
      <h2
        style={{
          color: "#f8fafc",
          fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)", // smaller heading
          fontWeight: "800",
          lineHeight: 1.15,
          marginBottom: "8px", // reduced from 20px
          background: "linear-gradient(135deg, #ffffff 30%, #818cf8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontFamily: "inherit",
        }}
      >
        {headingLine1}<br />{headingLine2}
      </h2>

      <p
        style={{
          color: "#cbd5e1",
          fontSize: "13px", // smaller text
          lineHeight: 1.5,
          marginBottom: "14px", // reduced from 24px
          maxWidth: "480px",
          fontFamily: "inherit",
        }}
      >
        {contactInfo.subtext}
      </p>

      {/* ── SKILL PROFICIENCY TABLE (Added dynamically from portfolioData) ── */}
      <div
        style={{
          marginTop: "16px",
          marginBottom: "16px",
          background: "rgba(255, 255, 255, 0.03)",
          borderRadius: "14px",
          border: "1px solid rgba(129, 140, 248, 0.25)",
          padding: "16px 20px",
        }}
      >
        <h4 style={{ color: "#22d3ee", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: "12px", fontFamily: "inherit" }}>
          Technical Proficiency
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Languages */}
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", flexWrap: "wrap", fontSize: "13px" }}>
            <span style={{ color: "#818cf8", fontWeight: "700", minWidth: "105px", padding: "3px 0" }}>Languages:</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {skillsData.languages.map((lang) => (
                <span key={lang} style={{ color: "#f8fafc", background: "rgba(30, 41, 59, 0.6)", border: "1px solid rgba(129, 140, 248, 0.35)", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontFamily: "monospace" }}>
                  {lang}
                </span>
              ))}
            </div>
          </div>
          {/* Tech Stack */}
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", flexWrap: "wrap", fontSize: "13px" }}>
            <span style={{ color: "#818cf8", fontWeight: "700", minWidth: "105px", padding: "3px 0" }}>Technologies:</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {skillsData.tech.map((t) => (
                <span key={t} style={{ color: "#f8fafc", background: "rgba(30, 41, 59, 0.6)", border: "1px solid rgba(129, 140, 248, 0.35)", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontFamily: "monospace" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          {/* Databases */}
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", flexWrap: "wrap", fontSize: "13px" }}>
            <span style={{ color: "#818cf8", fontWeight: "700", minWidth: "105px", padding: "3px 0" }}>Databases:</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {skillsData.databases.map((db) => (
                <span key={db} style={{ color: "#f8fafc", background: "rgba(30, 41, 59, 0.6)", border: "1px solid rgba(129, 140, 248, 0.35)", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontFamily: "monospace" }}>
                  {db}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA row */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "14px" }}>
        <a
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contactInfo.email}`}
          target="_blank"
          rel="noopener noreferrer"
          id="contact-email-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 20px",
            background: "linear-gradient(135deg, #818cf8, #22d3ee)",
            color: "#0f172a",
            fontWeight: "700",
            fontSize: "13px",
            borderRadius: "10px",
            textDecoration: "none",
            boxShadow: "0 4px 15px rgba(34, 211, 238, 0.2)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            fontFamily: "inherit",
            pointerEvents: "auto",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform   = "translateY(-2px)";
            e.currentTarget.style.boxShadow   = "0 6px 20px rgba(34, 211, 238, 0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform   = "";
            e.currentTarget.style.boxShadow   = "0 4px 15px rgba(34, 211, 238, 0.2)";
          }}
        >
          <EnvelopeIcon />
          Send a message
        </a>

        <a
          href={contactInfo.github}
          target="_blank"
          rel="noopener noreferrer"
          id="contact-github-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 20px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(71, 85, 105, 0.4)",
            color: "#f8fafc",
            fontWeight: "600",
            fontSize: "13px",
            borderRadius: "10px",
            textDecoration: "none",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            transition: "background 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
            fontFamily: "inherit",
            pointerEvents: "auto",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background    = "rgba(255, 255, 255, 0.09)";
            e.currentTarget.style.borderColor   = "#22d3ee";
            e.currentTarget.style.transform     = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background    = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.borderColor   = "rgba(71, 85, 105, 0.4)";
            e.currentTarget.style.transform     = "";
          }}
        >
          <GithubIcon />
          GitHub
        </a>
      </div>

      {/* Divider */}
      <div
        style={{
          width: "100%",
          height: "1px",
          background: "linear-gradient(to right, rgba(129, 140, 248, 0.35), transparent)",
          margin: "16px 0 12px 0",
        }}
      />

      {/* Footer links */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <span
          style={{
            color: "rgba(248, 250, 252, 0.4)",
            fontSize: "11px",
            fontFamily: "inherit",
          }}
        >
          {"\u00A9"} 2026 {personalInfo.name}. Built with Three.js &amp; Next.js.
        </span>

        <div style={{ display: "flex", gap: "16px" }}>
          {[
            { label: "LinkedIn", href: contactInfo.linkedin },
            { label: "Twitter",  href: contactInfo.twitter },
            { label: "Resume",   href: "#" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "rgba(248, 250, 252, 0.6)",
                fontSize: "11px",
                textDecoration: "none",
                fontFamily: "inherit",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#22d3ee"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(248, 250, 252, 0.6)"; }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ContactOverlay — fixed sliding contact overlay
───────────────────────────────────────────────────────────── */
function ContactOverlay() {
  const phase = useStore((state) => state.phase);
  const isVisible = phase === "contact";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 95, // Elevated to sit above all other floating layout overlays (which are zIndex 40/50)
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
        transform: isVisible ? "translate3d(0, 0, 0)" : "translate3d(0, 80px, 0)",
        transition: "opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div 
        style={{ 
          paddingTop: "60px", // Pushes the card down slightly to clear the fixed navbar
          paddingBottom: "20px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
        className="px-4"
      >
        <ContactCard />
      </div>
    </div>
  );
}

/* â”€â”€ Inline SVG icons â”€â”€ */
function EnvelopeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 7L2 7" />
    </svg>
  );
}
function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   ScrollProgressBar
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function ScrollProgressBar() {
  const scrollProgress = useStore((state) => state.scrollProgress);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "3px", zIndex: 100 }}>
      <div
        style={{
          height: "100%",
          width: `${scrollProgress * 100}%`,
          background: "linear-gradient(to right, #a855f7, #3b82f6, #10b981)",
          boxShadow: "0 2px 10px rgba(59,130,246,0.4)",
          transition: "width 0.1s ease-out",
        }}
      />
    </div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   LoFiAmbientAudio â€” Generative Soothing lo-fi ambient audio
   soundscape synthesizer using browser native Web Audio API.
   Guarantees 100% successful playback on all modern systems.
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function LoFiAmbientAudio() {
  const isMusicPlaying = useStore((state) => state.isMusicPlaying);
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    const initAudio = () => {
      if (audioCtxRef.current) return;

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Master Gain for smooth volume control fading (Initializes with correct volume immediately!)
      const masterGain = ctx.createGain();
      const initialVol = useStore.getState().isMusicPlaying ? 0.48 : 0;
      masterGain.gain.setValueAtTime(initialVol, ctx.currentTime);
      masterGainRef.current = masterGain;

      // Lowpass filter opened up to 1000Hz for rich, crystal-clear sound on laptop/mobile speakers
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(1000, ctx.currentTime);

      masterGain.connect(lowpass);
      lowpass.connect(ctx.destination);

      // Soothing chord progression: Cmaj9 -> Fmaj9 -> Am9 -> G6 (chill ambient)
      const chords = [
        [130.81, 164.81, 196.00, 246.94, 293.66], // Cmaj9
        [174.61, 220.00, 261.63, 329.63, 392.00], // Fmaj9
        [110.00, 146.83, 196.00, 220.00, 261.63], // Am9
        [98.00,  146.83, 196.00, 246.94, 293.66]  // G6
      ];

      let chordIdx = 0;

      const playNote = (freq, startTime, duration) => {
        if (!audioCtxRef.current) return;
        const osc = audioCtxRef.current.createOscillator();
        const gainNode = audioCtxRef.current.createGain();

        // Pure sine wave for the most warm, clean, wobbyless, and soothing ambient pads
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);

        // Slow, soothing backing pad envelope
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.26, startTime + 2.0); 
        gainNode.gain.setValueAtTime(0.26, startTime + duration - 2.4);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gainNode);
        gainNode.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const playMelodyNote = (freq, startTime, duration) => {
        if (!audioCtxRef.current) return;
        const osc = audioCtxRef.current.createOscillator();
        const gainNode = audioCtxRef.current.createGain();

        // Soft, sparkling bell/rhodes chime wave (brighter, louder chimes)
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, startTime);

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.11, startTime + 0.08); 
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration); 

        osc.connect(gainNode);
        gainNode.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const playNextChord = () => {
        const now = ctx.currentTime;
        const duration = 6.8; // Slower chord duration (6.8s) for deeper soothing vibes
        const currentChord = chords[chordIdx];

        // 1. Play lush backplane synthesizer pad chords
        currentChord.forEach((freq) => {
          playNote(freq, now, duration);
        });

        // 2. Schedule generative, sparkling pentatonic chime melody over active chords
        const melodyScale = currentChord.slice(2); // E3, G3, B3 higher registers
        const melodyOffsets = [1.2, 3.0, 4.8]; // slower, more spaced out chime beats

        melodyOffsets.forEach((offset, idx) => {
          const baseFreq = melodyScale[Math.floor(Math.random() * melodyScale.length)];
          const melodyFreq = baseFreq * 2.0; // transpose up 1 octave for premium chimes
          playMelodyNote(melodyFreq, now + offset, 1.8);
        });

        chordIdx = (chordIdx + 1) % chords.length;
      };

      playNextChord();
      intervalIdRef.current = setInterval(playNextChord, 7000); // Trigger every 7 seconds (slower tempo!)
    };

    const handleUserInteraction = () => {
      initAudio();
      const isPlaying = useStore.getState().isMusicPlaying;
      if (audioCtxRef.current && isPlaying) {
        if (audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }
      }
    };

    window.addEventListener("click", handleUserInteraction, { once: true });
    window.addEventListener("touchstart", handleUserInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, []);

  // Handle Play/Mute state changes
  useEffect(() => {
    if (audioCtxRef.current && masterGainRef.current) {
      const now = audioCtxRef.current.currentTime;
      if (isMusicPlaying) {
        if (audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }
        // Smoothly fade in ambient volume over 1.5s to a perfectly balanced 0.48 (audible but soft and cozy)
        masterGainRef.current.gain.linearRampToValueAtTime(0.48, now + 1.5);
      } else {
        // Smoothly fade out ambient volume to 0 over 0.6s
        masterGainRef.current.gain.linearRampToValueAtTime(0, now + 0.6);
      }
    }
  }, [isMusicPlaying]);

  return null;
}

