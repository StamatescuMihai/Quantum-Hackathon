import pytest
import requests
import json
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

class TestHealthEndpoints:
    
    def test_root_endpoint(self):
        response = client.get("/")
        assert response.status_code == 200
        assert "message" in response.json()
    
    def test_health_endpoint(self):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
    
    def test_api_health_endpoint(self):
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        assert "version" in data
        assert "algorithms" in data
        assert len(data["algorithms"]) == 4

class TestAlgorithmList:
    
    def test_list_algorithms(self):
        response = client.get("/api/algorithms")
        assert response.status_code == 200
        data = response.json()
        assert "algorithms" in data
        algorithms = data["algorithms"]
        assert len(algorithms) == 4
        
        for alg in algorithms:
            assert "name" in alg
            assert "title" in alg
            assert "description" in alg
            assert "complexity" in alg
            assert "qubits" in alg

class TestGroverAlgorithm:
    
    def test_grover_info(self):
        response = client.get("/api/algorithms/grover/info")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "grover"
        assert "complexity" in data
        assert "description" in data
    
    def test_grover_simulate_valid(self):
        payload = {
            "target": 2,
            "database_size": 4,
            "iterations": 1
        }
        response = client.post("/api/algorithms/grover/simulate", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "result" in data
        assert "counts" in data
        assert "circuit_ascii" in data
        assert "execution_time" in data
    
    def test_grover_simulate_invalid_target(self):
        payload = {
            "target": 10,
            "database_size": 4,
            "iterations": 1
        }
        response = client.post("/api/algorithms/grover/simulate", json=payload)
        assert response.status_code == 422

class TestDeutschJozsaAlgorithm:
    
    def test_deutsch_jozsa_info(self):
        response = client.get("/api/algorithms/deutsch-jozsa/info")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "deutsch-jozsa"
    
    def test_deutsch_jozsa_simulate_balanced(self):
        payload = {
            "oracle_type": "balanced",
            "n_qubits": 3
        }
        response = client.post("/api/algorithms/deutsch-jozsa/simulate", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "result" in data
        assert "function_type" in data
        assert data["function_type"] == "balanced"
    
    def test_deutsch_jozsa_simulate_constant(self):
        payload = {
            "oracle_type": "constant",
            "n_qubits": 3
        }
        response = client.post("/api/algorithms/deutsch-jozsa/simulate", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "result" in data
        assert "function_type" in data
        assert data["function_type"] == "constant"

class TestBernsteinVaziraniAlgorithm:
    
    def test_bernstein_vazirani_info(self):
        response = client.get("/api/algorithms/bernstein-vazirani/info")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "bernstein-vazirani"
    
    def test_bernstein_vazirani_simulate(self):
        payload = {
            "secret_string": "101",
            "shots": 1024
        }
        response = client.post("/api/algorithms/bernstein-vazirani/simulate", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "result" in data
        assert "secret_found" in data
        assert "confidence" in data
        assert data["secret_found"] == "101"
    
    def test_bernstein_vazirani_invalid_secret(self):
        payload = {
            "secret_string": "abc",
            "shots": 1024
        }
        response = client.post("/api/algorithms/bernstein-vazirani/simulate", json=payload)
        assert response.status_code == 422

class TestSimonAlgorithm:
    
    def test_simon_info(self):
        response = client.get("/api/algorithms/simon/info")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "simon"
    
    def test_simon_simulate(self):
        payload = {
            "secret_string": "10",
            "max_iterations": 5
        }
        response = client.post("/api/algorithms/simon/simulate", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "result" in data
        assert "iterations_used" in data
        assert "measurements" in data

class TestCircuitUtils:
    
    def test_circuit_validation(self):
        algorithms_to_test = [
            ("/api/algorithms/grover/simulate", {"target": 1, "database_size": 4, "iterations": 1}),
            ("/api/algorithms/deutsch-jozsa/simulate", {"oracle_type": "balanced", "n_qubits": 2}),
            ("/api/algorithms/bernstein-vazirani/simulate", {"secret_string": "10", "shots": 100}),
            ("/api/algorithms/simon/simulate", {"secret_string": "01", "max_iterations": 3})
        ]
        
        for endpoint, payload in algorithms_to_test:
            response = client.post(endpoint, json=payload)
            assert response.status_code == 200
            data = response.json()
            assert "result" in data
            if "circuit_ascii" in data:
                assert isinstance(data["circuit_ascii"], str)
                assert len(data["circuit_ascii"]) > 0

class TestErrorHandling:
    
    def test_invalid_endpoint(self):
        response = client.get("/api/nonexistent")
        assert response.status_code == 404
    
    def test_invalid_method(self):
        response = client.delete("/api/algorithms/grover/simulate")
        assert response.status_code == 405
    
    def test_malformed_json(self):
        response = client.post(
            "/api/algorithms/grover/simulate",
            data="{ invalid json }",
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422

class TestPerformance:
    
    def test_response_time(self):
        import time
        
        start_time = time.time()
        response = client.get("/api/health")
        end_time = time.time()
        
        assert response.status_code == 200
        assert (end_time - start_time) < 1.0
    
    def test_concurrent_requests(self):
        import concurrent.futures
        import threading
        
        def make_request():
            response = client.get("/api/health")
            return response.status_code == 200
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(make_request) for _ in range(5)]
            results = [future.result() for future in concurrent.futures.as_completed(futures)]
        
        assert all(results)

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
