#!/bin/bash

echo "Check Website Status..."

echo "Backend (localhost:8000):"
if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
    echo "Backend is running"
    curl -s http://localhost:8000/api/health | jq -r '.message'
else
    echo "Backend is not responding"
fi

echo "Frontend (localhost:3000):"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "Frontend is running"
else
    echo "Frontend is not responding"
fi

echo "Frontend → Backend Proxy:"
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "Proxy is working"
    curl -s http://localhost:3000/api/health | jq -r '.message'
else
    echo "Proxy is not working"
fi

echo "Grover Algorithm Test:"
if curl -s -X POST "http://localhost:8000/api/algorithms/grover/run" \
    -H "Content-Type: application/json" \
    -d '{"target_item": 3, "iterations": 2, "num_qubits": 3}' | jq -e '.success' > /dev/null 2>&1; then
    echo "Grover algorithm is working"
else
    echo "Grover algorithm failed"
fi

echo "Shor Algorithm Test:"
if curl -s -X POST "http://localhost:8000/api/algorithms/shor/run" \
    -H "Content-Type: application/json" \
    -d '{"N": 15, "num_qubits": 4}' | jq -e '.success' > /dev/null 2>&1; then
    echo "Shor algorithm is working"
else
    echo "Shor algorithm failed"
fi

echo "Status check complete!"
