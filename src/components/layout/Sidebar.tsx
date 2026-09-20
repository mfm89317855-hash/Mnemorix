import React from 'react';
import { Bot, Boxes, FileSearch, LayoutDashboard, LockKeyhole, Shield, SlidersHorizontal } from 'lucide-react';
import { NavigationTab, useSentinel } from '../../context/SentinelContext';
import { soundClick } from '../../lib/sound';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, isChainCompromised, threatEvents, memories } = useSentinel();
  const isolated = memories.filter((memory) => memory.status === 'quarantined').length;
  const critical = threatEvents.filter((event) => event.severity === 'critical').length;

  const items: Array<{ id: NavigationTab; label: string; note: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number }> = [
    { id: 'dashboard', label: 'Overview', note: 'Security posture', icon: LayoutDashboard },
    { id: 'hashchain', label: 'Memory ledger', note: 'Hash-chain integrity', icon: Boxes, badge: isChainCompromised ? 'Invalid' : undefined },
    { id: 'firewall', label: 'Inspection', note: 'Firewall simulator', icon: Shield },
    { id: 'fleet', label: 'Agent fleet', note: 'Memory partitions', icon: Bot, badge: isolated || undefined },
    { id: 'policies', label: 'Policies', note: 'Enforcement rules', icon: SlidersHorizontal },
    { id: 'audit', label: 'Audit log', note: 'Events and evidence', icon: FileSearch, badge: critical || undefined },
  ];

  return (
    <aside className="console-sidebar">
      <p className="sidebar-label">Workspace</p>
      <nav aria-label="Console navigation">
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button key={item.id} className={`sidebar-link ${active ? 'active' : ''}`} onClick={() => { soundClick(); setActiveTab(item.id); }}>
              <span className="sidebar-icon"><Icon /></span>
              <span className="sidebar-copy"><strong>{item.label}</strong><small>{item.note}</small></span>
              {item.badge !== undefined && <span className={isChainCompromised && item.id === 'hashchain' ? 'badge-red' : 'badge-slate'}>{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-health">
        <div className="sidebar-health-head"><span className="flex items-center gap-2"><LockKeyhole className="h-3.5 w-3.5" /> Root anchor</span><i className={`health-dot ${isChainCompromised ? '!bg-red-600' : ''}`} /></div>
        <dl><div><dt>Hash</dt><dd>f004...726a</dd></div><div><dt>Signature</dt><dd>Ed25519</dd></div><div><dt>Status</dt><dd>{isChainCompromised ? 'Invalid' : 'Verified'}</dd></div></dl>
      </div>
    </aside>
  );
};
