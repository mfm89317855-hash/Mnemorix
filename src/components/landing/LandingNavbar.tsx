import React from 'react';
import {
  ShieldCheck,
  Shield,
  ArrowRight,
  Sparkles,
  Lock,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { soundClick } from '../../lib/sound';

interface LandingNavbarProps {
  onLaunchConsole: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onLaunchConsole }) => {
  const { user, setIsAuthModalOpen } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md transition-all shadow-xs">
      {/* Top Red Laser Accent Stripe */}
      <div className="h-[2px] w-full bg-gradient-to-r from-red-600 via-rose-500 to-red-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 shadow-md shadow-red-500/25">
            <ShieldCheck className="h-5 w-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display text-base font-black tracking-wider text-slate-950">
                MNEMORIX
              </span>
              <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-mono font-bold text-red-700 border border-red-200">
                SENTINEL
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500 tracking-tight hidden sm:block">
              Zero-Trust AI Memory Firewall
            </p>
          </div>
        </div>

        {/* Navigation Anchor Links */}
        <nav className="hidden md:flex items-center space-x-7 text-xs font-mono text-slate-600 font-semibold">
          <a href="#features" className="hover:text-red-600 transition-colors">
            Architecture
          </a>
          <a href="#demo" className="hover:text-red-600 transition-colors">
            Live Sandbox
          </a>
          <a href="#merkle" className="hover:text-red-600 transition-colors">
            Merkle DAG
          </a>
          <a href="#compliance" className="hover:text-red-600 transition-colors">
            Compliance
          </a>
          <a href="#pricing" className="hover:text-red-600 transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-red-600 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Actions (Google Auth & Launch Console) */}
        <div className="flex items-center space-x-3">
          
          {/* Google Auth Status / Trigger Button */}
          {user ? (
            <button
              onClick={() => { soundClick(); setIsAuthModalOpen(true); }}
              className="flex items-center space-x-2 rounded-xl border border-red-200 bg-red-50/80 hover:bg-red-100/80 px-2.5 py-1.5 text-xs font-mono transition-all shadow-2xs"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="h-6 w-6 rounded-full border border-red-300 object-cover"
                />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white font-bold text-[10px]">
                  {(user.displayName || 'U')[0].toUpperCase()}
                </div>
              )}
              <span className="font-bold text-slate-800 hidden sm:inline truncate max-w-[100px]">
                {user.displayName?.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={() => { soundClick(); setIsAuthModalOpen(true); }}
              className="flex items-center space-x-2 rounded-xl border border-slate-300 bg-white hover:border-red-400 hover:bg-red-50/30 px-3 py-1.5 text-xs font-mono font-semibold text-slate-700 transition-all shadow-2xs"
            >
              {/* Google G icon */}
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="hidden sm:inline">Sign in with Google</span>
              <span className="sm:hidden">Sign In</span>
            </button>
          )}

          {/* Primary CTA: Launch Console */}
          <button
            onClick={() => { soundClick(); onLaunchConsole(); }}
            className="group flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2 text-xs font-mono font-bold transition-all shadow-md shadow-red-500/20 active:scale-95"
          >
            <span>Launch Console</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </header>
  );
};
