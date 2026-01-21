import { API_URL } from '../utils/constants';
import { type BeatmapSet, type BeatmapDifficulty, type ModifiedStats } from '../types/beatmap';

export const fetchBeatmapSet = async (
  beatmapSetId: string,
  accessToken: string
): Promise<BeatmapSet> => {
  const response = await fetch(`${API_URL}/api/beatmapsets/${beatmapSetId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  const osuBeatmaps = data.beatmaps.filter((diff: BeatmapDifficulty) => diff.mode_int === 0);

  return {
    id: data.id,
    title: data.title,
    artist: data.artist,
    creator: data.creator,
    covers: {
      cover: data.covers.cover,
      'cover@2x': data.covers['cover@2x'],
    },
    beatmaps: osuBeatmaps,
  };
};

export const calculateDifficultyWithMods = async (
  beatmapId: number,
  mods: string[],
  hitLength: number
): Promise<ModifiedStats> => {
  const response = await fetch(`${API_URL}/api/calculate-difficulty`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      beatmapId,
      mods: mods.filter(m => m !== 'NM'),
      hitLength,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to calculate difficulty');
  }

  return response.json();
};