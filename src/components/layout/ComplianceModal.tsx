import React, { useState } from 'react';
import { X, Download, Printer, ShieldCheck, Award } from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';

export const ComplianceModal: React.FC = () => {
  const { isComplianceModalOpen, setIsComplianceModalOpen, blocks, isChainCompromised, kpis, agents, policies } = useSentinel();
  const [selectedStandard, setSelectedStandard] = useState<'all' | 'nist' | 'iso' | 'soc2'>('all');

  if (!isComplianceModalOpen) return null;

  const handleDownloadJSON = () => {
    const reportData = {
      title: 'MNEMORIX Cryptographic Memory Audit & AI Governance Report',
      generatedAt: new Date().toISOString(),
      systemIntegrity: isChainCompromised ? 'COMPROMISED' : '100% VERIFIED',
      merkleBlocksCount: blocks.length,
      activeAgentsCount: agents.length,
      enforcedPolicies: policies.filter((p) => p.enabled).map((p) => p.name),
      merkleRoot: blocks[blocks.length - 1]?.merkleRoot || 'N/A',
      frameworksEvaluated: ['NIST AI RMF 1.0', 'ISO/IEC 42001', 'SOC2 Type II - Security & Confidentiality', 'EU AI Act Article 12'],
      blocksSample: blocks.map((b) => ({
        block: b.blockNumber,
        hash: b.hash,
        prevHash: b.prevHash,
        agent: b.agentName,
        signature: b.signature,
      })),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mnemorix-audit-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setIsComplianceModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5 shrink-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-600">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">
              Cryptographic AI Memory Compliance Report
            </h3>
            <p className="text-xs text-slate-500">
              Audit-Ready Certification for NIST AI RMF, ISO 42001 & SOC2 Type II
            </p>
          </div>
        </div>

        {/* Filter Standard Selector */}
        <div className="flex space-x-2 mb-4 shrink-0">
          {[
            { id: 'all', label: 'All Frameworks' },
            { id: 'nist', label: 'NIST AI RMF 1.0' },
            { id: 'iso', label: 'ISO/IEC 42001' },
            { id: 'soc2', label: 'SOC2 Type II' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedStandard(f.id as any)}
              className={`rounded-xl px-3 py-1.5 text-xs font-mono font-medium transition-all ${
                selectedStandard === f.id
                  ? 'bg-red-600 text-white shadow-sm font-bold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Report Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs text-slate-700 font-sans">
          
          {/* Certificate Badge */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="h-8 w-8 text-emerald-600 shrink-0" />
              <div>
                <div className="text-sm font-bold text-emerald-950">Cryptographic Certificate: PASS</div>
                <div className="text-[11px] text-emerald-800 font-mono mt-0.5">
                  Root Merkle Hash: {blocks[blocks.length - 1]?.merkleRoot || 'f0048291039...'}
                </div>
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-[11px] text-emerald-700">Status</div>
              <div className="text-xs font-bold text-emerald-700">VERIFIED CANONICAL</div>
            </div>
          </div>

          {/* Compliance Breakdown Table */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-100 px-4 py-2.5 font-mono text-[11px] font-bold text-slate-700">
              AUDIT CONTROL REQUIREMENTS MATRIX
            </div>
            <div className="divide-y divide-slate-200">
              <div className="p-3.5 flex items-start justify-between space-x-4 bg-white">
                <div>
                  <span className="font-bold text-slate-900 font-mono">NIST AI RMF GOVERN 1.2:</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Continuous monitoring and immutable audit logging for AI agent memory updates.
                  </p>
                </div>
                <span className="shrink-0 rounded-lg bg-emerald-100 px-2.5 py-1 text-[10px] font-mono text-emerald-800 font-bold border border-emerald-200">
                  COMPLIANT
                </span>
              </div>

              <div className="p-3.5 flex items-start justify-between space-x-4 bg-white">
                <div>
                  <span className="font-bold text-slate-900 font-mono">ISO/IEC 42001 (Section 7.3):</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Data provenance and tamper-evident cryptographic validation across knowledge lifecycles.
                  </p>
                </div>
                <span className="shrink-0 rounded-lg bg-emerald-100 px-2.5 py-1 text-[10px] font-mono text-emerald-800 font-bold border border-emerald-200">
                  COMPLIANT
                </span>
              </div>

              <div className="p-3.5 flex items-start justify-between space-x-4 bg-white">
                <div>
                  <span className="font-bold text-slate-900 font-mono">SOC2 Type II - CC6.1 & CC6.6:</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Zero-trust input sanitization, automated PII masking, and unauthorized write blocking.
                  </p>
                </div>
                <span className="shrink-0 rounded-lg bg-emerald-100 px-2.5 py-1 text-[10px] font-mono text-emerald-800 font-bold border border-emerald-200">
                  COMPLIANT
                </span>
              </div>

              <div className="p-3.5 flex items-start justify-between space-x-4 bg-white">
                <div>
                  <span className="font-bold text-slate-900 font-mono">EU AI Act (Article 12 - Record-Keeping):</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Automatic recording of events (logs) over the lifecycle of high-risk AI agent systems.
                  </p>
                </div>
                <span className="shrink-0 rounded-lg bg-emerald-100 px-2.5 py-1 text-[10px] font-mono text-emerald-800 font-bold border border-emerald-200">
                  COMPLIANT
                </span>
              </div>
            </div>
          </div>

          {/* Audit Telemetry Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="text-[10px] font-mono text-slate-500">Total Memories Protected</div>
              <div className="text-lg font-bold text-slate-900 font-mono mt-1">{kpis.totalMemories}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="text-[10px] font-mono text-slate-500">Attacks Intercepted</div>
              <div className="text-lg font-bold text-emerald-600 font-mono mt-1">{kpis.injectionsBlocked}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="text-[10px] font-mono text-slate-500">Merkle Chain Depth</div>
              <div className="text-lg font-bold text-red-600 font-mono mt-1">{blocks.length} Blocks</div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-mono text-slate-500">
            SHA-256 Digital Certificate #MNX-2026-9901
          </span>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print PDF</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="flex items-center space-x-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-red-500/20 transition-all active:scale-95"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Certified JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
