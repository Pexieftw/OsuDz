export interface BeatmapDifficulty {
  id: number;
  version: string;
  difficulty_rating: number;
  ar: number;
  cs: number;
  accuracy: number;
  drain: number;
  bpm: number;
  hit_length: number;
  mode_int: number;
}

export interface BeatmapSet {
  id: number;
  title: string;
  artist: string;
  creator: string;
  covers: {
    cover: string;
    'cover@2x': string;
  };
  beatmaps: BeatmapDifficulty[];
}

export interface ModifiedStats {
  stars: number;
  ar: number;
  cs: number;
  od: number;
  hp: number;
  bpm: number;
  length: number;
}

export interface OsuMod {
  value: string;
  label: string;
  description: string;
  incompatible: string[];
}