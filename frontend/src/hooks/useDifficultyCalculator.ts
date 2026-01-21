import { useState, useEffect, useCallback } from 'react';
import { type BeatmapDifficulty, type ModifiedStats } from '../types/beatmap';
import { calculateDifficultyWithMods } from '../services/beatmapService';

export const useDifficultyCalculator = (
  selectedDifficulty: BeatmapDifficulty | null,
  selectedMods: string[]
) => {
  const [modifiedStats, setModifiedStats] = useState<ModifiedStats | null>(null);
  const [calculatingMods, setCalculatingMods] = useState(false);

  const calculateMods = useCallback(async () => {
    if (!selectedDifficulty) return;

    setCalculatingMods(true);
    try {
      const data = await calculateDifficultyWithMods(
        selectedDifficulty.id,
        selectedMods,
        selectedDifficulty.hit_length
      );
      setModifiedStats(data);
    } catch (err) {
      console.error('Difficulty calculation error:', err);
    } finally {
      setCalculatingMods(false);
    }
  }, [selectedDifficulty, selectedMods]);
  
  useEffect(() => {
    if (selectedDifficulty && selectedMods.length > 0 && !selectedMods.includes('NM')) {
      calculateMods();
    } else {
      setModifiedStats(null);
    }
  }, [calculateMods, selectedDifficulty, selectedMods]);

  return { modifiedStats, calculatingMods };
};