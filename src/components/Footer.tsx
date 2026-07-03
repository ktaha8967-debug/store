import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--secondary)',
      color: 'var(--primary)',
      padding: '5rem 3rem 2rem',
      marginTop: 'auto',
      borderTop: '1px solid rgba(0,0,0,0.05)'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: '4rem',
        maxWidth: '1200px',
        margin: '0 auto',
        paddingBottom: '4rem',
        borderBottom: '1px solid rgba(31, 75, 67, 0.1)'
      }}>
        <div>
          <h3 style={{ 
            color: 'var(--primary)', 
            marginBottom: '1.5rem', 
            fontSize: '1.8rem',
            fontFamily: 'var(--font-outfit)',
            letterSpacing: '1px',
            fontWeight: 700
          }}>BRITSYNC</h3>
          <p style={{ opacity: 0.8, lineHeight: 1.8, fontSize: '1.1rem', maxWidth: '400px' }}>
            The world's first AI-powered curated marketplace for verified artisans and heritage brands. Exporting authentic stories globally.
          </p>
        </div>
        <div>
          <h4 style={{ marginBottom: '1.5rem', fontWeight: 600, fontSize: '1.2rem' }}>Discover</h4>
          <ul style={{ listStyle: 'none', padding: 0, opacity: 0.8, lineHeight: 2.2 }}>
            <li><Link href="/makers" style={{ color: 'inherit', textDecoration: 'none' }}>Elite Makers</Link></li>
            <li><Link href="/gi-certified" style={{ color: 'inherit', textDecoration: 'none' }}>GI Certified</Link></li>
            <li><Link href="/collections" style={{ color: 'inherit', textDecoration: 'none' }}>Heritage Brands</Link></li>
            <li><Link href="/search" style={{ color: 'inherit', textDecoration: 'none' }}>New Arrivals</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: '1.5rem', fontWeight: 600, fontSize: '1.2rem' }}>Trust</h4>
          <ul style={{ listStyle: 'none', padding: 0, opacity: 0.8, lineHeight: 2.2 }}>
            <li><Link href="/passport/1" style={{ color: 'inherit', textDecoration: 'none' }}>Authenticity Passport</Link></li>
            <li><Link href="/#how-it-works" style={{ color: 'inherit', textDecoration: 'none' }}>Verification Process</Link></li>
            <li><Link href="/search?tier=elite" style={{ color: 'inherit', textDecoration: 'none' }}>Inspection Reports</Link></li>
            <li>
              <Link href="/how-we-earn" style={{ color: 'inherit', textDecoration: 'none' }}>How Britsync Earns</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: '1.5rem', fontWeight: 600, fontSize: '1.2rem' }}>Ecosystem</h4>
          <ul style={{ listStyle: 'none', padding: 0, opacity: 0.8, lineHeight: 2.2 }}>
            <li><Link href="/become-a-maker" style={{ color: 'inherit', textDecoration: 'none' }}>Become a Maker</Link></li>
            <li><Link href="/dashboard/inspector" style={{ color: 'inherit', textDecoration: 'none' }}>Inspector Portal</Link></li>
            <li><Link href="/about" style={{ color: 'inherit', textDecoration: 'none' }}>About Us</Link></li>
            <li><Link href="/about" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</Link></li>
          </ul>
        </div>
      </div>
      <div style={{ 
        textAlign: 'center', 
        marginTop: '2rem', 
        opacity: 0.6, 
        fontSize: '0.95rem',
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '2rem auto 0'
      }}>
        <span>&copy; {new Date().getFullYear()} Britsync Market Ecosystem. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
