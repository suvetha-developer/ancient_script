import React from "react";

interface TemplePillarProps {
  side: "left" | "right";
}

export function TemplePillar({ side }: TemplePillarProps) {
  const isLeft = side === "left";
  return (
    <div
      className={`hidden md:flex flex-col items-center justify-between w-12 lg:w-20 xl:w-28 py-6 select-none pointer-events-none sticky top-0 h-screen opacity-90 transition-all duration-300 ${
        isLeft ? "border-r border-gold-500/20" : "border-l border-gold-500/20"
      }`}
      aria-hidden="true"
    >
      {/* Pillar Capital (Bodhigai / Kalasam) */}
      <div className="w-full flex flex-col items-center">
        <svg
          viewBox="0 0 100 120"
          className="w-10 lg:w-16 xl:w-20 text-gold-400 drop-shadow-[0_2px_12px_rgba(201,162,39,0.25)]"
          fill="currentColor"
        >
          {/* Top finial / Kalasam */}
          <path d="M50 5 L55 20 L45 20 Z" fill="#e8cc72" />
          <circle cx="50" cy="24" r="5" fill="#c9a227" />
          {/* Lotus corbel / Bodhigai bracket */}
          <path
            d="M20 35 C30 30 70 30 80 35 C75 42 65 46 50 47 C35 46 25 42 20 35 Z"
            fill="#dbb84a"
          />
          {/* Capital block */}
          <rect x="15" y="47" width="70" height="12" rx="2" fill="#5c4536" />
          <rect x="25" y="59" width="50" height="8" fill="#3d2e24" />
          {/* Decorative scroll brackets */}
          <path
            d={
              isLeft
                ? "M15 47 C5 60 5 80 25 80 C20 72 22 55 25 47 Z"
                : "M85 47 C95 60 95 80 75 80 C80 72 78 55 75 47 Z"
            }
            fill="#c9a227"
          />
          {/* Bead garland */}
          <circle cx="35" cy="72" r="3" fill="#e8cc72" />
          <circle cx="50" cy="72" r="3.5" fill="#e8cc72" />
          <circle cx="65" cy="72" r="3" fill="#e8cc72" />
          <rect x="30" y="82" width="40" height="10" rx="1" fill="#7a5c48" />
        </svg>
      </div>

      {/* Pillar Shaft (Stambha) with Stone Carving Reliefs */}
      <div className="flex-1 w-full flex flex-col items-center justify-around py-4">
        {/* Carved Medallion 1: Temple Wheel / Chakram */}
        <div className="w-8 lg:w-12 xl:w-14 h-8 lg:h-12 xl:h-14 rounded-full border border-gold-500/40 bg-stone-900/60 p-1 flex items-center justify-center shadow-inner">
          <svg viewBox="0 0 40 40" className="w-full h-full text-gold-400">
            <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="20" cy="20" r="6" fill="#c9a227" />
            <line x1="20" y1="4" x2="20" y2="36" stroke="currentColor" strokeWidth="1" />
            <line x1="4" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="1" />
            <line x1="8.7" y1="8.7" x2="31.3" y2="31.3" stroke="currentColor" strokeWidth="0.8" />
            <line x1="8.7" y1="31.3" x2="31.3" y2="8.7" stroke="currentColor" strokeWidth="0.8" />
          </svg>
        </div>

        {/* Fluted Vertical Pillar Lines */}
        <div className="h-28 lg:h-44 xl:h-56 w-6 lg:w-10 flex justify-between px-1">
          <div className="w-0.5 h-full bg-gradient-to-b from-gold-500/10 via-gold-400/40 to-gold-500/10" />
          <div className="w-1 h-full bg-gradient-to-b from-gold-500/30 via-gold-300/60 to-gold-500/30 rounded-full" />
          <div className="w-0.5 h-full bg-gradient-to-b from-gold-500/10 via-gold-400/40 to-gold-500/10" />
        </div>

        {/* Carved Medallion 2: Ancient Tamil Inscription Motif */}
        <div className="w-7 lg:w-10 xl:w-12 h-7 lg:h-10 xl:h-12 border border-gold-500/30 bg-stone-950/70 p-1 flex items-center justify-center rotate-45 shadow">
          <span className="-rotate-45 text-gold-400 text-xs font-bold font-tamil">
            {isLeft ? "அ" : "ஓம்"}
          </span>
        </div>

        {/* Lower Pillar Flutes */}
        <div className="h-28 lg:h-44 xl:h-56 w-6 lg:w-10 flex justify-between px-1">
          <div className="w-0.5 h-full bg-gradient-to-b from-gold-500/20 via-gold-400/50 to-gold-500/20" />
          <div className="w-1 h-full bg-gradient-to-b from-gold-500/40 via-gold-300/70 to-gold-500/40 rounded-full" />
          <div className="w-0.5 h-full bg-gradient-to-b from-gold-500/20 via-gold-400/50 to-gold-500/20" />
        </div>
      </div>

      {/* Pillar Base (Adhisthana / Upana) */}
      <div className="w-full flex flex-col items-center">
        <svg
          viewBox="0 0 100 80"
          className="w-12 lg:w-18 xl:w-24 text-gold-500 drop-shadow-[0_-2px_10px_rgba(201,162,39,0.2)]"
          fill="currentColor"
        >
          {/* Base molding tiers */}
          <rect x="30" y="10" width="40" height="8" fill="#5c4536" />
          <polygon points="25,18 75,18 78,28 22,28" fill="#c9a227" />
          <rect x="18" y="28" width="64" height="12" fill="#3d2e24" />
          <polygon points="12,40 88,40 92,54 8,54" fill="#5c4536" />
          {/* Stone Plinth / Upana */}
          <rect x="5" y="54" width="90" height="18" rx="2" fill="#2a1f18" stroke="#c9a227" strokeWidth="1" />
          <circle cx="25" cy="63" r="3" fill="#e8cc72" />
          <circle cx="50" cy="63" r="3.5" fill="#e8cc72" />
          <circle cx="75" cy="63" r="3" fill="#e8cc72" />
        </svg>
      </div>
    </div>
  );
}

export function TempleBordersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full justify-between overflow-x-hidden bg-[#1c1410]">
      {/* Decorative Left Temple Pillar */}
      <TemplePillar side="left" />

      {/* Main Heritage Application Content */}
      <div className="flex-1 min-w-0 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {children}
      </div>

      {/* Decorative Right Temple Pillar */}
      <TemplePillar side="right" />
    </div>
  );
}
