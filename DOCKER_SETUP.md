# Docker Setup Instructions

This repository is now configured for complete Docker deployment with professional Dockerfiles, docker-compose.yml, and nginx reverse proxy.

## Architecture

```
Browser → Nginx (port 80) → {
  /          → Frontend (Vue.js)
  /api/      → Backend API  
  /graphql   → Backend GraphQL
}
```

## Prerequisites
- Docker and Docker Compose installed
- User added to docker group: `sudo usermod -aG docker $USER` (then logout/login)

## Local Development

### Quick Start
```bash
# Start the entire stack with nginx reverse proxy
docker-compose up --build

# Or start in background
docker-compose up -d --build

# Access the application
open http://localhost
```

**Single Entry Point:** All services are now accessible through `http://localhost` (port 80)

### Network Access

The application uses relative URLs and works automatically from any device:

- **Local access:** `http://localhost`
- **Network access:** `http://YOUR_SERVER_IP` (e.g., `http://192.168.100.53`)
- **No configuration needed** - works from any device on the network

The frontend uses relative URLs (`/graphql`, `/api/*`) so it automatically adapts to whatever domain/IP you're accessing it from.

### Service URLs
- **Main Application:** http://localhost
- **Frontend:** Served via nginx proxy
- **Backend API:** http://localhost/api/*
- **GraphQL:** http://localhost/graphql
- **Health Check:** http://localhost/health

### Individual Service Testing
```bash
# Build individual services
docker build -t destillapp-frontend frontend/
docker build -t destillapp-backend backend/

# Access logs
docker-compose logs nginx
docker-compose logs frontend
docker-compose logs backend
docker-compose logs mongodb
```

## GCP Cloud Run Deployment

### Frontend Deployment
```bash
# Build and tag for GCP
docker build -t gcr.io/YOUR_PROJECT/destillapp-frontend frontend/
docker push gcr.io/YOUR_PROJECT/destillapp-frontend

# Deploy to Cloud Run
gcloud run deploy destillapp-frontend \
  --image gcr.io/YOUR_PROJECT/destillapp-frontend \
  --platform managed \
  --region YOUR_REGION \
  --port 8080
```

### Backend Deployment
```bash
# Build and tag for GCP
docker build -t gcr.io/YOUR_PROJECT/destillapp-backend backend/
docker push gcr.io/YOUR_PROJECT/destillapp-backend

# Deploy to Cloud Run
gcloud run deploy destillapp-backend \
  --image gcr.io/YOUR_PROJECT/destillapp-backend \
  --platform managed \
  --region YOUR_REGION \
  --port 4000 \
  --set-env-vars MONGO_URI=YOUR_MONGO_CONNECTION_STRING
```

## Configuration Files Created

### Frontend Dockerfile Features
- ✅ Node.js 18 Alpine (small image)
- ✅ Non-root user for security
- ✅ Production build optimization
- ✅ Health check endpoint
- ✅ GCP Cloud Run compatible

### Backend Dockerfile Features
- ✅ Node.js 18 Alpine (small image)
- ✅ Non-root user for security
- ✅ dumb-init for signal handling
- ✅ Production dependencies only
- ✅ Health check endpoint
- ✅ GCP Cloud Run compatible

### Docker Compose Features
- ✅ MongoDB with persistent storage
- ✅ Service health checks
- ✅ Proper networking
- ✅ Environment variables
- ✅ Restart policies

### Optimization Features
- ✅ .dockerignore files (reduce build context)
- ✅ Multi-stage builds where applicable
- ✅ Layer caching optimization
- ✅ Security best practices

## Troubleshooting

### Common Issues
1. **Permission denied**: Add user to docker group and restart shell
2. **Build failures**: Check if npm dependencies can be installed
3. **Port conflicts**: Ensure ports 4000, 8080, 27017 are available
4. **MongoDB connection**: Wait for MongoDB health check to pass

### Validation
All Docker files have been validated for:
- ✅ Proper syntax
- ✅ Required scripts in package.json
- ✅ Consistent Node.js versions
- ✅ Port configurations
- ✅ Health check endpoints

## Next Steps
1. Add user to docker group: `sudo usermod -aG docker $USER`
2. Logout and login again
3. Test builds: `docker-compose up --build`
4. Configure GCP project and deploy to Cloud Run