import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DailyChallengePage from './pages/DailyChallengePage';
import SinglePlayerPage from './pages/SinglePlayerPage';
import StatsPage from './pages/StatsPage';
import RulesPage from './pages/RulesPage';
import SettingsPage from './pages/SettingsPage';

const App: React.FC = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  })

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/daily-challenge" element={<DailyChallengePage />} />
        <Route path="/single-player" element={<SinglePlayerPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/settings" element={<SettingsPage theme={theme} setTheme={setTheme}/>} />
      </Routes>
    </HashRouter>
  );
};

export default App;