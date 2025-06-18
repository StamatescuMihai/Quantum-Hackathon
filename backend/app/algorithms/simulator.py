from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import numpy as np
import cmath
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit_aer import AerSimulator, StatevectorSimulator, QasmSimulator
from qiskit import transpile

router = APIRouter()

class ComplexNumber(BaseModel):
    """Pydantic-compatible complex number representation"""
    real: float
    imag: float

class GateOperation(BaseModel):
    """Represents a quantum gate operation"""
    name: str
    qubit: int
    timeStep: int
    target_qubit: Optional[int] = None  # For two-qubit gates like CNOT
    parameter: Optional[float] = None   # For parameterized gates like RZ
    description: Optional[str] = None
    symbol: Optional[str] = None

class SimulatorRequest(BaseModel):
    """Request model for quantum circuit simulation"""
    qubits: int = 3
    gates: List[GateOperation] = []
    algorithm: Optional[str] = None  # For predefined algorithms
    shots: int = 1024

class SimulatorResponse(BaseModel):
    """Response model for quantum circuit simulation"""
    success: bool
    qubits: int
    quantum_state: List[ComplexNumber]
    probabilities: List[float]
    measurement_counts: Dict[str, int]
    circuit_depth: int
    gate_count: int
    circuit_data: Dict[str, Any]
    error_message: Optional[str] = None

def create_quantum_circuit(qubits: int, gates: List[GateOperation]) -> QuantumCircuit:
    """Create a quantum circuit from gate operations"""
    qreg = QuantumRegister(qubits, 'q')
    creg = ClassicalRegister(qubits, 'c')
    circuit = QuantumCircuit(qreg, creg)
    
    print(f"Creating circuit with {qubits} qubits and {len(gates)} gates")
    
    if len(gates) == 0:
        print("No gates provided - creating empty circuit (initial |00...0⟩ state)")
    else:
        # Sort gates by time step to ensure proper order
        sorted_gates = sorted(gates, key=lambda g: g.timeStep)
        
        print(f"Sorted gates: {[(g.name, g.qubit, g.timeStep) for g in sorted_gates]}")
        
        for gate in sorted_gates:
            print(f"Applying gate: {gate.name} on qubit {gate.qubit} at time {gate.timeStep}")
            apply_gate_to_circuit(circuit, gate, qubits)
    
    # Add measurements at the end
    circuit.measure_all()
    
    print(f"Final circuit:\n{circuit}")
    return circuit

def apply_gate_to_circuit(circuit: QuantumCircuit, gate: GateOperation, qubits: int):
    """Apply a single gate operation to the circuit"""
    qubit = gate.qubit
    
    # Validate qubit index
    if qubit >= qubits or qubit < 0:
        raise ValueError(f"Invalid qubit index {qubit} for {qubits}-qubit circuit")
    
    gate_name = gate.name.upper()
    
    try:
        if gate_name == 'H':
            circuit.h(qubit)
        elif gate_name == 'X':
            circuit.x(qubit)
        elif gate_name == 'Y':
            circuit.y(qubit)
        elif gate_name == 'Z':
            circuit.z(qubit)
        elif gate_name == 'T':
            circuit.t(qubit)
        elif gate_name == 'S':
            circuit.s(qubit)
        elif gate_name == 'CNOT':
            if gate.target_qubit is None:
                raise ValueError("CNOT gate requires target_qubit to be specified")
            if gate.target_qubit >= qubits or gate.target_qubit < 0:
                raise ValueError(f"Invalid target qubit {gate.target_qubit}")
            circuit.cx(qubit, gate.target_qubit)
        elif gate_name == 'RZ':
            angle = gate.parameter if gate.parameter is not None else np.pi/4
            circuit.rz(angle, qubit)
        elif gate_name == 'RX':
            angle = gate.parameter if gate.parameter is not None else np.pi/2
            circuit.rx(angle, qubit)
        elif gate_name == 'RY':
            angle = gate.parameter if gate.parameter is not None else np.pi/2
            circuit.ry(angle, qubit)
        else:
            print(f"Warning: Unknown gate '{gate_name}', skipping...")
            
    except Exception as e:
        print(f"Error applying gate {gate_name}: {e}")
        raise

