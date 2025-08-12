@echo off
title WPG Amenities Screenshot Tool

echo.
echo ========================================
echo   WPG Amenities Screenshot Tool
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if npm packages are installed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

:: Check if server is running
echo Checking if server is running...
powershell -Command "try { (Invoke-WebRequest -Uri 'http://localhost:8080' -TimeoutSec 2).StatusCode } catch { 'ERROR' }" >temp_check.txt 2>nul
set /p server_status=<temp_check.txt
del temp_check.txt >nul 2>&1

if "%server_status%" neq "200" (
    echo.
    echo WARNING: Development server is not running on localhost:8080
    echo.
    echo Please start the server first:
    echo   npm run start
    echo.
    echo Then run this script again.
    echo.
    set /p choice="Do you want to start the server now? (y/n): "
    if /i "%choice%"=="y" (
        echo Starting server...
        start "WPG Dev Server" cmd /k npm run start
        echo.
        echo Server is starting in a new window...
        echo Wait for it to start, then run this script again.
        pause
        exit /b 0
    ) else (
        pause
        exit /b 1
    )
)

echo Server is running! ✓
echo.

:: Menu for screenshot options
echo Choose screenshot option:
echo.
echo 1. All viewports (Desktop + Tablet + Mobile)
echo 2. Desktop only
echo 3. Mobile only  
echo 4. Tablet only
echo 5. Custom URL
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo Taking screenshots for all viewports...
    node scripts/screenshot-pages.js
) else if "%choice%"=="2" (
    echo Taking desktop screenshots...
    node scripts/screenshot-pages.js --desktop-only
) else if "%choice%"=="3" (
    echo Taking mobile screenshots...
    node scripts/screenshot-pages.js --mobile-only
) else if "%choice%"=="4" (
    echo Taking tablet screenshots...
    node scripts/screenshot-pages.js --tablet-only
) else if "%choice%"=="5" (
    set /p custom_url="Enter custom URL (e.g., http://localhost:3000): "
    echo Taking screenshots from custom URL...
    node scripts/screenshot-pages.js --url "!custom_url!"
) else (
    echo Invalid choice. Using default (all viewports)...
    node scripts/screenshot-pages.js
)

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   Screenshots completed successfully!
    echo ========================================
    echo.
    echo Results saved to: screenshots\
    echo.
    set /p open_report="Open the HTML report? (y/n): "
    if /i "!open_report!"=="y" (
        start "" "screenshots\screenshot-report.html"
    )
    
    set /p open_folder="Open screenshots folder? (y/n): "
    if /i "!open_folder!"=="y" (
        start "" "screenshots"
    )
) else (
    echo.
    echo ========================================
    echo   Some screenshots failed
    echo ========================================
    echo.
    echo Check the HTML report for details: screenshots\screenshot-report.html
)

echo.
echo Press any key to exit...
pause >nul