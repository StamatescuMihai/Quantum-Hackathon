# Quantum Circuit Simulator Guide

This guide provides practical examples for using the quantum circuit simulator with different numbers of qubits (2-6), showing available gates, circuit configurations, and expected outputs.

## Available Gates

### Single-Qubit Gates
- **H** - Hadamard Gate (creates superposition)
- **X** - Pauli-X (NOT gate, bit flip)
- **Y** - Pauli-Y (bit and phase flip)
- **Z** - Pauli-Z (phase flip)
- **T** - T Gate (π/8 rotation)
- **S** - S Gate (π/4 rotation)
- **RZ** - Z-Rotation (parameterized)
- **RX** - X-Rotation (parameterized)
- **RY** - Y-Rotation (parameterized)

### Two-Qubit Gates
- **CNOT** - Controlled-NOT (entangling gate)

### Predefined Algorithms
- **grover** - Grover's Search Algorithm
- **deutsch-jozsa** - Deutsch-Jozsa Algorithm
- **bernstein-vazirani** - Bernstein-Vazirani Algorithm
- **simon** - Simon's Algorithm

## API Request Format

```json
{
  "qubits": 3,
  "gates": [
    {
      "name": "H",
      "qubit": 0,
      "timeStep": 0,
      "description": "Hadamard gate for superposition"
    }
  ],
  "algorithm": "custom",
  "shots": 1024
}
```

## 2-Qubit Examples

### Example 1: Bell State Preparation
**Purpose**: Create maximally entangled state |Φ+⟩ = (|00⟩ + |11⟩)/√2

```json
{
  "qubits": 2,
  "gates": [
    {
      "name": "H",
      "qubit": 0,
      "timeStep": 0,
      "description": "Create superposition on qubit 0"
    },
    {
      "name": "CNOT",
      "qubit": 0,
      "target_qubit": 1,
      "timeStep": 1,
      "description": "Entangle qubits 0 and 1"
    }
  ],
  "shots": 1024
}
```

**Expected Output**:
- **Quantum State**: [0.707+0i, 0+0i, 0+0i, 0.707+0i]
- **Probabilities**: [0.5, 0.0, 0.0, 0.5]
- **Measurement Counts**: ~50% "00", ~50% "11", 0% "01", 0% "10"

### Example 2: Single Qubit Operations
**Purpose**: Test basic single-qubit gates

```json
{
  "qubits": 2,
  "gates": [
    {
      "name": "H",
      "qubit": 0,
      "timeStep": 0,
      "description": "Hadamard on qubit 0"
    },
    {
      "name": "X",
      "qubit": 1,
      "timeStep": 0,
      "description": "NOT gate on qubit 1"
    }
  ],
  "shots": 1024
}
```

**Expected Output**:
- **Quantum State**: [0+0i, 0.707+0i, 0+0i, 0.707+0i]
- **Probabilities**: [0.0, 0.5, 0.0, 0.5]
- **Measurement Counts**: ~50% "01", ~50% "11"

### Example 3: Phase Gate Example
**Purpose**: Demonstrate phase manipulation

```json
{
  "qubits": 2,
  "gates": [
    {
      "name": "H",
      "qubit": 0,
      "timeStep": 0,
      "description": "Create superposition"
    },
    {
      "name": "Z",
      "qubit": 0,
      "timeStep": 1,
      "description": "Apply phase flip"
    },
    {
      "name": "H",
      "qubit": 0,
      "timeStep": 2,
      "description": "Convert back to computational basis"
    }
  ],
  "shots": 1024
}
```

**Expected Output**:
- **Quantum State**: [0+0i, 1+0i, 0+0i, 0+0i]
- **Probabilities**: [0.0, 1.0, 0.0, 0.0]
- **Measurement Counts**: 100% "01"

## 3-Qubit Examples

### Example 4: GHZ State Creation
**Purpose**: Create 3-qubit entangled state |GHZ⟩ = (|000⟩ + |111⟩)/√2

