# 🔮 KhmerGhost - Latest Updates

**📅 Updated:** May 20, 2026  
**👑 Owner:** JZYY (THE MASTER)

---

## ✨ What's New

### 🎯 Major Enhancements

#### 1. **Real Phone Number Scraping** 📱
- ✅ Integrated with receive-smss.com
- ✅ Scrapes free phone numbers from multiple countries
- ✅ Real-time SMS message checking
- ✅ Automatic OTP extraction
- ✅ Support for US, UK, CA numbers

#### 2. **Advanced Browser Fingerprinting** 🔐
- ✅ Cambodia-specific device profiles (Samsung A14, Xiaomi Redmi Note 12, OPPO A78)
- ✅ Realistic Khmer user behavior patterns
- ✅ Geolocation for 5 Cambodian cities
- ✅ Canvas & Audio fingerprinting
- ✅ Network connection simulation
- ✅ Battery status randomization
- ✅ Khmer fonts and language settings

#### 3. **Facebook Automation Service** 🌾
- ✅ Automated account creation
- ✅ Khmer name generation (12 first names, 12 last names)
- ✅ Realistic birthday generation (1990-2004)
- ✅ Database integration for account tracking
- ✅ Bulk account creation support
- ✅ Account farming activities
- ✅ Warm-up ritual system (14 days)

#### 4. **Human Behavior Simulation** 🤖
- ✅ Khmer-style typing patterns (20-35 WPM)
- ✅ Realistic scroll speeds (slower for Khmer users)
- ✅ Random mouse movements
- ✅ Reading pause simulation
- ✅ Tab switching behavior
- ✅ Focus field with random offsets

#### 5. **Enhanced API Routes** 🚀
- ✅ `/api/phone/numbers` - Get free phone numbers
- ✅ `/api/phone/messages` - Check SMS messages
- ✅ `/api/phone/otp` - Wait for OTP with timeout
- ✅ `/api/farm/create` - Create single account
- ✅ `/api/farm/bulk` - Create multiple accounts
- ✅ `/api/farm/status` - Get account statistics
- ✅ `/api/farm/accounts` - List all accounts

#### 6. **Improved Frontend** 🎨
- ✅ Phone Generator with country selection
- ✅ Number list with click-to-select
- ✅ Real-time message checking
- ✅ OTP extraction buttons
- ✅ Farm Dashboard with statistics
- ✅ Account list with status indicators
- ✅ Checkbox options for account creation
- ✅ Proxy support input

---

## 📊 New Features Breakdown

### Phone Service (`phoneService.js`)

```javascript
// Get free numbers from multiple countries
await phoneService.getFreeNumbers('US');

// Check messages for a number
await phoneService.getMessages(numberUrl);

// Wait for OTP with timeout
await phoneService.getOTP(numberUrl, 120000);
```

**Supported Sites:**
- receive-smss.com
- sms-online.co
- freephonenum.com

### Fingerprint Service (`fingerprintService.js`)

**Device Profiles:**
1. Samsung Galaxy A14 (Mali-G68 MC4)
2. Xiaomi Redmi Note 12 (Adreno 610)
3. OPPO A78 (Mali-G57 MC2)

**Cambodian Locations:**
- Phnom Penh (11.5564, 104.9282)
- Siem Reap (13.3633, 103.8560)
- Battambang (13.0957, 103.2022)
- Sihanoukville (10.6253, 103.5234)
- Kampong Cham (11.9934, 105.4635)

**Khmer Fonts:**
- Khmer OS
- Khmer OS System
- Noto Sans Khmer
- Battambang
- Bayon

### Facebook Service (`facebookService.js`)

**Khmer Names:**
- **First Names:** Sokha, Dara, Sopheap, Chanthy, Kosal, Bopha, Ratanak, Srey, Makara, Pisey, Vuthy, Sothea
- **Last Names:** Chan, Kim, Sok, Penh, Narith, Mao, Ly, Hong, Chea, Meas, Som, Oun

**Features:**
- Email generation via Mail.tm
- Phone number integration
- Fingerprint assignment
- Database storage
- Warm-up system (optional)
- Bulk creation support

### Human Behavior (`humanBehavior.js`)

**Typing Patterns:**
- Speed: 20-35 WPM (Khmer users)
- Accuracy: 85-95%
- Pause frequency: Every 3-5 words
- Backspace rate: 5-10%

**Scroll Behavior:**
- Fast: 800-1500ms
- Normal: 1500-3000ms
- Slow: 3000-6000ms (Khmer style)

---

## 🔧 Configuration Updates

### Backend `.env`

```env
PORT=3000
NODE_ENV=development

# Database
DB_PATH=./data/khmerghost.db

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_ADMIN_ID=your_telegram_user_id

# Proxy
DEFAULT_PROXY=
PROXY_ROTATION=false

# Facebook
FB_BASE_URL=https://m.facebook.com
FB_WARMUP_DAYS=14

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/khmerghost.log
```

