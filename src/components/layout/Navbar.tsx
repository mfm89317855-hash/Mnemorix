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
    const ok = auditChainIntegrity();
    if (ok) {
      soundChainVerified();
      alert('🔒 Merkle DAG Verification Passed!\nAll cryptographic blocks are valid and Ed25519 signatures match root anchor.');
    }
  }, [auditChainIntegrity]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0B0F1A]/90 backdrop-blur-xl shadow-lg">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          
          {/* Left Brand */}
          <div className="flex items-center space-x-3">
            <div
              onClick={() => {
                soundClick();
                setActiveTab('dashboard');
              }}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 overflow-hidden ${
                isChainCompromised
                  ? 'shadow-[0_0_20px_rgba(239,68,68,0.6)] ring-2 ring-red-500'
                  : 'shadow-[0_0_15px_rgba(239,68,68,0.25)] group-hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]'
              }`}>
                <img src="/logo.jpg" alt="MNEMORIX Logo" className="h-full w-full object-cover" />
                {isChainCompromised && (
                  <span className="absolute inset-0 rounded-xl bg-red-500 animate-ping opacity-30" />
                )}
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-display text-lg font-black tracking-tight text-white group-hover:text-red-400 transition-colors">
                    MNEMORIX
                  </span>
                  <span className="rounded-md bg-gradient-to-r from-red-600/30 to-rose-600/30 border border-red-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.2)]">
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
                className="hidden lg:flex items-center space-x-1.5 ml-3 rounded-lg border border-slate-800 bg-slate-900/90 hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-300 px-2.5 py-1 text-[11px] font-mono font-bold text-slate-300 transition-all shadow-xs"
                title="Return to Public Overview Landing Page"
              >
                <Home className="h-3.5 w-3.5 text-red-400" />
                <span>Overview</span>
              </button>
            )}
          </div>

          {/* Center — Live Status Indicator */}
          <div className="hidden md:flex items-center space-x-3">
            {isChainCompromised ? (
              <div className="flex items-center space-x-2.5 rounded-xl bg-red-950/60 border border-red-500/50 px-4 py-1.5 text-xs text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.25)] animate-threat-flash">
                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-alert-beacon" />
                <ShieldAlert className="h-4 w-4 text-red-400" />
                <span className="font-mono font-bold tracking-wider">MERKLE ROOT BREACH</span>
                <button
                  onClick={() => { soundClick(); selfHealChain(); }}
                  className="ml-1 rounded-lg bg-red-600 hover:bg-red-500 text-white px-3 py-0.5 text-[11px] font-bold transition-all shadow-[0_0_10px_rgba(239,68,68,0.5)] active:scale-95"
                >
                  ⚡ Self-Heal
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5 rounded-xl bg-slate-900/80 border border-slate-800 px-4 py-1.5 text-xs text-slate-300 shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-status-beacon shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="font-mono font-bold text-slate-200 tracking-wider">ZERO-TRUST ACTIVE</span>
                <span className="text-slate-700 font-mono">|</span>
                <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px] text-emerald-400 font-bold">100% INTEGRITY</span>
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
                  ? 'border-slate-800 bg-slate-900/80 text-slate-500 hover:text-slate-300'
                  : 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]'
              }`}
            >
              {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>

            {/* Fastn Platform */}
            <button
              onClick={() => { soundClick(); setIsFastnModalOpen(true); }}
              title="Connect MNEMORIX Firewall to Fastn AI Gateway"
              className="flex items-center space-x-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 px-2.5 sm:px-3 py-1.5 text-xs text-red-400 transition-all font-mono font-bold shadow-xs hover:shadow-[0_0_12px_rgba(239,68,68,0.2)]"
            >
              <Zap className="h-3.5 w-3.5 text-red-400" />
              <span className="hidden sm:inline">Fastn API</span>
            </button>

            {/* Integrity Audit */}
            <button
              onClick={handleAudit}
              title="Perform cryptographic verification across all Merkle blocks"
              className="hidden sm:flex items-center space-x-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-red-500/30 px-3 py-1.5 text-xs text-slate-300 transition-all font-mono shadow-xs font-semibold"
            >
              <RefreshCw className="h-3.5 w-3.5 text-red-400" />
              <span>Verify DAG</span>
            </button>

            {/* Compliance Report */}
            <button
              onClick={() => { soundClick(); setIsComplianceModalOpen(true); }}
              title="Generate SOC2 / ISO 42001 / NIST AI RMF certified report"
              className="flex items-center space-x-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-red-500/30 px-2.5 sm:px-3 py-1.5 text-xs text-slate-300 transition-all font-mono shadow-xs font-semibold"
            >
              <FileCheck className="h-3.5 w-3.5 text-red-400" />
              <span className="hidden sm:inline">Compliance</span>
            </button>

            {/* Gemini API Key Status */}
            <button
              onClick={() => { soundClick(); setIsSettingsModalOpen(true); }}
              className={`flex items-center space-x-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-mono transition-all shadow-xs ${
                hasGeminiKey
                  ? 'border-red-500/40 bg-red-500/15 text-red-300 hover:bg-red-500/25 shadow-[0_0_8px_rgba(239,68,68,0.2)]'
                  : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
              title="Configure Gemini 2.5 API Key & Security Parameters"
            >
              <Cpu className="h-3.5 w-3.5 text-red-400" />
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
                    className="flex items-center space-x-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 px-2 sm:px-2.5 py-1 transition-all shadow-xs group"
                    title={`Account: ${user.displayName || user.email}`}
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="h-6 w-6 rounded-full border border-red-400/50 object-cover"
                      />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white font-bold text-[10px]">
                        {(user.displayName || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="text-[11px] font-mono font-bold text-slate-200 hidden md:inline truncate max-w-[80px]">
                      {user.displayName?.split(' ')[0]}
                    </span>
                    <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-red-400 transition-colors" />
                  </button>

                  {/* Direct 1-Click Sign Out Quick Action */}
                  <button
                    onClick={() => {
                      soundClick();
                      logout();
                    }}
                    title="Sign Out from Active Session"
                    className="flex items-center justify-center h-8 w-8 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-red-500/15 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-all shadow-xs"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-red-500/30 bg-slate-950 p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 font-mono text-xs shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 mb-2">
                      <div className="flex items-center space-x-2">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt=""
                            className="h-8 w-8 rounded-full border border-red-400/50 object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                            {(user.displayName || 'U')[0].toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-white truncate">
                            {user.displayName}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Clearance:</span>
                        <span className="rounded bg-red-500/20 text-red-400 font-bold px-1.5 py-0.5 border border-red-500/30">
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
                        className="w-full flex items-center space-x-2 rounded-lg px-2.5 py-2 text-slate-300 hover:bg-slate-900 transition-colors text-left text-[11px]"
                      >
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span>Account Details &amp; Keys</span>
                      </button>

                      <button
                        onClick={() => {
                          soundClick();
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center space-x-2 rounded-lg px-2.5 py-2 text-red-400 hover:bg-red-500/10 transition-colors text-left text-[11px] font-bold"
                      >
                        <LogOut className="h-3.5 w-3.5 text-red-400" />
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
                className="flex items-center space-x-1.5 rounded-xl border border-red-500/40 bg-red-500/15 hover:bg-red-500/25 px-3 py-1.5 text-xs font-mono font-bold text-red-300 transition-all shadow-[0_0_12px_rgba(239,68,68,0.2)] active:scale-95"
                title="Sign In to MNEMORIX Sentinel"
              >
                <User className="h-3.5 w-3.5 text-red-400" />
                <span>Sign In</span>
              </button>
            )}

            {/* Sentinel AI Copilot */}
            <button
              onClick={() => { soundClick(); setIsCopilotOpen(!isCopilotOpen); }}
              className={`flex items-center space-x-1.5 rounded-xl px-3 sm:px-3.5 py-1.5 text-xs font-bold transition-all ${
                isCopilotOpen
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
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
