'use client';

import React, { useState } from 'react';
import { X, Quote, BookOpen } from 'lucide-react';

interface Book {
  id: number;
  title: string;
  author: string;
  color: string;
  spineColor: string;
  quote: string;
  summary: string;
  year: string;
}

const books: Book[] = [
  {
    id: 1,
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    color: "#1a365d",
    spineColor: "#2c5282",
    quote: "Nothing in life is as important as you think it is, while you are thinking about it.",
    summary: "A groundbreaking exploration of the two systems that drive the way we think—System 1 (fast, intuitive) and System 2 (slow, deliberate)—and how they shape our judgments and decisions.",
    year: "2011"
  },
  {
    id: 2,
    title: "4,000 Weeks",
    author: "Oliver Burkeman",
    color: "#744210",
    spineColor: "#975a16",
    quote: "The real problem isn't our limited time. It's that we've unwittingly inherited a troublesome set of ideas about how to use our limited time.",
    summary: "A radical and entertaining approach to time management that confronts our finite existence head-on, arguing we should embrace our limitations rather than optimize our way out of them.",
    year: "2021"
  },
  {
    id: 3,
    title: "Philosophical Meditations on Zen Buddhism",
    author: "Dale Wright",
    color: "#22543d",
    spineColor: "#276749",
    quote: "Enlightenment is not something you achieve; it is the absence of something you imagine.",
    summary: "A thoughtful philosophical exploration of Zen Buddhism that bridges Eastern wisdom and Western philosophy, examining meditation, emptiness, and the nature of awakening.",
    year: "2000"
  },
  {
    id: 4,
    title: "The Six Perfections",
    author: "Dale Wright",
    color: "#854d0e",
    spineColor: "#a16207",
    quote: "Perfection is not a final state but a way of being in continuous transformation.",
    summary: "A philosophical exploration of the six pāramitās—generosity, ethics, patience, energy, meditation, and wisdom—as practices for cultivating an enlightened way of life in Mahāyāna Buddhism.",
    year: "2009"
  },
  {
    id: 5,
    title: "Meditations",
    author: "Marcus Aurelius",
    color: "#553c9a",
    spineColor: "#6b46c1",
    quote: "You have power over your mind—not outside events. Realize this, and you will find strength.",
    summary: "Personal writings of the Roman Emperor, offering Stoic wisdom on virtue, rationality, and finding tranquility amidst the chaos of life and leadership.",
    year: "180 AD"
  },
  {
    id: 6,
    title: "Deep Work",
    author: "Cal Newport",
    color: "#9c4221",
    spineColor: "#c05621",
    quote: "Clarity about what matters provides clarity about what does not.",
    summary: "Rules for focused success in a distracted world. Learn to cultivate deep concentration as a superpower in our increasingly shallow, attention-fragmented economy.",
    year: "2016"
  },
  {
    id: 7,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    color: "#285e61",
    spineColor: "#2c7a7b",
    quote: "Doing well with money has little to do with how smart you are and a lot to do with how you behave.",
    summary: "Timeless lessons on wealth, greed, and happiness exploring the strange ways people think about money and how to make better sense of one of life's most important topics.",
    year: "2020"
  },
  {
    id: 8,
    title: "The Gay Science",
    author: "Friedrich Nietzsche",
    color: "#742a2a",
    spineColor: "#9b2c2c",
    quote: "One must still have chaos in oneself to be able to give birth to a dancing star.",
    summary: "Nietzsche's joyful exploration of knowledge, art, and existence, introducing concepts like the eternal recurrence and the death of God while celebrating life-affirming philosophy.",
    year: "1882"
  },
  {
    id: 9,
    title: "Thus Spoke Zarathustra",
    author: "Friedrich Nietzsche",
    color: "#7c2d12",
    spineColor: "#9a3412",
    quote: "Man is something that shall be overcome. What have you done to overcome him?",
    summary: "Nietzsche's philosophical novel following the prophet Zarathustra as he descends from solitude to teach humanity about the Übermensch, the will to power, and the eternal recurrence.",
    year: "1883"
  },
  {
    id: 10,
    title: "Being and Time",
    author: "Martin Heidegger",
    color: "#1a202c",
    spineColor: "#2d3748",
    quote: "The most thought-provoking thing in our thought-provoking time is that we are still not thinking.",
    summary: "Heidegger's magnum opus investigating the meaning of Being through the analysis of human existence (Dasein), temporality, and our fundamental relationship with the world.",
    year: "1927"
  },
  {
    id: 11,
    title: "Infinite Jest",
    author: "David Foster Wallace",
    color: "#1e3a5f",
    spineColor: "#2563eb",
    quote: "The truth will set you free. But not until it is finished with you.",
    summary: "A sprawling, encyclopedic novel exploring entertainment, addiction, and human connection in a near-future America, centered around a tennis academy and a halfway house.",
    year: "1996"
  },
  {
    id: 12,
    title: "Gravity's Rainbow",
    author: "Thomas Pynchon",
    color: "#4a1942",
    spineColor: "#7c2d6e",
    quote: "If they can get you asking the wrong questions, they don't have to worry about answers.",
    summary: "A dense, hallucinatory masterpiece following the trajectory of a V-2 rocket through the final days of WWII, weaving paranoia, technology, and the nature of control.",
    year: "1973"
  },
  {
    id: 13,
    title: "Ulysses",
    author: "James Joyce",
    color: "#065f46",
    spineColor: "#059669",
    quote: "Think you're escaping and run into yourself. Longest way round is the shortest way home.",
    summary: "Joyce's landmark modernist novel following Leopold Bloom through a single day in Dublin, reimagining Homer's Odyssey through stream of consciousness and linguistic innovation.",
    year: "1922"
  },
  {
    id: 14,
    title: "When We Cease to Understand the World",
    author: "Benjamín Labatut",
    color: "#3f3f46",
    spineColor: "#52525b",
    quote: "The closer we come to understanding nature, the further we drift from the world.",
    summary: "A genre-bending work blending fiction and history, exploring the lives of scientists whose discoveries pushed the boundaries of knowledge—and sanity—at the edge of the abyss.",
    year: "2020"
  }
];

