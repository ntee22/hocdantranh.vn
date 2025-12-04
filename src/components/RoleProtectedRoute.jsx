import React from 'react';
import { useNavigate } from 'react-router-dom';
import useCurrentUserProfile from '../hooks/useCurrentUserProfile';
import ProtectedRoute from './ProtectedRoute';
import './ProtectedRoute.css';

/**
 * Role-based protected route that checks both authentication and role
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string} props.requiredRole - Required role ('teacher' or 'superadmin')
 * @param {string} props.redirectTo - Route to redirect to if role doesn't match (default: '/teacher')
 */
const RoleProtectedRoute = ({ children, requiredRole, redirectTo = '/teacher' }) => {
  const { profile, loading, isSuperAdmin, isTeacher } = useCurrentUserProfile();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading) {
      if (!profile) {
        // No profile means not authenticated or no profile exists
        navigate(redirectTo);
        return;
      }

      const hasRequiredRole = 
        (requiredRole === 'superadmin' && isSuperAdmin) ||
        (requiredRole === 'teacher' && isTeacher);

      if (!hasRequiredRole) {
        navigate(redirectTo);
      }
    }
  }, [loading, profile, requiredRole, isSuperAdmin, isTeacher, navigate, redirectTo]);

  // Show loading while checking profile
  if (loading) {
    return (
      <div className="protected-route-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  // Check role
  if (profile) {
    const hasRequiredRole = 
      (requiredRole === 'superadmin' && isSuperAdmin) ||
      (requiredRole === 'teacher' && isTeacher);

    if (!hasRequiredRole) {
      return null; // Will redirect
    }
  }

  return <ProtectedRoute>{children}</ProtectedRoute>;
};

export default RoleProtectedRoute;
