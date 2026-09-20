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
import { AnimatePresence, motion } from 'motion/react';
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
    <section className="panel dashboard-panel coverage-panel">
      {/* Header */}
      <div className="panel-head">
        <div className="flex items-center space-x-2.5">
          <div className="panel-icon">
            <Radio className="h-4 w-4" />
          </div>
          <div>
            <h3>
              {chartView === 'radar' ? 'Security coverage' : 'Vector drift'}
            </h3>
            <p>
              {chartView === 'radar' ? 'Control coverage by detection category' : 'Historical cosine divergence'}
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="segmented-control" aria-label="Coverage chart view">
          <button
            onClick={() => setChartView('radar')}
            className={chartView === 'radar' ? 'active' : ''}
          >
            Radar
          </button>
          <button
            onClick={() => setChartView('drift')}
            className={chartView === 'drift' ? 'active' : ''}
          >
            Vector Drift
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="chart-canvas">
        <AnimatePresence mode="wait" initial={false}>
        {chartView === 'radar' ? (
          <motion.div className="chart-view" key="radar" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart cx="50%" cy="50%" outerRadius="58%" data={radarData} margin={{ top: 18, right: 44, bottom: 18, left: 44 }}>
              <PolarGrid stroke="#dfe3e8" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#596273', fontSize: 10, fontFamily: 'IBM Plex Sans', fontWeight: 500 }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#dfe3e8" tick={{ fill: '#8a94a3', fontSize: 9 }} />
              <Radar
                name="Security Score"
                dataKey="A"
                stroke="#EF4444"
                strokeWidth={2}
                fill="#EF4444"
                fillOpacity={0.1}
              />
            </RadarChart>
          </ResponsiveContainer>
          </motion.div>
        ) : (
          <motion.div className="chart-view" key="drift" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
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
              <XAxis dataKey="time" stroke="#d0d5dd" tick={{ fontSize: 10, fill: '#667085', fontFamily: 'IBM Plex Mono' }} />
              <YAxis stroke="#d0d5dd" tick={{ fontSize: 10, fill: '#667085', fontFamily: 'IBM Plex Mono' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#d0d5dd',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontFamily: 'IBM Plex Mono',
                  color: '#16181d',
                  boxShadow: '0 10px 28px rgba(16,24,40,.12)',
                }}
              />
              <Area type="monotone" dataKey="alpha" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorAlpha)" name="SENTINEL-ALPHA" />
              <Area type="monotone" dataKey="aether" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorAether)" name="AETHER-DEV" />
            </AreaChart>
          </ResponsiveContainer>
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      {/* Fleet Legend */}
      <div className="coverage-legend">
        {agents.map((agent) => (
          <div key={agent.id}>
            <span className="agent-initials">{agent.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2)}</span>
            <span className="truncate">{agent.name}:</span>
            <strong>{agent.integrityScore}%</strong>
          </div>
        ))}
      </div>
    </section>
  );
};
