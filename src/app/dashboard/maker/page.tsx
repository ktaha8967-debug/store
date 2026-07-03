'use client';
import { useState, useEffect } from 'react';
import { calculateSellingPrice } from '@/lib/pricing';

export default function MakerDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [readinessStep1, setReadinessStep1] = useState(true);
  const [readinessStep2, setReadinessStep2] = useState(true);
  const [readinessStep3, setReadinessStep3] = useState(true);
  const [readinessStep4, setReadinessStep4] = useState(true);
  const [readinessStep5, setReadinessStep5] = useState(false);
  const [readinessStep6, setReadinessStep6] = useState(false);
  const [readinessStep7, setReadinessStep7] = useState(false);
  const [products, setProducts] = useState([
    { id: '1', name: 'Hand-Block Printed Ajrak Shawl', stock: 12, price: 150, status: 'Active' },
    { id: '2', name: 'Indigo Dyed Cotton Scarf', stock: 0, price: 80, status: 'Out of Stock' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductStock, setNewProductStock] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Textiles');

  // Interactive Seller Wallet & Settings States
  const [preferredMethod, setPreferredMethod] = useState('Stripe Connect');
  const [payoutSchedule, setPayoutSchedule] = useState('Weekly');
  const [walletBalance, setWalletBalance] = useState(230.00);
  const [paidOutAmount, setPaidOutAmount] = useState(1200.00);
  const [pendingAmount, setPendingAmount] = useState(150.00);

  const [transactions, setTransactions] = useState([
    { id: 'TXN-9021', orderId: 'ORD-9823', date: 'Oct 28, 2025', buyerCountry: 'United Kingdom', product: 'Hand-Block Printed Ajrak Shawl', sellerAmount: 150.00, margin: 90.00, status: 'Completed', method: 'Stripe Connect' },
    { id: 'TXN-8411', orderId: 'ORD-8411', date: 'Sep 12, 2025', buyerCountry: 'France', product: 'Indigo Dyed Cotton Scarf', sellerAmount: 80.00, margin: 48.00, status: 'Refunded (Debited)', method: 'Wise' },
    { id: 'TXN-7719', orderId: 'ORD-7719', date: 'Aug 04, 2025', buyerCountry: 'United States', product: 'Blue Pottery Vase', sellerAmount: 85.00, margin: 51.00, status: 'Completed', method: 'Stripe Connect' },
    { id: 'TXN-6204', orderId: 'ORD-6204', date: 'Jul 20, 2025', buyerCountry: 'Germany', product: 'Woven Palm Basket', sellerAmount: 45.00, margin: 27.00, status: 'Completed', method: 'Bank Transfer' },
  ]);

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem('britsync_orders');
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        // Flatten list of items for maker view representation
        const makerOrdersList: any[] = [];
        parsed.forEach((order: any) => {
          order.items.forEach((item: any) => {
            makerOrdersList.push({
              id: order.id,
              product: item.name,
              buyer: order.shippingAddress.fullName || 'Premium Buyer',
              date: order.date,
              status: order.status
            });
          });
        });
        setOrders(makerOrdersList);
      } catch (e) {}
    } else {
      const defaultOrders = [
        { id: 'ORD-9823', product: 'Hand-Block Printed Ajrak Shawl', buyer: 'Jane B.', date: 'Oct 28, 2025', status: 'Accepted' }
      ];
      setOrders(defaultOrders);
    }
  }, [activeTab]);

  const handleUpdateOrderStatus = (orderId: string, nextStatus: string) => {
    const savedOrders = localStorage.getItem('britsync_orders');
    let parsedOrders = [];
    if (savedOrders) {
      try {
        parsedOrders = JSON.parse(savedOrders);
      } catch (e) {}
    }

    const updated = parsedOrders.map((o: any) => {
      if (o.id === orderId) {
        return { ...o, status: nextStatus };
      }
      return o;
    });

    localStorage.setItem('britsync_orders', JSON.stringify(updated));
    alert(`✓ Order #${orderId} marked as: ${nextStatus}`);
    
    // Refresh list
    const makerList: any[] = [];
    updated.forEach((order: any) => {
      order.items.forEach((item: any) => {
        makerList.push({
          id: order.id,
          product: item.name,
          buyer: order.shippingAddress.fullName || 'Premium Buyer',
          date: order.date,
          status: order.status
        });
      });
    });
    setOrders(makerList);
  };

  const handleSaveProduct = () => {
    if (!newProductName || !newProductPrice || !newProductStock) {
      alert('Please fill out all fields.');
      return;
    }

    const priceNum = parseFloat(newProductPrice);
    const stockNum = parseInt(newProductStock);

    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Please enter a valid price.');
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      alert('Please enter a valid stock amount.');
      return;
    }

    const newProduct = {
      id: String(products.length + 1),
      name: newProductName,
      stock: stockNum,
      price: priceNum,
      status: stockNum > 0 ? 'Active' : 'Out of Stock'
    };

    setProducts([...products, newProduct]);
    setShowAddForm(false);
    
    // Reset fields
    setNewProductName('');
    setNewProductPrice('');
    setNewProductStock('');
    setNewProductCategory('Textiles');
  };

  const handleWithdrawFunds = () => {
    if (walletBalance <= 0) {
      alert('Your Britsync Wallet balance is £0.00. No payouts are currently eligible for release.');
      return;
    }
    
    const confirmWithdraw = confirm(`Request manual withdrawal of £${walletBalance.toFixed(2)} to ${preferredMethod}?`);
    if (confirmWithdraw) {
      alert(`Manual withdrawal request submitted successfully!\n- £${walletBalance.toFixed(2)} is being processed via ${preferredMethod}.\n- Funds will arrive within 2-3 business days.\n- Your Britsync Wallet balance has been updated.`);
      setPaidOutAmount(prev => prev + walletBalance);
      setWalletBalance(0);
    }
  };

  const handleDownloadInvoice = (txnId: string) => {
    alert(`Downloading Britsync Commercial Payout Invoice: invoice-${txnId}.pdf\nArtisan Payout statement includes tax clearance and proof of direct local currency credit.`);
  };

  return (
    <main style={{ padding: '8rem 2rem 6rem', maxWidth: '1400px', margin: '0 auto', width: '100%', backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '4rem' }}>
        
        {/* Sidebar Navigation */}
        <aside>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ width: '80px', height: '80px', background: 'url(https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=800) center/cover', borderRadius: '50%', marginBottom: '1rem', border: '3px solid var(--accent)' }}></div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>Aisha Khan</h2>
            <p style={{ opacity: 0.7 }}>Aisha Heritage Textiles</p>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button onClick={() => { setActiveTab('products'); setShowAddForm(false); }} style={{ textAlign: 'left', padding: '1rem', borderRadius: '8px', border: 'none', background: activeTab === 'products' ? 'var(--surface)' : 'transparent', color: activeTab === 'products' ? 'var(--primary)' : 'inherit', fontWeight: activeTab === 'products' ? 'bold' : 'normal', cursor: 'pointer' }}>Manage Products</button>
            <button onClick={() => { setActiveTab('orders'); setShowAddForm(false); }} style={{ textAlign: 'left', padding: '1rem', borderRadius: '8px', border: 'none', background: activeTab === 'orders' ? 'var(--surface)' : 'transparent', color: activeTab === 'orders' ? 'var(--primary)' : 'inherit', fontWeight: activeTab === 'orders' ? 'bold' : 'normal', cursor: 'pointer' }}>Customer Orders</button>
            <button onClick={() => { setActiveTab('earnings'); setShowAddForm(false); }} style={{ textAlign: 'left', padding: '1rem', borderRadius: '8px', border: 'none', background: activeTab === 'earnings' ? 'var(--surface)' : 'transparent', color: activeTab === 'earnings' ? 'var(--primary)' : 'inherit', fontWeight: activeTab === 'earnings' ? 'bold' : 'normal', cursor: 'pointer' }}>Earnings & Wallet</button>
            <button onClick={() => { setActiveTab('passport'); setShowAddForm(false); }} style={{ textAlign: 'left', padding: '1rem', borderRadius: '8px', border: 'none', background: activeTab === 'passport' ? 'var(--surface)' : 'transparent', color: activeTab === 'passport' ? 'var(--primary)' : 'inherit', fontWeight: activeTab === 'passport' ? 'bold' : 'normal', cursor: 'pointer' }}>Passports & Verification</button>
            <button onClick={() => { setActiveTab('settings'); setShowAddForm(false); }} style={{ textAlign: 'left', padding: '1rem', borderRadius: '8px', border: 'none', background: activeTab === 'settings' ? 'var(--surface)' : 'transparent', color: activeTab === 'settings' ? 'var(--primary)' : 'inherit', fontWeight: activeTab === 'settings' ? 'bold' : 'normal', cursor: 'pointer' }}>Settings & Profile</button>
          </nav>
        </aside>

        {/* Content Area */}
        <div>
          {/* 1. PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>Your Products</h1>
                {!showAddForm && (
                  <button onClick={() => setShowAddForm(true)} className="btn-accent" style={{ padding: '0.75rem 1.5rem' }}>+ Add New Product</button>
                )}
              </div>

              {showAddForm ? (
                <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Add New Artisan Craft</h2>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--primary)' }}>Product Name</label>
                    <input type="text" value={newProductName} onChange={e => setNewProductName(e.target.value)} placeholder="e.g. Hand-Carved Oak Bowl" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>

                  <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--primary)' }}>
                      Desired Selling Price (GBP £)
                      <span 
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          width: '18px', 
                          height: '18px', 
                          borderRadius: '50%', 
                          backgroundColor: 'var(--accent)', 
                          color: 'var(--primary)', 
                          fontSize: '0.75rem', 
                          cursor: 'help',
                          fontWeight: 'bold'
                        }}
                        title="This is the exact amount you will receive after every successful sale."
                      >
                        ?
                      </span>
                    </label>
                    <input 
                      type="number" 
                      value={newProductPrice} 
                      onChange={e => setNewProductPrice(e.target.value)} 
                      placeholder="e.g. 20" 
                      style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ccc' }} 
                    />
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
                      ℹ️ This is the exact amount you will receive after every successful sale.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--primary)' }}>Initial Stock</label>
                      <input type="number" value={newProductStock} onChange={e => setNewProductStock(e.target.value)} placeholder="e.g. 10" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--primary)' }}>Category</label>
                      <select value={newProductCategory} onChange={e => setNewProductCategory(e.target.value)} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#fff', height: '52px' }}>
                        <option value="Textiles">Textiles</option>
                        <option value="Ceramics">Ceramics</option>
                        <option value="Jewelry">Jewelry</option>
                        <option value="Woodwork">Woodwork</option>
                        <option value="Leather">Leather</option>
                        <option value="Home Decor">Home Decor</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button 
                      type="button" 
                      onClick={() => setShowAddForm(false)} 
                      style={{ 
                        padding: '0.75rem 1.5rem', 
                        borderRadius: '8px', 
                        border: '1px solid #ccc', 
                        background: 'transparent', 
                        cursor: 'pointer' 
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      onClick={handleSaveProduct} 
                      className="btn-accent" 
                      style={{ 
                        padding: '0.75rem 1.5rem'
                      }}
                    >
                      Save Product
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                      <th style={{ padding: '1.5rem' }}>Product Name</th>
                      <th style={{ padding: '1.5rem' }}>Desired Price (You Receive)</th>
                      <th style={{ padding: '1.5rem' }}>Stock</th>
                      <th style={{ padding: '1.5rem' }}>Status</th>
                      <th style={{ padding: '1.5rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '1.5rem', fontWeight: 'bold' }}>{p.name}</td>
                        <td style={{ padding: '1.5rem' }}>
                          <div>£{p.price.toFixed(2)}</div>
                          <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.25rem' }}>Buyer pays: £{calculateSellingPrice(p.price).toFixed(2)}</div>
                        </td>
                        <td style={{ padding: '1.5rem' }}>{p.stock}</td>
                        <td style={{ padding: '1.5rem' }}>
                           <span style={{ 
                            backgroundColor: p.stock > 0 ? '#E8F5E9' : '#FFEBEE', 
                            color: p.stock > 0 ? '#2E7D32' : '#C62828',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold'
                          }}>
                            {p.stock > 0 ? 'Active' : 'Out of Stock'}
                          </span>
                        </td>
                        <td style={{ padding: '1.5rem' }}>
                          <button style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 'bold', marginRight: '1rem' }}>Edit</button>
                          <button style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', textDecoration: 'underline' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. CUSTOMER ORDERS TAB */}
          {activeTab === 'orders' && (
            <div>
              <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '2rem' }}>Customer Orders</h1>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                      <th style={{ padding: '1.5rem' }}>Order ID</th>
                      <th style={{ padding: '1.5rem' }}>Product</th>
                      <th style={{ padding: '1.5rem' }}>Buyer</th>
                      <th style={{ padding: '1.5rem' }}>Date</th>
                      <th style={{ padding: '1.5rem' }}>Status</th>
                      <th style={{ padding: '1.5rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '1.5rem', fontWeight: 'bold' }}>{o.id}</td>
                        <td style={{ padding: '1.5rem' }}>{o.product}</td>
                        <td style={{ padding: '1.5rem' }}>{o.buyer}</td>
                        <td style={{ padding: '1.5rem' }}>{o.date}</td>
                        <td style={{ padding: '1.5rem' }}>
                          <span style={{ 
                            backgroundColor: o.status === 'Delivered' ? '#e8f5e9' : o.status === 'Shipped' ? '#e0f2f1' : '#FFF3E0', 
                            color: o.status === 'Delivered' ? '#2E7D32' : o.status === 'Shipped' ? '#004d40' : '#E65100',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold'
                          }}>
                            {o.status}
                          </span>
                        </td>
                        <td style={{ padding: '1.5rem' }}>
                          {o.status === 'Order Received' && (
                            <button onClick={() => handleUpdateOrderStatus(o.id, 'Accepted')} style={{ border: 'none', backgroundColor: '#e3f2fd', color: '#1565c0', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem' }}>Accept Order</button>
                          )}
                          {o.status === 'Accepted' && (
                            <button onClick={() => handleUpdateOrderStatus(o.id, 'Preparing')} style={{ border: 'none', backgroundColor: '#fff3e0', color: '#e65100', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem' }}>Start Preparing</button>
                          )}
                          {o.status === 'Preparing' && (
                            <button onClick={() => handleUpdateOrderStatus(o.id, 'Packed')} style={{ border: 'none', backgroundColor: '#f3e5f5', color: '#4a148c', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem' }}>Mark Packed</button>
                          )}
                          {o.status === 'Packed' && (
                            <button onClick={() => handleUpdateOrderStatus(o.id, 'Shipped')} style={{ border: 'none', backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem' }}>Dispatch (Ship)</button>
                          )}
                          {o.status === 'Shipped' && (
                            <button onClick={() => handleUpdateOrderStatus(o.id, 'Delivered')} style={{ border: 'none', backgroundColor: '#e0f2f1', color: '#004d40', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem' }}>Confirm Delivered</button>
                          )}
                          {o.status === 'Delivered' && (
                            <span style={{ fontSize: '0.85rem', color: '#2e7d32', fontWeight: 'bold' }}>✓ Safe Arrival</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. EARNINGS & WALLET TAB */}
          {activeTab === 'earnings' && (
            <div>
              <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '2rem' }}>Earnings & Britsync Wallet</h1>
              
              {/* KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card">
                  <span style={{ opacity: 0.6, fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Available Balance</span>
                  <h2 style={{ fontSize: '2rem', color: 'var(--primary)', margin: '0.5rem 0' }}>£{walletBalance.toFixed(2)}</h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Escrow cleared</p>
                </div>
                <div className="card">
                  <span style={{ opacity: 0.6, fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Pending Earnings</span>
                  <h2 style={{ fontSize: '2rem', color: 'var(--primary)', margin: '0.5rem 0' }}>£{pendingAmount.toFixed(2)}</h2>
                  <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Locked in Escrow</p>
                </div>
                <div className="card">
                  <span style={{ opacity: 0.6, fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Paid Out</span>
                  <h2 style={{ fontSize: '2rem', color: 'var(--primary)', margin: '0.5rem 0' }}>£{paidOutAmount.toFixed(2)}</h2>
                  <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Transferred to settings</p>
                </div>
                <div className="card">
                  <span style={{ opacity: 0.6, fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Lifetime Earnings</span>
                  <h2 style={{ fontSize: '2rem', color: 'var(--primary)', margin: '0.5rem 0' }}>£{(walletBalance + paidOutAmount).toFixed(2)}</h2>
                  <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Total artisan revenue</p>
                </div>
              </div>

              {/* Wallet Card & Graph */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem', marginBottom: '4rem' }}>
                {/* Internal Britsync Wallet */}
                <div className="card" style={{ 
                  background: 'linear-gradient(135deg, var(--primary) 0%, #173630 100%)', 
                  color: 'var(--secondary)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  borderRadius: '20px',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '2.5rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', backgroundColor: 'rgba(200, 164, 93, 0.08)', borderRadius: '50%' }}></div>
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                      <span style={{ letterSpacing: '1.5px', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--accent)' }}>BRITSYNC WALLET</span>
                      <span style={{ fontSize: '1.5rem' }}>💳</span>
                    </div>
                    <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Secure Escrow-Backed Balance</span>
                    <h2 style={{ fontSize: '2.8rem', color: '#FAF9F6', margin: '0.25rem 0 1.5rem', fontFamily: 'var(--font-outfit)', fontWeight: 300 }}>£{walletBalance.toFixed(2)}</h2>
                  </div>
                  
                  <div>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8, lineHeight: 1.5, marginBottom: '1.5rem' }}>
                      🛡️ Money is held securely here. Withdraw anytime manually or hook up bank/digital transfer options.
                    </p>
                    <button 
                      onClick={handleWithdrawFunds}
                      className="btn-accent" 
                      style={{ 
                        width: '100%', 
                        padding: '1rem', 
                        border: 'none', 
                        fontWeight: 'bold',
                        borderRadius: '30px'
                      }}
                    >
                      Withdraw Balance
                    </button>
                  </div>
                </div>

                {/* SVG Revenue Graph */}
                <div className="card" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', margin: 0 }}>Earnings Growth Timeline</h3>
                    <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>AOV: £131.67 • Orders: {transactions.length}</span>
                  </div>
                  
                  {/* Line Chart Graphic */}
                  <div style={{ position: 'relative', height: '200px', width: '100%', borderBottom: '1px solid #eee', borderLeft: '1px solid #eee', paddingLeft: '1rem', paddingBottom: '1.5rem' }}>
                    <svg viewBox="0 0 500 150" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d="M 0 150 L 0 120 L 100 100 L 200 85 L 300 75 L 400 45 L 500 25 L 500 150 Z" fill="url(#chartGrad)" />
                      <path d="M 0 120 L 100 100 L 200 85 L 300 75 L 400 45 L 500 25" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="0" cy="120" r="5" fill="var(--primary)" stroke="var(--accent)" strokeWidth="2" />
                      <circle cx="100" cy="100" r="5" fill="var(--primary)" stroke="var(--accent)" strokeWidth="2" />
                      <circle cx="200" cy="85" r="5" fill="var(--primary)" stroke="var(--accent)" strokeWidth="2" />
                      <circle cx="300" cy="75" r="5" fill="var(--primary)" stroke="var(--accent)" strokeWidth="2" />
                      <circle cx="400" cy="45" r="5" fill="var(--primary)" stroke="var(--accent)" strokeWidth="2" />
                      <circle cx="500" cy="25" r="5" fill="var(--primary)" stroke="var(--accent)" strokeWidth="2" />
                    </svg>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.8rem', opacity: 0.6 }}>
                      <span>May</span>
                      <span>Jun</span>
                      <span>Jul</span>
                      <span>Aug</span>
                      <span>Sep</span>
                      <span>Oct</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payout & Frequency Settings */}
              <div className="card" style={{ marginBottom: '4rem', padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Payout & Gateway Settings</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--primary)' }}>Preferred Transfer Method</label>
                    <select 
                      value={preferredMethod} 
                      onChange={e => setPreferredMethod(e.target.value)} 
                      style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#fff', fontSize: '1rem' }}
                    >
                      <option value="Stripe Connect">Stripe Connect (Digital Wallet)</option>
                      <option value="Wise">Wise (Local Bank Currency Transfer)</option>
                      <option value="Bank Transfer">Direct Wire Bank Transfer</option>
                      <option value="Payoneer">Payoneer Wallet</option>
                      <option value="Britsync Wallet">Keep inside Britsync Internal Wallet</option>
                      <option value="Manual Transfer">Manual Curation Payout Transfer</option>
                    </select>
                    <span style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.5rem', display: 'block' }}>
                      Makers without local bank accounts are recommended to choose the internal wallet to hold funds securely.
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--primary)' }}>Automatic Payout Frequency</label>
                    <select 
                      value={payoutSchedule} 
                      onChange={e => setPayoutSchedule(e.target.value)} 
                      style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#fff', fontSize: '1rem' }}
                    >
                      <option value="Instant Payout">Instant Payout (Upon Escrow Clearance)</option>
                      <option value="Weekly">Weekly (Every Friday)</option>
                      <option value="Biweekly">Biweekly (1st and 15th)</option>
                      <option value="Monthly">Monthly Statement Payout</option>
                      <option value="Manual Request">Manual Request / Wallet Only</option>
                    </select>
                  </div>
                </div>
                
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => alert('Payout preferences updated successfully!')} className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
                    Save Preferences
                  </button>
                </div>
              </div>

              {/* Transactions Ledger */}
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Transaction & Payment History</h3>
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)', fontSize: '0.9rem' }}>
                        <th style={{ padding: '1.2rem 1.5rem' }}>Order ID / Date</th>
                        <th style={{ padding: '1.2rem 1.5rem' }}>Product / Destination</th>
                        <th style={{ padding: '1.2rem 1.5rem' }}>Pricing Structure</th>
                        <th style={{ padding: '1.2rem 1.5rem' }}>Payout Method</th>
                        <th style={{ padding: '1.2rem 1.5rem' }}>Status</th>
                        <th style={{ padding: '1.2rem 1.5rem' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(txn => (
                        <tr key={txn.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '1.5rem' }}>
                            <strong style={{ display: 'block' }}>{txn.orderId}</strong>
                            <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{txn.date}</span>
                          </td>
                          <td style={{ padding: '1.5rem' }}>
                            <span style={{ display: 'block', fontWeight: 'bold' }}>{txn.product}</span>
                            <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>To: {txn.buyerCountry}</span>
                          </td>
                          <td style={{ padding: '1.5rem' }}>
                            <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                              Your Price: £{txn.sellerAmount.toFixed(2)}
                            </div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                              Market Price: £{(txn.sellerAmount + txn.margin).toFixed(2)}
                            </div>
                          </td>
                          <td style={{ padding: '1.5rem', fontWeight: 'bold' }}>{txn.method}</td>
                          <td style={{ padding: '1.5rem' }}>
                            <span style={{ 
                              backgroundColor: txn.status === 'Completed' ? '#E8F5E9' : '#FFEBEE', 
                              color: txn.status === 'Completed' ? '#2E7D32' : '#C62828',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '20px',
                              fontSize: '0.85rem',
                              fontWeight: 'bold'
                            }}>
                              {txn.status}
                            </span>
                          </td>
                          <td style={{ padding: '1.5rem' }}>
                            <button 
                              onClick={() => handleDownloadInvoice(txn.id)}
                              style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
                            >
                              Download Invoice
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* 4. PASSPORTS & VERIFICATION TAB */}
          {activeTab === 'passport' && (
             <div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                 <div>
                   <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', margin: 0 }}>Passports & Verification</h1>
                   <p style={{ opacity: 0.7, margin: '0.25rem 0 0' }}>Monitor your Britsync Export Readiness Index and compliance status.</p>
                 </div>
                 <button 
                   onClick={() => alert('Dispatched urgent request to local inspector tariq@britsync.com.')} 
                   className="btn-accent" 
                   style={{ padding: '0.75rem 1.5rem' }}
                 >
                   Request Priority Inspection
                 </button>
               </div>

               {/* Grid layout for score and checklist */}
               <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'start' }}>
                 
                 {/* Left Column: Interactive Checkpoints */}
                 <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                   <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', margin: 0, borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                     Export Compliance Checkpoints
                   </h3>
                   <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: 1.5, margin: 0 }}>
                     Select/uncheck items below to simulate completion of verification steps and watch your Export Readiness Score update.
                   </p>

                   {/* Verification switches */}
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '0.5rem' }}>
                      
                      <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={readinessStep1} 
                          onChange={(e) => setReadinessStep1(e.target.checked)}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} 
                        />
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>Identity Verified (+20 pts)</strong>
                          <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6 }}>Passport ID, biometric facial recognition, and tax registry validated.</span>
                        </div>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={readinessStep2} 
                          onChange={(e) => setReadinessStep2(e.target.checked)}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} 
                        />
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>Workshop Registered (+20 pts)</strong>
                          <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6 }}>GPS coordinates registered and local artisan guild certificate uploaded.</span>
                        </div>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={readinessStep3} 
                          onChange={(e) => setReadinessStep3(e.target.checked)}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} 
                        />
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>Story Complete (+15 pts)</strong>
                          <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6 }}>Artisan narrative, family lineage biography, and video statement submitted.</span>
                        </div>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={readinessStep4} 
                          onChange={(e) => setReadinessStep4(e.target.checked)}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} 
                        />
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>Product Images Good (+15 pts)</strong>
                          <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6 }}>High-resolution white-background catalog photography uploaded.</span>
                        </div>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={readinessStep5} 
                          onChange={(e) => setReadinessStep5(e.target.checked)}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} 
                        />
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>Export Documents Submitted (+10 pts)</strong>
                          <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6 }}>Required HS code declaration, certificate of origin, and custom labels.</span>
                        </div>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={readinessStep6} 
                          onChange={(e) => setReadinessStep6(e.target.checked)}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} 
                        />
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>Premium Packing Standard Approved (+10 pts)</strong>
                          <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6 }}>Artisanal crating in insulated wood, wool cushioning padding to prevent transit breakage.</span>
                        </div>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={readinessStep7} 
                          onChange={(e) => setReadinessStep7(e.target.checked)}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} 
                        />
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>Field Inspector On-Site Audit Cleared (+10 pts)</strong>
                          <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6 }}>Physical verification of safety, labor wages, and working conditions by Tariq M.</span>
                        </div>
                      </label>

                    </div>
                 </div>

                 {/* Right Column: Scorecard & Personalized Recommendations */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                   
                   {/* Score Display Card */}
                   <div className="card" style={{ padding: '2.5rem', textAlign: 'center', borderTop: '4px solid var(--accent)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}>
                     <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>
                       Britsync Export Readiness Score
                     </span>
                     
                     {/* Score circle */}
                     {(() => {
                        const calculatedScore = (readinessStep1 ? 20 : 0) + 
                                                (readinessStep2 ? 20 : 0) + 
                                                (readinessStep3 ? 15 : 0) + 
                                                (readinessStep4 ? 15 : 0) + 
                                                (readinessStep5 ? 10 : 0) + 
                                                (readinessStep6 ? 10 : 5) + 
                                                (readinessStep7 ? 10 : 9);
                        return (
                          <div style={{ padding: '1rem 0' }}>
                            <h2 style={{ fontSize: '3.5rem', color: 'var(--primary)', margin: 0, fontFamily: 'var(--font-outfit)', fontWeight: 'bold' }}>
                              {calculatedScore}<span style={{ fontSize: '1.5rem', opacity: 0.5 }}>/100</span>
                            </h2>
                          </div>
                        );
                      })()}

                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', textAlign: 'left', fontSize: '0.85rem' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', color: readinessStep1 ? '#2E7D32' : '#C62828', fontWeight: 'bold' }}>
                         <span>{readinessStep1 ? '✓ Identity Verified' : '✗ Identity Verification Missing'}</span>
                         <span>{readinessStep1 ? '+20 pts' : '0 pts'}</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', color: readinessStep2 ? '#2E7D32' : '#C62828', fontWeight: 'bold' }}>
                         <span>{readinessStep2 ? '✓ Workshop Registered' : '✗ Workshop Registry Missing'}</span>
                         <span>{readinessStep2 ? '+20 pts' : '0 pts'}</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', color: readinessStep3 ? '#2E7D32' : '#C62828', fontWeight: 'bold' }}>
                         <span>{readinessStep3 ? '✓ Story Complete' : '✗ Story Form Incomplete'}</span>
                         <span>{readinessStep3 ? '+15 pts' : '0 pts'}</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', color: readinessStep4 ? '#2E7D32' : '#C62828', fontWeight: 'bold' }}>
                         <span>{readinessStep4 ? '✓ Product Images Good' : '✗ Upload High-Res Images'}</span>
                         <span>{readinessStep4 ? '+15 pts' : '0 pts'}</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', color: readinessStep5 ? '#2E7D32' : '#C62828', fontWeight: 'bold' }}>
                         <span>{readinessStep5 ? '✓ Export Documents Submitted' : '✗ Export Documents Missing'}</span>
                         <span>{readinessStep5 ? '+10 pts' : '0 pts'}</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', color: readinessStep6 ? '#2E7D32' : '#E65100', fontWeight: 'bold' }}>
                         <span>{readinessStep6 ? '✓ Premium Packaging Approved' : '⚠ Packaging Needs Improvement'}</span>
                         <span>{readinessStep6 ? '+10 pts' : '+5 pts'}</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', color: readinessStep7 ? '#2E7D32' : '#E65100', fontWeight: 'bold' }}>
                         <span>{readinessStep7 ? '✓ On-Site Audit Cleared' : '⚠ Inspection Pending'}</span>
                         <span>{readinessStep7 ? '+10 pts' : '+9 pts'}</span>
                       </div>
                     </div>
                   </div>

                   {/* Recommendations Panel */}
                   <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                     <h4 style={{ fontSize: '1.1rem', color: 'var(--primary)', margin: 0, fontWeight: 'bold' }}>
                       Personalized Action Plan
                     </h4>
                      
                      {(() => {
                        const calculatedScore = (readinessStep1 ? 20 : 0) + 
                                                (readinessStep2 ? 20 : 0) + 
                                                (readinessStep3 ? 15 : 0) + 
                                                (readinessStep4 ? 15 : 0) + 
                                                (readinessStep5 ? 10 : 0) + 
                                                (readinessStep6 ? 10 : 5) + 
                                                (readinessStep7 ? 10 : 9);
                        if (calculatedScore === 100) {
                          return (
                            <div style={{ padding: '1rem', border: '1px solid #388E3C', borderRadius: '8px', backgroundColor: '#e8f5e9', color: '#2e7d32', fontWeight: 'bold', fontSize: '0.85rem', textAlign: 'center' }}>
                              🎉 Excellent! Your workshop is 100% export-ready. Elite status has been successfully unlocked.
                            </div>
                          );
                        }
                        return (
                          <>
                            <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: 0 }}>
                              Complete the remaining steps below to elevate your workshop to <strong>Elite</strong> and unlock international buyer routes.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', lineHeight: 1.4 }}>
                              {!readinessStep5 && (
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                  <span style={{ fontSize: '1.2rem' }}>📄</span>
                                  <div>
                                    <strong style={{ display: 'block', color: 'var(--primary)' }}>Submit Commercial Export Docs</strong>
                                    <span style={{ opacity: 0.8 }}>Upload your regional export license and complete custom declarations (+10 pts).</span>
                                  </div>
                                </div>
                              )}

                              {!readinessStep6 && (
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                  <span style={{ fontSize: '1.2rem' }}>📦</span>
                                  <div>
                                    <strong style={{ display: 'block', color: 'var(--primary)' }}>Upgrade Packaging Standards</strong>
                                    <span style={{ opacity: 0.8 }}>Switch to premium wood crating lined with wool padding to pass impact requirements (+5 pts).</span>
                                  </div>
                                </div>
                              )}

                              {!readinessStep7 && (
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                  <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                                  <div>
                                    <strong style={{ display: 'block', color: 'var(--primary)' }}>Clear Physical Inspection Audit</strong>
                                    <span style={{ opacity: 0.8 }}>Field Inspector Tariq M. is scheduled to visit your studio for wage and material validation checks (+1 pt).</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        );
                      })()}
                   </div>

                 </div>

               </div>
              </div>
           )}

          {activeTab === 'settings' && (
            <div>
              <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '2rem' }}>Settings & Profile</h1>
              <div className="card" style={{ padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Business Registration Info</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Founder Name</label>
                    <input type="text" defaultValue="Aisha Khan" style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Business Studio Name</label>
                    <input type="text" defaultValue="Aisha Heritage Textiles" style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Country of Origin</label>
                    <input type="text" defaultValue="Pakistan" style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Years in Craft Business</label>
                    <input type="number" defaultValue="45" style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                </div>

                <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem', marginTop: '3rem' }}>Local Artisan Staffing</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Active Employee Count</label>
                    <input type="number" defaultValue="12" style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Staff Support Guild Certification</label>
                    <input type="text" defaultValue="Sindh Artisans Guild Certificate #SAG-204" style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                  <button onClick={() => alert('✓ Maker settings saved successfully.')} className="btn-accent" style={{ padding: '0.85rem 2rem' }}>Save Settings</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
