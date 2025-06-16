import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CircuitVisualizer from '../components/CircuitVisualizer'
import { Play, RotateCcw, ChevronRight, Search, Target, Layers } from 'lucide-react'
import { Bar } from 'react-chartjs-2'

const Grover = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [numQubits, setNumQubits] = useState(3)
  const [targetItem, setTargetItem] = useState(5)
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentIteration, setCurrentIteration] = useState(0)
  const [result, setResult] = useState('')
  const [probabilities, setProbabilities] = useState(new Array(8).fill(0))

  const numItems = Math.pow(2, numQubits)
  const optimalIterations = Math.floor(Math.PI * Math.sqrt(numItems) / 4)

  const steps = [
    "Initialize qubits in |0⟩ state",
    "Apply Hadamard gates for uniform superposition",
    "Apply Oracle (marks target state)",
    "Apply Diffusion operator (amplitude amplification)",
    "Repeat Oracle + Diffusion",
    "Measure to find target item"
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
      }, 1800)
      return () => clearTimeout(timer)
    }
  }, [isRunning, currentStep])

  const updateQuantumState = (step) => {
    let newProbs = new Array(numItems).fill(0)
    
    switch (step) {
      case 0:
        // Initialize to |000⟩
        newProbs[0] = 1
        break
      case 1:
        // Uniform superposition after Hadamard gates
        newProbs.fill(1/numItems)
        break
      case 2:
      case 3:
      case 4:
        // Grover iterations - amplify target amplitude
        const iterations = Math.min(currentIteration + 1, optimalIterations)
        const angle = (2 * iterations + 1) * Math.asin(1/Math.sqrt(numItems))
        const targetProb = Math.pow(Math.sin(angle), 2)
        const otherProb = (1 - targetProb) / (numItems - 1)
        
        newProbs.fill(otherProb)
        newProbs[targetItem] = targetProb
        
        if (step === 4 && currentIteration < optimalIterations - 1) {
          setCurrentIteration(currentIteration + 1)
          setCurrentStep(2) // Go back to oracle step
        }
        break
      case 5:
        // Final measurement - high probability for target
        newProbs.fill(0.02)
        newProbs[targetItem] = 0.84
        break
    }
    
    setProbabilities([...newProbs])
  }

  const determineResult = () => {
    const successProb = probabilities[targetItem]
    setResult(`Target item |${targetItem.toString(2).padStart(numQubits, '0')}⟩ found with ${(successProb * 100).toFixed(1)}% probability after ${optimalIterations} iterations`)
  }

  const runAlgorithm = async () => {
    try {
      setIsRunning(true)
      setCurrentStep(0)
      setCurrentIteration(0)
      setResult('')
      updateQuantumState(0)
      
      // Call backend API
      const response = await fetch('/api/grover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          num_qubits: numQubits,
          target_item: targetItem
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Grover result:', data)
      }
    } catch (error) {
      console.error('Error running Grover algorithm:', error)
    }
  }

  const resetAlgorithm = () => {
    setIsRunning(false)
    setCurrentStep(0)
    setCurrentIteration(0)
    setResult('')
    setProbabilities(new Array(numItems).fill(0))
  }

  const chartData = {
    labels: Array.from({ length: probabilities.length }, (_, i) => 
      `|${i.toString(2).padStart(numQubits, '0')}⟩`
    ),
    datasets: [
      {
        label: 'Measurement Probability',
        data: probabilities,
        backgroundColor: probabilities.map((_, i) => 
          i === targetItem ? 'rgba(34, 197, 94, 0.8)' : 'rgba(59, 130, 246, 0.8)'
        ),
        borderColor: probabilities.map((_, i) => 
          i === targetItem ? 'rgba(34, 197, 94, 1)' : 'rgba(59, 130, 246, 1)'
        ),
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
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl">
              <Search className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Grover's Algorithm
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Search unsorted databases with quadratic speedup. Find the needle in the haystack 
            using quantum amplitude amplification in O(√N) time instead of classical O(N).
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
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Search</h3>
              <p className="text-white/70 text-sm">Find marked items in unsorted quantum database</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Speedup</h3>
              <p className="text-white/70 text-sm">O(√N) vs classical O(N) - Quadratic improvement</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Iterations</h3>
              <p className="text-white/70 text-sm">~π√N/4 optimal iterations for maximum success</p>
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
              {(() => {
                try {
                  return (
                    <CircuitVisualizer 
                      algorithm="grover"
                      numQubits={numQubits}
                      targetItem={targetItem}
                      currentStep={currentStep}
                      currentIteration={currentIteration}
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

            {/* Controls */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Number of Qubits:
                  </label>
                  <select
                    value={numQubits}
                    onChange={(e) => {
                      const newQubits = parseInt(e.target.value)
                      setNumQubits(newQubits)
                      setTargetItem(Math.min(targetItem, Math.pow(2, newQubits) - 1))
                      setProbabilities(new Array(Math.pow(2, newQubits)).fill(0))
                    }}
                    disabled={isRunning}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="2" className="bg-gray-800">2 qubits (4 items)</option>
                    <option value="3" className="bg-gray-800">3 qubits (8 items)</option>
                    <option value="4" className="bg-gray-800">4 qubits (16 items)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Target Item:
                  </label>
                  <select
                    value={targetItem}
                    onChange={(e) => setTargetItem(parseInt(e.target.value))}
                    disabled={isRunning}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {Array.from({ length: numItems }, (_, i) => (
                      <option key={i} value={i} className="bg-gray-800">
                        |{i.toString(2).padStart(numQubits, '0')}⟩ (item {i})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/70 text-sm">
                  <strong className="text-green-300">Optimal iterations:</strong> {optimalIterations} 
                  <span className="ml-4">
                    <strong className="text-green-300">Database size:</strong> {numItems} items
                  </span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={runAlgorithm}
                  disabled={isRunning}
                  className="flex-1 quantum-button flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isRunning ? 'Searching...' : 'Run Search'}
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
                        ? 'bg-green-500/20 border-green-500/50' 
                        : 'bg-white/5 border-white/10'
                    } border`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                      index <= currentStep 
                        ? 'bg-green-500 text-white' 
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
                      <ChevronRight className="w-4 h-4 ml-auto text-green-400 animate-pulse" />
                    )}
                  </motion.div>
                ))}
              </div>

              {currentIteration > 0 && (
                <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-300 text-sm">
                    <strong>Iteration {currentIteration + 1} of {optimalIterations}</strong> - Amplifying target amplitude
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="quantum-card"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Search Results</h3>
            
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
                className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4 mb-6"
              >
                <h4 className="text-lg font-semibold text-green-300 mb-2">Search Result</h4>
                <p className="text-white">{result}</p>
              </motion.div>
            )}

            {/* Theory Explanation */}
            <div className="bg-white/5 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">How It Works</h4>
              <div className="space-y-3 text-white/80 text-sm">
                <p>
                  <strong className="text-green-300">Oracle Function:</strong> Marks the target state by flipping its phase (multiply by -1).
                </p>
                <p>
                  <strong className="text-green-300">Diffusion Operator:</strong> Reflects amplitudes about their average, amplifying marked states.
                </p>
                <p>
                  <strong className="text-green-300">Amplitude Amplification:</strong> Each iteration rotates the amplitude vector, increasing target probability.
                </p>
                <p>
                  <strong className="text-green-300">Optimal Timing:</strong> After ~π√N/4 iterations, target amplitude is maximized.
                </p>
                <p>
                  <strong className="text-green-300">Practical Impact:</strong> Searching a database of 1 million items requires only ~1000 queries instead of 500,000.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Grover
