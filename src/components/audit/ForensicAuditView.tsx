import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Search,
  FileCheck,
  Flame,
  Terminal,
  Lock,
  Copy,
  Check,
  FileText,
  ShieldAlert,
  Skull,
} from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';
import { truncateHash } from '../../lib/crypto';
import { ThreatEvent } from '../../lib/types';
import { getAuditExportUrl } from '../../lib/api';
import { soundClick, soundScan } from '../../lib/sound';
import { HackerIntrusionLog } from './HackerIntrusionLog';

export const ForensicAuditView: React.FC = () => {
  const { auditLogs, threatEvents, setIsComplianceModalOpen } = useSentinel();
  const [activeSubTab, setActiveSubTab] = useState<'threats' | 'audit_trail' | 'intrusion'>('threats');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedThreat, setSelectedThreat] = useState<ThreatEvent | null>(threatEvents[0] || null);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const filteredLogs = auditLogs.filter((log) => {
    if (statusFilter !== 'all' && log.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.source.toLowerCase().includes(q) ||
        log.targetId.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportLogsAsJSON = () => {
    soundScan();
    window.open(getAuditExportUrl(), '_blank');
  };

  const exportLogsAsCSV = () => {
    soundScan();
    const headers = ['ID', 'Timestamp', 'Action', 'Source', 'Target', 'Status', 'Hash', 'Details'];
    const rows = auditLogs.map((log) => [
      `"${log.id}"`,
      `"${new Date(log.timestamp).toISOString()}"`,
      `"${log.action}"`,
      `"${log.source}"`,
      `"${log.targetId}"`,
      `"${log.status}"`,
      `"${log.hash}"`,
      `"${log.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mnemorix_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyPayload = (text: string) => {
    soundClick();
    navigator.clipboard.writeText(text);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="white-red-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-600 shadow-2xs">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Forensic Incident & Audit Log War Room
              </h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-600 border border-slate-200">
                TAMPER-PROOF
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500">
              Immutable cryptographic ledger trails compliant with SOC2 Type II, ISO/IEC 42001, and NIST AI RMF
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { soundClick(); setIsComplianceModalOpen(true); }}
            className="flex items-center space-x-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 px-3.5 py-2 text-xs font-mono font-bold transition-all shadow-2xs active:scale-95"
          >
            <FileCheck className="h-3.5 w-3.5" />
            <span>Compliance Cert</span>
          </button>

          <button
            onClick={exportLogsAsCSV}
            className="flex items-center space-x-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2 text-xs font-mono font-semibold transition-all shadow-2xs active:scale-95"
            title="Download full audit log as CSV"
          >
            <FileText className="h-3.5 w-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={exportLogsAsJSON}
            className="flex items-center space-x-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2 text-xs font-mono font-semibold transition-all shadow-2xs active:scale-95"
            title="Export raw JSON stream"
          >
            <Download className="h-3.5 w-3.5 text-red-600" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* View Switcher: Threat War Room vs Audit Log Table */}
      <div className="flex space-x-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => { soundClick(); setActiveSubTab('threats'); }}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-mono font-bold transition-all ${
            activeSubTab === 'threats'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Flame className="h-4 w-4" />
          <span>Threat Incidents ({threatEvents.length})</span>
        </button>

        <button
          onClick={() => { soundClick(); setActiveSubTab('audit_trail'); }}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-mono font-bold transition-all ${
            activeSubTab === 'audit_trail'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>Immutable Ledger ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => { soundClick(); setActiveSubTab('intrusion'); }}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-mono font-bold transition-all ${
            activeSubTab === 'intrusion'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Skull className="h-4 w-4" />
          <span>Hacker Intrusion Log</span>
        </button>
      </div>

      {/* Subtab 1: Threat Incident War Room */}
      {activeSubTab === 'threats' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Incident List */}
            <div className="lg:col-span-6 space-y-3">
              {threatEvents.map((threat) => (
                <div
                  key={threat.id}
                  onClick={() => { soundClick(); setSelectedThreat(threat); }}
                  className={`white-red-card p-4 cursor-pointer transition-all shadow-2xs card-lift ${
                    selectedThreat?.id === threat.id
                      ? 'border-red-600 bg-red-50/80 shadow-xs ring-2 ring-red-500/20'
                      : 'border-slate-200 bg-white hover:border-red-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-mono font-bold text-red-800 uppercase border border-red-200">
                        {threat.severity}
                      </span>
                      <span className="font-display text-xs font-bold text-slate-900">{threat.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(threat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-sans mb-2.5">
                    {threat.explanation}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
                    <span>Target: <strong className="text-slate-900">{threat.agentName}</strong></span>
                    <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      Threat Score: {threat.threatScore}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Forensic Payload Inspector */}
            <div className="lg:col-span-6">
              {selectedThreat ? (
                <div className="white-red-card p-5 space-y-4 sticky top-20 animate-in fade-in shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="font-display text-sm font-bold text-slate-900">
                        Packet-Level Forensic Inspector
                      </h3>
                      <p className="text-[10px] font-mono text-slate-500">Incident ID: {selectedThreat.id}</p>
                    </div>
                    <span className="rounded-md bg-red-100 px-2.5 py-1 text-[10px] font-mono font-bold text-red-800 border border-red-200">
                      ACTION: {selectedThreat.actionTaken.toUpperCase()}
                    </span>
                  </div>

                  {/* Raw Adversarial Payload */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-mono text-slate-600 font-bold">Raw Intercepted Memory Buffer:</label>
                      <button
                        onClick={() => handleCopyPayload(selectedThreat.rawPayload)}
                        className="flex items-center space-x-1 text-[10px] font-mono text-slate-500 hover:text-red-600 transition-colors"
                      >
                        {copiedPayload ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span className="text-emerald-600 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy Buffer</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="rounded-xl border border-red-200 bg-red-50/70 p-3.5 font-mono text-xs text-red-900 whitespace-pre-wrap leading-relaxed shadow-inner">
                      {selectedThreat.rawPayload}
                    </div>
                  </div>

                  {/* Sanitized Version (if applicable) */}
                  {selectedThreat.sanitizedContent && (
                    <div>
                      <label className="text-[11px] font-mono text-slate-600 block mb-1 font-bold">Sanitized / Redacted Output:</label>
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 font-mono text-xs text-emerald-900 whitespace-pre-wrap leading-relaxed shadow-inner">
                        {selectedThreat.sanitizedContent}
                      </div>
                    </div>
                  )}

                  {/* Mitigation Protocol */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-mono space-y-1.5">
                    <div className="text-red-700 font-bold flex items-center space-x-1.5">
                      <Terminal className="h-3.5 w-3.5 text-red-600" />
                      <span>Applied Remediation Protocol:</span>
                    </div>
                    <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">{selectedThreat.mitigationApplied}</div>
                  </div>
                </div>
              ) : (
                <div className="white-red-card p-12 text-center text-slate-400 font-mono text-xs">
                  Select an incident on the left to inspect raw packet forensic payloads.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Subtab 2: Immutable Ledger Audit Trail */}
      {activeSubTab === 'audit_trail' && (
        <div className="white-red-card p-5 space-y-4 shadow-2xs">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter logs by action, source, target, or details..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-red-500 focus:bg-white transition-colors"
              >
                <option value="all">All Statuses</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="BLOCKED">BLOCKED</option>
                <option value="TAMPER_ALERT">TAMPER_ALERT</option>
                <option value="QUARANTINED">QUARANTINED</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 font-semibold">Timestamp</th>
                  <th className="pb-3 font-semibold">Action</th>
                  <th className="pb-3 font-semibold">Source Sentinel</th>
                  <th className="pb-3 font-semibold">Target</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Hash Anchor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3 font-bold text-slate-900">{log.action}</td>
                    <td className="py-3 text-slate-700">{log.source}</td>
                    <td className="py-3 text-red-700 font-semibold">{log.targetId}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[9px] font-bold uppercase ${
                          log.status === 'SUCCESS' || log.status === 'RESTORED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : log.status === 'BLOCKED'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500 font-mono">
                      {truncateHash(log.hash, 6, 6)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 3: Hacker Intrusion Log */}
      {activeSubTab === 'intrusion' && (
        <HackerIntrusionLog />
      )}

    </div>
  );
};
