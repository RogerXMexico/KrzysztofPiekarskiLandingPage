'use client';

import React, { useState } from 'react';
import { ArrowRight, Check, BookOpen, Download } from 'lucide-react';

interface NewsletterSignupProps {
  playHoverSound?: () => void;
}

export default function NewsletterSignup({ playHoverSound }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const triggerPdfDownload = () => {
    const link = document.createElement('a');
    link.href = '/five-principles-guide.pdf';
    link.download = '5-Philosophical-Principles-That-Changed-My-Trading.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    // Open Substack subscription in background tab
    window.open(`https://firephilosophy.substack.com/subscribe?email=${encodeURIComponent(email)}`, '_blank');

    // Trigger PDF download
    triggerPdfDownload();

    setStatus('success');
    setEmail('');
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
        <div className="flex items-center gap-2 text-white/60 text-sm font-serif">
          <span className="text-[#FF4500] font-mono text-xs w-5 flex-shrink-0">03</span>
          Nietzsche's thought experiment for trade selection
        </div>
        <div className="flex items-center gap-2 text-white/60 text-sm font-serif">
          <span className="text-[#8B5CF6] font-mono text-xs w-5 flex-shrink-0">04</span>
          The paradox of making more by caring less
        </div>
        <div className="flex items-center gap-2 text-white/60 text-sm font-serif">
          <span className="text-[#39FF14] font-mono text-xs w-5 flex-shrink-0">05</span>
          How to hold both sides of every trade
        </div>
      </div>

      {/* Signup Form or Success State */}
      {status === 'success' ? (
        <div className="ml-0 sm:ml-[72px] space-y-4">
          <div className="flex items-center gap-3 text-green-400">
            <Check size={20} />
            <span className="font-bold text-sm">Your guide is downloading!</span>
          </div>
          <p className="text-white/50 text-xs font-mono">
            Check your downloads folder. We also opened Substack so you can subscribe for weekly philosophy & trading insights.
          </p>
          <button
            onClick={triggerPdfDownload}
            onMouseEnter={playHoverSound}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 text-white text-sm font-mono hover:bg-[#FF4500]/20 hover:border-[#FF4500] transition-all duration-200"
          >
            <Download size={16} />
            Download Again
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 ml-0 sm:ml-[72px]">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={status === 'loading'}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/20 text-white placeholder-white/40 focus:border-[#FF4500] focus:outline-none transition-colors font-mono text-sm disabled:opacity-50"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              onMouseEnter={playHoverSound}
              className="px-6 py-3 font-bold text-sm tracking-wider transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed whitespace-nowrap bg-[#FF4500] text-white hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,69,0,0.6)]"
              style={{ fontFamily: "'Permanent Marker', cursive" }}
            >
              {status === 'loading' ? (
                'Sending...'
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
        </>
      )}
    </div>
  );
}
