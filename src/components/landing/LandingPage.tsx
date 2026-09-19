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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-red-500/20 selection:text-red-700">
      
      {/* Ambient background pattern */}
      <div className="fixed inset-0 bg-white-grid bg-white-radial pointer-events-none z-0" />

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
