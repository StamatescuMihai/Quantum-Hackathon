# Shor's Algorithm – Quantum Order-Finding

## Goal

Factor a composite number `N` efficiently using quantum period finding.

---

## Circuit Diagram (Example: N = 15)

```
             ┌───┐               ┌──────────────┐                     ┌───┐
|0⟩ ──H──────┤ • ├───────────────┤            • ├───────QFT†───────────┤M  ├─ (read a)
             └─┬─┘               │  Modular    │                     ┌─┴─┐
|0⟩ ──H────────┤×2│──────────────┤ exponentiation │───────QFT†────────┤M  ├─ (read a)
               ├──               │  by x mod N │                    ┌─┴─┐
|0⟩ ──H────────┤×4│──────────────┤   (Uf)      │───────QFT†──────────┤M  ├─ (read a)
               ├──               │              │                   ┌─┴─┐
|0⟩ ──H────────┤×8│──────────────┤            • ├───────QFT†────────┤M  ├─ (read a)
             ┌─┴─┐               └──────────────┘                     └─┬─┘
|1⟩ ─────────┤×1 │──────────────────────────────────────────────────────┤M  ├─ (read f(x))
             └───┘                                                     └───┘
```

### Legend:
- **H**: Hadamard gate
- **×2, ×4, ×8...**: Controlled modular multiplication by powers of x
- **Uf**: Modular exponentiation: |a⟩|1⟩ → |a⟩|x^a mod N⟩
- **QFT†**: Inverse Quantum Fourier Transform
- **M**: Measurement

---

## Algorithm Steps

### Quantum Phase:
1. **Initialize**: |0⟩ⁿ ⊗ |1⟩
2. **Apply Hadamard** on first register
3. **Apply Uf**: Modular exponentiation
4. **Measure second register** (collapse to periodic superposition)
5. **Apply inverse QFT** to first register
6. **Measure** first register (get integer c)
7. **Estimate r** using continued fractions from c / 2ᵗ

### Classical Phase:
8. If r is even and x^{r/2} ≠ -1 mod N:
   - Compute:  
     `p = gcd(x^{r/2} - 1, N)`  
     `q = gcd(x^{r/2} + 1, N)`  
   - Return (p, q) as non-trivial factors

---

## Example (N = 15)

- Choose `x = 2`
- Measure `c = 64`, t = 8
- Estimate `r = 4`
- Compute:  
  `gcd(2^2 - 1, 15) = gcd(3, 15) = 3`  
  `gcd(2^2 + 1, 15) = gcd(5, 15) = 5`

Factors: **3 and 5**

---

## Complexity

| Method        | Time Complexity    | Space            |
|---------------|--------------------|------------------|
| Classical     | Sub-exponential    | poly(log N)      |
| **Shor (quantum)** | **O((log N)³)** | ≈ 2·log N qubits |

---

## Quantum Speedup

- **Classical factoring** (e.g., GNFS):  
  \
  \( \exp\left( (64/9)^{1/3} \cdot (\log N)^{1/3} (\log\log N)^{2/3} \right) \)

- **Shor’s algorithm**:  
  \
  \( O((\log N)^3) \)

**Exponential speedup**

---

## Applications

- **Breaks RSA** and similar public-key cryptosystems
- Finds **orders** in groups
- Solves **discrete logarithms**
- Core to post-quantum cryptography urgency

---

## Challenges

- **Uf circuit**: Complex to implement reversibly
- **Error correction**: Required for large N
- **QFT**: Optimizable via semiclassical techniques
- **Qubit count**: Large for real RSA sizes (2048-bit)

---

## Experiments

- 2012: IBM – Factored 15 on superconducting qubits
- 2019: IonQ – Factored 21 with 5 qubits
- 2023: Factored 5893 on photonic hardware (compiled Shor)

---

## References

- Peter W. Shor, *“Algorithms for quantum computation: discrete logarithms and factoring”*, FOCS 1994  
- Nielsen & Chuang, *Quantum Computation and Quantum Information*  
- Gidney & Ekerå (2021), *How to factor 2048-bit RSA integers in 8 hours using 20 million noisy qubits*  
- Häner et al. (2022), *Improved resource estimates for quantum factorization*

---

## Summary

Shor’s algorithm finds the hidden **period** of a function using quantum interference and the **Quantum Fourier Transform**, allowing efficient **factorization** of large integers. It poses a real threat to classical cryptography and is a cornerstone of quantum computing's promise.
