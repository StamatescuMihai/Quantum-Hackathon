from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import numpy as np
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator
from qiskit import transpile
from math import gcd
import random

from app.utils.circuit_utils import (
    circuit_to_svg,
    circuit_to_ascii,
    extract_circuit_stats,
    format_quantum_state,
    generate_measurement_histogram_data,
)

router = APIRouter()

class ShorRequest(BaseModel):
    N: int = 15
    a: Optional[int] = None  # Baza aleasă pentru order finding (opțional)
    attempts: int = 5

class ShorResponse(BaseModel):
    success: bool
    N: int
    a: Optional[int]
    factor: Optional[int]
    message: str
    circuit_data: Optional[Dict[str, Any]] = None
    quantum_state: Optional[List[float]] = None
    probabilities: Optional[List[float]] = None
    measurement_counts: Optional[Dict[str, int]] = None
    svg: Optional[str] = None
    ascii: Optional[str] = None
    stats: Optional[Dict[str, Any]] = None

def classical_shor(N: int, attempts: int = 5) -> (Optional[int], Optional[int], str):
    """Simplified classical part of Shor's algorithm for demonstration."""
    if N % 2 == 0:
        return 2, None, "Trivial factor found (even number)."
    for _ in range(attempts):
        a = random.randint(2, N - 1)
        if gcd(a, N) != 1:
            return gcd(a, N), a, f"Non-trivial factor found classically with a={a}."
        # For demo, only classical part; quantum order finding not implemented here
    return None, None, "No non-trivial factor found. Try increasing attempts."

def create_shor_circuit(N: int, a: int) -> QuantumCircuit:
    """Create a simple quantum circuit for order finding (for N=15, a=2 or 7)."""
    # This is a toy circuit for demonstration, not a full Shor implementation!
    # For real Shor, Qiskit has a full implementation, but it's complex.
    n_count = 4  # Number of counting qubits (enough for N=15)
    qc = QuantumCircuit(n_count + 4, n_count)  # 4 work qubits for modular exponentiation

    # Apply Hadamard to counting qubits
    for q in range(n_count):
        qc.h(q)
    # Add a barrier for clarity
    qc.barrier()

    # Placeholder for modular exponentiation (not implemented)
    # In real Shor, here would be controlled-U operations

    qc.barrier()
    # Apply inverse QFT (for demonstration, just Hadamard again)
    for q in range(n_count):
        qc.h(q)
    qc.barrier()
    # Measure counting qubits
    for i in range(n_count):
        qc.measure(i, i)
    return qc

def simulate_shor_circuit(circuit: QuantumCircuit) -> (List[float], List[float], Dict[str, int]):
    """Simulate the quantum circuit and return statevector, probabilities, and counts."""
    try:
        simulator = AerSimulator()
        compiled_circuit = transpile(circuit, simulator)
        # Measurement simulation
        job = simulator.run(compiled_circuit, shots=1024)
        result = job.result()
        counts = result.get_counts()
        # Statevector simulation (approximate, since circuit has measurements)
        # For demo, just use probabilities from counts
        num_states = 2 ** circuit.num_qubits
        probabilities = [0.0] * num_states
        total_shots = sum(counts.values())
        for state_str, count in counts.items():
            state_int = int(state_str, 2)
            probabilities[state_int] = count / total_shots
        # Fake statevector: sqrt(prob) for each state
        statevector = [np.sqrt(p) for p in probabilities]
        return statevector, probabilities, counts
    except Exception as e:
        print(f"Shor simulation error: {e}")
        num_states = 2 ** circuit.num_qubits
        return [0.0] * num_states, [0.0] * num_states, {}

# ...existing code...

@router.post("/shor/run", response_model=ShorResponse)
async def run_shor_algorithm(request: ShorRequest):
    """Run Shor's algorithm (demo version)"""
    # Step 1: Classical part
    factor, a, message = classical_shor(request.N, request.attempts)
    if factor and factor != 1 and factor != request.N:
        return {
            "success": True,
            "N": request.N,
            "a": a,
            "factors": [factor],
            "period": None,       # <-- adaugă period (None dacă nu ai)
            "message": message,
            "measurement_counts": None,  # <-- adaugă, chiar dacă e None
            "probabilities": None,
            "quantum_state": None,
            "circuit_data": None,
            "svg": None,
            "ascii": None,
            "stats": None
        }
    # Step 2: Quantum part (only for N=15, a=2 or 7)
    if request.N == 15:
        a = request.a if request.a else 2
        circuit = create_shor_circuit(request.N, a)
        statevector, probabilities, counts = simulate_shor_circuit(circuit)
        svg = circuit_to_svg(circuit)
        ascii_diagram = circuit_to_ascii(circuit)
        stats = extract_circuit_stats(circuit)
        period = 4 if a == 2 else None
        return {
            "success": True if counts else False,
            "N": request.N,
            "a": a,
            "factors": None,
            "period": period,
            "message": "Quantum order finding simulated (demo, not full Shor).",
            "circuit_data": {
                "num_qubits": circuit.num_qubits,
                "a": a,
                "gates": stats["gate_counts"]
            },
            "quantum_state": statevector,
            "probabilities": probabilities,
            "measurement_counts": counts,
            "svg": svg,
            "ascii": ascii_diagram,
            "stats": stats
        }
    return {
        "success": False,
        "N": request.N,
        "a": None,
        "factors": None,
        "period": None,
        "message": "Quantum simulation only available for N=15 in this demo.",
        "measurement_counts": None,
        "probabilities": None,
        "quantum_state": None,
        "circuit_data": None,
        "svg": None,
        "ascii": None,
        "stats": None
    }

@router.post("/shor/simulate", response_model=ShorResponse)
async def simulate_shor_algorithm(request: ShorRequest):
    """Alias for /shor/run"""
    return await run_shor_algorithm(request)

@router.get("/shor/info")
async def get_shor_info():
    """Get information about Shor's algorithm"""
    return {
        "name": "Shor's Algorithm",
        "description": "Quantum algorithm for integer factorization with exponential speedup. This demo simulates only the classical part and a toy quantum circuit for N=15.",
        "complexity": "O((log N)^3)",
        "inventor": "Peter Shor",
        "year": 1994,
        "applications": [
            "Cryptanalysis (breaking RSA)",
            "Number theory"
        ],
        "key_concepts": [
            "Quantum Fourier Transform",
            "Order finding",
            "Periodicity",
            "Modular exponentiation"
        ],
        "limitations": [
            "This demo only simulates the classical part and a toy quantum circuit for N=15.",
            "Full Shor's algorithm requires advanced modular exponentiation circuits."
        ],
        "procedure": [
            "Pick random a < N and check gcd(a, N).",
            "If gcd(a, N) != 1, found a factor.",
            "Otherwise, use quantum order finding to find period r of a^r mod N.",
            "If r is even and a^(r/2) != -1 mod N, compute gcd(a^(r/2) ± 1, N) for factors."
        ]
    }