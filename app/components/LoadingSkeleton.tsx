'use client';

import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'default' | 'video' | 'image';
}

export default function LoadingSkeleton({ className = '', variant = 'default' }: LoadingSkeletonProps) {
  if (variant === 'video') {
    return (
      <div className={`relative bg-[#1a1a1a] ${className}`}>
        <div className="absolute inset-0 image-loading" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            {/* Play button placeholder */}
            <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center">
              <div className="w-0 h-0 border-l-[12px] border-l-white/40 border-y-[8px] border-y-transparent ml-1" />
            </div>
            <span className="text-white/30 text-sm font-mono">Loading video...</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'image') {
    return (
      <div className={`bg-[#1a1a1a] image-loading ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#1a1a1a] image-loading rounded ${className}`} />
  );
}
