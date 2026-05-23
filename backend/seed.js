const db = require('./db');
(async () => {
  for(let i=1;i<=10;i++){
    await db.run(`INSERT OR IGNORE INTO accounts(name,uid,password,email,proxy,state)
      VALUES('Account ${i}','10000${i}','pass${i}','acc${i}@gmail.com','proxy${i}:8080','idle')`);
  }
  const products = [
    { name: 'Premium Gmail Account', type: 'gmail', price: 2.50, quantity: 1000 },
    { name: 'Outlook/Hotmail Account', type: 'outlook', price: 1.50, quantity: 2000 },
    { name: 'Custom Domain Email', type: 'custom', price: 5.00, quantity: 500 },
    { name: 'Bulk Email Package (100)', type: 'bulk', price: 50.00, quantity: 100 },
    { name: 'Domain + 10 Emails', type: 'domain_package', price: 15.00, quantity: 50 }
  ];
  for(const p of products){
    await db.run(`INSERT OR IGNORE INTO products(name,type,price,quantity,description) VALUES(?,?,?,?,?)`,
      [p.name, p.type, p.price, p.quantity, '']);
  }
  console.log('✅ Seeded: 10 accounts, 5 products');
  process.exit(0);
})();
