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
    <section id="features" className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-mono font-bold text-red-700">
            <span>DEFENSE-IN-DEPTH PIPELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-slate-950">
            Multi-Layer Neural Memory Firewall
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
            Every proposed agent memory must pass through three rigorous defensive barriers before cryptographic commitment into long-term vector storage.
          </p>
        </div>

        {/* 3 Pipeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {/* Layer 1 */}
          <div className="white-red-card p-6 flex flex-col justify-between shadow-2xs card-lift border-t-4 border-t-red-600">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="rounded-md bg-red-100 px-2.5 py-1 text-xs font-mono font-bold text-red-800 border border-red-200">
                  LAYER 1
                </span>
                <span className="text-xs font-mono text-slate-500 font-bold">~1.2ms LATENCY</span>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-600 mb-4 shadow-2xs">
                <Zap className="h-6 w-6" />
              </div>

              <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
                Heuristic Pattern Interceptor
              </h3>
              <p className="text-xs text-slate-600 font-sans leading-relaxed mb-4">
                Ultra-fast regex and pattern matching targeting known prompt injection payloads, delimiter injection attacks, and base64 obfuscation.
              </p>

              <ul className="space-y-2 text-xs font-mono text-slate-600 border-t border-slate-100 pt-3">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-red-600 shrink-0" />
                  <span>Jailbreak instruction traps</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-red-600 shrink-0" />
                  <span>PII & token exfiltration regex</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-red-600 shrink-0" />
                  <span>Zero cold-start overhead</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex justify-between items-center">
              <span>Filter Rate:</span>
              <strong className="text-slate-900">76% of known attacks</strong>
            </div>
          </div>

          {/* Layer 2 */}
          <div className="white-red-card p-6 flex flex-col justify-between shadow-2xs card-lift border-t-4 border-t-red-500">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="rounded-md bg-red-100 px-2.5 py-1 text-xs font-mono font-bold text-red-800 border border-red-200">
                  LAYER 2
                </span>
                <span className="text-xs font-mono text-slate-500 font-bold">~3.8ms LATENCY</span>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-600 mb-4 shadow-2xs">
                <Layers className="h-6 w-6" />
              </div>

              <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
                Vector Cosine Drift Engine
              </h3>
              <p className="text-xs text-slate-600 font-sans leading-relaxed mb-4">
                Measures semantic distance against the agent historical memory centroid to catch gradual poisoning and covert concept drift attacks.
              </p>

              <ul className="space-y-2 text-xs font-mono text-slate-600 border-t border-slate-100 pt-3">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-red-600 shrink-0" />
                  <span>Cosine distance thresholding</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-red-600 shrink-0" />
                  <span>Partition cluster protection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-red-600 shrink-0" />
                  <span>Dynamic drift delta (Δ &gt; 0.05)</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex justify-between items-center">
              <span>Filter Rate:</span>
              <strong className="text-slate-900">18% semantic drift</strong>
            </div>
          </div>

          {/* Layer 3 */}
          <div className="white-red-card p-6 flex flex-col justify-between shadow-2xs card-lift border-t-4 border-t-rose-600">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="rounded-md bg-red-100 px-2.5 py-1 text-xs font-mono font-bold text-red-800 border border-red-200">
                  LAYER 3
                </span>
                <span className="text-xs font-mono text-slate-500 font-bold">~8.5ms LATENCY</span>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-600 mb-4 shadow-2xs">
                <Sparkles className="h-6 w-6" />
              </div>

              <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
                Gemini Neural Semantic Analysis
              </h3>
              <p className="text-xs text-slate-600 font-sans leading-relaxed mb-4">
                Deep neural classification of subtle context manipulation, payload sanitization, and automated redaction of adversarial directives.
              </p>

              <ul className="space-y-2 text-xs font-mono text-slate-600 border-t border-slate-100 pt-3">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-red-600 shrink-0" />
                  <span>Zero-shot reasoning on payload</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-red-600 shrink-0" />
                  <span>Automated memory sanitization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-red-600 shrink-0" />
                  <span>Comprehensive mitigation playbook</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex justify-between items-center">
              <span>Filter Rate:</span>
              <strong className="text-slate-900">100% zero-day protection</strong>
            </div>
          </div>

        </div>

        {/* Pipeline Summary Bar */}
        <div className="mt-10 rounded-2xl border border-red-200 bg-red-50/50 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white font-bold shrink-0">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-slate-900">
                End-to-End Cryptographic Guarantee
              </p>
              <p className="text-xs font-mono text-slate-600">
                Memories cleared by the 3-layer pipeline are anchored into a Merkle DAG signed with Ed25519 and SHA-256.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-red-700 bg-white px-3 py-1.5 rounded-lg border border-red-200 shadow-2xs shrink-0">
            <span>Overall Latency Budget: &lt;15ms</span>
          </div>
        </div>

      </div>
    </section>
  );
};
