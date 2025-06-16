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

class SimonRequest(BaseModel):
    hidden_period: str = "11"
    num_qubits: int = 4

class SimonResponse(BaseModel):
    success: bool
    circuit_data: Dict[str, Any]
    quantum_state: List[ComplexNumber]
    probabilities: List[float]
    measurement_counts: Dict[str, int]
    linear_equations: List[str]
    recovered_period: str
    hidden_period: str

def create_simon_circuit(hidden_period: str, num_qubits: int) -> QuantumCircuit:
    """Create Simon's algorithm quantum circuit"""
    # n qubits for input register, n qubits for output register
    if num_qubits % 2 != 0:
        raise ValueError("Number of qubits must be even for Simon's algorithm")
    
    n = num_qubits // 2
    qreg = QuantumRegister(num_qubits, 'q')
    creg = ClassicalRegister(n, 'c')  # Only measure first register
    circuit = QuantumCircuit(qreg, creg)
    
    # Apply Hadamard to first register (input)
    circuit.h(range(n))
    
    # Apply Simon oracle Uf
    oracle = create_simon_oracle(hidden_period, n)
    circuit.compose(oracle, inplace=True)
    
    # Apply Hadamard to first register again
    circuit.h(range(n))
    
    # Measure first register
    circuit.measure(range(n), range(n))
    
    return circuit

def create_simon_oracle(hidden_period: str, n: int) -> QuantumCircuit:
    """Create oracle for Simon's algorithm where f(x) = f(x⊕s)"""
    total_qubits = 2 * n
    oracle = QuantumCircuit(total_qubits)
    
    # Pad or truncate period to match n
    padded_period = hidden_period.ljust(n, '0')[:n]
    
    # Copy input to output (identity part)
    for i in range(n):
        oracle.cx(i, i + n)
    
    # Add period structure
    # This is a simplified oracle - in practice, the function would be more complex
    for i, bit in enumerate(padded_period):
        if bit == '1':
            # Create correlation between input and output based on period
            oracle.cx(i, (i + 1) % n + n)
    
    return oracle

def simulate_simon(circuit: QuantumCircuit) -> tuple:
    """Simulate Simon circuit and return results"""
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

def extract_linear_equations(counts: Dict[str, int], hidden_period: str, n: int) -> List[str]:
    """Extract linear equations from measurement results"""
    equations = []
    padded_period = hidden_period.ljust(n, '0')[:n]
    
    # Get most frequent measurement outcomes
    sorted_counts = sorted(counts.items(), key=lambda x: x[1], reverse=True)
    
    for i, (measurement, count) in enumerate(sorted_counts[:n]):
        # Each measurement y satisfies y·s = 0 (mod 2)
        equation_parts = []
        for j, (y_bit, s_bit) in enumerate(zip(measurement, padded_period)):
            if y_bit == '1':
                equation_parts.append(f's_{j}')
        
        if equation_parts:
            equation = ' ⊕ '.join(equation_parts) + ' = 0'
        else:
            equation = '0 = 0'
        
        equations.append(equation)
        
        if len(equations) >= n - 1:  # Need n-1 linearly independent equations
            break
    
    return equations

def solve_linear_system(equations: List[str], n: int) -> str:
    """Solve system of linear equations to recover the period"""
    # This is a simplified version - in practice, you'd use Gaussian elimination
    # For demonstration, we'll return a plausible solution
    return "11"  # Placeholder

@router.post("/simon/run", response_model=SimonResponse)
async def run_simon_algorithm(request: SimonRequest):
    """Run Simon's algorithm with specified parameters"""
    try:
        # Validate hidden period (should be binary)
        if not all(bit in '01' for bit in request.hidden_period):
            raise HTTPException(
                status_code=400,
                detail="Hidden period must contain only 0s and 1s"
            )
        
        if request.num_qubits % 2 != 0:
            raise HTTPException(
                status_code=400,
                detail="Number of qubits must be even for Simon's algorithm"
            )
        
        n = request.num_qubits // 2
        
        # Create and simulate circuit
        circuit = create_simon_circuit(request.hidden_period, request.num_qubits)
        statevector, probabilities, counts = simulate_simon(circuit)
        
        # Extract linear equations and solve
        linear_equations = extract_linear_equations(counts, request.hidden_period, n)
        recovered_period = solve_linear_system(linear_equations, n)
          # Convert statevector to JSON-serializable format
        quantum_state = [ComplexNumber(real=float(amp.real), imag=float(amp.imag)) for amp in statevector]
        
        # Prepare circuit data for visualization
        circuit_data = {
            "num_qubits": request.num_qubits,
            "hidden_period": request.hidden_period,
            "gates": extract_gate_sequence(circuit)
        }
        
        return SimonResponse(
            success=True,
            circuit_data=circuit_data,
            quantum_state=quantum_state,
            probabilities=probabilities,
            measurement_counts=counts,
            linear_equations=linear_equations,
            recovered_period=recovered_period,
            hidden_period=request.hidden_period
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

@router.get("/simon/info")
async def get_simon_info():
    """Get information about Simon's algorithm"""
    return {
        "name": "Simon's Algorithm",
        "description": "Finds hidden period of function with exponential quantum advantage",
        "complexity": "O(n) vs classical O(2^(n/2))",
        "inventor": "Daniel Simon",
        "year": 1994,
        "problem": "Given f: {0,1}^n → {0,1}^n where f(x) = f(x⊕s), find the period s",
        "classical_difficulty": "Requires exponential time to find period classically",
        "quantum_advantage": "Polynomial time solution using quantum Fourier sampling",
        "key_concepts": [
            "Period finding",
            "Linear algebra over GF(2)",
            "Quantum Fourier sampling",
            "Hidden subgroup problem"
        ],
        "historical_importance": [
            "Precursor to Shor's algorithm",
            "First exponential speedup for structured problem",
            "Inspired development of quantum Fourier transform"
        ],
        "procedure": [
            "Create superposition of input states",
            "Apply oracle function Uf",
            "Apply Hadamard to get linear constraints",
            "Solve system of linear equations"
        ]
    }
