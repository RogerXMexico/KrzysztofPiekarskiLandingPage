import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-8">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 text-center max-w-xl">
        {/* 404 Number */}
        <h1
          className="text-[150px] md:text-[200px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-transparent select-none"
          style={{ fontFamily: "'Permanent Marker', cursive" }}
        >
          404
        </h1>

        {/* Message */}
        <div className="mt-[-40px] md:mt-[-60px]">
          <h2
            className="text-3xl md:text-4xl font-black text-[#FF4500] mb-4"
            style={{ fontFamily: "'Permanent Marker', cursive" }}
          >
            LOST IN THE VOID
          </h2>
          <p className="text-white/60 font-serif text-lg mb-8">
            The page you're looking for has either been moved, deleted, or perhaps never existed in this dimension.
          </p>

          {/* Quote */}
          <blockquote className="text-white/40 font-serif italic text-sm mb-8 border-l-2 border-[#FF4500]/50 pl-4 text-left max-w-md mx-auto">
            "He who has a why to live can bear almost any how."
            <footer className="text-[#FF4500]/60 mt-2 not-italic">— Friedrich Nietzsche</footer>
          </blockquote>

          {/* CTA */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF4500] text-white font-black tracking-wider hover:bg-white hover:text-black transition-all duration-200 shadow-[0_0_30px_rgba(255,69,0,0.5)] hover:shadow-[0_0_50px_rgba(255,69,0,0.8)]"
            style={{ fontFamily: "'Permanent Marker', cursive" }}
          >
            <span>←</span>
            <span>RETURN HOME</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
