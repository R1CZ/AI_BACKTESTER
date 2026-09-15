"""
MT5 Worker Service
==================
Python service that bridges the AI Backtester web application with MetaTrader 5.

Requirements:
- Windows OS
- MetaTrader 5 terminal installed and logged in
- Python 3.8+

Setup:
1. Install dependencies: pip install -r requirements.txt
2. Configure .env file
3. Run: python worker.py
4. Connect from web app using the configured host/port/token
"""

import os
import sys
import json
import time
import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, List, Any
from contextlib import asynccontextmanager

import MetaTrader5 as mt5
from fastapi import FastAPI, HTTPException, Depends, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
API_TOKEN = os.getenv("MT5_API_TOKEN", "your-secret-token-here")
HOST = os.getenv("MT5_HOST", "0.0.0.0")
PORT = int(os.getenv("MT5_PORT", "8765"))

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Security
security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Verify API token"""
    if credentials.credentials != API_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid API token")
    return credentials.credentials

# Pydantic models
class ConnectRequest(BaseModel):
    login: Optional[int] = None
    password: Optional[str] = None
    server: Optional[str] = None

class OrderRequest(BaseModel):
    symbol: str
    order_type: str  # "BUY" or "SELL"
    volume: float
    price: Optional[float] = None
    sl: Optional[float] = None
    tp: Optional[float] = None
    deviation: int = 20
    magic: int = 20260101
    comment: str = ""

class HistoricalDataRequest(BaseModel):
    symbol: str
    timeframe: str
    start_date: Optional[str] = None
    count: int = 1000

# FastAPI app
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    logger.info("MT5 Worker starting up...")
    yield
    logger.info("MT5 Worker shutting down...")
    if mt5.terminal_info() is not None:
        mt5.shutdown()
        logger.info("MT5 connection closed")

app = FastAPI(
    title="MT5 Worker API",
    description="Bridge between AI Backtester and MetaTrader 5",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper functions
def timeframe_from_string(tf: str) -> int:
    """Convert timeframe string to MT5 constant"""
    timeframe_map = {
        "M1": mt5.TIMEFRAME_M1,
        "M2": mt5.TIMEFRAME_M2,
        "M3": mt5.TIMEFRAME_M3,
        "M4": mt5.TIMEFRAME_M4,
        "M5": mt5.TIMEFRAME_M5,
        "M6": mt5.TIMEFRAME_M6,
        "M10": mt5.TIMEFRAME_M10,
        "M12": mt5.TIMEFRAME_M12,
        "M15": mt5.TIMEFRAME_M15,
        "M20": mt5.TIMEFRAME_M20,
        "M30": mt5.TIMEFRAME_M30,
        "H1": mt5.TIMEFRAME_H1,
        "H2": mt5.TIMEFRAME_H2,
        "H3": mt5.TIMEFRAME_H3,
        "H4": mt5.TIMEFRAME_H4,
        "H6": mt5.TIMEFRAME_H6,
        "H8": mt5.TIMEFRAME_H8,
        "H12": mt5.TIMEFRAME_H12,
        "D1": mt5.TIMEFRAME_D1,
        "W1": mt5.TIMEFRAME_W1,
        "MN1": mt5.TIMEFRAME_MN1,
    }
    return timeframe_map.get(tf.upper(), mt5.TIMEFRAME_M1)

# API Endpoints

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "running",
        "service": "MT5 Worker",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/status")
async def get_status(token: str = Depends(verify_token)):
    """Get MT5 connection status"""
    terminal_info = mt5.terminal_info()
    
    if terminal_info is None:
        return {
            "connected": False,
            "message": "Not connected to MT5 terminal"
        }
    
    account_info = mt5.account_info()
    
    return {
        "connected": True,
        "terminal": {
            "community_account": terminal_info.community_account,
            "community_connection": terminal_info.community_connection,
            "connected": terminal_info.connected,
            "dlls_allowed": terminal_info.dlls_allowed,
            "trade_allowed": terminal_info.trade_allowed,
            "tradeapi_disabled": terminal_info.tradeapi_disabled,
            "trade_expert_enabled": terminal_info.trade_expert_enabled,
            "build": terminal_info.build,
            "maxbars": terminal_info.maxbars,
            "codepage": terminal_info.codepage,
        },
        "account": {
            "login": account_info.login,
            "server": account_info.server,
            "balance": account_info.balance,
            "equity": account_info.equity,
            "profit": account_info.profit,
            "currency": account_info.currency,
            "leverage": account_info.leverage,
        } if account_info else None
    }

@app.post("/connect")
async def connect_mt5(request: ConnectRequest, token: str = Depends(verify_token)):
    """Connect to MT5 terminal"""
    try:
        # Try to initialize with provided credentials or use existing
        if request.login and request.password and request.server:
            result = mt5.initialize(
                login=request.login,
                password=request.password,
                server=request.server
            )
        else:
            result = mt5.initialize()
        
        if not result:
            error = mt5.last_error()
            raise HTTPException(
                status_code=500,
                detail=f"Failed to connect to MT5: {error}"
            )
        
        account_info = mt5.account_info()
        
        logger.info(f"Connected to MT5. Account: {account_info.login}")
        
        return {
            "success": True,
            "message": "Connected to MT5 successfully",
            "account": {
                "login": account_info.login,
                "server": account_info.server,
                "balance": account_info.balance,
                "equity": account_info.equity,
                "currency": account_info.currency,
            }
        }
    
    except Exception as e:
        logger.error(f"Connection error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/disconnect")
async def disconnect_mt5(token: str = Depends(verify_token)):
    """Disconnect from MT5 terminal"""
    try:
        mt5.shutdown()
        logger.info("Disconnected from MT5")
        return {
            "success": True,
            "message": "Disconnected from MT5 successfully"
        }
    except Exception as e:
        logger.error(f"Disconnect error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/symbols")
async def get_symbols(token: str = Depends(verify_token)):
    """Get list of available symbols"""
    try:
        symbols = mt5.symbols_get()
        
        if symbols is None:
            raise HTTPException(
                status_code=500,
                detail="Failed to retrieve symbols"
            )
        
        # Filter visible symbols
        visible_symbols = [
            {
                "name": s.name,
                "description": s.description,
                "visible": s.visible,
                "spread": s.spread,
                "digits": s.digits,
                "point": s.point,
            }
            for s in symbols
            if s.visible
        ]
        
        return {
            "symbols": visible_symbols,
            "count": len(visible_symbols)
        }
    
    except Exception as e:
        logger.error(f"Error getting symbols: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/symbol/{symbol}")
async def get_symbol_info(symbol: str, token: str = Depends(verify_token)):
    """Get detailed information about a symbol"""
    try:
        symbol_info = mt5.symbol_info(symbol)
        
        if symbol_info is None:
            raise HTTPException(
                status_code=404,
                detail=f"Symbol {symbol} not found"
            )
        
        tick = mt5.symbol_info_tick(symbol)
        
        return {
            "symbol": symbol_info.name,
            "description": symbol_info.description,
            "bid": tick.bid if tick else None,
            "ask": tick.ask if tick else None,
            "spread": symbol_info.spread,
            "digits": symbol_info.digits,
            "point": symbol_info.point,
            "trade_mode": symbol_info.trade_mode,
            "volume_min": symbol_info.volume_min,
            "volume_max": symbol_info.volume_max,
            "volume_step": symbol_info.volume_step,
        }
    
    except Exception as e:
        logger.error(f"Error getting symbol info: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/historical-data")
async def get_historical_data(
    request: HistoricalDataRequest,
    token: str = Depends(verify_token)
):
    """Get historical candle data"""
    try:
        timeframe = timeframe_from_string(request.timeframe)
        
        if request.start_date:
            start_date = datetime.fromisoformat(request.start_date)
            rates = mt5.copy_rates_from(
                request.symbol,
                timeframe,
                start_date,
                request.count
            )
        else:
            rates = mt5.copy_rates_from_pos(
                request.symbol,
                timeframe,
                0,
                request.count
            )
        
        if rates is None:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to retrieve historical data: {mt5.last_error()}"
            )
        
        # Convert to list of dicts
        data = [
            {
                "time": int(rate[0]),
                "open": float(rate[1]),
                "high": float(rate[2]),
                "low": float(rate[3]),
                "close": float(rate[4]),
                "volume": int(rate[5]),
            }
            for rate in rates
        ]
        
        return {
            "symbol": request.symbol,
            "timeframe": request.timeframe,
            "count": len(data),
            "data": data
        }
    
    except Exception as e:
        logger.error(f"Error getting historical data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/positions")
async def get_positions(token: str = Depends(verify_token)):
    """Get all open positions"""
    try:
        positions = mt5.positions_get()
        
        if positions is None:
            return {
                "positions": [],
                "count": 0
            }
        
        position_list = [
            {
                "ticket": p.ticket,
                "symbol": p.symbol,
                "type": "BUY" if p.type == mt5.POSITION_TYPE_BUY else "SELL",
                "volume": p.volume,
                "price_open": p.price_open,
                "price_current": p.price_current,
                "sl": p.sl,
                "tp": p.tp,
                "profit": p.profit,
                "swap": p.swap,
                "magic": p.magic,
                "comment": p.comment,
                "time": datetime.fromtimestamp(p.time).isoformat(),
            }
            for p in positions
        ]
        
        return {
            "positions": position_list,
            "count": len(position_list)
        }
    
    except Exception as e:
        logger.error(f"Error getting positions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/order")
async def send_order(request: OrderRequest, token: str = Depends(verify_token)):
    """Send a trade order"""
    try:
        # Get current price if not provided
        if request.price is None:
            tick = mt5.symbol_info_tick(request.symbol)
            if tick is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Symbol {request.symbol} not found"
                )
            request.price = tick.ask if request.order_type == "BUY" else tick.bid
        
        # Prepare order
        order_type = mt5.ORDER_TYPE_BUY if request.order_type == "BUY" else mt5.ORDER_TYPE_SELL
        
        order_request = {
            "action": mt5.TRADE_ACTION_DEAL,
            "symbol": request.symbol,
            "volume": request.volume,
            "type": order_type,
            "price": request.price,
            "deviation": request.deviation,
            "magic": request.magic,
            "comment": request.comment,
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": mt5.ORDER_FILLING_IOC,
        }
        
        # Add SL/TP if provided
        if request.sl is not None:
            order_request["sl"] = request.sl
        if request.tp is not None:
            order_request["tp"] = request.tp
        
        # Send order
        result = mt5.order_send(order_request)
        
        if result is None:
            error = mt5.last_error()
            raise HTTPException(
                status_code=500,
                detail=f"Order failed: {error}"
            )
        
        if result.retcode != mt5.TRADE_RETCODE_DONE:
            raise HTTPException(
                status_code=400,
                detail=f"Order failed: {result.comment} (retcode: {result.retcode})"
            )
        
        logger.info(f"Order executed: {request.order_type} {request.volume} {request.symbol} @ {request.price}")
        
        return {
            "success": True,
            "order": {
                "ticket": result.order,
                "symbol": request.symbol,
                "type": request.order_type,
                "volume": request.volume,
                "price": result.price,
                "sl": request.sl,
                "tp": request.tp,
                "comment": request.comment,
            }
        }
    
    except Exception as e:
        logger.error(f"Order error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/position/{ticket}")
async def close_position(ticket: int, token: str = Depends(verify_token)):
    """Close a position by ticket"""
    try:
        position = mt5.positions_get(ticket=ticket)
        
        if not position:
            raise HTTPException(
                status_code=404,
                detail=f"Position {ticket} not found"
            )
        
        position = position[0]
        
        # Prepare close order
        close_type = mt5.ORDER_TYPE_SELL if position.type == mt5.POSITION_TYPE_BUY else mt5.ORDER_TYPE_BUY
        
        tick = mt5.symbol_info_tick(position.symbol)
        price = tick.bid if close_type == mt5.ORDER_TYPE_SELL else tick.ask
        
        close_request = {
            "action": mt5.TRADE_ACTION_DEAL,
            "symbol": position.symbol,
            "volume": position.volume,
            "type": close_type,
            "position": ticket,
            "price": price,
            "deviation": 20,
            "magic": position.magic,
            "comment": "Closed by MT5 Worker",
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": mt5.ORDER_FILLING_IOC,
        }
        
        result = mt5.order_send(close_request)
        
        if result is None or result.retcode != mt5.TRADE_RETCODE_DONE:
            error = mt5.last_error() if result is None else result.comment
            raise HTTPException(
                status_code=500,
                detail=f"Failed to close position: {error}"
            )
        
        logger.info(f"Position {ticket} closed")
        
        return {
            "success": True,
            "message": f"Position {ticket} closed successfully"
        }
    
    except Exception as e:
        logger.error(f"Close position error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/deals")
async def get_deals(days: int = 7, token: str = Depends(verify_token)):
    """Get deal history"""
    try:
        from_date = datetime.now() - timedelta(days=days)
        
        deals = mt5.history_deals_get(
            date_from=from_date,
            date_to=datetime.now()
        )
        
        if deals is None:
            return {
                "deals": [],
                "count": 0
            }
        
        deal_list = [
            {
                "ticket": d.ticket,
                "order": d.order,
                "symbol": d.symbol,
                "type": str(d.type),
                "volume": d.volume,
                "price": d.price,
                "profit": d.profit,
                "commission": d.commission,
                "swap": d.swap,
                "magic": d.magic,
                "comment": d.comment,
                "time": datetime.fromtimestamp(d.time).isoformat(),
            }
            for d in deals
        ]
        
        return {
            "deals": deal_list,
            "count": len(deal_list)
        }
    
    except Exception as e:
        logger.error(f"Error getting deals: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    logger.info(f"Starting MT5 Worker on {HOST}:{PORT}")
    logger.info(f"API Token: {API_TOKEN[:10]}...")
    
    uvicorn.run(
        "worker:app",
        host=HOST,
        port=PORT,
        reload=False,
        log_level="info"
    )
