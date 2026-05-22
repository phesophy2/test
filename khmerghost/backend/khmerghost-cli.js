#!/usr/bin/env node

const https = require('http');
const readline = require('readline');

const API_BASE = 'http://localhost:3000';

function rl() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function apiCall(endpoint, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE}${endpoint}`;
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ success: false, error: data });
        }
      });
    });
    
    req.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function createAccount() {
  console.log('\n🚀 Creating Facebook account...\n');
  console.log('⏳ This takes 30-90 seconds. Please wait...\n');
  
  const result = await apiCall('/api/farm/create', 'POST', { useMail: true });
  
  if (result && result.success) {
    console.log('✅ SUCCESS!\n');
    console.log(`📧 Email: ${result.email}`);
    console.log(`🔑 Password: ${result.password}`);
    console.log(`📱 Device: ${result.device_profile}`);
    console.log(`📍 City: ${result.city}`);
    console.log(`📊 Status: ${result.status}`);
    console.log(`🆔 ID: ${result.id}`);
    console.log(`⏱️  Duration: ${result.duration}ms\n`);
  } else {
    console.log(`❌ Failed: ${result.error || 'Unknown error'}\n`);
  }
}

async function listAccounts(limit = 50) {
  console.log(`\n📊 Last ${limit} accounts:\n`);
  console.log('─'.repeat(80));
  
  const result = await apiCall('/api/farm/accounts');
  
  if (result && result.accounts) {
    const accounts = result.accounts.slice(-limit).reverse();
    accounts.forEach(acc => {
      console.log(`${acc.id.toString().padEnd(5)} | ${acc.email.padEnd(35)} | ${acc.status.padEnd(12)} | ${acc.device_profile || '-'} | ${acc.city || '-'}`);
    });
    console.log('─'.repeat(80));
    console.log(`Total: ${result.accounts.length} accounts | Showing: ${accounts.length}\n`);
  } else {
    console.log('❌ Failed to load accounts\n');
  }
}

async function showStats() {
  const result = await apiCall('/api/farm/status');
  
  if (result && result.success) {
    console.log('\n📈 KhmerGhost Statistics\n');
    console.log('─'.repeat(40));
    console.log(`📊 Total Accounts: ${result.stats.total}`);
    console.log(`✅ Registered: ${result.stats.active}`);
    console.log(`🚫 Banned: ${result.stats.banned}`);
    console.log('─'.repeat(40));
    console.log(`⏱️  Response time: ${result.duration}\n`);
  } else {
    console.log('❌ Failed to load stats\n');
  }
}

async function testLogin() {
  const rlInterface = rl();
  
  rlInterface.question('📧 Email: ', async (email) => {
    rlInterface.question('🔑 Password: ', async (password) => {
      rlInterface.close();
      
      console.log('\n🔐 Testing login...\n');
      const result = await apiCall('/api/farm/test-login', 'POST', { email, password });
      
      if (result && result.success) {
        console.log(`✅ ${result.message}\n`);
        console.log(`📊 Status: ${result.status}\n`);
      } else {
        console.log(`❌ Login failed: ${result.error || 'Unknown error'}\n`);
      }
    });
  });
}

async function deleteAccount() {
  const rlInterface = rl();
  
  rlInterface.question('📧 Email to delete: ', async (email) => {
    rlInterface.close();
    
    console.log(`\n⚠️  Deleting account: ${email}\n`);
    const result = await apiCall('/api/farm/delete', 'DELETE', { email });
    
    if (result && result.success) {
      console.log(`✅ ${result.message}\n`);
    } else {
      console.log(`❌ Delete failed: ${result.error || 'Account not found'}\n`);
    }
  });
}

async function showMenu() {
  console.clear();
  console.log('\n👑 KhmerGhost CLI - JZYY (THE MASTER)\n');
  console.log('═'.repeat(50));
  console.log('  1. 🚀 Create Facebook Account');
  console.log('  2. 📋 List Accounts');
  console.log('  3. 📊 Show Statistics');
  console.log('  4. 🔐 Test Login');
  console.log('  5. 🗑️  Delete Account');
  console.log('  6. ❌ Exit');
  console.log('═'.repeat(50));
  
  const rlInterface = rl();
  rlInterface.question('\n👉 Choose option (1-6): ', async (choice) => {
    rlInterface.close();
    
    switch(choice) {
      case '1':
        await createAccount();
        break;
      case '2':
        await listAccounts();
        break;
      case '3':
        await showStats();
        break;
      case '4':
        await testLogin();
        break;
      case '5':
        await deleteAccount();
        break;
      case '6':
        console.log('\n👋 Goodbye!\n');
        process.exit(0);
      default:
        console.log('\n❌ Invalid option. Please try again.\n');
    }
    
    setTimeout(() => {
      showMenu();
    }, 3000);
  });
}

// Check backend first
async function checkBackend() {
  console.log('🔍 Checking backend connection...\n');
  const result = await apiCall('/api/farm/status');
  
  if (result && result.success) {
    console.log('✅ Backend is running!\n');
    showMenu();
  } else {
    console.log('❌ Cannot connect to backend!\n');
    console.log('Please make sure backend is running:');
    console.log('  cd /Users/anbschool0016/Farm/khmerghost');
    console.log('  docker-compose up -d\n');
    process.exit(1);
  }
}

checkBackend();
