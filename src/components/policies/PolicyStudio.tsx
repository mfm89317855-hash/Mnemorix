import React, { useState } from 'react';
import {
  Sliders,
  Zap,
  Filter,
  Plus,
  X,
} from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';
import { evaluatePolicy } from '../../lib/api';

export const PolicyStudio: React.FC = () => {
  const { policies, togglePolicy, addNewPolicy } = useSentinel();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [testPayload, setTestPayload] = useState<string>('');
  const [testResult, setTestResult] = useState<string | null>(null);

  // New Policy Modal State
  const [isNewPolicyModalOpen, setIsNewPolicyModalOpen] = useState(false);
  const [policyName, setPolicyName] = useState('');
  const [policyDesc, setPolicyDesc] = useState('');
  const [policyCat, setPolicyCat] = useState<'Zero-Trust' | 'Drift Control' | 'Privacy & PII' | 'Canary Defense' | 'Merkle Sealing'>('Zero-Trust');
  const [policyAction, setPolicyAction] = useState<'block' | 'quarantine' | 'sanitize'>('block');

  const categories = ['all', 'Zero-Trust', 'Drift Control', 'Privacy & PII', 'Canary Defense', 'Merkle Sealing'];

  const filteredPolicies = policies.filter((p) => {
    if (filterCategory === 'all') return true;
    return p.category === filterCategory;
  });

  const handleTestPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPayload.trim()) return;

    const res = await evaluatePolicy(testPayload);
    if (res) {
      setTestResult(res.result);
    }
  };

  const handleCreatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyName.trim() || !policyDesc.trim()) return;

    addNewPolicy({
      name: policyName.trim(),
      description: policyDesc.trim(),
      category: policyCat,
      enabled: true,
      ruleType: 'regex_guard',
      action: policyAction,
    });

    setPolicyName('');
    setPolicyDesc('');
    setIsNewPolicyModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="white-red-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-600">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">
              Zero-Trust Policy & Guardrails Studio
            </h2>
            <p className="text-xs font-mono text-slate-500">
              Configure drift thresholds, canary traps, PII redaction masks, and Merkle seal rules
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <span className="rounded-xl bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-mono text-red-700 font-bold">
            {policies.filter((p) => p.enabled).length} Active Policies
          </span>

          <button
            onClick={() => setIsNewPolicyModalOpen(true)}
            className="flex items-center space-x-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-3.5 py-1.5 text-xs font-mono font-bold text-white shadow-md shadow-red-500/20 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Publish Policy</span>
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-slate-500 mr-2 flex items-center">
          <Filter className="h-3.5 w-3.5 mr-1 text-red-600" /> Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-mono transition-all ${
              filterCategory === cat
                ? 'bg-red-600 text-white font-bold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPolicies.map((policy) => (
          <div
            key={policy.id}
            className={`white-red-card p-5 flex flex-col justify-between transition-all shadow-2xs ${
              policy.enabled ? 'border-slate-200 bg-white' : 'opacity-60 bg-slate-50/50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-md bg-red-50 px-2.5 py-0.5 text-[10px] font-mono text-red-700 font-bold border border-red-200">
                  {policy.category}
                </span>

                {/* Toggle Switch */}
                <button
                  type="button"
                  onClick={() => togglePolicy(policy.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    policy.enabled ? 'bg-red-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      policy.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <h3 className="font-display text-sm font-bold text-slate-900 mb-1.5">{policy.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans mb-4">
                {policy.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Action: <strong className="text-slate-900 uppercase font-bold">{policy.action}</strong></span>
              <span>Enforced: <strong className="text-red-600 font-bold">{policy.enforcedCount.toLocaleString()} times</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Policy Test Engine */}
      <div className="white-red-card p-5 space-y-4 shadow-2xs">
        <div className="flex items-center space-x-2">
          <Zap className="h-4 w-4 text-red-600" />
          <h3 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider">
            Policy Sandbox Evaluator
          </h3>
        </div>

        <form onSubmit={handleTestPolicy} className="space-y-3">
          <input
            type="text"
            value={testPayload}
            onChange={(e) => {
              setTestPayload(e.target.value);
              setTestResult(null);
            }}
            placeholder="Type sample text to test active policy triggers (e.g. 'bearer_token_xyz', 'SYSTEM_OVERRIDE', 'canary')..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:bg-white"
          />

          <div className="flex justify-between items-center">
            <span className="text-[11px] font-mono text-slate-500">
              Evaluates in-memory against all enabled rules
            </span>
            <button
              type="submit"
              disabled={!testPayload.trim()}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-mono font-bold transition-all shadow-md shadow-red-500/20 disabled:opacity-40 active:scale-95"
            >
              Evaluate Text
            </button>
          </div>
        </form>

        {testResult && (
          <div
            className={`p-3.5 rounded-xl font-mono text-xs font-medium ${
              testResult.includes('VIOLATION TRIGGERED')
                ? 'bg-red-50 border border-red-300 text-red-900'
                : 'bg-emerald-50 border border-emerald-300 text-emerald-900'
            }`}
          >
            {testResult.replace(/^\p{Extended_Pictographic}\uFE0F?\s*/u, '')}
          </div>
        )}
      </div>

      {/* Publish Custom Policy Modal */}
      {isNewPolicyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <button
              onClick={() => setIsNewPolicyModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-display text-base font-bold text-slate-900 mb-1">
              Publish Custom Zero-Trust Policy Rule
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-mono">
              Define custom security guardrails enforced across all connected agent memory streams.
            </p>

            <form onSubmit={handleCreatePolicy} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">Policy Title / Name</label>
                <input
                  type="text"
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)}
                  placeholder="e.g. Strict API Key Exfiltration Blocker"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:bg-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">Category</label>
                  <select
                    value={policyCat}
                    onChange={(e) => setPolicyCat(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
                  >
                    <option value="Zero-Trust">Zero-Trust</option>
                    <option value="Drift Control">Drift Control</option>
                    <option value="Privacy & PII">Privacy & PII</option>
                    <option value="Canary Defense">Canary Defense</option>
                    <option value="Merkle Sealing">Merkle Sealing</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">Enforcement Action</label>
                  <select
                    value={policyAction}
                    onChange={(e) => setPolicyAction(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
                  >
                    <option value="block">BLOCK (Drop Memory)</option>
                    <option value="quarantine">QUARANTINE (Sandbox Isolation)</option>
                    <option value="sanitize">SANITIZE (PII Redaction)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">Rule Description & Constraint</label>
                <textarea
                  value={policyDesc}
                  onChange={(e) => setPolicyDesc(e.target.value)}
                  rows={3}
                  placeholder="Describe what pattern or threat payload this policy detects and neutralizes..."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewPolicyModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!policyName.trim() || !policyDesc.trim()}
                  className="rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-mono font-bold text-white shadow-md shadow-red-500/20 disabled:opacity-40 transition-all active:scale-95"
                >
                  Publish guardrail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
