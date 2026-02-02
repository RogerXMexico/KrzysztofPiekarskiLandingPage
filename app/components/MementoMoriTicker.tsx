'use client';

import React from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface MementoMoriTickerProps {
  isVisible: boolean;
}

export default function MementoMoriTicker({ isVisible }: MementoMoriTickerProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-black border-t border-white/20 z-40 overflow-hidden py-2 select-none pointer-events-none motion-safe:transition-all motion-safe:duration-500 motion-reduce:transition-none transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
      }`}
      role="marquee"
      aria-label="Status indicators"
      aria-live="off"
    >
      <div
        className={`whitespace-nowrap flex gap-8 text-xs font-mono tracking-widest text-[#00FF00] ${
          prefersReducedMotion ? '' : 'animate-marquee'
        }`}
      >
        <span className="opacity-70">
          ENTROPY: <span className="text-red-500">▲ RISING</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70">
          TIME_LEFT: <span className="text-red-500">▼ 2,143 WEEKS</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70">
          EGO: <span className="text-green-500">▼ CRASHING</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70">
          POTENTIAL: <span className="text-green-500">▲ UNTAPPED</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70">
          MEMENTO MORI:{' '}
          <span className="text-white motion-safe:animate-pulse motion-reduce:animate-none">ACTIVE</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70">
          IMAGINATION: <span className="text-green-500">▲ EXPANDING</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70">
          LOVE: <span className="text-green-500">▲ UNCONDITIONAL</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70">
          COURAGE: <span className="text-green-500">▲ RISING</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70">
          WISDOM: <span className="text-green-500">▲ ACCUMULATING</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70">
          PATIENCE: <span className="text-green-500">▲ CULTIVATING</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70">
          AMOR_FATI: <span className="text-[#FF4500]">▲ EMBRACED</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70">
          INTEGRITY: <span className="text-green-500">▲ NON-NEGOTIABLE</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70">
          CURIOSITY: <span className="text-green-500">▲ INFINITE</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70">
          DISCIPLINE: <span className="text-green-500">▲ FORGED</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70">
          PRESENCE: <span className="text-white motion-safe:animate-pulse motion-reduce:animate-none">NOW</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70">
          HUMILITY: <span className="text-green-500">▲ DEEPENING</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70">
          SUFFERING: <span className="text-[#FF4500]">▲ TRANSMUTED</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70">
          ATTENTION: <span className="text-green-500">▲ SHARPENING</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        {/* Duplicate for seamless loop */}
        <span className="opacity-70" aria-hidden="true">
          ENTROPY: <span className="text-red-500">▲ RISING</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70" aria-hidden="true">
          TIME_LEFT: <span className="text-red-500">▼ 2,143 WEEKS</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70" aria-hidden="true">
          EGO: <span className="text-green-500">▼ CRASHING</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70" aria-hidden="true">
          POTENTIAL: <span className="text-green-500">▲ UNTAPPED</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70" aria-hidden="true">
          MEMENTO MORI:{' '}
          <span className="text-white motion-safe:animate-pulse motion-reduce:animate-none">ACTIVE</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70" aria-hidden="true">
          IMAGINATION: <span className="text-green-500">▲ EXPANDING</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70" aria-hidden="true">
          LOVE: <span className="text-green-500">▲ UNCONDITIONAL</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70" aria-hidden="true">
          COURAGE: <span className="text-green-500">▲ RISING</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70" aria-hidden="true">
          WISDOM: <span className="text-green-500">▲ ACCUMULATING</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70" aria-hidden="true">
          PATIENCE: <span className="text-green-500">▲ CULTIVATING</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70" aria-hidden="true">
          AMOR_FATI: <span className="text-[#FF4500]">▲ EMBRACED</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70" aria-hidden="true">
          INTEGRITY: <span className="text-green-500">▲ NON-NEGOTIABLE</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70" aria-hidden="true">
          CURIOSITY: <span className="text-green-500">▲ INFINITE</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70" aria-hidden="true">
          DISCIPLINE: <span className="text-green-500">▲ FORGED</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70" aria-hidden="true">
          PRESENCE: <span className="text-white motion-safe:animate-pulse motion-reduce:animate-none">NOW</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70" aria-hidden="true">
          HUMILITY: <span className="text-green-500">▲ DEEPENING</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70" aria-hidden="true">
          SUFFERING: <span className="text-[#FF4500]">▲ TRANSMUTED</span>
        </span>
        <span className="opacity-40" aria-hidden="true">|</span>
        <span className="opacity-70" aria-hidden="true">
          ATTENTION: <span className="text-green-500">▲ SHARPENING</span>
        </span>
      </div>
    </div>
  );
}
