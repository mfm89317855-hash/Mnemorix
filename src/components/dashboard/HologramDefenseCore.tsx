import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Flame,
  Zap,
  Sparkles,
  Boxes,
  Activity,
  Lock,
} from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';
import { soundSelfHeal, soundClick } from '../../lib/sound';

export const HologramDefenseCore: React.FC = () => {
  const { isChainCompromised, selfHealChain, setActiveTab, kpis, blocks } = useSentinel();

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-6 sm:p-8 transition-all duration-700 ${
      isChainCompromised
        ? 'border-red-500/80 bg-gradient-to-br from-red-950/60 via-slate-950 to-red-950/40 shadow-[0_0_50px_rgba(239,68,68,0.3)]'
        : 'border-red-500/30 bg-gradient-to-br from-slate-950 via-slate-900/90 to-slate-950 shadow-[0_0_40px_rgba(239,68,68,0.12)]'
    }`}>

      {/* Ambient background light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-matrix-grid opacity-30 pointer-events-none" />

      {/* Scanner Line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent animate-scanner-line pointer-events-none shadow-[0_0_10px_rgba(239,68,68,0.8)]" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

        {/* ── Left: Defense Core Visual ── */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center h-52 w-52 sm:h-60 sm:w-60">

            {/* Outer Radar Ring */}
            <div className={`absolute inset-0 rounded-full border border-dashed transition-all duration-700 ${
              isChainCompromised ? 'border-red-500/60 animate-radar-sweep' : 'border-red-500/30 animate-radar-sweep'
            }`} />

            {/* Middle Energy Ring */}
            <div className={`absolute inset-5 rounded-full border transition-all duration-700 ${
              isChainCompromised
                ? 'border-red-500 shadow-[0_0_45px_rgba(239,68,68,0.5)] animate-pulse'
                : 'border-red-500/40 shadow-[0_0_35px_rgba(239,68,68,0.2)]'
            }`} />

            {/* Inner Ring */}
            <div className={`absolute inset-12 rounded-full border transition-all duration-500 ${
              isChainCompromised ? 'border-red-500/50 bg-red-950/40' : 'border-red-500/20 bg-slate-900/80 backdrop-blur-sm'
            }`} />

            {/* Center Core Orb */}
            <div className={`relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-2xl border-2 transition-all duration-500 ${
              isChainCompromised
                ? 'border-red-500 bg-red-950/80 shadow-[0_0_50px_rgba(239,68,68,0.6)]'
                : 'border-red-500/50 bg-slate-900 shadow-[0_0_35px_rgba(239,68,68,0.3)]'
            }`}>
              {isChainCompromised ? (
                <ShieldAlert className="h-12 w-12 text-red-400 animate-bounce" />
              ) : (
                <ShieldCheck className="h-12 w-12 text-red-400 animate-pulse-red" />
              )}
              {!isChainCompromised && (
                <span className="absolute inset-0 rounded-2xl border-2 border-red-500/40 animate-ping opacity-30" />
              )}
            </div>

            {/* Orbital Layer Labels */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-900/90 border border-red-500/40 px-2.5 py-0.5 text-[9px] font-mono font-bold text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.3)]">
              L1: HEURISTIC
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-900/90 border border-red-500/40 px-2.5 py-0.5 text-[9px] font-mono font-bold text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.3)]">
              L3: GEMINI 2.5 NEURAL
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-full bg-slate-900/90 border border-red-500/40 px-2 py-0.5 text-[9px] font-mono font-bold text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.3)]">
              L2: VECTOR
            </div>
          </div>

          {/* Status */}
          <div className="mt-5 flex items-center space-x-2 text-xs font-mono">
            <span className={`flex h-2.5 w-2.5 rounded-full ${
              isChainCompromised ? 'bg-red-500 animate-alert-beacon shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-emerald-400 animate-status-beacon shadow-[0_0_10px_rgba(52,211,153,0.8)]'
            }`} />
            <span className={`font-bold ${isChainCompromised ? 'text-red-400' : 'text-slate-300'}`}>
              {isChainCompromised ? 'DAG COMPROMISED — BREACH ACTIVE' : 'NEURAL DEFENSE: 100% OPERATIONAL'}
            </span>
          </div>
        </div>

        {/* ── Right: Mission Details + CTAs ── */}
        <div className="lg:col-span-8 space-y-5">

          {/* Category Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full bg-red-500/10 border border-red-500/30 px-3.5 py-1.5 text-[11px] font-mono font-bold text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.15)]">
            <Sparkles className="h-3.5 w-3.5 text-red-400" />
            <span>ZERO-TRUST AI MEMORY FIREWALL + MERKLE DAG</span>
          </div>

          {/* Hero Heading */}
          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Protecting AI Agents from{' '}
              <span className="bg-gradient-to-r from-red-400 via-rose-400 to-red-400 bg-clip-text text-transparent">
                Prompt Injection &amp; Memory Drift
              </span>
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed font-sans max-w-xl">
              Every memory commit is cryptographically SHA-256 sealed into an immutable Merkle block ledger before LLM context injection. Real-time L1+L2+L3 neural threat analysis.
            </p>
          </div>

          {/* Live Metrics Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.12)] transition-all">
              <div className="text-[10px] font-mono text-slate-400 mb-0.5">Total Memories</div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums">
                {kpis.totalMemories.toLocaleString()}
              </div>
              <div className="text-[10px] font-mono text-red-400/80 mt-0.5">SHA-256 sealed</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.12)] transition-all">
              <div className="text-[10px] font-mono text-slate-400 mb-0.5">Attacks Deflected</div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-red-400 tabular-nums">
                {kpis.injectionsBlocked.toLocaleString()}
              </div>
              <div className="text-[10px] font-mono text-emerald-400/80 mt-0.5">Zero breaches</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.12)] transition-all">
              <div className="text-[10px] font-mono text-slate-400 mb-0.5">DAG Depth</div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums">
                {blocks.length}
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">Chained blocks</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => { soundClick(); setActiveTab('firewall'); }}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 px-5 py-2.5 text-xs font-mono font-bold text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-200 active:scale-95 hover:-translate-y-0.5"
            >
              <Flame className="h-4 w-4" />
              <span>Launch Threat Simulator</span>
            </button>

            <button
              onClick={() => { soundClick(); setActiveTab('hashchain'); }}
              className="flex items-center space-x-2 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-red-500/40 hover:bg-slate-800 px-4 py-2.5 text-xs font-mono font-semibold text-slate-300 hover:text-white transition-all duration-200 active:scale-95 shadow-xs"
            >
              <Boxes className="h-4 w-4 text-red-400" />
              <span>Explore Merkle DAG</span>
            </button>

            {isChainCompromised && (
              <button
                onClick={() => { soundSelfHeal(); selfHealChain(); }}
                className="flex items-center space-x-2 rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2.5 text-xs font-mono font-bold text-white shadow-[0_0_25px_rgba(239,68,68,0.6)] transition-all active:scale-95 hover:-translate-y-0.5 animate-pulse"
              >
                <Zap className="h-4 w-4" />
                <span>Auto Self-Heal ⚡</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
