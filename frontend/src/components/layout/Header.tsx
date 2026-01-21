import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from 'react-router-dom';
import UserProfile from '../auth/UserProfile';
import LoginButton from '../auth/LoginButton';

const Header: React.FC = () => {
  const { user, login, logout, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const navLinkClass = (path: string) => {
    return `font-medium text-base whitespace-nowrap transition-colors ${
      isActivePath(path)
        ? 'text-accent-primary font-semibold'
        : 'text-text-secondary hover:text-text-inverse'
    }`;
  };

  return (
    <header className="bg-surface-dark border-b border-border-base w-full">
      <div className="max-w-350 mx-auto">
        <nav className="h-20 flex items-center justify-center relative px-6">
          <a href="/" className="absolute left-6 text-2xl font-bold text-text-inverse hover:text-accent-primary transition-colors">
            osu-dz
          </a>

          <div className="flex items-center gap-12">
            <a href="/bounties" className={navLinkClass('/bounties')}>
              Submit Bounties
            </a>
            <a href="/mappool" className={navLinkClass('/mappool')}>
              Mappool Suggestions
            </a>
            <a href="/vote" className={navLinkClass('/vote')}>
              Vote & Browse
            </a>
            
            {/* Admin Link - Only show if user is admin */}
            {isAuthenticated && 'admin'=== 'admin' && (
              <a href="/admin" className={navLinkClass('/admin')}>
                Admin
              </a>
            )}
          </div>

          <div className="absolute right-6">
            {loading ? (
              <div className="animate-pulse bg-surface-light rounded-lg h-11 w-36"></div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <UserProfile user={user} />
                <button
                  onClick={logout}
                  className="bg-surface-light hover:bg-error/20 text-text-secondary hover:text-error border border-border-base hover:border-error/40 px-4 py-2.5 rounded-lg font-medium text-sm transition-all h-11"
                >
                  Logout
                </button>
              </div>
            ) : (
              <LoginButton onClick={login} />
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;