```json
{
  "qubits": 3,
  "gates": [
    {
      "name": "H",
      "qubit": 0,
      "timeStep": 0,
      "description": "Create superposition on qubit 0"
    },
    {
      "name": "CNOT",
      "qubit": 0,
      "target_qubit": 1,
      "timeStep": 1,
      "description": "Entangle qubits 0 and 1"
    },
    {
      "name": "CNOT",
      "qubit": 1,
      "target_qubit": 2,
      "timeStep": 2,
      "description": "Extend entanglement to qubit 2"
    }
  ],
  "shots": 1024
}
```

**Expected Output**:
- **Quantum State**: [0.707+0i, 0+0i, 0+0i, 0+0i, 0+0i, 0+0i, 0+0i, 0.707+0i]
- **Probabilities**: [0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5]
- **Measurement Counts**: ~50% "000", ~50% "111"

### Example 5: Grover's Algorithm (3 qubits)
**Purpose**: Use predefined Grover algorithm

```json
{
  "qubits": 3,
  "algorithm": "grover",
  "shots": 1024
}
```

**Expected Output**:
- **Circuit Depth**: 5
- **Gate Count**: 12 (3 H + 1 Z + 8 gates for diffusion)
- **Probabilities**: Enhanced probability for target state |111⟩

### Example 6: Deutsch-Jozsa Algorithm
**Purpose**: Test function oracle

```json
{
  "qubits": 3,
  "algorithm": "deutsch-jozsa",
  "shots": 1024
}
```

**Expected Output**:
- **Circuit Depth**: 3
- **Probabilities**: Distinguishes constant vs balanced functions

## 4-Qubit Examples

### Example 7: Two Bell Pairs
**Purpose**: Create two independent Bell states

```json
{
  "qubits": 4,
  "gates": [
    {
      "name": "H",
      "qubit": 0,
      "timeStep": 0,
      "description": "Superposition for first Bell pair"
    },
    {
      "name": "H",
      "qubit": 2,
      "timeStep": 0,
      "description": "Superposition for second Bell pair"
    },
    {
      "name": "CNOT",
      "qubit": 0,
      "target_qubit": 1,
      "timeStep": 1,
      "description": "First Bell pair"
    },
    {
      "name": "CNOT",
      "qubit": 2,
      "target_qubit": 3,
      "timeStep": 1,
      "description": "Second Bell pair"
    }
  ],
  "shots": 1024
}
```

**Expected Output**:
- **Probabilities**: 25% each for "0000", "0011", "1100", "1111"
- **State**: Product of two Bell states

### Example 8: Quantum Fourier Transform (4 qubits)
**Purpose**: Basic QFT implementation

```json
{
  "qubits": 4,
  "gates": [
    {
      "name": "X",
      "qubit": 1,
      "timeStep": 0,
      "description": "Prepare |0010⟩ state"
    },
    {
      "name": "H",
      "qubit": 0,
      "timeStep": 1,
      "description": "QFT step 1"
    },
    {
      "name": "RZ",
      "qubit": 0,
      "parameter": 1.5708,
      "timeStep": 2,
      "description": "Controlled rotation π/2"
    },
    {
      "name": "H",
      "qubit": 1,
      "timeStep": 3,
      "description": "QFT step 2"
    }
  ],
  "shots": 1024
}
```

**Expected Output**:
- **Quantum State**: Complex amplitudes showing frequency domain representation
- **Probabilities**: Distributed according to QFT of input state

### Example 9: Simon's Algorithm (4 qubits)
**Purpose**: Find hidden period in function

```json
{
  "qubits": 4,
  "algorithm": "simon",
  "shots": 1024
}
```

**Expected Output**:
- **Circuit Depth**: 4
- **Measurement Pattern**: Results that reveal hidden period structure

## 5-Qubit Examples

### Example 10: Complex Entanglement Chain
**Purpose**: Create linear entanglement across 5 qubits

```json
{
  "qubits": 5,
  "gates": [
    {
      "name": "H",
      "qubit": 0,
      "timeStep": 0,
      "description": "Initial superposition"
    },
    {
      "name": "CNOT",
      "qubit": 0,
      "target_qubit": 1,
      "timeStep": 1,
      "description": "Entangle qubits 0-1"
    },
    {
      "name": "CNOT",
      "qubit": 1,
      "target_qubit": 2,
      "timeStep": 2,
      "description": "Extend to qubit 2"
    },
    {
      "name": "CNOT",
      "qubit": 2,
      "target_qubit": 3,
      "timeStep": 3,
      "description": "Extend to qubit 3"
    },
    {
      "name": "CNOT",
      "qubit": 3,
      "target_qubit": 4,
      "timeStep": 4,
      "description": "Extend to qubit 4"
    }
  ],
  "shots": 1024
}
```

