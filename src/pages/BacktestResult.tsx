import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { demoMetrics, demoTrades, demoSessions, demoRegimes, demoEquityCurve, generateCandleData } from '../data/demo';
import { createChart, ColorType, CandlestickSeries, AreaSeries } from 'lightweight-charts';
import { Brain, Target, Shield, AlertTriangle, CheckCircle, XCircle, Download } from 'lucide-react';

function TradingChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!chartRef.current) return;
    const chart = createChart(chartRef.current, {
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: '#7A8BA0', fontSize: 11 },
      grid: { vertLines: { color: '#1C2633' }, horzLines: { color: '#1C2633' } },
      crosshair: { mode: 0 },
      rightPriceScale: { borderColor: '#1C2633' },
      timeScale: { borderColor: '#1C2633', timeVisible: true },
      width: chartRef.current.clientWidth, height: 400,
    });
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00E676', downColor: '#FF4D6D', borderUpColor: '#00E676', borderDownColor: '#FF4D6D', wickUpColor: '#00E676', wickDownColor: '#FF4D6D',
    });
    const data = generateCandleData();
    candleSeries.setData(data as any);
    chart.timeScale().fitContent();
    const handleResize = () => { if (chartRef.current) chart.applyOptions({ width: chartRef.current.clientWidth }); };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); chart.remove(); };
  }, []);
  return <div ref={chartRef} className="w-full" />;
}

function EquityChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!chartRef.current) return;
    const chart = createChart(chartRef.current, {
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: '#7A8BA0', fontSize: 11 },
      grid: { vertLines: { color: '#1C2633' }, horzLines: { color: '#1C2633' } },
      rightPriceScale: { borderColor: '#1C2633' },
      timeScale: { borderColor: '#1C2633' },
      width: chartRef.current.clientWidth, height: 250,
    });
    const series = chart.addSeries(AreaSeries, {
      lineColor: '#00D4FF', topColor: 'rgba(0, 212, 255, 0.12)', bottomColor: 'rgba(0, 212, 255, 0.0)', lineWidth: 2,
    });
    series.setData(demoEquityCurve.map(d => ({ time: d.date as any, value: d.equity })));
    chart.timeScale().fitContent();
    const handleResize = () => { if (chartRef.current) chart.applyOptions({ width: chartRef.current.clientWidth }); };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); chart.remove(); };
  }, []);
  return <div ref={chartRef} className="w-full" />;
}

