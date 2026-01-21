'use client';

import React from 'react';

interface StickyCTAProps {
  show: boolean;
  playHoverSound: () => void;
}

export default function StickyCTA({ show, playHoverSound }: StickyCTAProps) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-500 ${
        show
          ? 'translate-y-0 opacity-100'
          : 'translate-y-20 opacity-0 pointer-events-none'
      }`}
    >
      <a
        href="#contact"
        onMouseEnter={playHoverSound}
        className="group flex items-center gap-2 px-5 py-3 bg-[#FF4500] text-white font-black tracking-wider hover:bg-white hover:text-black transition-all duration-200 shadow-[0_0_30px_rgba(255,69,0,0.6)] hover:shadow-[0_0_50px_rgba(255,69,0,0.9)] border-2 border-[#FF4500] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        style={{ fontFamily: "var(--font-permanent-marker), 'Permanent Marker', cursive" }}
      >
        <span>WORK WITH ME</span>
        <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
      </a>
    </div>
  );
}
