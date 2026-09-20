import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AuthUserProfile,
  signInWithGoogle,
  signInWithEmail,
  signInWithDemoRole,
  signOutUser,
  subscribeToAuth,
  isFirebaseConfigured,
  PRESET_SECOPS_USERS,
} from '../lib/firebase';
import { soundClick, soundChainVerified, soundThreatAlert } from '../lib/sound';

interface AuthContextType {
  user: AuthUserProfile | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string, displayName?: string, role?: string) => Promise<void>;
  loginWithRole: (roleUser: AuthUserProfile) => Promise<void>;
  logout: () => Promise<void>;
  presetUsers: AuthUserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const configured = isFirebaseConfigured();

  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    soundClick();
    setLoading(true);
    try {
      const profile = await signInWithGoogle();
      setUser(profile);
      soundChainVerified();
      setIsAuthModalOpen(false);
    } catch (err) {
      console.error('Google Sign-in failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithEmail = useCallback(
    async (email: string, password: string, displayName?: string, role?: string) => {
      soundClick();
      setLoading(true);
      try {
        const profile = await signInWithEmail(email, password, displayName, role);
        setUser(profile);
        soundChainVerified();
        setIsAuthModalOpen(false);
      } catch (err) {
        console.error('Email Sign-in failed:', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loginWithRole = useCallback(async (roleUser: AuthUserProfile) => {
    soundClick();
    setLoading(true);
    try {
      const profile = await signInWithDemoRole(roleUser);
      setUser(profile);
      soundChainVerified();
      setIsAuthModalOpen(false);
    } catch (err) {
      console.error('Role Sign-in failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    soundClick();
    setLoading(true);
    try {
      await signOutUser();
      setUser(null);
      soundThreatAlert(); // Sound feedback on sign out
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
        loginWithGoogle,
        loginWithEmail,
        loginWithRole,
        logout,
        presetUsers: PRESET_SECOPS_USERS,
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
