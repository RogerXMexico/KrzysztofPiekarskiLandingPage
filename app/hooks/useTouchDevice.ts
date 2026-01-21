'use client';

import { useState, useEffect } from 'react';

export function useTouchDevice() {
  // Start with false to match SSR - will update after hydration
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    // Check for touch capability
    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-expect-error - msMaxTouchPoints is IE-specific
      navigator.msMaxTouchPoints > 0;

    setIsTouchDevice(isTouch);

    // Also listen for first touch to catch hybrid devices
    const handleFirstTouch = () => {
      setIsTouchDevice(true);
      window.removeEventListener('touchstart', handleFirstTouch);
    };

    window.addEventListener('touchstart', handleFirstTouch, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleFirstTouch);
    };
  }, []);

  // Return false during SSR and initial render to prevent hydration mismatch
  return hasMounted ? isTouchDevice : false;
}
