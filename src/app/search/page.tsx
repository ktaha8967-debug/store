'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { calculateSellingPrice } from '@/lib/pricing';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialCountry = searchParams.get('country') || '';
  const initialTier = searchParams.get('tier') || '';
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filters, setFilters] = useState({
    category: initialCategory,
    country: initialCountry,
    minPrice: '',
    maxPrice: '',
    verification: initialTier === 'elite' ? 'ELITE' : initialTier === 'general' ? 'GENERAL' : '',
    handmade: false,
    womenLed: false,
    ecoFriendly: false,
    material: ''
  });

  // Unique list of countries, categories, and materials derived from dynamic products
  const [countriesList, setCountriesList] = useState<string[]>([]);
  const [materialsList, setMaterialsList] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        
        // Extract unique countries
        const countries = Array.from(new Set(data.map((p: any) => p.maker?.country || p.origin?.split(' ')[0]).filter(Boolean))) as string[];
        setCountriesList(countries.length ? countries : ['Pakistan', 'Turkey', 'Morocco', 'Peru', 'India', 'Mexico', 'Vietnam']);

        // Extract unique materials
        const materials = Array.from(new Set(data.map((p: any) => p.materials).filter(Boolean))) as string[];
        setMaterialsList(materials.length ? materials : ['Organic Cotton', 'Walnut Wood', 'Alpaca Wool', 'Indigo Dye', 'Leather', 'Terracotta']);
        
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Sync route query parameters with state if they change
  useEffect(() => {
    const categoryQuery = searchParams.get('category');
    const countryQuery = searchParams.get('country');
    const tierQuery = searchParams.get('tier');
    
    setFilters(prev => ({
      ...prev,
      category: categoryQuery !== null ? categoryQuery : prev.category,
      country: countryQuery !== null ? countryQuery : prev.country,
      verification: tierQuery === 'elite' ? 'ELITE' : tierQuery === 'general' ? 'GENERAL' : prev.verification
    }));
  }, [searchParams]);

  const filteredProducts = products.filter(p => {
    // Search Query (title, description, maker name, story)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      const matchMaker = p.maker?.businessName?.toLowerCase().includes(q);
      const matchStory = p.story?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchMaker && !matchStory) return false;
    }

    // Category
    if (filters.category && p.category !== filters.category) return false;

    // Country
    const productCountry = p.maker?.country || p.origin || '';
    if (filters.country && !productCountry.toLowerCase().includes(filters.country.toLowerCase())) return false;

    // Verification Status
    if (filters.verification) {
      if (filters.verification === 'GI' && p.verificationStatus !== 'GI') return false;
      if (filters.verification === 'ELITE' && !['ELITE', 'GI'].includes(p.verificationStatus)) return false;
      if (filters.verification === 'GENERAL' && p.verificationStatus !== 'GENERAL') return false;
    }

    // Price Bounds
    const finalPrice = p.price;
    if (filters.minPrice && finalPrice < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && finalPrice > parseFloat(filters.maxPrice)) return false;

    // Values checkboxes
    if (filters.handmade && !p.isHandmade) return false;
    if (filters.womenLed && !p.isWomenLed) return false;
    if (filters.ecoFriendly && !p.isEcoFriendly) return false;

    // Material
    if (filters.material && (!p.materials || !p.materials.toLowerCase().includes(filters.material.toLowerCase()))) return false;

    return true;
  });

  return (
    <main className="animate-fade-in" style={{ backgroundColor: 'var(--background)', minHeight: '100vh', paddingTop: '8rem', paddingBottom: '6rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Top Search bar */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
          <input 
            type="text" 
            placeholder="Search by product, maker, story, or material..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: '1rem 1.5rem', borderRadius: '30px', border: '1px solid #ccc', fontSize: '1rem', outline: 'none', boxShadow: 'var(--shadow-sm)' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '4rem' }}>
          
          {/* Sidebar Advanced Filters */}
          <aside style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', margin: 0 }}>Advanced Filters</h2>
              <button 
                onClick={() => setFilters({ category: '', country: '', minPrice: '', maxPrice: '', verification: '', handmade: false, womenLed: false, ecoFriendly: false, material: '' })}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', padding: 0 }}
              >
                Clear All
              </button>
            </div>
            
            {/* Categories */}
            <div style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 'bold' }}>Categories</h3>
              {['Textiles', 'Ceramics', 'Jewelry', 'Woodwork', 'Leather', 'Home Decor'].map(cat => (
                <label key={cat} style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input 
                    type="radio" 
                    name="category" 
                    checked={filters.category === cat}
                    onChange={() => setFilters({ ...filters, category: cat })}
                    style={{ marginRight: '0.5rem' }} 
                  /> {cat}
                </label>
              ))}
              {filters.category && (
                <button onClick={() => setFilters({...filters, category: ''})} style={{ border: 'none', background: 'none', color: 'var(--error)', textDecoration: 'underline', fontSize: '0.75rem', cursor: 'pointer', padding: 0, marginTop: '0.5rem' }}>Clear Category</button>
              )}
            </div>

            {/* Verification Tiers */}
            <div style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 'bold' }}>Verification Tier</h3>
              {[
                { key: 'GI', name: '🏛️ GI Protected Heritage' },
                { key: 'ELITE', name: '⭐ Elite Verified Studio' },
                { key: 'GENERAL', name: '✓ Approved General Maker' }
              ].map(tier => (
                <label key={tier.key} style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input 
                    type="radio" 
                    name="verification"
                    checked={filters.verification === tier.key}
                    onChange={() => setFilters({ ...filters, verification: tier.key })}
                    style={{ marginRight: '0.5rem' }} 
                  /> {tier.name}
                </label>
              ))}
              {filters.verification && (
                <button onClick={() => setFilters({...filters, verification: ''})} style={{ border: 'none', background: 'none', color: 'var(--error)', textDecoration: 'underline', fontSize: '0.75rem', cursor: 'pointer', padding: 0, marginTop: '0.5rem' }}>Clear Tier</button>
              )}
            </div>

            {/* Country of Origin */}
            <div style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 'bold' }}>Country of Origin</h3>
              <select 
                value={filters.country} 
                onChange={e => setFilters({ ...filters, country: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.9rem', backgroundColor: '#fff' }}
              >
                <option value="">All Countries</option>
                {countriesList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Materials */}
            <div style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 'bold' }}>Materials</h3>
              <select 
                value={filters.material} 
                onChange={e => setFilters({ ...filters, material: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.9rem', backgroundColor: '#fff' }}
              >
                <option value="">All Materials</option>
                {materialsList.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 'bold' }}>Price Range (£)</h3>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={filters.minPrice} 
                  onChange={e => setFilters({...filters, minPrice: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.85rem' }} 
                />
                <span>-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={filters.maxPrice} 
                  onChange={e => setFilters({...filters, maxPrice: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.85rem' }} 
                />
              </div>
            </div>

            {/* Ethical Values */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 'bold' }}>Ethical Standards</h3>
              <label style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={filters.handmade} onChange={(e) => setFilters({...filters, handmade: e.target.checked})} style={{ marginRight: '0.5rem' }} /> 100% Handmade
              </label>
              <label style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={filters.womenLed} onChange={(e) => setFilters({...filters, womenLed: e.target.checked})} style={{ marginRight: '0.5rem' }} /> Women-Led Workshop
              </label>
              <label style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={filters.ecoFriendly} onChange={(e) => setFilters({...filters, ecoFriendly: e.target.checked})} style={{ marginRight: '0.5rem' }} /> Eco-Friendly Materials
              </label>
            </div>
          </aside>

          {/* Product Grid */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', margin: 0 }}>
                {filters.category ? `${filters.category} Collection` : 'All Products'}
              </h1>
              <span style={{ opacity: 0.7, fontWeight: 'bold' }}>{filteredProducts.length} items found</span>
            </div>

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '3rem' }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="skeleton" style={{ height: '400px', borderRadius: '16px' }}></div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '3rem' }}>
                {filteredProducts.map(product => {
                  let parsedImages = [];
                  try {
                    parsedImages = JSON.parse(product.images);
                  } catch (e) {
                    parsedImages = ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800'];
                  }
                  const finalImage = parsedImages[0] || 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800';
                  
                  return (
                    <Link href={`/products/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ 
                          width: '100%', 
                          height: '300px', 
                          background: `url(${finalImage}) center/cover`,
                          position: 'relative'
                        }}>
                          <div style={{
                            position: 'absolute',
                            top: '1rem',
                            left: '1rem',
                            backgroundColor: product.verificationStatus === 'GI' ? 'var(--primary)' : 'var(--surface)',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            boxShadow: 'var(--shadow-sm)',
                            color: product.verificationStatus === 'GI' ? 'var(--accent)' : 'var(--primary)'
                          }}>
                            {product.verificationStatus === 'GI' ? '🏛️ GI Certified' : product.verificationStatus === 'ELITE' ? '⭐ Elite Verified' : '✓ Approved'}
                          </div>
                        </div>
                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                            {product.category}
                          </span>
                          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: '400', flex: 1 }}>{product.name}</h3>
                          <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.85rem' }}>By {product.maker?.businessName || 'Verified Artisan'}</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>£{product.price.toFixed(2)}</p>
                            <button className="btn-accent" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>View Detail</button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
                
                {filteredProducts.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', padding: '6rem 2rem', textAlign: 'center', backgroundColor: 'var(--surface)', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '1rem' }}>No products match your search criteria</h3>
                    <p style={{ opacity: 0.7, maxWidth: '500px', margin: '0 auto' }}>Try adjusting your filters or checking your search keywords to discover authentic pieces.</p>
                    <button 
                      onClick={() => setFilters({ category: '', country: '', minPrice: '', maxPrice: '', verification: '', handmade: false, womenLed: false, ecoFriendly: false, material: '' })}
                      className="btn-accent" 
                      style={{ marginTop: '2rem', padding: '0.75rem 2rem' }}
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: '12rem 2rem', textAlign: 'center', fontSize: '1.2rem', color: 'var(--primary)' }}>Loading advanced search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
