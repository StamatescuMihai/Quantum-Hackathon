# Diagramă Algoritmul Grover - Circuit Cuantic

## Circuit General (3 qubiti, căutare în 8 elemente)

```
|0⟩ ──H──────●─────H──X──●──X──H──M──
             │          │
|0⟩ ──H──────●─────H──X──●──X──H──M──
             │          │  
|1⟩ ──X──H───⊕─────────────────────────
```

### Legenda:
- H: Poarta Hadamard
- X: Poarta Pauli-X (NOT)
- ●: Control qubit pentru CNOT
- ⊕: Target qubit pentru CNOT
- M: Măsurătoare

## Pași Algoritm:

### 1. Inițializare
```
|000⟩ → H⊗H⊗H → |+++⟩ = (1/√8) Σ|x⟩
```

### 2. Oracol (exemplu pentru target=5=|101⟩)
```
Oracolul inversează faza pentru |101⟩:
|101⟩ → -|101⟩
Toate celelalte stări rămân neschimbate
```

### 3. Difuzor (Inversarea despre medie)
```
- Aplică H pe primii 2 qubiti
- Aplică X pe primii 2 qubiti  
- Aplică CZ controlat de primii 2 qubiti
- Aplică X pe primii 2 qubiti
- Aplică H pe primii 2 qubiti
```

### 4. Măsurătoare
```
După √8 ≈ 3 iterații, probabilitatea de a măsura |101⟩ → ~1
```

## Reprezentare Geometrică

```
        |ψ⟩ după difuzor
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
|s⟩ ←─/─── |ψ⟩ după oracol
```

Unde:
- |s⟩ = superpozițiafăună uniformă
- Fiecare iterație rotește vectorul de stare către |target⟩
- Unghiul de rotație: θ = 2·arcsin(1/√N)

## Complexitate

- **Clasic**: O(N) - căutare liniară
- **Grover**: O(√N) - speedup cuadrratic
- **Optimal**: Demonstrat că √N este optim pentru căutarea necondițională

## Aplicații Practice

1. **Căutare în baze de date nesortate**
2. **Probleme de satisfiabilitate (SAT)**
3. **Optimizare combinatorică**
4. **Inversarea funcțiilor hash**
5. **Machine learning (amplificarea amplitudilor)**
