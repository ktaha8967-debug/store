'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const pathname = usePathname();

  const updateCounts = () => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('britsync_cart');
        const cartItems = savedCart ? JSON.parse(savedCart) : [];
        setCartCount(cartItems.reduce((acc: number, item: any) => acc + (item.qty || 1), 0));
      } catch (e) {
        setCartCount(0);
      }

      try {
        const savedWishlist = localStorage.getItem('britsync_wishlist');
        const wishlistItems = savedWishlist ? JSON.parse(savedWishlist) : [];
        setWishlistCount(wishlistItems.length);
      } catch (e) {
        setWishlistCount(0);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount

    updateCounts();
    window.addEventListener('cartUpdate', updateCounts);
    window.addEventListener('wishlistUpdate', updateCounts);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cartUpdate', updateCounts);
      window.removeEventListener('wishlistUpdate', updateCounts);
    };
  }, []);

  // Determine if we should start transparent (only on homepage)
  const isHomepage = pathname === '/';
  const shouldBeSolid = scrolled || !isHomepage;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/collections' },
    { name: 'Makers', path: '/makers' },
    { name: 'Stories', path: '/stories' },
    { name: 'Countries', path: '/countries' },
    { name: 'About Us', path: '/about' },
    { name: 'Transparency', path: '/how-we-earn' },
  ];

  // SVG Icons
  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
  );
  const WishlistIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
  );
  const CartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
  );
  const ProfileIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
  );

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '1.2rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: shouldBeSolid ? 'rgba(31, 75, 67, 0.95)' : 'transparent',
        backdropFilter: shouldBeSolid ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: shouldBeSolid ? 'blur(10px)' : 'none',
        boxShadow: shouldBeSolid ? 'var(--shadow-sm)' : 'none',
        color: '#FAF9F6' // Always white/light for high contrast against dark green
      }}>
        {/* Logo */}
        <Link href="/" style={{
          color: 'var(--accent)',
          textDecoration: 'none',
          fontSize: '1.5rem',
          fontWeight: '700',
          letterSpacing: '2px',
          fontFamily: 'var(--font-outfit)',
          zIndex: 1001
        }}>
          BRITSYNC
        </Link>

        {/* Desktop Navigation Links */}
        <div className="desktop-nav-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link key={link.name} href={link.path} style={{
                color: 'inherit',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '0.95rem',
                position: 'relative',
                opacity: isActive ? 1 : 0.85,
                transition: 'opacity var(--transition-fast)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = isActive ? '1' : '0.85')}
              >
                {link.name}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: 0,
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'var(--accent)',
                    borderRadius: '2px'
                  }} />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Icons & CTA */}
        <div className="desktop-nav-actions" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/search" style={{ color: 'inherit' }}><SearchIcon /></Link>
          <Link href="/wishlist" style={{ color: 'inherit', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <WishlistIcon />
            {wishlistCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: 'var(--accent)',
                color: 'var(--primary)',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '0.65rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>{wishlistCount}</span>
            )}
          </Link>
          <Link href="/cart" style={{ color: 'inherit', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <CartIcon />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: 'var(--accent)',
                color: 'var(--primary)',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '0.65rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>{cartCount}</span>
            )}
          </Link>
          <Link href="/login" style={{ color: 'inherit' }}><ProfileIcon /></Link>
          <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.3)', margin: '0 0.5rem' }}></div>
          <Link href="/become-a-maker" style={{
            color: 'inherit',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: '600',
            opacity: 0.9
          }}>Become a Maker</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            zIndex: 1001,
            display: 'none' // Hidden by default, shown via CSS media query
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Slide-in Menu Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: 'var(--primary)',
        color: 'var(--background)',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        padding: '6rem 2rem 2rem',
        transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '1.5rem', fontWeight: '500' }}>
          {navLinks.map((link) => (
            <Link key={link.name} href={link.path} onClick={() => setMobileMenuOpen(false)} style={{ color: 'inherit', textDecoration: 'none' }}>
              {link.name}
            </Link>
          ))}
          <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
          <Link href="/search" onClick={() => setMobileMenuOpen(false)} style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}><SearchIcon /> Search</Link>
          <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}><WishlistIcon /> Wishlist</Link>
          <Link href="/cart" onClick={() => setMobileMenuOpen(false)} style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}><CartIcon /> Cart</Link>
          <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
          <Link href="/become-a-maker" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--accent)', textDecoration: 'none' }}>Become a Maker</Link>
          <Link href="/login" onClick={() => setMobileMenuOpen(false)} style={{ color: 'inherit', textDecoration: 'none' }}>Login / My Account</Link>
        </div>
      </div>
      
      {/* Styles for responsive navbar */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 1024px) {
          .desktop-nav-links, .desktop-nav-actions {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}} />
    </>
  );
}
