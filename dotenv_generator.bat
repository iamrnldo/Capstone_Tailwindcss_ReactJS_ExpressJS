@echo off
REM ===================================================
REM  .env File Generator for Capstone Project
REM ===================================================

echo.
echo ========================================
echo   Capstone Project - .env Generator
echo ========================================
echo.

REM Check if backend folder exists
if not exist "backend" (
    echo [ERROR] backend folder not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

REM Check if .env already exists
if exist "backend\.env" (
    echo [WARNING] backend\.env already exists!
    echo.
    set /p overwrite="Do you want to overwrite it? (Y/N): "
    if /i not "%overwrite%"=="Y" (
        echo.
        echo [CANCELLED] .env file was not modified.
        pause
        exit /b 0
    )
)

REM Create the .env file
echo [INFO] Creating backend\.env file...
(
echo # Server Configuration
echo PORT=5000
echo.
echo # Google OAuth Configuration
echo GOOGLE_CLIENT_ID=212635796328-ji8f0osjm9ao2pflogu8oal40kn6he5c.apps.googleusercontent.com
echo GOOGLE_CLIENT_SECRET=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
echo GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
echo.
echo # JWT Secret
echo JWT_SECRET=a4a24bb7f5774a62ed3b9cecce8155e5
echo.
echo # Database Configuration
echo DATABASE_URL=postgres://postgres:joki@localhost:5432/capstone
echo.
echo # Frontend URL
echo FRONTEND_URL=http://localhost:5173
) > backend\.env

if exist "backend\.env" (
    echo.
    echo [SUCCESS] .env file created successfully at: backend\.env
    echo.
    echo ========================================
    echo   Configuration Details:
    echo ========================================
    echo   - Server Port: 5000
    echo   - Database: capstone
    echo   - Frontend: http://localhost:5173
    echo ========================================
    echo.
    echo [NOTE] Make sure PostgreSQL is running and database 'capstone' exists.
    echo [NOTE] Keep your .env file secure and never commit it to git!
    echo.
) else (
    echo.
    echo [ERROR] Failed to create .env file!
    pause
    exit /b 1
)

pause