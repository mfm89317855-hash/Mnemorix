/**
 * MNEMORIX Sentinel — Live Firebase SDK & Google Authentication
 * Provides real-time Google OAuth (with multi-account selection),
 * Email/Password authentication, and real-time Cloud Firestore synchronization.
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
  onSnapshot,
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
  provider?: string;
}

const STORAGE_CUSTOM_CONFIG = 'mnemorix_firebase_config';

/**
 * Retrieve configuration from env or local storage
 */
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
  return Boolean(config.apiKey && config.apiKey.length > 5 && config.projectId);
}

export function saveCustomFirebaseConfig(config: Record<string, string>) {
  try {
    localStorage.setItem(STORAGE_CUSTOM_CONFIG, JSON.stringify(config));
    window.location.reload();
  } catch (err) {
    console.error('Failed to save Firebase config:', err);
  }
}

// ─── Firebase App & Client Instances ──────────────────────────────────────────

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
      console.error('Firebase initialization error:', err);
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
    } catch (err) {
      console.error('Firebase Auth initialization error:', err);
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
    } catch (err) {
      console.error('Firestore initialization error:', err);
      return null;
    }
  }
  return _db;
}

// ─── Authentication Handlers ──────────────────────────────────────────────────

/**
 * Sign In with Google OAuth (Multi-Account Support)
 * Always forces the Google account selection prompt (`prompt: 'select_account'`)
 * so users can choose between multiple Google accounts or add a new one.
 */
export async function signInWithGoogle(): Promise<AuthUserProfile> {
  const auth = getFirebaseAuth();
  if (!auth || !isFirebaseConfigured()) {
    throw new Error(
      'Firebase is not configured. Please enter your Firebase Project API keys in the settings tab.'
    );
  }

  const provider = new GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');

  // KEY CONFIGURATION: Prompt user to choose their Google account every time
  // Allows seamless switching between multiple personal/work Google accounts.
  provider.setCustomParameters({ prompt: 'select_account' });

  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const profile: AuthUserProfile = {
    uid: user.uid,
    displayName: user.displayName || user.email?.split('@')[0] || 'Enterprise SecOps Agent',
    email: user.email,
    photoURL: user.photoURL,
    organization: 'MNEMORIX Sovereign Defense',
    role: 'Chief AI Safety Officer',
    lastLogin: new Date().toISOString(),
    provider: 'google.com',
  };

  // Persist real user account into Firestore in real time
  await syncUserToFirestore(profile);
  return profile;
}

/**
 * Sign In or Register with Work Email & Password
 * Real authentication via Firebase Email/Password provider.
 */
export async function signInWithEmail(
  email: string,
  password: string,
  displayName?: string,
  role?: string
): Promise<AuthUserProfile> {
  const auth = getFirebaseAuth();
  if (!auth || !isFirebaseConfigured()) {
    throw new Error(
      'Firebase is not configured. Please enter your Firebase Project API keys in the settings tab.'
    );
  }

  let user: FirebaseUser;
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    user = cred.user;
  } catch (err: any) {
    // If account does not exist, automatically register new user
    if (
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/invalid-credential' ||
      err.code === 'auth/invalid-login-credentials'
    ) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        user = cred.user;
        if (displayName) {
          await updateProfile(user, { displayName });
        }
      } catch (innerErr: any) {
        throw new Error(innerErr.message || 'Failed to create Firebase user account');
      }
    } else {
      throw new Error(err.message || 'Failed to sign in with email/password');
    }
  }

  const profile: AuthUserProfile = {
    uid: user.uid,
    displayName: displayName || user.displayName || email.split('@')[0],
    email: user.email,
    photoURL: user.photoURL,
    organization: 'MNEMORIX Sovereign Defense',
    role: role || 'Enterprise SecOps Analyst',
    lastLogin: new Date().toISOString(),
    provider: 'password',
  };

  await syncUserToFirestore(profile);
  return profile;
}

/**
 * Signs out the active user from Firebase and clears authentication state
 */
export async function signOutUser(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth) {
    await fbSignOut(auth);
  }
}

/**
 * Watch Real-Time Auth State Changes
 * Strictly reports real authenticated user or null. No mock/demo fallback.
 */
