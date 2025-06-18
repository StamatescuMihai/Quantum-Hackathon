# Quantum Circuit Simulator Test Examples

This document provides comprehensive test examples for quantum circuit simulators, covering various quantum gates, algorithms, and edge cases. These tests can be used to validate the correctness and robustness of quantum circuit simulation implementations.

## Table of Contents

1. [Basic Gate Tests](#basic-gate-tests)
2. [Multi-Qubit Gate Tests](#multi-qubit-gate-tests)
3. [Quantum Algorithm Tests](#quantum-algorithm-tests)
4. [State Vector Tests](#state-vector-tests)
5. [Measurement Tests](#measurement-tests)
6. [Circuit Construction Tests](#circuit-construction-tests)
7. [Error Handling Tests](#error-handling-tests)
8. [Performance Tests](#performance-tests)

## Basic Gate Tests

### Test 1: Pauli-X Gate (NOT Gate)
**Purpose**: Verify that the X gate correctly flips qubit states.

```python
def test_pauli_x_gate():
    """Test Pauli-X gate flips |0⟩ to |1⟩ and |1⟩ to |0⟩"""
    # Test |0⟩ → |1⟩
    circuit = create_circuit(1)
    circuit.add_gate("X", qubit=0)
    result = simulate(circuit)
    assert result.probabilities == [0.0, 1.0]  # |1⟩ state
    
    # Test |1⟩ → |0⟩
    circuit = create_circuit(1)
    circuit.add_gate("X", qubit=0)  # First X: |0⟩ → |1⟩
    circuit.add_gate("X", qubit=0)  # Second X: |1⟩ → |0⟩
    result = simulate(circuit)
    assert result.probabilities == [1.0, 0.0]  # |0⟩ state
```

### Test 2: Hadamard Gate
**Purpose**: Verify superposition creation and equal probability distribution.

```python
def test_hadamard_gate():
    """Test Hadamard gate creates equal superposition"""
    circuit = create_circuit(1)
    circuit.add_gate("H", qubit=0)
    result = simulate(circuit)
    
    # Should create |+⟩ = (|0⟩ + |1⟩)/√2
    expected_prob = 0.5
    tolerance = 1e-10
    assert abs(result.probabilities[0] - expected_prob) < tolerance
    assert abs(result.probabilities[1] - expected_prob) < tolerance
    
    # State vector should be [1/√2, 1/√2]
    sqrt_half = 1/np.sqrt(2)
    assert abs(result.quantum_state[0].real - sqrt_half) < tolerance
    assert abs(result.quantum_state[1].real - sqrt_half) < tolerance
```

### Test 3: Pauli-Z Gate
**Purpose**: Verify phase flip operation.

```python
def test_pauli_z_gate():
    """Test Pauli-Z gate applies phase flip"""
    # Z|0⟩ = |0⟩
    circuit = create_circuit(1)
    circuit.add_gate("Z", qubit=0)
    result = simulate(circuit)
    assert result.probabilities == [1.0, 0.0]
    
    # Z|1⟩ = -|1⟩
    circuit = create_circuit(1)
    circuit.add_gate("X", qubit=0)  # Prepare |1⟩
    circuit.add_gate("Z", qubit=0)  # Apply Z
    result = simulate(circuit)
    assert result.probabilities == [0.0, 1.0]
    assert result.quantum_state[1].real == -1.0  # Phase should be negative
```

### Test 4: Phase Gates (S and T)
**Purpose**: Test quarter-turn and eighth-turn phase gates.

```python
def test_phase_gates():
    """Test S and T gate phase rotations"""
    # S gate: adds π/2 phase
    circuit = create_circuit(1)
    circuit.add_gate("X", qubit=0)  # Prepare |1⟩
    circuit.add_gate("S", qubit=0)
    result = simulate(circuit)
    expected_phase = complex(0, 1)  # i
    assert abs(result.quantum_state[1] - expected_phase) < 1e-10
    
    # T gate: adds π/4 phase
    circuit = create_circuit(1)
    circuit.add_gate("X", qubit=0)  # Prepare |1⟩
    circuit.add_gate("T", qubit=0)
    result = simulate(circuit)
    expected_phase = complex(1/np.sqrt(2), 1/np.sqrt(2))  # e^(iπ/4)
    assert abs(result.quantum_state[1] - expected_phase) < 1e-10
```

## Multi-Qubit Gate Tests

### Test 5: CNOT Gate
**Purpose**: Verify controlled-NOT operation and entanglement creation.

```python
def test_cnot_gate():
    """Test CNOT gate for all computational basis states"""
    test_cases = [
        # (control_state, target_state, expected_control, expected_target)
        (0, 0, 0, 0),  # |00⟩ → |00⟩
        (0, 1, 0, 1),  # |01⟩ → |01⟩
        (1, 0, 1, 1),  # |10⟩ → |11⟩
        (1, 1, 1, 0),  # |11⟩ → |10⟩
    ]
    
    for ctrl_init, targ_init, ctrl_exp, targ_exp in test_cases:
        circuit = create_circuit(2)
        
        # Prepare initial state
        if ctrl_init == 1:
            circuit.add_gate("X", qubit=0)
        if targ_init == 1:
            circuit.add_gate("X", qubit=1)
            
        # Apply CNOT
        circuit.add_gate("CNOT", control=0, target=1)
        
        result = simulate(circuit)
        
        # Check final state
        expected_state = ctrl_exp * 2 + targ_exp  # Binary to decimal
        for i in range(4):
            if i == expected_state:
                assert result.probabilities[i] == 1.0
            else:
                assert result.probabilities[i] == 0.0
```

### Test 6: Bell State Creation
**Purpose**: Test entangled state preparation.

```python
def test_bell_state_creation():
    """Test creation of Bell states (maximally entangled states)"""
    # |Φ+⟩ = (|00⟩ + |11⟩)/√2
    circuit = create_circuit(2)
    circuit.add_gate("H", qubit=0)
    circuit.add_gate("CNOT", control=0, target=1)
    result = simulate(circuit)
    
    expected_prob = 0.5
    tolerance = 1e-10
    assert abs(result.probabilities[0] - expected_prob) < tolerance  # |00⟩
    assert abs(result.probabilities[1]) < tolerance                  # |01⟩
    assert abs(result.probabilities[2]) < tolerance                  # |10⟩
    assert abs(result.probabilities[3] - expected_prob) < tolerance  # |11⟩
```

### Test 7: Three-Qubit Gates
**Purpose**: Test Toffoli (CCNOT) gate.

```python
def test_toffoli_gate():
    """Test Toffoli gate (controlled-controlled-NOT)"""
    # Toffoli only flips target when both controls are |1⟩
    test_cases = [
        # (ctrl1, ctrl2, target) → expected_target
        (0, 0, 0, 0),  # |000⟩ → |000⟩
        (0, 0, 1, 1),  # |001⟩ → |001⟩
        (0, 1, 0, 0),  # |010⟩ → |010⟩
        (0, 1, 1, 1),  # |011⟩ → |011⟩
        (1, 0, 0, 0),  # |100⟩ → |100⟩
        (1, 0, 1, 1),  # |101⟩ → |101⟩
        (1, 1, 0, 1),  # |110⟩ → |111⟩
        (1, 1, 1, 0),  # |111⟩ → |110⟩
    ]
    
    for c1, c2, t_init, t_exp in test_cases:
        circuit = create_circuit(3)
        
        # Prepare initial state
        if c1 == 1: circuit.add_gate("X", qubit=0)
        if c2 == 1: circuit.add_gate("X", qubit=1)
        if t_init == 1: circuit.add_gate("X", qubit=2)
        
        # Apply Toffoli
        circuit.add_gate("TOFFOLI", control1=0, control2=1, target=2)
        
        result = simulate(circuit)
        expected_state = c1 * 4 + c2 * 2 + t_exp
        assert result.probabilities[expected_state] == 1.0
```

## Quantum Algorithm Tests

### Test 8: Deutsch-Jozsa Algorithm
**Purpose**: Test algorithm that distinguishes constant vs balanced functions.

```python
def test_deutsch_jozsa_constant():
    """Test Deutsch-Jozsa for constant function"""
    # Constant function f(x) = 0
    circuit = create_circuit(3)  # 2 qubits + 1 ancilla
    
    # Initialize
    circuit.add_gate("X", qubit=2)  # Ancilla in |1⟩
    circuit.add_gate("H", qubit=0)
    circuit.add_gate("H", qubit=1)
    circuit.add_gate("H", qubit=2)
    
    # Oracle for constant function (do nothing)
    
    # Final Hadamards
    circuit.add_gate("H", qubit=0)
    circuit.add_gate("H", qubit=1)
    
    result = simulate(circuit)
    
    # For constant function, measurement should give |00⟩ with probability 1
    assert result.measurement_counts.get("000", 0) + result.measurement_counts.get("001", 0) > 0.9 * sum(result.measurement_counts.values())

def test_deutsch_jozsa_balanced():
    """Test Deutsch-Jozsa for balanced function"""
    # Balanced function f(x) = x₀ ⊕ x₁
    circuit = create_circuit(3)
    
    # Initialize
    circuit.add_gate("X", qubit=2)
    circuit.add_gate("H", qubit=0)
    circuit.add_gate("H", qubit=1)
    circuit.add_gate("H", qubit=2)
    
    # Oracle for f(x) = x₀ ⊕ x₁
    circuit.add_gate("CNOT", control=0, target=2)
    circuit.add_gate("CNOT", control=1, target=2)
    
    # Final Hadamards
    circuit.add_gate("H", qubit=0)
    circuit.add_gate("H", qubit=1)
    
    result = simulate(circuit)
    
    # For balanced function, |00⟩ should never occur
    assert result.measurement_counts.get("000", 0) + result.measurement_counts.get("001", 0) == 0
```

### Test 9: Grover's Algorithm
**Purpose**: Test quantum search algorithm.

```python
def test_grover_algorithm():
    """Test Grover's algorithm for 2-qubit search"""
    target_item = 3  # |11⟩
    circuit = create_circuit(2)
    
    # Initialize superposition
    circuit.add_gate("H", qubit=0)
    circuit.add_gate("H", qubit=1)
    
    # Grover iteration (optimal for 2 qubits is 1 iteration)
    # Oracle: flip amplitude of |11⟩
    circuit.add_gate("CZ", control=0, target=1)
    
    # Diffusion operator
    circuit.add_gate("H", qubit=0)
    circuit.add_gate("H", qubit=1)
    circuit.add_gate("X", qubit=0)
    circuit.add_gate("X", qubit=1)
    circuit.add_gate("CZ", control=0, target=1)
    circuit.add_gate("X", qubit=0)
    circuit.add_gate("X", qubit=1)
    circuit.add_gate("H", qubit=0)
    circuit.add_gate("H", qubit=1)
    
    result = simulate(circuit)
    
    # Should amplify probability of finding |11⟩
    assert result.probabilities[3] > 0.8  # High probability for target state
```

### Test 10: Quantum Fourier Transform
**Purpose**: Test QFT implementation.

```python
def test_quantum_fourier_transform():
    """Test 2-qubit Quantum Fourier Transform"""
    circuit = create_circuit(2)
    
    # Prepare test state |01⟩
    circuit.add_gate("X", qubit=1)
    
    # Apply QFT
    circuit.add_gate("H", qubit=0)
    circuit.add_gate("CRZ", control=1, target=0, parameter=np.pi/2)
    circuit.add_gate("H", qubit=1)
    
    # Swap qubits (part of QFT)
    circuit.add_gate("SWAP", qubit1=0, qubit2=1)
    
    result = simulate(circuit)
    
    # Expected QFT of |01⟩ should have specific amplitude pattern
    expected_amplitudes = [0.5, 0.5, -0.5, 0.5]
    tolerance = 1e-10
    
    for i, expected in enumerate(expected_amplitudes):
        assert abs(result.quantum_state[i].real - expected) < tolerance
```

## State Vector Tests

### Test 11: State Vector Normalization
**Purpose**: Ensure quantum states remain normalized.

```python
def test_state_normalization():
    """Test that quantum states remain normalized after operations"""
    circuits = [
        create_single_gate_circuit("H", 0),
        create_single_gate_circuit("X", 0),
        create_single_gate_circuit("Y", 0),
        create_single_gate_circuit("Z", 0),
        create_bell_state_circuit(),
        create_random_circuit(3, 10)  # Random circuit with 10 gates
    ]
    
    for circuit in circuits:
        result = simulate(circuit)
        
        # Calculate total probability
        total_prob = sum(result.probabilities)
        assert abs(total_prob - 1.0) < 1e-10
        
        # Calculate state vector norm
        norm_squared = sum(abs(amp.real)**2 + abs(amp.imag)**2 
                          for amp in result.quantum_state)
        assert abs(norm_squared - 1.0) < 1e-10
```

### Test 12: Phase Consistency
**Purpose**: Test global and relative phase handling.

```python
def test_phase_consistency():
    """Test that phases are handled correctly"""
    # Test global phase invariance
    circuit1 = create_circuit(1)
    circuit1.add_gate("X", qubit=0)
    
    circuit2 = create_circuit(1)
    circuit2.add_gate("X", qubit=0)
    circuit2.add_global_phase(np.pi/4)
    
    result1 = simulate(circuit1)
    result2 = simulate(circuit2)
    
    # Probabilities should be identical (global phase doesn't affect measurement)
    assert result1.probabilities == result2.probabilities
    
    # Test relative phase
    circuit3 = create_circuit(1)
    circuit3.add_gate("H", qubit=0)
    circuit3.add_gate("Z", qubit=0)
    circuit3.add_gate("H", qubit=0)
    
    result3 = simulate(circuit3)
    assert result3.probabilities == [0.0, 1.0]  # Should be |1⟩
```

## Measurement Tests

### Test 13: Single Qubit Measurements
**Purpose**: Test measurement statistics and collapse.

```python
def test_single_qubit_measurement():
    """Test single qubit measurement statistics"""
    shots = 10000
    
    # Test measurement of |+⟩ state
    circuit = create_circuit(1)
    circuit.add_gate("H", qubit=0)
    
    results = []
    for _ in range(100):  # Multiple simulation runs
        result = simulate(circuit, shots=shots//100)
        results.extend(result.measurements)
    
    # Count 0s and 1s
    count_0 = results.count(0)
    count_1 = results.count(1)
    total = len(results)
    
    # Should be approximately 50-50
    assert abs(count_0/total - 0.5) < 0.05
    assert abs(count_1/total - 0.5) < 0.05
```

### Test 14: Multi-Qubit Measurement Correlations
**Purpose**: Test entangled state measurement correlations.

```python
def test_entangled_measurement_correlations():
    """Test measurement correlations in Bell states"""
    shots = 10000
    
    # Create |Φ+⟩ = (|00⟩ + |11⟩)/√2
    circuit = create_circuit(2)
    circuit.add_gate("H", qubit=0)
    circuit.add_gate("CNOT", control=0, target=1)
    
    result = simulate(circuit, shots=shots)
    
    # In Bell state, measurements should be perfectly correlated
    count_00 = result.measurement_counts.get("00", 0)
    count_01 = result.measurement_counts.get("01", 0)
    count_10 = result.measurement_counts.get("10", 0)
    count_11 = result.measurement_counts.get("11", 0)
    
    # Should only see |00⟩ and |11⟩ outcomes
    assert count_01 == 0
    assert count_10 == 0
    assert abs(count_00 - count_11) < shots * 0.1  # Approximately equal
```

## Circuit Construction Tests

### Test 15: Circuit Depth and Gate Count
**Purpose**: Test circuit analysis metrics.

```python
def test_circuit_metrics():
    """Test circuit depth and gate count calculations"""
    circuit = create_circuit(3)
    circuit.add_gate("H", qubit=0, time_step=0)
    circuit.add_gate("H", qubit=1, time_step=0)  # Parallel with previous
    circuit.add_gate("CNOT", control=0, target=1, time_step=1)
    circuit.add_gate("H", qubit=2, time_step=1)  # Parallel with CNOT
    circuit.add_gate("Z", qubit=0, time_step=2)
    
    result = simulate(circuit)
    
    assert result.circuit_depth == 3  # 3 time steps
    assert result.gate_count == 5     # 5 total gates
```

### Test 16: Circuit Composition
**Purpose**: Test combining multiple circuits.

```python
def test_circuit_composition():
    """Test composing circuits together"""
    # Create first circuit: Bell state preparation
    circuit1 = create_circuit(2)
    circuit1.add_gate("H", qubit=0)
    circuit1.add_gate("CNOT", control=0, target=1)
    
    # Create second circuit: measurement in X basis
    circuit2 = create_circuit(2)
    circuit2.add_gate("H", qubit=0)
    circuit2.add_gate("H", qubit=1)
    
    # Compose circuits
    combined_circuit = compose_circuits(circuit1, circuit2)
    result = simulate(combined_circuit)
    
    # Should result in specific probability distribution
    expected_probs = [0.5, 0.0, 0.0, 0.5]
    tolerance = 1e-10
    for i, expected in enumerate(expected_probs):
        assert abs(result.probabilities[i] - expected) < tolerance
```

## Error Handling Tests

### Test 17: Invalid Gate Parameters
**Purpose**: Test error handling for invalid inputs.

```python
def test_invalid_gate_parameters():
    """Test error handling for invalid gate parameters"""
    with pytest.raises(ValueError):
        circuit = create_circuit(2)
        circuit.add_gate("CNOT", control=0, target=0)  # Control = target
    
    with pytest.raises(ValueError):
        circuit = create_circuit(2)
        circuit.add_gate("H", qubit=5)  # Qubit index out of range
    
    with pytest.raises(ValueError):
        circuit = create_circuit(1)
        circuit.add_gate("UNKNOWN_GATE", qubit=0)  # Invalid gate name
```

### Test 18: Circuit Validation
**Purpose**: Test circuit consistency checks.

```python
def test_circuit_validation():
    """Test circuit validation and error detection"""
    # Test empty circuit
    circuit = create_circuit(1)
    result = simulate(circuit)
    assert result.probabilities == [1.0, 0.0]  # Should be |0⟩
    
    # Test maximum circuit size
    with pytest.raises(ValueError):
        create_circuit(100)  # Too many qubits
    
    # Test time step consistency
    circuit = create_circuit(2)
    circuit.add_gate("H", qubit=0, time_step=0)
    circuit.add_gate("CNOT", control=0, target=1, time_step=0)  # Conflict
    
    with pytest.raises(ValueError):
        validate_circuit(circuit)
```

## Performance Tests

### Test 19: Scaling with Qubit Number
**Purpose**: Test performance scaling with system size.

```python
def test_qubit_scaling():
    """Test performance scaling with number of qubits"""
    import time
    
    times = []
    qubit_counts = [1, 2, 3, 4, 5, 6]
    
    for n_qubits in qubit_counts:
        circuit = create_circuit(n_qubits)
        # Add some gates
        for i in range(n_qubits):
            circuit.add_gate("H", qubit=i)
        for i in range(n_qubits - 1):
            circuit.add_gate("CNOT", control=i, target=i+1)
        
        start_time = time.time()
        result = simulate(circuit)
        end_time = time.time()
        
        times.append(end_time - start_time)
        
        # Verify correct state space size
        assert len(result.probabilities) == 2**n_qubits
        assert len(result.quantum_state) == 2**n_qubits
    
    # Performance should scale exponentially
    assert times[-1] > times[0]  # Larger circuits take more time
```

### Test 20: Memory Usage
**Purpose**: Test memory efficiency.

```python
def test_memory_usage():
    """Test memory usage for large circuits"""
    import psutil
    import os
    
    process = psutil.Process(os.getpid())
    initial_memory = process.memory_info().rss
    
    # Create a moderately large circuit
    circuit = create_circuit(8)  # 256-dimensional state space
    for i in range(8):
        circuit.add_gate("H", qubit=i)
    
    result = simulate(circuit)
    
    final_memory = process.memory_info().rss
    memory_increase = final_memory - initial_memory
    
    # Memory usage should be reasonable (less than 100MB for 8 qubits)
    assert memory_increase < 100 * 1024 * 1024  # 100MB
    
    # Verify state was computed correctly
    expected_amplitude = 1.0 / np.sqrt(256)  # Equal superposition
    for amp in result.quantum_state:
        assert abs(abs(amp.real) - expected_amplitude) < 1e-10
```

## Test Utilities and Helpers

### Test Data Generation
```python
def generate_random_circuit(n_qubits: int, n_gates: int, seed: int = None) -> Circuit:
    """Generate a random quantum circuit for testing"""
    if seed:
        np.random.seed(seed)
    
    circuit = create_circuit(n_qubits)
    gates = ["H", "X", "Y", "Z", "S", "T"]
    two_qubit_gates = ["CNOT", "CZ"]
    
    for _ in range(n_gates):
        if np.random.random() < 0.7:  # 70% single-qubit gates
            gate = np.random.choice(gates)
            qubit = np.random.randint(0, n_qubits)
            circuit.add_gate(gate, qubit=qubit)
        else:  # 30% two-qubit gates
            gate = np.random.choice(two_qubit_gates)
            control = np.random.randint(0, n_qubits)
            target = np.random.randint(0, n_qubits)
            if control != target:
                circuit.add_gate(gate, control=control, target=target)
    
    return circuit

def create_test_suite():
    """Create a comprehensive test suite"""
    test_suite = TestSuite()
    
    # Add all test classes
    test_suite.addTest(TestBasicGates())
    test_suite.addTest(TestMultiQubitGates())
    test_suite.addTest(TestQuantumAlgorithms())
    test_suite.addTest(TestStateVectors())
    test_suite.addTest(TestMeasurements())
    test_suite.addTest(TestCircuitConstruction())
    test_suite.addTest(TestErrorHandling())
    test_suite.addTest(TestPerformance())
    
    return test_suite
```

## Running the Tests

### Test Configuration
```python
# pytest configuration (pytest.ini or pyproject.toml)
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py", "*_test.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
addopts = [
    "--verbose",
    "--tb=short",
    "--strict-markers",
    "--disable-warnings",
]
markers = [
    "unit: Unit tests",
    "integration: Integration tests", 
    "performance: Performance tests",
    "slow: Slow-running tests",
]
```

### Example Test Execution
```bash
# Run all tests
pytest quantum_circuit_simulator_tests.py -v

# Run specific test categories
pytest -m "unit" -v
pytest -m "performance" -v

# Run with coverage
pytest --cov=quantum_simulator --cov-report=html

# Run performance tests with timing
pytest -m "performance" --durations=10
```

## Best Practices

1. **Test Isolation**: Each test should be independent and not rely on other tests
2. **Tolerance Settings**: Use appropriate numerical tolerances for floating-point comparisons
3. **Random Testing**: Use seeded random circuits for reproducible tests
4. **Performance Monitoring**: Track execution time and memory usage for regression detection
5. **Edge Cases**: Test boundary conditions, empty circuits, and maximum sizes
6. **Error Scenarios**: Verify proper error handling and meaningful error messages
7. **Documentation**: Include clear descriptions of what each test validates

This comprehensive test suite ensures your quantum circuit simulator is robust, accurate, and performant across a wide range of quantum computing scenarios.
