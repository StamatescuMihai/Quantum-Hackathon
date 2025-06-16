import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CircuitVisualizer from '../components/CircuitVisualizer'
import { Play, RotateCcw, ChevronRight, Zap, Brain, Clock } from 'lucide-react'
import { Bar } from 'react-chartjs-2'

const DeutschJozsa = () => {
  const [functionType, setFunctionType] = useState('balanced')
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [result, setResult] = useState('')
  const [probabilities, setProbabilities] = useState(new Array(8).fill(0))

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
    let newProbs = new Array(8).fill(0)
    
    switch (step) {
      case 1: // After initial Hadamards
        newProbs.fill(1/8)
        break
      case 2: // After oracle (no visible change in probabilities)
        newProbs.fill(1/8)
        break
      case 3: // After final Hadamards
        if (functionType.startsWith('constant')) {
          newProbs[0] = 1 // All probability in |000⟩
        } else {
          // Balanced function - probability distributed among non-zero states
          for (let i = 1; i < 8; i++) {
            newProbs[i] = 1/7
          }
        }
        break
      case 4: // Final measurement
        if (functionType.startsWith('constant')) {
          newProbs = new Array(8).fill(0)
          newProbs[0] = 1
        } else {
          newProbs = new Array(8).fill(0)
          // Simulate measuring a non-zero state for balanced function
          const nonZeroIndex = Math.floor(Math.random() * 7) + 1
          newProbs[nonZeroIndex] = 1
        }
        break
    }
    
    setProbabilities(newProbs)
  }

  const determineResult = () => {
    if (functionType.startsWith('constant')) {
      setResult('CONSTANT: Function returns the same value for all inputs')
    } else {
      setResult('BALANCED: Function returns 0 for half inputs, 1 for half')
    }
  }

  const runAlgorithm = () => {
    setIsRunning(true)
    setCurrentStep(0)
    setResult('')
    setProbabilities(new Array(8).fill(0).map((_, i) => i === 0 ? 1 : 0))
  }

  const resetAlgorithm = () => {
    setIsRunning(false)
    setCurrentStep(0)
    setResult('')
    setProbabilities(new Array(8).fill(1/8))
  }

  const chartData = {
    labels: Array.from({length: 8}, (_, i) => `|${i.toString(2).padStart(3, '0')}⟩`),
    datasets: [
      {
        label: 'Measurement Probability',
        data: probabilities,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: 'white' }
      },
      title: {
        display: true,
        text: 'Quantum State Probabilities',
        color: 'white'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
    },
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
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Deutsch-Jozsa Algorithm
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Determine if a function is constant or balanced with exponential speedup. 
            Classical algorithms need 2^(n-1)+1 queries, but this quantum algorithm needs only 1.
          </p>
        </motion.div>

        {/* Algorithm Info */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="quantum-card">
              <div className="flex items-center mb-4">
                <Zap className="w-6 h-6 text-blue-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Complexity</h3>
              </div>
              <div className="text-2xl font-mono text-blue-400 mb-2">O(1)</div>
              <p className="text-white/70 text-sm">
                Constant time vs classical O(2^(n-1)+1)
              </p>
            </div>

            <div className="quantum-card">
              <div className="flex items-center mb-4">
                <Brain className="w-6 h-6 text-purple-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Oracle Queries</h3>
              </div>
              <div className="text-2xl font-mono text-purple-400 mb-2">1</div>
              <p className="text-white/70 text-sm">
                Single query vs up to 2^(n-1)+1 classical
              </p>
            </div>

            <div className="quantum-card">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-green-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Success Rate</h3>
              </div>
              <div className="text-2xl font-mono text-green-400 mb-2">100%</div>
              <p className="text-white/70 text-sm">
                Deterministic result with certainty
              </p>
            </div>
          </div>
        </motion.section>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
          {/* Quantum Circuit */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="quantum-card"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Quantum Circuit</h3>
            <CircuitVisualizer
              algorithm="deutsch-jozsa"
              qubits={3}
              steps={steps}
              isAnimating={isRunning}
              currentStep={currentStep}
            />
            
            {/* Controls */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Function Type
                </label>
                <select
                  value={functionType}
                  onChange={(e) => setFunctionType(e.target.value)}
                  disabled={isRunning}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  {Object.entries(functionTypes).map(([key, type]) => (
                    <option key={key} value={key} className="bg-quantum-800 text-white">
                      {type.name}
                    </option>
                  ))}
                </select>
                <p className="text-white/60 text-sm mt-1">
                  {functionTypes[functionType].description}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={runAlgorithm}
                  disabled={isRunning}
                  className="quantum-button flex-1 disabled:opacity-50"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isRunning ? 'Running...' : 'Run Algorithm'}
                </button>
                <button
                  onClick={resetAlgorithm}
                  className="quantum-button-secondary"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="quantum-card"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Quantum State & Results</h3>
            
            {/* Current Step Display */}
            {isRunning && (
              <div className="mb-6 p-4 bg-quantum-500/20 rounded-lg border border-quantum-500/30">
                <div className="flex items-center mb-2">
                  <ChevronRight className="w-4 h-4 text-quantum-300 mr-2" />
                  <span className="text-white font-medium">
                    Step {currentStep + 1}: {steps[currentStep]}
                  </span>
                </div>
              </div>
            )}

            {/* Result Display */}
            {result && (
              <div className="mb-6 p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                <h4 className="text-white font-medium mb-2">Algorithm Result:</h4>
                <p className="text-green-300">{result}</p>
              </div>
            )}

            {/* Probability Chart */}
            <div className="h-64 mb-6">
              <Bar data={chartData} options={chartOptions} />
            </div>

            {/* Interpretation */}
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">Measurement Interpretation:</h4>
                <div className="text-sm text-white/70">
                  • If we measure |000⟩: Function is <span className="text-blue-300">CONSTANT</span>
                  <br />
                  • If we measure any other state: Function is <span className="text-purple-300">BALANCED</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Algorithm Explanation */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="quantum-card"
        >
          <h3 className="text-2xl font-bold text-white mb-6">How Deutsch-Jozsa Algorithm Works</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Problem Definition</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="text-white font-medium mb-2">Given</h5>
                  <p className="text-white/70 text-sm">
                    A black-box function f: {'{0,1}'}^n → {'{0,1}'} that is either:
                    <br />• <strong>Constant:</strong> f(x) = 0 for all x, or f(x) = 1 for all x
                    <br />• <strong>Balanced:</strong> f(x) = 0 for exactly half the inputs
                  </p>
                </div>
                <div>
                  <h5 className="text-white font-medium mb-2">Goal</h5>
                  <p className="text-white/70 text-sm">
                    Determine whether f is constant or balanced with minimal queries.
                  </p>
                </div>
                <div>
                  <h5 className="text-white font-medium mb-2">Classical Approach</h5>
                  <p className="text-white/70 text-sm">
                    In worst case, need to check 2^(n-1) + 1 inputs to be certain.
                    For n=3, that's up to 5 queries.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quantum Advantage</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="text-white font-medium mb-2">Quantum Parallelism</h5>
                  <p className="text-white/70 text-sm">
                    Hadamard gates create superposition of all possible inputs,
                    allowing evaluation of f on all inputs simultaneously.
                  </p>
                </div>
                <div>
                  <h5 className="text-white font-medium mb-2">Interference</h5>
                  <p className="text-white/70 text-sm">
                    The final Hadamard gates create interference patterns that
                    distinguish constant from balanced functions.
                  </p>
                </div>
                <div>
                  <h5 className="text-white font-medium mb-2">Single Query</h5>
                  <p className="text-white/70 text-sm">
                    Only one oracle query needed, providing exponential speedup
                    for this specific problem.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
            <h4 className="text-white font-medium mb-2">Historical Significance</h4>
            <p className="text-white/80 text-sm">
              The Deutsch-Jozsa algorithm was one of the first to demonstrate exponential 
              quantum speedup over classical algorithms, proving that quantum computers 
              could solve certain problems fundamentally faster than classical computers.
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default DeutschJozsa
