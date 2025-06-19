import React from 'react';
import { Atom, Cpu, Zap, Eye, Thermometer, Camera, Lightbulb, Navigation } from 'lucide-react';

const Lesson3 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 p-1">
                  <div className="w-full h-full rounded-full bg-indigo-950 flex items-center justify-center">
                    <Cpu className="w-12 h-12 text-cyan-400" />
                  </div>
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              How Quantum Computers Work
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Understanding qubits and the fundamental differences between classical and quantum computing
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-16 pt-8">
        
        {/* Primary Difference */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-indigo-800/50 to-purple-800/50 rounded-2xl p-8 backdrop-blur-sm border border-indigo-700/30">
            <div className="flex items-center mb-6">
              <Atom className="w-8 h-8 text-cyan-400 mr-4" />
              <h2 className="text-3xl font-bold">The Primary Difference</h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-gray-200">
              <p>
                The primary difference between classical and quantum computers is that quantum computers use 
                <strong className="text-cyan-300"> qubits instead of bits</strong>. While quantum computing 
                does use binary code, qubits process information differently from classical computers.
              </p>
            </div>
          </div>
        </section>

        {/* What are qubits */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-800/40 to-cyan-800/40 rounded-2xl p-8 backdrop-blur-sm border border-blue-600/30">
            <div className="flex items-center mb-6">
              <div className="relative mr-4">
                <Zap className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-blue-300">What are Qubits?</h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-gray-200">
              <p>
                While classical computers rely on bits (zeros and ones) to store and process data, quantum computers 
                process data differently by using <strong className="text-blue-300">quantum bits (qubits) in superposition</strong>.
              </p>
              <p>
                A qubit can behave like a bit and store either a zero or a one, but it can also be a 
                <strong className="text-blue-300"> weighted combination of zero and one at the same time</strong>.
              </p>
              <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-xl p-6 border-l-4 border-blue-400">
                <div className="flex items-center mb-2">
                  <Eye className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="font-semibold text-blue-300">Exponential Growth:</span>
                </div>
                <div className="text-blue-200 space-y-2">
                  <p>When qubits are combined, their superpositions can grow exponentially in complexity:</p>
                  <ul className="ml-4 space-y-1">
                    <li>• Two qubits can be in a superposition of the four possible 2-bit strings</li>
                    <li>• Three qubits can be in a superposition of the eight possible 3-bit strings</li>
                    <li>• With 100 qubits, the range of possibilities is astronomical</li>
                  </ul>
                </div>
              </div>
              <p>
                Quantum algorithms work by manipulating information in a way inaccessible to classical computers, 
                which can provide <strong className="text-blue-300">dramatic speed-ups for certain problems</strong>—especially 
                when quantum computers and high-performance classical supercomputers work together.
              </p>
            </div>
          </div>
        </section>

        {/* Types of qubits */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-purple-800/40 to-violet-800/40 rounded-2xl p-8 backdrop-blur-sm border border-purple-600/30">
            <div className="flex items-center mb-6">
              <div className="relative mr-4">
                <Atom className="w-10 h-10 text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold text-purple-300">Types of Qubits</h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-gray-200 mb-8">
              <p>
                Generally, qubits are created by manipulating and measuring systems that exhibit quantum mechanical behavior, 
                such as superconducting circuits, photons, electrons, trapped ions and atoms.
              </p>
              <p>
                There are many different ways of making qubits, with some better suited for different types of tasks:
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 rounded-xl p-6 border border-red-600/20">
                <div className="flex items-center mb-4">
                  <Thermometer className="w-6 h-6 text-red-400 mr-3" />
                  <h4 className="text-xl font-bold text-red-300">Superconducting Qubits</h4>
                </div>
                <p className="text-gray-200">
                  Made from superconducting materials operating at extremely low temperatures. 
                  Favored for their <strong className="text-red-300">speed in performing computations</strong> and fine-tuned control.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-600/20">
                <div className="flex items-center mb-4">
                  <Atom className="w-6 h-6 text-green-400 mr-3" />
                  <h4 className="text-xl font-bold text-green-300">Trapped Ion Qubits</h4>
                </div>
                <p className="text-gray-200">
                  Trapped ion particles used as qubits. Noted for <strong className="text-green-300">long coherence times 
                  and high-fidelity measurements</strong>, but much slower than superconducting qubits.
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-xl p-6 border border-yellow-600/20">
                <div className="flex items-center mb-4">
                  <Cpu className="w-6 h-6 text-yellow-400 mr-3" />
                  <h4 className="text-xl font-bold text-yellow-300">Quantum Dots</h4>
                </div>
                <p className="text-gray-200">
                  Small semiconductors that capture a single electron. Offering promising potential for 
                  <strong className="text-yellow-300"> scalability and compatibility</strong> with existing semiconductor technology.
                </p>
              </div>

              <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-6 border border-cyan-600/20">
                <div className="flex items-center mb-4">
                  <Lightbulb className="w-6 h-6 text-cyan-400 mr-3" />
                  <h4 className="text-xl font-bold text-cyan-300">Photons</h4>
                </div>
                <p className="text-gray-200">
                  Individual light particles used to make qubits and <strong className="text-cyan-300">send quantum information 
                  across long distances</strong> through optical fiber cables. Used in quantum communication and cryptography.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why are qubits useful */}
        <section>
          <div className="bg-gradient-to-r from-emerald-800/40 to-teal-800/40 rounded-2xl p-8 backdrop-blur-sm border border-emerald-600/30">
            <div className="flex items-center mb-6">
              <div className="relative mr-4">
                <Navigation className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold text-emerald-300">Why are Qubits Useful?</h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-gray-200">
              <p>
                Computers that use quantum bits have certain advantages over computers that use classical bits. 
                Because qubits can hold a superposition and exhibit interference, a quantum computer that uses qubits 
                <strong className="text-emerald-300"> approaches problems in ways different from classical computers</strong>.
              </p>
              
              <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 rounded-xl p-6 border-l-4 border-emerald-400">
                <div className="flex items-center mb-4">
                  <Navigation className="w-5 h-5 text-emerald-400 mr-2" />
                  <span className="font-semibold text-emerald-300">The Maze Analogy:</span>
                </div>
                <div className="text-emerald-200 space-y-4">
                  <p>
                    Imagine you are standing in the center of a complicated maze. To escape the maze:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-red-900/20 rounded-lg p-4 border border-red-600/30">
                      <h5 className="font-semibold text-red-300 mb-2">Classical Computing Approach</h5>
                      <p className="text-red-200 text-sm">
                        "Brute force" the problem, trying every possible combination of paths to find the exit. 
                        Uses bits to explore new paths and remember dead ends.
                      </p>
                    </div>
                    <div className="bg-emerald-900/20 rounded-lg p-4 border border-emerald-600/30">
                      <h5 className="font-semibold text-emerald-300 mb-2">Quantum Computing Approach</h5>
                      <p className="text-emerald-200 text-sm">
                        Might derive the correct path without testing all the bad paths, 
                        as if it has a bird's-eye view of the maze.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p>
                However, qubits don't test multiple paths at once. Instead, quantum computers 
                <strong className="text-emerald-300"> measure the probability amplitudes of qubits</strong> to determine an outcome.
              </p>
              
              <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 rounded-xl p-6 border-l-4 border-emerald-400">
                <div className="flex items-center mb-2">
                  <Camera className="w-5 h-5 text-emerald-400 mr-2" />
                  <span className="font-semibold text-emerald-300">Wave Interference:</span>
                </div>
                <div className="text-emerald-200 space-y-2">
                  <p>These amplitudes function like waves, overlapping and interfering with each other.</p>
                  <p>When asynchronous waves overlap, it effectively eliminates possible solutions to complex problems.</p>
                  <p>The realized coherent wave or waves present a correct solution.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Lesson3