def simulate_quantum_circuit(circuit: QuantumCircuit) -> tuple:
    """Simulate quantum circuit and return state vector and measurement results"""
    try:
        print(f"Simulating circuit with {circuit.num_qubits} qubits")
        print(f"Circuit instructions: {[instr.operation.name for instr in circuit.data]}")
        
        # Create a copy for statevector simulation (without measurements)
        statevector_circuit = QuantumCircuit(circuit.num_qubits)
        
        # Copy all gates except measurements
        gate_count = 0
        for instruction in circuit.data:
            if instruction.operation.name not in ['measure', 'barrier']:
                statevector_circuit.append(instruction.operation, instruction.qubits)
                gate_count += 1
        
        print(f"Statevector circuit gates: {[instr.operation.name for instr in statevector_circuit.data]}")
        print(f"Number of gates in statevector circuit: {gate_count}")
        print(f"Full circuit:\n{statevector_circuit}")
        
        # State vector simulation using StatevectorSimulator
        if gate_count == 0:
            print("Empty circuit detected - creating initial state |00...0⟩")
            # For empty circuits, create the initial state manually
            num_states = 2 ** circuit.num_qubits
            statevector = np.zeros(num_states, dtype=complex)
            statevector[0] = 1.0  # |00...0⟩ state
        else:
            simulator = StatevectorSimulator()
            job = simulator.run(statevector_circuit, shots=1)
            result = job.result()
            statevector = result.get_statevector()
        print(f"Statevector (raw): {statevector}")
        print(f"Statevector (array): {np.array(statevector)}")
        
        # Calculate probabilities
        probabilities = np.abs(statevector) ** 2
        print(f"Probabilities: {probabilities}")
        
        # Measurement simulation with original circuit (but ensure it has measurements)
        measurement_circuit = circuit.copy()
        if not any(instr.operation.name == 'measure' for instr in measurement_circuit.data):
            measurement_circuit.measure_all()
        
        measurement_simulator = QasmSimulator()
        measurement_job = measurement_simulator.run(measurement_circuit, shots=1024)
        measurement_result = measurement_job.result()
        counts = measurement_result.get_counts()
        print(f"Measurement counts: {counts}")
        
        return statevector, probabilities.tolist(), counts
        
    except Exception as e:
        print(f"Circuit simulation error: {e}")
        print(f"Circuit details: {circuit}")
        import traceback
        print(f"Full traceback: {traceback.format_exc()}")
        
        # Only use fallback for critical errors, not for normal simulation issues
        raise e

def create_predefined_algorithm_circuit(algorithm: str, qubits: int) -> List[GateOperation]:
    """Create gate sequences for predefined algorithms"""
    gates = []
    
    if algorithm == 'grover':
        # Simple Grover circuit for demonstration
        # Initialize with Hadamard gates
        for i in range(qubits):
            gates.append(GateOperation(
                name='H', qubit=i, timeStep=0, symbol='H', 
                description='Hadamard gate for superposition'
            ))
        
        # Oracle (mark target state) - simplified
        target_qubit = qubits - 1
        gates.append(GateOperation(
            name='Z', qubit=target_qubit, timeStep=1, symbol='Z',
            description='Oracle marking target state'
        ))
        
        # Diffusion operator (simplified)
        for i in range(qubits):
            gates.append(GateOperation(
                name='H', qubit=i, timeStep=2, symbol='H',
                description='Hadamard for diffusion'
            ))
            gates.append(GateOperation(
                name='Z', qubit=i, timeStep=3, symbol='Z',
                description='Z rotation for diffusion'
            ))
            gates.append(GateOperation(
                name='H', qubit=i, timeStep=4, symbol='H',
                description='Final Hadamard'
            ))
    
    elif algorithm == 'deutsch-jozsa':
        # Deutsch-Jozsa circuit
        # Initialize with Hadamard gates
        for i in range(qubits):
            gates.append(GateOperation(
                name='H', qubit=i, timeStep=0, symbol='H',
                description='Initial superposition'
            ))
        
        # Oracle (constant/balanced function) - simplified
        gates.append(GateOperation(
            name='X', qubit=0, timeStep=1, symbol='X',
            description='Oracle function'
        ))
        
        # Final Hadamard gates
        for i in range(qubits - 1):  # Exclude ancilla
            gates.append(GateOperation(
                name='H', qubit=i, timeStep=2, symbol='H',
                description='Final Hadamard'
            ))
    
    elif algorithm == 'bernstein-vazirani':
        # Bernstein-Vazirani circuit
        # Initialize with Hadamard gates
        for i in range(qubits):
            gates.append(GateOperation(
                name='H', qubit=i, timeStep=0, symbol='H',
                description='Initial superposition'
            ))
        
        # Oracle for hidden string (simplified)
        for i in range(qubits - 1):
            if i % 2 == 1:  # Example hidden string pattern
                gates.append(GateOperation(
                    name='CNOT', qubit=i, target_qubit=qubits-1, timeStep=1,
                    symbol='⊕', description='Oracle dot product'
                ))
        
        # Final Hadamard gates on input qubits
        for i in range(qubits - 1):
            gates.append(GateOperation(
                name='H', qubit=i, timeStep=2, symbol='H',
                description='Final Hadamard'
            ))
    
    elif algorithm == 'simon':
        # Simon's algorithm circuit
        n = qubits // 2  # Half for input, half for output
        
        # Initialize input register with Hadamard
        for i in range(n):
            gates.append(GateOperation(
                name='H', qubit=i, timeStep=0, symbol='H',
                description='Input superposition'
            ))
        
        # Oracle (simplified period function)
        for i in range(n):
            gates.append(GateOperation(
                name='CNOT', qubit=i, target_qubit=i+n, timeStep=1,
                symbol='⊕', description='Oracle copy'
            ))
        
        # Add period structure
        if n > 1:
            gates.append(GateOperation(
                name='CNOT', qubit=0, target_qubit=n+1, timeStep=2,
                symbol='⊕', description='Period structure'
            ))
        
        # Final Hadamard on input register
        for i in range(n):
            gates.append(GateOperation(
                name='H', qubit=i, timeStep=3, symbol='H',
                description='Final Hadamard'
            ))
    
    return gates

