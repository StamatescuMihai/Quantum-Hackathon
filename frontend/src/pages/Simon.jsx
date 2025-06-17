import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CircuitVisualizer from '../components/CircuitVisualizer'
import { Play, RotateCcw, ChevronRight, Zap, Clock, Repeat } from 'lucide-react'
import { Bar } from 'react-chartjs-2'
import { runSimonAlgorithm } from '../services/api'

const Simon = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [hiddenPeriod, setHiddenPeriod] = useState('11')
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [result, setResult] = useState('')
  const [probabilities, setProbabilities] = useState(new Array(16).fill(0))
  const [linearEquations, setLinearEquations] = useState([])
  const [apiResult, setApiResult] = useState(null)
  const [error, setError] = useState('')
  const [isUsingBackend, setIsUsingBackend] = useState(true)

  const steps = [
    "Initialize qubits in |0⟩ state",
    "Apply Hadamard gates to first register",
    "Query Simon's oracle function f(x)",
    "Apply Hadamard gates to first register again",
    "Measure to get linear constraint",
    "Solve system of linear equations"
  ]

  useEffect(() => {
    if (isRunning) {
      const timer = setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1)
          updateQuantumState(currentStep + 1)
        } else {
          setIsRunning(false)
          determineResult()
        }
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isRunning, currentStep])

  const updateQuantumState = (step) => {
    let newProbs = new Array(16).fill(0)
    
    switch (step) {
      case 0:
        newProbs[0] = 1
        break
      case 1:
        // After Hadamard gates on first register - superposition
        for (let i = 0; i < 4; i++) {
          newProbs[i * 4] = 0.25 // |00⟩, |01⟩, |10⟩, |11⟩ in first register
        }
        break
      case 2:
        // After Simon oracle - entanglement created
        const period = parseInt(hiddenPeriod, 2)
        for (let i = 0; i < 4; i++) {
          newProbs[i * 4] = 0.125
          newProbs[i * 4 + (i ^ period)] = 0.125
        }
        break
      case 3:
        // After final Hadamard gates
        newProbs.fill(0)
        // Simulate measurement outcomes orthogonal to the period
        const validStates = getOrthogonalStates(hiddenPeriod)
        validStates.forEach(state => {
          if (state < newProbs.length) {
            newProbs[state] = 1 / validStates.length
          }
        })
        break
      case 4:
        // Measurement complete
        break
      case 5:
        // System solved
        break
    }
    
    setProbabilities([...newProbs])
  }

  const getOrthogonalStates = (period) => {
    // Simplified: return states that are orthogonal to the period
    const periodInt = parseInt(period, 2)
    const validStates = []
    
    for (let i = 0; i < 4; i++) {
      if ((i & periodInt) === 0) { // Dot product is 0
        validStates.push(i * 4) // Map to full state space
      }
    }
    
    return validStates.length > 0 ? validStates : [0]
  }

  const determineResult = () => {
    // Check if we have backend results to apply
    if (isUsingBackend && apiResult && apiResult.success) {
      // Apply backend results after animation completes
      if (apiResult.probabilities) {
        setProbabilities(apiResult.probabilities)
      }
      if (apiResult.linear_equations) {
        setLinearEquations(apiResult.linear_equations)
      }
      setResult(`Hidden period found: ${apiResult.discovered_period || hiddenPeriod} (Backend Result)`)
    } else {
      // Use local simulation results
      const equations = [
        `y₁ · s = 0 (mod 2)`,
        `y₂ · s = 0 (mod 2)`,
      ]
      setLinearEquations(equations)
      setResult(`Period found: s = ${hiddenPeriod}`)
    }
  }

  const runAlgorithm = async () => {
    try {
      setIsRunning(true)
      setCurrentStep(0)
      setResult('')
      setError('')
      setApiResult(null)
      setLinearEquations([])
      
      // Always start the animation first
      updateQuantumState(0)
      
      if (isUsingBackend) {
        // Call backend API in background while animation runs
        const numQubits = hiddenPeriod.length * 2  // Simon needs 2n qubits for n-bit period
        const data = await runSimonAlgorithm(hiddenPeriod, numQubits)
        setApiResult(data)
      }
    } catch (error) {
      console.error('Error running Simon algorithm:', error)
      setError(`Error connecting to backend: ${error.message}. Using local simulation.`)
      setIsUsingBackend(false)
    }
  }

  const resetAlgorithm = () => {
    setIsRunning(false)
    setCurrentStep(0)
    setResult('')
    setError('')
    setApiResult(null)
    setLinearEquations([])
    setProbabilities(new Array(16).fill(0))
  }

  const handlePeriodChange = (value) => {
    // Validate binary string (2-bit for simplicity)
    if (/^[01]{0,2}$/.test(value)) {
      setHiddenPeriod(value.padEnd(2, '0'))
    }
  }

  const chartData = {
    labels: Array.from({ length: Math.min(probabilities.length, 8) }, (_, i) => 
      `|${i.toString(2).padStart(3, '0')}⟩`
    ),
    datasets: [
      {
        label: 'Measurement Probability',
        data: probabilities.slice(0, 8),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
        borderRadius: 4,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.8)'
        }
      }
    }
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
            <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl">
              <Repeat className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Simon's Algorithm
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Discover hidden periods in functions with exponential quantum advantage. This algorithm 
            is a precursor to Shor's algorithm and demonstrates quantum advantage for structured problems.
          </p>
        </motion.div>

        {/* Algorithm Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="quantum-card mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Repeat className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Purpose</h3>
              <p className="text-white/70 text-sm">Find period s where f(x) = f(x ⊕ s) for unknown s ≠ 0</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Complexity</h3>
              <p className="text-white/70 text-sm">O(n) vs classical O(2^(n/2)) - Exponential speedup</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Key Concept</h3>
              <p className="text-white/70 text-sm">Quantum Fourier sampling finds linear constraints</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Algorithm Steps */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="quantum-card"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Algorithm Steps</h3>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`flex items-center p-3 rounded-lg ${
                    index <= currentStep 
                      ? 'bg-red-500/20 border-red-500/50' 
                      : 'bg-white/5 border-white/10'
                  } border`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                    index <= currentStep 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/10 text-white/50'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`${
                    index <= currentStep ? 'text-white' : 'text-white/50'
                  }`}>
                    {step}
                  </span>
                  {index === currentStep && isRunning && (
                    <ChevronRight className="w-4 h-4 ml-auto text-red-400 animate-pulse" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Hidden Period Information */}
            <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-300 text-sm">
                <strong>Hidden Period:</strong> {hiddenPeriod} 
                <span className="ml-4">
                  <strong>Problem Size:</strong> {hiddenPeriod.length}-bit function
                </span>
              </p>
              <p className="text-red-300/80 text-xs mt-1">
                Classical approach would require ~2^(n/2) queries. Quantum approach needs only O(n) queries!
              </p>
            </div>

            {/* Controls */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Controls</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Hidden Period (binary):
                  </label>
                  <input
                    type="text"
                    value={hiddenPeriod}
                    onChange={(e) => handlePeriodChange(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 11"
                    maxLength="2"
                  />
                  <p className="text-white/60 text-xs mt-1">
                    Enter a 2-bit binary string (00, 01, 10, 11)
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-3">
                  <label className="flex items-center text-white/80 text-sm">
                    <input
                      type="checkbox"
                      checked={isUsingBackend}
                      onChange={(e) => setIsUsingBackend(e.target.checked)}
                      className="mr-2 rounded"
                    />
                    Use Backend Quantum Simulation
                  </label>
                  <p className="text-white/60 text-xs mt-1">
                    {isUsingBackend ? 'Using Qiskit backend for accurate quantum simulation' : 'Using local approximation for visualization'}
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={runAlgorithm}
                    disabled={isRunning || !hiddenPeriod || hiddenPeriod === '00'}
                    className="flex-1 quantum-button flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isRunning ? 'Running...' : 'Run Algorithm'}
                  </button>
                  
                  <button
                    onClick={resetAlgorithm}
                    className="quantum-button-secondary flex items-center justify-center"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Measurement Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="quantum-card"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Measurement Results</h3>
            
            <div className="bg-white/5 rounded-xl p-6 mb-6" style={{ height: '300px' }}>
              {(() => {
                try {
                  return <Bar data={chartData} options={chartOptions} />
                } catch (error) {
                  console.error('Chart rendering error:', error)
                  return (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-white/60">Chart visualization temporarily unavailable</p>
                    </div>
                  )
                }
              })()}
            </div>

            {/* Linear Equations */}
            {linearEquations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-lg p-4 mb-6"
              >
                <h4 className="text-lg font-semibold text-red-300 mb-2">Linear Equations</h4>
                {linearEquations.map((eq, index) => (
                  <p key={index} className="text-white/90 font-mono text-sm">{eq}</p>
                ))}
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-lg p-4 mb-6"
              >
                <h4 className="text-lg font-semibold text-red-300 mb-2">Result</h4>
                <p className="text-white">{result}</p>
              </motion.div>
            )}

            {/* Backend API Results */}
            {apiResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-lg p-4 mb-6"
              >
                <h4 className="text-lg font-semibold text-orange-300 mb-3">Backend Quantum Simulation Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/80">
                      <strong className="text-orange-300">Success:</strong> {apiResult.success ? 'Yes' : 'No'}
                    </p>
                    <p className="text-white/80">
                      <strong className="text-orange-300">Discovered Period:</strong> {apiResult.discovered_period || 'Unknown'}
                    </p>
                    <p className="text-white/80">
                      <strong className="text-orange-300">Iterations:</strong> {apiResult.iterations || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/80">
                      <strong className="text-orange-300">Measurement Counts:</strong>
                    </p>
                    <div className="text-xs bg-black/30 rounded p-2 mt-1 max-h-20 overflow-y-auto">
                      {Object.entries(apiResult.measurement_counts || {}).map(([state, count]) => (
                        <div key={state} className="flex justify-between">
                          <span>|{state}⟩:</span>
                          <span>{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {apiResult.linear_equations && apiResult.linear_equations.length > 0 && (
                  <div className="mt-4">
                    <p className="text-orange-300 text-sm font-medium mb-2">Linear Equations:</p>
                    <div className="text-xs bg-black/30 rounded p-2">
                      {apiResult.linear_equations.map((eq, index) => (
                        <div key={index} className="text-white/70">{eq}</div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Theory Explanation */}
            <div className="bg-white/5 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">How It Works</h4>
              <div className="space-y-3 text-white/80 text-sm">
                <p>
                  <strong className="text-red-300">Simon's Promise:</strong> Function f satisfies f(x) = f(x ⊕ s) for some unknown s ≠ 0.
                </p>
                <p>
                  <strong className="text-red-300">Quantum Sampling:</strong> Creates superposition over all inputs and applies the oracle to create entanglement.
                </p>
                <p>
                  <strong className="text-red-300">Linear Constraints:</strong> Each measurement gives y where y · s = 0 (mod 2), providing constraints.
                </p>
                <p>
                  <strong className="text-red-300">System Solution:</strong> Collect n-1 linearly independent equations to solve for s over GF(2).
                </p>
                <p>
                  <strong className="text-red-300">Exponential Speedup:</strong> Classical methods need ~2^(n/2) queries, quantum needs O(n).
                </p>
                <p>
                  <strong className="text-red-300">Historical Significance:</strong> Inspired Shor's algorithm and demonstrated structured quantum advantage.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Circuit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="quantum-card"
        >
          <div className="flex flex-col items-center">
            {/* Quantum Circuit */}
            <div className="w-full max-w-4xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Quantum Circuit</h3>
              <div className="bg-white/5 rounded-xl p-6 flex items-center justify-center">
                {(() => {
                  try {
                    return (
                      <CircuitVisualizer 
                        algorithm="simon"
                        hiddenPeriod={hiddenPeriod}
                        currentStep={currentStep}
                        isRunning={isRunning}
                      />
                    )
                  } catch (error) {
                    console.error('CircuitVisualizer error:', error)
                    return (
                      <div className="flex items-center justify-center h-24">
                        <p className="text-white/60">Circuit visualization temporarily unavailable</p>
                      </div>
                    )
                  }
                })()}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Simon
