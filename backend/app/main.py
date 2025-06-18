from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.algorithms.grover import router as grover_router
from app.algorithms.deutsch_jozsa import router as deutsch_router
from app.algorithms.bernstein_vazirani import router as bernstein_router
from app.algorithms.simon import router as simon_router
from app.algorithms.simulator import router as simulator_router
from app.algorithms.shor import router as shor_router
from app.exercise_checker.checker import router as exercise_router
import uvicorn

app = FastAPI(
    title="Quantum Core API",
    description="Backend API for quantum algorithm simulation and visualization",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        # WSL
        "http://172.16.*",
        "http://192.168.*",
        "http://10.*",
        # All origins
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(grover_router, prefix="/api/algorithms", tags=["Grover"])
app.include_router(deutsch_router, prefix="/api/algorithms", tags=["Deutsch-Jozsa"])
app.include_router(bernstein_router, prefix="/api/algorithms", tags=["Bernstein-Vazirani"])
app.include_router(simon_router, prefix="/api/algorithms", tags=["Simon"])
app.include_router(shor_router, prefix="/api/algorithms", tags=["Shor"])
app.include_router(simulator_router, prefix="/api/algorithms", tags=["Simulator"])
app.include_router(exercise_router, prefix="/api", tags=["Exercises"])

@app.get("/")
async def root():
    return {"message": "Quantum Core API"}

@app.get("/api/health")
async def health_check():
    """Health check endpoint for Docker and monitoring"""
    from datetime import datetime
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "version": "1.2.1",
        "message": "Quantum Core API is running",
        "algorithms": ["grover", "deutsch-jozsa", "bernstein-vazirani", "simon", "simulator"]
    }

# Add a simple health check at root level for Docker
@app.get("/health")
async def health_check_root():
    """Simple health check for Docker containers"""
    return {"status": "healthy"}

@app.get("/api/algorithms")
async def list_algorithms():
    """List all available quantum algorithms"""
    return {
        "algorithms": [
            {
                "name": "grover",
                "title": "Grover's Algorithm",
                "description": "Quantum search algorithm with quadratic speedup",
                "complexity": "O(√N)",
                "qubits": 3
            },
            {
                "name": "deutsch-jozsa",
                "title": "Deutsch-Jozsa Algorithm", 
                "description": "Determines if function is constant or balanced",
                "complexity": "O(1)",
                "qubits": 3
            },
            {
                "name": "bernstein-vazirani",
                "title": "Bernstein-Vazirani Algorithm",
                "description": "Finds hidden bit string in one query",
                "complexity": "O(1)", 
                "qubits": 3
            },
            {
                "name": "simon",
                "title": "Simon's Algorithm",
                "description": "Finds period of function with exponential speedup",
                "complexity": "O(n)",
                "qubits": 4
            },
            {
                "name": "shor",
                "title": "Shor's Algorithm",
                "description": "Quantum algorithm for integer factorization",
                "complexity": "O((log N)^3)",
                "qubits": "n (depends on N)"
            }
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
