'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Mail, BookOpen, TrendingUp, Menu, X, Terminal, Twitter, Youtube } from 'lucide-react';
import Bookshelf from './components/Bookshelf';
import Matter from 'matter-js';

/**
 * THE ANALYST'S FIELD GUIDE - GRIT EDITION
 * -----------------------------------------
 * A brutalist, collage-style landing page inspired by Grit Pictures.
 * Features: Constellation background, parallax, decorative stickers, torn paper effects.
 */

export default function FieldGuide() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const [time, setTime] = useState<string>('');
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number; color: string; tx: number; ty: number }[]>([]);
  const [photoTilt, setPhotoTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [bananas, setBananas] = useState<{ id: number; x: number; y: number; delay: number }[]>([]); // x,y are relative to avatar center
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [isSmashing, setIsSmashing] = useState(false);
  const [isQuoteRevealed, setIsQuoteRevealed] = useState(false);

  const [isBottom, setIsBottom] = useState(false);



  // ORACLE STATE
  const [oracleOpen, setOracleOpen] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState<{ type: 'input' | 'output'; text: string }[]>([
    { type: 'output', text: 'THE ORACLE v1.0 [ONLINE]' },
    { type: 'output', text: 'Type "help" for commands.' }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Refs
  // Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const fireSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const constellationRef = useRef<HTMLCanvasElement>(null);
  const physicsCanvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  // ---------------------------------------------------------------------------
  // CLOCK
  // ---------------------------------------------------------------------------
  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ---------------------------------------------------------------------------
  // SCROLL TRACKING (for Parallax)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      // Check if near bottom (within 100px)
      const isNearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      setIsBottom(isNearBottom);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ---------------------------------------------------------------------------
  // SOUND ENGINE
  // ---------------------------------------------------------------------------
  const toggleAudio = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;

      if (audioEnabled) {
        // STOP FIRE
        if (fireSourceRef.current) {
          try {
            fireSourceRef.current.stop();
          } catch (e) { }
          fireSourceRef.current = null;
        }
        setAudioEnabled(false);
      } else {
        // RESUME CONTEXT IF NEEDED
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // START FIRE (Synthesized Pink/Brown Noise)
        const bufferSize = ctx.sampleRate * 2; // 2 seconds loop
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          lastOut = (lastOut + (0.02 * white)) / 1.02; // Brown noise filter
          lastOut *= 3.5;
          data[i] = lastOut;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.25; // Base volume

        // Lowpass to make it rumble
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        noise.start();
        fireSourceRef.current = noise;

        setAudioEnabled(true);
      }
    } catch (e) {
      console.error("Audio toggle failed", e);
    }
  };

  const playHoverSound = () => {
    // Fire crackling sound using filtered noise
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

      // Create noise buffer for crackling
      const bufferSize = audioContext.sampleRate * 0.15;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate crackling noise with random pops
      for (let i = 0; i < bufferSize; i++) {
        // Base crackle with random intensity bursts
        const burst = Math.random() < 0.02 ? Math.random() * 2 : 0;
        data[i] = (Math.random() * 2 - 1) * (0.3 + burst);
      }

      const noiseSource = audioContext.createBufferSource();
      noiseSource.buffer = buffer;

      // Low-pass filter for warm fire sound
      const lowpass = audioContext.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 800 + Math.random() * 400;

      // High-pass to remove rumble
      const highpass = audioContext.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 100;

      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);

      noiseSource.connect(highpass);
      highpass.connect(lowpass);
      lowpass.connect(gainNode);
      gainNode.connect(audioContext.destination);

      noiseSource.start(audioContext.currentTime);
      noiseSource.stop(audioContext.currentTime + 0.15);
    } catch (e) {
      // Silently fail if audio not supported
    }
    setIsHoveringLink(true);
  };

  // ---------------------------------------------------------------------------
  // SPARK/EMBER EFFECT
  // ---------------------------------------------------------------------------
  const spawnSparks = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newSparks = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 100,
      y: rect.top + rect.height / 2 + (Math.random() - 0.5) * 30,
      color: ['#FF4500', '#FF6B35', '#FFD700', '#FF8C00', '#FFA500'][Math.floor(Math.random() * 5)],
      tx: (Math.random() - 0.5) * 100,
      ty: Math.random() * -80 - 20,
    }));
    setSparks(prev => [...prev, ...newSparks]);
    // Clean up after animation
    setTimeout(() => {
      setSparks(prev => prev.filter(s => !newSparks.find(ns => ns.id === s.id)));
    }, 1000);
  };

  // Spawn bananas from monkey avatar (positions are relative to avatar center)
  const spawnBananas = () => {
    const newBananas = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 160, // Wider spread across avatar
      y: -20 + (i * 12), // Staggered vertical starting positions
      delay: i * 150 + Math.random() * 100, // Sequential delays to spread them out
    }));
    setBananas(prev => [...prev, ...newBananas]);
    // Clean up after animation
    setTimeout(() => {
      setBananas(prev => prev.filter(b => !newBananas.find(nb => nb.id === b.id)));
    }, 2000);
  };

  const playSmashSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const t = audioContext.currentTime;

      // 1. LOW THUD (The Impact)
      const osc = audioContext.createOscillator();
      const gainOsc = audioContext.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);
      gainOsc.gain.setValueAtTime(0.8, t);
      gainOsc.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
      osc.connect(gainOsc);
      gainOsc.connect(audioContext.destination);
      osc.start(t);
      osc.stop(t + 0.3);

      // 2. CRUNCH/DEBRIS (The Destruction)
      const bufferSize = audioContext.sampleRate * 0.5; // 0.5 seconds of noise
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1);
      }

      const noise = audioContext.createBufferSource();
      const noiseGain = audioContext.createGain();
      const noiseFilter = audioContext.createBiquadFilter();

      noise.buffer = buffer;
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(1000, t);
      noiseFilter.frequency.linearRampToValueAtTime(100, t + 0.4); // Filter closes down

      noiseGain.gain.setValueAtTime(0.8, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(audioContext.destination);
      noise.start(t);

      // 3. HIGH SNAP (The Crack)
      const snapOsc = audioContext.createOscillator();
      const snapGain = audioContext.createGain();
      snapOsc.type = 'square';
      snapOsc.frequency.setValueAtTime(500, t);
      snapOsc.frequency.exponentialRampToValueAtTime(100, t + 0.05);
      snapGain.gain.setValueAtTime(0.3, t);
      snapGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
      snapOsc.connect(snapGain);
      snapGain.connect(audioContext.destination);
      snapOsc.start(t);
      snapOsc.stop(t + 0.1);

    } catch (e) {
      console.error("Audio synth error", e);
    }
  };

  // ---------------------------------------------------------------------------
  // THE HAMMER PHYSICS
  // ---------------------------------------------------------------------------
  const triggerHammerBreak = () => {
    if (isSmashing) return;
    setIsSmashing(true);
    spawnSparks({ currentTarget: physicsCanvasRef.current } as any); // Fake spark origin

    // Play the new smash sound
    playSmashSound();

    const canvas = physicsCanvasRef.current;
    if (!canvas) return;

    // Initialize Matter.js
    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Body = Matter.Body;

    // Create engine
    const engine = Engine.create();
    engineRef.current = engine;

    // Get dimensions of the container
    const parent = canvas.parentElement;
    const width = parent?.clientWidth || 800;
    const height = parent?.clientHeight || 400;

    // Create renderer
    const render = Render.create({
      canvas: canvas,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio
      }
    });
    renderRef.current = render;

    // Create Text Shards (Simulated as blocks for now)
    const shards: Matter.Body[] = [];
    // Rough simulation of the text content as physical bodies
    const lines = [
      { text: "Philosophy", x: width * 0.2, y: height * 0.2, w: 150 },
      { text: "with a", x: width * 0.4, y: height * 0.2, w: 80 },
      { text: "HAMMER", x: width * 0.6, y: height * 0.2, w: 120, color: '#FFFFFF', bg: '#000000' },
      { text: "I use the hammer", x: width * 0.3, y: height * 0.4, w: 200 },
      { text: "of philosophy", x: width * 0.6, y: height * 0.4, w: 150 },
      { text: "to dismantle", x: width * 0.3, y: height * 0.55, w: 140 },
      { text: "narratives", x: width * 0.5, y: height * 0.55, w: 120 },
    ];

    lines.forEach(line => {
      const body = Bodies.rectangle(line.x, line.y, line.w, 40, {
        render: {
          fillStyle: line.bg || '#333333',
          strokeStyle: '#ffffff',
          lineWidth: 1,
          // text: line.text // Matter.js render doesn't support text easily, using blocks for abstract smash
        },
        restitution: 0.6,
        friction: 0.1
      });
      // Add random rotation and velocity for explosion effect
      Body.setVelocity(body, { x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 10 });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);
      shards.push(body);
    });

    // The Hammer itself (Heavy invisible object dropping from top)
    const hammer = Bodies.rectangle(width / 2, -100, 200, 100, {
      density: 0.5,
      render: { fillStyle: '#FF4500' }
    });
    Body.setVelocity(hammer, { x: 0, y: 20 });

    // Floor
    const floor = Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true, render: { visible: false } });
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true, render: { visible: false } });
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true, render: { visible: false } });

    Composite.add(engine.world, [...shards, hammer, floor, leftWall, rightWall]);

    // Run
    Render.run(render);
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // After 2.5 seconds, slow down and reveal quote
    setTimeout(() => {
      setIsQuoteRevealed(true);
      // Stop physics eventually to save resources? 
      // For now keep running so they settle or float
    }, 2000);
  };

  // ---------------------------------------------------------------------------
  // THE ORACLE LOGIC
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle on Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOracleOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (oracleOpen && terminalInputRef.current) {
      setTimeout(() => terminalInputRef.current?.focus(), 100);
    }
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [oracleOpen, terminalHistory]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...terminalHistory, { type: 'input' as const, text: terminalInput }];

    // COMMAND DICTIONARY
    let response = '';
    switch (cmd) {
      case 'help':
        response = 'AVAILABLE COMMANDS: help, clear, fear, money, truth, love, purpose, krzys';
        break;
      case 'clear':
        setTerminalHistory([]);
        setTerminalInput('');
        return;
      case 'fear':
        response = 'Fear is the border of your reality. Cross it.';
        break;
      case 'money':
        response = 'Money is stored energy. Where is yours leaking?';
        break;
      case 'truth':
        response = 'The truth is not a destination. It is a frequency.';
        break;
      case 'love':
        response = 'Love is the recognition of shared awareness.';
        break;
      case 'purpose':
        response = 'To build. To break. To begin again.';
        break;
      case 'krzys':
      case 'krzysztof':
      case 'chris':
        response = 'ANALYST PHILOSOPHER NOT AN ELF, EXACTLY';
        break;
      case 'who are you':
        response = 'I am the echo of your own curiosity.';
        break;
      default:
        response = `Command not found: "${cmd}". Try "help".`;
    }

    setTerminalHistory([...newHistory, { type: 'output', text: response }]);
    setTerminalInput('');
  };

  // ---------------------------------------------------------------------------
  // TRAILING SWIRL CURSOR EFFECT WITH GLOWING EMBER
  // ---------------------------------------------------------------------------
  const trailRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
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

      // Add current position to trail
      const trail = trailRef.current;
      trail.push({ x: mousePos.x, y: mousePos.y });

      // Keep trail at max 150 points (25% faster fade)
      const maxTrailLength = 150;
      if (trail.length > maxTrailLength) {
        trail.shift();
      }

      // Draw multiple trailing swirl lines from the ember
      if (trail.length > 2) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw 3 parallel trails with slight offsets for richer effect
        const trailOffsets = [
          { dx: 0, dy: 0, color: [255, 140, 50], maxWidth: 4 },      // Center trail (warmest)
          { dx: 3, dy: 2, color: [255, 100, 30], maxWidth: 2.5 },    // Upper offset
          { dx: -3, dy: -2, color: [255, 80, 20], maxWidth: 2 },     // Lower offset
        ];

        trailOffsets.forEach(({ dx, dy, color, maxWidth }) => {
          for (let i = 1; i < trail.length; i++) {
            const progress = i / trail.length; // 0 to 1
            const opacity = progress * 0.5; // Fade in toward cursor
            const lineWidth = progress * maxWidth; // Thicker toward cursor

            ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(trail[i - 1].x + dx * (1 - progress), trail[i - 1].y + dy * (1 - progress));
            ctx.lineTo(trail[i].x + dx * (1 - progress), trail[i].y + dy * (1 - progress));
            ctx.stroke();
          }
        });
      }

      // Draw glowing ember at cursor head
      if (mousePos.x > 0 && mousePos.y > 0) {
        // Calculate velocity from trail for heat intensity
        let velocity = 0;
        if (trail.length >= 2) {
          const last = trail[trail.length - 1];
          const prev = trail[trail.length - 2];
          velocity = Math.sqrt(Math.pow(last.x - prev.x, 2) + Math.pow(last.y - prev.y, 2));
        }

        // Normalize velocity (0-1), capped at ~50px movement per frame
        const heat = Math.min(velocity / 50, 1);

        // Interpolate colors: warm orange (idle) -> hot red/white (moving)
        // Core: yellow-orange -> bright white
        const coreR = 255;
        const coreG = Math.round(200 - heat * 80); // 200 -> 120
        const coreB = Math.round(100 - heat * 70); // 100 -> 30

        // Glow: orange -> intense red
        const glowR = 255;
        const glowG = Math.round(120 - heat * 90); // 120 -> 30
        const glowB = Math.round(30 - heat * 20);  // 30 -> 10

        // Outer glow size increases with heat
        const glowSize = 27 + heat * 15;

        // Outer glow
        const gradient = ctx.createRadialGradient(
          mousePos.x, mousePos.y, 0,
          mousePos.x, mousePos.y, glowSize
        );
        gradient.addColorStop(0, `rgba(${glowR}, ${glowG}, ${glowB}, ${0.8 + heat * 0.2})`);
        gradient.addColorStop(0.3, `rgba(${glowR}, ${Math.max(glowG - 40, 10)}, ${glowB}, ${0.4 + heat * 0.3})`);
        gradient.addColorStop(0.6, `rgba(255, ${Math.round(50 - heat * 30)}, 10, ${0.1 + heat * 0.15})`);
        gradient.addColorStop(1, 'rgba(255, 30, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Bright core - gets whiter/brighter when moving
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
  }, [mousePos.x, mousePos.y]);

  // ---------------------------------------------------------------------------
  // CONSTELLATION BACKGROUND
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const canvas = constellationRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create stars
    const stars: { x: number; y: number; vx: number; vy: number }[] = [];
    const numStars = 80;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 3; // Tall for scrolling
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move stars
      stars.forEach(star => {
        star.x += star.vx;
        star.y += star.vy;
        if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
        if (star.y < 0 || star.y > canvas.height) star.vy *= -1;
      });

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
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);



  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-sans selection:bg-white selection:text-black overflow-x-hidden cursor-none">



      {/* --- CONSTELLATION BACKGROUND (Parallax Layer) --- */}
      <canvas
        ref={constellationRef}
        className="fixed top-0 left-0 w-full pointer-events-none z-0 opacity-40"
        style={{ transform: `translateY(${scrollY * -0.2}px)` }}
      />



      {/* --- SPARK PARTICLES --- */}
      {sparks.map(spark => (
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
        />
      ))}

      {/* --- BANANA RAIN is now rendered inside the monkey avatar --- */}

      {/* --- CURSOR LAYER --- */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 mix-blend-screen opacity-60"
      />

      {/* --- NOISE TEXTURE --- */}
      <div className="fixed inset-0 opacity-[0.08] pointer-events-none z-40 mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
      />

      {/* --- FLOATING SOCIAL LINKS --- */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-3">
        <a
          href="https://x.com/7FlyingPlatypus"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={playHoverSound}
          onMouseLeave={() => setIsHoveringLink(false)}
          className="group w-10 h-10 flex items-center justify-center border border-white/20 bg-black/50 backdrop-blur-sm hover:border-[#1DA1F2] hover:bg-[#1DA1F2] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(29,161,242,0.5)]"
        >
          <Twitter size={18} className="text-white/60 group-hover:text-white transition-colors" />
        </a>
        <a
          href="https://www.youtube.com/@WallStreetWildlife"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={playHoverSound}
          onMouseLeave={() => setIsHoveringLink(false)}
          className="group w-10 h-10 flex items-center justify-center border border-white/20 bg-black/50 backdrop-blur-sm hover:border-[#FF0000] hover:bg-[#FF0000] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,0,0,0.5)]"
        >
          <Youtube size={18} className="text-white/60 group-hover:text-white transition-colors" />
        </a>
        <a
          href="https://firephilosophy.substack.com/"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={playHoverSound}
          onMouseLeave={() => setIsHoveringLink(false)}
          className="group w-10 h-10 flex items-center justify-center border border-white/20 bg-black/50 backdrop-blur-sm hover:border-[#FF6719] hover:bg-[#FF6719] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,103,25,0.5)]"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" className="text-white/60 group-hover:text-white transition-colors fill-current">
            <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
          </svg>
        </a>
        <a
          href="mailto:krzyspiekarski@gmail.com"
          onMouseEnter={playHoverSound}
          onMouseLeave={() => setIsHoveringLink(false)}
          className="group w-10 h-10 flex items-center justify-center border border-white/20 bg-black/50 backdrop-blur-sm hover:border-[#22C55E] hover:bg-[#22C55E] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]"
        >
          <Mail size={18} className="text-white/60 group-hover:text-white transition-colors" />
        </a>
        {/* Decorative line */}
        <div className="w-[1px] h-16 bg-gradient-to-b from-white/20 to-transparent mx-auto mt-2" />
      </div>

      {/* --- NAVIGATION (Grit Pictures Style) --- */}
      <nav className="fixed top-0 left-0 w-full z-30 pointer-events-none">
        {/* Menu Bar - shows when menu is open */}
        <div className={`w-full bg-black/90 backdrop-blur-sm transition-all duration-300 pointer-events-auto ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
          <div className="flex items-center justify-center gap-2 md:gap-4 p-3 flex-wrap">
            {/* Menu Items */}
            {[
              { label: 'WORK', icon: '◈', href: '#work' },
              { label: 'PHILOSOPHY', icon: '☯', href: '#philosophy' },
              { label: 'ABOUT', icon: '◉', href: '#about' },
              { label: 'CONTACT', icon: '✉', href: 'mailto:krzyspiekarski@gmail.com' },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`transition-all duration-700 ease-out ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-16 opacity-0'}`}
                style={{
                  transitionDelay: menuOpen ? `${i * 150}ms` : '0ms'
                }}
              >
                <a
                  href={item.href}
                  onMouseEnter={playHoverSound}
                  onMouseLeave={() => setIsHoveringLink(false)}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-white rounded-sm bg-transparent hover:bg-[#FF4500] hover:text-black hover:border-[#FF4500] hover:shadow-[0_0_20px_rgba(255,69,0,0.8),0_0_40px_rgba(255,69,0,0.5)] transition-all duration-100 group"
                  style={{
                    fontFamily: "'Permanent Marker', cursive"
                  }}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm tracking-wider">{item.label}</span>
                  <span className="text-white/60 group-hover:text-black/60 transition-colors">›</span>
                </a>
              </div>
            ))}

            {/* Close Button */}
            <button
              onClick={() => setMenuOpen(false)}
              onMouseEnter={playHoverSound}
              onMouseLeave={() => setIsHoveringLink(false)}
              className="ml-2 w-10 h-10 flex items-center justify-center border-2 border-white rounded-sm hover:bg-white hover:text-black transition-colors text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Top Bar - always visible */}
        <div className={`flex justify-between items-center px-4 md:px-6 py-2 -mt-2 transition-all duration-300 ${menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
          <div
            className="flex gap-3 text-xs font-bold tracking-widest text-white/80 transition-opacity duration-300"
            style={{ opacity: Math.max(0, 1 - scrollY / 150) }}
          >
            <span className="bg-white/10 px-2 py-1">Austin, TX</span>
            <span className="bg-white/10 px-2 py-1">{time}</span>
          </div>
          <div className="fixed top-4 right-4 flex gap-3 items-center z-50 scale-[1.2] origin-top-right">
            <button
              onClick={toggleAudio}
              onMouseEnter={playHoverSound}
              onMouseLeave={() => setIsHoveringLink(false)}
              className="text-xs font-bold tracking-widest hover:bg-white hover:text-black px-2 py-1 transition-colors border border-white/20"
            >
              {audioEnabled ? 'MUTE' : 'AUDIO'}
            </button>

            {/* ORACLE TRIGGER */}
            <button
              onClick={() => setOracleOpen(true)}
              className="text-white/50 hover:text-[#00FF00] transition-colors p-1"
              title="Access Terminal (Cmd+K)"
            >
              <Terminal size={14} />
            </button>

            <button
              onClick={() => setMenuOpen(true)}
              onMouseEnter={playHoverSound}
              onMouseLeave={() => setIsHoveringLink(false)}
              className="px-4 py-2 bg-white text-black text-xs font-black tracking-widest hover:scale-105 transition-transform border-2 border-[#FF4500] shadow-[0_0_15px_rgba(255,69,0,0.6)] animate-pulse hover:animate-none"
              style={{
                fontFamily: "'Permanent Marker', cursive",
                transform: 'rotate(-2deg)'
              }}
            >
              MENU
            </button>
          </div>
        </div>


      </nav>


      {/* --- MAIN LAYOUT --- */}
      <main className="relative z-10 w-full max-w-[1600px] mx-auto min-h-screen flex flex-col md:grid md:grid-cols-12">

        {/* --- LEFT COLUMN: IDENTITY --- */}
        < div className="md:col-span-5 relative p-8 md:pb-20 flex flex-col justify-between min-h-screen bg-[#0a0a0a]" >

          {/* Header */}
          < div className="mt-20" style={{ transform: `translateY(${scrollY * 0.05}px)` }
          }>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter mb-6 text-white mix-blend-difference flex flex-col items-start cursor-default">
              <div className="flex flex-wrap">
                {"KRZYSZTOF".split("").map((char, i) => (
                  <span
                    key={`k-${i}`}
                    className="inline-block transition-all duration-200 hover:text-[#FF4500] hover:-translate-y-2 hover:scale-110"
                    style={{ textShadow: 'none' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textShadow = "0 0 10px #FF4500, 0 0 20px #FF4500, 0 0 40px #FF4500";
                      playHoverSound();
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textShadow = "none";
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap">
                {"PIEKARSKI".split("").map((char, i) => (
                  <span
                    key={`p-${i}`}
                    className="inline-block transition-all duration-200 hover:text-[#FF4500] hover:-translate-y-2 hover:scale-110"
                    style={{ textShadow: 'none' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textShadow = "0 0 10px #FF4500, 0 0 20px #FF4500, 0 0 40px #FF4500";
                      playHoverSound();
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textShadow = "none";
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </h1>
            <div className="inline-block bg-white text-black px-3 py-1 text-sm font-mono transform -rotate-2 border border-white">
              <span className="cursor-pointer hover:bg-[#FF4500] hover:text-white transition-all duration-200 px-1" onMouseEnter={(e) => { spawnSparks(e); playHoverSound(); }}>PhD</span> • <span className="cursor-pointer hover:bg-[#FF4500] hover:text-white transition-all duration-200 px-1" onMouseEnter={(e) => { spawnSparks(e); playHoverSound(); }}>ANALYST</span> • <span className="cursor-pointer hover:bg-[#FF4500] hover:text-white transition-all duration-200 px-1" onMouseEnter={(e) => { spawnSparks(e); playHoverSound(); }}>WRITER</span> • <span className="cursor-pointer hover:bg-[#FF4500] hover:text-white transition-all duration-200 px-1" onMouseEnter={(e) => { spawnSparks(e); playHoverSound(); }}>PHILOSOPHER</span>
            </div>
          </div >

          {/* Cutout Image with 3D Tilt Effect */}
          < div
            className="relative w-full aspect-[4/5] mt-4 mb-8 group grayscale hover:grayscale-0 transition-all duration-100 animate-float-jitter hover:animate-none"
            style={{
              perspective: '1000px',
              transform: `rotate(${scrollY * 0.002}deg)`
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              const rotateY = ((x - centerX) / centerX) * 9; // Left/right tilt
              const rotateX = ((centerY - y) / centerY) * 9; // Up/down tilt
              setPhotoTilt({ rotateX, rotateY });
            }}
            onMouseLeave={() => setPhotoTilt({ rotateX: 0, rotateY: 0 })}
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#333]/90 shadow-sm z-20 backdrop-blur-sm"></div>
            <div
              className="w-full h-full bg-[#1a1a1a] overflow-hidden shadow-2xl relative transition-all duration-300 ease-out border-4 border-white/20 hover:shadow-[0_0_30px_rgba(139,0,0,0.8),0_0_60px_rgba(139,0,0,0.5)]"
              style={{
                transform: `rotateX(${photoTilt.rotateX}deg) rotateY(${photoTilt.rotateY}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              <img
                src="/krzysztof.jpg"
                alt="Krzysztof"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.style.backgroundColor = '#222' }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-white/10 font-black text-4xl pointer-events-none">KP</div>
            </div>
          </div >

          {/* BECOME WHO YOU ARE */}
          < div className="mt-8 space-y-4 group/become" >
            <h2 className="text-2xl font-serif leading-relaxed text-white/90">
              Become Who You<br /><span className="bg-white text-black px-1 group-hover/become:bg-[#FF4500] group-hover/become:text-white transition-colors duration-300">Are</span>.
            </h2>
            <p className="text-lg text-white/60 font-serif leading-relaxed">
              Who you are is not your fault, but it is your responsibility. A sign of growth is having more tolerance for discomfort but less tolerance for barriers that inhibit love.
            </p>
            <p className="text-lg text-white/60 font-serif leading-relaxed">
              Krzysztof uses his training in <a href="https://www.hakomiaustin.com/people" target="_blank" rel="noopener noreferrer" onMouseEnter={playHoverSound} onMouseLeave={() => setIsHoveringLink(false)} className="text-white/90 hover:text-[#FF4500] underline decoration-[#FF4500] underline-offset-2 transition-colors">Hakomi</a>, <a href="https://www.youtube.com/watch?v=sdAe8-4jnN4" target="_blank" rel="noopener noreferrer" onMouseEnter={playHoverSound} onMouseLeave={() => setIsHoveringLink(false)} className="text-white/90 hover:text-[#FF4500] underline decoration-[#FF4500] underline-offset-2 transition-colors">Internal-Family Systems</a>, <a href="https://vowbjj.com/about-us/" target="_blank" rel="noopener noreferrer" onMouseEnter={playHoverSound} onMouseLeave={() => setIsHoveringLink(false)} className="text-white/90 hover:text-[#FF4500] underline decoration-[#FF4500] underline-offset-2 transition-colors">jiu-jitsu</a>, <a href="https://archive.nytimes.com/www.nytimes.com/library/film/091198limits-film-review.html" target="_blank" rel="noopener noreferrer" onMouseEnter={playHoverSound} onMouseLeave={() => setIsHoveringLink(false)} className="text-white/90 hover:text-[#FF4500] underline decoration-[#FF4500] underline-offset-2 transition-colors">endurance running</a>, <a href="https://www.youtube.com/watch?v=l7TONauJGfc" target="_blank" rel="noopener noreferrer" onMouseEnter={playHoverSound} onMouseLeave={() => setIsHoveringLink(false)} className="text-white/90 hover:text-[#FF4500] underline decoration-[#FF4500] underline-offset-2 transition-colors">Non-Violent Communication</a>, and <a href="https://appamada.org/people" target="_blank" rel="noopener noreferrer" onMouseEnter={playHoverSound} onMouseLeave={() => setIsHoveringLink(false)} className="text-white/90 hover:text-[#FF4500] underline decoration-[#FF4500] underline-offset-2 transition-colors">Zen</a> as a way of <a href="https://www.youtube.com/watch?v=19fTvhfh7Lw" target="_blank" rel="noopener noreferrer" onMouseEnter={playHoverSound} onMouseLeave={() => setIsHoveringLink(false)} className="text-white/90 hover:text-[#FF4500] underline decoration-[#FF4500] underline-offset-2 transition-colors">seeing through our habits</a> and moving into freedom.
            </p>
            <p className="text-lg text-[#FF4500] font-bold font-serif">
              Let's explore!
            </p>
          </div >

          {/* CUSTOMER TESTIMONIALS */}
          < div className="mt-12 space-y-6" >
            <h4 className="font-mono text-xs tracking-widest opacity-40 uppercase">What Others Say</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ perspective: '1000px' }}>
              <div
                className="col-span-1 md:col-span-2 border border-white/20 p-8 md:p-10 bg-white/5 hover:bg-white/10 hover:border-[#FF4500] hover:shadow-[0_0_30px_rgba(255,69,0,0.3)] transition-all duration-300 cursor-pointer group/testimonial"
                style={{ transformStyle: 'preserve-3d' }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const rotateY = ((x - rect.width / 2) / rect.width) * 4;
                  const rotateX = ((rect.height / 2 - y) / rect.height) * 4;
                  e.currentTarget.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotateX(0) rotateY(0)'; }}
              >
                <div className="relative">
                  <span className="absolute -top-4 -left-2 text-6xl text-white/10 font-serif">“</span>
                  <p className="text-white/80 font-serif italic leading-relaxed text-[15px] relative z-10">
                    Krzysztof Piekarski offers a unique brand of personal consulting. He combines deep philosophical knowledge, psychological sophistication and Zen-infused guidance to help solve problems. He articulates his thoughts with empathy and extreme precision. He is warm and humorous and an excellent listener. Krzysztof’s guidance includes suggestions for reading and watching material that range from YouTube clips to Dylan lyrics to classic literature. He has a unique ability to flow with the process and help one intelligently struggle through a problem in dynamic, interesting and even entertaining ways. For example, in my experience he has suggested essays by Camus, interviews with noted philosophers, and an episode of a cooking show that all contained bits of wisdom which were strikingly relevant to issues I was facing. If you’re seeking clarity, or just more effective ways of navigating the complexities I strongly recommend working with him. This is not the run-of-the-mill therapist spitting back empty cliches or throwing questions back at you, “well, what do you  think?”  To work with Krzysztof is to engage in real conversations about critical questions  with a great mind and truly unique personality and vision of life.
                  </p>
                  <span className="absolute -bottom-8 right-0 text-6xl text-white/10 font-serif">”</span>
                </div>
                <div className="mt-8 flex flex-col items-end border-t border-white/10 pt-4">
                  <p className="text-xl text-[#FF4500] font-black font-serif">— Daniel Joshua Rubin</p>
                  <p className="text-xs text-white/50 font-mono uppercase tracking-widest mt-1">Author, 27 Essential Principles of Story</p>
                </div>
              </div>
              <div
                className="border border-white/20 p-6 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const rotateY = ((x - rect.width / 2) / rect.width) * 8;
                  const rotateX = ((rect.height / 2 - y) / rect.height) * 8;
                  e.currentTarget.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotateX(0) rotateY(0)'; }}
              >
                <p className="text-white/80 font-serif italic">"I came for productivity tips. I left questioning the nature of my existence. Worth it?"</p>
                <p className="mt-4 text-sm text-[#FF4500] font-bold">— Alex R.</p>
              </div>
              <div
                className="border border-white/20 p-6 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const rotateY = ((x - rect.width / 2) / rect.width) * 8;
                  const rotateX = ((rect.height / 2 - y) / rect.height) * 8;
                  e.currentTarget.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotateX(0) rotateY(0)'; }}
              >
                <p className="text-white/80 font-serif italic">"Working with Krzysztof helped me break through years of mental barriers in just weeks."</p>
                <p className="mt-4 text-sm text-[#FF4500] font-bold">— Marcus T.</p>
              </div>
              <div
                className="border border-white/20 p-6 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const rotateY = ((x - rect.width / 2) / rect.width) * 8;
                  const rotateX = ((rect.height / 2 - y) / rect.height) * 8;
                  e.currentTarget.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotateX(0) rotateY(0)'; }}
              >
                <p className="text-white/80 font-serif italic">"I finally stopped making excuses and started living. Best investment I ever made."</p>
                <p className="mt-4 text-sm text-[#FF4500] font-bold">— Jennifer K.</p>
              </div>
              <div
                className="border border-white/20 p-6 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const rotateY = ((x - rect.width / 2) / rect.width) * 8;
                  const rotateX = ((rect.height / 2 - y) / rect.height) * 8;
                  e.currentTarget.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotateX(0) rotateY(0)'; }}
              >
                <p className="text-white/80 font-serif italic">"He made me stare into the abyss. The abyss blinked first. 4 stars."</p>
                <p className="mt-4 text-sm text-[#FF4500] font-bold">— Friedrich N.</p>
              </div>
              <div
                className="border border-white/20 p-6 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const rotateY = ((x - rect.width / 2) / rect.width) * 8;
                  const rotateX = ((rect.height / 2 - y) / rect.height) * 8;
                  e.currentTarget.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotateX(0) rotateY(0)'; }}
              >
                <p className="text-white/80 font-serif italic">"The conversations we had completely changed how I see my own potential."</p>
                <p className="mt-4 text-sm text-[#FF4500] font-bold">— Sarah M.</p>
              </div>
              <div
                className="border border-white/20 p-6 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const rotateY = ((x - rect.width / 2) / rect.width) * 8;
                  const rotateX = ((rect.height / 2 - y) / rect.height) * 8;
                  e.currentTarget.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotateX(0) rotateY(0)'; }}
              >
                <p className="text-white/80 font-serif italic">"Amor fati? More like amor Krzysztof. I now love my fate of paying for a life coach."</p>
                <p className="mt-4 text-sm text-[#FF4500] font-bold">— Emma W.</p>
              </div>
              <div
                className="border border-white/20 p-6 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const rotateY = ((x - rect.width / 2) / rect.width) * 8;
                  const rotateX = ((rect.height / 2 - y) / rect.height) * 8;
                  e.currentTarget.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotateX(0) rotateY(0)'; }}
              >
                <p className="text-white/80 font-serif italic">"I made the leap of faith. Landed on my face. Got back up. 10/10 would existentially commit again."</p>
                <p className="mt-4 text-sm text-[#FF4500] font-bold">— Søren K.</p>
              </div>
            </div>
          </div >

          {/* HIRE ME - Below Testimonials */}
          < a
            href="mailto:krzyspiekarski@gmail.com"
            onMouseEnter={playHoverSound}
            onMouseLeave={() => setIsHoveringLink(false)}
            className="mt-8 inline-flex items-center gap-3 border-b-4 border-white/60 pb-2 hover:border-[#FF4500] hover:pb-4 transition-all font-black text-xl tracking-widest text-white hover:text-[#FF4500]"
            style={{ fontFamily: "'Permanent Marker', cursive" }}
          >
            HIRE ME AS YOUR CONSULTANT < span className="animate-pulse text-2xl scale-105 text-[#FF4500] drop-shadow-[0_0_15px_rgba(255,100,0,1),0_0_30px_rgba(255,69,0,0.6)]" >↓</span >
          </a >

          {/* Contact Form */}
          < form
            className="mt-12 w-full max-w-md space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setFormStatus('sending');

              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);

              try {
                const response = await fetch('https://formspree.io/f/xojvrqwe', {
                  method: 'POST',
                  body: formData,
                  headers: {
                    'Accept': 'application/json'
                  }
                });

                if (response.ok) {
                  setFormStatus('success');
                  form.reset();
                } else {
                  setFormStatus('error');
                }
              } catch {
                setFormStatus('error');
              }
            }}
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              disabled={formStatus === 'sending'}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white placeholder-white/40 focus:border-[#FF4500] focus:outline-none transition-colors font-mono disabled:opacity-50"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              disabled={formStatus === 'sending'}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white placeholder-white/40 focus:border-[#FF4500] focus:outline-none transition-colors font-mono disabled:opacity-50"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={10}
              required
              disabled={formStatus === 'sending'}
              defaultValue={`Krzysztof,

I can see amazing things happening in collaboration with you. Let me tell you what I mean more specifically.

I am...`}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white placeholder-white/40 focus:border-[#FF4500] focus:outline-none transition-colors font-mono resize-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={formStatus === 'sending'}
              onMouseEnter={playHoverSound}
              className={`w-full px-6 py-3 font-black tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${formStatus === 'success'
                ? 'bg-green-500 text-white'
                : formStatus === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-black hover:bg-[#FF4500] hover:text-white hover:shadow-[0_0_30px_rgba(255,69,0,0.8)]'
                }`}
              style={{ fontFamily: "'Permanent Marker', cursive" }}
            >
              {formStatus === 'sending' ? 'SENDING...' :
                formStatus === 'success' ? '✓ MESSAGE SENT!' :
                  formStatus === 'error' ? 'ERROR - TRY AGAIN' :
                    'SEND MESSAGE'}
            </button>
            {
              formStatus === 'success' && (
                <div className="mt-6 p-6 border border-[#FF4500]/30 bg-[#FF4500]/5 animate-pulse">
                  <p
                    className="text-[#FF4500] text-center font-mono text-sm italic leading-relaxed"
                    style={{
                      textShadow: '0 0 10px rgba(255,69,0,0.6), 0 0 20px rgba(255,69,0,0.4), 0 0 30px rgba(255,69,0,0.2)'
                    }}
                  >
                    &quot;To give style to one&apos;s character—that is a grand and rare art! He who surveys all that his nature presents in its strength and in its weakness, and then fashions it into an ingenious plan, until everything appears artistic and rational, and even the weaknesses enchant the eye...exercises that admirable art.&quot;
                  </p>
                </div>
              )
            }
            {
              formStatus === 'error' && (
                <p className="text-red-400 text-center font-mono text-sm">Something went wrong. Please try again or email directly.</p>
              )
            }

            {/* Footer Contact */}
            <div className="w-full font-mono text-sm text-white/50 mt-16 flex justify-center items-center">
              <a href="mailto:monkey@wallstreetwildlife.com"
                onMouseEnter={playHoverSound}
                onMouseLeave={() => setIsHoveringLink(false)}
                className="flex items-center gap-2 hover:text-[#39FF14] transition-colors">
                <Mail size={14} /> monkey@wallstreetwildlife.com
              </a>
            </div>
          </form >


        </div >

        {/* --- RIGHT COLUMN: THE WORK --- */}
        < div className="md:col-span-7 flex flex-col bg-[#0a0a0a]" >

          {/* INTRO / MANIFESTO */}
          < div className="p-12 md:p-24 relative min-h-[400px]" >
            {/* Physics Text */}
            < div id="manifesto-wrapper" style={{ opacity: isSmashing ? 0 : 1, transition: 'opacity 0.1s' }}>
              <h2
                className="text-3xl font-serif leading-relaxed text-white/90 relative inline-block cursor-pointer group"
                onMouseEnter={(e) => { spawnSparks(e); playHoverSound(); }}
              >
                "<span className="relative inline-block group/philohead">
                  <span className="relative z-10 transition-colors duration-700 group-hover/philohead:text-[#FF4500]">Philosophy</span>
                  <span className="absolute inset-0 bg-[#FF4500]/20 scale-x-0 origin-left group-hover/philohead:scale-x-100 transition-transform duration-700 ease-out rounded" />
                </span> with a <span
                  onClick={triggerHammerBreak}
                  className="inline-block bg-white text-black px-1 underline decoration-[#FF4500] decoration-4 underline-offset-2 hover:bg-[#FF4500] hover:text-white hover:decoration-white hover:scale-110 hover:rotate-6 transition-all duration-100 cursor-pointer border-2 border-black"
                >Hammer</span>."
              </h2>
              <p className="mt-6 text-lg text-white/60 font-serif max-w-lg group/indiv">
                I use the <span className="inline-block hover:text-[#FF4500] hover:animate-[shake_1.5s_ease-in-out_infinite] transition-colors duration-200 cursor-pointer">hammer</span> of <span className="relative inline-block cursor-pointer group/philo">
                  <span className="relative z-10 transition-colors duration-700 group-hover/philo:text-[#FF4500]">philosophy</span>
                  <span className="absolute inset-0 bg-[#FF4500]/20 scale-x-0 origin-left group-hover/philo:scale-x-100 transition-transform duration-700 ease-out rounded" />
                </span> to dismantle the narratives that confine us. Blending the precision of a strategist with the depth of the humanities, I help <span className="cursor-pointer group-hover/indiv:line-through group-hover/indiv:opacity-50 transition-all duration-300">individuals</span><span className="inline-block overflow-hidden max-w-0 group-hover/indiv:max-w-[6rem] transition-all duration-500 text-3xl text-red-500 font-black align-middle drop-shadow-[0_0_15px_rgba(255,0,0,1),0_0_30px_rgba(255,50,0,0.7)]"> YOU</span> shatter their old patterns and reinvent the architecture of who they are.
              </p>
            </div >

            {/* Physics Canvas */}
            < canvas ref={physicsCanvasRef} className="absolute inset-0 pointer-events-none z-20" />

            {/* Hidden Quote Reveal */}
            < div
              className={`absolute top-0 left-0 w-full h-full flex items-center justify-center p-12 transition-all duration-1000 ${isQuoteRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}
            >
              <div className="bg-[#0a0a0a]/90 backdrop-blur-md p-8 border-l-4 border-[#FF4500]">
                <p className="text-xl md:text-2xl font-serif text-[#e0e0e0] italic leading-relaxed">
                  "To <span className="text-[#FF4500] font-bold">give style</span> to one's character – that is a grand and a rare art! He who surveys all that his nature presents in its strength and in its weakness... and then fashions it into an ingenious plan... he exercises that admirable art."
                </p>
                <p className="mt-4 text-sm text-[#FF4500] font-bold tracking-widest uppercase">— Friedrich Nietzsche, The Gay Science</p>
                <button
                  onClick={() => {
                    setIsSmashing(false);
                    setIsQuoteRevealed(false);
                    // Clear canvas
                    const canvas = physicsCanvasRef.current;
                    if (canvas) {
                      const ctx = canvas.getContext('2d');
                      ctx?.clearRect(0, 0, canvas.width, canvas.height);
                    }
                  }}
                  className="mt-6 text-xs border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors uppercase tracking-widest"
                >
                  Rebuild
                </button>
              </div>
            </div >
          </div >

          {/* PROJECT STACK - GRIT STYLE */}
          < div className="flex-1 flex flex-col px-4 md:px-8 py-12 space-y-32" >

            {/* PROJECT B: FIRE PHILOSOPHY */}
            < a href="https://firephilosophy.substack.com" target="_blank" rel="noopener noreferrer" className="block relative group/philosophy transition-transform duration-300 hover:rotate-[-0.45deg]" style={{ transform: `rotate(${scrollY * 0.0001}deg)` }}>
              {/* Tape strip - dark grey, off-center */}
              < div className="absolute -top-4 left-[25%] -translate-x-1/2 w-32 h-8 bg-[#333]/90 shadow-sm z-30 backdrop-blur-sm" />

              {/* No torn edge overlay - border removed */}

              {/* Sketchy X marks */}
              <div className="absolute top-4 right-4 text-4xl text-black/20 font-black z-20">✕</div>
              <div className="absolute bottom-4 left-4 text-2xl text-black/20 font-black z-20 rotate-12">✕</div>

              <div
                className="relative z-10 bg-[#0a0a0a] m-2 p-8 md:p-12 transition-all duration-150 cursor-pointer overflow-hidden"
                onMouseEnter={playHoverSound}
                onMouseLeave={() => setIsHoveringLink(false)}
              >
                {/* Buddhist Socrates image - invisible until hover, soft fading edges */}
                <img
                  src="/BuddhaSocrates.png"
                  alt="Buddhist Socrates"
                  className="absolute right-0 bottom-0 h-full w-auto opacity-0 scale-[0.8] group-hover/philosophy:opacity-80 group-hover/philosophy:scale-100 transition-all duration-500 object-contain origin-bottom-right"
                  style={{
                    maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
                    maskComposite: 'intersect',
                    WebkitMaskComposite: 'source-in'
                  }}
                />
                <span className="text-xs tracking-[0.3em] text-white/40 block mb-2 relative z-10" style={{ fontFamily: "'Permanent Marker', cursive" }}>[ SUBSTACK ]</span>
                <h3 className="text-5xl md:text-6xl text-white relative z-10" style={{ fontFamily: "'Permanent Marker', cursive" }}>
                  FIRE<br />PHILOSOPHY
                </h3>
                <p className="mt-4 text-white/50 font-mono text-sm relative z-10">
                  Zen, Nietzsche, and how to live.
                </p>
                <div
                  className="mt-6 inline-block bg-white text-black px-8 py-4 text-xl font-black hover:bg-[#FF4500] hover:text-white hover:scale-110 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(255,69,0,0.8),0_0_60px_rgba(255,69,0,0.5)] border-2 border-black relative z-10"
                  style={{ fontFamily: "'Permanent Marker', cursive" }}
                >
                  READ NOW
                </div>
              </div>
            </a >

            {/* PROJECT C: YOU NEED FIRE */}
            < a href="https://dynamic-queijadas-19a9ad.netlify.app/" target="_blank" rel="noopener noreferrer" className="block relative group/fire transition-transform duration-300 hover:rotate-[3deg]" style={{ transform: `rotate(${-3 + scrollY * 0.001}deg)` }}>
              {/* Tape strip - dark grey, off-center */}
              < div className="absolute -top-4 left-[70%] -translate-x-1/2 w-32 h-8 bg-[#333]/90 shadow-sm z-30 backdrop-blur-sm" />

              {/* Background - no outer border */}

              < div
                className="relative z-10 bg-black m-3 p-8 md:p-12 transition-all duration-300 cursor-pointer group-hover/fire:shadow-[0_0_40px_rgba(255,100,0,0.8),0_0_80px_rgba(255,69,0,0.5),0_0_120px_rgba(255,140,0,0.3)]"
                onMouseEnter={playHoverSound}
                onMouseLeave={() => setIsHoveringLink(false)}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/fire:opacity-100 transition-opacity duration-300 pointer-events-none pl-[20%]">
                  <img
                    src="/fire.gif"
                    alt="Fire"
                    className="w-[106px] h-[106px] object-contain"
                    style={{
                      maskImage: 'radial-gradient(circle, black 40%, transparent 70%)',
                      WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 70%)'
                    }}
                  />
                  <span className="text-4xl text-white font-bold tracking-widest mt-8" style={{ fontFamily: "'Permanent Marker', cursive" }}>Memento Mori</span>
                </div>
                <span className="text-xs tracking-[0.3em] text-white/40 block mb-2" style={{ fontFamily: "'Permanent Marker', cursive" }}>[ EXPERIENCE ]</span>
                <h3 className="text-4xl md:text-5xl text-white" style={{ fontFamily: "'Permanent Marker', cursive" }}>
                  YOU NEED FIRE<br />IN YOUR LIFE
                </h3>
                <p className="mt-4 text-white/50 font-mono text-sm max-w-xs">
                  An interactive journey into transformation and passion.
                </p>
                <div className="mt-6 inline-block bg-white text-black px-8 py-4 text-xl font-black hover:bg-[#FF4500] hover:text-white hover:scale-110 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(255,69,0,0.8),0_0_60px_rgba(255,69,0,0.5)] border-2 border-black" style={{ fontFamily: "'Permanent Marker', cursive" }}>
                  ENTER THE FIRE
                </div>
              </div >
            </a >

            {/* PROJECT A: WALL STREET WILDLIFE */}
            < div className="relative transition-transform duration-300 hover:rotate-[-0.45deg]" style={{ transform: `rotate(${scrollY * 0.0001}deg)` }}>
              {/* Tape strip - dark grey, off-center - outside overflow container */}
              < div className="absolute -top-4 left-[30%] -translate-x-1/2 w-32 h-8 bg-[#333]/90 shadow-sm z-40 backdrop-blur-sm" />

              <div className="relative group/finance overflow-hidden">
                {/* Rough paper background */}
                <div className="absolute inset-0 bg-[#f5f5dc] z-0 rotate-1 scale-[1.03] shadow-2xl" style={{ clipPath: 'polygon(0% 2%, 3% 0%, 97% 1%, 100% 3%, 99% 97%, 97% 100%, 3% 99%, 0% 97%)' }} />

                {/* Content */}
                <div
                  className="relative z-10 bg-[#0a0a0a] p-8 md:p-12 transition-all duration-300"
                >
                  {/* Background image that appears on hover - fuzzy edges */}
                  <div
                    className="absolute inset-0 bg-center bg-no-repeat opacity-0 group-hover/finance:opacity-100 transition-opacity duration-300"
                    style={{
                      backgroundImage: "url('/WSW.jpeg')",
                      backgroundSize: '80%',
                      maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 80%)',
                      WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 80%)'
                    }}
                  />
                  {/* Dark overlay for readability */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/finance:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <div className="relative">
                      <div>
                        <span className="text-xs tracking-[0.3em] text-white/40 group-hover/finance:text-white/70 block mb-2 transition-colors" style={{ fontFamily: "'Permanent Marker', cursive" }}>[ PODCAST ]</span>
                        <h3 className="text-4xl md:text-6xl leading-[0.9] text-white" style={{ fontFamily: "'Permanent Marker', cursive" }}>
                          WALL STREET<br />WILDLIFE
                        </h3>
                      </div>
                      {/* Monkey avatar - links to Patreon - 25% larger (w-56 h-56) */}
                      <a
                        href="https://www.patreon.com/wallstreetwildlife"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-[10%] top-[65%] -translate-y-1/4 w-56 h-56 bg-white rounded-full overflow-hidden rotate-[5deg] border-4 border-black shadow-xl grayscale hover:grayscale-0 hover:scale-110 transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => { spawnBananas(); playHoverSound(); }}
                      >
                        <img
                          src="/monkey.png"
                          className="w-full h-full object-cover"
                          alt="Wall Street Wildlife Monkey"
                        />
                        {/* Dark vignette overlay */}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.7) 100%)'
                          }}
                        />
                        {/* Banana rain contained within avatar */}
                        {bananas.map(banana => (
                          <div
                            key={banana.id}
                            className="absolute pointer-events-none z-10 animate-banana-fall text-lg"
                            style={{
                              left: `calc(50% + ${banana.x}px)`,
                              top: `calc(30% + ${banana.y}px)`,
                              animationDelay: `${banana.delay}ms`,
                            }}
                          >
                            🍌
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
                        onMouseLeave={() => setIsHoveringLink(false)}
                        className="inline-block bg-white text-black px-6 py-3 text-lg font-black rotate-[-2deg] hover:bg-[#006400] hover:text-white hover:scale-110 hover:rotate-0 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[0_0_36px_rgba(0,100,0,0.85),0_0_72px_rgba(0,100,0,0.55)] border-2 border-black"
                        style={{ fontFamily: "'Permanent Marker', cursive" }}
                      >
                        LISTEN
                      </a>
                      <a
                        href="https://www.youtube.com/@WallStreetWildlife"
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={playHoverSound}
                        onMouseLeave={() => setIsHoveringLink(false)}
                        className="inline-block bg-white text-black px-6 py-3 text-lg font-black rotate-[2deg] hover:bg-[#FF0000] hover:text-white hover:scale-110 hover:rotate-0 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[0_0_36px_rgba(255,0,0,0.85),0_0_72px_rgba(255,0,0,0.55)] border-2 border-black"
                        style={{ fontFamily: "'Permanent Marker', cursive" }}
                      >
                        WATCH
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div >

            {/* PROJECT A2: OPTIONS TRAINING */}
            < a href="https://wswoptions3.netlify.app" target="_blank" rel="noopener noreferrer" className="block relative group/options overflow-hidden transition-transform duration-300 hover:rotate-[0.45deg]" style={{ transform: `rotate(${scrollY * 0.0001}deg)` }}>
              {/* Tape strip - dark grey, off-center */}
              < div className="absolute -top-4 left-[65%] -translate-x-1/2 w-32 h-8 bg-[#333]/90 shadow-sm z-30 backdrop-blur-sm" />

              {/* Paper */}
              < div className="absolute inset-0 bg-[#1a1a1a] z-0 rotate-[-1deg] scale-[1.02] shadow-2xl" style={{ clipPath: 'polygon(1% 0%, 99% 2%, 100% 98%, 2% 100%)' }} />

              < div
                className="relative z-10 bg-[#0a0a0a] p-8 md:p-12 transition-all duration-300 cursor-pointer"
                onMouseEnter={playHoverSound}
                onMouseLeave={() => setIsHoveringLink(false)}
              >
                {/* Background image that appears on hover */}
                < div
                  className="absolute inset-0 bg-cover bg-center opacity-0 group-hover/options:opacity-100 transition-opacity duration-300"
                  style={{ backgroundImage: "url('/OptionsGreeks.png')" }}
                />
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/options:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <span className="text-xs tracking-[0.3em] text-white/40 group-hover/options:text-white/70 block mb-2 transition-colors" style={{ fontFamily: "'Permanent Marker', cursive" }}>[ COURSE ]</span>
                  <h3 className="text-4xl md:text-5xl text-white group-hover/options:text-white" style={{ fontFamily: "'Permanent Marker', cursive" }}>
                    OPTIONS<br />MASTERY
                  </h3>
                  <div className="mt-3 flex gap-2">
                    <span className="bg-white/20 group-hover/options:bg-[#8B5CF6] text-white text-xs px-2 py-0.5 transition-colors">LEARN</span>
                    <span className="bg-white/20 group-hover/options:bg-[#8B5CF6] text-white text-xs px-2 py-0.5 transition-colors">TRADE</span>
                    <span className="bg-white/20 group-hover/options:bg-[#8B5CF6] text-white text-xs px-2 py-0.5 transition-colors">PROFIT</span>
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
              </div >
            </a >

          </div >

          {/* --- READING LIST BOOKSHELF --- */}
          <Bookshelf />

          {/* FEATURED VIDEO */}
          <div className="p-12 md:p-16 bg-[#0a0a0a]">
            <div className="max-w-4xl mx-auto">
              <div className="relative w-full aspect-video rounded-sm overflow-hidden border-2 border-[#FF4500]/30 shadow-[0_0_30px_rgba(255,69,0,0.15)]">
                <iframe
                  src="https://www.youtube.com/embed/piMODx-_KYk"
                  title="YouTube video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              {/* Lyrics */}
              <div className="mt-10 text-center">
                <p className="text-white/70 font-serif text-lg md:text-xl leading-relaxed italic max-w-2xl mx-auto">
                  Seen a man standin&apos; over a dead dog<br />
                  By the highway in a ditch<br />
                  He&apos;s lookin&apos; down kinda puzzled<br />
                  Pokin&apos; that dog with a stick<br />
                  Got his car door flung open<br />
                  He&apos;s standin&apos; out on Highway 31<br />
                  Like if he stood there long enough<br />
                  That dog&apos;d get up and run<br />
                  Struck me kinda funny<br />
                  Seemed kinda funny sir to me<br />
                  Still at the end of every hard day<br />
                  <span className="text-[#FF4500] font-semibold not-italic">People find some reason to believe</span>
                </p>
              </div>
            </div>
          </div>

          {/* COLLABORATORS */}
          < div className="p-12 md:p-16 bg-[#0a0a0a] text-white/70" >
            <h4 className="font-mono text-xs tracking-widest opacity-40 mb-8 uppercase">Collaborators & Partners</h4>
            <div className="flex gap-8 flex-wrap">
              <a href="https://x.com/7LukeHallard" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group cursor-pointer"
                onMouseEnter={playHoverSound}
                onMouseLeave={() => setIsHoveringLink(false)}>
                <div className="w-[166px] h-[166px] rounded-full overflow-hidden grayscale group-hover:grayscale-0 transition-all border border-white/20 group-hover:border-[#006400] group-hover:shadow-[0_0_45px_5px_#006400] group-active:shadow-[0_0_60px_10px_#006400] duration-300">
                  <img src="/badger.png" alt="Luke Badger Hallard" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold uppercase text-sm text-white">Luke "Badger" Hallard</p>
                  <p className="text-xs font-mono opacity-60">The Badger</p>
                </div>
              </a>
              <div className="flex items-center gap-4 group cursor-pointer"
                onMouseEnter={playHoverSound}
                onMouseLeave={() => setIsHoveringLink(false)}>
                <div className="w-[166px] h-[166px] rounded-full overflow-hidden grayscale group-hover:grayscale-0 transition-all border border-white/20 relative group-hover:border-[#9d00ff] group-hover:shadow-[0_0_30px_#9d00ff] group-active:shadow-[0_0_50px_#9d00ff] duration-300">
                  <img src="/bunk.jpg" alt="Bunk" className="w-full h-full object-cover" />
                  <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black text-[10px] font-black px-1 border border-black transform rotate-12">
                    CEO
                  </div>
                </div>
                <div>
                  <p className="font-bold uppercase text-sm text-white">Bunk</p>
                  <p className="text-xs font-mono opacity-60">Chief Morale</p>
                </div>
              </div>
            </div>
          </div >



        </div >
        {/* --- ORACLE TERMINAL OVERLAY --- */}
        {oracleOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setOracleOpen(false)}>
            <div
              className="w-full max-w-2xl h-[400px] bg-black border-2 border-[#00FF00] shadow-[0_0_50px_rgba(0,255,0,0.2)] p-6 font-mono text-[#00FF00] overflow-hidden flex flex-col relative"
              onClick={e => e.stopPropagation()}
            >
              {/* Scanline Effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-10 opacity-60"></div>

              <div className="flex justify-between items-center border-b border-[#00FF00]/30 pb-2 mb-4">
                <span>TERMINAL_ACCESS_V1.0</span>
                <button onClick={() => setOracleOpen(false)} className="hover:bg-[#00FF00] hover:text-black px-2">[CLOSE]</button>
              </div>

              <div className="flex-1 overflow-y-auto mb-4 custom-scrollbar">
                {terminalHistory.map((line, i) => (
                  <div key={i} className={`mb-1 whitespace-pre-wrap ${line.type === 'input' ? 'text-white/70' : 'text-[#00FF00]'}`}>
                    {line.type === 'input' ? '> ' : ''}{line.text}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              <form onSubmit={handleCommand} className="flex gap-2 relative z-20">
                <span className="text-[#00FF00] animate-pulse">{'>'}</span>
                <input
                  ref={terminalInputRef}
                  type="text"
                  value={terminalInput}
                  onChange={e => setTerminalInput(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-[#00FF00] font-mono uppercase"
                  autoFocus
                  spellCheck={false}
                />
              </form>
            </div>
          </div>
        )}

        {/* --- UNLOCK MODAL --- */}

      </main >

      {/* --- MEMENTO MORI TICKER --- */}
      <div className={`fixed bottom-0 left-0 w-full bg-black border-t border-white/20 z-40 overflow-hidden py-2 select-none pointer-events-none transition-all duration-500 transform ${isBottom ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
        <div className="whitespace-nowrap animate-marquee flex gap-8 text-xs font-mono tracking-widest text-[#00FF00]">
          <span className="opacity-70">ENTROPY: <span className="text-red-500">▲ RISING</span></span>
          <span className="opacity-40">|</span>
          <span className="opacity-70">TIME_LEFT: <span className="text-red-500">▼ 2,143 WEEKS</span></span>
          <span className="opacity-40">|</span>
          <span className="opacity-70">EGO: <span className="text-green-500">▼ CRASHING</span></span>
          <span className="opacity-40">|</span>
          <span className="opacity-70">POTENTIAL: <span className="text-green-500">▲ UNTAPPED</span></span>
          <span className="opacity-40">|</span>
          <span className="opacity-70">MEMENTO MORI: <span className="text-white animate-pulse">ACTIVE</span></span>
          <span className="opacity-40">|</span>
          {/* Duplicate for seamless loop */}
          <span className="opacity-70">ENTROPY: <span className="text-red-500">▲ RISING</span></span>
          <span className="opacity-40">|</span>
          <span className="opacity-70">TIME_LEFT: <span className="text-red-500">▼ 2,143 WEEKS</span></span>
          <span className="opacity-40">|</span>
          <span className="opacity-70">EGO: <span className="text-green-500">▼ CRASHING</span></span>
          <span className="opacity-40">|</span>
          <span className="opacity-70">POTENTIAL: <span className="text-green-500">▲ UNTAPPED</span></span>
          <span className="opacity-40">|</span>
          <span className="opacity-70">MEMENTO MORI: <span className="text-white animate-pulse">ACTIVE</span></span>
        </div>
      </div>

      {/* --- CSS INJECTION --- */}
      < style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes jitter {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(1deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-1deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-marquee {
          animation: marquee 10s linear infinite;
        }
        .animate-jitter {
          animation: jitter 0.2s steps(2) infinite paused;
        }
        .group:hover .animate-jitter {
          animation-play-state: running;
        }
        .animate-float-jitter {
           animation: jitter 3s steps(10) infinite alternate;
        }
        @keyframes spark {
          0% { 
            opacity: 1; 
            transform: translate(0, 0) scale(1); 
          }
          100% { 
            opacity: 0; 
            transform: translate(var(--tx, 30px), var(--ty, -50px)) scale(0); 
          }
        }
        .animate-spark {
          animation: spark 0.8s ease-out forwards;
        }
        @keyframes shake {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-1px) rotate(-0.5deg); }
          50% { transform: translateY(1px) rotate(0.5deg); }
          75% { transform: translateY(-1px) rotate(-0.5deg); }
        }
        @keyframes banana-fall {
          0% { 
            opacity: 1; 
            transform: translateY(0) rotate(0deg); 
          }
          100% { 
            opacity: 0; 
            transform: translateY(100px) rotate(360deg); 
          }
        }
        .animate-banana-fall {
          animation: banana-fall 1.5s ease-in forwards;
        }
      `}
      } />
    </div >
  );
}
