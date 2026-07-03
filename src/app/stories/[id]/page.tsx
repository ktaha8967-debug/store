import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function StoryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const story = await prisma.story.findUnique({
    where: { id },
    include: {
      maker: {
        include: {
          products: {
            take: 4
          }
        }
      }
    }
  });

  if (!story) {
    notFound();
  }

  // Fallback: If no related stories exist by country/craft, show other stories
  let relatedStories = await prisma.story.findMany({
    where: {
      id: { not: story.id },
      OR: [
        { country: story.country },
        { craft: story.craft }
      ]
    },
    take: 3,
    include: {
      maker: true
    }
  });

  if (relatedStories.length === 0) {
    relatedStories = await prisma.story.findMany({
      where: {
        id: { not: story.id }
      },
      take: 3,
      include: {
        maker: true
      }
    });
  }

  let photography: string[] = [];
  try { 
    photography = story.photography ? JSON.parse(story.photography) : []; 
  } catch(e) {}
  
  let timeline: { year: string; event: string }[] = [];
  try { 
    timeline = story.timeline ? JSON.parse(story.timeline) : []; 
  } catch(e) {}

  const getVerificationText = (status: string) => {
    switch (status) {
      case 'ELITE': return 'Elite Master';
      case 'GI': return 'GI Certified';
      case 'VERIFIED': return 'Verified Maker';
      default: return 'Verified Artisan';
    }
  };

  return (
    <main className="animate-fade-in" style={{ backgroundColor: 'var(--background)' }}>
      {/* Cinematic Hero */}
      <section style={{
        height: '90vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(to top, rgba(17, 21, 20, 1) 0%, rgba(17, 21, 20, 0.4) 50%, rgba(17, 21, 20, 0.1) 100%), url("${story.heroImage}") center/cover fixed`,
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', width: '100%', padding: '0 2rem', textAlign: 'center' }}>
          <span style={{ 
            display: 'inline-block',
            color: 'var(--accent)', 
            fontWeight: 'bold',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            fontSize: '1rem',
            marginBottom: '1.5rem'
          }}>
            {story.country} • {story.village} • {story.craft}
          </span>
          <h1 style={{ fontSize: '5rem', marginBottom: '1.5rem', lineHeight: 1.1, color: '#fff', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            {story.title}
          </h1>
          <p style={{ fontSize: '1.5rem', opacity: 0.9, color: '#ddd', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
            {story.excerpt}
          </p>
        </div>
      </section>

      {/* Story Content & Timeline */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem' }}>
        <div style={{ display: 'flex', gap: '5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1.8', minWidth: '320px' }}>
            <p style={{ fontSize: '1.3rem', lineHeight: 1.9, color: 'var(--text)', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '4.5rem', float: 'left', lineHeight: 0.8, marginRight: '0.75rem', color: 'var(--accent)', fontFamily: 'var(--font-outfit)' }}>
                {story.content.charAt(0)}
              </span>
              {story.content.substring(1)}
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, opacity: 0.8, marginBottom: '2.5rem' }}>
              The artisans here rely entirely on the ancient knowledge passed down from their ancestors. Working with {story.craft.toLowerCase()} is not just a profession; it is an identity. Every piece created in {story.village} carries the soul of its maker. By choosing these authentic pieces, the world helps to ensure this tradition is not lost to industrialization.
            </p>
            
            <div style={{ marginTop: '5rem', padding: '3rem', backgroundColor: 'var(--surface)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ 
                  width: '90px', 
                  height: '90px', 
                  borderRadius: '50%', 
                  backgroundImage: story.maker.founderPhoto ? `url(${story.maker.founderPhoto})` : 'none', 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center',
                  backgroundColor: 'var(--secondary)' 
                }} />
                <div>
                  <h3 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>Meet {story.maker.founderName || 'the Maker'}</h3>
                  <p style={{ opacity: 0.7, fontSize: '0.95rem' }}>{story.maker.businessName} • {getVerificationText(story.maker.verificationStatus)}</p>
                </div>
              </div>
              <p style={{ fontStyle: 'italic', opacity: 0.9, marginBottom: '2rem', lineHeight: 1.7, fontSize: '1.05rem' }}>
                "{story.maker.founderStory || story.maker.businessStory || story.excerpt}"
              </p>
              <Link href={`/makers/${story.maker.id}`}>
                <button className="btn-primary" style={{ width: '100%' }}>View Maker Profile</button>
              </Link>
            </div>
          </div>
          
          {/* Sidebar: Timeline & Details */}
          <div style={{ flex: '1', minWidth: '280px', backgroundColor: 'var(--surface)', padding: '3rem 2.5rem', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '2.5rem', borderBottom: '2px solid var(--accent)', paddingBottom: '0.5rem', display: 'inline-block' }}>
              The Journey
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {timeline.map((item, i) => (
                <div key={i} style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '2px solid var(--secondary)' }}>
                  <div style={{ 
                    position: 'absolute', 
                    left: '-6px', 
                    top: '4px', 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--accent)',
                    border: '2px solid var(--surface)'
                  }} />
                  <h4 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>{item.year}</h4>
                  <p style={{ opacity: 0.8, fontSize: '0.95rem', lineHeight: 1.6 }}>{item.event}</p>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--glass-border)' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 'bold' }}>
                Community Impact
              </h3>
              <p style={{ opacity: 0.8, lineHeight: 1.7, fontSize: '0.95rem' }}>
                {story.maker.impactStory || 'Providing sustainable income and education support for local families.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Production Gallery */}
      {photography.length > 0 && (
        <section style={{ padding: '0 2rem 8rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.9rem' }}>Documentary Log</span>
              <h2 style={{ fontSize: '2.8rem', color: 'var(--primary)', marginTop: '0.5rem' }}>Behind the Scenes</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {photography.map((img, i) => (
                <div key={i} style={{ height: '450px', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                  <img 
                    src={img} 
                    alt={`Photography ${i + 1}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                    className="hover-zoom" 
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shop Products From This Maker */}
      {story.maker.products && story.maker.products.length > 0 && (
        <section style={{ backgroundColor: 'var(--surface)', padding: '8rem 2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <span style={{ display: 'block', color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px', textAlign: 'center' }}>Featured Crafts</span>
            <h2 style={{ fontSize: '2.8rem', color: 'var(--primary)', marginBottom: '4rem', textAlign: 'center', marginTop: '0.5rem' }}>
              Shop From This Maker
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
              {story.maker.products.map(product => {
                let images: string[] = [];
                try { 
                  images = JSON.parse(product.images); 
                } catch(e) {}
                
                return (
                  <Link href={`/products/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="card product-card" style={{ padding: '0', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ height: '280px', overflow: 'hidden', position: 'relative' }}>
                        {images[0] && (
                          <img 
                            src={images[0]} 
                            alt={product.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                            className="product-img"
                          />
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
                          fontWeight: 'bold'
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
                          £{product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Related Stories */}
      {relatedStories.length > 0 && (
        <section style={{ padding: '8rem 2rem', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Explore More</span>
            <h2 style={{ fontSize: '2.8rem', color: 'var(--primary)', marginBottom: '4rem', marginTop: '0.5rem' }}>
              More Maker Stories
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
              {relatedStories.map(rs => (
                <Link href={`/stories/${rs.id}`} key={rs.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="card related-card" style={{ display: 'flex', gap: '2rem', padding: '1.5rem', alignItems: 'center', height: '100%' }}>
                    <div style={{ 
                      width: '120px', 
                      height: '120px', 
                      borderRadius: '8px', 
                      backgroundImage: `url(${rs.heroImage})`, 
                      backgroundSize: 'cover', 
                      backgroundPosition: 'center',
                      flexShrink: 0 
                    }} />
                    <div>
                      <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                        {rs.country} • {rs.craft}
                      </span>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginTop: '0.25rem', marginBottom: '0.5rem', fontWeight: '400' }}>
                        {rs.title}
                      </h3>
                      <p style={{ opacity: 0.7, fontSize: '0.85rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {rs.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Styles for dynamic interactions */}
      <style dangerouslySetInnerHTML={{__html: `
        .hover-zoom:hover {
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
          transform: scale(1.05);
        }
        .related-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .related-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md) !important;
        }
      `}} />
    </main>
  );
}

