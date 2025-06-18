import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const CircuitVisualizer = ({ 
  algorithm, 
  qubits = 3, 
  numQubits,
  steps = [], 
  isAnimating = false,
  isRunning = false,
  currentStep = 0,
  targetItem,
  currentIteration
}) => {
  // Use numQubits if provided, otherwise fall back to qubits
  const actualQubits = numQubits || qubits
  const actualIsAnimating = isAnimating || isRunning
  const canvasRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 1200, height: 300 }) // Increased width for complex circuits

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const parent = canvasRef.current.parentElement
        setDimensions({
          width: Math.max(parent.clientWidth, 1200), // Ensure minimum width for complex circuits
          height: Math.max(200, actualQubits * 80 + 40)
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [actualQubits])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    canvas.width = dimensions.width
    canvas.height = dimensions.height
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    drawCircuit(ctx, algorithm, actualQubits, steps, currentStep)
  }, [algorithm, actualQubits, steps, currentStep, dimensions])

  const drawCircuit = (ctx, algorithm, qubits, steps, currentStep) => {
    const margin = 80
    const qubitSpacing = Math.max(60, (dimensions.height - 2 * margin) / Math.max(1, qubits - 1))
    const wireLength = dimensions.width - 2 * margin
    const numSteps = 10 // Increased for better Grover gate spacing
    const stepWidth = wireLength / (numSteps + 1)

    // Set styles
    ctx.lineWidth = 2
    ctx.font = '16px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Draw qubit wires
    for (let i = 0; i < qubits; i++) {
      const y = margin + i * qubitSpacing
      
      // Wire line
      ctx.strokeStyle = '#4a5568'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(margin, y)
      ctx.lineTo(margin + wireLength, y)
      ctx.stroke()
      
      // Qubit label
      ctx.fillStyle = '#ffffff'
      ctx.font = '18px Arial'
      ctx.fillText(`|${i}⟩`, margin - 35, y)
      
      // Measurement at the end
      const measureX = margin + wireLength - 30
      ctx.fillStyle = '#fbbf24'
      ctx.fillRect(measureX - 15, y - 15, 30, 30)
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.strokeRect(measureX - 15, y - 15, 30, 30)
      ctx.fillStyle = '#000000'
      ctx.font = '12px Arial'
      ctx.fillText('M', measureX, y)
    }

    // Draw gates based on algorithm
    drawAlgorithmGates(ctx, algorithm, qubits, margin, qubitSpacing, stepWidth, currentStep, dimensions)
  }

