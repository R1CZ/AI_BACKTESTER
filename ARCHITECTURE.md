# 🏗️ System Architecture & Live Operation Guide

This document explains how the AI Backtester system works end-to-end and how to operate it in a live environment.

---

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│                    (React + TypeScript Web App)                  │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Dashboard│  │ Backtest │  │ Analytics│  │   MT5    │       │
│  │          │  │  Runner  │  │   Viewer │  │  Config  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP/REST API
                            │ (Port 5173)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MT5 WORKER SERVICE                          │
│                   (Python + FastAPI on Windows)                  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    API Endpoints                          │  │
│  │  • GET  /status          - Connection status             │  │
│  │  • POST /connect         - Initialize MT5 connection     │  │
│  │  • GET  /symbols         - List available symbols        │  │
│  │  • POST /historical-data - Fetch OHLCV data              │  │
│  │  • POST /order           - Execute trade order           │  │
│  │  • GET  /positions       - Get open positions            │  │
│  │  • POST /backtest        - Run strategy backtest         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  MT5 Python Integration                   │  │
│  │  • MetaTrader5.initialize()                              │  │
│  │  • MetaTrader5.copy_rates_from_pos()                     │  │
│  │  • MetaTrader5.symbol_info_tick()                        │  │
│  │  • MetaTrader5.order_send()                              │  │
│  │  • MetaTrader5.positions_get()                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Python MT5 API
                            │ (IPC/Named Pipes)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    METATRADER 5 TERMINAL                         │
│                      (Windows Application)                       │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Market  │  │  Order   │  │  Account │  │  Chart   │       │
│  │   Data   │  │Execution │  │  Manager │  │  Engine  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                            │                                    │
└────────────────────────────┼────────────────────────────────────┘
                             │ Internet
                             ▼
                    ┌────────────────┐
                    │   Broker API   │
                    │  (Liquidity    │
                    │   Provider)    │
                    └────────────────┘
```

---

## 🔄 Data Flow

### 1. Backtest Execution Flow

```
User uploads Python strategy
         ↓
Web App receives file
         ↓
Python Code Analyzer parses code
         ↓
Extract: symbols, timeframes, logic
         ↓
User configures backtest parameters
         ↓
Web App sends request to MT5 Worker
         ↓
MT5 Worker fetches historical data from MT5
         ↓
MT5 returns OHLCV candles
         ↓
Web App simulates strategy execution
         ↓
Calculate: trades, P&L, metrics
         ↓
AI Analysis engine processes results
         ↓
Display comprehensive report
```

### 2. Live Trading Flow (Future)

```
User enables live trading mode
         ↓
Web App sends strategy to MT5 Worker
         ↓
MT5 Worker loads strategy in sandbox
         ↓
Strategy monitors real-time ticks
         ↓
Signal detected → Send order to MT5
         ↓
MT5 executes order with broker
         ↓
Position opened/closed
         ↓
Web App receives position updates
         ↓
Display live P&L and metrics
```

---

## 🔌 MT5 Worker API Reference

### Base URL
```
http://localhost:8765
```

### Authentication
All endpoints require Bearer token:
```
Authorization: Bearer YOUR_API_TOKEN
```

### Endpoints

#### Health Check
```http
GET /
```
Returns service status.

#### Connection Status
```http
GET /status
```
Returns MT5 connection state and account info.

**Response:**
```json
{
  "connected": true,
  "account": {
    "login": 12345678,
    "server": "Broker-Demo",
    "balance": 10000.00,
    "equity": 10250.50,
    "currency": "USD"
  },
  "terminal": {
    "build": 4000,
    "trade_allowed": true
  }
}
```

#### List Symbols
```http
GET /symbols
```
Returns all available trading symbols.

**Response:**
```json
{
  "symbols": [
    {
      "name": "EURUSD",
      "description": "Euro vs US Dollar",
      "digits": 5,
      "spread": 10,
      "visible": true
    }
  ]
}
```

#### Get Historical Data
```http
POST /historical-data
Content-Type: application/json

{
  "symbol": "EURUSD",
  "timeframe": "H1",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31"
}
```

**Response:**
```json
{
  "symbol": "EURUSD",
  "timeframe": "H1",
  "data": [
    {
      "time": 1704067200,
      "open": 1.1050,
      "high": 1.1065,
      "low": 1.1045,
      "close": 1.1060,
      "volume": 1234
    }
  ]
}
```

#### Execute Order
```http
POST /order
Content-Type: application/json

