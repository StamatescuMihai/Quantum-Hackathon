from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import numpy as np
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit_aer import AerSimulator

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

def create_simple_grover_circuit(target_item: int, iterations: int, num_qubits: int) -> QuantumCircuit:
    """Create a simplified Grover circuit"""
    circuit = QuantumCircuit(num_qubits, num_qubits)
    
    # Initialize superposition
    for i in range(num_qubits):
        circuit.h(i)
    
    # Simplified oracle and diffusion operations
    for _ in range(iterations):
        # Simple oracle: flip phase of target
        target_binary = format(target_item, f'0{num_qubits}b')
        for i, bit in enumerate(target_binary):
            if bit == '0':
                circuit.x(i)
        
        # Multi-controlled Z
        if num_qubits > 1:
            circuit.h(num_qubits - 1)
            circuit.mcx(list(range(num_qubits - 1)), num_qubits - 1)
            circuit.h(num_qubits - 1)
        else:
            circuit.z(0)
        
        # Undo X gates
        for i, bit in enumerate(target_binary):
            if bit == '0':
                circuit.x(i)
        
        # Diffusion operator
        for i in range(num_qubits):
            circuit.h(i)
            circuit.x(i)
        
        circuit.h(num_qubits - 1)
        circuit.mcx(list(range(num_qubits - 1)), num_qubits - 1)
        circuit.h(num_qubits - 1)
        
        for i in range(num_qubits):
            circuit.x(i)
            circuit.h(i)
    
    # Measurement
    circuit.measure_all()
    
    return circuit

def calculate_optimal_iterations(num_items: int) -> int:
    """Calculate optimal number of iterations for Grover's algorithm"""
    return max(1, int(np.pi * np.sqrt(num_items) / 4))

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
        
        # Create circuit
        circuit = create_simple_grover_circuit(request.target_item, request.iterations, request.num_qubits)
        
        # Simulate
        simulator = AerSimulator()
        job = simulator.run(circuit, shots=1024)
        result = job.result()
        counts = result.get_counts()
        
        # Create probabilities from measurement counts
        num_states = 2 ** request.num_qubits
        probabilities = [0.0] * num_states
        total_shots = sum(counts.values())
        
        for state_str, count in counts.items():
            # Remove spaces and reverse bit order if needed
            clean_state = state_str.replace(' ', '')
            state_int = int(clean_state, 2)
            if state_int < len(probabilities):  # Safety check
                probabilities[state_int] = count / total_shots
        
        # Create approximate statevector
        quantum_state = []
        for prob in probabilities:
            quantum_state.append(ComplexNumber(real=float(np.sqrt(prob)), imag=0.0))
        
        # Calculate metrics
        optimal_iterations = calculate_optimal_iterations(num_items)
        success_probability = probabilities[request.target_item]
        
        # Prepare circuit data
        circuit_data = {
            "num_qubits": request.num_qubits,
            "target_item": request.target_item,
            "iterations": request.iterations,
            "gates": []  # Simplified for now
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
        print(f"Error in Grover algorithm: {e}")
        raise HTTPException(status_code=500, detail=str(e))
