import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  ShieldAlert,
  Bot,
  Sliders,
  FileSpreadsheet,
  Lock,
} from 'lucide-react';
import { useSentinel, NavigationTab } from '../../context/SentinelContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, isChainCompromised, threatEvents, memories } = useSentinel();

  const quarantinedCount = memories.filter((m) => m.status === 'quarantined').length;
  const criticalThreats = threatEvents.filter((t) => t.severity === 'critical').length;

  const navItems: {
    id: NavigationTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeVariant?: 'danger' | 'warning' | 'info' | 'emerald';
  }[] = [
    {
      id: 'dashboard',
      label: 'Command Center',
      icon: LayoutDashboard,
    },
    {
      id: 'hashchain',
      label: 'Merkle Hash-Chain',
      icon: Boxes,
      badge: isChainCompromised ? 'TAMPER' : undefined,
      badgeVariant: isChainCompromised ? 'danger' : undefined,
    },
    {
      id: 'firewall',
      label: 'Firewall & Simulator',
      icon: ShieldAlert,
      badge: 'Red Team',
      badgeVariant: 'warning',
    },
    {
      id: 'fleet',
      label: 'Agent Fleet Vault',
      icon: Bot,
      badge: quarantinedCount > 0 ? `${quarantinedCount} Isolated` : undefined,
      badgeVariant: quarantinedCount > 0 ? 'warning' : undefined,
    },
    {
      id: 'policies',
      label: 'Zero-Trust Policies',
      icon: Sliders,
    },
    {
      id: 'audit',
      label: 'Forensic Audit & Logs',
      icon: FileSpreadsheet,
      badge: criticalThreats > 0 ? criticalThreats : undefined,
      badgeVariant: 'danger',
    },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white p-3 lg:p-4 flex flex-col justify-between shadow-2xs">
      <div>
        {/* Navigation Section */}
        <div className="mb-2 hidden lg:block px-3 py-2">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            SECURITY MODULES
          </p>
        </div>

        <nav className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-1 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-red-50 text-red-700 border border-red-200 shadow-2xs font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? 'text-red-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span className="font-sans text-[13px]">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`hidden lg:inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                      item.badgeVariant === 'danger'
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : item.badgeVariant === 'warning'
                        ? 'bg-amber-100 text-amber-700 border border-amber-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
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
      <div className="hidden lg:block mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3.5 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5">
            <Lock className="h-3.5 w-3.5 text-red-600" />
            <span className="text-[11px] font-mono font-bold text-slate-900">MERKLE ANCHOR</span>
          </div>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
        </div>
        <div className="space-y-1 text-[11px] font-mono text-slate-500">
          <div className="flex justify-between">
            <span>Root Hash:</span>
            <span className="text-red-600 font-bold truncate max-w-[80px]">f004...726a</span>
          </div>
          <div className="flex justify-between">
            <span>Signature:</span>
            <span className="text-slate-700">Ed25519-SHA256</span>
          </div>
          <div className="flex justify-between">
            <span>Zero-Trust:</span>
            <span className="text-emerald-600 font-bold">ACTIVE</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
