# DistillationApp

A comprehensive distillation process management system built with Vue.js frontend and Node.js backend, deployed on Kubernetes with automated CI/CD pipelines.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Docker Build & Deploy](#docker-build--deploy)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Configuration](#configuration)
- [Monitoring & Observability](#monitoring--observability)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

DistillationApp is a modern web application designed to manage and monitor distillation processes, plants, and results. It provides a user-friendly interface for operators to track distillation operations, analyze results, and manage user accounts.

### Key Components

- **Frontend**: Vue 3 + TypeScript + Vuetify (Material Design)
- **Backend**: Node.js + GraphQL API
- **Infrastructure**: Kubernetes + Traefik Ingress
- **Monitoring**: Prometheus + Grafana
- **Container Registry**: AWS ECR
- **Documentation**: VitePress auto-generated docs

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   DistillationApp System                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐         ┌─────────────┐                   │
│  │   Browser   │────────▶│  Traefik    │                   │
│  └─────────────┘         │  Ingress    │                   │
│                          └──────┬──────┘                   │
│                                 │                           │
│              ┌──────────────────┴──────────────────┐       │
│              │                                      │       │
│     ┌────────▼────────┐              ┌─────────────▼──┐    │
│     │   Frontend      │              │   Backend      │    │
│     │   Vue.js App    │◀────────────▶│  GraphQL API   │    │
│     │   Port: 8080    │              │   Port: 3000   │    │
│     └─────────────────┘              └────────┬───────┘    │
│                                               │             │
│                                      ┌────────▼───────┐    │
│                                      │    Database    │    │
│                                      │  (PostgreSQL)  │    │
│                                      └────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Monitoring Stack (Prometheus + Grafana)    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## ✨ Features

### Process Management
- Create and manage distillation processes
- Real-time process monitoring
- Historical data analysis
- Result tracking and reporting

### Plant Management
- Register distillation plants
- Track plant status and maintenance
- Capacity planning

### User Management
- Role-based access control
- User authentication via GraphQL
- Activity tracking

### Technical Features
- **Hot Module Replacement**: Fast development with Vite
- **Type Safety**: Full TypeScript support
- **State Management**: Vuex for centralized state
- **Error Tracking**: Sentry integration
- **Auto Documentation**: VitePress generated docs
- **Container Ready**: Docker support with multi-stage builds

## 📋 Prerequisites

### Development Environment
- **Node.js**: v16+ (with npm)
- **Docker**: Latest version
- **kubectl**: For Kubernetes management
- **AWS CLI**: For ECR interactions

### Production Environment
- **Kubernetes**: v1.22.0 or higher
- **Helm**: v3.9.0 or higher
- **AWS Account**: For ECR access

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd distillationapp
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 3. Set Up Environment Variables

Create `.env` files in both frontend and backend directories:

**frontend/.env**
```env
VITE_GRAPHQL_URI=http://localhost:3000/graphql
VITE_SENTRY_DSN=your-sentry-dsn-here
```

**backend/.env**
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/distillapp
JWT_SECRET=your-secret-key
```

### 4. Start Development Servers

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

Access the application at `http://localhost:8080`

## 📁 Project Structure

```
distillationapp/
├── frontend/                    # Vue.js frontend application
│   ├── src/                    # Source code
│   │   ├── components/         # Vue components
│   │   ├── views/             # Page components
│   │   ├── store/             # Vuex store
│   │   ├── graphql/           # GraphQL queries/mutations
│   │   └── utils/             # Utility functions
│   ├── docs/                   # VitePress documentation
│   ├── public/                 # Static assets
│   ├── Dockerfile             # Frontend container definition
│   └── vite.config.ts         # Vite configuration
│
├── backend/                    # Node.js backend application
│   ├── src/                   # Source code
│   │   ├── graphql/           # GraphQL schema & resolvers
│   │   ├── models/            # Data models
│   │   ├── services/          # Business logic
│   │   └── utils/             # Utility functions
│   ├── Dockerfile             # Backend container definition
│   └── package.json           # Dependencies & scripts
│
├── kubernetes/                 # Kubernetes manifests
│   ├── namespace.yaml         # Application namespace
│   ├── deployment-frontend.yaml
│   ├── deployment-backend.yaml
│   ├── service-frontend.yaml
│   ├── service-backend.yaml
│   └── ingress-destillapp.yaml
│
├── helm/                      # Helm charts (if using)
│   └── distillapp/
│
├── scripts/                   # Utility scripts
│   ├── docker-image-builder.sh
│   └── deploy.sh
│
└── README.md                  # This file
```

## 💻 Local Development

### Frontend Development

```bash
cd frontend

# Run development server with hot reload
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Lint and fix code
npm run lint
```

### Backend Development

```bash
cd backend

# Run development server with nodemon
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Run migrations
npm run migrate
```

### Generate Documentation

```bash
# Frontend docs
cd frontend
npm run docs:dev      # Preview
npm run docs:build    # Build static docs

# Generate TypeScript API docs
npx typedoc

# Generate Vue component docs
npm run docs:vue
```

## 🐳 Docker Build & Deploy

### Build Images Locally

```bash
# Build frontend
docker build -t destill-frontend:local -f frontend/Dockerfile frontend/

# Build backend
docker build -t destill-backend:local -f backend/Dockerfile backend/
```

### Push to AWS ECR

Use the provided script for automated builds and pushes:

```bash
# Make script executable
chmod +x scripts/docker-image-builder.sh

# Run the build script
./scripts/docker-image-builder.sh
```

The script will:
1. Extract version from `backend/package.json`
2. Authenticate with AWS ECR
3. Build both frontend and backend images
4. Tag with version and `latest`
5. Push to ECR repositories

### Manual ECR Push

```bash
# Get ECR login token
aws ecr get-login-password --region eu-central-1 | \
  docker login --username AWS --password-stdin 390442225778.dkr.ecr.eu-central-1.amazonaws.com

# Tag and push
docker tag destill-frontend:local 390442225778.dkr.ecr.eu-central-1.amazonaws.com/destillapp/k8s-uat/destill-frontend:latest
docker push 390442225778.dkr.ecr.eu-central-1.amazonaws.com/destillapp/k8s-uat/destill-frontend:latest
```

## ☸️ Kubernetes Deployment

### 1. Create Namespace

```bash
kubectl create namespace destillapp
```

### 2. Deploy Applications

```bash
# Deploy backend
kubectl apply -f kubernetes/deployment-backend.yaml
kubectl apply -f kubernetes/service-backend.yaml

# Deploy frontend
kubectl apply -f kubernetes/deployment-frontend.yaml
kubectl apply -f kubernetes/service-frontend.yaml

# Configure ingress
kubectl apply -f kubernetes/ingress-destillapp.yaml
```

### 3. Verify Deployment

```bash
# Check pod status
kubectl get pods -n destillapp

# Check services
kubectl get svc -n destillapp

# Check ingress
kubectl get ingress -n destillapp
```

### 4. Access Application

Add to your `/etc/hosts`:
```
<your-cluster-ip> destillapp.local
```

Then access: `http://destillapp.local`

## ⚙️ Configuration

### Traefik Ingress Configuration

The application uses Traefik for ingress routing:

- Frontend: All paths except `/graphql`
- Backend: Only `/graphql` path
- Host: `destillapp.local` (configurable)

### Environment-Specific Configs

Create different values files for each environment:

```yaml
# values-dev.yaml
image:
  tag: development
replicas: 1
resources:
  limits:
    memory: 512Mi
    cpu: 500m

# values-prod.yaml
image:
  tag: v1.0.0
replicas: 3
resources:
  limits:
    memory: 2Gi
    cpu: 1000m
```

## 📊 Monitoring & Observability

### Prometheus Metrics

Both frontend and backend expose metrics:

```bash
# Backend metrics
curl http://localhost:3000/metrics

# Frontend metrics (if configured)
curl http://localhost:8080/metrics
```

### Grafana Dashboards

Pre-configured dashboards available:
- Application Performance
- Resource Usage
- GraphQL Query Performance
- Error Rates

### Sentry Error Tracking

Errors are automatically reported to Sentry when `VITE_SENTRY_DSN` is configured.

## 🔧 Troubleshooting

### Common Issues

**Frontend can't connect to backend**
```bash
# Check backend pod logs
kubectl logs -n destillapp -l app=backend

# Verify service endpoints
kubectl get endpoints -n destillapp backend
```

**Ingress not working**
```bash
# Check Traefik logs
kubectl logs -n traefik deployment/traefik

# Verify ingress configuration
kubectl describe ingress -n destillapp destillapp-ingress
```

**Database connection issues**
```bash
# Check database connectivity from backend pod
kubectl exec -n destillapp -it <backend-pod> -- nc -zv <db-host> 5432
```

### Debug Commands

```bash
# Get all resources in namespace
kubectl get all -n destillapp

# Describe problematic pod
kubectl describe pod -n destillapp <pod-name>

# View recent events
kubectl get events -n destillapp --sort-by='.lastTimestamp'

# Port forward for direct access
kubectl port-forward -n destillapp svc/backend 3000:3000
kubectl port-forward -n destillapp svc/frontend 8080:8080
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following our coding standards
4. Write/update tests as needed
5. Update documentation
6. Commit with clear messages (`git commit -m 'Add amazing feature'`)
7. Push to your fork (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines

- **Code Style**: Use ESLint/Prettier configurations
- **Commits**: Follow conventional commit format
- **Tests**: Maintain >80% coverage
- **Documentation**: Update README and inline docs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Need Help?** 
- Check our [documentation](https://destillapp.github.io/main/)
- Open an [issue](https://github.com/yourusername/distillationapp/issues)
- Contact the team at support@distillapp.com
