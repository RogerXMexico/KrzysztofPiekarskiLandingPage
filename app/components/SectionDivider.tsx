'use client';

import React from 'react';

interface SectionDividerProps {
  variant?: 'default' | 'gradient' | 'dots';
}

export default function SectionDivider({ variant = 'default' }: SectionDividerProps) {
  if (variant === 'dots') {
    return (
      <div className="flex justify-center items-center gap-3 py-12" aria-hidden="true">
        <span className="w-1.5 h-1.5 bg-[#FF4500] rounded-full" />
        <span className="w-1.5 h-1.5 bg-white/30 rounded-full" />
        <span className="w-1.5 h-1.5 bg-white/30 rounded-full" />
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div className="relative py-8" aria-hidden="true">
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#FF4500]/50 to-transparent" />
      </div>
    );
  }

  // Default: simple line with glow
  return (
    <div className="relative py-8 mx-auto max-w-2xl" aria-hidden="true">
      <div
        className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{ boxShadow: '0 0 20px rgba(255, 69, 0, 0.2)' }}
      />
    </div>
  );
}
