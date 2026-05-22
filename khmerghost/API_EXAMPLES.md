# 📡 KhmerGhost API Examples

Complete API reference with examples.

---

## 🔹 Mail API

### Generate Email (Mail.tm)
```bash
curl -X POST http://localhost:3000/api/mail/generate \
  -H "Content-Type: application/json" \
  -d '{"provider": "mail.tm"}'
```

**Response:**
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

### Check Inbox
```bash
curl "http://localhost:3000/api/mail/inbox?token=YOUR_TOKEN&provider=mail.tm"
```

### Extract OTP
```bash
curl "http://localhost:3000/api/mail/otp/MESSAGE_ID?token=YOUR_TOKEN"
```

---

## 🔹 Phone API

### Get Free Numbers
```bash
curl "http://localhost:3000/api/phone/numbers?country=US"
```

**Response:**
```json
{
  "success": true,
  "numbers": [
    {
      "number": "+12345678901",
      "display": "+1 234-567-8901",
      "country": "US",
      "url": "https://receive-smss.com/...",
      "provider": "receive-smss"
    }
  ],
  "count": 10
}
```

### Check Messages
```bash
curl "http://localhost:3000/api/phone/messages?url=https://receive-smss.com/..."
```

### Wait for OTP
```bash
curl "http://localhost:3000/api/phone/otp?url=https://receive-smss.com/...&timeout=120"
```

---

## 🔹 Farm API

### Create Single Account
```bash
curl -X POST http://localhost:3000/api/farm/create \
  -H "Content-Type: application/json" \
  -d '{
    "useMail": true,
    "usePhone": false,
    "warmUp": false,
    "proxy": null
  }'
```

**Response:**
```json
{
  "success": true,
  "email": "angkor1234@mail.tm",
  "password": "xY9#mK2$pL5@",
  "name": "Sokha Chan",
  "fingerprint": "Samsung Galaxy A14",
  "location": "Phnom Penh",
  "stage": "created"
}
```

### Create Bulk Accounts
```bash
curl -X POST http://localhost:3000/api/farm/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "count": 5,
    "proxy": null
  }'
```

### Get Statistics
```bash
curl http://localhost:3000/api/farm/status
```

**Response:**
```json
{
  "success": true,
  "stats": [
    {
      "status": "created",
      "count": 10,
      "farm_ready": 3
    }
  ]
}
```

### List Accounts
```bash
curl http://localhost:3000/api/farm/accounts
```

### Farm Account
```bash
curl -X POST http://localhost:3000/api/farm/account/1/farm
```

### Generate Fingerprint
```bash
curl http://localhost:3000/api/farm/fingerprint
```

---

## 🔹 Bot API

### Send Message
```bash
curl -X POST http://localhost:3000/api/bot/send \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "123456789",
    "message": "Hello from KhmerGhost!"
  }'
```

### Handle Command
```bash
curl -X POST http://localhost:3000/api/bot/command \
  -H "Content-Type: application/json" \
  -d '{
    "command": "/status",
    "params": {}
  }'
```

---

## 🔹 Health Check

```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ACTIVE ✅",
  "service": "KhmerGhost Backend",
  "timestamp": "2026-05-20T10:30:00.000Z",
  "owner": "JZYY"
}
```

---

## 📝 JavaScript Examples

### Generate Email
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

### Create Facebook Account
```javascript
async function createAccount() {
  const response = await axios.post('http://localhost:3000/api/farm/create', {
    useMail: true,
    usePhone: false,
    warmUp: false
  });
  
  if (response.data.success) {
    console.log('Account created:', response.data.email);
  }
}
```

### Get Phone & Wait for OTP
```javascript
async function getPhoneOTP() {
  // Get numbers
  const numbersRes = await axios.get('http://localhost:3000/api/phone/numbers', {
    params: { country: 'US' }
  });
  
  const number = numbersRes.data.numbers[0];
  console.log('Using number:', number.display);
  
  // Wait for OTP
  const otpRes = await axios.get('http://localhost:3000/api/phone/otp', {
    params: { 
      url: number.url,
      timeout: 120
    }
  });
  
  if (otpRes.data.success) {
    console.log('OTP:', otpRes.data.otp);
  }
}
```

---

## 🐍 Python Examples

### Generate Email
```python
import requests

def generate_email():
    response = requests.post('http://localhost:3000/api/mail/generate', 
        json={'provider': 'mail.tm'})
    
    data = response.json()
    print(f"Email: {data['email']}")
    print(f"Token: {data['token']}")
    
    return data
```

### Create Account
```python
def create_account():
    response = requests.post('http://localhost:3000/api/farm/create',
        json={
            'useMail': True,
            'usePhone': False,
            'warmUp': False
        })
    
    data = response.json()
    if data['success']:
        print(f"Account: {data['email']}")
```

---

**👑 Owner:** JZYY (THE MASTER)  
**© 2026 KhmerGhost**
