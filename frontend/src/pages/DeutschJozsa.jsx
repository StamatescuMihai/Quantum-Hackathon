import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CircuitVisualizer from '../components/CircuitVisualizer'
import { Play, RotateCcw, ChevronRight, Zap, Brain, Binary } from 'lucide-react'
import { Bar } from 'react-chartjs-2'
import { runDeutschJozsaAlgorithm } from '../services/api'

const DeutschJozsa = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [functionType, setFunctionType] = useState('balanced')
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [result, setResult] = useState('')
  const [probabilities, setProbabilities] = useState(new Array(8).fill(0))
  const [apiResult, setApiResult] = useState(null)
  const [error, setError] = useState('')
  const [isUsingBackend, setIsUsingBackend] = useState(true)

  const functionTypes = {
    'constant-0': { name: 'Constant (f=0)', description: 'Function returns 0 for all inputs' },
    'constant-1': { name: 'Constant (f=1)', description: 'Function returns 1 for all inputs' },
    'balanced': { name: 'Balanced', description: 'Function returns 0 for half inputs, 1 for half' }
  }

  const steps = [
    "Initialize qubits in |0⟩ state",
    "Apply Hadamard gates to all qubits",
    "Query the oracle function f(x)",
    "Apply Hadamard gates to input qubits",
    "Measure to determine function type"
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
              setResult(`Function is ${apiResult.result} (Backend Result)`)
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
        // After oracle - function evaluated
        newProbs.fill(1/8)
        break
      case 3:
        // After final Hadamard gates
        if (functionType.startsWith('constant')) {
          // Constant function: all amplitudes go to |000⟩
          newProbs.fill(0)
          newProbs[0] = 1
        } else {
          // Balanced function: amplitudes distributed over non-zero states
          newProbs[0] = 0
          for (let i = 1; i < 4; i++) {
            newProbs[i] = 0.25
          }
        }
        break
      case 4:
        // Final measurement result
        break
    }
    
    setProbabilities([...newProbs])
  }

  const determineResult = () => {
    // Only determine result for local simulation, not backend
    if (!isUsingBackend) {
      if (functionType.startsWith('constant')) {
        setResult('Function is CONSTANT - determined with certainty in 1 query')
      } else {
        setResult('Function is BALANCED - determined with certainty in 1 query')
      }
    }
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
        const data = await runDeutschJozsaAlgorithm(functionType, 3)
        setApiResult(data)
        
        // Store backend results but don't display them yet - let animation run first
        // The animation will run and then backend results will be applied when animation completes
        
        // Start visual animation
        updateQuantumState(0)
      } else {
        // Use local simulation
        updateQuantumState(0)
      }
    } catch (error) {
      console.error('Error running Deutsch-Jozsa algorithm:', error)
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

  const chartData = {
    labels: Array.from({ length: probabilities.length }, (_, i) => 
      `|${i.toString(2).padStart(3, '0')}⟩`
    ),
    datasets: [
      {
        label: 'Measurement Probability',
        data: probabilities,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
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
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl">
              <Binary className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Deutsch-Jozsa Algorithm
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Determine if a black-box function is constant or balanced with exponential speedup. 
            This algorithm was historically important as the first to show exponential quantum advantage.
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
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Purpose</h3>
              <p className="text-white/70 text-sm">Determine if f: {'{0,1}'}ⁿ→{'{0,1}'} is constant or balanced</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Complexity</h3>
              <p className="text-white/70 text-sm">O(1) vs classical O(2^(n-1)+1) - Exponential speedup</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Binary className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Key Concept</h3>
              <p className="text-white/70 text-sm">Quantum parallelism evaluates function on all inputs simultaneously</p>
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
                      ? 'bg-blue-500/20 border-blue-500/50' 
                      : 'bg-white/5 border-white/10'
                  } border`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                    index <= currentStep 
                      ? 'bg-blue-500 text-white' 
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
                    <ChevronRight className="w-4 h-4 ml-auto text-blue-400 animate-pulse" />
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
                    Function Type:
                  </label>
                  <select
                    value={functionType}
                    onChange={(e) => setFunctionType(e.target.value)}
                    disabled={isRunning}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="constant-0" className="bg-gray-800">Constant (f=0)</option>
                    <option value="constant-1" className="bg-gray-800">Constant (f=1)</option>
                    <option value="balanced" className="bg-gray-800">Balanced</option>
                  </select>
                  <p className="text-white/60 text-xs mt-1">
                    {functionTypes[functionType].description}
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

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg p-4 mb-6"
              >
                <h4 className="text-lg font-semibold text-blue-300 mb-2">Result</h4>
                <p className="text-white">{result}</p>
              </motion.div>
            )}

            {/* Backend API Results */}
            {apiResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-500/30 rounded-lg p-4 mb-6"
              >
                <h4 className="text-lg font-semibold text-purple-300 mb-3">Backend Quantum Simulation Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/80">
                      <strong className="text-purple-300">Success:</strong> {apiResult.success ? 'Yes' : 'No'}
                    </p>
                    <p className="text-white/80">
                      <strong className="text-purple-300">Result:</strong> {apiResult.result}
                    </p>
                    <p className="text-white/80">
                      <strong className="text-purple-300">Function Type:</strong> {apiResult.function_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/80">
                      <strong className="text-purple-300">Measurement Counts:</strong>
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
              </motion.div>
            )}

            {/* Theory Explanation */}
            <div className="bg-white/5 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">How It Works</h4>
              <div className="space-y-3 text-white/80 text-sm">
                <p>
                  <strong className="text-blue-300">Constant Function:</strong> Returns same value (0 or 1) for all inputs. Measurement always yields |000⟩.
                </p>
                <p>
                  <strong className="text-blue-300">Balanced Function:</strong> Returns 0 for exactly half inputs, 1 for the other half. Never measures |000⟩.
                </p>
                <p>
                  <strong className="text-blue-300">Quantum Parallelism:</strong> All 2ⁿ function evaluations happen simultaneously in superposition.
                </p>
                <p>
                  <strong className="text-blue-300">Historical Significance:</strong> First algorithm to prove exponential quantum advantage over classical methods.
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
                        algorithm="deutsch-jozsa"
                        functionType={functionType}
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

export default DeutschJozsa
