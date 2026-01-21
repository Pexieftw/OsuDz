import React from 'react';

interface BountyFormProps {
  beatmapUrl: string;
  setBeatmapUrl: (url: string) => void;
  challenge: string;
  setChallenge: (challenge: string) => void;
  onFetch: () => void;
  loading: boolean;
  error: string;
  canFetch: boolean;
}

const BountyForm: React.FC<BountyFormProps> = ({
  beatmapUrl,
  setBeatmapUrl,
  challenge,
  setChallenge,
  onFetch,
  loading,
  error,
  canFetch,
}) => {
  return (
    <div className="bg-surface-base border border-border-base rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold text-accent-primary mb-4">Your Input</h2>

      <div>
        <label className="block text-text-primary font-medium mb-2">BEATMAP URL</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={beatmapUrl}
            onChange={(e) => setBeatmapUrl(e.target.value)}
            placeholder="https://osu.ppy.sh/beatmapsets/..."
            className="flex-1 bg-surface-dark border border-border-base rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
          />
          <button
            type="button"
            onClick={onFetch}
            disabled={loading || !beatmapUrl || !canFetch}
            className="bg-accent-secondary hover:bg-accent-secondary/80 text-text-inverse px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Fetch'}
          </button>
        </div>
        {error && <p className="text-error text-sm mt-2">{error}</p>}
      </div>

      <div>
        <label className="block text-text-primary font-medium mb-2">CHALLENGE</label>
        <input
          type="text"
          value={challenge}
          onChange={(e) => setChallenge(e.target.value)}
          placeholder="e.g. FC, #1 Algeria, Best Acc"
          className="w-full bg-surface-dark border border-border-base rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
        />
      </div>
    </div>
  );
};

export default BountyForm;