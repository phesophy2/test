# 🔮 KhmerGhost

**Advanced Automation Platform** for temporary email/phone generation, Facebook farming, and Telegram bot integration.

**👑 Owner:** JZYY (THE MASTER)  
**📅 Version:** 1.0.0  
**🌍 Language:** Khmer/English

---

## 📋 Features

- **📧 Temporary Email Generator**: Real working disposable email addresses (Mail.tm & Guerrilla Mail)
- **📱 Temporary Phone Generator**: Generate temporary phone numbers for SMS verification
- **🌾 Facebook Farm Dashboard**: Automate Facebook account creation and farming
- **🔐 Browser Fingerprint Generator**: Create unique browser fingerprints to avoid detection
- **🤖 Telegram Bot**: Automated bot for Telegram integration with full command support
- **💾 SQLite Database**: Lightweight database for accounts, proxies, and logs
- **🛡️ Security**: Rate limiting, helmet protection, CORS configuration

---

## 🏗️ Project Structure

```
khmerghost/
├── 📁 backend/              # Node.js Express API
│   ├── config/
│   │   └── database.js      # SQLite database setup
│   ├── routes/              # API routes
│   │   ├── mailRoutes.js
│   │   ├── phoneRoutes.js
│   │   ├── farmRoutes.js
│   │   └── botRoutes.js
│   ├── services/            # Business logic
│   │   ├── mailService.js   # Mail.tm & Guerrilla Mail integration
│   │   ├── phoneService.js
│   │   ├── facebookService.js
│   │   ├── fingerprintService.js
│   │   └── telegramService.js
│   ├── utils/               # Utilities
│   │   ├── logger.js
│   │   └── humanBehavior.js
│   ├── server.js            # Main server file
│   ├── package.json
│   └── .env
│
├── 📁 frontend/             # React Web Application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── MailGenerator.js
│   │   │   ├── PhoneGenerator.js
│   │   │   ├── FarmDashboard.js
│   │   │   └── TelegramBot.js
│   │   ├── styles/
│   │   │   └── App.css
│   │   └── App.js
│   ├── package.json
│   └── .env
│
├── 📁 bot/                  # Python Telegram Bot
│   ├── bayonc2_bot.py       # Main bot file
│   └── requirements.txt
│
├── 📁 data/                 # SQLite database storage
│   └── khmerghost.db        # Auto-generated
│
├── 📁 logs/                 # Application logs
│
├── 📄 README.md             # This file
├── 📄 SETUP.md              # Detailed setup guide
├── 📄 .gitignore
└── 🚀 start.sh              # Quick start script
```

---

## 🚀 Quick Start

### Option 1: Automatic Setup (Recommended)

```bash
cd khmerghost
chmod +x start.sh
./start.sh
```

This will:
- ✅ Install all dependencies
- ✅ Start backend on `http://localhost:3000`
- ✅ Start frontend on `http://localhost:3001`
- ✅ Create necessary directories

### Option 2: Manual Setup

See **[SETUP.md](SETUP.md)** for detailed step-by-step instructions in Khmer and English.

---

## 📡 API Endpoints

### 🔹 Mail Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/mail/generate` | Generate temporary email (Mail.tm or Guerrilla) |
| `GET` | `/api/mail/inbox?token=xxx` | Check inbox messages |
| `GET` | `/api/mail/otp/:messageId?token=xxx` | Extract OTP from message |

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/mail/generate \
  -H "Content-Type: application/json" \
  -d '{"provider": "mail.tm"}'
```

**Example Response:**
```json
{
  "success": true,
  "email": "angkor1234@mail.tm",
  "password": "xY9#mK2$pL5@",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": "abc123",
  "provider": "mail.tm",
  "created_at": "2026-05-20T10:30:00.000Z"
}
```

### 🔹 Phone Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/phone/generate` | Generate temporary phone |
| `GET` | `/api/phone/sms/:phone` | Receive SMS messages |

### 🔹 Farm Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/farm/account/create` | Create Facebook account |
| `POST` | `/api/farm/account/:id/farm` | Start farming activities |
| `GET` | `/api/farm/fingerprint` | Generate browser fingerprint |

