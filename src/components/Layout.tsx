import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../App';
import { LayoutDashboard, FlaskConical, History, Bot, BarChart3, Brain, Zap, Shuffle, Network, Settings, Bell, ChevronRight, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/backtests/new', label: 'New Backtest', icon: FlaskConical },
  { path: '/backtests', label: 'Backtests', icon: History },
  { path: '/strategies', label: 'Strategies', icon: Bot },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/optimization', label: 'Optimization', icon: Zap },
  { path: '/monte-carlo', label: 'Monte Carlo', icon: Shuffle },
  { path: '/mt5', label: 'MT5 Connection', icon: Network },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout() {
  const { state, addNotification } = useApp();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#070B12]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-[#1C2633] bg-[#0D131D] flex flex-col">
        <div className="p-5 border-b border-[#1C2633]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#00E676] flex items-center justify-center">
              <Activity className="w-4 h-4 text-[#070B12]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">AI BACKTESTER</h1>
              <p className="text-[10px] text-[#7A8BA0] uppercase tracking-wider">Quant Platform</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20'
                    : 'text-[#7A8BA0] hover:text-white hover:bg-[#1C2633]/50'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
              {item.path === '/backtests/new' && (
                <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-[#00D4FF]/20 text-[#00D4FF] font-medium">NEW</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-[#1C2633]">
          <div className="px-3 py-2 rounded-lg bg-[#131B27] border border-[#1C2633]">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${state.mt5Connected ? 'bg-[#00E676] animate-pulse-glow' : 'bg-[#FF4D6D]'}`} />
              <span className="text-xs text-[#7A8BA0]">MT5 {state.mt5Connected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <p className="text-[10px] text-[#4A5568] mt-1 font-mono">Acc: {state.currentAccount}</p>
            {state.demoMode && <p className="text-[10px] text-[#FFB020] mt-0.5">DEMO MODE</p>}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 flex-shrink-0 border-b border-[#1C2633] bg-[#0D131D]/80 backdrop-blur-sm flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-[#4A5568]">
              <span>AI Backtester</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#E8F0F8] capitalize">
                {location.pathname.split('/').filter(Boolean).pop() || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {state.demoMode && (
              <span className="text-[10px] px-2 py-1 rounded bg-[#FFB020]/10 text-[#FFB020] border border-[#FFB020]/20 font-medium">
                ⚠ DEMO DATA — Not Live MT5
              </span>
            )}
            
            <div className="flex items-center gap-2 text-xs text-[#7A8BA0]">
              <div className={`w-1.5 h-1.5 rounded-full ${state.mt5Connected ? 'bg-[#00E676]' : 'bg-[#FF4D6D]'}`} />
              <span>{state.mt5Connected ? 'MT5 Connected' : 'MT5 Offline'}</span>
            </div>

            <div className="text-xs text-[#7A8BA0] font-mono">
              {currentTime}
            </div>

            <button
              onClick={() => addNotification('No new notifications')}
              className="relative p-2 rounded-lg hover:bg-[#1C2633] transition-colors"
            >
              <Bell className="w-4 h-4 text-[#7A8BA0]" />
              {state.notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#00D4FF]" />
              )}
            </button>

            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D4FF]/30 to-[#00E676]/30 border border-[#1C2633] flex items-center justify-center">
              <span className="text-xs font-medium text-[#E8F0F8]">U</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Notifications */}
      <div className="fixed bottom-6 right-6 space-y-2 z-50">
        {state.notifications.map((n) => (
          <div key={n.id} className="animate-slide-up px-4 py-3 rounded-lg bg-[#131B27] border border-[#1C2633] shadow-xl text-sm text-[#E8F0F8] max-w-xs">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-[#00D4FF]" />
              {n.msg}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
