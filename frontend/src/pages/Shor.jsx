import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CircuitVisualizer from '../components/CircuitVisualizer'
import { Play, RotateCcw, ChevronRight, Cpu, Layers } from 'lucide-react'
import { Bar } from 'react-chartjs-2'
import { runShorAlgorithm } from '../services/api'

const Shor = () => {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const [numQubits, setNumQubits] = useState(4)
  const [N, setN] = useState(15)
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [result, setResult] = useState('')
  const [probabilities, setProbabilities] = useState(new Array(16).fill(0))
  const [apiResult, setApiResult] = useState(null)
  const [error, setError] = useState('')
  const [isUsingBackend, setIsUsingBackend] = useState(true)
  const [period, setPeriod] = useState(null)

  const steps = [
    "Initialize qubits in |0⟩ state",
    "Apply Hadamard gates (superposition)",
    "Apply modular exponentiation (oracle)",
    "Apply inverse QFT",
    "Measure and extract period",
    "Compute factors of N"
  ]

  // Simulare locală a probabilităților pentru pași
  const updateQuantumState = (step) => {
    let newProbs = new Array(Math.pow(2, numQubits)).fill(0)
    switch (step) {
      case 0:
        newProbs[0] = 1
        break
      case 1:
        newProbs.fill(1 / newProbs.length)
        break
      case 2:
        // Simulare: distribuție periodică (exemplu pentru N=15, a=2, r=4)
        for (let i = 0; i < newProbs.length; i += 4) newProbs[i] = 0.25
        break
      case 3:
        // După QFT invers: peak pe multiplii de N/r (ex: 0, 4, 8, 12)
        for (let i = 0; i < newProbs.length; i += 4) newProbs[i] = 0.7
        break
      case 4:
        // Măsurare: peak pe un multiplu, restul mici
        newProbs.fill(0.02)
        newProbs[4] = 0.84
        break
      case 5:
        // Final: la fel ca măsurarea
        newProbs.fill(0.02)
        newProbs[4] = 0.84
        break
      default:
        break
    }
    setProbabilities([...newProbs])
  }

  useEffect(() => {
    if (isRunning) {
      const timer = setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1)
          updateQuantumState(currentStep + 1)
        } else {
          setIsRunning(false)
          if (isUsingBackend && apiResult) {
            if (apiResult.success && apiResult.factors) {
              setResult(`Factors of ${N}: ${apiResult.factors.join(', ')}`)
              setPeriod(apiResult.period)
              if (apiResult.probabilities) setProbabilities(apiResult.probabilities)
            }
          } else if (!isUsingBackend) {
            setResult(`Example: Factors of ${N} are 3 and 5`)
            setPeriod(4)
          }
        }
      }, 1800)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line
  }, [isRunning, currentStep, isUsingBackend, apiResult, N, steps.length])

  const runAlgorithm = async () => {
    try {
      setIsRunning(true)
      setCurrentStep(0)
      setResult('')
      setError('')
      setApiResult(null)
      setPeriod(null)
      updateQuantumState(0)
      if (isUsingBackend) {
        const data = await runShorAlgorithm(N, numQubits)
        setApiResult(data)
      }
    } catch (error) {
      setError('Error connecting to backend. Using local simulation.')
      setIsUsingBackend(false)
    }
  }

  const resetAlgorithm = () => {
    setIsRunning(false)
    setCurrentStep(0)
    setResult('')
    setError('')
    setApiResult(null)
    setPeriod(null)
    setProbabilities(new Array(Math.pow(2, numQubits)).fill(0))
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
          i === 4 ? 'rgba(251,191,36,0.8)' : 'rgba(59,130,246,0.8)'
        ),
        borderColor: probabilities.map((_, i) =>
          i === 4 ? 'rgba(251,191,36,1)' : 'rgba(59,130,246,1)'
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
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: 'rgba(255,255,255,0.8)' }
      },
      x: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: 'rgba(255,255,255,0.8)' }
      }
    },
    plugins: {
      legend: { labels: { color: 'rgba(255,255,255,0.8)' } }
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-2xl">
              <Cpu className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Shor's Algorithm</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Factorizes large numbers exponentially faster than classical algorithms. 
            Demonstrates quantum period finding and threatens classical cryptography.
          </p>
        </motion.div>

        {/* Algorithm Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="quantum-card mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Period Finding</h3>
              <p className="text-white/70 text-sm">Finds the period of modular exponentiation</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Cpu className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Exponential Speedup</h3>
              <p className="text-white/70 text-sm">Quantum algorithm for integer factorization</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Cryptography Impact</h3>
              <p className="text-white/70 text-sm">Breaks RSA and classical cryptosystems</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Algorithm Steps */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="quantum-card">
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
                      ? 'bg-orange-500/20 border-orange-500/50'
                      : 'bg-white/5 border-white/10'
                  } border`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                    index <= currentStep
                      ? 'bg-orange-500 text-white'
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
                    <ChevronRight className="w-4 h-4 ml-auto text-orange-400 animate-pulse" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Controls */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Controls</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Number to Factor (N):
                    </label>
                    <select
                      value={N}
                      onChange={e => setN(parseInt(e.target.value))}
                      disabled={isRunning}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value={15} className="bg-gray-800">15 (3 × 5)</option>
                      <option value={21} className="bg-gray-800">21 (3 × 7)</option>
                      <option value={35} className="bg-gray-800">35 (5 × 7)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Number of Qubits:
                    </label>
                    <select
                      value={numQubits}
                      onChange={e => {
                        const newQubits = parseInt(e.target.value)
                        setNumQubits(newQubits)
                        setProbabilities(new Array(Math.pow(2, newQubits)).fill(0))
                      }}
                      disabled={isRunning}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value={3} className="bg-gray-800">3 qubits</option>
                      <option value={4} className="bg-gray-800">4 qubits</option>
                    </select>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <label className="flex items-center text-white/80 text-sm">
                    <input
                      type="checkbox"
                      checked={isUsingBackend}
                      onChange={e => setIsUsingBackend(e.target.checked)}
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
                    {isRunning ? 'Factoring...' : 'Run Shor'}
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
            {period && (
              <div className="mt-4 bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                <p className="text-orange-300 text-sm">
                  <strong>Period found: {period}</strong>
                </p>
              </div>
            )}
          </motion.div>

          {/* Results & Chart */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="quantum-card">
            <h3 className="text-2xl font-bold text-white mb-6">Factoring Results</h3>
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
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-lg p-4 mb-6">
                <h4 className="text-lg font-semibold text-orange-300 mb-2">Factoring Result</h4>
                <p className="text-white">{result}</p>
              </motion.div>
            )}
            {apiResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                <h4 className="text-lg font-semibold text-blue-300 mb-3">Backend Quantum Simulation Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/80">
                      <strong className="text-blue-300">Success:</strong> {apiResult.success ? 'Yes' : 'No'}
                    </p>
                    <p className="text-white/80">
                      <strong className="text-blue-300">Factors:</strong> {apiResult.factors ? apiResult.factors.join(', ') : '-'}
                    </p>
                    <p className="text-white/80">
                      <strong className="text-blue-300">Period (r):</strong> {apiResult.period || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/80">
                      <strong className="text-blue-300">Measurement Counts:</strong>
                    </p>
                    <div className="text-xs bg-black/30 rounded p-2 mt-1 max-h-20 overflow-y-auto">
                      {apiResult.measurement_counts && Object.entries(apiResult.measurement_counts).map(([state, count]) => (
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
                  <strong className="text-orange-300">Quantum Period Finding:</strong> Finds the period r of f(x) = a^x mod N.
                </p>
                <p>
                  <strong className="text-orange-300">Quantum Fourier Transform:</strong> Used to extract the period from the quantum state.
                </p>
                <p>
                  <strong className="text-orange-300">Classical Postprocessing:</strong> Uses the period to compute the non-trivial factors of N.
                </p>
                <p>
                  <strong className="text-orange-300">Cryptographic Impact:</strong> Efficiently factors large numbers, breaking RSA encryption.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Circuit */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="quantum-card">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-4xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Quantum Circuit</h3>
              <div className="bg-white/5 rounded-xl p-6 flex items-center justify-center">
                <CircuitVisualizer
                  algorithm="shor"
                  numQubits={numQubits}
                  currentStep={currentStep}
                  isRunning={isRunning}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Shor