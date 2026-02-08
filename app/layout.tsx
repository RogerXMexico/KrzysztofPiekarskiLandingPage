import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Permanent_Marker } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const permanentMarker = Permanent_Marker({
  weight: "400",
  variable: "--font-permanent-marker",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://krzysztofpiekarski.netlify.app"),
  title: "Krzysztof Piekarski | Philosopher, Analyst & Investor",
  description: "Philosopher, investor, and author of a dissertation on Buddhist Philosophy in David Foster Wallace. Founder of Fire Philosophy (Nietzsche, Zen) and co-host of Wall Street Wildlife. I help people break through mental barriers and beat the indexes.",
  keywords: [
    "Krzysztof Piekarski",
    "Fire Philosophy",
    "Wall Street Wildlife",
    "Wall Street Wildlife YouTube",
    "Wall Street Wildlife podcast",
    "David Foster Wallace",
    "Buddhist philosophy",
    "Nietzsche",
    "Zen",
    "philosophy",
    "options trading",
    "investing",
    "investing podcast",
    "stock market",
    "Character By Design",
    "personal development",
    "Hakomi",
    "IFS",
    "Dale Wright",
    "Luke Hallard"
  ],
  authors: [{ name: "Krzysztof Piekarski" }],
  creator: "Krzysztof Piekarski",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://krzysztofpiekarski.netlify.app",
    siteName: "Krzysztof Piekarski",
    title: "Krzysztof Piekarski | Philosopher, Analyst & Investor",
    description: "Founder of Fire Philosophy (Nietzsche, Zen) and co-host of Wall Street Wildlife. PhD on Buddhist Philosophy in David Foster Wallace. Philosophy for the mind, strategy for the markets.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Krzysztof Piekarski - Philosophy for the mind, strategy for the markets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Krzysztof Piekarski | Philosopher, Analyst & Investor",
    description: "Founder of Fire Philosophy (Nietzsche, Zen) and co-host of Wall Street Wildlife. PhD on Buddhist Philosophy in David Foster Wallace.",
    creator: "@7FlyingPlatypus",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://krzysztofpiekarski.netlify.app",
  },
  other: {
    "google-site-verification": "K6C-kPYkKOya1NSOohaLfvRbraNory8IJWHyl3JSHyY"
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://krzysztofpiekarski.netlify.app/#website",
      "url": "https://krzysztofpiekarski.netlify.app",
      "name": "Krzysztof Piekarski",
      "description": "Philosopher, investor, and author. Fire Philosophy, Wall Street Wildlife, Character By Design.",
      "publisher": {
        "@id": "https://krzysztofpiekarski.netlify.app/#person"
      }
    },
    {
      "@type": "Person",
      "@id": "https://krzysztofpiekarski.netlify.app/#person",
      "name": "Krzysztof Piekarski",
      "givenName": "Krzysztof",
      "familyName": "Piekarski",
      "jobTitle": ["Philosopher", "Investor", "Writer", "Consultant"],
      "description": "PhD in English Literature from UT Austin. Dissertation on Buddhist Philosophy in David Foster Wallace. Founder of Fire Philosophy and co-host of Wall Street Wildlife.",
      "alumniOf": [
        {
          "@type": "CollegeOrUniversity",
          "name": "University of Texas at Austin"
        },
        {
          "@type": "CollegeOrUniversity",
          "name": "Williams College"
        }
      ],
      "knowsAbout": [
        "Philosophy",
        "Nietzsche",
        "Zen Buddhism",
        "David Foster Wallace",
        "Buddhist Philosophy",
        "Options Trading",
        "Stock Market Investing",
        "Hakomi",
        "Internal Family Systems",
        "Character Development"
      ],
      "sameAs": [
        "https://firephilosophy.substack.com/",
        "https://www.youtube.com/@WallStreetWildlife",
        "https://www.patreon.com/wallstreetwildlife",
        "https://podcasts.apple.com/us/podcast/wall-street-wildlife-investing-podcast/id1532017249",
        "https://open.spotify.com/show/27AqyYq2a8KOwse0KyO8iz",
        "https://www.linkedin.com/in/krzysztof-piekarski-0780762b/",
        "https://substack.com/@firephilosophy",
        "https://www.huffpost.com/author/krzysztof-piekarski",
        "https://liberalarts.utexas.edu/rhetoric/faculty/kp687",
        "https://twitter.com/7FlyingPlatypus"
      ],
      "url": "https://krzysztofpiekarski.netlify.app",
      "image": "https://krzysztofpiekarski.netlify.app/krzysztof.jpg"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${permanentMarker.variable} antialiased`}
      >
        {/* Hidden form for Netlify to detect at build time */}
        <form name="newsletter" data-netlify="true" hidden>
          <input type="email" name="email" />
        </form>
        {children}
      </body>
    </html>
  );
}
