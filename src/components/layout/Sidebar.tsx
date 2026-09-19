import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  ShieldAlert,
  Bot,
  Sliders,
  FileSpreadsheet,
  Lock,
  Activity,
} from 'lucide-react';
import { useSentinel, NavigationTab } from '../../context/SentinelContext';
import { soundClick } from '../../lib/sound';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, isChainCompromised, threatEvents, memories } = useSentinel();

  const quarantinedCount = memories.filter((m) => m.status === 'quarantined').length;
  const criticalThreats = threatEvents.filter((t) => t.severity === 'critical').length;

  const navItems: {
    id: NavigationTab;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeVariant?: 'danger' | 'warning' | 'info' | 'emerald';
  }[] = [
    {
      id: 'dashboard',
      label: 'Command Center',
      sublabel: 'Mission overview',
      icon: LayoutDashboard,
    },
    {
      id: 'hashchain',
      label: 'Merkle Hash-Chain',
      sublabel: 'Cryptographic DAG',
      icon: Boxes,
      badge: isChainCompromised ? 'TAMPER' : undefined,
      badgeVariant: isChainCompromised ? 'danger' : undefined,
    },
    {
      id: 'firewall',
      label: 'Firewall & Simulator',
      sublabel: 'Red-team injection lab',
      icon: ShieldAlert,
      badge: 'Red Team',
      badgeVariant: 'warning',
    },
    {
      id: 'fleet',
      label: 'Agent Fleet Vault',
      sublabel: 'Memory partitions',
      icon: Bot,
      badge: quarantinedCount > 0 ? `${quarantinedCount} Isolated` : undefined,
      badgeVariant: quarantinedCount > 0 ? 'warning' : undefined,
    },
    {
      id: 'policies',
      label: 'Zero-Trust Policies',
      sublabel: 'Guardrail studio',
      icon: Sliders,
    },
    {
      id: 'audit',
      label: 'Forensic Audit',
      sublabel: 'Incident war room',
      icon: FileSpreadsheet,
      badge: criticalThreats > 0 ? criticalThreats : undefined,
      badgeVariant: 'danger',
    },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200/80 bg-white/80 backdrop-blur-sm p-3 lg:p-4 flex flex-col justify-between shadow-xs">
      <div>
        {/* Navigation Label */}
        <div className="mb-3 hidden lg:block px-3 pt-1">
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center space-x-1.5">
            <Activity className="h-3 w-3 text-red-500" />
            <span>SECURITY MODULES</span>
          </p>
        </div>

        <nav className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-1 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { soundClick(); setActiveTab(item.id); }}
                className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'sidebar-nav-active shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
                    isActive
                      ? 'bg-red-100 text-red-600'
                      : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'
                  }`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-left hidden lg:block">
                    <div className={`text-[12.5px] font-semibold leading-tight ${isActive ? 'text-red-700' : 'text-slate-700'}`}>
                      {item.label}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono leading-tight hidden xl:block">
                      {item.sublabel}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`hidden lg:inline-flex items-center rounded-lg px-1.5 py-0.5 text-[9px] font-mono font-bold shrink-0 ${
                      item.badgeVariant === 'danger'
                        ? 'badge-red'
                        : item.badgeVariant === 'warning'
                        ? 'badge-amber'
                        : 'badge-slate'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Sentinel Health Card */}
      <div className="hidden lg:block mt-4 rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-slate-100/50 p-3.5 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-1.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-red-50 border border-red-200">
              <Lock className="h-3 w-3 text-red-600" />
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-800">MERKLE ANCHOR</span>
          </div>
          <span className={`flex h-2.5 w-2.5 rounded-full ${isChainCompromised ? 'bg-red-500 animate-alert-beacon' : 'bg-emerald-500 animate-status-beacon'}`} />
        </div>

        <div className="space-y-1.5 text-[10.5px] font-mono">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Root Hash:</span>
            <span className="text-red-600 font-bold font-mono tracking-tight">f004...726a</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Signature:</span>
            <span className="text-slate-600 font-semibold">Ed25519</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Zero-Trust:</span>
            <span className={`font-bold ${isChainCompromised ? 'text-red-600' : 'text-emerald-600'}`}>
              {isChainCompromised ? 'BREACHED' : 'ACTIVE'}
            </span>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="mt-2.5 threat-bar">
          <div
            className="threat-bar-fill bg-gradient-to-r from-emerald-500 to-emerald-400"
            style={{ width: isChainCompromised ? '35%' : '100%' }}
          />
        </div>
        <div className="text-[9px] font-mono text-slate-400 mt-1 text-right">
          {isChainCompromised ? '35% — COMPROMISED' : '100% — SEALED'}
        </div>
      </div>
    </aside>
  );
};
