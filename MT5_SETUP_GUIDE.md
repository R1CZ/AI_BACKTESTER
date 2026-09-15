# MT5 Live Connection Setup Guide

This guide will help you connect the AI Backtester to your MetaTrader 5 terminal and run it live.

## 📋 Prerequisites

### System Requirements
- **Windows 10/11** (MT5 only runs on Windows)
- **MetaTrader 5** installed and logged into your broker account
- **Python 3.8 or higher** installed
- **Node.js 18+** and npm installed

### What You'll Need
1. A Windows PC or VM with MetaTrader 5 installed
2. Your MT5 login credentials (account number, password, server)
3. Python installed on the same Windows machine
4. Network access between your web app and the MT5 Worker

---

## 🚀 Step-by-Step Setup

### Step 1: Install MetaTrader 5

If you don't have MT5 installed:

1. Download from your broker's website or [MetaQuotes](https://www.metatrader5.com/)
2. Install and launch MT5
3. Log in with your demo or live account
4. Verify you can see charts and market data

### Step 2: Install Python

1. Download Python 3.8+ from [python.org](https://www.python.org/downloads/)
2. During installation, **check "Add Python to PATH"**
3. Verify installation:
   ```bash
   python --version
   ```

### Step 3: Set Up MT5 Worker

The MT5 Worker is a Python service that bridges the web app with MT5.

#### 3.1 Navigate to the MT5 Worker directory

```bash
cd mt5-worker
```

#### 3.2 Create a Python virtual environment (recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac (if using WSL or remote)
python3 -m venv venv
source venv/bin/activate
```

#### 3.3 Install dependencies

```bash
pip install -r requirements.txt
```

#### 3.4 Configure environment variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your settings
```

Edit the `.env` file:

```env
# Generate a secure API token
# Run: python -c "import secrets; print(secrets.token_urlsafe(32))"
MT5_API_TOKEN=paste-your-generated-token-here

# Server settings (keep defaults unless you know what you're doing)
MT5_HOST=0.0.0.0
MT5_PORT=8765

# Optional: Auto-login to MT5 (leave commented to use existing session)
# MT5_LOGIN=12345678
# MT5_PASSWORD=your-password
# MT5_SERVER=YourBroker-Demo
```

**Generate a secure token:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy the output and paste it into your `.env` file.

### Step 4: Enable Algo Trading in MT5

1. Open MetaTrader 5
2. Go to **Tools → Options → Expert Advisors**
3. Check **"Allow Algo Trading"**
4. Check **"Allow DLL imports"**
5. Click **OK**

### Step 5: Start the MT5 Worker

```bash
# Make sure you're in the mt5-worker directory
# and your virtual environment is activated

python worker.py
```

You should see:
```
INFO:     Started server process
INFO:     MT5 Worker starting up...
INFO:     Uvicorn running on http://0.0.0.0:8765
```

**Keep this terminal open!** The worker must stay running.

### Step 6: Test the Connection

Open a new terminal and test the API:

```bash
curl http://localhost:8765/
```

You should get:
```json
{
  "status": "running",
  "service": "MT5 Worker",
  "version": "1.0.0",
  "timestamp": "2026-..."
}
```

### Step 7: Connect from the Web App

1. Open your AI Backtester web app
2. Navigate to **MT5 Connection** in the sidebar
3. Enter your connection details:
   - **Host:** `localhost` (or IP address if remote)
   - **Port:** `8765`
   - **API Token:** The token from your `.env` file
4. Click **Connect**

You should see:
- ✅ MT5 status: Connected
- ✅ Account number
- ✅ Balance
- ✅ Available symbols

---

## 🔧 Troubleshooting

### "Failed to connect to MT5"

**Problem:** MT5 Worker can't connect to MT5 terminal

**Solutions:**
1. Make sure MT5 is running and logged in
2. Check that "Allow Algo Trading" is enabled in MT5
3. Restart MT5 and try again
4. Check MT5 logs: **View → Journal**

### "Invalid API token"

**Problem:** Authentication failed

**Solutions:**
1. Verify the token in your web app matches the one in `.env`
2. Restart the MT5 Worker after changing the token
3. Make sure there are no extra spaces in the token

### "Symbol not found"

**Problem:** Requested symbol is not available

**Solutions:**
1. In MT5, right-click the symbol in Market Watch
2. Select **"Show All"** to make it visible
3. Restart the MT5 Worker

### Worker crashes immediately

**Problem:** Python error on startup

**Solutions:**
1. Check Python version: `python --version` (need 3.8+)
2. Reinstall dependencies: `pip install -r requirements.txt --force-reinstall`
3. Check the error message in the terminal
4. Make sure MT5 is 64-bit (matches Python 64-bit)

### Can't connect from web app to worker

**Problem:** Network connectivity issue

**Solutions:**
1. If running on same machine: use `localhost` or `127.0.0.1`
2. If running on different machines:
   - Use the Windows machine's IP address
   - Make sure Windows Firewall allows port 8765
   - Add firewall rule: `netsh advfirewall firewall add rule name="MT5 Worker" dir=in action=allow protocol=TCP localport=8765`

---

## 🌐 Running on Different Machines

If your web app and MT5 are on different machines:

### On the Windows machine (MT5 Worker):

1. Find your IP address:
   ```bash
   ipconfig
   ```
   Note the IPv4 address (e.g., `192.168.1.100`)

2. Make sure `.env` has:
   ```env
   MT5_HOST=0.0.0.0
   ```

3. Add Windows Firewall rule:
   ```bash
   netsh advfirewall firewall add rule name="MT5 Worker" dir=in action=allow protocol=TCP localport=8765
   ```

4. Start the worker

### On the web app machine:

1. In the web app, use:
   - **Host:** `192.168.1.100` (the Windows machine's IP)
   - **Port:** `8765`
   - **API Token:** Same token from the Windows machine's `.env`

---

## 🔒 Security Best Practices

### For Production Use

1. **Use HTTPS:** Set up a reverse proxy (nginx) with SSL
2. **Strong API Token:** Use a long, random token
3. **Restrict CORS:** Update the worker to allow only your domain
4. **Firewall:** Only expose the port to trusted IPs
5. **Monitor:** Check logs regularly for suspicious activity

### Example nginx configuration:

```nginx
server {
    listen 443 ssl;
    server_name mt5.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:8765;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📊 Testing the Connection

### Test 1: Health Check
```bash
curl http://localhost:8765/
```

### Test 2: Get Account Status
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8765/status
```

### Test 3: List Symbols
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8765/symbols
```

### Test 4: Get Historical Data
```bash
curl -X POST http://localhost:8765/historical-data \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"symbol":"EURUSD","timeframe":"H1","count":100}'
```

---

## 🎯 Next Steps

Once connected:

1. **Upload a Python trading bot** in the web app
2. **Configure backtest parameters** (symbol, timeframe, date range)
3. **Run the backtest** and analyze results
4. **Review AI insights** and recommendations
5. **Optimize parameters** if needed

---

## 📞 Support

If you encounter issues:

1. Check the MT5 Worker logs (terminal output)
2. Check MT5 Journal logs (in MT5 terminal)
3. Verify all prerequisites are met
4. Review the troubleshooting section above
5. Check GitHub Issues for similar problems

---

## ✅ Quick Checklist

Before starting, verify:

- [ ] Windows 10/11 installed
- [ ] MetaTrader 5 installed and logged in
- [ ] Python 3.8+ installed
- [ ] Node.js 18+ installed
- [ ] MT5 Worker dependencies installed
- [ ] `.env` file configured with API token
- [ ] "Allow Algo Trading" enabled in MT5
- [ ] MT5 Worker running without errors
- [ ] Can access `http://localhost:8765/` in browser
- [ ] Web app can connect to MT5 Worker

---

**Need help?** Check the main README.md or open an issue on GitHub.
