import React from 'react';
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
} from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';
import { getStoredGeminiKey } from '../../lib/gemini';
import { FastnModal } from './FastnModal';

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

  const [isFastnModalOpen, setIsFastnModalOpen] = React.useState(false);

  const apiKey = getStoredGeminiKey();
  const hasGeminiKey = Boolean(apiKey && apiKey.length > 5);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-md shadow-red-600/20">
              {isChainCompromised ? (
                <ShieldAlert className="h-5 w-5 animate-pulse text-white" />
              ) : (
                <Shield className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display text-lg font-extrabold tracking-tight text-slate-900">
                  MNEMORIX
                </span>
                <span className="rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-mono font-bold text-red-600 border border-red-200">
                  SENTINEL v2.5
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-500 font-medium">
                Autonomous AI Memory Firewall & Merkle DAG
              </p>
            </div>
          </div>

          {/* Center Live Shield Status */}
          <div className="hidden md:flex items-center space-x-3">
            {isChainCompromised ? (
              <div className="flex items-center space-x-2 rounded-xl bg-red-50 border border-red-300 px-3.5 py-1 text-xs text-red-700 shadow-xs">
                <ShieldAlert className="h-4 w-4 text-red-600 animate-pulse" />
                <span className="font-mono font-bold">MERKLE ROOT INTEGRITY BROKEN</span>
                <button
                  onClick={selfHealChain}
                  className="ml-2 rounded-lg bg-red-600 hover:bg-red-700 text-white px-2.5 py-0.5 text-[11px] font-bold transition-all shadow-xs active:scale-95"
                >
                  Auto Self-Heal ⚡
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-1 text-xs text-slate-700">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="font-mono font-bold text-slate-900">ZERO-TRUST ACTIVE</span>
                <span className="text-slate-300 font-mono">|</span>
                <span className="font-mono text-[11px] text-slate-600">100% MERKLE INTEGRITY</span>
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Fastn Platform Button */}
            <button
              onClick={() => setIsFastnModalOpen(true)}
              title="Connect MNEMORIX Firewall to Fastn AI Gateway"
              className="flex items-center space-x-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 text-xs text-red-700 transition-all font-mono font-bold shadow-2xs"
            >
              <Zap className="h-3.5 w-3.5 text-red-600" />
              <span className="hidden sm:inline">Fastn API</span>
            </button>

            {/* Quick Integrity Audit Button */}
            <button
              onClick={() => auditChainIntegrity()}
              title="Perform cryptographic verification across all Merkle blocks"
              className="hidden sm:flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-red-300 px-3 py-1.5 text-xs text-slate-700 transition-all font-mono shadow-2xs font-semibold"
            >
              <RefreshCw className="h-3.5 w-3.5 text-red-600" />
              <span>Verify DAG</span>
            </button>

            {/* Compliance Report Modal */}
            <button
              onClick={() => setIsComplianceModalOpen(true)}
              title="Generate SOC2 / ISO 42001 / NIST AI RMF certified report"
              className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-red-300 px-3 py-1.5 text-xs text-slate-700 transition-all font-mono shadow-2xs font-semibold"
            >
              <FileCheck className="h-3.5 w-3.5 text-red-600" />
              <span className="hidden sm:inline">Compliance</span>
            </button>

            {/* Gemini AI Status / Settings */}
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className={`flex items-center space-x-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-mono transition-all shadow-2xs ${
                hasGeminiKey
                  ? 'border-red-300 bg-red-50 text-red-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
              title="Configure Gemini 2.5 API Key & Security Parameters"
            >
              <Cpu className="h-3.5 w-3.5 text-red-600" />
              <span className="hidden sm:inline">{hasGeminiKey ? 'Gemini 2.5 Active' : 'API Key'}</span>
              <Key className="h-3 w-3 opacity-60 ml-0.5" />
            </button>

            {/* Sentinel AI Copilot Drawer Toggle */}
            <button
              onClick={() => setIsCopilotOpen(!isCopilotOpen)}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm ${
                isCopilotOpen
                  ? 'bg-slate-900 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="font-mono">Copilot</span>
            </button>
          </div>
        </div>
      </header>

      {/* Fastn Platform Integration Guide Modal */}
      <FastnModal isOpen={isFastnModalOpen} onClose={() => setIsFastnModalOpen(false)} />
    </>
  );
};
