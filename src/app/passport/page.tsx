'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function PassportPortal() {
  const [searchId, setSearchId] = useState('');

  const featuredPassports = [
    { id: 'ajrak-9823', name: 'Ajrak Shawl', maker: 'Aisha Heritage Textiles', country: 'Pakistan', tier: 'GI Certified' },
    { id: 'kilim-8411', name: 'Vintage Wool Kilim', maker: 'Anatolian Heritage', country: 'Turkey', tier: 'Elite Verified' },
    { id: 'pottery-85', name: 'Iznik Ceramic Bowl', maker: 'Bursa Ceramics', country: 'Turkey', tier: 'GI Certified' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    window.location.href = `/passport/${searchId.toLowerCase().trim()}`;
  };

  return (
    <main className="animate-fade-in" style={{ backgroundColor: 'var(--background)', minHeight: '100vh', paddingTop: '8rem', paddingBottom: '6rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Banner */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Authenticity Registry</span>
          <h1 style={{ fontSize: '3.5rem', color: 'var(--primary)', marginTop: '1rem', marginBottom: '1.5rem', fontFamily: 'var(--font-outfit)', fontWeight: 300 }}>Public Verification Portal</h1>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.8, opacity: 0.8, maxWidth: '700px', margin: '0 auto' }}>
            Verify the human hands, physical workshop coordinates, and raw materials behind your unique Britsync purchase. Enter your cryptographic Passport ID below.
          </p>
        </div>

        {/* Lookup Box */}
        <div className="card" style={{ padding: '3.5rem', marginBottom: '5rem', border: '1px solid var(--accent)', boxShadow: 'var(--shadow-lg)' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
            <label style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.1rem' }}>Enter Britsync Passport ID</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="e.g., ajrak-9823, kilim-8411, or product-uuid" 
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                style={{ flex: 1, padding: '1.2rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1.1rem' }} 
              />
              <button type="submit" className="btn-accent" style={{ padding: '0 2.5rem', fontSize: '1.1rem', borderRadius: '8px' }}>
                Verify Registry
              </button>
            </div>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', opacity: 0.6 }}>
              🔍 Tip: The Passport ID can be found printed on your physical Britsync authentication tag, or inside your buyer dashboard.
            </p>
          </form>
        </div>

        {/* Featured Registry Records */}
        <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '2rem', textAlign: 'center' }}>Featured Registry Records</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', marginBottom: '6rem' }}>
          {featuredPassports.map(fp => (
            <Link href={`/passport/${fp.id}`} key={fp.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ cursor: 'pointer', height: '100%', transition: 'transform 0.2s', borderTop: '4px solid var(--accent)' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  backgroundColor: 'var(--secondary)', 
                  color: 'var(--primary)', 
                  padding: '0.2rem 0.6rem', 
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  display: 'inline-block',
                  marginBottom: '1rem'
                }}>
                  {fp.tier}
                </span>
                <h4 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>{fp.name}</h4>
                <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '1.5rem' }}>{fp.maker} • {fp.country}</p>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', borderBottom: '1px solid var(--accent)', paddingBottom: '2px' }}>
                  View Verification Details →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Ecosystem Notice */}
        <div style={{ backgroundColor: 'var(--surface)', padding: '3rem', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', marginBottom: '1rem' }}>Physical Verification Integrity</h3>
          <p style={{ fontSize: '0.95rem', opacity: 0.7, lineHeight: 1.6, maxWidth: '650px', margin: '0 auto' }}>
            Unlike digital listing hubs, every product certified on the Britsync Public Registry undergoes on-site physical auditing. Field agents verify the raw materials list, catalog geolocation timestamps, and confirm ethical working standards directly in the artisan's workspace.
          </p>
        </div>

      </div>
    </main>
  );
}
