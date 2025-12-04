import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const resolvedRef = useRef(false);

  useEffect(() => {
    // Reset resolvedRef when component mounts (new route)
    resolvedRef.current = false;

    let mounted = true;
    let timeout = null;
    let subscription = null;

    const updateAuthState = (hasSession) => {
      if (!mounted || resolvedRef.current) return;

      // Mark as resolved and update state
      resolvedRef.current = true;
      if (timeout) clearTimeout(timeout);

      setIsAuthenticated(hasSession);
      setLoading(false);

      if (!hasSession && window.location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
    };

    // Set up auth state change listener - this handles auth state changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      console.log('ProtectedRoute: Auth state change:', event, 'hasSession:', !!session);
      updateAuthState(!!session);
    });
    subscription = authSubscription;

    // Initial session check - this handles the case when user is already logged in
    const checkInitialSession = async () => {
      if (!mounted || resolvedRef.current) return;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('ProtectedRoute: Initial session check, hasSession:', !!session);
        if (mounted && !resolvedRef.current) {
          updateAuthState(!!session);
        }
      } catch (err) {
        console.error('Error checking initial session:', err);
        if (mounted && !resolvedRef.current) {
          updateAuthState(false);
        }
      }
    };

    checkInitialSession();

    // Fallback: If neither auth listener nor initial check resolves within 3 seconds
    timeout = setTimeout(() => {
      if (mounted && !resolvedRef.current) {
        console.warn('ProtectedRoute: Timeout, forcing session check');
        checkInitialSession();
      }
    }, 3000);

    return () => {
      mounted = false;
      if (timeout) clearTimeout(timeout);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="protected-route-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Đang kiểm tra xác thực...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to /login
  }

  return <>{children}</>;
};

export default ProtectedRoute;
