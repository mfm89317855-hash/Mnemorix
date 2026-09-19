import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Flame,
  Zap,
  Sparkles,
  Lock,
  Activity,
  Cpu,
  Radio,
  Boxes,
} from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';

export const HologramDefenseCore: React.FC = () => {
  const { isChainCompromised, selfHealChain, setActiveTab, kpis, blocks } = useSentinel();

  return (
    <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-[#0A051C]/90 via-[#120A2E]/80 to-[#060312]/95 p-6 sm:p-8 shadow-[0_0_50px_rgba(168,85,247,0.15)]">
      
      {/* Background Decorative Rings & Ambient Glows */}
      <div className="absolute -right-16 -top-16 h-80 w-80 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-dot-matrix opacity-30 pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Hologram Shield Visual Centerpiece */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center h-56 w-56 sm:h-64 sm:w-64">
            
            {/* Outer Rotating Radar Ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-purple-500/30 animate-radar-sweep" />
            
            {/* Middle Glowing Energy Ring */}
            <div className={`absolute inset-4 rounded-full border-2 transition-all duration-500 ${
              isChainCompromised
                ? 'border-rose-500/80 shadow-[0_0_40px_rgba(244,63,94,0.5)] animate-pulse'
                : 'border-cyan-400/60 shadow-[0_0_35px_rgba(0,242,254,0.35)]'
            }`} />

            {/* Inner Ring (L2 Vector Space) */}
            <div className="absolute inset-10 rounded-full border border-purple-400/40 bg-purple-950/20 backdrop-blur-md" />

            {/* Center Core Orb */}
            <div className={`relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-2xl border transition-all ${
              isChainCompromised
                ? 'border-rose-500 bg-rose-950/60 shadow-[0_0_35px_#F43F5E]'
                : 'border-purple-400/60 bg-gradient-to-br from-purple-600/40 via-indigo-600/40 to-cyan-500/40 shadow-[0_0_30px_rgba(168,85,247,0.6)]'
            }`}>
              {isChainCompromised ? (
                <ShieldAlert className="h-12 w-12 text-rose-400 animate-bounce" />
              ) : (
                <ShieldCheck className="h-12 w-12 text-cyan-300 animate-hologram-pulse" />
              )}
            </div>

            {/* Orbiting Satellite Badges */}
            <div className="absolute -top-1 px-2.5 py-0.5 rounded-full bg-[#0E0728] border border-cyan-400/40 text-[9px] font-mono font-bold text-cyan-300 shadow-md">
              L1: HEURISTIC SENTINEL
            </div>
            <div className="absolute -bottom-1 px-2.5 py-0.5 rounded-full bg-[#0E0728] border border-purple-400/40 text-[9px] font-mono font-bold text-purple-300 shadow-md">
              L3: GEMINI 2.5 NEURAL
            </div>
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full bg-[#0E0728] border border-emerald-400/40 text-[9px] font-mono font-bold text-emerald-300 shadow-md">
              L2: VECTOR RADAR
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-2 text-xs font-mono">
            <span className={`flex h-2.5 w-2.5 rounded-full ${isChainCompromised ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
            <span className="font-bold text-slate-200">
              {isChainCompromised ? 'DAG COMPROMISED' : 'NEURAL DEFENSE ACTIVE: 100%'}
            </span>
          </div>
        </div>

        {/* Right: Telemetry Mission Details & Quick Launchers */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 rounded-full bg-purple-500/10 border border-purple-500/30 px-3 py-1 text-[11px] font-mono font-bold text-purple-300 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-pink-400" />
              <span>ZERO-TRUST MEMORY FIREWALL & MERKLE DAG</span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Protecting Autonomous AI from <span className="text-gradient-neon">Prompt Injection & Memory Drift</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300/85 leading-relaxed font-sans max-w-xl">
              Every thought, context retrieval, and long-term memory commit is cryptographically SHA-256 hashed and verified before LLM context injection.
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 py-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-md">
              <div className="text-[10px] font-mono text-slate-400">Total Memories</div>
              <div className="text-xl sm:text-2xl font-black font-mono text-cyan-400 mt-0.5">
                {kpis.totalMemories.toLocaleString()}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-md">
              <div className="text-[10px] font-mono text-slate-400">Attacks Deflected</div>
              <div className="text-xl sm:text-2xl font-black font-mono text-pink-400 mt-0.5">
                {kpis.injectionsBlocked.toLocaleString()}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-md">
              <div className="text-[10px] font-mono text-slate-400">DAG Depth</div>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 mt-0.5">
                {blocks.length} Blocks
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('firewall')}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 px-5 py-3 text-xs font-mono font-bold text-white shadow-xl shadow-pink-500/25 transition-all active:scale-95"
            >
              <Flame className="h-4 w-4" />
              <span>Launch Cyber Threat Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('hashchain')}
              className="flex items-center space-x-2 rounded-xl border border-white/15 bg-slate-900/80 hover:bg-slate-800 hover:border-purple-400/50 px-4 py-3 text-xs font-mono font-semibold text-slate-200 transition-all"
            >
              <Boxes className="h-4 w-4 text-purple-400" />
              <span>Explore Cryptographic DAG</span>
            </button>

            {isChainCompromised && (
              <button
                onClick={selfHealChain}
                className="flex items-center space-x-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-3 text-xs font-mono font-bold text-white shadow-lg shadow-rose-600/40 animate-pulse transition-all active:scale-95"
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