**Expected Output**:
- **Quantum State**: [0.707+0i, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.707+0i]
- **Probabilities**: 50% "00000", 50% "11111"

### Example 11: Grover's Algorithm (5 qubits)
**Purpose**: Search in larger space

```json
{
  "qubits": 5,
  "algorithm": "grover",
  "shots": 1024
}
```

**Expected Output**:
- **Enhanced Probability**: For target state among 32 possibilities
- **Success Rate**: ~80% after optimal iterations

### Example 12: Mixed Gates Example
**Purpose**: Test various gate combinations

```json
{
  "qubits": 5,
  "gates": [
    {
      "name": "H",
      "qubit": 0,
      "timeStep": 0,
      "description": "Hadamard on qubit 0"
    },
    {
      "name": "Y",
      "qubit": 1,
      "timeStep": 0,
      "description": "Pauli-Y on qubit 1"
    },
    {
      "name": "T",
      "qubit": 2,
      "timeStep": 0,
      "description": "T gate on qubit 2"
    },
    {
      "name": "RX",
      "qubit": 3,
      "parameter": 1.5708,
      "timeStep": 0,
      "description": "π/2 rotation around X"
    },
    {
      "name": "CNOT",
      "qubit": 0,
      "target_qubit": 4,
      "timeStep": 1,
      "description": "Entangle qubits 0 and 4"
    }
  ],
  "shots": 1024
}
```

**Expected Output**:
- **Complex State Vector**: Mixture of real and imaginary components
- **Diverse Probabilities**: Non-uniform distribution across 32 states

## 6-Qubit Examples

### Example 13: Quantum Error Correction Demonstration
**Purpose**: Demonstrate 3-qubit repetition code

```json
{
  "qubits": 6,
  "gates": [
    {
      "name": "H",
      "qubit": 0,
      "timeStep": 0,
      "description": "Prepare logical qubit in superposition"
    },
    {
      "name": "CNOT",
      "qubit": 0,
      "target_qubit": 1,
      "timeStep": 1,
      "description": "Encode to qubit 1"
    },
    {
      "name": "CNOT",
      "qubit": 0,
      "target_qubit": 2,
      "timeStep": 2,
      "description": "Encode to qubit 2"
    },
    {
      "name": "H",
      "qubit": 3,
      "timeStep": 3,
      "description": "Prepare second logical qubit"
    },
    {
      "name": "CNOT",
      "qubit": 3,
      "target_qubit": 4,
      "timeStep": 4,
      "description": "Encode second logical qubit"
    },
    {
      "name": "CNOT",
      "qubit": 3,
      "target_qubit": 5,
      "timeStep": 5,
      "description": "Complete encoding"
    }
  ],
  "shots": 1024
}
```

**Expected Output**:
- **Encoded States**: Logical qubits protected by redundancy
- **Measurement Correlations**: Strong correlations within code blocks

### Example 14: Bernstein-Vazirani Algorithm (6 qubits)
**Purpose**: Find hidden bit string

```json
{
  "qubits": 6,
  "algorithm": "bernstein-vazirani",
  "shots": 1024
}
```

**Expected Output**:
- **Hidden String**: Revealed through measurement pattern
- **Success Rate**: Nearly 100% determination of secret string

### Example 15: Complex Parameterized Circuit
**Purpose**: Demonstrate parameterized quantum circuits

