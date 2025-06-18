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
    drawAlgorithmGates(ctx, algorithm, qubits, margin, qubitSpacing, stepWidth, currentStep)
  }

const drawAlgorithmGates = (ctx, algorithm, qubits, margin, qubitSpacing, stepWidth, currentStep) => {
  const gateWidth = 50
  const gateHeight = 35

  switch (algorithm) {
    case 'grover':
      drawGroverGates(ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep)
      break
    case 'deutsch-jozsa':
      drawDeutschJozsaGates(ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep)
      break
    case 'bernstein-vazirani':
      drawBernsteinVaziraniGates(ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep)
      break
    case 'simon':
      drawSimonGates(ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep)
      break
    case 'shor':
      drawShorGates(ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep)
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

  const drawGroverGates = (ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep) => {
    // Clear spacing for clean visualization
    const gateSpacing = 70 // Increased spacing between gate groups
    
    // Step 1: Initial Hadamard gates (superposition) 
    const hadamardX = margin + stepWidth
    for (let i = 0; i < qubits; i++) {
      const y = margin + i * qubitSpacing
      drawGate(ctx, hadamardX, y, gateWidth, gateHeight, 'H', '#805ad5', true)
    }

    // Step 2: Oracle implementation 
    const oracleStartX = margin + 2 * stepWidth
    
    // Oracle label
    ctx.fillStyle = currentStep >= 2 ? '#e53e3e' : '#e53e3e80'
    ctx.font = '14px Arial'
    ctx.fillText('Oracle', oracleStartX + gateSpacing, margin - 30)
    
    // X gate before oracle (flip qubit 1 for target |101⟩)
    drawGate(ctx, oracleStartX, margin + 1 * qubitSpacing, gateWidth * 0.8, gateHeight * 0.8, 'X', '#e53e3e', currentStep >= 2)
    
    // Multi-controlled Z gate (oracle core)
    const oracleZX = oracleStartX + gateSpacing
    
    // Draw control dots for all qubits except last
    for (let i = 0; i < qubits - 1; i++) {
      ctx.fillStyle = currentStep >= 2 ? '#ffffff' : '#ffffff60'
      ctx.beginPath()
      ctx.arc(oracleZX, margin + i * qubitSpacing, 6, 0, 2 * Math.PI)
      ctx.fill()
    }
    
    // Draw single connection line from first control to target
    ctx.strokeStyle = currentStep >= 2 ? '#ffffff' : '#ffffff60'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(oracleZX, margin)
    ctx.lineTo(oracleZX, margin + (qubits - 1) * qubitSpacing)
    ctx.stroke()
    
    // Z gate on last qubit
    ctx.beginPath()
    ctx.arc(oracleZX, margin + (qubits - 1) * qubitSpacing, 12, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.fillStyle = currentStep >= 2 ? '#ffffff' : '#ffffff60'
    ctx.font = '12px Arial'
    ctx.fillText('Z', oracleZX, margin + (qubits - 1) * qubitSpacing)
    
    // X gate after oracle (restore qubit 1)
    drawGate(ctx, oracleStartX + 2 * gateSpacing, margin + 1 * qubitSpacing, gateWidth * 0.8, gateHeight * 0.8, 'X', '#e53e3e', currentStep >= 2)

    // Step 3: Diffusion operator (amplitude amplification)
    const diffuserStartX = margin + 4 * stepWidth
    
    // Diffuser label
    ctx.fillStyle = currentStep >= 3 ? '#38a169' : '#38a16980'
    ctx.font = '14px Arial'
    ctx.fillText('Diffuser', diffuserStartX + 2 * gateSpacing, margin - 30)
    
    // H gates (start of diffuser)
    for (let i = 0; i < qubits; i++) {
      drawGate(ctx, diffuserStartX, margin + i * qubitSpacing, gateWidth * 0.8, gateHeight * 0.8, 'H', '#38a169', currentStep >= 3)
    }
    
    // X gates (prepare |0⟩ state for phase flip)
    for (let i = 0; i < qubits; i++) {
      drawGate(ctx, diffuserStartX + gateSpacing, margin + i * qubitSpacing, gateWidth * 0.8, gateHeight * 0.8, 'X', '#38a169', currentStep >= 3)
    }
    
    // Multi-controlled Z (phase flip about |0⟩)
    const diffuserZX = diffuserStartX + 2 * gateSpacing
    
    // Draw control dots for all qubits except last
    for (let i = 0; i < qubits - 1; i++) {
      ctx.fillStyle = currentStep >= 3 ? '#ffffff' : '#ffffff60'
      ctx.beginPath()
      ctx.arc(diffuserZX, margin + i * qubitSpacing, 6, 0, 2 * Math.PI)
      ctx.fill()
    }
    
    // Draw single connection line from first control to target
    ctx.strokeStyle = currentStep >= 3 ? '#ffffff' : '#ffffff60'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(diffuserZX, margin)
    ctx.lineTo(diffuserZX, margin + (qubits - 1) * qubitSpacing)
    ctx.stroke()
    
    // Z gate on last qubit
    ctx.beginPath()
    ctx.arc(diffuserZX, margin + (qubits - 1) * qubitSpacing, 12, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.fillStyle = currentStep >= 3 ? '#ffffff' : '#ffffff60'
    ctx.font = '12px Arial'
    ctx.fillText('Z', diffuserZX, margin + (qubits - 1) * qubitSpacing)
    
    // X gates (restore from |0⟩ preparation)
    for (let i = 0; i < qubits; i++) {
      drawGate(ctx, diffuserStartX + 3 * gateSpacing, margin + i * qubitSpacing, gateWidth * 0.8, gateHeight * 0.8, 'X', '#38a169', currentStep >= 3)
    }
    
    // H gates (end of diffuser)
    for (let i = 0; i < qubits; i++) {
      drawGate(ctx, diffuserStartX + 4 * gateSpacing, margin + i * qubitSpacing, gateWidth * 0.8, gateHeight * 0.8, 'H', '#38a169', currentStep >= 3)
    }

    // Iteration indicator - show when repeating
    if (currentStep >= 4) {
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
  }

  const drawDeutschJozsaGates = (ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep) => {
    // Initial |1⟩ preparation for ancilla
    if (qubits > 1) {
      drawGate(ctx, margin + stepWidth - 50, margin + (qubits - 1) * qubitSpacing, gateWidth, gateHeight, 'X', '#667eea', true)
    }
    
    // Initial Hadamard gates (all qubits)
    for (let i = 0; i < qubits; i++) {
      const x = margin + stepWidth
      const y = margin + i * qubitSpacing
      drawGate(ctx, x, y, gateWidth, gateHeight, 'H', '#805ad5', true)
    }

    // Oracle function
    if (currentStep >= 2) {
      const oracleX = margin + 2 * stepWidth
      
      // Draw specific oracle implementation (balanced function example)
      for (let i = 0; i < qubits - 1; i++) {
        drawControlledGate(ctx, margin + i * qubitSpacing, margin + (qubits - 1) * qubitSpacing, oracleX, gateWidth, gateHeight, true)
      }
      
      ctx.fillStyle = '#667eea'
      ctx.font = '14px Arial'
      ctx.fillText('f(x)', oracleX, margin - 30)
    }

    // Final Hadamard gates (only input qubits)
    if (currentStep >= 3) {
      for (let i = 0; i < qubits - 1; i++) {
        const x = margin + 3 * stepWidth
        const y = margin + i * qubitSpacing
        drawGate(ctx, x, y, gateWidth, gateHeight, 'H', '#805ad5', true)
      }
    }
  }

  const drawBernsteinVaziraniGates = (ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep) => {
    // Initial |1⟩ preparation for ancilla
    if (qubits > 1) {
      drawGate(ctx, margin + stepWidth - 50, margin + (qubits - 1) * qubitSpacing, gateWidth, gateHeight, 'X', '#d69e2e', true)
    }
    
    // Initial Hadamard gates (all qubits)
    for (let i = 0; i < qubits; i++) {
      const x = margin + stepWidth
      const y = margin + i * qubitSpacing
      drawGate(ctx, x, y, gateWidth, gateHeight, 'H', '#805ad5', true)
    }

    // Hidden string oracle (dot product)
    if (currentStep >= 2) {
      const oracleX = margin + 2 * stepWidth
      const hiddenString = "101" // Example hidden string
      
      // For each bit in hidden string, if 1, add CNOT
      for (let i = 0; i < Math.min(hiddenString.length, qubits - 1); i++) {
        if (hiddenString[i] === '1') {
          drawControlledGate(ctx, margin + i * qubitSpacing, margin + (qubits - 1) * qubitSpacing, oracleX, gateWidth, gateHeight, true)
        }
      }
      
      ctx.fillStyle = '#d69e2e'
      ctx.font = '14px Arial'
      ctx.fillText('s·x', oracleX, margin - 30)
    }

    // Final Hadamard gates (only input qubits)
    if (currentStep >= 3) {
      for (let i = 0; i < qubits - 1; i++) {
        const x = margin + 3 * stepWidth
        const y = margin + i * qubitSpacing
        drawGate(ctx, x, y, gateWidth, gateHeight, 'H', '#805ad5', true)
      }
    }
  }

  const drawSimonGates = (ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep) => {
    const halfQubits = Math.floor(qubits / 2)

    // Initial Hadamard gates on first register only
    for (let i = 0; i < halfQubits; i++) {
      const x = margin + stepWidth
      const y = margin + i * qubitSpacing
      drawGate(ctx, x, y, gateWidth, gateHeight, 'H', '#805ad5', true)
    }

    // Simon oracle
    if (currentStep >= 2) {
      const oracleX = margin + 2 * stepWidth
      
      // Copy operation (identity part)
      for (let i = 0; i < halfQubits; i++) {
        drawControlledGate(ctx, margin + i * qubitSpacing, margin + (halfQubits + i) * qubitSpacing, oracleX - 20, gateWidth, gateHeight, true)
      }
      
      // Period structure (simplified)
      const period = "11" // Example period
      for (let i = 0; i < Math.min(period.length, halfQubits); i++) {
        if (period[i] === '1') {
          for (let j = 0; j < halfQubits; j++) {
            if (j !== i) {
              drawControlledGate(ctx, margin + i * qubitSpacing, margin + (halfQubits + j) * qubitSpacing, oracleX + 20, gateWidth, gateHeight, true)
            }
          }
        }
      }
      
      ctx.fillStyle = '#319795'
      ctx.font = '14px Arial'
      ctx.fillText('Uf', oracleX, margin - 30)
    }

    // Final Hadamard gates on first register only
    if (currentStep >= 3) {
      for (let i = 0; i < halfQubits; i++) {
        const x = margin + 3 * stepWidth
        const y = margin + i * qubitSpacing
        drawGate(ctx, x, y, gateWidth, gateHeight, 'H', '#805ad5', true)
      }
    }
  }

  const drawShorGates = (ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep) => {
  // Hadamard gates on counting qubits (primele qubits)
  for (let i = 0; i < qubits; i++) {
    const x = margin + stepWidth
    const y = margin + i * qubitSpacing
    drawGate(ctx, x, y, gateWidth, gateHeight, 'H', '#f59e42', true)
  }

  // Oracle/Modular exponentiation (simbolic)
  if (currentStep >= 2) {
    const oracleX = margin + 2 * stepWidth
    ctx.fillStyle = '#f59e42'
    ctx.font = '14px Arial'
    ctx.fillText('Uₐ mod N', oracleX, margin - 30)
    for (let i = 0; i < qubits; i++) {
      drawGate(ctx, oracleX, margin + i * qubitSpacing, gateWidth, gateHeight, 'U', '#f59e42', true)
    }
  }

  // Inverse QFT (simbolic)
  if (currentStep >= 3) {
    const qftX = margin + 3 * stepWidth
    ctx.fillStyle = '#6366f1'
    ctx.font = '14px Arial'
    ctx.fillText('QFT†', qftX, margin - 30)
    for (let i = 0; i < qubits; i++) {
      drawGate(ctx, qftX, margin + i * qubitSpacing, gateWidth, gateHeight, 'QFT†', '#6366f1', true)
    }
  }
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