export default function BacktestResult() {
  const { id } = useParams();
  const [tab, setTab] = useState<'overview' | 'trades' | 'analysis' | 'sessions' | 'regimes' | 'code'>('overview');
  const [filter, setFilter] = useState<'ALL' | 'BUY' | 'SELL' | 'WIN' | 'LOSS'>('ALL');
  const m = demoMetrics;

  const filteredTrades = demoTrades.filter(t => {
    if (filter === 'ALL') return true;
    if (filter === 'BUY' || filter === 'SELL') return t.direction === filter;
    if (filter === 'WIN' || filter === 'LOSS') return t.result === filter;
    return true;
  });

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Backtest #{id || '001'}</h1>
          <p className="text-sm text-[#7A8BA0] mt-1">RCZ_v1.py • XAUUSDm • M1 • 2026-01-01 → 2026-08-31</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#131B27] border border-[#1C2633] text-sm text-white hover:bg-[#1C2633]">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Key Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: 'Balance', value: `$${m.finalBalance.toFixed(0)}`, color: 'text-[#00E676]' },
          { label: 'Net Profit', value: `+$${m.netProfit.toFixed(0)}`, color: 'text-[#00E676]' },
          { label: 'Return', value: `+${m.returnPct}%`, color: 'text-[#00E676]' },
          { label: 'Win Rate', value: `${m.winRate}%`, color: 'text-[#00D4FF]' },
          { label: 'Profit Factor', value: m.profitFactor.toFixed(2), color: 'text-[#00D4FF]' },
          { label: 'Drawdown', value: `${m.maxDrawdownPct}%`, color: 'text-[#FFB020]' },
          { label: 'Trades', value: m.totalTrades.toString(), color: 'text-white' },
          { label: 'Robustness', value: '84/100', color: 'text-[#00E676]' },
        ].map(item => (
          <div key={item.label} className="bg-[#0D131D] border border-[#1C2633] rounded-lg p-3 text-center">
            <p className="text-[10px] text-[#7A8BA0] uppercase">{item.label}</p>
            <p className={`text-lg font-bold font-mono ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#1C2633]">
        {(['overview', 'trades', 'analysis', 'sessions', 'regimes', 'code'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-medium capitalize transition-all ${tab === t ? 'text-[#00D4FF] border-b-2 border-[#00D4FF]' : 'text-[#7A8BA0] hover:text-white'}`}>
            {t === 'code' ? 'Source Code' : t}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Price Chart & Trade Markers</h3>
            <TradingChart />
          </div>
          <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Equity Curve</h3>
            <EquityChart />
          </div>
          {/* Technical Log */}
          <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">System Log</h3>
            <div className="bg-[#070B12] rounded-lg p-3 font-mono text-xs space-y-1 max-h-48 overflow-y-auto">
              {[
                { time: '17:43:22', level: 'INFO', msg: 'MT5 connection established' },
                { time: '17:43:24', level: 'INFO', msg: 'Loaded 1,842,221 candles for XAUUSDm M1' },
                { time: '17:43:25', level: 'INFO', msg: 'Strategy initialized: RCZ_v1.py' },
                { time: '17:43:25', level: 'INFO', msg: 'Data quality check: 96/100 — 0.4% missing candles' },
                { time: '17:43:26', level: 'INFO', msg: 'Backtest started: 2026-01-01 → 2026-08-31' },
                { time: '17:44:01', level: 'WARN', msg: 'Spread exceeded configured limit (23 > 15 points)' },
                { time: '17:44:22', level: 'INFO', msg: 'BUY trade #1 simulated @ 2315.42 | SL: 2303.10 | TP: 2331.50' },
                { time: '17:44:24', level: 'INFO', msg: 'BUY #1 closed | Profit: +$65.20 | Duration: 7m 21s' },
                { time: '17:45:12', level: 'INFO', msg: 'SELL trade #2 simulated @ 2318.76 | SL: 2329.40 | TP: 2302.10' },
                { time: '17:45:34', level: 'INFO', msg: 'SELL #2 closed | Profit: -$23.40 | Duration: 22s' },
                { time: '17:46:01', level: 'INFO', msg: 'Processing bars: 500,000 / 1,842,221 (27.1%)' },
                { time: '17:47:15', level: 'WARN', msg: 'Multiple entries detected within same structure (trades #47-#49)' },
                { time: '17:48:30', level: 'INFO', msg: 'Processing bars: 1,000,000 / 1,842,221 (54.3%)' },
                { time: '17:50:02', level: 'INFO', msg: 'Backtest completed | 347 trades | Net: +$842.15' },
                { time: '17:50:03', level: 'INFO', msg: 'AI analysis started...' },
                { time: '17:50:18', level: 'INFO', msg: 'AI analysis completed | Robustness: 84/100' },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[#4A5568] flex-shrink-0">{log.time}</span>
                  <span className={`flex-shrink-0 w-10 ${log.level === 'WARN' ? 'text-[#FFB020]' : log.level === 'ERROR' ? 'text-[#FF4D6D]' : 'text-[#00D4FF]'}`}>{log.level}</span>
                  <span className={`${log.level === 'WARN' ? 'text-[#FFB020]' : 'text-[#7A8BA0]'}`}>{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trades Tab */}
      {tab === 'trades' && (
        <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1C2633] flex items-center justify-between">
            <div className="flex gap-2">
              {(['ALL', 'BUY', 'SELL', 'WIN', 'LOSS'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-2.5 py-1 rounded text-xs ${filter === f ? 'bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20' : 'text-[#7A8BA0] hover:text-white'}`}>
                  {f}
                </button>
              ))}
            </div>
            <span className="text-xs text-[#7A8BA0]">{filteredTrades.length} trades</span>
          </div>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-[#0D131D]">
                <tr className="text-[#7A8BA0] uppercase tracking-wider">
                  <th className="px-3 py-2 text-left">#</th>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Time</th>
                  <th className="px-3 py-2 text-left">Dir</th>
                  <th className="px-3 py-2 text-right">Lot</th>
                  <th className="px-3 py-2 text-right">Entry</th>
                  <th className="px-3 py-2 text-right">Exit</th>
                  <th className="px-3 py-2 text-right">Profit</th>
                  <th className="px-3 py-2 text-left">Duration</th>
                  <th className="px-3 py-2 text-left">Reason</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrades.slice(0, 100).map(t => (
                  <tr key={t.id} className="border-t border-[#1C2633]/50 hover:bg-[#131B27] transition-colors">
                    <td className="px-3 py-2 text-[#7A8BA0] font-mono">{t.id}</td>
                    <td className="px-3 py-2 text-white font-mono">{t.date}</td>
                    <td className="px-3 py-2 text-white font-mono">{t.time}</td>
                    <td className="px-3 py-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${t.direction === 'BUY' ? 'bg-[#00E676]/10 text-[#00E676]' : 'bg-[#FF4D6D]/10 text-[#FF4D6D]'}`}>{t.direction}</span>
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-white">{t.lot.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right font-mono text-white">{t.entry.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right font-mono text-white">{t.exit.toFixed(2)}</td>
                    <td className={`px-3 py-2 text-right font-mono font-semibold ${t.profit >= 0 ? 'text-[#00E676]' : 'text-[#FF4D6D]'}`}>
                      {t.profit >= 0 ? '+' : ''}{t.profit.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-[#7A8BA0]">{t.duration}</td>
                    <td className="px-3 py-2 text-[#7A8BA0] max-w-[200px] truncate">{t.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analysis Tab */}
      {tab === 'analysis' && (
        <div className="space-y-4">
          <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-[#00D4FF]" />
              <h3 className="text-sm font-semibold text-white">AI Strategy Intelligence</h3>
              <span className="ml-auto text-sm font-mono text-[#00D4FF]">Score: 82/100</span>
            </div>
            <p className="text-sm text-[#E8F0F8] leading-relaxed mb-4">
              The strategy demonstrates strong profitability during directional conditions but becomes unstable during low-volatility consolidation. Entry quality is high during trending markets with proper BOS confirmation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs text-[#00E676] font-semibold mb-2 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Strengths</h4>
                <ul className="space-y-1.5 text-sm text-[#E8F0F8]">
                  <li>✓ Strong trend participation</li>
                  <li>✓ High-quality breakout entries</li>
                  <li>✓ Controlled average loss</li>
                  <li>✓ Effective take-profit placement</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs text-[#FF4D6D] font-semibold mb-2 flex items-center gap-1"><XCircle className="w-3 h-3" /> Weaknesses</h4>
                <ul className="space-y-1.5 text-sm text-[#E8F0F8]">
                  <li>⚠ Excessive entries during ranging markets</li>
                  <li>⚠ Sell signals frequently fail after liquidity sweeps</li>
                  <li>⚠ Trailing stop activates too early</li>
                  <li>⚠ Multiple entries within same structure</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Backtest Validity */}
          <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-[#00D4FF]" /> Backtest Validity</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Look-Ahead Bias', status: 'PASS', color: 'text-[#00E676]' },
                { label: 'Data Leakage', status: 'PASS', color: 'text-[#00E676]' },
                { label: 'Future Candle Access', status: 'WARNING', color: 'text-[#FFB020]' },
                { label: 'Repainting', status: 'NOT DETECTED', color: 'text-[#00E676]' },
              ].map(v => (
                <div key={v.label} className="p-3 rounded-lg bg-[#131B27] border border-[#1C2633] text-center">
                  <p className="text-[10px] text-[#7A8BA0] uppercase">{v.label}</p>
                  <p className={`text-sm font-bold mt-1 ${v.color}`}>{v.status}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Realism Score */}
          <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Backtest Realism Score</h3>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold font-mono text-[#00D4FF]">87<span className="text-lg text-[#7A8BA0]">/100</span></div>
              <div className="flex-1 space-y-2">
                {[
                  { label: 'Spread Realism', score: 92 },
                  { label: 'Slippage Model', score: 85 },
                  { label: 'Commission', score: 95 },
                  { label: 'Execution Model', score: 78 },
                  { label: 'Data Quality', score: 96 },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-xs text-[#7A8BA0] w-32">{item.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-[#131B27]">
                      <div className="h-full rounded-full bg-[#00D4FF]" style={{ width: `${item.score}%` }} />
                    </div>
                    <span className="text-xs font-mono text-white w-8">{item.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sessions Tab */}
      {tab === 'sessions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {demoSessions.map(s => (
              <div key={s.name} className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
                <h4 className="text-sm font-semibold text-white mb-3">{s.name}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-[#7A8BA0]">Trades</span><span className="text-white font-mono">{s.trades}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#7A8BA0]">Win Rate</span><span className="text-white font-mono">{s.winRate}%</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#7A8BA0]">Profit</span><span className={`font-mono font-semibold ${s.profit >= 0 ? 'text-[#00E676]' : 'text-[#FF4D6D]'}`}>{s.profit >= 0 ? '+' : ''}${s.profit}</span></div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-[#131B27]">
                  <div className="h-full rounded-full bg-[#00D4FF]" style={{ width: `${s.winRate}%` }} />
                </div>
              </div>
            ))}
          </div>
          {/* Hourly Heatmap */}
          <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">24-Hour Performance Heatmap</h3>
            <div className="grid grid-cols-24 gap-0.5">
              {Array.from({ length: 24 }, (_, h) => {
                const profit = (Math.random() * 200 - 50);
                const intensity = Math.min(Math.abs(profit) / 100, 1);
                const color = profit >= 0 ? `rgba(0, 230, 118, ${intensity})` : `rgba(255, 77, 109, ${intensity})`;
                return (
                  <div key={h} className="text-center">
                    <div className="h-12 rounded" style={{ backgroundColor: color }} title={`${h}:00 - $${profit.toFixed(0)}`} />
                    <span className="text-[9px] text-[#7A8BA0] mt-1">{String(h).padStart(2, '0')}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-[#7A8BA0]">
              <span>Best Window: <span className="text-[#00E676]">08:00-11:00 (London Open)</span></span>
              <span>Worst Window: <span className="text-[#FF4D6D]">22:00-01:00 (Late Asian)</span></span>
            </div>
          </div>
        </div>
      )}

      {/* Regimes Tab */}
      {tab === 'regimes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoRegimes.map(r => (
              <div key={r.name} className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
                <h4 className="text-sm font-semibold text-white mb-3">{r.name}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-[#7A8BA0]">Trades</span><span className="text-white font-mono">{r.trades}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#7A8BA0]">Win Rate</span><span className="text-white font-mono">{r.winRate}%</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#7A8BA0]">Profit</span><span className={`font-mono font-semibold ${r.profit >= 0 ? 'text-[#00E676]' : 'text-[#FF4D6D]'}`}>{r.profit >= 0 ? '+' : ''}${r.profit}</span></div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-[#131B27]">
                  <div className={`h-full rounded-full ${r.profit >= 0 ? 'bg-[#00E676]' : 'bg-[#FF4D6D]'}`} style={{ width: `${r.winRate}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-[#0D131D] border border-[#FFB020]/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-[#FFB020]" />
              <h3 className="text-sm font-semibold text-[#FFB020]">AI Warning</h3>
            </div>
            <p className="text-sm text-[#E8F0F8]">
              The strategy shows significant degradation in ranging and low-volatility conditions. Win rate drops to 38-41% during these regimes.
              Consider adding a regime filter or volatility threshold to avoid trading during unfavorable conditions.
            </p>
          </div>
        </div>
      )}

      {/* Code Tab */}
      {tab === 'code' && (
        <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1C2633] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">RCZ_v1.py</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00D4FF]/10 text-[#00D4FF]">Python 3.11</span>
            </div>
            <div className="flex gap-2">
              <button className="px-2.5 py-1 rounded text-xs bg-[#131B27] border border-[#1C2633] text-[#7A8BA0] hover:text-white">Download</button>
              <button className="px-2.5 py-1 rounded text-xs bg-[#FFB020]/10 border border-[#FFB020]/20 text-[#FFB020]">AI Fix Suggestions</button>
            </div>
          </div>
          <div className="bg-[#070B12] p-4 font-mono text-xs overflow-x-auto max-h-[500px] overflow-y-auto">
            <pre className="text-[#7A8BA0]">
{`import MetaTrader5 as mt5
import numpy as np
from datetime import datetime
import time

# Strategy: RCZ v1.0
# Symbol: XAUUSDm
# Timeframe: M1
# Author: AI Trading Lab

class RCZStrategy:
    def __init__(self):
        self.symbol = "XAUUSDm"
        self.timeframe = mt5.TIMEFRAME_M1
        self.lot_size = 0.10  # Fixed lot size
        self.magic_number = 202601
        self.max_spread = 15  # Hard-coded spread threshold
        self.atr_multiplier_sl = 1.5
        self.atr_multiplier_tp = 2.0
        
    def initialize(self):
        """Initialize MT5 connection"""
        if not mt5.initialize():
            print(f"MT5 initialization failed: {mt5.last_error()}")
            return False
        return True
    
    def calculate_atr(self, data, period=14):
        """Calculate Average True Range"""
        # BUG: This function is called before definition at line 842
        high = data['high']
        low = data['low']
        close = data['close']
        tr = np.maximum(high - low, 
              np.maximum(abs(high - np.roll(close, 1)),
                        abs(low - np.roll(close, 1))))
        atr = np.convolve(tr, np.ones(period)/period, mode='valid')
        return atr
    
    def detect_liquidity_sweep(self, candles):
        """Detect liquidity sweep pattern"""
        if len(candles) < 20:
            return False
        recent_lows = [c['low'] for c in candles[-20:]]
        swing_low = min(recent_lows[:-3])
        current_low = candles[-1]['low']
        return current_low < swing_low and candles[-1]['close'] > swing_low
    
    def detect_bos(self, candles, direction='bullish'):
        """Detect Break of Structure"""
        if len(candles) < 10:
            return False
        if direction == 'bullish':
            highs = [c['high'] for c in candles[-10:]]
            return candles[-1]['close'] > max(highs[:-1])
        else:
            lows = [c['low'] for c in candles[-10:]]
            return candles[-1]['close'] < min(lows[:-1])
    
    def detect_fvg(self, candles):
        """Detect Fair Value Gap"""
        if len(candles) < 3:
            return False, None
        c1, c2, c3 = candles[-3], candles[-2], candles[-1]
        # Bullish FVG
        if c3['low'] > c1['high']:
            return True, 'bullish'
        # Bearish FVG
        if c3['high'] < c1['low']:
            return True, 'bearish'
        return False, None
    
    def check_signal(self):
        """Main signal generation"""
        candles = self.get_candles(100)
        if candles is None:
            return None
        
        # Check spread
        tick = mt5.symbol_info_tick(self.symbol)
        spread = (tick.ask - tick.bid) / mt5.symbol_info(self.symbol).point
        if spread > self.max_spread:
            return None
        
        # Calculate indicators
        atr = self.calculate_atr(candles)
        current_atr = atr[-1]
        
        # Detect patterns
        liq_sweep = self.detect_liquidity_sweep(candles)
        bos_bull = self.detect_bos(candles, 'bullish')
        bos_bear = self.detect_bos(candles, 'bearish')
        has_fvg, fvg_type = self.detect_fvg(candles)
        
        # Entry logic
        if liq_sweep and bos_bull and has_fvg and fvg_type == 'bullish':
            return {
                'direction': 'BUY',
                'sl': tick.ask - current_atr * self.atr_multiplier_sl,
                'tp': tick.ask + current_atr * self.atr_multiplier_tp,
                'reason': 'Liquidity Sweep + Bullish BOS + FVG Retest'
            }
        elif liq_sweep and bos_bear and has_fvg and fvg_type == 'bearish':
            return {
                'direction': 'SELL',
                'sl': tick.bid + current_atr * self.atr_multiplier_sl,
                'tp': tick.bid - current_atr * self.atr_multiplier_tp,
                'reason': 'Liquidity Sweep + Bearish BOS + FVG Retest'
            }
        return None
    
    def execute_trade(self, signal):
        """Execute trade via MT5"""
        tick = mt5.symbol_info_tick(self.symbol)
        price = tick.ask if signal['direction'] == 'BUY' else tick.bid
        order_type = mt5.ORDER_TYPE_BUY if signal['direction'] == 'BUY' else mt5.ORDER_TYPE_SELL
        
        request = {
            "action": mt5.TRADE_ACTION_DEAL,
            "symbol": self.symbol,
            "volume": self.lot_size,
            "type": order_type,
            "price": price,
            "sl": signal['sl'],
            "tp": signal['tp'],
            "deviation": 20,
            "magic": self.magic_number,
            "comment": signal['reason'],
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": mt5.ORDER_FILLING_IOC,
        }
        result = mt5.order_send(request)
        return result
    
    def run(self):
        """Main loop"""
        if not self.initialize():
            return
        print(f"RCZ Strategy running on {self.symbol}")
        while True:
            signal = self.check_signal()
            if signal:
                self.execute_trade(signal)
            time.sleep(1)

if __name__ == "__main__":
    strategy = RCZStrategy()
    strategy.run()`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
