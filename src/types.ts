export interface Trade {
  id: number;
  date: string;
  time: string;
  symbol: string;
  direction: 'BUY' | 'SELL';
  lot: number;
  entry: number;
  exit: number;
  sl: number;
  tp: number;
  profit: number;
  commission: number;
  swap: number;
  duration: string;
  result: 'WIN' | 'LOSS' | 'BREAKEVEN';
  reason: string;
}

export interface BacktestMetrics {
  initialBalance: number;
  finalBalance: number;
  netProfit: number;
  returnPct: number;
  grossProfit: number;
  grossLoss: number;
  profitFactor: number;
  expectedPayoff: number;
  winRate: number;
  lossRate: number;
  avgWin: number;
  avgLoss: number;
  largestWin: number;
  largestLoss: number;
  maxDrawdown: number;
  maxDrawdownPct: number;
  recoveryFactor: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  avgTradeDuration: string;
  longestWinStreak: number;
  longestLoseStreak: number;
}

export interface Backtest {
  id: string;
  strategy: string;
  symbol: string;
  timeframe: string;
  period: string;
  trades: number;
  netProfit: number;
  drawdown: number;
  winRate: number;
  profitFactor: number;
  robustness: number;
  status: 'COMPLETED' | 'FAILED' | 'RUNNING' | 'STOPPED';
  date: string;
}

export interface SessionData {
  name: string;
  trades: number;
  winRate: number;
  profit: number;
}

export interface RegimeData {
  name: string;
  winRate: number;
  profit: number;
  trades: number;
}

export interface CodeIssue {
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  location: string;
  problem: string;
  impact: string;
  fix: string;
}

export interface StrategyAnalysis {
  name: string;
  version: string;
  python: string;
  engine: string;
  symbol: string;
  timeframe: string;
  components: string[];
  aiComponents: string[];
  warnings: string[];
  issues: CodeIssue[];
}
