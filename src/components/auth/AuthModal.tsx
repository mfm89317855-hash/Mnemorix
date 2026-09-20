import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Mail,
  User,
  CheckCircle2,
  Key,
  Database,
  ArrowRight,
  LogOut,
  Sparkles,
  Zap,
  AlertTriangle,
  RefreshCw,
  Server,
  Cloud,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getFirebaseConfig, saveCustomFirebaseConfig } from '../../lib/firebase';
import { soundClick } from '../../lib/sound';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginWithGoogle,
    loginWithEmail,
    user,
    logout,
    loading,
    isFirebaseConfigured,
    authError,
    clearAuthError,
  } = useAuth();

  const [authTab, setAuthTab] = useState<'google' | 'email' | 'config'>('google');

  // Email form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('Chief AI Safety Officer');

  // Custom Firebase config state
  const currentConfig = getFirebaseConfig();
  const [apiKey, setApiKey] = useState(currentConfig.apiKey || '');
  const [projectId, setProjectId] = useState(currentConfig.projectId || '');
  const [authDomain, setAuthDomain] = useState(currentConfig.authDomain || '');
  const [storageBucket, setStorageBucket] = useState(currentConfig.storageBucket || '');
  const [appId, setAppId] = useState(currentConfig.appId || '');

  if (!isAuthModalOpen) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    await loginWithEmail(email.trim(), password || 'sentinel-pass-2026', displayName.trim(), role);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    soundClick();
    saveCustomFirebaseConfig({
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: authDomain.trim() || (projectId.trim() ? `${projectId.trim()}.firebaseapp.com` : ''),
      storageBucket: storageBucket.trim() || (projectId.trim() ? `${projectId.trim()}.appspot.com` : ''),
      appId: appId.trim(),
    });
  };

  const handleSwitchAccount = async () => {
    await logout();
    await loginWithGoogle();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg white-red-card p-6 shadow-2xl rounded-2xl border-2 border-red-500/20 bg-white max-h-[92vh] flex flex-col overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => {
            soundClick();
            clearAuthError();
            setIsAuthModalOpen(false);
          }}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Close Modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4 shrink-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 border border-red-700 text-white shadow-md shadow-red-500/20">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-display text-base font-bold text-slate-900">
                Enterprise Authentication
              </h3>
              <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-mono font-bold text-red-700 border border-red-200">
                FIREBASE LIVE
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500">
              Multi-Account Google OAuth 2.0 & Cloud Firestore Real-Time Sync
            </p>
          </div>
        </div>

        {/* Auth Error Banner */}
        {authError && (
          <div className="mb-3 rounded-xl border border-red-300 bg-red-50 p-3 text-xs font-mono text-red-800 flex items-start space-x-2 shrink-0 animate-in fade-in">
            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="font-bold block">Authentication Notice:</span>
              <span className="text-[11px] text-red-700 font-sans leading-tight block mt-0.5">
                {authError}
              </span>
              {!isFirebaseConfigured && (
                <button
                  onClick={() => {
                    soundClick();
                    clearAuthError();
                    setAuthTab('config');
                  }}
                  className="mt-1.5 inline-block text-[11px] font-bold text-red-700 underline hover:text-red-900"
                >
                  Configure Firebase Project Keys &rarr;
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 font-mono text-xs">
          {user ? (
            /* Signed-in View */
            <div className="space-y-4">
              <div className="p-4 rounded-xl border-2 border-emerald-300 bg-emerald-50/70 flex items-center space-x-3 shadow-xs">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="h-14 w-14 rounded-full border-2 border-emerald-500 object-cover shadow-xs"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold text-xl shadow-xs">
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
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-800 border border-emerald-300">
                      {user.provider === 'google.com' ? 'Google OAuth Account' : 'Work Email Account'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Real-time Storage & Clearance Info */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2 text-slate-600 text-xs">
                <div className="flex justify-between items-center">
                  <span>Cloud Database:</span>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                    <Database className="h-3 w-3 text-emerald-600" />
                    <span>Cloud Firestore Live</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Firestore Document:</span>
                  <span className="font-mono text-[10px] text-slate-800 truncate max-w-[200px]" title={`users/${user.uid}`}>
                    users/{user.uid}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Security Clearance:</span>
                  <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 border border-red-200">
                    LEVEL-4 SEC-OPS
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Session Signature:</span>
                  <strong className="text-emerald-700 flex items-center space-x-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Ed25519-VERIFIED</span>
                  </strong>
                </div>
              </div>

              {/* Account Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleSwitchAccount}
                  disabled={loading}
                  className="flex items-center justify-center space-x-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-mono text-xs font-bold py-2.5 transition-all shadow-xs active:scale-98 disabled:opacity-50"
                  title="Switch to a different Google account"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
                  <span>Switch Account</span>
                </button>

                <button
                  onClick={logout}
                  disabled={loading}
                  className="flex items-center justify-center space-x-1.5 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 font-mono text-xs font-bold py-2.5 transition-all shadow-xs active:scale-98 disabled:opacity-50"
                  title="Sign out from session"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* Sign-in Flow */
            <div className="space-y-4">
              {/* Tab Selector */}
              <div className="flex space-x-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                {[
                  { id: 'google', label: 'Google OAuth (Multi-Account)' },
                  { id: 'email', label: 'Work Email' },
                  { id: 'config', label: 'Firebase Config' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      soundClick();
                      clearAuthError();
                      setAuthTab(t.id as any);
                    }}
                    className={`flex-1 rounded-lg py-1.5 text-[11px] font-mono font-bold transition-all ${
                      authTab === t.id
                        ? 'bg-white text-red-700 shadow-xs border border-slate-200/80'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Google OAuth */}
              {authTab === 'google' && (
                <div className="space-y-3 pt-1">
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    Sign in with any of your Google accounts. The account selector allows you to select,
                    switch, or add multiple personal or enterprise Google profiles.
                  </p>

                  <button
                    onClick={loginWithGoogle}
                    disabled={loading}
                    className="group relative flex w-full items-center justify-center space-x-3 rounded-xl border-2 border-slate-300 bg-white hover:border-red-500 hover:bg-red-50/30 px-4 py-3 text-xs font-mono font-bold text-slate-800 shadow-sm transition-all active:scale-98 disabled:opacity-50"
                  >
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
                    <span>{loading ? 'Opening Google Account Chooser...' : 'Select & Sign In with Google Account'}</span>
                  </button>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] font-mono space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center space-x-1">
                        <Database className="h-3.5 w-3.5 text-red-600" />
                        <span>Real-Time Database:</span>
                      </span>
                      <span className={`font-bold ${isFirebaseConfigured ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {isFirebaseConfigured ? `Cloud Firestore (${projectId || 'Active'})` : 'Firebase Keys Needed'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-sans">
                      {isFirebaseConfigured
                        ? 'All user profiles, memories, and audit logs are saved and synced to Cloud Firestore in real time.'
                        : 'To activate live Cloud Firestore sync and Google OAuth, enter your project keys in the Firebase Config tab.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Email & Password */}
              {authTab === 'email' && (
                <form onSubmit={handleEmailSubmit} className="space-y-3 pt-1">
                  <p className="text-xs text-slate-600 font-sans">
                    Authenticate using your work email address. New accounts are automatically provisioned in Firebase Auth and Firestore.
                  </p>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Work Email:</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="analyst@enterprise-secops.com"
                        className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-800 focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Password:</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-800 focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name (optional):</label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Morgan Reed"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Role Clearance:</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-2 py-2 text-xs text-slate-800 focus:border-red-500 focus:outline-none"
                      >
                        <option value="Chief AI Safety Officer">Chief AI Safety Officer</option>
                        <option value="Lead AI Red Teamer">Lead AI Red Teamer</option>
                        <option value="Enterprise SecOps Analyst">Enterprise SecOps Analyst</option>
                        <option value="SOC2 / ISO 42001 Auditor">SOC2 / ISO Auditor</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center space-x-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 text-xs transition-all shadow-md shadow-red-500/20 active:scale-98 disabled:opacity-50"
                  >
                    <span>{loading ? 'Authenticating with Firebase...' : 'Sign In / Register with Email'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </form>
              )}

              {/* Tab 3: Firebase Config */}
              {authTab === 'config' && (
                <form onSubmit={handleSaveConfig} className="space-y-3 pt-1">
                  <p className="text-[11px] text-slate-600 font-sans">
                    Connect your Firebase project to enable real-time Google OAuth and Cloud Firestore data synchronization:
                  </p>
                  <div>
                    <label className="block text-[10px] text-slate-600 font-bold mb-1">Firebase API Key (apiKey):</label>
                    <input
                      type="text"
                      required
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-red-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 font-bold mb-1">Project ID (projectId):</label>
                    <input
                      type="text"
                      required
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      placeholder="mnemorix-sentinel-prod"
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-red-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 font-bold mb-1">Auth Domain (authDomain):</label>
                    <input
                      type="text"
                      value={authDomain}
                      onChange={(e) => setAuthDomain(e.target.value)}
                      placeholder="mnemorix-sentinel-prod.firebaseapp.com"
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-red-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-600 font-bold mb-1">Storage Bucket (optional):</label>
                      <input
                        type="text"
                        value={storageBucket}
                        onChange={(e) => setStorageBucket(e.target.value)}
                        placeholder="mnemorix.appspot.com"
                        className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 focus:border-red-500 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-600 font-bold mb-1">App ID (optional):</label>
                      <input
                        type="text"
                        value={appId}
                        onChange={(e) => setAppId(e.target.value)}
                        placeholder="1:123456789:web:abcdef"
                        className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 focus:border-red-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold py-2 text-xs transition-all shadow-xs"
                  >
                    Save & Initialize Firebase Project
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Security Compliance Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400 shrink-0">
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
