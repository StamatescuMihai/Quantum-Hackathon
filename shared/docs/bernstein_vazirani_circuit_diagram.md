# Bernstein-Vazirani Algorithm - Quantum Circuit Diagram

## General Circuit (n=3 input qubits + 1 auxiliary qubit)

```
|0⟩ ──H─────●─────H──M──
            │
|0⟩ ──H─────●─────H──M──
            │
|0⟩ ──H─────●─────H──M──
            │
|1⟩ ──H─────⊕─────────────
```

### Legend:
- H: Hadamard Gate
- ●: Control qubit for CNOT (only active if corresponding secret bit is 1)
- ⊕: Target qubit (auxiliary qubit)
- M: Measurement

## Algorithm Overview

The Bernstein-Vazirani algorithm finds a hidden binary string `s` by querying a black-box function `f(x) = s·x` (dot product mod 2) only **once**, providing an exponential speedup over classical methods.

## Oracle Function Examples

### Hidden String s = "101"
```
Input x     f(x) = s·x (mod 2)     Calculation
|000⟩  →    0                      1·0 + 0·0 + 1·0 = 0
|001⟩  →    1                      1·0 + 0·0 + 1·1 = 1  
|010⟩  →    0                      1·0 + 0·1 + 1·0 = 0
|011⟩  →    1                      1·0 + 0·1 + 1·1 = 1
|100⟩  →    1                      1·1 + 0·0 + 1·0 = 1
|101⟩  →    0                      1·1 + 0·0 + 1·1 = 0
|110⟩  →    1                      1·1 + 0·1 + 1·0 = 1
|111⟩  →    0                      1·1 + 0·1 + 1·1 = 0
```

### Circuit Implementation for s = "101"
```
|0⟩ ──H─────●─────H──M──  (s₀ = 1 → CNOT active)
            │
|0⟩ ──H─────│─────H──M──  (s₁ = 0 → no CNOT)
            │
|0⟩ ──H─────●─────H──M──  (s₂ = 1 → CNOT active)
            │
|1⟩ ──H─────⊕─────────────
```

## Step-by-Step Analysis

### Step 1: Initial State
```
|0⟩⊗n ⊗ |1⟩ = |000⟩ ⊗ |1⟩
```

### Step 2: Hadamard Superposition
```
H⊗(n+1) |000⟩ ⊗ |1⟩ = (1/√2ⁿ) Σ|x⟩ ⊗ (|0⟩ - |1⟩)
                        x∈{0,1}ⁿ
```

### Step 3: Oracle Application
For each basis state |x⟩, the oracle applies:
```
|x⟩ ⊗ (|0⟩ - |1⟩) → (-1)^f(x) |x⟩ ⊗ (|0⟩ - |1⟩)
```

Result after oracle:
```
(1/√2ⁿ) Σ (-1)^(s·x) |x⟩ ⊗ (|0⟩ - |1⟩)
         x
```

### Step 4: Final Hadamard Transform
The Hadamard transform on the input qubits yields:
```
(1/2ⁿ) Σ   Σ   (-1)^(s·x + y·x) |y⟩ ⊗ (|0⟩ - |1⟩)
       x   y

= Σ (1/2ⁿ) Σ (-1)^((s⊕y)·x) |y⟩ ⊗ (|0⟩ - |1⟩)
  y         x
```

### Step 5: Measurement Result
The amplitude for state |y⟩ is non-zero only when `s ⊕ y = 0`, i.e., when `y = s`.

**Result**: Measuring the input register gives the hidden string `s` with probability 1.

## Mathematical Analysis

### Amplitude Calculation
For measurement outcome |y⟩:
```
Amplitude = (1/2ⁿ) Σ (-1)^((s⊕y)·x)
                   x

= { 1    if s ⊕ y = 0 (i.e., y = s)
  { 0    otherwise
```

### Phase Kickback Mechanism
The auxiliary qubit in state `(|0⟩ - |1⟩)` enables phase kickback:
- When `f(x) = 0`: No phase change
- When `f(x) = 1`: Phase flip (-1 factor)

## Quantum Advantage

### Complexity Comparison:
- **Classical**: O(n) queries needed to determine n-bit string
- **Quantum**: O(1) - exactly 1 query
- **Speedup**: Linear advantage, but demonstrates quantum parallelism

### Information Extraction:
```
Classical: Must query function 2ⁿ times to determine pattern
Quantum:   Single query + interference extracts global information
```

## Circuit Variations

### For Different String Lengths:

#### n=2 qubits (s = "10"):
```
|0⟩ ──H─────●─────H──M──
            │
|0⟩ ──H─────│─────H──M──
            │
|1⟩ ──H─────⊕─────────────
```

#### n=4 qubits (s = "1011"):
```
|0⟩ ──H─────●─────H──M──
            │
|0⟩ ──H─────│─────H──M──
            │
|0⟩ ──H─────●─────H──M──
            │
|0⟩ ──H─────●─────H──M──
            │
|1⟩ ──H─────⊕─────────────
```

## Physical Implementation Considerations

### Gate Requirements:
- **Hadamard gates**: 2n + 1 (initialization + final)
- **CNOT gates**: weight(s) (number of 1s in secret string)
- **X gate**: 1 (auxiliary qubit initialization)

### Error Sources:
- **Gate errors**: Accumulate with circuit depth
- **Decoherence**: Affects superposition quality
- **Measurement errors**: Can flip result bits

### Hardware Platforms:
1. **IBM Quantum**: Native CNOT implementations
2. **Google Quantum AI**: High-fidelity gates
3. **IonQ**: All-to-all connectivity advantage
4. **Rigetti**: Parametric gate control

## Applications and Extensions

### Direct Applications:
1. **Cryptanalysis**: Breaking certain encryption schemes
2. **Function analysis**: Determining linear function properties
3. **Quantum protocols**: Building block for complex algorithms

### Algorithm Extensions:
1. **Noisy Bernstein-Vazirani**: Error-corrected versions
2. **Approximate versions**: Handling imperfect oracles
3. **Multi-party protocols**: Distributed secret recovery

### Related Algorithms:
- **Deutsch-Jozsa**: Special case (constant vs balanced)
- **Simon's Algorithm**: Period finding generalization
- **Quantum Fourier Transform**: Mathematical foundation

## Experimental Results

### Success Probability:
```
P(correct) = 1 (ideal case)
P(correct) ≈ 1 - ε (with noise, where ε is error rate)
```

### Typical Performance:
- **Simulator**: 100% success rate
- **NISQ devices**: 85-95% success rate
- **Error scaling**: Degrades with n and circuit depth

## Educational Value

The Bernstein-Vazirani algorithm demonstrates:
1. **Quantum parallelism**: Computing on all inputs simultaneously
2. **Phase kickback**: Using auxiliary qubits for computation
3. **Interference**: Extracting global information through interference
4. **Measurement**: Converting quantum information to classical bits

This makes it an excellent introduction to quantum algorithm design principles before tackling more complex algorithms like Shor's or Grover's.
