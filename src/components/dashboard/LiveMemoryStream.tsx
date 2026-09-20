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
    <section className="panel dashboard-panel memory-panel">
      {/* Card Header */}
      <div className="panel-head memory-panel-head">
        <div className="flex items-center space-x-2.5">
          <div className="panel-icon">
            <Activity className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3>
                Memory events
              </h3>
              <span className="badge-emerald">
                <span className="health-dot"></span>
                <span>Live</span>
              </span>
            </div>
            <p>
              Inspected writes and verification decisions
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="segmented-control" aria-label="Memory status filter">
          <button
            onClick={() => { soundClick(); setFilter('all'); }}
            className={filter === 'all' ? 'active' : ''}
          >
            All ({memories.length})
          </button>
          <button
            onClick={() => { soundClick(); setFilter('verified'); }}
            className={filter === 'verified' ? 'active' : ''}
          >
            Verified ({memories.filter((m) => m.status === 'verified').length})
          </button>
          <button
            onClick={() => { soundClick(); setFilter('quarantined'); }}
            className={filter === 'quarantined' ? 'active' : ''}
          >
            Quarantined ({memories.filter((m) => m.status === 'quarantined').length})
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="console-search-wrap">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter memories by keyword, agent, category, or SHA-256 hash..."
          className="console-search"
        />
      </div>

      {/* Memory Stream List */}
      <div className="memory-list">
        {filteredMemories.length === 0 ? (
          <div className="empty-state">
            No memory records match active filters.
          </div>
        ) : (
          filteredMemories.map((mem) => {
            const isQuarantined = mem.status === 'quarantined';
            return (
              <div
                key={mem.id}
                className={`memory-record ${isQuarantined ? 'is-quarantined' : ''}`}
              >
                {/* Top Row: Agent & Badges */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="memory-agent">{mem.agentName}</span>
                    <span className="badge-slate">
                      {mem.partition}
                    </span>
                    <span className="memory-time">
                      {new Date(mem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isQuarantined ? (
                      <span className="badge-red">
                        <AlertOctagon className="h-3 w-3" />
                        <span>Quarantined</span>
                      </span>
                    ) : (
                      <span className="badge-emerald">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Verified</span>
                      </span>
                    )}

                    {isQuarantined ? (
                      <button
                        onClick={() => handleRestore(mem.id)}
                        className="record-action authorize"
                        title="Authorize and restore memory"
                      >
                        Authorize
                      </button>
                    ) : (
                      <button
                        onClick={() => handleQuarantine(mem.id)}
                        className="record-action isolate"
                        title="Isolate into quarantine vault"
                      >
                        Isolate
                      </button>
                    )}
                  </div>
                </div>

                {/* Memory Content */}
                <p className="memory-content">
                  {mem.content}
                </p>

                {/* Bottom Hash & Meta */}
                <div className="memory-meta">
                  <div className="flex items-center space-x-1.5">
                    <Lock className="h-3 w-3" />
                    <span>Hash:</span>
                    <button
                      onClick={() => handleCopyHash(mem.hash)}
                      className="hash-button"
                      title="Copy full SHA-256 hash"
                    >
                      <span>{truncateHash(mem.hash, 8, 8)}</span>
                      {copiedHash === mem.hash ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>

                  <div className="memory-measures">
                    <span>Drift Δ <strong>{mem.vectorDriftDelta.toFixed(4)}</strong></span>
                    <span>Confidence <strong>{(mem.confidenceScore * 100).toFixed(1)}%</strong></span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Quick Action */}
      <div className="panel-footer">
        <span>
          Displaying {filteredMemories.length} of {memories.length} memory nodes
        </span>
        <button
          onClick={() => { soundClick(); setActiveTab('fleet'); }}
          className="panel-link"
        >
          <span>Open Vector Vault</span>
          <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};
