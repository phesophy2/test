const fs = require('fs');
const path = require('path');
const db = require('../db');
class BackupService {
  async backupToJSON() {
    const accounts = await db.all('SELECT * FROM accounts');
    const proxies = await db.all('SELECT * FROM proxies');
    const backup = { timestamp: Date.now(), accounts, proxies };
    const filepath = path.join(__dirname, '../backups', `backup_${Date.now()}.json`);
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, JSON.stringify(backup, null, 2));
    return { success: true, filepath };
  }
  async exportToCSV() {
    const accounts = await db.all('SELECT * FROM accounts');
    const headers = ['id','name','uid','password','email','proxy','state'];
    const csvRows = [headers.join(',')];
    for(const acc of accounts) csvRows.push(headers.map(h => `"${(acc[h]||'').replace(/"/g,'""')}"`).join(','));
    const filepath = path.join(__dirname, '../exports', `accounts_${Date.now()}.csv`);
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, csvRows.join('\n'));
    return { success: true, filepath };
  }
}
module.exports = new BackupService();
