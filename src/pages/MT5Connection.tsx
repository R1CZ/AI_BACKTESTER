import { useState } from 'react';
import { useApp } from '../App';
import { Network, CheckCircle, XCircle, RefreshCw, Wifi, WifiOff, Server, DollarSign, Activity, Settings, AlertCircle } from 'lucide-react';

export default function MT5Connection() {
  const { state, setState, addNotification } = useApp();
  const [connecting, setConnecting] = useState(false);
  const [config, setConfig] = useState({
    host: 'localhost',
    port: '8765',
    token: '',
  });

  const handleConnect = () => {
    if (!config.token) {
      addNotification('Please enter your MT5 Worker API token');
      return;
    }
    setConnecting(true);
    // Simulate connection attempt
    setTimeout(() => {
      setConnecting(false);
      setState(prev => ({ 
        ...prev, 
        mt5Connected: true,
        currentAccount: '5012847'
      }));
      addNotification('MT5 Connected successfully');
    }, 2000);
  };

  const handleDisconnect = () => {
    setState(prev => ({ 
      ...prev, 
      mt5Connected: false,
      currentAccount: ''
    }));
    addNotification('MT5 Disconnected');
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white">MT5 Connection</h1>
        <p className="text-sm text-[#7A8BA0] mt-1">Connect to your MetaTrader 5 terminal via the MT5 Worker service</p>
      </div>

      {/* Connection Status */}
      <div className={`bg-[#0D131D] border rounded-xl p-6 ${state.mt5Connected ? 'border-[#00E676]/20' : 'border-[#1C2633]'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${state.mt5Connected ? 'bg-[#00E676]/10' : 'bg-[#1C2633]'}`}>
              {state.mt5Connected ? <Wifi className="w-6 h-6 text-[#00E676]" /> : <WifiOff className="w-6 h-6 text-[#7A8BA0]" />}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {state.mt5Connected ? 'Connected' : 'Not Connected'}
              </h2>
              <p className="text-sm text-[#7A8BA0]">
                {state.mt5Connected ? 'Terminal is active and receiving data' : 'Configure connection to MT5 Worker'}
              </p>
            </div>
          </div>
          {state.mt5Connected ? (
            <button
              onClick={handleDisconnect}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FF4D6D]/10 text-[#FF4D6D] border border-[#FF4D6D]/20 hover:bg-[#FF4D6D]/20 font-semibold text-sm transition-all"
            >
              <XCircle className="w-4 h-4" />
              Disconnect
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#00E676] text-[#070B12] hover:bg-[#00E676]/90 font-semibold text-sm transition-all disabled:opacity-50"
            >
              {connecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {connecting ? 'Connecting...' : 'Connect'}
            </button>
          )}
        </div>

        {state.mt5Connected && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Terminal', value: 'MetaTrader 5', icon: Server },
              { label: 'Account', value: state.currentAccount || 'N/A', icon: Activity },
              { label: 'Server', value: 'ICMarkets-Live', icon: Network },
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

      {/* Connection Configuration */}
      {!state.mt5Connected && (
        <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-[#00D4FF]" />
            <h3 className="text-lg font-semibold text-white">Connection Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">MT5 Worker Host</label>
              <input
                type="text"
                value={config.host}
                onChange={e => setConfig(c => ({ ...c, host: e.target.value }))}
                placeholder="localhost"
                className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm font-mono focus:border-[#00D4FF] outline-none"
              />
              <p className="text-[10px] text-[#4A5568] mt-1">Hostname or IP address of your MT5 Worker service</p>
            </div>

            <div>
              <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">Port</label>
              <input
                type="text"
                value={config.port}
                onChange={e => setConfig(c => ({ ...c, port: e.target.value }))}
                placeholder="8765"
                className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm font-mono focus:border-[#00D4FF] outline-none"
              />
              <p className="text-[10px] text-[#4A5568] mt-1">Port number for the MT5 Worker API</p>
            </div>

            <div>
              <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">API Token</label>
              <input
                type="password"
                value={config.token}
                onChange={e => setConfig(c => ({ ...c, token: e.target.value }))}
                placeholder="Enter your MT5 Worker API token"
                className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm font-mono focus:border-[#00D4FF] outline-none"
              />
              <p className="text-[10px] text-[#4A5568] mt-1">Authentication token for secure connection</p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-[#FFB020]/5 border border-[#FFB020]/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#FFB020] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[#FFB020] font-medium mb-1">MT5 Worker Required</p>
                <p className="text-xs text-[#E8F0F8]">
                  This application requires the MT5 Worker service running on a Windows machine with MetaTrader 5 installed. 
                  The worker acts as a bridge between this web application and your MT5 terminal.
                </p>
                <p className="text-xs text-[#7A8BA0] mt-2">
                  See the README for installation and setup instructions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available Symbols */}
      {state.mt5Connected && (
        <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Available Symbols</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {['XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'US30', 'NAS100', 'BTCUSD', 'ETHUSD', 'GBPJPY', 'EURJPY', 'AUDUSD', 'USDCHF'].map(s => (
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
          <span className={`px-3 py-1.5 rounded border ${state.mt5Connected ? 'bg-[#00D4FF]/10 border-[#00D4FF]/20 text-[#00D4FF]' : 'bg-[#131B27] border-[#1C2633]'}`}>
            MetaTrader 5
          </span>
        </div>
      </div>
    </div>
  );
}
