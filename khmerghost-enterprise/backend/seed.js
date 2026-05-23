const db = require('./db');
const bcrypt = require('bcryptjs');

(async () => {
  // Create admin user
  const adminPass = await bcrypt.hash('admin123', 10);
  await db.run(`INSERT OR IGNORE INTO users(email, password_hash, full_name, subscription_tier)
    VALUES('admin@khmerghost.com', ?, 'Admin', 'enterprise')`, [adminPass]);

  // Seed products
  const products = [
    { name: 'Premium Gmail Account', type: 'gmail', price: 2.50, quantity: 1000 },
    { name: 'Outlook Account', type: 'outlook', price: 1.50, quantity: 2000 },
    { name: 'Custom Domain Email', type: 'custom', price: 5.00, quantity: 500 },
    { name: 'Bulk Email (100 pack)', type: 'bulk', price: 50.00, quantity: 100 }
  ];
  for(const p of products){
    await db.run(`INSERT OR IGNORE INTO products(name, type, price, quantity) VALUES(?,?,?,?)`,
      [p.name, p.type, p.price, p.quantity]);
  }

  console.log('✅ Database seeded!');
  console.log('📧 Admin: admin@khmerghost.com / admin123');
  process.exit(0);
})();
