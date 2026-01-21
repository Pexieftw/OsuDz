import React from 'react';

const MapPoolSuggestionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-primary py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-text-inverse mb-4">Map Pool Suggestions</h1>
          <p className="text-text-secondary text-lg">
            Suggest beatmaps for upcoming tournaments and events
          </p>
        </div>

        <div className="bg-surface-base border border-border-base rounded-lg p-8 text-center">
          <p className="text-text-secondary">Coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default MapPoolSuggestionsPage;