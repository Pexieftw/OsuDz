import React, { useState } from 'react';
import { useBeatmap } from '../hooks/useBeatmap';
import { useModSelector } from '../hooks/useModSelector';
import { useDifficultyCalculator } from '../hooks/useDifficultyCalculator';
import BountyForm from '../components/bounty/BountyForm';
import BeatmapCard from '../components/bounty/BeatmapCard';
import DifficultySelector from '../components/bounty/DifficultySelector';
import ModSelector from '../components/bounty/ModSelector';
import BeatmapStats from '../components/bounty/BeatmapStats';
import { API_URL } from '../utils/constants';

const BountySubmissionPage: React.FC = () => {
  const [beatmapUrl, setBeatmapUrl] = useState('');
  const [challenge, setChallenge] = useState('');

  const {
    beatmapData,
    selectedDifficulty,
    setSelectedDifficulty,
    loading,
    error,
    authError,
    fetchBeatmap,
  } = useBeatmap(beatmapUrl);

  const { selectedMods, toggleMod, isModDisabled, clearMods } = useModSelector();
  const { modifiedStats, calculatingMods } = useDifficultyCalculator(selectedDifficulty, selectedMods);

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
          <BountyForm
            beatmapUrl={beatmapUrl}
            setBeatmapUrl={setBeatmapUrl}
            challenge={challenge}
            setChallenge={setChallenge}
            onFetch={fetchBeatmap}
            loading={loading}
            error={error}
            canFetch={!!beatmapUrl}
          />

          {beatmapData && (
            <div className="bg-surface-light border border-border-strong rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold text-accent-secondary mb-4">Beatmap Information</h2>

              <BeatmapCard beatmap={beatmapData} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DifficultySelector
                  beatmapData={beatmapData}
                  selectedDifficulty={selectedDifficulty}
                  onDifficultyChange={setSelectedDifficulty}
                />

                <ModSelector
                  selectedMods={selectedMods}
                  onToggleMod={toggleMod}
                  isModDisabled={isModDisabled}
                  onClearMods={clearMods}
                  calculatingMods={calculatingMods}
                />
              </div>

              {selectedDifficulty && (
                <BeatmapStats selectedDifficulty={selectedDifficulty} modifiedStats={modifiedStats} />
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

export default BountySubmissionPage;