import fetch from 'node-fetch';
import { Beatmap, Difficulty } from 'rosu-pp-js';
import { calculateModdedStats } from '../utils/modCalculations.js';

export const getBeatmapset = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const response = await fetch(
      `https://osu.ppy.sh/api/v2/beatmapsets/${req.params.id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Beatmap fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const calculateDifficulty = async (req, res) => {
  try {
    const { beatmapId, mods, hitLength } = req.body; 
    
    console.log('[DEBUG] Request received:', { beatmapId, mods, hitLength });
    
    if (!beatmapId) {
      return res.status(400).json({ error: 'beatmapId required' });
    }

    const osuFileResponse = await fetch(`https://osu.ppy.sh/osu/${beatmapId}`);
    if (!osuFileResponse.ok) {
      return res.status(404).json({ error: 'Beatmap file not found' });
    }

    const osuFileContent = await osuFileResponse.text();
    const map = new Beatmap(osuFileContent);
    const difficulty = new Difficulty({ mods: mods || [] });
    const attrs = difficulty.calculate(map);

    console.log('[DEBUG] Raw attrs from rosu-pp:', attrs);

    const modArray = Array.isArray(mods) ? mods : [];
    const { clockRate, cs, od, length } = calculateModdedStats(
      map, 
      attrs, 
      modArray, 
      hitLength
    );

    const responseData = {
      stars: attrs.stars,
      ar: attrs.ar,
      cs,
      hp: attrs.hp || map.hp,
      od,
      bpm: map.bpm * clockRate,
      length,
    };

    console.log('[DEBUG] Response data being sent:', responseData);
    
    res.json(responseData);
  } catch (error) {
    console.error('Difficulty calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate difficulty' });
  }
};