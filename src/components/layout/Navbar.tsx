import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Shield,
  FileCheck,
  RefreshCw,
  Cpu,
  Sparkles,
  Key,
  Zap,
  Volume2,
  VolumeX,
  Activity,
  Home,
  LogOut,
  Lock,
  User,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';
import { useAuth } from '../../context/AuthContext';
import { getStoredGeminiKey } from '../../lib/gemini';
import { FastnModal } from './FastnModal';
import { soundClick, soundChainVerified, isSoundMuted, toggleSoundMute } from '../../lib/sound';

interface NavbarProps {
  onBackToLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onBackToLanding }) => {
  const {
    isChainCompromised,
    selfHealChain,
    auditChainIntegrity,
    isCopilotOpen,
    setIsCopilotOpen,
    setIsSettingsModalOpen,
    setIsComplianceModalOpen,
    setActiveTab,
  } = useSentinel();

  const { user, setIsAuthModalOpen, logout } = useAuth();
  const [isFastnModalOpen, setIsFastnModalOpen] = useState(false);
  const [muted, setMuted] = useState(isSoundMuted());
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const apiKey = getStoredGeminiKey();
  const hasGeminiKey = Boolean(apiKey && apiKey.length > 5);

  const handleMuteToggle = useCallback(() => {
    const next = toggleSoundMute();
    setMuted(next);
  }, []);

  const handleAudit = useCallback(() => {
    soundClick();
    auditChainIntegrity();
    setTimeout(() => soundChainVerified(), 600);
  }, [auditChainIntegrity]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/96 backdrop-blur-xl shadow-sm">
        
        {/* Ultra-thin accent line at very top */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60" />
        
        <div className="mx-auto flex h-15 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-2">

          {/* Left: Brand Logo + Landing Page Link */}
          <div className="flex items-center space-x-3">
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => { soundClick(); setActiveTab('dashboard'); }}
            >
              <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl shadow-md transition-all duration-300 overflow-hidden ${
                isChainCompromised
                  ? 'shadow-red-500/30 glow-red ring-2 ring-red-500'
                  : 'shadow-red-500/20 group-hover:shadow-red-500/40'
              }`}>
                <img src="/logo.jpg" alt="MNEMORIX Logo" className="h-full w-full object-cover" />
                {isChainCompromised && (
                  <span className="absolute inset-0 rounded-xl bg-red-500 animate-ping opacity-30" />
                )}
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-display text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-red-700 transition-colors">
                    MNEMORIX
                  </span>
                  <span className="rounded-md bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 px-2 py-0.5 text-[10px] font-mono font-bold text-red-600 shadow-xs">
                    SENTINEL
                  </span>
                </div>
                <p className="text-[10px] font-mono text-slate-400 font-medium tracking-wide">
                  Zero-Trust AI Memory Firewall
                </p>
              </div>
            </div>

            {/* Back to Landing Button */}
            {onBackToLanding && (
              <button
                onClick={() => { soundClick(); onBackToLanding(); }}
                className="hidden lg:flex items-center space-x-1.5 ml-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-300 hover:text-red-700 px-2.5 py-1 text-[11px] font-mono font-bold text-slate-600 transition-all"
                title="Return to Public Overview Landing Page"
              >
                <Home className="h-3.5 w-3.5 text-red-600" />
                <span>Overview</span>
              </button>
            )}
          </div>

          {/* Center — Live Status Indicator */}
          <div className="hidden md:flex items-center space-x-3">
            {isChainCompromised ? (
              <div className="flex items-center space-x-2.5 rounded-xl bg-red-50 border border-red-300 px-4 py-1.5 text-xs text-red-700 shadow-sm animate-threat-flash">
                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-alert-beacon" />
                <ShieldAlert className="h-4 w-4 text-red-600" />
                <span className="font-mono font-bold tracking-wider">MERKLE ROOT BREACH</span>
                <button
                  onClick={() => { soundClick(); selfHealChain(); }}
                  className="ml-1 rounded-lg bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 text-[11px] font-bold transition-all shadow-sm active:scale-95"
                >
                  ⚡ Self-Heal
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5 rounded-xl bg-slate-50/80 border border-slate-200 px-4 py-1.5 text-xs text-slate-700 shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-status-beacon" />
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="font-mono font-bold text-slate-900 tracking-wider">ZERO-TRUST ACTIVE</span>
                <span className="text-slate-300 font-mono">|</span>
                <Activity className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                <span className="font-mono text-[11px] text-emerald-700 font-bold">100% INTEGRITY</span>
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">

            {/* Sound Mute Toggle */}
            <button
              onClick={handleMuteToggle}
              title={muted ? 'Unmute tactical audio' : 'Mute tactical audio'}
              className={`flex items-center justify-center h-8 w-8 rounded-xl border transition-all shadow-xs ${
                muted
                  ? 'border-slate-200 bg-white text-slate-400 hover:text-slate-600'
                  : 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
              }`}
            >
              {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>

            {/* Fastn Platform */}
            <button
              onClick={() => { soundClick(); setIsFastnModalOpen(true); }}
              title="Connect MNEMORIX Firewall to Fastn AI Gateway"
              className="flex items-center space-x-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 px-2.5 sm:px-3 py-1.5 text-xs text-red-700 transition-all font-mono font-bold shadow-xs hover:shadow-sm"
            >
              <Zap className="h-3.5 w-3.5 text-red-600" />
              <span className="hidden sm:inline">Fastn API</span>
            </button>

            {/* Integrity Audit */}
            <button
              onClick={handleAudit}
              title="Perform cryptographic verification across all Merkle blocks"
              className="hidden sm:flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-red-300 px-3 py-1.5 text-xs text-slate-700 transition-all font-mono shadow-xs font-semibold"
            >
              <RefreshCw className="h-3.5 w-3.5 text-red-600" />
              <span>Verify DAG</span>
            </button>

            {/* Compliance Report */}
            <button
              onClick={() => { soundClick(); setIsComplianceModalOpen(true); }}
              title="Generate SOC2 / ISO 42001 / NIST AI RMF certified report"
              className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-red-300 px-2.5 sm:px-3 py-1.5 text-xs text-slate-700 transition-all font-mono shadow-xs font-semibold"
            >
              <FileCheck className="h-3.5 w-3.5 text-red-600" />
              <span className="hidden sm:inline">Compliance</span>
            </button>

            {/* Gemini API Key Status */}
            <button
              onClick={() => { soundClick(); setIsSettingsModalOpen(true); }}
              className={`flex items-center space-x-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-mono transition-all shadow-xs ${
                hasGeminiKey
                  ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
                  : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
              title="Configure Gemini 2.5 API Key & Security Parameters"
            >
              <Cpu className="h-3.5 w-3.5 text-red-600" />
              <span className="hidden sm:inline">{hasGeminiKey ? 'Gemini Active' : 'API Key'}</span>
              <Key className="h-3 w-3 opacity-60" />
            </button>

            {/* Sign In & Sign Out User Controls */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <div className="flex items-center space-x-1">
                  {/* User Profile Trigger Button */}
                  <button
                    onClick={() => {
                      soundClick();
                      setIsUserMenuOpen(!isUserMenuOpen);
                    }}
                    className="flex items-center space-x-2 rounded-xl border border-red-200 bg-red-50/80 hover:bg-red-100/80 px-2 sm:px-2.5 py-1 transition-all shadow-2xs group"
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
                    <span className="text-[11px] font-mono font-bold text-slate-800 hidden md:inline truncate max-w-[80px]">
                      {user.displayName?.split(' ')[0]}
                    </span>
                    <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-red-600 transition-colors" />
                  </button>

                  {/* Direct 1-Click Sign Out Quick Action */}
                  <button
                    onClick={() => {
                      soundClick();
                      logout();
                    }}
                    title="Sign Out from Active Session"
                    className="flex items-center justify-center h-8 w-8 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-300 text-slate-500 hover:text-red-600 transition-all shadow-2xs"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border-2 border-red-500/20 bg-white p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 font-mono text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 mb-2">
                      <div className="flex items-center space-x-2">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt=""
                            className="h-8 w-8 rounded-full border border-red-300 object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                            {(user.displayName || 'U')[0].toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 truncate">
                            {user.displayName}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500">Clearance:</span>
                        <span className="rounded bg-red-100 text-red-700 font-bold px-1.5 py-0.2 border border-red-200">
                          LEVEL-4 SEC-OPS
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          soundClick();
                          setIsUserMenuOpen(false);
                          setIsAuthModalOpen(true);
                        }}
                        className="w-full flex items-center space-x-2 rounded-lg px-2.5 py-2 text-slate-700 hover:bg-slate-100 transition-colors text-left text-[11px]"
                      >
                        <User className="h-3.5 w-3.5 text-slate-500" />
                        <span>Account Details & Keys</span>
                      </button>

                      <button
                        onClick={() => {
                          soundClick();
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center space-x-2 rounded-lg px-2.5 py-2 text-red-600 hover:bg-red-50 transition-colors text-left text-[11px] font-bold"
                      >
                        <LogOut className="h-3.5 w-3.5 text-red-600" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Sign In Button */
              <button
                onClick={() => {
                  soundClick();
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center space-x-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 px-3 py-1.5 text-xs font-mono font-bold text-red-700 transition-all shadow-2xs active:scale-95"
                title="Sign In to MNEMORIX Sentinel"
              >
                <User className="h-3.5 w-3.5 text-red-600" />
                <span>Sign In</span>
              </button>
            )}

            {/* Sentinel AI Copilot */}
            <button
              onClick={() => { soundClick(); setIsCopilotOpen(!isCopilotOpen); }}
              className={`flex items-center space-x-1.5 rounded-xl px-3 sm:px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm ${
                isCopilotOpen
                  ? 'bg-slate-900 text-white shadow-slate-900/20'
                  : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-red-500/25'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="font-mono">Copilot</span>
            </button>
          </div>
        </div>
      </header>

      <FastnModal isOpen={isFastnModalOpen} onClose={() => setIsFastnModalOpen(false)} />
    </>
  );
};
