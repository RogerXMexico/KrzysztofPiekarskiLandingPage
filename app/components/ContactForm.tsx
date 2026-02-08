'use client';

import React, { useState } from 'react';
import { Mail } from 'lucide-react';

interface ContactFormProps {
  playHoverSound: () => void;
}

export default function ContactForm({ playHoverSound }: ContactFormProps) {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('sending');

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xojvrqwe', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
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
  };

  return (
    <>
      {/* Booking Calendar Placeholder */}
      <div
        id="contact"
        className="mt-8 w-full max-w-md border-2 border-[#FF4500]/40 bg-[#FF4500]/5 p-6 md:p-8"
      >
        <h3
          className="text-2xl text-white mb-2"
          style={{ fontFamily: "'Permanent Marker', cursive" }}
        >
          BOOK A DISCOVERY CALL
        </h3>
        <p className="text-white/50 font-mono text-sm mb-4">
          Free 15-minute call. No obligations. Let's see if we're a fit.
        </p>

        {/* Calendly Embed */}
        <iframe
          src="https://calendly.com/krzyspiekarski/15min?hide_gdpr_banner=1&background_color=0a0a0a&text_color=e0e0e0&primary_color=FF4500"
          width="100%"
          height="700"
          frameBorder="0"
          title="Schedule a 15-minute discovery call with Krzysztof Piekarski"
          className="border border-white/10"
          style={{ minHeight: '700px' }}
        />
      </div>

      <p
        className="mt-6 text-white/40 font-mono text-xs uppercase tracking-widest text-center w-full max-w-md"
      >
        — or send a message —
      </p>

      {/* Contact Form */}
      <form className="mt-4 w-full max-w-md space-y-4" onSubmit={handleSubmit} aria-label="Contact form">
        <div>
          <label htmlFor="name" className="sr-only">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Name"
            required
            disabled={formStatus === 'sending'}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white placeholder-white/40 focus:border-[#FF4500] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4500] transition-colors font-mono disabled:opacity-50"
            aria-required="true"
          />
        </div>
        <div>
          <label htmlFor="email" className="sr-only">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your Email"
            required
            disabled={formStatus === 'sending'}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white placeholder-white/40 focus:border-[#FF4500] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4500] transition-colors font-mono disabled:opacity-50"
            aria-required="true"
          />
        </div>
        <div>
          <label htmlFor="message" className="sr-only">
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Your Message"
            rows={10}
            required
            disabled={formStatus === 'sending'}
            defaultValue={`Krzysztof,

I can see amazing things happening in collaboration with you. Let me tell you what I mean more specifically.

I am...`}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white placeholder-white/40 focus:border-[#FF4500] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4500] transition-colors font-mono resize-none disabled:opacity-50"
            aria-required="true"
          />
        </div>
        <button
          type="submit"
          disabled={formStatus === 'sending'}
          onMouseEnter={playHoverSound}
          className={`w-full px-6 py-3 font-black tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
            formStatus === 'success'
              ? 'bg-green-500 text-white'
              : formStatus === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-white text-black hover:bg-[#FF4500] hover:text-white hover:shadow-[0_0_30px_rgba(255,69,0,0.8)]'
          }`}
          style={{ fontFamily: "'Permanent Marker', cursive" }}
          aria-live="polite"
        >
          {formStatus === 'sending'
            ? 'SENDING...'
            : formStatus === 'success'
            ? '✓ MESSAGE SENT!'
            : formStatus === 'error'
            ? 'ERROR - TRY AGAIN'
            : 'SEND MESSAGE'}
        </button>
        {formStatus === 'success' && (
          <div
            className="mt-6 p-6 border border-[#FF4500]/30 bg-[#FF4500]/5 motion-safe:animate-pulse motion-reduce:animate-none"
            role="status"
            aria-live="polite"
          >
            <p
              className="text-[#FF4500] text-center font-mono text-sm italic leading-relaxed"
              style={{
                textShadow:
                  '0 0 10px rgba(255,69,0,0.6), 0 0 20px rgba(255,69,0,0.4), 0 0 30px rgba(255,69,0,0.2)',
              }}
            >
              &quot;To give style to one&apos;s character—that is a grand and rare art! He who surveys all that his
              nature presents in its strength and in its weakness, and then fashions it into an ingenious plan, until
              everything appears artistic and rational, and even the weaknesses enchant the eye...exercises that
              admirable art.&quot;
            </p>
          </div>
        )}
        {formStatus === 'error' && (
          <p className="text-red-400 text-center font-mono text-sm" role="alert">
            Something went wrong. Please try again or email directly.
          </p>
        )}

        {/* Footer Contact */}
        <div className="w-full font-mono text-sm text-white/50 mt-12 flex justify-center items-center">
          <a
            href="mailto:monkey@wallstreetwildlife.com"
            onMouseEnter={playHoverSound}
            className="flex items-center gap-2 hover:text-[#39FF14] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39FF14]"
          >
            <Mail size={14} aria-hidden="true" /> monkey@wallstreetwildlife.com
          </a>
        </div>
      </form>
    </>
  );
}
