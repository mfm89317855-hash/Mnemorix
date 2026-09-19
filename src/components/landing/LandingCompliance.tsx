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
    <section id="compliance" className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-mono font-bold text-red-700">
            <span>GOVERNANCE & TRUST</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-slate-950">
            Certified for Regulated Sovereign Environments
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
            Designed to meet the stringent security, privacy, and forensic requirements of federal defense, healthcare, and global finance.
          </p>
        </div>

        {/* 4 Compliance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {FRAMEWORKS.map((fw, idx) => (
            <div
              key={idx}
              className="white-red-card p-6 flex flex-col justify-between shadow-2xs card-lift"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-red-700">{fw.code}</span>
                  <span className="rounded bg-red-50 px-2 py-0.5 text-[9px] font-mono font-bold text-red-800 border border-red-200">
                    {fw.badge}
                  </span>
                </div>
                <h3 className="font-display text-sm font-bold text-slate-900 mb-2">{fw.title}</h3>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">{fw.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center space-x-1.5 text-[11px] font-mono text-emerald-700 font-bold">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Automated Validation</span>
              </div>
            </div>
          ))}
        </div>

        {/* Ecosystem Integrations */}
        <div className="white-red-card p-8 rounded-2xl border border-slate-200 bg-slate-50/50">
          <div className="text-center mb-6">
            <h3 className="font-display text-base font-bold text-slate-900">
              Native Integrations Across the Modern AI Agent Stack
            </h3>
            <p className="text-xs font-mono text-slate-500 mt-1">
              Drop-in Python & TypeScript middleware for all leading frameworks and vector stores
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {INTEGRATIONS.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs text-center flex flex-col justify-center items-center hover:border-red-300 transition-colors"
              >
                <span className="font-display text-xs font-bold text-slate-900 truncate w-full">
                  {item.name}
                </span>
                <span className="text-[10px] font-mono text-slate-500 mt-0.5">{item.type}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
