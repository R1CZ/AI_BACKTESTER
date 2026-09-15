import { useNavigate } from 'react-router-dom';
import { demoMetrics, demoBacktests, demoSessions, demoRegimes, demoEquityCurve } from '../data/demo';
import { TrendingUp, TrendingDown, Target, Shield, Activity, BarChart3, ArrowUpRight, ArrowDownRight, FlaskConical } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { createChart, ColorType, AreaSeries, LineSeries } from 'lightweight-charts';

function MetricCard({ title, value, change, icon: Icon, color = 'primary' }: { title: string; value: string; change?: string; icon: any; color?: string }) {
  const colors: Record<string, string> = { primary: '#00D4FF', positive: '#00E676', negative: '#FF4D6D', warning: '#FFB020' };
  return (
    <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-4 hover:border-[#2A3A4D] transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#7A8BA0] uppercase tracking-wider">{title}</span>
        <Icon className="w-4 h-4" style={{ color: colors[color] }} />
      </div>
      <div className="text-2xl font-bold text-white font-mono">{value}</div>
      {change && (
        <div className={`flex items-center gap-1 mt-1 text-xs ${change.startsWith('+') || change.startsWith('↑') ? 'text-[#00E676]' : 'text-[#FF4D6D]'}`}>
          {change.startsWith('+') || change.startsWith('↑') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      )}
    </div>
  );
}

function EquityChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = createChart(chartRef.current, {
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: '#7A8BA0', fontSize: 11 },
      grid: { vertLines: { color: '#1C2633' }, horzLines: { color: '#1C2633' } },
      crosshair: { mode: 0 },
      rightPriceScale: { borderColor: '#1C2633' },
      timeScale: { borderColor: '#1C2633', timeVisible: true },
      width: chartRef.current.clientWidth,
      height: 280,
    });

    const balanceSeries = chart.addSeries(AreaSeries, {
      lineColor: '#00D4FF',
      topColor: 'rgba(0, 212, 255, 0.15)',
      bottomColor: 'rgba(0, 212, 255, 0.0)',
      lineWidth: 2,
    });

    const equitySeries = chart.addSeries(LineSeries, {
      color: '#00E676',
      lineWidth: 1,
      lineStyle: 2,
    });

    balanceSeries.setData(demoEquityCurve.map(d => ({ time: d.time as any, value: d.balance })));
    equitySeries.setData(demoEquityCurve.map(d => ({ time: d.time as any, value: d.equity })));

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartRef.current) chart.applyOptions({ width: chartRef.current.clientWidth });
    };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); chart.remove(); };
  }, []);

  return <div ref={chartRef} className="w-full" />;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const m = demoMetrics;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D131D] via-[#0D131D] to-[#131B27] border border-[#1C2633] p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF]/5 to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D4FF]/5 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse-glow" />
              <span className="text-xs text-[#00E676] font-medium uppercase tracking-wider">System Active</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">AI Backtester</h1>
            <p className="text-sm text-[#7A8BA0] max-w-lg">
              Test your Python trading bots against real MT5 market data. Upload, analyze, backtest, optimize, and understand your strategy performance with AI-powered intelligence.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => navigate('/backtests/new')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00D4FF] text-[#070B12] font-semibold text-sm hover:bg-[#00D4FF]/90 transition-all"
              >
                <FlaskConical className="w-4 h-4" />
                New Backtest
              </button>
              <button
                onClick={() => navigate('/backtests')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#131B27] border border-[#1C2633] text-white text-sm hover:bg-[#1C2633] transition-all"
              >
                View Backtests
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="grid grid-cols-3 gap-2">
              {['Upload', 'Analyze', 'Backtest', 'Optimize', 'Validate', 'Deploy'].map((step, i) => (
                <div key={step} className={`px-3 py-2 rounded-lg text-xs font-medium text-center border ${i < 3 ? 'bg-[#00D4FF]/10 border-[#00D4FF]/20 text-[#00D4FF]' : 'bg-[#131B27] border-[#1C2633] text-[#7A8BA0]'}`}>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard title="Net Profit" value={`$${m.netProfit.toFixed(2)}`} change={`+${m.returnPct}%`} icon={TrendingUp} color="positive" />
        <MetricCard title="Win Rate" value={`${m.winRate}%`} change="↑ 2.3%" icon={Target} color="primary" />
        <MetricCard title="Profit Factor" value={m.profitFactor.toFixed(2)} icon={BarChart3} color="positive" />
        <MetricCard title="Max Drawdown" value={`${m.maxDrawdownPct}%`} change="↓ 1.2%" icon={TrendingDown} color="warning" />
        <MetricCard title="Total Trades" value={m.totalTrades.toString()} icon={Activity} color="primary" />
        <MetricCard title="Robustness" value="84/100" icon={Shield} color="positive" />
      </div>

      {/* Equity Curve */}
      <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Equity Curve</h2>
            <p className="text-xs text-[#7A8BA0] mt-0.5">Balance & Equity over time</p>
          </div>
          <div className="flex gap-2">
            {['1M', '3M', '6M', 'ALL'].map(r => (
              <button key={r} className={`px-2.5 py-1 rounded text-xs ${r === 'ALL' ? 'bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20' : 'text-[#7A8BA0] hover:text-white'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <EquityChart />
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Session Performance */}
        <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Session Performance</h3>
          <div className="space-y-3">
            {demoSessions.map(s => (
              <div key={s.name} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">{s.name}</p>
                  <p className="text-xs text-[#7A8BA0]">{s.trades} trades • {s.winRate}% WR</p>
                </div>
                <span className={`text-sm font-mono font-semibold ${s.profit >= 0 ? 'text-[#00E676]' : 'text-[#FF4D6D]'}`}>
                  {s.profit >= 0 ? '+' : ''}${s.profit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Market Regimes */}
        <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Market Regime Performance</h3>
          <div className="space-y-3">
            {demoRegimes.map(r => (
              <div key={r.name} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">{r.name}</p>
                  <p className="text-xs text-[#7A8BA0]">{r.trades} trades • {r.winRate}% WR</p>
                </div>
                <span className={`text-sm font-mono font-semibold ${r.profit >= 0 ? 'text-[#00E676]' : 'text-[#FF4D6D]'}`}>
                  {r.profit >= 0 ? '+' : ''}${r.profit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Backtests */}
        <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Recent Backtests</h3>
            <button onClick={() => navigate('/backtests')} className="text-xs text-[#00D4FF] hover:underline">View All</button>
          </div>
          <div className="space-y-2">
            {demoBacktests.slice(0, 4).map(bt => (
              <button
                key={bt.id}
                onClick={() => navigate(`/backtests/${bt.id}`)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#131B27] hover:bg-[#1C2633] transition-colors text-left"
              >
                <div>
                  <p className="text-xs font-medium text-white">{bt.strategy}</p>
                  <p className="text-[10px] text-[#7A8BA0]">{bt.symbol} • {bt.timeframe} • {bt.trades} trades</p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-mono font-semibold ${bt.netProfit >= 0 ? 'text-[#00E676]' : 'text-[#FF4D6D]'}`}>
                    {bt.netProfit >= 0 ? '+' : ''}${bt.netProfit.toFixed(0)}
                  </p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${bt.status === 'COMPLETED' ? 'bg-[#00E676]/10 text-[#00E676]' : bt.status === 'FAILED' ? 'bg-[#FF4D6D]/10 text-[#FF4D6D]' : 'bg-[#FFB020]/10 text-[#FFB020]'}`}>
                    {bt.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights & Data Quality */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">AI Robustness Score</h3>
            <span className="text-2xl font-bold font-mono text-[#00E676]">84<span className="text-sm text-[#7A8BA0]">/100</span></span>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Profitability', score: 88 },
              { label: 'Risk Management', score: 82 },
              { label: 'Consistency', score: 79 },
              { label: 'Regime Stability', score: 72 },
              { label: 'Parameter Sensitivity', score: 85 },
              { label: 'Execution Realism', score: 87 },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs text-[#7A8BA0] w-36">{item.label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-[#131B27]">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#00D4FF] to-[#00E676]" style={{ width: `${item.score}%` }} />
                </div>
                <span className="text-xs font-mono text-white w-8">{item.score}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Data Quality</h3>
            <span className="text-2xl font-bold font-mono text-[#00D4FF]">96<span className="text-sm text-[#7A8BA0]">/100</span></span>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Missing Candles', status: '0.4%', ok: true },
              { label: 'Duplicate Candles', status: '0', ok: true },
              { label: 'Timestamp Gaps', status: '2 gaps', ok: false },
              { label: 'Invalid OHLC', status: '0', ok: true },
              { label: 'Zero Volume', status: '12 bars', ok: false },
              { label: 'Spread Anomalies', status: '0', ok: true },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-xs text-[#7A8BA0]">{item.label}</span>
                <span className={`text-xs font-mono ${item.ok ? 'text-[#00E676]' : 'text-[#FFB020]'}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Details Grid */}
      <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Performance Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'Initial Balance', value: `$${m.initialBalance}` },
            { label: 'Final Balance', value: `$${m.finalBalance.toFixed(2)}` },
            { label: 'Gross Profit', value: `$${m.grossProfit.toFixed(2)}` },
            { label: 'Gross Loss', value: `-$${Math.abs(m.grossLoss).toFixed(2)}` },
            { label: 'Expected Payoff', value: `$${m.expectedPayoff.toFixed(2)}` },
            { label: 'Recovery Factor', value: m.recoveryFactor.toFixed(2) },
            { label: 'Sharpe Ratio', value: m.sharpeRatio.toFixed(2) },
            { label: 'Sortino Ratio', value: m.sortinoRatio.toFixed(2) },
            { label: 'Calmar Ratio', value: m.calmarRatio.toFixed(2) },
            { label: 'Avg Win', value: `$${m.avgWin.toFixed(2)}` },
            { label: 'Avg Loss', value: `$${m.avgLoss.toFixed(2)}` },
            { label: 'Largest Win', value: `$${m.largestWin.toFixed(2)}` },
            { label: 'Largest Loss', value: `-$${Math.abs(m.largestLoss).toFixed(2)}` },
            { label: 'Win Streak', value: m.longestWinStreak.toString() },
            { label: 'Loss Streak', value: m.longestLoseStreak.toString() },
            { label: 'Avg Duration', value: m.avgTradeDuration },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p className="text-[10px] text-[#7A8BA0] uppercase tracking-wider">{item.label}</p>
              <p className="text-sm font-mono font-semibold text-white mt-1">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
