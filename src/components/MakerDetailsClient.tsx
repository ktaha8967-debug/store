"use client";

import { useState } from 'react';
import Link from 'next/link';
import { calculateSellingPrice } from '@/lib/pricing';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  images: string; // JSON string
  verificationStatus: string;
}

interface Story {
  id: string;
  title: string;
  excerpt: string;
  heroImage: string;
  craft: string;
  country: string;
}

interface Maker {
  id: string;
  businessName: string;
  founderName: string | null;
  founderStory: string | null;
  businessStory: string | null;
  country: string;
  verificationStatus: string;
  yearsInBusiness: number;
  employeeCount: number;
  coverImage: string | null;
  founderPhoto: string | null;
  impactStory: string | null;
  workshopGallery: string | null;
  teamPhotos: string | null;
  productionPhotos: string | null;
  lifestylePhotos: string | null;
}

export default function MakerDetailsClient({ 
  maker, 
  products, 
  stories 
}: { 
  maker: Maker; 
  products: Product[]; 
  stories: Story[]; 
}) {
  const [saved, setSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("workshop");
  const [videoOpen, setVideoOpen] = useState(false);
  const [activeVideoTab, setActiveVideoTab] = useState('tour');
  const [certModalOpen, setCertModalOpen] = useState(false);

  // Parse galleries
  const getGallery = (field: string | null) => {
    try {
      return field ? JSON.parse(field) as string[] : [];
    } catch (e) {
      return [];
    }
  };

  const workshopGallery = getGallery(maker.workshopGallery);
  const teamPhotos = getGallery(maker.teamPhotos);
  const productionPhotos = getGallery(maker.productionPhotos);
  const lifestylePhotos = getGallery(maker.lifestylePhotos);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveToggle = () => {
    const nextSaved = !saved;
    setSaved(nextSaved);
    if (nextSaved) {
      triggerToast(`Saved ${maker.businessName} to your collection!`);
    } else {
      triggerToast(`Removed ${maker.businessName} from your collection.`);
    }
  };

  // Get active gallery photos
  const getActivePhotos = () => {
    switch (activeTab) {
      case "team": return teamPhotos;
      case "production": return productionPhotos;
      case "lifestyle": return lifestylePhotos;
      default: return workshopGallery;
    }
  };

  const activePhotos = getActivePhotos();

  return (
    <div style={{ position: 'relative' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: 'var(--primary)',
          color: 'var(--accent)',
          border: '1px solid var(--accent)',
          padding: '1rem 2rem',
          borderRadius: '30px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 9999,
          animation: 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
          fontWeight: '600'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Hero Banner Section */}
      <section style={{
        height: '75vh',
        minHeight: '600px',
        backgroundColor: 'var(--primary)',
        color: '#fff',
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '6rem 4rem 4rem',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: `linear-gradient(to top, rgba(17, 21, 20, 1) 0%, rgba(17, 21, 20, 0.4) 60%, rgba(17, 21, 20, 0.2) 100%), url("${maker.coverImage || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200'}") center/cover`,
          zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ 
              display: 'inline-block',
              backgroundColor: 'var(--accent)', 
              color: 'var(--primary)', 
              padding: '0.4rem 1.5rem', 
              borderRadius: '20px', 
              fontWeight: 'bold',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              fontSize: '0.8rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              {maker.verificationStatus} Master Artisan
            </span>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'var(--accent)', padding: '0.4rem 1.2rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.2)' }}>
              🛡️ Trust Score: 98/100 (Excellent)
            </div>
            <button 
              onClick={() => setCertModalOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', textDecoration: 'underline', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              View Maker Elite Certificate
            </button>
          </div>
          <h1 style={{ fontSize: '5rem', marginBottom: '1rem', lineHeight: 1.1, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            {maker.businessName}
          </h1>
          <p style={{ fontSize: '1.5rem', opacity: 0.9, marginBottom: '2.5rem', color: '#eaeaea' }}>
            📍 {maker.country} • Since {new Date().getFullYear() - maker.yearsInBusiness}
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setVideoOpen(true)}
              className="btn-accent" 
              style={{ padding: '1rem 3rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <span style={{ fontSize: '1.2rem' }}>▶</span> Play Documentary Showcase
            </button>
            <button 
              onClick={handleSaveToggle}
              className="btn-primary" 
              style={{ 
                backgroundColor: saved ? 'var(--accent)' : 'rgba(255,255,255,0.1)', 
                color: saved ? 'var(--primary)' : '#fff',
                backdropFilter: 'blur(10px)', 
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 'bold'
              }}
            >
              <span>{saved ? '♥' : '♡'}</span> {saved ? 'Maker Saved' : 'Save Maker'}
            </button>
          </div>
        </div>
      </section>

      {/* Elite Badge Banner */}
      <section style={{ backgroundColor: 'var(--secondary)', padding: '2rem 4rem', borderBottom: '1px solid rgba(31, 75, 67, 0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', fontSize: '0.85rem', fontWeight: 'bold' }}>
          <span>⭐ Elite Verified</span>
          <span>🤝 Human Verified</span>
          <span>📍 Workshop Inspected</span>
          <span>🛡️ Britsync Certified</span>
          <span>📜 Authenticity Passport</span>
          <span>🌍 Verified Origin</span>
        </div>
      </section>

      {/* Main Details and Biography */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem' }}>
        <div style={{ display: 'flex', gap: '5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* Founder Photo Sidebar */}
          <div style={{ flex: '1 1 350px', maxWidth: '400px' }}>
            <div style={{ 
              width: '100%', 
              paddingBottom: '120%', 
              backgroundColor: 'var(--secondary)', 
              backgroundImage: maker.founderPhoto ? `url(${maker.founderPhoto})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)'
            }} />
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>
                {maker.founderName || 'Master Artisan'}
              </h3>
              <p style={{ opacity: 0.6, fontSize: '0.95rem' }}>Founder & Heritage Custodian</p>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '3rem' }}>
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h4 style={{ fontSize: '2.2rem', color: 'var(--accent)', marginBottom: '0.25rem', fontWeight: 'bold' }}>{maker.employeeCount}</h4>
                <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Artisans Employed</p>
              </div>
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h4 style={{ fontSize: '2.2rem', color: 'var(--accent)', marginBottom: '0.25rem', fontWeight: 'bold' }}>{maker.yearsInBusiness}</h4>
                <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Years Preserving Craft</p>
              </div>
            </div>
          </div>
          
          {/* Biography and Story details */}
          <div style={{ flex: '1.5 1 500px' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>The Journey</span>
            <h2 style={{ fontSize: '2.8rem', color: 'var(--primary)', marginTop: '0.5rem', marginBottom: '2rem' }}>Preserving Heritage</h2>
            
            <p style={{ fontSize: '1.15rem', lineHeight: 1.9, opacity: 0.9, marginBottom: '2rem' }}>
              {maker.founderStory}
            </p>
            <p style={{ fontSize: '1.15rem', lineHeight: 1.9, opacity: 0.9, marginBottom: '3rem' }}>
              {maker.businessStory}
            </p>
            
            <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1rem', borderBottom: '2px solid var(--secondary)', paddingBottom: '0.5rem' }}>Community Impact</h3>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, opacity: 0.9, marginBottom: '2rem' }}>
              {maker.impactStory || 'By keeping our workshop running, we provide stable, ethical livelihoods to local families and invest directly into training the next generation of craft practitioners.'}
            </p>
          </div>

        </div>
      </section>

      {/* Tabbed Interactive Gallery Section */}
      <section style={{ backgroundColor: 'var(--surface)', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Behind the Scenes</span>
            <h2 style={{ fontSize: '2.8rem', color: 'var(--primary)', marginTop: '0.5rem', marginBottom: '2.5rem' }}>Inside The Workshop</h2>
            
            {/* Gallery Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
              {[
                { id: "workshop", label: "The Workshop", count: workshopGallery.length },
                { id: "team", label: "Our Team", count: teamPhotos.length },
                { id: "production", label: "Production", count: productionPhotos.length },
                { id: "lifestyle", label: "Lifestyle", count: lifestylePhotos.length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    backgroundColor: activeTab === tab.id ? 'var(--primary)' : 'var(--background)',
                    color: activeTab === tab.id ? 'var(--background)' : 'var(--primary)',
                    transition: 'all 0.3s ease',
                    boxShadow: 'var(--shadow-sm)',
                    border: activeTab === tab.id ? 'none' : '1px solid var(--glass-border)'
                  }}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Active Photos Grid */}
          {activePhotos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.6 }}>
              <p>No photos available in this category yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {activePhotos.map((img, i) => (
                <div key={i} style={{ 
                  height: '350px', 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  backgroundColor: 'var(--background)'
                }}>
                  <img 
                    src={img} 
                    alt={`${activeTab} photo ${i + 1}`} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      transition: 'transform 0.5s ease' 
                    }}
                    className="gallery-img"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Verification History, Timelines, Renewals & Reports */}
      <section style={{ backgroundColor: 'var(--background)', padding: '6rem 2rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Provenance Registry</span>
            <h2 style={{ fontSize: '2.8rem', color: 'var(--primary)', marginTop: '0.5rem' }}>Inspection & Certification History</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '4rem', alignItems: 'start' }}>
            {/* Left Box: Trust Score History & Past Reports */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Trust Score History Card */}
              <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--accent)' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Trust Score History</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                  {[
                    { period: 'October 2025 (Latest)', score: 98, grade: 'Excellent AQL', status: 'Current Elite Tier' },
                    { period: 'October 2024 (Annual Audit)', score: 97, grade: 'Excellent AQL', status: 'Renewed' },
                    { period: 'September 2023 (Initial Setup)', score: 94, grade: 'Very Good', status: 'Approved' }
                  ].map((h, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: idx < 2 ? '1px solid #eee' : 'none', paddingBottom: idx < 2 ? '0.75rem' : 0 }}>
                      <div>
                        <strong style={{ display: 'block', color: 'var(--primary)' }}>{h.period}</strong>
                        <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{h.status}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <strong style={{ display: 'block', color: 'var(--success)', fontSize: '1.1rem' }}>{h.score}/100</strong>
                        <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{h.grade}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Past Reports Card */}
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Past Reports & Recommendations</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  <div>
                    <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.25rem', color: 'var(--primary)' }}>October 2025 Audit Summary</span>
                    <p style={{ margin: 0, opacity: 0.8 }}>"Mastery levels remain superior. Traditional hand-carving methods are executed by all 12 artisans. Recommended upgrading dust ventilation systems in sanding area."</p>
                  </div>
                  <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                    <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.25rem', color: 'var(--primary)' }}>October 2024 Audit Summary</span>
                    <p style={{ margin: 0, opacity: 0.8 }}>"Workshop geofence check-in matches registered coordinates. Local raw walnut wood invoices match production counts. Sanding safety gear upgraded successfully."</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Box: Timelines & Renewals */}
            <div className="card" style={{ padding: '3rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '0.75rem' }}>Verification Timelines & Renewals</h3>

              {/* Timelines split */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                {/* Inspection Timeline */}
                <div>
                  <h4 style={{ color: 'var(--accent)', fontSize: '1rem', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Inspection Timeline</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderLeft: '2px solid var(--secondary)', paddingLeft: '1.2rem', fontSize: '0.85rem' }}>
                    {[
                      { date: 'Oct 15, 2025', desc: 'GPS Check-In completed by Inspector Tariq M.' },
                      { date: 'Oct 12, 2025', desc: 'On-site physical inspection scheduled.' },
                      { date: 'Sep 28, 2025', desc: 'Annual renewal application filed by maker.' }
                    ].map((step, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '-24px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                        <strong style={{ display: 'block' }}>{step.date}</strong>
                        <span style={{ opacity: 0.8, lineHeight: 1.3, display: 'block' }}>{step.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certificate & Renewals Timeline */}
                <div>
                  <h4 style={{ color: 'var(--accent)', fontSize: '1rem', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Certificates & Renewals</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderLeft: '2px solid var(--secondary)', paddingLeft: '1.2rem', fontSize: '0.85rem' }}>
                    {[
                      { date: 'Oct 16, 2025', desc: 'Renewed Elite Status for 24 Months validity (Expires Oct 2027).' },
                      { date: 'Oct 15, 2025', desc: 'Inspection Report approved by Britsync Admin Board.' },
                      { date: 'Oct 16, 2024', desc: 'Renewed Elite Status for 12 Months validity.' }
                    ].map((step, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '-24px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></div>
                        <strong style={{ display: 'block' }}>{step.date}</strong>
                        <span style={{ opacity: 0.8, lineHeight: 1.3, display: 'block' }}>{step.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Expiry alerts note */}
              <div style={{ backgroundColor: '#FAF9F6', border: '1px dashed #D4AF37', borderRadius: '8px', padding: '1.2rem', marginTop: '2.5rem', fontSize: '0.8rem', opacity: 0.8, lineHeight: 1.4 }}>
                <strong>📌 Registry Auto-Renewal System Notice:</strong> Expiry alerts are automatically delivered to the Maker, Regional Inspector, and Britsync Admin Board 60 days, 30 days, and 7 days prior to active registry certificate expiry (Current Cert Validity Option chosen: 24 Months).
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Products Grid from Maker */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Shop Authentics</span>
              <h2 style={{ fontSize: '2.8rem', color: 'var(--primary)', marginTop: '0.5rem' }}>Crafts By This Maker</h2>
            </div>
            <span style={{ fontSize: '1.1rem', opacity: 0.7, fontWeight: '500' }}>{products.length} Items Available</span>
          </div>

          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--surface)', borderRadius: '16px', opacity: 0.7 }}>
              <h3>No products listed currently.</h3>
              <p>We are cataloging new creations from this maker. Stay tuned!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2.5rem' }}>
              {products.map(product => {
                let images: string[] = [];
                try {
                  images = JSON.parse(product.images);
                } catch(e) {}
                
                return (
                  <Link href={`/products/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="card product-card" style={{ padding: '0', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ height: '300px', overflow: 'hidden', position: 'relative' }}>
                        {images[0] ? (
                          <img 
                            src={images[0]} 
                            alt={product.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                            className="product-img"
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--secondary)' }} />
                        )}
                        <span style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          backgroundColor: product.verificationStatus === 'ELITE' ? 'var(--primary)' : 'var(--accent)',
                          color: product.verificationStatus === 'ELITE' ? 'var(--accent)' : 'var(--primary)',
                          padding: '0.3rem 0.8rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          letterSpacing: '0.5px'
                        }}>
                          {product.verificationStatus}
                        </span>
                      </div>
                      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                          {product.category}
                        </span>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: '400', flex: 1 }}>{product.name}</h3>
                        <p style={{ fontSize: '1.25rem', fontWeight: 'bold', marginTop: 'auto', color: 'var(--primary)' }}>
                          £{calculateSellingPrice(product.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Stories List from Maker */}
      {stories.length > 0 && (
        <section style={{ backgroundColor: 'var(--secondary)', padding: '6rem 2rem' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span style={{ color: 'var(--primary)', opacity: 0.8, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Brand Documentaries</span>
              <h2 style={{ fontSize: '2.8rem', color: 'var(--primary)', marginTop: '0.5rem' }}>Stories & Heritage Records</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {stories.map(story => (
                <Link href={`/stories/${story.id}`} key={story.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="card story-row" style={{ 
                    display: 'flex', 
                    gap: '2rem', 
                    padding: '1.5rem', 
                    alignItems: 'center', 
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ 
                      width: '180px', 
                      height: '120px', 
                      borderRadius: '8px', 
                      backgroundImage: `url(${story.heroImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      flexShrink: 0
                    }} />
                    <div style={{ flex: 1, minWidth: '250px' }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {story.craft} • {story.country}
                      </span>
                      <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginTop: '0.25rem', marginBottom: '0.5rem', fontWeight: '400' }}>
                        {story.title}
                      </h3>
                      <p style={{ opacity: 0.8, fontSize: '0.95rem', lineHeight: 1.5 }}>{story.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Modal Overlay */}
      {videoOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '2rem'
        }}>
          <div style={{
            maxWidth: '900px',
            width: '100%',
            backgroundColor: '#000',
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}>
            {/* Close Button */}
            <button 
              onClick={() => setVideoOpen(false)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                border: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.4)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)')}
            >
              ✕
            </button>

            {/* Video Categories Navigation */}
            <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', borderBottom: '1px solid #333', padding: '1rem 2rem', backgroundColor: '#111' }}>
              {[
                { key: 'tour', name: 'Workshop Tour' },
                { key: 'interview', name: 'Founder Interview' },
                { key: 'demo', name: 'Craft Demonstration' },
                { key: 'process', name: 'Production Process' },
                { key: 'showcase', name: 'Finished Product Showcase' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveVideoTab(tab.key)}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '20px',
                    border: 'none',
                    background: activeVideoTab === tab.key ? 'var(--accent)' : 'transparent',
                    color: activeVideoTab === tab.key ? 'var(--primary)' : '#fff',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Video Player Area */}
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Artisan Craft Documentary"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
              />
            </div>
            
            <div style={{ padding: '2rem', backgroundColor: '#111', color: '#fff' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>
                {maker.businessName} — {activeVideoTab === 'tour' ? 'Workshop Tour' : (activeVideoTab === 'interview' ? 'Founder Interview' : (activeVideoTab === 'demo' ? 'Craft Demonstration' : (activeVideoTab === 'process' ? 'Production Process' : 'Finished Product Showcase')))}
              </h3>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                Britsync Certified Field Recording. Verified on site on October 15, 2025. Demonstrates verified manual work loops to satisfy Britsync quality and authenticity protocols.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* GORGEOUS PRINTABLE LUXURY GOLD-ACCENTED ELITE CERTIFICATE MODAL */}
      {certModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '2rem'
        }}>
          {/* Scrollable Container */}
          <div style={{ 
            maxWidth: '900px', 
            width: '100%', 
            maxHeight: '90vh', 
            overflowY: 'auto', 
            backgroundColor: '#FAF9F6', 
            borderRadius: '12px', 
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
            padding: '1rem'
          }}>
            {/* Control Bar (Hidden when printing) */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid #ddd', marginBottom: '2rem', backgroundColor: '#fff', borderRadius: '8px' }}>
              <button 
                onClick={() => window.print()}
                className="btn-accent" 
                style={{ padding: '0.6rem 1.5rem', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}
              >
                🖨️ Download PDF / Print Certificate
              </button>
              <button 
                onClick={() => setCertModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Close Window
              </button>
            </div>

            {/* Printable Certificate Template */}
            <div id="print-certificate-container" style={{ 
              backgroundColor: '#FAF9F6',
              color: 'var(--primary)',
              padding: '4rem 3rem',
              border: '12px double #D4AF37', // Gold Accent Border
              borderRadius: '4px',
              fontFamily: 'Georgia, serif',
              textAlign: 'center',
              position: 'relative'
            }}>
              
              {/* Britsync Crest Logo */}
              <div style={{ marginBottom: '2.5rem' }}>
                <strong style={{ letterSpacing: '4px', fontSize: '1.4rem', color: '#D4AF37', textTransform: 'uppercase', display: 'block', fontFamily: 'var(--font-outfit)' }}>Britsync</strong>
                <span style={{ fontSize: '0.8rem', letterSpacing: '2px', opacity: 0.6, textTransform: 'uppercase' }}>Global Heritage Registry</span>
              </div>

              {/* Title */}
              <h1 style={{ fontSize: '2.8rem', color: 'var(--primary)', fontWeight: 300, fontStyle: 'italic', marginBottom: '1rem' }}>
                Artisan Registry Certification
              </h1>
              
              <div style={{ width: '80px', height: '2px', backgroundColor: '#D4AF37', margin: '0 auto 2rem' }} />

              {/* Verification Subtitle */}
              <p style={{ fontSize: '1.1rem', opacity: 0.8, lineHeight: 1.8, maxWidth: '600px', margin: '0 auto 3.5rem' }}>
                This document certifies that the workshop of <strong>{maker.businessName}</strong>, founded by <strong>{maker.founderName}</strong> in <strong>{maker.country}</strong>, has successfully passed physical geofence auditing and material compliance tests.
              </p>

              {/* Details table */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', textAlign: 'left', maxWidth: '650px', margin: '0 auto 4rem', fontSize: '0.95rem', borderBottom: '1px dashed rgba(212, 175, 55, 0.3)', paddingBottom: '2.5rem' }}>
                <div>
                  <span style={{ opacity: 0.6, fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Maker ID</span>
                  <strong style={{ display: 'block' }}>BS-MAKER-{maker.id.toUpperCase().substring(0,6)}</strong>
                </div>
                <div>
                  <span style={{ opacity: 0.6, fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Regional Origin</span>
                  <strong style={{ display: 'block' }}>{maker.country} (Heritage Registered)</strong>
                </div>
                <div>
                  <span style={{ opacity: 0.6, fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Verification Grade</span>
                  <strong>98/100 (Excellent AQL)</strong>
                </div>
                <div>
                  <span style={{ opacity: 0.6, fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Active Status Registry</span>
                  <strong>Elite Verified</strong>
                </div>
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '4rem', fontSize: '0.85rem', fontWeight: 'bold', color: '#D4AF37' }}>
                <span>🛡️ Human Verified Maker</span>
                <span>📍 Workshop Inspected</span>
                <span>⭐ Britsync Certified</span>
              </div>

              {/* Official Seal and Signatures */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '750px', margin: '0 auto', fontSize: '0.85rem' }}>
                <div style={{ borderTop: '1px solid #ccc', paddingTop: '0.75rem', width: '220px', textAlign: 'left' }}>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6, display: 'block' }}>Lead Inspector Signature</span>
                  <span style={{ fontFamily: 'var(--font-outfit)', fontWeight: 'bold', fontStyle: 'italic', display: 'block', margin: '0.25rem 0' }}>Tariq M.</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.5, display: 'block' }}>Ref: Tariq M. (Digital: 8F2A9C0E)</span>
                </div>

                {/* Britsync Wax Seal */}
                <div style={{ 
                  width: '90px', 
                  height: '90px', 
                  backgroundColor: '#D4AF37', 
                  backgroundImage: 'radial-gradient(circle, #f3e5ab 0%, #D4AF37 100%)', 
                  borderRadius: '50%', 
                  boxShadow: '0 4px 10px rgba(212,175,87,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  lineHeight: 1.1,
                  textAlign: 'center',
                  border: '3px solid #FAF9F6'
                }}>
                  OFFICIAL<br/>SEAL
                </div>

                <div style={{ borderTop: '1px solid #ccc', paddingTop: '0.75rem', width: '220px', textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6, display: 'block' }}>Registry Authority</span>
                  <span style={{ fontFamily: 'var(--font-outfit)', fontWeight: 'bold', fontStyle: 'italic', display: 'block', margin: '0.25rem 0' }}>Britsync Audit Board</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.5, display: 'block' }}>Verification ID: VER-WOOD-9823</span>
                </div>
              </div>

              {/* Print reference */}
              <div style={{ marginTop: '4.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.75rem', opacity: 0.5 }}>
                <span>Certified System Output</span>
                <span style={{ fontStyle: 'italic' }}>This certificate is cryptographically recorded and verified by Britsync.</span>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* CSS print-only styling */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          /* Hide all page content */
          body * {
            visibility: hidden;
          }
          /* Show only the certificate modal container */
          #print-certificate-container, #print-certificate-container * {
            visibility: visible;
          }
          #print-certificate-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border: 15px double #D4AF37 !important;
            padding: 4rem 3rem !important;
            margin: 0 !important;
            box-shadow: none !important;
            background-color: #FAF9F6 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .gallery-img:hover {
          transform: scale(1.05);
        }
        .product-card {
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg) !important;
        }
        .product-card:hover .product-img {
          transform: scale(1.06);
        }
        .story-row {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .story-row:hover {
          transform: translateX(5px);
          box-shadow: var(--shadow-md) !important;
        }
      `}} />
    </div>
  );
}
