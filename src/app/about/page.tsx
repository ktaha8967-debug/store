import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="animate-fade-in" style={{ backgroundColor: 'var(--background)', minHeight: '100vh', paddingTop: '8rem', paddingBottom: '6rem' }}>
      
      {/* Hero Section */}
      <section style={{ maxWidth: '1000px', margin: '0 auto 6rem', textAlign: 'center', padding: '0 2rem' }}>
         <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Our Mission</span>
         <h1 style={{ fontSize: '4rem', color: 'var(--primary)', marginTop: '1rem', marginBottom: '2rem' }}>Redefining Global Commerce</h1>
         <p style={{ fontSize: '1.2rem', lineHeight: 1.8, opacity: 0.8 }}>
           Britsync Market is the world's first AI-powered curated marketplace dedicated exclusively to verified artisans, heritage brands, and GI product producers from developing countries. We handle the technology, logistics, and storytelling, allowing artisans to focus purely on their craft.
         </p>
      </section>

      {/* Story Blocks */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }}>
           <div style={{ height: '500px', background: 'url(https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=800) center/cover', borderRadius: '16px' }}></div>
           <div>
             <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>We Verify Humanity</h2>
             <p style={{ fontSize: '1.1rem', lineHeight: 1.8, opacity: 0.8, marginBottom: '2rem' }}>
               In a world of mass production and dropshipping, authenticity is the ultimate luxury. Our on-the-ground field agents physically inspect Elite workshops to ensure fair labor practices, sustainable sourcing, and genuine craftsmanship.
             </p>
             <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><span style={{ color: 'var(--accent)', fontSize: '1.5rem' }}>✓</span> 100% Verified Sellers</li>
               <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><span style={{ color: 'var(--accent)', fontSize: '1.5rem' }}>✓</span> Digital Authenticity Passports</li>
               <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><span style={{ color: 'var(--accent)', fontSize: '1.5rem' }}>✓</span> Escrow-backed Secure Payments</li>
             </ul>
           </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
           <div style={{ order: 2, height: '500px', background: 'url(https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=800) center/cover', borderRadius: '16px' }}></div>
           <div style={{ order: 1 }}>
             <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Empowering Economies</h2>
             <p style={{ fontSize: '1.1rem', lineHeight: 1.8, opacity: 0.8, marginBottom: '2rem' }}>
               Talented entrepreneurs in developing nations often lack the technical knowledge, domains, and global banking infrastructure to export. Britsync acts as their proxy, building premium listings and managing cross-border fulfillment so they can thrive locally while selling globally.
             </p>
             <Link href="/search" className="btn-accent" style={{ display: 'inline-block', padding: '1rem 2rem', marginTop: '1rem' }}>Support the Ecosystem</Link>
           </div>
        </div>
      </section>

    </main>
  );
}
