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

class BernsteinVaziraniRequest(BaseModel):
    hidden_string: str = "101"
    num_qubits: int = 3

class BernsteinVaziraniResponse(BaseModel):
    success: bool
    circuit_data: Dict[str, Any]
    quantum_state: List[ComplexNumber]
    probabilities: List[float]
    measurement_counts: Dict[str, int]
    recovered_string: str
    hidden_string: str

def create_bernstein_vazirani_circuit(hidden_string: str, num_qubits: int) -> QuantumCircuit:
    """Create Bernstein-Vazirani algorithm quantum circuit"""
    # n qubits for input, 1 ancilla qubit for output
    total_qubits = num_qubits + 1
    qreg = QuantumRegister(total_qubits, 'q')
    creg = ClassicalRegister(num_qubits, 'c')  # Only measure input qubits
    circuit = QuantumCircuit(qreg, creg)
    
    # Initialize ancilla qubit in |1⟩
    circuit.x(num_qubits)
    
    # Apply Hadamard to all qubits
    circuit.h(range(total_qubits))
    
    # Apply oracle function f(x) = s·x (dot product mod 2)
    oracle = create_dot_product_oracle(hidden_string, num_qubits)
    circuit.compose(oracle, inplace=True)
    
    # Apply Hadamard to input qubits only
    circuit.h(range(num_qubits))
    
    # Measure input qubits
    circuit.measure(range(num_qubits), range(num_qubits))
    
    return circuit

def create_dot_product_oracle(hidden_string: str, num_qubits: int) -> QuantumCircuit:
    """Create oracle for f(x) = s·x where s is the hidden string"""
    total_qubits = num_qubits + 1
    oracle = QuantumCircuit(total_qubits)
    
    # Pad or truncate hidden string to match num_qubits
    padded_string = hidden_string.ljust(num_qubits, '0')[:num_qubits]
    
    # For each bit in the hidden string, if it's 1, apply CNOT
    for i, bit in enumerate(padded_string):
        if bit == '1':
            oracle.cx(i, num_qubits)  # CNOT from qubit i to ancilla
    
    return oracle

def simulate_bernstein_vazirani(circuit: QuantumCircuit) -> tuple:
    """Simulate Bernstein-Vazirani circuit and return results"""
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

def recover_hidden_string(counts: Dict[str, int], num_qubits: int) -> str:
    """Recover the hidden string from measurement results"""
    # The most frequent measurement should be the hidden string
    most_frequent = max(counts.items(), key=lambda x: x[1])
    return most_frequent[0]

@router.post("/bernstein-vazirani/run", response_model=BernsteinVaziraniResponse)
async def run_bernstein_vazirani_algorithm(request: BernsteinVaziraniRequest):
    """Run Bernstein-Vazirani algorithm with specified parameters"""
    try:
        # Validate hidden string (should be binary)
        if not all(bit in '01' for bit in request.hidden_string):
            raise HTTPException(
                status_code=400,
                detail="Hidden string must contain only 0s and 1s"
            )
        
        # Create and simulate circuit
        circuit = create_bernstein_vazirani_circuit(request.hidden_string, request.num_qubits)
        statevector, probabilities, counts = simulate_bernstein_vazirani(circuit)
        
        # Recover hidden string
        recovered_string = recover_hidden_string(counts, request.num_qubits)
          # Convert statevector to JSON-serializable format
        quantum_state = [ComplexNumber(real=float(amp.real), imag=float(amp.imag)) for amp in statevector]
        
        # Prepare circuit data for visualization
        circuit_data = {
            "num_qubits": request.num_qubits + 1,  # Include ancilla
            "hidden_string": request.hidden_string,
            "gates": extract_gate_sequence(circuit)
        }
        
        return BernsteinVaziraniResponse(
            success=True,
            circuit_data=circuit_data,
            quantum_state=quantum_state,
            probabilities=probabilities,
            measurement_counts=counts,
            recovered_string=recovered_string,
            hidden_string=request.hidden_string
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

@router.get("/bernstein-vazirani/info")
async def get_bernstein_vazirani_info():
    """Get information about Bernstein-Vazirani algorithm"""
    return {
        "name": "Bernstein-Vazirani Algorithm",
        "description": "Finds hidden bit string using quantum parallelism and interference",
        "complexity": "O(1) vs classical O(n)",
        "inventors": ["Ethan Bernstein", "Umesh Vazirani"],
        "year": 1997,
        "problem": "Given f(x) = s·x (dot product mod 2), find the hidden string s",
        "advantage": "Linear speedup - determines n-bit string in 1 query vs n queries classically",
        "key_concepts": [
            "Quantum parallelism",
            "Phase kickback",
            "Hadamard transform",
            "Linear functions"
        ],
        "relation_to_deutsch_jozsa": "Generalization that extracts more information from oracle",
        "applications": [
            "Hidden string problems",
            "Linear function analysis", 
            "Quantum machine learning",
            "Cryptographic protocols"
        ]
    }
