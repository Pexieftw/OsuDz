import React from 'react';
import { type User } from '../../types/auth';

interface UserProfileProps {
  user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <button className="flex items-center gap-3 bg-surface-light hover:bg-surface-lighter border border-border-base hover:border-accent-primary/50 rounded-lg px-4 py-2.5 transition-all group h-11">
      <img
        src={user.avatar_url}
        alt={user.username}
        className="w-7 h-7 rounded-full border-2 border-accent-primary"
      />
      <div className="flex items-center gap-2">
        <p className="text-text-inverse font-semibold text-sm group-hover:text-accent-primary transition-colors">
          {user.username}
        </p>
        <img
          src={`https://flagcdn.com/16x12/${user.country_code.toLowerCase()}.png`}
          srcSet={`https://flagcdn.com/32x24/${user.country_code.toLowerCase()}.png 2x, https://flagcdn.com/48x36/${user.country_code.toLowerCase()}.png 3x`}
          width="16"
          height="12"
          alt={user.country_code}
          title={user.country_code}
          className="inline-block rounded-sm opacity-80"
        />
      </div>
    </button>
  );
};

export default UserProfile;