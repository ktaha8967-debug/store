'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { calculateSellingPrice } from '@/lib/pricing';

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  maker?: string;
}

export default function CartPage() {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Checkout Fields
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    addressLine: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
  });
  
  const [billingAddress, setBillingAddress] = useState({
    sameAsShipping: true,
    fullName: '',
    addressLine: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: '',
  });

  // Courier selection
  const [courier, setCourier] = useState('dhl');
  const courierOptions = [
    { id: 'royal_mail', name: 'Royal Mail International Premium', cost: 15.0, est: 'Est. 4-6 business days', rule: 'Standard pre-cleared customs' },
    { id: 'dhl', name: 'DHL Express Europe Sovereign', cost: 25.0, est: 'Est. 2-3 business days', rule: 'Europe duty pre-paid (DDP)' },
    { id: 'fedex', name: 'FedEx Priority International', cost: 35.0, est: 'Est. 1-2 business days', rule: 'Express priority logistics' }
  ];

  // Promo code / Gift Card states
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('britsync_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        setCart([]);
      }
    } else {
      // Default initial mock if empty
      const defaultCart = [
        { id: '1', name: "Hand-Block Printed Ajrak Shawl", maker: "Aisha Heritage Textiles", price: calculateSellingPrice(150), qty: 1, image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800" },
        { id: '2', name: "Vintage Wool Kilim", maker: "Anatolian Heritage", price: calculateSellingPrice(450), qty: 1, image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800" },
      ];
      setCart(defaultCart);
      localStorage.setItem('britsync_cart', JSON.stringify(defaultCart));
    }
  }, []);

  const saveCartToStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('britsync_cart', JSON.stringify(newCart));
    // Trigger header updates
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const updateQty = (id: string, delta: number) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    });
    saveCartToStorage(newCart);
  };

  const remove = (id: string) => {
    const newCart = cart.filter(item => item.id !== id);
    saveCartToStorage(newCart);
  };

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (code === 'BRITSYNC20') {
      const disc = subtotal * 0.20;
      setDiscountAmount(disc);
      setAppliedPromo('BRITSYNC20 (20% Off)');
      alert('Promo code applied! 20% discount deducted from subtotal.');
    } else if (code === 'WELCOME10') {
      const disc = subtotal * 0.10;
      setDiscountAmount(disc);
      setAppliedPromo('WELCOME10 (10% Off)');
      alert('Promo code applied! 10% discount deducted from subtotal.');
    } else if (code === 'GIFT-50') {
      setDiscountAmount(50);
      setAppliedPromo('GIFT-50 (£50.00 Gift Card)');
      alert('Gift card applied successfully! £50.00 deducted from total.');
    } else {
      alert('Invalid promo code or gift card number. Try WELCOME10, BRITSYNC20, or GIFT-50.');
    }
    setPromoCode('');
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const selectedCourier = courierOptions.find(c => c.id === courier) || courierOptions[1];
  const shippingCost = selectedCourier.cost;
  
  // VAT Calculation (20% VAT standard for UK/EU)
  const vatRate = 0.20;
  const vatAmount = subtotal * vatRate;
  
  const total = Math.max(0, subtotal - discountAmount + shippingCost + vatAmount);

  // Generate invoice & place order in local storage
  const handlePlaceOrder = () => {
    if (!shippingAddress.fullName || !shippingAddress.addressLine || !shippingAddress.city || !shippingAddress.postcode) {
      alert('Please fill out all required shipping details.');
      return;
    }

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Order Received', // Order Received -> Accepted -> Preparing -> Packed -> Shipped -> Tracking -> Delivered
      courierName: selectedCourier.name,
      trackingNumber: `BS-${selectedCourier.id.toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`,
      estimatedDelivery: selectedCourier.est,
      shippingAddress,
      billingAddress: billingAddress.sameAsShipping ? shippingAddress : billingAddress,
      subtotal,
      vat: vatAmount,
      discount: discountAmount,
      shippingCost,
      total,
      paymentMethod,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        image: item.image,
        maker: item.maker || 'Verified Artisan Studio'
      }))
    };

    // Save to orders history
    const existingOrdersStr = localStorage.getItem('britsync_orders');
    let ordersList = [];
    if (existingOrdersStr) {
      try {
        ordersList = JSON.parse(existingOrdersStr);
      } catch (e) {}
    }
    ordersList.unshift(newOrder);
    localStorage.setItem('britsync_orders', JSON.stringify(ordersList));

    // Clear cart
    saveCartToStorage([]);
    localStorage.setItem('last_placed_order', JSON.stringify(newOrder));
    setStep(3);
  };

  const printInvoice = () => {
    window.print();
  };

  const lastOrderStr = typeof window !== 'undefined' ? localStorage.getItem('last_placed_order') : null;
  let lastOrderObj = null;
  if (lastOrderStr) {
    try {
      lastOrderObj = JSON.parse(lastOrderStr);
    } catch(e) {}
  }

  return (
    <main className="animate-fade-in" style={{ backgroundColor: 'var(--background)', minHeight: '100vh', paddingTop: '8rem', paddingBottom: '6rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Progress Indicator */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem', gap: '2rem', alignItems: 'center' }}>
          <div style={{ color: step >= 1 ? 'var(--primary)' : '#ccc', fontWeight: step >= 1 ? 'bold' : 'normal' }}>1. Shopping Bag</div>
          <div style={{ width: '50px', height: '2px', backgroundColor: step >= 2 ? 'var(--primary)' : '#eee' }}></div>
          <div style={{ color: step >= 2 ? 'var(--primary)' : '#ccc', fontWeight: step >= 2 ? 'bold' : 'normal' }}>2. Secure Checkout</div>
          <div style={{ width: '50px', height: '2px', backgroundColor: step >= 3 ? 'var(--primary)' : '#eee' }}></div>
          <div style={{ color: step >= 3 ? 'var(--primary)' : '#ccc', fontWeight: step >= 3 ? 'bold' : 'normal' }}>3. Order Complete</div>
        </div>

        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '4rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '2rem' }}>Your Bag</h1>
              {cart.length === 0 ? (
                <div style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: 'var(--surface)', borderRadius: '16px' }}>
                  <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Your shopping bag is empty.</p>
                  <Link href="/search" className="btn-accent" style={{ padding: '1rem 2rem', textDecoration: 'none' }}>Shop Collections</Link>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '2rem', padding: '2rem 0', borderBottom: '1px solid #eee' }}>
                    <div style={{ width: '150px', height: '150px', background: `url(${item.image}) center/cover`, borderRadius: '12px' }}></div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>{item.name}</h3>
                        <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)' }}>£{item.price.toFixed(2)}</p>
                      </div>
                      <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '1rem' }}>By {item.maker || 'Verified Artisan'}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #ddd', padding: '0.25rem 1rem', borderRadius: '20px' }}>
                          <button onClick={() => updateQty(item.id, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>-</button>
                          <span>{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
                        </div>
                        <button onClick={() => remove(item.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', textDecoration: 'underline' }}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Sidebar summary */}
            {cart.length > 0 && (
              <div className="card" style={{ height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Order Summary</h2>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ opacity: 0.7 }}>Subtotal</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontWeight: '500' }}>
                    <span>Promo Discount</span>
                    <span>-£{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ opacity: 0.7 }}>VAT (20% UK/EU)</span>
                  <span>£{vatAmount.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                  <span style={{ opacity: 0.7 }}>Shipping Fee</span>
                  <span>£{shippingCost.toFixed(2)}</span>
                </div>

                {appliedPromo && (
                  <div style={{ fontSize: '0.8rem', backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 'bold' }}>
                    ✓ Active: {appliedPromo}
                  </div>
                )}

                {/* Promo input */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="Promo Code" 
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    style={{ flex: 1, padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.9rem' }} 
                  />
                  <button onClick={handleApplyPromo} className="btn-primary" style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', fontSize: '0.9rem' }}>Apply</button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0 1rem', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                  <span>Total</span>
                  <span>£{total.toFixed(2)}</span>
                </div>

                <button onClick={() => setStep(2)} className="btn-accent" style={{ width: '100%', padding: '1rem' }}>
                  Proceed to Checkout
                </button>
                <div style={{ paddingTop: '1.5rem', borderTop: '1px dashed #eee', fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.4, color: 'var(--text)' }}>
                  🛡️ <strong>Managed Commerce Guarantee</strong>: Britsync holds funds in secure Escrow until physical delivery is verified by on-site tracking.
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '4rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '2rem' }}>Checkout</h1>
              
              {/* Shipping Address */}
              <div className="card" style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Shipping Address</h2>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={shippingAddress.fullName} 
                  onChange={e => setShippingAddress({...shippingAddress, fullName: e.target.value})} 
                  style={{ width: '100%', padding: '0.85rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem' }} 
                />
                <input 
                  type="text" 
                  placeholder="Street Address" 
                  value={shippingAddress.addressLine} 
                  onChange={e => setShippingAddress({...shippingAddress, addressLine: e.target.value})} 
                  style={{ width: '100%', padding: '0.85rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem' }} 
                />
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <input 
                    type="text" 
                    placeholder="City" 
                    value={shippingAddress.city} 
                    onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})} 
                    style={{ flex: 1, padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem' }} 
                  />
                  <input 
                    type="text" 
                    placeholder="Postcode" 
                    value={shippingAddress.postcode} 
                    onChange={e => setShippingAddress({...shippingAddress, postcode: e.target.value})} 
                    style={{ flex: 1, padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem' }} 
                  />
                </div>
                <select 
                  value={shippingAddress.country} 
                  onChange={e => setShippingAddress({...shippingAddress, country: e.target.value})} 
                  style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem', backgroundColor: '#fff' }}
                >
                  <option>United Kingdom</option>
                  <option>Germany</option>
                  <option>France</option>
                  <option>Italy</option>
                  <option>Spain</option>
                  <option>Netherlands</option>
                  <option>Switzerland</option>
                </select>
              </div>

              {/* Billing Address */}
              <div className="card" style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', color: 'var(--primary)', margin: 0 }}>Billing Address</h2>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="checkbox" 
                      checked={billingAddress.sameAsShipping} 
                      onChange={e => setBillingAddress({...billingAddress, sameAsShipping: e.target.checked})} 
                    /> Same as Shipping
                  </label>
                </div>
                
                {!billingAddress.sameAsShipping && (
                  <div>
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      value={billingAddress.fullName} 
                      onChange={e => setBillingAddress({...billingAddress, fullName: e.target.value})} 
                      style={{ width: '100%', padding: '0.85rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem' }} 
                    />
                    <input 
                      type="text" 
                      placeholder="Street Address" 
                      value={billingAddress.addressLine} 
                      onChange={e => setBillingAddress({...billingAddress, addressLine: e.target.value})} 
                      style={{ width: '100%', padding: '0.85rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem' }} 
                    />
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      <input 
                        type="text" 
                        placeholder="City" 
                        value={billingAddress.city} 
                        onChange={e => setBillingAddress({...billingAddress, city: e.target.value})} 
                        style={{ flex: 1, padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem' }} 
                      />
                      <input 
                        type="text" 
                        placeholder="Postcode" 
                        value={billingAddress.postcode} 
                        onChange={e => setBillingAddress({...billingAddress, postcode: e.target.value})} 
                        style={{ flex: 1, padding: '0.85rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem' }} 
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Courier Shipping Options */}
              <div className="card" style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Courier Logistics & Europe Customs Rules</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {courierOptions.map(option => (
                    <label key={option.id} style={{ display: 'flex', padding: '1rem', border: `1px solid ${courier === option.id ? 'var(--accent)' : '#eee'}`, borderRadius: '8px', cursor: 'pointer', gap: '1rem', backgroundColor: courier === option.id ? '#FAF8F4' : '#fff' }}>
                      <input 
                        type="radio" 
                        name="courier" 
                        checked={courier === option.id}
                        onChange={() => setCourier(option.id)}
                        style={{ marginTop: '0.2rem' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                          <span style={{ color: 'var(--primary)' }}>{option.name}</span>
                          <span>£{option.cost.toFixed(2)}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.25rem' }}>
                          {option.est} • <span style={{ color: 'var(--accent)' }}>{option.rule}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Secure Payment */}
              <div className="card">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Payment Method</h2>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem', flexWrap: 'wrap' }}>
                  {['card', 'stripe', 'paypal', 'digital'].map(method => (
                    <button 
                      key={method}
                      onClick={() => setPaymentMethod(method)} 
                      style={{ 
                        padding: '0.6rem 1.2rem', 
                        borderRadius: '30px', 
                        border: paymentMethod === method ? 'none' : '1px solid #ccc', 
                        background: paymentMethod === method ? 'var(--primary)' : 'transparent', 
                        color: paymentMethod === method ? '#fff' : 'var(--primary)', 
                        cursor: 'pointer', 
                        fontSize: '0.85rem', 
                        fontWeight: 'bold' 
                      }}
                    >
                      {method === 'card' && '💳 Card'}
                      {method === 'stripe' && 'Stripe Connect'}
                      {method === 'paypal' && 'PayPal'}
                      {method === 'digital' && ' Pay / G-Pay'}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <div>
                    <input 
                      type="text" 
                      placeholder="Cardholder Name" 
                      value={cardDetails.name}
                      onChange={e => setCardDetails({...cardDetails, name: e.target.value})}
                      style={{ width: '100%', padding: '0.85rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ccc' }} 
                    />
                    <input 
                      type="text" 
                      placeholder="Card Number" 
                      value={cardDetails.number}
                      onChange={e => setCardDetails({...cardDetails, number: e.target.value})}
                      style={{ width: '100%', padding: '0.85rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ccc' }} 
                    />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        value={cardDetails.expiry}
                        onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})}
                        style={{ width: '100%', padding: '0.85rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ccc' }} 
                      />
                      <input 
                        type="text" 
                        placeholder="CVC" 
                        value={cardDetails.cvc}
                        onChange={e => setCardDetails({...cardDetails, cvc: e.target.value})}
                        style={{ width: '100%', padding: '0.85rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ccc' }} 
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'stripe' && (
                  <div style={{ padding: '2rem', textAlign: 'center', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fcfcfc' }}>
                    <strong style={{ display: 'block', fontSize: '1.2rem', color: '#635BFF', marginBottom: '0.5rem' }}>Stripe Checkout Gateway Active</strong>
                    <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Secure credit card billing and 3D-Secure verification handled by Stripe.</p>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div style={{ padding: '2rem', textAlign: 'center', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fcfcfc' }}>
                    <strong style={{ display: 'block', fontSize: '1.2rem', color: '#003087', marginBottom: '0.5rem' }}>PayPal Instant Billing</strong>
                    <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Redirecting to secure PayPal portal to clear transaction once placed.</p>
                  </div>
                )}

                {paymentMethod === 'digital' && (
                  <div style={{ padding: '2rem', textAlign: 'center', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fcfcfc' }}>
                    <strong style={{ display: 'block', fontSize: '1.2rem', color: '#000', marginBottom: '0.5rem' }}>Apple / Google Pay Express</strong>
                    <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Press the payment button to authorize instantly using device biometric faceID/fingerprint credentials.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Invoice summary Checkout */}
            <div>
              <div className="card" style={{ height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '100px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Order Summary</h2>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ opacity: 0.7 }}>Subtotal</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontWeight: '500' }}>
                    <span>Promo Discount</span>
                    <span>-£{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ opacity: 0.7 }}>VAT (20% UK/EU)</span>
                  <span>£{vatAmount.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                  <span style={{ opacity: 0.7 }}>Shipping ({selectedCourier.name})</span>
                  <span>£{shippingCost.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0 1rem', fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                  <span>Total</span>
                  <span>£{total.toFixed(2)}</span>
                </div>

                <button onClick={handlePlaceOrder} className="btn-accent" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem' }}>
                  Pay & Place Order
                </button>
                
                <button onClick={() => setStep(1)} style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', color: 'var(--primary)' }}>
                  Back to Bag
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && lastOrderObj && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            <div className="no-print" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--success)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 2rem' }}>✓</div>
              <h1 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1rem' }}>Order Confirmed!</h1>
              <p style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto 2rem' }}>
                Thank you! Your order <strong>#{lastOrderObj.id}</strong> has been successfully placed. Your commercial invoice has been generated below.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={printInvoice} className="btn-accent" style={{ padding: '0.8rem 2rem' }}>🖨️ Print Invoice Receipt</button>
                <Link href="/dashboard/buyer" className="btn-primary" style={{ textDecoration: 'none', padding: '0.8rem 2rem', border: '1px solid #ccc', backgroundColor: '#fff', color: 'var(--primary)' }}>Go to Buyer Dashboard</Link>
              </div>
            </div>

            {/* Premium Commercial Invoice / Invoice Receipt */}
            <div className="card" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto', border: '1px solid #ddd', boxShadow: 'none', backgroundColor: '#fff', color: '#000' }} id="printable-invoice">
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--primary)', paddingBottom: '2rem', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ fontSize: '2rem', color: 'var(--primary)', margin: 0 }}>BRITSYNC MARKET</h2>
                  <p style={{ fontSize: '0.85rem', opacity: 0.8, margin: '0.25rem 0' }}>Authentic Global Craft Ecosystem</p>
                  <p style={{ fontSize: '0.85rem', opacity: 0.8, margin: 0 }}>London, United Kingdom • support@britsync.com</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h3 style={{ fontSize: '1.5rem', margin: 0 }}>COMMERCIAL INVOICE</h3>
                  <p style={{ margin: '0.25rem 0', fontWeight: 'bold' }}>Invoice #: INV-{lastOrderObj.id.replace('ORD-', '')}</p>
                  <p style={{ margin: 0 }}>Date: {lastOrderObj.date}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem', fontSize: '0.9rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem', textTransform: 'uppercase', color: 'var(--primary)' }}>Bill To:</h4>
                  <strong>{lastOrderObj.billingAddress.fullName}</strong>
                  <p style={{ margin: '0.25rem 0' }}>{lastOrderObj.billingAddress.addressLine}</p>
                  <p style={{ margin: 0 }}>{lastOrderObj.billingAddress.city}, {lastOrderObj.billingAddress.postcode}</p>
                  <p style={{ margin: 0 }}>{lastOrderObj.billingAddress.country}</p>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem', textTransform: 'uppercase', color: 'var(--primary)' }}>Ship To:</h4>
                  <strong>{lastOrderObj.shippingAddress.fullName}</strong>
                  <p style={{ margin: '0.25rem 0' }}>{lastOrderObj.shippingAddress.addressLine}</p>
                  <p style={{ margin: 0 }}>{lastOrderObj.shippingAddress.city}, {lastOrderObj.shippingAddress.postcode}</p>
                  <p style={{ margin: 0 }}>{lastOrderObj.shippingAddress.country}</p>
                </div>
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <h4 style={{ margin: '0 0 0.5rem', textTransform: 'uppercase', color: 'var(--primary)', fontSize: '0.9rem' }}>Shipping Details:</h4>
                <div style={{ backgroundColor: '#FAF8F4', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid #eed' }}>
                  <strong>Courier:</strong> {lastOrderObj.courierName} <br />
                  <strong>Tracking Number:</strong> <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{lastOrderObj.trackingNumber}</span> <br />
                  <strong>Estimated Delivery:</strong> {lastOrderObj.estimatedDelivery} <br />
                  <strong>Europe Customs Rules Status:</strong> Pre-cleared. No additional duty due on delivery.
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2.5rem', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>
                    <th style={{ padding: '0.5rem 0' }}>Description</th>
                    <th style={{ padding: '0.5rem 0', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Unit Price</th>
                    <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {lastOrderObj.items.map((item: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem 0' }}>
                        <strong>{item.name}</strong> <br />
                        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Maker: {item.maker}</span>
                      </td>
                      <td style={{ padding: '1rem 0', textAlign: 'center' }}>{item.qty}</td>
                      <td style={{ padding: '1rem 0', textAlign: 'right' }}>£{item.price.toFixed(2)}</td>
                      <td style={{ padding: '1rem 0', textAlign: 'right' }}>£{(item.price * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.9rem' }}>
                <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ opacity: 0.7 }}>Subtotal:</span>
                    <span>£{lastOrderObj.subtotal.toFixed(2)}</span>
                  </div>
                  {lastOrderObj.discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2E7D32' }}>
                      <span>Discount:</span>
                      <span>-£{lastOrderObj.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ opacity: 0.7 }}>VAT (20%):</span>
                    <span>£{lastOrderObj.vat.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ opacity: 0.7 }}>Shipping & Handling:</span>
                    <span>£{lastOrderObj.shippingCost.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #000', paddingTop: '0.75rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    <span>Total:</span>
                    <span>£{lastOrderObj.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '4rem', borderTop: '1px solid #eee', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', opacity: 0.6 }}>
                Thank you for your purchase. By buying on Britsync, you support authentic artisan preservation. <br />
                Escrow Guarantee: Funds held by Britsync Ltd and released to maker upon verified delivery track confirmation.
              </div>
            </div>
          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          nav, footer, .no-print, .progress-indicator, .mobile-menu-btn {
            display: none !important;
          }
          main {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          #printable-invoice {
            border: none !important;
            box-shadow: none !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}} />
    </main>
  );
}
