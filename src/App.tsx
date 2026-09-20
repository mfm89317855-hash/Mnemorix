import React, { useState, useEffect } from 'react';
import { SentinelProvider, useSentinel } from './context/SentinelContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { SettingsModal } from './components/layout/SettingsModal';
import { ComplianceModal } from './components/layout/ComplianceModal';
import { SentinelCopilotDrawer } from './components/copilot/SentinelCopilotDrawer';
import { AuthModal } from './components/auth/AuthModal';

import { DashboardTab } from './components/dashboard/DashboardTab';
import { MerkleChainExplorer } from './components/hashchain/MerkleChainExplorer';
import { FirewallPlayground } from './components/firewall/FirewallPlayground';
import { AgentFleetView } from './components/fleet/AgentFleetView';
import { PolicyStudio } from './components/policies/PolicyStudio';
import { ForensicAuditView } from './components/audit/ForensicAuditView';
import { LandingPage } from './components/landing/LandingPage';
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

const ConsoleContainer: React.FC<{ onBackToLanding: () => void }> = ({ onBackToLanding }) => {
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
    <div className="min-h-screen bg-[#06080F] text-slate-200 flex flex-col selection:bg-red-500/30 selection:text-red-300 relative font-sans">
      
      {/* Laser Red Accent Stripe at the very top with neon glow */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500 via-rose-500 to-red-600 z-50 shadow-[0_0_12px_rgba(239,68,68,0.8)]" />

      {/* Ambient Matrix Grid & Radial Glow Background */}
      <div className="fixed inset-0 bg-matrix-grid pointer-events-none z-0 opacity-70" />
      <div className="fixed inset-0 bg-radial-glow pointer-events-none z-0" />

      {/* Top Console Navbar */}
      <Navbar onBackToLanding={onBackToLanding} />

      {/* Main Body with Sidebar + Active Tab Content */}
      <div className="relative z-10 flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <MainContent />
      </div>

      {/* Global Modals & Drawers */}
      <SettingsModal />
      <ComplianceModal />
      <SentinelCopilotDrawer />
      <AuthModal />

      {/* Bottom Telemetry Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-[#0B0F1A]/90 backdrop-blur-md px-4 py-3.5 text-[11px] font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2.5">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
          <span className="font-semibold text-slate-200">MNEMORIX SENTINEL v2.5 | ZERO-TRUST AI MEMORY FIREWALL</span>
        </div>
        <div className="flex items-center space-x-3 mt-2 sm:mt-0 text-slate-400">
          <span className="hidden md:inline text-slate-400">Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300 font-mono">Ctrl/⌘+K</kbd> for Copilot</span>
          <span className="hidden md:inline text-slate-700">•</span>
          <span>FIPS 180-4 SHA-256</span>
          <span className="text-slate-700">•</span>
          <span>NIST AI RMF 1.0</span>
          <span className="text-slate-700">•</span>
          <span className="text-red-400 font-bold flex items-center space-x-1">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 inline-block shadow-[0_0_6px_rgba(239,68,68,0.8)]"></span>
            <span>Ed25519 Sealed</span>
          </span>
        </div>
      </footer>

    </div>
  );
};

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'console'>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#console') {
      return 'console';
    }
    return 'landing';
  });

  const handleLaunchConsole = () => {
    soundClick();
    setCurrentView('console');
    window.location.hash = 'console';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    soundClick();
    setCurrentView('landing');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      <SentinelProvider>
        {currentView === 'landing' ? (
          <LandingPage onLaunchConsole={handleLaunchConsole} />
        ) : (
          <ConsoleContainer onBackToLanding={handleBackToLanding} />
        )}
      </SentinelProvider>
    </AuthProvider>
  );
}

export default App;
