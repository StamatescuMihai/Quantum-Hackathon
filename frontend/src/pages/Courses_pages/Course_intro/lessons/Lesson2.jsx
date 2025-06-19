import React from 'react';
import { Atom, Zap, Brain, Target, Link, Waves, ArrowRight, Eye } from 'lucide-react';

const Lesson2 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 p-1 animate-pulse">
                  <div className="w-full h-full rounded-full bg-indigo-950 flex items-center justify-center">
                    <Atom className="w-12 h-12 text-cyan-400" />
                  </div>
                </div>
                <div className="absolute -inset-4 border-2 border-cyan-400/20 rounded-full animate-spin"></div>
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              The Four Quantum Principles
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Understanding the fundamental quantum mechanical principles that power quantum computing
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-16 pt-8">
        
        {/* Superposition */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-red-800/40 to-pink-800/40 rounded-2xl p-8 backdrop-blur-sm border border-red-600/30">
            <div className="flex items-center mb-6">
              <div className="relative mr-4">
                <Zap className="w-10 h-10 text-red-400" />
                <div className="absolute -inset-2 bg-red-400/20 rounded-full animate-ping"></div>
              </div>
              <h2 className="text-3xl font-bold text-red-300">Superposition</h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-gray-200">
              <p>
                A qubit itself isn't very useful. But it can place the quantum information it holds into a 
                <strong className="text-red-300"> state of superposition</strong>, which represents a combination 
                of all possible configurations of the qubit.
              </p>
              <p>
                Groups of qubits in superposition can create <strong className="text-red-300">complex, multidimensional 
                computational spaces</strong>. Complex problems can be represented in new ways in these spaces.
              </p>
              <div className="bg-gradient-to-r from-red-900/40 to-pink-900/40 rounded-xl p-6 border-l-4 border-red-400">
                <div className="flex items-center mb-2">
                  <Eye className="w-5 h-5 text-red-400 mr-2" />
                  <span className="font-semibold text-red-300">Measurement Effect:</span>
                </div>
                <p className="text-red-200">
                  When a quantum system is measured, its state collapses from a superposition of possibilities 
                  into a binary state, which can be registered like binary code as either a zero or a one.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Entanglement */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-800/40 to-cyan-800/40 rounded-2xl p-8 backdrop-blur-sm border border-blue-600/30">
            <div className="flex items-center mb-6">
              <div className="relative mr-4">
                <Link className="w-10 h-10 text-blue-400" />
                <div className="absolute -inset-2 bg-blue-400/20 rounded-full animate-pulse"></div>
              </div>
              <h2 className="text-3xl font-bold text-blue-300">Entanglement</h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-gray-200">
              <p>
                Entanglement is the ability of qubits to <strong className="text-blue-300">correlate their state 
                with other qubits</strong>. This creates mysterious connections between quantum particles.
              </p>
              <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-xl p-6 border-l-4 border-blue-400">
                <div className="flex items-center mb-2">
                  <Target className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="font-semibold text-blue-300">Instant Information:</span>
                </div>
                <p className="text-blue-200">
                  Entangled systems are so intrinsically linked that when quantum processors measure a single 
                  entangled qubit, they can immediately determine information about other qubits in the entangled system.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Interference */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-purple-800/40 to-violet-800/40 rounded-2xl p-8 backdrop-blur-sm border border-purple-600/30">
            <div className="flex items-center mb-6">
              <div className="relative mr-4">
                <Waves className="w-10 h-10 text-purple-400" />
                <div className="absolute -inset-2 bg-purple-400/20 rounded-full animate-bounce"></div>
              </div>
              <h2 className="text-3xl font-bold text-purple-300">Interference</h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-gray-200">
              <p>
                Interference is the <strong className="text-purple-300">engine of quantum computing</strong>. 
                An environment of qubits placed into a state of collective superposition structures information 
                in a way that looks like waves, with amplitudes associated with each outcome.
              </p>
              <p>
                These amplitudes become the <strong className="text-purple-300">probabilities of the outcomes</strong> 
                of a measurement of the system.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="bg-gradient-to-r from-purple-900/40 to-violet-900/40 rounded-xl p-4 border border-purple-500/30">
                  <h4 className="font-semibold text-purple-300 mb-2">Constructive Interference</h4>
                  <p className="text-purple-200 text-sm">Waves build on each other when many peak at a particular outcome, amplifying the probability</p>
                </div>
                <div className="bg-gradient-to-r from-purple-900/40 to-violet-900/40 rounded-xl p-4 border border-purple-500/30">
                  <h4 className="font-semibold text-purple-300 mb-2">Destructive Interference</h4>
                  <p className="text-purple-200 text-sm">Waves cancel each other out when peaks and troughs interact, reducing probability</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Decoherence */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-green-800/40 to-emerald-800/40 rounded-2xl p-8 backdrop-blur-sm border border-green-600/30">
            <div className="flex items-center mb-6">
              <div className="relative mr-4">
                <Brain className="w-10 h-10 text-green-400" />
                <div className="absolute -inset-2 bg-green-400/20 rounded-full animate-pulse"></div>
              </div>
              <h2 className="text-3xl font-bold text-green-300">Decoherence</h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-gray-200">
              <p>
                Decoherence is the process in which a system in a quantum state 
                <strong className="text-green-300"> collapses into a nonquantum state</strong>. 
                This represents the fragility of quantum information.
              </p>
              <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 rounded-xl p-6 border-l-4 border-green-400">
                <div className="flex items-center mb-2">
                  <Brain className="w-5 h-5 text-green-400 mr-2" />
                  <span className="font-semibold text-green-300">Causes of Decoherence:</span>
                </div>
                <ul className="text-green-200 space-y-2">
                  <li>• Intentionally triggered by measuring a quantum system</li>
                  <li>• Environmental factors (sometimes unintentionally)</li>
                  <li>• Generally speaking, quantum computing requires avoiding and minimizing decoherence</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How They Work Together */}
        <section>
          <div className="bg-gradient-to-r from-indigo-800/50 to-purple-800/50 rounded-2xl p-8 backdrop-blur-sm border border-indigo-700/30">
            <div className="flex items-center mb-6">
              <ArrowRight className="w-8 h-8 text-cyan-400 mr-4" />
              <h2 className="text-3xl font-bold">How the Principles Work Together</h2>
            </div>
            
            <div className="space-y-6 text-lg leading-relaxed text-gray-200 mb-8">
              <p>
                To better understand quantum computing, consider that two surprising ideas are both true:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-6 border border-cyan-600/20">
                  <h4 className="text-xl font-bold text-cyan-300 mb-3">Paradox 1: Definite Yet Random</h4>
                  <p className="text-cyan-200">
                    Objects that can be measured as having definite states—qubits in superposition with 
                    defined probability amplitudes—behave randomly.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-6 border border-purple-600/20">
                  <h4 className="text-xl font-bold text-purple-300 mb-3">Paradox 2: Distant Yet Connected</h4>
                  <p className="text-purple-200">
                    Distant objects—entangled qubits—can behave in ways that, though individually random, 
                    are strongly correlated.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-xl p-6 border border-yellow-600/30">
              <h3 className="text-2xl font-bold text-yellow-300 mb-4">Quantum Computation Process</h3>
              <div className="space-y-4 text-yellow-200">
                <p>
                  <strong>1. Preparation:</strong> A computation works by preparing a superposition of computational states
                </p>
                <p>
                  <strong>2. Entanglement:</strong> A quantum circuit uses operations to entangle qubits and generate interference patterns
                </p>
                <p>
                  <strong>3. Interference:</strong> Many possible outcomes are canceled out through interference, while others are amplified
                </p>
                <p>
                  <strong>4. Solution:</strong> The amplified outcomes are the solutions to the computation
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Lesson2