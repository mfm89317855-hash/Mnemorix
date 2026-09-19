import React from 'react';
import { ShieldCheck, ArrowUpRight, Lock, Heart } from 'lucide-react';
import { soundClick } from '../../lib/sound';

interface LandingFooterProps {
  onLaunchConsole: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onLaunchConsole }) => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 font-mono text-xs relative">
      {/* Top Red Laser Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-red-600 via-rose-500 to-red-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white shadow-md shadow-red-500/25">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="font-display text-base font-black tracking-wider text-slate-950">
                  MNEMORIX SENTINEL
                </span>
                <p className="text-[10px] text-slate-500">Zero-Trust AI Memory Firewall</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-sans max-w-md leading-relaxed">
              Pre-ingestion neural sanitization, vector drift anomaly detection, and cryptographic Merkle DAG self-healing for autonomous enterprise AI agent fleets.
            </p>

            <div className="flex items-center space-x-2 pt-2">
              <span className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                <span className="beacon-live-emerald"></span>
                <span>SYSTEMS OPERATIONAL • 100% MERKLE INTEGRITY</span>
              </span>
            </div>
          </div>

          {/* Col 2: Product & Architecture */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider">
              Architecture
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#features" className="hover:text-red-600 transition-colors">
                  3-Layer Neural Pipeline
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-red-600 transition-colors">
                  Interactive Attack Sandbox
                </a>
              </li>
              <li>
                <a href="#merkle" className="hover:text-red-600 transition-colors">
                  Merkle DAG Self-Healing
                </a>
              </li>
              <li>
                <a href="#compliance" className="hover:text-red-600 transition-colors">
                  NIST & ISO 42001 Mapping
                </a>
              </li>
              <li>
                <button
                  onClick={() => { soundClick(); onLaunchConsole(); }}
                  className="text-red-600 hover:text-red-700 font-bold flex items-center space-x-1"
                >
                  <span>Launch Console</span>
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Standards & Governance */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider">
              Compliance & Specs
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>FIPS 180-4 SHA-256 Hashing</li>
              <li>Ed25519 Asymmetric Signatures</li>
              <li>NIST AI RMF 1.0 Aligned</li>
              <li>ISO/IEC 42001:2023 AIMS</li>
              <li>SOC2 Type II Audit Export</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} MNEMORIX Sentinel. All rights reserved. Sovereign Zero-Trust AI Memory Architecture.</p>
          <div className="flex items-center space-x-4">
            <span className="text-red-600 font-bold">SHA-256 Verified</span>
            <span>•</span>
            <span>Ed25519 Sealed</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
