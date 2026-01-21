import React from 'react';
import { type BeatmapSet } from '../../types/beatmap';

interface BeatmapCardProps {
  beatmap: BeatmapSet;
}

const BeatmapCard: React.FC<BeatmapCardProps> = ({ beatmap }) => {
  return (
    <div className="relative h-48 rounded-lg overflow-hidden">
      <img
        src={beatmap.covers['cover@2x']}
        alt={beatmap.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent flex items-end p-6">
        <div>
          <h3 className="text-2xl font-bold text-text-inverse">{beatmap.title}</h3>
          <p className="text-text-secondary">
            {beatmap.artist} • mapped by {beatmap.creator}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BeatmapCard;