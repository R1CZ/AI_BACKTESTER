import { useState } from 'react';
import { useApp } from '../App';
import { Network, CheckCircle, XCircle, RefreshCw, Wifi, WifiOff, Server, DollarSign, Activity } from 'lucide-react';

export default function MT5Connection() {
  const { state, setState, addNotification } = useApp();
  const [connecting, setConnecting] = useState(false);

  const toggleConnection = () => {
    setConnecting(true);
    setTimeout(() => {
      setState(prev => ({ ...prev, mt5Connected: !prev.mt5Connected }));
      setConnecting(false);
      addNotification(state.mt5Connected ? 'MT5 Disconnected' : 'MT5 Connected');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white">MT5 Connection</h1>
        <p className="text-sm text-[#7A8BA0] mt-1">Manage MetaTrader 5 terminal connection</p>
      </div>

      {/* Connection Status */}
      <div className={`bg-[#0D131D] border rounded-xl p-6 ${state.mt5Connected ? 'border-[#00E676]/20' : 'border-[#FF4D6D]/20'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${state.mt5Connected ? 'bg-[#00E676]/10' : 'bg-[#FF4D6D]/10'}`}>
              {state.mt5Connected ? <Wifi className="w-6 h-6 text-[#00E676]" /> : <WifiOff className="w-6 h-6 text-[#FF4D6D]" />}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">MT5 {state.mt5Connected ? 'Connected' : 'Disconnected'}</h2>
              <p className="text-sm text-[#7A8BA0]">{state.mt5Connected ? 'Terminal is active and receiving data' : 'No active connection to MT5 terminal'}</p>
            </div>
          </div>
          <button
            onClick={toggleConnection}
            disabled={connecting}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${state.mt5Connected ? 'bg-[#FF4D6D]/10 text-[#FF4D6D] border border-[#FF4D6D]/20 hover:bg-[#FF4D6D]/20' : 'bg-[#00E676] text-[#070B12] hover:bg-[#00E676]/90'}`}
          >
            {connecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : state.mt5Connected ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            {connecting ? 'Connecting...' : state.mt5Connected ? 'Disconnect' : 'Connect MT5'}
          </button>
        </div>

        {state.mt5Connected && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Terminal', value: 'MetaTrader 5', icon: Server },
              { label: 'Account', value: '5012847', icon: Activity },
              { label: 'Server', value: 'ICMarkets-Demo', icon: Network },
              { label: 'Balance', value: '$5,240.00', icon: DollarSign },
            ].map(item => (
              <div key={item.label} className="p-3 rounded-lg bg-[#131B27] border border-[#1C2633]">
                <div className="flex items-center gap-2 mb-1">
                  <item.icon className="w-3.5 h-3.5 text-[#7A8BA0]" />
                  <span className="text-[10px] text-[#7A8BA0] uppercase tracking-wider">{item.label}</span>
                </div>
                <p className="text-sm font-mono text-white font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Symbols */}
      {state.mt5Connected && (
        <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Available Symbols</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {['XAUUSDm', 'XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'US30', 'NAS100', 'BTCUSD', 'ETHUSD', 'GBPJPY', 'EURJPY', 'AUDUSD'].map(s => (
              <div key={s} className="px-3 py-2 rounded-lg bg-[#131B27] border border-[#1C2633] text-center text-sm font-mono text-white hover:border-[#00D4FF]/30 cursor-pointer transition-colors">
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Architecture Info */}
      <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Connection Architecture</h3>
        <div className="flex items-center gap-3 text-xs text-[#7A8BA0] flex-wrap">
          <span className="px-3 py-1.5 rounded bg-[#131B27] border border-[#1C2633]">Web Browser</span>
          <span>→</span>
          <span className="px-3 py-1.5 rounded bg-[#131B27] border border-[#1C2633]">Frontend</span>
          <span>→</span>
          <span className="px-3 py-1.5 rounded bg-[#131B27] border border-[#1C2633]">Backend API</span>
          <span>→</span>
          <span className="px-3 py-1.5 rounded bg-[#131B27] border border-[#1C2633]">MT5 Worker</span>
          <span>→</span>
          <span className="px-3 py-1.5 rounded bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF]">MetaTrader 5</span>
        </div>
        <p className="text-xs text-[#4A5568] mt-3">
          {state.demoMode ? '⚠ DEMO MODE: Using simulated MT5 data. Connect a real MT5 terminal for live data.' : '✓ LIVE MODE: Connected to real MT5 terminal data.'}
        </p>
      </div>
    </div>
  );
}
