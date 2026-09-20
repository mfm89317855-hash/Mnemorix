import React from 'react';
import {
  Check,
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { soundClick } from '../../lib/sound';

interface LandingPricingProps {
  onLaunchConsole: () => void;
}

export const LandingPricing: React.FC<LandingPricingProps> = ({ onLaunchConsole }) => {
  return (
    <section id="pricing" className="py-20 lg:py-28 bg-[#06080F] border-b border-slate-800/80 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 text-xs font-mono font-bold text-red-400 backdrop-blur-sm shadow-[0_0_12px_rgba(239,68,68,0.15)]">
            <Zap className="h-3.5 w-3.5" />
            <span>PREDICTABLE DEPLOYMENT TIERS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white">
            Enterprise Security at Every Scale
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
            Deploy in minutes via pip or npm, or run sovereign, air-gapped instances within your corporate VPC.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          
          {/* Tier 1: Community */}
          <div className="glass-card p-7 rounded-2xl flex flex-col justify-between hover:border-slate-700">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-slate-400">COMMUNITY</span>
                <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-300 border border-slate-700">
                  OPEN SOURCE
                </span>
              </div>

              <div className="mb-4">
                <span className="text-3xl sm:text-4xl font-display font-black text-white">$0</span>
                <span className="text-xs font-mono text-slate-400"> / forever</span>
              </div>

              <p className="text-xs text-slate-400 font-sans leading-relaxed mb-6">
                Ideal for local agent prototyping, indie AI engineers, and open-source testing.
              </p>

              <ul className="space-y-3 text-xs font-mono text-slate-300 border-t border-slate-800/80 pt-5">
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-400 shrink-0" />
                  <span>L1 Heuristic Pattern Interceptor</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-400 shrink-0" />
                  <span>Local SQLite &amp; In-Memory Merkle DAG</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-400 shrink-0" />
                  <span>Up to 3 Autonomous Agent Fleets</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-400 shrink-0" />
                  <span>Standard community discord support</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => { soundClick(); onLaunchConsole(); }}
              className="mt-8 w-full rounded-xl border border-slate-700 bg-slate-900/80 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300 text-slate-200 font-mono text-xs font-bold py-3 transition-all shadow-sm active:scale-98"
            >
              Get Started Free
            </button>
          </div>

          {/* Tier 2: Team Pro (Featured) */}
          <div className="glass-card p-7 rounded-2xl flex flex-col justify-between border-2 border-red-500/80 relative shadow-[0_0_40px_rgba(239,68,68,0.25)] bg-slate-950/90 ring-2 ring-red-500/20">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 px-4 py-0.5 text-[10px] font-mono font-bold text-white shadow-[0_0_15px_rgba(239,68,68,0.6)] tracking-wider">
              MOST POPULAR
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-red-400">TEAM PRO</span>
                <span className="rounded-md bg-red-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-red-300 border border-red-500/40">
                  PRODUCTION
                </span>
              </div>

              <div className="mb-4">
                <span className="text-3xl sm:text-4xl font-display font-black text-white">$249</span>
                <span className="text-xs font-mono text-slate-400"> / month</span>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed mb-6">
                Full 3-layer neural protection for scaling engineering teams and production agents.
              </p>

              <ul className="space-y-3 text-xs font-mono text-slate-200 border-t border-slate-800/80 pt-5 font-medium">
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-400 shrink-0" />
                  <span>All 3 Defensive Layers (L1 + L2 + L3)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-400 shrink-0" />
                  <span>Gemini 2.5 Neural Semantic Analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-400 shrink-0" />
                  <span>Google OAuth &amp; Firebase Firestore Sync</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-400 shrink-0" />
                  <span>Autonomous Merkle DAG Self-Healing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-400 shrink-0" />
                  <span>SOC2 &amp; NIST Audit Logs + CSV Export</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => { soundClick(); onLaunchConsole(); }}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-bold py-3.5 transition-all shadow-[0_0_25px_rgba(239,68,68,0.4)] active:scale-98 flex items-center justify-center space-x-2 group"
            >
              <span>Deploy Team Pro</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Tier 3: Sovereign Enterprise */}
          <div className="glass-card p-7 rounded-2xl flex flex-col justify-between hover:border-slate-700">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-slate-400">ENTERPRISE</span>
                <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-300 border border-slate-700">
                  SOVEREIGN
                </span>
              </div>

              <div className="mb-4">
                <span className="text-3xl sm:text-4xl font-display font-black text-white">Custom</span>
                <span className="text-xs font-mono text-slate-400"> / annual</span>
              </div>

              <p className="text-xs text-slate-400 font-sans leading-relaxed mb-6">
                Air-gapped VPC deployments with custom classification models and strict SLAs.
              </p>

              <ul className="space-y-3 text-xs font-mono text-slate-300 border-t border-slate-800/80 pt-5">
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-400 shrink-0" />
                  <span>Air-Gapped / Private Cloud VPC</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-400 shrink-0" />
                  <span>Custom fine-tuned Neural Classifiers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-400 shrink-0" />
                  <span>Unlimited Agents, Fleets &amp; Partitions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-400 shrink-0" />
                  <span>Dedicated SecOps Red Team SLA</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-400 shrink-0" />
                  <span>Custom HSM Key Signing Integration</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => { soundClick(); onLaunchConsole(); }}
              className="mt-8 w-full rounded-xl border border-slate-700 bg-slate-900/80 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300 text-slate-200 font-mono text-xs font-bold py-3 transition-all shadow-sm active:scale-98"
            >
              Contact Defense SecOps
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
