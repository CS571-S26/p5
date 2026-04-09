import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DailyChallengePage from './pages/DailyChallengePage';
import SinglePlayerPage from './pages/SinglePlayerPage';
import MultiPlayerPage from './pages/MultiPlayerPage';
import RulesPage from './pages/RulesPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/daily-challenge" element={<DailyChallengePage />} />
        <Route path="/single-player" element={<SinglePlayerPage />} />
        <Route path="/multi-player" element={<MultiPlayerPage />} />
        <Route path="/rules" element={<RulesPage />} />
      </Routes>
    </HashRouter>
  );
};

export default App;