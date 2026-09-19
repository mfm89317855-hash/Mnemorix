import React, { useEffect } from 'react';
import { SentinelProvider, useSentinel } from './context/SentinelContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { SettingsModal } from './components/layout/SettingsModal';
import { ComplianceModal } from './components/layout/ComplianceModal';
import { SentinelCopilotDrawer } from './components/copilot/SentinelCopilotDrawer';

import { DashboardTab } from './components/dashboard/DashboardTab';
import { MerkleChainExplorer } from './components/hashchain/MerkleChainExplorer';
import { FirewallPlayground } from './components/firewall/FirewallPlayground';
import { AgentFleetView } from './components/fleet/AgentFleetView';
import { PolicyStudio } from './components/policies/PolicyStudio';
import { ForensicAuditView } from './components/audit/ForensicAuditView';
import { soundClick } from './lib/sound';

const MainContent: React.FC = () => {
  const { activeTab } = useSentinel();

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'hashchain' && <MerkleChainExplorer />}
      {activeTab === 'firewall' && <FirewallPlayground />}
      {activeTab === 'fleet' && <AgentFleetView />}
      {activeTab === 'policies' && <PolicyStudio />}
      {activeTab === 'audit' && <ForensicAuditView />}
    </main>
  );
};

const AppContainer: React.FC = () => {
  const { isCopilotOpen, setIsCopilotOpen } = useSentinel();

  // Global keyboard shortcuts (Cmd+K / Ctrl+K for Copilot)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        soundClick();
        setIsCopilotOpen(!isCopilotOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCopilotOpen, setIsCopilotOpen]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-red-500/20 selection:text-red-700 relative">
      
      {/* Laser Red Accent Stripe at the very top */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500 via-rose-500 to-red-600 z-50 opacity-90"></div>

      {/* Ambient Grid Background */}
      <div className="fixed inset-0 bg-white-grid bg-white-radial pointer-events-none z-0" />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Body with Sidebar + Active Tab Content */}
      <div className="relative z-10 flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <MainContent />
      </div>

      {/* Global Modals & Drawers */}
      <SettingsModal />
      <ComplianceModal />
      <SentinelCopilotDrawer />

      {/* Bottom Telemetry Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white/90 backdrop-blur-md px-4 py-3 text-[11px] font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-red-600 animate-ping"></span>
          <span className="font-semibold text-slate-800">MNEMORIX SENTINEL v2.5 | ZERO-TRUST AI MEMORY FIREWALL</span>
        </div>
        <div className="flex items-center space-x-3 mt-2 sm:mt-0 text-slate-500">
          <span className="hidden md:inline text-slate-400">Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px] text-slate-700">Ctrl/⌘+K</kbd> for Copilot</span>
          <span className="hidden md:inline">•</span>
          <span>FIPS 180-4 SHA-256</span>
          <span>•</span>
          <span>NIST AI RMF 1.0</span>
          <span>•</span>
          <span className="text-red-600 font-bold flex items-center space-x-1">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600 inline-block"></span>
            <span>Ed25519 Sealed</span>
          </span>
        </div>
      </footer>

    </div>
  );
};

export function App() {
  return (
    <SentinelProvider>
      <AppContainer />
    </SentinelProvider>
  );
}

export default App;
