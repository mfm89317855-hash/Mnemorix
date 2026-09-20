import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Boxes, Check, RefreshCw, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';
import { soundClick, soundSelfHeal } from '../../lib/sound';

export const HologramDefenseCore: React.FC = () => {
  const { isChainCompromised, selfHealChain, setActiveTab, kpis, blocks } = useSentinel();

  const pipeline = [
    { index: '01', label: 'Pattern guard', detail: 'Heuristic match', value: '1.2ms' },
    { index: '02', label: 'Vector guard', detail: 'Drift analysis', value: '3.8ms' },
    { index: '03', label: 'Semantic guard', detail: 'Intent analysis', value: '8.5ms' },
  ];

  return (
    <section className={`defense-overview ${isChainCompromised ? 'is-compromised' : ''}`}>
      <div className="defense-summary">
        <div className="flex items-center justify-between gap-4">
          <div className="section-kicker">System posture / live</div>
          <span className={`system-state ${isChainCompromised ? 'danger' : 'healthy'}`}>
            {isChainCompromised ? <ShieldAlert /> : <ShieldCheck />}
            {isChainCompromised ? 'Intervention required' : 'All controls operational'}
          </span>
        </div>

        <div className="mt-8">
          <p className="defense-overline">Memory integrity</p>
          <h1 className="defense-title">
            {isChainCompromised ? 'Canonical chain requires repair.' : 'The memory boundary is intact.'}
          </h1>
          <p className="defense-copy">
            Every proposed write passes through three inspection layers before it is signed and anchored to the ledger.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 mt-7">
          <button onClick={() => { soundClick(); setActiveTab('firewall'); }} className="button-primary">
            Inspect memory <ArrowRight className="h-4 w-4" />
          </button>
          <button onClick={() => { soundClick(); setActiveTab('hashchain'); }} className="button-secondary">
            <Boxes className="h-4 w-4" /> View ledger
          </button>
          {isChainCompromised && (
            <button onClick={() => { soundSelfHeal(); selfHealChain(); }} className="button-danger">
              <RefreshCw className="h-4 w-4" /> Restore canonical chain
            </button>
          )}
        </div>
      </div>

      <div className="defense-telemetry">
        <div className="telemetry-grid">
          <div><span>Protected memories</span><strong>{kpis.totalMemories.toLocaleString()}</strong><small>Signed writes</small></div>
          <div><span>Threats blocked</span><strong>{kpis.injectionsBlocked.toLocaleString()}</strong><small>Zero confirmed breaches</small></div>
          <div><span>Ledger depth</span><strong>{blocks.length}</strong><small>Linked blocks</small></div>
        </div>

        <div className="pipeline-list">
          <div className="pipeline-heading"><span>Inspection pipeline</span><span>Median latency</span></div>
          {pipeline.map((layer, index) => (
            <motion.div
              key={layer.index}
              className="pipeline-row"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: .08 * index }}
            >
              <span className="pipeline-index">{layer.index}</span>
              <div><strong>{layer.label}</strong><small>{layer.detail}</small></div>
              <span className="pipeline-check"><Check /></span>
              <code>{layer.value}</code>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
