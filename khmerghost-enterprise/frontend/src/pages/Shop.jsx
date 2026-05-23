import React, { useState, useEffect } from 'react';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:5001/api/shop/products');
    setProducts(await res.json());
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const checkout = async () => {
    const total = cart.reduce((sum, p) => sum + p.price, 0);
    alert(`Total: $${total}\nPayment methods: Wing, ABA, USDT coming soon!`);
  };

  return (
    <div>
      <h2>🛒 Email Marketplace</h2>
      
      <div className="stats-grid">
        {products.map(product => (
          <div key={product.id} className="stat-card">
            <div>{product.name}</div>
            <div className="number">${product.price}</div>
            <div>📦 {product.quantity} in stock</div>
            <button className="btn-primary" onClick={() => addToCart(product)} style={{ marginTop: 10 }}>Add to Cart</button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div style={{ background: '#0f0f1a', padding: 20, borderRadius: 12, marginTop: 20, position: 'sticky', bottom: 20 }}>
          <h3>Your Cart ({cart.length} items)</h3>
          <div>Total: ${cart.reduce((s,p) => s + p.price, 0)}</div>
          <button className="btn-success" onClick={checkout} style={{ marginTop: 10 }}>Checkout</button>
        </div>
      )}
    </div>
  );
};

export default Shop;