{
  "symbol": "EURUSD",
  "type": "BUY",
  "volume": 0.1,
  "price": 1.1050,
  "sl": 1.1000,
  "tp": 1.1100,
  "comment": "AI Backtest Order"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "ticket": 123456789,
    "symbol": "EURUSD",
    "type": "BUY",
    "volume": 0.1,
    "price": 1.1050
  }
}
```

#### Get Positions
```http
GET /positions
```

**Response:**
```json
{
  "positions": [
    {
      "ticket": 123456789,
      "symbol": "EURUSD",
      "type": "BUY",
      "volume": 0.1,
      "open_price": 1.1050,
      "current_price": 1.1065,
      "profit": 15.00,
      "sl": 1.1000,
      "tp": 1.1100
    }
  ]
}
```

---

## 🛡️ Security Considerations

### API Token Security
- Generate strong tokens: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
- Store tokens in `.env` file (never commit to git)
- Rotate tokens periodically
- Use different tokens for different environments

### Network Security
- MT5 Worker should only listen on localhost for local development
- For remote access, use VPN or SSH tunnel
- Never expose MT5 Worker directly to the internet
- Use HTTPS in production (configure reverse proxy)

### MT5 Terminal Security
- Use demo accounts for testing
- Enable "Allow Algo Trading" only when needed
- Monitor MT5 logs for suspicious activity
- Set appropriate position limits in MT5

---

## 🚀 Production Deployment

### Development Setup (Local)
```
Web App: localhost:5173
MT5 Worker: localhost:8765
MT5 Terminal: Local Windows machine
```

### Production Setup (Recommended)
```
Web App: https://yourdomain.com (Nginx + SSL)
MT5 Worker: Internal network (192.168.x.x:8765)
MT5 Terminal: Dedicated Windows server
Database: PostgreSQL (optional, for storing results)
```

### Deployment Steps

#### 1. Web App Deployment
```bash
# Build for production
npm run build

# Deploy dist/ folder to your web server
# Options: Vercel, Netlify, AWS S3, Nginx
```

#### 2. MT5 Worker Deployment
```bash
# On Windows server with MT5
cd mt5-worker

# Create production .env
cat > .env << EOF
MT5_API_TOKEN=your-production-token
MT5_HOST=0.0.0.0
MT5_PORT=8765
EOF

# Run as service (Windows)
# Use NSSM or Windows Task Scheduler
nssm install MT5Worker python worker.py
nssm start MT5Worker
```

#### 3. Reverse Proxy (Nginx)
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Web App
    location / {
        proxy_pass http://localhost:5173;
    }

    # MT5 Worker API
    location /api/mt5/ {
        proxy_pass http://192.168.1.100:8765/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📊 Performance Optimization

### MT5 Worker
- Use connection pooling for multiple web app instances
- Cache symbol info (refresh every 5 minutes)
- Limit historical data requests to prevent MT5 overload
- Monitor memory usage (restart if > 2GB)

### Web App
- Enable gzip compression
- Use CDN for static assets
- Implement request caching
- Optimize chart rendering (use web workers)

### MT5 Terminal
- Close unnecessary charts
- Disable unused indicators
- Limit number of symbols in Market Watch
- Use VPS for 24/7 operation

---

## 🔍 Monitoring & Logging

### MT5 Worker Logs
```bash
# View logs in real-time
tail -f mt5-worker/worker.log

# Or check Windows Event Viewer
```

### Web App Logs
```bash
# Browser console (F12)
# Network tab for API requests
```

### MT5 Terminal Logs
```
MT5 → View → Journal
MT5 → View → Experts
MT5 → View → Signals
```

### Health Checks
```bash
# Check MT5 Worker
curl http://localhost:8765/

# Check web app
curl http://localhost:5173/

# Check MT5 connection
curl -H "Authorization: Bearer TOKEN" http://localhost:8765/status
```

---

## 🎯 Live Operation Checklist

### Before Going Live
- [ ] Test thoroughly on demo account
- [ ] Verify all API endpoints work
- [ ] Check MT5 connection stability
- [ ] Review strategy logic multiple times
- [ ] Set appropriate risk limits
- [ ] Configure stop-loss and take-profit
- [ ] Test order execution manually
- [ ] Monitor for 24 hours on demo
- [ ] Review all backtest results
- [ ] Get AI analysis and recommendations

### Daily Operation
- [ ] Check MT5 connection status
- [ ] Review overnight performance
- [ ] Monitor open positions
- [ ] Check for any errors in logs
- [ ] Verify account balance
- [ ] Review daily P&L

### Weekly Review
- [ ] Analyze weekly performance
- [ ] Compare with backtest results
- [ ] Adjust parameters if needed
- [ ] Review AI insights
- [ ] Update strategy if necessary
- [ ] Backup configuration

---

## 🆘 Support & Resources

### Documentation
- **Quick Start:** [QUICKSTART.md](QUICKSTART.md)
- **MT5 Setup:** [MT5_SETUP_GUIDE.md](MT5_SETUP_GUIDE.md)
- **Main README:** [README.md](README.md)
- **API Docs:** http://localhost:8765/docs (when worker running)

### Community
- GitHub Issues: Report bugs and request features
- GitHub Discussions: Ask questions and share ideas
- Sample Strategies: Check `examples/` directory

### External Resources
- [MetaTrader 5 Documentation](https://www.mql5.com/en/docs)
- [Python MT5 API](https://www.mql5.com/en/docs/integration/python_integration)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)

---

## 💡 Best Practices

1. **Always test on demo first** - Never risk real money without thorough testing
2. **Start small** - Begin with small position sizes
3. **Monitor closely** - Watch live trading initially
4. **Use stop-losses** - Always protect your capital
5. **Review AI insights** - Leverage the AI analysis
6. **Keep backups** - Backup your strategies and configurations
7. **Stay updated** - Keep dependencies updated
8. **Document changes** - Track what you modify and why
9. **Validate results** - Cross-check backtest with live performance
10. **Manage risk** - Never risk more than you can afford to lose

---

**Ready to go live?** Follow the [QUICKSTART.md](QUICKSTART.md) guide to get started!
