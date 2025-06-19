import React from 'react';
import { Pill, FlaskConical, Brain, Zap, TrendingUp, Shield, Factory, Dna } from 'lucide-react';

const Lesson4 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <TrendingUp className="w-24 h-24 text-cyan-400 animate-pulse" />
                <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-cyan-400/30 animate-spin"></div>
              </div>
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Quantum Use Cases
            </h1>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              From breaking cryptography to discovering life-saving drugs, explore how quantum computing 
              is set to revolutionize industries and solve humanity's greatest challenges.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        
        {/* Historical Context */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-indigo-800/50 to-purple-800/50 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-cyan-400 mr-6" />
              <h2 className="text-3xl font-bold">The Quantum Revolution Begins</h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-gray-200">
              <p>
                First theorized in the early 1980s, quantum computing remained largely theoretical until 1994 
                when mathematician <strong>Peter Shor</strong> published one of the first practical real-world 
                applications for a hypothetical quantum machine.
              </p>
              <p>
                Shor's algorithm for integer factorization demonstrated how a quantum mechanical computer could 
                potentially break the most advanced cryptography systems of the time—some of which are still used today.
              </p>
              <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 rounded-xl p-6">
                <p className="text-cyan-200 font-medium">
                  <strong>Game-Changing Impact:</strong> Shor's findings demonstrated a viable application for 
                  quantum systems, with dramatic implications for cybersecurity and many other fields.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Current Industry Applications */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4">Industries Embracing Quantum</h2>
            <p className="text-xl text-gray-300">Engineering firms, financial institutions, and global shipping companies are exploring quantum solutions</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-emerald-800/40 to-teal-800/40 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <Factory className="w-10 h-10 text-emerald-400 mr-4" />
                <h3 className="text-xl font-bold">Engineering</h3>
              </div>
              <p className="text-gray-200">
                Complex optimization problems in manufacturing, materials science, and structural design.
              </p>
            </div>

            <div className="bg-gradient-to-br from-violet-800/40 to-purple-800/40 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <TrendingUp className="w-10 h-10 text-violet-400 mr-4" />
                <h3 className="text-xl font-bold">Finance</h3>
              </div>
              <p className="text-gray-200">
                Portfolio optimization, risk analysis, and financial market modeling with unprecedented accuracy.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-800/40 to-cyan-800/40 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <Zap className="w-10 h-10 text-blue-400 mr-4" />
                <h3 className="text-xl font-bold">Logistics</h3>
              </div>
              <p className="text-gray-200">
                Global shipping optimization, supply chain management, and energy infrastructure planning.
              </p>
            </div>
          </div>
        </section>

        {/* Quantum Advantages */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-yellow-800/40 to-orange-800/40 rounded-2xl p-8">
            <div className="flex items-center mb-6">
              <Brain className="w-8 h-8 text-yellow-400 mr-4" />
              <h3 className="text-3xl font-bold">Quantum Computational Advantage</h3>
            </div>
            <div className="space-y-4 text-lg text-gray-200">
              <p>
                Quantum computers excel at solving certain <strong>complex problems with many variables</strong>. 
                As quantum hardware scales and quantum algorithms advance, we can soon find new solutions to 
                big, important problems.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 rounded-xl p-4">
                  <h4 className="font-bold text-orange-300 mb-2">Molecular Simulation</h4>
                  <p className="text-sm text-gray-300">Understanding complex molecular interactions</p>
                </div>
                <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl p-4">
                  <h4 className="font-bold text-green-300 mb-2">Energy Management</h4>
                  <p className="text-sm text-gray-300">Optimizing energy infrastructure systems</p>
                </div>
                <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-4">
                  <h4 className="font-bold text-purple-300 mb-2">Market Modeling</h4>
                  <p className="text-sm text-gray-300">Advanced financial market predictions</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Industry Applications */}
        <section>
          <div className="bg-gradient-to-r from-indigo-800/50 to-purple-800/50 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <Dna className="w-8 h-8 text-cyan-400 mr-4" />
              <h2 className="text-3xl font-bold">Revolutionary Applications</h2>
            </div>
            <p className="text-lg text-gray-200 mb-8 leading-relaxed">
              From drug development to combating climate change, quantum computing might hold the key 
              to breakthroughs in several critical industries:
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <Pill className="w-8 h-8 text-red-400 mr-4" />
                    <h4 className="text-2xl font-bold text-red-300">Pharmaceuticals</h4>
                  </div>
                  <p className="text-gray-200 leading-relaxed">
                    Quantum computers capable of simulating molecular behavior and biochemical reactions 
                    could <strong>speed up the research and development of life-saving new drugs</strong> 
                    and medical treatments.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <FlaskConical className="w-8 h-8 text-green-400 mr-4" />
                    <h4 className="text-2xl font-bold text-green-300">Chemistry</h4>
                  </div>
                  <p className="text-gray-200 leading-relaxed">
                    Quantum computing could lead to <strong>improved catalysts that enable petrochemical 
                    alternatives</strong> or better processes for carbon breakdown necessary for 
                    combating climate-threatening emissions.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <Brain className="w-8 h-8 text-blue-400 mr-4" />
                    <h4 className="text-2xl font-bold text-blue-300">Machine Learning</h4>
                  </div>
                  <p className="text-gray-200 leading-relaxed">
                    As AI models push hardware limits and demand tremendous energy consumption, 
                    <strong>quantum algorithms might look at datasets in a new way</strong>, 
                    providing speed-ups for machine learning problems.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <Zap className="w-8 h-8 text-purple-400 mr-4" />
                    <h4 className="text-2xl font-bold text-purple-300">Energy Solutions</h4>
                  </div>
                  <p className="text-gray-200 leading-relaxed">
                    Tackling <strong>complex energy challenges</strong> through advanced simulation 
                    and optimization of energy systems, from renewable integration to grid management.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 rounded-xl">
              <p className="text-cyan-200 font-medium text-center text-lg">
                <strong>The Quantum Horizon:</strong> An explosion of benefits from quantum research 
                and development is taking shape, promising solutions to humanity's most pressing challenges.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Lesson4;