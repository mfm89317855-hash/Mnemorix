import React from 'react';
import { ShieldCheck, ArrowUpRight, Lock, Heart } from 'lucide-react';
import { soundClick } from '../../lib/sound';

interface LandingFooterProps {
  onLaunchConsole: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onLaunchConsole }) => {
  return (
    <footer className="bg-[#04060A] border-t border-slate-800/80 text-slate-400 font-mono text-xs relative overflow-hidden">
      {/* Top Red Laser Line with intense glow */}
      <div className="h-[2px] w-full bg-gradient-to-r from-red-600 via-rose-500 to-red-600 shadow-[0_0_12px_rgba(239,68,68,0.8)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <span className="font-display text-lg font-black tracking-wider text-white">
                  MNEMORIX SENTINEL
                </span>
                <p className="text-[10px] text-slate-400">Zero-Trust AI Memory Firewall</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-sans max-w-md leading-relaxed">
              Pre-ingestion neural sanitization, vector drift anomaly detection, and cryptographic Merkle DAG self-healing for autonomous enterprise AI agent fleets.
            </p>

            <div className="flex items-center space-x-2 pt-2">
              <span className="inline-flex items-center space-x-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(52,211,153,0.15)]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SYSTEMS OPERATIONAL • 100% MERKLE INTEGRITY</span>
              </span>
            </div>
          </div>

          {/* Col 2: Product & Architecture */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold text-slate-200 uppercase tracking-wider">
              Architecture
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#features" className="hover:text-red-400 transition-colors">
                  3-Layer Neural Pipeline
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-red-400 transition-colors">
                  Interactive Attack Sandbox
                </a>
              </li>
              <li>
                <a href="#merkle" className="hover:text-red-400 transition-colors">
                  Merkle DAG Self-Healing
                </a>
              </li>
              <li>
                <a href="#compliance" className="hover:text-red-400 transition-colors">
                  NIST &amp; ISO 42001 Mapping
                </a>
              </li>
              <li>
                <button
                  onClick={() => { soundClick(); onLaunchConsole(); }}
                  className="text-red-400 hover:text-red-300 font-bold flex items-center space-x-1 transition-colors"
                >
                  <span>Launch Console</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Standards & Governance */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold text-slate-200 uppercase tracking-wider">
              Compliance &amp; Specs
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>FIPS 180-4 SHA-256 Hashing</li>
              <li>Ed25519 Asymmetric Signatures</li>
              <li>NIST AI RMF 1.0 Aligned</li>
              <li>ISO/IEC 42001:2023 AIMS</li>
              <li>SOC2 Type II Audit Export</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>{new Date().getFullYear()} MNEMORIX Sentinel. Zero-trust AI memory architecture.</p>
          <div className="flex items-center space-x-4">
            <span className="text-red-400 font-bold">SHA-256 Verified</span>
            <span>•</span>
            <span className="text-slate-300">Ed25519 Sealed</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
