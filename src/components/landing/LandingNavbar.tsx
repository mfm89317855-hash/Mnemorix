import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, LogOut, Menu, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { soundClick } from '../../lib/sound';
import { MnemorixMark } from '../brand/MnemorixMark';

interface LandingNavbarProps { onLaunchConsole: () => void; }

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onLaunchConsole }) => {
  const { user, setIsAuthModalOpen, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: '#platform', label: 'Platform' },
    { href: '#workflow', label: 'Operations' },
    { href: '#integrity', label: 'Integrity' },
    { href: '#compliance', label: 'Governance' },
  ];

  return (
    <header className="site-nav">
      <div className="site-container site-nav-inner">
        <button className="brand-lockup" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Mnemorix home">
          <span className="brand-mark"><MnemorixMark /></span>
          <span className="text-left">
            <span className="brand-name">MNEMORIX</span>
            <span className="brand-subtitle">Agent memory security</span>
          </span>
        </button>

        <nav className="site-links" aria-label="Primary navigation">
          {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
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
          <button
            className="ui-icon-button site-menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="site-mobile-menu"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="site-container">
              {links.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
