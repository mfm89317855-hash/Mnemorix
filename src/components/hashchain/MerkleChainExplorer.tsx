import React, { useState, useCallback } from 'react';
import {
  Boxes,
  Lock,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Edit3,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
  Link,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSentinel } from '../../context/SentinelContext';
import { truncateHash } from '../../lib/crypto';
import { MerkleBlock } from '../../lib/types';
import { soundSelfHeal, soundTamperWarning, soundClick, soundChainVerified } from '../../lib/sound';

export const MerkleChainExplorer: React.FC = () => {
  const {
    blocks,
    isChainCompromised,
    compromisedBlockIndex,
    compromisedReason,
    tamperBlock,
    selfHealChain,
    auditChainIntegrity,
    resetToEmptyLedger,
  } = useSentinel();

  const [tamperingBlockNumber, setTamperingBlockNumber] = useState<number | null>(null);
  const [tamperInputText, setTamperInputText] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [selectedBlockDetail, setSelectedBlockDetail] = useState<MerkleBlock | null>(null);

  const handleStartTamper = (block: MerkleBlock) => {
    soundTamperWarning();
    setTamperingBlockNumber(block.blockNumber);
    setTamperInputText(
      block.content.replace(/Block/g, 'ALLOW ALL').replace(/capped at 2.4%/g, 'UNRESTRICTED 100% DRAWDOWN') +
        ' [MALICIOUS_ROGUE_INJECTION]'
    );
  };

  const handleApplyTamper = async (blockNumber: number) => {
    soundTamperWarning();
    await tamperBlock(blockNumber, tamperInputText);
    setTamperingBlockNumber(null);
  };

  const handleSelfHeal = async () => {
    soundSelfHeal();
    await selfHealChain();
    // Fire confetti celebration
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.4 },
      colors: ['#22c55e', '#16a34a', '#4ade80', '#86efac', '#ffffff'],
      gravity: 0.9,
      scalar: 0.85,
    });
  };

  const handleAudit = () => {
    soundClick();
    auditChainIntegrity();
    setTimeout(() => soundChainVerified(), 800);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    soundClick();
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6">

      {/* ── Header & Controls ── */}
      <div className="white-red-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-600 shadow-xs">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                Cryptographic Merkle DAG & Hash-Chain Ledger
              </h2>
              <p className="text-xs font-mono text-slate-500">
                Immutable SHA-256 sequential parent-chained blocks with Ed25519 signatures
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleAudit}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono font-bold text-slate-700 hover:bg-slate-50 hover:border-red-300 transition-all shadow-xs"
          >
            <RefreshCw className="h-3.5 w-3.5 text-red-600" />
            <span>Audit Chain</span>
          </button>

          <button
            onClick={() => { soundClick(); resetToEmptyLedger(); }}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white hover:bg-red-50 text-red-700 px-3.5 py-2 text-xs font-mono font-bold transition-all shadow-xs"
            title="Wipe sample data and start a fresh empty working model"
          >
            <span>Wipe Data</span>
          </button>

          {isChainCompromised ? (
            <button
              onClick={handleSelfHeal}
              className="flex items-center space-x-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-mono font-bold text-white shadow-md shadow-red-500/20 transition-all active:scale-95 glow-red animate-pulse"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Restore canonical chain</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-xs font-mono text-emerald-700 font-bold shadow-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>100% Verified</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-status-beacon" />
            </div>
          )}
        </div>
      </div>

      {/* ── Explanatory Banner ── */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
        <p className="text-slate-700 leading-relaxed font-sans">
          <strong className="text-amber-700 font-mono">Tamper simulation testbed:</strong>{' '}
          Click <span className="text-red-600 font-mono font-bold">"Simulate Tamper"</span> on any block below to simulate unauthorized memory modification. Watch the SHA-256 Merkle root break in real-time, then trigger the automated self-healing protocol!
        </p>
        <span className="badge-amber whitespace-nowrap">Red Team Mode</span>
      </div>

      {/* ── Block Sequence Visualizer ── */}
      <div className="space-y-2">
        {blocks.map((block, index) => {
          const isGenesis = block.blockNumber === 0;
          const isTampered = block.isTampered || (isChainCompromised && compromisedBlockIndex !== null && index >= compromisedBlockIndex);
          const isCompromiseOrigin = isChainCompromised && compromisedBlockIndex === index;

          return (
            <div key={block.blockNumber} className="relative">
              {/* Chain link connector */}
              {!isGenesis && (
                <div className="chain-link-line" />
              )}

              <div
                className={`relative rounded-xl border p-5 transition-all duration-300 animate-slide-up ${
                  isTampered
                    ? 'border-red-400 bg-red-50/50 shadow-sm animate-threat-flash'
                    : 'border-slate-200 bg-white hover:border-red-300 hover:shadow-md'
                }`}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {/* SHA-256 Linked badge */}
                {!isGenesis && (
                  <div className="absolute -top-3 left-10 flex items-center space-x-1 rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-[9px] font-mono text-slate-500 shadow-xs">
                    <Link className={`h-2.5 w-2.5 ${isTampered ? 'text-red-600' : 'text-red-500'}`} />
                    <span>SHA-256 Linked to #{block.blockNumber - 1}</span>
                  </div>
                )}

                {/* Block Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl font-mono text-xs font-black border-2 shadow-xs ${
                      isTampered
                        ? 'bg-red-200 text-red-800 border-red-300'
                        : 'bg-gradient-to-br from-red-50 to-rose-50 text-red-600 border-red-200'
                    }`}>
                      {block.blockNumber}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <h3 className="font-display font-bold text-slate-900 text-sm">
                          {isGenesis ? 'GENESIS BLOCK / Merkle anchor' : `Memory commit / ${block.agentName}`}
                        </h3>
                        {isTampered ? (
                          <span className={`rounded-lg px-2 py-0.5 text-[9px] font-mono font-bold border ${
                            isCompromiseOrigin
                              ? 'bg-red-200 text-red-800 border-red-300'
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}>
                            {isCompromiseOrigin ? 'TAMPER ORIGIN' : 'CHAIN INVALID'}
                          </span>
                        ) : (
                          <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-700 border border-emerald-200">
                            ✓ VALIDATED
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {block.timestamp}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!isGenesis && (
                      <button
                        onClick={() => handleStartTamper(block)}
                        className="flex items-center space-x-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1.5 text-xs font-mono font-bold transition-all hover:shadow-sm"
                      >
                        <Edit3 className="h-3 w-3" />
                        <span>Simulate Tamper</span>
                      </button>
                    )}

                    <button
                      onClick={() => { soundClick(); setSelectedBlockDetail(selectedBlockDetail?.blockNumber === block.blockNumber ? null : block); }}
                      className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 px-2.5 py-1.5 text-xs font-mono font-medium transition-all"
                    >
                      {selectedBlockDetail?.blockNumber === block.blockNumber ? 'Hide' : 'Raw Details'}
                    </button>
                  </div>
                </div>

                {/* Tamper Edit Box */}
                {tamperingBlockNumber === block.blockNumber && (
                  <div className="mb-4 rounded-xl border border-red-300 bg-red-50/90 p-3.5 space-y-3 animate-slide-up">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-red-800 flex items-center space-x-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>Modify Memory Content (Simulate Rogue Actor)</span>
                      </span>
                      <button
                        onClick={() => setTamperingBlockNumber(null)}
                        className="text-[11px] text-slate-500 hover:text-slate-800 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                    <textarea
                      value={tamperInputText}
                      onChange={(e) => setTamperInputText(e.target.value)}
                      rows={2}
                      className="w-full rounded-xl border border-red-300 bg-white p-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setTamperingBlockNumber(null)}
                        className="rounded-xl px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleApplyTamper(block.blockNumber)}
                        className="rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 text-xs font-mono font-bold shadow-sm transition-all active:scale-95"
                      >
                        Inject mutated memory
                      </button>
                    </div>
                  </div>
                )}

                {/* Memory Payload Content */}
                <div className={`rounded-xl p-3.5 font-mono text-xs leading-relaxed ${
                  isTampered
                    ? 'bg-red-100/70 border border-red-300 text-red-900'
                    : 'bg-slate-50 border border-slate-200 text-slate-800'
                }`}>
                  {block.content}
                </div>

                {/* Hash Row */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-[11px] font-mono">
                  {[
                    { label: 'Block SHA-256', value: block.hash, copyable: true },
                    { label: 'Parent Link', value: block.prevHash, copyable: false },
                    { label: 'Merkle Root', value: block.merkleRoot, copyable: false },
                  ].map(({ label, value, copyable }) => (
                    <div key={label} className="flex items-center justify-between bg-slate-50/80 border border-slate-200 p-2 rounded-lg">
                      <span className="text-slate-500">{label}:</span>
                      {copyable ? (
                        <button
                          onClick={() => copyToClipboard(value)}
                          className="flex items-center space-x-1 text-red-700 font-bold hover:underline"
                          title="Click to copy"
                        >
                          <span>{truncateHash(value, 6, 6)}</span>
                          {copiedHash === value
                            ? <Check className="h-3 w-3 text-emerald-600" />
                            : <Copy className="h-3 w-3 opacity-60" />}
                        </button>
                      ) : (
                        <span className="text-slate-700 font-mono">{truncateHash(value, 6, 6)}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Raw Details Drawer */}
                {selectedBlockDetail?.blockNumber === block.blockNumber && (
                  <div className="mt-3 p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-[10.5px] font-mono space-y-1.5 animate-slide-up">
                    {[
                      { label: 'Full Block Hash', value: block.hash },
                      { label: 'Full Parent Hash', value: block.prevHash },
                      { label: 'Merkle DAG Root', value: block.merkleRoot },
                      { label: 'Ed25519 Signature', value: block.signature },
                      { label: 'Agent Signer ID', value: block.agentId },
                      { label: 'Associated Memory ID', value: block.memoryId },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex gap-2">
                        <span className="text-slate-400 shrink-0">{label}:</span>
                        <span className="text-red-600 font-mono break-all">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
