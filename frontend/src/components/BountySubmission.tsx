import React, { useState, useEffect, useCallback } from 'react';

interface BeatmapDifficulty {
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

interface BeatmapSet {
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

interface ModifiedStats {
  stars: number;
  ar: number;
  cs: number;
  od: number;
  hp: number;
  bpm: number;
  length: number;
}

const OSU_MODS = [
  { value: 'NM', label: 'NoMod', description: 'No modifications', incompatible: [] },
  { value: 'EZ', label: 'Easy', description: 'Reduces difficulty', incompatible: ['HR'] },
  { value: 'NF', label: 'No Fail', description: "You can't fail", incompatible: ['SD', 'PF'] },
  { value: 'HT', label: 'Half Time', description: 'Slower gameplay', incompatible: ['DT', 'NC'] },
  { value: 'HR', label: 'Hard Rock', description: 'Everything just got harder', incompatible: ['EZ'] },
  { value: 'SD', label: 'Sudden Death', description: 'Miss and fail', incompatible: ['NF', 'PF'] },
  { value: 'PF', label: 'Perfect', description: 'SS or quit', incompatible: ['NF', 'SD'] },
  { value: 'DT', label: 'Double Time', description: 'Faster gameplay', incompatible: ['HT', 'NC'] },
  { value: 'NC', label: 'Nightcore', description: 'Pitch-shifted DT', incompatible: ['HT', 'DT'] },
  { value: 'HD', label: 'Hidden', description: 'Circles fade out', incompatible: [] },
  { value: 'FL', label: 'Flashlight', description: 'Restricted view', incompatible: [] },
  { value: 'SO', label: 'Spun Out', description: 'Auto-spin', incompatible: [] },
];

const BountySubmission: React.FC = () => {
  const [beatmapUrl, setBeatmapUrl] = useState('');
  const [challenge, setChallenge] = useState('');
  const [beatmapData, setBeatmapData] = useState<BeatmapSet | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<BeatmapDifficulty | null>(null);
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  const [modifiedStats, setModifiedStats] = useState<ModifiedStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [calculatingMods, setCalculatingMods] = useState(false);
  const [error, setError] = useState('');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string>('');

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/token`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Authentication failed');
        }

        const data = await response.json();
        setAccessToken(data.access_token);
        setAuthError('');
      } catch (err) {
        setAuthError(
          err instanceof Error 
            ? `Auth failed: ${err.message}` 
            : 'Failed to authenticate. Is the backend server running?'
        );
      }
    };

    getAccessToken();
  }, [API_URL]);

  // Clear beatmap when URL is deleted
  useEffect(() => {
    if (!beatmapUrl.trim()) {
      setBeatmapData(null);
      setSelectedDifficulty(null);
      setModifiedStats(null);
      setSelectedMods([]);
    }
  }, [beatmapUrl]);


  const calculateDifficultyWithMods = useCallback(async () => {
    if (!selectedDifficulty) return;

    setCalculatingMods(true);
    try {
      const response = await fetch(`${API_URL}/api/calculate-difficulty`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          beatmapId: selectedDifficulty.id,
          mods: selectedMods.filter(m => m !== 'NM'),
          hitLength: selectedDifficulty.hit_length,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate difficulty');
      }

      const data = await response.json();
      setModifiedStats(data);
    } catch (err) {
      console.error('Difficulty calculation error:', err);
    } finally {
      setCalculatingMods(false);
    }
  }, [selectedDifficulty, selectedMods, API_URL]); 

  // Recalculate difficulty when mods or difficulty changes
  useEffect(() => {
    if (selectedDifficulty && selectedMods.length > 0 && !selectedMods.includes('NM')) {
      calculateDifficultyWithMods();
    } else {
      setModifiedStats(null);
    }
  }, [calculateDifficultyWithMods, selectedDifficulty, selectedMods]);

  const extractBeatmapSetId = (url: string): string | null => {
    const match = url.match(/\/beatmapsets\/(\d+)/);
    return match ? match[1] : null;
  };


  const fetchBeatmapData = async () => {
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

      const transformedData: BeatmapSet = {
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

      setBeatmapData(transformedData);
      if (transformedData.beatmaps && transformedData.beatmaps.length > 0) {
        setSelectedDifficulty(transformedData.beatmaps[0]);
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

  const toggleMod = (modValue: string) => {
    setSelectedMods(prev => {
      if (modValue === 'NM') {
        return [];
      }
      
      // Get incompatible mods for the selected mod
      const mod = OSU_MODS.find(m => m.value === modValue);
      const incompatibleMods = mod?.incompatible || [];
      
      // Remove NM and any incompatible mods
      let filtered = prev.filter(m => m !== 'NM' && !incompatibleMods.includes(m));
      
      // Toggle the mod
      if (filtered.includes(modValue)) {
        const newMods = filtered.filter(m => m !== modValue);
        return newMods.length === 0 ? [] : newMods;
      }
      
      // Remove any mods that are incompatible with the newly selected mod
      filtered = filtered.filter(m => {
        const existingMod = OSU_MODS.find(mod => mod.value === m);
        return !existingMod?.incompatible.includes(modValue);
      });
      
      return [...filtered, modValue];
    });
  };

  const isModDisabled = (modValue: string): boolean => {
    if (modValue === 'NM') return selectedMods.length > 0 && !selectedMods.includes('NM');
    if (selectedMods.length === 0 || selectedMods.includes('NM')) return false;
    
    const mod = OSU_MODS.find(m => m.value === modValue);
    if (!mod) return false;
    
    return selectedMods.some(selectedMod => mod.incompatible.includes(selectedMod));
  };

  const handleSubmit = () => {
    const modsToSubmit = selectedMods.length === 0 ? ['NM'] : selectedMods;
    console.log('Submitting bounty:', {
      beatmapUrl,
      challenge,
      difficulty: selectedDifficulty,
      mods: modsToSubmit,
      modifiedStats,
    });
    alert('Bounty submitted! (This is a demo - check console for details)');
  };

  const formatLength = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const displayStats = modifiedStats || (selectedDifficulty ? {
    stars: selectedDifficulty.difficulty_rating,
    ar: selectedDifficulty.ar,
    cs: selectedDifficulty.cs,
    od: selectedDifficulty.accuracy,
    hp: selectedDifficulty.drain,
    bpm: selectedDifficulty.bpm,
  } : null);

  return (
    <div className="min-h-screen bg-background-primary py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-text-inverse mb-4">Bounties Submission</h1>
          <p className="text-text-secondary text-lg">Submit a Beatmap for The Next Challenge</p>
        </div>

        {authError && (
          <div className="bg-error/20 border border-error rounded-lg p-4 mb-6">
            <p className="text-text-inverse font-semibold mb-2">Authentication Error</p>
            <p className="text-text-secondary text-sm mb-3">{authError}</p>
            <div className="text-text-secondary text-sm space-y-1">
              <p className="font-semibold text-text-primary">Make sure:</p>
              <p>1. Backend server is running: <code className="bg-surface-dark px-2 py-1 rounded">npm start</code></p>
              <p>2. Your .env file has OSU_CLIENT_ID and OSU_CLIENT_SECRET</p>
              <p>3. Backend is accessible at {API_URL}</p>
            </div>
          </div>
        )}

        <div className="space-y-8">
          <div className="bg-surface-base border border-border-base rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-accent-primary mb-4">Your Input</h2>
            
            <div>
              <label className="block text-text-primary font-medium mb-2">
                BEATMAP URL
              </label>
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
                  onClick={fetchBeatmapData}
                  disabled={loading || !beatmapUrl || !accessToken}
                  className="bg-accent-secondary hover:bg-accent-secondary/80 text-text-inverse px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Fetch'}
                </button>
              </div>
              {error && <p className="text-error text-sm mt-2">{error}</p>}
            </div>

            <div>
              <label className="block text-text-primary font-medium mb-2">
                CHALLENGE
              </label>
              <input
                type="text"
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                placeholder="e.g. FC, #1 Algeria, Best Acc"
                className="w-full bg-surface-dark border border-border-base rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
              />
            </div>
          </div>

          {beatmapData && (
            <div className="bg-surface-light border border-border-strong rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold text-accent-secondary mb-4">Beatmap Information</h2>
              
              <div className="relative h-48 rounded-lg overflow-hidden">
                <img
                  src={beatmapData.covers['cover@2x']}
                  alt={beatmapData.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-2xl font-bold text-text-inverse">{beatmapData.title}</h3>
                    <p className="text-text-secondary">{beatmapData.artist} • mapped by {beatmapData.creator}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-primary font-medium mb-2">
                    SELECT DIFFICULTY
                  </label>
                  <select
                    value={selectedDifficulty?.id || ''}
                    onChange={(e) => {
                      const diff = beatmapData.beatmaps.find(d => d.id === Number(e.target.value));
                      setSelectedDifficulty(diff || null);
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

                <div>
                  <label className="block text-text-primary font-medium mb-2">
                    MOD COMBINATION {calculatingMods && <span className="text-text-muted text-sm">(calculating...)</span>}
                  </label>
                  <div className="bg-surface-dark border border-border-base rounded-lg p-3">
                    <div className="flex flex-wrap gap-2">
                      {OSU_MODS.map((mod) => {
                        const isSelected = selectedMods.includes(mod.value) || (selectedMods.length === 0 && mod.value === 'NM');
                        const isDisabled = isModDisabled(mod.value);
                        
                        return (
                          <button
                            key={mod.value}
                            type="button"
                            onClick={() => !isDisabled && toggleMod(mod.value)}
                            title={isDisabled ? 'Incompatible with selected mods' : mod.description}
                            disabled={isDisabled}
                            className={`px-3 py-1.5 rounded font-semibold text-sm transition-colors ${
                              isSelected
                                ? 'bg-accent-primary text-text-inverse'
                                : isDisabled
                                ? 'bg-surface-light text-text-muted cursor-not-allowed opacity-40'
                                : 'bg-surface-light text-text-secondary hover:bg-background-hover'
                            }`}
                          >
                            {mod.value}
                          </button>
                        );
                      })}
                    </div>
                    {selectedMods.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedMods([])}
                        className="mt-3 w-full bg-error/20 hover:bg-error/30 text-error border border-error/40 py-2 rounded font-semibold text-sm transition-colors"
                      >
                        Clear All Mods
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {displayStats && selectedDifficulty && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                  <div className="bg-surface-dark rounded-lg p-4 text-center">
                    <p className="text-text-muted text-sm mb-1">STARS</p>
                    <p className="text-2xl font-bold text-accent-primary">
                      {displayStats.stars.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-surface-dark rounded-lg p-4 text-center">
                    <p className="text-text-muted text-sm mb-1">CS</p>
                    <p className="text-2xl font-bold text-text-inverse">
                      {displayStats.cs.toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-surface-dark rounded-lg p-4 text-center">
                    <p className="text-text-muted text-sm mb-1">AR</p>
                    <p className="text-2xl font-bold text-text-inverse">
                      {displayStats.ar.toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-surface-dark rounded-lg p-4 text-center">
                    <p className="text-text-muted text-sm mb-1">OD</p>
                    <p className="text-2xl font-bold text-text-inverse">
                      {displayStats.od.toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-surface-dark rounded-lg p-4 text-center">
                    <p className="text-text-muted text-sm mb-1">HP</p>
                    <p className="text-2xl font-bold text-text-inverse">
                      {displayStats.hp.toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-surface-dark rounded-lg p-4 text-center">
                    <p className="text-text-muted text-sm mb-1">BPM</p>
                    <p className="text-2xl font-bold text-text-inverse">
                      {Math.round(displayStats.bpm)}
                    </p>
                  </div>
                  <div className="bg-surface-dark rounded-lg p-4 text-center">
                    <p className="text-text-muted text-sm mb-1">LENGTH</p>
                    <p className="text-2xl font-bold text-text-inverse">
                      {formatLength(modifiedStats?.length || selectedDifficulty.hit_length)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!beatmapData || !challenge}
            className="w-full bg-accent-primary hover:bg-accent-primary/80 text-text-inverse py-4 rounded-lg font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            SUBMIT BOUNTY
          </button>
        </div>
      </div>
    </div>
  );
};

export default BountySubmission;