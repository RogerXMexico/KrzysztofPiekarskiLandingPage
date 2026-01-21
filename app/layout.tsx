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
  description: "I help people break through mental barriers and reinvent who they are. I also teach professional-level investing to beat the indexes in the stock market.",
  keywords: ["philosophy", "consulting", "investing", "stock market", "personal development", "Krzysztof Piekarski", "Wall Street Wildlife", "options trading"],
  authors: [{ name: "Krzysztof Piekarski" }],
  creator: "Krzysztof Piekarski",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
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
    description: "I help people break through mental barriers and reinvent who they are. I also teach professional-level investing to beat the indexes.",
    // Images auto-generated from opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: "Krzysztof Piekarski | Philosopher, Analyst & Investor",
    description: "I help people break through mental barriers and reinvent who they are. Professional investing education.",
    creator: "@7FlyingPlatypus",
    // Images auto-generated from twitter-image.tsx
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${permanentMarker.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
