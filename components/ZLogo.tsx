import React from 'react';

interface ZLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ZLogo: React.FC<ZLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-14 w-14 text-2xl',
  };

  return (
    <div
      className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-zinc-950 font-black shadow-md shadow-amber-500/10 transition-transform active:scale-95 ${sizeClasses[size]} ${className}`}
      aria-label="Z Record System Logo"
    >
      {/* Precision Geometric Monogram "Z" */}
      <svg
        viewBox="0 0 32 32"
        fill="currentColor"
        className="h-6 w-6 text-zinc-950 drop-shadow-sm"
      >
        {/* Modern styled Z with domino divider accent */}
        <path
          d="M7 8h18c.8 0 1.2.9.7 1.5L11.5 24H25c.6 0 1 .4 1 1s-.4 1-1 1H7c-.8 0-1.2-.9-.7-1.5L20.5 10H7c-.6 0-1-.4-1-1s.4-1 1-1z"
          fillRule="evenodd"
        />
        {/* Subtle Domino Dot Accent */}
        <circle cx="21" cy="7.5" r="1.5" fill="#18181b" opacity="0.4" />
        <circle cx="11" cy="24.5" r="1.5" fill="#18181b" opacity="0.4" />
      </svg>
    </div>
  );
};
