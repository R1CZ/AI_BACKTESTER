export interface AnalysisResult {
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

export interface CodeIssue {
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  location: string;
  problem: string;
  impact: string;
  fix: string;
}

export function analyzePythonCode(filename: string, code: string): AnalysisResult {
  const lines = code.split('\n');
  const components: string[] = [];
  const aiComponents: string[] = [];
  const warnings: string[] = [];
  const issues: CodeIssue[] = [];

  // Detect Python version from comments or imports
  let python = '3.x';
  if (code.includes('python_requires') || code.includes('python_version')) {
    const match = code.match(/python[_\s]*(?:requires|version)[^\d]*(\d+\.\d+)/i);
    if (match) python = match[1];
  }

  // Detect trading engine
  let engine = 'Unknown';
  if (code.includes('import MetaTrader5') || code.includes('from MetaTrader5')) {
    engine = 'MetaTrader5';
  } else if (code.includes('mt5.') || code.includes('MT5')) {
    engine = 'MetaTrader5';
  } else if (code.includes('binance') || code.includes('Binance')) {
    engine = 'Binance';
  } else if (code.includes('ccxt')) {
    engine = 'CCXT';
  }

  // Detect symbol
  let symbol = 'Not detected';
  const symbolPatterns = [
    /symbol\s*=\s*["']([^"']+)["']/i,
    /self\.symbol\s*=\s*["']([^"']+)["']/i,
    /SYMBOL\s*=\s*["']([^"']+)["']/i,
    /pair\s*=\s*["']([^"']+)["']/i,
  ];
  for (const pattern of symbolPatterns) {
    const match = code.match(pattern);
    if (match) {
      symbol = match[1];
      break;
    }
  }

  // Detect timeframe
  let timeframe = 'Not detected';
  const timeframePatterns = [
    /timeframe\s*=\s*["']?([MHDW]\d+)["']?/i,
    /TIMEFRAME\s*=\s*["']?([MHDW]\d+)["']?/i,
    /interval\s*=\s*["']?([MHDW]\d+)["']?/i,
    /mt5\.TIMEFRAME_(\w+)/i,
  ];
  for (const pattern of timeframePatterns) {
    const match = code.match(pattern);
    if (match) {
      timeframe = match[1].toUpperCase();
      break;
    }
  }

  // Detect strategy components
  const componentChecks = [
    { pattern: /price[_\s]*action|candlestick|pattern/i, name: 'Price Action' },
    { pattern: /market[_\s]*structure|BOS|CHoCH|break.*structure/i, name: 'Market Structure' },
    { pattern: /liquidity|sweep/i, name: 'Liquidity' },
    { pattern: /ATR|AverageTrueRange|atr/i, name: 'ATR' },
    { pattern: /trend|moving.*average|MA\d*|EMA|SMA/i, name: 'Trend Detection' },
    { pattern: /risk.*management|position.*size|lot.*size/i, name: 'Risk Management' },
    { pattern: /RSI|RelativeStrength/i, name: 'RSI' },
    { pattern: /MACD/i, name: 'MACD' },
    { pattern: /Bollinger|BB/i, name: 'Bollinger Bands' },
    { pattern: /support|resistance/i, name: 'Support/Resistance' },
    { pattern: /order.*block|OB/i, name: 'Order Blocks' },
    { pattern: /FVG|FairValueGap|fair.*value/i, name: 'Fair Value Gaps' },
    { pattern: /volume/i, name: 'Volume Analysis' },
    { pattern: /ADX|AverageDirectional/i, name: 'ADX' },
    { pattern: /stochastic/i, name: 'Stochastic' },
    { pattern: /VWAP/i, name: 'VWAP' },
  ];

  for (const check of componentChecks) {
    if (check.pattern.test(code)) {
      components.push(check.name);
    }
  }

  // Detect AI/ML components
  const aiPatterns = [
    { pattern: /openai|gpt|chatgpt/i, name: 'OpenAI / GPT' },
    { pattern: /openrouter/i, name: 'OpenRouter' },
    { pattern: /deepseek/i, name: 'DeepSeek' },
    { pattern: /ollama/i, name: 'Ollama' },
    { pattern: /tensorflow|keras/i, name: 'TensorFlow' },
    { pattern: /pytorch|torch/i, name: 'PyTorch' },
    { pattern: /sklearn|scikit/i, name: 'Scikit-learn' },
    { pattern: /anthropic|claude/i, name: 'Anthropic / Claude' },
  ];

  for (const pattern of aiPatterns) {
    if (pattern.pattern.test(code)) {
      aiComponents.push(pattern.name);
    }
  }

  // Detect warnings
  if (/requests\.get|requests\.post|httpx|aiohttp/i.test(code)) {
    warnings.push('External API dependency detected');
  }
  if (/max_spread\s*=\s*\d+|spread.*limit.*=.*\d+/i.test(code)) {
    warnings.push('Hard-coded spread threshold detected');
  }
  if (/lot_size\s*=\s*0\.\d+|volume\s*=\s*0\.\d+/i.test(code) && !/risk.*per.*trade/i.test(code)) {
    warnings.push('Fixed lot size detected');
  }
  if (/time\.sleep/i.test(code)) {
    warnings.push('Blocking sleep calls detected - may cause timing issues');
  }
  if (/except.*:/i.test(code) && !/except.*Exception/i.test(code)) {
    warnings.push('Broad exception handling detected');
  }

  // Detect code issues
  // Check for undefined functions
  const functionCalls = code.match(/\b([a-z_][a-z0-9_]*)\s*\(/gi) || [];
  const functionDefs = code.match(/def\s+([a-z_][a-z0-9_]*)/gi) || [];
  const importedNames = code.match(/from\s+\S+\s+import\s+(.+)/gi) || [];
  
  const calledFunctions = new Set(functionCalls.map(f => f.replace('(', '').toLowerCase()));
  const definedFunctions = new Set(functionDefs.map(f => f.replace('def ', '').toLowerCase()));
  
  // Check for common MT5 issues
  if (code.includes('mt5.initialize') && !code.includes('mt5.shutdown')) {
    issues.push({
      severity: 'LOW',
      location: `${filename}:global`,
      problem: 'MT5 initialized but never shut down',
      impact: 'May leave MT5 terminal in inconsistent state',
      fix: 'Add mt5.shutdown() in cleanup or finally block',
    });
  }

  // Check for hardcoded values
  const hardcodedPatterns = [
    { pattern: /sl\s*=\s*price\s*[-+]\s*\d+/, name: 'Hard-coded stop loss distance' },
    { pattern: /tp\s*=\s*price\s*[-+]\s*\d+/, name: 'Hard-coded take profit distance' },
    { pattern: /magic\s*=\s*\d+|magic_number\s*=\s*\d+/, name: 'Hard-coded magic number' },
  ];

  for (const check of hardcodedPatterns) {
    if (check.pattern.test(code)) {
      issues.push({
        severity: 'MEDIUM',
        location: `${filename}:global`,
        problem: check.name,
        impact: 'Reduces strategy flexibility and adaptability',
        fix: 'Make configurable via parameters or settings file',
      });
    }
  }

  // Check for missing error handling
  if (code.includes('mt5.order_send') && !code.includes('result.retcode') && !code.includes('result.comment')) {
    issues.push({
      severity: 'HIGH',
      location: `${filename}:order_send`,
      problem: 'Order execution result not checked',
      impact: 'Failed orders will not be detected, leading to incorrect state',
      fix: 'Check result.retcode and handle errors appropriately',
    });
  }

  // Check for threading issues
  if (code.includes('threading.Thread') && code.includes('mt5.')) {
    issues.push({
      severity: 'MEDIUM',
      location: `${filename}:threading`,
      problem: 'MT5 API used in multi-threaded context',
      impact: 'MT5 Python API is not thread-safe, may cause crashes',
      fix: 'Use single-threaded architecture or proper synchronization',
    });
  }

  // Check for look-ahead bias
  if (code.includes('shift(-1)') || code.includes('shift(-2)') || /\[\d+\].*\[\d+\s*\+\s*1\]/.test(code)) {
    issues.push({
      severity: 'HIGH',
      location: `${filename}:data_processing`,
      problem: 'Potential look-ahead bias detected',
      impact: 'Backtest results will be unrealistic and not reproducible in live trading',
      fix: 'Ensure all indicators use only past data, no future values',
    });
  }

  return {
    name: filename,
    version: '1.0',
    python,
    engine,
    symbol,
    timeframe,
    components,
    aiComponents,
    warnings,
    issues,
  };
}
