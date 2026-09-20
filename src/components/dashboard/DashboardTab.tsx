import React from 'react';
import { ArrowRight, RefreshCw, ShieldAlert } from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';
import { SentinelKpiCards } from './SentinelKpiCards';
import { LiveMemoryStream } from './LiveMemoryStream';
import { ThreatRadarChart } from './ThreatRadarChart';
import { soundClick, soundSelfHeal } from '../../lib/sound';

export const DashboardTab: React.FC = () => {
  const { isChainCompromised, compromisedReason, selfHealChain, setActiveTab, agents, setSelectedAgentId } = useSentinel();

  return (
    <div>
      <header className="page-header">
        <div><h1>Security overview</h1><p>Memory inspection, chain integrity, and connected-agent activity.</p></div>
        <div className="page-actions">
          <button className="ui-button-secondary" onClick={() => { soundClick(); setActiveTab('audit'); }}>View audit log</button>
          <button className="ui-button" onClick={() => { soundClick(); setActiveTab('firewall'); }}>Inspect memory <ArrowRight className="h-4 w-4" /></button>
        </div>
      </header>

      {isChainCompromised && (
        <div className="glass-card-danger mb-4 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3"><ShieldAlert className="h-5 w-5 mt-0.5 text-red-700" /><div><strong className="text-sm text-red-900">Memory ledger verification failed</strong><p className="mt-1 text-xs text-red-800">{compromisedReason || 'A previous block no longer matches the canonical chain.'}</p></div></div>
          <button className="ui-button-danger shrink-0" onClick={() => { soundSelfHeal(); selfHealChain(); }}><RefreshCw className="h-4 w-4" /> Restore chain</button>
        </div>
      )}

      <SentinelKpiCards />

      <div className="dashboard-grid">
        <LiveMemoryStream />
        <ThreatRadarChart />
      </div>

      <section className="panel mt-[18px]">
        <div className="panel-head"><div><h2>Connected agents</h2><p>Memory partitions under active inspection</p></div><button className="ui-button-secondary !min-h-8" onClick={() => { soundClick(); setActiveTab('fleet'); }}>Manage fleet <ArrowRight className="h-3.5 w-3.5" /></button></div>
        <div className="divide-y divide-slate-200">
          {agents.map((agent) => (
            <button key={agent.id} className="w-full grid grid-cols-[1fr_110px_110px_90px] max-sm:grid-cols-[1fr_80px] items-center gap-4 px-4 py-3 text-left hover:bg-slate-50 transition-colors" onClick={() => { soundClick(); setSelectedAgentId(agent.id); setActiveTab('fleet'); }}>
              <span className="flex items-center gap-3 min-w-0"><span className="agent-initials">{agent.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2)}</span><span className="min-w-0"><strong className="block text-xs text-slate-900 truncate">{agent.name}</strong><small className="block mt-1 text-[10px] text-slate-500 truncate">{agent.codeName}</small></span></span>
              <span className="max-sm:hidden text-[10px] font-mono text-slate-600">{agent.memoryCount} memories</span>
              <span className="max-sm:hidden text-[10px] font-mono text-slate-600">Drift {agent.vectorDriftAvg.toFixed(4)}</span>
              <span className={agent.integrityScore >= 95 ? 'badge-emerald' : 'badge-amber'}>{agent.integrityScore}%</span>
            </button>
          ))}
          {agents.length === 0 && <div className="px-4 py-8 text-center text-xs text-slate-500">No connected agents.</div>}
        </div>
      </section>
    </div>
  );
};
