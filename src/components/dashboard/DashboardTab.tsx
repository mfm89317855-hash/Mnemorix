import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Flame,
  Boxes,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';
import { SentinelKpiCards } from './SentinelKpiCards';
import { LiveMemoryStream } from './LiveMemoryStream';
import { ThreatRadarChart } from './ThreatRadarChart';

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
      
      {/* Critical Compromise Banner (Shows when Merkle DAG is broken) */}
      {isChainCompromised && (
        <div className="white-red-card-danger p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="p-2 rounded-lg bg-red-100 text-red-600 shrink-0 border border-red-200">
              <ShieldAlert className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-display font-bold text-red-900 text-base">
                  CRITICAL: Cryptographic Merkle Root Tamper Detected!
                </h4>
                <span className="rounded bg-red-200 px-2 py-0.5 text-[10px] font-mono font-bold text-red-800">
                  DAG INVALID
                </span>
              </div>
              <p className="text-xs text-red-700 font-mono mt-0.5">
                {compromisedReason || 'A past memory node was mutated without valid cryptographic Ed25519 re-signature.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setActiveTab('hashchain')}
              className="rounded-lg border border-red-300 bg-white hover:bg-red-50 text-red-700 px-3.5 py-2 text-xs font-mono font-bold transition-all shadow-xs"
            >
              Inspect Broken Block
            </button>
            <button
              onClick={selfHealChain}
              className="rounded-lg bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-mono font-bold shadow-md shadow-red-600/20 transition-all active:scale-95 flex items-center space-x-1.5"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Self-Heal Ledger</span>
            </button>
          </div>
        </div>
      )}

      {/* White & Red Executive Hero Banner */}
      <div className="white-red-card p-6 border-l-4 border-l-red-600 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center space-x-2.5">
            <span className="inline-flex items-center space-x-1.5 rounded bg-red-50 px-2.5 py-0.5 text-[11px] font-mono font-bold text-red-700 border border-red-200">
              <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping" />
              <span>LIVE WORKING MODEL ACTIVE</span>
            </span>
            <span className="text-slate-300 text-xs">|</span>
            <span className="text-xs font-mono text-slate-500 font-medium">{agents.length} Connected Agents</span>
            <span className="text-slate-300 text-xs">|</span>
            <span className="text-xs font-mono text-emerald-600 font-bold">100% Cryptographic Integrity</span>
          </div>

          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
            Autonomous AI Memory Defense & Cryptographic Firewall
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            Real-time inspection of inbound and outbound agent memory states. Powered by real WebCrypto SHA-256 Merkle block validation and Gemini 2.5 Flash neural semantic security.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveTab('firewall')}
            className="flex items-center space-x-2 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2.5 text-xs font-mono font-bold text-white shadow-md shadow-red-500/20 transition-all active:scale-95"
          >
            <Flame className="h-4 w-4" />
            <span>Attack Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('hashchain')}
            className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-red-300 px-4 py-2.5 text-xs font-mono font-semibold text-slate-700 transition-all shadow-2xs"
          >
            <Boxes className="h-4 w-4 text-red-600" />
            <span>Merkle Chain</span>
          </button>
        </div>
      </div>

      {/* Sentinel KPIs */}
      <SentinelKpiCards />

      {/* Main 2-Column Grid: Live Stream & Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <LiveMemoryStream />
        </div>
        <div className="lg:col-span-5">
          <ThreatRadarChart />
        </div>
      </div>

      {/* Connected Agent Fleet Strip */}
      <div className="white-red-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Cpu className="h-4 w-4 text-red-600" />
            <h3 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider">
              Connected Agent Fleet
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('fleet')}
            className="text-xs font-mono font-bold text-red-600 hover:text-red-700 flex items-center space-x-1"
          >
            <span>Manage All Agents</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => {
                setSelectedAgentId(agent.id);
                setActiveTab('fleet');
              }}
              className="group cursor-pointer rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 hover:border-red-300 hover:bg-red-50/20 transition-all shadow-2xs"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xl">{agent.avatar}</span>
                  <div>
                    <h4 className="font-display text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                      {agent.name}
                    </h4>
                    <p className="text-[10px] font-mono text-slate-500">{agent.codeName}</p>
                  </div>
                </div>
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-mono font-bold text-emerald-700 border border-emerald-200">
                  {agent.integrityScore}%
                </span>
              </div>

              <div className="space-y-1 text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>Memories:</span>
                  <span className="text-slate-900 font-bold">{agent.memoryCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Drift Delta:</span>
                  <span className="text-slate-700">{agent.vectorDriftAvg}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
