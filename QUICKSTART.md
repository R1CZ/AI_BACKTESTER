# 🚀 Quick Start Guide - Get Running in 10 Minutes

This guide will get you from zero to running your first backtest in 10 minutes.

## ⚡ Fast Track (If you have everything installed)

### 1. Start the Web App
```bash
npm install
npm run dev
```
Open http://localhost:5173

### 2. Start MT5 Worker (Windows with MT5)
```bash
cd mt5-worker
start.bat
```

### 3. Connect in Web App
- Go to **MT5 Connection**
- Host: `localhost`
- Port: `8765`
- Token: (from mt5-worker/.env)
- Click **Connect**

### 4. Upload & Backtest
- Go to **New Backtest**
- Upload your `.py` file
- Configure settings
- Click **START AI BACKTEST**

**Done!** 🎉

---

## 📋 Complete Setup (First Time)

### What You Need
- ✅ Windows 10/11 PC
- ✅ MetaTrader 5 installed and logged in
- ✅ Python 3.8+ installed
- ✅ Node.js 18+ installed
- ✅ 10 minutes of time

### Step 1: Install the Web App (2 minutes)

```bash
# Clone or download the project
git clone https://github.com/yourusername/ai-backtester.git
cd ai-backtester

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser to **http://localhost:5173**

You should see the AI Backtester dashboard.

### Step 2: Set Up MT5 Worker (5 minutes)

The MT5 Worker connects the web app to your MetaTrader 5 terminal.

#### 2.1 Open a new terminal and navigate to the worker:
```bash
cd mt5-worker
```

#### 2.2 Run the startup script:
```bash
start.bat
```

This will:
- Create a Python virtual environment
- Install all dependencies
- Ask you to configure your API token

#### 2.3 Configure your API token:

When prompted, the script will open `.env` in Notepad.

Generate a secure token:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy the output and paste it after `MT5_API_TOKEN=` in the `.env` file.

Save and close Notepad.

#### 2.4 Enable Algo Trading in MT5:

1. Open MetaTrader 5
2. Go to **Tools → Options** (or press Ctrl+O)
3. Click the **Expert Advisors** tab
4. Check these boxes:
   - ✅ Allow Algo Trading
   - ✅ Allow DLL imports
5. Click **OK**

#### 2.5 Start the worker:

The `start.bat` script should now start the worker automatically.

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8765
INFO:     MT5 Worker starting up...
```

**Keep this terminal open!**

### Step 3: Connect Web App to MT5 (1 minute)

1. In your browser, go to the AI Backtester web app
2. Click **MT5 Connection** in the left sidebar
3. Enter:
   - **Host:** `localhost`
   - **Port:** `8765`
   - **API Token:** (paste the token from your `.env` file)
4. Click **Connect**

You should see:
- ✅ Green "Connected" indicator
- ✅ Your MT5 account number
- ✅ Your balance
- ✅ List of available symbols

**Success!** You're now connected to MT5.

### Step 4: Run Your First Backtest (2 minutes)

#### 4.1 Upload a trading bot:

1. Click **New Backtest** in the left sidebar
2. Drag & drop a Python file, or click to browse
3. You can use the sample bot: `examples/sample_strategy.py`

The AI will analyze your code and show:
- Detected trading engine
- Symbols and timeframes
- Strategy components
- Any issues found

#### 4.2 Configure the backtest:

Set your parameters:
- **Symbol:** EURUSD, XAUUSD, etc.
- **Timeframe:** M1, M5, H1, etc.
- **Date range:** Start and end dates
- **Initial balance:** $1000 (or your choice)
- **Risk per trade:** 1% (recommended)

#### 4.3 Start the backtest:

Click **START AI BACKTEST**

Watch the progress:
- Analyzing code...
- Loading historical data...
- Running simulation...
- Generating report...

#### 4.4 Review results:

When complete, you'll see:
- **Net Profit:** How much the strategy made
- **Win Rate:** Percentage of winning trades
- **Drawdown:** Maximum loss from peak
- **Profit Factor:** Profit vs loss ratio
- **AI Analysis:** Strategy strengths and weaknesses

Click through the tabs:
- **Overview:** Charts and key metrics
- **Trades:** Every trade with details
- **Analysis:** AI insights
- **Sessions:** Performance by time of day
- **Regimes:** Performance in different market conditions

**Congratulations!** You've run your first backtest. 🎉

---

## 🔧 Troubleshooting

### "MT5 Worker won't start"

**Check:**
1. Python is installed: `python --version`
2. You're on Windows (MT5 only works on Windows)
3. MT5 is running and logged in
4. No other program is using port 8765

**Fix:**
```bash
cd mt5-worker
pip install -r requirements.txt
python worker.py
```

### "Can't connect from web app"

**Check:**
1. MT5 Worker is running (terminal shows "Uvicorn running")
2. Host is `localhost` or `127.0.0.1`
3. Port is `8765`
4. API token matches exactly (no extra spaces)

**Test:**
```bash
curl http://localhost:8765/
```
Should return JSON with `"status": "running"`

### "MT5 connection failed"

**Check:**
1. MT5 terminal is open and logged in
2. "Allow Algo Trading" is enabled in MT5
3. MT5 Worker is running

**Fix:**
1. Close and reopen MT5
2. Re-enable Algo Trading
3. Restart MT5 Worker

### "No symbols available"

**Fix:**
1. In MT5, open **Market Watch** (Ctrl+M)
2. Right-click → **Show All**
3. Restart MT5 Worker

---

## 📚 Next Steps

Now that you're running:

1. **Try different strategies** - Upload various `.py` files
2. **Test multiple symbols** - EURUSD, GBPUSD, XAUUSD, etc.
3. **Experiment with timeframes** - M1, M5, M15, H1, H4
4. **Analyze results** - Look for patterns in winning/losing trades
5. **Optimize** - Use the Optimization tools to improve parameters
6. **Validate** - Run walk-forward analysis to check robustness

---

## 🎓 Learning Resources

- **MT5 Setup Guide:** [MT5_SETUP_GUIDE.md](MT5_SETUP_GUIDE.md) - Detailed troubleshooting
- **Sample Strategies:** Check `examples/` directory
- **API Documentation:** Visit http://localhost:8765/docs when worker is running
- **Python Basics:** Learn Python if you want to create custom strategies

---

## 💡 Tips for Success

1. **Start with demo accounts** - Never risk real money until you've thoroughly tested
2. **Test multiple timeframes** - A strategy might work on H1 but not M5
3. **Check the AI analysis** - It identifies strengths and weaknesses
4. **Look at drawdown** - High drawdown = high risk
5. **Validate with walk-forward** - Ensures strategy isn't overfitted
6. **Monitor different sessions** - Some strategies work better in London vs NY session

---

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Read [MT5_SETUP_GUIDE.md](MT5_SETUP_GUIDE.md) for detailed help
3. Check the main [README.md](README.md) for architecture details
4. Open an issue on GitHub if you find a bug

---

## ✅ Success Checklist

You're ready when:

- [ ] Web app is running (http://localhost:5173)
- [ ] MT5 Worker is running (terminal shows "Uvicorn running")
- [ ] MT5 terminal is open and logged in
- [ ] "Allow Algo Trading" is enabled in MT5
- [ ] Web app shows "Connected" to MT5
- [ ] You can see your account balance
- [ ] You can see available symbols
- [ ] You've uploaded a Python file
- [ ] You've run your first backtest
- [ ] You've reviewed the results

**All checked?** You're officially up and running! 🚀

---

**Happy backtesting!** 📊💰