export function subscribeToAuth(callback: (user: AuthUserProfile | null) => void): () => void {
  const auth = getFirebaseAuth();

  if (auth && isFirebaseConfigured()) {
    return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const profile: AuthUserProfile = {
          uid: fbUser.uid,
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Enterprise SecOps User',
          email: fbUser.email,
          photoURL: fbUser.photoURL,
          organization: 'MNEMORIX Sovereign Defense',
          role: 'Chief AI Safety Officer',
          lastLogin: new Date().toISOString(),
          provider: fbUser.providerData[0]?.providerId || 'firebase',
        };
        callback(profile);
      } else {
        callback(null);
      }
    });
  }

  // If Firebase not configured or auth not initialized, user is logged out
  callback(null);
  return () => {};
}

// ─── Real-Time Firestore Synchronization ──────────────────────────────────────

/**
 * Syncs user profile to Cloud Firestore `users/{uid}` in real time
 */
export async function syncUserToFirestore(user: AuthUserProfile): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) return;
  try {
    await setDoc(
      doc(db, 'users', user.uid),
      {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        organization: user.organization || 'MNEMORIX Sovereign Defense',
        role: user.role || 'Chief AI Safety Officer',
        lastLogin: user.lastLogin || new Date().toISOString(),
        provider: user.provider || 'firebase',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore user sync warning:', err);
  }
}

/**
 * Syncs memory item into Cloud Firestore `memories/{id}` in real time
 */
export async function syncMemoryToFirestore(memory: {
  id: string;
  agentId: string;
  agentName: string;
  partition: string;
  content: string;
  category?: string;
  status: string;
  hash: string;
  parentHash?: string;
  timestamp: string;
  piiRedacted?: boolean;
  confidenceScore?: number;
  tags?: string[];
  author?: string;
  vectorDriftDelta?: number;
}): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) return;
  try {
    await setDoc(
      doc(db, 'memories', memory.id),
      {
        ...memory,
        syncedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore memory sync warning:', err);
  }
}

/**
 * Syncs audit log event to Cloud Firestore `audit_logs/{id}` in real time
 */
export async function syncAuditToFirestore(auditData: {
  id?: string;
  action: string;
  source: string;
  targetId: string;
  status: string;
  details: string;
  hash?: string;
  timestamp?: string;
}): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) return;
  try {
    const docId = auditData.id || `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    await setDoc(
      doc(db, 'audit_logs', docId),
      {
        ...auditData,
        id: docId,
        createdAt: auditData.timestamp || new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore audit log sync warning:', err);
  }
}

/**
 * Syncs threat detection event to Cloud Firestore `threats/{id}` in real time
 */
export async function syncThreatToFirestore(threatData: {
  id?: string;
  agentId?: string;
  agentName?: string;
  type?: string;
  threatType?: string;
  severity?: string;
  title?: string;
  description?: string;
  status?: string;
  [key: string]: any;
}): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) return;
  try {
    const docId = threatData.id || `threat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    await setDoc(
      doc(db, 'threats', docId),
      {
        ...threatData,
        id: docId,
        detectedAt: threatData.detectedAt || new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore threat sync warning:', err);
  }
}

/**
 * Real-time listener for Firestore `memories` collection
 */
export function subscribeToFirestoreMemories(
  callback: (memories: any[]) => void
): () => void {
  const db = getFirebaseFirestore();
  if (!db) return () => {};

  try {
    const q = query(collection(db, 'memories'), orderBy('timestamp', 'desc'), limit(100));
    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (items.length > 0) callback(items);
      },
      (err) => console.warn('Firestore memories subscription warning:', err)
    );
  } catch {
    return () => {};
  }
}

/**
 * Real-time listener for Firestore `audit_logs` collection
 */
export function subscribeToFirestoreAuditLogs(
  callback: (logs: any[]) => void
): () => void {
  const db = getFirebaseFirestore();
  if (!db) return () => {};

  try {
    const q = query(collection(db, 'audit_logs'), orderBy('createdAt', 'desc'), limit(100));
    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (items.length > 0) callback(items);
      },
      (err) => console.warn('Firestore audit logs subscription warning:', err)
    );
  } catch {
    return () => {};
  }
}
