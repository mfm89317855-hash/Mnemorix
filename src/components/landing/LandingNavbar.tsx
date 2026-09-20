import React from 'react';
import { ArrowRight, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { soundClick } from '../../lib/sound';

interface LandingNavbarProps { onLaunchConsole: () => void; }

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onLaunchConsole }) => {
  const { user, setIsAuthModalOpen, logout } = useAuth();

  return (
    <header className="site-nav">
      <div className="site-container site-nav-inner">
        <button className="brand-lockup" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Mnemorix home">
          <span className="brand-mark">M</span>
          <span className="text-left">
            <span className="brand-name">MNEMORIX</span>
            <span className="brand-subtitle">Agent memory security</span>
          </span>
        </button>

        <nav className="site-links" aria-label="Primary navigation">
          <a href="#platform">Platform</a>
          <a href="#workflow">Workflow</a>
          <a href="#integrity">Integrity</a>
          <a href="#compliance">Compliance</a>
        </nav>

        <div className="site-actions">
          {user ? (
            <>
              <button className="ui-button-secondary sign-in" onClick={() => { soundClick(); setIsAuthModalOpen(true); }}>
                <User className="h-4 w-4" /> {user.displayName?.split(' ')[0] || 'Account'}
              </button>
              <button className="ui-icon-button" onClick={() => { soundClick(); logout(); }} title="Sign out"><LogOut className="h-4 w-4" /></button>
            </>
          ) : (
            <button className="ui-button-secondary sign-in" onClick={() => { soundClick(); setIsAuthModalOpen(true); }}>Sign in</button>
          )}
          <button className="ui-button nav-console-button" onClick={() => { soundClick(); onLaunchConsole(); }}>
            <span>Open console</span> <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
