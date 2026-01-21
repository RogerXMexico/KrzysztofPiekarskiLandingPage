'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import Matter from 'matter-js';

// Components
import Bookshelf from './components/Bookshelf';
import Navigation from './components/Navigation';
import OracleTerminal from './components/OracleTerminal';
import CursorTrail from './components/CursorTrail';
import ConstellationBackground from './components/ConstellationBackground';
import SocialLinks from './components/SocialLinks';
import Testimonials from './components/Testimonials';
import ContactForm from './components/ContactForm';
import MementoMoriTicker from './components/MementoMoriTicker';
import SparkEffect from './components/SparkEffect';
import LazyYouTube from './components/LazyYouTube';
import ScrollProgress from './components/ScrollProgress';
import StickyCTA from './components/StickyCTA';
import SectionDivider from './components/SectionDivider';
import BackToTop from './components/BackToTop';
import ScrollReveal from './components/ScrollReveal';
import NewsletterSignup from './components/NewsletterSignup';

// Hooks
import { useAudio } from './hooks/useAudio';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useTouchDevice } from './hooks/useTouchDevice';

/**
 * THE ANALYST'S FIELD GUIDE - GRIT EDITION
 * -----------------------------------------
 * A brutalist, collage-style landing page inspired by Grit Pictures.
 * Features: Constellation background, parallax, decorative stickers, torn paper effects.
 */

