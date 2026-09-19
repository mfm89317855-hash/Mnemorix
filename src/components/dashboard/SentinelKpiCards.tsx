import React, { useEffect, useRef } from 'react';
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
      color: isChainCompromised ? 'text-red-600' : 'text-emerald-600',
      badge: isChainCompromised ? 'CRITICAL' : 'OPTIMAL',
      badgeClass: isChainCompromised ? 'badge-red' : 'badge-emerald',
      iconBg: isChainCompromised
        ? 'bg-red-50 text-red-600 border-red-200 shadow-red-100'
        : 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-emerald-100',
      trend: isChainCompromised ? <TrendingDown className="h-3.5 w-3.5 text-red-500" /> : null,
      accentBar: isChainCompromised ? 'bg-red-500' : 'bg-emerald-500',
      barWidth: isChainCompromised ? '30%' : '100%',
    },
    {
      title: 'Protected Memories',
      value: kpis.totalMemories.toLocaleString(),
      subtext: `${blocks.length} Merkle blocks anchored in DAG`,
      icon: Boxes,
      color: 'text-slate-900',
      badge: '+18 today',
      badgeClass: 'badge-red',
      iconBg: 'bg-red-50 text-red-600 border-red-200 shadow-red-100',
      trend: <TrendingUp className="h-3.5 w-3.5 text-red-500" />,
      accentBar: 'bg-gradient-to-r from-red-500 to-rose-400',
      barWidth: '78%',
    },
    {
      title: 'Injections Blocked',
      value: kpis.injectionsBlocked.toLocaleString(),
      subtext: 'Trojans, prompt injections & escalations',
      icon: Lock,
      color: 'text-slate-900',
      badge: 'Zero Breach',
      badgeClass: 'badge-slate',
      iconBg: 'bg-slate-100 text-slate-600 border-slate-200 shadow-slate-100',
      trend: <TrendingUp className="h-3.5 w-3.5 text-amber-500" />,
      accentBar: 'bg-gradient-to-r from-amber-500 to-orange-400',
      barWidth: '62%',
    },
    {
      title: 'Verification Latency',
      value: `${kpis.avgLatencyMs}ms`,
      subtext: 'L1 heuristic + L2 drift + Merkle seal',
      icon: Zap,
      color: 'text-amber-600',
      badge: 'Sub-2ms',
      badgeClass: 'badge-amber',
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200 shadow-amber-100',
      trend: <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />,
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
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <span className={`${card.badgeClass} font-mono`}>
                {card.badge}
              </span>
            </div>

            {/* Middle — Big value + icon */}
            <div className="flex items-end justify-between mb-3">
              <div className={`font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-none ${card.color}`}>
                {card.value}
              </div>
              <div className={`flex p-2.5 rounded-xl border shadow-sm ${card.iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            {/* Trend + Accent Bar */}
            <div className="space-y-2">
              <div className="threat-bar">
                <div
                  className={`threat-bar-fill ${card.accentBar}`}
                  style={{ width: card.barWidth }}
                />
              </div>
              <div className="flex items-center space-x-1.5 text-[11px] font-mono text-slate-500">
                <Activity className="h-3 w-3 text-red-500" />
                <span className="flex-1">{card.subtext}</span>
                {card.trend}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
