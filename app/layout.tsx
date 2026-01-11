import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Krzysztof Piekarski | Philosopher, Analyst & Investor",
  description: "I help people break through mental barriers and reinvent who they are. I also teach professional-level investing to beat the indexes in the stock market.",
  keywords: ["philosophy", "consulting", "investing", "stock market", "personal development", "Krzysztof Piekarski", "Wall Street Wildlife", "options trading"],
  authors: [{ name: "Krzysztof Piekarski" }],
  creator: "Krzysztof Piekarski",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://krzysztofpiekarski.netlify.app",
    siteName: "Krzysztof Piekarski",
    title: "Krzysztof Piekarski | Philosopher, Analyst & Investor",
    description: "I help people break through mental barriers and reinvent who they are. I also teach professional-level investing to beat the indexes.",
    images: [
      {
        url: "/krzysztof.jpg",
        width: 1200,
        height: 630,
        alt: "Krzysztof Piekarski",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Krzysztof Piekarski | Philosopher, Analyst & Investor",
    description: "I help people break through mental barriers and reinvent who they are. Professional investing education.",
    creator: "@7FlyingPlatypus",
    images: ["/krzysztof.jpg"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
