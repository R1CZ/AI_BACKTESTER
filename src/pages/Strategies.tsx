import { useNavigate } from 'react-router-dom';
import { Bot, FileCode, Clock, TrendingUp, MoreVertical } from 'lucide-react';

const strategies = [
  { id: 's1', name: 'RCZ_v1.py', versions: 3, lastBacktest: '2026-09-15', bestProfit: 1024.30, bestWinRate: 71.2, status: 'active' },
  { id: 's2', name: 'ScalpAI_v2.py', versions: 1, lastBacktest: '2026-09-05', bestProfit: 312.50, bestWinRate: 58.4, status: 'active' },
  { id: 's3', name: 'MomentumX.py', versions: 2, lastBacktest: '2026-09-08', bestProfit: -127.80, bestWinRate: 42.6, status: 'inactive' },
  { id: 's4', name: 'BreakoutPro.py', versions: 1, lastBacktest: '2026-08-20', bestProfit: 567.20, bestWinRate: 64.8, status: 'active' },
];

export default function Strategies() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Strategies</h1>
          <p className="text-sm text-[#7A8BA0] mt-1">Manage uploaded Python trading bots</p>
        </div>
        <button onClick={() => navigate('/backtests/new')} className="px-4 py-2.5 rounded-lg bg-[#00D4FF] text-[#070B12] font-semibold text-sm hover:bg-[#00D4FF]/90">
          Upload Bot
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strategies.map(s => (
          <div key={s.id} className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5 hover:border-[#2A3A4D] transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#00D4FF]/10 flex items-center justify-center">
                  <FileCode className="w-5 h-5 text-[#00D4FF]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{s.name}</h3>
                  <p className="text-xs text-[#7A8BA0]">{s.versions} version{s.versions > 1 ? 's' : ''} • Last: {s.lastBacktest}</p>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${s.status === 'active' ? 'bg-[#00E676]/10 text-[#00E676]' : 'bg-[#7A8BA0]/10 text-[#7A8BA0]'}`}>
                {s.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-2 rounded-lg bg-[#131B27] border border-[#1C2633]">
                <p className="text-[10px] text-[#7A8BA0]">Best Profit</p>
                <p className={`text-sm font-mono font-semibold ${s.bestProfit >= 0 ? 'text-[#00E676]' : 'text-[#FF4D6D]'}`}>
                  {s.bestProfit >= 0 ? '+' : ''}${s.bestProfit.toFixed(0)}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-[#131B27] border border-[#1C2633]">
                <p className="text-[10px] text-[#7A8BA0]">Best Win Rate</p>
                <p className="text-sm font-mono font-semibold text-white">{s.bestWinRate}%</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => navigate('/backtests/new')} className="flex-1 px-3 py-2 rounded-lg bg-[#131B27] border border-[#1C2633] text-xs text-white hover:bg-[#1C2633] transition-colors">
                Run Backtest
              </button>
              <button className="px-3 py-2 rounded-lg bg-[#131B27] border border-[#1C2633] text-xs text-[#7A8BA0] hover:text-white transition-colors">
                View Code
              </button>
            </div>
          </div>
        ))}
      </div>

      {strategies.length === 0 && (
        <div className="text-center py-16 bg-[#0D131D] border border-[#1C2633] rounded-xl">
          <Bot className="w-12 h-12 text-[#4A5568] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Strategies Yet</h3>
          <p className="text-sm text-[#7A8BA0] mb-4">Upload your Python trading bot to begin analyzing performance.</p>
          <button onClick={() => navigate('/backtests/new')} className="px-4 py-2.5 rounded-lg bg-[#00D4FF] text-[#070B12] font-semibold text-sm">
            Upload Bot
          </button>
        </div>
      )}
    </div>
  );
}
