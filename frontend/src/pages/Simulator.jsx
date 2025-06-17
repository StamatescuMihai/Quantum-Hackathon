import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Cpu, Zap, RotateCcw, Play, Settings, Trash2 } from 'lucide-react'
import CircuitVisualizer from '../components/CircuitVisualizer'

const Simulator = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('grover')
  const [qubits, setQubits] = useState(3)
  const [isRunning, setIsRunning] = useState(false)
  const [customCircuit, setCustomCircuit] = useState(false)
  const [circuitGates, setCircuitGates] = useState([])
  const [draggedGate, setDraggedGate] = useState(null)

  const algorithms = {
    'grover': {
      name: "Grover's Algorithm",
      description: "Quantum search with quadratic speedup",
      complexity: "O(√N)",
      color: "from-green-500 to-emerald-600"
    },
    'deutsch-jozsa': {
      name: "Deutsch-Jozsa",
      description: "Function analysis with exponential speedup",
      complexity: "O(1)",
      color: "from-blue-500 to-cyan-600"
    },
    'bernstein-vazirani': {
      name: "Bernstein-Vazirani",
      description: "Hidden string recovery",
      complexity: "O(1)",
      color: "from-purple-500 to-violet-600"
    },
    'simon': {
      name: "Simon's Algorithm",
      description: "Period finding with exponential advantage",
      complexity: "O(n)",
      color: "from-red-500 to-pink-600"
    }
  }

  const quantumGates = [
    { name: 'H', description: 'Hadamard Gate', symbol: 'H' },
    { name: 'X', description: 'Pauli-X (NOT)', symbol: 'X' },
    { name: 'Y', description: 'Pauli-Y', symbol: 'Y' },
    { name: 'Z', description: 'Pauli-Z', symbol: 'Z' },
    { name: 'CNOT', description: 'Controlled-NOT', symbol: '⊕' },
    { name: 'T', description: 'T Gate', symbol: 'T' },
    { name: 'S', description: 'S Gate', symbol: 'S' },
    { name: 'RZ', description: 'Z-Rotation', symbol: 'RZ' },
  ]

  const runSimulation = () => {
    setIsRunning(true)
    setTimeout(() => {
      setIsRunning(false)
    }, 3000)
  }

  const resetSimulation = () => {
    setIsRunning(false)
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
      setCircuitGates(prev => [...prev, newGate])
      setDraggedGate(null)
    }
  }

  const removeGate = (gateId) => {
    setCircuitGates(prev => prev.filter(gate => gate.id !== gateId))
  }

  const clearCircuit = () => {
    setCircuitGates([])
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
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Experiment with quantum algorithms and build custom circuits. 
              Visualize quantum states and observe quantum mechanical phenomena in real-time.
            </p>
            <p className="text-4xl sm:text-xl font-bold text-white mb-4">
              Still a Work in Progress!
              Lack of BackEnd may cause innacurate results.
            </p>
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
        </motion.section>
    
        {/* Simulator Controls */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="quantum-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Simulator Controls</h2>
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-white/60" />
                <span className="text-white/60">Configure</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Algorithm Selection */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Select Algorithm</h3>
                <div className="space-y-3">
                  {Object.entries(algorithms).map(([key, algo]) => (
                    <div
                      key={key}
                      onClick={() => setSelectedAlgorithm(key)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedAlgorithm === key
                          ? 'border-quantum-500 bg-quantum-500/20'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">{algo.name}</h4>
                          <p className="text-white/60 text-sm">{algo.description}</p>
                        </div>
                        <div className="complexity-badge">{algo.complexity}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={customCircuit}
                      onChange={(e) => setCustomCircuit(e.target.checked)}
                      className="w-4 h-4 text-quantum-600 rounded"
                    />
                    <span className="text-white/80">Build Custom Circuit</span>
                  </label>
                </div>
              </div>

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
                      onChange={(e) => setQubits(parseInt(e.target.value))}
                      className="w-full"
                      disabled={!customCircuit}
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
                        <span className="text-white text-sm">Complexity</span>
                      </div>
                      <div className="text-xl font-mono text-green-300">
                        {algorithms[selectedAlgorithm].complexity}
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
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Circuit Visualization */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="quantum-card">
            <h2 className="text-2xl font-bold text-white mb-6">
              {customCircuit ? 'Custom Quantum Circuit' : 'Quantum Circuit'}
            </h2>
            
            {customCircuit ? (
              // Custom Circuit Builder
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
                              onDrop={(e) => handleDrop(e, qubitIndex, timeStep)}
                            >
                              {gateInPosition ? (
                                <div className="relative group">
                                  <div className="w-10 h-10 bg-quantum-500 border border-quantum-400 rounded flex items-center justify-center text-white font-mono text-sm">
                                    {gateInPosition.symbol}
                                  </div>
                                  <button
                                    onClick={() => removeGate(gateInPosition.id)}
                                    className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center justify-center"
                                  >
                                    ×
                                  </button>
                                </div>
                              ) : (
                                <div className="text-white/30 text-xs">Drop</div>
                              )}
                            </div>
                          )
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                
                {/* Circuit Stats */}
                <div className="mt-4 flex justify-between items-center text-sm">
                  <span className="text-white/60">
                    Gates placed: {circuitGates.length} | Qubits: {qubits} | Depth: {Math.max(...circuitGates.map(g => g.timeStep + 1), 0)}
                  </span>
                  <button
                    onClick={() => console.log('Circuit gates:', circuitGates)} /* Add functionality */
                    className="text-quantum-400 hover:text-quantum-300 transition-colors"
                  >
                    View Circuit Data
                  </button>
                </div>
              </div>
            ) : (
              // Standard Algorithm Visualization
              <CircuitVisualizer
                algorithm={selectedAlgorithm}
                qubits={qubits}
                isAnimating={isRunning}
              />
            )}
          </div>
        </motion.section>

        {/* Gate Library */}
        {customCircuit && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >            <div className="quantum-card">
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
                    onDragStart={(e) => handleDragStart(e, gate)}
                  >
                    <div className="text-2xl font-mono text-white mb-2">{gate.symbol}</div>
                    <div className="text-xs text-white/70">{gate.description}</div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <p className="text-blue-200 text-sm">
                  💡 <strong>How to use:</strong> Drag gates from the library above and drop them on the circuit visualization above. Gates placed: {circuitGates.length}
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* Quantum State Display */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* State Vector */}
          <div className="quantum-card">
            <h3 className="text-xl font-semibold text-white mb-4">Quantum State Vector</h3>
            <div className="mt-4 space-y-2">
              {Array.from({length: Math.pow(2, qubits)}, (_, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-white/70">
                    |{i.toString(2).padStart(qubits, '0')}⟩
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-white/10 rounded-full">
                      <div 
                        className="h-full bg-quantum-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.random() * 100}%` }}
                      />
                    </div>
                    <span className="text-white/60 w-12 text-right">
                      {(Math.random()).toFixed(3)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Measurement Outcomes */}
          <div className="quantum-card">
            <h3 className="text-xl font-semibold text-white mb-4">Measurement Probabilities</h3>
            <div className="space-y-3">
              {Array.from({length: Math.pow(2, qubits)}, (_, i) => {
                const prob = Math.random()
                return (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-white font-mono">
                      |{i.toString(2).padStart(qubits, '0')}⟩
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 h-3 bg-white/10 rounded-full">
                        <div 
                          className="h-full bg-gradient-to-r from-quantum-400 to-quantum-600 rounded-full transition-all duration-500"
                          style={{ width: `${prob * 100}%` }}
                        />
                      </div>
                      <span className="text-white/80 text-sm w-12">
                        {(prob * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.section>
  </div>
</div>
  )
}

export default Simulator
