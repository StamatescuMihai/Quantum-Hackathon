# Deutsch-Jozsa Algorithm - Quantum Circuit Diagram

## General Circuit (n=2 input qubits + 1 auxiliary qubit)

```
|0⟩ ──H─────●─────H──M──
            │
|0⟩ ──H─────●─────H──M──
            │
|1⟩ ──H─────⊕─────────────
```

## Oracle Variants

### Constant Function f(x) = 0
```
|0⟩ ──H─────────H──M──  (measurement → |00⟩)
|0⟩ ──H─────────H──M──  
|1⟩ ──H─────────────── (unchanged)
```

### Constant Function f(x) = 1  
```
|0⟩ ──H─────────H──M──  (measurement → |00⟩)
|0⟩ ──H─────────H──M──  
|1⟩ ──H──X──────────── (X applied to auxiliary)
```

### Balanced Function f(x) = x₁
```
|0⟩ ──H─────●─────H──M──  (measurement → |10⟩ or |01⟩)
|0⟩ ──H─────│─────H──M──  
|1⟩ ──H─────⊕─────────── (CNOT with control on first qubit)
```

### Balanced Function f(x) = x₁ ⊕ x₂
```
|0⟩ ──H─────●─────H──M──  (measurement → non-zero states)
|0⟩ ──H─────●─────H──M──  
|1⟩ ──H─────⊕─────────── (CNOT with control on both qubits)
```

## Step-by-Step Analysis

### Step 1: Initial State
```
|001⟩
```

### Step 2: Hadamard Application
```
H⊗H⊗H|001⟩ = (1/2√2) Σ|x⟩ ⊗ (|0⟩-|1⟩)
             x∈{00,01,10,11}
```

### Step 3: Oracle Application
For constant function (f(x)=0):
```
State remains: (1/2√2) Σ|x⟩ ⊗ (|0⟩-|1⟩)
                        x
```

For balanced function (f(x)=x₁):
```
Phase kickback: (1/2√2) [|00⟩ + |01⟩ - |10⟩ - |11⟩] ⊗ (|0⟩-|1⟩)
```

### Step 4: Final Hadamard
For constant → measurement |00⟩
For balanced → measurement ≠ |00⟩

## Interpretation Rule

```
┌─────────────────┬─────────────────┐
│   Measurement   │ Function Type   │
├─────────────────┼─────────────────┤
│      |00⟩       │   CONSTANT      │
│   Otherwise     │   BALANCED      │
└─────────────────┴─────────────────┘
```

## Vector Representation

```
Constant Function:           Balanced Function:
     |00⟩                        |01⟩, |10⟩, |11⟩
      ↑                            ↗    ↑    ↖
      │                           /     │     \
      │                          /      │      \
     All                       /        │       \
 amplitudes                 /          │        \
 interfere                 /           │         \
constructively           /             │          \
 towards |00⟩           /              │           \
                       ↙               │            ↘
                   Amplitudes      |00⟩          Final
                   cancel out     (probability    state
                   for |00⟩         = 0)       distributed
```

## Quantum Advantage

### Function Evaluation Complexity:
- **Classical**: 2 evaluations (worst case)
- **Quantum**: 1 evaluation
- **For n qubits**: 2ⁿ vs 1 evaluations

### Deutsch-Jozsa Extension (n qubits):
```
|0⟩⊗n ──H⊗n────ORACLE────H⊗n──M⊗n──
|1⟩   ──H──────────│─────────────────
```

Exponential advantage: O(2ⁿ) → O(1)

## Physical Implementations

### Quantum Platforms:
1. **IBM Quantum**: Superconducting processors
2. **Google Sycamore**: Superconducting qubits
3. **IonQ**: Ion trap systems
4. **Rigetti**: Superconducting circuits
5. **PennyLane**: Hybrid simulation

### Hardware Challenges:
- **Coherence**: Maintaining quantum state
- **Gate Fidelity**: Operation errors
- **Calibration**: Operation synchronization
- **Noise**: External interference

## Applications and Extensions

1. **Function property testing**
2. **Quantum decision algorithms**
3. **Quantum communication protocols**
4. **Foundation for complex algorithms**
5. **Quantum supremacy demonstrations**
