import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Radio } from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';

export const ThreatRadarChart: React.FC = () => {
  const { agents } = useSentinel();
  const [chartView, setChartView] = useState<'radar' | 'drift'>('radar');

  const radarData = [
    { subject: 'Prompt Injection Defense', A: 99, fullMark: 100 },
    { subject: 'Trojan Detection', A: 96, fullMark: 100 },
    { subject: 'Role Access Control', A: 98, fullMark: 100 },
    { subject: 'Semantic Drift Stability', A: 94, fullMark: 100 },
    { subject: 'Canary Beacon Trap', A: 97, fullMark: 100 },
    { subject: 'Merkle DAG Integrity', A: 100, fullMark: 100 },
  ];

  const driftTrendData = [
    { time: '08:00', alpha: 0.008, quant: 0.015, nexus: 0.005, aether: 0.032 },
    { time: '08:20', alpha: 0.011, quant: 0.022, nexus: 0.006, aether: 0.045 },
    { time: '08:40', alpha: 0.009, quant: 0.028, nexus: 0.007, aether: 0.058 },
    { time: '09:00', alpha: 0.014, quant: 0.026, nexus: 0.008, aether: 0.064 },
    { time: '09:20', alpha: 0.012, quant: 0.028, nexus: 0.008, aether: 0.062 },
  ];

  return (
    <div className="glass-card p-5 flex flex-col h-full shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
            <Radio className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
              {chartView === 'radar' ? 'Security coverage' : 'Vector drift'}
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              {chartView === 'radar' ? 'Control coverage by detection category' : 'Historical cosine divergence'}
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setChartView('radar')}
            className={`rounded px-2.5 py-1 text-[11px] font-mono font-bold transition-all ${
              chartView === 'radar'
                ? 'bg-red-600 text-white shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Radar
          </button>
          <button
            onClick={() => setChartView('drift')}
            className={`rounded px-2.5 py-1 text-[11px] font-mono font-bold transition-all ${
              chartView === 'drift'
                ? 'bg-red-600 text-white shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Vector Drift
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 min-h-[260px] w-full flex items-center justify-center">
        {chartView === 'radar' ? (
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart cx="50%" cy="50%" outerRadius="58%" data={radarData} margin={{ top: 18, right: 44, bottom: 18, left: 44 }}>
              <PolarGrid stroke="rgba(148, 163, 184, 0.15)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#667085', fontSize: 9, fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(148, 163, 184, 0.2)" />
              <Radar
                name="Security Score"
                dataKey="A"
                stroke="#EF4444"
                strokeWidth={2}
                fill="#EF4444"
                fillOpacity={0.25}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={driftTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAlpha" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAether" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis stroke="#475569" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  borderRadius: '0.75rem',
                  fontSize: '11px',
                  fontFamily: 'JetBrains Mono',
                  color: '#F8FAFC',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                }}
              />
              <Area type="monotone" dataKey="alpha" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorAlpha)" name="SENTINEL-ALPHA" />
              <Area type="monotone" dataKey="aether" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorAether)" name="AETHER-DEV" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Fleet Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800/80 text-[11px] font-mono">
        {agents.map((agent) => (
          <div key={agent.id} className="flex items-center space-x-1.5 text-slate-400">
            <span className="agent-initials">{agent.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2)}</span>
            <span className="truncate">{agent.name}:</span>
            <strong className="text-red-400 font-bold">{agent.integrityScore}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
};