### 🔹 Bot Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/bot/send` | Send Telegram message |
| `POST` | `/api/bot/command` | Handle bot command |

### 🔹 Health Check

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ACTIVE ✅",
  "service": "KhmerGhost Backend",
  "timestamp": "2026-05-20T10:30:00.000Z",
  "owner": "JZYY"
}
```

---

## 🤖 Telegram Bot Commands

| Command | Description |
|---------|-------------|
| `/start` | Start the bot and show welcome message |
| `/help` | Display all available commands |
| `/status` | Check bot operational status |
| `/generate_email` | Generate temporary email |
| `/generate_phone` | Generate temporary phone |
| `/farm` | Start farming activities |
| `/fingerprint` | Generate browser fingerprint |

---

## 🛠️ Technologies Used

### Backend
- **Express.js** - Web framework
- **SQLite3** - Lightweight database
- **Axios** - HTTP client for API calls
- **Playwright** - Browser automation
- **Helmet** - Security middleware
- **Express Rate Limit** - API rate limiting
- **Winston** - Logging
- **UUID** - Unique ID generation

### Frontend
- **React 18** - UI framework
- **Axios** - API communication
- **CSS3** - Modern styling

### Bot
- **python-telegram-bot** - Telegram bot framework
- **python-dotenv** - Environment management

---

## 🔧 Configuration

### Backend `.env`
```env
PORT=3000
NODE_ENV=development
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
LOG_LEVEL=INFO
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:3000
```

---

## 📊 Database Schema

### Accounts Table
```sql
CREATE TABLE accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  warmed_up_at DATETIME,
  farm_ready BOOLEAN DEFAULT 0,
  proxy TEXT,
  fingerprint TEXT,
  cookies TEXT,
  fb_id TEXT,
  last_action DATETIME
);
```

### Proxies Table
```sql
CREATE TABLE proxies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT NOT NULL,
  port INTEGER,
  type TEXT,
  country TEXT DEFAULT 'KH',
  status TEXT DEFAULT 'active',
  last_used DATETIME,
  fail_count INTEGER DEFAULT 0
);
```

### Logs Table
```sql
CREATE TABLE logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  account_id INTEGER,
  details TEXT,
  success BOOLEAN,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🎯 Usage Examples

### Generate Email via Frontend
1. Open `http://localhost:3001`
2. Click "📧 Mail Generator" tab
3. Select provider (Mail.tm or Guerrilla)
4. Click "Generate Email"
5. Copy email and use for registration
6. Click "🔄 Check Inbox" to see messages
7. Click "Extract OTP" to get verification codes

### Generate Email via API
```javascript
const axios = require('axios');

async function generateEmail() {
  const response = await axios.post('http://localhost:3000/api/mail/generate', {
    provider: 'mail.tm'
  });
  
  console.log('Email:', response.data.email);
  console.log('Token:', response.data.token);
  
  return response.data;
}
```

---

## 🔒 Security Features

- ✅ **Helmet.js** - Sets secure HTTP headers
- ✅ **CORS** - Configured for specific origins
- ✅ **Rate Limiting** - 100 requests per 15 minutes per IP
- ✅ **Input Validation** - All inputs sanitized
- ✅ **Error Handling** - Comprehensive error management

---

## 📝 License

MIT License - See LICENSE file for details

---

## ⚠️ Disclaimer

This project is for **educational purposes only**. Use responsibly and in accordance with all applicable laws and terms of service. The authors are not responsible for misuse of this software.

---

## 👥 Credits

**👑 Owner:** JZYY (THE MASTER)  
**🔮 Project:** KhmerGhost  
**📅 Year:** 2026  
**🌍 Country:** Cambodia (កម្ពុជា)

---

## 🌟 Support

For support, issues, or feature requests:
- Open an issue in the repository
- Contact: JZYY

---

## 📚 Additional Resources

- **[SETUP.md](SETUP.md)** - Complete setup guide with VS Code extensions
- **[API Documentation](#-api-endpoints)** - Full API reference
- **[Database Schema](#-database-schema)** - Database structure

---

**🔮 KhmerGhost** - Advanced Automation Platform  
© 2026 JZYY - All Rights Reserved
