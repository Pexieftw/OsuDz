import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminOnly = false }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Modify this with admin logic in backend later
  if (adminOnly && 'admin' !== 'admin') {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-error mb-4">Access Denied</h1>
          <p className="text-text-secondary mb-6">You don't have permission to access this page.</p>
          <a href="/" className="text-accent-primary hover:text-accent-secondary underline">
            Go back home
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;