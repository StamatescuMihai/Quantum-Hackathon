import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchExercise, submitExercise, runSimulator } from '../services/api';

const ExercisePage = () => {
  const { exerciseId } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  console.log('ExercisePage rendered with exerciseId:', exerciseId);
  console.log('Current location:', window.location.href);
  
  const [gates, setGates] = useState([]);
  const [selectedGate, setSelectedGate] = useState('H');
  const [currentStep, setCurrentStep] = useState(0);
  const [gateParameter, setGateParameter] = useState(Math.PI / 2); // Default angle for rotation gates
  
  const [simulationResult, setSimulationResult] = useState(null);
  const [exerciseResult, setExerciseResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const availableGates = [
    { name: 'H', symbol: 'H', description: 'Hadamard' },
    { name: 'X', symbol: 'X', description: 'Pauli-X' },
    { name: 'Y', symbol: 'Y', description: 'Pauli-Y' },
    { name: 'Z', symbol: 'Z', description: 'Pauli-Z' },
    { name: 'S', symbol: 'S', description: 'Phase' },
    { name: 'T', symbol: 'T', description: 'T gate' },
    { name: 'RX', symbol: 'RX', description: 'X-rotation', hasParameter: true },
    { name: 'RY', symbol: 'RY', description: 'Y-rotation', hasParameter: true },
    { name: 'RZ', symbol: 'RZ', description: 'Z-rotation', hasParameter: true },
    { name: 'CNOT', symbol: '⊕', description: 'CNOT' }
  ];

  useEffect(() => {
    console.log('ExercisePage useEffect triggered with exerciseId:', exerciseId);
    if (exerciseId) {
      loadExercise();
    } else {
      setError('No exercise ID provided');
      setLoading(false);
    }
  }, [exerciseId]);

  const loadExercise = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Loading exercise: ${exerciseId}`);
      const data = await fetchExercise(exerciseId);
      console.log('Exercise data received:', data);
      setExercise(data.exercise);
    } catch (err) {
      const errorMessage = `Failed to load exercise: ${err.response?.status || err.message}`;
      setError(errorMessage);
      console.error('Error loading exercise:', {
        exerciseId,
        error: err,
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  const addGate = (qubit, step, targetQubit = null) => {
    const timeStep = step !== undefined ? step : currentStep;
    
    const existingGate = gates.find(g => g.qubit === qubit && g.timeStep === timeStep);
    if (existingGate) {
      return;
    }
    
    const selectedGateInfo = availableGates.find(g => g.name === selectedGate);
    const newGate = {
      name: selectedGate,
      qubit: qubit,
      timeStep: timeStep,
      target_qubit: targetQubit,
      description: selectedGateInfo?.description,
      symbol: selectedGateInfo?.symbol,
      parameter: selectedGateInfo?.hasParameter ? gateParameter : undefined
    };
    
    setGates([...gates, newGate]);
    if (step === undefined) {
      setCurrentStep(currentStep + 1);
    }
  };

  const removeGate = (index) => {
    const newGates = gates.filter((_, i) => i !== index);
    setGates(newGates);
    setSimulationResult(null);
    setExerciseResult(null);
  };

  const runSimulation = async () => {
    if (!exercise) return;
    
    try {
      const result = await runSimulator({
        qubits: exercise.num_qubits,
        gates: gates,
        shots: 1024
      });
      setSimulationResult(result);
    } catch (err) {
      console.error('Simulation error:', err);
    }
  };

  const submitSolution = async () => {
    if (!exercise) return;
    
    try {
      setIsSubmitting(true);
      console.log('Submitting solution...');
      console.log('Exercise ID:', exerciseId);
      console.log('Gates to submit:', gates);
      console.log('Exercise data:', exercise);
      
      const result = await submitExercise(exerciseId, gates, 'anonymous');
      console.log('Submission successful:', result);
      setExerciseResult(result);
    } catch (err) {
      console.error('Submission error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      
      const errorMessage = err.response?.data?.detail || err.message || 'Unknown error';
      setExerciseResult({
        passed: false,
        score: 0,
        feedback: `Submission failed: ${errorMessage}. Please check your circuit and try again.`,
        error: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const testApiConnection = async () => {
    try {
      console.log('Testing API connection...');
      const response = await fetch('/api/health');
      const health = await response.json();
      console.log('API health check:', health);
      
      const exerciseResponse = await fetch(`/api/exercises/${exerciseId}`);
      const exerciseData = await exerciseResponse.json();
      console.log('Exercise fetch test:', exerciseData);
      
      alert('API connection successful! Check console for details.');
    } catch (error) {
      console.error('API test failed:', error);
      alert('API connection failed! Check console for details.');
    }
  };

  const renderCircuitGrid = () => {
    if (!exercise) return null;
    
    const numQubits = exercise.num_qubits;
    const maxSteps = Math.max(10, currentStep + 5);
    
    return (
      <div className="quantum-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Circuit Builder</h3>
        
        {/* Circuit Grid */}
        <div className="overflow-x-auto pb-4">
          <div className="grid gap-2" style={{ gridTemplateColumns: `60px repeat(${maxSteps}, 60px)` }}>
            {/* Qubit labels */}
            <div className="font-semibold text-center py-2 text-white text-sm">Qubits</div>
            {Array.from({ length: maxSteps }, (_, step) => (
              <div key={step} className="text-center text-xs text-white/60 py-2">
                {step}
              </div>
            ))}
            
            {/* Qubit rows */}
            {Array.from({ length: numQubits }, (_, qubit) => (
              <React.Fragment key={qubit}>
                <div className="font-semibold text-center py-2 bg-white/10 text-white rounded backdrop-blur-sm text-sm">
                  |{qubit}⟩
                </div>
                {Array.from({ length: maxSteps }, (_, step) => {
                  const gateAtPosition = gates.find(g => g.qubit === qubit && g.timeStep === step);
                  return (
                    <div
                      key={`${qubit}-${step}`}
                      className="h-12 border border-white/20 rounded flex items-center justify-center bg-white/5 hover:bg-white/10 cursor-pointer relative transition-colors"
                      onClick={() => gateAtPosition ? null : addGate(qubit, step)}
                    >
                      {gateAtPosition && (
                        <div
                          className="bg-quantum-500 text-white px-2 py-1 rounded text-sm font-semibold cursor-pointer hover:bg-red-500 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            const gateIndex = gates.findIndex(g => g === gateAtPosition);
                            removeGate(gateIndex);
                          }}
                          title={gateAtPosition.parameter ? `${gateAtPosition.name}(${gateAtPosition.parameter.toFixed(2)})` : gateAtPosition.description}
                        >
                          {gateAtPosition.symbol}
                          {gateAtPosition.parameter && (
                            <div className="text-xs text-white/80">
                              {gateAtPosition.parameter.toFixed(2)}
                            </div>
                          )}
                        </div>
                      )}
                      {/* CNOT connections */}
                      {gateAtPosition && gateAtPosition.name === 'CNOT' && gateAtPosition.target_qubit !== null && (
                        <div
                          className="absolute w-0.5 bg-quantum-400"
                          style={{
                            height: `${Math.abs(gateAtPosition.target_qubit - qubit) * 56}px`,
                            top: gateAtPosition.target_qubit > qubit ? '24px' : `-${Math.abs(gateAtPosition.target_qubit - qubit) * 56 - 24}px`,
                            left: '50%',
                            transform: 'translateX(-50%)'
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Gate Selection */}
        <div className="mt-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <h4 className="font-semibold text-white mb-2">Selected Gate:</h4>
          <div className="flex flex-wrap gap-2">
            {availableGates.map((gate) => (
              <button
                key={gate.name}
                className={`px-3 py-2 rounded font-medium transition-colors ${
                  selectedGate === gate.name
                    ? 'bg-quantum-500 text-white shadow-lg'
                    : 'bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm'
                }`}
                onClick={() => setSelectedGate(gate.name)}
              >
                {gate.symbol} ({gate.name})
              </button>
            ))}
          </div>
          
          {/* Parameter input for rotation gates */}
          {availableGates.find(g => g.name === selectedGate)?.hasParameter && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-white/90 mb-2">
                Rotation Angle (radians):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.1"
                  value={gateParameter}
                  onChange={(e) => setGateParameter(parseFloat(e.target.value) || 0)}
                  className="w-32 px-3 py-2 bg-black/30 border border-white/30 rounded text-white backdrop-blur-sm focus:border-quantum-400 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setGateParameter(Math.PI / 3)}
                    className="px-2 py-1 text-xs bg-white/20 text-white rounded hover:bg-white/30 transition-colors"
                  >
                    π/3
                  </button>
                  <button
                    onClick={() => setGateParameter(Math.PI / 2)}
                    className="px-2 py-1 text-xs bg-white/20 text-white rounded hover:bg-white/30 transition-colors"
                  >
                    π/2
                  </button>
                  <button
                    onClick={() => setGateParameter(Math.PI)}
                    className="px-2 py-1 text-xs bg-white/20 text-white rounded hover:bg-white/30 transition-colors"
                  >
                    π
                  </button>
                </div>
              </div>
              <p className="text-xs text-white/60 mt-1">
                For exercise 3: Use RY(π/3) for 75% |0⟩ and 25% |1⟩ probabilities
              </p>
            </div>
          )}
          
          <p className="text-sm text-white/70 mt-2">
            Click on the circuit grid to place the selected gate
          </p>
        </div>
        
        {/* Circuit Actions */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={runSimulation}
            className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-all duration-300 disabled:opacity-50 font-semibold"
            disabled={gates.length === 0}
          >
            Run Simulation
          </button>
          <button
            onClick={submitSolution}
            className="quantum-button disabled:opacity-50"
            disabled={gates.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Solution'}
          </button>
          <button
            onClick={() => setGates([])}
            className="bg-red-600 text-white px-8 py-4 rounded-xl hover:bg-red-700 transition-all duration-300 font-semibold"
          >
            Clear Circuit
          </button>
        </div>
        
        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-2 p-2 bg-black/20 rounded text-xs backdrop-blur-sm">
            <p className="text-white/70">Debug: Gates: {gates.length}, Exercise ID: {exerciseId}, Can Submit: {gates.length > 0 && !isSubmitting}</p>
          </div>
        )}
      </div>
    );
  };

  const renderResults = () => {
    if (!simulationResult && !exerciseResult) return null;
    
    return (
      <div className="space-y-4">
        {/* Exercise Results */}
        {exerciseResult && (
          <div className={`quantum-card p-6 border-2 ${
            exerciseResult.error 
              ? 'border-red-500/50' 
              : exerciseResult.passed 
                ? 'border-green-500/50' 
                : 'border-yellow-500/50'
          }`}>
            <h3 className="text-lg font-semibold text-white mb-4">
              {exerciseResult.error 
                ? 'Submission Error' 
                : exerciseResult.passed 
                  ? 'Correct!' 
                  : 'Wrong! Try again!'
              }
            </h3>
            
            <div className="space-y-3">
              <div>
                <span className="font-medium text-white">Score: </span>
                <span className={`text-lg font-bold ${
                  exerciseResult.score >= 90 ? 'text-green-400' : 
                  exerciseResult.score >= 70 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {exerciseResult.score}/100
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-quantum-400 mx-auto"></div>
          <p className="mt-4 text-white/70">Loading exercise...</p>
        </div>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error || 'Exercise not found'}</p>
          <Link 
            to="/exercises"
            className="mt-4 inline-block quantum-button"
          >
            Back to Exercises
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/exercises"
            className="text-quantum-400 hover:text-quantum-300 mb-4 inline-flex items-center"
          >
            ← Back to Exercises
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">{exercise.title}</h1>
          <p className="text-white/80 text-lg">{exercise.description}</p>
          
          {/* Exercise Info */}
          <div className="flex items-center gap-4 mt-4 text-sm">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
              exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {exercise.difficulty}
            </span>
            <span className="text-white/70">{exercise.num_qubits} qubit{exercise.num_qubits !== 1 ? 's' : ''}</span>
            <span className="text-white/70">Target: {exercise.target_type.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Circuit Builder */}
          <div>
            {renderCircuitGrid()}
          </div>
          
          {/* Right Column - Results and Info */}
          <div className="space-y-6">
            {/* Target Information */}
            <div className="quantum-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Target Goal</h3>
              <div className="space-y-2">
                {exercise.target_data.state_vector && (
                  <div>
                    <strong className="text-white">Target State Vector:</strong>
                    <div className="text-sm font-mono bg-black/30 p-2 rounded mt-1 text-white/90 backdrop-blur-sm">
                      {exercise.target_data.state_vector.map((val, i) => (
                        <div key={i}>
                          |{i.toString(2).padStart(exercise.num_qubits, '0')}⟩: {val.toFixed(4)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {exercise.target_data.measurement_probabilities && (
                  <div>
                    <strong className="text-white">Target Probabilities:</strong>
                    <div className="text-sm bg-black/30 p-2 rounded mt-1 text-white/90 backdrop-blur-sm">
                      {Object.entries(exercise.target_data.measurement_probabilities).map(([state, prob]) => (
                        <div key={state}>|{state}⟩: {(prob * 100).toFixed(1)}%</div>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-white/90"><strong className="text-white">Tolerance:</strong> ±{exercise.target_data.tolerance}</p>
              </div>
            </div>

            {/* Current Output */}
            <div className="quantum-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Current Output</h3>
              {simulationResult ? (
                <div className="space-y-3">
                  {simulationResult.success ? (
                    <>
                      <div>
                        <strong className="text-white">Current State Vector:</strong>
                        <div className="text-sm font-mono bg-black/30 p-2 rounded mt-1 text-white/90 backdrop-blur-sm">
                          {simulationResult.quantum_state.map((state, i) => (
                            <div key={i}>
                              |{i.toString(2).padStart(exercise.num_qubits, '0')}⟩: {state.real.toFixed(4)} + {state.imag.toFixed(4)}i
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <strong className="text-white">Current Probabilities:</strong>
                        <div className="text-sm bg-black/30 p-2 rounded mt-1 text-white/90 backdrop-blur-sm">
                          {simulationResult.probabilities.map((prob, i) => (
                            prob > 0.001 && (
                              <div key={i}>
                                |{i.toString(2).padStart(exercise.num_qubits, '0')}⟩: {(prob * 100).toFixed(1)}%
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-red-400">Simulation failed: {simulationResult.error_message}</p>
                  )}
                </div>
              ) : (
                <p className="text-white/60 italic">Run simulation to see current output</p>
              )}
            </div>
            
            {/* Results */}
            {renderResults()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;
