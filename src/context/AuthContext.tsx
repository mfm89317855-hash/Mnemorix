import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AuthUserProfile,
  signInWithGoogle,
  signInWithEmail,
  signOutUser,
  subscribeToAuth,
  isFirebaseConfigured,
} from '../lib/firebase';
import { soundClick, soundChainVerified, soundThreatAlert } from '../lib/sound';

interface AuthContextType {
  user: AuthUserProfile | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authError: string | null;
  clearAuthError: () => void;
  loginWithGoogle: () => Promise<boolean>;
  loginWithEmail: (email: string, password: string, displayName?: string, role?: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const configured = isFirebaseConfigured();

  const clearAuthError = useCallback(() => setAuthError(null), []);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<boolean> => {
    soundClick();
    setLoading(true);
    setAuthError(null);
    try {
      const profile = await signInWithGoogle();
      setUser(profile);
      soundChainVerified();
      setIsAuthModalOpen(false);
      return true;
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      // Clean, human-readable error messages for users
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in cancelled: The Google sign-in window was closed.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setAuthError('Unauthorized domain: Please add your app domain to Firebase Console > Authentication > Settings > Authorized Domains.');
      } else {
        setAuthError(err.message || 'Google sign-in encountered an issue.');
      }
      soundThreatAlert();
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithEmail = useCallback(
    async (email: string, password: string, displayName?: string, role?: string): Promise<boolean> => {
      soundClick();
      setLoading(true);
      setAuthError(null);
      try {
        const profile = await signInWithEmail(email, password, displayName, role);
        setUser(profile);
        soundChainVerified();
        setIsAuthModalOpen(false);
        return true;
      } catch (err: any) {
        console.error('Email Sign-in failed:', err);
        setAuthError(err.message || 'Authentication failed. Check your email and password.');
        soundThreatAlert();
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    soundClick();
    setLoading(true);
    setAuthError(null);
    try {
      await signOutUser();
      setUser(null);
      soundThreatAlert();
      setIsAuthModalOpen(false);
    } catch (err) {
      console.error('Sign-out failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseConfigured: configured,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authError,
        clearAuthError,
        loginWithGoogle,
        loginWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
