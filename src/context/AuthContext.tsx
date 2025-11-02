import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential, User } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { auth } from '../lib/firebase';

WebBrowser.maybeCompleteAuthSession();

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
};

const Ctx = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const googleExtra = (Constants.expoConfig?.extra as any)?.google || {};
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: googleExtra.expoClientId || googleExtra.androidClientId || googleExtra.iosClientId
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    (async () => {
      if (response?.type === 'success') {
        const idToken = response.authentication?.idToken;
        if (idToken) {
          const credential = GoogleAuthProvider.credential(idToken);
          await signInWithCredential(auth, credential);
        }
      }
    })();
  }, [response]);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };
  const signup = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };
  const logout = async () => {
    await signOut(auth);
  };
  const loginWithGoogle = async () => {
    if (!request) throw new Error('Google auth request not ready');
    await promptAsync();
  };

  const value = useMemo<AuthContextValue>(() => ({ user, loading, login, signup, logout, loginWithGoogle }), [user, loading]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used within AuthProvider');
  return v;
};