export default function Bookshelf() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [hoveredBook, setHoveredBook] = useState<number | null>(null);

  // Helper to get glow style
  const getGlow = (color: string, isHovered: boolean) => ({
    boxShadow: isHovered
      ? `0 0 20px ${color}, inset 0 0 20px ${color}40, 0 0 40px ${color}80`
      : `0 0 8px ${color}, inset 0 0 10px ${color}20`,
    borderColor: color,
  });

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-[#0a0a0a]" id="reading-list">
      {/* Background Grid for Section */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #222 1px, transparent 1px), linear-gradient(to bottom, #222 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Section Header */}
      <div className="max-w-6xl mx-auto mb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-black border border-[#FF4500] rounded-sm mb-6 shadow-[0_0_15px_rgba(255,69,0,0.3)]">
          <BookOpen size={16} className="text-[#FF4500]" />
          <span className="text-[#FF4500] text-sm font-mono uppercase tracking-widest">Reading List</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter" style={{ fontFamily: "'Permanent Marker', cursive" }}>
          BOOKS THAT SHAPED<br />MY THINKING
        </h2>
        <p className="text-zinc-500 font-mono text-sm max-w-xl mx-auto border-l-2 border-[#FF4500] pl-4 text-left">
          // HOVER TO INSPECT. CLICK TO DECRYPT.
        </p>
      </div>

      {/* 3D Bookshelf */}
      <div className="max-w-5xl mx-auto relative z-10" style={{ perspective: '1200px' }}>
        {/* Shelf Container */}
        <div
          className="relative bg-[#0a0a0a] rounded-sm p-4 md:p-12 border-2 border-[#FF4500]/50"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(5deg)',
            boxShadow: '0 0 50px -10px rgba(255,69,0,0.15), inset 0 0 100px rgba(0,0,0,0.8)'
          }}
        >
          {/* Cyber Grid Background inside shelf */}
          <div className="absolute inset-0 opacity-30 rounded-sm"
            style={{
              backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(255, 69, 0, .3) 25%, rgba(255, 69, 0, .3) 26%, transparent 27%, transparent 74%, rgba(255, 69, 0, .3) 75%, rgba(255, 69, 0, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 69, 0, .3) 25%, rgba(255, 69, 0, .3) 26%, transparent 27%, transparent 74%, rgba(255, 69, 0, .3) 75%, rgba(255, 69, 0, .3) 76%, transparent 77%, transparent)`,
              backgroundSize: '30px 30px'
            }}
          />

          {/* Books Row */}
          <div
            className="flex justify-center items-end gap-2 md:gap-4 flex-wrap relative z-20"
          >
            {books.map((book, index) => (
              <div
                key={book.id}
                className="relative cursor-pointer"
                style={{
                  transform: hoveredBook === book.id
                    ? 'translateY(-15px) scale(1.02)'
                    : 'translateY(0) scale(1)',
                  transition: 'transform 0.25s ease-out, z-index 0s',
                  zIndex: hoveredBook === book.id ? 50 : index,
                  willChange: 'transform',
                  isolation: 'isolate',
                }}
                onMouseEnter={() => setHoveredBook(book.id)}
                onMouseLeave={() => setHoveredBook(null)}
                onClick={() => setSelectedBook(book)}
              >
                {/* Book Spine (Wireframe) */}
                <div
                  className="relative flex flex-col items-center justify-center p-2"
                  style={{
                    width: `${45 + (index % 4) * 12}px`, // Varied widths: 45, 57, 69, 81px
                    height: `${300 + (index % 5) * 35}px`, // Varied heights: 300-440px
                    background: 'rgba(5, 5, 5, 0.95)',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    ...getGlow(book.color, hoveredBook === book.id),
                    transition: 'box-shadow 0.25s ease-out, border-color 0.25s ease-out'
                  }}
                >
                  {/* Vertical Text */}
                  <div
                    className="text-white text-xs font-mono font-bold tracking-wide"
                    style={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      transform: 'rotate(180deg)',
                      maxHeight: '95%',
                      textShadow: `0 0 5px ${book.color}`,
                      lineHeight: 1.2,
                    }}
                  >
                    {book.title.toUpperCase()}
                  </div>

                  {/* Decorative Tech Lines */}
                  <div className="absolute bottom-2 left-0 right-0 h-[1px] bg-white/20 mx-2"></div>
                  <div className="absolute top-2 left-0 right-0 h-[1px] bg-white/20 mx-2"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Shelf Front Lip (Wireframe) */}
          <div
            className="absolute -bottom-4 left-[-2px] right-[-2px] h-6 bg-black border-l-2 border-r-2 border-b-2 border-[#FF4500]/50"
            style={{
              transform: 'rotateX(-90deg) translateZ(0px)',
              transformOrigin: 'top',
            }}
          >
            {/* Lip Grid */}
            <div className="w-full h-full opacity-30 bg-[linear-gradient(45deg,transparent_25%,rgba(255,69,0,0.5)_25%,rgba(255,69,0,0.5)_50%,transparent_50%,transparent_75%,rgba(255,69,0,0.5)_75%,rgba(255,69,0,0.5)_100%)] bg-[length:10px_10px]" />
          </div>
        </div>
      </div>

      {/* Book Detail Modal (Wireframe) */}
      {selectedBook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedBook(null)}
        >
          {/* Scanline Backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md"
            style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}
          />

          {/* Modal Content */}
          <div
            className="relative bg-black border-2 max-w-2xl w-full overflow-hidden shadow-[0_0_50px_rgba(255,69,0,0.2)]"
            onClick={(e) => e.stopPropagation()}
            style={{
              borderColor: selectedBook.color,
              boxShadow: `0 0 30px ${selectedBook.color}40`,
              animation: 'modalSlideIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
          >
            {/* Header Data Stream */}
            <div className="flex justify-between items-center p-2 border-b border-white/10 bg-white/5 font-mono text-[10px] text-white/50 tracking-widest uppercase">
              <span>ID: {selectedBook.id.toString().padStart(4, '0')}</span>
              <span>// ARCHIVE_READ_ONLY</span>
            </div>

            {/* Close button */}
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-2 right-2 p-2 hover:bg-[#FF4500] hover:text-black text-[#FF4500] transition-colors z-20"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-12 relative overflow-hidden">
              {/* Background Big Number */}
              <span className="absolute -right-4 -bottom-10 text-[200px] font-black leading-none opacity-5 font-mono select-none pointer-events-none text-white">
                {selectedBook.id.toString().padStart(2, '0')}
              </span>

              <div className="flex flex-col md:flex-row items-start gap-8 mb-8 relative z-10">
                {/* Wireframe Book Visual */}
                <div
                  className="flex-shrink-0 w-24 h-36 border-2 flex items-center justify-center relative"
                  style={{
                    borderColor: selectedBook.color,
                    boxShadow: `0 0 20px ${selectedBook.color}40`
                  }}
                >
                  <div className="absolute inset-2 border border-white/10" />
                  <BookOpen size={32} style={{ color: selectedBook.color }} />
                </div>

                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 uppercase tracking-tight" style={{ fontFamily: "'Permanent Marker', cursive" }}>{selectedBook.title}</h3>
                  <div className="flex items-center gap-4 text-sm font-mono mt-2">
                    <span className="text-[#FF4500] uppercase tracking-widest">AUTHOR_</span>
                    <span className="text-white bg-white/10 px-2">{selectedBook.author}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-mono mt-1">
                    <span className="text-[#FF4500] uppercase tracking-widest">YEAR___</span>
                    <span className="text-white/60">[{selectedBook.year}]</span>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="mb-8 p-6 bg-[#FF4500]/5 border-l-4 border-[#FF4500] relative">
                <Quote className="absolute top-4 right-4 text-[#FF4500]/20" size={48} />
                <p className="text-xl md:text-2xl text-white font-serif italic leading-relaxed mix-blend-lighten">
                  "{selectedBook.quote}"
                </p>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-xs font-mono text-[#FF4500] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#FF4500]"></span>
                  Analysis
                  <span className="flex-1 h-[1px] bg-[#FF4500]/30"></span>
                </h4>
                <p className="text-zinc-300 leading-relaxed font-light text-lg">
                  {selectedBook.summary}
                </p>
              </div>

              {/* Footer Action */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => window.open(`https://google.com/search?q=${encodeURIComponent(selectedBook.title + ' book')}`, '_blank')}
                  className="px-6 py-2 border border-white/20 hover:border-[#FF4500] hover:bg-[#FF4500] hover:text-black text-white font-mono text-sm transition-all duration-300 flex items-center gap-2 group"
                >
                  <span>LOCATE_RESOURCE</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
}
