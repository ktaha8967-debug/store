import Link from 'next/link';
import ImageSlider from '@/components/ImageSlider';
import HeroBackground from '@/components/HeroBackground';
import { calculateSellingPrice } from '@/lib/pricing';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const dbProducts = await prisma.product.findMany({
    include: {
      maker: true,
    },
    take: 30
  });

  const mappedProducts = dbProducts.map(p => {
    let imagesList = [];
    try {
      imagesList = JSON.parse(p.images);
    } catch (e) {
      imagesList = ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800'];
    }
    return {
      id: p.id,
      name: p.name,
      maker: p.maker.businessName,
      price: calculateSellingPrice(p.price),
      image: imagesList[0] || 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800',
      badge: p.verificationStatus === 'GI' ? 'GI Certified' : p.verificationStatus === 'ELITE' ? 'Elite Verified' : 'Approved Maker',
      verificationStatus: p.verificationStatus
    };
  });

  const eliteProducts = mappedProducts.filter(p => p.verificationStatus === 'ELITE' || p.verificationStatus === 'GI').slice(0, 4);
  const generalProducts = mappedProducts.filter(p => p.verificationStatus === 'GENERAL').slice(0, 4);

  return (
    <main className="animate-fade-in" style={{ backgroundColor: 'var(--background)' }}>
      
      {/* 1. HERO SECTION */}
      <section className="hero-section" style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <HeroBackground />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#FAF9F6', maxWidth: '800px', padding: '2rem' }}>
          <h1 style={{ fontSize: '5rem', fontFamily: 'var(--font-outfit)', letterSpacing: '2px', marginBottom: '1.5rem', lineHeight: 1.1 }}>Authentic Global Commerce</h1>
          <p style={{ fontSize: '1.4rem', opacity: 0.9, marginBottom: '3rem', lineHeight: 1.6 }}>We don't just list products. We verify humanity. Connect with elite artisans from developing countries through a managed, story-driven ecosystem.</p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <Link href="/search?tier=elite" className="btn-accent" style={{ fontSize: '1.1rem', padding: '1.2rem 2.5rem' }}>Shop Elite Products</Link>
            <Link href="/stories" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1.2rem 2.5rem', backgroundColor: 'transparent', border: '2px solid #FAF9F6', color: '#FAF9F6' }}>Read Maker Stories</Link>
          </div>
        </div>
      </section>
      {/* NEW: STORE VISUALS CAROUSEL */}
      <section style={{ padding: '6rem 2rem', backgroundColor: 'var(--background)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Experience Our Store</span>
          <h2 style={{ fontSize: '3rem', color: 'var(--primary)', marginTop: '1rem', marginBottom: '3rem' }}>Immersive Shopping</h2>
          <ImageSlider />
        </div>
      </section>

      {/* 2. HOW BRITSYNC WORKS (TIMELINE) */}
      <section style={{ padding: '8rem 2rem', backgroundColor: 'var(--surface)' }}>
         <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
           <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>The Process</span>
           <h2 style={{ fontSize: '3rem', color: 'var(--primary)', marginTop: '1rem', marginBottom: '4rem' }}>How Britsync Works</h2>
           
           <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', flexWrap: 'wrap' }}>
             {/* Line behind steps */}
             <div style={{ position: 'absolute', top: '40px', left: '5%', right: '5%', height: '3px', backgroundColor: 'var(--accent)', opacity: 0.3, zIndex: 0, display: 'none' }} className="timeline-line"></div>
             
             {[
               { step: 1, title: 'Maker Applies', desc: 'Artisans submit their craft.' },
               { step: 2, title: 'Britsync Reviews', desc: 'Our team evaluates quality.' },
               { step: 3, title: 'Verification', desc: 'Physical inspection for Elite.' },
               { step: 4, title: 'Products Published', desc: 'We build the premium listing.' },
               { step: 5, title: 'Global Purchase', desc: 'You buy direct with trust.' },
             ].map(s => (
                <div key={s.step} style={{ flex: '1 1 180px', padding: '1rem', position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--primary)', color: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 1.5rem', border: '4px solid var(--surface)' }}>
                    {s.step}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{s.title}</h3>
                  <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>{s.desc}</p>
                </div>
             ))}
           </div>
         </div>
      </section>

      {/* 3. ELITE VERIFIED PRODUCTS */}
      <section style={{ padding: '8rem 2rem', backgroundColor: 'var(--background)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
            <div>
              <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Physically Inspected</span>
              <h2 style={{ fontSize: '3rem', color: 'var(--primary)', marginTop: '1rem' }}>Elite Products</h2>
            </div>
            <Link href="/search?tier=elite" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none', borderBottom: '2px solid var(--accent)' }}>View All Elite →</Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '3rem' }}>
            {eliteProducts.map(product => (
              <Link href={`/products/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ height: '350px', background: `url(${product.image})` + ' center/cover', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: 'var(--primary)', color: 'var(--accent)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: 'var(--shadow-sm)' }}>
                      ⭐ {product.badge}
                    </div>
                  </div>
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>{product.name}</h3>
                    <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>By {product.maker}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <p style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>£{calculateSellingPrice(product.price).toFixed(2)}</p>
                      <span className="btn-accent" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '8px' }}>View Detail</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: FEATURED COUNTRIES SECTION */}
      <section style={{ padding: '8rem 2rem', backgroundColor: 'var(--surface)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Artisan Communities</span>
            <h2 style={{ fontSize: '3rem', color: 'var(--primary)', marginTop: '1rem', marginBottom: '1.5rem' }}>Featured Regions & Countries</h2>
            <p style={{ opacity: 0.7, maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
              Explore certified crafts from regions defined by centuries of cultural history and traditional production.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { name: 'Pakistan', flag: '🇵🇰', image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e' },
              { name: 'Bangladesh', flag: '🇧🇩', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f' },
              { name: 'India', flag: '🇮🇳', image: 'https://images.unsplash.com/photo-1584852957448-f58c70a2cb93' },
              { name: 'Turkey', flag: '🇹🇷', image: 'https://images.unsplash.com/photo-1570114668478-439564cbacda' },
              { name: 'Morocco', flag: '🇲🇦', image: 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7' },
              { name: 'Kenya', flag: '🇰🇪', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338' },
              { name: 'Indonesia', flag: '🇮🇩', image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c' },
              { name: 'Vietnam', flag: '🇻🇳', image: 'https://images.unsplash.com/photo-1601662528567-526cd06f6582' }
            ].map(c => (
              <Link href={`/search?country=${c.name}`} key={c.name} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', height: '240px', position: 'relative', borderRadius: '12px' }}>
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 100%), url(${c.image}) center/cover` }} />
                  <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', zIndex: 1, color: '#fff' }}>
                    <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>{c.flag}</span>
                    <h3 style={{ fontSize: '1.5rem', margin: 0, fontWeight: '400', fontFamily: 'var(--font-outfit)' }}>{c.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BUYER TRUST SECTION */}
      <section style={{ padding: '6rem 2rem', backgroundColor: 'var(--primary)', color: 'var(--background)' }}>
         <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', textAlign: 'center' }}>
            <div>
               <h3 style={{ fontSize: '4rem', color: 'var(--accent)', marginBottom: '1rem' }}>100%</h3>
               <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Human Verified</p>
               <p style={{ opacity: 0.8 }}>Every Elite maker is physically inspected by our global agents.</p>
            </div>
            <div>
               <h3 style={{ fontSize: '4rem', color: 'var(--accent)', marginBottom: '1rem' }}>🔒</h3>
               <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Secure Payments</p>
               <p style={{ opacity: 0.8 }}>Escrow-backed transactions protect you until delivery.</p>
            </div>
            <div>
               <h3 style={{ fontSize: '4rem', color: 'var(--accent)', marginBottom: '1rem' }}>📜</h3>
               <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Digital Passport</p>
               <p style={{ opacity: 0.8 }}>Cryptographic proof of origin and authenticity for every item.</p>
            </div>
         </div>
      </section>

      {/* NEW: ELITE VS GENERAL EXPLANATION */}
      <section style={{ padding: '8rem 2rem', backgroundColor: 'var(--background)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Understanding Quality</span>
            <h2 style={{ fontSize: '3rem', color: 'var(--primary)', marginTop: '1rem', marginBottom: '1.5rem' }}>General vs Elite Verified</h2>
            <p style={{ opacity: 0.7, maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
              Britsync supports two product classes. Every craft is authenticated, but Elite tier products undergo comprehensive physical audits.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
            <div className="card" style={{ padding: '3rem', borderTop: '4px solid #ccc' }}>
              <span style={{ backgroundColor: '#ECEFF1', color: '#455A64', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>Approved General Maker</span>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginTop: '1.5rem', marginBottom: '1rem' }}>General Products</h3>
              <p style={{ opacity: 0.8, lineHeight: 1.6, marginBottom: '2.5rem' }}>
                Digitally validated maker identity, approved listing materials catalog, and standard quality checks. Perfect for everyday luxury.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div>✓ Britsync Approved Studio</div>
                <div>✓ Standard Quality Checks</div>
                <div>✓ Digitally Verified Identity</div>
                <div>✓ Competitive Value Price</div>
              </div>
            </div>

            <div className="card" style={{ padding: '3rem', borderTop: '4px solid var(--accent)', boxShadow: 'var(--shadow-md)' }}>
              <span style={{ backgroundColor: '#FFF3E0', color: '#E65100', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>⭐ Elite Inspected Studio</span>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginTop: '1.5rem', marginBottom: '1rem' }}>Elite Products</h3>
              <p style={{ opacity: 0.8, lineHeight: 1.6, marginBottom: '2.5rem' }}>
                On-site physical inspection by local agents, GPS geofence coordinate tracking, professional studio media, and premium custom packaging.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div>⭐ Physical geofenced GPS audits</div>
                <div>⭐ 15 verified high-resolution photos</div>
                <div>⭐ Generational craft timeline verified</div>
                <div>⭐ Insured premium crated packaging</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MEET THE MAKERS & STORIES */}
      <section style={{ padding: '8rem 2rem', backgroundColor: 'var(--surface)' }}>
         <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Documentaries</span>
              <h2 style={{ fontSize: '3rem', color: 'var(--primary)', marginTop: '1rem' }}>Meet The Makers</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem', alignItems: 'center' }}>
               <div style={{ height: '600px', background: 'url(https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=1200) center/cover', borderRadius: '16px' }}></div>
               <div>
                  <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>"We weave our history into every thread."</h3>
                  <p style={{ fontSize: '1.1rem', lineHeight: 1.8, opacity: 0.8, marginBottom: '2rem' }}>
                    Follow the incredible journey of Fatima, a third-generation weaver in rural Morocco. Despite facing economic hardship, she expanded her workshop to employ 20 local women, keeping ancient techniques alive.
                  </p>
                  <Link href="/stories" className="btn-primary" style={{ padding: '1rem 2rem' }}>Read Full Documentary</Link>
               </div>
            </div>
         </div>
      </section>

      {/* 6. GENERAL PRODUCTS */}
      <section style={{ padding: '8rem 2rem', backgroundColor: 'var(--background)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
            <div>
              <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Digitally Approved</span>
              <h2 style={{ fontSize: '3rem', color: 'var(--primary)', marginTop: '1rem' }}>General Products</h2>
            </div>
            <Link href="/search?tier=general" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none', borderBottom: '2px solid var(--accent)' }}>View All General →</Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '3rem' }}>
            {generalProducts.map(product => (
              <Link href={`/products/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ height: '300px', background: `url(${product.image})` + ' center/cover', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: 'var(--surface)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: 'var(--shadow-sm)' }}>
                      ✓ {product.badge}
                    </div>
                  </div>
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>{product.name}</h3>
                    <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>By {product.maker}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <p style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>£{calculateSellingPrice(product.price).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. GI PRODUCTS PROMO */}
      <section style={{ padding: '8rem 2rem', backgroundColor: 'var(--surface)' }}>
         <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
               <h2 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Geographical Indication (GI)</h2>
               <p style={{ fontSize: '1.1rem', lineHeight: 1.8, opacity: 0.8, marginBottom: '2rem' }}>
                 Discover products whose quality, reputation, and characteristics are intrinsically tied to their specific geographical origin. Official GI certification ensures you are buying a piece of true cultural heritage.
               </p>
               <Link href="/gi-certified" className="btn-accent" style={{ padding: '1rem 2rem' }}>Explore GI Collections</Link>
            </div>
            <div style={{ height: '500px', background: 'url(https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80&w=1200) center/cover', borderRadius: '16px' }}></div>
         </div>
      </section>

      {/* NEW: CUSTOMER TESTIMONIALS SECTION */}
      <section style={{ padding: '8rem 2rem', backgroundColor: 'var(--background)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Verified Experiences</span>
            <h2 style={{ fontSize: '3rem', color: 'var(--primary)', marginTop: '1rem', marginBottom: '1.5rem' }}>Customer Testimonials</h2>
            <p style={{ opacity: 0.7, maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
              Read reviews from global buyers who have purchased legacy products through our trust-backed escrow platform.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {[
              { text: "The Hand-Block Printed Ajrak Shawl is a masterpiece. The packaging arrived in a secure, insulated crate. Knowing the physical coordinates of Aisha's workshop and seeing the inspector's signatures on my digital passport made the experience incredibly special.", author: "Jane B. from London", rating: "⭐⭐⭐⭐⭐" },
              { text: "Bursa Ceramics Iznik Ceramic Bowl arrived safely in Munich yesterday. Truly outstanding glazes and colors. The digital authenticity certificate gives me complete trust that this is genuine, handmade work, not a souvenir replica.", author: "Hans M. from Munich", rating: "⭐⭐⭐⭐⭐" },
              { text: "I bought an alpaca throw for my home in Paris. Knowing the exact weaver cooperative in Peru and seeing the impact metrics—direct school fund support for the children of the weavers—made this purchase deeply emotional.", author: "Camille L. from Paris", rating: "⭐⭐⭐⭐⭐" }
            ].map((t, idx) => (
              <div key={idx} className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ fontStyle: 'italic', opacity: 0.8, lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '1.5rem' }}>"{t.text}"</p>
                <div>
                  <div style={{ color: 'var(--accent)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{t.rating}</div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>{t.author}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. BECOME A MAKER / NEWSLETTER */}
      <section style={{ padding: '6rem 2rem', backgroundColor: 'var(--primary)', color: 'var(--background)', textAlign: 'center' }}>
         <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '1.5rem' }}>Are you an artisan?</h2>
            <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '3rem' }}>Join our managed ecosystem. You focus on crafting; we handle technology, marketing, and global fulfillment.</p>
            <Link href="/become-a-maker" className="btn-accent" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>Apply as a Maker</Link>
            
            <div style={{ marginTop: '6rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4rem' }}>
               <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Join the Journey</h3>
               <p style={{ opacity: 0.8, marginBottom: '2rem' }}>Subscribe for stories of heritage, craft, and new elite drops.</p>
               <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', maxWidth: '500px', margin: '0 auto' }}>
                  <input type="email" placeholder="Email Address" style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: 'none' }} />
                  <button className="btn-accent" style={{ padding: '0 2rem' }}>Subscribe</button>
               </div>
            </div>
         </div>
      </section>
      
    </main>
  );
}