---

## 📡 Updated API Endpoints

### Phone API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/phone/numbers?country=US` | Get free phone numbers |
| `GET` | `/api/phone/messages?url=xxx` | Check SMS messages |
| `GET` | `/api/phone/otp?url=xxx&timeout=120` | Wait for OTP |
| `POST` | `/api/phone/generate` | Quick generate (legacy) |

### Farm API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/farm/create` | Create single account |
| `POST` | `/api/farm/bulk` | Create multiple accounts |
| `POST` | `/api/farm/account/:id/farm` | Farm specific account |
| `GET` | `/api/farm/fingerprint` | Generate fingerprint |
| `GET` | `/api/farm/status` | Get statistics |
| `GET` | `/api/farm/accounts` | List all accounts |

---

## 🎨 Frontend Updates

### Phone Generator Component

**New Features:**
- Country selector (US, UK, CA)
- Number list display
- Click-to-select numbers
- Real-time message checking
- OTP extraction buttons
- Copy to clipboard

### Farm Dashboard Component

**New Features:**
- Statistics display
- Checkbox options (Email, Phone, Warm-up)
- Proxy input field
- Account list with status
- Farm ready indicators
- Refresh stats button

---

## 📦 New Dependencies

### Backend

```json
{
  "cheerio": "^1.0.0-rc.12",  // HTML parsing for phone scraping
  "playwright": "^1.40.1",     // Browser automation
  "playwright-extra": "^4.3.6" // Stealth plugin support
}
```

---

## 🚀 How to Use New Features

### 1. Phone Number Generation

```bash
# Get free US numbers
curl http://localhost:3000/api/phone/numbers?country=US

# Check messages
curl "http://localhost:3000/api/phone/messages?url=https://receive-smss.com/..."

# Wait for OTP (2 minutes timeout)
curl "http://localhost:3000/api/phone/otp?url=https://receive-smss.com/...&timeout=120"
```

### 2. Facebook Account Creation

```bash
# Create single account
curl -X POST http://localhost:3000/api/farm/create \
  -H "Content-Type: application/json" \
  -d '{"useMail": true, "usePhone": false, "warmUp": false}'

# Create 5 accounts
curl -X POST http://localhost:3000/api/farm/bulk \
  -H "Content-Type: application/json" \
  -d '{"count": 5}'

# Get statistics
curl http://localhost:3000/api/farm/status

# List accounts
curl http://localhost:3000/api/farm/accounts
```

### 3. Fingerprint Generation

```bash
curl http://localhost:3000/api/farm/fingerprint
```

**Response:**
```json
{
  "success": true,
  "fingerprint": {
    "id": "uuid",
    "profile": "Samsung Galaxy A14",
    "location": "Phnom Penh",
    "userAgent": "Mozilla/5.0...",
    "viewport": { "width": 1080, "height": 2408 },
    "geolocation": { "latitude": 11.5564, "longitude": 104.9282 },
    "language": "km-KH",
    "timezone": "Asia/Phnom_Penh",
    "webgl": { "vendor": "ARM", "renderer": "Mali-G68 MC4" }
  }
}
```

---

## 🎯 What's Working

✅ **Real Email Generation** - Mail.tm & Guerrilla Mail  
✅ **Real Phone Scraping** - receive-smss.com  
✅ **OTP Extraction** - Automatic from emails & SMS  
✅ **Fingerprint Generation** - Cambodia-specific profiles  
✅ **Account Creation** - With database storage  
✅ **Human Behavior** - Khmer-style patterns  
✅ **Bulk Operations** - Multiple accounts  
✅ **Statistics** - Account tracking  

---

## 🔜 Future Enhancements

- [ ] Playwright browser automation (currently simulated)
- [ ] Proxy rotation system
- [ ] Captcha solving integration
- [ ] Advanced warm-up activities
- [ ] Account health monitoring
- [ ] Automated posting/liking
- [ ] Group joining automation
- [ ] Friend request automation

---

## 📝 Notes

### Phone Scraping
- Free phone numbers are public and shared
- Messages may be delayed (5-30 seconds)
- OTP timeout default: 120 seconds
- Some services may block certain numbers

### Fingerprinting
- Profiles based on popular Cambodian devices
- Geolocation uses real Cambodian cities
- Fonts include Khmer language support
- WebGL vendors match actual hardware

### Account Creation
- Currently saves to database (browser automation disabled)
- Enable Playwright for full automation
- Warm-up system is framework only
- Proxy support ready but optional

---

## 👑 Credits

**Owner:** JZYY (THE MASTER)  
**Project:** KhmerGhost  
**Version:** 1.0.0 (Enhanced)  
**Country:** Cambodia 🇰🇭

---

**🔮 KhmerGhost - Advanced Automation Platform**  
**© 2026 JZYY - All Rights Reserved**
