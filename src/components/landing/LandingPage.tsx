import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { LandingArchitecture } from './LandingArchitecture';
import { LandingMerkleShowcase } from './LandingMerkleShowcase';
import { LandingCompliance } from './LandingCompliance';
import { LandingPricing } from './LandingPricing';
import { LandingFAQ } from './LandingFAQ';
import { LandingFooter } from './LandingFooter';
import { AuthModal } from '../auth/AuthModal';

interface LandingPageProps {
  onLaunchConsole: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchConsole }) => {
  return (
    <div className="min-h-screen bg-[#06080F] text-slate-200 flex flex-col selection:bg-red-500/30 selection:text-red-300">
      
      {/* Multi-layered ambient backgrounds */}
      <div className="fixed inset-0 bg-matrix-grid pointer-events-none z-0" />
      <div className="fixed inset-0 bg-radial-glow pointer-events-none z-0" />
      <div className="fixed inset-0 bg-dot-matrix pointer-events-none z-0 opacity-40" />

      {/* Main Content Sections */}
      <div className="relative z-10 flex flex-col flex-1">
        <LandingNavbar onLaunchConsole={onLaunchConsole} />
        <main>
          <LandingHero onLaunchConsole={onLaunchConsole} />
          <LandingArchitecture />
          <LandingMerkleShowcase />
          <LandingCompliance />
          <LandingPricing onLaunchConsole={onLaunchConsole} />
          <LandingFAQ />
        </main>
        <LandingFooter onLaunchConsole={onLaunchConsole} />
      </div>

      {/* Global Auth Modal */}
      <AuthModal />

    </div>
  );
};

export default LandingPage;
