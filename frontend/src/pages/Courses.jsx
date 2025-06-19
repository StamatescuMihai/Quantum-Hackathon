import React, { useEffect } from 'react';
import { motion } from 'framer-motion'
import CoursesCard from '../components/CoursesCard'
import { GraduationCap} from 'lucide-react'


const Courses = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, );

  const courses = [
    {
      title: "1. Introduction",
      description: "Introduction in the basics of Quantum.",
      estimatedTime: "15 min",
      link: "/courses/intro",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "2. Quantum Logic gates",
      description: "An explanation of the most basic and used Quantum gates.",
      estimatedTime: "15 min",
      link: "",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "3. Basic algorithms",
      description: "Here we learn about the most basics algorithms in the world of Quantum. Algorithms such as Grover and Bernstein-Vazirani.",
      estimatedTime: "15 min",
      link: "",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "4. Quantum Entanglement",
      description: "In this course we take a deep dive into what is Quantum entanglement, how it works, and what are its uses",
      estimatedTime: "15 min",
      link: "",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "5. Quantum Key Distribution",
      description: "A course aimed to give a solid understanding about what QKD is and how Quantum infrastructure works.",
      estimatedTime: "15 min",
      link: "",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Other entertaining Quantum lectures",
      description: "Quantum is fun and this just proves it.",
      estimatedTime: "15 min",
      link: "",
      color: "from-green-500 to-emerald-600"
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
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Quantum Courses
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Explore our selection of Quantum courses meant to give you a very low-level, basic understanding of Quantum.
            Each course has different learning materials, each equipped with a quiz at the end of it.
          </p>
        </motion.div>

        {/* Courses Cards */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Quantum Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course, index) => (
              <motion.div key={index} variants={itemVariants}>
                <CoursesCard {...course} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default Courses