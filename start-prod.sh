#!/bin/bash

cd ./backend || exit 1
echo "🐍     Activating Python virtual environment..."
source venv/bin/activate

# Kill anything running on port 8000
PID=$(lsof -ti :8000)
if [ -n "$PID" ]; then
  echo "🛑   Killing existing process on port 8000 (PID: $PID)"
  kill -9 $PID
fi

echo "🐍     Starting backend at http://localhost:8000/ ..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 &

echo "🔧    Building frontend for production..."
cd ../frontend || exit 1
npm install
npm run build

echo "🚀    Starting frontend at http://localhost:3000/ ..."
sudo npx serve dist -l 3000
FRONTEND_PID=$!

# Optional: Stop frontend when script exits
trap "echo '🧼  Stopping frontend'; sudo kill $FRONTEND_PID" EXIT