# Quantum Core - Backend API

FastAPI backend for quantum algorithm simulation and visualization.

## Features

- **Quantum Algorithm Simulation**: Grover, Deutsch-Jozsa, Bernstein-Vazirani, Simon
- **Circuit Export**: SVG and ASCII generation for visualization
- **RESTful API**: Dedicated endpoints for each algorithm
- **Auto Documentation**: Swagger UI and ReDoc
- **Containerized**: Docker support for deployment

## Project Structure

```
backend/
├── app/
│   ├── algorithms/          # Quantum algorithm implementations
│   │   ├── grover.py       # Grover's Algorithm
│   │   ├── deutsch_jozsa.py # Deutsch-Jozsa Algorithm
│   │   ├── bernstein_vazirani.py # Bernstein-Vazirani Algorithm
│   │   └── simon.py        # Simon's Algorithm
│   ├── utils/              # Common utilities
│   │   └── circuit_utils.py # Circuit functions
│   └── main.py             # Main FastAPI application
├── requirements.txt        # Python dependencies
├── Dockerfile             # Docker container
├── venv/                  # Virtual environment
└── README.md              # This documentation
```

## Installation and Setup

### Local Installation

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Docker

```bash
# Build Docker image
docker build -t quantum-backend .

# Run container
docker run -p 8000:8000 quantum-backend
```

### Docker Compose (Recommended)

```bash
# From project root directory
docker-compose up --build
```

## API Endpoints

### General Information

- **GET** `/` - Welcome message
- **GET** `/health` - Health check for monitoring
- **GET** `/api/health` - Detailed health check
- **GET** `/api/docs` - Swagger UI documentation
- **GET** `/api/redoc` - ReDoc documentation

### Grover's Algorithm

- **POST** `/api/algorithms/grover/simulate` - Run simulation
- **GET** `/api/algorithms/grover/info` - Algorithm information

```json
{
  "target": 2,
  "database_size": 4,
  "iterations": 1
}
```

### Deutsch-Jozsa Algorithm

- **POST** `/api/algorithms/deutsch-jozsa/simulate` - Run simulation
- **GET** `/api/algorithms/deutsch-jozsa/info` - Algorithm information

```json
{
  "oracle_type": "balanced",
  "n_qubits": 3
}
```

### Bernstein-Vazirani Algorithm

- **POST** `/api/algorithms/bernstein-vazirani/simulate` - Run simulation
- **GET** `/api/algorithms/bernstein-vazirani/info` - Algorithm information

```json
{
  "secret_string": "101",
  "shots": 1024
}
```

### Simon's Algorithm

- **POST** `/api/algorithms/simon/simulate` - Run simulation
- **GET** `/api/algorithms/simon/info` - Algorithm information

```json
{
  "secret_string": "10",
  "max_iterations": 5
}
```

## Technologies Used

- **FastAPI**: Modern Python web framework
- **Qiskit**: Quantum computing framework
- **Qiskit Aer**: Local quantum simulator
- **Pydantic**: Data validation and serialization
- **Uvicorn**: ASGI server for production

## Development

### Adding a New Algorithm

1. Create a new file in `app/algorithms/`
2. Implement FastAPI router with specific endpoints
3. Add router to `main.py`

Example structure:

```python
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class AlgorithmRequest(BaseModel):
    # specific parameters

@router.post("/algorithm-name/simulate")
async def simulate_algorithm(request: AlgorithmRequest):
    # algorithm implementation
    return {"result": "..."}

@router.get("/algorithm-name/info")
async def get_algorithm_info():
    return {"description": "...", "complexity": "..."}
```

### Testing

```bash
# Run tests
pytest

# Manual testing
curl -X GET http://localhost:8000/api/health
```

## Configuration

### Environment Variables

```bash
# Server port (default: 8000)
PORT=8000

# Log level (default: info)
LOG_LEVEL=info

# Development mode (default: false)
DEBUG=false
```

### CORS Configuration

Backend is configured to allow requests from:
- `http://localhost:3000` (frontend development)
- `http://127.0.0.1:3000`

For production, update the list in `main.py`.

## Monitoring

### Health Checks

- `/health` - Simple check for Docker
- `/api/health` - Detailed check with metadata

## Deployment

### Production

1. **Update CORS origins** for your domain
2. **Configure environment variables**
3. **Use reverse proxy** (nginx, traefik)
4. **Set up monitoring** for health endpoints

### Docker Production

```bash
# Production build
docker build -t quantum-backend:prod .

# Run with resource limits
docker run -d \
  --name quantum-backend \
  --memory=512m \
  --cpus=1.0 \
  -p 8000:8000 \
  quantum-backend:prod
```

## License

This project is licensed under the WTFPL - see the [LICENSE](../LICENSE) file for details.

## Resources

- [Qiskit Documentation](https://qiskit.org/documentation/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Docker Best Practices](https://docs.docker.com/develop/best-practices/)

---

**Quantum Core Backend** - FastAPI quantum simulation service
