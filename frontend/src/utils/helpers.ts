export const formatLength = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const extractBeatmapSetId = (url: string): string | null => {
  const match = url.match(/\/beatmapsets\/(\d+)/);
  return match ? match[1] : null;
};