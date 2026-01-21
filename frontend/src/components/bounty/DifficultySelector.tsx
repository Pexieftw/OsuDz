import React from 'react';
import { type BeatmapSet, type BeatmapDifficulty } from '../../types/beatmap';

interface DifficultySelectorProps {
  beatmapData: BeatmapSet;
  selectedDifficulty: BeatmapDifficulty | null;
  onDifficultyChange: (difficulty: BeatmapDifficulty | null) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  beatmapData,
  selectedDifficulty,
  onDifficultyChange,
}) => {
  return (
    <div>
      <label className="block text-text-primary font-medium mb-2">SELECT DIFFICULTY</label>
      <select
        value={selectedDifficulty?.id || ''}
        onChange={(e) => {
          const diff = beatmapData.beatmaps.find(d => d.id === Number(e.target.value));
          onDifficultyChange(diff || null);
        }}
        className="w-full bg-surface-dark border border-border-base rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-secondary"
      >
        {beatmapData.beatmaps.map((diff) => (
          <option key={diff.id} value={diff.id}>
            {diff.version} - {diff.difficulty_rating.toFixed(2)}★
          </option>
        ))}
      </select>
    </div>
  );
};

export default DifficultySelector;