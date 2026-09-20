import React, { useCallback, useState } from 'react';
import { FileCheck2, Home, LogOut, PlugZap, RefreshCw, Settings, ShieldAlert, ShieldCheck, Sparkles, User, Volume2, VolumeX } from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';
import { useAuth } from '../../context/AuthContext';
import { FastnModal } from './FastnModal';
import { isSoundMuted, soundChainVerified, soundClick, toggleSoundMute } from '../../lib/sound';
import { MnemorixMark } from '../brand/MnemorixMark';

interface NavbarProps { onBackToLanding?: () => void; }

export const Navbar: React.FC<NavbarProps> = ({ onBackToLanding }) => {
  const { isChainCompromised, selfHealChain, auditChainIntegrity, isCopilotOpen, setIsCopilotOpen, setIsSettingsModalOpen, setIsComplianceModalOpen, setActiveTab } = useSentinel();
  const { user, setIsAuthModalOpen, logout } = useAuth();
  const [fastnOpen, setFastnOpen] = useState(false);
  const [muted, setMuted] = useState(isSoundMuted());

  const handleAudit = useCallback(() => {
    soundClick();
    if (auditChainIntegrity()) {
      soundChainVerified();
      alert('Merkle DAG verification passed.\nAll blocks and signatures match the current root anchor.');
    }
  }, [auditChainIntegrity]);

  return (
    <>
      <header className="console-nav">
        <div className="console-nav-inner">
          <div className="flex items-center gap-3">
            <button className="console-brand" onClick={() => { soundClick(); setActiveTab('dashboard'); }}>
              <span className="brand-mark"><MnemorixMark /></span>
              <span className="console-brand-copy"><strong>MNEMORIX</strong><span>Agent memory security</span></span>
            </button>
            {onBackToLanding && <button className="console-action" onClick={() => { soundClick(); onBackToLanding(); }} title="Product overview"><Home /><span>Overview</span></button>}
          </div>

          <div className={`console-status ${isChainCompromised ? 'danger' : ''}`}>
            {isChainCompromised ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
            <span>{isChainCompromised ? 'Chain integrity failed' : 'Memory boundary healthy'}</span>
            {isChainCompromised && <button className="underline" onClick={() => { soundClick(); selfHealChain(); }}>Restore</button>}
          </div>

          <div className="console-actions">
            <button className="console-action" onClick={() => { const next = toggleSoundMute(); setMuted(next); }} title={muted ? 'Enable sound' : 'Mute sound'}>
              {muted ? <VolumeX /> : <Volume2 />}
            </button>
            <button className="console-action" onClick={() => { soundClick(); setFastnOpen(true); }} title="Integrations"><PlugZap /><span>Integrations</span></button>
            <button className="console-action" onClick={handleAudit} title="Verify ledger"><RefreshCw /><span>Verify</span></button>
            <button className="console-action" onClick={() => { soundClick(); setIsComplianceModalOpen(true); }} title="Compliance report"><FileCheck2 /><span>Reports</span></button>
            <button className="console-action" onClick={() => { soundClick(); setIsSettingsModalOpen(true); }} title="Settings"><Settings /></button>
            {user ? (
              <>
                <button className="console-action" onClick={() => { soundClick(); setIsAuthModalOpen(true); }} title={user.email || 'Account'}><User /><span>{user.displayName?.split(' ')[0] || 'Account'}</span></button>
                <button className="console-action" onClick={() => { soundClick(); logout(); }} title="Sign out"><LogOut /></button>
              </>
            ) : <button className="console-action" onClick={() => { soundClick(); setIsAuthModalOpen(true); }}><User /><span>Sign in</span></button>}
            <button className="console-action primary" onClick={() => { soundClick(); setIsCopilotOpen(!isCopilotOpen); }}><Sparkles /><span>Copilot</span></button>
          </div>
        </div>
      </header>
      <FastnModal isOpen={fastnOpen} onClose={() => setFastnOpen(false)} />
    </>
  );
};
