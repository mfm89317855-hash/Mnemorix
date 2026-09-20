import React from 'react';

interface MnemorixMarkProps {
  className?: string;
}

export const MnemorixMark: React.FC<MnemorixMarkProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M16 2.75 27 9v14L16 29.25 5 23V9L16 2.75Z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9.75 21V11l6.25 5.1L22.25 11v10" stroke="currentColor" strokeWidth="2.15" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9.75" cy="10.75" r="1.5" fill="currentColor" />
    <circle cx="22.25" cy="10.75" r="1.5" fill="currentColor" />
    <circle cx="16" cy="16" r="1.35" fill="currentColor" />
  </svg>
);
