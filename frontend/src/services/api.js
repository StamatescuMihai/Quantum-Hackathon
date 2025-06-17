import axios from 'axios';

// Configure the base URL for the API
// Use proxy path in development to avoid CORS and WSL networking issues
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://localhost:8000' 
  : ''; // Use proxy path in development

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

/**
 * Run Grover's Algorithm
 * @param {number} targetItem - Target item to search for
 * @param {number} iterations - Number of Grover iterations
 * @param {number} numQubits - Number of qubits to use
 * @returns {Promise} Response from the backend
 */
export const runGroverAlgorithm = async (targetItem, iterations, numQubits) => {
  try {
    const response = await api.post('/api/algorithms/grover/simulate', {
      target_item: targetItem,
      iterations: iterations,
      num_qubits: numQubits
    });
    return response.data;
  } catch (error) {
    console.error('Error running Grover algorithm:', error);
    throw error;
  }
};

/**
 * Run Deutsch-Jozsa Algorithm
 * @param {string} functionType - Type of function ("constant-0", "constant-1", "balanced")
 * @param {number} numQubits - Number of qubits to use
 * @returns {Promise} Response from the backend
 */
export const runDeutschJozsaAlgorithm = async (functionType, numQubits = 3) => {
  try {
    const response = await api.post('/api/algorithms/deutsch-jozsa/run', {
      function_type: functionType,
      num_qubits: numQubits
    });
    return response.data;
  } catch (error) {
    console.error('Error running Deutsch-Jozsa algorithm:', error);
    throw error;
  }
};

/**
 * Run Bernstein-Vazirani Algorithm
 * @param {string} hiddenString - Hidden string to discover
 * @returns {Promise} Response from the backend
 */
export const runBernsteinVaziraniAlgorithm = async (hiddenString) => {
  try {
    const response = await api.post('/api/algorithms/bernstein-vazirani/run', {
      hidden_string: hiddenString,
      num_qubits: hiddenString.length
    });
    return response.data;
  } catch (error) {
    console.error('Error running Bernstein-Vazirani algorithm:', error);
    throw error;
  }
};

/**
 * Run Simon's Algorithm
 * @param {string} hiddenPeriod - Hidden period string (binary)
 * @param {number} numQubits - Number of qubits to use
 * @returns {Promise} Response from the backend
 */
export const runSimonAlgorithm = async (hiddenPeriod, numQubits = 4) => {
  try {
    const response = await api.post('/api/algorithms/simon/run', {
      hidden_period: hiddenPeriod,
      num_qubits: numQubits
    });
    return response.data;
  } catch (error) {
    console.error('Error running Simon algorithm:', error);
    throw error;
  }
};

/**
 * Health check for the backend API
 * @returns {Promise} Health status from the backend
 */
export const checkApiHealth = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('Error checking API health:', error);
    throw error;
  }
};

/**
 * Run quantum circuit simulation
 * @param {number} qubits - Number of qubits
 * @param {Array} gates - Array of gate operations
 * @param {string} algorithm - Algorithm name (optional)
 * @param {number} shots - Number of measurement shots
 * @returns {Promise} Simulation results from the backend
 */
export const runQuantumSimulation = async (qubits, gates, algorithm = null, shots = 1024) => {
  try {
    const response = await api.post('/api/algorithms/simulator/run', {
      qubits: qubits,
      gates: gates,
      algorithm: algorithm,
      shots: shots
    });
    return response.data;
  } catch (error) {
    console.error('Error running quantum simulation:', error);
    throw error;
  }
};

/**
 * Run custom quantum circuit simulation
 * @param {number} qubits - Number of qubits
 * @param {Array} gates - Array of gate operations
 * @param {number} shots - Number of measurement shots
 * @returns {Promise} Simulation results from the backend
 */
export const runCustomCircuit = async (qubits, gates, shots = 1024) => {
  try {
    const response = await api.post('/api/algorithms/simulator/custom', {
      qubits: qubits,
      gates: gates,
      shots: shots
    });
    return response.data;
  } catch (error) {
    console.error('Error running custom circuit:', error);
    throw error;
  }
};

/**
 * Get available quantum gates
 * @returns {Promise} List of available gates from the backend
 */
export const getAvailableGates = async () => {
  try {
    const response = await api.get('/api/algorithms/simulator/gates');
    return response.data;
  } catch (error) {
    console.error('Error getting available gates:', error);
    throw error;
  }
};

/**
 * Get simulator information
 * @returns {Promise} Simulator capabilities and info
 */
export const getSimulatorInfo = async () => {
  try {
    const response = await api.get('/api/algorithms/simulator/info');
    return response.data;
  } catch (error) {
    console.error('Error getting simulator info:', error);
    throw error;
  }
};

// Error handler for API responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('API Network Error:', error.message);
    } else {
      // Something else happened
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
