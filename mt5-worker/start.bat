@echo off
REM MT5 Worker Startup Script for Windows
REM ======================================

echo Starting MT5 Worker...
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        echo Make sure Python is installed and in PATH
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Check if dependencies are installed
if not exist "venv\Lib\site-packages\MetaTrader5" (
    echo Installing dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if .env exists
if not exist ".env" (
    echo.
    echo WARNING: .env file not found!
    echo Copying from .env.example...
    copy .env.example .env
    echo.
    echo IMPORTANT: Edit .env and set your MT5_API_TOKEN before continuing!
    echo.
    notepad .env
    pause
)

REM Start the worker
echo.
echo Starting MT5 Worker service...
echo Press Ctrl+C to stop
echo.

python worker.py

pause
