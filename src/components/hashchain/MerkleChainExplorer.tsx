import React, { useState } from 'react';
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
} from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';
import { truncateHash } from '../../lib/crypto';
import { MerkleBlock } from '../../lib/types';

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
    resetToBaselineLedger,
  } = useSentinel();

  const [tamperingBlockNumber, setTamperingBlockNumber] = useState<number | null>(null);
  const [tamperInputText, setTamperInputText] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [selectedBlockDetail, setSelectedBlockDetail] = useState<MerkleBlock | null>(null);

  const handleStartTamper = (block: MerkleBlock) => {
    setTamperingBlockNumber(block.blockNumber);
    setTamperInputText(
      block.content.replace(/Block/g, 'ALLOW ALL').replace(/capped at 2.4%/g, 'UNRESTRICTED 100% DRAWDOWN') +
        ' [MALICIOUS_ROGUE_INJECTION]'
    );
  };

  const handleApplyTamper = async (blockNumber: number) => {
    await tamperBlock(blockNumber, tamperInputText);
    setTamperingBlockNumber(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="white-red-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 border border-red-200 text-red-600">
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

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => auditChainIntegrity()}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono font-bold text-slate-700 hover:bg-slate-50 hover:border-red-300 transition-all shadow-2xs"
          >
            <RefreshCw className="h-3.5 w-3.5 text-red-600" />
            <span>Audit Chain</span>
          </button>

          <button
            onClick={() => resetToEmptyLedger()}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white hover:bg-red-50 text-red-700 px-3.5 py-2 text-xs font-mono font-bold transition-all shadow-2xs"
            title="Wipe sample data and start a fresh empty working model"
          >
            <span>Wipe Sample Data</span>
          </button>

          {isChainCompromised ? (
            <button
              onClick={selfHealChain}
              className="flex items-center space-x-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-mono font-bold text-white shadow-md shadow-red-500/20 transition-all active:scale-95"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Restore Canonical Chain ⚡</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-xs font-mono text-emerald-700 font-bold">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Chain Integrity: 100% Verified</span>
            </div>
          )}
        </div>
      </div>

      {/* Explanatory Banner */}
      <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
        <p className="text-slate-700 leading-relaxed font-sans">
          <strong className="text-red-700 font-mono">Tamper Simulation Testbed:</strong> Click{' '}
          <span className="text-red-600 font-mono font-bold">"Simulate Tamper"</span> on any block below to simulate unauthorized memory modification. Watch the SHA-256 Merkle root immediately break in real-time, then trigger the automated self-healing protocol!
        </p>
      </div>

      {/* Block Sequence Visualizer */}
      <div className="space-y-4">
        {blocks.map((block, index) => {
          const isGenesis = block.blockNumber === 0;
          const isTampered = block.isTampered || (isChainCompromised && compromisedBlockIndex !== null && index >= compromisedBlockIndex);
          const isCompromiseOrigin = isChainCompromised && compromisedBlockIndex === index;

          return (
            <div
              key={block.blockNumber}
              className={`relative rounded-xl border p-5 transition-all ${
                isTampered
                  ? 'border-red-400 bg-red-50/60 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-red-300 hover:shadow-xs'
              }`}
            >
              {/* Chain Link Indicator */}
              {!isGenesis && (
                <div className="absolute -top-3 left-8 flex items-center space-x-1 rounded bg-slate-50 border border-slate-200 px-2 py-0.5 text-[9px] font-mono text-slate-600">
                  <Lock className={`h-2.5 w-2.5 ${isTampered ? 'text-red-600' : 'text-red-500'}`} />
                  <span>SHA-256 Linked</span>
                </div>
              )}

              {/* Block Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center space-x-3">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                      isTampered
                        ? 'bg-red-200 text-red-800 border border-red-300'
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}
                  >
                    #{block.blockNumber}
                  </span>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-display font-bold text-slate-900 text-sm">
                        {isGenesis ? 'GENESIS BLOCK (Merkle Anchor)' : `Memory Commit - ${block.agentName}`}
                      </h3>
                      {isTampered ? (
                        <span className="rounded bg-red-200 px-2 py-0.5 text-[9px] font-mono font-bold text-red-800">
                          {isCompromiseOrigin ? 'TAMPER ORIGIN' : 'INVALIDATED LINK'}
                        </span>
                      ) : (
                        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-700 border border-emerald-200">
                          VALIDATED
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      Timestamp: {block.timestamp}
                    </span>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center space-x-2">
                  {!isGenesis && (
                    <button
                      onClick={() => handleStartTamper(block)}
                      className="flex items-center space-x-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1 text-xs font-mono font-bold transition-all"
                    >
                      <Edit3 className="h-3 w-3" />
                      <span>Simulate Tamper</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedBlockDetail(selectedBlockDetail?.blockNumber === block.blockNumber ? null : block)}
                    className="rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 px-2.5 py-1 text-xs font-mono font-medium transition-all"
                  >
                    {selectedBlockDetail?.blockNumber === block.blockNumber ? 'Hide' : 'Raw Details'}
                  </button>
                </div>
              </div>

              {/* Inline Tamper Edit Box */}
              {tamperingBlockNumber === block.blockNumber && (
                <div className="mb-4 rounded-xl border border-red-300 bg-red-50/90 p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-red-800 flex items-center space-x-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Modify Memory Content (Simulate Rogue Actor)</span>
                    </span>
                    <button
                      onClick={() => setTamperingBlockNumber(null)}
                      className="text-[11px] text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>
                  <textarea
                    value={tamperInputText}
                    onChange={(e) => setTamperInputText(e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-red-300 bg-white p-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-500"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setTamperingBlockNumber(null)}
                      className="rounded-lg px-3 py-1 text-xs text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleApplyTamper(block.blockNumber)}
                      className="rounded-lg bg-red-600 hover:bg-red-700 text-white px-3.5 py-1 text-xs font-mono font-bold shadow-sm transition-all active:scale-95"
                    >
                      Inject Mutated Memory
                    </button>
                  </div>
                </div>
              )}

              {/* Memory Payload Content */}
              <div
                className={`rounded-lg p-3 font-mono text-xs leading-relaxed ${
                  isTampered
                    ? 'bg-red-100/80 border border-red-300 text-red-900'
                    : 'bg-slate-50 border border-slate-200 text-slate-800'
                }`}
              >
                {block.content}
              </div>

              {/* Block Hashes & Cryptographic Signatures */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2.5 border-t border-slate-100 text-[11px] font-mono">
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Block SHA-256:</span>
                  <button
                    onClick={() => copyToClipboard(block.hash)}
                    className="flex items-center space-x-1 text-red-700 font-bold hover:underline"
                    title="Click to copy full hash"
                  >
                    <span>{truncateHash(block.hash, 6, 6)}</span>
                    {copiedHash === block.hash ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 opacity-60" />}
                  </button>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Parent Link:</span>
                  <span className="text-slate-700 font-mono">
                    {truncateHash(block.prevHash, 6, 6)}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Merkle Root:</span>
                  <span className="text-red-800 font-mono font-bold">
                    {truncateHash(block.merkleRoot, 6, 6)}
                  </span>
                </div>
              </div>

              {/* Raw Details Drawer */}
              {selectedBlockDetail?.blockNumber === block.blockNumber && (
                <div className="mt-3 p-3 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-700 space-y-1 animate-in fade-in">
                  <div><strong>Full Block Hash:</strong> {block.hash}</div>
                  <div><strong>Full Parent Hash:</strong> {block.prevHash}</div>
                  <div><strong>Merkle DAG Root:</strong> {block.merkleRoot}</div>
                  <div><strong>Ed25519 Signature:</strong> {block.signature}</div>
                  <div><strong>Agent Signer ID:</strong> {block.agentId}</div>
                  <div><strong>Associated Memory ID:</strong> {block.memoryId}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