export default function FieldGuide() {
  // State
  const [time, setTime] = useState<string>('');
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number; color: string; tx: number; ty: number }[]>([]);
  const [photoTilt, setPhotoTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [bananas, setBananas] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);
  const [isSmashing, setIsSmashing] = useState(false);
  const [isQuoteRevealed, setIsQuoteRevealed] = useState(false);
  const [isBottom, setIsBottom] = useState(false);
  const [oracleOpen, setOracleOpen] = useState(false);

  // Refs
  const physicsCanvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);

  // Hooks
  const { audioEnabled, toggleAudio, playHoverSound, playSmashSound } = useAudio();
  const prefersReducedMotion = useReducedMotion();
  const isTouchDevice = useTouchDevice();

  // Clock
  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const isNearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      setIsBottom(isNearBottom);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Oracle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOracleOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Spark effect
  const spawnSparks = (e: React.MouseEvent) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const newSparks = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 100,
      y: rect.top + rect.height / 2 + (Math.random() - 0.5) * 30,
      color: ['#FF4500', '#FF6B35', '#FFD700', '#FF8C00', '#FFA500'][Math.floor(Math.random() * 5)],
      tx: (Math.random() - 0.5) * 100,
      ty: Math.random() * -80 - 20,
    }));
    setSparks((prev) => [...prev, ...newSparks]);
    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => !newSparks.find((ns) => ns.id === s.id)));
    }, 1000);
  };

  // Banana effect
  const spawnBananas = () => {
    if (prefersReducedMotion) return;
    const newBananas = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 160,
      y: -20 + i * 12,
      delay: i * 150 + Math.random() * 100,
    }));
    setBananas((prev) => [...prev, ...newBananas]);
    setTimeout(() => {
      setBananas((prev) => prev.filter((b) => !newBananas.find((nb) => nb.id === b.id)));
    }, 2000);
  };

  // Hammer physics
  const triggerHammerBreak = () => {
    if (isSmashing) return;
    setIsSmashing(true);
    if (!prefersReducedMotion) {
      spawnSparks({ currentTarget: physicsCanvasRef.current } as unknown as React.MouseEvent);
    }
    playSmashSound();

    const canvas = physicsCanvasRef.current;
    if (!canvas) return;

    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Body = Matter.Body;

    const engine = Engine.create();
    engineRef.current = engine;

    const parent = canvas.parentElement;
    const width = parent?.clientWidth || 800;
    const height = parent?.clientHeight || 400;

    const render = Render.create({
      canvas: canvas,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio,
      },
    });

    const shards: Matter.Body[] = [];
    const lines = [
      { text: 'Philosophy', x: width * 0.2, y: height * 0.2, w: 150 },
      { text: 'with a', x: width * 0.4, y: height * 0.2, w: 80 },
      { text: 'HAMMER', x: width * 0.6, y: height * 0.2, w: 120, color: '#FFFFFF', bg: '#000000' },
      { text: 'I use the hammer', x: width * 0.3, y: height * 0.4, w: 200 },
      { text: 'of philosophy', x: width * 0.6, y: height * 0.4, w: 150 },
      { text: 'to dismantle', x: width * 0.3, y: height * 0.55, w: 140 },
      { text: 'narratives', x: width * 0.5, y: height * 0.55, w: 120 },
    ];

    lines.forEach((line) => {
      const body = Bodies.rectangle(line.x, line.y, line.w, 40, {
        render: {
          fillStyle: line.bg || '#333333',
          strokeStyle: '#ffffff',
          lineWidth: 1,
        },
        restitution: 0.6,
        friction: 0.1,
      });
      Body.setVelocity(body, { x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 10 });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);
      shards.push(body);
    });

    const hammer = Bodies.rectangle(width / 2, -100, 200, 100, {
      density: 0.5,
      render: { fillStyle: '#FF4500' },
    });
    Body.setVelocity(hammer, { x: 0, y: 20 });

    const floor = Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true, render: { visible: false } });
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true, render: { visible: false } });
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true, render: { visible: false } });

    Composite.add(engine.world, [...shards, hammer, floor, leftWall, rightWall]);

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    setTimeout(() => {
      setIsQuoteRevealed(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-sans selection:bg-white selection:text-black overflow-x-hidden cursor-none-hover">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Scroll progress indicator */}
      <ScrollProgress scrollY={scrollY} />

      {/* Sticky CTA - appears after scrolling past hero */}
      <StickyCTA show={scrollY > 600} playHoverSound={playHoverSound} />

      {/* Back to top button */}
      <BackToTop show={scrollY > 1000} />

      {/* Background layers */}
      <ConstellationBackground scrollY={scrollY} />
      <SparkEffect sparks={sparks} />
      <CursorTrail />

      {/* Noise texture */}
      <div
        className="fixed inset-0 opacity-[0.08] pointer-events-none z-40 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Social links sidebar */}
      <SocialLinks playHoverSound={playHoverSound} />

      {/* Navigation */}
      <Navigation
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        audioEnabled={audioEnabled}
        toggleAudio={toggleAudio}
        onOpenOracle={() => setOracleOpen(true)}
        playHoverSound={playHoverSound}
        time={time}
        scrollY={scrollY}
      />

      {/* Main Layout */}
      <main id="main-content" className="relative z-10 w-full max-w-[1600px] mx-auto min-h-screen flex flex-col md:grid md:grid-cols-12">
        {/* LEFT COLUMN: IDENTITY */}
        <div className="md:col-span-5 relative p-8 md:pb-12 flex flex-col bg-[#0a0a0a]">
          {/* Header */}
          <header
            className="mt-20"
            style={{ transform: prefersReducedMotion ? 'none' : `translateY(${scrollY * 0.05}px)` }}
          >
            <h1 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter mb-6 text-white mix-blend-difference flex flex-col items-start cursor-default">
              <div className="flex flex-wrap">
                {'KRZYSZTOF'.split('').map((char, i) => (
                  <span
                    key={`k-${i}`}
                    className="name-letter inline-block transition-all duration-200 hover:text-[#FF4500] hover:-translate-y-2 hover:scale-110"
                    style={{ textShadow: 'none' }}
                    onMouseEnter={(e) => {
                      if (isTouchDevice) return;
                      e.currentTarget.style.textShadow = '0 0 10px #FF4500, 0 0 20px #FF4500, 0 0 40px #FF4500';
                      playHoverSound();
                    }}
                    onMouseLeave={(e) => {
                      if (isTouchDevice) return;
                      e.currentTarget.style.textShadow = 'none';
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap">
                {'PIEKARSKI'.split('').map((char, i) => (
                  <span
                    key={`p-${i}`}
                    className="name-letter inline-block transition-all duration-200 hover:text-[#FF4500] hover:-translate-y-2 hover:scale-110"
                    style={{ textShadow: 'none' }}
                    onMouseEnter={(e) => {
                      if (isTouchDevice) return;
                      e.currentTarget.style.textShadow = '0 0 10px #FF4500, 0 0 20px #FF4500, 0 0 40px #FF4500';
                      playHoverSound();
                    }}
                    onMouseLeave={(e) => {
                      if (isTouchDevice) return;
                      e.currentTarget.style.textShadow = 'none';
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </h1>
            <div className="inline-block bg-white text-black px-3 py-1 text-sm font-mono transform -rotate-2 border border-white">
              <span
                className="cursor-pointer hover:bg-[#FF4500] hover:text-white transition-all duration-200 px-1"
                onMouseEnter={(e) => {
                  spawnSparks(e);
                  playHoverSound();
                }}
              >
                PhD
              </span>{' '}
              •{' '}
              <span
                className="cursor-pointer hover:bg-[#FF4500] hover:text-white transition-all duration-200 px-1"
                onMouseEnter={(e) => {
                  spawnSparks(e);
                  playHoverSound();
                }}
              >
                ANALYST
              </span>{' '}
              •{' '}
              <span
                className="cursor-pointer hover:bg-[#FF4500] hover:text-white transition-all duration-200 px-1"
                onMouseEnter={(e) => {
                  spawnSparks(e);
                  playHoverSound();
                }}
              >
                WRITER
              </span>{' '}
              •{' '}
              <span
                className="cursor-pointer hover:bg-[#FF4500] hover:text-white transition-all duration-200 px-1"
                onMouseEnter={(e) => {
                  spawnSparks(e);
                  playHoverSound();
                }}
              >
                PHILOSOPHER
              </span>
            </div>

            {/* Value Proposition */}
            <div className="mt-8 space-y-6 max-w-md">
              {/* Unified tagline */}
              <p className="text-2xl md:text-3xl text-white font-serif leading-tight">
                Philosophy for the <span className="text-[#FF4500] font-bold">mind</span>.
                <br />
                Strategy for the <span className="text-[#39FF14] font-bold">markets</span>.
              </p>

              {/* Two pillars */}
              <div className="grid grid-cols-1 gap-4 mt-6">
                <div className="flex items-start gap-3 group">
                  <div className="w-1 h-full bg-[#FF4500] group-hover:h-full transition-all" />
                  <div>
                    <p className="text-sm font-mono text-[#FF4500] uppercase tracking-wider mb-1">Transform</p>
                    <p className="text-white/70 font-serif">
                      Break through mental barriers. Reinvent who you are.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="w-1 h-full bg-[#39FF14] group-hover:h-full transition-all" />
                  <div>
                    <p className="text-sm font-mono text-[#39FF14] uppercase tracking-wider mb-1">Invest</p>
                    <p className="text-white/70 font-serif">
                      Beat the indexes. Build lasting wealth.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <a
              href="#contact"
              onMouseEnter={playHoverSound}
              className="mt-8 inline-block px-8 py-4 bg-[#FF4500] text-white text-xl font-black tracking-wider hover:bg-white hover:text-black hover:scale-105 transition-all duration-200 shadow-[0_0_30px_rgba(255,69,0,0.6)] hover:shadow-[0_0_50px_rgba(255,69,0,0.9),0_0_80px_rgba(255,69,0,0.6)] border-2 border-[#FF4500] hover:border-[#FF4500] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#FF4500]"
              style={{ fontFamily: "'Permanent Marker', cursive" }}
            >
              WORK WITH ME
            </a>
          </header>

          {/* Photo with 3D tilt effect */}
          <div
            className={`relative w-full aspect-[4/5] mt-10 mb-2 group grayscale hover:grayscale-0 transition-all duration-100 ${
              prefersReducedMotion || isTouchDevice ? '' : 'animate-float-jitter hover:animate-none'
            }`}
            style={{
              perspective: isTouchDevice ? undefined : '1000px',
              transform: prefersReducedMotion || isTouchDevice ? 'none' : `rotate(${scrollY * 0.002}deg)`,
            }}
            onMouseMove={(e) => {
              if (prefersReducedMotion || isTouchDevice) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              const rotateY = ((x - centerX) / centerX) * 9;
              const rotateX = ((centerY - y) / centerY) * 9;
              setPhotoTilt({ rotateX, rotateY });
            }}
            onMouseLeave={() => setPhotoTilt({ rotateX: 0, rotateY: 0 })}
          >
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#333]/90 shadow-sm z-20 backdrop-blur-sm"
              aria-hidden="true"
            />
            <div
              className="w-full h-full bg-[#1a1a1a] overflow-hidden shadow-2xl relative transition-all duration-300 ease-out border-4 border-white/20 hover:shadow-[0_0_30px_rgba(139,0,0,0.8),0_0_60px_rgba(139,0,0,0.5)]"
              style={{
                transform: prefersReducedMotion || isTouchDevice ? 'none' : `rotateX(${photoTilt.rotateX}deg) rotateY(${photoTilt.rotateY}deg)`,
                transformStyle: isTouchDevice ? undefined : 'preserve-3d',
              }}
            >
              <img
                src="/krzysztof.jpg"
                alt="Krzysztof Piekarski"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.style.backgroundColor = '#222';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-white/10 font-black text-4xl pointer-events-none" aria-hidden="true">
                KP
              </div>
            </div>
          </div>

          {/* Become Who You Are */}
          <section className="mt-6 space-y-4 group/become" aria-labelledby="become-heading">
            <h2 id="become-heading" className="text-2xl font-serif leading-relaxed text-white/90">
              Become Who You
              <br />
              <span className="bg-white text-black px-1 group-hover/become:bg-[#FF4500] group-hover/become:text-white transition-colors duration-300">
                Are
              </span>
              .
            </h2>
            <p className="text-lg text-white/60 font-serif leading-relaxed">
              Who you are is not your fault, but it is your responsibility. A sign of growth is having more tolerance
              for discomfort but less tolerance for barriers that inhibit love.
            </p>
            <p className="text-lg text-white/60 font-serif leading-relaxed">
              Krzysztof uses his training in{' '}
              <a
                href="https://www.hakomiaustin.com/people"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={playHoverSound}
                className="text-white/90 hover:text-[#FF4500] underline decoration-[#FF4500] underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4500]"
              >
                Hakomi
              </a>
              ,{' '}
              <a
                href="https://www.youtube.com/watch?v=sdAe8-4jnN4"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={playHoverSound}
                className="text-white/90 hover:text-[#FF4500] underline decoration-[#FF4500] underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4500]"
              >
                Internal-Family Systems
              </a>
              ,{' '}
              <a
                href="https://vowbjj.com/about-us/"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={playHoverSound}
                className="text-white/90 hover:text-[#FF4500] underline decoration-[#FF4500] underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4500]"
              >
                jiu-jitsu
              </a>
              ,{' '}
              <a
                href="https://archive.nytimes.com/www.nytimes.com/library/film/091198limits-film-review.html"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={playHoverSound}
                className="text-white/90 hover:text-[#FF4500] underline decoration-[#FF4500] underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4500]"
              >
                endurance running
              </a>
              ,{' '}
              <a
                href="https://www.youtube.com/watch?v=l7TONauJGfc"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={playHoverSound}
                className="text-white/90 hover:text-[#FF4500] underline decoration-[#FF4500] underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4500]"
              >
                Non-Violent Communication
              </a>
              , and{' '}
              <a
                href="https://appamada.org/people"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={playHoverSound}
                className="text-white/90 hover:text-[#FF4500] underline decoration-[#FF4500] underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4500]"
              >
                Zen
              </a>{' '}
              as a way of{' '}
              <a
                href="https://www.youtube.com/watch?v=19fTvhfh7Lw"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={playHoverSound}
                className="text-white/90 hover:text-[#FF4500] underline decoration-[#FF4500] underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4500]"
              >
                seeing through our habits
              </a>{' '}
              and moving into freedom.
            </p>
            <p className="text-lg text-[#FF4500] font-bold font-serif">Let's explore!</p>
          </section>

          {/* Testimonials */}
          <Testimonials />

          {/* Contact Form */}
          <ContactForm playHoverSound={playHoverSound} />
        </div>

        {/* RIGHT COLUMN: THE WORK */}
        <div className="md:col-span-7 flex flex-col bg-[#0a0a0a]">
          {/* Manifesto / Hammer Section */}
          <section
            className="p-12 md:p-24 relative min-h-[400px] flex items-center justify-center"
            id="philosophy"
            aria-labelledby="manifesto-heading"
          >
            {/* Physics Text */}
            <div
              id="manifesto-wrapper"
              className="text-center"
              style={{ opacity: isSmashing ? 0 : 1, transition: 'opacity 0.1s' }}
            >
              <h2
                id="manifesto-heading"
                className="text-4xl md:text-6xl font-serif leading-relaxed text-white/90 relative inline-block cursor-pointer group"
                onMouseEnter={(e) => {
                  spawnSparks(e);
                  playHoverSound();
                }}
              >
                <span className="relative inline-block group/philohead">
                  <span className="relative z-10 transition-colors duration-700 group-hover/philohead:text-[#FF4500]">
                    Philosophy
                  </span>
                  <span
                    className="absolute inset-0 bg-[#FF4500]/20 scale-x-0 origin-left group-hover/philohead:scale-x-100 transition-transform duration-700 ease-out rounded"
                    aria-hidden="true"
                  />
                </span>{' '}
                with a{' '}
                <button
                  onClick={triggerHammerBreak}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      triggerHammerBreak();
                    }
                  }}
                  className="relative inline-block bg-white text-black px-2 underline decoration-[#FF4500] decoration-4 underline-offset-4 hover:bg-[#FF4500] hover:text-white hover:decoration-white hover:scale-110 hover:rotate-6 transition-all duration-100 cursor-pointer border-2 border-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:ring-offset-2 group/hammer"
                  aria-label="Click to trigger hammer animation"
                >
                  Hammer
                  {/* Pulsing hint */}
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF4500] rounded-full animate-ping opacity-75" aria-hidden="true" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF4500] rounded-full" aria-hidden="true" />
                  {/* Tooltip */}
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/60 whitespace-nowrap opacity-0 group-hover/hammer:opacity-100 transition-opacity">
                    click me
                  </span>
                </button>
              </h2>
            </div>

            {/* Physics Canvas */}
            <canvas ref={physicsCanvasRef} className="absolute inset-0 pointer-events-none z-20" aria-hidden="true" />

            {/* Quote Reveal */}
            <div
              className={`absolute top-0 left-0 w-full h-full flex items-center justify-center p-12 transition-all duration-1000 ${
                isQuoteRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
              }`}
              role="region"
              aria-label="Revealed quote"
              aria-hidden={!isQuoteRevealed}
            >
              <div className="bg-[#0a0a0a]/90 backdrop-blur-md p-8 border-l-4 border-[#FF4500]">
                <blockquote className="text-xl md:text-2xl font-serif text-[#e0e0e0] italic leading-relaxed">
                  "To <span className="text-[#FF4500] font-bold">give style</span> to one's character – that is a grand
                  and a rare art! He who surveys all that his nature presents in its strength and in its weakness... and
                  then fashions it into an ingenious plan... he exercises that admirable art."
                </blockquote>
                <footer className="mt-4 text-sm text-[#FF4500] font-bold tracking-widest uppercase">
                  — Friedrich Nietzsche, The Gay Science
                </footer>
                <button
                  onClick={() => {
                    setIsSmashing(false);
                    setIsQuoteRevealed(false);
                    const canvas = physicsCanvasRef.current;
                    if (canvas) {
                      const ctx = canvas.getContext('2d');
                      ctx?.clearRect(0, 0, canvas.width, canvas.height);
                    }
                  }}
                  className="mt-6 text-xs border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors uppercase tracking-widest focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4500]"
                >
                  Rebuild
                </button>
              </div>
            </div>
          </section>

          {/* Project Stack */}
          <div className="flex-1 flex flex-col px-4 md:px-8 py-8 space-y-16" id="work">
            {/* Fire Philosophy */}
            <a
              href="https://firephilosophy.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative group/philosophy transition-transform duration-300 hover:rotate-[-0.45deg] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4500]"
              style={{ transform: prefersReducedMotion ? 'none' : `rotate(${scrollY * 0.0001}deg)` }}
            >
              <div
                className="absolute -top-4 left-[25%] -translate-x-1/2 w-32 h-8 bg-[#333]/90 shadow-sm z-30 backdrop-blur-sm"
                aria-hidden="true"
              />
              <div className="absolute top-4 right-4 text-4xl text-black/20 font-black z-20" aria-hidden="true">
                ✕
              </div>
              <div className="absolute bottom-4 left-4 text-2xl text-black/20 font-black z-20 rotate-12" aria-hidden="true">
                ✕
              </div>

              <div
                className="relative z-10 bg-[#0a0a0a] m-2 p-8 md:p-12 transition-all duration-150 cursor-pointer overflow-hidden"
                onMouseEnter={playHoverSound}
              >
                <img
                  src="/BuddhaSocrates.png"
                  alt=""
                  className="absolute right-0 bottom-0 h-full w-auto opacity-0 scale-[0.8] group-hover/philosophy:opacity-80 group-hover/philosophy:scale-100 transition-all duration-500 object-contain origin-bottom-right"
                  style={{
                    maskImage:
                      'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
                    WebkitMaskImage:
                      'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
                    maskComposite: 'intersect',
                    WebkitMaskComposite: 'source-in' as string,
                  }}
                  aria-hidden="true"
                />
                <span
                  className="text-xs tracking-[0.3em] text-white/40 block mb-2 relative z-10"
                  style={{ fontFamily: "'Permanent Marker', cursive" }}
                >
                  [ SUBSTACK ]
                </span>
                <h3
                  className="text-5xl md:text-6xl text-white relative z-10"
                  style={{ fontFamily: "'Permanent Marker', cursive" }}
                >
                  FIRE
                  <br />
                  PHILOSOPHY
                </h3>
                <p className="mt-4 text-white/50 font-mono text-sm relative z-10">Zen, Nietzsche, and how to live.</p>
                <div
                  className="mt-6 inline-block bg-white text-black px-8 py-4 text-xl font-black hover:bg-[#FF4500] hover:text-white hover:scale-110 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(255,69,0,0.8),0_0_60px_rgba(255,69,0,0.5)] border-2 border-black relative z-10"
                  style={{ fontFamily: "'Permanent Marker', cursive" }}
                >
                  READ NOW
                </div>
              </div>
            </a>

            {/* You Need Fire */}
            <a
              href="https://firephilosophy.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative group/fire transition-transform duration-300 hover:rotate-[3deg] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4500]"
              style={{ transform: prefersReducedMotion ? 'none' : `rotate(${-3 + scrollY * 0.001}deg)` }}
            >
              <div
                className="absolute -top-4 left-[70%] -translate-x-1/2 w-32 h-8 bg-[#333]/90 shadow-sm z-30 backdrop-blur-sm"
                aria-hidden="true"
              />

              <div
                className="relative z-10 bg-black m-3 p-8 md:p-12 transition-all duration-300 cursor-pointer group-hover/fire:shadow-[0_0_40px_rgba(255,100,0,0.8),0_0_80px_rgba(255,69,0,0.5),0_0_120px_rgba(255,140,0,0.3)]"
                onMouseEnter={playHoverSound}
              >
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/fire:opacity-100 transition-opacity duration-300 pointer-events-none pl-[20%]"
                  aria-hidden="true"
                >
                  <img
                    src="/fire.gif"
                    alt=""
                    className="w-[106px] h-[106px] object-contain"
                    style={{
                      maskImage: 'radial-gradient(circle, black 40%, transparent 70%)',
                      WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 70%)',
                    }}
                  />
                  <span
                    className="text-4xl text-white font-bold tracking-widest mt-8"
                    style={{ fontFamily: "'Permanent Marker', cursive" }}
                  >
                    Memento Mori
                  </span>
                </div>
                <span
                  className="text-xs tracking-[0.3em] text-white/40 block mb-2"
                  style={{ fontFamily: "'Permanent Marker', cursive" }}
                >
                  [ EXPERIENCE ]
                </span>
                <h3 className="text-4xl md:text-5xl text-white" style={{ fontFamily: "'Permanent Marker', cursive" }}>
                  YOU NEED FIRE
                  <br />
                  IN YOUR LIFE
                </h3>
                <p className="mt-4 text-white/50 font-mono text-sm max-w-xs">
                  An interactive journey into transformation and passion.
                </p>
                <div
                  className="mt-6 inline-block bg-white text-black px-8 py-4 text-xl font-black hover:bg-[#FF4500] hover:text-white hover:scale-110 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(255,69,0,0.8),0_0_60px_rgba(255,69,0,0.5)] border-2 border-black"
                  style={{ fontFamily: "'Permanent Marker', cursive" }}
                >
                  ENTER THE FIRE
                </div>
              </div>
            </a>

            {/* Wall Street Wildlife */}
            <div
              className="relative transition-transform duration-300 hover:rotate-[-0.45deg]"
              style={{ transform: prefersReducedMotion ? 'none' : `rotate(${scrollY * 0.0001}deg)` }}
            >
              <div
                className="absolute -top-4 left-[30%] -translate-x-1/2 w-32 h-8 bg-[#333]/90 shadow-sm z-40 backdrop-blur-sm"
                aria-hidden="true"
              />

              <div className="relative group/finance overflow-hidden">
                <div
                  className="absolute inset-0 bg-[#f5f5dc] z-0 rotate-1 scale-[1.03] shadow-2xl"
                  style={{
                    clipPath: 'polygon(0% 2%, 3% 0%, 97% 1%, 100% 3%, 99% 97%, 97% 100%, 3% 99%, 0% 97%)',
                  }}
                  aria-hidden="true"
                />

                <article className="relative z-10 bg-[#0a0a0a] p-8 md:p-12 transition-all duration-300">
                  <div
                    className="absolute inset-0 bg-center bg-no-repeat opacity-0 group-hover/finance:opacity-100 transition-opacity duration-300"
                    style={{
                      backgroundImage: "url('/WSW.jpeg')",
                      backgroundSize: '80%',
                      maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 80%)',
                      WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 80%)',
                    }}
                    aria-hidden="true"
                  />
                  <div
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover/finance:opacity-100 transition-opacity duration-300"
                    aria-hidden="true"
                  />

                  <div className="relative z-10">
                    <div className="relative">
                      <div>
                        <span
                          className="text-xs tracking-[0.3em] text-white/40 group-hover/finance:text-white/70 block mb-2 transition-colors"
                          style={{ fontFamily: "'Permanent Marker', cursive" }}
                        >
                          [ PODCAST ]
                        </span>
                        <h3
                          className="text-4xl md:text-6xl leading-[0.9] text-white"
                          style={{ fontFamily: "'Permanent Marker', cursive" }}
                        >
                          WALL STREET
                          <br />
                          WILDLIFE
                        </h3>
                      </div>
                      {/* Monkey avatar */}
                      <a
                        href="https://www.patreon.com/wallstreetwildlife"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-[10%] top-[65%] -translate-y-1/4 w-56 h-56 bg-white rounded-full overflow-hidden rotate-[5deg] border-4 border-black shadow-xl grayscale hover:grayscale-0 hover:scale-110 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4500]"
                        onMouseEnter={() => {
                          spawnBananas();
                          playHoverSound();
                        }}
                        aria-label="Support Wall Street Wildlife on Patreon"
                      >
                        <img
                          src="/monkey.png"
                          className="w-full h-full object-cover"
                          alt="Wall Street Wildlife Monkey"
                        />
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.7) 100%)',
                          }}
                          aria-hidden="true"
                        />
                        {/* Banana rain */}
                        {bananas.map((banana) => (
                          <div
                            key={banana.id}
                            className="absolute pointer-events-none z-10 animate-banana-fall"
                            style={{
                              left: `calc(50% + ${banana.x}px)`,
                              top: `calc(30% + ${banana.y}px)`,
                              animationDelay: `${banana.delay}ms`,
                            }}
                            aria-hidden="true"
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4 20C4 20 6 18 8 14C10 10 12 6 16 4C18 3 20 3 21 4C22 5 22 7 21 9C20 12 16 16 12 18C8 20 4 20 4 20Z"
                                fill="#FFE135"
                                stroke="#BFA700"
                                strokeWidth="1"
                              />
                              <path
                                d="M16 4C16 4 14 6 13 8"
                                stroke="#BFA700"
                                strokeWidth="1"
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>
                        ))}
                      </a>
                    </div>
                    <p className="mt-6 text-white/60 group-hover/finance:text-white/80 font-mono text-sm max-w-sm transition-colors">
                      Equity analysis for the untamed investor. Co-hosted with Luke "Badger" Hallard.
                    </p>
                    <div className="mt-6 flex gap-6 flex-wrap">
                      <a
                        href="https://www.patreon.com/wallstreetwildlife"
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={playHoverSound}
                        className="inline-block bg-white text-black px-6 py-3 text-lg font-black rotate-[-2deg] hover:bg-[#006400] hover:text-white hover:scale-110 hover:rotate-0 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[0_0_36px_rgba(0,100,0,0.85),0_0_72px_rgba(0,100,0,0.55)] border-2 border-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006400]"
                        style={{ fontFamily: "'Permanent Marker', cursive" }}
                      >
                        LISTEN
                      </a>
                      <a
                        href="https://www.youtube.com/@WallStreetWildlife"
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={playHoverSound}
                        className="inline-block bg-white text-black px-6 py-3 text-lg font-black rotate-[2deg] hover:bg-[#FF0000] hover:text-white hover:scale-110 hover:rotate-0 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[0_0_36px_rgba(255,0,0,0.85),0_0_72px_rgba(255,0,0,0.55)] border-2 border-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF0000]"
                        style={{ fontFamily: "'Permanent Marker', cursive" }}
                      >
                        WATCH
                      </a>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            {/* Options Mastery */}
            <a
              href="https://wswoptionsuniversity.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative group/options overflow-hidden transition-transform duration-300 hover:rotate-[0.45deg] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39FF14]"
              style={{ transform: prefersReducedMotion ? 'none' : `rotate(${scrollY * 0.0001}deg)` }}
            >
              <div
                className="absolute -top-4 left-[65%] -translate-x-1/2 w-32 h-8 bg-[#333]/90 shadow-sm z-30 backdrop-blur-sm"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-[#1a1a1a] z-0 rotate-[-1deg] scale-[1.02] shadow-2xl"
                style={{ clipPath: 'polygon(1% 0%, 99% 2%, 100% 98%, 2% 100%)' }}
                aria-hidden="true"
              />

              <div
                className="relative z-10 bg-[#0a0a0a] p-8 md:p-12 transition-all duration-300 cursor-pointer"
                onMouseEnter={playHoverSound}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-0 group-hover/options:opacity-100 transition-opacity duration-300"
                  style={{ backgroundImage: "url('/OptionsGreeks.png')" }}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover/options:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                />

                <div className="relative z-10">
                  <span
                    className="text-xs tracking-[0.3em] text-white/40 group-hover/options:text-white/70 block mb-2 transition-colors"
                    style={{ fontFamily: "'Permanent Marker', cursive" }}
                  >
                    [ COURSE ]
                  </span>
                  <h3
                    className="text-4xl md:text-5xl text-white group-hover/options:text-white"
                    style={{ fontFamily: "'Permanent Marker', cursive" }}
                  >
                    OPTIONS
                    <br />
                    MASTERY
                  </h3>
                  <div className="mt-3 flex gap-2">
                    <span className="bg-white/20 group-hover/options:bg-[#8B5CF6] text-white text-xs px-2 py-0.5 transition-colors">
                      LEARN
                    </span>
                    <span className="bg-white/20 group-hover/options:bg-[#8B5CF6] text-white text-xs px-2 py-0.5 transition-colors">
                      TRADE
                    </span>
                    <span className="bg-white/20 group-hover/options:bg-[#8B5CF6] text-white text-xs px-2 py-0.5 transition-colors">
                      PROFIT
                    </span>
                  </div>
                  <p className="mt-4 text-white/50 group-hover/options:text-white/80 font-mono text-sm transition-colors">
                    Master options trading. From zero to hero.
                  </p>
                  <div
                    className="mt-6 inline-block bg-white text-black px-8 py-4 text-xl font-black hover:bg-[#39FF14] hover:text-black hover:scale-110 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(57,255,20,0.8),0_0_60px_rgba(57,255,20,0.5)] border-2 border-black"
                    style={{ fontFamily: "'Permanent Marker', cursive" }}
                  >
                    START LEARNING
                  </div>
                </div>
              </div>
            </a>
          </div>

          {/* Bookshelf */}
          <Bookshelf onBookHover={playHoverSound} />

          <SectionDivider variant="gradient" />

          {/* Featured Video */}
          <section className="p-12 md:p-16 bg-[#0a0a0a]" aria-labelledby="video-heading">
            <div className="max-w-4xl mx-auto">
              {/* Video Header */}
              <ScrollReveal animation="fade-up">
                <div className="mb-8 text-center">
                  <p className="font-mono text-xs tracking-widest text-[#FF4500] uppercase mb-2">Featured</p>
                  <h2 id="video-heading" className="text-2xl md:text-3xl font-serif text-white mb-3">
                    Reason to Believe
                  </h2>
                  <p className="text-white/50 text-sm max-w-xl mx-auto">
                    Bruce Springsteen's meditation on faith and perseverance—a song that captures the human spirit's refusal to give up.
                  </p>
                </div>
              </ScrollReveal>

              <div className="rounded-sm overflow-hidden border-2 border-[#FF4500]/30 shadow-[0_0_30px_rgba(255,69,0,0.15)]">
                <LazyYouTube
                  videoId="piMODx-_KYk"
                  title="Reason to Believe by Bruce Springsteen"
                />
              </div>

              {/* Lyrics */}
              <div className="mt-10 text-center">
                <blockquote className="text-white/70 font-serif text-lg md:text-xl leading-relaxed italic max-w-2xl mx-auto">
                  Seen a man standin' over a dead dog
                  <br />
                  By the highway in a ditch
                  <br />
                  He's lookin' down kinda puzzled
                  <br />
                  Pokin' that dog with a stick
                  <br />
                  Got his car door flung open
                  <br />
                  He's standin' out on Highway 31
                  <br />
                  Like if he stood there long enough
                  <br />
                  That dog'd get up and run
                  <br />
                  Struck me kinda funny
                  <br />
                  Seemed kinda funny sir to me
                  <br />
                  Still at the end of every hard day
                  <br />
                  <span className="text-[#FF4500] font-semibold not-italic">People find some reason to believe</span>
                </blockquote>
              </div>
            </div>
          </section>

          {/* Newsletter Signup */}
          <div className="px-6 md:px-12 py-12 bg-[#0a0a0a]">
            <div className="max-w-3xl mx-auto">
              <ScrollReveal animation="fade-up">
                <NewsletterSignup playHoverSound={playHoverSound} />
              </ScrollReveal>
            </div>
          </div>

          <SectionDivider variant="dots" />

          {/* Collaborators */}
          <section className="p-12 md:p-16 bg-[#0a0a0a] text-white/70" id="about" aria-labelledby="collaborators-heading">
            <ScrollReveal animation="fade-up">
              <h4 id="collaborators-heading" className="font-mono text-xs tracking-widest opacity-40 mb-8 uppercase">
                Collaborators & Partners
              </h4>
            </ScrollReveal>
            <div className="flex justify-center gap-12 md:gap-16 flex-wrap">
              <a
                href="https://x.com/7LukeHallard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006400]"
                onMouseEnter={playHoverSound}
              >
                <div className="w-[120px] h-[120px] md:w-[140px] md:h-[140px] rounded-full overflow-hidden grayscale group-hover:grayscale-0 transition-all border border-white/20 group-hover:border-[#006400] group-hover:shadow-[0_0_45px_5px_#006400] group-active:shadow-[0_0_60px_10px_#006400] duration-300">
                  <img
                    src="/badger.png"
                    alt="Luke Badger Hallard"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="font-bold uppercase text-sm text-white">Luke "Badger" Hallard</p>
                  <p className="text-xs font-mono opacity-60">The Badger</p>
                </div>
              </a>
              <a
                href="https://www.oxy.edu/academics/faculty/dale-wright"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22543d]"
                onMouseEnter={playHoverSound}
              >
                <div className="w-[120px] h-[120px] md:w-[140px] md:h-[140px] rounded-full overflow-hidden grayscale group-hover:grayscale-0 transition-all border border-white/20 group-hover:border-[#22543d] group-hover:shadow-[0_0_45px_5px_#22543d] group-active:shadow-[0_0_60px_10px_#22543d] duration-300">
                  <img
                    src="/Dale Wright.jpg"
                    alt="Dale Wright"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="font-bold uppercase text-sm text-white">Dale Wright</p>
                  <p className="text-xs font-mono opacity-60">Zen Philosopher</p>
                </div>
              </a>
              <div className="flex flex-col items-center gap-3 group cursor-pointer" onMouseEnter={playHoverSound}>
                <div className="w-[120px] h-[120px] md:w-[140px] md:h-[140px] rounded-full overflow-hidden grayscale group-hover:grayscale-0 transition-all border border-white/20 relative group-hover:border-[#9d00ff] group-hover:shadow-[0_0_30px_#9d00ff] group-active:shadow-[0_0_50px_#9d00ff] duration-300">
                  <img
                    src="/bunk.jpg"
                    alt="Bunk"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black text-[10px] font-black px-1 border border-black transform rotate-12">
                    CEO
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-bold uppercase text-sm text-white">Bunk</p>
                  <p className="text-xs font-mono opacity-60">Chief Morale</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Oracle Terminal */}
        <OracleTerminal isOpen={oracleOpen} onClose={() => setOracleOpen(false)} />
      </main>

      {/* Memento Mori Ticker */}
      <MementoMoriTicker isVisible={isBottom} />
    </div>
  );
}
