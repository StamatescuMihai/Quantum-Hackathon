#!/bin/bash

# Quantum Algorithm Explorer - Installation Script
# This script sets up the development environment for the Quantum Algorithm Explorer

echo "🚀 Setting up Quantum Algorithm Explorer..."
echo "========================================"

# Function to chececho "🎉 Installation completed successfully!"
echo "========================================"
echo ""
echo "🎯 Python used: $PYTHON_CMD"
echo "📁 Virtual environment: $(pwd)/venv"
echo ""
echo "✅ You can verify your installation anytime by running:"
echo "   python verify_setup.py"
echo ""
echo "📋 Next steps:"Python command exists and meets version requirements
check_python_version() {
    local python_cmd=$1
    local python_version
    
    if command -v $python_cmd &> /dev/null; then
        python_version=$($python_cmd --version 2>&1)
        echo "Found: $python_cmd -> $python_version"
        
        if $python_cmd -c "import sys; exit(0 if sys.version_info >= (3, 9) else 1)" 2>/dev/null; then
            echo "✅ $python_cmd is compatible (>= 3.9)"
            return 0
        else
            echo "⚠️  $python_cmd version too old (need >= 3.9)"
            return 1
        fi
    else
        echo "❌ $python_cmd not found"
        return 1
    fi
}

# Try to find a compatible Python installation
echo "🔍 Detecting Python installation..."
PYTHON_CMD=""

# Try different Python commands in order of preference
python_commands=("python3.11" "python3.10" "python3.9" "python3" "python")

for cmd in "${python_commands[@]}"; do
    echo "Trying $cmd..."
    if check_python_version $cmd; then
        PYTHON_CMD=$cmd
        break
    fi
done

if [ -z "$PYTHON_CMD" ]; then
    echo "❌ No compatible Python installation found!"
    echo ""
    echo "💡 What you need:"
    echo "   - Python 3.9 or higher (recommended: Python 3.11)"
    echo ""
    echo "📥 Installation options:"
    echo "   🐧 Ubuntu/Debian: sudo apt update && sudo apt install python3.11 python3.11-venv"
    echo "   🍎 macOS: brew install python@3.11"
    echo "   🔗 Or download from: https://www.python.org/downloads/"
    echo ""
    echo "🐳 Alternative: Use Docker"
    echo "   If you have Docker installed:"
    echo "   docker-compose up --build"
    echo ""
    exit 1
fi

echo ""
echo "🎯 Using Python: $PYTHON_CMD"
echo ""

# Clean up any existing virtual environments
echo "🧹 Cleaning up existing virtual environments..."
if [ -d "venv" ]; then
    echo "Removing existing venv in root directory..."
    rm -rf venv
fi

if [ -d "backend/venv" ]; then
    echo "Removing existing venv in backend directory..."
    rm -rf backend/venv
fi

if [ -d "frontend/venv" ]; then
    echo "Removing existing venv in frontend directory..."
    rm -rf frontend/venv
fi

# Create single virtual environment in root
echo "🔧 Creating virtual environment in root directory..."
$PYTHON_CMD -m venv venv

if [ $? -eq 0 ]; then
    echo "✅ Virtual environment created in root directory"
else
    echo "❌ Failed to create virtual environment"
    echo "💡 Try installing python3-venv: sudo apt install python3-venv"
    exit 1
fi

# Activate virtual environment
echo "⚡ Activating virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    if [ -f "venv/Scripts/activate" ]; then
        source venv/Scripts/activate
    else
        echo "❌ Virtual environment activation script not found"
        echo "💡 Try recreating the virtual environment"
        exit 1
    fi
else
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
    else
        echo "❌ Virtual environment activation script not found"
        echo "💡 Try recreating the virtual environment"
        exit 1
    fi
fi

# Verify virtual environment is active
if [[ "$VIRTUAL_ENV" == "" ]]; then
    echo "⚠️  Warning: Virtual environment may not be properly activated"
    echo "💡 This might cause issues. Continuing anyway..."
fi

