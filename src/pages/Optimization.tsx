import { useState } from 'react';
import { Zap, Play, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const optimizationResults = [
  { param: 'SL ATR Multiplier', current: 1.5, best: 1.8, improvement: '+12%', robust: true },
  { param: 'TP ATR Multiplier', current: 2.0, best: 2.4, improvement: '+8%', robust: true },
  { param: 'ADX Threshold', current: 25, best: 22, improvement: '+5%', robust: false },
  { param: 'Spread Limit', current: 15, best: 20, improvement: '+3%', robust: true },
  { param: 'Trailing Distance', current: 15, best: 25, improvement: '+15%', robust: true },
  { param: 'Risk %', current: 1.0, best: 0.8, improvement: '-2% DD', robust: true },
];

const walkForwardData = [
  { train: 'Jan → Mar', validate: 'Apr', trainProfit: 312, validateProfit: 84, stable: true },
  { train: 'Feb → Apr', validate: 'May', trainProfit: 287, validateProfit: -42, stable: false },
  { train: 'Mar → May', validate: 'Jun', trainProfit: 356, validateProfit: 127, stable: true },
  { train: 'Apr → Jun', validate: 'Jul', trainProfit: 298, validateProfit: 95, stable: true },
  { train: 'May → Jul', validate: 'Aug', trainProfit: 412, validateProfit: -89, stable: false },
];

export default function Optimization() {
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState<'params' | 'walkforward'>('params');

  const startOptimization = () => {
    setRunning(true);
    setTimeout(() => setRunning(false), 3000);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Optimization</h1>
          <p className="text-sm text-[#7A8BA0] mt-1">Parameter sensitivity analysis and walk-forward testing</p>
        </div>
        <button onClick={startOptimization} disabled={running} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#00D4FF] text-[#070B12] font-semibold text-sm hover:bg-[#00D4FF]/90 disabled:opacity-50">
          {running ? <Zap className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4" />}
          {running ? 'Running...' : 'Run Optimization'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#1C2633]">
        <button onClick={() => setTab('params')} className={`px-4 py-2.5 text-sm font-medium transition-all ${tab === 'params' ? 'text-[#00D4FF] border-b-2 border-[#00D4FF]' : 'text-[#7A8BA0] hover:text-white'}`}>
          Parameter Sensitivity
        </button>
        <button onClick={() => setTab('walkforward')} className={`px-4 py-2.5 text-sm font-medium transition-all ${tab === 'walkforward' ? 'text-[#00D4FF] border-b-2 border-[#00D4FF]' : 'text-[#7A8BA0] hover:text-white'}`}>
          Walk-Forward Analysis
        </button>
      </div>

      {tab === 'params' && (
        <div className="space-y-4">
          <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Parameter Impact Analysis</h3>
            <div className="space-y-3">
              {optimizationResults.map(r => (
                <div key={r.param} className="flex items-center justify-between p-3 rounded-lg bg-[#131B27] border border-[#1C2633]">
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">{r.param}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-[#7A8BA0]">Current: <span className="text-white font-mono">{r.current}</span></span>
                      <span className="text-xs text-[#7A8BA0]">Best: <span className="text-[#00D4FF] font-mono">{r.best}</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-semibold text-[#00E676]">{r.improvement}</span>
                    {r.robust ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00E676]/10 text-[#00E676]">Robust</span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FFB020]/10 text-[#FFB020]">Overfit Risk</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0D131D] border border-[#FFB020]/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-[#FFB020]" />
              <h3 className="text-sm font-semibold text-[#FFB020]">Overfitting Warning</h3>
            </div>
            <p className="text-sm text-[#E8F0F8]">
              ADX Threshold optimization shows in-sample improvement but may not generalize to out-of-sample data.
              This parameter was flagged as potentially overfit. Always validate with walk-forward testing before applying changes.
            </p>
          </div>
        </div>
      )}

      {tab === 'walkforward' && (
        <div className="space-y-4">
          <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Walk-Forward Results</h3>
            <div className="space-y-3">
              {walkForwardData.map((wf, i) => (
                <div key={i} className="p-3 rounded-lg bg-[#131B27] border border-[#1C2633]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-[10px] text-[#7A8BA0] uppercase">Train</p>
                        <p className="text-sm text-white font-mono">{wf.train}</p>
                      </div>
                      <span className="text-[#4A5568]">→</span>
                      <div>
                        <p className="text-[10px] text-[#7A8BA0] uppercase">Validate</p>
                        <p className="text-sm text-white font-mono">{wf.validate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] text-[#7A8BA0]">Train P&L</p>
                        <p className="text-sm font-mono text-[#00E676]">+${wf.trainProfit}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-[#7A8BA0]">Validate P&L</p>
                        <p className={`text-sm font-mono ${wf.validateProfit >= 0 ? 'text-[#00E676]' : 'text-[#FF4D6D]'}`}>
                          {wf.validateProfit >= 0 ? '+' : ''}${wf.validateProfit}
                        </p>
                      </div>
                      {wf.stable ? (
                        <CheckCircle className="w-4 h-4 text-[#00E676]" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-[#FFB020]" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Walk-Forward Stability Score</h3>
                <p className="text-xs text-[#7A8BA0] mt-1">3/5 windows passed validation</p>
              </div>
              <div className="text-3xl font-bold font-mono text-[#FFB020]">60<span className="text-lg text-[#7A8BA0]">/100</span></div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-[#131B27]">
              <div className="h-full rounded-full bg-[#FFB020]" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
