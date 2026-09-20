import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Flame,
  Boxes,
  Cpu,
  ArrowRight,
  Activity,
  TrendingUp,
} from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';
import { SentinelKpiCards } from './SentinelKpiCards';
import { LiveMemoryStream } from './LiveMemoryStream';
import { ThreatRadarChart } from './ThreatRadarChart';
import { HologramDefenseCore } from './HologramDefenseCore';
import { soundClick, soundSelfHeal, soundThreatAlert } from '../../lib/sound';

export const DashboardTab: React.FC = () => {
  const {
    isChainCompromised,
    compromisedReason,
    selfHealChain,
    setActiveTab,
    agents,
    setSelectedAgentId,
  } = useSentinel();

  return (
    <div className="space-y-6">

      {/* ── Critical Compromise Banner ── */}
      {isChainCompromised && (
        <div className="glass-card-danger p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up border-l-4 border-l-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 shrink-0 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <ShieldAlert className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h4 className="font-display font-bold text-white text-sm">
                  CRITICAL: Cryptographic Merkle Root Tamper Detected!
                </h4>
                <span className="rounded-md bg-red-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-red-300 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                  DAG INVALID
                </span>
              </div>
              <p className="text-xs text-red-300 font-mono mt-0.5 leading-relaxed">
                {compromisedReason || 'A past memory node was mutated without valid cryptographic Ed25519 re-signature.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => { soundClick(); setActiveTab('hashchain'); }}
              className="rounded-xl border border-red-500/40 bg-slate-900/90 hover:bg-red-500/20 text-red-300 px-3.5 py-2 text-xs font-mono font-bold transition-all shadow-xs"
            >
              Inspect Block
            </button>
            <button
              onClick={() => { soundSelfHeal(); selfHealChain(); }}
              className="rounded-xl bg-red-600 hover:bg-red-500 text-white px-4 py-2 text-xs font-mono font-bold shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all active:scale-95 flex items-center space-x-1.5"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Self-Heal Ledger</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Hologram Defense Core Hero ── */}
      <HologramDefenseCore />

      {/* ── Sentinel KPI Cards ── */}
      <SentinelKpiCards />

      {/* ── Main 2-Col Grid: Live Stream + Radar Chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <LiveMemoryStream />
        </div>
        <div className="lg:col-span-5">
          <ThreatRadarChart />
        </div>
      </div>

      {/* ── Connected Agent Fleet Strip ── */}
      <div className="glass-card p-5 shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                Connected Agent Fleet
              </h3>
              <p className="text-[10px] font-mono text-slate-400">{agents.length} nodes active under Sentinel protection</p>
            </div>
          </div>
          <button
            onClick={() => { soundClick(); setActiveTab('fleet'); }}
            className="text-xs font-mono font-bold text-red-400 hover:text-red-300 flex items-center space-x-1 transition-all hover:gap-1.5 group"
          >
            <span>Manage All</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {agents.map((agent, i) => (
            <div
              key={agent.id}
              onClick={() => {
                soundClick();
                setSelectedAgentId(agent.id);
                setActiveTab('fleet');
              }}
              className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 hover:border-red-500/40 hover:bg-slate-900 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:-translate-y-0.5 transition-all duration-200 shadow-sm animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{agent.avatar}</span>
                  <div>
                    <h4 className="font-display text-xs font-bold text-slate-200 group-hover:text-red-400 transition-colors leading-tight">
                      {agent.name}
                    </h4>
                    <p className="text-[10px] font-mono text-slate-400">{agent.codeName}</p>
                  </div>
                </div>
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-mono font-black border ${
                  agent.integrityScore >= 95
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.2)]'
                    : 'bg-amber-500/15 border-amber-500/30 text-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.2)]'
                }`}>
                  {agent.integrityScore}
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] font-mono text-slate-400 pt-2.5 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>Memories:</span>
                  <span className="text-slate-200 font-bold">{agent.memoryCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Drift Δ:</span>
                  <span className={`font-semibold ${agent.vectorDriftAvg > 0.05 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {agent.vectorDriftAvg.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Integrity mini-bar */}
              <div className="mt-2.5 threat-bar">
                <div
                  className="threat-bar-fill bg-gradient-to-r from-emerald-500 to-emerald-400"
                  style={{ width: `${agent.integrityScore}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
