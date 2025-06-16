# Test pentru Backend - Quantum Algorithm Explorer

import pytest
import requests
import json
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

class TestHealthEndpoints:
    """Teste pentru endpoint-urile de health check"""
    
    def test_root_endpoint(self):
        """Test endpoint root"""
        response = client.get("/")
        assert response.status_code == 200
        assert "message" in response.json()
    
    def test_health_endpoint(self):
        """Test endpoint health simplu"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
    
    def test_api_health_endpoint(self):
        """Test endpoint health detaliat"""
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        assert "version" in data
        assert "algorithms" in data
        assert len(data["algorithms"]) == 4

class TestAlgorithmList:
    """Teste pentru listarea algoritmilor"""
    
    def test_list_algorithms(self):
        """Test listare algoritmi"""
        response = client.get("/api/algorithms")
        assert response.status_code == 200
        data = response.json()
        assert "algorithms" in data
        algorithms = data["algorithms"]
        assert len(algorithms) == 4
        
        # Verifică structura fiecărui algoritm
        for alg in algorithms:
            assert "name" in alg
            assert "title" in alg
            assert "description" in alg
            assert "complexity" in alg
            assert "qubits" in alg

class TestGroverAlgorithm:
    """Teste pentru algoritmul Grover"""
    
    def test_grover_info(self):
        """Test informații algoritm Grover"""
        response = client.get("/api/algorithms/grover/info")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "grover"
        assert "complexity" in data
        assert "description" in data
    
    def test_grover_simulate_valid(self):
        """Test simulare validă algoritm Grover"""
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
        """Test simulare cu target invalid"""
        payload = {
            "target": 10,  # Target prea mare pentru database_size=4
            "database_size": 4,
            "iterations": 1
        }
        response = client.post("/api/algorithms/grover/simulate", json=payload)
        assert response.status_code == 422  # Validation error

class TestDeutschJozsaAlgorithm:
    """Teste pentru algoritmul Deutsch-Jozsa"""
    
    def test_deutsch_jozsa_info(self):
        """Test informații algoritm Deutsch-Jozsa"""
        response = client.get("/api/algorithms/deutsch-jozsa/info")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "deutsch-jozsa"
    
    def test_deutsch_jozsa_simulate_balanced(self):
        """Test simulare funcție balansată"""
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
        """Test simulare funcție constantă"""
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
    """Teste pentru algoritmul Bernstein-Vazirani"""
    
    def test_bernstein_vazirani_info(self):
        """Test informații algoritm Bernstein-Vazirani"""
        response = client.get("/api/algorithms/bernstein-vazirani/info")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "bernstein-vazirani"
    
    def test_bernstein_vazirani_simulate(self):
        """Test simulare algoritm Bernstein-Vazirani"""
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
        # Verifică că algoritmul a găsit șirul secret corect
        assert data["secret_found"] == "101"
    
    def test_bernstein_vazirani_invalid_secret(self):
        """Test cu șir secret invalid"""
        payload = {
            "secret_string": "abc",  # Caracter invalid
            "shots": 1024
        }
        response = client.post("/api/algorithms/bernstein-vazirani/simulate", json=payload)
        assert response.status_code == 422  # Validation error

class TestSimonAlgorithm:
    """Teste pentru algoritmul Simon"""
    
    def test_simon_info(self):
        """Test informații algoritm Simon"""
        response = client.get("/api/algorithms/simon/info")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "simon"
    
    def test_simon_simulate(self):
        """Test simulare algoritm Simon"""
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
    """Teste pentru utilitățile de circuit"""
    
    def test_circuit_validation(self):
        """Test că circuitele generate sunt valide"""
        # Testăm prin simularea fiecărui algoritm
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
            # Verifică că avem rezultate valide
            assert "result" in data
            if "circuit_ascii" in data:
                assert isinstance(data["circuit_ascii"], str)
                assert len(data["circuit_ascii"]) > 0

class TestErrorHandling:
    """Teste pentru gestionarea erorilor"""
    
    def test_invalid_endpoint(self):
        """Test endpoint inexistent"""
        response = client.get("/api/nonexistent")
        assert response.status_code == 404
    
    def test_invalid_method(self):
        """Test metodă HTTP invalidă"""
        response = client.delete("/api/algorithms/grover/simulate")
        assert response.status_code == 405  # Method not allowed
    
    def test_malformed_json(self):
        """Test JSON malformat"""
        response = client.post(
            "/api/algorithms/grover/simulate",
            data="{ invalid json }",
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422

class TestPerformance:
    """Teste pentru performanță"""
    
    def test_response_time(self):
        """Test că răspunsurile sunt rapide"""
        import time
        
        start_time = time.time()
        response = client.get("/api/health")
        end_time = time.time()
        
        assert response.status_code == 200
        assert (end_time - start_time) < 1.0  # Răspuns sub 1 secundă
    
    def test_concurrent_requests(self):
        """Test multiple cereri simultane"""
        import concurrent.futures
        import threading
        
        def make_request():
            response = client.get("/api/health")
            return response.status_code == 200
        
        # Simulăm 5 cereri simultane
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(make_request) for _ in range(5)]
            results = [future.result() for future in concurrent.futures.as_completed(futures)]
        
        assert all(results)  # Toate cererile au reușit

if __name__ == "__main__":
    # Rulează testele
    pytest.main([__file__, "-v"])