```json
{
  "qubits": 6,
  "gates": [
    {
      "name": "RY",
      "qubit": 0,
      "parameter": 0.5236,
      "timeStep": 0,
      "description": "π/6 Y-rotation"
    },
    {
      "name": "RY",
      "qubit": 1,
      "parameter": 1.0472,
      "timeStep": 0,
      "description": "π/3 Y-rotation"
    },
    {
      "name": "RY",
      "qubit": 2,
      "parameter": 1.5708,
      "timeStep": 0,
      "description": "π/2 Y-rotation"
    },
    {
      "name": "CNOT",
      "qubit": 0,
      "target_qubit": 3,
      "timeStep": 1,
      "description": "Entangle 0-3"
    },
    {
      "name": "CNOT",
      "qubit": 1,
      "target_qubit": 4,
      "timeStep": 1,
      "description": "Entangle 1-4"
    },
    {
      "name": "CNOT",
      "qubit": 2,
      "target_qubit": 5,
      "timeStep": 1,
      "description": "Entangle 2-5"
    },
    {
      "name": "RZ",
      "qubit": 3,
      "parameter": 0.7854,
      "timeStep": 2,
      "description": "π/4 Z-rotation"
    },
    {
      "name": "RZ",
      "qubit": 4,
      "parameter": 1.5708,
      "timeStep": 2,
      "description": "π/2 Z-rotation"
    },
    {
      "name": "RZ",
      "qubit": 5,
      "parameter": 2.3562,
      "timeStep": 2,
      "description": "3π/4 Z-rotation"
    }
  ],
  "shots": 1024
}
```

**Expected Output**:
- **Rich State Vector**: Complex amplitudes with varied phases
- **Non-uniform Probabilities**: Gradient of probabilities across states
- **Circuit Depth**: 3
- **Gate Count**: 9

## Understanding the Outputs

### Quantum State Vector
The quantum state is represented as a list of complex numbers:
- **Index**: Corresponds to computational basis state (binary)
- **Magnitude**: √(probability) of measuring that state
- **Phase**: Complex phase information

### Probabilities
List of measurement probabilities for each computational basis state:
- **Length**: Always 2^n for n qubits
- **Sum**: Always equals 1.0 (normalized)
- **Index**: State |000...⟩ = 0, |000...1⟩ = 1, etc.

### Measurement Counts
Dictionary showing actual measurement results from shots:
- **Key**: Binary string representation (e.g., "101")
- **Value**: Number of times this outcome occurred
- **Total**: Sum of all values equals number of shots

### Circuit Metrics
- **Circuit Depth**: Maximum timeStep + 1
- **Gate Count**: Total number of gates applied
- **Qubits**: Number of qubits in the circuit

## Common Patterns and Expected Results

### 1. Equal Superposition
After applying H to all qubits:
- All probabilities = 1/2^n
- All amplitudes = ±1/√(2^n)

### 2. Bell States
Two-qubit maximally entangled states:
- Only two non-zero amplitudes
- Perfect correlation in measurements

### 3. GHZ States
Multi-qubit entangled states:
- Only |000...⟩ and |111...⟩ have non-zero amplitudes
- Equal probabilities for these two states

### 4. Phase Effects
- Phase gates don't change probabilities
- Phases appear in interference patterns
- Measurement in computational basis ignores global phase

## Error Handling

The simulator handles various error conditions:

### Common Errors
- **Invalid qubit index**: Qubit number ≥ total qubits
- **Missing target_qubit**: CNOT without target specification
- **Unknown gate**: Gate name not in supported list

### Error Response Format
```json
{
  "success": false,
  "error_message": "Invalid qubit index 5 for 3-qubit circuit",
  "qubits": 3,
  "quantum_state": [],
  "probabilities": [],
  "measurement_counts": {},
  "circuit_depth": 0,
  "gate_count": 0
}
```

## Performance Considerations

- **Maximum qubits**: 10 (limitation due to exponential scaling)
- **State vector size**: 2^n complex numbers
- **Memory usage**: Grows exponentially with qubit count
- **Simulation time**: Increases with circuit depth and gate count

## Tips for Effective Use

1. **Start Small**: Begin with 2-3 qubits to understand basics
2. **Verify Normalization**: Probabilities should always sum to 1.0
3. **Use timeStep**: Organize gates in logical time steps
4. **Monitor Depth**: Deeper circuits may have more decoherence
5. **Check Entanglement**: Look for correlated measurement outcomes
6. **Validate Results**: Compare with theoretical expectations

This guide provides a comprehensive foundation for using the quantum circuit simulator effectively across different qubit ranges and gate combinations.
