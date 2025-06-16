# Troubleshooting Guide - Quantum Algorithm Explorer

## Common Installation Issues and Solutions

### 1. `ModuleNotFoundError: No module named 'distutils'`

**Problem**: This error occurs with Python 3.12+ where `distutils` has been removed.

**Solutions**:

#### Option A: Use Python 3.11 or 3.10 (Recommended)
```bash
# Install Python 3.11 using pyenv (Linux/macOS)
pyenv install 3.11.8
pyenv local 3.11.8

# Or download from python.org for Windows
# https://www.python.org/downloads/release/python-3118/
```

#### Option B: Use the updated requirements.txt
The project has been updated with Python 3.12+ compatible dependencies:
```bash
# Make sure you're using the latest requirements.txt
cd backend
pip install -r requirements.txt
```

#### Option C: Manual fix for older dependencies
```bash
# Install setuptools explicitly
pip install setuptools>=69.0.0

# Then install requirements
pip install -r requirements.txt
```

### 2. Qiskit Installation Issues

**Problem**: Qiskit fails to install or import.

**Solutions**:

#### Update to Qiskit 1.0+
```bash
pip uninstall qiskit qiskit-aer
pip install qiskit==1.0.2 qiskit-aer==0.14.1
```

#### For Apple Silicon Macs
```bash
# Use conda for better compatibility
conda install -c conda-forge qiskit qiskit-aer
```

#### For Windows with Python 3.12
```bash
# Install Microsoft Visual C++ Build Tools if needed
# Then install with specific versions
pip install qiskit==1.0.2 qiskit-aer==0.14.1 --no-cache-dir
```

### 3. FastAPI/Uvicorn Issues

**Problem**: FastAPI server won't start or import errors.

**Solutions**:

#### Update FastAPI and dependencies
```bash
pip install fastapi==0.110.0 uvicorn[standard]==0.29.0
```

#### Check port conflicts
```bash
# Windows
netstat -ano | findstr :8000

# Linux/macOS
lsof -i :8000

# Kill process if needed
# Windows: taskkill /PID <PID> /F
# Linux/macOS: kill -9 <PID>
```

### 4. Node.js/Frontend Issues

**Problem**: Frontend won't start or build.

**Solutions**:

#### Use Node.js 18 LTS
```bash
# Install Node.js 18 LTS from nodejs.org
# Or use nvm
nvm install 18
nvm use 18
```

#### Clear npm cache
```bash
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### Use alternative package managers
```bash
# Use yarn instead of npm
npm install -g yarn
yarn install
yarn dev

# Or use pnpm
npm install -g pnpm
pnpm install
pnpm dev
```

### 5. Docker Issues

**Problem**: Docker containers won't build or start.

**Solutions**:

#### Increase Docker memory
```bash
# In Docker Desktop settings, increase memory to 4GB+
```

#### Clear Docker cache
```bash
docker system prune -a
docker-compose down --volumes
docker-compose up --build
```

#### Platform-specific builds
```bash
# For Apple Silicon
docker-compose build --platform linux/amd64

# For Windows
docker-compose up --build --force-recreate
```

### 6. Virtual Environment Issues

**Problem**: Virtual environment activation fails or packages not found.

**Solutions**:

#### Recreate virtual environment
```bash
# Remove old environment
rm -rf venv  # Linux/macOS
rmdir /s venv  # Windows

# Create new environment
python -m venv venv

# Activate (Linux/macOS)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt
```

#### Use conda instead
```bash
# Create conda environment
conda create -n quantum-explorer python=3.11
conda activate quantum-explorer
conda install -c conda-forge fastapi uvicorn qiskit qiskit-aer
pip install -r backend/requirements.txt
```

### 7. Import Errors with Quantum Libraries

**Problem**: Qiskit or quantum-related imports fail.

**Solutions**:

#### Install quantum extras
```bash
pip install qiskit[all] qiskit-algorithms qiskit-machine-learning
```

#### Version compatibility check
```python
# Test quantum imports
python -c "
import qiskit
print(f'Qiskit version: {qiskit.__version__}')
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator
print('✅ Qiskit imports successful')
"
```

### 8. Matplotlib/Visualization Issues

**Problem**: Circuit visualization fails or matplotlib errors.

**Solutions**:

#### Install GUI backend
```bash
# For Linux
sudo apt-get install python3-tk

# For macOS
brew install python-tk

# For all platforms
pip install matplotlib==3.8.4 pillow
```

#### Use non-interactive backend
```python
# Add to the beginning of your Python scripts
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
```

### 9. Permission/Access Issues

**Problem**: Permission denied errors during installation.

**Solutions**:

#### Use user installation
```bash
pip install --user -r requirements.txt
```

#### Fix permissions (Linux/macOS)
```bash
sudo chown -R $USER ~/.local
sudo chown -R $USER venv
```

#### Run as administrator (Windows)
```powershell
# Open PowerShell as Administrator
# Then run installation commands
```

### 10. Testing Issues

**Problem**: Tests fail to run or import errors in tests.

**Solutions**:

#### Install test dependencies
```bash
pip install pytest pytest-asyncio httpx requests
```

#### Run tests with proper path
```bash
cd backend
python -m pytest test_api.py -v
```

#### Skip failing tests temporarily
```bash
pytest test_api.py -v --ignore-glob="*problematic*"
```

## Quick Diagnostics

### Check Python Setup
```bash
python --version
python -c "import sys; print(sys.executable)"
python -c "import site; print(site.getsitepackages())"
```

### Check Virtual Environment
```bash
which python  # Linux/macOS
where python   # Windows
pip list | grep qiskit
pip list | grep fastapi
```

### Check Network/Firewall
```bash
# Test if ports are accessible
curl http://localhost:8000/health
telnet localhost 8000
```

### Environment Variables
```bash
# Check PATH
echo $PATH  # Linux/macOS
echo %PATH% # Windows

# Check Python path
python -c "import sys; print('\n'.join(sys.path))"
```

## Getting Help

If you're still experiencing issues:

1. **Check the GitHub Issues**: Look for similar problems and solutions
2. **Update everything**: Make sure you have the latest versions
3. **Use Docker**: If local installation fails, try Docker
4. **Community support**: Qiskit Slack, Stack Overflow
5. **Create an issue**: Provide full error messages and system info

### System Information Template
When reporting issues, include:
```
OS: [Windows 10/11, macOS, Ubuntu, etc.]
Python version: [python --version]
Node.js version: [node --version] (if applicable)
Docker version: [docker --version] (if applicable)
Error message: [full error with traceback]
Steps to reproduce: [what you did before the error]
```

## Prevention Tips

1. **Use virtual environments**: Always isolate project dependencies
2. **Pin dependency versions**: Use exact versions in requirements.txt
3. **Regular updates**: Keep dependencies updated but test thoroughly
4. **Documentation**: Keep track of working configurations
5. **Backup environments**: Export working environments for recovery
