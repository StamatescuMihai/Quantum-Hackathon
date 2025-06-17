# Simon's Algorithm - Quantum Circuit Diagram

## General Circuit (n=2 input qubits + n=2 output qubits)

```
Input Register:     Output Register:
|0⟩ ──H───────●─────H──M──     |0⟩ ──────●──────────
             │                         │
|0⟩ ──H───────●─────H──M──     |0⟩ ──────●──────────
             │                         │
             │                         │
       Simon Oracle Uf                 │
       f(x) = f(x⊕s)                  │
```

### Legend:
- H: Hadamard Gate
- ●: Oracle function connections
- M: Measurement on input register only
- s: Hidden period (secret string)

## Algorithm Overview

Simon's algorithm finds a hidden period `s` of a black-box function `f` where `f(x) = f(x⊕s)` for all x. It provides an **exponential speedup** over classical methods, requiring only O(n) quantum queries versus O(2ⁿ) classical queries.

## Problem Statement

Given a function `f: {0,1}ⁿ → {0,1}ⁿ` that is either:
1. **One-to-one** (injective)
2. **Two-to-one** with period s ≠ 0, meaning f(x) = f(x⊕s)

Goal: Determine which case and find the period s if it exists.

## Oracle Function Examples

### Case 1: Hidden Period s = "11" (n=2)
```
Input x    x⊕s     f(x)    Note
|00⟩  →   |11⟩  →  |01⟩    f(00) = f(11)
|01⟩  →   |10⟩  →  |10⟩    f(01) = f(10)  
|10⟩  →   |01⟩  →  |10⟩    f(10) = f(01)
|11⟩  →   |00⟩  →  |01⟩    f(11) = f(00)
```

### Case 2: Hidden Period s = "10" (n=2)
```
Input x    x⊕s     f(x)    Note
|00⟩  →   |10⟩  →  |11⟩    f(00) = f(10)
|01⟩  →   |11⟩  →  |00⟩    f(01) = f(11)
|10⟩  →   |00⟩  →  |11⟩    f(10) = f(00)
|11⟩  →   |01⟩  →  |00⟩    f(11) = f(01)
```

## Circuit Implementation for s = "11"

```
|0⟩ ──H─────●───●─────H──M──     |0⟩ ─────●───●─────
            │   │                       │   │
|0⟩ ──H─────●───●─────H──M──     |0⟩ ─────●───●─────
            │   │                       │   │
            │   │                       │   │
       Oracle Uf creates                │   │
       f(x) = f(x⊕"11")                │   │
```

## Step-by-Step Analysis

### Step 1: Initial State
```
|00⟩ ⊗ |00⟩  (input register ⊗ output register)
```

### Step 2: Hadamard on Input Register
```
H⊗H ⊗ I⊗I |00⟩ ⊗ |00⟩ = (1/2) Σ |x⟩ ⊗ |00⟩
                          x∈{00,01,10,11}
```

### Step 3: Oracle Application
The oracle creates entanglement between input and output:
```
(1/2) Σ |x⟩ ⊗ |f(x)⟩
      x
```

For period s, this becomes:
```
(1/2) [|x₁⟩ ⊗ |f(x₁)⟩ + |x₁⊕s⟩ ⊗ |f(x₁)⟩ + |x₂⟩ ⊗ |f(x₂)⟩ + |x₂⊕s⟩ ⊗ |f(x₂)⟩]
```

### Step 4: Final Hadamard on Input Register
Applying H⊗H to input register:
```
(1/4) Σ   Σ  (-1)^(y·x) |y⟩ ⊗ |f(x)⟩
      x   y
```

### Step 5: Measurement Constraint
After measurement, we obtain strings y such that:
```
y·s = 0 (mod 2)
```

This gives us linear equations to solve for s.

## Linear System Solution

### For n=2, s = "11":
Possible measurement outcomes y that satisfy y·s = 0:
```
y = "00": 0·1 + 0·1 = 0 ✓
y = "11": 1·1 + 1·1 = 0 ✓  
y = "01": 0·1 + 1·1 = 1 ✗
y = "10": 1·1 + 0·1 = 1 ✗
```

### Measurement Results:
- We get y ∈ {"00", "11"} with equal probability
- From these, we can deduce s = "11"

