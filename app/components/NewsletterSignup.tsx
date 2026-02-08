'use client';

import React, { useState } from 'react';
import { ArrowRight, Check, BookOpen } from 'lucide-react';

interface NewsletterSignupProps {
  playHoverSound?: () => void;
}

export default function NewsletterSignup({ playHoverSound }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    // Redirect to Substack with pre-filled email
    window.open(`https://firephilosophy.substack.com/subscribe?email=${encodeURIComponent(email)}`, '_blank');
    setStatus('success');
    setEmail('');

    // Reset after 3 seconds
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div className="border-2 border-[#FF4500]/30 bg-gradient-to-br from-[#FF4500]/10 via-[#0a0a0a] to-[#39FF14]/5 p-6 md:p-8 relative overflow-hidden">
      {/* Decorative corner marks */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#FF4500]/40" aria-hidden="true" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#FF4500]/40" aria-hidden="true" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#FF4500]/40" aria-hidden="true" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#FF4500]/40" aria-hidden="true" />

      {/* Lead Magnet Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="hidden sm:flex w-14 h-14 bg-[#FF4500]/20 border border-[#FF4500]/30 items-center justify-center flex-shrink-0 rotate-[-3deg]">
          <BookOpen className="text-[#FF4500]" size={26} />
        </div>
        <div>
          <span className="text-xs font-mono text-[#FF4500] tracking-widest uppercase block mb-1">Free Guide</span>
          <h3
            className="text-white font-bold text-xl leading-tight"
            style={{ fontFamily: "'Permanent Marker', cursive" }}
          >
            5 PHILOSOPHICAL PRINCIPLES
            <br />
            THAT CHANGED MY TRADING
          </h3>
        </div>
      </div>

      {/* Principle Teasers */}
      <div className="space-y-2 mb-6 ml-0 sm:ml-[72px]">
        <div className="flex items-center gap-2 text-white/60 text-sm font-serif">
          <span className="text-[#FF4500] font-mono text-xs w-5 flex-shrink-0">01</span>
          Why Nietzsche's amor fati makes you a better risk manager
        </div>
        <div className="flex items-center gap-2 text-white/60 text-sm font-serif">
          <span className="text-[#39FF14] font-mono text-xs w-5 flex-shrink-0">02</span>
          The Zen principle that eliminates revenge trading
        </div>
        <div className="flex items-center gap-2 text-white/40 text-sm font-serif italic">
          <span className="text-white/20 font-mono text-xs w-5 flex-shrink-0">...</span>
          + 3 more principles inside
        </div>
      </div>

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 ml-0 sm:ml-[72px]">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={status === 'loading' || status === 'success'}
          className="flex-1 px-4 py-3 bg-white/5 border border-white/20 text-white placeholder-white/40 focus:border-[#FF4500] focus:outline-none transition-colors font-mono text-sm disabled:opacity-50"
          required
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          onMouseEnter={playHoverSound}
          className={`px-6 py-3 font-bold text-sm tracking-wider transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed whitespace-nowrap ${
            status === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-[#FF4500] text-white hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,69,0,0.6)]'
          }`}
          style={{ fontFamily: "'Permanent Marker', cursive" }}
        >
          {status === 'loading' ? (
            'Sending...'
          ) : status === 'success' ? (
            <>
              <Check size={18} />
              Check your inbox!
            </>
          ) : (
            <>
              GET THE FREE GUIDE
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <p className="text-white/30 text-xs font-mono mt-3 ml-0 sm:ml-[72px]">
        Join Fire Philosophy. No spam, unsubscribe anytime.
      </p>
    </div>
  );
}
