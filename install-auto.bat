@echo off
:: Alternative installation script that tries multiple Python versions
:: Quantum Algorithm Explorer - Python Version Auto-Detection

echo 🚀 Quantum Algorithm Explorer - Smart Setup
echo =============================================

:: Try different Python commands
set PYTHON_CMD=
set PYTHON_VERSION=

echo 🔍 Detecting Python installation...

:: Try python command first
python --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=2" %%i in ('python --version 2^>^&1') do set TEMP_VERSION=%%i
    python -c "import sys; exit(0 if sys.version_info >= (3, 9) else 1)" >nul 2>&1
    if %errorlevel% equ 0 (
        set PYTHON_CMD=python
        set PYTHON_VERSION=!TEMP_VERSION!
        echo ✅ Found compatible Python: !TEMP_VERSION!
        goto :setup
    ) else (
        echo ⚠️  Found Python !TEMP_VERSION! but need 3.9+
    )
)

:: Try py launcher with different versions
echo 🔍 Trying Python Launcher...
py -3.11 --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=2" %%i in ('py -3.11 --version 2^>^&1') do set TEMP_VERSION=%%i
    set PYTHON_CMD=py -3.11
    set PYTHON_VERSION=!TEMP_VERSION!
    echo ✅ Found Python 3.11: !TEMP_VERSION!
    goto :setup
)

py -3.10 --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=2" %%i in ('py -3.10 --version 2^>^&1') do set TEMP_VERSION=%%i
    set PYTHON_CMD=py -3.10
    set PYTHON_VERSION=!TEMP_VERSION!
    echo ✅ Found Python 3.10: !TEMP_VERSION!
    goto :setup
)

py -3.9 --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=2" %%i in ('py -3.9 --version 2^>^&1') do set TEMP_VERSION=%%i
    set PYTHON_CMD=py -3.9
    set PYTHON_VERSION=!TEMP_VERSION!
    echo ✅ Found Python 3.9: !TEMP_VERSION!
    goto :setup
)

:: Try latest available version
py --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=2" %%i in ('py --version 2^>^&1') do set TEMP_VERSION=%%i
    py -c "import sys; exit(0 if sys.version_info >= (3, 9) else 1)" >nul 2>&1
    if %errorlevel% equ 0 (
        set PYTHON_CMD=py
        set PYTHON_VERSION=!TEMP_VERSION!
        echo ✅ Found compatible Python via launcher: !TEMP_VERSION!
        goto :setup
    )
)

:: Try python3 command
python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=2" %%i in ('python3 --version 2^>^&1') do set TEMP_VERSION=%%i
    python3 -c "import sys; exit(0 if sys.version_info >= (3, 9) else 1)" >nul 2>&1
    if %errorlevel% equ 0 (
        set PYTHON_CMD=python3
        set PYTHON_VERSION=!TEMP_VERSION!
        echo ✅ Found compatible python3: !TEMP_VERSION!
        goto :setup
    )
)

:: No compatible Python found
echo ❌ No compatible Python installation found!
echo.
echo 💡 What you need:
echo    - Python 3.9 or higher (recommended: Python 3.11)
echo.
echo 📥 Download Python:
echo    - Official: https://www.python.org/downloads/
echo    - Python 3.11 LTS: https://www.python.org/downloads/release/python-3118/
echo.
echo 🔧 Installation tips:
echo    1. Download Python 3.11 from the link above
echo    2. During installation, check "Add Python to PATH"
echo    3. Choose "Install for all users" if you have admin rights
echo    4. After installation, restart your command prompt
echo    5. Run this script again
echo.
echo 🐳 Alternative: Use Docker
echo    If you have Docker installed, you can skip Python setup:
echo    docker-compose up --build
echo.
pause
exit /b 1

:setup
setlocal enabledelayedexpansion
echo.
echo 🎯 Using Python: %PYTHON_CMD% (%PYTHON_VERSION%)
echo.

