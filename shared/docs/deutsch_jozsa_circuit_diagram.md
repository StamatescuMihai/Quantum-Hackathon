# Diagramă Algoritmul Deutsch-Jozsa - Circuit Cuantic

## Circuit General (n=2 qubiti input + 1 qubit auxiliar)

```
|0⟩ ──H─────●─────H──M──
            │
|0⟩ ──H─────●─────H──M──
            │
|1⟩ ──H─────⊕─────────────
```

## Variante de Oracole

### Funcție Constantă f(x) = 0
```
|0⟩ ──H─────────H──M──  (măsurare → |00⟩)
|0⟩ ──H─────────H──M──  
|1⟩ ──H─────────────── (nu se modifică)
```

### Funcție Constantă f(x) = 1  
```
|0⟩ ──H─────────H──M──  (măsurare → |00⟩)
|0⟩ ──H─────────H──M──  
|1⟩ ──H──X──────────── (X aplicat pe auxiliar)
```

### Funcție Balansată f(x) = x₁
```
|0⟩ ──H─────●─────H──M──  (măsurare → |10⟩ sau |01⟩)
|0⟩ ──H─────│─────H──M──  
|1⟩ ──H─────⊕─────────── (CNOT cu control pe primul qubit)
```

### Funcție Balansată f(x) = x₁ ⊕ x₂
```
|0⟩ ──H─────●─────H──M──  (măsurare → stări non-zero)
|0⟩ ──H─────●─────H──M──  
|1⟩ ──H─────⊕─────────── (CNOT cu control pe ambii qubiti)
```

## Analiza Paso cu Paso

### Pasul 1: Starea Inițială
```
|001⟩
```

### Pasul 2: Aplicarea Hadamard
```
H⊗H⊗H|001⟩ = (1/2√2) Σ|x⟩ ⊗ (|0⟩-|1⟩)
             x∈{00,01,10,11}
```

### Pasul 3: Aplicarea Oracolului
Pentru funcție constantă (f(x)=0):
```
Starea rămâne: (1/2√2) Σ|x⟩ ⊗ (|0⟩-|1⟩)
                        x
```

Pentru funcție balansată (f(x)=x₁):
```
Phase kickback: (1/2√2) [|00⟩ + |01⟩ - |10⟩ - |11⟩] ⊗ (|0⟩-|1⟩)
```

### Pasul 4: Hadamard Final
Pentru constantă → măsurare |00⟩
Pentru balansată → măsurare ≠ |00⟩

## Regula de Interpretare

```
┌─────────────────┬─────────────────┐
│   Măsurătoare   │ Tipul Funcției  │
├─────────────────┼─────────────────┤
│      |00⟩       │   CONSTANTĂ     │
│   Altceva       │   BALANSATĂ     │
└─────────────────┴─────────────────┘
```

## Reprezentare Vectorială

```
Funcție Constantă:           Funcție Balansată:
     |00⟩                        |01⟩, |10⟩, |11⟩
      ↑                            ↗    ↑    ↖
      │                           /     │     \
      │                          /      │      \
   Toate                       /        │       \
 amplitudile                 /          │        \
 interferează               /           │         \
constructiv              /             │          \
 spre |00⟩              /              │           \
                       ↙               │            ↘
                   Amplitudile      |00⟩          Starea
                   se anulează     (probabilitate  finală
                   pentru |00⟩         = 0)       distribuită
```

## Avantajul Cuantic

### Complexitate Evaluări Funcție:
- **Clasic**: 2 evaluări (cel mai rău caz)
- **Cuantic**: 1 evaluare
- **Pentru n qubiti**: 2ⁿ vs 1 evaluări

### Extensia Deutsch-Jozsa (n qubiti):
```
|0⟩⊗n ──H⊗n────ORACLE────H⊗n──M⊗n──
|1⟩   ──H──────────│─────────────────
```

Avantaj exponențial: O(2ⁿ) → O(1)

## Implementări Fizice

### Platforme Cuantice:
1. **IBM Quantum**: Procesoare superconductoare
2. **Google Sycamore**: Qubiti superconductori
3. **IonQ**: Capcane de ioni
4. **Rigetti**: Circuite superconductoare
5. **PennyLane**: Simulare hibridă

### Provocări Hardware:
- **Coherența**: Menținerea stării cuantice
- **Fidelitatea porților**: Erorile în operații
- **Calibrarea**: Sincronizarea operațiilor
- **Zgomotul**: Interferențe externe

## Aplicații și Extensii

1. **Testarea proprietăților funcțiilor**
2. **Algoritmi de decizie cuantici**
3. **Protocoale de comunicație cuantică**
4. **Baza pentru algoritmi mai complecși**
5. **Demonstrații de supremația cuantică**
