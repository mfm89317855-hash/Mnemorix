/**
 * MNEMORIX Sentinel — Firebase Client SDK & Google Authentication
 * Provides Firebase App, Google OAuth, and Cloud Firestore sync with seamless demo fallback.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  Firestore,
} from 'firebase/firestore';

export interface AuthUserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  organization?: string;
  role?: string;
  lastLogin?: string;
  isDemo?: boolean;
}

const STORAGE_CUSTOM_CONFIG = 'mnemorix_firebase_config';
const STORAGE_DEMO_USER = 'mnemorix_demo_user';

// Retrieve configuration from env or local storage
export function getFirebaseConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_CUSTOM_CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey && parsed.projectId) return parsed;
    }
  } catch {}

  const env = (import.meta as any).env || {};
  return {
    apiKey: env.VITE_FIREBASE_API_KEY || '',
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: env.VITE_FIREBASE_APP_ID || '',
  };
}

export function isFirebaseConfigured(): boolean {
  const config = getFirebaseConfig();
  return Boolean(config.apiKey && config.apiKey !== 'YOUR_API_KEY' && config.projectId);
}

export function saveCustomFirebaseConfig(config: Record<string, string>) {
  try {
    localStorage.setItem(STORAGE_CUSTOM_CONFIG, JSON.stringify(config));
    window.location.reload();
  } catch (err) {
    console.error('Failed to save Firebase config:', err);
  }
}

// Initialize Firebase instances
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (!_app) {
    const config = getFirebaseConfig();
    try {
      _app = getApps().length ? getApp() : initializeApp(config);
    } catch (err) {
      console.warn('Firebase initialization error, using demo mode:', err);
      return null;
    }
  }
  return _app;
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;
  if (!_auth) {
    try {
      _auth = getAuth(app);
    } catch {
      return null;
    }
  }
  return _auth;
}

export function getFirebaseFirestore(): Firestore | null {
  const app = getFirebaseApp();
  if (!app) return null;
  if (!_db) {
    try {
      _db = getFirestore(app);
    } catch {
      return null;
    }
  }
  return _db;
}

/**
 * Sign In with Google Provider via Popup
 * Falls back gracefully to Demo Google Profile if Firebase credentials are not yet injected.
 */
export async function signInWithGoogle(): Promise<AuthUserProfile> {
  const auth = getFirebaseAuth();

  if (auth && isFirebaseConfigured()) {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const profile: AuthUserProfile = {
        uid: user.uid,
        displayName: user.displayName || 'Enterprise SecOps Agent',
        email: user.email,
        photoURL: user.photoURL,
        organization: 'MNEMORIX Sovereign Defense',
        role: 'Chief AI Safety Officer',
        lastLogin: new Date().toISOString(),
        isDemo: false,
      };

      // Sync user profile to Firestore
      await syncUserToFirestore(profile);
      return profile;
    } catch (err: any) {
      console.warn('Firebase Google Auth popup failed or was cancelled:', err);
      // If error is due to missing configuration or origin restrictions, provide seamless demo fallback
      return getSimulatedDemoUser();
    }
  }

  // Demo Fallback Mode
  return getSimulatedDemoUser();
}

/**
 * Enterprise SecOps Pre-configured Roles for Instant Demo Access
 */
export const PRESET_SECOPS_USERS: AuthUserProfile[] = [
  {
    uid: 'secops-sarah-chen',
    displayName: 'Dr. Sarah Chen',
    email: 'sarah.chen@sentinel.defense.ai',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    organization: 'Sentinel Cyber Command',
    role: 'Lead AI Red Teamer & SecOps',
    lastLogin: new Date().toISOString(),
    isDemo: true,
  },
  {
    uid: 'secops-alex-mercer',
    displayName: 'Alex Mercer',
    email: 'alex.mercer@mnemorix.internal',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    organization: 'MNEMORIX Sovereign Defense',
    role: 'Chief AI Safety Officer (Level 4)',
    lastLogin: new Date().toISOString(),
    isDemo: true,
  },
  {
    uid: 'secops-marcus-vance',
    displayName: 'Marcus Vance',
    email: 'marcus.vance@audit.nist-soc2.org',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    organization: 'NIST AI RMF Audit Fleet',
    role: 'Lead Compliance Auditor',
    lastLogin: new Date().toISOString(),
    isDemo: true,
  },
];

/**
 * Sign In with a 1-click Preset SecOps Role
 */
export async function signInWithDemoRole(roleUser: AuthUserProfile): Promise<AuthUserProfile> {
  const profile: AuthUserProfile = {
    ...roleUser,
    lastLogin: new Date().toISOString(),
    isDemo: true,
  };
  try {
    localStorage.setItem(STORAGE_DEMO_USER, JSON.stringify(profile));
  } catch {}
  return profile;
}

