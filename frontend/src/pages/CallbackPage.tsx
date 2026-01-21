import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const CallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const errorParam = params.get('error');

      if (errorParam) {
        setError(`Authorization failed: ${errorParam}`);
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      if (!code) {
        setError('No authorization code received');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error('Failed to exchange authorization code');
        }

        const data = await response.json();

        // Store tokens and user data
        const expiryTime = Date.now() + (data.expires_in * 1000);
        localStorage.setItem('osu_access_token', data.access_token);
        localStorage.setItem('osu_refresh_token', data.refresh_token);
        localStorage.setItem('osu_token_expiry', expiryTime.toString());
        localStorage.setItem('osu_user', JSON.stringify(data.user));

        // Redirect to home
        navigate('/');
        window.location.reload();
      } catch (err) {
        console.error('Callback error:', err);
        setError('Authentication failed. Please try again.');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <h1 className="text-2xl font-bold text-error mb-2">{error}</h1>
            <p className="text-text-secondary">Redirecting back...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-accent-primary mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-text-inverse mb-2">Authenticating...</h1>
            <p className="text-text-secondary">Please wait while we log you in</p>
          </>
        )}
      </div>
    </div>
  );
};

export default CallbackPage;