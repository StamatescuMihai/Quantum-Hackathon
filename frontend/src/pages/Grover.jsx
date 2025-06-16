import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CircuitVisualizer from '../components/CircuitVisualizer'
import { Play, RotateCcw, ChevronRight, Info, Target, Zap } from 'lucide-react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const Grover = () => {
  const [targetItem, setTargetItem] = useState(3)
  const [iterations, setIterations] = useState(2)
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [amplitudes, setAmplitudes] = useState(new Array(8).fill(1/Math.sqrt(8)))
  const [probabilities, setProbabilities] = useState(new Array(8).fill(1/8))

  const steps = [
    "Initialize qubits in |0⟩ state",
    "Apply Hadamard gates for superposition", 
    "Apply Oracle (marks target item)",
    "Apply Diffusion operator",
    "Measure final state"
  ]

  useEffect(() => {
    if (isRunning) {
      const timer = setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1)
          updateQuantumState(currentStep + 1)
        } else {
          setIsRunning(false)
        }
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isRunning, currentStep])

  const updateQuantumState = (step) => {
    const numStates = 8
    let newAmplitudes = [...amplitudes]

    switch (step) {
      case 1: // Hadamards - uniform superposition
        newAmplitudes = new Array(numStates).fill(1/Math.sqrt(numStates))
        break
      case 2: // Oracle - flip target amplitude
        newAmplitudes[targetItem] *= -1
        break
      case 3: // Diffusion operator - invert around average
        const average = newAmplitudes.reduce((sum, amp) => sum + amp, 0) / numStates
        newAmplitudes = newAmplitudes.map(amp => 2 * average - amp)
        break
      case 4: // Final measurement probabilities
        // Apply additional Grover iterations if specified
        for (let iter = 1; iter < iterations; iter++) {
          // Oracle
          newAmplitudes[targetItem] *= -1
          // Diffusion
          const avg = newAmplitudes.reduce((sum, amp) => sum + amp, 0) / numStates
          newAmplitudes = newAmplitudes.map(amp => 2 * avg - amp)
        }
        break
    }

    setAmplitudes(newAmplitudes)
    setProbabilities(newAmplitudes.map(amp => amp * amp))
  }

  const runAlgorithm = () => {
    setIsRunning(true)
    setCurrentStep(0)
    // Reset to initial state
    setAmplitudes(new Array(8).fill(0).map((_, i) => i === 0 ? 1 : 0))
    setProbabilities(new Array(8).fill(0).map((_, i) => i === 0 ? 1 : 0))
  }

  const resetAlgorithm = () => {
    setIsRunning(false)
    setCurrentStep(0)
    setAmplitudes(new Array(8).fill(1/Math.sqrt(8)))
    setProbabilities(new Array(8).fill(1/8))
  }

  const chartData = {
    labels: Array.from({length: 8}, (_, i) => `|${i.toString(2).padStart(3, '0')}⟩`),
    datasets: [
      {
        label: 'Measurement Probability',
        data: probabilities,
        backgroundColor: probabilities.map((_, i) => 
          i === targetItem ? 'rgba(34, 197, 94, 0.8)' : 'rgba(102, 126, 234, 0.8)'
        ),
        borderColor: probabilities.map((_, i) => 
          i === targetItem ? 'rgba(34, 197, 94, 1)' : 'rgba(102, 126, 234, 1)'
        ),
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
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl">
              <Target className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Grover's Algorithm
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Search an unsorted database with quadratic speedup. 
            While classical algorithms require O(N) steps, Grover's algorithm only needs O(√N).
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
                <Zap className="w-6 h-6 text-green-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Complexity</h3>
              </div>
              <div className="text-2xl font-mono text-green-400 mb-2">O(√N)</div>
              <p className="text-white/70 text-sm">
                Quadratic speedup over classical O(N) search
              </p>
            </div>

            <div className="quantum-card">
              <div className="flex items-center mb-4">
                <Target className="w-6 h-6 text-blue-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Success Rate</h3>
              </div>
              <div className="text-2xl font-mono text-blue-400 mb-2">~100%</div>
              <p className="text-white/70 text-sm">
                High probability with optimal iterations
              </p>
            </div>

            <div className="quantum-card">
              <div className="flex items-center mb-4">
                <Info className="w-6 h-6 text-purple-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Qubits Used</h3>
              </div>
              <div className="text-2xl font-mono text-purple-400 mb-2">3</div>
              <p className="text-white/70 text-sm">
                Searching through 8 possible states
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
              algorithm="grover"
              qubits={3}
              steps={steps}
              isAnimating={isRunning}
              currentStep={currentStep}
            />
            
            {/* Controls */}
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Target Item (0-7)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="7"
                    value={targetItem}
                    onChange={(e) => setTargetItem(parseInt(e.target.value))}
                    className="w-full"
                    disabled={isRunning}
                  />
                  <div className="text-center text-white/70 mt-1">
                    Item {targetItem} (|{targetItem.toString(2).padStart(3, '0')}⟩)
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Iterations (1-5)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={iterations}
                    onChange={(e) => setIterations(parseInt(e.target.value))}
                    className="w-full"
                    disabled={isRunning}
                  />
                  <div className="text-center text-white/70 mt-1">
                    {iterations} iteration{iterations > 1 ? 's' : ''}
                  </div>
                </div>
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

            {/* Probability Chart */}
            <div className="h-64 mb-6">
              <Bar data={chartData} options={chartOptions} />
            </div>

            {/* State Information */}
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">Current Quantum State:</h4>
                <div className="quantum-state text-sm">
                  |ψ⟩ = {amplitudes.map((amp, i) => {
                    if (Math.abs(amp) < 0.001) return null
                    const sign = i === 0 || amp < 0 ? '' : '+'
                    const coefficient = Math.abs(amp).toFixed(3)
                    const state = i.toString(2).padStart(3, '0')
                    return `${sign}${coefficient}|${state}⟩`
                  }).filter(Boolean).join(' ')}
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">
                  Success Probability: 
                  <span className="text-green-400 ml-2">
                    {(probabilities[targetItem] * 100).toFixed(1)}%
                  </span>
                </h4>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${probabilities[targetItem] * 100}%` }}
                  />
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
          <h3 className="text-2xl font-bold text-white mb-6">How Grover's Algorithm Works</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Key Concepts</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="text-white font-medium mb-2">1. Superposition</h5>
                  <p className="text-white/70 text-sm">
                    Hadamard gates create equal superposition of all possible states, 
                    allowing quantum parallelism to evaluate all items simultaneously.
                  </p>
                </div>
                <div>
                  <h5 className="text-white font-medium mb-2">2. Oracle Function</h5>
                  <p className="text-white/70 text-sm">
                    The oracle flips the amplitude of the target item, marking it 
                    without revealing which item it is.
                  </p>
                </div>
                <div>
                  <h5 className="text-white font-medium mb-2">3. Amplitude Amplification</h5>
                  <p className="text-white/70 text-sm">
                    The diffusion operator rotates amplitudes to increase the 
                    probability of measuring the marked item.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Algorithm Steps</h4>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-quantum-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-white/70 text-sm">{step}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                <p className="text-white/80 text-sm">
                  <strong>Optimal Iterations:</strong> For N items, approximately π√N/4 iterations 
                  maximize success probability. For 8 items, about 2 iterations are optimal.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default Grover
