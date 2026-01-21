'use client';

import React from 'react';
import { Terminal, X } from 'lucide-react';

interface NavigationProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  audioEnabled: boolean;
  toggleAudio: () => void;
  onOpenOracle: () => void;
  playHoverSound: () => void;
  time: string;
  scrollY: number;
}

export default function Navigation({
  menuOpen,
  setMenuOpen,
  audioEnabled,
  toggleAudio,
  onOpenOracle,
  playHoverSound,
  time,
  scrollY,
}: NavigationProps) {
  const menuItems = [
    { label: 'WORK', icon: '◈', href: '#work' },
    { label: 'PHILOSOPHY', icon: '☯', href: '#philosophy' },
    { label: 'ABOUT', icon: '◉', href: '#about' },
    { label: 'CONTACT', icon: '✉', href: 'mailto:krzyspiekarski@gmail.com' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-30 pointer-events-none" role="navigation" aria-label="Main navigation">
      {/* Menu Bar - shows when menu is open */}
      <div
        className={`w-full bg-black/90 backdrop-blur-sm transition-all duration-300 pointer-events-auto motion-safe:transition-all motion-reduce:transition-none ${
          menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex items-center justify-center gap-2 md:gap-4 p-3 flex-wrap">
          {menuItems.map((item, i) => (
            <div
              key={item.label}
              className={`motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out motion-reduce:transition-none ${
                menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-16 opacity-0'
              }`}
              style={{
                transitionDelay: menuOpen ? `${i * 150}ms` : '0ms',
              }}
            >
              <a
                href={item.href}
                onMouseEnter={playHoverSound}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-white rounded-sm bg-transparent hover:bg-[#FF4500] hover:text-black hover:border-[#FF4500] hover:shadow-[0_0_20px_rgba(255,69,0,0.8),0_0_40px_rgba(255,69,0,0.5)] transition-all duration-100 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                style={{ fontFamily: "'Permanent Marker', cursive" }}
              >
                <span className="text-lg" aria-hidden="true">{item.icon}</span>
                <span className="text-sm tracking-wider">{item.label}</span>
                <span className="text-white/60 group-hover:text-black/60 transition-colors" aria-hidden="true">›</span>
              </a>
            </div>
          ))}

          {/* Close Button */}
          <button
            onClick={() => setMenuOpen(false)}
            onMouseEnter={playHoverSound}
            className="ml-2 w-10 h-10 flex items-center justify-center border-2 border-white rounded-sm hover:bg-white hover:text-black transition-colors text-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4500]"
            aria-label="Close menu"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Top Bar - always visible */}
      <div
        className={`flex justify-between items-center px-4 md:px-6 py-2 -mt-2 transition-all duration-300 ${
          menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
      >
        <div
          className="fixed top-8 left-10 flex gap-3 text-xs font-bold tracking-widest text-white/80 transition-opacity duration-300 z-50"
          style={{ opacity: Math.max(0, 1 - scrollY / 80) }}
          aria-live="polite"
        >
          <span className="bg-white/10 px-2 py-1">Austin, TX</span>
          <time className="bg-white/10 px-2 py-1" dateTime={new Date().toISOString()}>
            {time}
          </time>
        </div>
        <div className="fixed top-4 right-4 flex gap-3 items-center z-50 scale-[1.2] origin-top-right">
          <button
            onClick={toggleAudio}
            onMouseEnter={playHoverSound}
            className="text-xs font-bold tracking-widest hover:bg-white hover:text-black px-2 py-1 transition-colors border border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4500]"
            aria-label={audioEnabled ? 'Mute audio' : 'Enable audio'}
            aria-pressed={audioEnabled}
          >
            {audioEnabled ? 'MUTE' : 'AUDIO'}
          </button>

          {/* ORACLE TRIGGER */}
          <button
            onClick={onOpenOracle}
            className="text-white/50 hover:text-[#00FF00] transition-colors p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF00]"
            aria-label="Open terminal (Cmd+K or Ctrl+K)"
          >
            <Terminal size={14} aria-hidden="true" />
          </button>

          <button
            onClick={() => setMenuOpen(true)}
            onMouseEnter={playHoverSound}
            className="px-4 py-2 bg-white text-black text-xs font-black tracking-widest hover:scale-105 motion-safe:transition-transform motion-reduce:transition-none border-2 border-[#FF4500] shadow-[0_0_15px_rgba(255,69,0,0.6)] motion-safe:animate-pulse motion-reduce:animate-none hover:animate-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4500]"
            style={{
              fontFamily: "'Permanent Marker', cursive",
              transform: 'rotate(-2deg)',
            }}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="main-menu"
          >
            MENU
          </button>
        </div>
      </div>
    </nav>
  );
}
