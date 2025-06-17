# Grover's Algorithm - Quantum Circuit Diagram

## General Circuit (3 qubits, search in 8 elements)

```
|0⟩ ──H──────●─────H──X──●──X──H──M──
             │          │
|0⟩ ──H──────●─────H──X──●──X──H──M──
             │          │  
|1⟩ ──X──H───⊕─────────────────────────
```

### Legend:
- H: Hadamard Gate
- X: Pauli-X Gate (NOT)
- ●: Control qubit for CNOT
- ⊕: Target qubit for CNOT
- M: Measurement

## Algorithm Steps:

### 1. Initialization
```
|000⟩ → H⊗H⊗H → |+++⟩ = (1/√8) Σ|x⟩
```

### 2. Oracle (example for target=5=|101⟩)
```
Oracle flips phase for |101⟩:
|101⟩ → -|101⟩
All other states remain unchanged
```

### 3. Diffuser (Inversion about average)
```
- Apply H to first 2 qubits
- Apply X to first 2 qubits  
- Apply CZ controlled by first 2 qubits
- Apply X to first 2 qubits
- Apply H to first 2 qubits
```

### 4. Measurement
```
After √8 ≈ 3 iterations, probability of measuring |101⟩ → ~1
```

## Geometric Representation

```
        |ψ⟩ after diffuser
           ↗
         /   
        /    
       /     |target⟩
      /      ↗
     /      /
    /      /
   /      /
  /      /
 /      /
|s⟩ ←─/─── |ψ⟩ after oracle
```

Where:
- |s⟩ = uniform superposition
- Each iteration rotates state vector towards |target⟩
- Rotation angle: θ = 2·arcsin(1/√N)

## Complexity

- **Classical**: O(N) - linear search
- **Grover**: O(√N) - quadratic speedup
- **Optimal**: Proven that √N is optimal for unstructured search

## Practical Applications

1. **Unstructured database search**
2. **Satisfiability problems (SAT)**
3. **Combinatorial optimization**
4. **Hash function inversion**
5. **Machine learning (amplitude amplification)**
