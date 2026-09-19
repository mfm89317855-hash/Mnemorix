import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { soundClick } from '../../lib/sound';

const FAQS = [
  {
    q: 'How does MNEMORIX Sentinel prevent memory poisoning in vector databases?',
    a: 'Sentinel operates as pre-ingestion security middleware. Before any memory string is embedded into your vector database (Pinecone, Qdrant, ChromaDB, etc.), it must pass through Layer 1 regex traps, Layer 2 vector cosine anomaly detection, and Layer 3 Gemini neural semantic verification. Malicious directives are quarantined or sanitized before they can contaminate long-term memory.',
  },
  {
    q: 'What is the total latency overhead of the 3-layer neural firewall?',
    a: 'Under standard workloads, Sentinel delivers an end-to-end latency of under 12ms. Layer 1 executes in ~1.2ms; Layer 2 executes in ~3.8ms; and Layer 3 executes in ~8.5ms. Clean memories bypass heavier inspection passes via our accelerated fast-path heuristics.',
  },
  {
    q: 'How does autonomous Merkle DAG self-healing work if a database is compromised?',
    a: 'Each memory block is cryptographically linked to the preceding block via SHA-256 and signed with Ed25519 digital signatures. If an attacker directly alters a database row, the Merkle root mismatch alerts Sentinel immediately. The self-healing engine then isolates the compromised block, reverts to the verified baseline snapshot, and re-chains the ledger with zero downtime.',
  },
  {
    q: 'Are our enterprise memory payloads used to train public models?',
    a: 'Strictly zero. All inspection requests operate with Zero Data Retention policies. In sovereign enterprise deployments, Sentinel can be hosted completely air-gapped within your VPC using private, self-hosted LLM weights.',
  },
  {
    q: 'How does Google Authentication and Firebase Cloud sync operate?',
    a: 'Sentinel integrates with Firebase Client SDK v11 and Google OAuth 2.0. Users can authenticate with their Google workspace account to securely bind agent fleets, sync Merkle audit records to Cloud Firestore, and enforce role-based access policies.',
  },
];

export const LandingFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (idx: number) => {
    soundClick();
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-mono font-bold text-red-700">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>KNOWLEDGE BASE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-slate-950">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
            Everything you need to know about autonomous memory security, cryptographic proofs, and deployment models.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? 'border-red-500/40 bg-red-50/30 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-display text-sm font-bold text-slate-900">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-red-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 text-xs text-slate-600 font-sans leading-relaxed border-t border-red-100 pt-3 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
