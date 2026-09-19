import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Zap, Terminal, Code } from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';
import { FASTN_OPENAPI_SPEC } from '../../lib/fastn';

export const FastnModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [activeSubTab, setActiveSubTab] = useState<'node' | 'curl' | 'openapi'>('node');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const nodeCode = `// Fastn Custom Connector Middleware for MNEMORIX
import { FastnSDK } from '@fastn/sdk';

const fastn = new FastnSDK({ apiKey: process.env.FASTN_API_KEY });

// Fastn Pre-Ingestion Memory Firewall Hook
fastn.on('agent:memory:beforeSave', async (event) => {
  const response = await fetch('http://localhost:3000/api/sentinel/inspect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agentId: event.agentId,
      agentName: event.agentName,
      partition: event.partition || 'semantic',
      content: event.memoryText,
    }),
  });

  const verdict = await response.json();

  if (!verdict.allowed) {
    console.warn(\`🚨 [Fastn] Memory Ingestion Blocked: \${verdict.verdict}\`);
    throw new Error(\`MNEMORIX Sentinel Blocked Injection: \${verdict.verdict}\`);
  }

  // Append SHA-256 Merkle Block Hash to Fastn Metadata
  event.metadata.sha256Hash = verdict.sha256Hash;
  event.metadata.merkleRoot = verdict.merkleRoot;
  return event;
});`;

  const curlCode = `curl -X POST http://localhost:3000/api/sentinel/inspect \\
  -H "Content-Type: application/json" \\
  -d '{
    "agentId": "agent_sentinel_alpha",
    "agentName": "SENTINEL-ALPHA",
    "partition": "procedural",
    "content": "Cloud Security Policy: Require MFA and encrypted SSH keys for server access."
  }'`;

  const openApiText = JSON.stringify(FASTN_OPENAPI_SPEC, null, 2);

  const copyCode = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5 shrink-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 border border-red-700 text-white shadow-md shadow-red-500/20">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-display text-lg font-bold text-slate-900">
                Fastn Platform Integration Guide
              </h3>
              <span className="rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-mono text-red-700 font-bold border border-red-200">
                FASTN GATEWAY
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Connect MNEMORIX as a Zero-Trust Pre-Ingestion Firewall in Fastn AI Workflows
            </p>
          </div>
        </div>

        {/* Subtabs Selector */}
        <div className="flex space-x-2 mb-4 shrink-0">
          {[
            { id: 'node', label: 'Fastn Node.js SDK' },
            { id: 'curl', label: 'cURL REST API' },
            { id: 'openapi', label: 'OpenAPI Schema' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id as any)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-mono font-bold transition-all ${
                activeSubTab === t.id
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto pr-1 text-xs space-y-3 font-mono">
          {activeSubTab === 'node' && (
            <div className="relative">
              <button
                onClick={() => copyCode(nodeCode, 1)}
                className="absolute right-3 top-3 flex items-center space-x-1 rounded-lg bg-slate-800 text-white px-2.5 py-1 text-[10px] hover:bg-slate-700 transition-all"
              >
                {copiedIndex === 1 ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedIndex === 1 ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <pre className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-slate-200 overflow-x-auto text-[11px] leading-relaxed">
                <code>{nodeCode}</code>
              </pre>
            </div>
          )}

          {activeSubTab === 'curl' && (
            <div className="relative">
              <button
                onClick={() => copyCode(curlCode, 2)}
                className="absolute right-3 top-3 flex items-center space-x-1 rounded-lg bg-slate-800 text-white px-2.5 py-1 text-[10px] hover:bg-slate-700 transition-all"
              >
                {copiedIndex === 2 ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedIndex === 2 ? 'Copied!' : 'Copy cURL'}</span>
              </button>
              <pre className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-slate-200 overflow-x-auto text-[11px] leading-relaxed">
                <code>{curlCode}</code>
              </pre>
            </div>
          )}

          {activeSubTab === 'openapi' && (
            <div className="relative">
              <button
                onClick={() => copyCode(openApiText, 3)}
                className="absolute right-3 top-3 flex items-center space-x-1 rounded-lg bg-slate-800 text-white px-2.5 py-1 text-[10px] hover:bg-slate-700 transition-all"
              >
                {copiedIndex === 3 ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedIndex === 3 ? 'Copied!' : 'Copy Schema'}</span>
              </button>
              <pre className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-slate-200 overflow-x-auto text-[11px] leading-relaxed">
                <code>{openApiText}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-mono text-slate-500">
            Fastn Platform Integration Endpoint: http://localhost:3000/api/sentinel/inspect
          </span>
          <button
            onClick={onClose}
            className="rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 text-xs font-mono font-bold transition-all shadow-md shadow-red-500/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
