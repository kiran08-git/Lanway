import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session) {
          setUser(session.user);
          const userRole = session.user.user_metadata?.role || 'student';
          setRole(userRole);
          // Load user profile
          const existingProfile = await loadProfile(session.user.id, userRole);
          if (!existingProfile && session.user.email_confirmed_at) {
            await createProfileFromUser(session.user, userRole);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user);
        const userRole = session.user.user_metadata?.role || 'student';
        setRole(userRole);
        const existingProfile = await loadProfile(session.user.id, userRole);
        if (!existingProfile && session.user.email_confirmed_at) {
          await createProfileFromUser(session.user, userRole);
        }
      } else {
        setUser(null);
        setProfile(null);
        setRole('student');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId, userRole = 'student') => {
    try {
      const table = userRole === 'recruiter' ? 'company_profiles' : 'student_profiles';
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      setProfile(data || null);
      return data || null;
    } catch (err) {
      console.error('Profile load error:', err);
      setProfile(null);
      return null;
    }
  };

  const createProfileFromUser = async (authUser, userRole) => {
    return createProfile(
      authUser.id,
      authUser.user_metadata?.full_name || authUser.email,
      authUser.email,
      userRole,
      authUser.user_metadata?.company_name || ''
    );
  };

  const signup = async (email, password, name, signupRole = 'student', companyName = '') => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: signupRole,
            full_name: name,
            company_name: companyName,
          },
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });

      if (error) throw error;
      
      if (data.user) {
        if (data.session) {
          setUser(data.user);
          setRole(signupRole);
        }
        // With email confirmation enabled there is no session yet, so create the profile after login.
        if (data.session) {
          await createProfile(data.user.id, name, email, signupRole, companyName);
        }
      }
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user && !data.user.email_confirmed_at) {
        await supabase.auth.signOut();
        throw new Error('Please verify your email address before logging in.');
      }
      
      if (data.user) {
        setUser(data.user);
        const userRole = data.user.user_metadata?.role || 'student';
        setRole(userRole);
        const existingProfile = await loadProfile(data.user.id, userRole);
        if (!existingProfile) {
          await createProfileFromUser(data.user, userRole);
        }
      }
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const createProfile = async (userId, name, email, userRole = 'student', companyName = '') => {
    try {
      if (userRole === 'recruiter') {
        const { data, error } = await supabase
          .from('company_profiles')
          .upsert({
            id: userId,
            recruiter_name: name,
            company_name: companyName || name,
            created_at: new Date().toISOString(),
          }, { onConflict: 'id' })
          .select()
          .single();
        if (error) throw error;
        setProfile(data);
        return data;
      } else {
        const { data, error } = await supabase
          .from('student_profiles')
          .upsert({
            id: userId,
            name,
            email,
            created_at: new Date().toISOString(),
          }, { onConflict: 'id' })
          .select()
          .single();
        if (error) throw error;
        setProfile(data);
        return data;
      }
    } catch (err) {
      console.error('Profile creation error:', err);
      throw err;
    }
  };

  const updateProfile = async (updates) => {
    try {
      setError(null);
      if (!user) throw new Error('No user logged in');

      const table = role === 'recruiter' ? 'company_profiles' : 'student_profiles';
      const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isRecruiter: role === 'recruiter',
        isEmailVerified: Boolean(user?.email_confirmed_at),
        isEmailVerified: Boolean(user?.email_confirmed_at),
        loading,
        error,
        signup,
        login,
        logout,
        updateProfile,
        loadProfile,
        resendVerificationEmail: (email) => supabase.auth.resend({
          type: 'signup',
          email,
          options: { emailRedirectTo: `${window.location.origin}/verify-email` },
        }),
        resendVerificationEmail: (email) => supabase.auth.resend({
          type: 'signup',
          email,
          options: { emailRedirectTo: `${window.location.origin}/verify-email` },
        }),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
