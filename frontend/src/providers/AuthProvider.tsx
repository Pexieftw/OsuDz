import React, { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from '../contexts/auth';
import type { User, AuthContextType } from '../contexts/auth';

const API_URL = import.meta.env.VITE_API_URL;
const CLIENT_ID = import.meta.env.VITE_OSU_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('osu_access_token');
    localStorage.removeItem('osu_refresh_token');
    localStorage.removeItem('osu_token_expiry');
    localStorage.removeItem('osu_user');
    setUser(null);
    setAccessToken(null);
  }, []);

  const fetchUserInfo = useCallback(async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('osu_user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  }, []);

  const refreshAccessToken = useCallback(async (refreshToken: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        const expiryTime = Date.now() + (data.expires_in * 1000);
        
        localStorage.setItem('osu_access_token', data.access_token);
        localStorage.setItem('osu_refresh_token', data.refresh_token);
        localStorage.setItem('osu_token_expiry', expiryTime.toString());
        
        setAccessToken(data.access_token);
        await fetchUserInfo(data.access_token);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  }, [logout, fetchUserInfo]);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('osu_access_token');
      const storedUser = localStorage.getItem('osu_user');
      const tokenExpiry = localStorage.getItem('osu_token_expiry');

      if (storedToken && storedUser && tokenExpiry) {
        const expiryTime = parseInt(tokenExpiry);
        
        if (Date.now() < expiryTime) {
          setAccessToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          const refreshToken = localStorage.getItem('osu_refresh_token');
          if (refreshToken) {
            await refreshAccessToken(refreshToken);
          } else {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [refreshAccessToken, logout]);

  const login = useCallback(() => {
    const authUrl = `https://osu.ppy.sh/oauth/authorize?` +
      `response_type=code&` +
      `client_id=${CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `scope=public identify`;
    
    window.location.href = authUrl;
  }, []);

  const value: AuthContextType = {
    user,
    accessToken,
    loading,
    login,
    logout,
    isAuthenticated: !!user && !!accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};