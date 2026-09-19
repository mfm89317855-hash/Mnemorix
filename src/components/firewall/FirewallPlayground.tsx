import React, { useState } from 'react';
import {
  ShieldAlert,
  Flame,
  Zap,
  CheckCircle2,
  AlertOctagon,
  Play,
  Lock,
  RefreshCw,
  Terminal,
  Shield,
} from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';
import { ATTACK_PRESETS } from '../../lib/presets';
import { sentinelInspect } from '../../lib/api';
import { AttackPreset, MemoryPartition } from '../../lib/types';

export interface SecurityAnalysisResult {
  threatDetected: boolean;
  threatType: string;
  threatScore: number;
  verdict: string;
  identifiedTokens: string[];
  recommendedAction: 'block' | 'quarantine' | 'sanitize' | 'allow';
  mitigationPlaybook: string;
  sanitizedText: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'clean';
  layers?: Array<{
    name: string;
    status: 'passed' | 'flagged' | 'skipped';
    score: number;
    details: string;
  }>;
}

export const FirewallPlayground: React.FC = () => {
  const { agents, selectedAgent, addThreatEvent, addVerifiedMemory } = useSentinel();
  const [selectedPresetId, setSelectedPresetId] = useState<string>(ATTACK_PRESETS[0].id);
  const [targetAgentId, setTargetAgentId] = useState<string>('agent_sentinel_alpha');
  const [targetPartition, setTargetPartition] = useState<MemoryPartition>('episodic');
  const [payloadText, setPayloadText] = useState<string>(ATTACK_PRESETS[0].payload);

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [analysisResult, setAnalysisResult] = useState<SecurityAnalysisResult | null>(null);

  const activeAgent = agents.find((a) => a.id === targetAgentId) || agents[0];

  const handleSelectPreset = (preset: AttackPreset) => {
    setSelectedPresetId(preset.id);
    setTargetAgentId(preset.targetAgentId);
    setTargetPartition(preset.targetPartition);
    setPayloadText(preset.payload);
    setAnalysisResult(null);
    setScanStep(0);
  };

  const handleRunInspection = async () => {
    if (!payloadText.trim() || isScanning) return;

    setIsScanning(true);
    setAnalysisResult(null);
    setScanStep(1); // L1 Scanning

    await new Promise((res) => setTimeout(res, 300));
    setScanStep(2); // L2 Vector Cosine Scanning

    await new Promise((res) => setTimeout(res, 300));
    setScanStep(3); // L3 Neural Semantic Scanning

    const res = await sentinelInspect({
      agentId: activeAgent.id,
      agentName: activeAgent.name,
      partition: targetPartition,
      content: payloadText,
    });

    await new Promise((res) => setTimeout(res, 300));

    if (res) {
      const mappedResult: SecurityAnalysisResult = {
        threatDetected: res.threatDetected,
        threatType: res.threatType,
        threatScore: res.threatScore,
        verdict: res.verdict,
        identifiedTokens: res.identifiedTokens,
        recommendedAction: res.recommendedAction,
        mitigationPlaybook: res.mitigationPlaybook,
        sanitizedText: res.sanitizedContent,
        severity: res.severity,
        layers: res.layers,
      };
      setAnalysisResult(mappedResult);

      if (res.threatDetected) {
        addThreatEvent({
          agentId: activeAgent.id,
          agentName: activeAgent.name,
          type: res.threatType === 'none' ? 'indirect_prompt_injection' : res.threatType,
          title: `Intercepted ${res.threatType.replace(/_/g, ' ').toUpperCase()}`,
          severity: res.severity === 'clean' ? 'medium' : res.severity,
          rawPayload: payloadText,
          layerTriggered:
            res.layers?.find((l) => l.status === 'flagged')?.name || 'L1: Heuristic Pattern Sentinel',
          actionTaken: res.recommendedAction === 'allow' ? 'blocked' : (res.recommendedAction as any),
          explanation: res.verdict,
          threatScore: res.threatScore,
          mitigationApplied: res.mitigationPlaybook,
          sanitizedContent: res.sanitizedContent,
        });
      }
    }

    setIsScanning(false);
    setScanStep(4); // Finished
  };

  const handleCommitCleanMemory = async () => {
    if (!payloadText) return;
    await addVerifiedMemory({
      agentId: activeAgent.id,
      agentName: activeAgent.name,
      partition: targetPartition,
      content: payloadText,
      category: 'Verified Manual Injection',
      piiRedacted: false,
      confidenceScore: 0.999,
      tags: ['manual_test', 'verified'],
      author: 'Security Analyst (UI Testbed)',
      vectorDriftDelta: 0.002,
    });
    alert('✅ Verified memory sealed into Merkle ledger!');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="white-red-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 border border-red-200 text-red-600">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">
              Memory Firewall & Attack Injection Simulator
            </h2>
            <p className="text-xs font-mono text-slate-500">
              Red-Team testbed for Indirect Injections, Trojans, Role Escalations, and Semantic Poisoning
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="rounded bg-red-50 border border-red-200 px-3 py-1 text-xs font-mono text-red-700 font-bold">
            3-Tier Active Pipeline
          </span>
        </div>
      </div>

      {/* Preset Attacks Selector Grid */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-slate-700 font-bold flex items-center space-x-1.5">
          <Shield className="h-3.5 w-3.5 text-red-600" />
          <span>Select Threat Attack Scenario (Red Team Preset)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {ATTACK_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`text-left rounded-xl border p-3.5 transition-all flex flex-col justify-between shadow-2xs ${
                  isSelected
                    ? 'border-red-400 bg-red-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-red-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-display text-xs font-bold text-slate-900">{preset.name}</span>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase ${
                        preset.severity === 'critical'
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {preset.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed font-sans">
                    {preset.description}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] font-mono text-red-600 font-bold flex items-center justify-between">
                  <span>Target: {preset.targetPartition.toUpperCase()}</span>
                  <span>Select Payload →</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Ingestion Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Payload Editor & Target Config */}
        <div className="lg:col-span-6 space-y-4">
          <div className="white-red-card p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider">
                Memory Payload Inspector
              </h3>
              <span className="text-[11px] font-mono text-slate-500">Live Injector</span>
            </div>

            {/* Target Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-slate-600 block mb-1">Target Agent</label>
                <select
                  value={targetAgentId}
                  onChange={(e) => setTargetAgentId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
                >
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.avatar} {a.name} ({a.codeName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-600 block mb-1">Target Partition</label>
                <select
                  value={targetPartition}
                  onChange={(e) => setTargetPartition(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
                >
                  <option value="episodic">Episodic (Conversation)</option>
                  <option value="semantic">Semantic (Knowledge)</option>
                  <option value="procedural">Procedural (Rules/Tools)</option>
                  <option value="working">Working Memory (Scratchpad)</option>
                </select>
              </div>
            </div>

            {/* Textarea */}
            <div>
              <label className="text-[11px] font-mono text-slate-600 block mb-1">Raw Memory Text Content</label>
              <textarea
                value={payloadText}
                onChange={(e) => setPayloadText(e.target.value)}
                rows={5}
                placeholder="Enter memory payload text to test against the 3-layer firewall..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:bg-white"
              />
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunInspection}
              disabled={isScanning || !payloadText.trim()}
              className="w-full flex items-center justify-center space-x-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-mono font-bold py-2.5 text-xs shadow-sm transition-all active:scale-[0.98]"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Inspecting Through Firewall Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  <span>Execute Neural Firewall Inspection 🛡️</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Multi-Layer Pipeline & Verdict */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Defense Pipeline Steps */}
          <div className="white-red-card p-5 space-y-3 shadow-2xs">
            <h3 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Defense Inspection Pipeline
            </h3>

            {/* Layer 1 */}
            <div
              className={`rounded-lg border p-3 flex items-center justify-between transition-all ${
                scanStep >= 1
                  ? scanStep === 1
                    ? 'border-red-400 bg-red-50'
                    : 'border-slate-200 bg-slate-50'
                  : 'border-slate-100 bg-slate-50/50 opacity-60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="font-mono text-xs font-bold text-red-600">L1</span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Heuristic Token & Regex Sentinel</div>
                  <div className="text-[10px] font-mono text-slate-500">Checks for `[SYSTEM_OVERRIDE]`, jailbreaks & honeypots</div>
                </div>
              </div>
              <div className="font-mono text-xs">
                {scanStep === 1 && <span className="text-red-600 animate-pulse font-bold">Scanning...</span>}
                {scanStep > 1 && <span className="text-emerald-600 font-bold">Passed to L2</span>}
                {scanStep === 0 && <span className="text-slate-400">Idle</span>}
              </div>
            </div>

            {/* Layer 2 */}
            <div
              className={`rounded-lg border p-3 flex items-center justify-between transition-all ${
                scanStep >= 2
                  ? scanStep === 2
                    ? 'border-red-400 bg-red-50'
                    : 'border-slate-200 bg-slate-50'
                  : 'border-slate-100 bg-slate-50/50 opacity-60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="font-mono text-xs font-bold text-slate-700">L2</span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Vector Cosine Drift & Outlier Radar</div>
                  <div className="text-[10px] font-mono text-slate-500">Compares embedding distance against agent baseline</div>
                </div>
              </div>
              <div className="font-mono text-xs">
                {scanStep === 2 && <span className="text-red-600 animate-pulse font-bold">Computing Δ...</span>}
                {scanStep > 2 && <span className="text-emerald-600 font-bold">Evaluated</span>}
                {scanStep < 2 && <span className="text-slate-400">Waiting</span>}
              </div>
            </div>

            {/* Layer 3 */}
            <div
              className={`rounded-lg border p-3 flex items-center justify-between transition-all ${
                scanStep >= 3
                  ? scanStep === 3
                    ? 'border-red-400 bg-red-50'
                    : 'border-slate-200 bg-slate-50'
                  : 'border-slate-100 bg-slate-50/50 opacity-60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="font-mono text-xs font-bold text-amber-600">L3</span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Gemini 2.5 Neural Semantic Intent Guard</div>
                  <div className="text-[10px] font-mono text-slate-500">Deep intent reasoning & covert logic bomb audit</div>
                </div>
              </div>
              <div className="font-mono text-xs">
                {scanStep === 3 && <span className="text-red-600 animate-pulse font-bold">Neural Audit...</span>}
                {scanStep > 3 && <span className="text-red-600 font-bold">Verdict Ready</span>}
                {scanStep < 3 && <span className="text-slate-400">Waiting</span>}
              </div>
            </div>
          </div>

          {/* Analysis Verdict Result Card */}
          {analysisResult && (
            <div
              className={`rounded-xl border p-5 space-y-3.5 transition-all animate-in fade-in duration-300 ${
                analysisResult.threatDetected
                  ? 'border-red-300 bg-red-50 shadow-xs'
                  : 'border-emerald-300 bg-emerald-50 shadow-xs'
              }`}
            >
              {/* Top Verdict Pill */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {analysisResult.threatDetected ? (
                    <AlertOctagon className="h-5 w-5 text-red-600" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  )}
                  <span className="font-display font-bold text-sm text-slate-900">
                    {analysisResult.threatDetected
                      ? `THREAT DETECTED: ${analysisResult.threatType.replace(/_/g, ' ').toUpperCase()}`
                      : 'ALL CLEAR: CLEAN MEMORY VERIFIED'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-slate-500">Threat Score:</span>
                  <span
                    className={`font-mono font-extrabold text-sm ${
                      analysisResult.threatScore > 50 ? 'text-red-600' : 'text-emerald-600'
                    }`}
                  >
                    {analysisResult.threatScore}/100
                  </span>
                </div>
              </div>

              {/* Assessment Text */}
              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                {analysisResult.verdict}
              </p>

              {/* Identified Tokens */}
              {analysisResult.identifiedTokens && analysisResult.identifiedTokens.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block mb-1 font-bold">Identified Adversarial Tokens:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.identifiedTokens.map((tok, idx) => (
                      <span key={idx} className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-mono text-red-800 border border-red-200 font-bold">
                        {tok}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Mitigation / Playbook */}
              <div className="rounded-lg border border-slate-200 bg-white p-3 text-[11px] font-mono text-slate-700 space-y-1 shadow-2xs">
                <div className="text-red-700 font-bold flex items-center space-x-1.5">
                  <Terminal className="h-3 w-3 text-red-600" />
                  <span>Enforced Automated Mitigation Playbook:</span>
                </div>
                <div className="text-slate-600 whitespace-pre-wrap">{analysisResult.mitigationPlaybook}</div>
              </div>

              {/* Commit Button (if clean) */}
              {!analysisResult.threatDetected && (
                <button
                  onClick={handleCommitCleanMemory}
                  className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold py-2 text-xs shadow-sm transition-all active:scale-95"
                >
                  Seal & Append to SHA-256 Merkle Ledger ⛓️
                </button>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
