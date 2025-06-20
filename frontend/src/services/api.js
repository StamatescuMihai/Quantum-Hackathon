import axios from 'axios';

// Configure the base URL for the API
// Use proxy path in development to avoid CORS and WSL networking issues
const getApiBaseUrl = () => {
  // Check if we're in production using a different method
  const isProduction = import.meta.env.PROD;
  
  if (isProduction) {
    // In production, use the Railway backend URL
    return 'https://quantum-hackathon-production.up.railway.app';
  }
  
  // In development, check if we're accessing from external host
  const currentHost = window.location.hostname;
  const currentPort = window.location.port;
  
  console.log(`Frontend accessed via: ${currentHost}:${currentPort}`);
  console.log(`Environment: ${isProduction ? 'production' : 'development'}`);
  
  // If accessing via localhost or 127.0.0.1, use proxy path
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    console.log('Using proxy path for API calls');
    return ''; // Use proxy path - requests will go to /api and be proxied to backend
  }
  
  // If accessing via IP (external access), construct backend URL
  // This handles WSL access from Windows host
  const backendUrl = `http://${currentHost}:8000`;
  console.log(`Using direct backend URL: ${backendUrl}`);
  return backendUrl;
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
      baseURL: error.config?.baseURL
    });
    return Promise.reject(error);
  }
);

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
 * Exercise API Functions
 */

/**
 * Fetch all available exercises
 * @returns {Promise} Response containing list of exercises
 */
export const fetchExercises = async () => {
  try {
    const response = await api.get('/api/exercises');
    return response.data;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};

/**
 * Fetch a specific exercise by ID
 * @param {string} exerciseId - The ID of the exercise to fetch
 * @returns {Promise} Response containing exercise details
 */
export const fetchExercise = async (exerciseId) => {
  try {
    console.log(`Fetching exercise ${exerciseId} from API...`);
    const response = await api.get(`/api/exercises/${exerciseId}`);
    console.log(`Successfully fetched exercise ${exerciseId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching exercise ${exerciseId}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method
      }
    });
    throw error;
  }
};

/**
 * Submit an exercise solution
 * @param {string} exerciseId - The ID of the exercise
 * @param {Array} circuit - The user's circuit solution
 * @param {string} userId - User identifier
 * @returns {Promise} Response containing submission results
 */
export const submitExercise = async (exerciseId, circuit, userId = 'anonymous') => {
  try {
    const response = await api.post(`/api/exercises/${exerciseId}/submit`, {
      circuit: circuit,
      user_id: userId
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting exercise:', error);
    throw error;
  }
};

/**
 * Simulate an exercise circuit without submitting
 * @param {string} exerciseId - The ID of the exercise
 * @param {Array} circuit - The user's circuit to simulate
 * @returns {Promise} Response containing simulation results
 */
export const simulateExerciseCircuit = async (exerciseId, circuit) => {
  try {
    const response = await api.post(`/api/exercises/${exerciseId}/simulate`, {
      circuit: circuit
    });
    return response.data;
  } catch (error) {
    console.error('Error simulating exercise circuit:', error);
    throw error;
  }
};

/**
 * Run the quantum simulator
 * @param {Object} request - Simulator request data
 * @param {number} request.qubits - Number of qubits
 * @param {Array} request.gates - Array of gate operations
 * @param {number} request.shots - Number of measurement shots (optional)
 * @returns {Promise} Simulation result
 */
export const runSimulator = async (request) => {
  try {
    const response = await api.post('/api/algorithms/simulator/run', request);
    return response.data;
  } catch (error) {
    console.error('Error running simulator:', error);
    throw error;
  }
};

/**
 * Get available quantum gates
 * @returns {Promise} List of available gates
 */
export const getAvailableGates = async () => {
  try {
    const response = await api.get('/api/algorithms/simulator/gates');
    return response.data;
  } catch (error) {
    console.error('Error fetching gates:', error);
    throw error;
  }
};

/**
 * Get simulator information
 * @returns {Promise} Simulator info
 */
export const getSimulatorInfo = async () => {
  try {
    const response = await api.get('/api/algorithms/simulator/info');
    return response.data;
  } catch (error) {
    console.error('Error fetching simulator info:', error);
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
