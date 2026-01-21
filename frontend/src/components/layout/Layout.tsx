import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-primary">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;