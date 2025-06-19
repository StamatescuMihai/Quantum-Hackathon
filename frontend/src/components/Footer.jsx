import React from 'react'
import { Github, Mail, BookOpen, Heart, Cpu, Info, Book } from 'lucide-react'
import BackendStatus from './BackendStatus'

const Footer = () => {
  return (
    <footer className="bg-black/30 backdrop-blur-lg border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-quantum-400" />
              Quantum Core
            </h3>
            <p className="text-white/70 mb-4">
              An interactive educational platform for learning quantum computing algorithms.<br />
              Explore the fascinating world of quantum mechanics through visualization and hands-on experimentation.
            </p>
            <div className="flex space-x-4 mt-2">
              <a
                href="https://github.com/StamatescuMihai/Quantum-Hackathon"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="mailto:contact@quantumcore.com"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/algorithms/grover" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                  <BookOpen className="w-4 h-4" /> Grover's Algorithm
                </a>
              </li>
              <li>
                <a href="/algorithms/deutsch-jozsa" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                  <BookOpen className="w-4 h-4" /> Deutsch-Jozsa
                </a>
              </li>
              <li>
                <a href="/exercises" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                  <Cpu className="w-4 h-4" /> Circuit Exercises
                </a>
              </li>
              <li>
                <a href="/simulator" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                  <Cpu className="w-4 h-4" /> Quantum Simulator
                </a>
              </li>
              <li>
                <a href="/about" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                  <Info className="w-4 h-4" /> About Project
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/StamatescuMihai/Quantum-Hackathon/tree/main/shared/docs"
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Book className="w-4 h-4" /> Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm flex items-center gap-1">
            © 2025 Quantum Core. Built for educational purposes.
            <span className="flex items-center ml-2">
              Made with <Heart className="w-4 h-4 text-pink-500 mx-1" /> by QHackers!
            </span>
          </p>
          {/* Backend Status */}
          <div className="flex items-center">
            <BackendStatus />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer