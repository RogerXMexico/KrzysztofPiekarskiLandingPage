'use client';

import React from 'react';
import { Twitter, Youtube, Mail } from 'lucide-react';

interface SocialLinksProps {
  playHoverSound: () => void;
}

export default function SocialLinks({ playHoverSound }: SocialLinksProps) {
  const links = [
    {
      href: 'https://x.com/7FlyingPlatypus',
      label: 'Follow on Twitter',
      icon: Twitter,
      hoverColor: '#1DA1F2',
    },
    {
      href: 'https://www.youtube.com/@WallStreetWildlife',
      label: 'Subscribe on YouTube',
      icon: Youtube,
      hoverColor: '#FF0000',
    },
    {
      href: 'https://firephilosophy.substack.com/',
      label: 'Read on Substack',
      icon: null, // Custom SVG
      hoverColor: '#FF6719',
    },
    {
      href: 'https://mail.google.com/mail/?view=cm&to=krzyspiekarski@gmail.com',
      label: 'Send email',
      icon: Mail,
      hoverColor: '#22C55E',
    },
  ];

  return (
    <div
      className="fixed left-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-3"
      role="navigation"
      aria-label="Social media links"
    >
      {links.map((link, index) => (
        <a
          key={link.href}
          href={link.href}
          target={link.href.startsWith('mailto') ? undefined : '_blank'}
          rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
          onMouseEnter={playHoverSound}
          className="group w-10 h-10 flex items-center justify-center border border-white/20 bg-black/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          style={{
            ['--hover-color' as string]: link.hoverColor,
          }}
          aria-label={link.label}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = link.hoverColor;
            e.currentTarget.style.backgroundColor = link.hoverColor;
            e.currentTarget.style.boxShadow = `0 0 20px ${link.hoverColor}80`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '';
            e.currentTarget.style.backgroundColor = '';
            e.currentTarget.style.boxShadow = '';
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = link.hoverColor;
            e.currentTarget.style.backgroundColor = link.hoverColor;
            e.currentTarget.style.boxShadow = `0 0 20px ${link.hoverColor}80`;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = '';
            e.currentTarget.style.backgroundColor = '';
            e.currentTarget.style.boxShadow = '';
          }}
        >
          {link.icon ? (
            <link.icon size={18} className="text-white/60 group-hover:text-white group-focus-visible:text-white transition-colors" aria-hidden="true" />
          ) : (
            // Substack icon
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              className="text-white/60 group-hover:text-white group-focus-visible:text-white transition-colors fill-current"
              aria-hidden="true"
            >
              <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
            </svg>
          )}
        </a>
      ))}
      {/* Decorative line */}
      <div className="w-[1px] h-16 bg-gradient-to-b from-white/20 to-transparent mx-auto mt-2" aria-hidden="true" />
    </div>
  );
}
