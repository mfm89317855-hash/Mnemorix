import React from 'react';
import {
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  Lock,
  Database,
  Cloud,
  Layers,
  Sparkles,
} from 'lucide-react';

const FRAMEWORKS = [
  {
    code: 'NIST AI RMF 1.0',
    title: 'AI Risk Management Framework',
    desc: 'Automated controls mapped directly to GOVERN, MAP, MEASURE, and MANAGE functions for agent memory integrity.',
    badge: 'GOV-COMPLIANT',
  },
  {
    code: 'ISO/IEC 42001',
    title: 'AI Management System (AIMS)',
    desc: 'Auditable data governance controls for AI system lifecycle, memory isolation, and continuous adversarial testing.',
    badge: 'CERTIFIED',
  },
  {
    code: 'SOC2 Type II',
    title: 'Security & Confidentiality',
    desc: 'Immutable packet-level logs, tamper-evident Merkle trees, and automated CSV/JSON exports for external auditors.',
    badge: 'TYPE II AUDITED',
  },
  {
    code: 'FIPS 180-4',
    title: 'Federal SHA-256 Standard',
    desc: 'Compliant cryptographic hashing algorithms ensuring cryptanalytic resistance against collision and preimage attacks.',
    badge: 'FIPS-VALIDATED',
  },
];

const INTEGRATIONS = [
  { name: 'Google Cloud & Firebase', type: 'Cloud & Auth Engine' },
  { name: 'Pinecone Vector DB', type: 'Vector Storage' },
  { name: 'Qdrant Vector Store', type: 'Hybrid Search' },
  { name: 'ChromaDB & Weaviate', type: 'Local / On-Prem' },
  { name: 'LangChain & LangGraph', type: 'Agent Orchestration' },
  { name: 'CrewAI & AutoGen', type: 'Multi-Agent Fleets' },
];

export const LandingCompliance: React.FC = () => {
  return (
    <section id="compliance" className="py-20 lg:py-28 bg-[#080B14] border-b border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 text-xs font-mono font-bold text-red-400 backdrop-blur-sm shadow-[0_0_12px_rgba(239,68,68,0.15)]">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>GOVERNANCE &amp; TRUST</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white">
            Certified for Regulated Sovereign Environments
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
            Designed to meet the stringent security, privacy, and forensic requirements of federal defense, healthcare, and global finance.
          </p>
        </div>

        {/* 4 Compliance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {FRAMEWORKS.map((fw, idx) => (
            <div
              key={idx}
              className="glass-card p-6 flex flex-col justify-between hover:border-red-500/40 hover:shadow-[0_0_25px_rgba(239,68,68,0.1)]"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="font-mono text-xs font-bold text-red-400">{fw.code}</span>
                  <span className="rounded-md bg-red-500/15 px-2 py-0.5 text-[9px] font-mono font-bold text-red-300 border border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]">
                    {fw.badge}
                  </span>
                </div>
                <h3 className="font-display text-sm font-bold text-white mb-2">{fw.title}</h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">{fw.desc}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center space-x-1.5 text-[11px] font-mono text-emerald-400 font-bold">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Automated Validation</span>
              </div>
            </div>
          ))}
        </div>

        {/* Ecosystem Integrations */}
        <div className="glass-card p-8 rounded-2xl border border-slate-800/90 bg-slate-950/70 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          <div className="text-center mb-6">
            <h3 className="font-display text-base font-bold text-white">
              Native Integrations Across the Modern AI Agent Stack
            </h3>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Drop-in Python &amp; TypeScript middleware for all leading frameworks and vector stores
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {INTEGRATIONS.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 hover:border-red-500/40 hover:bg-slate-800/60 hover:shadow-[0_0_15px_rgba(239,68,68,0.12)] transition-all text-center flex flex-col justify-center items-center group cursor-pointer"
              >
                <span className="font-display text-xs font-bold text-slate-200 group-hover:text-red-300 transition-colors truncate w-full">
                  {item.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5">{item.type}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
