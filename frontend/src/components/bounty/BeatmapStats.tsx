import React from 'react';
import { type BeatmapDifficulty, type ModifiedStats } from '../../types/beatmap';
import { formatLength } from '../../utils/helpers';

interface BeatmapStatsProps {
  selectedDifficulty: BeatmapDifficulty;
  modifiedStats: ModifiedStats | null;
}

const BeatmapStats: React.FC<BeatmapStatsProps> = ({ selectedDifficulty, modifiedStats }) => {
  const displayStats = modifiedStats || {
    stars: selectedDifficulty.difficulty_rating,
    ar: selectedDifficulty.ar,
    cs: selectedDifficulty.cs,
    od: selectedDifficulty.accuracy,
    hp: selectedDifficulty.drain,
    bpm: selectedDifficulty.bpm,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
      <div className="bg-surface-dark rounded-lg p-4 text-center">
        <p className="text-text-muted text-sm mb-1">STARS</p>
        <p className="text-2xl font-bold text-accent-primary">{displayStats.stars.toFixed(2)}</p>
      </div>
      <div className="bg-surface-dark rounded-lg p-4 text-center">
        <p className="text-text-muted text-sm mb-1">CS</p>
        <p className="text-2xl font-bold text-text-inverse">{displayStats.cs.toFixed(1)}</p>
      </div>
      <div className="bg-surface-dark rounded-lg p-4 text-center">
        <p className="text-text-muted text-sm mb-1">AR</p>
        <p className="text-2xl font-bold text-text-inverse">{displayStats.ar.toFixed(1)}</p>
      </div>
      <div className="bg-surface-dark rounded-lg p-4 text-center">
        <p className="text-text-muted text-sm mb-1">OD</p>
        <p className="text-2xl font-bold text-text-inverse">{displayStats.od.toFixed(1)}</p>
      </div>
      <div className="bg-surface-dark rounded-lg p-4 text-center">
        <p className="text-text-muted text-sm mb-1">HP</p>
        <p className="text-2xl font-bold text-text-inverse">{displayStats.hp.toFixed(1)}</p>
      </div>
      <div className="bg-surface-dark rounded-lg p-4 text-center">
        <p className="text-text-muted text-sm mb-1">BPM</p>
        <p className="text-2xl font-bold text-text-inverse">{Math.round(displayStats.bpm)}</p>
      </div>
      <div className="bg-surface-dark rounded-lg p-4 text-center">
        <p className="text-text-muted text-sm mb-1">LENGTH</p>
        <p className="text-2xl font-bold text-text-inverse">
          {formatLength(modifiedStats?.length || selectedDifficulty.hit_length)}
        </p>
      </div>
    </div>
  );
};

export default BeatmapStats;