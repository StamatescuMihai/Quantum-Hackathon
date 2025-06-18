import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, BookOpen, Calculator, Brain, Cpu, Atom } from 'lucide-react'
import AlgorithmCard from '../components/AlgorithmCard'

const Home = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const algorithms = [
    {
      title: "Grover's Algorithm",
      description: "Search unsorted databases with quadratic speedup. Perfect introduction to quantum advantage.",
      complexity: "O(√N)",
      difficulty: "Beginner",
      estimatedTime: "15 min",
      link: "/algorithms/grover",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Deutsch-Jozsa",
      description: "Determine if a function is constant or balanced with exponential speedup.",
      complexity: "O(1)",
      difficulty: "Intermediate",
      estimatedTime: "20 min",
      link: "/algorithms/deutsch-jozsa",
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Bernstein-Vazirani",
      description: "Find hidden bit strings using quantum parallelism and interference.",
      complexity: "O(1)",
      difficulty: "Intermediate",
      estimatedTime: "18 min",
      link: "/algorithms/bernstein-vazirani",
      color: "from-purple-500 to-violet-600"
    },
    {
      title: "Simon's Algorithm",
      description: "Discover hidden periods in functions with exponential quantum advantage.",
      complexity: "O(n)",
      difficulty: "Advanced",
      estimatedTime: "25 min",
      link: "/algorithms/simon",
      color: "from-red-500 to-pink-600"
    },
    {
      title: "Shor's Algorithm",
      description: "Quantum algorithm for integer factorization with exponential speedup. Breaks classical cryptography and demonstrates the power of quantum period finding.",
      complexity: "O((log N)^3)",
      difficulty: "Advanced",
      estimatedTime: "30 min",
      link: "/algorithms/shor",
      color: "from-orange-500 to-yellow-600"
  }
  ]

  const features = [
    {
      icon: Zap,
      title: "Interactive Visualizations",
      description: "See quantum algorithms in action with real-time circuit diagrams and state evolution."
    },
    {
      icon: Brain,
      title: "Educational Content",
      description: "Learn quantum concepts through guided tutorials and comprehensive explanations."
    },
    {
      icon: Cpu,
      title: "Quantum Simulator",
      description: "Experiment with quantum circuits and observe quantum mechanical phenomena."
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-gradient-to-br from-quantum-400 to-quantum-600 rounded-2xl">
                <Atom className="w-12 h-12 text-white animate-spin" style={{ animationDuration: '10s' }} />
              </div>
            </div>
              <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              Step into the{' '}
              <span className="text-glint">
                Quantum Universe
              </span>
            </h1>
            
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover the revolutionary algorithms that will power tomorrow's computers. 
              Learn quantum computing through interactive visualizations and hands-on experimentation.
            </p>            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/algorithms" className="quantum-button quantum-button-glow group">
                  <BookOpen className="w-5 h-5 mr-3" />
                  Start Learning
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/simulator" className="quantum-button-secondary group">
                  <Calculator className="w-5 h-5 mr-3" />
                  Try Simulator
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="ml-3"
                  >
                    <Cpu className="w-5 h-5" />
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Floating particles animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-quantum-400 rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-white mb-4">
              Why Learn Quantum Computing?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-white/70 max-w-2xl mx-auto">
              Quantum computing represents a fundamental shift in how we process information, 
              offering exponential speedups for specific problems.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="quantum-card text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-quantum-500 to-quantum-700 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Algorithms Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Featured Quantum Algorithms
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Start your quantum journey with these fundamental algorithms that demonstrate 
              the power of quantum computation.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            {algorithms.map((algorithm, index) => (
              <motion.div key={index} variants={itemVariants}>
                <AlgorithmCard {...algorithm} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="quantum-card text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Dive into Quantum Computing?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join thousands of learners exploring the quantum frontier. 
              No prior quantum knowledge required!
            </p>            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/algorithms" className="quantum-button quantum-button-glow group">
                  <BookOpen className="w-5 h-5 mr-3" />
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/about" className="quantum-button-secondary group">
                  <Brain className="w-5 h-5 mr-3" />
                  Learn More
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
