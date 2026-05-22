# 🐳 DOCKER DEPLOYMENT GUIDE

## 👑 Owner: JZYY (THE MASTER)

---

## 🚀 **Quick Start (Easiest)**

```bash
cd khmerghost

# Build and start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

**Then open:** http://localhost:3001

---

## 📋 **Prerequisites**

1. **Install Docker Desktop:**
   - Mac: https://docs.docker.com/desktop/install/mac-install/
   - Download and install
   - Start Docker Desktop

2. **Verify Installation:**
```bash
docker --version
docker-compose --version
```

---

## 🏗️ **Build & Run**

### **Method 1: Docker Compose (Recommended)**

```bash
# 1. Go to project directory
cd khmerghost

# 2. Edit docker.env (add your Telegram token)
nano docker.env

# 3. Build images
docker-compose build

# 4. Start all services
docker-compose up -d

# 5. Check status
docker-compose ps
```

**Services will be available at:**
- Backend: http://localhost:3000
- Frontend: http://localhost:3001
- Bot: Running in background

---

### **Method 2: Individual Containers**

```bash
# Build backend
docker build -f Dockerfile.backend -t khmerghost-backend .

# Build frontend
docker build -f Dockerfile.frontend -t khmerghost-frontend .

# Build bot
docker build -f Dockerfile.bot -t khmerghost-bot .

# Run backend
docker run -d -p 3000:3000 --name backend khmerghost-backend

# Run frontend
docker run -d -p 3001:3001 --name frontend khmerghost-frontend

# Run bot
docker run -d --name bot \
  -e TELEGRAM_BOT_TOKEN="your_token" \
  khmerghost-bot
```

---

## 📊 **Docker Commands**

### **View Logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f bot
```

### **Stop Services:**
```bash
# Stop all
docker-compose stop

# Stop specific
docker-compose stop backend
```

### **Restart Services:**
```bash
# Restart all
docker-compose restart

# Restart specific
docker-compose restart backend
```

### **Remove Everything:**
```bash
# Stop and remove containers
docker-compose down

# Remove with volumes
docker-compose down -v
```

---

## 🔧 **Configuration**

### **Edit docker.env:**
```env
TELEGRAM_BOT_TOKEN=your_actual_bot_token
TELEGRAM_ADMIN_ID=your_telegram_user_id
```

### **Custom Ports:**

Edit `docker-compose.yml`:
```yaml
services:
  backend:
    ports:
      - "8000:3000"  # Change 8000 to your port
  
  frontend:
    ports:
      - "8001:3001"  # Change 8001 to your port
```

---

## 🐛 **Troubleshooting**

### **Port Already in Use:**
```bash
# Find process using port
lsof -ti:3000

# Kill it
lsof -ti:3000 | xargs kill -9

# Or change port in docker-compose.yml
```

### **Container Won't Start:**
```bash
# Check logs
docker-compose logs backend

# Rebuild
docker-compose build --no-cache backend
docker-compose up -d backend
```

### **Database Issues:**
```bash
# Remove volume and recreate
docker-compose down -v
docker-compose up -d
```

---

## 📦 **Production Deployment**

### **1. Build Production Images:**
```bash
docker-compose -f docker-compose.prod.yml build
```

### **2. Push to Registry:**
```bash
# Tag images
docker tag khmerghost-backend:latest your-registry/khmerghost-backend:latest

# Push
docker push your-registry/khmerghost-backend:latest
```

### **3. Deploy to Server:**
```bash
# On server
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔒 **Security**

### **Environment Variables:**
- Never commit `.env` or `docker.env` to git
- Use Docker secrets in production
- Rotate tokens regularly

### **Network Isolation:**
```yaml
networks:
  khmerghost-network:
    driver: bridge
    internal: true  # Isolate from external
```

---

## 📊 **Monitoring**

### **Check Resource Usage:**
```bash
docker stats
```

### **Check Container Health:**
```bash
docker-compose ps
docker inspect khmerghost-backend
```

---

## 🚀 **Scaling**

### **Run Multiple Instances:**
```bash
docker-compose up -d --scale backend=3
```

### **Load Balancer:**
Add nginx service to `docker-compose.yml`

---

## 📝 **Useful Commands**

```bash
# Enter container shell
docker exec -it khmerghost-backend sh

# Copy files from container
docker cp khmerghost-backend:/app/data/khmerghost.db ./backup.db

# View container details
docker inspect khmerghost-backend

# Clean up unused images
docker system prune -a
```

---

## 🎯 **Complete Workflow**

```bash
# 1. Clone/Navigate to project
cd khmerghost

# 2. Configure environment
cp docker.env.example docker.env
nano docker.env  # Add your tokens

# 3. Build
docker-compose build

# 4. Start
docker-compose up -d

# 5. Check logs
docker-compose logs -f

# 6. Test
curl http://localhost:3000/health
open http://localhost:3001

# 7. Stop when done
docker-compose down
```

---

## 📚 **Docker Compose Services**

| Service | Port | Description |
|---------|------|-------------|
| backend | 3000 | Node.js API |
| frontend | 3001 | React UI |
| bot | - | Telegram Bot |

---

## 🎨 **Architecture**

```
┌─────────────────────────────────────┐
│         Docker Network              │
│  ┌──────────┐  ┌──────────┐        │
│  │ Frontend │  │  Backend │        │
│  │  :3001   │──│  :3000   │        │
│  └──────────┘  └──────────┘        │
│                     │               │
│                ┌────┴────┐          │
│                │   Bot   │          │
│                └─────────┘          │
│                     │               │
│                ┌────┴────┐          │
│                │Database │          │
│                │ (Volume)│          │
│                └─────────┘          │
└─────────────────────────────────────┘
```

---

## ✅ **Verification**

After starting, verify:

```bash
# 1. Check containers
docker-compose ps
# All should be "Up"

# 2. Test backend
curl http://localhost:3000/health
# Should return: {"status":"ACTIVE ✅"}

# 3. Test frontend
curl http://localhost:3001
# Should return HTML

# 4. Check bot logs
docker-compose logs bot
# Should show: "🤖 BayonC2 Bot started!"
```

---

## 🎯 **Success Criteria**

✅ All 3 containers running  
✅ Backend responds on port 3000  
✅ Frontend loads on port 3001  
✅ Bot connects to Telegram  
✅ Database persists in volume  
✅ Logs accessible via docker-compose  

---

**👑 JZYY (THE MASTER) 🇰🇭**

**Docker deployment ready!** 🐳
