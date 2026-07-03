"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getPricingRules, 
  savePricingRules, 
  DEFAULT_RULES, 
  PricingRules 
} from '@/lib/pricing';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [certValidity, setCertValidity] = useState('12');
  const [pricingRules, setPricingRules] = useState<PricingRules>(DEFAULT_RULES);
  
  // Pricing rules states
  const [flatMargin, setFlatMargin] = useState('0');
  const [percentageMargin, setPercentageMargin] = useState('60');
  const [luxuryThreshold, setLuxuryThreshold] = useState('500');
  const [luxuryMargin, setLuxuryMargin] = useState('40');
  const [categoryMargins, setCategoryMargins] = useState<Record<string, string>>({});
  const [countryMargins, setCountryMargins] = useState<Record<string, string>>({});
  const [tierMargins, setTierMargins] = useState({ GENERAL: '50', ELITE: '70', GI: '80' });

  // Mock databases
  const [adminAudits, setAdminAudits] = useState([
    { id: 'INS-084', maker: 'Aisha Heritage Textiles', country: 'Pakistan', score: 98, inspector: 'Tariq M.', gps: '25.9254° N, 68.3184° E', tier: 'GI Certified', status: 'Pending Approval' },
    { id: 'INS-085', maker: 'Lahore Ceramics', country: 'Pakistan', score: 91, inspector: 'Tariq M.', gps: '31.5204° N, 74.3587° E', tier: 'Elite Verified', status: 'Pending Approval' }
  ]);

  const [applications, setApplications] = useState([
    { id: 'APP-102', maker: 'Atlas Mountains Leather', country: 'Morocco', identity: 'Passport Verified', products: '3 Handbags, 2 Belts', story: 'Atlas Leather video documentary', documents: 'License & Tax docs', status: 'Pending Docs' },
    { id: 'APP-103', maker: 'Kente Weavers Union', country: 'Ghana', identity: 'Cooperative ID Verified', products: '5 Shawls, 2 Wraps', story: 'Kente Loom audio story transcription', documents: 'Coop Register & Export cert', status: 'Pending Inspector Assignment' }
  ]);

  const [pendingProducts, setPendingProducts] = useState([
    { 
      id: 'PROD-PEND-01', 
      name: 'Hand-Woven Organic Cotton Ikat Throw', 
      maker: 'Aisha Heritage Textiles', 
      description: 'Hand-block printed madder red cotton throw',
      price: '£90.00', 
      category: 'Textiles & Shawls', 
      story: 'Crafted via traditional wood blocks in Sindh', 
      materials: '100% Organic Cotton', 
      country: 'Pakistan', 
      certificates: 'Sindh Gov GI Act 2021', 
      status: 'Pending Approval', 
      image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=150' 
    },
    { 
      id: 'PROD-PEND-02', 
      name: 'Handcrafted Tanned Leather Satchel', 
      maker: 'Atlas Mountains Leather', 
      description: 'Naturally tanned goat leather satchel with brass locks',
      price: '£180.00', 
      category: 'Bags & Accessories', 
      story: 'Hand-tanned in traditional Fez open-air vats', 
      materials: 'Goat Leather, Brass', 
      country: 'Morocco', 
      certificates: 'Elite Verified Certificate BS-ELITE-0922', 
      status: 'Pending Approval', 
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=150' 
    }
  ]);

  const [inspectorsRegistry, setInspectorsRegistry] = useState([
    { id: 'INS-REG-01', name: 'Tariq M.', email: 'tariq@britsync.com', region: 'South Asia (Pakistan, India)', audits: 42 },
    { id: 'INS-REG-02', name: 'Elena K.', email: 'elena@britsync.com', region: 'Mediterranean (Turkey, Morocco)', audits: 29 }
  ]);

  const [transactions, setTransactions] = useState([
    { id: 'TXN-9021', orderId: 'ORD-9823', date: 'Jan 24, 2026', buyerCountry: 'United Kingdom', product: 'Hand-Block Printed Ajrak Shawl', sellerAmount: 150, margin: 90, customerPaid: 240, status: 'Completed', method: 'Credit Card' },
    { id: 'TXN-9022', orderId: 'ORD-9823', date: 'Jan 24, 2026', buyerCountry: 'United Kingdom', product: 'Vintage Wool Kilim', sellerAmount: 450, margin: 270, customerPaid: 720, status: 'Completed', method: 'PayPal' },
    { id: 'TXN-8411', orderId: 'ORD-8411', date: 'Jan 12, 2026', buyerCountry: 'France', product: 'Indigo Dyed Cotton Scarf', sellerAmount: 80, margin: 48, customerPaid: 128, status: 'Completed', method: 'Apple Pay' },
  ]);

  const [failedPayments, setFailedPayments] = useState([
    { id: 'TXN-FAILED-01', orderId: 'ORD-8012', date: 'Jan 25, 2026', buyer: 'Marc L.', product: 'Terracotta Vase', amount: 104, reason: 'Insufficient Funds', status: 'Failed' },
    { id: 'TXN-FAILED-02', orderId: 'ORD-8015', date: 'Jan 22, 2026', buyer: 'Sophia R.', product: 'Silver Filigree Earrings', amount: 192, reason: 'Card Expired', status: 'Failed' }
  ]);

  const [refundRequests, setRefundRequests] = useState([
    { id: 'REF-7711', orderId: 'ORD-8411', date: 'Jan 28, 2026', buyer: 'Jane Buyer', product: 'Indigo Dyed Cotton Scarf', desiredPrice: 80, customerPaid: 128, reason: 'Item received damaged', status: 'Pending Review' }
  ]);

  const [payouts, setPayouts] = useState([
    { id: 'PAY-1102', makerName: 'Aisha Heritage Textiles', amount: 230, method: 'Stripe Connect', status: 'Pending Payout', date: 'Feb 01, 2026' },
    { id: 'PAY-1101', makerName: 'Anatolian Heritage', amount: 450, method: 'Wise', status: 'Completed', date: 'Jan 15, 2026' }
  ]);

  // Inspector registration states
  const [newInspName, setNewInspName] = useState('');
  const [newInspEmail, setNewInspEmail] = useState('');
  const [newInspRegion, setNewInspRegion] = useState('South Asia');

  // Load rules on mount
  useEffect(() => {
    const currentRules = getPricingRules();
    setPricingRules(currentRules);
    setFlatMargin(String(currentRules.flatMargin));
    setPercentageMargin(String(currentRules.percentageMargin));
    setLuxuryThreshold(String(currentRules.luxuryThreshold));
    setLuxuryMargin(String(currentRules.luxuryMargin));
    setTierMargins({
      GENERAL: String(currentRules.tierMargins.GENERAL),
      ELITE: String(currentRules.tierMargins.ELITE),
      GI: String(currentRules.tierMargins.GI)
    });
    const catMap: Record<string, string> = {};
    Object.entries(currentRules.categoryMargins).forEach(([k, v]) => { catMap[k] = String(v); });
    setCategoryMargins(catMap);
    const countryMap: Record<string, string> = {};
    Object.entries(currentRules.countryMargins).forEach(([k, v]) => { countryMap[k] = String(v); });
    setCountryMargins(countryMap);
  }, []);

  const handleSaveRules = () => {
    const updatedCategoryMargins: Record<string, number> = {};
    Object.entries(categoryMargins).forEach(([k, v]) => { updatedCategoryMargins[k] = parseFloat(v) || 0; });
    const updatedCountryMargins: Record<string, number> = {};
    Object.entries(countryMargins).forEach(([k, v]) => { updatedCountryMargins[k] = parseFloat(v) || 0; });
    const newRules: PricingRules = {
      flatMargin: parseFloat(flatMargin) || 0,
      percentageMargin: parseFloat(percentageMargin) || 0,
      categoryMargins: updatedCategoryMargins,
      countryMargins: updatedCountryMargins,
      tierMargins: {
        GENERAL: parseFloat(tierMargins.GENERAL) || 50,
        ELITE: parseFloat(tierMargins.ELITE) || 70,
        GI: parseFloat(tierMargins.GI) || 80
      },
      luxuryThreshold: parseFloat(luxuryThreshold) || 500,
      luxuryMargin: parseFloat(luxuryMargin) || 40
    };
    savePricingRules(newRules);
    setPricingRules(newRules);
    alert('Pricing Rules applied across global catalog.');
  };

  const handleApproveVerification = (id: string, maker: string, tier: string) => {
    setAdminAudits(adminAudits.map(a => a.id === id ? { ...a, status: 'Minted & Approved' } : a));
    alert(`✓ Elite Verification Approved!\nArtisan ${maker} certification passport published.`);
  };

  const handleAssignInspector = (appId: string, maker: string) => {
    setApplications(applications.map(a => a.id === appId ? { ...a, status: 'Inspector Assigned' } : a));
    alert(`📍 Inspector Tariq M. assigned to audit ${maker}'s workshop.`);
  };

  const handleReleasePayout = (payoutId: string) => {
    setPayouts(payouts.map(p => p.id === payoutId ? { ...p, status: 'Completed' } : p));
    alert('Payout released successfully.');
  };

  const handleApproveRefund = (refId: string, orderId: string, buyer: string, customerPaid: number, desiredPrice: number) => {
    setRefundRequests(refundRequests.map(r => r.id === refId ? { ...r, status: 'Approved' } : r));
    const newTxn = {
      id: `TXN-REFUND-7711`,
      orderId: orderId,
      date: 'Jan 29, 2026',
      buyerCountry: 'Refund',
      product: `Refund for ${buyer}`,
      sellerAmount: -desiredPrice,
      margin: -(customerPaid - desiredPrice),
      customerPaid: -customerPaid,
      status: 'Refunded',
      method: 'Returned to Source'
    };
    setTransactions([newTxn, ...transactions]);
    alert(`Refund processed for ${buyer}`);
  };

  const handleRegisterInspector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInspName || !newInspEmail) return;
    const newInsp = {
      id: `INS-REG-0${inspectorsRegistry.length + 1}`,
      name: newInspName,
      email: newInspEmail,
      region: newInspRegion,
      audits: 0
    };
    setInspectorsRegistry([...inspectorsRegistry, newInsp]);
    setNewInspName('');
    setNewInspEmail('');
    alert(`Success: Inspector Account created for ${newInspName}`);
  };

  const totalMarginRevenue = transactions
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + t.margin, 0);

  const totalSellerEarnings = transactions
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + t.sellerAmount, 0);

  // Expanded Grouped Sidebar Config (40 Items)
  const sidebarGroups = [
    {
      title: "User Management",
      items: [
        { id: 'users', label: 'Users', icon: '👥' },
        { id: 'buyers', label: 'Buyers', icon: '🛍️' },
        { id: 'makers', label: 'Makers', icon: '🎨' },
        { id: 'inspectors', label: 'Inspectors', icon: '🔍' },
        { id: 'roles', label: 'Roles & Permissions', icon: '🔑' }
      ]
    },
    {
      title: "Core Operations",
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'orders', label: 'Orders', icon: '📋' },
        { id: 'support', label: 'Support Center', icon: '💬' }
      ]
    },
    {
      title: "Financial OS",
      items: [
        { id: 'payments', label: 'Payments', icon: '💳' },
        { id: 'wallets', label: 'Wallets', icon: '💼' },
        { id: 'payouts', label: 'Payouts', icon: '💸' }
      ]
    },
    {
      title: "Verification Management",
      items: [
        { id: 'verification', label: 'Verification Requests', icon: '🛡️' },
        { id: 'insp_assign', label: 'Inspector Assignments', icon: '📍' },
        { id: 'insp_reports', label: 'Inspection Reports', icon: '📹' },
        { id: 'elite_reqs', label: 'Elite Requests', icon: '👑' },
        { id: 'rejected_reqs', label: 'Rejected Requests', icon: '❌' },
        { id: 'expired_verif', label: 'Expired Verifications', icon: '⌛' },
        { id: 'renewals', label: 'Renewals', icon: '🔄' },
        { id: 'certificates', label: 'Certificates List', icon: '📜' },
        { id: 'trust_scores', label: 'Trust Scores', icon: '⭐' }
      ]
    },
    {
      title: "Certificate Management",
      items: [
        { id: 'cert_gen', label: 'Generate', icon: '➕' },
        { id: 'cert_elite', label: 'Elite Certificates', icon: '💎' },
        { id: 'cert_maker', label: 'Maker Certificates', icon: '🏷️' },
        { id: 'cert_prod', label: 'Product Certificates', icon: '📦' },
        { id: 'cert_renew', label: 'Renew Certificates', icon: '🔁' }
      ]
    },
    {
      title: "Registry & Verifications",
      items: [
        { id: 'stories', label: 'Stories', icon: '🎬' },
        { id: 'gi_products', label: 'GI Products', icon: '🌍' },
        { id: 'reviews', label: 'Reviews', icon: '✍️' },
        { id: 'reports', label: 'Reports', icon: '📁' },
        { id: 'analytics', label: 'Analytics', icon: '📈' },
        { id: 'audit_logs', label: 'Audit Logs', icon: '📝' }
      ]
    },
    {
      title: "Catalog & Logistics",
      items: [
        { id: 'products', label: 'Products', icon: '📦' },
        { id: 'categories', label: 'Categories', icon: '🏷️' },
        { id: 'collections', label: 'Collections', icon: '📂' },
        { id: 'countries', label: 'Countries', icon: '🌐' }
      ]
    },
    {
      title: "Content & Support",
      items: [
        { id: 'content_mgmt', label: 'Content Management', icon: '✍️' },
        { id: 'homepage_builder', label: 'Homepage Builder', icon: '🧱' },
        { id: 'email_templates', label: 'Email Templates', icon: '✉️' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
        { id: 'system_settings', label: 'System Settings', icon: '⚙️' }
      ]
    }
  ];

  return (
    <main style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)', width: '100%' }}>
      
      {/* SIDEBAR NAVIGATION */}
      <aside style={{ 
        width: '290px', 
        borderRight: '1px solid var(--secondary)', 
        padding: '6rem 1.5rem 2rem 1.5rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '2rem',
        backgroundColor: 'var(--surface)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        boxSizing: 'border-box',
        overflowY: 'auto',
        flexShrink: 0
      }}>
        <div style={{ paddingLeft: '0.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)', margin: '0 0 0.25rem', fontFamily: 'var(--font-outfit)', fontWeight: 'bold' }}>Britsync OS</h2>
          <span style={{ fontSize: '0.65rem', opacity: 0.5, fontWeight: 'bold', textTransform: 'uppercase' }}>Enterprise Operations Command</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {sidebarGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 'bold', opacity: 0.4, textTransform: 'uppercase', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                {group.title}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {group.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      textAlign: 'left',
                      padding: '0.6rem 0.8rem',
                      border: 'none',
                      background: activeTab === item.id ? 'var(--secondary)' : 'transparent',
                      color: 'var(--primary)',
                      fontWeight: activeTab === item.id ? 'bold' : 'normal',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      width: '100%',
                      transition: 'all 0.2s ease',
                      fontSize: '0.85rem'
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* SCROLLABLE MAIN CONTENT AREA */}
      <section style={{ flex: 1, padding: '6rem 3rem 6rem', boxSizing: 'border-box', overflowY: 'auto' }}>
        
        {/* Tab Header Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.4rem', fontFamily: 'var(--font-outfit)', fontWeight: 300 }}>System Control Center</h1>
            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Command Panel: <strong>{activeTab.toUpperCase()}</strong></p>
          </div>
        </div>

        {/* 1. DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div className="card" style={{ borderTop: '4px solid var(--accent)', padding: '1.5rem' }}>
                <span style={{ opacity: 0.6, fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Today's Sales</span>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)', margin: '0.2rem 0' }}>£960.00</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>✓ 2 orders today</span>
              </div>
              <div className="card" style={{ borderTop: '4px solid var(--accent)', padding: '1.5rem' }}>
                <span style={{ opacity: 0.6, fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Monthly Revenue</span>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)', margin: '0.2rem 0' }}>£1,088.00</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Billing Cycle MTD</span>
              </div>
              <div className="card" style={{ padding: '1.5rem' }}>
                <span style={{ opacity: 0.6, fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Pending Orders</span>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--accent)', margin: '0.2rem 0' }}>2</h3>
                <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>In custom packing</span>
              </div>
              <div className="card" style={{ padding: '1.5rem' }}>
                <span style={{ opacity: 0.6, fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Completed Orders</span>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)', margin: '0.2rem 0' }}>12</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>✓ Dispatched</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Revenue Trend</h3>
                <div style={{ height: '160px' }}>
                  <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    <path d="M 0 170 Q 80 130 160 100 T 320 50 T 400 20" fill="none" stroke="var(--accent)" strokeWidth="3" />
                    <circle cx="400" cy="20" r="5" fill="var(--accent)" />
                  </svg>
                </div>
              </div>
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Platform Warnings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
                  <div style={{ padding: '0.8rem', borderLeft: '3px solid var(--accent)', backgroundColor: '#fff8e1' }}>
                    ⚠️ <strong>Fez Leather certificate</strong> expiring soon.
                  </div>
                  <div style={{ padding: '0.8rem', borderLeft: '3px solid var(--error)', backgroundColor: '#ffebee' }}>
                    🚨 <strong>Replenishment required</strong> for Stripe Connect gateways.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. USERS */}
        {activeTab === 'users' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Active Accounts Directory</h2>
            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem', minWidth: '1000px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Photo / Name</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Country</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Registered</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Role / Tier</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Orders</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Products</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Stories</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Trust Score</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Wallet Balance</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Last Login</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Status</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Aisha Khan', email: 'aisha@heritage.pk', country: 'Pakistan', regDate: '15 Jan 2026', role: 'GI Verified Maker', orders: 12, products: 6, stories: 1, score: '98/100', wallet: '£430.00', login: '10 mins ago', status: 'Active', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Mehmet B.', email: 'mehmet@anatolian.tr', country: 'Turkey', regDate: '20 Jan 2026', role: 'Elite Maker', orders: 8, products: 4, stories: 1, score: '95/100', wallet: '£0.00', login: '1 hour ago', status: 'Active', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Tariq M.', email: 'tariq@britsync.com', country: 'Pakistan', regDate: '10 Jan 2026', role: 'Inspector', orders: 0, products: 0, stories: 0, score: 'N/A', wallet: 'N/A', login: '2 hours ago', status: 'Active', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Elena K.', email: 'elena@britsync.com', country: 'Greece', regDate: '12 Jan 2026', role: 'Inspector', orders: 0, products: 0, stories: 0, score: 'N/A', wallet: 'N/A', login: '1 day ago', status: 'Active', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Jane Buyer', email: 'jane@buyer.uk', country: 'United Kingdom', regDate: '24 Jan 2026', role: 'Buyer', orders: 3, products: 0, stories: 0, score: 'N/A', wallet: 'N/A', login: '5 mins ago', status: 'Active', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Britsync Board', email: 'admin@britsync.com', country: 'United Kingdom', regDate: '01 Jan 2026', role: 'Admin', orders: 0, products: 0, stories: 0, score: 'N/A', wallet: 'N/A', login: 'Active Now', status: 'Active', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' },
                    { name: 'General Crafts', email: 'general@studios.ma', country: 'Morocco', regDate: '22 Jan 2026', role: 'General Maker', orders: 1, products: 2, stories: 0, score: '82/100', wallet: '£55.00', login: '3 days ago', status: 'Active', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' }
                  ].map((u, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src={u.photo} alt={u.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                          <strong style={{ display: 'block', color: 'var(--primary)' }}>{u.name}</strong>
                          <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{u.email}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1.2rem' }}>{u.country}</td>
                      <td style={{ padding: '1.2rem' }}>{u.regDate}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold', color: 'var(--accent)' }}>{u.role}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{u.orders}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{u.products}</td>
                      <td style={{ padding: '1.2rem' }}>{u.stories > 0 ? `${u.stories} Video` : '0'}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold', color: u.score.includes('N/A') ? 'inherit' : 'var(--success)' }}>{u.score}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{u.wallet}</td>
                      <td style={{ padding: '1.2rem' }}>{u.login}</td>
                      <td style={{ padding: '1.2rem', color: 'var(--success)', fontWeight: 'bold' }}>{u.status}</td>
                      <td style={{ padding: '1.2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button onClick={() => alert(`✓ Approved ${u.name}`)} style={{ border: 'none', backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer' }}>Approve</button>
                            <button onClick={() => alert(`⚠️ Suspended ${u.name}`)} style={{ border: 'none', backgroundColor: '#fff3e0', color: '#e65100', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer' }}>Suspend</button>
                            <button onClick={() => alert(`🗑️ Deleted ${u.name}`)} style={{ border: 'none', backgroundColor: '#ffebee', color: '#c62828', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer' }}>Delete</button>
                          </div>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button onClick={() => alert(`Reset password trigger sent to ${u.email}`)} style={{ border: '1px solid #ccc', backgroundColor: '#fff', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', color: 'var(--primary)' }}>Reset Pass</button>
                            <button onClick={() => alert(`Open role assignment dropdown for ${u.name}`)} style={{ border: '1px solid #ccc', backgroundColor: '#fff', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', color: 'var(--primary)' }}>Assign Role</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. BUYERS */}
        {activeTab === 'buyers' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Buyer Activity Tracker</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Buyer</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Purchased Volume</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Region</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Jane Buyer', amt: '£960.00', region: 'United Kingdom' },
                    { name: 'Marc L.', amt: '£128.00', region: 'France' }
                  ].map((b, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{b.name}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{b.amt}</td>
                      <td style={{ padding: '1.2rem' }}>{b.region}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. MAKERS */}
        {activeTab === 'makers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Pending Maker Intake Applications</h2>
              <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem', minWidth: '1000px' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                      <th style={{ padding: '1rem 1.2rem' }}>Business Info (Studio)</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Identity</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Country</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Products</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Story</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Documents</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Export Readiness</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Status</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{app.maker}</td>
                        <td style={{ padding: '1.2rem' }}>{app.identity}</td>
                        <td style={{ padding: '1.2rem' }}>{app.country}</td>
                        <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{app.products}</td>
                        <td style={{ padding: '1.2rem' }}>{app.story}</td>
                        <td style={{ padding: '1.2rem' }}>{app.documents}</td>
                        <td style={{ padding: '1.2rem' }}>
                          <span style={{ 
                            fontWeight: 'bold', 
                            color: app.maker.includes('Aisha') ? '#2e7d32' : '#e65100',
                            backgroundColor: app.maker.includes('Aisha') ? '#e8f5e9' : '#fff3e0',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px'
                          }}>
                            {app.maker.includes('Aisha') ? '84 / 100' : app.id === 'APP-102' ? '55 / 100' : '40 / 100'}
                          </span>
                        </td>
                        <td style={{ padding: '1.2rem', color: 'var(--accent)', fontWeight: 'bold' }}>{app.status}</td>
                        <td style={{ padding: '1.2rem' }}>
                          <div style={{ display: 'flex', gap: '0.35rem', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                              <button onClick={() => {
                                alert(`✓ Approved registration for ${app.maker}! Studio is now active.`);
                                setApplications(applications.filter(a => a.id !== app.id));
                              }} style={{ border: 'none', backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>Approve</button>
                              <button onClick={() => {
                                alert(`❌ Rejected registration for ${app.maker}.`);
                                setApplications(applications.filter(a => a.id !== app.id));
                              }} style={{ border: 'none', backgroundColor: '#ffebee', color: '#c62828', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>Reject</button>
                            </div>
                            <button onClick={() => alert(`Requested further documentation from ${app.maker}.`)} style={{ border: '1px solid #ccc', backgroundColor: '#fff', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', color: 'var(--primary)' }}>Request Info</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Registered Maker Studios</h2>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                      <th style={{ padding: '1rem 1.2rem' }}>Studio</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Craft specialty</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Jurisdiction</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Export Readiness Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Aisha Heritage Textiles', craft: 'Indigo Ajrak block-printing', region: 'Sindh, Pakistan', score: '84 / 100' },
                      { name: 'Anatolian Heritage', craft: 'Wool Kilims weaving', region: 'Konya, Turkey', score: '95 / 100' }
                    ].map((m, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{m.name}</td>
                        <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{m.craft}</td>
                        <td style={{ padding: '1.2rem' }}>{m.region}</td>
                        <td style={{ padding: '1.2rem' }}>
                          <span style={{ 
                            fontWeight: 'bold', 
                            color: '#2e7d32',
                            backgroundColor: '#e8f5e9',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px'
                          }}>
                            {m.score}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. INSPECTORS */}
        {activeTab === 'inspectors' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Certified Field Agents Registry</h2>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                      <th style={{ padding: '1rem 1.2rem' }}>Agent Name</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Email Address</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Jurisdiction Region</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspectorsRegistry.map(ins => (
                      <tr key={ins.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{ins.name}</td>
                        <td style={{ padding: '1.2rem' }}>{ins.email}</td>
                        <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{ins.region}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem', maxWidth: '600px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Add Inspector Agent</h3>
              <form onSubmit={handleRegisterInspector}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Agent Name</label>
                  <input type="text" value={newInspName} onChange={e => setNewInspName(e.target.value)} style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Agent Email</label>
                  <input type="email" value={newInspEmail} onChange={e => setNewInspEmail(e.target.value)} style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                </div>
                <button type="submit" className="btn-accent" style={{ padding: '0.6rem 2rem' }}>Create Account</button>
              </form>
            </div>
          </div>
        )}

        {/* ROLES & PERMISSIONS */}
        {activeTab === 'roles' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Roles & Permission Controls</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Role Name</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Ledger Access</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Verification Control</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Settings Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Platform Admin', ledger: 'Write / Edit', verif: 'Full Approval', edit: 'Allowed' },
                    { name: 'Field Inspector', ledger: 'None', verif: 'Submit Audits Only', edit: 'Restricted' },
                    { name: 'Verified Artisan', ledger: 'Self-Only', verif: 'Apply Only', edit: 'Restricted' }
                  ].map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{r.name}</td>
                      <td style={{ padding: '1.2rem' }}>{r.ledger}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{r.verif}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold', color: 'var(--accent)' }}>{r.edit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Global Order Pipeline</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Order ID</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Customer Details</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Product Title</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Fullfillment Pipeline</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'ORD-9823', buyer: 'Jane Buyer (UK)', product: 'Hand-Block Printed Ajrak Shawl', status: 'Shipped (Tariq M. Signed)' },
                    { id: 'ORD-8411', buyer: 'Marc L. (France)', product: 'Vintage Wool Kilim', status: 'In Custom Crating (Insured)' }
                  ].map((o, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{o.id}</td>
                      <td style={{ padding: '1.2rem' }}>{o.buyer}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{o.product}</td>
                      <td style={{ padding: '1.2rem' }}>
                        <span style={{ backgroundColor: '#fff3e0', color: '#e65100', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUPPORT CENTER */}
        {activeTab === 'support' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Platform Support Tickets</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Ticket ID</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Artisan Studio / Buyer</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Subject Inquiry</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'TKT-902', name: 'Aisha Textiles', sub: 'Low custom crate wooden box supply stock', status: 'Open' },
                    { id: 'TKT-891', name: 'Anatolian Heritage', sub: 'WiseConnect routing details update request', status: 'Open' }
                  ].map((t, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{t.id}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{t.name}</td>
                      <td style={{ padding: '1.2rem' }}>{t.sub}</td>
                      <td style={{ padding: '1.2rem', color: 'var(--error)', fontWeight: 'bold' }}>{t.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYMENTS */}
        {activeTab === 'payments' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Transactional Payment Ledger</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Transaction ID</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Buyer Details</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Paid Volume</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Payout Method</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{t.id}</td>
                      <td style={{ padding: '1.2rem' }}>{t.buyerCountry}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>£{t.customerPaid.toFixed(2)}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold', color: 'var(--accent)' }}>{t.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* WALLETS */}
        {activeTab === 'wallets' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Platform Artisan Wallets</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Artisan Studio</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Accrued Balance</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Status</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Simulated deposit</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Aisha Heritage Textiles', balance: '£430.00' },
                    { name: 'Anatolian Heritage', balance: '£0.00' }
                  ].map((w, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{w.name}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{w.balance}</td>
                      <td style={{ padding: '1.2rem', color: 'var(--success)', fontWeight: 'bold' }}>Active Wallet</td>
                      <td style={{ padding: '1.2rem' }}>
                        <button onClick={() => alert(`Simulating £100 wallet deposit to ${w.name}`)} className="btn-accent" style={{ padding: '0.4rem 1rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                          Simulate deposit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYOUTS */}
        {activeTab === 'payouts' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Artisan Payout Release Queue</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Maker Name</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Payout Method</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Outstanding Amount</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Transfer Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{p.makerName}</td>
                      <td style={{ padding: '1.2rem' }}>{p.method}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>£{p.amount.toFixed(2)}</td>
                      <td style={{ padding: '1.2rem' }}>
                        {p.status === 'Pending Payout' ? (
                          <button onClick={() => handleReleasePayout(p.id)} className="btn-accent" style={{ padding: '0.4rem 1rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                            Release Payout
                          </button>
                        ) : (
                          <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓ Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VERIFICATION REQUESTS */}
        {activeTab === 'verification' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Verification Requests Queue</h2>
            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem', minWidth: '1000px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Audit ID</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Artisan Studio</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Quality Score</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Verification Tier</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Status</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminAudits.map(audit => (
                    <tr key={audit.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{audit.id}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{audit.maker}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold', color: 'var(--success)' }}>{audit.score}/100</td>
                      <td style={{ padding: '1.2rem' }}>{audit.tier}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{audit.status}</td>
                      <td style={{ padding: '1.2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button onClick={() => handleApproveVerification(audit.id, audit.maker, audit.tier)} style={{ border: 'none', backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>Approve</button>
                            <button onClick={() => alert(`❌ Rejected ${audit.id}`)} style={{ border: 'none', backgroundColor: '#ffebee', color: '#c62828', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>Reject</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INSPECTOR ASSIGNMENTS */}
        {activeTab === 'insp_assign' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Inspector Assignments Scheduler</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>App ID</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Maker Name</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Status</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Audit Assignments</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{app.id}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{app.maker}</td>
                      <td style={{ padding: '1.2rem' }}>{app.status}</td>
                      <td style={{ padding: '1.2rem' }}>
                        {app.status === 'Pending Inspector Assignment' ? (
                          <button onClick={() => handleAssignInspector(app.id, app.maker)} className="btn-primary" style={{ padding: '0.4rem 1rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                            Assign Inspector
                          </button>
                        ) : (
                          <span style={{ opacity: 0.5 }}>Inspector Assigned</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INSPECTION REPORTS */}
        {activeTab === 'insp_reports' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Physical Field Inspection Reports</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Report ID</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Artisan Studio</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Raw video proof</th>
                    <th style={{ padding: '1rem 1.2rem' }}>GPS Checked-In</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'REP-084', maker: 'Aisha Heritage Textiles', video: 'sindh-block-print-raw.mp4', gps: '25.9254° N, 68.3184° E' },
                    { id: 'REP-085', maker: 'Lahore Ceramics', video: 'clay-kiln-firing.mp4', gps: '31.5204° N, 74.3587° E' }
                  ].map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{r.id}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{r.maker}</td>
                      <td style={{ padding: '1.2rem', color: 'var(--accent)', fontWeight: 'bold' }}>{r.video}</td>
                      <td style={{ padding: '1.2rem' }}>{r.gps}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ELITE REQUESTS */}
        {activeTab === 'elite_reqs' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Elite Verified Certification Requests</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Artisan Studio</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Tier Requested</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Inquiry Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Atlas Mountains Leather', tier: 'Elite Verified Maker' }
                  ].map((req, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{req.name}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold', color: 'var(--accent)' }}>{req.tier}</td>
                      <td style={{ padding: '1.2rem' }}>
                        <button onClick={() => alert(`Reviewing Elite portfolio for ${req.name}`)} className="btn-accent" style={{ padding: '0.4rem 1rem', borderRadius: '4px', fontSize: '0.8rem' }}>Review Portfolio</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REJECTED REQUESTS */}
        {activeTab === 'rejected_reqs' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Failed Verification Audits Log</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Studio Name</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Reason for Rejection</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Date Logged</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Fez Leather Collective', reason: 'On-site video materials audit failed', date: 'Jan 22, 2026' }
                  ].map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{r.name}</td>
                      <td style={{ padding: '1.2rem', color: 'var(--error)', fontWeight: 'bold' }}>{r.reason}</td>
                      <td style={{ padding: '1.2rem' }}>{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EXPIRED VERIFICATIONS */}
        {activeTab === 'expired_verif' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Expired Verification Passports</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Studio Name</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Expired Expiration Date</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Bursa Iznik Glazes', date: 'Jan 15, 2026' }
                  ].map((ex, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{ex.name}</td>
                      <td style={{ padding: '1.2rem', color: 'var(--error)', fontWeight: 'bold' }}>{ex.date}</td>
                      <td style={{ padding: '1.2rem' }}>
                        <button onClick={() => alert('Assigned Inspector Elena K. for renewal')} className="btn-accent" style={{ padding: '0.4rem 1rem', borderRadius: '4px', fontSize: '0.8rem' }}>Assign Field Inspector</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RENEWALS */}
        {activeTab === 'renewals' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Verification Renewals Scheduler</h2>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 'bold' }}>Active Renewal Pipeline</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1.5rem' }}>Schedule and check progress of maker studios approaching verification expiry dates.</p>
              <button onClick={() => alert('Assigned Tariq M. for Aisha Textiles scheduled visit')} className="btn-primary" style={{ padding: '0.6rem 2rem' }}>
                Trigger Automated Expiry Check
              </button>
            </div>
          </div>
        )}

        {/* CERTIFICATES LIST */}
        {activeTab === 'certificates' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Active Platforms Digital Passports</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Certificate Number</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Maker Studio</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cert: 'BS-ELITE-2025-084', name: 'Aisha Heritage Textiles', status: 'Active Verified' }
                  ].map((c, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{c.cert}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{c.name}</td>
                      <td style={{ padding: '1.2rem', color: 'var(--success)', fontWeight: 'bold' }}>{c.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TRUST SCORES */}
        {activeTab === 'trust_scores' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Platform Trust Scores rules</h2>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 'bold' }}>Calculation Parameters</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1.5rem' }}>Trust scores are computed using physical geofence validations (50%), documentary verification (30%), and customer reviews feedback (20%).</p>
              <button onClick={() => alert('Re-calculated all trust scores')} className="btn-accent" style={{ padding: '0.6rem 2rem' }}>Trigger Re-calculation</button>
            </div>
          </div>
        )}

        {/* GENERATE */}
        {activeTab === 'cert_gen' && (
          <div className="card" style={{ padding: '2rem', maxWidth: '600px' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem', fontWeight: 'bold' }}>Generate Digital Certificate Passport</h2>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 'bold' }}>Select Maker Studio</label>
              <select style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option>Aisha Heritage Textiles</option>
                <option>Anatolian Heritage</option>
              </select>
            </div>
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 'bold' }}>Select Certificate Type</label>
              <select style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option>Elite Verified Certificate</option>
                <option>Geographical Indication (GI) Certificate</option>
              </select>
            </div>
            <button onClick={() => alert('✓ Certificate passport generated!')} className="btn-accent" style={{ padding: '0.6rem 2rem' }}>Generate Certificate</button>
          </div>
        )}

        {/* ELITE CERTIFICATES */}
        {activeTab === 'cert_elite' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Active Elite Verification Certificates</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Cert Number</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Artisan Maker</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Valid Until</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'BS-ELITE-2026-085', name: 'Lahore Ceramics', exp: '23 Jan 2027' }
                  ].map((c, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{c.id}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{c.name}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold', color: 'var(--success)' }}>{c.exp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MAKER CERTIFICATES */}
        {activeTab === 'cert_maker' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Artisan Maker Studio Passports</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Passport ID</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Studio</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'BS-MAKER-084', name: 'Aisha Heritage Textiles', status: 'Active Verified' }
                  ].map((c, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{c.id}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{c.name}</td>
                      <td style={{ padding: '1.2rem', color: 'var(--success)', fontWeight: 'bold' }}>{c.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRODUCT CERTIFICATES */}
        {activeTab === 'cert_prod' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Products Authenticity Certificates</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Cert Number</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Product Title</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'BS-PROD-9021', name: 'Hand-Block Printed Ajrak Shawl', status: 'Active GI Certified' }
                  ].map((c, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{c.id}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{c.name}</td>
                      <td style={{ padding: '1.2rem', color: 'var(--success)', fontWeight: 'bold' }}>{c.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RENEW CERTIFICATES */}
        {activeTab === 'cert_renew' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Certificate Renewal queue</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Cert ID</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Artisan Studio</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'BS-ELITE-2024-002', name: 'Fez Leather Collective' }
                  ].map((c, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{c.id}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{c.name}</td>
                      <td style={{ padding: '1.2rem' }}>
                        <button onClick={() => alert(`Sent renewal notification to ${c.name}`)} className="btn-accent" style={{ padding: '0.4rem 1rem', borderRadius: '4px', fontSize: '0.8rem' }}>Trigger Notification</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 12. STORIES */}
        {activeTab === 'stories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            {/* Pending Story Queue */}
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Pending Story Queue</h2>
              <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem', minWidth: '1000px' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                      <th style={{ padding: '1rem 1.2rem' }}>Maker Studio</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Documentary Film</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Grammar Check</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Photos Check</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Authenticity</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Content Board</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Workshop Audit</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Status</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Atlas Mountains Leather', video: 'atlas-leather-raw.mp4', grammar: '✓ Proofread', photos: '✓ 4 assets validated', auth: '✓ High Authenticity', content: '✓ Video approved', workshop: '✓ Geofence checked', status: 'Pending Review' }
                    ].map((s, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{s.name}</td>
                        <td style={{ padding: '1.2rem', fontWeight: 'bold', color: 'var(--accent)' }}>{s.video}</td>
                        <td style={{ padding: '1.2rem', color: 'var(--success)', fontWeight: 'bold' }}>{s.grammar}</td>
                        <td style={{ padding: '1.2rem', color: 'var(--success)', fontWeight: 'bold' }}>{s.photos}</td>
                        <td style={{ padding: '1.2rem', color: 'var(--success)', fontWeight: 'bold' }}>{s.auth}</td>
                        <td style={{ padding: '1.2rem', color: 'var(--success)', fontWeight: 'bold' }}>{s.content}</td>
                        <td style={{ padding: '1.2rem', color: 'var(--success)', fontWeight: 'bold' }}>{s.workshop}</td>
                        <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{s.status}</td>
                        <td style={{ padding: '1.2rem' }}>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button onClick={() => alert(`✓ Approved story for ${s.name}`)} style={{ border: 'none', backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.35rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>Approve</button>
                            <button onClick={() => alert(`❌ Rejected story for ${s.name}`)} style={{ border: 'none', backgroundColor: '#ffebee', color: '#c62828', padding: '0.35rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>Reject</button>
                            <button onClick={() => alert(`Editing story contents for ${s.name}...`)} style={{ border: '1px solid #ccc', backgroundColor: '#fff', padding: '0.35rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', color: 'var(--primary)' }}>Edit</button>
                            <button onClick={() => alert(`✓ Story published successfully to maker profile!`)} style={{ border: 'none', backgroundColor: 'var(--secondary)', color: 'var(--primary)', padding: '0.35rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>Publish</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Approved Story Catalog */}
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Approved Story Catalog</h2>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                      <th style={{ padding: '1rem 1.2rem' }}>Maker Name</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Documentary Video</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Transcription logs</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Aisha Khan (Sindh)', video: 'verified-aisha-sindh.mp4', log: 'block-print-transcription.txt', status: 'Approved' },
                      { name: 'Anatolian Heritage (Konya)', video: 'kilims-konya-wool.mp4', log: 'carpet-wool-natural-dyes.txt', status: 'Approved' }
                    ].map((s, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{s.name}</td>
                        <td style={{ padding: '1.2rem', fontWeight: 'bold', color: 'var(--accent)' }}>{s.video}</td>
                        <td style={{ padding: '1.2rem' }}>{s.log}</td>
                        <td style={{ padding: '1.2rem', color: 'var(--success)', fontWeight: 'bold' }}>{s.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 13. GI PRODUCTS */}
        {activeTab === 'gi_products' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Geographical Indication (GI) registry</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Product Name</th>
                    <th style={{ padding: '1rem 1.2rem' }}>GI indication Category</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Government Registry Code</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Hand-Block Printed Ajrak', cat: 'Sindh block-printing act 2021', code: 'PAK-GI-2021-TEXTILES' },
                    { name: 'Anatolian Wool Weave', cat: 'Konya weaving act 1998', code: 'TUR-GI-1998-CARPET' }
                  ].map((g, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{g.name}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{g.cat}</td>
                      <td style={{ padding: '1.2rem', color: 'var(--accent)', fontWeight: 'bold' }}>{g.code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 14. REVIEWS */}
        {activeTab === 'reviews' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Customer & Inspector Reviews</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Artisan Product</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Inspector Rating</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Customer Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Hand-Block Printed Ajrak Shawl', inspector: '5.0 / 5.0 (Tariq M.)', customer: 'Outstanding natural madder red dye. 5 stars.' },
                    { name: 'Vintage Wool Kilim', inspector: '4.8 / 5.0 (Elena K.)', customer: 'Vibrant Walnut shell dyes, gorgeous wooden package.' }
                  ].map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{r.name}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold', color: 'var(--accent)' }}>{r.inspector}</td>
                      <td style={{ padding: '1.2rem' }}>{r.customer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 15. REPORTS */}
        {activeTab === 'reports' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 'bold' }}>Platform ledger reports</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1.5rem' }}>Generate certified PDF logs and tax files for platform transaction volumes.</p>
              <button onClick={() => alert('PDF Ledger generated')} className="btn-accent" style={{ padding: '0.6rem 2rem' }}>
                Export MTD Ledger PDF
              </button>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 'bold' }}>Verification Logs</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1.5rem' }}>Export physical on-site audit report files registered by Tariq M. and Elena K.</p>
              <button onClick={() => alert('Audits logs exported')} className="btn-primary" style={{ padding: '0.6rem 2rem' }}>
                Export Audits CSV
              </button>
            </div>
          </div>
        )}

        {/* 16. ANALYTICS */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Order Volume Growth</h3>
                <div style={{ height: '160px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #ccc' }}>
                  {[40, 65, 50, 85, 120, 140].map((val, i) => (
                    <div key={i} style={{ width: '24px', height: `${val}%`, backgroundColor: 'var(--primary)', borderRadius: '4px 4px 0 0' }}></div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Trust Score distribution Bell curve</h3>
                <div style={{ height: '160px' }}>
                  <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    <path d="M 0 200 Q 75 200 150 50 T 300 200" fill="none" stroke="#4CAF50" strokeWidth="3" />
                    <circle cx="150" cy="50" r="5" fill="var(--accent)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AUDIT LOGS */}
        {activeTab === 'audit_logs' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>System Administrative Audit Logs</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Timestamp</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Operator</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Action Description Log</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Environment</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { time: 'Jan 29, 2026 14:02', user: 'Admin Britsync', action: 'Approved payout PAY-1102 for £230.00', env: 'Production' },
                    { time: 'Jan 28, 2026 10:14', user: 'Inspector Tariq M.', action: 'Completed geofence checklist verification INS-084', env: 'Mobile Sync' },
                    { time: 'Jan 24, 2026 09:30', user: 'Admin Britsync', action: 'Modified global pricing percentage to 60%', env: 'Production Settings' }
                  ].map((l, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem 1.2rem', fontWeight: 'bold' }}>{l.time}</td>
                      <td style={{ padding: '1rem 1.2rem', fontWeight: 'bold' }}>{l.user}</td>
                      <td style={{ padding: '1rem 1.2rem' }}>{l.action}</td>
                      <td style={{ padding: '1rem 1.2rem', color: 'var(--accent)', fontWeight: 'bold' }}>{l.env}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 17. PRODUCTS */}
        {activeTab === 'products' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            {/* Pending Product Approvals */}
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Pending Product Approvals Queue</h2>
              <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem', minWidth: '1100px' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                      <th style={{ padding: '1rem 1.2rem' }}>Product Details</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Pricing</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Category</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Story</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Materials</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Country</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Certificates</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Status</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingProducts.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <img src={p.image} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                          <div>
                            <strong style={{ display: 'block', color: 'var(--primary)' }}>{p.name}</strong>
                            <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{p.description}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{p.price}</td>
                        <td style={{ padding: '1.2rem' }}>{p.category}</td>
                        <td style={{ padding: '1.2rem' }}>{p.story}</td>
                        <td style={{ padding: '1.2rem' }}>{p.materials}</td>
                        <td style={{ padding: '1.2rem' }}>{p.country}</td>
                        <td style={{ padding: '1.2rem', fontWeight: 'bold', color: 'var(--accent)' }}>{p.certificates}</td>
                        <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{p.status}</td>
                        <td style={{ padding: '1.2rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                              <button onClick={() => {
                                alert(`✓ Approved listing: ${p.name}`);
                                setPendingProducts(pendingProducts.filter(item => item.id !== p.id));
                              }} style={{ border: 'none', backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer' }}>Approve</button>
                              <button onClick={() => {
                                alert(`❌ Rejected listing: ${p.name}`);
                                setPendingProducts(pendingProducts.filter(item => item.id !== p.id));
                              }} style={{ border: 'none', backgroundColor: '#ffebee', color: '#c62828', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer' }}>Reject</button>
                              <button onClick={() => alert(`Editing product: ${p.name}`)} style={{ border: '1px solid #ccc', backgroundColor: '#fff', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', color: 'var(--primary)' }}>Edit</button>
                            </div>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                              <button onClick={() => alert(`Sent back product: ${p.name} for revision`)} style={{ border: '1px solid #ccc', backgroundColor: '#fff', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', color: 'var(--primary)' }}>Send Back</button>
                              <button onClick={() => {
                                alert(`✓ Published listing: ${p.name}`);
                                setPendingProducts(pendingProducts.filter(item => item.id !== p.id));
                              }} style={{ border: 'none', backgroundColor: 'var(--secondary)', color: 'var(--primary)', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer' }}>Publish</button>
                              <button onClick={() => alert(`Archived product: ${p.name}`)} style={{ border: '1px solid #ccc', backgroundColor: '#eee', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', color: 'var(--primary)' }}>Archive</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Artisan Product Inventory Catalog</h2>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                      <th style={{ padding: '1rem 1.2rem' }}>Product Title</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Specialist Maker</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Base Price</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Verification Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Hand-Block Printed Ajrak Shawl', maker: 'Aisha Textiles', price: '£240.00', tier: 'GI Certified' },
                      { name: 'Vintage Wool Kilim', maker: 'Anatolian Heritage', price: '£720.00', tier: 'Elite Verified' }
                    ].map((p, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{p.name}</td>
                        <td style={{ padding: '1.2rem' }}>{p.maker}</td>
                        <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{p.price}</td>
                        <td style={{ padding: '1.2rem', color: 'var(--accent)', fontWeight: 'bold' }}>{p.tier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 18. CATEGORIES */}
        {activeTab === 'categories' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Category markup rules config</h2>
            <div className="card" style={{ padding: '2rem', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {Object.keys(DEFAULT_RULES.categoryMargins).map(cat => (
                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.9rem' }}>{cat} Markup (%)</strong>
                  <input 
                    type="number" 
                    value={categoryMargins[cat] || ''} 
                    onChange={e => setCategoryMargins({ ...categoryMargins, [cat]: e.target.value })} 
                    style={{ width: '100px', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }} 
                  />
                </div>
              ))}
              <button onClick={handleSaveRules} className="btn-accent" style={{ padding: '0.6rem' }}>Save Category Markups</button>
            </div>
          </div>
        )}

        {/* 19. COLLECTIONS */}
        {activeTab === 'collections' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Seasonal Collection Curator</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>Curator Collection</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Product Density</th>
                    <th style={{ padding: '1rem 1.2rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Sindh Indigo Block Prints', count: 12 },
                    { name: 'Anatolian Wool Weaves', count: 8 }
                  ].map((col, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{col.name}</td>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{col.count} crafts verified</td>
                      <td style={{ padding: '1.2rem' }}>
                        <button onClick={() => alert(`Editing Curator slides for ${col.name}`)} className="btn-accent" style={{ padding: '0.4rem 1rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                          Edit Curator
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 20. COUNTRIES */}
        {activeTab === 'countries' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Country Logistics adjustments</h2>
            <div className="card" style={{ padding: '2rem', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {Object.keys(DEFAULT_RULES.countryMargins).map(country => (
                <div key={country} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.9rem' }}>{country} Adjustments (%)</strong>
                  <input 
                    type="number" 
                    value={countryMargins[country] || '0'} 
                    onChange={e => setCountryMargins({ ...countryMargins, [country]: e.target.value })} 
                    style={{ width: '100px', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }} 
                  />
                </div>
              ))}
              <button onClick={handleSaveRules} className="btn-accent" style={{ padding: '0.6rem' }}>Save Country Adjustments</button>
            </div>
          </div>
        )}

        {/* 22. CONTENT MANAGEMENT */}
        {activeTab === 'content_mgmt' && (
          <div className="card" style={{ padding: '2rem', maxWidth: '600px' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Artisan Documentary Curator</h2>
            <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1.5rem' }}>Select which verified story documentary videos to showcase on the front-end homepage.</p>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 'bold' }}>Select featured Maker video</label>
              <select style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option>Aisha Khan - Ajrak Handblock printing Sindh</option>
                <option>Anatolian Heritage - Kilims Konya Woolweaving</option>
              </select>
            </div>
            <button onClick={() => alert('Documentary display settings updated')} className="btn-accent" style={{ padding: '0.6rem 2rem' }}>Update display Settings</button>
          </div>
        )}

        {/* 23. HOMEPAGE BUILDER */}
        {activeTab === 'homepage_builder' && (
          <div className="card" style={{ padding: '2rem', maxWidth: '600px' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Homepage block Builder</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Toggle Hero video background header banner</span>
                <input type="checkbox" defaultChecked />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Toggle Verified Scoreboard grid display</span>
                <input type="checkbox" defaultChecked />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Toggle Seasonal Curator Collections block</span>
                <input type="checkbox" defaultChecked />
              </div>
            </div>
            <button onClick={() => alert('Homepage layout configuration saved')} className="btn-accent" style={{ marginTop: '1.5rem', padding: '0.6rem 2rem' }}>Save layout</button>
          </div>
        )}

        {/* 24. EMAIL TEMPLATES */}
        {activeTab === 'email_templates' && (
          <div className="card" style={{ padding: '2rem', maxWidth: '600px' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>System automated notifications Email templates</h2>
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 'bold' }}>Select automated trigger template</label>
              <select style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option>Artisan Application Received & Registered</option>
                <option>Geofence physical workshop visited</option>
                <option>Artisan product quality check complete</option>
                <option>Elite Digital Certificate minted & Issued</option>
                <option>Verification Certificate expiring warning</option>
              </select>
            </div>
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 'bold' }}>HTML Code template markup</label>
              <textarea style={{ width: '100%', height: '140px', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.8rem' }} defaultValue="Dear Artisan, your Britsync physical workshop geofence check was successful..."></textarea>
            </div>
            <button onClick={() => alert('Email template saved')} className="btn-accent" style={{ padding: '0.6rem 2rem' }}>Save Email Template</button>
          </div>
        )}

        {/* 25. NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="card" style={{ padding: '2rem', maxWidth: '600px' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Slack & Webhook notification integration</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Slack Channel webhook URL</label>
                <input type="text" defaultValue="https://hooks.slack.com/services/YOUR_WORKSPACE/YOUR_CHANNEL/YOUR_TOKEN" style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Ping Slack channel on new maker registrations</span>
                <input type="checkbox" defaultChecked />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Ping Slack channel on certificate expiry warning triggers</span>
                <input type="checkbox" defaultChecked />
              </div>
            </div>
            <button onClick={() => alert('slack integrations applied')} className="btn-accent" style={{ padding: '0.6rem 2rem' }}>Apply settings</button>
          </div>
        )}

        {/* 26. SYSTEM SETTINGS */}
        {activeTab === 'system_settings' && (
          <div className="card" style={{ padding: '2rem', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Database backups & Gateway settings</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Trigger complete database backup now</span>
              <button onClick={() => alert('database backup saved')} className="btn-primary" style={{ padding: '0.4rem 1rem', borderRadius: '4px', fontSize: '0.8rem' }}>Trigger Backup</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Payment Gateway environment sandbox switcher</span>
              <select style={{ padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option>Stripe Sandbox environment</option>
                <option>Stripe Live production environment</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Default display currency switcher</span>
              <select style={{ padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option>GBP (£)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
              </select>
            </div>
          </div>
        )}

      </section>

    </main>
  );
}
