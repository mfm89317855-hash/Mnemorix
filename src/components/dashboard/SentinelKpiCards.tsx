import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Boxes,
  Zap,
  Lock,
  Activity,
} from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';

export const SentinelKpiCards: React.FC = () => {
  const { kpis, isChainCompromised, blocks } = useSentinel();

  const cards = [
    {
      title: 'Zero-Trust Shield',
      value: isChainCompromised ? 'COMPROMISED' : '100% SECURE',
      subtext: isChainCompromised ? 'Merkle DAG broken!' : 'SHA-256 seal verified',
      icon: isChainCompromised ? ShieldAlert : ShieldCheck,
      color: isChainCompromised ? 'text-red-600' : 'text-emerald-600',
      badge: isChainCompromised ? 'CRITICAL' : 'OPTIMAL',
      badgeClass: isChainCompromised ? 'badge-red' : 'badge-emerald',
      iconBg: isChainCompromised ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Protected Memories',
      value: kpis.totalMemories.toLocaleString(),
      subtext: `${blocks.length} Merkle blocks anchored`,
      icon: Boxes,
      color: 'text-red-600',
      badge: '+18 today',
      badgeClass: 'badge-red',
      iconBg: 'bg-red-50 text-red-600',
    },
    {
      title: 'Injections Blocked',
      value: kpis.injectionsBlocked.toLocaleString(),
      subtext: 'Indirect prompt & trojans blocked',
      icon: Lock,
      color: 'text-slate-900',
      badge: 'Zero Breach',
      badgeClass: 'badge-slate',
      iconBg: 'bg-slate-100 text-slate-700',
    },
    {
      title: 'Verification Latency',
      value: `${kpis.avgLatencyMs} ms`,
      subtext: 'L1 + L2 + Merkle validation',
      icon: Zap,
      color: 'text-amber-600',
      badge: 'Sub-2ms',
      badgeClass: 'badge-amber',
      iconBg: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="white-red-card p-5 flex flex-col justify-between shadow-2xs"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-slate-500">
                {card.title}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${card.badgeClass}`}>
                {card.badge}
              </span>
            </div>

            {/* Middle Big Value */}
            <div className="my-3 flex items-baseline justify-between">
              <div className={`font-display text-2xl sm:text-3xl font-extrabold tracking-tight ${card.color}`}>
                {card.value}
              </div>
              <div className={`p-2 rounded-lg border border-slate-100 ${card.iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            {/* Bottom Subtext */}
            <div className="flex items-center space-x-1.5 text-[11px] font-mono text-slate-500 border-t border-slate-100 pt-2.5">
              <Activity className="h-3 w-3 text-red-500" />
              <span>{card.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