# Upgrade pip
echo "📦 Upgrading pip..."
python -m pip install --upgrade pip

if [ $? -ne 0 ]; then
    echo "⚠️  Warning: Failed to upgrade pip, continuing with current version"
    echo "💡 This might be due to permissions or network issues"
fi

# Install backend dependencies
echo "🔧 Installing backend dependencies..."
cd backend

# Verify we're in the virtual environment
if [[ "$VIRTUAL_ENV" == "" ]]; then
    echo "❌ Virtual environment not activated properly"
    echo "💡 Try running: source ../venv/bin/activate"
    exit 1
fi

echo "Installing from: $(pwd)/requirements.txt"
echo "Using pip from: $(which pip)"
echo "Python location: $(which python)"

# Try installing with different approaches if first fails
echo "Installing Python packages..."
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "⚠️  Initial installation failed, trying alternative approaches..."
    
    # Try upgrading setuptools first
    echo "Upgrading setuptools and wheel..."
    pip install --upgrade setuptools wheel
    
    # Try installing without cache
    echo "Retrying installation without cache..."
    pip install -r requirements.txt --no-cache-dir
    
    if [ $? -eq 0 ]; then
        echo "✅ Backend dependencies installed successfully (retry)"
    else
        echo "❌ Error installing backend dependencies"
        echo ""
        echo "💡 Troubleshooting suggestions:"
        echo "   1. Check if you have internet connection"
        echo "   2. Try: pip install --upgrade pip setuptools wheel"
        echo "   3. For Python 3.12+ issues, try Python 3.11"
        echo "   4. Check TROUBLESHOOTING.md for more solutions"
        echo "   5. Alternative: Use Docker with 'docker-compose up --build'"
        echo ""
        echo "🔍 Debug info:"
        echo "   Virtual env: $VIRTUAL_ENV"
        echo "   Python: $(python --version)"
        echo "   Pip: $(pip --version)"
        echo ""
        exit 1
    fi
fi

cd ..

# Install frontend dependencies (if Node.js is available)
if command -v npm &> /dev/null; then
    echo "🌐 Installing frontend dependencies..."
    cd frontend
    
    # Check Node.js version
    node_version=$(node --version 2>&1)
    echo "Found Node.js: $node_version"
    
    # Install dependencies with error handling
    npm install
    
    if [ $? -eq 0 ]; then
        echo "✅ Frontend dependencies installed successfully"
    else
        echo "⚠️  npm install failed, trying alternative approaches..."
        
        # Clear cache and retry
        echo "Clearing npm cache..."
        npm cache clean --force
        
        echo "Retrying npm install..."
        npm install
        
        if [ $? -eq 0 ]; then
            echo "✅ Frontend dependencies installed successfully (retry)"
        else
            echo "❌ Error installing frontend dependencies"
            echo ""
            echo "💡 Try these solutions:"
            echo "   1. Update Node.js to version 18+ from: https://nodejs.org/"
            echo "   2. Delete node_modules: rm -rf node_modules package-lock.json"
            echo "   3. Try yarn instead: npm install -g yarn && yarn install"
            echo "   4. Check your internet connection"
            echo ""
            # Don't exit here, continue with backend only
        fi
    fi
    cd ..
else
    echo "⚠️  Node.js not found. Skipping frontend setup."
    echo "💡 To set up frontend:"
    echo "   1. Install Node.js 18+ from: https://nodejs.org/"
    echo "   2. Or use package manager:"
    echo "      🐧 Ubuntu: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs"
    echo "      🍎 macOS: brew install node"
    echo "   3. Then run: cd frontend && npm install"
fi

# Test backend installation
echo "🧪 Testing backend installation..."
cd backend

echo "Testing critical imports..."
python -c "
import sys
print(f'Python version: {sys.version}')
print('Testing imports...')

try:
    import fastapi
    print('✅ FastAPI: OK')
except ImportError as e:
    print(f'❌ FastAPI failed: {e}')
    sys.exit(1)

try:
    import qiskit
    print(f'✅ Qiskit {qiskit.__version__}: OK')