/**
 * Sign In with Email & Password (with Firebase or local fallback)
 */
export async function signInWithEmail(
  email: string,
  password: string,
  displayName?: string,
  role?: string
): Promise<AuthUserProfile> {
  const auth = getFirebaseAuth();

  if (auth && isFirebaseConfigured()) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;
      const profile: AuthUserProfile = {
        uid: user.uid,
        displayName: user.displayName || displayName || email.split('@')[0],
        email: user.email,
        photoURL: user.photoURL,
        organization: 'MNEMORIX Sovereign Defense',
        role: role || 'Enterprise SecOps Analyst',
        lastLogin: new Date().toISOString(),
        isDemo: false,
      };
      await syncUserToFirestore(profile);
      return profile;
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          const cred = await createUserWithEmailAndPassword(auth, email, password);
          const user = cred.user;
          if (displayName) {
            await updateProfile(user, { displayName });
          }
          const profile: AuthUserProfile = {
            uid: user.uid,
            displayName: displayName || email.split('@')[0],
            email: user.email,
            photoURL: user.photoURL,
            organization: 'MNEMORIX Sovereign Defense',
            role: role || 'Enterprise SecOps Analyst',
            lastLogin: new Date().toISOString(),
            isDemo: false,
          };
          await syncUserToFirestore(profile);
          return profile;
        } catch (innerErr) {
          console.warn('Firebase email auth creation fallback:', innerErr);
        }
      }
    }
  }

  // Local Secure Session Fallback
  const cleanName =
    displayName ||
    email
      .split('@')[0]
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const profile: AuthUserProfile = {
    uid: `usr_${Math.random().toString(36).substring(2, 10)}`,
    displayName: cleanName,
    email,
    photoURL: null,
    organization: 'MNEMORIX Sovereign Defense',
    role: role || 'Enterprise SecOps Analyst',
    lastLogin: new Date().toISOString(),
    isDemo: true,
  };

  try {
    localStorage.setItem(STORAGE_DEMO_USER, JSON.stringify(profile));
  } catch {}

  return profile;
}

/**
 * Signs out active user
 */
export async function signOutUser(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth) {
    try {
      await fbSignOut(auth);
    } catch {}
  }
  try {
    localStorage.removeItem(STORAGE_DEMO_USER);
  } catch {}
}

/**
 * Watch Auth State Changes
 */
export function subscribeToAuth(callback: (user: AuthUserProfile | null) => void): () => void {
  const auth = getFirebaseAuth();

  if (auth && isFirebaseConfigured()) {
    return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        callback({
          uid: fbUser.uid,
          displayName: fbUser.displayName,
          email: fbUser.email,
          photoURL: fbUser.photoURL,
          organization: 'MNEMORIX Sovereign Defense',
          role: 'Chief AI Safety Officer',
          lastLogin: new Date().toISOString(),
          isDemo: false,
        });
      } else {
        // Check for persisted demo user
        const demo = getPersistedDemoUser();
        callback(demo);
      }
    });
  }

  // If Firebase not configured, check local demo session
  const demo = getPersistedDemoUser();
  callback(demo);
  return () => {};
}

// ─── Firestore Helpers ─────────────────────────────────────────────────────────

export async function syncUserToFirestore(user: AuthUserProfile): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) return;
  try {
    await setDoc(
      doc(db, 'users', user.uid),
      {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        organization: user.organization,
        role: user.role,
        lastLogin: user.lastLogin,
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore user sync warning:', err);
  }
}

export async function syncAuditToFirestore(auditData: {
  action: string;
  source: string;
  targetId: string;
  status: string;
  details: string;
  hash: string;
}): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) return;
  try {
    await addDoc(collection(db, 'audit_logs'), {
      ...auditData,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Firestore audit sync warning:', err);
  }
}

// ─── Demo User Helpers ─────────────────────────────────────────────────────────

function getSimulatedDemoUser(): AuthUserProfile {
  const demoUser: AuthUserProfile = {
    uid: 'demo-google-uid-8842',
    displayName: 'Dr. Sarah Chen',
    email: 'sarah.chen@enterprise-sentinel.ai',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    organization: 'Sentinel Cyber Command',
    role: 'Lead AI Red Teamer & SecOps',
    lastLogin: new Date().toISOString(),
    isDemo: true,
  };
  try {
    localStorage.setItem(STORAGE_DEMO_USER, JSON.stringify(demoUser));
  } catch {}
  return demoUser;
}

function getPersistedDemoUser(): AuthUserProfile | null {
  try {
    const saved = localStorage.getItem(STORAGE_DEMO_USER);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}
