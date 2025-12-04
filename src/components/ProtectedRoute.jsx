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
    let timeouts = [];
    let subscription = null;

    const clearAllTimeouts = () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
      timeouts = [];
    };

    const updateAuthState = (hasSession) => {
      if (!mounted) return;
      
      // Always clear loading and update state
      resolvedRef.current = true;
      clearAllTimeouts();
      
      setIsAuthenticated(hasSession);
      setLoading(false);
      
      if (!hasSession && window.location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
    };

    // Direct session check
    const checkSession = async () => {
      if (!mounted || resolvedRef.current) return;
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          console.error('Error checking session:', error);
          updateAuthState(false);
        } else {
          updateAuthState(!!session);
        }
      } catch (err) {
        console.error('Error in checkSession:', err);
        if (mounted && !resolvedRef.current) {
          updateAuthState(false);
        }
      }
    };

    // Set up auth state change listener FIRST - this is the primary way
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      
      const hasSession = !!session;
      updateAuthState(hasSession);
    });
    subscription = authSubscription;

    // Initial check
    checkSession();

    // Fallback: Force resolve after 2 seconds maximum
    const timeout = setTimeout(() => {
      if (mounted && !resolvedRef.current) {
        console.warn('ProtectedRoute: Force resolving after timeout');
        checkSession();
      }
    }, 2000);
    timeouts.push(timeout);

    return () => {
      mounted = false;
      clearAllTimeouts();
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
