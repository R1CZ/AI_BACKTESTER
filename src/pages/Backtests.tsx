import { useNavigate } from 'react-router-dom';
import { demoBacktests } from '../data/demo';
import { Search, Filter, MoreVertical } from 'lucide-react';
import { useState } from 'react';

export default function Backtests() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const filtered = demoBacktests.filter(bt => bt.strategy.toLowerCase().includes(search.toLowerCase()) || bt.symbol.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Backtests</h1>
          <p className="text-sm text-[#7A8BA0] mt-1">History of all backtest runs</p>
        </div>
        <button onClick={() => navigate('/backtests/new')} className="px-4 py-2.5 rounded-lg bg-[#00D4FF] text-[#070B12] font-semibold text-sm hover:bg-[#00D4FF]/90">
          + New Backtest
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8BA0]" />
          <input type="text" placeholder="Search strategies, symbols..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0D131D] border border-[#1C2633] text-white text-sm focus:border-[#00D4FF] outline-none" />
        </div>
        <button className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#0D131D] border border-[#1C2633] text-sm text-[#7A8BA0] hover:text-white">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1C2633] text-[#7A8BA0] text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Strategy</th>
              <th className="px-4 py-3 text-left">Symbol</th>
              <th className="px-4 py-3 text-left">TF</th>
              <th className="px-4 py-3 text-left">Period</th>
              <th className="px-4 py-3 text-right">Trades</th>
              <th className="px-4 py-3 text-right">Net Profit</th>
              <th className="px-4 py-3 text-right">Drawdown</th>
              <th className="px-4 py-3 text-right">Win Rate</th>
              <th className="px-4 py-3 text-right">PF</th>
              <th className="px-4 py-3 text-right">Robustness</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(bt => (
              <tr key={bt.id} onClick={() => navigate(`/backtests/${bt.id}`)} className="border-b border-[#1C2633]/50 hover:bg-[#131B27] cursor-pointer transition-colors">
                <td className="px-4 py-3 text-white font-medium">{bt.strategy}</td>
                <td className="px-4 py-3 text-white font-mono">{bt.symbol}</td>
                <td className="px-4 py-3 text-[#7A8BA0]">{bt.timeframe}</td>
                <td className="px-4 py-3 text-[#7A8BA0] text-xs">{bt.period}</td>
                <td className="px-4 py-3 text-right font-mono text-white">{bt.trades}</td>
                <td className={`px-4 py-3 text-right font-mono font-semibold ${bt.netProfit >= 0 ? 'text-[#00E676]' : 'text-[#FF4D6D]'}`}>
                  {bt.netProfit >= 0 ? '+' : ''}${bt.netProfit.toFixed(0)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-[#FFB020]">{bt.drawdown}%</td>
                <td className="px-4 py-3 text-right font-mono text-white">{bt.winRate}%</td>
                <td className="px-4 py-3 text-right font-mono text-white">{bt.profitFactor}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-mono font-semibold ${bt.robustness >= 80 ? 'text-[#00E676]' : bt.robustness >= 60 ? 'text-[#FFB020]' : 'text-[#FF4D6D]'}`}>{bt.robustness}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${bt.status === 'COMPLETED' ? 'bg-[#00E676]/10 text-[#00E676]' : bt.status === 'FAILED' ? 'bg-[#FF4D6D]/10 text-[#FF4D6D]' : 'bg-[#FFB020]/10 text-[#FFB020]'}`}>{bt.status}</span>
                </td>
                <td className="px-4 py-3 text-[#7A8BA0] text-xs">{bt.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
