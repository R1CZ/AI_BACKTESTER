import { Trade, BacktestMetrics, Backtest, SessionData, RegimeData, StrategyAnalysis } from '../types';

// Seeded random for stable demo data
let _seed = 98765;
const _seededRandom = () => { _seed = (_seed * 16807) % 2147483647; return (_seed - 1) / 2147483646; };

export const demoTrades: Trade[] = Array.from({ length: 347 }, (_, i) => {
  const isWin = _seededRandom() > 0.322;
  const direction = _seededRandom() > 0.48 ? 'BUY' : 'SELL';
  const basePrice = 2300 + _seededRandom() * 200;
  const move = isWin ? (_seededRandom() * 15 + 2) : -(_seededRandom() * 8 + 1);
  const entry = basePrice;
  const exit = direction === 'BUY' ? entry + move : entry - move;
  const sl = direction === 'BUY' ? entry - (_seededRandom() * 12 + 5) : entry + (_seededRandom() * 12 + 5);
  const tp = direction === 'BUY' ? entry + (_seededRandom() * 20 + 10) : entry - (_seededRandom() * 20 + 10);
  const profit = isWin ? Math.round((_seededRandom() * 80 + 5) * 100) / 100 : -Math.round((_seededRandom() * 45 + 2) * 100) / 100;
  const day = Math.floor(_seededRandom() * 28) + 1;
  const month = Math.floor(i / 30) + 1;
  const hour = Math.floor(_seededRandom() * 24);
  const minute = Math.floor(_seededRandom() * 60);
  const reasons = [
    'Liquidity Sweep + Bullish BOS + FVG Retest',
    'Market Structure Shift + Order Block',
    'Trend Continuation + ATR Breakout',
    'Supply Zone Rejection + Bearish CHoCH',
    'Demand Zone Bounce + Bullish Engulfing',
    'Session Open Momentum + VWAP Cross',
    'Swing Low Sweep + Reversal Pattern',
    'Breakout Retest + Volume Confirmation',
  ];

  return {
    id: i + 1,
    date: `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    symbol: 'XAUUSDm',
    direction: direction as 'BUY' | 'SELL',
    lot: 0.10,
    entry: Math.round(entry * 100) / 100,
    exit: Math.round(exit * 100) / 100,
    sl: Math.round(sl * 100) / 100,
    tp: Math.round(tp * 100) / 100,
    profit,
    commission: -0.70,
    swap: Math.round((_seededRandom() * -0.5) * 100) / 100,
    duration: `${Math.floor(_seededRandom() * 45) + 1}m ${Math.floor(_seededRandom() * 60)}s`,
    result: isWin ? 'WIN' as const : 'LOSS' as const,
    reason: reasons[Math.floor(_seededRandom() * reasons.length)],
  };
});

export const demoMetrics: BacktestMetrics = {
  initialBalance: 1000,
  finalBalance: 1842.15,
  netProfit: 842.15,
  returnPct: 84.21,
  grossProfit: 1523.40,
  grossLoss: -681.25,
  profitFactor: 1.94,
  expectedPayoff: 2.43,
  winRate: 67.8,
  lossRate: 32.2,
  avgWin: 6.78,
  avgLoss: -3.12,
  largestWin: 84.20,
  largestLoss: -45.30,
  maxDrawdown: 83.90,
  maxDrawdownPct: 8.39,
  recoveryFactor: 10.04,
  sharpeRatio: 2.14,
  sortinoRatio: 3.21,
  calmarRatio: 10.04,
  totalTrades: 347,
  winningTrades: 235,
  losingTrades: 112,
  avgTradeDuration: '12m 34s',
  longestWinStreak: 11,
  longestLoseStreak: 5,
};

export const demoBacktests: Backtest[] = [
  { id: 'bt-001', strategy: 'RCZ_v1.py', symbol: 'XAUUSDm', timeframe: 'M1', period: '2026-01-01 → 2026-08-31', trades: 347, netProfit: 842.15, drawdown: 8.39, winRate: 67.8, profitFactor: 1.94, robustness: 84, status: 'COMPLETED', date: '2026-08-31' },
  { id: 'bt-002', strategy: 'RCZ_v1_fixed.py', symbol: 'XAUUSDm', timeframe: 'M1', period: '2026-01-01 → 2026-08-31', trades: 331, netProfit: 1024.30, drawdown: 8.70, winRate: 71.2, profitFactor: 2.04, robustness: 87, status: 'COMPLETED', date: '2026-09-02' },
  { id: 'bt-003', strategy: 'ScalpAI_v2.py', symbol: 'EURUSD', timeframe: 'M5', period: '2026-03-01 → 2026-08-31', trades: 189, netProfit: 312.50, drawdown: 12.1, winRate: 58.4, profitFactor: 1.42, robustness: 68, status: 'COMPLETED', date: '2026-09-05' },
  { id: 'bt-004', strategy: 'MomentumX.py', symbol: 'NAS100', timeframe: 'M15', period: '2026-01-01 → 2026-06-30', trades: 94, netProfit: -127.80, drawdown: 18.4, winRate: 42.6, profitFactor: 0.82, robustness: 34, status: 'FAILED', date: '2026-09-08' },
  { id: 'bt-005', strategy: 'RCZ_v1.py', symbol: 'XAUUSDm', timeframe: 'M1', period: '2026-06-01 → 2026-09-15', trades: 156, netProfit: 421.60, drawdown: 6.2, winRate: 72.4, profitFactor: 2.31, robustness: 91, status: 'COMPLETED', date: '2026-09-15' },
];

export const demoSessions: SessionData[] = [
  { name: 'Asian', trades: 81, winRate: 58, profit: 182 },
  { name: 'London', trades: 124, winRate: 72, profit: 512 },
  { name: 'New York', trades: 102, winRate: 69, profit: 436 },
  { name: 'London/NY Overlap', trades: 40, winRate: 78, profit: 284 },
];

export const demoRegimes: RegimeData[] = [
  { name: 'Trending Bull', winRate: 78, profit: 621, trades: 98 },
  { name: 'Trending Bear', winRate: 74, profit: 483, trades: 76 },
  { name: 'Ranging', winRate: 41, profit: -218, trades: 89 },
  { name: 'High Volatility', winRate: 69, profit: 390, trades: 52 },
  { name: 'Low Volatility', winRate: 38, profit: -142, trades: 32 },
];

export const demoStrategy: StrategyAnalysis = {
  name: 'RCZ_v1.py',
  version: '1.0',
  python: '3.11',
  engine: 'MetaTrader5',
  symbol: 'XAUUSDm',
  timeframe: 'M1',
  components: ['Price Action', 'Market Structure', 'Liquidity', 'ATR', 'Trend Detection', 'Risk Management'],
  aiComponents: ['OpenRouter / DeepSeek detected'],
  warnings: [
    'External API dependency detected',
    'Hard-coded spread threshold detected',
    'Fixed lot size detected',
  ],
  issues: [
    { severity: 'HIGH', location: 'RCZ_v1.py:calculate_atr():842', problem: 'Function calculate_atr() called but not defined or imported', impact: 'Runtime error will crash the strategy on first ATR calculation', fix: 'Define the function or import from ta library: from ta.volatility import AverageTrueRange', },
    { severity: 'MEDIUM', location: 'RCZ_v1.py:on_tick():234', problem: 'Hard-coded spread threshold of 15 points', impact: 'May reject valid trades when broker spread widens temporarily', fix: 'Use ATR-based dynamic spread filter or configurable parameter', },
    { severity: 'MEDIUM', location: 'RCZ_v1.py:open_position():456', problem: 'Fixed lot size 0.10 regardless of account balance', impact: 'Risk per trade varies with account size; not properly risk-managed', fix: 'Calculate lot size based on risk percentage and stop distance', },
    { severity: 'LOW', location: 'RCZ_v1.py:check_session():678', problem: 'Session times use hardcoded UTC offsets', impact: 'May misidentify sessions during DST changes', fix: 'Use pytz or zoneinfo for timezone-aware session detection', },
  ],
};

export const demoEquityCurve: { time: number; date: string; balance: number; equity: number }[] = Array.from({ length: 200 }, (_, i) => {
  const progress = i / 200;
  const base = 1000 + progress * 842;
  const noise = Math.sin(i * 0.3) * 30 + (Math.sin(i * 1.7) * 15);
  const balance = Math.round((base + noise * 0.3) * 100) / 100;
  const equity = Math.round((base + noise) * 100) / 100;
  const month = Math.floor(i / 16.67) + 1;
  const day = Math.floor((i % 16.67) * 1.8) + 1;
  const dateStr = `2026-${String(Math.min(month, 12)).padStart(2, '0')}-${String(Math.min(day, 28)).padStart(2, '0')}`;
  const timestamp = Math.floor(new Date(dateStr).getTime() / 1000);
  return {
    time: timestamp,
    date: dateStr,
    balance: Math.max(balance, 900),
    equity: Math.max(equity, 880),
  };
});

export const demoHourlyHeatmap: number[][] = Array.from({ length: 7 }, () =>
  Array.from({ length: 24 }, () => Math.round((_seededRandom() * 200 - 50) * 100) / 100)
);

export const demoMonthlyReturns: { month: string; profit: number }[] = [
  { month: 'Jan', profit: 215 },
  { month: 'Feb', profit: -42 },
  { month: 'Mar', profit: 381 },
  { month: 'Apr', profit: 127 },
  { month: 'May', profit: -89 },
  { month: 'Jun', profit: 245 },
  { month: 'Jul', profit: 156 },
  { month: 'Aug', profit: -151 },
];

export const generateCandleData = () => {
  const data = [];
  let price = 2350;
  const startDate = new Date('2026-01-01');
  let seed = 12345;
  const seededRandom = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  
  for (let i = 0; i < 500; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + Math.floor(i / 60));
    date.setHours(Math.floor((i % 60) / 2.5));
    date.setMinutes((i % 60) * 24 % 60);
    
    const open = price;
    const change = (seededRandom() - 0.48) * 8;
    const close = open + change;
    const high = Math.max(open, close) + seededRandom() * 5;
    const low = Math.min(open, close) - seededRandom() * 5;
    
    data.push({
      time: Math.floor(date.getTime() / 1000),
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
    });
    
    price = close;
  }
  return data;
};
