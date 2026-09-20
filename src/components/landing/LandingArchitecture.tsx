import React from 'react';
import {
  ShieldAlert,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
} from 'lucide-react';

export const LandingArchitecture: React.FC = () => {
  return (
    <section id="features" className="py-20 lg:py-28 bg-[#080B14] border-b border-slate-800/80 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-rose-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 text-xs font-mono font-bold text-red-400 backdrop-blur-sm shadow-[0_0_12px_rgba(239,68,68,0.15)]">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse"></span>
            <span>DEFENSE-IN-DEPTH PIPELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white">
            Multi-Layer Neural Memory Firewall
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
            Every proposed agent memory must pass through three rigorous defensive barriers before cryptographic commitment into long-term vector storage.
          </p>
        </div>

        {/* 3 Pipeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {/* Layer 1 */}
          <div className="glass-card p-6 flex flex-col justify-between border-t-2 border-t-red-500 relative group overflow-hidden hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-red-500/10 transition-all" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="rounded-md bg-red-500/15 px-2.5 py-1 text-xs font-mono font-bold text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                  LAYER 1
                </span>
                <span className="text-xs font-mono text-slate-400 font-bold tracking-wider">~1.2ms LATENCY</span>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 mb-4 shadow-[0_0_15px_rgba(239,68,68,0.2)] group-hover:scale-105 transition-transform">
                <Zap className="h-6 w-6" />
              </div>

              <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-red-300 transition-colors">
                Heuristic Pattern Interceptor
              </h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
                Ultra-fast regex and pattern matching targeting known prompt injection payloads, delimiter injection attacks, and base64 obfuscation.
              </p>

              <ul className="space-y-2.5 text-xs font-mono text-slate-300 border-t border-slate-800/80 pt-4">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-red-400 shrink-0" />
                  <span>Jailbreak instruction traps</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-red-400 shrink-0" />
                  <span>PII & token exfiltration regex</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-red-400 shrink-0" />
                  <span>Zero cold-start overhead</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex justify-between items-center">
              <span>Filter Rate:</span>
              <strong className="text-red-400 font-bold">76% of known attacks</strong>
            </div>
          </div>

          {/* Layer 2 */}
          <div className="glass-card p-6 flex flex-col justify-between border-t-2 border-t-rose-500 relative group overflow-hidden hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-rose-500/10 transition-all" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="rounded-md bg-rose-500/15 px-2.5 py-1 text-xs font-mono font-bold text-rose-400 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                  LAYER 2
                </span>
                <span className="text-xs font-mono text-slate-400 font-bold tracking-wider">~3.8ms LATENCY</span>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-4 shadow-[0_0_15px_rgba(244,63,94,0.2)] group-hover:scale-105 transition-transform">
                <Layers className="h-6 w-6" />
              </div>

              <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-rose-300 transition-colors">
                Vector Cosine Drift Engine
              </h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
                Measures semantic distance against the agent historical memory centroid to catch gradual poisoning and covert concept drift attacks.
              </p>

              <ul className="space-y-2.5 text-xs font-mono text-slate-300 border-t border-slate-800/80 pt-4">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                  <span>Cosine distance thresholding</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                  <span>Partition cluster protection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                  <span>Dynamic drift delta (Δ &gt; 0.05)</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex justify-between items-center">
              <span>Filter Rate:</span>
              <strong className="text-rose-400 font-bold">18% semantic drift</strong>
            </div>
          </div>

          {/* Layer 3 */}
          <div className="glass-card p-6 flex flex-col justify-between border-t-2 border-t-red-600 relative group overflow-hidden hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.2)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl pointer-events-none group-hover:bg-red-600/10 transition-all" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="rounded-md bg-red-600/20 px-2.5 py-1 text-xs font-mono font-bold text-red-300 border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.25)]">
                  LAYER 3
                </span>
                <span className="text-xs font-mono text-slate-400 font-bold tracking-wider">~8.5ms LATENCY</span>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 mb-4 shadow-[0_0_15px_rgba(239,68,68,0.25)] group-hover:scale-105 transition-transform">
                <Sparkles className="h-6 w-6" />
              </div>

              <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-red-300 transition-colors">
                Gemini Neural Semantic Analysis
              </h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
                Deep neural classification of subtle context manipulation, payload sanitization, and automated redaction of adversarial directives.
              </p>

              <ul className="space-y-2.5 text-xs font-mono text-slate-300 border-t border-slate-800/80 pt-4">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-red-400 shrink-0" />
                  <span>Zero-shot reasoning on payload</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-red-400 shrink-0" />
                  <span>Automated memory sanitization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-red-400 shrink-0" />
                  <span>Comprehensive mitigation playbook</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex justify-between items-center">
              <span>Filter Rate:</span>
              <strong className="text-red-400 font-bold">100% zero-day protection</strong>
            </div>
          </div>

        </div>

        {/* Pipeline Summary Bar */}
        <div className="mt-10 rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-950/40 via-slate-900/60 to-red-950/40 backdrop-blur-md p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_0_25px_rgba(239,68,68,0.1)]">
          <div className="flex items-center space-x-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white font-bold shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-white">
                End-to-End Cryptographic Guarantee
              </p>
              <p className="text-xs font-mono text-slate-400">
                Memories cleared by the 3-layer pipeline are anchored into a Merkle DAG signed with Ed25519 and SHA-256.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-red-400 bg-red-500/10 px-3.5 py-1.5 rounded-xl border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.15)] shrink-0">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Overall Latency Budget: &lt;15ms</span>
          </div>
        </div>

      </div>
    </section>
  );
};
