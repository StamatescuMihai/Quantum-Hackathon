install:
    ./install.sh

run-backend:
    #!/bin/bash
    source venv/bin/activate && cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

run-backend-prod:
    #!/bin/bash
    source venv/bin/activate && cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT

run-frontend:
    cd frontend && npm run dev

run-all:
    #!/bin/bash
    cleanup() {
        jobs -p | xargs -r kill
        wait
    }
    trap cleanup EXIT INT TERM
    (source venv/bin/activate && cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000) &
    sleep 3
    (cd frontend && npm run dev) &
    wait