except ImportError as e:
    print(f'❌ Qiskit failed: {e}')
    print('💡 Try: pip install --upgrade qiskit qiskit-aer')
    sys.exit(1)

try:
    from qiskit_aer import AerSimulator
    print('✅ Qiskit Aer: OK')
except ImportError as e:
    print(f'❌ Qiskit Aer failed: {e}')
    print('💡 Try: pip install qiskit-aer --force-reinstall')
    sys.exit(1)

try:
    from qiskit import QuantumCircuit
    # Test creating a simple circuit
    qc = QuantumCircuit(2)
    qc.h(0)
    qc.cx(0, 1)
    print('✅ Quantum circuit creation: OK')
except Exception as e:
    print(f'❌ Quantum circuit test failed: {e}')
    sys.exit(1)

try:
    import numpy as np
    import scipy
    print('✅ Scientific packages (numpy, scipy): OK')
except ImportError as e:
    print(f'❌ Scientific package failed: {e}')
    sys.exit(1)

print('✅ All critical packages imported and tested successfully!')
"

if [ $? -eq 0 ]; then
    echo "✅ Backend installation test passed"
    
    # Additional verification - test actual FastAPI app import
    echo "🔍 Testing FastAPI app import..."
    python -c "
try:
    from app.main import app
    print('✅ FastAPI app import: OK')
except Exception as e:
    print(f'❌ FastAPI app import failed: {e}')
    exit(1)
"
    
    if [ $? -eq 0 ]; then
        echo "✅ Complete backend verification passed"
    else
        echo "⚠️  App import failed - check algorithm dependencies"
        echo "💡 The backend may still work but some algorithms might have issues"
    fi
else
    echo "❌ Backend installation test failed"
    echo ""
    echo "💡 Common solutions:"
    echo "   1. Reactivate virtual environment: source venv/bin/activate"
    echo "   2. Reinstall packages: pip install -r requirements.txt --force-reinstall"
    echo "   3. Check Python version compatibility"
    echo "   4. See TROUBLESHOOTING.md for detailed solutions"
    echo ""
    echo "🔍 Debug info:"
    echo "   Virtual env: $VIRTUAL_ENV" 
    echo "   Current directory: $(pwd)"
    echo "   Python path: $(which python)"
    echo ""
    exit 1
fi

cd ..

echo ""
echo "🎉 Installation completed successfully!"
echo "========================================"
echo ""
echo "🎯 Python used: $PYTHON_CMD"
echo "� Virtual environment: $(pwd)/venv"
echo ""
echo "�📋 Next steps:"
echo "1. Activate the virtual environment:"
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "   source venv/Scripts/activate"
else
    echo "   source venv/bin/activate"
fi
echo ""
echo "2. Start the backend server:"
echo "   cd backend"
echo "   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
echo ""

# Check if frontend was installed
if [ -d "frontend/node_modules" ]; then
    echo "3. In another terminal, start the frontend:"
    echo "   cd frontend"
    echo "   npm run dev"
    echo ""
elif command -v npm &> /dev/null; then
    echo "3. Set up and start the frontend:"
    echo "   cd frontend"
    echo "   npm install"
    echo "   npm run dev"
    echo ""
else
    echo "3. To set up frontend later:"
    echo "   - Install Node.js 18+ from: https://nodejs.org/"
    echo "   - Then: cd frontend && npm install && npm run dev"
    echo ""
fi

echo "4. Or use Docker Compose (recommended):"
echo "   docker-compose up --build"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/api/docs"
echo ""
echo "📚 Additional resources:"
echo "   📖 README.md - Project overview and usage"
echo "   🔧 TROUBLESHOOTING.md - Solutions for common issues"
echo "   🚀 DEPLOYMENT.md - Production deployment guide"
echo ""
echo "✨ Happy quantum computing!"
echo ""
echo "💡 If you encounter any issues:"
echo "   1. Check the virtual environment is activated"
echo "   2. Consult TROUBLESHOOTING.md"
echo "   3. Try Docker as an alternative: docker-compose up --build"
