import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Cpu, Zap, RotateCcw, Play, Settings, Trash2, AlertCircle } from 'lucide-react'
import { runCustomCircuit, getAvailableGates, getSimulatorInfo } from '../services/api'

const Simulator = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
    loadBackendData()
  }, [])

  const loadBackendData = async () => {
    try {
      const [gatesData, infoData] = await Promise.all([
        getAvailableGates(),
        getSimulatorInfo()
      ])
      
      const allGates = [
        ...(gatesData.single_qubit_gates || []),
        ...(gatesData.two_qubit_gates || [])
      ]
      setAvailableGates(allGates)
      setSimulatorInfo(infoData)
      setError('')
    } catch (err) {
      console.error('Failed to load backend data:', err)
      setError('Failed to connect to quantum simulator backend')
    }
  }

  const [qubits, setQubits] = useState(3)
  const [isRunning, setIsRunning] = useState(false)
  const [circuitGates, setCircuitGates] = useState([])
  const [draggedGate, setDraggedGate] = useState(null)
  const [simulationResult, setSimulationResult] = useState(null)
  const [error, setError] = useState('')
  const [availableGates, setAvailableGates] = useState([])
  const [simulatorInfo, setSimulatorInfo] = useState(null)
  const [gateParameters, setGateParameters] = useState({}) // Store parameters for each gate type
  // Handle qubit count changes and clean up invalid gates
  const handleQubitChange = (newQubitCount) => {
    const oldQubitCount = qubits
    setQubits(newQubitCount)
    
    // Remove gates that are on qubits that no longer exist
    const validGates = circuitGates.filter(gate => {
      // Check if the gate's qubit is still valid
      const isQubitValid = gate.qubit < newQubitCount
      
      // For two-qubit gates like CNOT, also check target qubit
      let isTargetValid = true
      if (gate.target_qubit !== undefined && gate.target_qubit !== null) {
        isTargetValid = gate.target_qubit < newQubitCount
      }
      
      return isQubitValid && isTargetValid
    })
    
    // Update circuit gates if any were removed
    if (validGates.length !== circuitGates.length) {
      const removedCount = circuitGates.length - validGates.length
      setCircuitGates(validGates)
      // Clear simulation results since circuit changed
      setSimulationResult(null)    }
  }

  const quantumGates = availableGates.length > 0 ? availableGates : [
    { name: 'H', description: 'Hadamard Gate', symbol: 'H' },
    { name: 'X', description: 'Pauli-X (NOT)', symbol: 'X' },
    { name: 'Y', description: 'Pauli-Y', symbol: 'Y' },
    { name: 'Z', description: 'Pauli-Z', symbol: 'Z' },
    { name: 'CNOT', description: 'Controlled-NOT', symbol: '⊕' },
    { name: 'T', description: 'T Gate', symbol: 'T' },
    { name: 'S', description: 'S Gate', symbol: 'S' },
    { name: 'RZ', description: 'Z-Rotation', symbol: 'RZ' },
  ]
    const runSimulation = async () => {
    setIsRunning(true)
    setError('')
    
    try {
      if (!simulatorInfo) {
        throw new Error('Backend not connected. Please ensure the quantum simulator backend is running.')
      }
      
      // Format gates for custom circuit
      const formattedGates = circuitGates.map(gate => {
        const baseGate = {
          name: gate.name,
          qubit: gate.qubit,
          timeStep: gate.timeStep,
          description: gate.description,
          symbol: gate.symbol
        }
        
        // Handle two-qubit gates like CNOT
        if (gate.name === 'CNOT') {
          // For CNOT, we need to specify a target qubit
          // Use nullish coalescing to handle target_qubit = 0 correctly
          baseGate.target_qubit = gate.target_qubit !== undefined && gate.target_qubit !== null 
            ? gate.target_qubit 
            : ((gate.qubit + 1) % qubits)
          console.log(`CNOT gate: control=${gate.qubit}, target=${baseGate.target_qubit}`)
        }
        
        // Handle parameterized gates
        if (gate.parameter !== undefined) {
          baseGate.parameter = gate.parameter
        }
        
        console.log(`Formatted gate:`, baseGate)
        return baseGate
      })
      
      console.log('Sending custom circuit to backend:', formattedGates)
      console.log('Formatted gates JSON:', JSON.stringify(formattedGates, null, 2))
      const result = await runCustomCircuit(qubits, formattedGates, 1024)
      
      console.log('Backend response:', result)
      
      if (!result.success) {
        throw new Error(result.error_message || 'Simulation failed')
      }
      
      setSimulationResult(result)
      setError('')
    } catch (err) {
      console.error('Simulation failed:', err)
      setError(`Simulation failed: ${err.response?.data?.detail || err.message}`)
      setSimulationResult(null)
    } finally {
      setIsRunning(false)
    }
  }
  const resetSimulation = () => {
    setIsRunning(false)
    setSimulationResult(null)
    setError('')
  }

  // Drag and Drop handlers
  const handleDragStart = (e, gate) => {
    setDraggedGate(gate)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }
  const handleDrop = (e, qubitIndex, timeStep) => {
    e.preventDefault()

    if (draggedGate) {
      const newGate = {
        ...draggedGate,
        qubit: qubitIndex,
        timeStep: timeStep,
        id: Date.now() + Math.random() // Unique ID for each gate
      }
      
      // Add parameter for parameterized gates
      if (draggedGate.parameterized && ['RX', 'RY', 'RZ'].includes(draggedGate.name)) {
        newGate.parameter = getGateParameter(draggedGate.name)
      }
      
      // For CNOT gates, automatically assign a valid target qubit
      if (draggedGate.name === 'CNOT') {
        // Check if we have enough qubits for CNOT
        if (qubits < 2) {
          console.error('ERROR: CNOT gate requires at least 2 qubits')
          alert('CNOT gate requires at least 2 qubits')
          return
        }
        
        // Find a valid target qubit (different from control qubit)
        let targetQubit = (qubitIndex + 1) % qubits
        // Make sure the target is different from control
        if (targetQubit === qubitIndex) {
          // If on last qubit, target the first qubit (0)
          targetQubit = 0
        }
        
        // Actually assign the target qubit to the gate
        newGate.target_qubit = targetQubit
      }
        setCircuitGates(prev => [...prev, newGate])
      setDraggedGate(null)
    }
  }
  
  const removeGate = (gateId) => {
    setCircuitGates(prev => prev.filter(gate => gate.id !== gateId))
  }
    const clearCircuit = () => {
    setCircuitGates([])
    setSimulationResult(null)
    setError('')  }

  // Change CNOT target qubit
  const changeCNOTTarget = (gateId) => {
    setCircuitGates(prev => prev.map(gate => {
      if (gate.id === gateId && gate.name === 'CNOT') {
        // Find next valid target qubit
        let newTarget = (gate.target_qubit + 1) % qubits
        // Skip the control qubit
        if (newTarget === gate.qubit) {
          newTarget = (newTarget + 1) % qubits
        }
        
        console.log(`Changing CNOT target: control=${gate.qubit}, old target=${gate.target_qubit}, new target=${newTarget}`)
        
        return {
          ...gate,
          target_qubit: newTarget
        }
      }
      return gate
    }))
    
    // Clear simulation results since circuit changed
    setSimulationResult(null)
  }

  // Handle parameter changes for gates
  const handleParameterChange = (gateName, parameter) => {
    setGateParameters(prev => ({
      ...prev,
      [gateName]: parameter
    }))
  }
  // Get parameter for a gate type
  const getGateParameter = (gateName) => {
    return gateParameters[gateName] || Math.PI / 2 // Default to π/2 for rotation gates
  }

  // Check if a parameter value is currently selected for a gate
  const isParameterSelected = (gateName, value) => {
    const currentValue = getGateParameter(gateName)
    return Math.abs(currentValue - value) < 0.001 // Small tolerance for floating point comparison
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-gradient-to-br from-quantum-400 to-quantum-600 rounded-2xl">
                <Calculator className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Quantum Circuit Simulator
            </h1>            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Experiment with quantum algorithms and build custom circuits. 
              Visualize quantum states and observe quantum mechanical phenomena in real-time.
            </p>
            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}
          </motion.div>
        {/* Simulator Features */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 mb-12"
        >
          <div className="quantum-card">
            <h2 className="text-2xl font-bold text-white mb-6">Simulator Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Real-time Visualization</h3>
                <p className="text-white/70 text-sm">
                  Watch quantum states evolve in real-time as gates are applied
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Precise Calculations</h3>
                <p className="text-white/70 text-sm">
                  Accurate quantum state simulation with complex amplitude tracking
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Cpu className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Educational Tools</h3>
                <p className="text-white/70 text-sm">
                  Step-by-step execution with detailed explanations
                </p>
              </div>
            </div>
          </div>
        </motion.section>        {/* Simulator Controls */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >          <div className="quantum-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Custom Circuit Builder</h2>
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-white/60" />
                <span className="text-white/60">Configure</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Circuit Parameters */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Circuit Parameters</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Number of Qubits: {qubits}
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="6"
                      value={qubits}
                      onChange={(e) => handleQubitChange(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-white/60 mt-1">
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                      <span>6</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="quantum-card bg-white/5">
                      <div className="flex items-center mb-2">
                        <Cpu className="w-4 h-4 text-quantum-400 mr-2" />
                        <span className="text-white text-sm">States</span>
                      </div>
                      <div className="text-xl font-mono text-quantum-300">
                        {Math.pow(2, qubits)}
                      </div>
                    </div>

                    <div className="quantum-card bg-white/5">
                      <div className="flex items-center mb-2">
                        <Zap className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-white text-sm">Gates</span>
                      </div>
                      <div className="text-xl font-mono text-green-300">
                        {circuitGates.length}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={runSimulation}
                      disabled={isRunning}
                      className="quantum-button flex-1 disabled:opacity-50"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isRunning ? 'Running...' : 'Run Simulation'}
                    </button>
                    <button
                      onClick={resetSimulation}
                      className="quantum-button-secondary"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Simulation Status */}
                  {(isRunning || simulationResult || error) && (
                    <div className="mt-4 p-4 rounded-lg border border-white/20">
                      {isRunning && (
                        <div className="flex items-center space-x-2 text-blue-400">
                          <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                          <span>Running quantum simulation...</span>
                        </div>
                      )}
                      
                      {!isRunning && simulationResult && (
                        <div className="text-green-400">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Simulation completed successfully</span>
                          </div>
                          <div className="text-sm text-white/70">
                            Custom circuit • {qubits} qubits • {simulationResult.gate_count || 0} gates
                          </div>
                        </div>
                      )}
                      
                      {!isRunning && error && (
                        <div className="text-red-400 text-sm">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>Simulation failed</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Circuit Instructions */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">How to Use</h3>
                <div className="space-y-4">
                  <div className="quantum-card bg-white/5 p-4">
                    <h4 className="text-white font-medium mb-2">Step 1: Build Your Circuit</h4>
                    <p className="text-white/70 text-sm">
                      Drag quantum gates from the library below and drop them onto the circuit grid. 
                      Each column represents a time step, each row is a qubit.
                    </p>
                  </div>
                    <div className="quantum-card bg-white/5 p-4">
                    <h4 className="text-white font-medium mb-2">Step 2: Configure Gates</h4>
                    <p className="text-white/70 text-sm">
                      For rotation gates (RX, RY, RZ), select the angle parameter before dragging. 
                      For CNOT gates, click the control qubit (●) to cycle through target qubits.
                    </p>
                  </div>
                  
                  <div className="quantum-card bg-white/5 p-4">
                    <h4 className="text-white font-medium mb-2">Step 3: Run Simulation</h4>
                    <p className="text-white/70 text-sm">
                      Click "Run Simulation" to execute your circuit and view the quantum state 
                      evolution and measurement probabilities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>        {/* Circuit Visualization */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="quantum-card">
            <h2 className="text-2xl font-bold text-white mb-6">
              Custom Quantum Circuit
            </h2>
            
            {/* Custom Circuit Builder */}
            <div className="quantum-circuit-builder">
              <div className="mb-4">
                <p className="text-white/70 text-sm mb-2">
                  Drop zones are highlighted in blue. Each column is a time step, each row is a qubit.
                </p>
              </div>
              
              {/* Circuit Grid */}
              <div className="circuit-grid bg-black/30 p-6 rounded-lg border border-white/20">
                {/* Qubit Labels */}
                <div className="grid gap-4" style={{ gridTemplateColumns: `80px repeat(8, 60px)` }}>
                  <div></div> {/* Empty corner */}
                  {Array.from({length: 8}, (_, i) => (
                    <div key={i} className="text-center text-white/50 text-xs">
                      T{i + 1}
                    </div>
                  ))}
                  
                  {/* Circuit Rows */}
                  {Array.from({length: qubits}, (_, qubitIndex) => (
                    <React.Fragment key={qubitIndex}>
                      {/* Qubit Label */}
                      <div className="flex items-center text-white/70 text-sm">
                        |q{qubitIndex}⟩
                      </div>
                      
                      {/* Time Steps */}
                      {Array.from({length: 8}, (_, timeStep) => {
                        const gateInPosition = circuitGates.find(
                          gate => gate.qubit === qubitIndex && gate.timeStep === timeStep
                        )
                          
                          return (
                            <div
                              key={timeStep}
                              className="h-12 border border-dashed border-white/20 rounded flex items-center justify-center drop-zone hover:border-blue-400/50 hover:bg-blue-500/10 transition-colors"
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, qubitIndex, timeStep)}                            >                              {gateInPosition ? (
                                <div className="relative group">
                                  <div 
                                    className={`w-10 h-10 bg-quantum-500 border border-quantum-400 rounded flex items-center justify-center text-white font-mono text-sm ${
                                      gateInPosition.name === 'CNOT' ? 'cursor-pointer hover:bg-quantum-400' : ''
                                    }`}
                                    onClick={gateInPosition.name === 'CNOT' ? () => changeCNOTTarget(gateInPosition.id) : undefined}
                                    title={gateInPosition.name === 'CNOT' ? 'Click to change target qubit' : ''}
                                  >
                                    {gateInPosition.name === 'CNOT' ? '●' : gateInPosition.symbol}
                                  </div>
                                  {gateInPosition.name === 'CNOT' && (
                                    <div className="absolute -bottom-5 left-0 right-0 text-xs text-center text-white/70">
                                      →q{gateInPosition.target_qubit}
                                    </div>
                                  )}
                                  {gateInPosition.parameter && (
                                    <div className="absolute -bottom-5 left-0 right-0 text-xs text-center text-white/70">
                                      {(gateInPosition.parameter / Math.PI).toFixed(2)}π
                                    </div>
                                  )}
                                  <button
                                    onClick={() => removeGate(gateInPosition.id)}
                                    className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center justify-center"
                                  >
                                    ×
                                  </button>
                                </div>
                              ) : circuitGates.some(g => g.name === 'CNOT' && g.target_qubit === qubitIndex && g.timeStep === timeStep) ? (
                                <div className="relative">
                                  <div className="w-10 h-10 bg-quantum-500 border-2 border-white rounded-full flex items-center justify-center text-white font-mono text-sm">
                                    ⊕
                                  </div>
                                  <div className="absolute -bottom-5 left-0 right-0 text-xs text-center text-white/70">
                                    Target
                                  </div>                                </div>                              ) : (
                                <div className="text-white/30 text-xs">Drop</div>
                              )}
                            </div>
                          )
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>                  {/* Circuit Stats */}
                <div className="mt-4 flex justify-between items-center text-sm">
                  <span className="text-white/60">
                    Gates placed: {circuitGates.length} | Qubits: {qubits} | Max Depth: {circuitGates.length > 0 ? Math.max(...circuitGates.map(g => g.timeStep + 1)) : 0}
                    {circuitGates.length === 0 && " (Initial state)"}
                  </span>                  <div className="flex space-x-2">
                    <button
                      onClick={runSimulation}
                      disabled={isRunning}
                      className="text-green-400 hover:text-green-300 transition-colors text-xs disabled:opacity-50"
                    >
                      {isRunning ? 'Running...' : (circuitGates.length === 0 ? 'Show Initial State' : 'Quick Simulate')}
                    </button>
                  </div>
                </div>
              </div>
          </div>
        </motion.section>{/* Gate Library */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        ><div className="quantum-card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Quantum Gate Library</h2>
                {circuitGates.length > 0 && (
                  <button
                    onClick={clearCircuit}
                    className="quantum-button-secondary flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear Circuit</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {quantumGates.map((gate, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileDrag={{ scale: 1.1 }}
                    className="p-4 bg-white/10 rounded-lg border border-white/20 cursor-grab hover:bg-white/20 transition-colors text-center active:cursor-grabbing select-none"
                    draggable
                    onDragStart={(e) => handleDragStart(e, gate)}                  >
                    <div className="text-2xl font-mono text-white mb-2">{gate.symbol}</div>
                    <div className="text-xs text-white/70">{gate.description}</div>                    {/* Parameter input for rotational gates */}
                    {gate.parameterized && ['RX', 'RY', 'RZ'].includes(gate.name) && (
                      <div className="mt-2 space-y-1" onClick={(e) => e.stopPropagation()}>
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleParameterChange(gate.name, Math.PI/4)
                            }}
                            className={`px-1 py-0.5 text-white rounded transition-colors ${
                              isParameterSelected(gate.name, Math.PI/4)
                                ? 'bg-quantum-500 text-white'
                                : 'bg-white/20 hover:bg-white/30'
                            }`}
                          >
                            π/4
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleParameterChange(gate.name, Math.PI/2)
                            }}
                            className={`px-1 py-0.5 text-white rounded transition-colors ${
                              isParameterSelected(gate.name, Math.PI/2)
                                ? 'bg-quantum-500 text-white'
                                : 'bg-white/20 hover:bg-white/30'
                            }`}
                          >
                            π/2
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleParameterChange(gate.name, 3*Math.PI/4)
                            }}
                            className={`px-1 py-0.5 text-white rounded transition-colors ${
                              isParameterSelected(gate.name, 3*Math.PI/4)
                                ? 'bg-quantum-500 text-white'
                                : 'bg-white/20 hover:bg-white/30'
                            }`}
                          >
                            3π/4
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleParameterChange(gate.name, Math.PI)
                            }}
                            className={`px-1 py-0.5 text-white rounded transition-colors ${
                              isParameterSelected(gate.name, Math.PI)
                                ? 'bg-quantum-500 text-white'
                                : 'bg-white/20 hover:bg-white/30'
                            }`}
                          >
                            π
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <p className="text-blue-200 text-sm">
                  💡 <strong>How to use:</strong> Drag gates from the library above and drop them on the circuit visualization above. Gates placed: {circuitGates.length}
                  {circuitGates.length === 0 && " (Empty circuit will show the initial |00...0⟩ state)"}
                </p>              </div>
            </div>
          </motion.section>

        {/* Quantum State Display */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >          {/* State Vector */}
          <div className="quantum-card">
            <h3 className="text-xl font-semibold text-white mb-4">Quantum State Vector</h3>
            {!simulationResult ? (
              <div className="text-center py-8">
                <p className="text-white/60">Run a simulation to see quantum state vector</p>
              </div>
            ) : (
              <div className="mt-4 space-y-2">                {Array.from({length: Math.pow(2, qubits)}, (_, i) => {
                  const binaryState = i.toString(2).padStart(qubits, '0')
                  let amplitude = 0
                  let probability = 0
                  
                  if (simulationResult.quantum_state && simulationResult.quantum_state[i]) {
                    const state = simulationResult.quantum_state[i]
                    amplitude = Math.sqrt(state.real * state.real + state.imag * state.imag)
                    probability = amplitude * amplitude
                  }
                  
                  return (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-white/70">
                        |{binaryState}⟩
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-white/10 rounded-full">
                          <div 
                            className="h-full bg-quantum-400 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(probability * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-white/60 w-12 text-right">
                          {amplitude.toFixed(3)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>          {/* Measurement Outcomes */}
          <div className="quantum-card">
            <h3 className="text-xl font-semibold text-white mb-4">Measurement Probabilities</h3>
            {!simulationResult ? (
              <div className="text-center py-8">
                <p className="text-white/60">Run a simulation to see measurement probabilities</p>
              </div>
            ) : (
              <div className="space-y-3">                {Array.from({length: Math.pow(2, qubits)}, (_, i) => {
                  const binaryState = i.toString(2).padStart(qubits, '0')
                  let probability = 0
                  let count = 0
                  
                  if (simulationResult.probabilities && simulationResult.probabilities[i] !== undefined) {
                    probability = simulationResult.probabilities[i]
                  }
                  if (simulationResult.measurement_counts && simulationResult.measurement_counts[binaryState]) {
                    count = simulationResult.measurement_counts[binaryState]
                  }
                  
                  return (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-white font-mono">
                        |{binaryState}⟩
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 h-3 bg-white/10 rounded-full">
                          <div 
                            className="h-full bg-gradient-to-r from-quantum-400 to-quantum-600 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(probability * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-white/80 text-sm w-16 text-right">
                          {(probability * 100).toFixed(1)}%
                          {count > 0 && (
                            <div className="text-xs text-white/60">({count})</div>
                          )}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            
            {simulationResult && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Circuit Depth:</span>
                    <span className="text-white ml-2">{simulationResult.circuit_depth || 0}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Gate Count:</span>
                    <span className="text-white ml-2">{simulationResult.gate_count || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.section>
  </div>
</div>
  )
}

export default Simulator
