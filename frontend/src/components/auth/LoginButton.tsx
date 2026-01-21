import React from 'react';

interface LoginButtonProps {
  onClick: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-accent-primary hover:bg-accent-secondary text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg shadow-accent-primary/20 hover:shadow-accent-primary/40 hover:scale-105"
    >
      Log in with osu!
    </button>
  );
};

export default LoginButton;