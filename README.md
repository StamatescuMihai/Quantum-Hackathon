# Quantum Core

An interactive educational platform for exploring quantum computing algorithms through visualization and hands-on experimentation.

## Project Structure

```
Quantum-Hackathon/
├── frontend/                        # React frontend with Vite
│   ├── public/
│   ├── src/
│   │   ├── components/              # UI components
│   │   ├── pages/                   # Page components
│   │   └── styles/                  # Tailwind CSS styles
│   ├── package.json
│   └── vite.config.js
├── backend/                         # FastAPI backend
│   ├── app/
│   │   ├── algorithms/              # Quantum algorithm implementations
│   │   ├── utils/                   # Utility functions
│   │   └── main.py                  # FastAPI application
│   ├── requirements.txt
│   └── venv/                        # Python virtual environment
├── shared/                          # Documentation and notebooks
│   ├── notebooks/                   # Jupyter notebooks
│   └── docs/                        # Documentation
├── start-dev.sh                     # Development startup script
├── check-status.sh                  # Status monitoring script
├── install.sh                       # Installation script
├── justfile                         # Task runner
└── docker-compose.yml               # Container orchestration
```

## Quick Start

### Development Setup (Recommended)

Use the development startup script:

```bash
cd Quantum-Hackathon
./start-dev.sh
```

This will:
- Create and activate a Python virtual environment
- Install backend dependencies
- Install frontend dependencies  
- Start backend server on http://localhost:8000
- Start frontend server on http://localhost:3000

### Manual Setup

#### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Docker Setup
```bash
docker-compose up --build
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/docs

## Features

### Backend Integration
- Quantum simulations using **Qiskit**
- REST API endpoints for each algorithm
- Quantum state calculations
- Measurement statistics

### Interactive Frontend  
- React interface with animations
- Real-time quantum state visualization
- Responsive design
- Algorithm parameter controls

### Quantum Algorithms
- **Grover's Algorithm**: Database search with quadratic speedup
- **Deutsch-Jozsa**: Function property determination
- **Bernstein-Vazirani**: Hidden bit string discovery
- **Simon's Algorithm**: Hidden period finding

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
- **Pytest**: Python testing
- **Just**: Task runner

## Learning Path

### Beginners
1. Start with **Grover's Algorithm**
2. Explore the **Simulator**
3. Read the documentation

### Advanced
1. Study **Simon's Algorithm**
2. Explore circuit implementations
3. Experiment with parameters

## API Documentation

### Endpoints

- `GET /api/health` - Health check
- `GET /api/algorithms/grover/info` - Get Grover algorithm info
- `POST /api/algorithms/grover/simulate` - Run Grover simulation
- `GET /api/algorithms/deutsch-jozsa/info` - Get Deutsch-Jozsa info
- `POST /api/algorithms/deutsch-jozsa/simulate` - Run Deutsch-Jozsa simulation
- `GET /api/algorithms/bernstein-vazirani/info` - Get Bernstein-Vazirani info
- `POST /api/algorithms/bernstein-vazirani/simulate` - Run Bernstein-Vazirani simulation
- `GET /api/algorithms/simon/info` - Get Simon algorithm info
- `POST /api/algorithms/simon/simulate` - Run Simon simulation

### Example Request
```json
{
  "target": 2,
  "database_size": 4,
  "iterations": 1
}
```

### Example Response
```json
{
  "result": "Target found",
  "counts": {"10": 1024},
  "circuit_ascii": "...",
  "execution_time": 0.123
}
```

## Educational Content

### Quantum Concepts
- Quantum superposition and entanglement
- Quantum gates and circuits
- Amplitude amplification
- Quantum interference
- Measurement and probability

## Development

### Setup
1. Fork the repository
2. Run `./install.sh` to set up dependencies
3. Use `./start-dev.sh` for development
4. Check status with `./check-status.sh`

### Task Runner
```bash
# Using justfile
just install
just run-all
just run-backend
just run-frontend
```

## Deployment

### Development
```bash
./start-dev.sh
```

### Production
```bash
# Frontend build
cd frontend && npm run build

# Backend production
cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000

# Docker
docker-compose up --build
```

## License

This project is licensed under the WTFPL - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Qiskit Team** for the quantum computing framework
- **Quantum Computing Community** for inspiration and feedback

---

**Quantum Core** - Educational quantum computing platform
