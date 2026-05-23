# KhmerGhost OMEGA Deployment Guide

## Requirements
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose
- 4GB RAM minimum (8GB recommended)

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/khmerghost/omega.git
cd omega
```

### 2. Configure Environment
```bash
cp backend/.env.example backend/.env
# Edit .env with your configuration
```

### 3. Start Services
```bash
docker-compose up -d
```

### 4. Run Migrations
```bash
cd backend
npm run migration:run
npm run seed
```

### 5. Start Application
#### Backend
```bash
npm run start:prod
```
#### Frontend
```bash
cd ../frontend
npm run build
npm run start
```

## Production Deployment
### AWS Deployment
```bash
# Using Elastic Beanstalk
eb init
eb create khmerghost-omega-prod
```

### Using ECS
```bash
aws ecs create-cluster --cluster-name omega
aws ecs register-task-definition --cli-input-json file://task-def.json
```

### DigitalOcean Deployment
#### App Platform
```bash
# Using DO App Platform
 doctl apps create --spec .do/app.yaml
```
#### Droplet
```bash
ssh root@your-server
./scripts/deploy.sh
```

### Vultr Deployment
```bash
# Using Vultr API
curl -H "Authorization: Bearer $VULTR_API_KEY" \
  -H "Content-Type: application/json" \
  -X POST https://api.vultr.com/v2/instances \
  -d '{"region":"sgp","plan":"vc2-4c-8gb","os":"ubuntu-22-04-x64"}'
```

## Monitoring
### Health Check
```bash
curl https://api.omega.khmerghost.com/health
```
### Logs
```bash
# Docker logs
docker-compose logs -f backend
# PM2 logs
pm2 logs khmerghost-omega
```
### Metrics
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (admin/admin)

## Backup
```bash
# Database backup
./scripts/backup.sh
```
### Restore from backup
```bash
./scripts/restore.sh backup_20241201.sql
```

## SSL Setup
```bash
# Using Let's Encrypt
certbot --nginx -d omega.khmerghost.com
```
### Using Cloudflare
- Configure DNS and enable proxying
```
