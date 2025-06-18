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

  // Helper function to draw multi-controlled gate
  const drawMultiControlledGate = (ctx, controlPositions, targetY, x, label = '⊕', isActive) => {
    // Handle both array and single position formats
    const controls = Array.isArray(controlPositions) ? controlPositions : [controlPositions]
    
    // Draw control dots
    ctx.fillStyle = isActive ? '#ffffff' : '#ffffff60'
    controls.forEach(controlY => {
      ctx.beginPath()
      ctx.arc(x, controlY, 4, 0, 2 * Math.PI)
      ctx.fill()
    })
    
    // Connection lines
    ctx.strokeStyle = isActive ? '#ffffff' : '#ffffff60'
    ctx.lineWidth = 1.5
    const minY = Math.min(...controls, targetY)
    const maxY = Math.max(...controls, targetY)
    ctx.beginPath()
    ctx.moveTo(x, minY)
    ctx.lineTo(x, maxY)
    ctx.stroke()
    
    // Target gate
    ctx.strokeStyle = isActive ? '#ffffff' : '#ffffff60'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(x, targetY, 10, 0, 2 * Math.PI)
    ctx.stroke()
    
    // Gate symbol
    ctx.strokeStyle = isActive ? '#ffffff' : '#ffffff60'
    ctx.font = '10px Arial'
    ctx.fillStyle = isActive ? '#ffffff' : '#ffffff60'
    ctx.fillText(label, x, targetY)
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
    const ancillaQubit = qubits - 1 // Last qubit is ancilla
    
    // Step 1: Initialize ancilla to |1⟩ - always visible
    const initX = margin + stepWidth * 0.4
    drawGate(ctx, initX, margin + ancillaQubit * qubitSpacing, gateWidth * 0.8, gateHeight * 0.8, 'X', '#38a169', currentStep >= 0)
    
    // Step 2: Apply Hadamard to all qubits - always visible
    const hadamardX = margin + stepWidth * 1.2
    for (let i = 0; i < qubits; i++) {
      drawGate(ctx, hadamardX, margin + i * qubitSpacing, gateWidth, gateHeight, 'H', '#805ad5', currentStep >= 1)
    }

    // Step 3: Hidden String Oracle Implementation - always visible but highlighted when active
    const oracleStartX = margin + stepWidth * 2.2
    const isOracleActive = currentStep >= 2
    
    // Oracle section 1 - First dashed boundary
    ctx.strokeStyle = isOracleActive ? '#d69e2e' : '#d69e2e60'
    ctx.setLineDash([5, 5])
    ctx.lineWidth = 2
    const oracle1Start = oracleStartX - 15
    const oracle1End = oracleStartX + 120
    const oracleTop = margin - 35
    const oracleBottom = margin + ancillaQubit * qubitSpacing + 35
    ctx.strokeRect(oracle1Start, oracleTop, oracle1End - oracle1Start, oracleBottom - oracleTop)
    
    // Oracle section 2 - Second dashed boundary
    const oracle2Start = oracleStartX + 140
    const oracle2End = oracleStartX + 260
    ctx.strokeRect(oracle2Start, oracleTop, oracle2End - oracle2Start, oracleBottom - oracleTop)
    ctx.setLineDash([])
    
    // Oracle labels
    ctx.fillStyle = isOracleActive ? '#d69e2e' : '#d69e2e80'
    ctx.font = isOracleActive ? 'bold 11px Arial' : '11px Arial'
    ctx.fillText('Hidden String s₀', (oracle1Start + oracle1End) / 2, oracleTop - 8)
    ctx.fillText('Hidden String s₁', (oracle2Start + oracle2End) / 2, oracleTop - 8)
    
    // Hidden string implementation - example: s = "101"
    const hiddenString = "101"
    const phase1Positions = [
      oracleStartX + 10,
      oracleStartX + 50,
      oracleStartX + 90
    ]
    
    const phase2Positions = [
      oracleStartX + 155,
      oracleStartX + 195,
      oracleStartX + 235
    ]
    
    if (qubits >= 4) {
      // Phase 1: First part of hidden string pattern
      if (hiddenString[0] === '1') {
        drawControlledGate(ctx, margin + 0 * qubitSpacing, margin + ancillaQubit * qubitSpacing, phase1Positions[0], gateWidth, gateHeight, isOracleActive)
      }
      if (hiddenString[1] === '1') {
        drawControlledGate(ctx, margin + 1 * qubitSpacing, margin + ancillaQubit * qubitSpacing, phase1Positions[1], gateWidth, gateHeight, isOracleActive)
      }
      
      // Phase 2: Second part of hidden string pattern  
      if (hiddenString[2] === '1') {
        drawControlledGate(ctx, margin + 2 * qubitSpacing, margin + ancillaQubit * qubitSpacing, phase2Positions[0], gateWidth, gateHeight, isOracleActive)
      }
      
      // Additional complexity for academic presentation
      if (hiddenString[0] === '1' && hiddenString[1] === '1') {
        drawMultiControlledGate(ctx, [
          margin + 0 * qubitSpacing,
          margin + 1 * qubitSpacing
        ], margin + ancillaQubit * qubitSpacing, phase2Positions[1], isOracleActive)
      }
      
    } else if (qubits >= 3) {
      // Simpler 3-qubit version
      for (let i = 0; i < Math.min(hiddenString.length, qubits - 1); i++) {
        if (hiddenString[i] === '1') {
          const pos = i < 2 ? phase1Positions[i] : phase2Positions[0]
          drawControlledGate(ctx, margin + i * qubitSpacing, margin + ancillaQubit * qubitSpacing, pos, gateWidth, gateHeight, isOracleActive)
        }
      }
    }
    
    // Hidden string indicator
    ctx.fillStyle = isOracleActive ? '#059669' : '#05966950'
    ctx.font = isOracleActive ? 'bold 9px Arial' : '9px Arial'
    ctx.fillText(`s = "${hiddenString}" (dot product)`, (oracle1Start + oracle2End) / 2, oracleBottom + 15)

    // Step 4: Final Hadamard gates (only on input qubits) - always visible
    const finalHadamardX = margin + stepWidth * 4.2
    const isFinalHadamardActive = currentStep >= 3
    for (let i = 0; i < qubits - 1; i++) {
      drawGate(ctx, finalHadamardX, margin + i * qubitSpacing, gateWidth, gateHeight, 'H', '#805ad5', isFinalHadamardActive)
    }
    
    // Add step indicators - positioned from bottom of canvas
    const stepIndicatorY = dimensions.height - 25
    const stepIndicators = [
      { step: 1, text: 'Init', x: initX, active: currentStep >= 0 },
      { step: 2, text: 'H-gates', x: hadamardX, active: currentStep >= 1 },
      { step: 3, text: 'Oracle s·x', x: (oracle1Start + oracle2End) / 2, active: currentStep >= 2 },
      { step: 4, text: 'H-gates', x: finalHadamardX, active: currentStep >= 3 }
    ]
    
    stepIndicators.forEach(({ step, text, x, active }) => {
      ctx.fillStyle = active ? '#ffffff' : '#ffffff60'
      ctx.font = active ? 'bold 10px Arial' : '10px Arial'
      ctx.fillText(`${step}. ${text}`, x, stepIndicatorY)
    })
  }

  const drawSimonGates = (ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep, dimensions) => {
    const halfQubits = Math.floor(qubits / 2)

    // Step 1: Initial Hadamard gates on first register only - always visible
    const hadamardX = margin + stepWidth * 0.8
    for (let i = 0; i < halfQubits; i++) {
      drawGate(ctx, hadamardX, margin + i * qubitSpacing, gateWidth, gateHeight, 'H', '#805ad5', currentStep >= 0)
    }

    // Step 2: Simon's Oracle Implementation - always visible but highlighted when active
    const oracleStartX = margin + stepWidth * 2.0
    const isOracleActive = currentStep >= 1
    
    // Oracle section 1 - Identity/Copy operation
    ctx.strokeStyle = isOracleActive ? '#319795' : '#31979560'
    ctx.setLineDash([5, 5])
    ctx.lineWidth = 2
    const oracle1Start = oracleStartX - 15
    const oracle1End = oracleStartX + 120
    const oracleTop = margin - 35
    const oracleBottom = margin + (qubits - 1) * qubitSpacing + 35
    ctx.strokeRect(oracle1Start, oracleTop, oracle1End - oracle1Start, oracleBottom - oracleTop)
    
    // Oracle section 2 - Period structure implementation
    const oracle2Start = oracleStartX + 140
    const oracle2End = oracleStartX + 260
    ctx.strokeRect(oracle2Start, oracleTop, oracle2End - oracle2Start, oracleBottom - oracleTop)
    ctx.setLineDash([])
    
    // Oracle labels
    ctx.fillStyle = isOracleActive ? '#319795' : '#31979580'
    ctx.font = isOracleActive ? 'bold 11px Arial' : '11px Arial'
    ctx.fillText('Identity Copy', (oracle1Start + oracle1End) / 2, oracleTop - 8)
    ctx.fillText('Period Structure', (oracle2Start + oracle2End) / 2, oracleTop - 8)
    
    // Simon's period implementation - example: s = "11" (2-bit period)
    const period = "11"
    const phase1Positions = [
      oracleStartX + 10,
      oracleStartX + 50,
      oracleStartX + 90
    ]
    
    const phase2Positions = [
      oracleStartX + 155,
      oracleStartX + 195,
      oracleStartX + 235
    ]
    
    if (qubits >= 4) {
      // Phase 1: Identity operation (copy input to output)
      for (let i = 0; i < halfQubits; i++) {
        drawControlledGate(ctx, margin + i * qubitSpacing, margin + (halfQubits + i) * qubitSpacing, phase1Positions[i], gateWidth, gateHeight, isOracleActive)
      }
      
      // Phase 2: Period structure - f(x) = f(x ⊕ s) implementation
      for (let i = 0; i < Math.min(period.length, halfQubits); i++) {
        if (period[i] === '1') {
          // Create period correlations
          for (let j = 0; j < halfQubits; j++) {
            if (j !== i) {
              drawControlledGate(ctx, margin + i * qubitSpacing, margin + (halfQubits + j) * qubitSpacing, phase2Positions[j], gateWidth, gateHeight, isOracleActive)
            }
          }
        }
      }
      
      // Additional complexity: Multi-controlled gates for period enforcement
      if (period === "11") {
        drawMultiControlledGate(ctx, [
          margin + 0 * qubitSpacing,
          margin + 1 * qubitSpacing
        ], margin + (halfQubits + 1) * qubitSpacing, phase2Positions[2], isOracleActive)
      }
      
    } else if (qubits >= 2) {
      // Simpler version for fewer qubits
      drawControlledGate(ctx, margin, margin + qubitSpacing, phase1Positions[0], gateWidth, gateHeight, isOracleActive)
      if (qubits > 2) {
        drawControlledGate(ctx, margin, margin + 2 * qubitSpacing, phase2Positions[0], gateWidth, gateHeight, isOracleActive)
      }
    }
    
    // Period indicator
    ctx.fillStyle = isOracleActive ? '#059669' : '#05966950'
    ctx.font = isOracleActive ? 'bold 9px Arial' : '9px Arial'
    ctx.fillText(`Period s = "${period}" (f(x) = f(x⊕s))`, (oracle1Start + oracle2End) / 2, oracleBottom + 15)

    // Step 3: Final Hadamard gates on first register only - always visible
    const finalHadamardX = margin + stepWidth * 4.2
    const isFinalHadamardActive = currentStep >= 2
    for (let i = 0; i < halfQubits; i++) {
      drawGate(ctx, finalHadamardX, margin + i * qubitSpacing, gateWidth, gateHeight, 'H', '#805ad5', isFinalHadamardActive)
    }
    
    // Add step indicators - positioned from bottom of canvas
    const stepIndicatorY = dimensions.height - 25
    const stepIndicators = [
      { step: 1, text: 'H-gates', x: hadamardX, active: currentStep >= 0 },
      { step: 2, text: 'Oracle Uf', x: (oracle1Start + oracle2End) / 2, active: currentStep >= 1 },
      { step: 3, text: 'H-gates', x: finalHadamardX, active: currentStep >= 2 },
      { step: 4, text: 'Measure', x: finalHadamardX + 80, active: currentStep >= 3 }
    ]
    
    stepIndicators.forEach(({ step, text, x, active }) => {
      ctx.fillStyle = active ? '#ffffff' : '#ffffff60'
      ctx.font = active ? 'bold 10px Arial' : '10px Arial'
      ctx.fillText(`${step}. ${text}`, x, stepIndicatorY)
    })
  }

  const drawShorGates = (ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep, dimensions) => {
    const numCountingQubits = Math.floor(qubits * 0.7) // Most qubits for counting register
    const numTargetQubits = qubits - numCountingQubits // Remaining qubits for target register
    
    // Increased spacing to prevent overlap
    const gateSpacing = 80
    
    // Step 1: Initialize target register |1⟩ - always visible
    const initX = margin + stepWidth * 0.6
    const isInitActive = currentStep >= 0
    if (numTargetQubits > 0) {
      drawGate(ctx, initX, margin + numCountingQubits * qubitSpacing, gateWidth * 0.8, gateHeight * 0.8, 'X', '#e53e3e', isInitActive)
    }
    
    // Step 2: Hadamard gates on counting register - always visible
    const hadamardX = margin + stepWidth * 1.4
    const isHadamardActive = currentStep >= 1
    for (let i = 0; i < numCountingQubits; i++) {
      drawGate(ctx, hadamardX, margin + i * qubitSpacing, gateWidth, gateHeight, 'H', '#805ad5', isHadamardActive)
    }

    // Step 3: Enhanced Modular Exponentiation Oracle - always visible
    const oracleStartX = margin + stepWidth * 2.5
    const isOracleActive = currentStep >= 2
    
    // Oracle boundary with dashed lines (better spaced)
    ctx.strokeStyle = isOracleActive ? '#f59e42' : '#f59e4260'
    ctx.setLineDash([5, 5])
    ctx.lineWidth = 2
    const oracleStart = oracleStartX - 30
    const oracleEnd = oracleStartX + 180
    const oracleTop = margin - 40
    const oracleBottom = margin + (qubits - 1) * qubitSpacing + 40
    ctx.strokeRect(oracleStart, oracleTop, oracleEnd - oracleStart, oracleBottom - oracleTop)
    ctx.setLineDash([])
    
    // Oracle label (better positioned)
    ctx.fillStyle = isOracleActive ? '#f59e42' : '#f59e4280'
    ctx.font = isOracleActive ? 'bold 11px Arial' : '11px Arial'
    ctx.fillText('Modular Exponentiation', (oracleStart + oracleEnd) / 2, oracleTop - 10)
    
    // Implementation details (better positioned)
    ctx.fillStyle = isOracleActive ? '#f59e42' : '#f59e4280'
    ctx.font = isOracleActive ? 'bold 8px Arial' : '8px Arial'
    ctx.fillText('|x⟩|y⟩ → |x⟩|y·a^x mod N⟩', (oracleStart + oracleEnd) / 2, oracleBottom + 20)
    
    // Controlled modular multiplication gates (better spaced)
    for (let i = 0; i < Math.min(numCountingQubits, 2); i++) {
      const controlY = margin + i * qubitSpacing
      const power = Math.pow(2, i)
      
      // Draw controlled gates with better spacing
      if (numTargetQubits > 0) {
        const targetY = margin + (numCountingQubits) * qubitSpacing
        const gateX = oracleStartX + 40 + (i * 60)
        
        // Control line
        ctx.strokeStyle = isOracleActive ? '#f59e42' : '#f59e4260'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(gateX, controlY)
        ctx.lineTo(gateX, targetY)
        ctx.stroke()
        
        // Control dot
        ctx.fillStyle = isOracleActive ? '#f59e42' : '#f59e4260'
        ctx.beginPath()
        ctx.arc(gateX, controlY, 4, 0, 2 * Math.PI)
        ctx.fill()
        
        // Target gate
        drawGate(ctx, gateX, targetY, gateWidth * 0.8, gateHeight * 0.8, `a^${power}`, '#f59e42', isOracleActive)
      }
    }

    // Step 4: Enhanced Quantum Fourier Transform - always visible (better positioned)
    const qftX = margin + stepWidth * 4.8
    const isQFTActive = currentStep >= 3
    
    // QFT boundary (better spaced)
    ctx.strokeStyle = isQFTActive ? '#6366f1' : '#6366f180'
    ctx.setLineDash([5, 5])
    ctx.lineWidth = 2
    const qftStart = qftX - 30
    const qftEnd = qftX + 120
    const qftTop = margin - 35
    const qftHeight = numCountingQubits * qubitSpacing + 70
    ctx.strokeRect(qftStart, qftTop, qftEnd - qftStart, qftHeight)
    ctx.setLineDash([])
    
    // QFT label (better positioned)
    ctx.fillStyle = isQFTActive ? '#6366f1' : '#6366f180'
    ctx.font = isQFTActive ? 'bold 11px Arial' : '11px Arial'
    ctx.fillText('Inverse QFT†', (qftStart + qftEnd) / 2, qftTop - 10)
    
    // QFT gates implementation (simplified to prevent overlap)
    for (let i = 0; i < numCountingQubits; i++) {
      const y = margin + i * qubitSpacing
      
      // Hadamard gate for each qubit
      const hX = qftX + i * 25
      drawGate(ctx, hX, y, gateWidth * 0.7, gateHeight * 0.7, 'H', '#6366f1', isQFTActive)
      
      // Simplified rotation gates
      if (i < numCountingQubits - 1) {
        const controlY = margin + (i + 1) * qubitSpacing
        const rotationX = hX + 60
        
        // Control line
        ctx.strokeStyle = isQFTActive ? '#6366f1' : '#6366f180'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(rotationX, y)
        ctx.lineTo(rotationX, controlY)
        ctx.stroke()
        
        // Control dot
        ctx.fillStyle = isQFTActive ? '#6366f1' : '#6366f180'
        ctx.beginPath()
        ctx.arc(rotationX, controlY, 2, 0, 2 * Math.PI)
        ctx.fill()
        
        // Rotation gate
        drawGate(ctx, rotationX, y, gateWidth * 0.5, gateHeight * 0.5, 'R', '#6366f1', isQFTActive)
      }
    }
    
    // Step 5: Measurement - always visible (better positioned)
    const measureX = margin + stepWidth * 6.5
    const isMeasureActive = currentStep >= 4
    for (let i = 0; i < numCountingQubits; i++) {
      const y = margin + i * qubitSpacing
      drawGate(ctx, measureX, y, gateWidth * 0.9, gateHeight * 0.9, 'M', '#e53e3e', isMeasureActive)
    }
    
    // Step 6: Classical post-processing indicator - always visible (better positioned)
    const classicalX = measureX + 60
    const isClassicalActive = currentStep >= 5
    ctx.fillStyle = isClassicalActive ? '#059669' : '#05966960'
    ctx.font = isClassicalActive ? 'bold 9px Arial' : '9px Arial'
    ctx.fillText('Classical', classicalX, margin - 25)
    ctx.fillText('Factor', classicalX, margin - 10)
    
    // Add step indicators - positioned from bottom of canvas
    const stepIndicatorY = dimensions.height - 25
    const stepIndicators = [
      { step: 1, text: 'Init |1⟩', x: initX, active: currentStep >= 0 },
      { step: 2, text: 'H-gates', x: hadamardX, active: currentStep >= 1 },
      { step: 3, text: 'Modular Exp', x: (oracleStart + oracleEnd) / 2, active: currentStep >= 2 },
      { step: 4, text: 'QFT†', x: (qftStart + qftEnd) / 2, active: currentStep >= 3 },
      { step: 5, text: 'Measure', x: measureX, active: currentStep >= 4 },
      { step: 6, text: 'Factor', x: classicalX, active: currentStep >= 5 }
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
