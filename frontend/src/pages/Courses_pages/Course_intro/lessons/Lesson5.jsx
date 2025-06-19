import React from 'react';
import { Zap, Shield, Brain, Target } from 'lucide-react';

const QuantumUtilityAdvantage = () => {
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
                    <Zap className="w-12 h-12 text-cyan-400" />
                  </div>
                </div>
                <div className="absolute -inset-4 border-2 border-cyan-400/20 rounded-full animate-spin"></div>
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Quantum Utility vs. Quantum Advantage
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Explore how quantum computing is evolving from theoretical potential to practical applications, 
              delivering reliable solutions and promising significant advantages over classical methods.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-16 pt-8">
        
        {/* Quantum Utility vs. Quantum Advantage */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-red-800/40 to-pink-800/40 rounded-2xl p-8 backdrop-blur-sm border border-red-600/30">
            <div className="flex items-center mb-6">
              <div className="relative mr-6">
                <Zap className="w-10 h-10 text-red-400" />
                <div className="absolute -inset-2 bg-red-400/20 rounded-full animate-ping"></div>
              </div>
              <h2 className="text-3xl font-bold text-red-300">Understanding Quantum Utility and Advantage</h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-gray-200">
              <p>
                While no longer simply theoretical, quantum computing is still under development. As scientists 
                around the world strive to discover new techniques to improve the speed, power, and efficiency 
                of quantum machines, technology is approaching a turning point. We understand the evolution of 
                useful quantum computing using the concepts of quantum utility and quantum advantage.
              </p>
              <div className="bg-gradient-to-r from-red-900/40 to-pink-900/40 rounded-xl p-6 border-l-4 border-red-400">
                <div className="flex items-center mb-2">
                  <Target className="w-5 h-5 text-red-400 mr-2" />
                  <span className="font-semibold text-red-300">Turning Point:</span>
                </div>
                <p className="text-red-200">
                  Quantum computing is transitioning from research to practical applications, with significant 
                  milestones in utility and advantage on the horizon.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quantum Utility */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-800/40 to-cyan-800/40 rounded-2xl p-8 backdrop-blur-sm border border-blue-600/30">
            <div className="flex items-center mb-6">
              <div className="relative mr-4">
                <Shield className="w-10 h-10 text-blue-400" />
                <div className="absolute -inset-2 bg-blue-400/20 rounded-full animate-pulse"></div>
              </div>
              <h2 className="text-3xl font-bold text-blue-300">Quantum Utility</h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-gray-200">
              <p>
                Quantum utility refers to any quantum computation that provides reliable, accurate solutions 
                to problems that are beyond the reach of brute-force classical computing quantum-machine simulators. 
                Previously, these problems were accessible only to classical approximation methods—usually 
                problem-specific approximation methods carefully crafted to exploit the unique structures of 
                a specific problem.
              </p>
              <p>
                IBM first demonstrated quantum utility in 2023, marking a significant milestone in making 
                quantum computing a viable tool for scientific exploration.
              </p>
              <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-xl p-6 border-l-4 border-blue-400">
                <div className="flex items-center mb-2">
                  <Target className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="font-semibold text-blue-300">Milestone:</span>
                </div>
                <p className="text-blue-200">
                  IBM’s 2023 demonstration showed quantum computing’s potential as a practical tool for 
                  solving complex problems.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quantum Advantage */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-purple-800/40 to-violet-800/40 rounded-2xl p-8 backdrop-blur-sm border border-purple-600/30">
            <div className="flex items-center mb-6">
              <div className="relative mr-4">
                <Brain className="w-10 h-10 text-purple-400" />
                <div className="absolute -inset-2 bg-purple-400/20 rounded-full animate-bounce"></div>
              </div>
              <h2 className="text-3xl font-bold text-purple-300">Quantum Advantage</h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-gray-200">
              <p>
                Broadly defined, the term quantum advantage describes a situation where quantum can provide 
                a better, faster, or cheaper solution than all known classical methods. An algorithm that 
                exhibits quantum advantage on a quantum computer should be able to deliver a significant, 
                practical benefit beyond all known classical computing methods.
              </p>
              <p>
                IBM expects that the first quantum advantages should be realized by late 2026, if the quantum 
                and high-performance computing communities work together.
              </p>
              <div className="bg-gradient-to-r from-purple-900/40 to-violet-900/40 rounded-xl p-6 border-l-4 border-purple-400">
                <div className="flex items-center mb-2">
                  <Target className="w-5 h-5 text-purple-400 mr-2" />
                  <span className="font-semibold text-purple-300">Future Goal:</span>
                </div>
                <p className="text-purple-200">
                  Collaborative efforts aim to achieve quantum advantage by 2026, unlocking significant 
                  performance improvements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quantum Benchmarks */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-green-800/40 to-emerald-800/40 rounded-2xl p-8 backdrop-blur-sm border border-green-600/30">
            <div className="flex items-center mb-6">
              <div className="relative mr-4">
                <Target className="w-10 h-10 text-green-400" />
                <div className="absolute -inset-2 bg-green-400/20 rounded-full animate-pulse"></div>
              </div>
              <h2 className="text-3xl font-bold text-green-300">Quantum Benchmarks</h2>
            </div>
            <p className="text-lg text-gray-200 mb-8 leading-relaxed">
              Quantum computing now offers a viable alternative to classical approximation for certain problems, 
              making it a useful tool for scientific exploration. Below are key benchmarks introduced by IBM 
              to measure quantum performance:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl p-6 border border-orange-600/20">
                <div className="flex items-center mb-4">
                  <Brain className="w-8 h-8 text-orange-400 mr-4" />
                  <h4 className="text-xl font-bold text-orange-300">Layer Fidelity</h4>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed">
                  An extremely valuable benchmark, layer fidelity encapsulates the entire quantum processor’s 
                  ability to run circuits while revealing information about individual qubits, gates, and crosstalk. 
                  By running the layer fidelity protocol, researchers can qualify the overall quantum device while 
                  gaining access to granular performance and error information about individual components.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-600/20">
                <div className="flex items-center mb-4">
                  <Zap className="w-8 h-8 text-green-400 mr-4" />
                  <h4 className="text-xl font-bold text-green-300">Circuit Layer Operations Per Second (CLOPS)</h4>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed">
                  CLOPS is a measure of how quickly processors can run quantum volume circuits in series, acting 
                  as a measure of holistic system speed, incorporating quantum and classical computing. It helps 
                  compare systems and reflect performance gains across scales.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-blue-600/20">
                <div className="flex items-center mb-4">
                  <Shield className="w-8 h-8 text-blue-400 mr-4" />
                  <h4 className="text-xl font-bold text-blue-300">Circuit Depth</h4>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed">
                  Circuit depth is a measure of the number of parallel gate executions—the number of steps in a 
                  quantum circuit—that the processing unit can run before the qubits decohere. The greater the 
                  circuit depth, the more complex circuits the computer can run.
                </p>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-xl p-6 border border-yellow-600/30">
              <h3 className="text-2xl font-bold text-yellow-300 mb-4">Benchmarking the Future</h3>
              <p className="text-yellow-200 text-lg leading-relaxed">
                Layer fidelity, CLOPS, and circuit depth provide critical insights into quantum performance, 
                enabling researchers to push the boundaries of quantum computing.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default QuantumUtilityAdvantage;