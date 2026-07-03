'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  image: string;
  maker: string;
}

interface Order {
  id: string;
  date: string;
  status: string; // Order Received -> Accepted -> Preparing -> Packed -> Shipped -> Tracking -> Delivered -> Review
  courierName: string;
  trackingNumber: string;
  estimatedDelivery: string;
  shippingAddress: any;
  billingAddress: any;
  subtotal: number;
  vat: number;
  discount: number;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  items: OrderItem[];
}

export default function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [notifications, setNotifications] = useState([
    { id: '1', title: '🔒 Escrow Protection Active', message: 'Your payment for Ajrak Shawl is held securely. It will be released upon safe courier transit verification.', date: 'Today' },
    { id: '2', title: '🌱 Traditional Weaving Certified', message: 'Bursa Ceramics certified passport issued by Inspector Tariq M. with active GPS tracks.', date: 'Yesterday' },
    { id: '3', title: '📦 Welcome to Britsync!', message: 'Thank you for supporting global authentic artisans.', date: 'Oct 12, 2025' }
  ]);
  
  const [addresses, setAddresses] = useState({
    shippingName: 'Jane Buyer',
    shippingLine: '82 Regency Square',
    shippingCity: 'London',
    shippingPostcode: 'SW1A 1AA',
    shippingCountry: 'United Kingdom',
    billingName: 'Jane Buyer',
    billingLine: '82 Regency Square',
    billingCity: 'London',
    billingPostcode: 'SW1A 1AA',
    billingCountry: 'United Kingdom'
  });

  const [wallet, setWallet] = useState({
    balance: 150.00,
    currency: 'GBP',
    transactions: [
      { id: 'TXN-W001', date: 'Jan 24, 2026', type: 'Refund Credit', amount: 80.00, status: 'Cleared' },
      { id: 'TXN-W002', date: 'Jan 12, 2026', type: 'Gift Voucher Card Deposit', amount: 100.00, status: 'Cleared' }
    ]
  });

  const [savedMakers, setSavedMakers] = useState([
    { id: '1', name: "Aisha Heritage Textiles", badge: "GI Certified", country: "Pakistan", image: "https://images.unsplash.com/photo-1588615419951-dc668b59fa87?auto=format&fit=crop&q=80&w=800" },
    { id: '2', name: "Anatolian Heritage", badge: "Elite Maker", country: "Turkey", image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=800" }
  ]);

  const [savedStories, setSavedStories] = useState([
    { id: 'story-1', title: 'Fatima\'s Threads of Hope', excerpt: 'Fatima’s block-printing collective creates a lifeline in rural Morocco.', image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=800' }
  ]);

  // Load orders and wishlist from localStorage on mount
  useEffect(() => {
    // Orders
    const savedOrders = localStorage.getItem('britsync_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        setOrders([]);
      }
    } else {
      // Default mock orders if none exist
      const mockOrders: Order[] = [
        {
          id: 'ORD-9823',
          date: '28 Oct 2025',
          status: 'Delivered',
          courierName: 'DHL Express Europe Sovereign',
          trackingNumber: 'BS-DHL-82194012',
          estimatedDelivery: 'Completed on 31 Oct 2025',
          shippingAddress: { fullName: 'Jane Buyer', addressLine: '82 Regency Square', city: 'London', postcode: 'SW1A 1AA', country: 'United Kingdom' },
          billingAddress: { fullName: 'Jane Buyer', addressLine: '82 Regency Square', city: 'London', postcode: 'SW1A 1AA', country: 'United Kingdom' },
          subtotal: 600.00,
          vat: 120.00,
          discount: 50.00,
          shippingCost: 25.00,
          total: 695.00,
          paymentMethod: 'Credit Card',
          items: [
            { id: '1', name: "Hand-Block Printed Ajrak Shawl", qty: 1, price: 150.00, image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800", maker: "Aisha Heritage Textiles" },
            { id: '2', name: "Vintage Wool Kilim", qty: 1, price: 450.00, image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800", maker: "Anatolian Heritage" }
          ]
        }
      ];
      setOrders(mockOrders);
      localStorage.setItem('britsync_orders', JSON.stringify(mockOrders));
    }

    // Wishlist
    const savedWishlist = localStorage.getItem('britsync_wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {}
    }
  }, []);

  const handleUpdateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    alert('✓ Addresses updated successfully.');
  };

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert('✓ Settings saved successfully.');
  };

  const handleDeleteAccount = () => {
    if (confirm('⚠️ Warning: Are you sure you want to permanently delete your account? This action cannot be undone under GDPR rules.')) {
      alert('GDPR Account delete request queued. You will receive a confirmation email shortly.');
      localStorage.clear();
      window.location.href = '/';
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ orders, wishlist, addresses, wallet, savedMakers }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "britsync_GDPR_buyer_data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    alert('✓ GDPR Personal Data Export generated successfully.');
  };

  // Status mapping
  const statuses = ['Order Received', 'Accepted', 'Preparing', 'Packed', 'Shipped', 'Tracking', 'Delivered', 'Review'];
  const getStatusIndex = (status: string) => {
    const idx = statuses.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <main style={{ padding: '8rem 2rem 6rem', maxWidth: '1400px', margin: '0 auto', width: '100%', backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '4rem' }}>
        
        {/* Sidebar Navigation */}
        <aside style={{ borderRight: '1px solid #eee', paddingRight: '2rem' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ width: '70px', height: '70px', backgroundColor: 'var(--accent)', borderRadius: '50%', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>JB</div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', margin: '0 0 0.25rem' }}>Jane Buyer</h2>
            <p style={{ opacity: 0.6, fontSize: '0.9rem', margin: 0 }}>buyer@example.com</p>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {[
              { id: 'orders', name: '📦 Orders & History' },
              { id: 'wishlist', name: '♡ Wishlist' },
              { id: 'makers', name: '🏺 Saved Makers' },
              { id: 'stories', name: '📖 Saved Stories' },
              { id: 'certificates', name: '📜 Certificates' },
              { id: 'addresses', name: '📍 Addresses' },
              { id: 'wallet', name: '💳 Wallet & Escrow' },
              { id: 'notifications', name: '🔔 Notifications' },
              { id: 'invoices', name: '🧾 Invoices' },
              { id: 'settings', name: '⚙️ Settings' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                style={{ 
                  textAlign: 'left', 
                  padding: '0.85rem 1rem', 
                  borderRadius: '8px', 
                  border: 'none', 
                  background: activeTab === tab.id ? 'var(--surface)' : 'transparent', 
                  color: activeTab === tab.id ? 'var(--primary)' : 'inherit', 
                  fontWeight: activeTab === tab.id ? 'bold' : 'normal', 
                  cursor: 'pointer',
                  fontSize: '0.95rem'
                }}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div>
          {/* 1. ORDERS */}
          {activeTab === 'orders' && (
            <div>
              <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '2rem' }}>Order History</h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {orders.length === 0 ? (
                  <p style={{ opacity: 0.7 }}>You haven't placed any orders yet.</p>
                ) : (
                  orders.map(order => {
                    const currentStatusIdx = getStatusIndex(order.status);
                    return (
                      <div key={order.id} className="card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '1.2rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                          <div>
                            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', margin: '0 0 0.25rem' }}>Order #{order.id}</h3>
                            <p style={{ opacity: 0.6, fontSize: '0.85rem', margin: 0 }}>Placed on {order.date} • {order.items.length} items</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ 
                              backgroundColor: '#E8F5E9', 
                              color: '#2E7D32',
                              padding: '0.4rem 1rem',
                              borderRadius: '20px',
                              fontSize: '0.85rem',
                              fontWeight: 'bold',
                              display: 'inline-block'
                            }}>
                              Status: {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Workflow Timeline */}
                        <div style={{ marginBottom: '2.5rem', marginTop: '1rem' }}>
                          <p style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary)' }}>Fulfillment & Inspection Track:</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', width: '100%', overflowX: 'auto', paddingBottom: '1rem' }}>
                            {statuses.map((st, idx) => {
                              const active = idx <= currentStatusIdx;
                              return (
                                <div key={st} style={{ flex: 1, minWidth: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
                                  <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: active ? 'var(--primary)' : '#eee',
                                    color: active ? 'var(--accent)' : '#aaa',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    zIndex: 1
                                  }}>
                                    {idx + 1}
                                  </div>
                                  <span style={{ fontSize: '0.7rem', marginTop: '0.5rem', opacity: active ? 1 : 0.5, fontWeight: active ? 'bold' : 'normal' }}>{st}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Order Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                          {order.items.map(item => (
                            <div key={item.id} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                              <div style={{ width: '80px', height: '80px', background: `url(${item.image}) center/cover`, borderRadius: '8px' }}></div>
                              <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 0.25rem', color: 'var(--primary)' }}>{item.name}</h4>
                                <p style={{ fontSize: '0.85rem', opacity: 0.6, margin: 0 }}>Maker: {item.maker} • Qty: {item.qty}</p>
                              </div>
                              <p style={{ fontWeight: 'bold' }}>£{(item.price * item.qty).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer & Actions */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #eee', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                          <div style={{ fontSize: '0.85rem' }}>
                            <p style={{ margin: '0 0 0.25rem' }}>Courier: <strong>{order.courierName}</strong></p>
                            <p style={{ margin: 0 }}>Tracking: <strong style={{ color: 'var(--accent)' }}>{order.trackingNumber}</strong> ({order.estimatedDelivery})</p>
                          </div>
                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <p style={{ fontSize: '1.4rem', fontWeight: 'bold', marginRight: '1rem', margin: 0 }}>Total: £{order.total.toFixed(2)}</p>
                            <Link href="/cart?step=3" style={{ textDecoration: 'none' }}>
                              <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', backgroundColor: 'var(--surface)', color: 'var(--primary)', border: '1px solid #ccc' }}>View Invoice</button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* 2. WISHLIST */}
          {activeTab === 'wishlist' && (
            <div>
              <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '2rem' }}>My Saved Wishlist</h1>
              {wishlist.length === 0 ? (
                <p style={{ opacity: 0.7 }}>Your wishlist is currently empty.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                  {wishlist.map(item => (
                    <div key={item.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '220px', background: `url(${item.image}) center/cover` }}></div>
                      <div style={{ padding: '1.5rem' }}>
                         <span style={{ fontSize: '0.75rem', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 'bold' }}>{item.maker}</span>
                         <h3 style={{ fontSize: '1.15rem', marginTop: '0.25rem', marginBottom: '1rem', color: 'var(--primary)' }}>{item.name}</h3>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <strong style={{ fontSize: '1.1rem' }}>£{item.price.toFixed(2)}</strong>
                           <Link href={`/products/${item.id}`} className="btn-accent" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', textDecoration: 'none' }}>View Item</Link>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. SAVED MAKERS */}
          {activeTab === 'makers' && (
            <div>
              <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '2rem' }}>Saved Makers</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {savedMakers.map(maker => (
                  <div key={maker.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '180px', background: `url(${maker.image}) center/cover` }}></div>
                    <div style={{ padding: '1.5rem' }}>
                       <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase' }}>{maker.badge}</span>
                       <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>{maker.name}</h3>
                       <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1.5rem' }}>Region: {maker.country}</p>
                       <Link href={`/makers/${maker.id}`} className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '0.5rem', backgroundColor: 'var(--surface)', color: 'var(--primary)', border: '1px solid #ccc', fontSize: '0.9rem' }}>View Profile</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. SAVED STORIES */}
          {activeTab === 'stories' && (
            <div>
              <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '2rem' }}>Saved Stories</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {savedStories.map(story => (
                  <div key={story.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '200px', background: `url(${story.image}) center/cover` }}></div>
                    <div style={{ padding: '1.5rem' }}>
                       <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{story.title}</h3>
                       <p style={{ opacity: 0.7, fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>{story.excerpt}</p>
                       <Link href={`/stories/${story.id}`} className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '0.5rem', backgroundColor: 'var(--surface)', color: 'var(--primary)', border: '1px solid #ccc', fontSize: '0.9rem' }}>Read Story</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div>
              <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '2rem' }}>Digital Authenticity Certificates</h1>
              <p style={{ opacity: 0.8, marginBottom: '2.5rem' }}>View the legally certified cryptographic verification passports for your items.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {orders.map(order => (
                  order.items.map((item, idx) => (
                    <div key={idx} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📜</div>
                        <div>
                          <h4 style={{ margin: '0 0 0.25rem', color: 'var(--primary)' }}>{item.name}</h4>
                          <p style={{ fontSize: '0.85rem', opacity: 0.6, margin: 0 }}>Certificate ID: <strong style={{ color: 'var(--accent)' }}>BS-ELITE-{order.id.replace('ORD-', '')}-{item.id}</strong></p>
                          <p style={{ fontSize: '0.8rem', opacity: 0.5, margin: 0 }}>Inspector Tariq M. • GPS Verified • 100% Hand-made</p>
                        </div>
                      </div>
                      <Link href={`/passport/${item.id}`} style={{ textDecoration: 'none' }}>
                        <button className="btn-accent" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>View Passport</button>
                      </Link>
                    </div>
                  ))
                ))}
              </div>
            </div>
          )}

          {/* 6. ADDRESSES */}
          {activeTab === 'addresses' && (
            <div>
              <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '2rem' }}>Saved Addresses</h1>
              <form onSubmit={handleUpdateAddress} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="card">
                  <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Default Shipping Address</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input type="text" placeholder="Full Name" value={addresses.shippingName} onChange={e => setAddresses({...addresses, shippingName: e.target.value})} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                    <input type="text" placeholder="Street Address" value={addresses.shippingLine} onChange={e => setAddresses({...addresses, shippingLine: e.target.value})} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <input type="text" placeholder="City" value={addresses.shippingCity} onChange={e => setAddresses({...addresses, shippingCity: e.target.value})} style={{ flex: 1, padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                      <input type="text" placeholder="Postcode" value={addresses.shippingPostcode} onChange={e => setAddresses({...addresses, shippingPostcode: e.target.value})} style={{ flex: 1, padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                    </div>
                    <input type="text" placeholder="Country" value={addresses.shippingCountry} onChange={e => setAddresses({...addresses, shippingCountry: e.target.value})} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                </div>

                <div className="card">
                  <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Default Billing Address</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input type="text" placeholder="Full Name" value={addresses.billingName} onChange={e => setAddresses({...addresses, billingName: e.target.value})} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                    <input type="text" placeholder="Street Address" value={addresses.billingLine} onChange={e => setAddresses({...addresses, billingLine: e.target.value})} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <input type="text" placeholder="City" value={addresses.billingCity} onChange={e => setAddresses({...addresses, billingCity: e.target.value})} style={{ flex: 1, padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                      <input type="text" placeholder="Postcode" value={addresses.billingPostcode} onChange={e => setAddresses({...addresses, billingPostcode: e.target.value})} style={{ flex: 1, padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                    </div>
                    <input type="text" placeholder="Country" value={addresses.billingCountry} onChange={e => setAddresses({...addresses, billingCountry: e.target.value})} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                </div>

                <button type="submit" className="btn-accent" style={{ alignSelf: 'flex-start', padding: '1rem 2.5rem' }}>Save Addresses</button>
              </form>
            </div>
          )}

          {/* 7. WALLET */}
          {activeTab === 'wallet' && (
            <div>
              <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '2rem' }}>Britsync Wallet</h1>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>Escrow Escort Credit Balance</span>
                  <h2 style={{ fontSize: '3rem', color: 'var(--primary)', margin: '0.5rem 0' }}>£{wallet.balance.toFixed(2)}</h2>
                  <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: 0 }}>This balance can be applied to any checkout items instantly.</p>
                </div>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3>Deposit Credit Funds</h3>
                  <input type="number" placeholder="Amount (£)" style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                  <button onClick={() => alert('Credit deposit transaction cleared!')} className="btn-accent">Load Funds</button>
                </div>
              </div>

              <div className="card" style={{ padding: 0 }}>
                <h3 style={{ padding: '1.5rem', borderBottom: '1px solid #eee', color: 'var(--primary)', margin: 0 }}>Wallet Transactions Log</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--surface)', color: 'var(--primary)' }}>
                      <th style={{ padding: '1rem' }}>Txn ID</th>
                      <th style={{ padding: '1rem' }}>Date</th>
                      <th style={{ padding: '1rem' }}>Description</th>
                      <th style={{ padding: '1rem', textAlign: 'right' }}>Amount</th>
                      <th style={{ padding: '1rem', textAlign: 'center' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wallet.transactions.map((txn, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>{txn.id}</td>
                        <td style={{ padding: '1rem' }}>{txn.date}</td>
                        <td style={{ padding: '1rem' }}>{txn.type}</td>
                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: txn.amount > 0 ? '#2E7D32' : 'inherit' }}>
                          {txn.amount > 0 ? '+' : ''}£{txn.amount.toFixed(2)}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.8rem', color: '#2E7D32', backgroundColor: '#E8F5E9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>{txn.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 8. NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div>
              <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '2rem' }}>Notification Hub</h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {notifications.map(n => (
                  <div key={n.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem', color: 'var(--primary)', fontSize: '1.1rem' }}>{n.title}</h4>
                      <p style={{ margin: 0, opacity: 0.8, fontSize: '0.95rem' }}>{n.message}</p>
                    </div>
                    <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>{n.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. INVOICES */}
          {activeTab === 'invoices' && (
            <div>
              <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '2rem' }}>Past Billing Statements</h1>
              <div className="card" style={{ padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--surface)', color: 'var(--primary)' }}>
                      <th style={{ padding: '1rem' }}>Invoice Code</th>
                      <th style={{ padding: '1rem' }}>Billing Date</th>
                      <th style={{ padding: '1rem' }}>Items Ordered</th>
                      <th style={{ padding: '1rem', textAlign: 'right' }}>Total Billed</th>
                      <th style={{ padding: '1rem', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>INV-{order.id.replace('ORD-', '')}</td>
                        <td style={{ padding: '1rem' }}>{order.date}</td>
                        <td style={{ padding: '1rem' }}>{order.items.length} items</td>
                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>£{order.total.toFixed(2)}</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <Link href="/cart?step=3" style={{ textDecoration: 'none' }}>
                            <button className="btn-accent" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>Print Receipt</button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 10. SETTINGS */}
          {activeTab === 'settings' && (
            <div>
              <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '2rem' }}>Account Settings</h1>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <form onSubmit={handleUpdateSettings} className="card">
                  <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Profile Details</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7, fontSize: '0.9rem' }}>Full Name</label>
                      <input type="text" defaultValue="Jane Buyer" style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7, fontSize: '0.9rem' }}>Email Address</label>
                      <input type="email" defaultValue="buyer@example.com" style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                    </div>
                  </div>
                  <button type="submit" className="btn-accent">Save Settings</button>
                </form>

                <div className="card">
                  <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>GDPR Compliance & Privacy Tools</h3>
                  <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.5 }}>
                    Under GDPR rules, you are in complete control of your account data. You can export all your purchase activity logs, addresses, and saved data or delete your account permanently.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button onClick={handleExportData} className="btn-accent" style={{ padding: '0.85rem 2rem' }}>📥 Download My Data (JSON)</button>
                    <button onClick={handleDeleteAccount} className="btn-primary" style={{ backgroundColor: 'transparent', border: '1px solid var(--error)', color: 'var(--error)', padding: '0.85rem 2rem' }}>⚠️ Delete My Account</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
