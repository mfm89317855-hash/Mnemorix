import React, { useState, useCallback } from 'react';
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
} from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';
import { getStoredGeminiKey } from '../../lib/gemini';
import { FastnModal } from './FastnModal';
import { soundClick, soundChainVerified, isSoundMuted, toggleSoundMute } from '../../lib/sound';

export const Navbar: React.FC = () => {
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

  const [isFastnModalOpen, setIsFastnModalOpen] = useState(false);
  const [muted, setMuted] = useState(isSoundMuted());

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

          {/* Brand Logo + Name */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => { soundClick(); setActiveTab('dashboard'); }}
          >
            <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl shadow-md transition-all duration-300 ${
              isChainCompromised
                ? 'bg-red-600 shadow-red-500/30 glow-red'
                : 'bg-red-600 shadow-red-500/20 group-hover:shadow-red-500/40'
            }`}>
              {isChainCompromised ? (
                <ShieldAlert className="h-5 w-5 animate-pulse text-white" />
              ) : (
                <Shield className="h-5 w-5 text-white transition-transform group-hover:scale-110" />
              )}
              {/* Pulse ring on compromise */}
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
                  SENTINEL v2.5
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 font-medium tracking-wide">
                Zero-Trust AI Memory Firewall
              </p>
            </div>
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
