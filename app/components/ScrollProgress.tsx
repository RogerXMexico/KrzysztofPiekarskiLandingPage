'use client';

import React from 'react';

interface ScrollProgressProps {
  scrollY: number;
}

export default function ScrollProgress({ scrollY }: ScrollProgressProps) {
  // Calculate scroll percentage
  const [scrollPercent, setScrollPercent] = React.useState(0);

  React.useEffect(() => {
    const calculateScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      setScrollPercent(Math.min(percent, 100));
    };

    calculateScroll();
  }, [scrollY]);

  return (
    <div
      className="fixed top-0 left-0 w-full h-1 z-50 bg-black/20"
      role="progressbar"
      aria-valuenow={Math.round(scrollPercent)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    >
      <div
        className="h-full bg-gradient-to-r from-[#FF4500] to-[#ff6a33] transition-all duration-150 ease-out"
        style={{
          width: `${scrollPercent}%`,
          boxShadow: scrollPercent > 0 ? '0 0 10px rgba(255, 69, 0, 0.7), 0 0 20px rgba(255, 69, 0, 0.4)' : 'none'
        }}
      />
    </div>
  );
}
