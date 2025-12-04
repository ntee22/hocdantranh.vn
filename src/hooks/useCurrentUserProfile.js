import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

/**
 * Custom hook to fetch and cache the current user's profile from Supabase
 * Combines session data with profile data from the profiles table
 * 
 * @returns {Object} { user, profile, loading, error, refetch }
 *   - user: The Supabase auth user object
 *   - profile: The profile data from profiles table (includes role, branch, full_name)
 *   - loading: Boolean indicating if data is being fetched
 *   - error: Error message if any
 *   - refetch: Function to manually refetch the profile
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

      // Query the profiles table using the user's id
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single();

      if (profileError) {
        // If profile doesn't exist, that's okay - user might not have a profile yet
        if (profileError.code === 'PGRST116') {
          setUser(sessionUser);
          setProfile(null);
          setError(null);
        } else {
          throw profileError;
        }
      } else {
        setUser(sessionUser);
        setProfile(profileData);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Lỗi khi tải thông tin người dùng');
      setUser(sessionUser);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    const getInitialSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          setError(sessionError.message);
          setLoading(false);
          return;
        }

        if (session?.user) {
          await fetchProfile(session.user);
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error in getInitialSession:', err);
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
        setError(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const refetch = async () => {
    if (user) {
      await fetchProfile(user);
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfile(session.user);
      }
    }
  };

  return {
    user,
    profile,
    loading,
    error,
    refetch,
    // Convenience properties
    isTeacher: profile?.role === 'teacher',
    isSuperAdmin: profile?.role === 'superadmin',
    role: profile?.role || null,
    branch: profile?.branch || null,
    fullName: profile?.full_name || null,
  };
};

export default useCurrentUserProfile;
