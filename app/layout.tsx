import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Z Record System - Dominoes Score Tracker',
  description:
    'Never lose track of a point again. Personal score tracker for Dominoes games with 100-bust rules, real-time live cards, round-by-round undo, and local storage.',
  openGraph: {
    title: 'Z Record System - Dominoes Score Tracker',
    description:
      'Never lose track of a point again. Personal score tracker for Dominoes games with 100-bust rules, real-time live cards, round-by-round undo, and local storage.',
    type: 'website',
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23f59e0b'/%3E%3Cpath d='M8 9h16c.7 0 1 .8.6 1.3L11.5 23H24c.6 0 1 .4 1 1s-.4 1-1 1H8c-.7 0-1-.8-.6-1.3L20.5 11H8c-.6 0-1-.4-1-1s.4-1 1-1z' fill='%2309090b'/%3E%3Ccircle cx='20.5' cy='8.5' r='1.2' fill='%2378350f'/%3E%3Ccircle cx='11.5' cy='23.5' r='1.2' fill='%2378350f'/%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#f59e0b',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 antialiased selection:bg-amber-500 selection:text-black flex flex-col justify-between transition-colors duration-200">
        <div className="flex-1">{children}</div>
        <footer className="border-t border-zinc-200 dark:border-zinc-900 bg-white/60 dark:bg-zinc-950/80 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-800 dark:text-zinc-200">Z Record System</span>
              <span className="text-zinc-400 dark:text-zinc-600">•</span>
              <span>Never lose track of a point again.</span>
            </div>
            <span className="text-zinc-400 dark:text-zinc-500 text-[11px]">
              Next.js 14 App Router • Local-first with optional Supabase sync • Vercel Deployable
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
