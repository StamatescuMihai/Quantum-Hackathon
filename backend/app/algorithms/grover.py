from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Union
import numpy as np
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit.circuit.library import GroverOperator
from qiskit_aer import AerSimulator
from qiskit import transpile
import json

router = APIRouter()

class ComplexNumber(BaseModel):
    """Pydantic-compatible complex number representation"""
    real: float
    imag: float

class GroverRequest(BaseModel):
    target_item: int = 3
    iterations: int = 2
    num_qubits: int = 3

class GroverResponse(BaseModel):
    success: bool
    circuit_data: Dict[str, Any]
    quantum_state: List[ComplexNumber]
    probabilities: List[float]
    measurement_counts: Dict[str, int]
    optimal_iterations: int
    success_probability: float

def create_grover_circuit(target_item: int, iterations: int, num_qubits: int) -> QuantumCircuit:
    """Create Grover's algorithm quantum circuit"""
    qreg = QuantumRegister(num_qubits, 'q')
    creg = ClassicalRegister(num_qubits, 'c')
    circuit = QuantumCircuit(qreg, creg)
    
    # Initialize superposition
    circuit.h(qreg)
    
    # Oracle and diffusion for specified iterations
    for _ in range(iterations):
        # Oracle: flip amplitude of target item
        oracle_circuit = create_oracle(target_item, num_qubits)
        circuit.compose(oracle_circuit, inplace=True)
        
        # Diffusion operator (amplitude amplification about average)
        diffusion_circuit = create_diffusion_operator(num_qubits)
        circuit.compose(diffusion_circuit, inplace=True)
    
    # Measurement
    circuit.measure(qreg, creg)
    
    return circuit

def create_oracle(target_item: int, num_qubits: int) -> QuantumCircuit:
    """Create oracle that flips the amplitude of the target item"""
    oracle = QuantumCircuit(num_qubits)
    
    # Convert target item to binary and apply X gates for 0s
    target_binary = format(target_item, f'0{num_qubits}b')
    for i, bit in enumerate(target_binary):
        if bit == '0':
            oracle.x(i)
    
    # Multi-controlled Z gate
    if num_qubits > 1:
        oracle.h(num_qubits - 1)
        oracle.mcx(list(range(num_qubits - 1)), num_qubits - 1)
        oracle.h(num_qubits - 1)
    else:
        oracle.z(0)
    
    # Undo X gates
    for i, bit in enumerate(target_binary):
        if bit == '0':
            oracle.x(i)
    
    return oracle

def create_diffusion_operator(num_qubits: int) -> QuantumCircuit:
    """Create diffusion operator for amplitude amplification"""
    diffusion = QuantumCircuit(num_qubits)
    
    # H gates
    diffusion.h(range(num_qubits))
    
    # X gates
    diffusion.x(range(num_qubits))
    
    # Multi-controlled Z
    if num_qubits > 1:
        diffusion.h(num_qubits - 1)
        diffusion.mcx(list(range(num_qubits - 1)), num_qubits - 1)
        diffusion.h(num_qubits - 1)
    else:
        diffusion.z(0)
    
    # X gates
    diffusion.x(range(num_qubits))
    
    # H gates
    diffusion.h(range(num_qubits))
    
    return diffusion

def calculate_optimal_iterations(num_items: int) -> int:
    """Calculate optimal number of Grover iterations"""
    return int(np.pi * np.sqrt(num_items) / 4)

def simulate_grover(circuit: QuantumCircuit) -> tuple:
    """Simulate Grover circuit and return results"""
    # State vector simulation
    simulator = AerSimulator(method='statevector')
    circuit_copy = circuit.copy()
    circuit_copy.remove_final_measurements()
    
    compiled_circuit = transpile(circuit_copy, simulator)
    job = simulator.run(compiled_circuit)
    result = job.result()
    statevector = result.get_statevector()
    
    # Calculate probabilities
    probabilities = np.abs(statevector) ** 2
    
    # Measurement simulation
    measurement_simulator = AerSimulator()
    compiled_measurement = transpile(circuit, measurement_simulator)
    measurement_job = measurement_simulator.run(compiled_measurement, shots=1024)
    measurement_result = measurement_job.result()
    counts = measurement_result.get_counts()
    
    return statevector, probabilities.tolist(), counts

@router.post("/grover/run", response_model=GroverResponse)
async def run_grover_algorithm(request: GroverRequest):
    """Run Grover's algorithm with specified parameters"""
    try:
        num_items = 2 ** request.num_qubits
        
        # Validate target item
        if request.target_item >= num_items:
            raise HTTPException(
                status_code=400, 
                detail=f"Target item must be less than {num_items} for {request.num_qubits} qubits"
            )
        
        # Create and simulate circuit
        circuit = create_grover_circuit(request.target_item, request.iterations, request.num_qubits)
        statevector, probabilities, counts = simulate_grover(circuit)
        
        # Calculate optimal iterations and success probability
        optimal_iterations = calculate_optimal_iterations(num_items)
        success_probability = probabilities[request.target_item]        # Convert statevector to JSON-serializable format
        quantum_state = [ComplexNumber(real=float(amp.real), imag=float(amp.imag)) for amp in statevector]
        
        # Prepare circuit data for visualization
        circuit_data = {
            "num_qubits": request.num_qubits,
            "target_item": request.target_item,
            "iterations": request.iterations,
            "gates": extract_gate_sequence(circuit)
        }
        
        return GroverResponse(
            success=True,
            circuit_data=circuit_data,
            quantum_state=quantum_state,
            probabilities=probabilities,
            measurement_counts=counts,
            optimal_iterations=optimal_iterations,
            success_probability=success_probability
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def extract_gate_sequence(circuit: QuantumCircuit) -> List[Dict[str, Any]]:
    """Extract gate sequence from circuit for visualization"""
    gates = []
    for instruction in circuit.data:
        gate_info = {
            "name": instruction[0].name,
            "qubits": [q.index for q in instruction[1]],
            "params": instruction[0].params if hasattr(instruction[0], 'params') else []
        }
        gates.append(gate_info)
    return gates

@router.get("/grover/info")
async def get_grover_info():
    """Get information about Grover's algorithm"""
    return {
        "name": "Grover's Algorithm",
        "description": "Quantum search algorithm providing quadratic speedup",
        "complexity": "O(√N)",
        "inventor": "Lov Grover",
        "year": 1996,
        "applications": [
            "Database search",
            "Optimization problems", 
            "Cryptanalysis",
            "Machine learning"
        ],
        "key_concepts": [
            "Amplitude amplification",
            "Quantum superposition",
            "Oracle queries",
            "Diffusion operator"
        ],
        "optimal_iterations_formula": "π√N/4"
    }
