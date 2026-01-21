'use client';

import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'scale';
  delay?: number;
  duration?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  duration = 600,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  const getAnimationStyles = () => {
    const base = {
      transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
      transitionDelay: `${delay}ms`,
    };

    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return { ...base, opacity: 0, transform: 'translateY(30px)' };
        case 'fade-in':
          return { ...base, opacity: 0, transform: 'none' };
        case 'fade-left':
          return { ...base, opacity: 0, transform: 'translateX(-30px)' };
        case 'fade-right':
          return { ...base, opacity: 0, transform: 'translateX(30px)' };
        case 'scale':
          return { ...base, opacity: 0, transform: 'scale(0.95)' };
        default:
          return { ...base, opacity: 0 };
      }
    }

    return { ...base, opacity: 1, transform: 'none' };
  };

  return (
    <div
      ref={ref}
      className={`motion-reduce:transition-none ${className}`}
      style={getAnimationStyles()}
    >
      {children}
    </div>
  );
}
