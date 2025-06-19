import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchExercises } from '../services/api';
import { Target } from 'lucide-react';
import { motion } from 'framer-motion';

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0)
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      setLoading(true);
      const data = await fetchExercises();
      
      const difficultyOrder = {
        'beginner': 1,
        'intermediate': 2,
        'advanced': 3
      };
      
      const sortedExercises = (data.exercises || []).sort((a, b) => {
        const difficultyA = difficultyOrder[a.difficulty?.toLowerCase()] || 999;
        const difficultyB = difficultyOrder[b.difficulty?.toLowerCase()] || 999;
        
        if (difficultyA !== difficultyB) {
          return difficultyA - difficultyB;
        }
        
        // Sort by id in case of eq
        return a.id.localeCompare(b.id);
      });
      
      setExercises(sortedExercises);
    } catch (err) {
      setError('Failed to load exercises');
      console.error('Error loading exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-quantum-400 mx-auto"></div>
          <p className="mt-4 text-white/70">Loading exercises...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error}</p>
          <button 
            onClick={loadExercises}
            className="mt-4 quantum-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
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
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
              <div className="p-3 bg-gradient-to-br from-quantum-400 to-quantum-600 rounded-2xl">
                <Target className="w-12 h-12 text-white" />
              </div>
          </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Quantum Circuit Exercises
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Practice building quantum circuits to achieve specific quantum states and measurement outcomes.
            </p>
          </div>
        </motion.div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="quantum-card hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                {/* Exercise Header */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white line-clamp-2">
                    {exercise.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                    {exercise.difficulty}
                  </span>
                </div>

                {/* Exercise Description */}
                <p className="text-white/70 text-sm mb-4 line-clamp-3">
                  {exercise.description}
                </p>

                {/* Exercise Details */}
                <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-quantum-400 rounded-full"></span>
                    {exercise.num_qubits} qubit{exercise.num_qubits !== 1 ? 's' : ''}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-quantum-500 rounded-full"></span>
                    {exercise.target_type.replace('_', ' ')}
                  </div>
                </div>

                {/* Tags */}
                {exercise.tags && exercise.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {exercise.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                    {exercise.tags.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded backdrop-blur-sm">
                        +{exercise.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <Link
                  to={`/exercises/${exercise.id}`}
                  className="quantum-button w-full text-center block"
                >
                  Start Exercise
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {exercises.length === 0 && (
          <div className="text-center mt-12">
            <div className="quantum-card p-8 max-w-md mx-auto">
              <div className="text-white/40 text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Exercises Available</h3>
              <p className="text-white/70 mb-4">
                No quantum exercises have been created yet. Check back later!
              </p>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 quantum-card p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Tutorial</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-quantum-400 mb-2">🎯 Goal</h3>
              <p className="text-white/70">
                Each exercise presents a quantum state or measurement outcome you need to achieve.
                Build your circuit using the available quantum gates.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-quantum-400 mb-2">🔧 Tools</h3>
              <p className="text-white/70">
                Use our interactive circuit builder with gates like Hadamard, Pauli gates, 
                rotation gates, and CNOT to construct your solution.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-quantum-400 mb-2">💡 Hints</h3>
              <p className="text-white/70">
                Stuck? Each exercise provides helpful hints to guide you toward the solution
                without giving it away completely.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-quantum-400 mb-2">📊 Feedback</h3>
              <p className="text-white/70">
                Get immediate feedback on your circuit's performance with scoring based on
                how close your result is to the target.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exercises;
