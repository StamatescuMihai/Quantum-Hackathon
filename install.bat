@echo off
:: Quantum Algorithm Explorer - Windows Installation Script
:: This script sets up the development environment for the Quantum Algorithm Explorer

echo 🚀 Setting up Quantum Algorithm Explorer...
echo ========================================

:: Check Python version
echo 📋 Checking Python version...
python --version
if %errorlevel% neq 0 (
    echo ❌ Error: Python is not installed or not in PATH
    echo.
    echo 💡 Solutions:
    echo 1. Download Python 3.11+ from: https://www.python.org/downloads/
    echo 2. Make sure to check "Add Python to PATH" during installation
    echo 3. Or try: py --version (if you have Python Launcher)
    pause
    exit /b 1
)

:: Get and display current Python version
for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo Current Python version: %PYTHON_VERSION%

:: Check if Python 3.9+ is available
python -c "import sys; exit(0 if sys.version_info >= (3, 9) else 1)" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Python 3.9 or higher is required
    echo Current version: %PYTHON_VERSION%
    echo.
    echo 💡 Solutions:
    echo 1. Download Python 3.11 LTS from: https://www.python.org/downloads/release/python-3118/
    echo 2. Or use Python Launcher: py -3.11 --version
    echo 3. Or try with a different Python command:
    echo    - py --version
    echo    - python3 --version
    echo    - python3.11 --version
    echo.
    echo 🔧 Alternative: Try running with specific Python version:
    echo    py -3.11 -m venv venv
    echo.
    pause
    exit /b 1
)

echo ✅ Python version is compatible

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

if exist "frontend\venv" (
    echo Removing existing venv in frontend directory...
    rmdir /s /q frontend\venv
)

:: Create single virtual environment in root
echo 🔧 Creating virtual environment in root directory...
python -m venv venv
echo ✅ Virtual environment created in root directory

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
    echo 💡 If you're using Python 3.12+, this should fix distutils issues
    echo 💡 If problems persist, try installing with Python 3.11 or 3.10
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
        pause
        exit /b 1
    )
    
    echo ✅ Frontend dependencies installed successfully
    cd ..
) else (
    echo ⚠️  Node.js not found. Skipping frontend setup.
    echo 💡 Install Node.js 18+ to set up the frontend
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
    echo 3. Check Python version compatibility
    echo 4. See TROUBLESHOOTING.md for detailed solutions
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
pause
