# Quantum Algorithm Explorer - Backend API

FastAPI backend pentru simularea și explorarea algoritmilor cuantici.

## Funcționalități

- 🔬 **Simulare algoritmi cuantici**: Grover, Deutsch-Jozsa, Bernstein-Vazirani, Simon
- 📊 **Export circuite**: Generare SVG și ASCII pentru vizualizare
- 🔄 **API RESTful**: Endpoints pentru fiecare algoritm
- 📋 **Documentație automată**: Swagger UI și ReDoc
- 🐳 **Containerizat**: Suport Docker pentru deployment

## Structura Proiectului

```
backend/
├── app/
│   ├── algorithms/          # Implementări algoritmi cuantici
│   │   ├── grover.py       # Algoritmul Grover
│   │   ├── deutsch_jozsa.py # Algoritmul Deutsch-Jozsa
│   │   ├── bernstein_vazirani.py # Algoritmul Bernstein-Vazirani
│   │   └── simon.py        # Algoritmul Simon
│   ├── utils/              # Utilități comune
│   │   └── circuit_utils.py # Funcții pentru circuite
│   └── main.py             # Aplicația FastAPI principală
├── requirements.txt        # Dependințe Python
├── Dockerfile             # Container Docker
└── README.md              # Această documentație
```

## Instalare și Pornire

### Instalare locală

```bash
# Clonează repository-ul
git clone <repository-url>
cd quantum-algorithm-explorer/backend

# Creează environment virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalează dependințele
pip install -r requirements.txt

# Pornește serverul
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Cu Docker

```bash
# Build imagine Docker
docker build -t quantum-backend .

# Rulează container
docker run -p 8000:8000 quantum-backend
```

### Cu Docker Compose (recomandat)

```bash
# Din directorul rădăcină al proiectului
docker-compose up --build
```

## API Endpoints

### Informații generale

- **GET** `/` - Mesaj de bun venit
- **GET** `/health` - Health check pentru monitoring
- **GET** `/api/health` - Health check detaliat
- **GET** `/api/algorithms` - Lista tuturor algoritmilor disponibili
- **GET** `/api/docs` - Documentație Swagger UI
- **GET** `/api/redoc` - Documentație ReDoc

### Algoritmul Grover

- **POST** `/api/algorithms/grover/simulate` - Simulare algoritm
- **GET** `/api/algorithms/grover/info` - Informații despre algoritm

```json
{
  "target": 2,
  "database_size": 4,
  "iterations": 1
}
```

### Algoritmul Deutsch-Jozsa

- **POST** `/api/algorithms/deutsch-jozsa/simulate` - Simulare algoritm
- **GET** `/api/algorithms/deutsch-jozsa/info` - Informații despre algoritm

```json
{
  "oracle_type": "balanced",
  "n_qubits": 3
}
```

### Algoritmul Bernstein-Vazirani

- **POST** `/api/algorithms/bernstein-vazirani/simulate` - Simulare algoritm
- **GET** `/api/algorithms/bernstein-vazirani/info` - Informații despre algoritm

```json
{
  "secret_string": "101",
  "shots": 1024
}
```

### Algoritmul Simon

- **POST** `/api/algorithms/simon/simulate` - Simulare algoritm
- **GET** `/api/algorithms/simon/info` - Informații despre algoritm

```json
{
  "secret_string": "10",
  "max_iterations": 5
}
```

## Tehnologii Utilizate

- **FastAPI**: Framework web modern pentru Python
- **Qiskit**: Framework pentru programarea cuantică
- **Qiskit Aer**: Simulator cuantic local
- **Pydantic**: Validare date și serializare
- **Uvicorn**: Server ASGI pentru producție

## Dezvoltare

### Adăugarea unui algoritm nou

1. Creează un fișier nou în `app/algorithms/`
2. Implementează router-ul FastAPI cu endpoints specifice
3. Adaugă router-ul în `main.py`
4. Actualizează lista din `/api/algorithms`

Exemplu structură:

```python
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class AlgorithmRequest(BaseModel):
    # parametri specifici

@router.post("/algorithm-name/simulate")
async def simulate_algorithm(request: AlgorithmRequest):
    # implementare algoritm
    return {"result": "..."}

@router.get("/algorithm-name/info")
async def get_algorithm_info():
    return {"description": "...", "complexity": "..."}
```

### Testing

```bash
# Rulează testele (dacă există)
pytest

# Test manual cu curl
curl -X GET http://localhost:8000/api/health
```

### Code Style

Proiectul folosește:
- **Black** pentru formatare
- **Flake8** pentru linting
- **Type hints** pentru claritate

```bash
# Formatare cod
black app/

# Verificare stil
flake8 app/
```

## Configurare Mediu

### Variabile de mediu

```bash
# Port server (default: 8000)
PORT=8000

# Nivel log (default: info)
LOG_LEVEL=info

# Modul dezvoltare (default: false)
DEBUG=false
```

### CORS Configuration

Backend-ul este configurat pentru a permite request-uri de la:
- `http://localhost:3000` (frontend development)
- `http://127.0.0.1:3000`

Pentru producție, actualizează lista în `main.py`.

## Monitorizare și Logging

### Health Checks

- `/health` - Check simplu pentru Docker
- `/api/health` - Check detaliat cu metadata

### Logs

Aplicația folosește logging standard Python. Pentru personalizare:

```python
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
```

## Deployment

### Producție

1. **Actualizează CORS origins** pentru domeniul tău
2. **Configurează variabilele de mediu**
3. **Folosește un server reverse proxy** (nginx, traefik)
4. **Monitorizare și alerting** pentru endpoint-urile de health

### Docker în producție

```bash
# Build optimizat pentru producție
docker build --target production -t quantum-backend:prod .

# Rulează cu resurse limitate
docker run -d \
  --name quantum-backend \
  --memory=512m \
  --cpus=1.0 \
  -p 8000:8000 \
  quantum-backend:prod
```

## Contribuție

1. Fork repository-ul
2. Creează o branch pentru feature (`git checkout -b feature/amazing-feature`)
3. Commit modificările (`git commit -m 'Add amazing feature'`)
4. Push pe branch (`git push origin feature/amazing-feature`)
5. Deschide un Pull Request

## Licență

Acest proiect este licențiat sub licența MIT - vezi fișierul [LICENSE](../LICENSE) pentru detalii.

## Suport

Pentru întrebări și probleme:
- Deschide un issue pe GitHub
- Contactează echipa de dezvoltare
- Consultă documentația Qiskit: https://qiskit.org/documentation/

## Resurse Suplimentare

- [Qiskit Textbook](https://qiskit.org/textbook/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Docker Best Practices](https://docs.docker.com/develop/best-practices/)
