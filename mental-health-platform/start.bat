@echo off
echo ====================================
echo Mental Health Platform - Startup
echo ====================================
echo.

REM Check if MongoDB is running
echo [1/4] Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] MongoDB is already running
) else (
    echo MongoDB not running. Attempting to start...
    
    REM Check if data directory exists
    if not exist "C:\data\db" (
        echo Creating MongoDB data directory...
        mkdir C:\data\db
    )
    
    REM Try to start MongoDB
    where mongod >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo Starting MongoDB...
        start "MongoDB" mongod --dbpath C:\data\db
        timeout /t 5 /nobreak > NUL
        echo [OK] MongoDB started
    ) else (
        echo.
        echo [ERROR] MongoDB not found!
        echo.
        echo Please install MongoDB or use Docker:
        echo   Option 1: docker-compose up
        echo   Option 2: Install MongoDB from https://www.mongodb.com/try/download/community
        echo   Option 3: See MONGODB_SETUP.md for detailed instructions
        echo.
        pause
        exit /b 1
    )
)

echo.
echo [2/4] Starting Backend...
cd backend
start "Backend Server" cmd /k "mvnw.cmd spring-boot:run"
cd ..

echo.
echo [3/4] Waiting for backend to start...
timeout /t 15 /nobreak > NUL

echo.
echo [4/4] Starting Frontend...
cd frontend
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)
start "Frontend Server" cmd /k "npm run dev"
cd ..

echo.
echo ====================================
echo All services started!
echo ====================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8080
echo MongoDB:  localhost:27017
echo.
echo Press any key to stop all services...
pause > NUL

echo.
echo Stopping services...
taskkill /FI "WINDOWTITLE eq Backend Server*" /F
taskkill /FI "WINDOWTITLE eq Frontend Server*" /F

echo.
echo Services stopped. Goodbye!
pause
