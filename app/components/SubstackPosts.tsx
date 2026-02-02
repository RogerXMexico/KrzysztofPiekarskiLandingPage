'use client';

import React, { useState, useEffect } from 'react';

interface SubstackPost {
  title: string;
  link: string;
  date: string;
  description: string;
}

interface Props {
  playHoverSound: () => void;
}

function parseRSS(xml: string): SubstackPost[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const items = doc.querySelectorAll('item');
  const posts: SubstackPost[] = [];

  for (let i = 0; i < Math.min(items.length, 3); i++) {
    const item = items[i];
    const title = item.querySelector('title')?.textContent ?? '';
    const link = item.querySelector('link')?.textContent ?? '';
    const pubDate = item.querySelector('pubDate')?.textContent ?? '';
    const descriptionRaw = item.querySelector('description')?.textContent ?? '';

    // Strip HTML tags from description and truncate
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = descriptionRaw;
    const description = (tempDiv.textContent || tempDiv.innerText || '').trim().slice(0, 160) + '...';

    posts.push({
      title,
      link,
      date: pubDate ? new Date(pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
      description,
    });
  }

  return posts;
}

const SubstackPosts: React.FC<Props> = ({ playHoverSound }) => {
  const [posts, setPosts] = useState<SubstackPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchPosts() {
      try {
        const res = await fetch('/api/substack-feed');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const xml = await res.text();
        if (cancelled) return;
        const parsed = parseRSS(xml);
        if (parsed.length === 0) throw new Error('No posts found');
        setPosts(parsed);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPosts();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="mt-12 mb-4" aria-labelledby="substack-heading">
      {/* Header with torn-paper edge */}
      <div className="relative mb-8">
        <div
          className="relative bg-gradient-to-r from-[#FF4500]/10 to-transparent border border-[#FF4500]/30 px-6 py-5"
          style={{
            clipPath: 'polygon(0% 0%, 100% 2%, 98% 100%, 2% 98%)',
          }}
        >
          {/* Tape decorations */}
          <div className="absolute -top-3 left-6 w-16 h-6 bg-[#FF4500]/20 border border-[#FF4500]/30 rounded-sm transform -rotate-2" aria-hidden="true" />
          <div className="absolute -top-3 right-10 w-14 h-6 bg-[#FF4500]/20 border border-[#FF4500]/30 rounded-sm transform rotate-3" aria-hidden="true" />

          <h2
            id="substack-heading"
            className="text-2xl md:text-3xl font-black text-center text-[#FF4500] tracking-tight"
            style={{ fontFamily: "'Permanent Marker', cursive" }}
          >
            LATEST FIRE PHILOSOPHY POSTS
          </h2>
          <p className="text-center text-white/40 mt-1 text-xs font-mono uppercase tracking-wider">
            Zen, Nietzsche &amp; how to live
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {loading && (
          <>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="p-5 bg-white/[0.02] border border-white/10 animate-pulse"
                style={{
                  clipPath: 'polygon(0% 0%, 100% 1%, 99% 100%, 1% 99%)',
                }}
              >
                <div className="h-3 w-24 bg-white/10 rounded mb-3" />
                <div className="h-5 w-3/4 bg-white/10 rounded mb-3" />
                <div className="h-3 w-full bg-white/5 rounded mb-1" />
                <div className="h-3 w-5/6 bg-white/5 rounded" />
              </div>
            ))}
          </>
        )}

        {error && (
          <div
            className="p-8 bg-white/[0.02] border border-[#FF4500]/30 text-center"
            style={{
              clipPath: 'polygon(0% 0%, 100% 1%, 99% 100%, 1% 99%)',
            }}
          >
            <p className="text-white/50 mb-4 font-mono text-sm">
              Couldn't load the latest posts right now.
            </p>
            <a
              href="https://firephilosophy.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF4500]/10 border border-[#FF4500]/40 text-[#FF4500] font-black text-sm uppercase tracking-wider hover:bg-[#FF4500] hover:text-white hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-[0_0_30px_rgba(255,69,0,0.6)]"
              style={{ fontFamily: "'Permanent Marker', cursive" }}
              onMouseEnter={playHoverSound}
            >
              Visit Fire Philosophy
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        )}

        {!loading && !error && posts.map((post, idx) => (
          <a
            key={idx}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-5 bg-white/[0.02] border border-white/10 hover:border-[#FF4500]/50 transition-all duration-300 group hover:bg-[#FF4500]/[0.04] hover:shadow-[0_0_25px_rgba(255,69,0,0.15)]"
            style={{
              clipPath: 'polygon(0% 0%, 100% 1%, 99% 100%, 1% 99%)',
            }}
            onMouseEnter={playHoverSound}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-mono text-[#FF4500]/70 uppercase tracking-wider">
                {post.date}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-[#FF4500]/20 to-transparent" />
              <svg
                className="w-4 h-4 text-white/20 group-hover:text-[#FF4500] transition-all duration-300 group-hover:translate-x-1 transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-[#FF4500] transition-colors duration-300 mb-2">
              {post.title}
            </h3>
            <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
              {post.description}
            </p>
          </a>
        ))}
      </div>

      {/* View all link */}
      {!loading && !error && posts.length > 0 && (
        <div className="text-center mt-6">
          <a
            href="https://firephilosophy.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-[#FF4500] transition-colors duration-300 font-mono uppercase tracking-widest"
            onMouseEnter={playHoverSound}
          >
            View all posts on Substack
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      )}
    </section>
  );
};

export default SubstackPosts;
