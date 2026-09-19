import React, { useState } from 'react';
import {
  Bot,
  Layers,
  Plus,
  UserPlus,
  Lock,
  X,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';
import { truncateHash } from '../../lib/crypto';
import { MemoryPartition } from '../../lib/types';

export const AgentFleetView: React.FC = () => {
  const {
    agents,
    selectedAgentId,
    setSelectedAgentId,
    selectedAgent,
    addNewAgent,
    memories,
    selectedPartition,
    setSelectedPartition,
    quarantineMemory,
    restoreMemory,
    addVerifiedMemory,
  } = useSentinel();

  const [isNewMemoryModalOpen, setIsNewMemoryModalOpen] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newPartition, setNewPartition] = useState<MemoryPartition>('semantic');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Agent Form State
  const [isNewAgentModalOpen, setIsNewAgentModalOpen] = useState(false);
  const [agentNameInput, setAgentNameInput] = useState('');
  const [codeNameInput, setCodeNameInput] = useState('');
  const [roleInput, setRoleInput] = useState('');
  const [avatarInput, setAvatarInput] = useState('🤖');
  const [modelInput, setModelInput] = useState('Gemini 2.5 Flash');

  const activeAgent = selectedAgent || agents[0];

  const agentMemories = memories.filter((m) => {
    if (m.agentId !== activeAgent.id) return false;
    if (selectedPartition !== 'all' && m.partition !== selectedPartition) return false;
    return true;
  });

  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await addVerifiedMemory({
      agentId: activeAgent.id,
      agentName: activeAgent.name,
      partition: newPartition,
      content: newContent.trim(),
      category: newCategory.trim() || 'General Policy',
      piiRedacted: false,
      confidenceScore: 0.998,
      tags: ['manual_entry', newPartition],
      author: 'SecOps Administrator',
      vectorDriftDelta: 0.003,
    });

    setNewContent('');
    setNewCategory('');
    setIsSubmitting(false);
    setIsNewMemoryModalOpen(false);
  };

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentNameInput.trim()) return;

    addNewAgent({
      name: agentNameInput.trim().toUpperCase(),
      codeName: codeNameInput.trim() || 'Custom Sentinel Node',
      role: roleInput.trim() || 'Autonomous SecOps Agent',
      avatar: avatarInput.trim() || '🤖',
      model: modelInput.trim() || 'Gemini 2.5 Flash',
      status: 'shielded',
    });

    setAgentNameInput('');
    setCodeNameInput('');
    setRoleInput('');
    setIsNewAgentModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Agent Selector Tabs */}
      <div className="white-red-card p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-600">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                Agent Fleet & Vector Vault Explorer
              </h2>
              <p className="text-xs font-mono text-slate-500">
                Inspect partition memory allocations, PII redactions, and vector drift baselines
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsNewAgentModalOpen(true)}
              className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-mono font-bold text-slate-700 hover:border-red-300 transition-all shadow-2xs"
            >
              <UserPlus className="h-4 w-4 text-red-600" />
              <span>Deploy Agent</span>
            </button>

            <button
              onClick={() => setIsNewMemoryModalOpen(true)}
              className="flex items-center space-x-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-mono font-bold text-white shadow-md shadow-red-500/20 transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Add Verified Memory</span>
            </button>
          </div>
        </div>

        {/* Agent Cards Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {agents.map((agent) => {
            const isSelected = selectedAgentId === agent.id;
            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => setSelectedAgentId(agent.id)}
                className={`text-left rounded-xl border p-3.5 transition-all shadow-2xs ${
                  isSelected
                    ? 'border-red-600 bg-red-50/80 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-red-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{agent.avatar}</span>
                    <div>
                      <h4 className="font-display text-xs font-bold text-slate-900">{agent.name}</h4>
                      <p className="text-[10px] font-mono text-slate-500">{agent.codeName}</p>
                    </div>
                  </div>
                  <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700 border border-emerald-200">
                    {agent.integrityScore}%
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 flex justify-between pt-2 border-t border-slate-100">
                  <span>{agent.memoryCount} Total Memories</span>
                  <span className="text-red-600 font-bold">{agent.status.toUpperCase()}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Agent Deep Overview Card */}
      <div className="white-red-card p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-3.5">
            <span className="text-3xl">{activeAgent.avatar}</span>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display text-base font-bold text-slate-900">{activeAgent.name}</h3>
                <span className="rounded-md bg-red-50 border border-red-200 px-2.5 py-0.5 text-[10px] font-mono text-red-700 font-semibold">
                  {activeAgent.role}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                Model: {activeAgent.model} | Average Vector Drift: <strong className="text-red-600">{activeAgent.vectorDriftAvg}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="text-right">
              <div className="text-slate-400 text-[10px]">Verified Hash Anchors</div>
              <div className="text-emerald-700 font-bold">{activeAgent.verifiedCount} / {activeAgent.memoryCount}</div>
            </div>
          </div>
        </div>

        {/* Partition Tabs Filter */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-xs font-mono text-slate-500 mr-2 flex items-center">
            <Layers className="h-3.5 w-3.5 mr-1 text-red-600" /> Partitions:
          </span>
          {[
            { id: 'all', label: 'All Partitions', count: activeAgent.memoryCount },
            { id: 'episodic', label: 'Episodic', count: activeAgent.partitions.episodic },
            { id: 'semantic', label: 'Semantic', count: activeAgent.partitions.semantic },
            { id: 'procedural', label: 'Procedural', count: activeAgent.partitions.procedural },
            { id: 'working', label: 'Working Memory', count: activeAgent.partitions.working },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedPartition(tab.id as any)}
              className={`rounded-xl px-3 py-1.5 text-xs font-mono transition-all flex items-center space-x-1.5 ${
                selectedPartition === tab.id
                  ? 'bg-red-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Memory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agentMemories.length === 0 ? (
          <div className="col-span-2 white-red-card p-10 text-center font-mono text-xs text-slate-400 shadow-2xs">
            No memories found for {activeAgent.name} in selected partition.
          </div>
        ) : (
          agentMemories.map((mem) => {
            const isQuarantined = mem.status === 'quarantined';
            return (
              <div
                key={mem.id}
                className={`rounded-2xl border p-4.5 transition-all flex flex-col justify-between shadow-2xs ${
                  isQuarantined
                    ? 'border-red-300 bg-red-50/80'
                    : 'border-slate-200 bg-white hover:border-red-200 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-red-700 uppercase font-bold border border-slate-200">
                        {mem.partition}
                      </span>
                      <span className="font-display text-xs font-bold text-slate-900">{mem.category}</span>
                    </div>

                    {isQuarantined ? (
                      <span className="rounded-lg bg-red-100 px-2 py-0.5 text-[10px] font-mono font-bold text-red-700 border border-red-200 flex items-center space-x-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span>QUARANTINED</span>
                      </span>
                    ) : (
                      <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                        <ShieldCheck className="h-3 w-3" />
                        <span>SEALED</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-sans mb-3">
                    {mem.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Lock className="h-3 w-3 text-red-600" />
                      <span>{truncateHash(mem.hash, 8, 8)}</span>
                    </div>
                    <span>Confidence: {(mem.confidenceScore * 100).toFixed(1)}%</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-mono text-slate-400">
                      Author: {mem.author}
                    </span>
                    {isQuarantined ? (
                      <button
                        onClick={() => restoreMemory(mem.id)}
                        className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 text-[10px] font-mono font-bold transition-all shadow-2xs"
                      >
                        Authorize & Restore
                      </button>
                    ) : (
                      <button
                        onClick={() => quarantineMemory(mem.id)}
                        className="rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-200 px-3 py-1 text-[10px] font-mono transition-all"
                      >
                        Isolate to Vault
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Verified Memory Modal */}
      {isNewMemoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <button
              onClick={() => setIsNewMemoryModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-display text-base font-bold text-slate-900 mb-1">
              Add Verified Memory to {activeAgent.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-mono">
              Memory will be hashed with SHA-256 and anchored in the Merkle block ledger.
            </p>

            <form onSubmit={handleCreateMemory} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">Partition</label>
                <select
                  value={newPartition}
                  onChange={(e) => setNewPartition(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
                >
                  <option value="episodic">Episodic (Session logs / Chat)</option>
                  <option value="semantic">Semantic (Domain Knowledge / Guidelines)</option>
                  <option value="procedural">Procedural (Safety Rules / Execution Limits)</option>
                  <option value="working">Working Memory (Task Scratchpad)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">Category</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Infrastructure Policy, Portfolio Guidelines"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">Memory Content</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  placeholder="Enter the canonical verified memory text..."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewMemoryModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newContent.trim() || isSubmitting}
                  className="rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-mono font-bold text-white shadow-md shadow-red-500/20 disabled:opacity-40 transition-all active:scale-95"
                >
                  {isSubmitting ? 'Anchoring...' : 'Commit & Seal Block ⛓️'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deploy Custom Agent Modal */}
      {isNewAgentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <button
              onClick={() => setIsNewAgentModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-display text-base font-bold text-slate-900 mb-1">
              Deploy New Agent Node to Sentinel Fleet
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-mono">
              Initialize a dedicated autonomous agent node with Merkle hash-chain protection.
            </p>

            <form onSubmit={handleCreateAgent} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">Agent Identifier Name</label>
                  <input
                    type="text"
                    value={agentNameInput}
                    onChange={(e) => setAgentNameInput(e.target.value)}
                    placeholder="e.g. CYBER-VANGUARD"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 uppercase font-mono placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">Avatar Symbol / Emoji</label>
                  <input
                    type="text"
                    value={avatarInput}
                    onChange={(e) => setAvatarInput(e.target.value)}
                    placeholder="🤖"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">Code Name / Unit</label>
                <input
                  type="text"
                  value={codeNameInput}
                  onChange={(e) => setCodeNameInput(e.target.value)}
                  placeholder="e.g. Network Sentry Tier-1"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">Role & Responsibility</label>
                <input
                  type="text"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  placeholder="e.g. Automated Kubernetes & Cloud SecOps Sentinel"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">Underlying AI Model Weights</label>
                <input
                  type="text"
                  value={modelInput}
                  onChange={(e) => setModelInput(e.target.value)}
                  placeholder="Gemini 2.5 Flash / Custom SecOps Weights"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewAgentModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!agentNameInput.trim()}
                  className="rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-mono font-bold text-white shadow-md shadow-red-500/20 disabled:opacity-40 transition-all active:scale-95"
                >
                  Deploy Node 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
