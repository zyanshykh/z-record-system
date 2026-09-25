import React from 'react';

export const metadata = {
  title: 'Z Record System - Dominoes Score Tracker',
  description:
    'Never lose track of a point again. Personal score tracker for Dominoes games with 100-bust rules, real-time live cards, round-by-round undo, and local storage.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 antialiased selection:bg-amber-500 selection:text-black flex flex-col justify-between transition-colors duration-200">
      <div className="flex-1">{children}</div>
      <footer className="border-t border-zinc-200 dark:border-zinc-900 bg-white/60 dark:bg-zinc-950/80 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">Z Record System</span>
            <span className="text-zinc-400 dark:text-zinc-600">•</span>
            <span>Never lose track of a point again.</span>
          </div>
          <span className="text-zinc-400 dark:text-zinc-500 text-[11px]">
            100% Client-Side LocalStorage • Zero-Config Vercel Deployable
          </span>
        </div>
      </footer>
    </div>
  );
}
