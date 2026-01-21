'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function CursorTrail() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Skip the entire cursor trail if user prefers reduced motion
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    let animationFrameId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const trail = trailRef.current;
      trail.push({ x: mousePos.x, y: mousePos.y });

      const maxTrailLength = 150;
      if (trail.length > maxTrailLength) {
        trail.shift();
      }

      if (trail.length > 2) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const trailOffsets = [
          { dx: 0, dy: 0, color: [255, 140, 50], maxWidth: 4 },
          { dx: 3, dy: 2, color: [255, 100, 30], maxWidth: 2.5 },
          { dx: -3, dy: -2, color: [255, 80, 20], maxWidth: 2 },
        ];

        trailOffsets.forEach(({ dx, dy, color, maxWidth }) => {
          for (let i = 1; i < trail.length; i++) {
            const progress = i / trail.length;
            const opacity = progress * 0.5;
            const lineWidth = progress * maxWidth;

            ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(trail[i - 1].x + dx * (1 - progress), trail[i - 1].y + dy * (1 - progress));
            ctx.lineTo(trail[i].x + dx * (1 - progress), trail[i].y + dy * (1 - progress));
            ctx.stroke();
          }
        });
      }

      if (mousePos.x > 0 && mousePos.y > 0) {
        let velocity = 0;
        if (trail.length >= 2) {
          const last = trail[trail.length - 1];
          const prev = trail[trail.length - 2];
          velocity = Math.sqrt(Math.pow(last.x - prev.x, 2) + Math.pow(last.y - prev.y, 2));
        }

        const heat = Math.min(velocity / 50, 1);

        const coreR = 255;
        const coreG = Math.round(200 - heat * 80);
        const coreB = Math.round(100 - heat * 70);

        const glowR = 255;
        const glowG = Math.round(120 - heat * 90);
        const glowB = Math.round(30 - heat * 20);

        const glowSize = 27 + heat * 15;

        const gradient = ctx.createRadialGradient(mousePos.x, mousePos.y, 0, mousePos.x, mousePos.y, glowSize);
        gradient.addColorStop(0, `rgba(${glowR}, ${glowG}, ${glowB}, ${0.8 + heat * 0.2})`);
        gradient.addColorStop(0.3, `rgba(${glowR}, ${Math.max(glowG - 40, 10)}, ${glowB}, ${0.4 + heat * 0.3})`);
        gradient.addColorStop(0.6, `rgba(255, ${Math.round(50 - heat * 30)}, 10, ${0.1 + heat * 0.15})`);
        gradient.addColorStop(1, 'rgba(255, 30, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        const coreSize = 4.3 + heat * 2;
        ctx.fillStyle = `rgba(${coreR}, ${coreG}, ${coreB}, ${0.9 + heat * 0.1})`;
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, coreSize, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos.x, mousePos.y, prefersReducedMotion]);

  // Don't render canvas at all if reduced motion is preferred
  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 mix-blend-screen opacity-60"
      aria-hidden="true"
    />
  );
}
