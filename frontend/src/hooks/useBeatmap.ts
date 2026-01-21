import { useState, useEffect } from 'react';
import { type BeatmapSet, type BeatmapDifficulty } from '../types/beatmap';
import { fetchBeatmapSet } from '../services/beatmapService';
import { extractBeatmapSetId } from '../utils/helpers';
import { getAccessToken } from '../services/authService';

export const useBeatmap = (beatmapUrl: string) => {
  const [beatmapData, setBeatmapData] = useState<BeatmapSet | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<BeatmapDifficulty | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string>('');

  // Get access token on mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getAccessToken();
        setAccessToken(token);
        setAuthError('');
      } catch (err) {
        setAuthError(
          err instanceof Error
            ? `Auth failed: ${err.message}`
            : 'Failed to authenticate. Is the backend server running?'
        );
      }
    };

    fetchToken();
  }, []);

  // Clear beatmap when URL is deleted
  useEffect(() => {
    if (!beatmapUrl.trim()) {
      setBeatmapData(null);
      setSelectedDifficulty(null);
    }
  }, [beatmapUrl]);

  const fetchBeatmap = async () => {
    const beatmapSetId = extractBeatmapSetId(beatmapUrl);

    if (!beatmapSetId) {
      setError('Invalid beatmap URL. Please use format: https://osu.ppy.sh/beatmapsets/[id]');
      return;
    }

    if (!accessToken) {
      setError('Not authenticated. Please wait for authentication to complete.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await fetchBeatmapSet(beatmapSetId, accessToken);
      setBeatmapData(data);
      
      if (data.beatmaps && data.beatmaps.length > 0) {
        setSelectedDifficulty(data.beatmaps[0]);
      } else {
        setError('No osu! standard difficulties found in this beatmapset.');
      }
    } catch (err) {
      setError('Failed to fetch beatmap data. Please check the URL and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    beatmapData,
    selectedDifficulty,
    setSelectedDifficulty,
    loading,
    error,
    authError,
    fetchBeatmap,
  };
};