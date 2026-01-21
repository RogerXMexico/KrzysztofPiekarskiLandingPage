'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';

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

    // Simulate API call - replace with actual newsletter service (Substack, ConvertKit, etc.)
    // For now, redirect to Substack
    window.open(`https://firephilosophy.substack.com/subscribe?email=${encodeURIComponent(email)}`, '_blank');
    setStatus('success');
    setEmail('');

    // Reset after 3 seconds
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div className="bg-gradient-to-r from-[#FF4500]/10 to-transparent border-l-4 border-[#FF4500] p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="hidden sm:flex w-12 h-12 bg-[#FF4500]/20 rounded-full items-center justify-center flex-shrink-0">
          <Mail className="text-[#FF4500]" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg mb-1">Get philosophical insights in your inbox</h3>
          <p className="text-white/50 text-sm mb-4">
            Join the Fire Philosophy newsletter. No spam, unsubscribe anytime.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
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
              className={`px-6 py-3 font-bold text-sm tracking-wider transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed ${
                status === 'success'
                  ? 'bg-green-500 text-white'
                  : 'bg-[#FF4500] text-white hover:bg-white hover:text-black'
              }`}
            >
              {status === 'loading' ? (
                'Subscribing...'
              ) : status === 'success' ? (
                <>
                  <Check size={18} />
                  Subscribed!
                </>
              ) : (
                <>
                  Subscribe
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