:: Clean up any existing virtual environments
echo 🧹 Cleaning up existing virtual environments...
if exist "venv" (
    echo Removing existing venv in root directory...
    rmdir /s /q venv
)

if exist "backend\venv" (
    echo Removing existing venv in backend directory...
    rmdir /s /q backend\venv
)

:: Create virtual environment
echo 🔧 Creating virtual environment...
%PYTHON_CMD% -m venv venv
if %errorlevel% neq 0 (
    echo ❌ Failed to create virtual environment
    echo Try running as administrator or check Python installation
    pause
    exit /b 1
)

echo ✅ Virtual environment created

:: Activate virtual environment
echo ⚡ Activating virtual environment...
call venv\Scripts\activate.bat

:: Upgrade pip
echo 📦 Upgrading pip...
python -m pip install --upgrade pip

:: Install backend dependencies
echo 🔧 Installing backend dependencies...
cd backend
pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo ❌ Error installing backend dependencies
    echo.
    echo 💡 Troubleshooting tips:
    echo 1. Try: pip install --upgrade setuptools wheel
    echo 2. Or try: pip install -r requirements.txt --no-cache-dir
    echo 3. Check TROUBLESHOOTING.md for more solutions
    pause
    exit /b 1
)

echo ✅ Backend dependencies installed successfully
cd ..

:: Install frontend dependencies (if Node.js is available)
where npm >nul 2>&1
if %errorlevel% equ 0 (
    echo 🌐 Installing frontend dependencies...
    cd frontend
    npm install
    
    if %errorlevel% neq 0 (
        echo ❌ Error installing frontend dependencies
        echo Try: npm cache clean --force && npm install
        pause
        exit /b 1
    )
    
    echo ✅ Frontend dependencies installed successfully
    cd ..
) else (
    echo ⚠️  Node.js not found. Skipping frontend setup.
    echo 💡 Install Node.js 18+ from: https://nodejs.org/
)

:: Test backend installation
echo 🧪 Testing backend installation...
cd backend
python -c "import sys; print(f'Python version: {sys.version}'); print('Testing imports...'); import fastapi; print('✅ FastAPI: OK'); import qiskit; print(f'✅ Qiskit {qiskit.__version__}: OK'); from qiskit_aer import AerSimulator; print('✅ Qiskit Aer: OK'); from qiskit import QuantumCircuit; qc = QuantumCircuit(2); qc.h(0); qc.cx(0, 1); print('✅ Quantum circuit creation: OK'); import numpy as np; import scipy; print('✅ Scientific packages: OK'); print('✅ All critical packages imported and tested successfully!')"

if %errorlevel% neq 0 (
    echo ❌ Backend installation test failed
    echo.
    echo 💡 Common solutions:
    echo 1. Reactivate virtual environment: venv\Scripts\activate
    echo 2. Reinstall packages: pip install -r requirements.txt --force-reinstall
    echo 3. Try with a different Python version
    echo 4. Check TROUBLESHOOTING.md for detailed solutions
    echo.
    pause
    exit /b 1
)

echo ✅ Backend installation test passed
cd ..

echo.
echo 🎉 Installation completed successfully!
echo ========================================
echo.
echo ✅ You can verify your installation anytime by running:
echo    python verify_setup.py
echo.
echo 📋 Next steps:
echo 1. Activate the virtual environment:
echo    venv\Scripts\activate
echo.
echo 2. Start the backend server:
echo    cd backend
echo    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
echo.

where npm >nul 2>&1
if %errorlevel% equ 0 (
    echo 3. In another terminal, start the frontend:
    echo    cd frontend
    echo    npm run dev
    echo.
)

echo 4. Or use Docker Compose (recommended):
echo    docker-compose up --build
echo.
echo 🌐 Access the application:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8000
echo    API Docs: http://localhost:8000/api/docs
echo.
echo ✨ Happy quantum computing!
echo.
echo 💡 If you encounter issues, check TROUBLESHOOTING.md
pause
