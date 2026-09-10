@echo off
title Antigravity Workflows — Setup Launcher
color 0A

echo.
echo  =======================================================
echo    Antigravity Workflows - Fully Automatic Setup
echo  =======================================================
echo.

:: ── Step 1: Check for Node.js in common locations ───────────────────────────

set "NODE_EXE="

:: Check PATH first
where node >nul 2>&1
if %errorlevel% equ 0 (
    set "NODE_EXE=node"
    goto :node_found
)

:: Check standard install paths
if exist "C:\Program Files\nodejs\node.exe" (
    set "NODE_EXE=C:\Program Files\nodejs\node.exe"
    goto :node_found
)
if exist "C:\Program Files (x86)\nodejs\node.exe" (
    set "NODE_EXE=C:\Program Files (x86)\nodejs\node.exe"
    goto :node_found
)
if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" (
    set "NODE_EXE=%LOCALAPPDATA%\Programs\nodejs\node.exe"
    goto :node_found
)

:: ── Node.js NOT found ────────────────────────────────────────────────────────
echo  [!] Node.js is not installed on this computer.
echo.
echo  Node.js is required to run the setup server.
echo  It is FREE and takes about 2 minutes to install.
echo.
echo  -------------------------------------------------------
echo   OPTION 1 (Easiest): Let this script open the download
echo             page for you automatically.
echo.
echo   OPTION 2 (Manual): Go to https://nodejs.org yourself,
echo             download the LTS version, install it,
echo             then run this file again.
echo  -------------------------------------------------------
echo.
set /p OPEN_NODE="  Open nodejs.org download page now? (Y/N): "
if /i "%OPEN_NODE%"=="Y" (
    echo.
    echo  Opening https://nodejs.org in your browser...
    start https://nodejs.org/en/download
    echo.
    echo  After installing Node.js, run this file again.
)
echo.
pause
exit /b 1

:node_found
:: ── Step 2: Show Node version ────────────────────────────────────────────────
for /f "tokens=*" %%i in ('"%NODE_EXE%" --version 2^>^&1') do set NODE_VER=%%i
echo  [OK] Node.js found: %NODE_VER%
echo  [>>] Starting server at: http://localhost:3737
echo.
echo  TIP: Keep this window open while using the setup GUI.
echo       To stop the server, close this window or press Ctrl+C.
echo.
echo  =======================================================
echo.

:: ── Step 3: Start the server ─────────────────────────────────────────────────
"%NODE_EXE%" "%~dp0setup-server.js"

echo.
echo  Server stopped. Press any key to close this window.
pause >nul
