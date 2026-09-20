import React from 'react';
import { Clock3, Database, ShieldCheck, TriangleAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { useSentinel } from '../../context/SentinelContext';

export const SentinelKpiCards: React.FC = () => {
  const { kpis, isChainCompromised, blocks } = useSentinel();
  const metrics = [
    { label: 'Chain integrity', value: isChainCompromised ? 'Failed' : 'Verified', note: `${blocks.length} signed blocks`, icon: isChainCompromised ? TriangleAlert : ShieldCheck, tone: isChainCompromised ? 'text-red-700' : 'text-emerald-700' },
    { label: 'Protected memories', value: kpis.totalMemories.toLocaleString(), note: 'Across connected agents', icon: Database },
    { label: 'Blocked writes', value: kpis.injectionsBlocked.toLocaleString(), note: `${kpis.quarantinedCount} currently quarantined`, icon: TriangleAlert },
    { label: 'Inspection latency', value: `${kpis.avgLatencyMs}ms`, note: 'Average verification time', icon: Clock3 },
  ];

  return (
    <div className="overview-grid">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return <motion.div className="overview-metric" key={metric.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }}><div className="overview-metric-head"><span>{metric.label}</span><Icon className={metric.tone || ''} /></div><strong className={metric.tone || ''}>{metric.value}</strong><small>{metric.note}</small></motion.div>;
      })}
    </div>
  );
};
