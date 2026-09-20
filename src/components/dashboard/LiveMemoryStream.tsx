import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertOctagon,
  Lock,
  Search,
  ExternalLink,
  Copy,
  Check,
  ShieldAlert,
} from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';
import { truncateHash } from '../../lib/crypto';
import { soundClick, soundAlert, soundHeal } from '../../lib/sound';

export const LiveMemoryStream: React.FC = () => {
  const { memories, quarantineMemory, restoreMemory, setActiveTab } = useSentinel();
  const [filter, setFilter] = useState<'all' | 'verified' | 'quarantined'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const filteredMemories = memories.filter((m) => {
    if (filter !== 'all' && m.status !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.content.toLowerCase().includes(q) ||
        m.agentName.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.hash.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopyHash = (hash: string) => {
    soundClick();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleQuarantine = (id: string) => {
    soundAlert();
    quarantineMemory(id);
  };

  const handleRestore = (id: string) => {
    soundHeal();
    restoreMemory(id);
  };

  return (
    <div className="glass-card p-5 flex flex-col h-full shadow-lg">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
            <Activity className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                Memory events
              </h3>
              <span className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(52,211,153,0.2)]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>LIVE FEED</span>
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Inspected writes and verification decisions
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => { soundClick(); setFilter('all'); }}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-mono font-bold transition-all ${
              filter === 'all'
                ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({memories.length})
          </button>
          <button
            onClick={() => { soundClick(); setFilter('verified'); }}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-mono font-bold transition-all ${
              filter === 'verified'
                ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(52,211,153,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Verified ({memories.filter((m) => m.status === 'verified').length})
          </button>
          <button
            onClick={() => { soundClick(); setFilter('quarantined'); }}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-mono font-bold transition-all ${
              filter === 'quarantined'
                ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Quarantined ({memories.filter((m) => m.status === 'quarantined').length})
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter memories by keyword, agent, category, or SHA-256 hash..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-red-500/60 focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500/30 transition-all font-mono"
        />
      </div>

      {/* Memory Stream List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[440px] pr-1">
        {filteredMemories.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 font-mono border border-dashed border-slate-800 rounded-xl">
            No memory records match active filters.
          </div>
        ) : (
          filteredMemories.map((mem) => {
            const isQuarantined = mem.status === 'quarantined';
            return (
              <div
                key={mem.id}
                className={`rounded-xl border p-3.5 transition-all text-xs ${
                  isQuarantined
                    ? 'border-red-500/50 bg-red-950/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                    : 'border-slate-800/80 bg-slate-900/70 hover:border-red-500/30 hover:bg-slate-900 shadow-xs'
                }`}
              >
                {/* Top Row: Agent & Badges */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-display font-bold text-white text-[13px]">{mem.agentName}</span>
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700 uppercase font-medium">
                      {mem.partition}
                    </span>
                    <span className="text-slate-500 text-[10px] font-mono">
                      {new Date(mem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isQuarantined ? (
                      <span className="inline-flex items-center space-x-1 rounded-md bg-red-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-red-400 border border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]">
                        <AlertOctagon className="h-3 w-3 text-red-400 animate-pulse" />
                        <span>QUARANTINED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(52,211,153,0.2)]">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        <span>SEALED</span>
                      </span>
                    )}

                    {isQuarantined ? (
                      <button
                        onClick={() => handleRestore(mem.id)}
                        className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 text-[10px] font-mono font-bold transition-all shadow-xs active:scale-95"
                        title="Authorize and restore memory"
                      >
                        Authorize
                      </button>
                    ) : (
                      <button
                        onClick={() => handleQuarantine(mem.id)}
                        className="rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-300 px-2.5 py-1 text-[10px] font-mono font-semibold transition-all border border-slate-700 active:scale-95"
                        title="Isolate into quarantine vault"
                      >
                        Isolate
                      </button>
                    )}
                  </div>
                </div>

                {/* Memory Content */}
                <p className="text-slate-300 leading-relaxed font-sans mb-2.5 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  {mem.content}
                </p>

                {/* Bottom Hash & Meta */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <Lock className="h-3 w-3 text-red-400" />
                    <span>Hash:</span>
                    <button
                      onClick={() => handleCopyHash(mem.hash)}
                      className="group flex items-center space-x-1 text-red-400 hover:text-red-300 font-bold bg-red-500/10 hover:bg-red-500/20 px-1.5 py-0.5 rounded transition-colors border border-red-500/20"
                      title="Copy full SHA-256 hash"
                    >
                      <span>{truncateHash(mem.hash, 8, 8)}</span>
                      {copiedHash === mem.hash ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3 text-slate-500 group-hover:text-red-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center space-x-3 text-[10px]">
                    <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">Drift Δ: <strong className="text-white font-mono">{mem.vectorDriftDelta.toFixed(4)}</strong></span>
                    <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">Confidence: <strong className="text-white font-mono">{(mem.confidenceScore * 100).toFixed(1)}%</strong></span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Quick Action */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400">
          Displaying {filteredMemories.length} of {memories.length} memory nodes
        </span>
        <button
          onClick={() => { soundClick(); setActiveTab('fleet'); }}
          className="text-red-400 hover:text-red-300 font-bold flex items-center space-x-1 transition-all group"
        >
          <span>Open Vector Vault</span>
          <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
