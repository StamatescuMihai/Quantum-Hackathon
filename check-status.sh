#!/bin/bash

echo "🔍 Checking Quantum Algorithm Explorer Status..."
echo ""

# Check backend
echo "Backend (localhost:8000):"
if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
    echo "✅ Backend is running"
    curl -s http://localhost:8000/api/health | jq -r '.message'
else
    echo "❌ Backend is not responding"
fi

echo ""

# Check frontend
echo "Frontend (localhost:3000):"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend is not responding"
fi

echo ""

# Check proxy
echo "Frontend → Backend Proxy:"
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Proxy is working"
    curl -s http://localhost:3000/api/health | jq -r '.message'
else
    echo "❌ Proxy is not working"
fi

echo ""

# Test Grover algorithm
echo "Grover Algorithm Test:"
if curl -s -X POST "http://localhost:8000/api/algorithms/grover/run" \
    -H "Content-Type: application/json" \
    -d '{"target_item": 3, "iterations": 2, "num_qubits": 3}' | jq -e '.success' > /dev/null 2>&1; then
    echo "✅ Grover algorithm is working"
else
    echo "❌ Grover algorithm failed"
fi

echo ""
echo "🎉 Status check complete!"
