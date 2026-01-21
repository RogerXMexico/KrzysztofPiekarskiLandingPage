'use client';

import React from 'react';

const testimonials = [
  {
    text: `Krzysztof Piekarski offers a unique brand of personal consulting. He combines deep philosophical knowledge, psychological sophistication and Zen-infused guidance to help solve problems. He articulates his thoughts with empathy and extreme precision. He is warm and humorous and an excellent listener. Krzysztof's guidance includes suggestions for reading and watching material that range from YouTube clips to Dylan lyrics to classic literature. He has a unique ability to flow with the process and help one intelligently struggle through a problem in dynamic, interesting and even entertaining ways. For example, in my experience he has suggested essays by Camus, interviews with noted philosophers, and an episode of a cooking show that all contained bits of wisdom which were strikingly relevant to issues I was facing. If you're seeking clarity, or just more effective ways of navigating the complexities I strongly recommend working with him. This is not the run-of-the-mill therapist spitting back empty cliches or throwing questions back at you, "well, what do you think?" To work with Krzysztof is to engage in real conversations about critical questions with a great mind and truly unique personality and vision of life.`,
    author: 'Daniel Joshua Rubin',
    title: 'Author, 27 Essential Principles of Story',
    featured: true,
  },
  {
    text: `I came for productivity tips. I left questioning the nature of my existence. Worth it?`,
    author: 'Alex R.',
  },
  {
    text: `Working with Krzysztof helped me break through years of mental barriers in just weeks.`,
    author: 'Marcus T.',
  },
  {
    text: `I finally stopped making excuses and started living. Best investment I ever made.`,
    author: 'Jennifer K.',
  },
  {
    text: `He made me stare into the abyss. The abyss blinked first. 4 stars.`,
    author: 'Friedrich N.',
  },
  {
    text: `The conversations we had completely changed how I see my own potential.`,
    author: 'Sarah M.',
  },
  {
    text: `Amor fati? More like amor Krzysztof. I now love my fate of paying for a life coach.`,
    author: 'Emma W.',
  },
  {
    text: `I made the leap of faith. Landed on my face. Got back up. 10/10 would existentially commit again.`,
    author: 'Søren K.',
  },
];

interface TestimonialCardProps {
  text: string;
  author: string;
  title?: string;
  featured?: boolean;
}

function TestimonialCard({ text, author, title, featured }: TestimonialCardProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tiltStrength = featured ? 4 : 8;
    const rotateY = ((x - rect.width / 2) / rect.width) * tiltStrength;
    const rotateX = ((rect.height / 2 - y) / rect.height) * tiltStrength;
    e.currentTarget.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'rotateX(0) rotateY(0)';
  };

  return (
    <article
      className={`border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer motion-reduce:transition-none ${
        featured
          ? 'col-span-1 md:col-span-2 p-8 md:p-10 hover:border-[#FF4500] hover:shadow-[0_0_30px_rgba(255,69,0,0.3)]'
          : 'p-6'
      }`}
      style={{ transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      role="article"
      aria-label={`Testimonial from ${author}`}
    >
      {featured ? (
        <div className="relative">
          <span className="absolute -top-4 -left-2 text-6xl text-white/10 font-serif" aria-hidden="true">
            "
          </span>
          <blockquote className="text-white/80 font-serif italic leading-relaxed text-[15px] relative z-10">
            {text}
          </blockquote>
          <span className="absolute -bottom-8 right-0 text-6xl text-white/10 font-serif" aria-hidden="true">
            "
          </span>
        </div>
      ) : (
        <blockquote className="text-white/80 font-serif italic">{text}</blockquote>
      )}
      <footer className={featured ? 'mt-8 flex flex-col items-end border-t border-white/10 pt-4' : 'mt-4'}>
        <p className={`text-[#FF4500] font-bold ${featured ? 'text-xl font-black font-serif' : 'text-sm'}`}>
          — {author}
        </p>
        {title && <p className="text-xs text-white/50 font-mono uppercase tracking-widest mt-1">{title}</p>}
      </footer>
    </article>
  );
}

export default function Testimonials() {
  return (
    <section className="mt-8 space-y-5" aria-labelledby="testimonials-heading">
      <h4 id="testimonials-heading" className="font-mono text-xs tracking-widest opacity-40 uppercase">
        What Others Say
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ perspective: '1000px' }}>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </div>
    </section>
  );
}
