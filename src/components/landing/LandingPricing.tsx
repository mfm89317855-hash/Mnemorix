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
    <section id="pricing" className="py-20 lg:py-28 bg-slate-50/50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-mono font-bold text-red-700">
            <span>PREDICTABLE DEPLOYMENT TIERS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-slate-950">
            Enterprise Security at Every Scale
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
            Deploy in minutes via pip or npm, or run sovereign, air-gapped instances within your corporate VPC.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          
          {/* Tier 1: Community */}
          <div className="white-red-card p-7 rounded-2xl flex flex-col justify-between shadow-2xs bg-white">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-slate-600">COMMUNITY</span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700">
                  OPEN SOURCE
                </span>
              </div>

              <div className="mb-4">
                <span className="text-3xl sm:text-4xl font-display font-black text-slate-900">$0</span>
                <span className="text-xs font-mono text-slate-500"> / forever</span>
              </div>

              <p className="text-xs text-slate-600 font-sans leading-relaxed mb-6">
                Ideal for local agent prototyping, indie AI engineers, and open-source testing.
              </p>

              <ul className="space-y-2.5 text-xs font-mono text-slate-600 border-t border-slate-100 pt-5">
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-600 shrink-0" />
                  <span>L1 Heuristic Pattern Interceptor</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-600 shrink-0" />
                  <span>Local SQLite & In-Memory Merkle DAG</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-600 shrink-0" />
                  <span>Up to 3 Autonomous Agent Fleets</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-600 shrink-0" />
                  <span>Standard community discord support</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => { soundClick(); onLaunchConsole(); }}
              className="mt-8 w-full rounded-xl border border-slate-300 bg-white hover:border-red-400 hover:bg-red-50/40 text-slate-800 font-mono text-xs font-bold py-3 transition-all shadow-2xs active:scale-98"
            >
              Get Started Free
            </button>
          </div>

          {/* Tier 2: Team Pro (Featured) */}
          <div className="white-red-card p-7 rounded-2xl flex flex-col justify-between shadow-xl bg-white border-2 border-red-600 relative ring-4 ring-red-500/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-3.5 py-0.5 text-[10px] font-mono font-bold text-white shadow-sm tracking-wider">
              MOST POPULAR
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-red-700">TEAM PRO</span>
                <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-mono font-bold text-red-800">
                  PRODUCTION
                </span>
              </div>

              <div className="mb-4">
                <span className="text-3xl sm:text-4xl font-display font-black text-slate-900">$249</span>
                <span className="text-xs font-mono text-slate-500"> / month</span>
              </div>

              <p className="text-xs text-slate-600 font-sans leading-relaxed mb-6">
                Full 3-layer neural protection for scaling engineering teams and production agents.
              </p>

              <ul className="space-y-2.5 text-xs font-mono text-slate-700 border-t border-slate-100 pt-5 font-medium">
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-600 shrink-0" />
                  <span>All 3 Defensive Layers (L1 + L2 + L3)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-600 shrink-0" />
                  <span>Gemini 2.5 Neural Semantic Analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-600 shrink-0" />
                  <span>Google OAuth & Firebase Firestore Sync</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-600 shrink-0" />
                  <span>Autonomous Merkle DAG Self-Healing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-600 shrink-0" />
                  <span>SOC2 & NIST Audit Logs + CSV Export</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => { soundClick(); onLaunchConsole(); }}
              className="mt-8 w-full rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold py-3 transition-all shadow-md shadow-red-500/25 active:scale-98 flex items-center justify-center space-x-1.5"
            >
              <span>Deploy Team Pro</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Tier 3: Sovereign Enterprise */}
          <div className="white-red-card p-7 rounded-2xl flex flex-col justify-between shadow-2xs bg-white">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-slate-600">ENTERPRISE</span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700">
                  SOVEREIGN
                </span>
              </div>

              <div className="mb-4">
                <span className="text-3xl sm:text-4xl font-display font-black text-slate-900">Custom</span>
                <span className="text-xs font-mono text-slate-500"> / annual</span>
              </div>

              <p className="text-xs text-slate-600 font-sans leading-relaxed mb-6">
                Air-gapped VPC deployments with custom classification models and strict SLAs.
              </p>

              <ul className="space-y-2.5 text-xs font-mono text-slate-600 border-t border-slate-100 pt-5">
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-600 shrink-0" />
                  <span>Air-Gapped / Private Cloud VPC</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-600 shrink-0" />
                  <span>Custom fine-tuned Neural Classifiers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-600 shrink-0" />
                  <span>Unlimited Agents, Fleets & Partitions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-600 shrink-0" />
                  <span>Dedicated SecOps Red Team SLA</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-red-600 shrink-0" />
                  <span>Custom HSM Key Signing Integration</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => { soundClick(); onLaunchConsole(); }}
              className="mt-8 w-full rounded-xl border border-slate-300 bg-white hover:border-red-400 hover:bg-red-50/40 text-slate-800 font-mono text-xs font-bold py-3 transition-all shadow-2xs active:scale-98"
            >
              Contact Defense SecOps
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
