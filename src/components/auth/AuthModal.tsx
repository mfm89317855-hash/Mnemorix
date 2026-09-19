import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Sparkles,
  Database,
  CheckCircle2,
  Key,
  ExternalLink,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getFirebaseConfig, saveCustomFirebaseConfig } from '../../lib/firebase';
import { soundClick } from '../../lib/sound';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithGoogle, user, logout, loading, isFirebaseConfigured } = useAuth();
  const [showConfigEditor, setShowConfigEditor] = useState(false);
  const [apiKey, setApiKey] = useState(getFirebaseConfig().apiKey || '');
  const [projectId, setProjectId] = useState(getFirebaseConfig().projectId || '');
  const [authDomain, setAuthDomain] = useState(getFirebaseConfig().authDomain || '');

  if (!isAuthModalOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    soundClick();
    saveCustomFirebaseConfig({
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md white-red-card p-6 shadow-2xl rounded-2xl border-2 border-red-500/20 bg-white">
        
        {/* Close button */}
        <button
          onClick={() => { soundClick(); setIsAuthModalOpen(false); }}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-600 shadow-2xs">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-slate-900">
              Enterprise Access Portal
            </h3>
            <p className="text-xs font-mono text-slate-500">
              Zero-Trust Google OAuth 2.0 & Firebase Cloud
            </p>
          </div>
        </div>

        {/* Signed-in View */}
        {user ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-center space-x-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="h-12 w-12 rounded-full border-2 border-emerald-500 object-cover shadow-xs"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-lg">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="font-display text-sm font-bold text-slate-900 truncate">
                    {user.displayName}
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                </div>
                <p className="text-xs font-mono text-slate-600 truncate">{user.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="rounded bg-white px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-800 border border-emerald-200">
                    {user.isDemo ? 'ENTERPRISE DEMO PASS' : 'FIREBASE CLOUD AUTH'}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs font-mono space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Security Clearance:</span>
                <strong className="text-red-700 font-bold">LEVEL-4 SEC-OPS</strong>
              </div>
              <div className="flex justify-between">
                <span>Organization:</span>
                <strong className="text-slate-800">{user.organization || 'MNEMORIX Sovereign'}</strong>
              </div>
              <div className="flex justify-between">
                <span>Session Signature:</span>
                <strong className="text-emerald-700">Ed25519-VERIFIED</strong>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 font-mono text-xs font-bold py-2.5 transition-all shadow-2xs active:scale-98"
            >
              Sign Out from Sovereign Session
            </button>
          </div>
        ) : (
          /* Sign-in Flow */
          <div className="space-y-4">
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              Sign in with your enterprise Google account to authenticate autonomous agent fleets, sync Merkle audit records to Firebase Cloud Firestore, and enforce Zero-Trust memory policies.
            </p>

            {/* Google Sign-in Button */}
            <button
              onClick={loginWithGoogle}
              disabled={loading}
              className="group relative flex w-full items-center justify-center space-x-3 rounded-xl border-2 border-slate-300 bg-white hover:border-red-500 hover:bg-red-50/30 px-4 py-3 text-xs font-mono font-bold text-slate-800 shadow-sm transition-all active:scale-98"
            >
              {/* Official Google 'G' Icon */}
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'Authenticating...' : 'Continue with Google'}</span>
            </button>

            {/* Cloud Status Indicator */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] font-mono space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center space-x-1">
                  <Database className="h-3.5 w-3.5 text-red-600" />
                  <span>Cloud Database:</span>
                </span>
                <span className={`font-bold ${isFirebaseConfigured ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isFirebaseConfigured ? 'Firebase Firestore (Connected)' : 'Demo Sandbox Mode (Active)'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                {isFirebaseConfigured
                  ? 'All user sessions and telemetry are synced directly to Google Cloud Firestore.'
                  : 'Google OAuth simulation is active. To connect your live Firebase project, click below.'}
              </p>
            </div>

            {/* Toggle Firebase Config Editor */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowConfigEditor(!showConfigEditor)}
                className="text-[11px] font-mono text-red-600 hover:text-red-700 font-bold flex items-center space-x-1"
              >
                <Key className="h-3 w-3" />
                <span>{showConfigEditor ? 'Hide Firebase Config Keys' : 'Configure Custom Firebase Project Keys'}</span>
              </button>

              {showConfigEditor && (
                <form onSubmit={handleSaveConfig} className="mt-3 space-y-2.5 p-3 rounded-xl border border-red-200 bg-red-50/40 text-xs font-mono">
                  <div>
                    <label className="block text-[10px] text-slate-600 font-bold mb-1">Firebase API Key:</label>
                    <input
                      type="text"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 font-bold mb-1">Project ID:</label>
                    <input
                      type="text"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      placeholder="mnemorix-sentinel-prod"
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 font-bold mb-1">Auth Domain (optional):</label>
                    <input
                      type="text"
                      value={authDomain}
                      onChange={(e) => setAuthDomain(e.target.value)}
                      placeholder="mnemorix.firebaseapp.com"
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 text-xs transition-all shadow-2xs"
                  >
                    Save & Initialize Firebase
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Security Compliance Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="h-3 w-3 text-red-600" />
            <span>FIPS 180-4 SHA-256</span>
          </span>
          <span>NIST AI RMF 1.0</span>
          <span>SOC2 Type II</span>
        </div>

      </div>
    </div>
  );
};
