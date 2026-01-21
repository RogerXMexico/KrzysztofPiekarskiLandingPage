'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ConstellationBackgroundProps {
  scrollY: number;
}

export default function ConstellationBackground({ scrollY }: ConstellationBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Small delay to ensure smooth page load
    const readyTimeout = setTimeout(() => setIsReady(true), 100);

    const stars: { x: number; y: number; vx: number; vy: number }[] = [];
    const numStars = 80;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 3;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.3,
        vy: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.3,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Only move stars if motion is allowed
      if (!prefersReducedMotion) {
        stars.forEach((star) => {
          star.x += star.vx;
          star.y += star.vy;
          if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
          if (star.y < 0 || star.y > canvas.height) star.vy *= -1;
        });
      }

      // Draw connections
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.055)';
      ctx.lineWidth = 1;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.33)';
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      clearTimeout(readyTimeout);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full pointer-events-none z-0 transition-opacity duration-1000 ${isReady ? 'opacity-40' : 'opacity-0'}`}
      style={{ transform: prefersReducedMotion ? 'none' : `translateY(${scrollY * -0.2}px)` }}
      aria-hidden="true"
    />
  );
}
