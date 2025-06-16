import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Target, Lightbulb, BookOpen, Github, Mail, Heart } from 'lucide-react'

const About = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const features = [
    {
      icon: Target,
      title: "Educational Mission",
      description: "Making quantum computing accessible through interactive visualizations and hands-on learning experiences."
    },
    {
      icon: Lightbulb,
      title: "Innovative Approach",
      description: "Combining theoretical knowledge with practical experimentation to build intuitive understanding."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Open-source project built by quantum enthusiasts for learners at all levels."
    }
  ]

  const team = [
    {
      name: "Romaniuc Albert-Iulian",
      role: "Quantum Algorithms Researcher",
      description: "First year student enrolled in National University Politehnica Bucharest. Algebra and quantum expert.",
      image: "images/images.jpg"
    },
    {
      name: "Visinescu Nicolas-Catalin",
      role: "System Engineer and Developer",
      description: "Python developer, system manager.",
      image: "images/images.jpg"
    },
    {
      name: "Stamatescu Mihai",
      role: "Backend Developer and Frontend Developer",
      description: "Python developer with expertise in quantum simulation, API development and React language.",
      image: "images/images.jpg"
    },
    {
      name: "Cavescu Dumitru-Andrei",
      role: "",
      description: "",
      image: "images/images.jpg"
    },
    {
      name: "Tanasescu Razvan",
      role: "",
      description: "",
      image: "images/images.jpg"
    }
  ]

  const technologies = [
    "React & Modern JavaScript",
    "Python & FastAPI",
    "Qiskit & Quantum Simulation",
    "Chart.js & Data Visualization",
    "Tailwind CSS & Modern Design",
    "Docker & Cloud Deployment"
  ]

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            About Quantum Explorer
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Bridging the gap between quantum theory and practical understanding through 
            interactive education and cutting-edge visualization technology.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="quantum-card">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
                <p className="text-white/80 text-lg leading-relaxed mb-6">
                  Quantum computing represents one of the most significant technological 
                  advances of our time, yet it remains largely inaccessible to most learners. 
                  Our platform breaks down complex quantum concepts into digestible, 
                  interactive experiences.
                </p>
                <p className="text-white/70 leading-relaxed">
                  We believe that everyone should have the opportunity to understand and 
                  experiment with quantum algorithms, regardless of their background. 
                  Through visualization, simulation, and guided learning, we make the quantum 
                  world tangible and exciting.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="w-64 h-64 bg-gradient-to-br from-quantum-400 to-quantum-600 rounded-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <BookOpen className="w-16 h-16 mx-auto mb-4" />
                    <div className="text-2xl font-bold">Learn</div>
                    <div className="text-lg">Experiment</div>
                    <div className="text-lg">Discover</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Features */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="quantum-card text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-quantum-500 to-quantum-700 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <div className="quantum-card">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Built with Modern Technology</h2>
            <p className="text-white/80 text-center mb-8 max-w-2xl mx-auto">
              Our platform leverages cutting-edge web technologies and quantum simulation libraries 
              to provide an unparalleled learning experience.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {technologies.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-white/10 rounded-lg p-4 text-center border border-white/20"
                >
                  <span className="text-white/90 font-medium">{tech}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Meet the Team</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="quantum-card text-center w-full sm:w-80 max-w-sm"
              >                <div className="w-24 h-24 bg-gradient-to-br from-quantum-400 to-quantum-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Users className="w-12 h-12 text-white" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                <p className="text-quantum-300 font-medium mb-4">{member.role}</p>
                <p className="text-white/70 text-sm leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Open Source & Community */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-16"
        >
          <div className="quantum-card text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Open Source & Community</h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              This project is open source and welcomes contributions from the quantum computing community. 
              Together, we can make quantum education accessible to everyone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href="https://github.com/StamatescuMihai/Quantum-Hackathon"
                className="quantum-button flex items-center justify-center"
              >
                <Github className="w-5 h-5 mr-2" />
                View on GitHub
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 rounded-lg p-6">
                <div className="text-2xl font-bold text-quantum-300 mb-2">500+</div>
                <div className="text-white/70">GitHub Stars</div>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <div className="text-2xl font-bold text-quantum-300 mb-2">50+</div>
                <div className="text-white/70">Contributors</div>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <div className="text-2xl font-bold text-quantum-300 mb-2">10k+</div>
                <div className="text-white/70">Learners Reached</div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <div className="quantum-card">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Future Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Coming Soon</h3>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-center">
                    <Heart className="w-4 h-4 text-red-400 mr-2" />
                    Shor's Algorithm Implementation
                  </li>
                  <li className="flex items-center">
                    <Heart className="w-4 h-4 text-red-400 mr-2" />
                    Quantum Machine Learning Modules
                  </li>
                  <li className="flex items-center">
                    <Heart className="w-4 h-4 text-red-400 mr-2" />
                    Real Quantum Hardware Integration
                  </li>
                  <li className="flex items-center">
                    <Heart className="w-4 h-4 text-red-400 mr-2" />
                    Advanced Circuit Builder
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Long-term Vision</h3>
                <p className="text-white/70 leading-relaxed">
                  Our goal is to become the go-to platform for quantum education, 
                  supporting everything from basic concepts to advanced research. 
                  We envision a future where quantum literacy is as common as 
                  classical computer literacy today.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default About
