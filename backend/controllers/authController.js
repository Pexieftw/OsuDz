import fetch from 'node-fetch';
import { tokenCache } from '../utils/TokenCache.js';

export const getClientToken = async (req, res) => {
  try {
    if (tokenCache.isValid()) {
      return res.json({ access_token: tokenCache.get() });
    }

    const response = await fetch('https://osu.ppy.sh/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: parseInt(process.env.OSU_CLIENT_ID),
        client_secret: process.env.OSU_CLIENT_SECRET,
        grant_type: 'client_credentials',
        scope: 'public',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OAuth error:', error);
      return res.status(response.status).json({ error: 'Authentication failed' });
    }

    console.log('[.] Authentication successful!');

    const data = await response.json();
    tokenCache.set(data.access_token, data.expires_in);

    res.json({ access_token: data.access_token });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const exchangeCodeForToken = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code required' });
    }

    const response = await fetch('https://osu.ppy.sh/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: parseInt(process.env.OSU_CLIENT_ID),
        client_secret: process.env.OSU_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.OSU_REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Token exchange error:', error);
      return res.status(response.status).json({ error: 'Failed to exchange code for token' });
    }

    const tokenData = await response.json();
    
    const userResponse = await fetch('https://osu.ppy.sh/api/v2/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/json',
      },
    });

    if (!userResponse.ok) {
      return res.status(userResponse.status).json({ error: 'Failed to fetch user data' });
    }

    const userData = await userResponse.json();

    console.log('[.] User authenticated:', userData.username);

    res.json({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      user: {
        id: userData.id,
        username: userData.username,
        avatar_url: userData.avatar_url,
        country_code: userData.country_code,
        cover_url: userData.cover_url,
      },
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const refreshUserToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    const response = await fetch('https://osu.ppy.sh/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: parseInt(process.env.OSU_CLIENT_ID),
        client_secret: process.env.OSU_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
      }),
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to refresh token' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const response = await fetch('https://osu.ppy.sh/api/v2/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Unauthorized' });
    }

    const userData = await response.json();
    res.json({
      id: userData.id,
      username: userData.username,
      avatar_url: userData.avatar_url,
      country_code: userData.country_code,
      cover_url: userData.cover_url,
    });
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};