@router.post("/simulator/run", response_model=SimulatorResponse)
async def run_simulator(request: SimulatorRequest):
    """Run quantum circuit simulation"""
    try:
        print(f"Received simulation request: {request}")
        gates = request.gates
        
        # If algorithm is specified, use predefined gates
        if request.algorithm and request.algorithm != 'custom':
            print(f"Using predefined algorithm: {request.algorithm}")
            gates = create_predefined_algorithm_circuit(request.algorithm, request.qubits)
        
        print(f"Gates to simulate: {gates}")
        
        # Create and simulate circuit
        circuit = create_quantum_circuit(request.qubits, gates)
        print(f"Created circuit: {circuit}")
        
        statevector, probabilities, counts = simulate_quantum_circuit(circuit)
        
        # Convert statevector to JSON-serializable format
        quantum_state = [ComplexNumber(real=float(amp.real), imag=float(amp.imag)) 
                        for amp in statevector]
        
        # Calculate circuit metrics
        if len(gates) > 0:
            circuit_depth = max([gate.timeStep for gate in gates]) + 1
        else:
            circuit_depth = 0  # No gates applied, depth is 0
        gate_count = len(gates)
        
        # Prepare circuit data
        circuit_data = {
            "gates": [gate.dict() for gate in gates],
            "depth": circuit_depth,
            "gate_count": gate_count,
            "qubits": request.qubits
        }
        
        print(f"Simulation successful. Probabilities: {probabilities}")
        print(f"State vector magnitudes: {[abs(amp) for amp in statevector]}")
        
        return SimulatorResponse(
            success=True,
            qubits=request.qubits,
            quantum_state=quantum_state,
            probabilities=probabilities,
            measurement_counts=counts,
            circuit_depth=circuit_depth,
            gate_count=gate_count,
            circuit_data=circuit_data
        )
        
    except Exception as e:
        print(f"Simulation failed with error: {e}")
        import traceback
        print(f"Full traceback: {traceback.format_exc()}")
        
        return SimulatorResponse(
            success=False,
            qubits=request.qubits,
            quantum_state=[],
            probabilities=[],
            measurement_counts={},
            circuit_depth=0,
            gate_count=0,
            circuit_data={},
            error_message=str(e)
        )

@router.post("/simulator/custom", response_model=SimulatorResponse)
async def run_custom_circuit(request: SimulatorRequest):
    """Run custom quantum circuit simulation"""
    return await run_simulator(request)

@router.get("/simulator/gates")
async def get_available_gates():
    """Get list of available quantum gates"""
    return {
        "single_qubit_gates": [
            {"name": "H", "description": "Hadamard Gate", "symbol": "H", "parameterized": False},
            {"name": "X", "description": "Pauli-X (NOT)", "symbol": "X", "parameterized": False},
            {"name": "Y", "description": "Pauli-Y", "symbol": "Y", "parameterized": False},
            {"name": "Z", "description": "Pauli-Z", "symbol": "Z", "parameterized": False},
            {"name": "T", "description": "T Gate (π/8 rotation)", "symbol": "T", "parameterized": False},
            {"name": "S", "description": "S Gate (π/4 rotation)", "symbol": "S", "parameterized": False},
            {"name": "RZ", "description": "Z-Rotation", "symbol": "RZ", "parameterized": True},
            {"name": "RX", "description": "X-Rotation", "symbol": "RX", "parameterized": True},
            {"name": "RY", "description": "Y-Rotation", "symbol": "RY", "parameterized": True}
        ],
        "two_qubit_gates": [
            {"name": "CNOT", "description": "Controlled-NOT", "symbol": "⊕", "parameterized": False}
        ],
        "algorithms": [
            {"name": "grover", "description": "Grover's Search Algorithm"},
            {"name": "deutsch-jozsa", "description": "Deutsch-Jozsa Algorithm"},
            {"name": "bernstein-vazirani", "description": "Bernstein-Vazirani Algorithm"},
            {"name": "simon", "description": "Simon's Algorithm"}
        ]
    }

@router.get("/simulator/info")
async def get_simulator_info():
    """Get information about the quantum simulator"""
    return {
        "name": "Quantum Circuit Simulator",
        "description": "Comprehensive quantum circuit simulation with state vector and measurement support",
        "features": [
            "Custom circuit construction",
            "Predefined quantum algorithms",
            "Real-time state vector calculation",
            "Measurement probability analysis",
            "Educational step-by-step execution"
        ],
        "supported_gates": [
            "Hadamard (H)", "Pauli gates (X, Y, Z)",
            "Phase gates (S, T)", "Rotation gates (RX, RY, RZ)",
            "CNOT gate", "Measurement"
        ],
        "max_qubits": 10,
        "simulation_method": "State vector simulation with Qiskit Aer"
    }
