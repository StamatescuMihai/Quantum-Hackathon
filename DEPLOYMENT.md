# Quantum Algorithm Explorer - Deployment Guide

Acest ghid oferă instrucțiuni detaliate pentru deployment-ul aplicației în diverse medii de producție.

## Cuprins

1. [Docker Compose (Local Development)](#docker-compose-local)
2. [Production Docker](#production-docker)
3. [Kubernetes](#kubernetes)
4. [Cloud Deployment (AWS/GCP/Azure)](#cloud-deployment)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Monitoring și Logging](#monitoring)
7. [SSL/TLS Configuration](#ssl-tls)
8. [Scalare și Performance](#scalare)

## Docker Compose (Local Development) {#docker-compose-local}

### Pornire rapidă
```bash
# Clonează repository-ul
git clone <repository-url>
cd quantum-algorithm-explorer

# Pornește toate serviciile
docker-compose up --build

# Pentru rulare în background
docker-compose up -d --build

# Verifică status-ul
docker-compose ps

# Logs
docker-compose logs -f

# Oprește serviciile
docker-compose down
```

### Customizare configurație
```yaml
# docker-compose.override.yml
version: '3.8'
services:
  backend:
    environment:
      - DEBUG=true
      - LOG_LEVEL=debug
    volumes:
      - ./backend:/app
  
  frontend:
    environment:
      - VITE_API_URL=http://localhost:8000
    volumes:
      - ./frontend/src:/app/src
```

## Production Docker {#production-docker}

### Build imagini optimizate

```bash
# Backend
cd backend
docker build -t quantum-backend:prod --target production .

# Frontend
cd frontend
docker build -t quantum-frontend:prod --target production .
```

### Docker Compose pentru producție

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    image: quantum-backend:prod
    restart: unless-stopped
    environment:
      - DEBUG=false
      - LOG_LEVEL=info
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '1.0'
        reservations:
          memory: 256M
          cpus: '0.5'

  frontend:
    image: quantum-frontend:prod
    restart: unless-stopped
    ports:
      - "80:3000"
    depends_on:
      - backend
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
```

## Kubernetes {#kubernetes}

### Namespace
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: quantum-explorer
```

### ConfigMaps și Secrets
```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: quantum-config
  namespace: quantum-explorer
data:
  LOG_LEVEL: "info"
  DEBUG: "false"

---
apiVersion: v1
kind: Secret
metadata:
  name: quantum-secrets
  namespace: quantum-explorer
type: Opaque
data:
  # Base64 encoded secrets
  api-key: <encoded-api-key>
```

### Backend Deployment
```yaml
# k8s/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: quantum-backend
  namespace: quantum-explorer
spec:
  replicas: 3
  selector:
    matchLabels:
      app: quantum-backend
  template:
    metadata:
      labels:
        app: quantum-backend
    spec:
      containers:
      - name: backend
        image: quantum-backend:prod
        ports:
        - containerPort: 8000
        env:
        - name: LOG_LEVEL
          valueFrom:
            configMapKeyRef:
              name: quantum-config
              key: LOG_LEVEL
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: quantum-backend-service
  namespace: quantum-explorer
spec:
  selector:
    app: quantum-backend
  ports:
  - port: 8000
    targetPort: 8000
  type: ClusterIP
```

### Frontend Deployment
```yaml
# k8s/frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: quantum-frontend
  namespace: quantum-explorer
spec:
  replicas: 2
  selector:
    matchLabels:
      app: quantum-frontend
  template:
    metadata:
      labels:
        app: quantum-frontend
    spec:
      containers:
      - name: frontend
        image: quantum-frontend:prod
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"

---
apiVersion: v1
kind: Service
metadata:
  name: quantum-frontend-service
  namespace: quantum-explorer
spec:
  selector:
    app: quantum-frontend
  ports:
  - port: 3000
    targetPort: 3000
  type: ClusterIP
```

### Ingress
```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: quantum-ingress
  namespace: quantum-explorer
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - quantum-explorer.yourdomain.com
    secretName: quantum-explorer-tls
  rules:
  - host: quantum-explorer.yourdomain.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: quantum-backend-service
            port:
              number: 8000
      - path: /
        pathType: Prefix
        backend:
          service:
            name: quantum-frontend-service
            port:
              number: 3000
```

### Deploy pe Kubernetes
```bash
# Aplică toate manifeste
kubectl apply -f k8s/

# Verifică deployment-urile
kubectl get pods -n quantum-explorer
kubectl get services -n quantum-explorer
kubectl get ingress -n quantum-explorer

# Logs
kubectl logs -f deployment/quantum-backend -n quantum-explorer
kubectl logs -f deployment/quantum-frontend -n quantum-explorer
```

## Cloud Deployment {#cloud-deployment}

### AWS ECS
```json
{
  "family": "quantum-explorer",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "your-account.dkr.ecr.region.amazonaws.com/quantum-backend:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/quantum-explorer",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "backend"
        }
      }
    }
  ]
}
```

### Google Cloud Run
```yaml
# cloudrun-backend.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: quantum-backend
  annotations:
    run.googleapis.com/ingress: all
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/maxScale: "10"
        run.googleapis.com/execution-environment: gen2
    spec:
      containers:
      - image: gcr.io/PROJECT_ID/quantum-backend
        ports:
        - containerPort: 8000
        env:
        - name: LOG_LEVEL
          value: "info"
        resources:
          limits:
            cpu: "1"
            memory: "512Mi"
```

Deploy:
```bash
# Build și push imagine
gcloud builds submit --tag gcr.io/PROJECT_ID/quantum-backend

# Deploy pe Cloud Run
gcloud run deploy quantum-backend \
  --image gcr.io/PROJECT_ID/quantum-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Azure Container Instances
```yaml
# azure-deploy.yaml
apiVersion: 2019-12-01
location: eastus
name: quantum-explorer
properties:
  containers:
  - name: backend
    properties:
      image: yourregistry.azurecr.io/quantum-backend:latest
      resources:
        requests:
          cpu: 1
          memoryInGb: 1
      ports:
      - port: 8000
        protocol: TCP
  - name: frontend
    properties:
      image: yourregistry.azurecr.io/quantum-frontend:latest
      resources:
        requests:
          cpu: 0.5
          memoryInGb: 0.5
      ports:
      - port: 3000
        protocol: TCP
  osType: Linux
  ipAddress:
    type: Public
    ports:
    - protocol: TCP
      port: 80
    - protocol: TCP
      port: 8000
    dnsNameLabel: quantum-explorer
type: Microsoft.ContainerInstance/containerGroups
```

## CI/CD Pipeline {#cicd-pipeline}

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install backend dependencies
      run: |
        cd backend
        pip install -r requirements.txt
    
    - name: Run backend tests
      run: |
        cd backend
        pytest
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install frontend dependencies
      run: |
        cd frontend
        npm ci
    
    - name: Run frontend tests
      run: |
        cd frontend
        npm test
    
    - name: Build frontend
      run: |
        cd frontend
        npm run build

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and push backend
      uses: docker/build-push-action@v4
      with:
        context: ./backend
        push: true
        tags: yourorg/quantum-backend:latest
    
    - name: Build and push frontend
      uses: docker/build-push-action@v4
      with:
        context: ./frontend
        push: true
        tags: yourorg/quantum-frontend:latest
    
    - name: Deploy to production
      run: |
        # Your deployment script here
        echo "Deploying to production..."
```

### GitLab CI/CD
```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

test-backend:
  stage: test
  image: python:3.11
  script:
    - cd backend
    - pip install -r requirements.txt
    - pytest

test-frontend:
  stage: test
  image: node:18
  script:
    - cd frontend
    - npm ci
    - npm test
    - npm run build

build-images:
  stage: build
  image: docker:20.10.16
  services:
    - docker:20.10.16-dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA ./backend
    - docker build -t $CI_REGISTRY_IMAGE/frontend:$CI_COMMIT_SHA ./frontend
    - docker push $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE/frontend:$CI_COMMIT_SHA
  only:
    - main

deploy-production:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl set image deployment/quantum-backend backend=$CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA
    - kubectl set image deployment/quantum-frontend frontend=$CI_REGISTRY_IMAGE/frontend:$CI_COMMIT_SHA
    - kubectl rollout status deployment/quantum-backend
    - kubectl rollout status deployment/quantum-frontend
  only:
    - main
```

## Monitoring și Logging {#monitoring}

### Prometheus + Grafana
```yaml
# monitoring/docker-compose.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./grafana/datasources:/etc/grafana/provisioning/datasources

volumes:
  prometheus_data:
  grafana_data:
```

### Configurare Prometheus
```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'quantum-backend'
    static_configs:
      - targets: ['backend:8000']
    metrics_path: '/metrics'
    scrape_interval: 5s

  - job_name: 'quantum-frontend'
    static_configs:
      - targets: ['frontend:3000']
```

### ELK Stack pentru Logging
```yaml
# logging/docker-compose.yml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.14.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"

  logstash:
    image: docker.elastic.co/logstash/logstash:7.14.0
    ports:
      - "5000:5000"
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:7.14.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch
```

## SSL/TLS Configuration {#ssl-tls}

### Nginx cu Let's Encrypt
```nginx
# nginx/nginx.conf
server {
    listen 80;
    server_name quantum-explorer.yourdomain.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name quantum-explorer.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/quantum-explorer.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/quantum-explorer.yourdomain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    location /api/ {
        proxy_pass http://backend:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Certbot pentru SSL
```bash
# Instalare certbot
sudo apt-get install certbot python3-certbot-nginx

# Obținere certificat
sudo certbot --nginx -d quantum-explorer.yourdomain.com

# Auto-renewal
sudo crontab -e
# Adaugă: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Scalare și Performance {#scalare}

### Horizontal Pod Autoscaler (Kubernetes)
```yaml
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: quantum-backend-hpa
  namespace: quantum-explorer
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: quantum-backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Load Balancer Configuration
```yaml
# k8s/load-balancer.yaml
apiVersion: v1
kind: Service
metadata:
  name: quantum-lb
  namespace: quantum-explorer
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
    service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
spec:
  type: LoadBalancer
  selector:
    app: quantum-frontend
  ports:
  - name: http
    port: 80
    targetPort: 3000
  - name: https
    port: 443
    targetPort: 3000
```

### Redis pentru Caching
```yaml
# redis/docker-compose.yml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  redis_data:
```

### Optimizări Performance
1. **CDN pentru assets statice**
2. **Compression (gzip/brotli)**
3. **Caching la nivel de aplicație**
4. **Connection pooling pentru baze de date**
5. **Lazy loading pentru frontend**

## Troubleshooting

### Comenzi utile pentru debugging
```bash
# Docker Compose
docker-compose logs -f service_name
docker-compose exec service_name bash

# Kubernetes
kubectl describe pod pod_name -n quantum-explorer
kubectl logs -f deployment/quantum-backend -n quantum-explorer
kubectl exec -it pod_name -n quantum-explorer -- bash

# Docker
docker exec -it container_name bash
docker inspect container_name
```

### Probleme comune
1. **Porturi ocupate**: Verifică cu `netstat -tulpn`
2. **Probleme de networking**: Verifică DNS și conectivitatea
3. **Resurse insuficiente**: Monitorizează CPU și memorie
4. **Certificate SSL expirate**: Verifică și regenerează
5. **CORS issues**: Verifică configurația backend-ului

Acest ghid acoperă majoritatea scenariilor de deployment. Pentru configurații specifice, consultă documentația oficială a platformei respective.
