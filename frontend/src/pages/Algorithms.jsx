import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import AlgorithmCard from '../components/AlgorithmCard'
import { BookOpen, Search, Clock, Brain } from 'lucide-react'

const Algorithms = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const algorithms = [
    {
      title: "Grover's Algorithm",
      description: "Quantum search algorithm that provides quadratic speedup over classical search. Fundamental for understanding quantum advantage in search problems.",
      complexity: "O(√N)",
      difficulty: "Beginner",
      estimatedTime: "15 min",
      link: "/algorithms/grover",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Deutsch-Jozsa Algorithm",
      description: "Determines if a black-box function is constant or balanced with exponential speedup. Historical importance as first quantum algorithm to show exponential advantage.",
      complexity: "O(1)",
      difficulty: "Intermediate",
      estimatedTime: "20 min",
      link: "/algorithms/deutsch-jozsa",
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Bernstein-Vazirani Algorithm",
      description: "Finds hidden bit strings using quantum parallelism. Demonstrates linear speedup and quantum interference principles.",
      complexity: "O(1)",
      difficulty: "Intermediate",
      estimatedTime: "18 min",
      link: "/algorithms/bernstein-vazirani",
      color: "from-purple-500 to-violet-600"
    },
    {
      title: "Simon's Algorithm",
      description: "Discovers hidden periods in functions with exponential quantum advantage. Precursor to Shor's algorithm and important for cryptography.",
      complexity: "O(n)",
      difficulty: "Advanced",
      estimatedTime: "25 min",
      link: "/algorithms/simon",
      color: "from-red-500 to-pink-600"
    }
  ]

  const categories = [
    {
      icon: Search,
      title: "Search Algorithms",
      description: "Quantum algorithms that provide speedup for search problems",
      algorithms: ["Grover's Algorithm"]
    },
    {
      icon: Brain,
      title: "Function Analysis",
      description: "Algorithms that analyze properties of black-box functions",
      algorithms: ["Deutsch-Jozsa", "Bernstein-Vazirani"]
    },
    {
      icon: Clock,
      title: "Period Finding",
      description: "Algorithms that find hidden periods and structures",
      algorithms: ["Simon's Algorithm"]
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-br from-quantum-400 to-quantum-600 rounded-2xl">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Quantum Algorithms
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Explore fundamental quantum algorithms that demonstrate quantum computational advantages. 
            Each algorithm includes interactive visualizations, step-by-step explanations, and hands-on experiments.
          </p>
        </motion.div>

        {/* Algorithm Categories */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Algorithm Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="quantum-card text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-quantum-500 to-quantum-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{category.title}</h3>
                  <p className="text-white/70 text-sm mb-4">{category.description}</p>
                  <div className="text-xs text-quantum-300">
                    {category.algorithms.join(', ')}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Learning Path */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="quantum-card">
            <h2 className="text-2xl font-bold text-white mb-6">Recommended Learning Path</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {algorithms.map((algorithm, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-quantum-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{algorithm.title}</h4>
                    <p className="text-white/60 text-sm">{algorithm.difficulty}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-quantum-500/20 rounded-lg border border-quantum-500/30">
              <p className="text-white/80 text-sm">
                💡 <strong>Tip:</strong> Start with Grover's Algorithm if you're new to quantum computing. 
                It provides an intuitive introduction to quantum advantage while building essential concepts.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Algorithm Cards */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Interactive Algorithm Explorer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {algorithms.map((algorithm, index) => (
              <motion.div key={index} variants={itemVariants}>
                <AlgorithmCard {...algorithm} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Additional Resources */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="quantum-card">
            <h2 className="text-2xl font-bold text-white mb-6">Additional Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Theoretical Background</h3>
                <ul className="space-y-2 text-white/70">
                  <li>• Quantum mechanics principles</li>
                  <li>• Linear algebra foundations</li>
                  <li>• Quantum circuit model</li>
                  <li>• Quantum gates and operations</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Practical Applications</h3>
                <ul className="space-y-2 text-white/70">
                  <li>• Database search optimization</li>
                  <li>• Cryptographic analysis</li>
                  <li>• Machine learning acceleration</li>
                  <li>• Optimization problems</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default Algorithms
