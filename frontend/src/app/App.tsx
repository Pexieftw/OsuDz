import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../providers/AuthProvider';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';

import HomePage from '../pages/HomePage';
import BountySubmissionPage from '../pages/BountySubmissionPage';
import MapPoolSuggestionsPage from '../pages/MapPoolSuggestionsPage';
import VoteBrowsePage from '../pages/VoteBrowsePage';
import AdminPage from '../pages/AdminPage';
import CallbackPage from '../pages/CallbackPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>

            <Route path="/" element={<HomePage />} />
            <Route path="/callback" element={<CallbackPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/bounties" element={<BountySubmissionPage />} />
              <Route path="/mappool" element={<MapPoolSuggestionsPage />} />
              <Route path="/vote" element={<VoteBrowsePage />} />
            </Route>
            
            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
            
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;