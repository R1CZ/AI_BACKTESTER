import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, createContext, useContext } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewBacktest from './pages/NewBacktest';
import BacktestResult from './pages/BacktestResult';
import Backtests from './pages/Backtests';
import Analytics from './pages/Analytics';
import MT5Connection from './pages/MT5Connection';
import Settings from './pages/Settings';
import Strategies from './pages/Strategies';
import Optimization from './pages/Optimization';
import MonteCarlo from './pages/MonteCarlo';

interface AppState {
  mt5Connected: boolean;
  demoMode: boolean;
  currentAccount: string;
  notifications: { id: number; msg: string }[];
}

interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  addNotification: (msg: string) => void;
}

export const AppContext = createContext<AppContextType>({
  state: { mt5Connected: true, demoMode: true, currentAccount: '5012847', notifications: [] },
  setState: () => {},
  addNotification: () => {},
});

export const useApp = () => useContext(AppContext);

export default function App() {
  const [state, setState] = useState<AppState>({
    mt5Connected: true,
    demoMode: true,
    currentAccount: '5012847',
    notifications: [],
  });

  const addNotification = (msg: string) => {
    const id = Date.now() + Math.random();
    setState(prev => ({ ...prev, notifications: [{ id, msg }, ...prev.notifications].slice(0, 5) }));
    setTimeout(() => {
      setState(prev => ({ ...prev, notifications: prev.notifications.filter(n => n.id !== id) }));
    }, 4000);
  };

  return (
    <AppContext.Provider value={{ state, setState, addNotification }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="backtests/new" element={<NewBacktest />} />
            <Route path="backtests/:id" element={<BacktestResult />} />
            <Route path="backtests" element={<Backtests />} />
            <Route path="strategies" element={<Strategies />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="optimization" element={<Optimization />} />
            <Route path="monte-carlo" element={<MonteCarlo />} />
            <Route path="mt5" element={<MT5Connection />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}
