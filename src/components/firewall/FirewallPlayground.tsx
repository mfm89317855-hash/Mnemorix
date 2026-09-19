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
  Cpu,
} from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';
import { ATTACK_PRESETS } from '../../lib/presets';
import { sentinelInspect } from '../../lib/api';
import { AttackPreset, MemoryPartition } from '../../lib/types';
import { soundScanPing, soundThreatAlert, soundMemorySealed, soundClick } from '../../lib/sound';

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

const SEVERITY_CONFIG: Record<string, { bar: string; text: string }> = {
  critical: { bar: 'bg-red-600', text: 'text-red-600' },
  high:     { bar: 'bg-orange-500', text: 'text-orange-600' },
  medium:   { bar: 'bg-amber-500', text: 'text-amber-600' },
  low:      { bar: 'bg-yellow-400', text: 'text-yellow-600' },
  clean:    { bar: 'bg-emerald-500', text: 'text-emerald-600' },
};

export const FirewallPlayground: React.FC = () => {
  const { agents, addThreatEvent, addVerifiedMemory } = useSentinel();
  const [selectedPresetId, setSelectedPresetId] = useState<string>(ATTACK_PRESETS[0].id);
  const [targetAgentId, setTargetAgentId] = useState<string>('agent_sentinel_alpha');
  const [targetPartition, setTargetPartition] = useState<MemoryPartition>('episodic');
  const [payloadText, setPayloadText] = useState<string>(ATTACK_PRESETS[0].payload);

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [analysisResult, setAnalysisResult] = useState<SecurityAnalysisResult | null>(null);

  const activeAgent = agents.find((a) => a.id === targetAgentId) || agents[0];

  const handleSelectPreset = (preset: AttackPreset) => {
    soundClick();
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

    setScanStep(1);
    soundScanPing();
    await new Promise((res) => setTimeout(res, 350));

    setScanStep(2);
    soundScanPing();
    await new Promise((res) => setTimeout(res, 350));

    setScanStep(3);
    soundScanPing();

    const res = await sentinelInspect({
      agentId: activeAgent.id,
      agentName: activeAgent.name,
      partition: targetPartition,
      content: payloadText,
    });

    await new Promise((res) => setTimeout(res, 350));

    if (res) {
      const mappedResult: SecurityAnalysisResult = {
        threatDetected: res.threatDetected,
        threatType: res.threatType as any,
        threatScore: res.threatScore,
        verdict: res.verdict,
        identifiedTokens: res.identifiedTokens,
        recommendedAction: (res.recommendedAction || 'allow') as any,
        mitigationPlaybook: res.mitigationPlaybook,
        sanitizedText: res.sanitizedContent,
        severity: (res.severity || 'medium') as any,
        layers: res.layers as any,
      };
      setAnalysisResult(mappedResult);

      // Trigger sound based on result
      if (res.threatDetected) {
        soundThreatAlert();
        addThreatEvent({
          agentId: activeAgent.id,
          agentName: activeAgent.name,
          type: (res.threatType === 'none' ? 'indirect_prompt_injection' : res.threatType) as any,
          title: `Intercepted ${(res.threatType || 'threat').replace(/_/g, ' ').toUpperCase()}`,
          severity: (res.severity === 'clean' ? 'medium' : res.severity || 'medium') as any,
          rawPayload: payloadText,
          layerTriggered: (res.layers?.find((l) => l.status === 'flagged')?.name || 'L1: Heuristic Pattern Sentinel') as any,
          actionTaken: res.recommendedAction === 'allow' ? 'blocked' : (res.recommendedAction as any),
          explanation: res.verdict,
          threatScore: res.threatScore,
          mitigationApplied: res.mitigationPlaybook,
          sanitizedContent: res.sanitizedContent,
        });
      } else {
        soundMemorySealed();
      }
    }

    setIsScanning(false);
    setScanStep(4);
  };

  const handleCommitCleanMemory = async () => {
    if (!payloadText) return;
    soundMemorySealed();
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

  const layerConfig = [
    {
      id: 'L1',
      label: 'L1',
      title: 'Heuristic Token & Regex Sentinel',
      detail: 'Checks for [SYSTEM_OVERRIDE], jailbreaks & honeypots',
      step: 1,
      color: 'text-red-600',
      activeBg: 'border-red-400 bg-red-50/50',
      scanLabel: 'Scanning...',
      doneLabel: 'Passed to L2 →',
    },
    {
      id: 'L2',
      label: 'L2',
      title: 'Vector Cosine Drift & Outlier Radar',
      detail: 'Compares embedding distance against agent baseline Δ > 0.08',
      step: 2,
      color: 'text-amber-600',
      activeBg: 'border-amber-400 bg-amber-50/50',
      scanLabel: 'Computing Δ...',
      doneLabel: 'Evaluated →',
    },
    {
      id: 'L3',
      label: 'L3',
      title: 'Gemini 2.5 Neural Semantic Guard',
      detail: 'Deep intent reasoning & covert logic bomb audit (~500ms)',
      step: 3,
      color: 'text-red-600',
      activeBg: 'border-red-400 bg-red-50/50',
      scanLabel: 'Neural Audit...',
      doneLabel: '⚡ Verdict Ready',
    },
  ];

  const sevCfg = analysisResult ? SEVERITY_CONFIG[analysisResult.severity] ?? SEVERITY_CONFIG.clean : null;

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="white-red-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-red-600 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-600">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">
              Memory Firewall & Attack Injection Simulator
            </h2>
            <p className="text-xs font-mono text-slate-500">
              Red-Team testbed — Indirect Injections, Trojans, Role Escalations, Semantic Poisoning
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="badge-red font-mono">3-Tier Active Pipeline</span>
          <span className="badge-red font-mono">Gemini 2.5 Neural</span>
        </div>
      </div>

      {/* ── Preset Attack Selector ── */}
      <div className="space-y-3">
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
                className={`text-left rounded-xl border p-3.5 transition-all flex flex-col justify-between group ${
                  isSelected
                    ? 'border-red-400 bg-gradient-to-br from-red-50 to-rose-50/50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-red-300 hover:shadow-xs hover:-translate-y-0.5'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-display text-xs font-bold text-slate-900 group-hover:text-red-700 transition-colors">
                      {preset.name}
                    </span>
                    <span className={`rounded-lg px-1.5 py-0.5 text-[9px] font-mono font-bold border ${
                      preset.severity === 'critical'
                        ? 'bg-red-100 text-red-700 border-red-200'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}>
                      {preset.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed font-sans">
                    {preset.description}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] font-mono flex items-center justify-between">
                  <span className="text-slate-500">Target: <strong className="text-red-600">{preset.targetPartition.toUpperCase()}</strong></span>
                  {isSelected && <span className="text-red-600 font-bold">✓ Selected</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Workbench ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left — Payload Editor */}
        <div className="lg:col-span-6 space-y-4">
          <div className="white-red-card p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider">
                Memory Payload Inspector
              </h3>
              <div className="flex items-center space-x-1.5">
                <Cpu className="h-3.5 w-3.5 text-red-600" />
                <span className="text-[11px] font-mono text-slate-500">Live Injector</span>
              </div>
            </div>

            {/* Target Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-slate-600 block mb-1 font-semibold">Target Agent</label>
                <select
                  value={targetAgentId}
                  onChange={(e) => setTargetAgentId(e.target.value)}
                  className="field-input"
                >
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>{a.avatar} {a.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-600 block mb-1 font-semibold">Target Partition</label>
                <select
                  value={targetPartition}
                  onChange={(e) => setTargetPartition(e.target.value as any)}
                  className="field-input"
                >
                  <option value="episodic">Episodic</option>
                  <option value="semantic">Semantic</option>
                  <option value="procedural">Procedural</option>
                  <option value="working">Working Memory</option>
                </select>
              </div>
            </div>

            {/* Textarea */}
            <div>
              <label className="text-[11px] font-mono text-slate-600 block mb-1 font-semibold">Raw Memory Text Content</label>
              <textarea
                value={payloadText}
                onChange={(e) => setPayloadText(e.target.value)}
                rows={6}
                placeholder="Enter memory payload text to test against the 3-layer firewall..."
                className="field-input resize-none leading-relaxed"
              />
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunInspection}
              disabled={isScanning || !payloadText.trim()}
              className="w-full flex items-center justify-center space-x-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono font-bold py-3 text-xs shadow-lg shadow-red-500/20 transition-all active:scale-[0.98]"
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

        {/* Right — Pipeline + Verdict */}
        <div className="lg:col-span-6 space-y-4">

          {/* Defense Pipeline Steps */}
          <div className="white-red-card p-5 space-y-3 shadow-xs">
            <div className="flex items-center space-x-2 mb-3">
              <ShieldAlert className="h-4 w-4 text-red-600" />
              <h3 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider">
                3-Layer Defense Pipeline
              </h3>
            </div>

            {layerConfig.map((layer) => {
              const isActive = scanStep === layer.step;
              const isPast = scanStep > layer.step;
              const isFuture = scanStep < layer.step;

              return (
                <div
                  key={layer.id}
                  className={`rounded-xl border p-3.5 flex items-center justify-between transition-all duration-300 ${
                    isActive
                      ? `${layer.activeBg} shadow-xs`
                      : isPast
                      ? 'border-slate-200 bg-slate-50/80'
                      : 'border-slate-100 bg-slate-50/40 opacity-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-black font-mono border ${
                      isActive ? 'bg-white border-current shadow-xs' : 'bg-slate-100 border-slate-200'
                    } ${layer.color}`}>
                      {layer.label}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{layer.title}</div>
                      <div className="text-[10px] font-mono text-slate-500">{layer.detail}</div>
                    </div>
                  </div>
                  <div className="font-mono text-xs shrink-0 ml-2">
                    {isActive && <span className={`${layer.color} animate-pulse font-bold`}>{layer.scanLabel}</span>}
                    {isPast && <span className="text-emerald-600 font-bold">{layer.doneLabel}</span>}
                    {isFuture && scanStep === 0 && <span className="text-slate-400">Idle</span>}
                    {isFuture && scanStep > 0 && <span className="text-slate-400">Waiting...</span>}
                  </div>
                </div>
              );
            })}

            {/* Overall pipeline progress */}
            {isScanning && (
              <div className="threat-bar mt-2">
                <div
                  className="threat-bar-fill bg-gradient-to-r from-red-500 to-amber-500 animate-pipeline-fill"
                  style={{ width: `${(scanStep / 3) * 100}%` }}
                />
              </div>
            )}
          </div>

          {/* Verdict Card */}
          {analysisResult && (
            <div className={`rounded-xl border p-5 space-y-4 transition-all animate-slide-up ${
              analysisResult.threatDetected
                ? 'border-red-300 bg-red-50 shadow-sm'
                : 'border-emerald-300 bg-emerald-50 shadow-sm'
            }`}>
              {/* Top verdict */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  {analysisResult.threatDetected
                    ? <AlertOctagon className="h-5 w-5 text-red-600" />
                    : <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                  <span className="font-display font-bold text-sm text-slate-900">
                    {analysisResult.threatDetected
                      ? `THREAT: ${analysisResult.threatType.replace(/_/g, ' ').toUpperCase()}`
                      : 'ALL CLEAR — CLEAN MEMORY VERIFIED'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-slate-500">Score:</span>
                  <span className={`font-mono font-extrabold text-lg ${sevCfg?.text}`}>
                    {analysisResult.threatScore}/100
                  </span>
                </div>
              </div>

              {/* Threat score bar */}
              <div className="threat-bar">
                <div
                  className={`threat-bar-fill ${sevCfg?.bar}`}
                  style={{ width: `${analysisResult.threatScore}%` }}
                />
              </div>

              {/* Verdict text */}
              <p className="text-xs text-slate-700 leading-relaxed font-sans">{analysisResult.verdict}</p>

              {/* Adversarial tokens */}
              {analysisResult.identifiedTokens?.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block mb-1.5 font-bold">Identified Adversarial Tokens:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.identifiedTokens.map((tok, idx) => (
                      <span key={idx} className="badge-red font-mono">
                        {tok}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Mitigation Playbook */}
              <div className="rounded-xl border border-slate-200 bg-white p-3 text-[11px] font-mono text-slate-700 shadow-xs">
                <div className="text-red-700 font-bold flex items-center space-x-1.5 mb-1.5">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Automated Mitigation Playbook:</span>
                </div>
                <div className="text-slate-600 whitespace-pre-wrap leading-relaxed">{analysisResult.mitigationPlaybook}</div>
              </div>

              {/* Commit if clean */}
              {!analysisResult.threatDetected && (
                <button
                  onClick={handleCommitCleanMemory}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-mono font-bold py-2.5 text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98]"
                >
                  ⛓️ Seal & Append to SHA-256 Merkle Ledger
                </button>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
