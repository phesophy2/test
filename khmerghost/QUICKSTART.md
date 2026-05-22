# 🚀 QUICK START GUIDE

## **Method 1: Automatic (Recommended)**

```bash
cd khmerghost
./START.sh
```

Then open: http://localhost:3001

---

## **Method 2: Manual (2 Terminals)**

### **Terminal 1 - Backend:**
```bash
cd khmerghost/backend
npm run dev
```

### **Terminal 2 - Frontend:**
```bash
cd khmerghost/frontend
npm start
```

---

## **Method 3: Using Kiro (Already Running)**

Backend and Frontend are already running from Kiro!
- Backend: http://localhost:3000 ✅
- Frontend: http://localhost:3001 ✅

Just open your browser!

---

## **Test Backend:**

```bash
curl http://localhost:3000/health
```

**Expected:**
```json
{"status":"ACTIVE ✅","service":"KhmerGhost Backend"}
```

---

## **Test Frontend:**

Open browser: http://localhost:3001

You should see:
- 👻 KhmerGhost header
- 4 tabs: Mail, Phone, Farm, Bot
- Beautiful gradient background

---

## **Common Issues:**

### **"npm run dev" not found:**
```bash
# Make sure you're in backend folder
cd khmerghost/backend
npm run dev
```

### **Port already in use:**
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### **Dependencies not installed:**
```bash
# Backend
cd khmerghost/backend
npm install

# Frontend
cd khmerghost/frontend
npm install
```

---

## **Stop Servers:**

Press `Ctrl+C` in each terminal

Or kill processes:
```bash
lsof -ti:3000 | xargs kill -9  # Backend
lsof -ti:3001 | xargs kill -9  # Frontend
```

---

👑 **JZYY (THE MASTER)** 🇰🇭