### General Case (n qubits):
Need n-1 linearly independent equations:
```
y₁ · s = 0
y₂ · s = 0
...
yₙ₋₁ · s = 0
```

Solve this system to find s.

## Mathematical Analysis

### State Evolution:
```
|ψ₀⟩ = |0ⁿ⟩ ⊗ |0ⁿ⟩

|ψ₁⟩ = (1/√2ⁿ) Σ |x⟩ ⊗ |0ⁿ⟩
                  x

|ψ₂⟩ = (1/√2ⁿ) Σ |x⟩ ⊗ |f(x)⟩
                  x

|ψ₃⟩ = (1/2ⁿ) Σ  Σ (-1)^(y·x) |y⟩ ⊗ |f(x)⟩
              x  y
```

### Probability Amplitude:
For measuring |y⟩ in input register:
```
A(y) = (1/2ⁿ) Σ (-1)^(y·x)
              x: f(x)=f_val

= (1/2ⁿ) [(-1)^(y·x₁) + (-1)^(y·x₂)]  where x₂ = x₁ ⊕ s

= (1/2ⁿ) (-1)^(y·x₁) [1 + (-1)^(y·s)]
```

Non-zero only when y·s = 0 (mod 2).

## Quantum Advantage

### Complexity Comparison:
- **Classical**: O(2ⁿ) queries needed (exponential)
- **Simon's Quantum**: O(n) queries (polynomial)
- **Speedup**: Exponential advantage

### Query Efficiency:
```
Classical: Must try ~√(2ⁿ) inputs to find collision (birthday paradox)
Quantum:   O(n) measurements give linear system to solve
```

## Algorithm Steps

### Quantum Part:
1. Initialize input register in superposition
2. Apply oracle to create entanglement
3. Apply Hadamard to input register
4. Measure input register
5. Repeat O(n) times to get enough equations

### Classical Part:
6. Solve linear system y₁·s = y₂·s = ... = yₙ₋₁·s = 0
7. Extract period s

## Circuit Scaling

### For n=1 (trivial case):
```
|0⟩ ──H─────●─────H──M──     |0⟩ ─────●──────
            │                       │
```

### For n=3:
```
|0⟩ ──H─────●─────H──M──     |0⟩ ─────●──────
            │                       │
|0⟩ ──H─────●─────H──M──     |0⟩ ─────●──────
            │                       │  
|0⟩ ──H─────●─────H──M──     |0⟩ ─────●──────
            │                       │
      3-qubit Oracle               3-qubit
```

## Implementation Challenges

### Oracle Construction:
- Must implement f(x) = f(x⊕s) efficiently
- Requires careful circuit design
- Often the most complex part

### Classical Post-Processing:
- Gaussian elimination over GF(2)
- Handle linear dependence in measurements
- May need more than n-1 measurements

### Error Handling:
- Measurement errors affect linear system
- Need error correction for large n
- Verify solution by checking period property

## Applications

### Cryptography:
1. **Breaking RSA**: Foundation for Shor's algorithm
2. **Discrete logarithm**: Period finding in groups
3. **Lattice problems**: Hidden subgroup problems

### Mathematics:
1. **Group theory**: Hidden subgroup problem
2. **Number theory**: Period detection
3. **Linear algebra**: System solving over finite fields

### Computer Science:
1. **Complexity theory**: Quantum vs classical separation
2. **Algorithm design**: Template for quantum speedups
3. **Optimization**: Structured search problems

## Experimental Considerations

### Success Probability:
```
P(useful measurement) = 1/2  (for each run)
Expected measurements needed: 2(n-1)
```

### Noise Effects:
- Gate errors accumulate over circuit depth
- Measurement errors corrupt linear system
- Decoherence reduces interference quality

### Hardware Requirements:
- 2n physical qubits minimum
- High-fidelity two-qubit gates
- Long coherence times for deep circuits

## Historical Significance

Simon's algorithm was historically important because:
1. **First exponential speedup**: Before Shor's algorithm
2. **Inspired Shor**: Period finding technique
3. **Quantum supremacy**: Demonstrated fundamental advantage
4. **Complexity theory**: Separated BQP from BPP

This algorithm bridges the gap between simple quantum algorithms (like Deutsch-Jozsa) and practical quantum algorithms (like Shor's), making it essential for understanding quantum computational advantage.
