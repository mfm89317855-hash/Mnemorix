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
    <div className="white-red-card p-5 flex flex-col h-full shadow-2xs">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-600 shadow-2xs">
            <Activity className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider">
                Live Memory Ingestion Stream
              </h3>
              <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700 border border-emerald-200">
                <span className="beacon-live-emerald"></span>
                <span>LIVE FEED</span>
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-500">
              SHA-256 cryptographic verification event stream with real-time vector delta analysis
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => { soundClick(); setFilter('all'); }}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-mono font-bold transition-all ${
              filter === 'all'
                ? 'bg-red-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({memories.length})
          </button>
          <button
            onClick={() => { soundClick(); setFilter('verified'); }}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-mono font-bold transition-all ${
              filter === 'verified'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Verified ({memories.filter((m) => m.status === 'verified').length})
          </button>
          <button
            onClick={() => { soundClick(); setFilter('quarantined'); }}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-mono font-bold transition-all ${
              filter === 'quarantined'
                ? 'bg-red-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quarantined ({memories.filter((m) => m.status === 'quarantined').length})
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter memories by keyword, agent, category, or SHA-256 hash..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:outline-none transition-colors"
        />
      </div>

      {/* Memory Stream List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[440px] pr-1">
        {filteredMemories.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 font-mono border border-dashed border-slate-200 rounded-xl">
            No memory records match active filters.
          </div>
        ) : (
          filteredMemories.map((mem) => {
            const isQuarantined = mem.status === 'quarantined';
            return (
              <div
                key={mem.id}
                className={`rounded-xl border p-3.5 transition-all text-xs card-lift ${
                  isQuarantined
                    ? 'border-red-300 bg-red-50/70 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-red-300 hover:shadow-xs'
                }`}
              >
                {/* Top Row: Agent & Badges */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-display font-bold text-slate-900 text-[13px]">{mem.agentName}</span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-700 border border-slate-200 uppercase font-medium">
                      {mem.partition}
                    </span>
                    <span className="text-slate-400 text-[10px] font-mono">
                      {new Date(mem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isQuarantined ? (
                      <span className="inline-flex items-center space-x-1 rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-mono font-bold text-red-700 border border-red-200">
                        <AlertOctagon className="h-3 w-3 text-red-600 animate-pulse" />
                        <span>QUARANTINED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        <span>SEALED</span>
                      </span>
                    )}

                    {isQuarantined ? (
                      <button
                        onClick={() => handleRestore(mem.id)}
                        className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 text-[10px] font-mono font-bold transition-all shadow-2xs active:scale-95"
                        title="Authorize and restore memory"
                      >
                        Authorize
                      </button>
                    ) : (
                      <button
                        onClick={() => handleQuarantine(mem.id)}
                        className="rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 px-2.5 py-1 text-[10px] font-mono font-semibold transition-all border border-slate-200 active:scale-95"
                        title="Isolate into quarantine vault"
                      >
                        Isolate
                      </button>
                    )}
                  </div>
                </div>

                {/* Memory Content */}
                <p className="text-slate-700 leading-relaxed font-sans mb-2.5 bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                  {mem.content}
                </p>

                {/* Bottom Hash & Meta */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                  <div className="flex items-center space-x-1.5">
                    <Lock className="h-3 w-3 text-red-600" />
                    <span>Hash:</span>
                    <button
                      onClick={() => handleCopyHash(mem.hash)}
                      className="group flex items-center space-x-1 text-red-700 hover:text-red-800 font-bold bg-red-50/80 hover:bg-red-100 px-1.5 py-0.5 rounded transition-colors"
                      title="Copy full SHA-256 hash"
                    >
                      <span>{truncateHash(mem.hash, 8, 8)}</span>
                      {copiedHash === mem.hash ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3 text-slate-400 group-hover:text-red-600" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center space-x-3 text-[10px]">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded">Drift Δ: <strong className="text-slate-800 font-mono">{mem.vectorDriftDelta.toFixed(4)}</strong></span>
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded">Confidence: <strong className="text-slate-800 font-mono">{(mem.confidenceScore * 100).toFixed(1)}%</strong></span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Quick Action */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-500">
          Displaying {filteredMemories.length} of {memories.length} memory nodes
        </span>
        <button
          onClick={() => { soundClick(); setActiveTab('fleet'); }}
          className="text-red-600 hover:text-red-700 font-bold flex items-center space-x-1 transition-all group"
        >
          <span>Open Vector Vault</span>
          <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
