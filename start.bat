@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
cls
title EV Sales Prediction Platform - One-Click Starter

echo ========================================
echo        EV Sales Prediction Platform
echo            One-Click Starter
echo ========================================
echo.
echo [1/5] Checking environment...
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js not found!
    echo Install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: npm not found!
    echo Reinstall Node.js and configure environment variables
    echo.
    pause
    exit /b 1
)

echo ✅ Environment check passed
echo.

echo [2/5] Checking project files...
echo.

if not exist "%~dp0backend" (
    echo ❌ Error: backend directory not found!
    echo Make sure start.bat is in project root
    echo Current path: %~dp0
    echo.
    pause
    exit /b 1
)

if not exist "%~dp0backend\package.json" (
    echo ❌ Error: package.json not found!
    echo Check backend directory integrity
    echo.
    pause
    exit /b 1
)

echo ✅ Project files check passed
echo.

echo [3/5] Entering backend directory...
cd /d "%~dp0backend"
echo Current directory: %cd%
echo.

echo [4/5] Installing/updating dependencies (first run may take time)...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Dependency installation failed! Check network or npm config
    echo.
    pause
    exit /b 1
)

echo ✅ Dependencies installed
echo.

echo [5/5] Starting server...
echo [IMPORTANT] DO NOT CLOSE THIS WINDOW!
echo Server will open browser automatically
echo.
call npm start

start http://localhost:3000

echo.
echo ✅ Server started! Access at http://localhost:3000
echo.
pause
endlocal