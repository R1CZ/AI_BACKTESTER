# AI Backtester

A professional web-based platform for testing, analyzing, and optimizing Python automated trading bots against real MetaTrader 5 (MT5) market data.

![AI Backtester](https://img.shields.io/badge/AI-Backtester-00D4FF?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss)

## 🎯 Overview

AI Backtester is a complete trading research platform that combines:

- **Python Bot Upload** — Drag & drop your `.py` trading bot
- **AI Code Intelligence** — Automatic strategy analysis, bug detection, and code review
- **MT5 Integration** — Real-time connection to MetaTrader 5 terminal
- **Historical Data** — Backtest against real market data
- **Trade Simulation** — Accurate order execution simulation
- **Risk Analytics** — Drawdown, Sharpe, Sortino, Calmar ratios
- **Strategy Diagnostics** — Session, regime, and time-of-day analysis
- **Parameter Optimization** — Sensitivity analysis and walk-forward testing
- **Monte Carlo Analysis** — Statistical scenario simulation
- **AI Insights** — Intelligent strategy assessment and recommendations

## ✨ Features

### 🔍 AI Code Analysis
- Automatic detection of trading engine, symbols, timeframes
- Strategy component identification (Price Action, Market Structure, Liquidity, etc.)
- AI/ML framework detection
- Code quality analysis with severity-rated issues
- Look-ahead bias detection
- Thread safety analysis

### 📊 Advanced Analytics
- Interactive candlestick charts with trade markers
- Equity curve visualization
- Drawdown analysis
- Session performance (Asian, London, New York)
- Market regime classification
- 24-hour performance heatmap
- Monthly returns distribution

### 🎛️ Backtest Configuration
- Multiple spread modes (variable, fixed, real historical)
- Commission and slippage simulation
- Market/Instant execution modes
- Risk-based or fixed lot sizing
- Preset configurations (Conservative, Realistic, Aggressive)

### 🧪 Validation & Testing
- Walk-forward analysis
- Monte Carlo simulation (1000+ paths)
- Parameter sensitivity analysis
- Overfitting detection
- Data quality validation

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python 3.8+** (for MT5 Worker)
- **MetaTrader 5** terminal (Windows)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-backtester.git
cd ai-backtester

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### MT5 Worker Setup

The MT5 Worker is a Python service that bridges this web application with your MetaTrader 5 terminal.

1. Install the MT5 Worker on a Windows machine with MT5 installed:

```bash
cd mt5-worker
pip install -r requirements.txt
```

2. Configure the worker:

```bash
cp .env.example .env
# Edit .env with your settings
```

3. Start the worker:

```bash
python worker.py
```

4. In the web app, navigate to **MT5 Connection** and enter:
   - Host: `localhost` (or IP of Windows machine)
   - Port: `8765`
   - API Token: Your configured token

## 📖 Usage

### 1. Upload Your Trading Bot

Navigate to **New Backtest** and drag & drop your Python trading bot file (`.py`).

The AI will automatically:
- Detect the trading engine (MT5, Binance, etc.)
- Identify symbols and timeframes
- Analyze strategy components
- Detect potential bugs and issues
- Flag AI/ML dependencies

### 2. Configure Backtest

Set your backtest parameters:
- Symbol and timeframe
- Date range
- Initial balance
- Spread, commission, slippage
- Execution mode
- Risk per trade

### 3. Run Backtest

Click **START AI BACKTEST** to begin. The system will:
- Load historical data from MT5
- Simulate your strategy
- Collect all trades
- Generate performance metrics
- Run AI analysis

### 4. Review Results

Explore comprehensive results:
- **Overview** — Key metrics and equity curve
- **Trades** — Detailed trade history with filtering
- **Analysis** — AI strategy intelligence
- **Sessions** — Performance by trading session
- **Regimes** — Market condition analysis
- **Source Code** — Annotated code viewer

### 5. Optimize

- Run parameter sensitivity analysis
- Perform walk-forward validation
- Execute Monte Carlo simulations
- Review AI recommendations

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Web Browser                           │
│              (React + TypeScript UI)                     │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Backend API                             │
│               (FastAPI / Express)                        │
└─────┬──────────────┬──────────────┬─────────────────────┘
      │              │              │
┌─────▼─────┐  ┌─────▼─────┐  ┌────▼──────┐
│ Job Queue │  │ Database  │  │ AI Engine │
│  (Redis)  │  │ (Postgres)│  │ (OpenAI)  │
└─────┬─────┘  └───────────┘  └───────────┘
      │
┌─────▼──────────────────────────────────────────────────┐
│                  MT5 Worker                              │
│            (Python on Windows)                           │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│              MetaTrader 5 Terminal                        │
└─────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
ai-backtester/
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Application pages
│   ├── data/              # Data structures and generators
│   ├── utils/             # Utility functions
│   │   └── pythonAnalyzer.ts  # Python code analysis engine
│   ├── types.ts           # TypeScript type definitions
│   ├── App.tsx            # Main application
│   └── main.tsx           # Entry point
├── public/                # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # Tailwind CSS config
├── vite.config.ts         # Vite config
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Backend API URL (for production)
VITE_API_URL=http://localhost:8000

# AI Provider
VITE_AI_PROVIDER=openrouter
VITE_AI_MODEL=deepseek/deepseek-chat
```

### Settings

Configure the application via the **Settings** page:
- AI Provider (OpenRouter, OpenAI, DeepSeek, Ollama)
- Default trading parameters
- Timezone preferences
- Data retention period

## 🛡️ Safety

- **Live trading is NEVER executed during backtests**
- All orders are simulated in an isolated environment
- The system uses a hard safety barrier to prevent accidental live trades
- Uploaded Python files are treated as untrusted code
- Sandboxed execution environment for strategy code

## 📊 Supported Trading Engines

- MetaTrader 5 (MT5)
- Binance (via CCXT)
- Other CCXT-supported exchanges

## 🎨 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Charts**: TradingView Lightweight Charts v5
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Routing**: React Router v6

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This software is for educational and research purposes. Trading involves substantial risk of loss. Past performance is not indicative of future results. Always test strategies thoroughly before using real funds.

## 🙏 Acknowledgments

- [TradingView](https://www.tradingview.com/) for Lightweight Charts
- [MetaQuotes](https://www.metaquotes.net/) for MetaTrader 5
- [Lucide](https://lucide.dev/) for beautiful icons

## 📞 Support

- 📧 Email: support@aibacktester.dev
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/ai-backtester/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/ai-backtester/discussions)

---

**Built with ❤️ for algorithmic traders**
