"""
Sample Trading Strategy: Liquidity Sweep + BOS + FVG
=====================================================
This is a sample Python trading bot for testing the AI Backtester platform.

Strategy Logic:
1. Detect liquidity sweep (price sweeps recent swing low/high)
2. Confirm with Break of Structure (BOS)
3. Enter on Fair Value Gap (FVG) retest
4. Use ATR-based stop loss and take profit

Author: AI Backtester Team
Version: 1.0
"""

import MetaTrader5 as mt5
import numpy as np
from datetime import datetime
import time


class LiquiditySweepStrategy:
    """
    Liquidity Sweep + BOS + FVG Strategy
    Trades XAUUSD on M1 timeframe
    """
    
    def __init__(self):
        # Configuration
        self.symbol = "XAUUSD"
        self.timeframe = mt5.TIMEFRAME_M1
        self.lot_size = 0.10
        self.magic_number = 20260101
        self.max_spread = 20  # points
        self.atr_period = 14
        self.atr_multiplier_sl = 1.5
        self.atr_multiplier_tp = 2.5
        self.max_trades = 3
        self.cooldown_minutes = 30
        
        # State
        self.last_trade_time = None
        self.positions = []
        
    def initialize(self):
        """Initialize MT5 connection"""
        if not mt5.initialize():
            print(f"MT5 initialization failed: {mt5.last_error()}")
            return False
        
        # Check symbol availability
        symbol_info = mt5.symbol_info(self.symbol)
        if symbol_info is None:
            print(f"Symbol {self.symbol} not found")
            mt5.shutdown()
            return False
        
        if not symbol_info.visible:
            if not mt5.symbol_select(self.symbol, True):
                print(f"Failed to select symbol {self.symbol}")
                mt5.shutdown()
                return False
        
        print(f"Strategy initialized: {self.symbol} {self.timeframe}")
        return True
    
    def calculate_atr(self, candles, period=14):
        """Calculate Average True Range"""
        if len(candles) < period + 1:
            return None
        
        high = np.array([c['high'] for c in candles])
        low = np.array([c['low'] for c in candles])
        close = np.array([c['close'] for c in candles])
        
        tr1 = high[1:] - low[1:]
        tr2 = np.abs(high[1:] - close[:-1])
        tr3 = np.abs(low[1:] - close[:-1])
        
        tr = np.maximum(tr1, np.maximum(tr2, tr3))
        atr = np.convolve(tr, np.ones(period)/period, mode='valid')
        
        return atr[-1] if len(atr) > 0 else None
    
    def detect_liquidity_sweep(self, candles, direction='bullish'):
        """
        Detect liquidity sweep pattern
        Bullish: Price sweeps below recent swing low then closes above
        Bearish: Price sweeps above recent swing high then closes below
        """
        if len(candles) < 20:
            return False
        
        if direction == 'bullish':
            # Find swing low (lowest point in last 20 candles, excluding last 3)
            swing_lows = [c['low'] for c in candles[-20:-3]]
            swing_low = min(swing_lows)
            
            # Check if current candle swept below and closed above
            current = candles[-1]
            return current['low'] < swing_low and current['close'] > swing_low
        else:
            # Find swing high
            swing_highs = [c['high'] for c in candles[-20:-3]]
            swing_high = max(swing_highs)
            
            current = candles[-1]
            return current['high'] > swing_high and current['close'] < swing_high
    
    def detect_bos(self, candles, direction='bullish'):
        """
        Detect Break of Structure
        Bullish BOS: Close above recent swing high
        Bearish BOS: Close below recent swing low
        """
        if len(candles) < 10:
            return False
        
        if direction == 'bullish':
            highs = [c['high'] for c in candles[-10:-1]]
            swing_high = max(highs)
            return candles[-1]['close'] > swing_high
        else:
            lows = [c['low'] for c in candles[-10:-1]]
            swing_low = min(lows)
            return candles[-1]['close'] < swing_low
    
    def detect_fvg(self, candles):
        """
        Detect Fair Value Gap
        Bullish FVG: Candle 3 low > Candle 1 high
        Bearish FVG: Candle 3 high < Candle 1 low
        """
        if len(candles) < 3:
            return False, None
        
        c1 = candles[-3]
        c2 = candles[-2]
        c3 = candles[-1]
        
        # Bullish FVG
        if c3['low'] > c1['high']:
            return True, 'bullish'
        
        # Bearish FVG
        if c3['high'] < c1['low']:
            return True, 'bearish'
        
        return False, None
    
    def check_cooldown(self):
        """Check if enough time has passed since last trade"""
        if self.last_trade_time is None:
            return True
        
        elapsed = (datetime.now() - self.last_trade_time).total_seconds() / 60
        return elapsed >= self.cooldown_minutes
    
    def get_open_positions(self):
        """Get current open positions for this symbol"""
        positions = mt5.positions_get(symbol=self.symbol)
        if positions is None:
            return []
        return [p for p in positions if p.magic == self.magic_number]
    
    def check_signal(self):
        """Main signal generation logic"""
        # Check cooldown
        if not self.check_cooldown():
            return None
        
        # Check max trades
        open_positions = self.get_open_positions()
        if len(open_positions) >= self.max_trades:
            return None
        
        # Get candles
        candles = mt5.copy_rates_from_pos(
            self.symbol,
            self.timeframe,
            0,
            100
        )
        
        if candles is None or len(candles) < 20:
            return None
        
        # Convert to list of dicts
        candle_list = [
            {
                'time': c[0],
                'open': c[1],
                'high': c[2],
                'low': c[3],
                'close': c[4],
                'volume': c[5]
            }
            for c in candles
        ]
        
        # Check spread
        tick = mt5.symbol_info_tick(self.symbol)
        symbol_info = mt5.symbol_info(self.symbol)
        spread = (tick.ask - tick.bid) / symbol_info.point
        
        if spread > self.max_spread:
            return None
        
        # Calculate ATR
        atr = self.calculate_atr(candle_list, self.atr_period)
        if atr is None:
            return None
        
        # Detect patterns
        liq_sweep_bull = self.detect_liquidity_sweep(candle_list, 'bullish')
        liq_sweep_bear = self.detect_liquidity_sweep(candle_list, 'bearish')
        bos_bull = self.detect_bos(candle_list, 'bullish')
        bos_bear = self.detect_bos(candle_list, 'bearish')
        has_fvg, fvg_type = self.detect_fvg(candle_list)
        
        # Generate signals
        if liq_sweep_bull and bos_bull and has_fvg and fvg_type == 'bullish':
            return {
                'direction': 'BUY',
                'price': tick.ask,
                'sl': tick.ask - (atr * self.atr_multiplier_sl),
                'tp': tick.ask + (atr * self.atr_multiplier_tp),
                'reason': 'Liquidity Sweep + Bullish BOS + FVG Retest'
            }
        
        if liq_sweep_bear and bos_bear and has_fvg and fvg_type == 'bearish':
            return {
                'direction': 'SELL',
                'price': tick.bid,
                'sl': tick.bid + (atr * self.atr_multiplier_sl),
                'tp': tick.bid - (atr * self.atr_multiplier_tp),
                'reason': 'Liquidity Sweep + Bearish BOS + FVG Retest'
            }
        
        return None
    
    def execute_trade(self, signal):
        """Execute trade via MT5"""
        order_type = mt5.ORDER_TYPE_BUY if signal['direction'] == 'BUY' else mt5.ORDER_TYPE_SELL
        
        request = {
            "action": mt5.TRADE_ACTION_DEAL,
            "symbol": self.symbol,
            "volume": self.lot_size,
            "type": order_type,
            "price": signal['price'],
            "sl": signal['sl'],
            "tp": signal['tp'],
            "deviation": 20,
            "magic": self.magic_number,
            "comment": signal['reason'],
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": mt5.ORDER_FILLING_IOC,
        }
        
        result = mt5.order_send(request)
        
        if result is None:
            print(f"Order failed: {mt5.last_error()}")
            return False
        
        if result.retcode != mt5.TRADE_RETCODE_DONE:
            print(f"Order failed: {result.comment}")
            return False
        
        print(f"Trade executed: {signal['direction']} @ {signal['price']}")
        self.last_trade_time = datetime.now()
        return True
    
    def run(self):
        """Main strategy loop"""
        if not self.initialize():
            return
        
        print(f"Strategy running on {self.symbol}")
        
        try:
            while True:
                signal = self.check_signal()
                
                if signal:
                    self.execute_trade(signal)
                
                # Wait for next candle
                time.sleep(1)
        
        except KeyboardInterrupt:
            print("\nStrategy stopped by user")
        
        finally:
            mt5.shutdown()
            print("MT5 connection closed")


if __name__ == "__main__":
    strategy = LiquiditySweepStrategy()
    strategy.run()
