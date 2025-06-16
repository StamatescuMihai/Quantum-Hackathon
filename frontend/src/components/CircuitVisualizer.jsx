import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const CircuitVisualizer = ({ 
  algorithm, 
  qubits = 3, 
  steps = [], 
  isAnimating = false,
  currentStep = 0 
}) => {
  const canvasRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 300 })

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const parent = canvasRef.current.parentElement
        setDimensions({
          width: parent.clientWidth,
          height: Math.max(200, qubits * 80 + 40)
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [qubits])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    canvas.width = dimensions.width
    canvas.height = dimensions.height
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    drawCircuit(ctx, algorithm, qubits, steps, currentStep)
  }, [algorithm, qubits, steps, currentStep, dimensions])

  const drawCircuit = (ctx, algorithm, qubits, steps, currentStep) => {
    const margin = 60
    const qubitSpacing = (dimensions.height - 2 * margin) / Math.max(1, qubits - 1)
    const wireLength = dimensions.width - 2 * margin
    const stepWidth = wireLength / Math.max(1, steps.length + 1)

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
      ctx.beginPath()
      ctx.moveTo(margin, y)
      ctx.lineTo(margin + wireLength, y)
      ctx.stroke()
      
      // Qubit label
      ctx.fillStyle = '#ffffff'
      ctx.fillText(`|${i}⟩`, margin - 25, y)
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

  const drawGroverGates = (ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep) => {
    // Initial Hadamard gates
    for (let i = 0; i < qubits - 1; i++) {
      const x = margin + stepWidth
      const y = margin + i * qubitSpacing
      drawGate(ctx, x, y, gateWidth, gateHeight, 'H', '#805ad5', currentStep >= 1)
    }

    // Oracle gate
    const oracleX = margin + 2 * stepWidth
    const oracleY = margin + (qubits - 1) * qubitSpacing / 2
    drawGate(ctx, oracleX, oracleY, gateWidth + 20, gateHeight + 10, 'Oracle', '#e53e3e', currentStep >= 2)

    // Diffusion operator
    const diffX = margin + 3 * stepWidth
    drawGate(ctx, diffX, oracleY, gateWidth + 20, gateHeight + 10, 'Diff', '#38a169', currentStep >= 3)
  }

  const drawDeutschJozsaGates = (ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep) => {
    // Initial Hadamard gates
    for (let i = 0; i < qubits; i++) {
      const x = margin + stepWidth
      const y = margin + i * qubitSpacing
      drawGate(ctx, x, y, gateWidth, gateHeight, 'H', '#805ad5', currentStep >= 1)
    }

    // Oracle function
    const oracleX = margin + 2 * stepWidth
    const oracleY = margin + (qubits - 1) * qubitSpacing / 2
    drawGate(ctx, oracleX, oracleY, gateWidth + 20, gateHeight + 10, 'f(x)', '#667eea', currentStep >= 2)

    // Final Hadamard gates
    for (let i = 0; i < qubits - 1; i++) {
      const x = margin + 3 * stepWidth
      const y = margin + i * qubitSpacing
      drawGate(ctx, x, y, gateWidth, gateHeight, 'H', '#805ad5', currentStep >= 3)
    }
  }

  const drawBernsteinVaziraniGates = (ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep) => {
    // Initial Hadamard gates
    for (let i = 0; i < qubits; i++) {
      const x = margin + stepWidth
      const y = margin + i * qubitSpacing
      drawGate(ctx, x, y, gateWidth, gateHeight, 'H', '#805ad5', currentStep >= 1)
    }

    // Hidden string oracle
    const oracleX = margin + 2 * stepWidth
    const oracleY = margin + (qubits - 1) * qubitSpacing / 2
    drawGate(ctx, oracleX, oracleY, gateWidth + 20, gateHeight + 10, 's·x', '#d69e2e', currentStep >= 2)

    // Final Hadamard gates
    for (let i = 0; i < qubits - 1; i++) {
      const x = margin + 3 * stepWidth
      const y = margin + i * qubitSpacing
      drawGate(ctx, x, y, gateWidth, gateHeight, 'H', '#805ad5', currentStep >= 3)
    }
  }

  const drawSimonGates = (ctx, qubits, margin, qubitSpacing, stepWidth, gateWidth, gateHeight, currentStep) => {
    const halfQubits = Math.floor(qubits / 2)

    // Initial Hadamard gates on first register
    for (let i = 0; i < halfQubits; i++) {
      const x = margin + stepWidth
      const y = margin + i * qubitSpacing
      drawGate(ctx, x, y, gateWidth, gateHeight, 'H', '#805ad5', currentStep >= 1)
    }

    // Simon oracle
    const oracleX = margin + 2 * stepWidth
    const oracleY = margin + (qubits - 1) * qubitSpacing / 2
    drawGate(ctx, oracleX, oracleY, gateWidth + 20, gateHeight + 20, 'Uf', '#319795', currentStep >= 2)

    // Final Hadamard gates on first register
    for (let i = 0; i < halfQubits; i++) {
      const x = margin + 3 * stepWidth
      const y = margin + i * qubitSpacing
      drawGate(ctx, x, y, gateWidth, gateHeight, 'H', '#805ad5', currentStep >= 3)
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
      
      {isAnimating && (
        <div className="absolute top-4 right-4 bg-quantum-600 text-white px-3 py-1 rounded-full text-sm">
          Step {currentStep + 1}
        </div>
      )}
    </motion.div>
  )
}

export default CircuitVisualizer
