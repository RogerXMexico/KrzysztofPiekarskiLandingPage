'use client';

import React from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Spark {
  id: number;
  x: number;
  y: number;
  color: string;
  tx: number;
  ty: number;
}

interface SparkEffectProps {
  sparks: Spark[];
}

export default function SparkEffect({ sparks }: SparkEffectProps) {
  const prefersReducedMotion = useReducedMotion();

  // Don't render sparks if user prefers reduced motion
  if (prefersReducedMotion) return null;

  return (
    <>
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="fixed pointer-events-none z-[60] animate-spark"
          style={{
            left: spark.x,
            top: spark.y,
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: spark.color,
            boxShadow: `0 0 10px ${spark.color}, 0 0 20px ${spark.color}`,
            '--tx': `${spark.tx}px`,
            '--ty': `${spark.ty}px`,
          } as React.CSSProperties}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
