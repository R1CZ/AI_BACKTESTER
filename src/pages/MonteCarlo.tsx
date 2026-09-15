import { useState, useEffect, useRef, useMemo } from 'react';
import { createChart, ColorType, AreaSeries } from 'lightweight-charts';
import { Shuffle as ShuffleIcon, Info } from 'lucide-react';

function MonteCarloChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  // Generate stable simulation paths (seeded pseudo-random)
  const paths = useMemo(() => {
    let seed = 42;
    const seededRandom = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    return Array.from({ length: 20 }, () => {
      let equity = 1000;
      return Array.from({ length: 100 }, (_, i) => {
        const change = (seededRandom() - 0.4) * 30;
        equity = Math.max(equity + change, 500);
        const baseDate = new Date('2026-01-01');
        baseDate.setDate(baseDate.getDate() + i * 3);
        const year = baseDate.getFullYear();
        const month = String(baseDate.getMonth() + 1).padStart(2, '0');
        const day = String(baseDate.getDate()).padStart(2, '0');
        return { time: `${year}-${month}-${day}`, value: Math.round(equity * 100) / 100 };
      });
    });
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = createChart(chartRef.current, {
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: '#7A8BA0', fontSize: 11 },
      grid: { vertLines: { color: '#1C2633' }, horzLines: { color: '#1C2633' } },
      rightPriceScale: { borderColor: '#1C2633' },
      timeScale: { borderColor: '#1C2633' },
      width: chartRef.current.clientWidth, height: 300,
    });

    // Add worst case
    const worstSeries = chart.addSeries(AreaSeries, {
      lineColor: '#FF4D6D', topColor: 'rgba(255, 77, 109, 0.05)', bottomColor: 'rgba(255, 77, 109, 0.0)', lineWidth: 1,
    });
    worstSeries.setData(paths[0].map(d => ({ ...d })));

    // Add best case
    const bestSeries = chart.addSeries(AreaSeries, {
      lineColor: '#00E676', topColor: 'rgba(0, 230, 118, 0.05)', bottomColor: 'rgba(0, 230, 118, 0.0)', lineWidth: 1,
    });
    bestSeries.setData(paths[paths.length - 1].map(d => ({ ...d })));

    // Add median
    const medianSeries = chart.addSeries(AreaSeries, {
      lineColor: '#00D4FF', topColor: 'rgba(0, 212, 255, 0.1)', bottomColor: 'rgba(0, 212, 255, 0.0)', lineWidth: 2,
    });
    const medianData = paths[0].map((_, i) => {
      const values = paths.map(p => p[i].value).sort((a, b) => a - b);
      return { time: paths[0][i].time, value: values[Math.floor(values.length / 2)] };
    });
    medianSeries.setData(medianData);

    chart.timeScale().fitContent();
    const handleResize = () => { if (chartRef.current) chart.applyOptions({ width: chartRef.current.clientWidth }); };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); chart.remove(); };
  }, []);
  return <div ref={chartRef} className="w-full" />;
}

export default function MonteCarlo() {
  const [running, setRunning] = useState(false);
  const [simulations] = useState(1000);

  const startSimulation = () => {
    setRunning(true);
    setTimeout(() => setRunning(false), 2000);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Monte Carlo Analysis</h1>
          <p className="text-sm text-[#7A8BA0] mt-1">Statistical scenario analysis based on historical trade results</p>
        </div>
        <button onClick={startSimulation} disabled={running} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#00D4FF] text-[#070B12] font-semibold text-sm hover:bg-[#00D4FF]/90 disabled:opacity-50">
          <ShuffleIcon className="w-4 h-4" />
          {running ? 'Simulating...' : `Run ${simulations} Simulations`}
        </button>
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FFB020]/5 border border-[#FFB020]/20">
        <Info className="w-4 h-4 text-[#FFB020] flex-shrink-0" />
        <p className="text-xs text-[#E8F0F8]">
          Monte Carlo output is a statistical scenario analysis, not a guaranteed forecast. Results are based on historical trade distribution and assume similar future conditions.
        </p>
      </div>

      {/* Chart */}
      <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Simulation Paths ({simulations} runs)</h3>
        <MonteCarloChart />
        <div className="flex items-center gap-6 mt-4 text-xs text-[#7A8BA0]">
          <span className="flex items-center gap-2"><span className="w-3 h-0.5 bg-[#00E676]" /> Best Case</span>
          <span className="flex items-center gap-2"><span className="w-3 h-0.5 bg-[#00D4FF]" /> Median</span>
          <span className="flex items-center gap-2"><span className="w-3 h-0.5 bg-[#FF4D6D]" /> Worst Case</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Expected Return', value: '+$842', color: 'text-[#00E676]' },
          { label: 'Return Range', value: '-$312 → +$1,847', color: 'text-white' },
          { label: 'Prob. of Profit', value: '89.2%', color: 'text-[#00E676]' },
          { label: 'Prob. of Ruin', value: '0.3%', color: 'text-[#00E676]' },
          { label: 'Expected Max DD', value: '12.4%', color: 'text-[#FFB020]' },
          { label: '95% Confidence DD', value: '15.8%', color: 'text-[#FF4D6D]' },
        ].map(item => (
          <div key={item.label} className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-4 text-center">
            <p className="text-[10px] text-[#7A8BA0] uppercase tracking-wider">{item.label}</p>
            <p className={`text-sm font-mono font-bold mt-1 ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Distribution */}
      <div className="bg-[#0D131D] border border-[#1C2633] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Return Distribution</h3>
        <div className="flex items-end gap-0.5 h-32">
          {Array.from({ length: 40 }, (_, i) => {
            const x = (i - 20) / 5;
            const noise = Math.sin(i * 2.7) * 5 + Math.cos(i * 1.3) * 3;
            const height = Math.exp(-x * x / 2) * 100 + noise;
            const isPositive = i >= 20;
            return (
              <div key={i} className="flex-1 rounded-t" style={{ height: `${Math.max(height, 2)}%`, backgroundColor: isPositive ? 'rgba(0, 230, 118, 0.6)' : 'rgba(255, 77, 109, 0.6)' }} />
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-[#7A8BA0] mt-2">
          <span>-$500</span>
          <span>$0</span>
          <span>+$500</span>
          <span>+$1,000</span>
          <span>+$2,000</span>
        </div>
      </div>
    </div>
  );
}
