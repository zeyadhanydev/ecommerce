import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { AuthError, Session, User as SupabaseUser } from '@supabase/supabase-js';
import { Profile } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  user: SupabaseUser | null;
  profile: Profile | null;
  login: (credentials: { email: string, password: string }) => Promise<{ error: AuthError | null }>;
  signUp: (credentials: { email: string, password: string, firstName: string, lastName: string }) => Promise<{ error: AuthError | null }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getInitialSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session?.user) {
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
            setProfile(profileData);
        }
        setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
            if (_event === 'SIGNED_IN') {
                toast.success('Logged in successfully!');
            }
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
            setProfile(profileData);
        } else {
            setProfile(null);
        }
        setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (credentials: { email: string, password: string }) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(credentials);
    if (error) {
        toast.error(error.message);
    }
    setLoading(false);
    return { error };
  };

  const signUp = async (credentials: { email: string, password: string, firstName: string, lastName: string }) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          first_name: credentials.firstName,
          last_name: credentials.lastName,
        }
      }
    });
     if (error) {
        toast.error(error.message);
    } else {
        toast.success('Success! Please check your email to confirm your account.');
    }
    setLoading(false);
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, profile, login, signUp, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
