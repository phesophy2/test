// seed.js – populate SQLite with demo data
const db = require('./db');

(async () => {
  try {
    // Clear existing rows (optional)
    await db.run('DELETE FROM accounts');
    await db.run('DELETE FROM settings');
    await db.run('DELETE FROM posts');

    // Insert demo accounts
    const demoAccounts = [
      { name: 'Alice', uid: 'alice123', password: 'pass1', twofa: '111111', email: 'alice@example.com', emailPass: 'emailpass', file: 'profile1.png', primary_check: 1, birthday: '1990-01-01', e_crea: '2023-01-01', cookie: 'cookieA', any_co: 'coA', note: 'test account', proxy: '127.0.0.1:8080', state: 'idle' },
      { name: 'Bob', uid: 'bob456', password: 'pass2', twofa: '222222', email: 'bob@example.com', emailPass: 'emailpass', file: 'profile2.png', primary_check: 0, birthday: '1992-02-02', e_crea: '2023-02-01', cookie: 'cookieB', any_co: 'coB', note: 'another account', proxy: '127.0.0.1:9090', state: 'idle' },
    ];

    for (const acc of demoAccounts) {
      await db.run(`
        INSERT INTO accounts (name, uid, password, twofa, email, emailPass, file, primary_check, birthday, e_crea, cookie, any_co, note, proxy, state)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        acc.name, acc.uid, acc.password, acc.twofa, acc.email, acc.emailPass, acc.file,
        acc.primary_check, acc.birthday, acc.e_crea, acc.cookie, acc.any_co, acc.note, acc.proxy, acc.state
      ]);
    }

    // Insert a few settings (example)
    await db.run(`INSERT INTO settings (key, value) VALUES ('apiKey', 'demo-key')`);

    console.log('✅ Seed data inserted successfully');
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    db.close();
  }
})();
