from qiskit import QuantumCircuit
from qiskit.visualization import circuit_drawer
import matplotlib.pyplot as plt
import numpy as np
import io
import base64
from typing import Dict, Any, List

def circuit_to_svg(circuit: QuantumCircuit) -> str:
    """Convert quantum circuit to SVG string for web display"""
    try:
        # Use matplotlib backend to generate SVG
        fig = circuit_drawer(circuit, output='mpl', style='color')
        
        # Save to string buffer
        buffer = io.StringIO()
        fig.savefig(buffer, format='svg', bbox_inches='tight', dpi=150)
        buffer.seek(0)
        svg_string = buffer.getvalue()
        
        # Clean up
        plt.close(fig)
        
        return svg_string
    except Exception:
        return ""

def circuit_to_ascii(circuit: QuantumCircuit) -> str:
    """Convert quantum circuit to ASCII representation"""
    try:
        return str(circuit_drawer(circuit, output='text'))
    except Exception:
        return str(circuit)

def extract_circuit_stats(circuit: QuantumCircuit) -> Dict[str, Any]:
    """Extract statistics from quantum circuit"""
    stats = {
        "num_qubits": circuit.num_qubits,
        "num_clbits": circuit.num_clbits,
        "depth": circuit.depth(),
        "num_gates": len(circuit.data),
        "gate_counts": {},
        "num_parameters": circuit.num_parameters
    }
    
    # Count gates by type
    for instruction in circuit.data:
        gate_name = instruction[0].name
        stats["gate_counts"][gate_name] = stats["gate_counts"].get(gate_name, 0) + 1
    
    return stats

def validate_circuit_parameters(num_qubits: int, max_qubits: int = 10) -> bool:
    """Validate circuit parameters to prevent resource exhaustion"""
    if num_qubits < 1:
        return False
    if num_qubits > max_qubits:
        return False
    return True

def format_quantum_state(statevector, num_qubits: int) -> str:
    """Format quantum state vector as readable string"""
    state_strings = []
    num_states = 2 ** num_qubits
    
    for i in range(num_states):
        amplitude = statevector[i]
        if abs(amplitude) > 1e-6:  # Only show non-negligible amplitudes
            binary_state = format(i, f'0{num_qubits}b')
            if amplitude.imag == 0:
                coeff_str = f"{amplitude.real:.3f}"
            else:
                coeff_str = f"({amplitude.real:.3f}+{amplitude.imag:.3f}i)"
            state_strings.append(f"{coeff_str}|{binary_state}⟩")
    
    return " + ".join(state_strings) if state_strings else "0"

def calculate_success_probability(probabilities: List[float], target_states: List[int]) -> float:
    """Calculate success probability for measuring target states"""
    return sum(probabilities[i] for i in target_states if i < len(probabilities))

def generate_measurement_histogram_data(counts: Dict[str, int]) -> Dict[str, Any]:
    """Generate data for measurement histogram visualization"""
    total_shots = sum(counts.values())
    
    # Sort by state value for consistent ordering
    sorted_states = sorted(counts.keys())
    
    histogram_data = {
        "labels": sorted_states,
        "values": [counts[state] for state in sorted_states],
        "probabilities": [counts[state] / total_shots for state in sorted_states],
        "total_shots": total_shots
    }
    
    return histogram_data

def estimate_algorithm_runtime(num_qubits: int, algorithm_type: str) -> Dict[str, Any]:
    """Estimate runtime characteristics for different algorithms"""
    num_states = 2 ** num_qubits
    
    runtimes = {
        "grover": {
            "classical": num_states,  # O(N)
            "quantum": int(np.pi * np.sqrt(num_states) / 4),  # O(√N)
            "speedup": np.sqrt(num_states),
            "description": "Quadratic speedup for search"
        },
        "deutsch-jozsa": {
            "classical": 2**(num_qubits-1) + 1,  # O(2^(n-1)+1)
            "quantum": 1,  # O(1)
            "speedup": 2**(num_qubits-1) + 1,
            "description": "Exponential speedup for function analysis"
        },
        "bernstein-vazirani": {
            "classical": num_qubits,  # O(n)
            "quantum": 1,  # O(1)
            "speedup": num_qubits,
            "description": "Linear speedup for string recovery"
        },
        "simon": {
            "classical": 2**(num_qubits//2),  # O(2^(n/2))
            "quantum": num_qubits,  # O(n)
            "speedup": 2**(num_qubits//2) / num_qubits,
            "description": "Exponential speedup for period finding"
        }
    }
    
    return runtimes.get(algorithm_type, {})

def validate_binary_string(binary_str: str, max_length: int = 10) -> bool:
    """Validate binary string input"""
    if not binary_str:
        return False
    if not all(c in '01' for c in binary_str):
        return False
    if len(binary_str) > max_length:
        return False
    return True
