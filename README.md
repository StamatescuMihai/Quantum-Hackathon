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

## Features

### 🎯 Interactive Algorithm Explorer
- **Grover's Algorithm**: Quantum search with quadratic speedup
- **Deutsch-Jozsa**: Function analysis with exponential speedup
- **Bernstein-Vazirani**: Hidden string recovery with linear speedup  
- **Simon's Algorithm**: Period finding with exponential advantage

### 🎨 Visualization Tools
- Real-time quantum circuit visualization
- Quantum state evolution animation
- Probability distribution charts
- Interactive parameter controls

### 🧮 Quantum Simulator
- Accurate quantum state simulation
- Customizable circuit parameters
- Step-by-step execution
- Educational explanations

### 📚 Educational Content
- Comprehensive algorithm explanations
- Mathematical foundations
- Historical context
- Practical applications

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/your-username/quantum-algorithm-explorer.git
cd quantum-algorithm-explorer
```

2. **Start with Docker (Recommended)**
```bash
docker-compose up --build
```

3. **Or run manually:**

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

4. **Open your browser**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/docs

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
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

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

### Production Build
```bash
# Frontend
npm run build

# Backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up --build
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Qiskit Team** for the quantum computing framework
- **Quantum Computing Community** for inspiration and feedback
- **Educational Institutions** supporting quantum education

## Support

- 📧 Email: contact@quantumexplorer.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/quantum-algorithm-explorer/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/quantum-algorithm-explorer/discussions)

## Roadmap

### Coming Soon
- [ ] Shor's Algorithm implementation
- [ ] Quantum Fourier Transform module
- [ ] Real quantum hardware integration
- [ ] Advanced circuit builder
- [ ] Quantum machine learning algorithms

### Future Plans
- [ ] VR/AR quantum visualization
- [ ] Collaborative learning features
- [ ] Gamification elements
- [ ] Mobile application
- [ ] Integration with quantum cloud services

---

Made with ❤️ for quantum education
