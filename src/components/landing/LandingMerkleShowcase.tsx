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
  ArrowRight,
} from 'lucide-react';

export const LandingMerkleShowcase: React.FC = () => {
  return (
    <section id="merkle" className="py-20 lg:py-28 bg-[#06080F] border-b border-slate-800/80 relative overflow-hidden">
      {/* Background neon ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 text-xs font-mono font-bold text-red-400 backdrop-blur-sm shadow-[0_0_12px_rgba(239,68,68,0.15)]">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse"></span>
            <span>CRYPTOGRAPHIC PERSISTENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white">
            Merkle DAG Immutable Sealing &amp; Self-Healing
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
            Even if an attacker gains root access to the underlying vector database, any modified memory byte immediately breaks the cryptographic Merkle chain.
          </p>
        </div>

        {/* Visual Merkle Chaining Diagram */}
        <div className="glass-card p-8 rounded-2xl border border-red-500/30 bg-slate-950/80 shadow-[0_0_35px_rgba(239,68,68,0.08)] max-w-5xl mx-auto mb-16 relative">
          <div className="text-center mb-8">
            <span className="font-mono text-xs font-bold text-red-400 uppercase tracking-widest bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.15)]">
              CRYPTOGRAPHIC BLOCK ANCHOR PIPELINE (SHA-256 + Ed25519)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            
            {/* Block 0 */}
            <div className="rounded-xl border border-red-500/20 bg-slate-900/90 p-4 font-mono text-xs space-y-2.5 transition-all hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-400">BLOCK #0</span>
                <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded font-bold">GENESIS</span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">Core system identity &amp; baseline security policy vector.</p>
              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                <span>Hash: <code className="text-red-400 font-bold">a4f9...81c2</code></span>
              </div>
            </div>

            {/* Block 1 */}
            <div className="rounded-xl border border-emerald-500/20 bg-slate-900/90 p-4 font-mono text-xs space-y-2.5 transition-all hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">BLOCK #1</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  <span>SEALED</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">Episodic memory: Authorized customer API credentials.</p>
              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                <span>Parent: <code className="text-red-400">a4f9...81c2</code></span>
              </div>
            </div>

            {/* Block 2 */}
            <div className="rounded-xl border border-emerald-500/20 bg-slate-900/90 p-4 font-mono text-xs space-y-2.5 transition-all hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">BLOCK #2</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  <span>SEALED</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">Semantic rule: Financial audit threshold set to $10,000.</p>
              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                <span>Parent: <code className="text-rose-400">c81d...f904</code></span>
              </div>
            </div>

            {/* Block 3 */}
            <div className="rounded-xl border-2 border-red-500 bg-red-950/40 p-4 font-mono text-xs space-y-2.5 shadow-[0_0_25px_rgba(239,68,68,0.25)] relative ring-2 ring-red-500/30">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-400">BLOCK #3 (LATEST)</span>
                <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse">MERKLE ROOT</span>
              </div>
              <p className="text-[11px] text-slate-200 font-sans leading-relaxed">Working state: Customer support transcript analysis.</p>
              <div className="text-[10px] text-slate-400 pt-2 border-t border-red-500/30">
                <span>Root: <code className="text-red-400 font-bold">7e2b...9a18</code></span>
              </div>
            </div>

          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-card p-6 space-y-3.5 hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(239,68,68,0.12)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="font-display text-base font-bold text-white">
              SHA-256 Chained Hash Immutability
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Every memory block incorporates the cryptographic hash of its predecessor. Any unauthorized database row edit cascades into immediate validation failure.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3.5 hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(239,68,68,0.12)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <FileKey className="h-6 w-6" />
            </div>
            <h3 className="font-display text-base font-bold text-white">
              Ed25519 Cryptographic Signatures
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Every committed memory block is digitally signed with an asymmetric Ed25519 keypair, guaranteeing origin authenticity and non-repudiation for audit trails.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3.5 hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(239,68,68,0.12)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <RefreshCw className="h-6 w-6" />
            </div>
            <h3 className="font-display text-base font-bold text-white">
              Autonomous Self-Healing Engine
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              When tampering is detected, Sentinel isolates the corrupted block, reverts the vector partition to the last verified Merkle anchor, and re-seals the chain automatically.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
