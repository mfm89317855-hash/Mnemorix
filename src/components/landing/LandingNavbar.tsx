import React from 'react';
import {
  ShieldCheck,
  ArrowRight,
  User,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { soundClick } from '../../lib/sound';

interface LandingNavbarProps {
  onLaunchConsole: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onLaunchConsole }) => {
  const { user, setIsAuthModalOpen, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#06080F]/80 backdrop-blur-2xl transition-all">
      {/* Top Neon Accent Line */}
      <div className="neon-line-thick" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative flex h-10 w-10 overflow-hidden items-center justify-center rounded-xl shadow-lg shadow-red-500/20 border border-red-500/30 ring-1 ring-red-500/10">
            <img src="/logo.jpg" alt="MNEMORIX Sentinel" className="h-full w-full object-cover" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display text-base font-black tracking-wider text-white group-hover:text-red-400 transition-colors">
                MNEMORIX
              </span>
              <span className="rounded-md bg-red-500/15 px-2 py-0.5 text-[10px] font-mono font-bold text-red-400 border border-red-500/25">
                SENTINEL
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500 tracking-tight hidden sm:block">
              Zero-Trust AI Memory Firewall
            </p>
          </div>
        </div>

        {/* Navigation Anchor Links */}
        <nav className="hidden md:flex items-center space-x-7 text-xs font-mono text-slate-400 font-semibold">
          {['Architecture', 'Live Sandbox', 'Merkle DAG', 'Compliance', 'Pricing', 'FAQ'].map((label, i) => {
            const hrefs = ['#features', '#demo', '#merkle', '#compliance', '#pricing', '#faq'];
            return (
              <a
                key={label}
                href={hrefs[i]}
                className="relative hover:text-red-400 transition-colors duration-200 group"
              >
                {label}
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-red-500 group-hover:w-full transition-all duration-300 shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
              </a>
            );
          })}
        </nav>

        {/* Actions (Google Auth & Launch Console) */}
        <div className="flex items-center space-x-3">
          
          {/* User Sign In / Sign Out Controls */}
          {user ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => { soundClick(); setIsAuthModalOpen(true); }}
                className="flex items-center space-x-2 rounded-xl border border-red-500/20 bg-red-500/8 hover:bg-red-500/15 px-2.5 py-1.5 text-xs font-mono transition-all"
                title={`Account: ${user.displayName || user.email}`}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="h-6 w-6 rounded-full border border-red-500/30 object-cover"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white font-bold text-[10px]">
                    {(user.displayName || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="font-bold text-slate-300 hidden sm:inline truncate max-w-[100px]">
                  {user.displayName?.split(' ')[0]}
                </span>
              </button>

              <button
                onClick={() => { soundClick(); logout(); }}
                title="Sign Out from Active Session"
                className="flex items-center space-x-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-red-500/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 px-3 py-1.5 text-xs font-mono font-bold transition-all"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => { soundClick(); setIsAuthModalOpen(true); }}
              className="flex items-center space-x-2 rounded-xl border border-red-500/25 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/40 px-3.5 py-1.5 text-xs font-mono font-bold text-red-400 transition-all active:scale-95"
              title="Sign In to Enterprise Portal"
            >
              <User className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Primary CTA: Launch Console */}
          <button
            onClick={() => { soundClick(); onLaunchConsole(); }}
            className="group flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-red-500 text-white px-4 py-2 text-xs font-mono font-bold transition-all shadow-lg shadow-red-500/25 active:scale-95 border border-red-400/30"
          >
            <span>Launch Console</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </header>
  );
};
