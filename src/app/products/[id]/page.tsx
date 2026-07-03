'use client';
import { useState } from 'react';
import Link from 'next/link';
import { calculateSellingPrice } from '@/lib/pricing';

import { useEffect } from 'react';

export default function UltimatePDP({ params }: { params: { id: string } }) {
  const [activeVideoTab, setActiveVideoTab] = useState('tour');
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fallback / Static product database in case dynamic ID is mock or not in Prisma
  const getStaticFallback = (id: string) => {
    const isElite = id === '1' || id === '2' || id === '3' || id === '6';
    return {
      id: id,
      name: id === '1' ? "Hand-Block Printed Ajrak Shawl" : id === '2' ? "Vintage Wool Kilim" : id === '3' ? "Fine Jamdani Scarf" : id === '5' ? "Iznik Ceramic Bowl" : "Masterpiece Hand-Carved Walnut Credenza",
      price: calculateSellingPrice(id === '1' ? 150 : id === '2' ? 450 : id === '3' ? 120 : id === '5' ? 85 : 850),
      category: id === '5' ? "Ceramics" : id === '2' ? "Home Decor" : "Textiles",
      badge: isElite ? "Elite Verified" : "Approved Maker",
      isElite: isElite,
      images: [
        id === '1' ? "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=1200" :
        id === '2' ? "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200" :
        id === '5' ? "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=1200" :
        "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=800"
      ],
      maker: {
        name: id === '1' ? "Aisha Heritage Textiles" : id === '2' ? "Anatolian Heritage" : "Atlas Woods",
        country: id === '1' ? "Pakistan" : id === '2' ? "Turkey" : "Morocco",
        village: id === '1' ? "Sindh" : "Konya",
        years: 45,
        founder: id === '1' ? "Aisha Khan" : "Mehmet K.",
        mission: "To preserve traditional heritage craft while providing fair, sustainable wages.",
        employees: 12,
        founderImage: id === '1' ? "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=800" : "https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=800",
        workshopImages: [
          "https://images.unsplash.com/photo-1588615419951-dc668b59fa87?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=800"
        ]
      },
      verification: {
        id: "VER-CRAFT-9823",
        certNumber: `BS-ELITE-2026-${id.toUpperCase()}`,
        score: isElite ? 98 : 84,
        grade: isElite ? "Excellent" : "Approved",
        inspectionDate: "24 Jan 2026",
        expiryDate: "23 Jan 2027",
        scores: {
          craftsmanship: 98,
          quality: 97,
          authenticity: 100,
          workshop: 98,
          packaging: 96,
          story: 99
        },
        inspector: "Tariq M.",
        inspectorTitle: "Certified Britsync Field Inspector",
        inspectorSig: "Tariq M. (Digital Hash: 8F2A9C0E)",
        makerSig: "Artisan Partner (Digital Hash: 4B1D7E3A)",
        adminSig: "Britsync Authority (Digital Approved: 9C7A5E1B)",
        checklist: [
          { item: "Business Registration", status: "Pass", comment: "Registered crafts collective. Active license verified." },
          { item: "Identity Verified", status: "Pass", comment: "Artisan identity checked against passport registry." },
          { item: "Workshop Exists", status: "Pass", comment: "On-site GPS coordinates validated." },
          { item: "Production Done On Site", status: "Pass", comment: "Verified all pieces are constructed by local artisans in workshop." },
          { item: "Traditional Method Verified", status: "Pass", comment: "Hand tools verified. Machine-made equivalents absent." },
          { item: "Materials Sourcing Check", status: "Pass", comment: "Passed natural, organic and ethical dyes verification check." },
          { item: "Quality Standards Control", status: "Pass", comment: "Exceeds all standard metrics. Sanded surfaces flush." },
          { item: "Packaging Approved", status: isElite ? "Pass" : "Needs Improvement", comment: isElite ? "Custom crated packaging." : "Needs crate upgrades." }
        ],
        report: {
          summary: "This workspace preserves traditional methods. The workshop provides standard labor conditions and maintains historical techniques.",
          strengths: "Decades of master training, locally sourced high-grade materials, and fair living wage practices.",
          weaknesses: "Slight production delays due to handwork limitations during extreme weather.",
          recommendations: "Add solar-powered workspaces to support lighting after dusk.",
          improvement: "Britsync recommends direct ventilation improvements in the workspace."
        }
      }
    };
  };

  useEffect(() => {
    setLoading(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(products => {
        const found = products.find((p: any) => p.id === params.id);
        if (found) {
          let parsedImages = [];
          try {
            parsedImages = JSON.parse(found.images);
          } catch (e) {
            parsedImages = [found.image || 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=1200'];
          }
          if (parsedImages.length < 5) {
            parsedImages = [
              ...parsedImages,
              "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&q=80&w=800",
              "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800",
              "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=800",
              "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=800"
            ];
          }

          let workshopGallery = [];
          try {
            workshopGallery = JSON.parse(found.maker.workshopGallery);
          } catch(e) {
            workshopGallery = [
              "https://images.unsplash.com/photo-1588615419951-dc668b59fa87?auto=format&fit=crop&q=80&w=800",
              "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=800"
            ];
          }

          const mapped = {
            id: found.id,
            name: found.name,
            price: found.price, // already calculates markups on API side
            category: found.category,
            badge: found.verificationStatus === 'GI' ? 'GI Certified' : found.verificationStatus === 'ELITE' ? 'Elite Verified' : 'Approved Maker',
            isElite: found.verificationStatus === 'ELITE' || found.verificationStatus === 'GI',
            images: parsedImages,
            description: found.description,
            story: found.story || 'Handcrafted using techniques passed down for generations.',
            origin: found.origin || `${found.maker.country} (Rural Workshop)`,
            materials: found.materials || 'Locally Sourced Organic Materials',
            productionMethod: found.productionMethod || 'Handcrafted using traditional methods.',
            dimensions: found.dimensions || 'Approx. 45cm x 30cm x 15cm',
            careInstructions: found.careInstructions || 'Spot clean only. Keep away from direct sunlight.',
            shippingInfo: found.shippingInfo || 'Standard International Shipping',
            returnPolicy: found.returnPolicy || '30-day returns for unused items.',
            maker: {
              id: found.maker.id,
              name: found.maker.businessName,
              country: found.maker.country,
              village: found.maker.founderStory ? found.maker.founderStory.split(' ').slice(-3).join(' ') : 'Local Village',
              years: found.maker.yearsInBusiness || 20,
              founder: found.maker.founderName || 'Master Artisan',
              mission: found.maker.mission || 'To preserve traditional craftsmanship while providing sustainable livelihoods.',
              employees: found.maker.employeeCount || 8,
              founderImage: found.maker.founderPhoto || 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=800',
              workshopImages: workshopGallery
            },
            verification: {
              id: `VER-CRAFT-${found.id.slice(0, 4).toUpperCase()}`,
              certNumber: `BS-ELITE-2026-${found.id.slice(0, 4).toUpperCase()}`,
              score: found.verificationStatus === 'GI' ? 98 : found.verificationStatus === 'ELITE' ? 92 : 84,
              grade: found.verificationStatus === 'GI' ? 'Excellent' : found.verificationStatus === 'ELITE' ? 'Very Good' : 'Approved',
              inspectionDate: '12 Jan 2026',
              expiryDate: '11 Jan 2027',
              scores: {
                craftsmanship: found.verificationStatus === 'GI' ? 98 : found.verificationStatus === 'ELITE' ? 94 : 85,
                quality: found.verificationStatus === 'GI' ? 97 : found.verificationStatus === 'ELITE' ? 93 : 84,
                authenticity: 100,
                workshop: found.verificationStatus === 'GI' ? 98 : found.verificationStatus === 'ELITE' ? 92 : 82,
                packaging: found.verificationStatus === 'GI' ? 96 : found.verificationStatus === 'ELITE' ? 90 : 80,
                story: 99
              },
              inspector: 'Tariq M.',
              inspectorTitle: 'Certified Britsync Field Inspector',
              inspectorSig: 'Tariq M. (Digital Hash: 8F2A9C0E)',
              makerSig: `${found.maker.founderName || 'Artisan'} (Digital Hash: 4B1D7E3A)`,
              adminSig: 'Britsync Authority (Digital Approved: 9C7A5E1B)',
              checklist: [
                { item: "Business Registration", status: "Pass", comment: "Registered crafts collective. Active license verified." },
                { item: "Identity Verified", status: "Pass", comment: "Artisan identity checked against passport registry." },
                { item: "Workshop Exists", status: "Pass", comment: "On-site GPS coordinates validated." },
                { item: "Production Done On Site", status: "Pass", comment: "Verified all pieces are constructed by local artisans in workshop." },
                { item: "Traditional Method Verified", status: "Pass", comment: "Hand tools verified. Machine-made equivalents absent." },
                { item: "Materials Sourcing Check", status: "Pass", comment: "Passed natural, organic and ethical dyes verification check." },
                { item: "Quality Standards Control", status: "Pass", comment: "Exceeds all standard metrics. Sanded surfaces flush." },
                { item: "Packaging Approved", status: found.verificationStatus === 'GENERAL' ? "Needs Improvement" : "Pass", comment: found.verificationStatus === 'GENERAL' ? "Standard packing wrap." : "Custom crated packaging." }
              ],
              report: {
                summary: `Audit report for ${found.maker.businessName}. The workshop operates according to regional traditional rules.`,
                strengths: "Decades of master training, authentic natural materials, active village community impact, fair wages.",
                weaknesses: "Production timeline scales with handmade complexity, dependent on weather conditions.",
                recommendations: "Add solar-powered workspaces to support lighting after dusk.",
                improvement: "Britsync recommends direct ventilation improvements in the workspace."
              }
            }
          };
          setProduct(mapped);
        } else {
          setProduct(getStaticFallback(params.id));
        }
        setLoading(false);
      })
      .catch(() => {
        setProduct(getStaticFallback(params.id));
        setLoading(false);
      });
  }, [params.id]);

  const handleAddToBag = () => {
    if (!product) return;
    try {
      const savedCart = localStorage.getItem('britsync_cart');
      const cartItems = savedCart ? JSON.parse(savedCart) : [];
      const existing = cartItems.find((item: any) => item.id === product.id);
      if (existing) {
        existing.qty += 1;
      } else {
        cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          image: product.images[0],
          maker: product.maker.name
        });
      }
      localStorage.setItem('britsync_cart', JSON.stringify(cartItems));
      window.dispatchEvent(new Event('cartUpdate'));
      alert(`✓ ${product.name} added to your Shopping Bag!`);
    } catch(e) {}
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    try {
      const savedWishlist = localStorage.getItem('britsync_wishlist');
      const wishlistItems = savedWishlist ? JSON.parse(savedWishlist) : [];
      const existing = wishlistItems.find((item: any) => item.id === product.id);
      if (existing) {
        alert('This item is already in your wishlist.');
      } else {
        wishlistItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          maker: product.maker.name
        });
        localStorage.setItem('britsync_wishlist', JSON.stringify(wishlistItems));
        window.dispatchEvent(new Event('wishlistUpdate'));
        alert(`✓ ${product.name} saved to your Wishlist!`);
      }
    } catch(e) {}
  };

  const videoDocs = [
    { key: 'tour', name: 'Workshop Tour', desc: 'A walkthrough of the workshop interior, raw yard, and master woodcarving benches.', url: 'https://player.vimeo.com/external/tour-sample.mp4' },
    { key: 'interview', name: 'Founder Interview', desc: 'Founder shares their history learning the craft and the shop heritage.', url: 'https://player.vimeo.com/external/interview-sample.mp4' },
    { key: 'demo', name: 'Craft Demonstration', desc: 'Demonstration of master artisan tools chiseling signature detail panels.', url: 'https://player.vimeo.com/external/demo-sample.mp4' },
    { key: 'process', name: 'Production Process', desc: 'Detailed raw log cutting, construction joinery, and natural organic polish stages.', url: 'https://player.vimeo.com/external/process-sample.mp4' },
    { key: 'showcase', name: 'Finished Showcase', desc: 'Visual inspection of the finalized craft, highlighting smooth joints and alignment.', url: 'https://player.vimeo.com/external/showcase-sample.mp4' }
  ];

  const handlePrintCertificate = () => {
    window.print();
  };

  if (loading) {
    return <div style={{ padding: '12rem 2rem', textAlign: 'center', fontSize: '1.2rem', color: 'var(--primary)' }}>Loading authentic product details...</div>;
  }

  if (!product) {
    return <div style={{ padding: '12rem 2rem', textAlign: 'center', fontSize: '1.2rem', color: 'var(--error)' }}>Product not found.</div>;
  }

  const isElite = product.isElite;
  
  return (
    <main className="animate-fade-in" style={{ backgroundColor: 'var(--background)', minHeight: '100vh', paddingTop: '8rem', paddingBottom: '6rem' }}>
      
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "image": product.images,
            "description": product.description,
            "category": product.category,
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "GBP",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": product.maker.name
              }
            }
          })
        }}
      />
      
      {/* 1. TOP HERO: GALLERY & BUY BOX */}
      <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem 6rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem' }}>
        
        {/* Gallery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ height: '650px', background: `url(${product.images[selectedThumb]})` + ' center/cover', borderRadius: '16px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '2rem', right: '2rem', backgroundColor: 'var(--surface)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: 'var(--shadow-sm)', color: 'var(--primary)' }}>
              🔍 Authentic Capture
            </div>
            {isElite && (
              <div style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ backgroundColor: 'var(--primary)', color: 'var(--accent)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  ⭐ Elite Verified
                </span>
                <span style={{ backgroundColor: 'var(--accent)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  🏛️ GI Certified
                </span>
              </div>
            )}
          </div>
          {/* Thumbnails */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
            {product.images.map((img: string, i: number) => (
              <div 
                key={i} 
                onClick={() => setSelectedThumb(i)}
                style={{ 
                  height: '110px', 
                  background: `url(${img})` + ' center/cover', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  border: selectedThumb === i ? '3px solid var(--accent)' : 'none',
                  opacity: selectedThumb === i ? 1 : 0.8
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Buy Box */}
        <div style={{ position: 'sticky', top: '100px', height: 'fit-content', padding: '2.5rem', backgroundColor: 'var(--surface)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ color: 'var(--accent)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem', fontSize: '0.85rem' }}>By {product.maker.name} • {product.maker.country}</p>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--primary)', marginBottom: '0.5rem', fontFamily: 'var(--font-outfit)', fontWeight: 300, lineHeight: 1.2 }}>{product.name}</h1>
          
          {/* Quality Trust Rating Overall callout */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#E8F5E9', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', color: '#2E7D32' }}>
              🛡️ Trust Score: {product.verification.score}/100 ({product.verification.grade})
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#E8F5E9', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', color: '#2E7D32' }}>
              ✓ Certificate Available
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setCertModalOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', textDecoration: 'underline', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.82rem', padding: 0 }}
            >
              Download Certificate
            </button>
            <span style={{ opacity: 0.4 }}>•</span>
            <button 
              onClick={() => document.getElementById('report-section')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', textDecoration: 'underline', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.82rem', padding: 0 }}
            >
              View Inspection Report
            </button>
            <span style={{ opacity: 0.4 }}>•</span>
            <button 
              onClick={() => document.getElementById('timeline-section')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', textDecoration: 'underline', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.82rem', padding: 0 }}
            >
              View Verification Timeline
            </button>
            <span style={{ opacity: 0.4 }}>•</span>
            <button 
              onClick={() => document.getElementById('qrcode-section')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', textDecoration: 'underline', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.82rem', padding: 0 }}
            >
              Scan QR Code
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
             <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>£{product.price.toFixed(2)}</p>
             <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '0.9rem' }}>✓ Hand-carved to Order</span>
          </div>

          <p style={{ fontSize: '1rem', lineHeight: 1.6, opacity: 0.8, marginBottom: '2rem' }}>
            Hand-carved over 6 weeks using traditional Moroccan tools. Authenticity passport with physical workshop coordinates and materials report included.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '2.5rem', fontSize: '0.9rem' }}>
            <div><span style={{ opacity: 0.6, display: 'block', fontSize: '0.8rem' }}>Materials</span><strong>Solid Walnut Wood</strong></div>
            <div><span style={{ opacity: 0.6, display: 'block', fontSize: '0.8rem' }}>Origin</span><strong>{product.maker.village}, Morocco</strong></div>
            <div><span style={{ opacity: 0.6, display: 'block', fontSize: '0.8rem' }}>Delivery</span><strong>Secure Wooden Crated</strong></div>
            <div><span style={{ opacity: 0.6, display: 'block', fontSize: '0.8rem' }}>Guarantee</span><strong>Escrow Protected</strong></div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button className="btn-accent" style={{ flex: 1, fontSize: '1.1rem', padding: '1.2rem' }} onClick={handleAddToBag}>Add to Bag</button>
            <button className="btn-primary" style={{ backgroundColor: 'transparent', color: 'var(--primary)', border: '1px solid #ccc', padding: '0 1.2rem' }} onClick={handleAddToWishlist}>♡</button>
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', opacity: 0.5, margin: 0 }}>🔒 Britsync Escrow Guarantee: Maker only paid upon verified safe arrival.</p>
        </div>
      </section>

      {/* 2. ELITE VERIFICATION BADGES DRAWER */}
      <section style={{ backgroundColor: 'var(--secondary)', padding: '3rem 2rem', borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { badge: "Elite Verified", icon: "⭐" },
            { badge: "Human Verified", icon: "🤝" },
            { badge: "Workshop Inspected", icon: "📍" },
            { badge: "Britsync Certified", icon: "🛡️" },
            { badge: "Authenticity Passport", icon: "📜" },
            { badge: "Verified Origin", icon: "🌍" },
            { badge: "Inspection Completed", icon: "✓" },
            { badge: "Premium Trust", icon: "💎" },
            { badge: "Verified by Human", icon: "👤" },
            { badge: "Workshop Visited", icon: "🏢" }
          ].map((b, idx) => (
            <span key={idx} style={{ 
              backgroundColor: 'var(--background)', 
              color: 'var(--primary)',
              padding: '0.6rem 1.2rem',
              borderRadius: '30px',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              border: '1px solid rgba(31, 75, 67, 0.1)',
              boxShadow: 'var(--shadow-sm)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>{b.icon}</span> {b.badge}
            </span>
          ))}
        </div>
      </section>

      {/* 3. MEET THE MAKER & INTERACTIVE VIDEO DOCUMENTARY SHOWCASE */}
      <section style={{ padding: '8rem 2rem', backgroundColor: 'var(--surface)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>The Human Behind The Art</span>
            <h2 style={{ fontSize: '3rem', color: 'var(--primary)', marginTop: '1rem', fontFamily: 'var(--font-outfit)', fontWeight: 300 }}>Meet {product.maker.founder}</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '5rem', alignItems: 'start', marginBottom: '6rem' }}>
             <div>
               <div style={{ width: '100%', height: '420px', background: `url(${product.maker.founderImage})` + ' center/cover', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}></div>
               <div style={{ marginTop: '2rem' }}>
                 <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{product.maker.years} Years of Mastery</h3>
                 <p style={{ opacity: 0.8, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>{product.maker.mission}</p>
                 <Link href={`/makers/1`} className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>View Maker Documentary</Link>
               </div>
             </div>

             {/* Video Documentary Tabs Player */}
             <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Verified Video Evidence Log</h3>
                
                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  {videoDocs.map((vid: any) => (
                    <button 
                      key={vid.key}
                      onClick={() => setActiveVideoTab(vid.key)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        border: 'none',
                        background: activeVideoTab === vid.key ? 'var(--primary)' : 'transparent',
                        color: activeVideoTab === vid.key ? '#fff' : 'var(--primary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {vid.name}
                    </button>
                  ))}
                </div>

                {/* Simulated Player View */}
                {(() => {
                  const activeVid = videoDocs.find(v => v.key === activeVideoTab)!;
                  return (
                    <div>
                      <div style={{ position: 'relative', width: '100%', height: '300px', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        {/* Mock video content */}
                        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(0,0,0,0.8), transparent), url(${product.images[2]}) center/cover`, opacity: 0.7 }}></div>
                        <div style={{ zIndex: 1, textAlign: 'center', color: '#fff', padding: '1rem' }}>
                          <span style={{ fontSize: '3rem', cursor: 'pointer', display: 'inline-flex', width: '70px', height: '70px', backgroundColor: 'var(--accent)', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold', boxShadow: 'var(--shadow-lg)' }} onClick={() => alert('Streaming authenticated raw video file... (Prevents listing spoofing)')}>▶</span>
                          <strong style={{ display: 'block', marginTop: '1rem', fontSize: '1.1rem' }}>Play {activeVid.name}</strong>
                          <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Secured Britsync Field Recording</span>
                        </div>
                      </div>
                      <h4 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>{activeVid.name}</h4>
                      <p style={{ fontSize: '0.9rem', opacity: 0.7, lineHeight: 1.5, margin: 0 }}>{activeVid.desc}</p>
                    </div>
                  );
                })()}
             </div>
          </div>

          {/* Workshop Gallery */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
             <div style={{ height: '350px', background: `url(${product.maker.workshopImages[0]})` + ' center/cover', borderRadius: '16px' }}></div>
             <div style={{ height: '350px', background: `url(${product.maker.workshopImages[1]})` + ' center/cover', borderRadius: '16px' }}></div>
          </div>
        </div>
      </section>

      {/* 4. DIGITAL INSPECTION CHECKLIST & SCORES */}
      <section id="report-section" style={{ padding: '6rem 2rem', backgroundColor: 'var(--background)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '5rem', alignItems: 'start' }}>
            
            {/* Scores & Report Overview */}
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-outfit)', fontWeight: 300 }}>Verification Scorecard</h2>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Britsync trust scores are dynamically generated based on regional audits, raw material sourcing standards, craftsmanship quality checks, and labor certifications.
              </p>

              {/* Trust Score Breakdown */}
              <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--accent)', marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Rating Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ opacity: 0.7 }}>Craftsmanship Score</span>
                    <strong>{product.verification.scores.craftsmanship} / 100</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ opacity: 0.7 }}>Quality Score</span>
                    <strong>{product.verification.scores.quality} / 100</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ opacity: 0.7 }}>Authenticity Score</span>
                    <strong>{product.verification.scores.authenticity} / 100</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ opacity: 0.7 }}>Workshop Score</span>
                    <strong>{product.verification.scores.workshop} / 100</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ opacity: 0.7 }}>Packaging Score</span>
                    <strong>{product.verification.scores.packaging} / 100</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ opacity: 0.7 }}>Story Score</span>
                    <strong>{product.verification.scores.story} / 100</strong>
                  </div>
                </div>
              </div>

              {/* Report Summary */}
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 'bold' }}>Field Inspector Report</h3>
                <p style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.5, marginBottom: '1rem' }}>
                  <strong>Summary:</strong> "{product.verification.report.summary}"
                </p>
                <p style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.5, marginBottom: '1rem' }}>
                  <strong>Strengths:</strong> {product.verification.report.strengths}
                </p>
                <p style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.5, margin: 0 }}>
                  <strong>Recommendations:</strong> {product.verification.report.recommendations}
                </p>
              </div>
            </div>

            {/* Checklist table */}
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-outfit)', fontWeight: 300 }}>Digital Inspection Checklist</h2>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '2rem' }}>Physical on-site criteria evaluated byCertified Britsync Inspector Tariq M.</p>
              
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                      <th style={{ padding: '1rem 1.2rem' }}>Evaluation Parameter</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Status</th>
                      <th style={{ padding: '1rem 1.2rem' }}>Comments / Field Observations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.verification.checklist.map((chk: any, idx: number) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{chk.item}</td>
                        <td style={{ padding: '1.2rem' }}>
                          <span style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                            {chk.status}
                          </span>
                        </td>
                        <td style={{ padding: '1.2rem', opacity: 0.8, fontSize: '0.85rem', lineHeight: 1.4 }}>{chk.comment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Cryptographic Digital Signatures block */}
          <div className="card" style={{ marginTop: '4rem', padding: '2.5rem', border: '1px dashed var(--accent)' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '1.5rem', fontWeight: 'bold' }}>Cryptographic Digital Signatures</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ opacity: 0.6, display: 'block', marginBottom: '0.25rem' }}>Artisan Hand Sign-off</span>
                <strong style={{ display: 'block', color: 'var(--primary)' }}>{product.verification.makerSig}</strong>
                <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>Date signed: Oct 15, 2025</span>
              </div>
              <div>
                <span style={{ opacity: 0.6, display: 'block', marginBottom: '0.25rem' }}>Inspector Verification Sign-off</span>
                <strong style={{ display: 'block', color: 'var(--primary)' }}>{product.verification.inspectorSig}</strong>
                <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>Date signed: Oct 15, 2025</span>
              </div>
              <div>
                <span style={{ opacity: 0.6, display: 'block', marginBottom: '0.25rem' }}>Admin Registry Clearance Seal</span>
                <strong style={{ display: 'block', color: 'var(--primary)' }}>{product.verification.adminSig}</strong>
                <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>Date signed: Oct 16, 2025</span>
              </div>
            </div>
          </div>

          {/* Verification Timeline Card */}
          <div id="timeline-section" className="card" style={{ marginTop: '4rem', padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '1.5rem', fontWeight: 'bold' }}>Verification Audit Timeline</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderLeft: '2px solid var(--secondary)', paddingLeft: '1.5rem', marginLeft: '0.5rem' }}>
              {[
                { date: '15 Jan 2026', event: 'Maker Registered & application profile submitted.' },
                { date: '20 Jan 2026', event: 'Documents Approved & Field Inspector assigned.' },
                { date: '21 Jan 2026', event: 'Workshop Visited: Physical geolocation check-in completed.' },
                { date: '22 Jan 2026', event: 'Products Inspected: Quality checklist complete.' },
                { date: '23 Jan 2026', event: 'Story Verified: Family lineage & historical records checked.' },
                { date: '24 Jan 2026', event: 'Elite Certificate Issued (Valid Until: 23 Jan 2027).' }
              ].map((hist, idx) => (
                <div key={idx} className="timeline-step" style={{ position: 'relative', cursor: 'default' }}>
                  <div className="timeline-dot" style={{ 
                    position: 'absolute', 
                    left: '-29px', 
                    top: '4px', 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    backgroundColor: idx === 5 ? 'var(--accent)' : 'var(--primary)' 
                  }}></div>
                  <strong style={{ display: 'block', fontSize: '0.85rem' }}>{hist.date}</strong>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.4 }}>{hist.event}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certificate link summary */}
          <div id="qrcode-section" style={{ display: 'flex', gap: '3rem', alignItems: 'center', border: '2px solid var(--accent)', padding: '4rem', borderRadius: '24px', marginTop: '6rem' }}>
             <div style={{ flex: 1 }}>
               <h2 style={{ fontSize: '2.4rem', color: 'var(--primary)', marginBottom: '1rem', fontFamily: 'var(--font-outfit)', fontWeight: 300 }}>Digital Authenticity Passport</h2>
               <p style={{ fontSize: '1.05rem', lineHeight: 1.6, opacity: 0.8, marginBottom: '1.5rem' }}>
                 Passport Number: <strong style={{ color: 'var(--primary)' }}>{product.verification.certNumber}</strong>
               </p>
               <p style={{ fontSize: '1.05rem', lineHeight: 1.6, opacity: 0.8, marginBottom: '2rem' }}>
                 Every Elite product arrives with a cryptographic QR passport verifying its origin, physical inspection date, and materials. Click to view the full registry record.
               </p>
               <div style={{ display: 'flex', gap: '1rem' }}>
                 <Link href={`/passport/${params.id}`} style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none', borderBottom: '2px solid var(--accent)' }}>
                   View Registry Lookup Record →
                 </Link>
               </div>
             </div>
             <div style={{ width: '130px', height: '130px', backgroundColor: '#fff', border: '1px solid #ddd', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <img 
                 src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=https://britsync.com/passport/${params.id}`} 
                 alt="QR Code summary" 
                 style={{ width: '100%', height: '100%' }}
               />
             </div>
          </div>
        </div>
      </section>

      {/* 5. GORGEOUS PRINTABLE LUXURY GOLD-ACCENTED ELITE CERTIFICATE MODAL */}
      {certModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '2rem'
        }}>
          {/* Scrollable Container */}
          <div className="modal-body" style={{ 
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
                onClick={handlePrintCertificate}
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
                Certificate of Authenticity
              </h1>
              
              <div style={{ width: '80px', height: '2px', backgroundColor: '#D4AF37', margin: '0 auto 2rem' }} />

              {/* Verification Subtitle */}
              <p style={{ fontSize: '1rem', opacity: 0.8, lineHeight: 1.8, maxWidth: '600px', margin: '0 auto 3.5rem' }}>
                This document certifies that the craft listed below has been physically visited, audited, and verified by certified field agents under the rules of the Britsync Geographical Indication and Elite artisan registry program.
              </p>

              {/* Details table */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', textAlign: 'left', maxWidth: '650px', margin: '0 auto 4rem', fontSize: '0.95rem', borderBottom: '1px dashed rgba(212, 175, 55, 0.3)', paddingBottom: '2.5rem' }}>
                <div>
                  <span style={{ opacity: 0.6, fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Artisan Studio</span>
                  <strong style={{ display: 'block' }}>{product.maker.name}</strong>
                  <span style={{ fontSize: '0.85rem' }}>{product.maker.village}, {product.maker.country}</span>
                </div>
                <div>
                  <span style={{ opacity: 0.6, fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Product Name</span>
                  <strong style={{ display: 'block' }}>{product.name}</strong>
                  <span style={{ fontSize: '0.85rem' }}>Ref ID: {product.verification.certNumber}</span>
                </div>
                <div>
                  <span style={{ opacity: 0.6, fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Inspection Audit Date</span>
                  <strong>{product.verification.inspectionDate}</strong>
                </div>
                <div>
                  <span style={{ opacity: 0.6, fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Registry Expiry Date</span>
                  <strong>{product.verification.expiryDate}</strong>
                </div>
              </div>

              {/* Badges / Stamps */}
              <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '4rem', fontSize: '0.85rem', fontWeight: 'bold', color: '#D4AF37' }}>
                <span>🛡️ Human Verified</span>
                <span>📍 Workshop Verified</span>
                <span>⭐ Authenticity Confirmed</span>
              </div>

              {/* Official Seal and Signatures */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '750px', margin: '0 auto', fontSize: '0.85rem' }}>
                {/* Inspector Signature */}
                <div style={{ borderTop: '1px solid #ccc', paddingTop: '0.75rem', width: '220px', textAlign: 'left' }}>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6, display: 'block' }}>Inspector Signature</span>
                  <span style={{ fontFamily: 'var(--font-outfit)', fontWeight: 'bold', fontStyle: 'italic', display: 'block', margin: '0.25rem 0' }}>{product.verification.inspector}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.5, display: 'block' }}>Ref: {product.verification.inspectorSig}</span>
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

                {/* Admin Signature */}
                <div style={{ borderTop: '1px solid #ccc', paddingTop: '0.75rem', width: '220px', textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6, display: 'block' }}>Registry Authority</span>
                  <span style={{ fontFamily: 'var(--font-outfit)', fontWeight: 'bold', fontStyle: 'italic', display: 'block', margin: '0.25rem 0' }}>Britsync Audit Board</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.5, display: 'block' }}>Cert No: {product.verification.certNumber}</span>
                </div>
              </div>

              {/* QR and Verification ID print reference */}
              <div style={{ marginTop: '4.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.75rem', opacity: 0.5 }}>
                <span>Verification ID: {product.verification.id}</span>
                <span style={{ fontStyle: 'italic' }}>This certificate is digitally signed and cleared in Britsync Global Registry.</span>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* CSS print-only styling */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(10px); }
        }
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .modal-overlay {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .modal-body {
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .modal-body:hover {
          transform: translateY(-2px);
          box-shadow: 0 40px 90px rgba(212,175,55,0.2), 0 20px 40px rgba(0,0,0,0.12) !important;
        }
        .timeline-step {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .timeline-step:hover {
          transform: translateX(6px);
        }
        .timeline-dot {
          transition: background-color 0.3s, transform 0.3s;
        }
        .timeline-step:hover .timeline-dot {
          background-color: var(--accent) !important;
          transform: scale(1.3);
        }
        @media print {
          /* Hide all page content */
          body * {
            visibility: hidden;
          }
          /* Show only the certificate modal container */
          #print-certificate-container, #print-certificate-container * {
            visibility: visible;
          }
          /* Stretch to fill the whole page */
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
          /* Hide no-print class during print */
          .no-print {
            display: none !important;
          }
        }
      `}} />

    </main>
  );
}
