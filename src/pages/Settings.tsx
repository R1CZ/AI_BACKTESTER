import { useState } from 'react';
import { Settings as SettingsIcon, Key, Globe, Clock, Palette, Shield, Database, Cpu } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    aiProvider: 'openrouter', aiModel: 'deepseek/deepseek-chat', defaultSymbol: 'XAUUSDm',
    defaultTimeframe: 'M1', defaultBalance: 1000, defaultCommission: 0.70, defaultSlippage: 2,
    timezone: 'UTC', theme: 'dark', retention: 30, executionModel: 'candle',
  });

  return (
    <div className="space-y-6 animate-slide-up max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-[#7A8BA0] mt-1">Configure application preferences</p>
      </div>

      {/* AI Provider */}
      <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Cpu className="w-4 h-4 text-[#00D4FF]" /> AI Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">AI Provider</label>
            <select value={settings.aiProvider} onChange={e => setSettings(s => ({ ...s, aiProvider: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm focus:border-[#00D4FF] outline-none">
              <option value="openrouter">OpenRouter</option><option value="openai">OpenAI</option><option value="deepseek">DeepSeek</option><option value="ollama">Local Ollama</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">Model</label>
            <input type="text" value={settings.aiModel} onChange={e => setSettings(s => ({ ...s, aiModel: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm font-mono focus:border-[#00D4FF] outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">API Key</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8BA0]" />
              <input type="password" placeholder="sk-..." className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm font-mono focus:border-[#00D4FF] outline-none" />
            </div>
            <p className="text-[10px] text-[#4A5568] mt-1">Keys are encrypted and never exposed to the frontend</p>
          </div>
        </div>
      </div>

      {/* Trading Defaults */}
      <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-[#00D4FF]" /> Trading Defaults</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">Default Symbol</label>
            <select value={settings.defaultSymbol} onChange={e => setSettings(s => ({ ...s, defaultSymbol: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm focus:border-[#00D4FF] outline-none">
              <option>XAUUSDm</option><option>EURUSD</option><option>GBPUSD</option><option>NAS100</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">Default Timeframe</label>
            <select value={settings.defaultTimeframe} onChange={e => setSettings(s => ({ ...s, defaultTimeframe: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm focus:border-[#00D4FF] outline-none">
              <option>M1</option><option>M5</option><option>M15</option><option>H1</option><option>H4</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">Initial Balance ($)</label>
            <input type="number" value={settings.defaultBalance} onChange={e => setSettings(s => ({ ...s, defaultBalance: +e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm font-mono focus:border-[#00D4FF] outline-none" />
          </div>
          <div>
            <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">Commission ($/lot)</label>
            <input type="number" value={settings.defaultCommission} onChange={e => setSettings(s => ({ ...s, defaultCommission: +e.target.value }))} step="0.01" className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm font-mono focus:border-[#00D4FF] outline-none" />
          </div>
          <div>
            <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">Slippage (points)</label>
            <input type="number" value={settings.defaultSlippage} onChange={e => setSettings(s => ({ ...s, defaultSlippage: +e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm font-mono focus:border-[#00D4FF] outline-none" />
          </div>
          <div>
            <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">Execution Model</label>
            <select value={settings.executionModel} onChange={e => setSettings(s => ({ ...s, executionModel: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm focus:border-[#00D4FF] outline-none">
              <option value="candle">Candle-Based</option><option value="tick">Tick-Based</option>
            </select>
          </div>
        </div>
      </div>

      {/* General */}
      <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-[#00D4FF]" /> General</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">Timezone</label>
            <select value={settings.timezone} onChange={e => setSettings(s => ({ ...s, timezone: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm focus:border-[#00D4FF] outline-none">
              <option>UTC</option><option>US/Eastern</option><option>Europe/London</option><option>Asia/Tokyo</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">Theme</label>
            <select value={settings.theme} onChange={e => setSettings(s => ({ ...s, theme: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm focus:border-[#00D4FF] outline-none">
              <option value="dark">Dark Terminal</option><option value="midnight">Midnight</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">Backtest Retention (days)</label>
            <input type="number" value={settings.retention} onChange={e => setSettings(s => ({ ...s, retention: +e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm font-mono focus:border-[#00D4FF] outline-none" />
          </div>
        </div>
      </div>

      <button className="px-6 py-2.5 rounded-lg bg-[#00D4FF] text-[#070B12] font-semibold text-sm hover:bg-[#00D4FF]/90">
        Save Settings
      </button>
    </div>
  );
}
