#!/usr/bin/env python3
"""
Quantum Algorithm Explorer - Setup Verification Script
This script verifies that all required dependencies are properly installed
and working correctly.
"""

import sys
import subprocess
from typing import Dict, List, Tuple

def check_python_version() -> Tuple[bool, str]:
    """Check if Python version meets requirements."""
    version = sys.version_info
    if version >= (3, 9):
        return True, f"✅ Python {version.major}.{version.minor}.{version.micro}"
    else:
        return False, f"❌ Python {version.major}.{version.minor}.{version.micro} (need >= 3.9)"

def check_package_import(package_name: str, import_name: str = None) -> Tuple[bool, str]:
    """Check if a package can be imported."""
    if import_name is None:
        import_name = package_name
    
    try:
        if package_name == "qiskit":
            import qiskit
            return True, f"✅ Qiskit {qiskit.__version__}"
        elif package_name == "qiskit-aer":
            from qiskit_aer import AerSimulator
            return True, "✅ Qiskit Aer"
        elif package_name == "fastapi":
            import fastapi
            return True, f"✅ FastAPI {fastapi.__version__}"
        elif package_name == "numpy":
            import numpy as np
            return True, f"✅ NumPy {np.__version__}"
        elif package_name == "scipy":
            import scipy
            return True, f"✅ SciPy {scipy.__version__}"
        elif package_name == "matplotlib":
            import matplotlib
            return True, f"✅ Matplotlib {matplotlib.__version__}"
        else:
            __import__(import_name)
            return True, f"✅ {package_name}"
    except ImportError as e:
        return False, f"❌ {package_name}: {str(e)}"
    except Exception as e:
        return False, f"❌ {package_name}: {str(e)}"

def test_quantum_circuit() -> Tuple[bool, str]:
    """Test basic quantum circuit functionality."""
    try:
        from qiskit import QuantumCircuit, transpile
        from qiskit_aer import AerSimulator
        
        # Create a simple Bell state circuit
        qc = QuantumCircuit(2, 2)
        qc.h(0)
        qc.cx(0, 1)
        qc.measure_all()
        
        # Test compilation
        simulator = AerSimulator()
        compiled_circuit = transpile(qc, simulator)
        
        # Test simulation
        job = simulator.run(compiled_circuit, shots=100)
        result = job.result()
        counts = result.get_counts()
        
        return True, f"✅ Quantum circuit test passed (shots: {sum(counts.values())})"
    except Exception as e:
        return False, f"❌ Quantum circuit test failed: {str(e)}"

def check_external_tools() -> Dict[str, Tuple[bool, str]]:
    """Check external tools availability."""
    tools = {}
    
    # Check Node.js/npm
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            tools['node'] = (True, f"✅ Node.js {result.stdout.strip()}")
        else:
            tools['node'] = (False, "❌ Node.js not found")
    except FileNotFoundError:
        tools['node'] = (False, "❌ Node.js not found")
    
    # Check npm
    try:
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            tools['npm'] = (True, f"✅ npm {result.stdout.strip()}")
        else:
            tools['npm'] = (False, "❌ npm not found")
    except FileNotFoundError:
        tools['npm'] = (False, "❌ npm not found")
    
    # Check Docker
    try:
        result = subprocess.run(['docker', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            tools['docker'] = (True, f"✅ {result.stdout.strip()}")
        else:
            tools['docker'] = (False, "❌ Docker not found")
    except FileNotFoundError:
        tools['docker'] = (False, "❌ Docker not found")
    
    return tools

def main():
    """Main verification function."""
    print("🔍 Quantum Algorithm Explorer - Setup Verification")
    print("=" * 50)
    
    all_good = True
    
    # Check Python version
    python_ok, python_msg = check_python_version()
    print(f"Python Version: {python_msg}")
    if not python_ok:
        all_good = False
    
    print("\n📦 Python Packages:")
    
    # Required packages
    required_packages = [
        "fastapi",
        "qiskit", 
        "qiskit-aer",
        "numpy",
        "scipy",
        "matplotlib"
    ]
    
    for package in required_packages:
        pkg_ok, pkg_msg = check_package_import(package)
        print(f"  {pkg_msg}")
        if not pkg_ok:
            all_good = False
    
    # Test quantum functionality
    print("\n🧪 Quantum Circuit Test:")
    circuit_ok, circuit_msg = test_quantum_circuit()
    print(f"  {circuit_msg}")
    if not circuit_ok:
        all_good = False
    
    # Check external tools
    print("\n🛠️  External Tools:")
    tools = check_external_tools()
    for tool, (tool_ok, tool_msg) in tools.items():
        print(f"  {tool_msg}")
        # Note: External tools are optional for backend testing
    
    print("\n" + "=" * 50)
    
    if all_good:
        print("🎉 All core components verified successfully!")
        print("✨ Your Quantum Algorithm Explorer setup is ready!")
        print("\n🚀 Next steps:")
        print("  1. Start backend: cd backend && uvicorn app.main:app --reload")
        if tools.get('npm', (False, ''))[0]:
            print("  2. Start frontend: cd frontend && npm run dev")
        else:
            print("  2. Install Node.js for frontend: https://nodejs.org/")
        print("  3. Or use Docker: docker-compose up --build")
    else:
        print("❌ Some components failed verification.")
        print("\n💡 Troubleshooting:")
        print("  1. Ensure virtual environment is activated")
        print("  2. Run: pip install -r backend/requirements.txt")
        print("  3. Check TROUBLESHOOTING.md for detailed solutions")
        print("  4. Consider using Docker as an alternative")
        sys.exit(1)

if __name__ == "__main__":
    main()
