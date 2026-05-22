# 🚀 KhmerGhost Setup Guide

## 📍 STEP 1: Setup VS Code + Project

### 1.1 ដំឡើង VS Code Extensions

**STEP 1.1.1:** បើក VS Code

**STEP 1.1.2:** ចុច `Ctrl+Shift+X` (Extensions)

**STEP 1.1.3:** ដំឡើង extensions ទាំងនេះ:
- ✅ ESLint
- ✅ Prettier
- ✅ Python
- ✅ Thunder Client (API testing)
- ✅ Docker
- ✅ GitLens

**STEP 1.1.4:** ចុច "Install" សម្រាប់គ្នាមួយ

### 1.2 បង្កើត Project Folder

```bash
# បើក Terminal (Ctrl+`)
# រត់ commands ទាំងនេះ:

mkdir khmerghost
cd khmerghost
mkdir backend frontend bot data
code .
```

## 📍 STEP 2: Backend Setup — Node.js + Express

### 2.1 Install Dependencies

```bash
cd backend
npm install
```

This will install all required packages:
- express (Web framework)
- cors (Cross-origin resource sharing)
- helmet (Security headers)
- express-rate-limit (Rate limiting)
- axios (HTTP client)
- sqlite3 (Database)
- playwright (Browser automation)
- node-telegram-bot-api (Telegram bot)
- winston (Logging)
- uuid (Unique ID generation)

### 2.2 Create Environment File

Create `backend/.env`:

```env
PORT=3000
NODE_ENV=development
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
LOG_LEVEL=INFO
```

### 2.3 Start Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on: `http://localhost:3000`

## 📍 STEP 3: Frontend Setup — React

### 3.1 Install Dependencies

```bash
cd frontend
npm install
```

### 3.2 Update Environment File

Edit `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:3000
```

### 3.3 Start Frontend

```bash
npm start
```

Frontend will run on: `http://localhost:3001`

## 📍 STEP 4: Telegram Bot Setup — Python

### 4.1 Install Python Dependencies

```bash
cd bot
pip install -r requirements.txt
```

### 4.2 Configure Bot Token

Set your Telegram bot token:

```bash
# Linux/Mac
export TELEGRAM_BOT_TOKEN="your_bot_token_here"

# Windows
set TELEGRAM_BOT_TOKEN=your_bot_token_here
```

### 4.3 Start Bot

```bash
python bayonc2_bot.py
```

## 📍 STEP 5: Testing the Setup

### 5.1 Test Backend Health

Open browser or use curl:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ACTIVE ✅",
  "service": "KhmerGhost Backend",
  "timestamp": "2026-05-20T...",
  "owner": "JZYY"
}
```

### 5.2 Test Mail Generation

```bash
curl -X POST http://localhost:3000/api/mail/generate
```

### 5.3 Test Frontend

Open browser: `http://localhost:3001`

You should see the KhmerGhost dashboard with 4 tabs:
- 📧 Mail Generator
- 📱 Phone Generator
- 🌾 Farm Dashboard
- 🤖 Telegram Bot

## 📍 STEP 6: Database Setup

The SQLite database will be automatically created at `data/khmerghost.db` when you first start the backend.

Tables created:
- **accounts** - Facebook accounts
- **proxies** - Proxy servers
- **logs** - Activity logs

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check if port 3000 is already in use
lsof -i :3000

# Kill the process if needed
kill -9 <PID>
```

### Frontend won't start
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database errors
```bash
# Make sure data directory exists
mkdir -p data

# Check permissions
chmod 755 data
```

## 📚 API Documentation

### Mail Endpoints
- `POST /api/mail/generate` - Generate temporary email
- `GET /api/mail/inbox/:email` - Check inbox
- `GET /api/mail/otp/:messageId` - Get OTP from message

### Phone Endpoints
- `POST /api/phone/generate` - Generate temporary phone
- `GET /api/phone/sms/:phone` - Receive SMS

### Farm Endpoints
- `POST /api/farm/account/create` - Create Facebook account
- `POST /api/farm/account/:id/farm` - Farm account
- `GET /api/farm/fingerprint` - Generate fingerprint

### Bot Endpoints
- `POST /api/bot/send` - Send Telegram message
- `POST /api/bot/command` - Handle bot command

## 🎯 Next Steps

1. ✅ Configure your Telegram bot token
2. ✅ Test all API endpoints
3. ✅ Set up proxies (optional)
4. ✅ Start creating Facebook accounts
5. ✅ Begin farming activities

## 👑 Credits

**Owner:** JZYY (THE MASTER)
**Project:** KhmerGhost
**Version:** 1.0.0

---

🔮 **KhmerGhost** - Advanced Automation Platform
