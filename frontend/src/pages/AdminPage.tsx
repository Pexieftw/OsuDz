import React from 'react';
//import { useAuth } from '../hooks/useAuth';

const AdminPage: React.FC = () => {
  // To Be Handled Later
  //const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background-primary py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-text-inverse mb-4">Admin Dashboard</h1>
          <p className="text-text-secondary text-lg">
            Manage the osu-dz platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Voting Scheduler */}
          <div className="bg-surface-base border border-border-base rounded-lg p-6">
            <h2 className="text-2xl font-bold text-accent-primary mb-4">Voting Scheduler</h2>
            <p className="text-text-secondary mb-4">Schedule and manage voting periods</p>
            <button className="bg-accent-primary hover:bg-accent-secondary text-white px-4 py-2 rounded-lg font-semibold transition-all">
              Configure Voting
            </button>
          </div>

          {/* Map Pool Manager */}
          <div className="bg-surface-base border border-border-base rounded-lg p-6">
            <h2 className="text-2xl font-bold text-accent-secondary mb-4">Map Pool Manager</h2>
            <p className="text-text-secondary mb-4">Review and approve map pool suggestions</p>
            <button className="bg-accent-secondary hover:bg-accent-primary text-white px-4 py-2 rounded-lg font-semibold transition-all">
              Manage Pools
            </button>
          </div>

          {/* Bounty Moderation */}
          <div className="bg-surface-base border border-border-base rounded-lg p-6">
            <h2 className="text-2xl font-bold text-accent-primary mb-4">Bounty Moderation</h2>
            <p className="text-text-secondary mb-4">Review and moderate bounty submissions</p>
            <button className="bg-accent-primary hover:bg-accent-secondary text-white px-4 py-2 rounded-lg font-semibold transition-all">
              View Bounties
            </button>
          </div>

          {/* User Management */}
          <div className="bg-surface-base border border-border-base rounded-lg p-6">
            <h2 className="text-2xl font-bold text-accent-secondary mb-4">User Management</h2>
            <p className="text-text-secondary mb-4">Manage user roles and permissions</p>
            <button className="bg-accent-secondary hover:bg-accent-primary text-white px-4 py-2 rounded-lg font-semibold transition-all">
              Manage Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;