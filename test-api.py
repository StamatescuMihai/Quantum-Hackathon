#!/usr/bin/env python3
"""
Test script to verify backend API connectivity
"""

import requests
import json
import time

def test_api_connection():
    base_url = "http://localhost:8000"
    
    print("🧪 Testing Quantum Algorithm Explorer Backend API...")
    print(f"Base URL: {base_url}")
    print("-" * 50)
    
    try:
        # Test health endpoint
        print("1. Testing health endpoint...")
        response = requests.get(f"{base_url}/api/health", timeout=5)
        if response.status_code == 200:
            health_data = response.json()
            print(f"✅ Health check passed: {health_data['message']}")
            print(f"   Available algorithms: {', '.join(health_data['algorithms'])}")
        else:
            print(f"❌ Health check failed with status: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to connect to backend: {e}")
        print("   Make sure the backend server is running on port 8000")
        return False
    
    # Test Grover algorithm
    print("\n2. Testing Grover's Algorithm...")
    try:
        grover_data = {
            "target_item": 3,
            "iterations": 2,
            "num_qubits": 3
        }
        response = requests.post(f"{base_url}/api/algorithms/grover/run", 
                               json=grover_data, timeout=10)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Grover algorithm test passed")
            print(f"   Success probability: {result['success_probability']:.2%}")
            print(f"   Optimal iterations: {result['optimal_iterations']}")
        else:
            print(f"❌ Grover test failed with status: {response.status_code}")
            print(f"   Response: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Grover test error: {e}")
    
    # Test Deutsch-Jozsa algorithm
    print("\n3. Testing Deutsch-Jozsa Algorithm...")
    try:
        dj_data = {
            "function_type": "balanced",
            "num_qubits": 3
        }
        response = requests.post(f"{base_url}/api/algorithms/deutsch-jozsa/run", 
                               json=dj_data, timeout=10)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Deutsch-Jozsa algorithm test passed")
            print(f"   Result: {result['result']}")
            print(f"   Function type: {result['function_type']}")
        else:
            print(f"❌ Deutsch-Jozsa test failed with status: {response.status_code}")
            print(f"   Response: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Deutsch-Jozsa test error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Backend API testing completed!")
    print("If all tests passed, your frontend-backend connection should work properly.")
    return True

if __name__ == "__main__":
    test_api_connection()
