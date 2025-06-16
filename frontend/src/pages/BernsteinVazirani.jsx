import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CircuitVisualizer from '../components/CircuitVisualizer'
import { Play, RotateCcw, ChevronRight, Zap, Search, Hash } from 'lucide-react'
import { Bar } from 'react-chartjs-2'

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
      updateQuantumState(0)
      
      // Call backend API
      const response = await fetch('/api/bernstein-vazirani', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hidden_string: hiddenString,
          num_qubits: hiddenString.length
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Bernstein-Vazirani result:', data)
      }
    } catch (error) {
      console.error('Error running Bernstein-Vazirani algorithm:', error)
    }
  }

  const resetAlgorithm = () => {
    setIsRunning(false)
    setCurrentStep(0)
    setResult('')
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Circuit and Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="quantum-card"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Quantum Circuit</h3>
            
            <div className="bg-white/5 rounded-xl p-6 mb-6">
              <CircuitVisualizer 
                algorithm="bernstein-vazirani"
                hiddenString={hiddenString}
                currentStep={currentStep}
                isRunning={isRunning}
              />
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Hidden String (binary):
                </label>
                <input
                  type="text"
                  value={hiddenString}
                  onChange={(e) => handleHiddenStringChange(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 101"
                  maxLength="6"
                />
                <p className="text-white/60 text-xs mt-1">
                  Enter a binary string (0s and 1s only, max 6 bits)
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={runAlgorithm}
                  disabled={isRunning || !hiddenString}
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

            {/* Algorithm Steps */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-white mb-4">Algorithm Steps</h4>
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
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="quantum-card"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Measurement Results</h3>
            
            <div className="bg-white/5 rounded-xl p-6 mb-6" style={{ height: '300px' }}>
              <Bar data={chartData} options={chartOptions} />
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

            {/* Theory Explanation */}
            <div className="bg-white/5 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">How It Works</h4>
              <div className="space-y-3 text-white/80 text-sm">
                <p>
                  <strong className="text-purple-300">Oracle Function:</strong> f(x) = s·x where s is the hidden string and · is bitwise dot product mod 2.
                </p>
                <p>
                  <strong className="text-purple-300">Quantum Parallelism:</strong> All possible inputs are queried simultaneously in superposition.
                </p>
                <p>
                  <strong className="text-purple-300">Phase Kickback:</strong> The oracle encodes the hidden string in the relative phases of the quantum amplitudes.
                </p>
                <p>
                  <strong className="text-purple-300">Interference:</strong> Final Hadamard gates create constructive interference only for the hidden string state.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default BernsteinVazirani
