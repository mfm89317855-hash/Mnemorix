import React from 'react';
import {
  ShieldCheck,
  Shield,
  ArrowRight,
  Sparkles,
  Lock,
  User,
  LogOut,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { soundClick } from '../../lib/sound';

interface LandingNavbarProps {
  onLaunchConsole: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onLaunchConsole }) => {
  const { user, setIsAuthModalOpen, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md transition-all shadow-xs">
      {/* Top Red Laser Accent Stripe */}
      <div className="h-[2px] w-full bg-gradient-to-r from-red-600 via-rose-500 to-red-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative flex h-10 w-10 overflow-hidden items-center justify-center rounded-xl shadow-md shadow-red-500/25 border border-red-200">
            <img src="/logo.jpg" alt="MNEMORIX Sentinel" className="h-full w-full object-cover" />
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
          
          {/* User Sign In / Sign Out Controls */}
          {user ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  soundClick();
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center space-x-2 rounded-xl border border-red-200 bg-red-50/80 hover:bg-red-100/80 px-2.5 py-1.5 text-xs font-mono transition-all shadow-2xs"
                title={`Account: ${user.displayName || user.email}`}
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

              <button
                onClick={() => {
                  soundClick();
                  logout();
                }}
                title="Sign Out from Active Session"
                className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-300 text-slate-600 hover:text-red-700 px-3 py-1.5 text-xs font-mono font-bold transition-all shadow-2xs"
              >
                <LogOut className="h-3.5 w-3.5 text-red-600" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                soundClick();
                setIsAuthModalOpen(true);
              }}
              className="flex items-center space-x-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 px-3.5 py-1.5 text-xs font-mono font-bold text-red-700 transition-all shadow-2xs active:scale-95"
              title="Sign In to Enterprise Portal"
            >
              <User className="h-3.5 w-3.5 text-red-600" />
              <span>Sign In</span>
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
