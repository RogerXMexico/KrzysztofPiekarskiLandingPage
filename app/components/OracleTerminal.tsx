'use client';

import React, { useRef, useEffect, useState } from 'react';

interface OracleTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OracleTerminal({ isOpen, onClose }: OracleTerminalProps) {
  const [terminalHistory, setTerminalHistory] = useState<{ type: 'input' | 'output'; text: string }[]>([
    { type: 'output', text: 'THE ORACLE v1.0 [ONLINE]' },
    { type: 'output', text: 'Type "help" for commands.' },
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && terminalInputRef.current) {
      setTimeout(() => terminalInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Scroll to bottom when history updates
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory]);

  // Trap focus inside modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      // Trap focus inside terminal
      if (e.key === 'Tab') {
        e.preventDefault();
        terminalInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...terminalHistory, { type: 'input' as const, text: terminalInput }];

    let response = '';
    switch (cmd) {
      case 'help':
        response = 'AVAILABLE COMMANDS: help, clear, fear, money, truth, love, purpose, krzys, patience, hope, imagination, doubt, vitality, amor fati, courage, wisdom, gratitude, discipline, humility, resilience, integrity, compassion, presence, equanimity, authenticity, temperance, curiosity, fortitude, serenity';
        break;
      case 'clear':
        setTerminalHistory([]);
        setTerminalInput('');
        return;
      case 'fear':
        response = 'Fear is the border of your reality. Cross it.';
        break;
      case 'money':
        response = 'Money is stored energy. Where is yours leaking?';
        break;
      case 'truth':
        response = 'The truth is not a destination. It is a frequency.';
        break;
      case 'love':
        response = 'Love is the recognition of shared awareness.';
        break;
      case 'purpose':
        response = 'To build. To break. To begin again.';
        break;
      case 'patience':
        response = 'Patience is not passive waiting. It is active stillness while chaos unfolds.';
        break;
      case 'hope':
        response = 'Hope is not optimism. It is the discipline of acting as if the future matters.';
        break;
      case 'imagination':
        response = 'Imagination is the first act of creation. What you cannot picture, you cannot become.';
        break;
      case 'doubt':
        response = 'Doubt is the chisel that shapes conviction. Embrace it, but do not worship it.';
        break;
      case 'vitality':
        response = 'Vitality is not the absence of fatigue. It is the presence of meaning.';
        break;
      case 'amor fati':
      case 'amorfati':
        response = 'Love your fate. Every wound, every gift, every detour—say yes to all of it.';
        break;
      case 'courage':
        response = 'Courage is not fearlessness. It is fear walking forward anyway.';
        break;
      case 'wisdom':
        response = 'Wisdom is knowing what to ignore. The sage sees less but understands more.';
        break;
      case 'gratitude':
        response = 'Gratitude is not a response to fortune. It is a stance toward existence itself.';
        break;
      case 'discipline':
        response = 'Discipline is remembered enthusiasm. It carries you when motivation abandons you.';
        break;
      case 'humility':
        response = 'Humility is not thinking less of yourself. It is thinking of yourself less.';
        break;
      case 'resilience':
        response = 'Resilience is not bouncing back. It is growing through what would break you.';
        break;
      case 'integrity':
        response = 'Integrity is wholeness. When your actions match your words match your thoughts.';
        break;
      case 'compassion':
        response = 'Compassion begins with seeing yourself in the other. It ends with seeing no other.';
        break;
      case 'presence':
        response = 'Presence is the only place where life happens. The past is memory. The future is imagination.';
        break;
      case 'equanimity':
        response = 'Equanimity is the still point in the turning world. Unmoved, but not indifferent.';
        break;
      case 'authenticity':
        response = 'Authenticity is expensive. It costs you the comfort of other people\'s expectations.';
        break;
      case 'temperance':
        response = 'Temperance is not deprivation. It is the art of enough.';
        break;
      case 'curiosity':
        response = 'Curiosity is the antidote to certainty. Stay curious, stay alive.';
        break;
      case 'fortitude':
        response = 'Fortitude is the long game. Not a single act of bravery, but daily endurance.';
        break;
      case 'serenity':
        response = 'Serenity is not the absence of storms. It is peace amid them.';
        break;
      case 'krzys':
      case 'krzysztof':
      case 'chris':
        response = 'ANALYST PHILOSOPHER NOT AN ELF, EXACTLY';
        break;
      case 'who are you':
        response = 'I am the echo of your own curiosity.';
        break;
      default:
        response = `Command not found: "${cmd}". Try "help".`;
    }

    setTerminalHistory([...newHistory, { type: 'output', text: response }]);
    setTerminalInput('');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Oracle Terminal"
    >
      <div
        ref={containerRef}
        className="w-full max-w-2xl h-[400px] bg-black border-2 border-[#00FF00] shadow-[0_0_50px_rgba(0,255,0,0.2)] p-6 font-mono text-[#00FF00] overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scanline Effect */}
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-10 opacity-60 motion-reduce:opacity-30"
          aria-hidden="true"
        />

        <div className="flex justify-between items-center border-b border-[#00FF00]/30 pb-2 mb-4">
          <span id="terminal-title">TERMINAL_ACCESS_V1.0</span>
          <button
            onClick={onClose}
            className="hover:bg-[#00FF00] hover:text-black px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF00]"
            aria-label="Close terminal"
          >
            [CLOSE]
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto mb-4 custom-scrollbar"
          role="log"
          aria-live="polite"
          aria-label="Terminal output"
        >
          {terminalHistory.map((line, i) => (
            <div
              key={i}
              className={`mb-1 whitespace-pre-wrap ${line.type === 'input' ? 'text-white/70' : 'text-[#00FF00]'}`}
            >
              {line.type === 'input' ? '> ' : ''}
              {line.text}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        <form onSubmit={handleCommand} className="flex gap-2 relative z-20">
          <span className="text-[#00FF00] motion-safe:animate-pulse motion-reduce:animate-none" aria-hidden="true">
            {'>'}
          </span>
          <label htmlFor="terminal-input" className="sr-only">
            Enter command
          </label>
          <input
            id="terminal-input"
            ref={terminalInputRef}
            type="text"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-[#00FF00] font-mono uppercase"
            autoFocus
            spellCheck={false}
            aria-describedby="terminal-title"
          />
        </form>
      </div>
    </div>
  );
}
