import React, { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
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
    <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8 max-w-[1440px] mx-auto w-full">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'hashchain' && <MerkleChainExplorer />}
          {activeTab === 'firewall' && <FirewallPlayground />}
          {activeTab === 'fleet' && <AgentFleetView />}
          {activeTab === 'policies' && <PolicyStudio />}
          {activeTab === 'audit' && <ForensicAuditView />}
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

const ConsoleContainer: React.FC<{ onBackToLanding: () => void }> = ({ onBackToLanding }) => {
  const { isCopilotOpen, setIsCopilotOpen } = useSentinel();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        soundClick();
        setIsCopilotOpen(!isCopilotOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCopilotOpen, setIsCopilotOpen]);

  return (
    <div className="mnemorix-light min-h-screen bg-[#f4f2ed] text-slate-900 flex flex-col selection:bg-red-100 selection:text-red-950 relative font-sans">
      <div className="fixed inset-0 bg-matrix-grid pointer-events-none z-0" />
      <Navbar onBackToLanding={onBackToLanding} />

      <div className="relative z-10 flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <MainContent />
      </div>

      <SettingsModal />
      <ComplianceModal />
      <SentinelCopilotDrawer />
      <AuthModal />

      <footer className="console-footer relative z-10 px-4 py-3.5 text-[11px] font-mono flex flex-col sm:flex-row items-center justify-between max-w-[1440px] mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-emerald-600" />
          <span className="font-semibold text-slate-700">MNEMORIX SENTINEL v2.5 / ZERO-TRUST AI MEMORY FIREWALL</span>
        </div>
        <div className="flex items-center gap-3 mt-2 sm:mt-0 text-slate-500">
          <span className="hidden md:inline">Ctrl/Cmd + K for Copilot</span>
          <span className="hidden md:inline text-slate-300">/</span>
          <span>FIPS 180-4</span>
          <span className="text-slate-300">/</span>
          <span>NIST AI RMF</span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-700">Ed25519 sealed</span>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'console'>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#console') return 'console';
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
    <MotionConfig reducedMotion="user" transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
      <AuthProvider>
        <SentinelProvider>
          <AnimatePresence mode="wait" initial={false}>
            {currentView === 'landing' ? (
              <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LandingPage onLaunchConsole={handleLaunchConsole} />
              </motion.div>
            ) : (
              <motion.div key="console" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ConsoleContainer onBackToLanding={handleBackToLanding} />
              </motion.div>
            )}
          </AnimatePresence>
        </SentinelProvider>
      </AuthProvider>
    </MotionConfig>
  );
}

export default App;
