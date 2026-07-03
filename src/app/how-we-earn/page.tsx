'use client';
import Link from 'next/link';

export default function HowWeEarnPage() {
  return (
    <main className="animate-fade-in" style={{ backgroundColor: 'var(--background)', minHeight: '100vh', paddingTop: '8rem', paddingBottom: '6rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Header Section */}
        <section style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Transparency First</span>
          <h1 style={{ fontSize: '3.5rem', color: 'var(--primary)', marginTop: '1rem', marginBottom: '1.5rem', fontFamily: 'var(--font-outfit)', fontWeight: 300 }}>How Britsync Earns</h1>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.8, opacity: 0.8, maxWidth: '800px', margin: '0 auto' }}>
            Britsync is not a commission-based broker. We are a managed commerce platform that funds high-trust, physical verification and global fulfillment services through a clear and transparent markup system.
          </p>
        </section>

        {/* The Model Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '6rem' }}>
          <div className="card" style={{ padding: '3rem', borderTop: '4px solid var(--accent)' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>1. The Maker's Desired Price</h3>
            <p style={{ opacity: 0.8, lineHeight: 1.7, marginBottom: '2rem' }}>
              Every artisan on Britsync sets their own desired price. This is the exact amount they receive upon a successful sale. They are protected from platform price cuts and do not pay any marketing fees, listing fees, or transaction commissions.
            </p>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--background)', borderRadius: '12px', borderLeft: '4px solid var(--primary)' }}>
              <span style={{ fontSize: '0.85rem', opacity: 0.6, display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>Artisan Payout</span>
              <strong style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>100% of Desired Amount</strong>
            </div>
          </div>

          <div className="card" style={{ padding: '3rem', borderTop: '4px solid var(--primary)' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>2. The Platform Margin</h3>
            <p style={{ opacity: 0.8, lineHeight: 1.7, marginBottom: '2rem' }}>
              Britsync adds a managed commerce margin on top of the maker's price. The customer pays the combined final price, and the margin dynamically funds our end-to-end ecosystem operations, custom customs clearance, and global support.
            </p>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--background)', borderRadius: '12px', borderLeft: '4px solid var(--accent)' }}>
              <span style={{ fontSize: '0.85rem', opacity: 0.6, display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>Platform Coverage</span>
              <strong style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>All Logistics & Trust Operations</strong>
            </div>
          </div>
        </div>

        {/* Detailed services funded by the difference */}
        <section style={{ backgroundColor: 'var(--surface)', padding: '4rem', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', marginBottom: '6rem' }}>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', textAlign: 'center', marginBottom: '3.5rem' }}>What Does the Margin Fund?</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>🛡️</div>
              <div>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Physical Verification</h4>
                <p style={{ opacity: 0.7, fontSize: '0.95rem', lineHeight: 1.6 }}>We deploy local inspectors to makers' workshops to verify fair working conditions, material authenticity, and ethical labor.</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>📸</div>
              <div>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Studio Photography & Stories</h4>
                <p style={{ opacity: 0.7, fontSize: '0.95rem', lineHeight: 1.6 }}>We hire local writers and filmmakers to document the artisan's biography and produce premium-quality, high-resolution media.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>✈️</div>
              <div>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Global Delivery & Duty</h4>
                <p style={{ opacity: 0.7, fontSize: '0.95rem', lineHeight: 1.6 }}>We handle international air freight, customs, duty paperwork, and last-mile premium shipping, insuring every hand-crafted package.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>🔒</div>
              <div>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Secure Escrow Services</h4>
                <p style={{ opacity: 0.7, fontSize: '0.95rem', lineHeight: 1.6 }}>Payments from buyers remain protected in escrow until the product is safely inspected and accepted, preventing cross-border fraud.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>💬</div>
              <div>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>24/7 Concierge Support</h4>
                <p style={{ opacity: 0.7, fontSize: '0.95rem', lineHeight: 1.6 }}>We manage all communication, updates, refunds, and buyer requests in English, French, German, and Spanish, acting as a translator.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>💻</div>
              <div>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Ecosystem Maintenance</h4>
                <p style={{ opacity: 0.7, fontSize: '0.95rem', lineHeight: 1.6 }}>We maintain the software, cryptographic digital passports (blockchain record of authenticity), server security, and hosting.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Example Transaction */}
        <section style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>A Typical Example</h2>
          <p style={{ opacity: 0.8, marginBottom: '3.5rem' }}>Here is how the pricing breaks down for an individual product, from maker desired price to checkout.</p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ padding: '2rem', backgroundColor: 'var(--surface)', borderRadius: '16px', minWidth: '200px', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.6, display: 'block', fontWeight: 'bold', textTransform: 'uppercase' }}>1. Maker Asks</span>
              <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)', margin: '0.5rem 0' }}>£150</h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Desired Price</p>
            </div>
            
            <div style={{ fontSize: '2rem', color: 'var(--accent)' }}>+</div>
            
            <div style={{ padding: '2rem', backgroundColor: 'var(--surface)', borderRadius: '16px', minWidth: '200px', boxShadow: 'var(--shadow-sm)', border: '1px dashed var(--accent)' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.6, display: 'block', fontWeight: 'bold', textTransform: 'uppercase' }}>2. Platform Margin</span>
              <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)', margin: '0.5rem 0' }}>£90</h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>60% Managed Markup</p>
            </div>

            <div style={{ fontSize: '2rem', color: 'var(--accent)' }}>=</div>

            <div style={{ padding: '2rem', backgroundColor: 'var(--primary)', color: 'var(--background)', borderRadius: '16px', minWidth: '200px', boxShadow: 'var(--shadow-md)' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.8, display: 'block', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--accent)' }}>3. Buyer Pays</span>
              <h3 style={{ fontSize: '2.5rem', color: 'var(--accent)', margin: '0.5rem 0' }}>£240</h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Final Selling Price</p>
            </div>
          </div>
          
          <div style={{ marginTop: '4rem' }}>
            <Link href="/search" className="btn-accent" style={{ textDecoration: 'none', padding: '1rem 3rem' }}>Browse The Collection</Link>
          </div>
        </section>

      </div>
    </main>
  );
}
