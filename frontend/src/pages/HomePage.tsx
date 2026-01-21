import React from 'react';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-text-inverse mb-6">
            Welcome to <span className="text-accent-primary">osu-dz</span>
          </h1>
          <p className="text-text-secondary text-xl mb-8">
            The Algerian osu! Community Platform
          </p>
          
          {!isAuthenticated && (
            <div className="inline-block bg-surface-base border border-border-base rounded-lg p-8">
              <p className="text-text-primary mb-4">Get started by logging in with your osu! account</p>
              <button
                onClick={() => window.location.href = '/bounties'}
                className="bg-accent-primary hover:bg-accent-secondary text-white px-8 py-3 rounded-lg font-semibold transition-all"
              >
                Explore Features
              </button>
            </div>
          )}

          {isAuthenticated && user && (
            <div className="inline-block bg-surface-base border border-border-base rounded-lg p-8">
              <p className="text-text-primary mb-4">
                Welcome back, <span className="text-accent-primary font-semibold">{user.username}</span>!
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/bounties"
                  className="bg-accent-primary hover:bg-accent-secondary text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  Submit Bounties
                </a>
                <a
                  href="/vote"
                  className="bg-surface-light hover:bg-surface-lighter text-text-inverse border border-border-base px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  Browse & Vote
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-surface-base border border-border-base rounded-lg p-6">
            <h3 className="text-xl font-bold text-accent-primary mb-3">Bounties</h3>
            <p className="text-text-secondary">
              Submit challenging beatmaps and compete for bragging rights
            </p>
          </div>
          
          <div className="bg-surface-base border border-border-base rounded-lg p-6">
            <h3 className="text-xl font-bold text-accent-secondary mb-3">Map Pool</h3>
            <p className="text-text-secondary">
              Suggest maps for community tournaments and events
            </p>
          </div>
          
          <div className="bg-surface-base border border-border-base rounded-lg p-6">
            <h3 className="text-xl font-bold text-accent-primary mb-3">Voting</h3>
            <p className="text-text-secondary">
              Vote on community submissions and help shape events
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;