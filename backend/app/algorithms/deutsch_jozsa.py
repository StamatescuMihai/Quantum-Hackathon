from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import numpy as np
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit_aer import AerSimulator
from qiskit import transpile

router = APIRouter()

class ComplexNumber(BaseModel):
    """Pydantic-compatible complex number representation"""
    real: float
    imag: float

class DeutschJozsaRequest(BaseModel):
    function_type: str = "balanced"  # "constant-0", "constant-1", "balanced"
    num_qubits: int = 3

class DeutschJozsaResponse(BaseModel):
    success: bool
    circuit_data: Dict[str, Any]
    quantum_state: List[ComplexNumber]
    probabilities: List[float]
    measurement_counts: Dict[str, int]
    result: str
    function_type: str

def create_deutsch_jozsa_circuit(function_type: str, num_qubits: int) -> QuantumCircuit:
    """Create Deutsch-Jozsa algorithm quantum circuit"""
    # n qubits for input, 1 ancilla qubit for output
    total_qubits = num_qubits + 1
    qreg = QuantumRegister(total_qubits, 'q')
    creg = ClassicalRegister(num_qubits, 'c')  # Only measure input qubits
    circuit = QuantumCircuit(qreg, creg)
    
    # Initialize ancilla qubit in |1⟩
    circuit.x(num_qubits)
    
    # Apply Hadamard to all qubits
    circuit.h(range(total_qubits))
    
    # Apply oracle function
    oracle = create_oracle_function(function_type, num_qubits)
    circuit.compose(oracle, inplace=True)
    
    # Apply Hadamard to input qubits only
    circuit.h(range(num_qubits))
    
    # Measure input qubits
    circuit.measure(range(num_qubits), range(num_qubits))
    
    return circuit

def create_oracle_function(function_type: str, num_qubits: int) -> QuantumCircuit:
    """Create oracle function for Deutsch-Jozsa algorithm"""
    total_qubits = num_qubits + 1
    oracle = QuantumCircuit(total_qubits)
    
    if function_type == "constant-1":
        # f(x) = 1 for all x: flip ancilla qubit
        oracle.x(num_qubits)
    elif function_type == "balanced":
        # f(x) = x₀ ⊕ x₁ ⊕ ... (example balanced function)
        # XOR of all input bits
        for i in range(num_qubits):
            oracle.cx(i, num_qubits)
    # For constant-0, do nothing (f(x) = 0 for all x)
    
    return oracle

def simulate_deutsch_jozsa(circuit: QuantumCircuit) -> tuple:
    """Simulate Deutsch-Jozsa circuit and return results"""
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

def interpret_result(counts: Dict[str, int], num_qubits: int) -> str:
    """Interpret measurement results to determine if function is constant or balanced"""
    zero_state = '0' * num_qubits
    zero_probability = counts.get(zero_state, 0) / sum(counts.values())
    
    if zero_probability > 0.9:  # High probability of measuring all zeros
        return "CONSTANT"
    else:
        return "BALANCED"

@router.post("/deutsch-jozsa/run", response_model=DeutschJozsaResponse)
async def run_deutsch_jozsa_algorithm(request: DeutschJozsaRequest):
    """Run Deutsch-Jozsa algorithm with specified parameters"""
    try:
        # Validate function type
        valid_types = ["constant-0", "constant-1", "balanced"]
        if request.function_type not in valid_types:
            raise HTTPException(
                status_code=400,
                detail=f"Function type must be one of: {valid_types}"
            )
        
        # Create and simulate circuit
        circuit = create_deutsch_jozsa_circuit(request.function_type, request.num_qubits)
        statevector, probabilities, counts = simulate_deutsch_jozsa(circuit)
        
        # Interpret results
        result = interpret_result(counts, request.num_qubits)
          # Convert statevector to JSON-serializable format
        quantum_state = [ComplexNumber(real=float(amp.real), imag=float(amp.imag)) for amp in statevector]
        
        # Prepare circuit data for visualization
        circuit_data = {
            "num_qubits": request.num_qubits + 1,  # Include ancilla
            "function_type": request.function_type,
            "gates": extract_gate_sequence(circuit)
        }
        
        return DeutschJozsaResponse(
            success=True,
            circuit_data=circuit_data,
            quantum_state=quantum_state,
            probabilities=probabilities,
            measurement_counts=counts,
            result=result,
            function_type=request.function_type
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

@router.get("/deutsch-jozsa/info")
async def get_deutsch_jozsa_info():
    """Get information about Deutsch-Jozsa algorithm"""
    return {
        "name": "Deutsch-Jozsa Algorithm",
        "description": "Determines if a function is constant or balanced with exponential speedup",
        "complexity": "O(1) vs classical O(2^(n-1)+1)",
        "inventors": ["David Deutsch", "Richard Jozsa"],
        "year": 1992,
        "problem": "Given f:{0,1}^n → {0,1}, determine if f is constant or balanced",
        "definitions": {
            "constant": "f(x) = 0 for all x, or f(x) = 1 for all x",
            "balanced": "f(x) = 0 for exactly half the inputs, f(x) = 1 for the other half"
        },
        "key_concepts": [
            "Quantum parallelism",
            "Quantum interference", 
            "Oracle queries",
            "Superposition"
        ],
        "significance": "First algorithm to show exponential quantum advantage"
    }
