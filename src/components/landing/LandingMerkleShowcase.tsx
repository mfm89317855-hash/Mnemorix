import React from 'react';
import {
  Boxes,
  Lock,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  GitCommit,
  CheckCircle2,
  FileKey,
  Database,
} from 'lucide-react';

export const LandingMerkleShowcase: React.FC = () => {
  return (
    <section id="merkle" className="py-20 lg:py-28 bg-slate-50/50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-mono font-bold text-red-700">
            <span>CRYPTOGRAPHIC PERSISTENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-slate-950">
            Merkle DAG Immutable Sealing & Self-Healing
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
            Even if an attacker gains root access to the underlying vector database, any modified memory byte immediately breaks the cryptographic Merkle chain.
          </p>
        </div>

        {/* Visual Merkle Chaining Diagram */}
        <div className="white-red-card p-8 rounded-2xl border border-red-200 bg-white shadow-md max-w-5xl mx-auto mb-12">
          <div className="text-center mb-6">
            <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-widest">
              CRYPTOGRAPHIC BLOCK ANCHOR PIPELINE (SHA-256 + Ed25519)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            
            {/* Block 0 */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 font-mono text-xs space-y-2 card-lift">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-700">BLOCK #0</span>
                <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-bold">GENESIS</span>
              </div>
              <p className="text-[11px] text-slate-700 font-sans">Core system identity & baseline security policy vector.</p>
              <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-200">
                <span>Hash: <code className="text-slate-800 font-bold">a4f9...81c2</code></span>
              </div>
            </div>

            {/* Block 1 */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 font-mono text-xs space-y-2 card-lift">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">BLOCK #1</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">SEALED</span>
              </div>
              <p className="text-[11px] text-slate-700 font-sans">Episodic memory: Authorized customer API credentials.</p>
              <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-200">
                <span>Parent: <code className="text-red-700">a4f9...81c2</code></span>
              </div>
            </div>

            {/* Block 2 */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 font-mono text-xs space-y-2 card-lift">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">BLOCK #2</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">SEALED</span>
              </div>
              <p className="text-[11px] text-slate-700 font-sans">Semantic rule: Financial audit threshold set to $10,000.</p>
              <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-200">
                <span>Parent: <code className="text-red-700">c81d...f904</code></span>
              </div>
            </div>

            {/* Block 3 */}
            <div className="rounded-xl border-2 border-red-500 bg-red-50/60 p-4 font-mono text-xs space-y-2 card-lift shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-700">BLOCK #3 (LATEST)</span>
                <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold">MERKLE ROOT</span>
              </div>
              <p className="text-[11px] text-slate-700 font-sans">Working state: Customer support transcript analysis.</p>
              <div className="text-[10px] text-slate-500 pt-2 border-t border-red-200">
                <span>Root: <code className="text-red-700 font-bold">7e2b...9a18</code></span>
              </div>
            </div>

          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-600 shadow-2xs">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-bold text-slate-900">
              SHA-256 Chained Hash Immutability
            </h3>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              Every memory block incorporates the cryptographic hash of its predecessor. Any unauthorized database row edit cascades into immediate validation failure.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-600 shadow-2xs">
              <FileKey className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-bold text-slate-900">
              Ed25519 Cryptographic Signatures
            </h3>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              Every committed memory block is digitally signed with an asymmetric Ed25519 keypair, guaranteeing origin authenticity and non-repudiation for audit trails.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-600 shadow-2xs">
              <RefreshCw className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-bold text-slate-900">
              Autonomous Self-Healing Engine
            </h3>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              When tampering is detected, Sentinel isolates the corrupted block, reverts the vector partition to the last verified Merkle anchor, and re-seals the chain automatically.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
