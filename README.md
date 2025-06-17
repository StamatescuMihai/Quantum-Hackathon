# Quantum Algorithm Explorer

An interactive educational platform for exploring quantum computing algorithms through visualization and hands-on experimentation.

## Project Structure

This project follows a modern full-stack architecture with a React frontend and Python FastAPI backend:

```
quantum-algorithm-explorer/
├── frontend/                        # React + Tailwind frontend
│   ├── public/
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Page components
│   │   └── styles/                  # Global styles
│   ├── package.json
│   └── vite.config.js
├── backend/                         # Python FastAPI backend
│   ├── app/
│   │   ├── algorithms/              # Algorithm implementations
│   │   ├── utils/                   # Utility functions
│   │   └── main.py                  # FastAPI application
│   └── requirements.txt
├── shared/                          # Documentation and resources
│   ├── notebooks/                   # Jupyter notebooks
│   ├── diagrams/                    # Circuit diagrams
│   └── docs/                        # Documentation
└── docker-compose.yml               # Container orchestration
```

## Quick Start

### Option 1: Development Setup (Recommended)

The easiest way to get started is using the development startup script:

```bash
# Navigate to the project directory
cd Quantum-Hackathon

# Start both frontend and backend servers
./start-dev.sh
```

This will:
- Set up a Python virtual environment for the backend
- Install all dependencies for both frontend and backend
- Start the backend server on http://localhost:8000
- Start the frontend server on http://localhost:3000

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Option 3: Docker Setup
```bash
docker-compose up --build
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/docs

## Features

### 🚀 **Backend Integration**
- Real quantum simulations using **Qiskit**
- REST API endpoints for each algorithm
- Accurate quantum state calculations
- Measurement statistics

### 🎨 **Interactive Frontend**
- Modern React interface with smooth animations
- Real-time visualization of quantum states
- Toggle between backend simulation and local approximation
- Responsive design for all devices

### ⚛️ **Quantum Algorithms**
- **Grover's Algorithm**: Search unsorted databases with quadratic speedup
- **Deutsch-Jozsa**: Determine function properties with exponential advantage
- **Bernstein-Vazirani**: Find hidden bit strings using quantum parallelism
- **Simon's Algorithm**: Discover hidden periods with quantum advantage

## Technology Stack

### Frontend
- **React 18**: Modern UI library
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Chart.js**: Data visualization
- **Axios**: HTTP client

### Backend
- **FastAPI**: Modern Python web framework
- **Qiskit**: Quantum computing framework
- **NumPy**: Scientific computing
- **Pydantic**: Data validation
- **Uvicorn**: ASGI server

### Development Tools
- **Docker**: Containerization
- **ESLint**: JavaScript linting
- **Black**: Python code formatting
- **Pytest**: Python testing

## Learning Path

### Beginners
1. Start with **Grover's Algorithm** for an intuitive introduction
2. Explore the **Simulator** to experiment with quantum gates
3. Read the **About** section for context

### Intermediate
1. Dive into **Deutsch-Jozsa** for function analysis concepts
2. Try **Bernstein-Vazirani** for linear algebra applications
3. Experiment with custom circuits

### Advanced
1. Master **Simon's Algorithm** for period finding
2. Explore the underlying mathematics
3. Contribute to the open-source project

## API Documentation

The backend provides RESTful APIs for quantum algorithm simulation:

### Endpoints

- `GET /api/algorithms` - List all algorithms
- `POST /api/algorithms/grover/run` - Run Grover's algorithm
- `POST /api/algorithms/deutsch-jozsa/run` - Run Deutsch-Jozsa
- `POST /api/algorithms/bernstein-vazirani/run` - Run Bernstein-Vazirani
- `POST /api/algorithms/simon/run` - Run Simon's algorithm

### Example Request
```json
{
  "target_item": 3,
  "iterations": 2,
  "num_qubits": 3
}
```

### Example Response
```json
{
  "success": true,
  "circuit_data": { ... },
  "quantum_state": [ ... ],
  "probabilities": [ ... ],
  "measurement_counts": { ... }
}
```

## Educational Content

### Quantum Concepts Covered
- Quantum superposition and entanglement
- Quantum gates and circuits
- Amplitude amplification
- Quantum interference
- Measurement and probability

### Mathematical Prerequisites
- Linear algebra (vectors, matrices)
- Complex numbers
- Basic probability theory
- Boolean algebra

## Contributing

We welcome contributions from the quantum computing community!

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Install dependencies: `just install`
4. Make your changes
5. Test your changes: `just run-all`
6. Add tests and documentation
7. Submit a pull request

### Code Style
- Frontend: ESLint + Prettier
- Backend: Black + Flake8
- Documentation: Markdown

### Testing
```bash
# Frontend
npm test

# Backend
pytest
```

## Deployment

### Local Development
```bash
just install
just run-all
```

### Production Build
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up --build
```

## License

This project is licensed under the WTFPL (Do What The Fuck You Want To Public License) - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Qiskit Team** for the quantum computing framework
- **Quantum Computing Community** for inspiration and feedback
- **Educational Institutions** supporting quantum education

## Roadmap

### Coming Soon
- [ ] Shor's Algorithm implementation
- [ ] Quantum Fourier Transform module
- [ ] Advanced circuit builder
- [ ] Quantum machine learning algorithms

---

Made with ❤️ for quantum education
