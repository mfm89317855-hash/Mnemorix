import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Flame,
  Zap,
  Sparkles,
  Boxes,
  Activity,
} from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';
import { soundSelfHeal, soundClick } from '../../lib/sound';

export const HologramDefenseCore: React.FC = () => {
  const { isChainCompromised, selfHealChain, setActiveTab, kpis, blocks } = useSentinel();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple-500/25 bg-gradient-to-br from-[#08041A] via-[#0E062A] to-[#060214] p-6 sm:p-8 shadow-2xl shadow-purple-900/30 animate-hologram-tilt">

      {/* Background Ambient Glows */}
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-purple-600/12 blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-cyan-500/12 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-red-600/5 blur-3xl pointer-events-none" />

      {/* Dot Matrix Overlay */}
      <div className="absolute inset-0 bg-dot-matrix opacity-25 pointer-events-none" />

      {/* Scanner Line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-scanner-line pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

        {/* ── Left: Hologram Shield Visual ── */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center h-52 w-52 sm:h-60 sm:w-60">

            {/* Outer Radar Ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-purple-500/25 animate-radar-sweep" />

            {/* Middle Energy Ring */}
            <div className={`absolute inset-5 rounded-full border-2 transition-all duration-700 ${
              isChainCompromised
                ? 'border-rose-500/80 shadow-[0_0_45px_rgba(244,63,94,0.55)] animate-pulse'
                : 'border-cyan-400/55 shadow-[0_0_40px_rgba(6,182,212,0.35)]'
            }`} />

            {/* Inner Vector Space Ring */}
            <div className="absolute inset-12 rounded-full border border-purple-400/30 bg-purple-950/15 backdrop-blur-sm" />

            {/* Center Core Orb */}
            <div className={`relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-2xl border-2 transition-all duration-500 ${
              isChainCompromised
                ? 'border-rose-500 bg-rose-950/70 shadow-[0_0_40px_#F43F5E]'
                : 'border-purple-400/50 bg-gradient-to-br from-purple-700/35 via-indigo-700/30 to-cyan-600/35 shadow-[0_0_35px_rgba(168,85,247,0.5)]'
            }`}>
              {isChainCompromised ? (
                <ShieldAlert className="h-11 w-11 text-rose-400 animate-bounce" />
              ) : (
                <ShieldCheck className="h-11 w-11 text-cyan-300 animate-hologram-pulse" />
              )}
              {/* Inner pulse ring */}
              {!isChainCompromised && (
                <span className="absolute inset-0 rounded-2xl border border-cyan-400/20 animate-ping opacity-30" />
              )}
            </div>

            {/* Orbital Labels */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#0C0629]/90 border border-cyan-400/30 px-2.5 py-0.5 text-[9px] font-mono font-bold text-cyan-300 shadow-lg">
              L1: HEURISTIC
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#0C0629]/90 border border-purple-400/30 px-2.5 py-0.5 text-[9px] font-mono font-bold text-purple-300 shadow-lg">
              L3: GEMINI 2.5 NEURAL
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-full bg-[#0C0629]/90 border border-emerald-400/30 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-300 shadow-lg">
              L2: VECTOR
            </div>
          </div>

          {/* Status */}
          <div className="mt-4 flex items-center space-x-2 text-xs font-mono">
            <span className={`flex h-2.5 w-2.5 rounded-full ${
              isChainCompromised ? 'bg-rose-500 animate-alert-beacon' : 'bg-emerald-400 animate-status-beacon'
            }`} />
            <span className="font-bold text-slate-200">
              {isChainCompromised ? 'DAG COMPROMISED — BREACH ACTIVE' : 'NEURAL DEFENSE: 100% OPERATIONAL'}
            </span>
          </div>
        </div>

        {/* ── Right: Mission Details + CTAs ── */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Category Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full bg-purple-500/10 border border-purple-500/25 px-3.5 py-1.5 text-[11px] font-mono font-bold text-purple-300 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-pink-400" />
            <span>ZERO-TRUST AI MEMORY FIREWALL + MERKLE DAG</span>
          </div>

          {/* Hero Heading */}
          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Protecting AI Agents from{' '}
              <span className="text-gradient-neon">Prompt Injection & Memory Drift</span>
            </h1>
            <p className="text-sm text-slate-300/80 leading-relaxed font-sans max-w-xl">
              Every memory commit is cryptographically SHA-256 sealed into an immutable Merkle block ledger before LLM context injection. Real-time L1+L2+L3 neural threat analysis.
            </p>
          </div>

          {/* Live Metrics Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-3.5 backdrop-blur-md hover:bg-white/[0.07] transition-all">
              <div className="text-[10px] font-mono text-slate-400 mb-0.5">Total Memories</div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-400 tabular-nums">
                {kpis.totalMemories.toLocaleString()}
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-0.5">SHA-256 sealed</div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-3.5 backdrop-blur-md hover:bg-white/[0.07] transition-all">
              <div className="text-[10px] font-mono text-slate-400 mb-0.5">Attacks Deflected</div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-pink-400 tabular-nums">
                {kpis.injectionsBlocked.toLocaleString()}
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-0.5">Zero breaches</div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-3.5 backdrop-blur-md hover:bg-white/[0.07] transition-all">
              <div className="text-[10px] font-mono text-slate-400 mb-0.5">DAG Depth</div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 tabular-nums">
                {blocks.length}
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-0.5">Chained blocks</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => { soundClick(); setActiveTab('firewall'); }}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 px-5 py-2.5 text-xs font-mono font-bold text-white shadow-xl shadow-pink-600/25 transition-all duration-200 active:scale-95 hover:-translate-y-0.5"
            >
              <Flame className="h-4 w-4" />
              <span>Launch Threat Simulator</span>
            </button>

            <button
              onClick={() => { soundClick(); setActiveTab('hashchain'); }}
              className="flex items-center space-x-2 rounded-xl border border-white/12 bg-white/[0.06] hover:bg-white/[0.1] hover:border-purple-400/40 px-4 py-2.5 text-xs font-mono font-semibold text-slate-200 transition-all duration-200 active:scale-95"
            >
              <Boxes className="h-4 w-4 text-purple-400" />
              <span>Explore Merkle DAG</span>
            </button>

            {isChainCompromised && (
              <button
                onClick={() => { soundSelfHeal(); selfHealChain(); }}
                className="flex items-center space-x-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2.5 text-xs font-mono font-bold text-white shadow-lg shadow-rose-600/35 transition-all active:scale-95 hover:-translate-y-0.5 animate-pulse"
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
