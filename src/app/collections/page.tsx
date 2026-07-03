import Link from 'next/link';

export default function CollectionsPage() {
  const collections = [
    { name: "Ceramics", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800", count: 120 },
    { name: "Textiles", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800", count: 340 },
    { name: "Jewelry", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800", count: 85 },
    { name: "Woodwork", image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=800", count: 42 },
    { name: "Leather", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800", count: 67 },
    { name: "Home Decor", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800", count: 210 },
  ];

  return (
    <main className="animate-fade-in" style={{ backgroundColor: 'var(--background)' }}>
      <section style={{ backgroundColor: 'var(--primary)', color: 'var(--background)', padding: '10rem 2rem 4rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>Curated Collections</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>Explore authentically crafted pieces verified by our global network of experts.</p>
      </section>

      <section style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          {collections.map(col => (
            <Link href={`/search?category=${col.name}`} key={col.name} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: 0, position: 'relative', overflow: 'hidden', height: '350px', display: 'flex', alignItems: 'flex-end' }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: `linear-gradient(to top, rgba(0,0,0,0.8), transparent), url(${col.image}) center/cover`,
                  transition: 'transform 0.5s ease',
                  zIndex: 0
                }} className="collection-img-bg" />
                <div style={{ position: 'relative', zIndex: 1, padding: '2rem', width: '100%' }}>
                  <h2 style={{ color: 'var(--background)', fontSize: '2rem', marginBottom: '0.5rem' }}>{col.name}</h2>
                  <p style={{ color: 'var(--accent)' }}>{col.count} verified products →</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