const drawAlgorithmGates = (ctx, algorithm, qubits, margin, qubitSpacing, stepWidth, currentStep, dimensions) => {
  const gateWidth = 50
  const gateHeight = 35

  switch (algorithm) {
    case 'grover':
      drawGroverGates(ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep, dimensions)
      break
    case 'deutsch-jozsa':
      drawDeutschJozsaGates(ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep, dimensions)
      break
    case 'bernstein-vazirani':
      drawBernsteinVaziraniGates(ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep, dimensions)
      break
    case 'simon':
      drawSimonGates(ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep, dimensions)
      break
    case 'shor':
      drawShorGates(ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep, dimensions)
      break
  }
}

  const drawGate = (ctx, x, y, width, height, label, color, isActive = false) => {
    // Gate background
    ctx.fillStyle = isActive ? color : color + '80'
    ctx.fillRect(x - width/2, y - height/2, width, height)
    
    // Gate border
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.strokeRect(x - width/2, y - height/2, width, height)
    
    // Gate label
    ctx.fillStyle = '#ffffff'
    ctx.font = isActive ? 'bold 14px Arial' : '14px Arial'
    ctx.fillText(label, x, y)
  }

  const drawControlledGate = (ctx, controlY, targetY, targetX, gateWidth, gateHeight, isActive) => {
    // Control dot
    ctx.fillStyle = isActive ? '#ffffff' : '#ffffff60'
    ctx.beginPath()
    ctx.arc(targetX, controlY, 6, 0, 2 * Math.PI)
    ctx.fill()
    
    // Connection line
    ctx.strokeStyle = isActive ? '#ffffff' : '#ffffff60'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(targetX, controlY)
    ctx.lineTo(targetX, targetY)
    ctx.stroke()
    
    // Target gate (X gate)
    ctx.strokeStyle = isActive ? '#ffffff' : '#ffffff60'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(targetX, targetY, 12, 0, 2 * Math.PI)
    ctx.stroke()
    
    // X symbol
    ctx.strokeStyle = isActive ? '#ffffff' : '#ffffff60'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(targetX - 6, targetY - 6)
    ctx.lineTo(targetX + 6, targetY + 6)
    ctx.moveTo(targetX + 6, targetY - 6)
    ctx.lineTo(targetX - 6, targetY + 6)
    ctx.stroke()
  }

  const drawGroverGates = (ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep, dimensions) => {
    // Clear spacing for clean visualization
    const gateSpacing = 70 // Increased spacing between gate groups
    
    // Step 1: Initial Hadamard gates (superposition) - always visible
    const hadamardX = margin + stepWidth
    for (let i = 0; i < qubits; i++) {
      const y = margin + i * qubitSpacing
      drawGate(ctx, hadamardX, y, gateWidth, gateHeight, 'H', '#805ad5', currentStep >= 0)
    }

    // Step 2: Oracle implementation - always visible but highlighted when active
    const oracleStartX = margin + 2 * stepWidth
    const isOracleActive = currentStep >= 1
    
    // Oracle label
    ctx.fillStyle = isOracleActive ? '#e53e3e' : '#e53e3e80'
    ctx.font = isOracleActive ? 'bold 14px Arial' : '14px Arial'
    ctx.fillText('Oracle', oracleStartX + gateSpacing, margin - 30)
    
    // X gate before oracle (flip qubit 1 for target |101⟩)
    drawGate(ctx, oracleStartX, margin + 1 * qubitSpacing, gateWidth * 0.8, gateHeight * 0.8, 'X', '#e53e3e', isOracleActive)
    
    // Multi-controlled Z gate (oracle core)
    const oracleZX = oracleStartX + gateSpacing
    
    // Draw control dots for all qubits except last
    for (let i = 0; i < qubits - 1; i++) {
      ctx.fillStyle = isOracleActive ? '#ffffff' : '#ffffff60'
      ctx.beginPath()
      ctx.arc(oracleZX, margin + i * qubitSpacing, 6, 0, 2 * Math.PI)
      ctx.fill()
    }
    
    // Draw single connection line from first control to target
    ctx.strokeStyle = isOracleActive ? '#ffffff' : '#ffffff60'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(oracleZX, margin)
    ctx.lineTo(oracleZX, margin + (qubits - 1) * qubitSpacing)
    ctx.stroke()
    
    // Z gate on last qubit
    ctx.strokeStyle = isOracleActive ? '#ffffff' : '#ffffff60'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(oracleZX, margin + (qubits - 1) * qubitSpacing, 12, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.fillStyle = isOracleActive ? '#ffffff' : '#ffffff60'
    ctx.font = '12px Arial'
    ctx.fillText('Z', oracleZX, margin + (qubits - 1) * qubitSpacing)
    
    // X gate after oracle (restore qubit 1)
    drawGate(ctx, oracleStartX + 2 * gateSpacing, margin + 1 * qubitSpacing, gateWidth * 0.8, gateHeight * 0.8, 'X', '#e53e3e', isOracleActive)

    // Step 3: Diffusion operator (amplitude amplification) - always visible
    const diffuserStartX = margin + 4 * stepWidth
    const isDiffuserActive = currentStep >= 2
    
    // Diffuser label
    ctx.fillStyle = isDiffuserActive ? '#38a169' : '#38a16980'
    ctx.font = isDiffuserActive ? 'bold 14px Arial' : '14px Arial'
    ctx.fillText('Diffuser', diffuserStartX + 2 * gateSpacing, margin - 30)
    
    // H gates (start of diffuser)
    for (let i = 0; i < qubits; i++) {
      drawGate(ctx, diffuserStartX, margin + i * qubitSpacing, gateWidth * 0.8, gateHeight * 0.8, 'H', '#38a169', isDiffuserActive)
    }
    
    // X gates (prepare |0⟩ state for phase flip)
    for (let i = 0; i < qubits; i++) {
      drawGate(ctx, diffuserStartX + gateSpacing, margin + i * qubitSpacing, gateWidth * 0.8, gateHeight * 0.8, 'X', '#38a169', isDiffuserActive)
    }
    
    // Multi-controlled Z (phase flip about |0⟩)
    const diffuserZX = diffuserStartX + 2 * gateSpacing
    
    // Draw control dots for all qubits except last
    for (let i = 0; i < qubits - 1; i++) {
      ctx.fillStyle = isDiffuserActive ? '#ffffff' : '#ffffff60'
      ctx.beginPath()
      ctx.arc(diffuserZX, margin + i * qubitSpacing, 6, 0, 2 * Math.PI)
      ctx.fill()
    }
    
    // Draw single connection line from first control to target
    ctx.strokeStyle = isDiffuserActive ? '#ffffff' : '#ffffff60'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(diffuserZX, margin)
    ctx.lineTo(diffuserZX, margin + (qubits - 1) * qubitSpacing)
    ctx.stroke()
    
    // Z gate on last qubit
    ctx.strokeStyle = isDiffuserActive ? '#ffffff' : '#ffffff60'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(diffuserZX, margin + (qubits - 1) * qubitSpacing, 12, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.fillStyle = isDiffuserActive ? '#ffffff' : '#ffffff60'
    ctx.font = '12px Arial'
    ctx.fillText('Z', diffuserZX, margin + (qubits - 1) * qubitSpacing)
    
    // X gates (restore from |0⟩ preparation)
    for (let i = 0; i < qubits; i++) {
      drawGate(ctx, diffuserStartX + 3 * gateSpacing, margin + i * qubitSpacing, gateWidth * 0.8, gateHeight * 0.8, 'X', '#38a169', isDiffuserActive)
    }
    
    // H gates (end of diffuser)
    for (let i = 0; i < qubits; i++) {
      drawGate(ctx, diffuserStartX + 4 * gateSpacing, margin + i * qubitSpacing, gateWidth * 0.8, gateHeight * 0.8, 'H', '#38a169', isDiffuserActive)
    }

    // Iteration indicator - show when repeating
    const isIterationActive = currentStep >= 3
    if (isIterationActive) {
      ctx.strokeStyle = '#fbbf24'
      ctx.setLineDash([5, 5])
      ctx.lineWidth = 2
      const boxStart = oracleStartX - 20
      const boxEnd = diffuserStartX + 4 * gateSpacing + 20
      const boxTop = margin - 40
      const boxBottom = margin + (qubits - 1) * qubitSpacing + 40
      ctx.strokeRect(boxStart, boxTop, boxEnd - boxStart, boxBottom - boxTop)
      ctx.setLineDash([])
      
      // Iteration label
      ctx.fillStyle = '#fbbf24'
      ctx.font = '12px Arial'
      const iteration = Math.floor((currentStep - 1) / 3) + 1
      const totalIterations = Math.ceil(Math.sqrt(Math.pow(2, qubits)))
      ctx.fillText(`Iteration ${iteration} / ${totalIterations}`, (boxStart + boxEnd) / 2, boxTop - 10)
    }
    
    // Step indicators - positioned from bottom of canvas
    const stepIndicatorY = dimensions.height - 25 // Fixed position from bottom
    const stepIndicators = [
      { step: 1, text: 'Superposition', x: hadamardX, active: currentStep >= 0 },
      { step: 2, text: 'Oracle', x: oracleStartX + gateSpacing, active: currentStep >= 1 },
      { step: 3, text: 'Diffusion', x: diffuserStartX + 2 * gateSpacing, active: currentStep >= 2 },
      { step: 4, text: 'Repeat', x: (oracleStartX + diffuserStartX + 4 * gateSpacing) / 2, active: currentStep >= 3 }
    ]
    
    stepIndicators.forEach(({ step, text, x, active }) => {
      ctx.fillStyle = active ? '#ffffff' : '#ffffff60'
      ctx.font = active ? 'bold 10px Arial' : '10px Arial'
      ctx.fillText(`${step}. ${text}`, x, stepIndicatorY)
    })
  }

  const drawDeutschJozsaGates = (ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep, dimensions) => {
    const ancillaQubit = qubits - 1 // Last qubit is ancilla
    const gateSpacing = 60 // Spacing between oracle gates
    
    // Step 1: Initialize ancilla to |1⟩ - always visible
    drawGate(ctx, margin + stepWidth * 0.3, margin + ancillaQubit * qubitSpacing, gateWidth * 0.8, gateHeight * 0.8, 'X', '#e53e3e', currentStep >= 0)
    
    // Step 2: Apply Hadamard to all qubits - always visible
    for (let i = 0; i < qubits; i++) {
      const x = margin + stepWidth * 1.0
      const y = margin + i * qubitSpacing
      drawGate(ctx, x, y, gateWidth, gateHeight, 'H', '#805ad5', currentStep >= 1)
    }

    // Step 3: Oracle function - much more detailed implementation
    const oracleStartX = margin + stepWidth * 1.6
    const isOracleActive = currentStep >= 2
    
    // Oracle section with dashed boundaries
    ctx.strokeStyle = isOracleActive ? '#667eea' : '#667eea60'
    ctx.setLineDash([5, 5])
    ctx.lineWidth = 2
    const oracleBoxStart = oracleStartX - 30
    const oracleBoxEnd = oracleStartX + stepWidth * 1.8
    const oracleBoxTop = margin - 30
    const oracleBoxBottom = margin + (qubits - 1) * qubitSpacing + 30
    ctx.strokeRect(oracleBoxStart, oracleBoxTop, oracleBoxEnd - oracleBoxStart, oracleBoxBottom - oracleBoxTop)
    ctx.setLineDash([])
    
    // Oracle label
    ctx.fillStyle = isOracleActive ? '#667eea' : '#667eea80'
    ctx.font = isOracleActive ? 'bold 14px Arial' : '14px Arial'
    ctx.fillText('Oracle Uf', oracleStartX + stepWidth * 0.9, oracleBoxTop - 10)
    
    // Detailed oracle implementation - balanced function f(x) = x₀ ⊕ x₁ ⊕ x₂
    const oraclePositions = [
      oracleStartX + 20,
      oracleStartX + 80,
      oracleStartX + 140,
      oracleStartX + 200
    ]
    
    // For 4-qubit system (3 input + 1 ancilla)
    if (qubits >= 4) {
      // First part: X gate on qubit 1 (preparation for specific function)
      drawGate(ctx, oraclePositions[0], margin + 1 * qubitSpacing, gateWidth * 0.7, gateHeight * 0.7, 'X', '#38a169', isOracleActive)
      
      // Multi-controlled gates implementing f(x) = x₀ ⊕ x₁ ⊕ x₂
      // CCX gate (Toffoli) - qubit 0 and 1 control, qubit 2 target
      drawToffoliGate(ctx, margin, margin + qubitSpacing, margin + 2 * qubitSpacing, oraclePositions[1], isOracleActive)
      
      // CNOT from qubit 2 to ancilla
      drawControlledGate(ctx, margin + 2 * qubitSpacing, margin + ancillaQubit * qubitSpacing, oraclePositions[2], gateWidth, gateHeight, isOracleActive)
      
      // Restore qubit 2 (inverse of CCX)
      drawToffoliGate(ctx, margin, margin + qubitSpacing, margin + 2 * qubitSpacing, oraclePositions[3], isOracleActive)
      
      // Restore qubit 1
      drawGate(ctx, oraclePositions[3] + 40, margin + 1 * qubitSpacing, gateWidth * 0.7, gateHeight * 0.7, 'X', '#38a169', isOracleActive)
    } else if (qubits >= 3) {
      // Simpler 3-qubit implementation: f(x) = x₀ ⊕ x₁
      drawControlledGate(ctx, margin, margin + ancillaQubit * qubitSpacing, oraclePositions[0], gateWidth, gateHeight, isOracleActive)
      drawControlledGate(ctx, margin + qubitSpacing, margin + ancillaQubit * qubitSpacing, oraclePositions[1], gateWidth, gateHeight, isOracleActive)
    }
    
    // Function indicator
    ctx.fillStyle = isOracleActive ? '#059669' : '#05966960'
    ctx.font = isOracleActive ? 'bold 10px Arial' : '10px Arial'
    ctx.fillText('f(x) = x₀⊕x₁⊕x₂', oracleStartX + stepWidth * 0.9, oracleBoxBottom + 15)

    // Step 4: Final Hadamard gates (only on input qubits, not ancilla) - always visible
    const finalHadamardX = margin + stepWidth * 3.8
    const isFinalHadamardActive = currentStep >= 3
    for (let i = 0; i < qubits - 1; i++) {
      const y = margin + i * qubitSpacing
      drawGate(ctx, finalHadamardX, y, gateWidth, gateHeight, 'H', '#805ad5', isFinalHadamardActive)
    }
    
    // Add step indicators - positioned from bottom of canvas
    const stepIndicatorY = dimensions.height - 25 // Fixed position from bottom
    const stepIndicators = [
      { step: 1, text: 'Init', x: margin + stepWidth * 0.3, active: currentStep >= 0 },
      { step: 2, text: 'H-gates', x: margin + stepWidth * 1.0, active: currentStep >= 1 },
      { step: 3, text: 'Oracle', x: oracleStartX + stepWidth * 0.9, active: currentStep >= 2 },
      { step: 4, text: 'H-gates', x: finalHadamardX, active: currentStep >= 3 }
    ]
    
    stepIndicators.forEach(({ step, text, x, active }) => {
      ctx.fillStyle = active ? '#ffffff' : '#ffffff60'
      ctx.font = active ? 'bold 10px Arial' : '10px Arial'
      ctx.fillText(`${step}. ${text}`, x, stepIndicatorY)
    })
  }

  // Helper function to draw Toffoli gate (CCX)
  const drawToffoliGate = (ctx, control1Y, control2Y, targetY, x, isActive) => {
    const opacity = isActive ? '' : '60'
    
    // Control dots
    ctx.fillStyle = isActive ? '#ffffff' : '#ffffff60'
    ctx.beginPath()
    ctx.arc(x, control1Y, 6, 0, 2 * Math.PI)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(x, control2Y, 6, 0, 2 * Math.PI)
    ctx.fill()
    
    // Connection lines
    ctx.strokeStyle = isActive ? '#ffffff' : '#ffffff60'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x, Math.min(control1Y, control2Y, targetY))
    ctx.lineTo(x, Math.max(control1Y, control2Y, targetY))
    ctx.stroke()
    
    // Target gate (⊕ symbol)
    ctx.strokeStyle = isActive ? '#ffffff' : '#ffffff60'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(x, targetY, 12, 0, 2 * Math.PI)
    ctx.stroke()
    
    // Plus symbol inside circle
    ctx.beginPath()
    ctx.moveTo(x - 6, targetY)
    ctx.lineTo(x + 6, targetY)
    ctx.moveTo(x, targetY - 6)
    ctx.lineTo(x, targetY + 6)
    ctx.stroke()
  }

  const drawBernsteinVaziraniGates = (ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep, dimensions) => {
    // Initial |1⟩ preparation for ancilla - always visible
    if (qubits > 1) {
      drawGate(ctx, margin + stepWidth - 50, margin + (qubits - 1) * qubitSpacing, gateWidth, gateHeight, 'X', '#d69e2e', currentStep >= 0)
    }
    
    // Initial Hadamard gates (all qubits) - always visible
    for (let i = 0; i < qubits; i++) {
      const x = margin + stepWidth
      const y = margin + i * qubitSpacing
      drawGate(ctx, x, y, gateWidth, gateHeight, 'H', '#805ad5', currentStep >= 1)
    }

    // Hidden string oracle (dot product) - always visible
    const oracleX = margin + 2 * stepWidth
    const hiddenString = "101" // Example hidden string
    const isOracleActive = currentStep >= 2
    
    // For each bit in hidden string, if 1, add CNOT
    for (let i = 0; i < Math.min(hiddenString.length, qubits - 1); i++) {
      if (hiddenString[i] === '1') {
        drawControlledGate(ctx, margin + i * qubitSpacing, margin + (qubits - 1) * qubitSpacing, oracleX, gateWidth, gateHeight, isOracleActive)
      }
    }
    
    ctx.fillStyle = isOracleActive ? '#d69e2e' : '#d69e2e80'
    ctx.font = isOracleActive ? 'bold 14px Arial' : '14px Arial'
    ctx.fillText('s·x', oracleX, margin - 30)

    // Final Hadamard gates (only input qubits) - always visible
    const isFinalHadamardActive = currentStep >= 3
    for (let i = 0; i < qubits - 1; i++) {
      const x = margin + 3 * stepWidth
      const y = margin + i * qubitSpacing
      drawGate(ctx, x, y, gateWidth, gateHeight, 'H', '#805ad5', isFinalHadamardActive)
    }
  }

  const drawSimonGates = (ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep, dimensions) => {
    const halfQubits = Math.floor(qubits / 2)

    // Initial Hadamard gates on first register only - always visible
    for (let i = 0; i < halfQubits; i++) {
      const x = margin + stepWidth
      const y = margin + i * qubitSpacing
      drawGate(ctx, x, y, gateWidth, gateHeight, 'H', '#805ad5', currentStep >= 0)
    }

    // Simon oracle - always visible
    const oracleX = margin + 2 * stepWidth
    const isOracleActive = currentStep >= 1
    
    // Copy operation (identity part)
    for (let i = 0; i < halfQubits; i++) {
      drawControlledGate(ctx, margin + i * qubitSpacing, margin + (halfQubits + i) * qubitSpacing, oracleX - 20, gateWidth, gateHeight, isOracleActive)
    }
    
    // Period structure (simplified)
    const period = "11" // Example period
    for (let i = 0; i < Math.min(period.length, halfQubits); i++) {
      if (period[i] === '1') {
        for (let j = 0; j < halfQubits; j++) {
          if (j !== i) {
            drawControlledGate(ctx, margin + i * qubitSpacing, margin + (halfQubits + j) * qubitSpacing, oracleX + 20, gateWidth, gateHeight, isOracleActive)
          }
        }
      }
    }
    
    ctx.fillStyle = isOracleActive ? '#319795' : '#31979580'
    ctx.font = isOracleActive ? 'bold 14px Arial' : '14px Arial'
    ctx.fillText('Uf', oracleX, margin - 30)

    // Final Hadamard gates on first register only - always visible
    const isFinalHadamardActive = currentStep >= 2
    for (let i = 0; i < halfQubits; i++) {
      const x = margin + 3 * stepWidth
      const y = margin + i * qubitSpacing
      drawGate(ctx, x, y, gateWidth, gateHeight, 'H', '#805ad5', isFinalHadamardActive)
    }
    
    // Add step indicators - positioned from bottom of canvas
    const stepIndicatorY = dimensions.height - 25 // Fixed position from bottom
    const stepIndicators = [
      { step: 1, text: 'H-gates', x: margin + stepWidth, active: currentStep >= 0 },
      { step: 2, text: 'Oracle', x: oracleX, active: currentStep >= 1 },
      { step: 3, text: 'H-gates', x: margin + 3 * stepWidth, active: currentStep >= 2 }
    ]
    
    stepIndicators.forEach(({ step, text, x, active }) => {
      ctx.fillStyle = active ? '#ffffff' : '#ffffff60'
      ctx.font = active ? 'bold 10px Arial' : '10px Arial'
      ctx.fillText(`${step}. ${text}`, x, stepIndicatorY)
    })
  }

  const drawShorGates = (ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep, dimensions) => {
    // Hadamard gates on counting qubits - always visible
    for (let i = 0; i < qubits; i++) {
      const x = margin + stepWidth
      const y = margin + i * qubitSpacing
      drawGate(ctx, x, y, gateWidth, gateHeight, 'H', '#f59e42', currentStep >= 0)
    }

    // Oracle/Modular exponentiation - always visible
    const oracleX = margin + 2 * stepWidth
    const isOracleActive = currentStep >= 1
    ctx.fillStyle = isOracleActive ? '#f59e42' : '#f59e4280'
    ctx.font = isOracleActive ? 'bold 14px Arial' : '14px Arial'
    ctx.fillText('Uₐ mod N', oracleX, margin - 30)
    for (let i = 0; i < qubits; i++) {
      drawGate(ctx, oracleX, margin + i * qubitSpacing, gateWidth, gateHeight, 'U', '#f59e42', isOracleActive)
    }

    // Inverse QFT - always visible
    const qftX = margin + 3 * stepWidth
    const isQFTActive = currentStep >= 2
    ctx.fillStyle = isQFTActive ? '#6366f1' : '#6366f180'
    ctx.font = isQFTActive ? 'bold 14px Arial' : '14px Arial'
    ctx.fillText('QFT†', qftX, margin - 30)
    for (let i = 0; i < qubits; i++) {
      drawGate(ctx, qftX, margin + i * qubitSpacing, gateWidth, gateHeight, 'QFT†', '#6366f1', isQFTActive)
    }
    
    // Add step indicators - positioned from bottom of canvas
    const stepIndicatorY = dimensions.height - 25 // Fixed position from bottom
    const stepIndicators = [
      { step: 1, text: 'H-gates', x: margin + stepWidth, active: currentStep >= 0 },
      { step: 2, text: 'Oracle', x: oracleX, active: currentStep >= 1 },
      { step: 3, text: 'QFT†', x: qftX, active: currentStep >= 2 }
    ]
    
    stepIndicators.forEach(({ step, text, x, active }) => {
      ctx.fillStyle = active ? '#ffffff' : '#ffffff60'
      ctx.font = active ? 'bold 10px Arial' : '10px Arial'
      ctx.fillText(`${step}. ${text}`, x, stepIndicatorY)
    })
  }

  return (
    <motion.div 
      className="circuit-container circuit-background"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ maxWidth: '100%' }}
      />
      
      {actualIsAnimating && (
        <div className="absolute top-4 right-4 bg-quantum-600 text-white px-3 py-1 rounded-full text-sm">
          Step {currentStep + 1}
        </div>
      )}
    </motion.div>
  )
}

export default CircuitVisualizer
