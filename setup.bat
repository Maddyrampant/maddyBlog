@echo off
echo ============================================
echo  MaddyBlog — Project Setup
echo ============================================
echo.

:: Check if PostgreSQL is accessible
pg_isready >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] PostgreSQL is not running or not installed.
    echo.
    echo Make sure PostgreSQL is running at localhost:5432
    echo and update .env with your credentials.
    echo.
    pause
    exit /b 1
)

echo [1/4] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 exit /b 1

echo [2/4] Pushing database schema...
call npx prisma db push
if %ERRORLEVEL% NEQ 0 exit /b 1

echo [3/4] Seeding database...
call npm run seed
if %ERRORLEVEL% NEQ 0 exit /b 1

echo [4/4] Starting dev server...
call npm run dev

echo.
echo ============================================
echo  Setup complete!
echo  Login: admin@maddyblog.com / admin
echo  Login page: http://localhost:3000/login
echo  Admin:      http://localhost:3000/admin
echo ============================================
pause
