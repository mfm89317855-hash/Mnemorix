import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Boxes,
  Zap,
  Lock,
  Activity,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';

export const SentinelKpiCards: React.FC = () => {
  const { kpis, isChainCompromised, blocks } = useSentinel();

  const cards = [
    {
      title: 'Zero-Trust Shield',
      value: isChainCompromised ? 'COMPROMISED' : '100% SECURE',
      subtext: isChainCompromised ? 'Merkle DAG broken — self-heal required' : 'SHA-256 seal intact, Ed25519 signed',
      icon: isChainCompromised ? ShieldAlert : ShieldCheck,
      color: isChainCompromised ? 'text-red-400' : 'text-emerald-400',
      badge: isChainCompromised ? 'CRITICAL' : 'OPTIMAL',
      badgeClass: isChainCompromised ? 'badge-red' : 'badge-emerald',
      iconBg: isChainCompromised
        ? 'bg-red-500/15 text-red-400 border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.25)]'
        : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(52,211,153,0.25)]',
      trend: isChainCompromised ? <TrendingDown className="h-3.5 w-3.5 text-red-400" /> : null,
      accentBar: isChainCompromised ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400',
      barWidth: isChainCompromised ? '30%' : '100%',
    },
    {
      title: 'Protected Memories',
      value: kpis.totalMemories.toLocaleString(),
      subtext: `${blocks.length} Merkle blocks anchored in DAG`,
      icon: Boxes,
      color: 'text-white',
      badge: '+18 today',
      badgeClass: 'badge-red',
      iconBg: 'bg-red-500/15 text-red-400 border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.2)]',
      trend: <TrendingUp className="h-3.5 w-3.5 text-red-400" />,
      accentBar: 'bg-gradient-to-r from-red-500 to-rose-400',
      barWidth: '78%',
    },
    {
      title: 'Injections Blocked',
      value: kpis.injectionsBlocked.toLocaleString(),
      subtext: 'Trojans, prompt injections & escalations',
      icon: Lock,
      color: 'text-white',
      badge: 'Zero Breach',
      badgeClass: 'badge-slate',
      iconBg: 'bg-slate-800 text-slate-300 border-slate-700 shadow-sm',
      trend: <TrendingUp className="h-3.5 w-3.5 text-amber-400" />,
      accentBar: 'bg-gradient-to-r from-amber-500 to-orange-400',
      barWidth: '62%',
    },
    {
      title: 'Verification Latency',
      value: `${kpis.avgLatencyMs}ms`,
      subtext: 'L1 heuristic + L2 drift + Merkle seal',
      icon: Zap,
      color: 'text-amber-400',
      badge: 'Sub-2ms',
      badgeClass: 'badge-amber',
      iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(251,191,36,0.2)]',
      trend: <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />,
      accentBar: 'bg-gradient-to-r from-amber-500 to-yellow-400',
      barWidth: '15%',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="kpi-card p-5 flex flex-col justify-between animate-slide-up"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            {/* Top row — title + badge */}
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <span className={`${card.badgeClass} font-mono text-[10px]`}>
                {card.badge}
              </span>
            </div>

            {/* Middle — Big value + icon */}
            <div className="flex items-end justify-between mb-3 relative z-10">
              <div className={`font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-none ${card.color}`}>
                {card.value}
              </div>
              <div className={`flex p-2.5 rounded-xl border ${card.iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            {/* Trend + Accent Bar */}
            <div className="space-y-2 relative z-10">
              <div className="threat-bar">
                <div
                  className={`threat-bar-fill ${card.accentBar}`}
                  style={{ width: card.barWidth }}
                />
              </div>
              <div className="flex items-center space-x-1.5 text-[11px] font-mono text-slate-400">
                <Activity className="h-3 w-3 text-red-400 shrink-0" />
                <span className="flex-1 truncate">{card.subtext}</span>
                {card.trend}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
