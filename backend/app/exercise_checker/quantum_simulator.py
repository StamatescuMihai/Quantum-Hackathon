import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit_aer import AerSimulator, StatevectorSimulator, QasmSimulator
from qiskit import transpile
from pydantic import BaseModel

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

class QuantumSimulator:
    """Quantum circuit simulator using Qiskit"""
    
    def __init__(self):
        self.statevector_simulator = StatevectorSimulator()
        self.qasm_simulator = QasmSimulator()
    
    def create_quantum_circuit(self, qubits: int, gates: List[GateOperation]) -> QuantumCircuit:
        """Create a quantum circuit from gate operations"""
        qreg = QuantumRegister(qubits, 'q')
        creg = ClassicalRegister(qubits, 'c')
        circuit = QuantumCircuit(qreg, creg)
        
        # Sort gates by timeStep to ensure proper ordering
        sorted_gates = sorted(gates, key=lambda g: g.timeStep)
        
        for gate in sorted_gates:
            try:
                gate_name = gate.name.upper()
                qubit_idx = gate.qubit
                
                # Validate qubit index
                if qubit_idx >= qubits or qubit_idx < 0:
                    raise ValueError(f"Invalid qubit index {qubit_idx} for {qubits}-qubit circuit")
                
                # Single-qubit gates
                if gate_name == 'H':
                    circuit.h(qubit_idx)
                elif gate_name == 'X':
                    circuit.x(qubit_idx)
                elif gate_name == 'Y':
                    circuit.y(qubit_idx)
                elif gate_name == 'Z':
                    circuit.z(qubit_idx)
                elif gate_name == 'S':
                    circuit.s(qubit_idx)
                elif gate_name == 'T':
                    circuit.t(qubit_idx)
                elif gate_name == 'RX':
                    angle = gate.parameter if gate.parameter is not None else 0
                    circuit.rx(angle, qubit_idx)
                elif gate_name == 'RY':
                    angle = gate.parameter if gate.parameter is not None else 0
                    circuit.ry(angle, qubit_idx)
                elif gate_name == 'RZ':
                    angle = gate.parameter if gate.parameter is not None else 0
                    circuit.rz(angle, qubit_idx)
                
                # Two-qubit gates
                elif gate_name == 'CNOT' or gate_name == 'CX':
                    if gate.target_qubit is None:
                        raise ValueError("CNOT gate requires target_qubit parameter")
                    target_idx = gate.target_qubit
                    if target_idx >= qubits or target_idx < 0:
                        raise ValueError(f"Invalid target qubit index {target_idx}")
                    circuit.cx(qubit_idx, target_idx)
                
                # Measurement
                elif gate_name == 'MEASURE':
                    circuit.measure(qubit_idx, qubit_idx)
                
                else:
                    print(f"Warning: Unknown gate type '{gate_name}', skipping")
                    
            except Exception as e:
                print(f"Error applying gate {gate.name} to qubit {gate.qubit}: {e}")
                raise e
        
        return circuit
    
    def _run_simulation(self, qubits: int, gates: List[GateOperation], shots: int = 1024) -> Tuple[List[complex], List[float], Dict[str, int]]:
        """
        Simulate a quantum circuit and return state vector, probabilities, and measurement counts
        
        Returns:
            Tuple of (statevector, probabilities, measurement_counts)
        """
        try:
            circuit = self.create_quantum_circuit(qubits, gates)
            
            # Get state vector
            statevector_circuit = circuit.copy()
            # Remove any measurements for statevector simulation
            statevector_circuit.data = [instr for instr in statevector_circuit.data 
                                      if instr.operation.name != 'measure']
            
            statevector_job = self.statevector_simulator.run(statevector_circuit)
            statevector_result = statevector_job.result()
            statevector = statevector_result.get_statevector()
            
            # Calculate probabilities
            probabilities = np.abs(statevector) ** 2
            
            # Get measurement counts
            measurement_circuit = circuit.copy()
            # Add measurements if not present - but be careful about existing classical registers
            has_measurements = any(instr.operation.name == 'measure' for instr in measurement_circuit.data)
            if not has_measurements:
                # Only measure the qubits we actually have
                for i in range(qubits):
                    measurement_circuit.measure(i, i)
            
            measurement_job = self.qasm_simulator.run(measurement_circuit, shots=shots)
            measurement_result = measurement_job.result()
            counts = measurement_result.get_counts()
            
            return statevector.data.tolist(), probabilities.tolist(), counts
            
        except Exception as e:
            print(f"Circuit simulation error: {e}")
            raise e
    
    def simulate_circuit(self, gates: List[Dict], num_qubits: int, shots: int = 1024) -> Dict:
        """
        Simulate a circuit and return results in the format expected by the exercise checker
        
        Args:
            gates: List of gate dictionaries (from frontend)
            num_qubits: Number of qubits in the circuit
            shots: Number of measurement shots
            
        Returns:
            Dictionary with state_vector, probabilities, and measurement_counts
        """
        try:
            print(f"Exercise checker received gates: {gates}")
            
            # Convert gate dictionaries to GateOperation objects
            gate_operations = []
            for i, gate_dict in enumerate(gates):
                print(f"Processing gate {i}: {gate_dict}")
                
                gate_op = GateOperation(
                    name=gate_dict.get("gate", gate_dict.get("name", "")),
                    qubit=gate_dict.get("qubit", 0),
                    timeStep=gate_dict.get("timeStep", i),
                    target_qubit=gate_dict.get("target_qubit", gate_dict.get("target")),
                    parameter=gate_dict.get("parameter"),
                    description=gate_dict.get("description"),
                    symbol=gate_dict.get("symbol")
                )
                
                print(f"Created GateOperation: name={gate_op.name}, qubit={gate_op.qubit}, target_qubit={gate_op.target_qubit}")
                
                # Special validation for CNOT gates
                if gate_op.name.upper() == 'CNOT':
                    if gate_op.target_qubit is None:
                        print(f"ERROR: CNOT gate missing target_qubit. Original dict: {gate_dict}")
                        raise ValueError(f"CNOT gate requires target_qubit to be specified. Received: {gate_dict}")
                    print(f"CNOT gate validated: control={gate_op.qubit}, target={gate_op.target_qubit}")
                
                gate_operations.append(gate_op)
            
            print(f"Final gate operations: {[{'name': g.name, 'qubit': g.qubit, 'target_qubit': g.target_qubit} for g in gate_operations]}")
            
            # Simulate the circuit
            statevector, probabilities, measurement_counts = self._run_simulation(
                num_qubits, gate_operations, shots
            )
            
            # Convert statevector to the format expected
            # Handle both complex and real numbers
            formatted_statevector = []
            for sv in statevector:
                if isinstance(sv, complex):
                    formatted_statevector.append([sv.real, sv.imag])
                else:
                    formatted_statevector.append(sv)
            
            # Convert measurement counts to probabilities
            total_shots = sum(measurement_counts.values()) if measurement_counts else shots
            prob_dict = {}
            
            # For probability-based exercises, use theoretical probabilities instead of noisy measurements
            # This gives more consistent and accurate results
            for i, prob in enumerate(probabilities):
                binary_state = format(i, f'0{num_qubits}b')
                prob_dict[binary_state] = prob
            
            return {
                "state_vector": formatted_statevector,
                "probabilities": prob_dict,
                "measurement_counts": measurement_counts or {},
                "num_qubits": num_qubits,
                "total_shots": total_shots
            }
            
        except Exception as e:
            print(f"Error in simulate_circuit: {e}")
            raise e

    def get_circuit_info(self, circuit: QuantumCircuit) -> Dict[str, Any]:
        """Get information about the circuit"""
        return {
            "depth": circuit.depth(),
            "size": circuit.size(),
            "num_qubits": circuit.num_qubits,
            "num_clbits": circuit.num_clbits,
            "gates": [instr.operation.name for instr in circuit.data]
        }
    
    def state_vector_to_complex_list(self, statevector: List[complex]) -> List[ComplexNumber]:
        """Convert complex statevector to ComplexNumber list for JSON serialization"""
        return [
            ComplexNumber(real=complex_num.real, imag=complex_num.imag) 
            for complex_num in statevector
        ]
    
    def compare_state_vectors(self, state1: List[complex], state2: List[complex], tolerance: float = 1e-6) -> bool:
        """Compare two state vectors with given tolerance"""
        if len(state1) != len(state2):
            return False
        
        for s1, s2 in zip(state1, state2):
            if abs(s1 - s2) > tolerance:
                return False
        return True
    
    def compare_probabilities(self, probs1: Dict[str, float], probs2: Dict[str, float], tolerance: float = 0.05) -> bool:
        """Compare two probability distributions with given tolerance"""
        all_states = set(probs1.keys()) | set(probs2.keys())
        
        for state in all_states:
            p1 = probs1.get(state, 0.0)
            p2 = probs2.get(state, 0.0)
            if abs(p1 - p2) > tolerance:
                return False
        return True
