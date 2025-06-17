#!/bin/bash

# Quantum Algorithm Explorer - Development Startup Script
echo "🚀 Starting Quantum Algorithm Explorer..."

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

# Function to cleanup background processes
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "📦 Installing backend dependencies..."
cd backend
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt

echo "🔧 Starting backend server..."
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo "✅ Backend server started on http://localhost:8000 (PID: $BACKEND_PID)"

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
        echo "✅ Backend is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "⚠️  Backend took longer than expected to start, but continuing..."
    fi
    sleep 1
done

cd ../frontend
echo "📦 Installing frontend dependencies..."
npm install

echo "🎨 Starting frontend server..."
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend server started on http://localhost:3000 (PID: $FRONTEND_PID)"

echo ""
echo "🎉 Quantum Algorithm Explorer is running!"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Documentation: http://localhost:8000/api/docs"
echo ""

# Show WSL-specific information
if grep -q Microsoft /proc/version; then
    WSL_IP=$(hostname -I | awk '{print $1}')
    echo "🖥️  WSL Environment Detected:"
    echo "   Access from Windows: http://localhost:3000"
    echo "   WSL IP for direct access: $WSL_IP"
    echo ""
fi

echo "Press Ctrl+C to stop all servers"

# Wait for background processes
wait
