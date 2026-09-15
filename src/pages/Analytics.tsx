import { demoMetrics, demoMonthlyReturns, demoEquityCurve } from '../data/demo';
import { useEffect, useRef } from 'react';
import { createChart, ColorType, AreaSeries, HistogramSeries } from 'lightweight-charts';
import { Brain, TrendingUp, AlertTriangle, Target, Shield } from 'lucide-react';

function DrawdownChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!chartRef.current) return;
    const chart = createChart(chartRef.current, {
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: '#7A8BA0', fontSize: 11 },
      grid: { vertLines: { color: '#1C2633' }, horzLines: { color: '#1C2633' } },
      rightPriceScale: { borderColor: '#1C2633' },
      timeScale: { borderColor: '#1C2633' },
      width: chartRef.current.clientWidth, height: 200,
    });
    const series = chart.addSeries(AreaSeries, {
      lineColor: '#FF4D6D', topColor: 'rgba(255, 77, 109, 0.15)', bottomColor: 'rgba(255, 77, 109, 0.0)', lineWidth: 2,
    });
    let peak = 1000;
    const ddData = demoEquityCurve.map(d => {
      peak = Math.max(peak, d.equity);
      const dd = ((d.equity - peak) / peak) * 100;
      return { time: d.time as any, value: Math.round(dd * 100) / 100 };
    });
    series.setData(ddData);
    chart.timeScale().fitContent();
    const handleResize = () => { if (chartRef.current) chart.applyOptions({ width: chartRef.current.clientWidth }); };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); chart.remove(); };
  }, []);
  return <div ref={chartRef} className="w-full" />;
}

function MonthlyChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!chartRef.current) return;
    const chart = createChart(chartRef.current, {
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: '#7A8BA0', fontSize: 11 },
      grid: { vertLines: { color: '#1C2633' }, horzLines: { color: '#1C2633' } },
      rightPriceScale: { borderColor: '#1C2633' },
      timeScale: { borderColor: '#1C2633' },
      width: chartRef.current.clientWidth, height: 200,
    });
    const series = chart.addSeries(HistogramSeries, {
      color: '#00D4FF',
    });
    series.setData(demoMonthlyReturns.map((d, i) => {
      const month = String(i + 1).padStart(2, '0');
      const timestamp = Math.floor(new Date(`2026-${month}-15`).getTime() / 1000);
      return {
        time: timestamp as any,
        value: d.profit,
        color: d.profit >= 0 ? '#00E676' : '#FF4D6D',
      };
    }));
    chart.timeScale().fitContent();
    const handleResize = () => { if (chartRef.current) chart.applyOptions({ width: chartRef.current.clientWidth }); };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); chart.remove(); };
  }, []);
  return <div ref={chartRef} className="w-full" />;
}

export default function Analytics() {
  const m = demoMetrics;
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-[#7A8BA0] mt-1">Detailed performance analysis and risk metrics</p>
      </div>

      {/* Drawdown Chart */}
      <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Drawdown Analysis</h3>
        <DrawdownChart />
      </div>

      {/* Monthly Returns */}
      <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Monthly Returns</h3>
        <MonthlyChart />
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mt-4">
          {demoMonthlyReturns.map(m => (
            <div key={m.month} className="text-center p-2 rounded-lg bg-[#131B27] border border-[#1C2633]">
              <p className="text-[10px] text-[#7A8BA0]">{m.month}</p>
              <p className={`text-xs font-mono font-semibold ${m.profit >= 0 ? 'text-[#00E676]' : 'text-[#FF4D6D]'}`}>
                {m.profit >= 0 ? '+' : ''}${m.profit}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-[#00D4FF]" /> Risk Analysis</h3>
          <div className="space-y-3">
            {[
              { label: 'Risk per Trade', value: '1.0%', status: 'OK' },
              { label: 'Max Simultaneous Exposure', value: '3.0%', status: 'OK' },
              { label: 'Daily Loss Limit', value: '3.0%', status: 'OK' },
              { label: 'Risk of Ruin', value: '0.12%', status: 'OK' },
              { label: 'Correlation Exposure', value: 'Single Symbol', status: 'OK' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-[#7A8BA0]">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-white">{item.value}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00E676]/10 text-[#00E676]">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Brain className="w-4 h-4 text-[#00D4FF]" /> AI Risk Assessment</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-[#FFB020]/5 border border-[#FFB020]/20">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-[#FFB020]" />
                <span className="text-sm text-[#FFB020] font-medium">Risk Warning</span>
              </div>
              <p className="text-xs text-[#E8F0F8]">The bot can open multiple positions in the same direction, creating effective portfolio risk significantly above the configured single-trade risk.</p>
            </div>
            <div className="p-3 rounded-lg bg-[#00E676]/5 border border-[#00E676]/20">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-3.5 h-3.5 text-[#00E676]" />
                <span className="text-sm text-[#00E676] font-medium">Risk/Reward Ratio</span>
              </div>
              <p className="text-xs text-[#E8F0F8]">Average R:R of 2.17:1 is healthy. Stop losses are well-placed relative to market structure.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Entry Quality Analysis */}
      <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-[#00D4FF]" /> Trade Entry Quality Distribution</h3>
        <div className="grid grid-cols-5 gap-3">
          {[
            { grade: 'A+', count: 42, pct: 12, color: '#00E676' },
            { grade: 'A', count: 98, pct: 28, color: '#00D4FF' },
            { grade: 'B', count: 124, pct: 36, color: '#FFB020' },
            { grade: 'C', count: 62, pct: 18, color: '#FF8C42' },
            { grade: 'Low', count: 21, pct: 6, color: '#FF4D6D' },
          ].map(g => (
            <div key={g.grade} className="text-center p-3 rounded-lg bg-[#131B27] border border-[#1C2633]">
              <p className="text-lg font-bold" style={{ color: g.color }}>{g.grade}</p>
              <p className="text-xs text-[#7A8BA0] mt-1">{g.count} trades</p>
              <p className="text-xs font-mono text-white">{g.pct}%</p>
              <div className="mt-2 h-1.5 rounded-full bg-[#070B12]">
                <div className="h-full rounded-full" style={{ width: `${g.pct * 2.5}%`, backgroundColor: g.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
