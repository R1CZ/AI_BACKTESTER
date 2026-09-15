import { useState, useRef, useCallback } from 'react';
import { useApp } from '../App';
import { demoStrategy } from '../data/demo';
import { Upload, FileCode, CheckCircle, AlertTriangle, XCircle, Zap, Play, Settings, ChevronDown, ChevronUp, Brain, Shield, Clock, Cpu } from 'lucide-react';

type Step = 'upload' | 'analysis' | 'configure' | 'running' | 'complete';

export default function NewBacktest() {
  const { addNotification } = useApp();
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [config, setConfig] = useState({
    symbol: 'XAUUSDm', timeframe: 'M1', startDate: '2026-01-01', endDate: '2026-08-31',
    initialBalance: 1000, spreadMode: 'variable', commission: 0.70, slippage: 2,
    executionMode: 'market', leverage: 100, lotMode: 'fixed', riskPerTrade: 1,
    preset: 'realistic',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.name.endsWith('.py')) {
      setFile(f.name);
      setStep('analysis');
      startAnalysis();
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.name.endsWith('.py')) {
      setFile(f.name);
      setStep('analysis');
      startAnalysis();
    }
  };

  const startAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setStep('configure');
      addNotification('Code analysis completed');
    }, 3000);
  };

  const startBacktest = () => {
    setStep('running');
    setProgress(0);
    addNotification('Backtest started');
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStep('complete');
          addNotification('Backtest completed successfully');
          return 100;
        }
        return prev + Math.random() * 3 + 1;
      });
    }, 200);
  };

  const stages = [
    { label: 'Analyzing Code', done: progress > 10 },
    { label: 'Preparing Environment', done: progress > 20 },
    { label: 'Connecting MT5', done: progress > 30 },
    { label: 'Loading Historical Data', done: progress > 45 },
    { label: 'Validating Strategy', done: progress > 55 },
    { label: 'Starting Simulation', done: progress > 65 },
    { label: 'Processing Trades', done: progress > 85 },
    { label: 'Generating Report', done: progress >= 100 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white">New Backtest</h1>
        <p className="text-sm text-[#7A8BA0] mt-1">Upload your Python trading bot and run AI-powered backtesting</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {['Upload', 'Analysis', 'Configure', 'Execute'].map((s, i) => {
          const stepIndex = ['upload', 'analysis', 'configure', 'running'].indexOf(step === 'complete' ? 'running' : step);
          const active = i <= stepIndex;
          return (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${active ? 'bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20' : 'bg-[#131B27] text-[#7A8BA0] border border-[#1C2633]'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${active ? 'bg-[#00D4FF] text-[#070B12]' : 'bg-[#1C2633] text-[#7A8BA0]'}`}>
                  {i + 1}
                </span>
                {s}
              </div>
              {i < 3 && <div className={`w-8 h-px ${active ? 'bg-[#00D4FF]/30' : 'bg-[#1C2633]'}`} />}
            </div>
          );
        })}
      </div>

      {/* Upload Step */}
      {step === 'upload' && (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#1C2633] rounded-2xl p-16 text-center cursor-pointer hover:border-[#00D4FF]/40 hover:bg-[#00D4FF]/5 transition-all group"
        >
          <input ref={fileInputRef} type="file" accept=".py" onChange={handleFileSelect} className="hidden" />
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#00D4FF]/10 flex items-center justify-center mb-6 group-hover:bg-[#00D4FF]/20 transition-colors">
            <Upload className="w-8 h-8 text-[#00D4FF]" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Upload Your Python Trading Bot</h2>
          <p className="text-sm text-[#7A8BA0] mb-4">Drag & Drop Python File or <span className="text-[#00D4FF]">Browse Files</span></p>
          <p className="text-xs text-[#4A5568]">Supported: Python (.py) • Max 10MB</p>
        </div>
      )}

      {/* Analysis Step */}
      {step === 'analysis' && (
        <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <FileCode className="w-5 h-5 text-[#00D4FF]" />
            <h2 className="text-lg font-semibold text-white">AI Code Analysis</h2>
            {analyzing && <span className="text-xs text-[#FFB020] animate-pulse">Analyzing...</span>}
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#131B27] border border-[#1C2633]">
            <FileCode className="w-4 h-4 text-[#00D4FF]" />
            <span className="text-sm text-white font-mono">{file}</span>
            <span className="text-xs text-[#7A8BA0] ml-auto">Python 3.11 • 24.3 KB</span>
          </div>

          {demoStrategy && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strategy Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#00D4FF]" /> Strategy Detection
                </h3>
                {[
                  { label: 'Python Version', value: demoStrategy.python },
                  { label: 'Trading Engine', value: demoStrategy.engine },
                  { label: 'Detected Symbol', value: demoStrategy.symbol },
                  { label: 'Detected Timeframe', value: demoStrategy.timeframe },
                ].map(item => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-[#7A8BA0]">{item.label}</span>
                    <span className="text-white font-mono">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Components */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#FFB020]" /> Strategy Components
                </h3>
                <div className="flex flex-wrap gap-2">
                  {demoStrategy.components.map((c: string) => (
                    <span key={c} className="px-2 py-1 rounded text-xs bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20">
                      ✓ {c}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {demoStrategy.aiComponents.map((c: string) => (
                    <span key={c} className="px-2 py-1 rounded text-xs bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20">
                      🤖 {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Warnings */}
              <div className="md:col-span-2 space-y-2">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#FFB020]" /> Warnings & Issues
                </h3>
                {demoStrategy.warnings.map((w: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[#FFB020]">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    {w}
                  </div>
                ))}
                {demoStrategy.issues.map((issue: any, i: number) => (
                  <div key={i} className={`p-3 rounded-lg border ${issue.severity === 'HIGH' ? 'bg-[#FF4D6D]/5 border-[#FF4D6D]/20' : issue.severity === 'MEDIUM' ? 'bg-[#FFB020]/5 border-[#FFB020]/20' : 'bg-[#00D4FF]/5 border-[#00D4FF]/20'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${issue.severity === 'HIGH' ? 'bg-[#FF4D6D]/20 text-[#FF4D6D]' : issue.severity === 'MEDIUM' ? 'bg-[#FFB020]/20 text-[#FFB020]' : 'bg-[#00D4FF]/20 text-[#00D4FF]'}`}>
                        {issue.severity}
                      </span>
                      <span className="text-xs text-[#7A8BA0] font-mono">{issue.location}</span>
                    </div>
                    <p className="text-sm text-white">{issue.problem}</p>
                    <p className="text-xs text-[#7A8BA0] mt-1">Impact: {issue.impact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!analyzing && (
            <button
              onClick={() => setStep('configure')}
              className="w-full py-3 rounded-lg bg-[#00D4FF] text-[#070B12] font-semibold text-sm hover:bg-[#00D4FF]/90 transition-all"
            >
              Continue to Configuration →
            </button>
          )}
        </div>
      )}

      {/* Configure Step */}
      {step === 'configure' && (
        <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-[#00D4FF]" />
            <h2 className="text-lg font-semibold text-white">Backtest Configuration</h2>
          </div>

          {/* Presets */}
          <div className="flex gap-2">
            {['Conservative', 'Realistic', 'Aggressive', 'Broker Realistic', 'Custom'].map(p => (
              <button
                key={p}
                onClick={() => setConfig(c => ({ ...c, preset: p.toLowerCase() }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${config.preset === p.toLowerCase() ? 'bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20' : 'bg-[#131B27] text-[#7A8BA0] border border-[#1C2633] hover:text-white'}`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">Symbol</label>
              <select value={config.symbol} onChange={e => setConfig(c => ({ ...c, symbol: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm focus:border-[#00D4FF] outline-none">
                <option>XAUUSDm</option><option>XAUUSD</option><option>EURUSD</option><option>GBPUSD</option><option>USDJPY</option><option>NAS100</option><option>US30</option><option>BTCUSD</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">Timeframe</label>
              <select value={config.timeframe} onChange={e => setConfig(c => ({ ...c, timeframe: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm focus:border-[#00D4FF] outline-none">
                {['M1','M5','M15','M30','H1','H4','D1','W1'].map(tf => <option key={tf}>{tf}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">Initial Balance ($)</label>
              <input type="number" value={config.initialBalance} onChange={e => setConfig(c => ({ ...c, initialBalance: +e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm font-mono focus:border-[#00D4FF] outline-none" />
            </div>
            <div>
              <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">Start Date</label>
              <input type="date" value={config.startDate} onChange={e => setConfig(c => ({ ...c, startDate: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm focus:border-[#00D4FF] outline-none" />
            </div>
            <div>
              <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">End Date</label>
              <input type="date" value={config.endDate} onChange={e => setConfig(c => ({ ...c, endDate: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm focus:border-[#00D4FF] outline-none" />
            </div>
            <div>
              <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">Risk Per Trade (%)</label>
              <input type="number" value={config.riskPerTrade} onChange={e => setConfig(c => ({ ...c, riskPerTrade: +e.target.value }))} step="0.1" className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm font-mono focus:border-[#00D4FF] outline-none" />
            </div>
            <div>
              <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">Spread Mode</label>
              <select value={config.spreadMode} onChange={e => setConfig(c => ({ ...c, spreadMode: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm focus:border-[#00D4FF] outline-none">
                <option value="variable">Variable (Real)</option><option value="fixed">Fixed</option><option value="zero">Zero Spread</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">Commission ($/lot)</label>
              <input type="number" value={config.commission} onChange={e => setConfig(c => ({ ...c, commission: +e.target.value }))} step="0.01" className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm font-mono focus:border-[#00D4FF] outline-none" />
            </div>
            <div>
              <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">Execution Mode</label>
              <select value={config.executionMode} onChange={e => setConfig(c => ({ ...c, executionMode: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm focus:border-[#00D4FF] outline-none">
                <option value="market">Market Execution</option><option value="instant">Instant Execution</option>
              </select>
            </div>
          </div>

          {/* Advanced Settings */}
          <div>
            <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2 text-sm text-[#7A8BA0] hover:text-white transition-colors">
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Advanced Settings
            </button>
            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">Slippage (points)</label>
                  <input type="number" value={config.slippage} onChange={e => setConfig(c => ({ ...c, slippage: +e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm font-mono focus:border-[#00D4FF] outline-none" />
                </div>
                <div>
                  <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">Leverage</label>
                  <input type="number" value={config.leverage} onChange={e => setConfig(c => ({ ...c, leverage: +e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm font-mono focus:border-[#00D4FF] outline-none" />
                </div>
                <div>
                  <label className="text-xs text-[#7A8BA0] uppercase tracking-wider mb-1.5 block">Lot Mode</label>
                  <select value={config.lotMode} onChange={e => setConfig(c => ({ ...c, lotMode: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm focus:border-[#00D4FF] outline-none">
                    <option value="fixed">Fixed</option><option value="risk">Risk-Based</option><option value="bot">Bot Logic</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Safety Notice */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#00E676]/5 border border-[#00E676]/20">
            <Shield className="w-4 h-4 text-[#00E676]" />
            <div>
              <p className="text-sm text-[#00E676] font-medium">Safety: Live Trading Disabled</p>
              <p className="text-xs text-[#7A8BA0]">All orders will be simulated. No real trades will be executed.</p>
            </div>
          </div>

          <button
            onClick={startBacktest}
            className="w-full py-3.5 rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#00E676] text-[#070B12] font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            START AI BACKTEST
          </button>
        </div>
      )}

      {/* Running Step */}
      {step === 'running' && (
        <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#00D4FF] animate-pulse-glow" />
            <h2 className="text-lg font-semibold text-white">AI Backtest Engine</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-[#00D4FF]/10 text-[#00D4FF]">RUNNING</span>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs text-[#7A8BA0] mb-2">
              <span>Progress</span>
              <span className="font-mono text-[#00D4FF]">{Math.min(Math.round(progress), 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#131B27] overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#00D4FF] to-[#00E676] transition-all duration-300" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
          </div>

          {/* Stages */}
          <div className="space-y-2">
            {stages.map(s => (
              <div key={s.label} className="flex items-center gap-3">
                {s.done ? <CheckCircle className="w-4 h-4 text-[#00E676]" /> : <Clock className="w-4 h-4 text-[#4A5568]" />}
                <span className={`text-sm ${s.done ? 'text-[#00E676]' : 'text-[#4A5568]'}`}>{s.label}</span>
                {s.done && <span className="text-[10px] text-[#00E676]">DONE</span>}
              </div>
            ))}
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-[#131B27] border border-[#1C2633]">
              <p className="text-[10px] text-[#7A8BA0] uppercase">Current Date</p>
              <p className="text-sm font-mono text-white mt-1">2026-05-{String(Math.floor(progress / 5) + 1).padStart(2, '0')}</p>
            </div>
            <div className="p-3 rounded-lg bg-[#131B27] border border-[#1C2633]">
              <p className="text-[10px] text-[#7A8BA0] uppercase">Bars Processed</p>
              <p className="text-sm font-mono text-white mt-1">{Math.floor(progress * 18342).toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-[#131B27] border border-[#1C2633]">
              <p className="text-[10px] text-[#7A8BA0] uppercase">Trades</p>
              <p className="text-sm font-mono text-white mt-1">{Math.floor(progress * 3.47)}</p>
            </div>
            <div className="p-3 rounded-lg bg-[#131B27] border border-[#1C2633]">
              <p className="text-[10px] text-[#7A8BA0] uppercase">Current Equity</p>
              <p className="text-sm font-mono text-[#00E676] mt-1">${(1000 + progress * 8.42).toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Complete Step */}
      {step === 'complete' && (
        <div className="space-y-6">
          <div className="bg-[#0D131D] border border-[#00E676]/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-[#00E676]" />
              <h2 className="text-lg font-semibold text-white">Backtest Completed</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { label: 'Strategy', value: file || 'RCZ_v1.py' },
                { label: 'Symbol', value: config.symbol },
                { label: 'Period', value: `${config.startDate} → ${config.endDate}` },
                { label: 'Net Profit', value: '+$842.15', color: 'text-[#00E676]' },
                { label: 'Return', value: '+84.2%', color: 'text-[#00E676]' },
                { label: 'Win Rate', value: '67.8%' },
                { label: 'Profit Factor', value: '1.94' },
                { label: 'Max Drawdown', value: '8.39%', color: 'text-[#FFB020]' },
                { label: 'Trades', value: '347' },
                { label: 'Robustness', value: '84/100', color: 'text-[#00E676]' },
                { label: 'Realism', value: '87/100', color: 'text-[#00E676]' },
                { label: 'Data Quality', value: '96/100', color: 'text-[#00E676]' },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <p className="text-[10px] text-[#7A8BA0] uppercase tracking-wider">{item.label}</p>
                  <p className={`text-sm font-mono font-semibold mt-1 ${item.color || 'text-white'}`}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* AI Summary */}
            <div className="mt-6 p-4 rounded-lg bg-[#131B27] border border-[#1C2633]">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-[#00D4FF]" />
                <h3 className="text-sm font-semibold text-white">AI Assessment</h3>
              </div>
              <p className="text-sm text-[#E8F0F8] leading-relaxed">
                The strategy was profitable across the tested period but showed significant degradation during ranging market conditions.
                The strongest performance occurred during London and New York sessions, while low-volatility consolidation produced the largest cluster of losing trades.
                The strategy appears promising but requires additional validation before live deployment.
              </p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-xs text-[#7A8BA0]">Confidence: <span className="text-[#FFB020]">Moderate</span></span>
                <span className="text-xs text-[#7A8BA0]">Primary Risk: <span className="text-[#FF4D6D]">Range-market overtrading</span></span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 py-2.5 rounded-lg bg-[#00D4FF] text-[#070B12] font-semibold text-sm hover:bg-[#00D4FF]/90">View Full Analysis</button>
              <button className="flex-1 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm hover:bg-[#1C2633]">Compare Backtests</button>
              <button className="flex-1 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm hover:bg-[#1C2633]">Export Report</button>
              <button className="flex-1 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm hover:bg-[#1C2633]">Run Optimization</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
