/**
 * Generate "5 Philosophical Principles That Changed My Trading" PDF
 *
 * Usage:
 *   npm install pdfkit (if not already installed)
 *   node scripts/generate-pdf.mjs
 *
 * Output: public/five-principles-guide.pdf
 */

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, '..', 'public', 'five-principles-guide.pdf');

const doc = new PDFDocument({
  size: 'letter',
  margins: { top: 72, bottom: 72, left: 72, right: 72 },
  info: {
    Title: '5 Philosophical Principles That Changed My Trading',
    Author: 'Krzysztof Piekarski',
    Subject: 'Philosophy meets investing: timeless principles for modern traders',
    Creator: 'Krzysztof Piekarski — firephilosophy.substack.com',
  },
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// ─── Colors ───
const ORANGE = '#FF4500';
const GREEN = '#39FF14';
const BLACK = '#0a0a0a';
const DARK = '#1a1a1a';
const WHITE = '#FFFFFF';
const GRAY = '#999999';
const LIGHT_GRAY = '#cccccc';

// ─── Helpers ───
function drawHorizontalRule(y, color = ORANGE, width = 468) {
  doc.save()
    .moveTo(72, y)
    .lineTo(72 + width, y)
    .strokeColor(color)
    .lineWidth(1.5)
    .stroke()
    .restore();
}

function drawPrincipleNumber(num, y, color = ORANGE) {
  doc.save()
    .roundedRect(72, y, 36, 36, 4)
    .fill(color);
  doc.fontSize(18)
    .fillColor(BLACK)
    .font('Helvetica-Bold')
    .text(String(num).padStart(2, '0'), 72, y + 9, { width: 36, align: 'center' });
  doc.restore();
}

// ════════════════════════════════════════════════════════════════
//  COVER PAGE
// ════════════════════════════════════════════════════════════════

// Background bar
doc.rect(0, 0, 612, 792).fill(BLACK);

// Top accent line
doc.rect(72, 100, 468, 3).fill(ORANGE);

// Title
doc.fontSize(14)
  .fillColor(ORANGE)
  .font('Helvetica-Bold')
  .text('FREE GUIDE', 72, 130, { characterSpacing: 4 });

doc.fontSize(38)
  .fillColor(WHITE)
  .font('Helvetica-Bold')
  .text('5 Philosophical', 72, 170)
  .text('Principles That', 72, 218)
  .text('Changed My', 72, 266);

doc.fontSize(38)
  .fillColor(ORANGE)
  .font('Helvetica-Bold')
  .text('Trading', 72, 314);

// Subtitle
doc.fontSize(12)
  .fillColor(LIGHT_GRAY)
  .font('Helvetica')
  .text(
    'How Nietzsche, Zen Buddhism, and 2,500 years of philosophical wisdom made me a better investor — and can do the same for you.',
    72, 380,
    { width: 468, lineGap: 4 }
  );

// Author block
doc.rect(72, 480, 468, 1).fill('#333333');

doc.fontSize(16)
  .fillColor(WHITE)
  .font('Helvetica-Bold')
  .text('Krzysztof Piekarski', 72, 505);

doc.fontSize(10)
  .fillColor(GRAY)
  .font('Helvetica')
  .text('PhD  •  Philosopher  •  Analyst  •  Co-Host, Wall Street Wildlife', 72, 528);

// Bottom accent
doc.rect(72, 680, 468, 3).fill(ORANGE);

doc.fontSize(9)
  .fillColor(GRAY)
  .font('Helvetica')
  .text('firephilosophy.substack.com  |  wallstreetwildlife.com', 72, 700, {
    width: 468,
    align: 'center',
  });

// ════════════════════════════════════════════════════════════════
//  INTRODUCTION PAGE
// ════════════════════════════════════════════════════════════════
doc.addPage();
doc.rect(0, 0, 612, 792).fill(BLACK);

doc.rect(72, 60, 468, 2).fill(ORANGE);

doc.fontSize(24)
  .fillColor(WHITE)
  .font('Helvetica-Bold')
  .text('Introduction', 72, 85);

doc.fontSize(11)
  .fillColor(LIGHT_GRAY)
  .font('Helvetica')
  .text(
    `Most trading education teaches you what to think. This guide is about how to think.

After spending a decade in academia studying philosophy — earning a PhD exploring Buddhist principles in the work of David Foster Wallace — I pivoted into the markets. I expected trading to be an entirely different discipline. I was wrong.

The same questions that haunted Nietzsche, the Buddha, and the Stoics turn out to be the exact questions that separate consistently profitable traders from everyone else:

    •  How do you act decisively under uncertainty?
    •  How do you maintain equanimity when everything is on fire?
    •  How do you see reality clearly when your ego is screaming?
    •  How do you love the process when the outcome hurts?

What follows are five principles drawn from the deepest wells of philosophical thought — principles that didn't just improve my trading. They transformed it.

These aren't abstract ideas. Each one comes with a concrete practice you can implement in your very next trading session.

Let's begin.`,
    72, 130,
    { width: 468, lineGap: 5 }
  );

// ════════════════════════════════════════════════════════════════
//  PRINCIPLE 1: AMOR FATI
// ════════════════════════════════════════════════════════════════
doc.addPage();
doc.rect(0, 0, 612, 792).fill(BLACK);

drawPrincipleNumber(1, 60, ORANGE);

doc.fontSize(22)
  .fillColor(WHITE)
  .font('Helvetica-Bold')
  .text('Amor Fati — Love Your Losses', 120, 64);

doc.fontSize(10)
  .fillColor(ORANGE)
  .font('Helvetica')
  .text('NIETZSCHE  •  RISK MANAGEMENT', 120, 92, { characterSpacing: 2 });

drawHorizontalRule(115);

// Quote
doc.fontSize(12)
  .fillColor(LIGHT_GRAY)
  .font('Helvetica-Oblique')
  .text(
    '"My formula for greatness in a human being is amor fati: that one wants nothing to be different, not forward, not backward, not in all eternity."',
    90, 135,
    { width: 432, lineGap: 4 }
  );

doc.fontSize(10)
  .fillColor(ORANGE)
  .font('Helvetica-Bold')
  .text('— Friedrich Nietzsche, Ecce Homo', 90, 188);

drawHorizontalRule(210);

doc.fontSize(11)
  .fillColor(LIGHT_GRAY)
  .font('Helvetica')
  .text(
    `Amor fati — "love of fate" — is Nietzsche's most radical idea. Not just acceptance of what happens to you, but a wholehearted embrace of it. Every loss, every blown stop, every position that went against you — Nietzsche says: love it.

This sounds insane to a trader. But consider what actually happens when you don't love your losses:

You revenge trade. You double down on losers. You refuse to cut a position because admitting the loss would mean admitting you were wrong. Your ego hijacks your risk management, and the small loss you should have taken becomes the catastrophic loss that blows up your account.

Amor fati is the antidote.

When you genuinely accept that losses are not failures but the necessary cost of doing business in uncertainty, something shifts. You stop fighting the market. You take your stop-losses cleanly. You size your positions properly because you've already made peace with the worst-case scenario before you enter the trade.

The paradox: traders who love their losses lose less money. Because they never let a manageable loss become an unmanageable one.`,
    72, 228,
    { width: 468, lineGap: 5, height: 290 }
  );

// Practice box
const practiceY1 = 530;
doc.roundedRect(72, practiceY1, 468, 120, 4)
  .fillAndStroke(DARK, ORANGE);

doc.fontSize(10)
  .fillColor(ORANGE)
  .font('Helvetica-Bold')
  .text('PRACTICE', 90, practiceY1 + 15, { characterSpacing: 3 });

doc.fontSize(11)
  .fillColor(LIGHT_GRAY)
  .font('Helvetica')
  .text(
    `Before every trade, write down the maximum amount you're willing to lose. Say it out loud: "I accept this loss." Then set your stop-loss at that exact level. When it triggers, say: "This is the cost of playing the game I love." Do this for 30 trades. Watch what happens to your relationship with risk.`,
    90, practiceY1 + 35,
    { width: 432, lineGap: 4 }
  );

// ════════════════════════════════════════════════════════════════
//  PRINCIPLE 2: BEGINNER'S MIND
// ════════════════════════════════════════════════════════════════
doc.addPage();
doc.rect(0, 0, 612, 792).fill(BLACK);

drawPrincipleNumber(2, 60, GREEN);

doc.fontSize(22)
  .fillColor(WHITE)
  .font('Helvetica-Bold')
  .text("Shoshin — Kill Your Thesis", 120, 64);

doc.fontSize(10)
  .fillColor(GREEN)
  .font('Helvetica')
  .text('ZEN BUDDHISM  •  REVENGE TRADING', 120, 92, { characterSpacing: 2 });

drawHorizontalRule(115, GREEN);

// Quote
doc.fontSize(12)
  .fillColor(LIGHT_GRAY)
  .font('Helvetica-Oblique')
  .text(
    '"In the beginner\'s mind there are many possibilities, but in the expert\'s mind there are few."',
    90, 135,
    { width: 432, lineGap: 4 }
  );

doc.fontSize(10)
  .fillColor(GREEN)
  .font('Helvetica-Bold')
  .text("— Shunryu Suzuki, Zen Mind, Beginner's Mind", 90, 172);

drawHorizontalRule(195, GREEN);

doc.fontSize(11)
  .fillColor(LIGHT_GRAY)
  .font('Helvetica')
  .text(
    `Shoshin — "beginner's mind" — is a Zen concept that describes approaching each moment as if encountering it for the first time. No preconceptions. No baggage. No "I already know what this stock is going to do."

Revenge trading is what happens when you bring yesterday's mind to today's market. You lost money on NVDA, so now you "need" to make it back on NVDA. You're not seeing the chart — you're seeing your bruised ego reflected back at you. The trade is no longer about the market. It's about you.

Beginner's mind obliterates this pattern.

Every single trading session is a new session. Every chart is being seen for the first time. The fact that you lost $2,000 on this ticker yesterday is philosophically irrelevant to whether it's a good trade today. The market doesn't remember your last trade. Why do you?

This is not about forgetting — it's about not clinging. In Zen practice, thoughts arise and pass. You don't grab onto them. A loss arises in your memory? Let it pass. Return to the chart. What is the setup telling you right now, in this moment, with fresh eyes?

The best traders I know have short memories. Not because they're forgetful, but because they've trained themselves in shoshin. Every trade is the first trade.`,
    72, 213,
    { width: 468, lineGap: 5, height: 305 }
  );

// Practice box
const practiceY2 = 530;
doc.roundedRect(72, practiceY2, 468, 130, 4)
  .fillAndStroke(DARK, GREEN);

doc.fontSize(10)
  .fillColor(GREEN)
  .font('Helvetica-Bold')
  .text('PRACTICE', 90, practiceY2 + 15, { characterSpacing: 3 });

doc.fontSize(11)
  .fillColor(LIGHT_GRAY)
  .font('Helvetica')
  .text(
    `Start each trading day with a 2-minute "clean slate" ritual. Close your eyes. Take five slow breaths. Then say: "I have no positions, no opinions, and no scores to settle. I am here to see what the market shows me." Only then open your charts. If you notice yourself wanting to trade a ticker because of a previous loss — that is your signal to skip it entirely.`,
    90, practiceY2 + 35,
    { width: 432, lineGap: 4 }
  );

// ════════════════════════════════════════════════════════════════
//  PRINCIPLE 3: THE ETERNAL RECURRENCE TEST
// ════════════════════════════════════════════════════════════════
doc.addPage();
doc.rect(0, 0, 612, 792).fill(BLACK);

drawPrincipleNumber(3, 60, ORANGE);

doc.fontSize(22)
  .fillColor(WHITE)
  .font('Helvetica-Bold')
  .text('The Eternal Recurrence Test', 120, 64);

doc.fontSize(10)
  .fillColor(ORANGE)
  .font('Helvetica')
  .text('NIETZSCHE  •  TRADE SELECTION', 120, 92, { characterSpacing: 2 });

drawHorizontalRule(115);

// Quote
doc.fontSize(12)
  .fillColor(LIGHT_GRAY)
  .font('Helvetica-Oblique')
  .text(
    '"What if some day or night a demon were to steal after you and say: this life as you now live it, you will have to live once more and innumerable times more — would you throw yourself down and curse the demon, or would you say: never have I heard anything more divine?"',
    90, 135,
    { width: 432, lineGap: 4 }
  );

doc.fontSize(10)
  .fillColor(ORANGE)
  .font('Helvetica-Bold')
  .text('— Friedrich Nietzsche, The Gay Science §341', 90, 208);

drawHorizontalRule(230);

doc.fontSize(11)
  .fillColor(LIGHT_GRAY)
  .font('Helvetica')
  .text(
    `Nietzsche's thought experiment of eternal recurrence asks: if you had to relive this exact moment, this exact decision, infinite times — would you affirm it?

Applied to trading, this becomes the single most powerful filter for trade quality.

Before you click "buy," ask yourself: "If I had to take this exact trade — same entry, same position size, same stop-loss — a thousand times in a row, would I be profitable across those thousand trades?"

This question instantly exposes bad trades. That YOLO earnings play with 80% of your portfolio? You would not take that a thousand times. That revenge trade at 3:55 PM because you're down on the day? You would not take that a thousand times. That "gut feeling" trade with no defined risk? A thousand repetitions would bankrupt you.

But the disciplined trade — the one with a clear edge, defined risk, proper position size, and an entry you've backtested? Yes. A thousand times. Ten thousand times. This is a trade you can affirm eternally.

The eternal recurrence test forces you to think in probabilities rather than individual outcomes. It shifts your focus from "Will this trade make money?" to "Does this trade have a positive expected value across many iterations?" That shift is the difference between gambling and trading.`,
    72, 248,
    { width: 468, lineGap: 5, height: 400 }
  );

// Practice box — pushed down to avoid overlapping body text
const practiceY3 = 660;
doc.roundedRect(72, practiceY3, 468, 90, 4)
  .fillAndStroke(DARK, ORANGE);

doc.fontSize(10)
  .fillColor(ORANGE)
  .font('Helvetica-Bold')
  .text('PRACTICE', 90, practiceY3 + 10, { characterSpacing: 3 });

doc.fontSize(9.5)
  .fillColor(LIGHT_GRAY)
  .font('Helvetica')
  .text(
    `Add "Would I take this trade 1,000 times?" to your pre-trade checklist. If the answer isn't an immediate yes, cut position size in half or skip entirely. Log it. After 50 trades, compare the P&L of trades that passed vs. didn't.`,
    90, practiceY3 + 26,
    { width: 432, lineGap: 2, height: 52 }
  );

// ════════════════════════════════════════════════════════════════
//  PRINCIPLE 4: NON-ATTACHMENT
// ════════════════════════════════════════════════════════════════
doc.addPage();
doc.rect(0, 0, 612, 792).fill(BLACK);

drawPrincipleNumber(4, 60, '#8B5CF6');

doc.fontSize(22)
  .fillColor(WHITE)
  .font('Helvetica-Bold')
  .text('Non-Attachment to Outcomes', 120, 64);

doc.fontSize(10)
  .fillColor('#8B5CF6')
  .font('Helvetica')
  .text('BUDDHISM & STOICISM  •  EXECUTION', 120, 92, { characterSpacing: 2 });

drawHorizontalRule(115, '#8B5CF6');

// Quote
doc.fontSize(12)
  .fillColor(LIGHT_GRAY)
  .font('Helvetica-Oblique')
  .text(
    '"You have the right to work, but never to the fruit of work. You should never engage in action for the sake of reward."',
    90, 135,
    { width: 432, lineGap: 4 }
  );

doc.fontSize(10)
  .fillColor('#8B5CF6')
  .font('Helvetica-Bold')
  .text('— Bhagavad Gita 2.47', 90, 178);

drawHorizontalRule(200, '#8B5CF6');

doc.fontSize(11)
  .fillColor(LIGHT_GRAY)
  .font('Helvetica')
  .text(
    `Every major contemplative tradition — Buddhism, Stoicism, the Bhagavad Gita, Taoism — arrives at the same insight: attachment to outcomes is the root of suffering. And in trading, attachment to outcomes is the root of terrible execution.

Watch a trader who is attached to making money. They take profits too early because they're terrified of giving back gains. They let losers run because they can't bear to lock in a loss. They overtrade because they need the dopamine of being "right." They size up after a winning streak (overconfidence) and freeze after a losing streak (gun-shy). Their P&L controls their psychology, which controls their decisions, which controls their P&L. It's a vicious cycle.

Now watch a trader who is detached from outcomes. They follow their system. They take the entry when the setup appears, regardless of what happened yesterday. They take the stop when it's hit, without hesitation. They let winners run to their target because they don't need the emotional relief of booking a small profit. Their process is clean because their mind is clean.

The great paradox of non-attachment: you make more money when you care less about the money. Not because you become reckless, but because you become free — free from the emotional turbulence that destroys edge.

This is what the Buddhists call "right effort." You give everything to the process and release all grip on the result.`,
    72, 218,
    { width: 468, lineGap: 5, height: 420 }
  );

// Practice box — pushed down to avoid overlapping body text
const practiceY4 = 650;
doc.roundedRect(72, practiceY4, 468, 90, 4)
  .fillAndStroke(DARK, '#8B5CF6');

doc.fontSize(10)
  .fillColor('#8B5CF6')
  .font('Helvetica-Bold')
  .text('PRACTICE', 90, practiceY4 + 10, { characterSpacing: 3 });

doc.fontSize(9.5)
  .fillColor(LIGHT_GRAY)
  .font('Helvetica')
  .text(
    `For one full week, cover your P&L. Hide it — tape over it, use a browser extension. Trade only off your system's signals. At week's end, uncover it. Most traders find: (1) execution was cleaner, (2) they were more profitable. The P&L is a lagging indicator. Process is the leading one.`,
    90, practiceY4 + 26,
    { width: 432, lineGap: 2, height: 52 }
  );

// ════════════════════════════════════════════════════════════════
//  PRINCIPLE 5: PERSPECTIVISM
// ════════════════════════════════════════════════════════════════
doc.addPage();
doc.rect(0, 0, 612, 792).fill(BLACK);

drawPrincipleNumber(5, 60, GREEN);

doc.fontSize(22)
  .fillColor(WHITE)
  .font('Helvetica-Bold')
  .text('Perspectivism — Hold Both Theses', 120, 64);

doc.fontSize(10)
  .fillColor(GREEN)
  .font('Helvetica')
  .text('NIETZSCHE  •  ANALYSIS & CONVICTION', 120, 92, { characterSpacing: 2 });

drawHorizontalRule(115, GREEN);

// Quote
doc.fontSize(12)
  .fillColor(LIGHT_GRAY)
  .font('Helvetica-Oblique')
  .text(
    '"There are no facts, only interpretations."',
    90, 135,
    { width: 432, lineGap: 4 }
  );

doc.fontSize(10)
  .fillColor(GREEN)
  .font('Helvetica-Bold')
  .text('— Friedrich Nietzsche, Notebooks (1886-87)', 90, 162);

drawHorizontalRule(185, GREEN);

doc.fontSize(11)
  .fillColor(LIGHT_GRAY)
  .font('Helvetica')
  .text(
    `Nietzsche's perspectivism holds that there is no single, objective "truth" — only perspectives. Every interpretation is conditioned by the position of the observer. This isn't nihilism. It's intellectual humility at its most rigorous.

In the markets, perspectivism is a superpower.

Most traders are conviction addicts. They pick a thesis — bullish or bearish — and then only see confirming evidence. This is textbook confirmation bias, and it's the reason most investors underperform the index. They fall in love with their thesis and ignore everything that contradicts it.

A perspectivist trader does the opposite. They hold the bull case AND the bear case simultaneously. They don't ask "Is this stock going up?" They ask: "Under what conditions does this stock go up, and under what conditions does it go down?" Then they structure their trade to be robust against both scenarios.

This is why the best options traders are natural perspectivists. A well-structured spread doesn't need to be "right" about direction. It needs to accurately assess the range of possibilities and price them efficiently. You can profit from being wrong about direction if your assessment of volatility and risk/reward was correct.

Perspectivism also protects against conviction-based catastrophe. If you genuinely believe there are no unquestionable truths in the market, you will never put 50% of your portfolio into a single thesis. Because you know — really know — that you might be seeing the chart from a limited angle. And that humility is worth more than any technical indicator ever created.`,
    72, 203,
    { width: 468, lineGap: 5, height: 445 }
  );

// Practice box — pushed down to avoid overlapping body text
const practiceY5 = 660;
doc.roundedRect(72, practiceY5, 468, 90, 4)
  .fillAndStroke(DARK, GREEN);

doc.fontSize(10)
  .fillColor(GREEN)
  .font('Helvetica-Bold')
  .text('PRACTICE', 90, practiceY5 + 10, { characterSpacing: 3 });

doc.fontSize(9.5)
  .fillColor(LIGHT_GRAY)
  .font('Helvetica')
  .text(
    `For every trade idea, write the strongest bull case and the strongest bear case. Be ruthlessly honest in both. If you can't write a compelling bear case for your long, you don't understand the trade well enough to take it. This alone eliminates more bad trades than any indicator.`,
    90, practiceY5 + 26,
    { width: 432, lineGap: 2, height: 52 }
  );

// ════════════════════════════════════════════════════════════════
//  CLOSING PAGE
// ════════════════════════════════════════════════════════════════
doc.addPage();
doc.rect(0, 0, 612, 792).fill(BLACK);

doc.rect(72, 80, 468, 2).fill(ORANGE);

doc.fontSize(26)
  .fillColor(WHITE)
  .font('Helvetica-Bold')
  .text('What Now?', 72, 110);

doc.fontSize(11)
  .fillColor(LIGHT_GRAY)
  .font('Helvetica')
  .text(
    `These five principles — amor fati, shoshin, eternal recurrence, non-attachment, and perspectivism — are not trading "hacks." They are practices. They require repetition, discomfort, and honesty.

But here's what I can promise: if you take even one of these seriously — if you practice it daily for a month — you will not trade the same way you do right now.

I didn't discover these principles in a trading course. I discovered them in the pages of Nietzsche, on a meditation cushion, and on the jiu-jitsu mat. And when I brought them to the markets, everything changed.

The mind you bring to the screen matters more than anything on the screen.

If this resonated with you, I'd love to continue the conversation:`,
    72, 155,
    { width: 468, lineGap: 6 }
  );

// Links section
const linksY = 380;
doc.roundedRect(72, linksY, 468, 210, 4)
  .fillAndStroke(DARK, '#333333');

doc.fontSize(10)
  .fillColor(ORANGE)
  .font('Helvetica-Bold')
  .text('KEEP GOING', 90, linksY + 18, { characterSpacing: 3 });

doc.fontSize(11)
  .fillColor(WHITE)
  .font('Helvetica-Bold')
  .text('Fire Philosophy (Substack)', 90, linksY + 48);
doc.fontSize(9)
  .fillColor(GRAY)
  .font('Helvetica')
  .text('Weekly essays on Nietzsche, Zen, and how to live.', 90, linksY + 64);
doc.fontSize(9)
  .fillColor(ORANGE)
  .font('Helvetica')
  .text('firephilosophy.substack.com', 90, linksY + 76);

doc.fontSize(11)
  .fillColor(WHITE)
  .font('Helvetica-Bold')
  .text('Wall Street Wildlife (Podcast & YouTube)', 90, linksY + 96);
doc.fontSize(9)
  .fillColor(GRAY)
  .font('Helvetica')
  .text('Equity analysis for the untamed investor.', 90, linksY + 112);
doc.fontSize(9)
  .fillColor(ORANGE)
  .font('Helvetica')
  .text('youtube.com/@WallStreetWildlife', 90, linksY + 124);

doc.fontSize(11)
  .fillColor(WHITE)
  .font('Helvetica-Bold')
  .text('1:1 Coaching', 90, linksY + 144);
doc.fontSize(9)
  .fillColor(GRAY)
  .font('Helvetica')
  .text('Philosophy, trading psychology, and character development.', 90, linksY + 160);
doc.fontSize(9)
  .fillColor(ORANGE)
  .font('Helvetica')
  .text('krzysztofpiekarski.com', 90, linksY + 172);

// Sign-off
doc.fontSize(16)
  .fillColor(WHITE)
  .font('Helvetica-Bold')
  .text('Become who you are.', 72, 625);

doc.fontSize(12)
  .fillColor(ORANGE)
  .font('Helvetica-Bold')
  .text('— Krzysztof', 72, 652);

// Footer — kept within page bounds to avoid overflow to extra page
doc.rect(72, 680, 468, 1).fill('#333333');

doc.fontSize(8)
  .fillColor(GRAY)
  .font('Helvetica')
  .text(
    '© Krzysztof Piekarski. Feel free to share this guide with anyone who needs it.',
    72, 692,
    { width: 468, align: 'center' }
  );

// ─── Finalize ───
doc.end();

stream.on('finish', () => {
  console.log(`✅ PDF generated: ${outputPath}`);
  console.log(`   File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
});
