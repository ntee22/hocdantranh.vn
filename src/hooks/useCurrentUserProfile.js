import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

/**
 * Custom hook to fetch and cache the current user's profile from Supabase
 * Combines session data with profile data from the profiles table
 */
const useCurrentUserProfile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async (sessionUser) => {
    if (!sessionUser) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 3000);
      });

      const queryPromise = supabase
        .from('profiles')
        .select('id, full_name, role, branch, created_at')
        .eq('id', sessionUser.id)
        .single();

      const { data: profileData, error: profileError } = await Promise.race([
        queryPromise,
        timeoutPromise
      ]);

      if (profileError) {
        // Profile doesn't exist or query failed
        if (profileError.code === 'PGRST116') {
          // No profile found, continue with user only
          setUser(sessionUser);
          setProfile(null);
          setError(null);
        } else {
          console.error('Profile query error:', profileError);
          setUser(sessionUser);
          setProfile(null);
          setError(profileError.message);
        }
      } else {
        setUser(sessionUser);
        setProfile(profileData);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      // Still set user even if profile fails
      setUser(sessionUser);
      setProfile(null);
      setError(err.message || 'Lỗi khi tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (session?.user) {
          await fetchProfile(session.user);
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading session:', err);
        if (mounted) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
        setError(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await fetchProfile(session.user);
    }
  };

  return {
    user,
    profile,
    loading,
    error,
    refetch,
    isTeacher: profile?.role === 'teacher',
    isSuperAdmin: profile?.role === 'superadmin',
    role: profile?.role || null,
    branch: profile?.branch || null,
    fullName: profile?.full_name || null,
  };
};

export default useCurrentUserProfile;
