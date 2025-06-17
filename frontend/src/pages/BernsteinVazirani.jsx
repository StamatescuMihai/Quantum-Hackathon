import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CircuitVisualizer from '../components/CircuitVisualizer'
import { Play, RotateCcw, ChevronRight, Zap, Search, Hash } from 'lucide-react'
import { Bar } from 'react-chartjs-2'
import { runBernsteinVaziraniAlgorithm } from '../services/api'

const BernsteinVazirani = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [hiddenString, setHiddenString] = useState('101')
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [result, setResult] = useState('')
  const [probabilities, setProbabilities] = useState(new Array(8).fill(0))
  const [apiResult, setApiResult] = useState(null)
  const [error, setError] = useState('')
  const [isUsingBackend, setIsUsingBackend] = useState(true)

  const steps = [
    "Initialize qubits in |0⟩ state",
    "Apply Hadamard gates to all qubits",
    "Query the oracle function f(x) = s·x",
    "Apply Hadamard gates to input qubits",
    "Measure to recover hidden string"
  ]

  useEffect(() => {
    if (isRunning) {
      const timer = setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1)
          // Always run animation for visual effect
          updateQuantumState(currentStep + 1)
        } else {
          setIsRunning(false)
          // Animation completed - now apply final results
          if (isUsingBackend && apiResult) {
            // Apply backend results after animation
            if (apiResult.success && apiResult.probabilities) {
              setProbabilities(apiResult.probabilities)
              setResult(`Hidden string found: ${apiResult.discovered_string} (Backend Result)`)
            }
          } else if (!isUsingBackend) {
            // Local simulation result
            determineResult()
          }
        }
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isRunning, currentStep, isUsingBackend, apiResult])

  const updateQuantumState = (step) => {
    let newProbs = new Array(8).fill(0)
    
    switch (step) {
      case 0:
        newProbs[0] = 1
        break
      case 1:
        // After Hadamard gates - uniform superposition
        newProbs.fill(1/8)
        break
      case 2:
        // After oracle - phase kickback applied
        newProbs.fill(1/8)
        break
      case 3:
        // After final Hadamard gates
        newProbs.fill(0)
        const targetState = parseInt(hiddenString, 2)
        if (targetState < newProbs.length) {
          newProbs[targetState] = 1
        }
        break
      case 4:
        // Final measurement
        newProbs.fill(0)
        const recoveredState = parseInt(hiddenString, 2)
        if (recoveredState < newProbs.length) {
          newProbs[recoveredState] = 1
        }
        break
    }
    
    setProbabilities([...newProbs])
  }

  const determineResult = () => {
    setResult(`Hidden string recovered: ${hiddenString}`)
  }

  const runAlgorithm = async () => {
    try {
      setIsRunning(true)
      setCurrentStep(0)
      setResult('')
      setError('')
      setApiResult(null)
      
      if (isUsingBackend) {
        // Call backend API
        const data = await runBernsteinVaziraniAlgorithm(hiddenString)
        setApiResult(data)
        
        // Update visualization with backend results
        if (data.success && data.probabilities) {
          setProbabilities(data.probabilities)
          setResult(`Hidden string found: ${data.discovered_string} (Backend Result)`)
        }
        
        // Animate through steps for visualization
        updateQuantumState(0)
      } else {
        // Use local simulation
        updateQuantumState(0)
      }
    } catch (error) {
      console.error('Error running Bernstein-Vazirani algorithm:', error)
      setError(`Error connecting to backend: ${error.message}. Using local simulation.`)
      setIsUsingBackend(false)
      // Fall back to local simulation
      updateQuantumState(0)
    }
  }

  const resetAlgorithm = () => {
    setIsRunning(false)
    setCurrentStep(0)
    setResult('')
    setError('')
    setApiResult(null)
    setProbabilities(new Array(8).fill(0))
  }

  const handleHiddenStringChange = (value) => {
    // Validate binary string
    if (/^[01]*$/.test(value) || value === '') {
      setHiddenString(value)
    }
  }

  const chartData = {
    labels: Array.from({ length: probabilities.length }, (_, i) => 
      `|${i.toString(2).padStart(3, '0')}⟩`
    ),
    datasets: [
      {
        label: 'Measurement Probability',
        data: probabilities,
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgba(147, 51, 234, 1)',
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
            <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl">
              <Hash className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Bernstein-Vazirani Algorithm
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Discover hidden bit strings using quantum parallelism. This algorithm demonstrates 
            linear speedup over classical methods by finding an n-bit string in just one query.
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
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Purpose</h3>
              <p className="text-white/70 text-sm">Find hidden string s where f(x) = s·x (dot product mod 2)</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Complexity</h3>
              <p className="text-white/70 text-sm">O(1) vs classical O(n) - Linear speedup</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Hash className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Key Concept</h3>
              <p className="text-white/70 text-sm">Quantum interference reveals the hidden string directly</p>
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
                      ? 'bg-purple-500/20 border-purple-500/50' 
                      : 'bg-white/5 border-white/10'
                  } border`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                    index <= currentStep 
                      ? 'bg-purple-500 text-white' 
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
                    <ChevronRight className="w-4 h-4 ml-auto text-purple-400 animate-pulse" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Controls */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Controls</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Hidden String:
                  </label>
                  <input
                    type="text"
                    value={hiddenString}
                    onChange={(e) => handleHiddenStringChange(e.target.value)}
                    disabled={isRunning}
                    placeholder="Enter binary string (e.g., 101)"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-white/50"
                  />
                  <p className="text-white/60 text-xs mt-1">
                    Binary string that the quantum algorithm will discover
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/70 text-sm">
                    <strong className="text-purple-300">Function:</strong> f(x) = s·x (mod 2)
                    <br />
                    <strong className="text-purple-300">Goal:</strong> Find hidden string s = {hiddenString}
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
                    disabled={isRunning}
                    className="flex-1 quantum-button flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isRunning ? 'Discovering...' : 'Run Discovery'}
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

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-500/30 rounded-lg p-4 mb-6"
              >
                <h4 className="text-lg font-semibold text-purple-300 mb-2">Result</h4>
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
                      <strong className="text-orange-300">Hidden String:</strong> {apiResult.hidden_string || 'Unknown'}
                    </p>
                    <p className="text-white/80">
                      <strong className="text-orange-300">Measurements:</strong> {apiResult.shots || 'N/A'}
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
                {apiResult.probabilities && (
                  <div className="mt-4">
                    <p className="text-orange-300 text-sm font-medium mb-2">State Probabilities:</p>
                    <div className="text-xs bg-black/30 rounded p-2 max-h-16 overflow-y-auto">
                      {apiResult.probabilities.map((prob, index) => (
                        prob > 0.001 && (
                          <div key={index} className="flex justify-between text-white/70">
                            <span>|{index.toString(2).padStart(3, '0')}⟩:</span>
                            <span>{prob.toFixed(4)}</span>
                          </div>
                        )
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
                  <strong className="text-purple-300">Oracle Function:</strong> f(x) = s·x where s is the hidden string and · is bitwise dot product mod 2.
                </p>
                <p>
                  <strong className="text-purple-300">Quantum Parallelism:</strong> All possible inputs are queried simultaneously in superposition, creating exponential speedup.
                </p>
                <p>
                  <strong className="text-purple-300">Phase Kickback:</strong> The oracle encodes the hidden string in the relative phases of the quantum amplitudes.
                </p>
                <p>
                  <strong className="text-purple-300">Interference:</strong> Final Hadamard gates create constructive interference only for the hidden string state.
                </p>
                <p>
                  <strong className="text-purple-300">Measurement:</strong> With certainty, we measure the hidden string in a single query.
                </p>
                <p>
                  <strong className="text-purple-300">Practical Impact:</strong> Generalizes Deutsch-Jozsa and demonstrates quantum advantage for linear function problems.
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
                        algorithm="bernstein-vazirani"
                        hiddenString={hiddenString}
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

export default BernsteinVazirani
