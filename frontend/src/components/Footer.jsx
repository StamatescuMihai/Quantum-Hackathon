import React from 'react'
import { Github, Mail, BookOpen, Heart } from 'lucide-react'
import BackendStatus from './BackendStatus'

const Footer = () => {
  return (
    <footer className="bg-black/30 backdrop-blur-lg border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">
              Quantum Core
            </h3>
            <p className="text-white/70 mb-4">
              An interactive educational platform for learning quantum computing algorithms. 
              Explore the fascinating world of quantum mechanics through visualization and hands-on experimentation.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/StamatescuMihai/Quantum-Hackathon"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/algorithms/grover" className="text-white/60 hover:text-white transition-colors">
                  Grover's Algorithm
                </a>
              </li>
              <li>
                <a href="/algorithms/deutsch-jozsa" className="text-white/60 hover:text-white transition-colors">
                  Deutsch-Jozsa
                </a>
              </li>
              <li>
                <a href="/simulator" className="text-white/60 hover:text-white transition-colors">
                  Quantum Simulator
                </a>
              </li>
              <li>
                <a href="/about" className="text-white/60 hover:text-white transition-colors">
                  About Project
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com/StamatescuMihai/Quantum-Hackathon/tree/main/shared/docs" className="text-white/60 hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            © 2025 Quantum Core. Built for educational purposes.
          </p>
        {/* Backend Status */}
          <div className="hidden md:flex items-center mr-4">
            <BackendStatus />
          </div> 
        </div>
      </div>
    </footer>
  )
}

export default Footer
