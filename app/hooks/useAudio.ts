'use client';

import { useRef, useState, useCallback } from 'react';

interface UseAudioReturn {
  audioEnabled: boolean;
  toggleAudio: () => void;
  playHoverSound: () => void;
  playSmashSound: () => void;
}

export function useAudio(): UseAudioReturn {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const fireSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const toggleAudio = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;

      if (audioEnabled) {
        if (fireSourceRef.current) {
          try {
            fireSourceRef.current.stop();
          } catch (e) { /* ignore */ }
          fireSourceRef.current = null;
        }
        setAudioEnabled(false);
      } else {
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          lastOut = (lastOut + (0.02 * white)) / 1.02;
          lastOut *= 3.5;
          data[i] = lastOut;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.25;

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
  }, [audioEnabled]);

  const playHoverSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

      const bufferSize = audioContext.sampleRate * 0.15;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const burst = Math.random() < 0.02 ? Math.random() * 2 : 0;
        data[i] = (Math.random() * 2 - 1) * (0.3 + burst);
      }

      const noiseSource = audioContext.createBufferSource();
      noiseSource.buffer = buffer;

      const lowpass = audioContext.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 800 + Math.random() * 400;

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
  }, []);

  const playSmashSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const t = audioContext.currentTime;

      // 1. LOW THUD
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

      // 2. CRUNCH/DEBRIS
      const bufferSize = audioContext.sampleRate * 0.5;
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
      noiseFilter.frequency.linearRampToValueAtTime(100, t + 0.4);

      noiseGain.gain.setValueAtTime(0.8, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(audioContext.destination);
      noise.start(t);

      // 3. HIGH SNAP
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
  }, []);

  return { audioEnabled, toggleAudio, playHoverSound, playSmashSound };
}
