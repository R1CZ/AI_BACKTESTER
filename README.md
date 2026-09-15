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

## 🔌 MT5 Connection (Required for Live Trading)

**📖 Complete Setup Guide:** See [MT5_SETUP_GUIDE.md](MT5_SETUP_GUIDE.md) for detailed instructions.

### Quick Setup (Windows)

1. **Navigate to MT5 Worker:**
   ```bash
   cd mt5-worker
   ```

2. **Run the startup script:**
   ```bash
   start.bat
   ```
   This will:
   - Create a virtual environment (if needed)
   - Install dependencies
   - Prompt you to configure `.env`
   - Start the MT5 Worker service

3. **Configure your API token:**
   ```bash
   # Generate a secure token
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   
   # Edit .env and paste the token
   notepad .env
   ```

4. **Enable Algo Trading in MT5:**
   - Open MetaTrader 5
   - Tools → Options → Expert Advisors
   - Check "Allow Algo Trading" and "Allow DLL imports"

5. **Connect from Web App:**
   - Navigate to **MT5 Connection**
   - Enter: Host: `localhost`, Port: `8765`, Token: (from .env)
   - Click **Connect**

### Manual Setup

```bash
cd mt5-worker

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Configure
cp .env.example .env
# Edit .env with your API token

# Start worker
python worker.py
```

### Verify Connection

```bash
# Test the API
curl http://localhost:8765/

# Should return:
# {"status":"running","service":"MT5 Worker","version":"1.0.0",...}
```

### Troubleshooting

**Common Issues:**
- ❌ "Failed to connect to MT5" → Make sure MT5 is running and "Allow Algo Trading" is enabled
- ❌ "Invalid API token" → Verify token matches between `.env` and web app
- ❌ "Symbol not found" → Make symbol visible in MT5 Market Watch
- ❌ Can't connect from web app → Check firewall settings, use correct IP/hostname

**Need help?** See [MT5_SETUP_GUIDE.md](MT5_SETUP_GUIDE.md) for detailed troubleshooting.

## 📖 Usage

### 1. Connect to MT5 (First Time Only)

Before running backtests, you must connect to your MT5 terminal:

1. Start the MT5 Worker (see [MT5 Connection](#-mt5-connection-required-for-live-trading) section)
2. In the web app, go to **MT5 Connection**
3. Enter your connection details and click **Connect**
4. Verify you see your account balance and available symbols

### 2. Upload Your Trading Bot

Navigate to **New Backtest** and drag & drop your Python trading bot file (`.py`).

The AI will automatically:
- Detect the trading engine (MT5, Binance, etc.)
- Identify symbols and timeframes
- Analyze strategy components
- Detect potential bugs and issues
- Flag AI/ML dependencies

**Sample bots available:** Check `examples/` directory for tested strategies.

### 3. Configure Backtest

Set your backtest parameters:
- Symbol and timeframe
- Date range
- Initial balance
- Spread, commission, slippage
- Execution mode
- Risk per trade

### 4. Run Backtest

Click **START AI BACKTEST** to begin. The system will:
- Load historical data from MT5
- Simulate your strategy
- Collect all trades
- Generate performance metrics
- Run AI analysis

### 5. Review Results

Explore comprehensive results:
- **Overview** — Key metrics and equity curve
- **Trades** — Detailed trade history with filtering
- **Analysis** — AI strategy intelligence
- **Sessions** — Performance by trading session
- **Regimes** — Market condition analysis
- **Source Code** — Annotated code viewer

### 6. Optimize

- Run parameter sensitivity analysis
- Perform walk-forward validation
- Execute Monte Carlo simulations
- Review AI recommendations

## 🎯 Running Live

### Backtesting Mode (Safe)
- Uses historical data from MT5
- No real trades are executed
- Perfect for strategy validation
- Can run multiple backtests simultaneously

### Live Trading Mode (Advanced)
⚠️ **WARNING:** Live trading involves real money and risk!

To enable live trading:
1. Ensure MT5 Worker is running
2. Your trading bot must be designed for live execution
3. Start with a demo account first
4. Monitor positions closely
5. Set appropriate risk limits

**Important:** The web app is primarily designed for backtesting. For live trading, run your Python bot directly with MT5.

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
