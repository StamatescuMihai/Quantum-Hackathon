#!/usr/bin/env python3
import os
import sys
import subprocess

# Add the backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Change to backend directory
os.chdir('backend')

# Start uvicorn
if __name__ == "__main__":
    port = os.environ.get('PORT', '8000')
    subprocess.run([
        sys.executable, '-m', 'uvicorn', 
        'app.main:app', 
        '--host', '0.0.0.0', 
        '--port', port
    ])
