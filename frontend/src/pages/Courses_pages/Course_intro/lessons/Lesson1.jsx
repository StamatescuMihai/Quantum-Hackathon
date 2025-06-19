import React from 'react';
import { Atom, Zap, Brain, Target, TrendingUp, Microscope, Cpu, Database } from 'lucide-react';

const Lesson1 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Atom className="w-24 h-24 text-cyan-400 animate-pulse" />
                <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-cyan-400/30 animate-spin"></div>
              </div>
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Quantum Computing
            </h1>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Welcome to the future of computation. Discover how quantum mechanics is revolutionizing 
              our ability to solve the world's most complex problems.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        
        {/* What is Quantum Computing */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-indigo-800/50 to-purple-800/50 rounded-2xl p-8 backdrop-blur-sm border border-indigo-700/30">
            <div className="flex items-center mb-6">
              <Cpu className="w-8 h-8 text-cyan-400 mr-4" />
              <h2 className="text-3xl font-bold">What is Quantum Computing?</h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-gray-200">
              <p>
                Quantum computing is an emergent field of computer science and engineering that harnesses 
                the unique qualities of quantum mechanics to solve problems beyond the ability of even the 
                most powerful classical computers.
              </p>
              <p>
                The field encompasses quantum hardware and quantum algorithms. While still in development, 
                quantum technology will soon tackle complex problems that classical supercomputers can't 
                solve—or can't solve fast enough.
              </p>
              <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 rounded-xl p-6 border-l-4 border-cyan-400">
                <p className="text-cyan-200 font-medium">
                  <strong>The Quantum Advantage:</strong> Problems that might take classical computers 
                  thousands of years could be solved by quantum computers in minutes or hours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Practical Applications */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4">Practical Applications</h2>
            <p className="text-xl text-gray-300">Two primary domains where quantum computing excels</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-emerald-800/40 to-teal-800/40 rounded-2xl p-8 border border-emerald-600/30">
              <div className="flex items-center mb-6">
                <Microscope className="w-10 h-10 text-emerald-400 mr-4" />
                <h3 className="text-2xl font-bold">Physical System Modeling</h3>
              </div>
              <ul className="space-y-4 text-gray-200">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Chemistry & Materials:</strong> Discover new molecules for pharmaceuticals and engineering</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Physics Simulation:</strong> Model quantum mechanical systems with unprecedented accuracy</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-violet-800/40 to-purple-800/40 rounded-2xl p-8 border border-violet-600/30">
              <div className="flex items-center mb-6">
                <Database className="w-10 h-10 text-violet-400 mr-4" />
                <h3 className="text-2xl font-bold">Pattern Recognition</h3>
              </div>
              <ul className="space-y-4 text-gray-200">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Biology:</strong> Solve protein folding challenges and unlock biological mysteries</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Finance:</strong> Optimize portfolios and identify market patterns</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Market Potential */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-yellow-800/40 to-orange-800/40 rounded-2xl p-8 border border-yellow-600/30">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-yellow-400 mr-4" />
                <h3 className="text-3xl font-bold">Industry Growth</h3>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-yellow-400">$1.3T</div>
                <div className="text-yellow-200">by 2035</div>
              </div>
            </div>
            <p className="text-gray-200 text-lg">
              Leading companies including <strong>IBM, Amazon, Microsoft, Google</strong>, and startups 
              like <strong>Rigetti and IonQ</strong> are investing heavily in quantum technology, 
              driving toward a trillion-dollar industry.
            </p>
          </div>
        </section>

        {/* Four Key Principles */}
        <section>
          <div className="bg-gradient-to-r from-indigo-800/50 to-purple-800/50 rounded-2xl p-8 backdrop-blur-sm border border-indigo-700/30">
            <div className="flex items-center mb-6">
              <Atom className="w-8 h-8 text-cyan-400 mr-4" />
              <h2 className="text-3xl font-bold">Four Key Quantum Principles</h2>
            </div>
            <p className="text-lg text-gray-200 mb-8 leading-relaxed">
              At the smallest scales, the universe behaves very differently from our everyday experience. 
              Quantum computers harness these bizarre and counterintuitive behaviors by replacing traditional 
              binary bits with quantum bits (qubits) that exhibit unique properties:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 rounded-xl p-6 border border-red-600/20">
                <div className="flex items-center mb-3">
                  <Zap className="w-6 h-6 text-red-400 mr-3" />
                  <h4 className="text-xl font-bold text-red-300">Superposition</h4>
                </div>
                <p className="text-gray-200">Quantum bits exist in multiple states simultaneously, unlike classical bits that are either 0 or 1.</p>
              </div>

              <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-blue-600/20">
                <div className="flex items-center mb-3">
                  <Target className="w-6 h-6 text-blue-400 mr-3" />
                  <h4 className="text-xl font-bold text-blue-300">Entanglement</h4>
                </div>
                <p className="text-gray-200">Quantum particles become mysteriously connected, affecting each other instantaneously across distances.</p>
              </div>

              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-600/20">
                <div className="flex items-center mb-3">
                  <Brain className="w-6 h-6 text-green-400 mr-3" />
                  <h4 className="text-xl font-bold text-green-300">Decoherence</h4>
                </div>
                <p className="text-gray-200">Quantum states are fragile and easily disrupted by environmental interference, requiring careful isolation.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-6 border border-purple-600/20">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 mr-3 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-purple-400 rounded-full relative">
                      <div className="absolute inset-0.5 border border-purple-400 rounded-full"></div>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-purple-300">Interference</h4>
                </div>
                <p className="text-gray-200">Quantum waves can amplify or cancel each other, enabling powerful computational algorithms.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Lesson1;