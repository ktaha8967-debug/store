"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Types for country detailed stats
interface CountryStats {
  name: string;
  type: 'maker' | 'buyer';
  makers: number;
  eliteMakers: number;
  products: number;
  orders: number;
  revenue: number;
  giProducts: number;
  topCategories: string;
  growthRate: number;
  coordinates: { x: number; y: number };
}

// Types for impact map pins
interface MapPin {
  id: string;
  name: string;
  type: 'village' | 'workshop' | 'elite' | 'inspection' | 'project';
  country: string;
  description: string;
  coordinates: { x: number; y: number };
}

export default function CEODashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'expansion' | 'exports' | 'impact' | 'impact_map' | 'sustainability' | 'insights' | 'performance' | 'marketing' | 'reports' | 'investor' | 'readiness'>('dashboard');
  const [animationFactor, setAnimationFactor] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<string>('India');
  const [selectedPin, setSelectedPin] = useState<string>('proj-1');
  const [mapFilters, setMapFilters] = useState<string[]>(['village', 'workshop', 'elite', 'inspection', 'project']);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Export Readiness Calculator States
  const [selectedReadinessArtisan, setSelectedReadinessArtisan] = useState<string>('Aisha Textiles');
  const [readinessChecklist, setReadinessChecklist] = useState({
    crate: true,
    passport: true,
    customs: true,
    labor: true,
    materials: true
  });

  // Investor dashboard states
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [selectedInvestorSlide, setSelectedInvestorSlide] = useState<number>(0);

  // Executive Reports states
  const [reportFreq, setReportFreq] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [reportFormat, setReportFormat] = useState<'pdf' | 'excel' | 'csv'>('csv');
  const [simulatingDownload, setSimulatingDownload] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Live platform data counts
  const [dbProductsCount, setDbProductsCount] = useState<number>(0);
  const [dbEcoProductsCount, setDbEcoProductsCount] = useState<number>(0);
  const [dbMakersCount, setDbMakersCount] = useState<number>(0);
  const [dbEliteMakersCount, setDbEliteMakersCount] = useState<number>(0);
  const [dbGiMakersCount, setDbGiMakersCount] = useState<number>(0);

  // Fetch live statistics on mount
  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(res => res.json()).catch(() => []),
      fetch('/api/makers').then(res => res.json()).catch(() => [])
    ]).then(([products, makers]) => {
      if (Array.isArray(products) && products.length > 0) {
        setDbProductsCount(products.length);
        const eco = products.filter((p: any) => p.isEcoFriendly).length;
        setDbEcoProductsCount(eco);
      }
      if (Array.isArray(makers) && makers.length > 0) {
        setDbMakersCount(makers.length);
        const elite = makers.filter((m: any) => m.verificationStatus === 'ELITE').length;
        setDbEliteMakersCount(elite);
        const gi = makers.filter((m: any) => m.verificationStatus === 'GI').length;
        setDbGiMakersCount(gi);
      }
    });
  }, []);

  // Trigger smooth count-up animation on tab change
  useEffect(() => {
    setAnimationFactor(0);
    let startTimestamp: number | null = null;
    const duration = 1200; // 1.2s animation

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease-out cubic formula
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setAnimationFactor(easeProgress);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [activeTab, selectedInvestorSlide]);

  // Helper to format values with count-up animation
  const formatVal = (value: number, type: 'currency' | 'percent' | 'number' = 'number', decimals = 0) => {
    const animated = value * animationFactor;
    if (type === 'currency') {
      return `£${Math.round(animated).toLocaleString()}`;
    }
    if (type === 'percent') {
      return `${animated.toFixed(decimals)}%`;
    }
    return Math.round(animated).toLocaleString();
  };

  // Expanded Country Metrics Database
  const countriesData: Record<string, CountryStats> = {
    // Sourcing countries
    'Pakistan': { name: 'Pakistan', type: 'maker', makers: 58 + dbMakersCount, eliteMakers: 24 + dbEliteMakersCount, products: 340 + dbProductsCount, orders: 2120, revenue: 1842000, giProducts: 110 + dbGiMakersCount, topCategories: 'Textiles, Ceramics', growthRate: 18, coordinates: { x: 580, y: 190 } },
    'Morocco': { name: 'Morocco', type: 'maker', makers: 45, eliteMakers: 21, products: 280, orders: 1840, revenue: 1598000, giProducts: 75, topCategories: 'Leather, Woodwork', growthRate: 24, coordinates: { x: 410, y: 190 } },
    'Peru': { name: 'Peru', type: 'maker', makers: 38, eliteMakers: 15, products: 210, orders: 1210, revenue: 1048000, giProducts: 60, topCategories: 'Textiles, Jewelry', growthRate: 15, coordinates: { x: 210, y: 310 } },
    'India': { name: 'India', type: 'maker', makers: 72, eliteMakers: 32, products: 480, orders: 3150, revenue: 2720000, giProducts: 160, topCategories: 'Textiles, Art', growthRate: 22, coordinates: { x: 610, y: 210 } },
    'Kenya': { name: 'Kenya', type: 'maker', makers: 29, eliteMakers: 11, products: 190, orders: 980, revenue: 845000, giProducts: 30, topCategories: 'Woodwork, Fashion', growthRate: 12, coordinates: { x: 490, y: 270 } },
    'Mexico': { name: 'Mexico', type: 'maker', makers: 41, eliteMakers: 18, products: 250, orders: 1430, revenue: 1235000, giProducts: 55, topCategories: 'Ceramics, Decor', growthRate: 16, coordinates: { x: 160, y: 210 } },
    'Vietnam': { name: 'Vietnam', type: 'maker', makers: 35, eliteMakers: 14, products: 220, orders: 1280, revenue: 1110000, giProducts: 40, topCategories: 'Decor, Art', growthRate: 20, coordinates: { x: 680, y: 230 } },
    'Ghana': { name: 'Ghana', type: 'maker', makers: 26, eliteMakers: 10, products: 150, orders: 890, revenue: 772000, giProducts: 25, topCategories: 'Textiles, Baskets', growthRate: 14, coordinates: { x: 440, y: 260 } },
    'Bangladesh': { name: 'Bangladesh', type: 'maker', makers: 31, eliteMakers: 12, products: 180, orders: 1020, revenue: 885000, giProducts: 35, topCategories: 'Textiles, Art', growthRate: 11, coordinates: { x: 640, y: 210 } },
    'Indonesia': { name: 'Indonesia', type: 'maker', makers: 45, eliteMakers: 22, products: 290, orders: 1910, revenue: 1650000, giProducts: 80, topCategories: 'Textiles, Woodwork', growthRate: 19, coordinates: { x: 710, y: 290 } },
    // Buying countries
    'United Kingdom': { name: 'United Kingdom', type: 'buyer', makers: 0, eliteMakers: 0, products: 0, orders: 7420, revenue: 6420000, giProducts: 0, topCategories: 'All Categories', growthRate: 26, coordinates: { x: 410, y: 115 } },
    'Germany': { name: 'Germany', type: 'buyer', makers: 0, eliteMakers: 0, products: 0, orders: 3250, revenue: 2850000, giProducts: 0, topCategories: 'All Categories', growthRate: 18, coordinates: { x: 445, y: 120 } },
    'France': { name: 'France', type: 'buyer', makers: 0, eliteMakers: 0, products: 0, orders: 1980, revenue: 1680000, giProducts: 0, topCategories: 'All Categories', growthRate: 14, coordinates: { x: 425, y: 135 } },
    'Italy': { name: 'Italy', type: 'buyer', makers: 0, eliteMakers: 0, products: 0, orders: 1320, revenue: 1150000, giProducts: 0, topCategories: 'All Categories', growthRate: 12, coordinates: { x: 450, y: 150 } },
    'Spain': { name: 'Spain', type: 'buyer', makers: 0, eliteMakers: 0, products: 0, orders: 1120, revenue: 980000, giProducts: 0, topCategories: 'All Categories', growthRate: 9, coordinates: { x: 410, y: 160 } },
    'Netherlands': { name: 'Netherlands', type: 'buyer', makers: 0, eliteMakers: 0, products: 0, orders: 880, revenue: 765000, giProducts: 0, topCategories: 'All Categories', growthRate: 15, coordinates: { x: 435, y: 122 } },
  };

  // Detailed Map Pins for Impact, Villages & Community Projects
  const mapPins: MapPin[] = [
    { id: 'vil-1', name: 'Multan Blue Pottery Village', type: 'village', country: 'Pakistan', description: 'Cooperative workshop housing 18 family ceramicists.', coordinates: { x: 575, y: 195 } },
    { id: 'vil-2', name: 'Cusco Weavers Cooperative', type: 'village', country: 'Peru', description: 'Traditional alpaca spinning community of 24 women.', coordinates: { x: 215, y: 315 } },
    { id: 'vil-3', name: 'Jaipur Ajrak Block Printing Village', type: 'village', country: 'India', description: 'Heritage printing cluster supporting 32 local families.', coordinates: { x: 615, y: 215 } },
    { id: 'work-1', name: 'Fez Leather Tannery Hub', type: 'workshop', country: 'Morocco', description: 'Naturally-dyed leather workshop employing 15 master artisans.', coordinates: { x: 405, y: 195 } },
    { id: 'work-2', name: 'Bat Trang Ceramic Guild', type: 'workshop', country: 'Vietnam', description: 'Eco-kiln collective manufacturing GI-certified clay products.', coordinates: { x: 685, y: 235 } },
    { id: 'elite-1', name: 'Aisha Heritage Textiles Studio', type: 'elite', country: 'Pakistan', description: 'Elite-Verified workshop specializing in natural madder root block dyeing.', coordinates: { x: 585, y: 185 } },
    { id: 'elite-2', name: 'Anatolian Woodcarving Guild', type: 'elite', country: 'Turkey', description: 'Awarded Elite status for hand-carved heritage walnut furniture.', coordinates: { x: 465, y: 160 } },
    { id: 'insp-1', name: 'Inspector Tariq - Punjab Audits', type: 'inspection', country: 'Pakistan', description: 'Active geofence inspection base. 42 successfully approved audits.', coordinates: { x: 590, y: 200 } },
    { id: 'insp-2', name: 'Inspector Elena - Fez Medina Audits', type: 'inspection', country: 'Morocco', description: 'Active inspection route. 29 completed audits.', coordinates: { x: 415, y: 185 } },
    { id: 'proj-1', name: 'Britsync Reverse Osmosis Water Project', type: 'project', country: 'Pakistan', description: 'Funded by 2.5% of regional ceramic sales. Provides clean water to 450 families.', coordinates: { x: 570, y: 188 } },
    { id: 'proj-2', name: 'Cusco Solar Panel Coop Initiative', type: 'project', country: 'Peru', description: 'Provided solar electricity to 12 rural weaving sheds in Cusco Valley.', coordinates: { x: 205, y: 320 } },
  ];

  // Toggle map pins list
  const toggleMapFilter = (filterType: string) => {
    if (mapFilters.includes(filterType)) {
      setMapFilters(mapFilters.filter(f => f !== filterType));
    } else {
      setMapFilters([...mapFilters, filterType]);
    }
  };

  // Simulate report creation & download
  const handleGenerateReport = () => {
    setSimulatingDownload(true);
    setDownloadSuccess(null);
    setTimeout(() => {
      setSimulatingDownload(false);
      const filename = `britsync_${reportFreq}_executive_report_${new Date().getFullYear()}.${reportFormat}`;
      setDownloadSuccess(filename);
    }, 2000);
  };

  const selectedCountryData = countriesData[selectedCountry] || countriesData['India'];
  const selectedPinData = mapPins.find(p => p.id === selectedPin) || mapPins[0];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0B1E1A', color: '#FAF9F6', fontFamily: 'var(--font-inter), sans-serif' }}>
      
      {/* CEO PREMIUM SIDEBAR (hidden if presentationMode is active) */}
      <aside style={{
        width: '280px',
        backgroundColor: '#050D0B',
        borderRight: '1px solid rgba(200, 164, 93, 0.15)',
        padding: '6rem 1.5rem 2rem 1.5rem',
        display: presentationMode ? 'none' : 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
        position: 'sticky',
        top: 0,
        height: '100vh',
        boxSizing: 'border-box',
        zIndex: 10,
        flexShrink: 0
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '1.5rem' }}>👑</span>
            <h2 style={{ fontSize: '1.3rem', color: '#C8A45D', margin: 0, fontFamily: 'var(--font-outfit)', fontWeight: 'bold', letterSpacing: '1px' }}>BRITSYNC</h2>
          </div>
          <span style={{ opacity: 0.6, fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: '#FAF9F6' }}>CEO Executive Suite</span>
        </div>

        {/* Navigation Tab Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
          {[
            { id: 'dashboard', label: 'Executive Health', icon: '📊' },
            { id: 'expansion', label: 'Global Expansion', icon: '🌍' },
            { id: 'exports', label: 'Export Analytics', icon: '📈' },
            { id: 'readiness', label: 'Export Readiness', icon: '✈️' },
            { id: 'impact', label: 'Social Impact & Mission', icon: '🌱' },
            { id: 'impact_map', label: 'Artisan Impact Map', icon: '📍' },
            { id: 'sustainability', label: 'Sustainability Control', icon: '♻️' },
            { id: 'insights', label: 'Executive Insights', icon: '🧠' },
            { id: 'performance', label: 'Global Performance', icon: '🏆' },
            { id: 'marketing', label: 'Marketing Overview', icon: '📣' },
            { id: 'reports', label: 'Executive Reports', icon: '📁' },
            { id: 'investor', label: 'Investor Dashboard', icon: '💼' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                border: 'none',
                background: activeTab === item.id ? 'linear-gradient(135deg, rgba(200, 164, 93, 0.2), rgba(31, 75, 67, 0.3))' : 'transparent',
                color: activeTab === item.id ? '#C8A45D' : '#FAF9F6',
                borderLeft: activeTab === item.id ? '3px solid #C8A45D' : '3px solid transparent',
                fontWeight: activeTab === item.id ? 'bold' : 'normal',
                cursor: 'pointer',
                borderRadius: '0 8px 8px 0',
                width: '100%',
                transition: 'all 0.3s ease',
                fontSize: '0.85rem',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* User Profile Info */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #C8A45D, #1F4B43)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
            CEO
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Super Admin</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>ceo@britsync.com</div>
          </div>
        </div>
      </aside>

      {/* CEO SCROLLABLE MAIN CONTENT AREA */}
      <section style={{
        flex: 1,
        padding: presentationMode ? '2rem' : '6rem 3rem 6rem',
        boxSizing: 'border-box',
        overflowY: 'auto',
        backgroundColor: presentationMode ? '#040B09' : 'transparent',
        transition: 'all 0.4s ease'
      }}>
        
        {/* Header Title bar (hidden if presentationMode is active) */}
        {!presentationMode && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3.5rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', color: '#FAF9F6', margin: '0 0 0.5rem', fontFamily: 'var(--font-outfit)', letterSpacing: '1px' }}>
                CEO Executive Intelligence
              </h1>
              <p style={{ color: '#C8A45D', fontSize: '0.95rem', margin: 0, textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>
                Strategic Business Health & Global Development
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: '#388E3C', borderRadius: '50%', boxShadow: '0 0 10px #388E3C' }}></span>
              <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>Live Enterprise Connection</span>
            </div>
          </div>
        )}

        {/* ==================== 1. EXECUTIVE HEALTH DASHBOARD ==================== */}
        {activeTab === 'dashboard' && !presentationMode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }} className="animate-fade-in">
            
            {/* EXECUTIVE ALERT CENTER */}
            <div style={{ background: '#191105', border: '1px solid rgba(200, 164, 93, 0.25)', borderRadius: '16px', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.4rem' }}>🚨</span>
                  <h3 style={{ fontSize: '1.2rem', color: '#C8A45D', margin: 0, fontFamily: 'var(--font-outfit)', fontWeight: 'bold', letterSpacing: '1px' }}>Executive Operations Alert Center</h3>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#C8A45D', background: 'rgba(200,164,93,0.15)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>7 Active Alerts Pending</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                
                <div style={{ background: 'rgba(211,47,47,0.06)', borderLeft: '4px solid var(--error)', padding: '1rem', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: '#FAF9F6' }}>Payment Gateway Interruption</strong>
                    <span style={{ fontSize: '0.7rem', color: '#E57373', fontWeight: 'bold' }}>CRITICAL</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8, lineHeight: 1.4 }}>Stripe Connect escrow gateway reports API timeouts in South Asia region. Payout queue delayed (+4h).</p>
                </div>

                <div style={{ background: 'rgba(211,47,47,0.06)', borderLeft: '4px solid var(--error)', padding: '1rem', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: '#FAF9F6' }}>Spike in Ceramics Breakage</strong>
                    <span style={{ fontSize: '0.7rem', color: '#E57373', fontWeight: 'bold' }}>HIGH RISK</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8, lineHeight: 1.4 }}>UK customer refund rate increased to 1.8% for ceramics due to ocean transit impact. Padding redesign required.</p>
                </div>

                <div style={{ background: 'rgba(200,164,93,0.06)', borderLeft: '4px solid #C8A45D', padding: '1rem', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: '#FAF9F6' }}>Cusco Verification Delay</strong>
                    <span style={{ fontSize: '0.7rem', color: '#FFE082', fontWeight: 'bold' }}>SLA WARNING</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8, lineHeight: 1.4 }}>12 pending Elite verifications in Peru Valley exceeding the 14-day SLA due to localized transit blockades.</p>
                </div>

                <div style={{ background: 'rgba(200,164,93,0.06)', borderLeft: '4px solid #C8A45D', padding: '1rem', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: '#FAF9F6' }}>Certificates Expiring</strong>
                    <span style={{ fontSize: '0.7rem', color: '#FFE082', fontWeight: 'bold' }}>COMPLIANCE</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8, lineHeight: 1.4 }}>4 Elite master certificates in Morocco Medina expire in 15 days. Inspector Elena K. scheduled for audit.</p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '4px solid rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: '#FAF9F6' }}>Operations Support Backlog</strong>
                    <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>NOTICE</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8, lineHeight: 1.4 }}>8 open artisan inquiry tickets awaiting response in the regional portal.</p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '4px solid rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: '#FAF9F6' }}>Pending Elite Intake</strong>
                    <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>NOTICE</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8, lineHeight: 1.4 }}>5 completed physical inspection reports waiting for final operations manager sign-off.</p>
                </div>

              </div>
            </div>

            {/* Financial Engine Column */}
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#C8A45D', marginBottom: '1.5rem', borderBottom: '1px solid rgba(200, 164, 93, 0.2)', paddingBottom: '0.5rem' }}>Platform Financial Engine</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
                
                <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.2)', borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#C8A45D', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Lifetime Gross Sales</span>
                    <span style={{ fontSize: '1.5rem' }}>💼</span>
                  </div>
                  <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-outfit)', margin: '0 0 0.5rem', color: '#FAF9F6' }}>
                    {formatVal(12845920, 'currency')}
                  </h2>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.8 }}>
                    <span>Target: £15.0M</span>
                    <span style={{ color: '#81C784' }}>+15.4% YoY</span>
                  </div>
                </div>

                <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.2)', borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#C8A45D', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Monthly Revenue (MTD)</span>
                    <span style={{ fontSize: '1.5rem' }}>📅</span>
                  </div>
                  <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-outfit)', margin: '0 0 0.5rem', color: '#FAF9F6' }}>
                    {formatVal(142500, 'currency')}
                  </h2>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.8 }}>
                    <span>Q2 Average: £135.0k</span>
                    <span style={{ color: '#81C784' }}>+8.2% vs Q1</span>
                  </div>
                </div>

                <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.2)', borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#C8A45D', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Annual Revenue (ARR)</span>
                    <span style={{ fontSize: '1.5rem' }}>📈</span>
                  </div>
                  <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-outfit)', margin: '0 0 0.5rem', color: '#FAF9F6' }}>
                    {formatVal(1710000, 'currency')}
                  </h2>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.8 }}>
                    <span>FY26 Projection: £1.95M</span>
                    <span style={{ color: '#81C784' }}>On Track</span>
                  </div>
                </div>

                <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.3)', borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', borderTop: '4px solid #C8A45D' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#C8A45D', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Platform Profit (Margin)</span>
                    <span style={{ fontSize: '1.5rem' }}>💎</span>
                  </div>
                  <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-outfit)', margin: '0 0 0.5rem', color: '#C8A45D' }}>
                    {formatVal(5138368, 'currency')}
                  </h2>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.8 }}>
                    <span>Effective Margin Rate: 40%</span>
                    <span style={{ color: '#81C784' }}>Escrow Secured</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Scale & Activity Section */}
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#C8A45D', marginBottom: '1.5rem', borderBottom: '1px solid rgba(200, 164, 93, 0.2)', paddingBottom: '0.5rem' }}>Artisan & Buyer Scale</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Orders Filled</span>
                  <h3 style={{ fontSize: '1.8rem', margin: '0.5rem 0', color: '#FAF9F6' }}>{formatVal(14829, 'number')}</h3>
                  <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginTop: '1rem' }}>
                    <div style={{ width: '74%', height: '100%', backgroundColor: '#C8A45D' }}></div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Active Buyers</span>
                  <h3 style={{ fontSize: '1.8rem', margin: '0.5rem 0', color: '#FAF9F6' }}>{formatVal(8429, 'number')}</h3>
                  <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginTop: '1rem' }}>
                    <div style={{ width: '85%', height: '100%', backgroundColor: '#388E3C' }}></div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Registered Makers</span>
                  <h3 style={{ fontSize: '1.8rem', margin: '0.5rem 0', color: '#FAF9F6' }}>{formatVal(420 + dbMakersCount, 'number')}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.7rem', marginTop: '0.8rem', opacity: 0.8 }}>
                    <span style={{ color: '#FAF9F6', background: '#0F2C26', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>Elite: {180 + dbEliteMakersCount}</span>
                    <span style={{ color: '#FAF9F6', background: 'rgba(200,164,93,0.2)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>GI: {80 + dbGiMakersCount}</span>
                    <span style={{ color: '#FAF9F6', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>Gen: 160</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Active Products</span>
                  <h3 style={{ fontSize: '1.8rem', margin: '0.5rem 0', color: '#FAF9F6' }}>{formatVal(2450 + dbProductsCount, 'number')}</h3>
                  <span style={{ fontSize: '0.75rem', color: '#C8A45D' }}>{formatVal(980, 'number')} Elite Verified (40%)</span>
                </div>

              </div>
            </div>

            {/* Quality & Trust Operations */}
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#C8A45D', marginBottom: '1.5rem', borderBottom: '1px solid rgba(200, 164, 93, 0.2)', paddingBottom: '0.5rem' }}>Trust, Compliance & Satisfaction</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
                
                <div style={{ background: '#0D211D', border: '1px solid rgba(31,75,67,0.4)', borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🌐</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase' }}>Countries Active</span>
                  <h3 style={{ fontSize: '2.5rem', color: '#FAF9F6', margin: '0.5rem 0', fontFamily: 'var(--font-outfit)' }}>{formatVal(12, 'number')}</h3>
                  <p style={{ fontSize: '0.75rem', opacity: 0.7, margin: 0 }}>4 New Regions in intake pipeline</p>
                </div>

                <div style={{ background: '#0D211D', border: '1px solid rgba(31,75,67,0.4)', borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🛡️</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase' }}>Verification Pass Rate</span>
                  <h3 style={{ fontSize: '2.5rem', color: '#FAF9F6', margin: '0.5rem 0', fontFamily: 'var(--font-outfit)' }}>{formatVal(74, 'percent')}</h3>
                  <p style={{ fontSize: '0.75rem', opacity: 0.7, margin: 0 }}>Strict physical inspections</p>
                </div>

                <div style={{ background: '#0D211D', border: '1px solid rgba(31,75,67,0.4)', borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>⭐</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase' }}>Average Buyer Trust Score</span>
                  <h3 style={{ fontSize: '2.5rem', color: '#C8A45D', margin: '0.5rem 0', fontFamily: 'var(--font-outfit)' }}>4.85<span style={{ fontSize: '1rem', color: '#FAF9F6', opacity: 0.5 }}>/5</span></h3>
                  <p style={{ fontSize: '0.75rem', opacity: 0.7, margin: 0 }}>Based on 4,820 buyer audits</p>
                </div>

                <div style={{ background: '#0D211D', border: '1px solid rgba(31,75,67,0.4)', borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>❤️</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase' }}>Customer Satisfaction</span>
                  <h3 style={{ fontSize: '2.5rem', color: '#388E3C', margin: '0.5rem 0', fontFamily: 'var(--font-outfit)' }}>{formatVal(98.4, 'percent', 1)}</h3>
                  <p style={{ fontSize: '0.75rem', opacity: 0.7, margin: 0 }}>Refund request rate &lt; 0.6%</p>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ==================== 2. GLOBAL EXPANSION DASHBOARD ==================== */}
        {activeTab === 'expansion' && !presentationMode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }} className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '3rem', alignItems: 'start' }}>
              
              {/* World Map Box */}
              <div style={{ background: '#050D0B', border: '1px solid rgba(200, 164, 93, 0.15)', borderRadius: '16px', padding: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#FAF9F6', marginBottom: '0.5rem' }}>Global Sourcing Expansion Map</h3>
                <span style={{ fontSize: '0.8rem', opacity: 0.6, display: 'block', marginBottom: '1.5rem' }}>Click glowing pins to inspect country operations.</span>
                
                {/* SVG WORLD MAP */}
                <div style={{ position: 'relative', width: '100%', height: '400px', backgroundColor: '#071613', borderRadius: '12px', overflow: 'hidden' }}>
                  <svg viewBox="0 0 800 400" style={{ width: '100%', height: '100%' }}>
                    {/* Outlines */}
                    <path d="M 60 70 L 150 50 L 220 90 L 250 140 L 180 180 L 160 220 L 140 210 Z" fill="rgba(31, 75, 67, 0.15)" stroke="rgba(31, 75, 67, 0.3)" />
                    <path d="M 160 220 L 200 230 L 220 280 L 260 330 L 220 380 L 180 340 Z" fill="rgba(31, 75, 67, 0.15)" stroke="rgba(31, 75, 67, 0.3)" />
                    <path d="M 360 60 L 450 50 L 540 60 L 680 70 L 740 100 L 760 160 L 700 220 L 620 250 L 520 220 Z" fill="rgba(31, 75, 67, 0.15)" stroke="rgba(31, 75, 67, 0.3)" />
                    <path d="M 370 170 L 430 160 L 480 180 L 520 220 L 500 270 L 480 320 L 440 330 Z" fill="rgba(31, 75, 67, 0.15)" stroke="rgba(31, 75, 67, 0.3)" />
                    <path d="M 670 280 L 730 270 L 750 310 L 720 340 L 670 320 Z" fill="rgba(31, 75, 67, 0.15)" stroke="rgba(31, 75, 67, 0.3)" />

                    {/* Flows */}
                    {Object.values(countriesData).filter(c => c.type === 'maker').map((c, idx) => {
                      const ukCoords = countriesData['United Kingdom'].coordinates;
                      const mx = (c.coordinates.x + ukCoords.x) / 2;
                      const my = Math.min(c.coordinates.y, ukCoords.y) - 50;
                      return (
                        <g key={`link-${idx}`}>
                          <path
                            d={`M ${c.coordinates.x} ${c.coordinates.y} Q ${mx} ${my} ${ukCoords.x} ${ukCoords.y}`}
                            fill="none"
                            stroke={selectedCountry === c.name ? '#C8A45D' : 'rgba(200, 164, 93, 0.15)'}
                            strokeWidth={selectedCountry === c.name ? 2.5 : 1}
                            strokeDasharray="5,5"
                          />
                        </g>
                      );
                    })}

                    {/* Nodes */}
                    {Object.values(countriesData).map((country) => {
                      const isMaker = country.type === 'maker';
                      const isSelected = selectedCountry === country.name;
                      return (
                        <g 
                          key={country.name}
                          onClick={() => setSelectedCountry(country.name)}
                          onMouseEnter={() => setHoveredNode(country.name)}
                          onMouseLeave={() => setHoveredNode(null)}
                          style={{ cursor: 'pointer' }}
                        >
                          {isSelected && (
                            <circle cx={country.coordinates.x} cy={country.coordinates.y} r="12" fill="none" stroke={isMaker ? '#81C784' : '#C8A45D'} strokeWidth="1.5">
                              <animate attributeName="r" values="6;16;6" dur="2s" repeatCount="indefinite" />
                            </circle>
                          )}
                          <circle cx={country.coordinates.x} cy={country.coordinates.y} r={isSelected ? '6' : '4'} fill={isMaker ? '#4CAF50' : '#C8A45D'} stroke="#FAF9F6" strokeWidth="1" />
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Country Details */}
              <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.25)', borderRadius: '16px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.4rem', color: '#C8A45D', margin: 0, fontFamily: 'var(--font-outfit)' }}>{selectedCountryData.name} Analytics</h3>
                  <span style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem', borderRadius: '20px', backgroundColor: selectedCountryData.type === 'maker' ? '#2E7D32' : '#C8A45D' }}>
                    {selectedCountryData.type === 'maker' ? 'Maker Sourcing' : 'Buyer Hub'}
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span>Active Makers</span>
                    <strong>{selectedCountryData.makers} Studios</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span>Elite verified</span>
                    <strong style={{ color: '#C8A45D' }}>{selectedCountryData.eliteMakers}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span>Active Products</span>
                    <strong>{selectedCountryData.products} Items</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span>Orders Fulfilled</span>
                    <strong>{formatVal(selectedCountryData.orders, 'number')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span>Total Sourced Value</span>
                    <strong style={{ color: '#C8A45D' }}>{formatVal(selectedCountryData.revenue, 'currency')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span>GI Products Protected</span>
                    <strong>{selectedCountryData.giProducts} Listings</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span>Top Categories</span>
                    <strong>{selectedCountryData.topCategories}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span>Annual Growth</span>
                    <strong style={{ color: '#81C784' }}>+{selectedCountryData.growthRate}% YoY</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. EXPORT ANALYTICS ==================== */}
        {activeTab === 'exports' && !presentationMode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }} className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem' }}>
              
              {/* European Revenue breakdown */}
              <div style={{ background: '#050D0B', border: '1px solid rgba(200, 164, 93, 0.15)', borderRadius: '16px', padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#FAF9F6', marginBottom: '2rem' }}>European Revenue Ledgers</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {[
                    { name: 'United Kingdom Revenue', val: 6420000, color: '#C8A45D', pct: 50 },
                    { name: 'Germany Revenue', val: 2850000, color: '#458B74', pct: 22 },
                    { name: 'France Revenue', val: 1680000, color: '#8F7C5D', pct: 13 },
                    { name: 'Italy Revenue', val: 1150000, color: '#556B2F', pct: 9 },
                    { name: 'Spain Revenue', val: 980000, color: '#8B7355', pct: 8 },
                    { name: 'Netherlands Revenue', val: 765000, color: '#3A5F56', pct: 6 }
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        <span>{item.name}</span>
                        <strong style={{ color: '#C8A45D' }}>{formatVal(item.val, 'currency')} ({item.pct}%)</strong>
                      </div>
                      <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${item.pct * animationFactor}%`, height: '100%', backgroundColor: item.color, borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sourcing Stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.2)', borderRadius: '16px', padding: '2rem' }}>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase' }}>Top Exporting Country (Makers)</span>
                  <h3 style={{ fontSize: '1.6rem', color: '#FAF9F6', margin: '0.5rem 0' }}>India (3,150 shipments)</h3>
                  <span style={{ fontSize: '0.8rem', color: '#81C784' }}>✓ 22% export growth</span>
                </div>
                <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.2)', borderRadius: '16px', padding: '2rem' }}>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase' }}>Top Importing Country (Buyers)</span>
                  <h3 style={{ fontSize: '1.6rem', color: '#FAF9F6', margin: '0.5rem 0' }}>United Kingdom (7,420 orders)</h3>
                  <span style={{ fontSize: '0.8rem', color: '#81C784' }}>50% of total export volumes</span>
                </div>
              </div>

            </div>

            {/* Monthly Export Volume Growth Chart */}
            <div style={{ background: '#050D0B', border: '1px solid rgba(200, 164, 93, 0.15)', borderRadius: '16px', padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#FAF9F6', marginBottom: '1.5rem' }}>Monthly Export Shipment Volume Growth</h3>
              <div style={{ height: '180px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                {[
                  { m: 'Jan', val: 780 },
                  { m: 'Feb', val: 890 },
                  { m: 'Mar', val: 1040 },
                  { m: 'Apr', val: 1210 },
                  { m: 'May', val: 1450 },
                  { m: 'Jun', val: 1680 },
                  { m: 'Jul', val: 1910 }
                ].map((item, idx) => (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{formatVal(item.val)}</span>
                    <div style={{
                      width: '32px',
                      height: `${(item.val / 2000) * 120 * animationFactor}px`,
                      backgroundColor: '#C8A45D',
                      borderRadius: '4px 4px 0 0',
                    }}></div>
                    <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{item.m}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================== 4. SOCIAL IMPACT & MISSION DASHBOARD ==================== */}
        {activeTab === 'impact' && !presentationMode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }} className="animate-fade-in">
            
            {/* Dedicated Mission & Impact Section */}
            <div style={{ background: 'linear-gradient(135deg, #0D211D, #050D0B)', border: '1px solid #C8A45D', borderRadius: '16px', padding: '2.5rem', textAlign: 'center' }}>
              <span style={{ fontSize: '2rem' }}>🌿</span>
              <h2 style={{ fontSize: '2rem', color: '#C8A45D', fontFamily: 'var(--font-outfit)', margin: '1rem 0' }}>The Britsync Mission</h2>
              <p style={{ maxWidth: '800px', margin: '0 auto 2.5rem', fontSize: '1.2rem', lineHeight: 1.7, opacity: 0.9 }}>
                "Connecting authentic makers with global buyers while preserving culture, creating employment, and building trust through human verification."
              </p>
              
              {/* Mission Specific Animated Counters (auto-updating based on platform database) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem', borderRadius: '12px' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Lives Impacted</span>
                  <strong style={{ fontSize: '2rem', color: '#FAF9F6', display: 'block' }}>{formatVal(12540 + (dbProductsCount * 12))}</strong>
                  <span style={{ fontSize: '0.65rem', color: '#81C784' }}>✓ Live data sync</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem', borderRadius: '12px' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Women Empowered</span>
                  <strong style={{ fontSize: '2rem', color: '#FAF9F6', display: 'block' }}>{formatVal(2350)}</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem', borderRadius: '12px' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Workshops Verified</span>
                  <strong style={{ fontSize: '2rem', color: '#FAF9F6', display: 'block' }}>{formatVal(860 + dbMakersCount)}</strong>
                  <span style={{ fontSize: '0.65rem', color: '#81C784' }}>+ {dbMakersCount} db workshops</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem', borderRadius: '12px' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Countries Connected</span>
                  <strong style={{ fontSize: '2rem', color: '#C8A45D', display: 'block' }}>{formatVal(28)}</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem', borderRadius: '12px' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Traditional Crafts Preserved</span>
                  <strong style={{ fontSize: '2rem', color: '#FAF9F6', display: 'block' }}>{formatVal(96 + dbGiMakersCount)}</strong>
                  <span style={{ fontSize: '0.65rem', color: '#81C784' }}>+ {dbGiMakersCount} GI designs</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem', borderRadius: '12px' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Elite Makers</span>
                  <strong style={{ fontSize: '2rem', color: '#C8A45D', display: 'block' }}>{formatVal(1420 + dbEliteMakersCount)}</strong>
                  <span style={{ fontSize: '0.65rem', color: '#81C784' }}>+ {dbEliteMakersCount} db Elite</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem', borderRadius: '12px' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Income Generated</span>
                  <strong style={{ fontSize: '2rem', color: '#FAF9F6', display: 'block' }}>{formatVal(4.8, 'number', 1)} Million</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem', borderRadius: '12px' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Products Exported</span>
                  <strong style={{ fontSize: '2rem', color: '#FAF9F6', display: 'block' }}>{formatVal(42500 + dbProductsCount)}</strong>
                  <span style={{ fontSize: '0.65rem', color: '#81C784' }}>+ {dbProductsCount} db products</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem', borderRadius: '12px' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Buyer Trust Score</span>
                  <strong style={{ fontSize: '2rem', color: '#81C784', display: 'block' }}>{formatVal(98)} / 100</strong>
                </div>
              </div>
            </div>

            {/* Social Welfare Breakdown */}
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#C8A45D', marginBottom: '1.5rem', borderBottom: '1px solid rgba(200, 164, 93, 0.2)', paddingBottom: '0.5rem' }}>Social Metric Breakdown</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.2)', borderRadius: '16px', padding: '2rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#C8A45D', textTransform: 'uppercase' }}>Artisans Empowered</span>
                  <h3 style={{ fontSize: '2rem', color: '#FAF9F6', margin: '0.5rem 0' }}>{formatVal(1420)}</h3>
                  <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Direct employment & fair-wage</span>
                </div>
                <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.2)', borderRadius: '16px', padding: '2rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#C8A45D', textTransform: 'uppercase' }}>Rural Communities Supported</span>
                  <h3 style={{ fontSize: '2rem', color: '#FAF9F6', margin: '0.5rem 0' }}>{formatVal(45)}</h3>
                  <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Isolated villages integrated</span>
                </div>
                <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.2)', borderRadius: '16px', padding: '2rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#C8A45D', textTransform: 'uppercase' }}>Sustainable Catalog Items</span>
                  <h3 style={{ fontSize: '2rem', color: '#FAF9F6', margin: '0.5rem 0' }}>{formatVal(3780 + dbEcoProductsCount)}</h3>
                  <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Verified eco friendly materials</span>
                </div>
                <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.2)', borderRadius: '16px', padding: '2rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#C8A45D', textTransform: 'uppercase' }}>Income Generated For Makers</span>
                  <h3 style={{ fontSize: '2rem', color: '#C8A45D', margin: '0.5rem 0' }}>{formatVal(7707552, 'currency')}</h3>
                  <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>60% of all platform revenue</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== 5. IMPACT MAP ==================== */}
        {activeTab === 'impact_map' && !presentationMode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }} className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', alignItems: 'start' }}>
              
              {/* Interactive Impact Map SVG */}
              <div style={{ background: '#050D0B', border: '1px solid rgba(200, 164, 93, 0.15)', borderRadius: '16px', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: '#FAF9F6', margin: 0 }}>Global Impact & Inspection Grid</h3>
                    <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Interactive audit checkpoints and community projects.</span>
                  </div>
                  {/* Filters */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {[
                      { id: 'village', label: 'Villages', color: '#81C784' },
                      { id: 'workshop', label: 'Workshops', color: '#64B5F6' },
                      { id: 'elite', label: 'Elite Makers', color: '#FFE082' },
                      { id: 'inspection', label: 'Audits', color: '#BA68C8' },
                      { id: 'project', label: 'Projects', color: '#FF8A65' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => toggleMapFilter(f.id)}
                        style={{
                          border: `1px solid ${f.color}`,
                          background: mapFilters.includes(f.id) ? f.color : 'transparent',
                          color: mapFilters.includes(f.id) ? '#050D0B' : '#FAF9F6',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '20px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ position: 'relative', width: '100%', height: '400px', backgroundColor: '#071613', borderRadius: '12px', overflow: 'hidden' }}>
                  <svg viewBox="0 0 800 400" style={{ width: '100%', height: '100%' }}>
                    <path d="M 60 70 L 150 50 L 220 90 L 250 140 L 180 180 L 160 220 L 140 210 Z" fill="rgba(31, 75, 67, 0.1)" stroke="rgba(31, 75, 67, 0.2)" />
                    <path d="M 160 220 L 200 230 L 220 280 L 260 330 L 220 380 L 180 340 Z" fill="rgba(31, 75, 67, 0.1)" stroke="rgba(31, 75, 67, 0.2)" />
                    <path d="M 360 60 L 450 50 L 540 60 L 680 70 L 740 100 L 760 160 L 700 220 Z" fill="rgba(31, 75, 67, 0.1)" stroke="rgba(31, 75, 67, 0.2)" />
                    <path d="M 370 170 L 430 160 L 480 180 L 520 220 L 500 270 L 480 320 Z" fill="rgba(31, 75, 67, 0.1)" stroke="rgba(31, 75, 67, 0.2)" />
                    <path d="M 670 280 L 730 270 L 750 310 L 720 340 Z" fill="rgba(31, 75, 67, 0.1)" stroke="rgba(31, 75, 67, 0.2)" />

                    {/* Render active pins */}
                    {mapPins.filter(pin => mapFilters.includes(pin.type)).map(pin => {
                      const isSelected = selectedPin === pin.id;
                      let pinColor = '#81C784'; 
                      if (pin.type === 'workshop') pinColor = '#64B5F6';
                      if (pin.type === 'elite') pinColor = '#C8A45D';
                      if (pin.type === 'inspection') pinColor = '#BA68C8';
                      if (pin.type === 'project') pinColor = '#FF8A65';

                      return (
                        <g
                          key={pin.id}
                          onClick={() => setSelectedPin(pin.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          <circle cx={pin.coordinates.x} cy={pin.coordinates.y} r={isSelected ? 10 : 6} fill={pinColor} opacity={isSelected ? 0.8 : 0.4}>
                            <animate attributeName="r" values="4;12;4" dur="2.5s" repeatCount="indefinite" />
                          </circle>
                          <circle cx={pin.coordinates.x} cy={pin.coordinates.y} r="4" fill={pinColor} stroke="#FAF9F6" strokeWidth="1" />
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Pin Detailed Info Panel */}
              <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.25)', borderRadius: '16px', padding: '2rem', height: '100%' }}>
                <h4 style={{ color: '#C8A45D', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', margin: '0 0 0.5rem' }}>Checkpoint Details</h4>
                <h3 style={{ fontSize: '1.4rem', color: '#FAF9F6', margin: '0 0 1rem', fontFamily: 'var(--font-outfit)', fontWeight: 'bold' }}>{selectedPinData.name}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ opacity: 0.6, display: 'block', fontSize: '0.8rem' }}>Type</span>
                    <strong style={{ textTransform: 'capitalize', color: '#C8A45D' }}>{selectedPinData.type}</strong>
                  </div>
                  <div>
                    <span style={{ opacity: 0.6, display: 'block', fontSize: '0.8rem' }}>Country Location</span>
                    <strong>{selectedPinData.country}</strong>
                  </div>
                  <div>
                    <span style={{ opacity: 0.6, display: 'block', fontSize: '0.8rem' }}>Description</span>
                    <p style={{ opacity: 0.8, margin: '0.25rem 0 0', lineHeight: 1.5 }}>{selectedPinData.description}</p>
                  </div>
                  
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                    <button
                      onClick={() => alert(`Dispatched GPS check for ${selectedPinData.name}.`)}
                      className="btn-accent"
                      style={{ padding: '0.6rem', fontSize: '0.8rem', width: '100%' }}
                    >
                      Audit Checkpoint
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================== 6. SUSTAINABILITY DASHBOARD ==================== */}
        {activeTab === 'sustainability' && !presentationMode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }} className="animate-fade-in">
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              
              <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.2)', borderRadius: '16px', padding: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#C8A45D', marginBottom: '1.5rem' }}>Eco Friendly Products</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', background: 'conic-gradient(#4CAF50 75%, rgba(255,255,255,0.05) 0)' }}>
                    <div style={{ position: 'absolute', inset: '8px', backgroundColor: '#0F2C26', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>75%</div>
                  </div>
                  <div>
                    <strong style={{ fontSize: '1.4rem' }}>{formatVal(1840)} items</strong>
                    <span style={{ display: 'block', opacity: 0.6, fontSize: '0.8rem' }}>Organic wool, wood & clay.</span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.2)', borderRadius: '16px', padding: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#C8A45D', marginBottom: '1.5rem' }}>Recycled Materials Used</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', background: 'conic-gradient(#64B5F6 65%, rgba(255,255,255,0.05) 0)' }}>
                    <div style={{ position: 'absolute', inset: '8px', backgroundColor: '#0F2C26', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>12.4t</div>
                  </div>
                  <div>
                    <strong style={{ fontSize: '1.4rem' }}>12.4 Tons</strong>
                    <span style={{ display: 'block', opacity: 0.6, fontSize: '0.8rem' }}>Timber, glass & metal scrap.</span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.2)', borderRadius: '16px', padding: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#C8A45D', marginBottom: '1.5rem' }}>Women Led Businesses</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', background: 'conic-gradient(#FFE082 55%, rgba(255,255,255,0.05) 0)' }}>
                    <div style={{ position: 'absolute', inset: '8px', backgroundColor: '#0F2C26', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>55%</div>
                  </div>
                  <div>
                    <strong style={{ fontSize: '1.4rem' }}>{formatVal(184)} Owners</strong>
                    <span style={{ display: 'block', opacity: 0.6, fontSize: '0.8rem' }}>Cooperative structures.</span>
                  </div>
                </div>
              </div>

            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem' }}>
              <div style={{ background: '#050D0B', border: '1px solid rgba(200, 164, 93, 0.15)', borderRadius: '16px', padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#FAF9F6', marginBottom: '1.5rem' }}>Environmental & Social Governance (ESG)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span>Fair Trade Products</span>
                    <strong style={{ color: '#4CAF50' }}>100% Verified</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span>Carbon Reduction Estimate</span>
                    <strong style={{ color: '#4CAF50' }}>84.2 Tons CO2e Offset</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span>Community Development Projects</span>
                    <strong style={{ color: '#C8A45D' }}>8 Active Programs</strong>
                  </div>
                </div>
              </div>
              
              <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.25)', borderRadius: '16px', padding: '2.5rem', display: 'flex', alignItems: 'center' }}>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, opacity: 0.8, margin: 0 }}>
                  By keeping processing and finishing within the village of origin (e.g. spinning, dyeing, weaving all occurring within Cusco and Multan), Britsync reduces internal transport emissions by 40% compared to typical global industrial textile loops.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ==================== 7. EXECUTIVE INSIGHTS ==================== */}
        {activeTab === 'insights' && !presentationMode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }} className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              
              <div style={{ background: 'linear-gradient(135deg, #0D211D, #050D0B)', border: '1px solid rgba(200, 164, 93, 0.25)', borderRadius: '16px', padding: '2rem' }}>
                <h4 style={{ color: '#C8A45D', fontWeight: 'bold', margin: '0 0 1rem' }}>👑 Elite Premium Performance</h4>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, opacity: 0.9, margin: 0 }}>
                  Elite verified products generated <strong>38% higher revenue</strong> this month compared to General catalog listings. This validates our physical inspection model; buyers pay a premium for verified authenticity.
                </p>
              </div>

              <div style={{ background: 'linear-gradient(135deg, #0D211D, #050D0B)', border: '1px solid rgba(200, 164, 93, 0.25)', borderRadius: '16px', padding: '2rem' }}>
                <h4 style={{ color: '#C8A45D', fontWeight: 'bold', margin: '0 0 1rem' }}>🏺 Home Decor Demand Surge</h4>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, opacity: 0.9, margin: 0 }}>
                  <strong>Handmade Home Decor</strong> is our fastest growing catalog category (+32% MoM growth rate). Large walnut tables and olive wood boards represent 45% of this volume.
                </p>
              </div>

              <div style={{ background: 'linear-gradient(135deg, #0D211D, #050D0B)', border: '1px solid rgba(200, 164, 93, 0.25)', borderRadius: '16px', padding: '2rem' }}>
                <h4 style={{ color: '#C8A45D', fontWeight: 'bold', margin: '0 0 1rem' }}>🛡️ GI Products Average Order Value</h4>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, opacity: 0.9, margin: 0 }}>
                  GI certified products have the highest Average Order Value (AOV) on the store at <strong>£342.00</strong>. Cultural protections increase platform conversion by 14%.
                </p>
              </div>

              <div style={{ background: 'linear-gradient(135deg, #0D211D, #050D0B)', border: '1px solid rgba(200, 164, 93, 0.25)', borderRadius: '16px', padding: '2rem' }}>
                <h4 style={{ color: '#C8A45D', fontWeight: 'bold', margin: '0 0 1rem' }}>🚀 Morocco Maker Intake</h4>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, opacity: 0.9, margin: 0 }}>
                  Morocco has our fastest growing Elite Maker cohort (<strong>+24% YoY</strong>). Expanding local inspection nodes in Marrakech is recommended to process the backlog of 15 pending applications.
                </p>
              </div>

              <div style={{ background: 'linear-gradient(135deg, #0D211D, #050D0B)', border: '1px solid rgba(200, 164, 93, 0.25)', borderRadius: '16px', padding: '2rem' }}>
                <h4 style={{ color: '#C8A45D', fontWeight: 'bold', margin: '0 0 1rem' }}>⭐ Pakistan Customer Delight</h4>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, opacity: 0.9, margin: 0 }}>
                  Pakistan artisans score the highest customer satisfaction rating at <strong>99.1%</strong>, with exceptionally low returns. Blue Pottery and Ajrak Textiles are highly reliable categories.
                </p>
              </div>

            </div>

            <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.25)', borderRadius: '16px', padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#C8A45D', marginBottom: '1.5rem', borderBottom: '1px solid rgba(200,164,93,0.2)', paddingBottom: '0.5rem' }}>CEO Strategic Recommendations</h3>
              <ol style={{ paddingLeft: '1.5rem', margin: 0, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '1rem', lineHeight: 1.6 }}>
                <li><strong>Scale Up Peru Inspector Nodes:</strong> Allocate budget for +3 local inspectors in Cusco valley to process alpine weaving applications.</li>
                <li><strong>Cooperative Loom Upgrades:</strong> Inject £20,000 into Vietnam guilds to scale up green ceramic production eco-kilns.</li>
                <li><strong>Leverage GI Protection:</strong> Roll out additional cryptographic Digital Product Passports to elevate buyer trust.</li>
              </ol>
            </div>
          </div>
        )}

        {/* ==================== 8. GLOBAL LEADERBOARD / PERFORMANCE ==================== */}
        {activeTab === 'performance' && !presentationMode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }} className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'start' }}>
              
              {/* Leaderboards */}
              <div style={{ background: '#050D0B', border: '1px solid rgba(200, 164, 93, 0.15)', borderRadius: '16px', padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#FAF9F6', marginBottom: '1.5rem' }}>Top Countries (By revenue generated for makers)</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#C8A45D' }}>
                      <th style={{ padding: '0.8rem' }}>Rank</th>
                      <th style={{ padding: '0.8rem' }}>Country</th>
                      <th style={{ padding: '0.8rem' }}>Makers</th>
                      <th style={{ padding: '0.8rem' }}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { rank: 1, name: 'India', makers: 72, rev: 2720000 },
                      { rank: 2, name: 'Pakistan', makers: 58, rev: 1842000 },
                      { rank: 3, name: 'Indonesia', makers: 45, rev: 1650000 },
                      { rank: 4, name: 'Morocco', makers: 45, rev: 1598000 },
                      { rank: 5, name: 'Mexico', makers: 41, rev: 1235000 },
                    ].map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '1rem 0.8rem', fontWeight: 'bold', color: item.rank === 1 ? '#C8A45D' : '#FAF9F6' }}>#{item.rank}</td>
                        <td style={{ padding: '1rem 0.8rem', fontWeight: 'bold' }}>{item.name}</td>
                        <td style={{ padding: '1rem 0.8rem' }}>{item.makers} Active</td>
                        <td style={{ padding: '1rem 0.8rem', fontWeight: 'bold', color: '#C8A45D' }}>{formatVal(item.rev, 'currency')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Top Categories */}
              <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.2)', borderRadius: '16px', padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#FAF9F6', marginBottom: '1.5rem' }}>Top Sales Categories</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {[
                    { name: 'Textiles & Shawls', rev: 4520000, pct: 35 },
                    { name: 'Ceramics & Clay', rev: 3240000, pct: 25 },
                    { name: 'Leather Bags & Saddles', rev: 2450000, pct: 19 },
                    { name: 'Woodwork & Tables', rev: 1810000, pct: 14 },
                    { name: 'Fine Jewelry', rev: 825920, pct: 7 },
                  ].map((cat, idx) => (
                    <div key={idx} style={{ fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                        <span>{cat.name}</span>
                        <strong>{formatVal(cat.rev, 'currency')} ({cat.pct}%)</strong>
                      </div>
                      <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${cat.pct * animationFactor}%`, height: '100%', backgroundColor: '#C8A45D', borderRadius: '3px' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Key Performers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase' }}>Highest Revenue Maker Studio</span>
                <h4 style={{ fontSize: '1.1rem', color: '#C8A45D', margin: '0.5rem 0' }}>Anatolian Heritage Guild</h4>
                <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: 0 }}>Turkey — Generated £450,000 for 12 woodcarvers.</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase' }}>Highest Trust Score Maker</span>
                <h4 style={{ fontSize: '1.1rem', color: '#C8A45D', margin: '0.5rem 0' }}>Aisha Heritage Textiles</h4>
                <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: 0 }}>Pakistan — 99.8% trust index based on Tariq M. audit score.</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase' }}>Most-Viewed Documentary Story</span>
                <h4 style={{ fontSize: '1.1rem', color: '#C8A45D', margin: '0.5rem 0' }}>"We weave our history into threads"</h4>
                <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: 0 }}>Fatima (Morocco) — 24,000 views, converted 850 orders.</p>
              </div>
            </div>

          </div>
        )}

        {/* ==================== 9. MARKETING OVERVIEW ==================== */}
        {activeTab === 'marketing' && !presentationMode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }} className="animate-fade-in">
            
            {/* Visitors, Conversion, CAC, LTV stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
              
              <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.2)', borderRadius: '16px', padding: '2rem' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase' }}>Website Visitors</span>
                <h2 style={{ fontSize: '2.2rem', color: '#FAF9F6', margin: '0.5rem 0', fontFamily: 'var(--font-outfit)' }}>
                  {formatVal(342000, 'number')}
                </h2>
                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Avg 11,400 daily sessions</span>
              </div>

              <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.2)', borderRadius: '16px', padding: '2rem' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase' }}>Conversion Rate</span>
                <h2 style={{ fontSize: '2.2rem', color: '#FAF9F6', margin: '0.5rem 0', fontFamily: 'var(--font-outfit)' }}>
                  {formatVal(3.82, 'percent', 2)}
                </h2>
                <span style={{ fontSize: '0.8rem', color: '#81C784' }}>+0.4% increase MTD</span>
              </div>

              <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.2)', borderRadius: '16px', padding: '2rem' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase' }}>Returning Customers</span>
                <h2 style={{ fontSize: '2.2rem', color: '#FAF9F6', margin: '0.5rem 0', fontFamily: 'var(--font-outfit)' }}>
                  {formatVal(44.5, 'percent', 1)}
                </h2>
                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Indicates strong brand trust</span>
              </div>

              <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.25)', borderRadius: '16px', padding: '2rem', borderTop: '4px solid #C8A45D' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase' }}>Newsletter Subscribers</span>
                <h2 style={{ fontSize: '2.2rem', color: '#C8A45D', margin: '0.5rem 0', fontFamily: 'var(--font-outfit)' }}>
                  {formatVal(52400, 'number')}
                </h2>
                <span style={{ fontSize: '0.8rem', color: '#81C784' }}>+12% list growth rate</span>
              </div>

            </div>

            {/* Campaign Performance & Traffic Channels */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem' }}>
              
              <div style={{ background: '#050D0B', border: '1px solid rgba(200, 164, 93, 0.15)', borderRadius: '16px', padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#FAF9F6', marginBottom: '2.5rem' }}>Campaign Performance Ledger</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {[
                    { name: 'Artisan Documentaries Series', val: 5.4, details: '5.4x ROI on £20,000 spend' },
                    { name: 'Q1 Summer Heritage Launch', val: 4.8, details: '4.8x ROI on £15,000 spend' },
                    { name: 'GI Protection Campaign', val: 4.2, details: '4.2x ROI on £10,000 spend' }
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                        <span>{item.name}</span>
                        <strong style={{ color: '#C8A45D' }}>{item.val.toFixed(1)}x ROI</strong>
                      </div>
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', opacity: 0.6 }}>{item.details}</p>
                      <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${(item.val / 6) * 100 * animationFactor}%`, height: '100%', backgroundColor: '#C8A45D', borderRadius: '3px' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.2)', borderRadius: '16px', padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#FAF9F6', marginBottom: '1.5rem' }}>Social, Organic & Paid Traffic</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '0.9rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span>Organic Search Traffic</span>
                      <strong>45%</strong>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${45 * animationFactor}%`, height: '100%', backgroundColor: '#4CAF50', borderRadius: '3px' }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span>Social Media Traffic (Stories)</span>
                      <strong>35%</strong>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${35 * animationFactor}%`, height: '100%', backgroundColor: '#C8A45D', borderRadius: '3px' }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span>Paid Target Campaigns</span>
                      <strong>20%</strong>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${20 * animationFactor}%`, height: '100%', backgroundColor: '#64B5F6', borderRadius: '3px' }}></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==================== 10. EXECUTIVE REPORTS ==================== */}
        {activeTab === 'reports' && !presentationMode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }} className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3rem', alignItems: 'start' }}>
              
              <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.25)', borderRadius: '16px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#C8A45D', margin: 0, fontFamily: 'var(--font-outfit)', fontWeight: 'bold' }}>Report Configuration</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Select Report Frequency</span>
                  <select 
                    value={reportFreq} 
                    onChange={(e: any) => setReportFreq(e.target.value)}
                    style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(200, 164, 93, 0.3)', backgroundColor: '#050D0B', color: '#FAF9F6', fontSize: '0.9rem' }}
                  >
                    <option value="daily">Daily Administrative Sync</option>
                    <option value="weekly">Weekly Operational Report</option>
                    <option value="monthly">Monthly Sourcing & Financials</option>
                    <option value="quarterly">Quarterly Expansion Ledger</option>
                    <option value="yearly">Yearly Platform ESG Audit</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Export Format</span>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {['pdf', 'excel', 'csv'].map(format => (
                      <button
                        key={format}
                        onClick={() => setReportFormat(format as any)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          border: `1px solid ${reportFormat === format ? '#C8A45D' : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: '8px',
                          backgroundColor: reportFormat === format ? 'rgba(200,164,93,0.1)' : 'transparent',
                          color: reportFormat === format ? '#C8A45D' : '#FAF9F6',
                          textTransform: 'uppercase',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerateReport}
                  disabled={simulatingDownload}
                  className="btn-accent"
                  style={{ padding: '0.8rem', marginTop: '1rem', fontSize: '0.9rem' }}
                >
                  {simulatingDownload ? 'Assembling Report Metadata...' : 'Compile & Export Report'}
                </button>

                {downloadSuccess && (
                  <div style={{ padding: '1rem', border: '1px solid #388E3C', borderRadius: '8px', backgroundColor: '#e8f5e9', color: '#2e7d32', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    ✓ Export complete: {downloadSuccess} saved to downloads.
                  </div>
                )}
              </div>

              <div style={{ background: '#050D0B', border: '1px solid rgba(200, 164, 93, 0.15)', borderRadius: '16px', padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#FAF9F6', marginBottom: '0.5rem' }}>Live Report Preview</h3>
                <span style={{ fontSize: '0.8rem', opacity: 0.6, display: 'block', marginBottom: '1.5rem' }}>Frequency: {reportFreq.toUpperCase()} | Format: {reportFormat.toUpperCase()}</span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Report Title</span>
                    <strong>Britsync Global Sourcing Ledger Q2 2026</strong>
                  </div>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Generated Timestamp</span>
                    <strong>{new Date().toLocaleString()}</strong>
                  </div>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Artisans Accounted</span>
                    <strong>5,120 onboarded</strong>
                  </div>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Revenue Summed</span>
                    <strong>£12,845,920</strong>
                  </div>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Inspections Cleared</span>
                    <strong>860 workshops</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================== 11. INVESTOR OVERVIEW (PRESENTATION DECK) ==================== */}
        {activeTab === 'investor' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#050D0B', padding: '1.5rem 2rem', borderRadius: '12px', border: '1px solid rgba(200, 164, 93, 0.15)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Britsync Pitch Deck</span>
                <h3 style={{ fontSize: '1.2rem', color: '#FAF9F6', margin: 0 }}>Presentation-Ready Investor Overview</h3>
              </div>
              <button
                onClick={() => setPresentationMode(!presentationMode)}
                className="btn-accent"
                style={{ padding: '0.6rem 1.5rem', fontSize: '0.8rem', borderRadius: '20px' }}
              >
                {presentationMode ? 'Exit Presentation Mode' : 'Enter Presentation Mode (Full Screen)'}
              </button>
            </div>

            <div style={{
              background: 'radial-gradient(circle at center, #0F2C26, #050D0B)',
              border: presentationMode ? '2px solid #C8A45D' : '1px solid rgba(200,164,93,0.15)',
              borderRadius: '16px',
              padding: presentationMode ? '4rem' : '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: presentationMode ? '70vh' : '500px',
              transition: 'all 0.4s ease',
              boxShadow: presentationMode ? '0 12px 64px rgba(0,0,0,0.6)' : 'none'
            }}>
              
              {selectedInvestorSlide === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div style={{ borderBottom: '1px solid rgba(200,164,93,0.2)', paddingBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#C8A45D', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Slide 1 of 4: Introduction</span>
                    <h2 style={{ fontSize: presentationMode ? '3.5rem' : '2.5rem', fontFamily: 'var(--font-outfit)', margin: '0.5rem 0', color: '#FAF9F6' }}>The Britsync Investment Thesis</h2>
                  </div>
                  <p style={{ fontSize: presentationMode ? '1.5rem' : '1.1rem', lineHeight: 1.7, opacity: 0.9, maxWidth: '900px' }}>
                    Britsync is building a new protocol for authentic global commerce. By physically inspecting and validating rural artisan communities, we offer high-end buyers verified heritage products while sending 60% of all gross sales directly into maker economies.
                  </p>
                  <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem 2rem', borderRadius: '8px' }}>
                      <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.6 }}>Trust Score</span>
                      <strong style={{ fontSize: '1.8rem', color: '#C8A45D' }}>4.85 / 5</strong>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem 2rem', borderRadius: '8px' }}>
                      <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.6 }}>Platform Uptime</span>
                      <strong style={{ fontSize: '1.8rem', color: '#388E3C' }}>99.98%</strong>
                    </div>
                  </div>
                </div>
              )}

              {selectedInvestorSlide === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div style={{ borderBottom: '1px solid rgba(200,164,93,0.2)', paddingBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#C8A45D', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Slide 2 of 4: Financial Growth</span>
                    <h2 style={{ fontSize: presentationMode ? '3.5rem' : '2.5rem', fontFamily: 'var(--font-outfit)', margin: '0.5rem 0', color: '#FAF9F6' }}>Exceptional Growth Trajectory</h2>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                    <div style={{ padding: '1.5rem', borderLeft: '4px solid #C8A45D', background: 'rgba(255,255,255,0.02)' }}>
                      <span style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase' }}>Company Growth</span>
                      <h3 style={{ fontSize: '2.5rem', margin: '0.5rem 0', color: '#FAF9F6' }}>{formatVal(42, 'percent')}<span style={{ fontSize: '1.2rem', color: '#81C784' }}> YoY</span></h3>
                    </div>
                    <div style={{ padding: '1.5rem', borderLeft: '4px solid #C8A45D', background: 'rgba(255,255,255,0.02)' }}>
                      <span style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase' }}>Revenue Growth</span>
                      <h3 style={{ fontSize: '2.5rem', margin: '0.5rem 0', color: '#FAF9F6' }}>{formatVal(48, 'percent')}<span style={{ fontSize: '1.2rem', color: '#81C784' }}> YoY</span></h3>
                    </div>
                    <div style={{ padding: '1.5rem', borderLeft: '4px solid #C8A45D', background: 'rgba(255,255,255,0.02)' }}>
                      <span style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase' }}>Marketplace Growth</span>
                      <h3 style={{ fontSize: '2.5rem', margin: '0.5rem 0', color: '#FAF9F6' }}>{formatVal(38, 'percent')}<span style={{ fontSize: '1.2rem', color: '#81C784' }}> YoY</span></h3>
                    </div>
                    <div style={{ padding: '1.5rem', borderLeft: '4px solid #C8A45D', background: 'rgba(255,255,255,0.02)' }}>
                      <span style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase' }}>Customer Retention</span>
                      <h3 style={{ fontSize: '2.5rem', margin: '0.5rem 0', color: '#FAF9F6' }}>{formatVal(92, 'percent')}</h3>
                    </div>
                  </div>
                </div>
              )}

              {selectedInvestorSlide === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div style={{ borderBottom: '1px solid rgba(200,164,93,0.2)', paddingBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#C8A45D', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Slide 3 of 4: Global Expansion Scale</span>
                    <h2 style={{ fontSize: presentationMode ? '3.5rem' : '2.5rem', fontFamily: 'var(--font-outfit)', margin: '0.5rem 0', color: '#FAF9F6' }}>Global Supply Scale</h2>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.2rem', borderRadius: '12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', opacity: 0.6, display: 'block', textTransform: 'uppercase' }}>Connected Countries</span>
                      <strong style={{ fontSize: '2.2rem', color: '#FAF9F6' }}>{formatVal(28)}</strong>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.2rem', borderRadius: '12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', opacity: 0.6, display: 'block', textTransform: 'uppercase' }}>Elite Verified Makers</span>
                      <strong style={{ fontSize: '2.2rem', color: '#C8A45D' }}>{formatVal(1420)}</strong>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.2rem', borderRadius: '12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', opacity: 0.6, display: 'block', textTransform: 'uppercase' }}>Total Active Buyers</span>
                      <strong style={{ fontSize: '2.2rem', color: '#FAF9F6' }}>{formatVal(8429)}</strong>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.2rem', borderRadius: '12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', opacity: 0.6, display: 'block', textTransform: 'uppercase' }}>Total Orders Filled</span>
                      <strong style={{ fontSize: '2.2rem', color: '#FAF9F6' }}>{formatVal(14829)}</strong>
                    </div>
                  </div>
                </div>
              )}

              {selectedInvestorSlide === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div style={{ borderBottom: '1px solid rgba(200,164,93,0.2)', paddingBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#C8A45D', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Slide 4 of 4: Business Model Unit Economics</span>
                    <h2 style={{ fontSize: presentationMode ? '3.5rem' : '2.5rem', fontFamily: 'var(--font-outfit)', margin: '0.5rem 0', color: '#FAF9F6' }}>Unit Economics & Financials</h2>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
                    <div style={{ padding: '1.5rem', background: '#0F2C26', borderRadius: '12px', border: '1px solid rgba(200,164,93,0.2)' }}>
                      <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase' }}>Average Order Value</span>
                      <h4 style={{ fontSize: '2.2rem', margin: '0.5rem 0', color: '#FAF9F6' }}>{formatVal(186, 'currency')}</h4>
                    </div>
                    <div style={{ padding: '1.5rem', background: '#0F2C26', borderRadius: '12px', border: '1px solid rgba(200,164,93,0.2)' }}>
                      <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase' }}>Platform Profit Margin</span>
                      <h4 style={{ fontSize: '2.2rem', margin: '0.5rem 0', color: '#C8A45D' }}>{formatVal(40, 'percent')}</h4>
                    </div>
                    <div style={{ padding: '1.5rem', background: '#0F2C26', borderRadius: '12px', border: '1px solid rgba(200,164,93,0.2)' }}>
                      <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase' }}>Repeat Purchase Rate</span>
                      <h4 style={{ fontSize: '2.2rem', margin: '0.5rem 0', color: '#FAF9F6' }}>64%</h4>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation controls within slides */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
                <button
                  disabled={selectedInvestorSlide === 0}
                  onClick={() => setSelectedInvestorSlide(selectedInvestorSlide - 1)}
                  style={{
                    backgroundColor: selectedInvestorSlide === 0 ? 'transparent' : 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: selectedInvestorSlide === 0 ? 'rgba(255,255,255,0.2)' : '#FAF9F6',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '4px',
                    cursor: selectedInvestorSlide === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}
                >
                  ← Previous Slide
                </button>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[0, 1, 2, 3].map(s => (
                    <span 
                      key={s} 
                      onClick={() => setSelectedInvestorSlide(s)}
                      style={{ 
                        display: 'block', 
                        width: '10px', 
                        height: '10px', 
                        borderRadius: '50%', 
                        backgroundColor: selectedInvestorSlide === s ? '#C8A45D' : 'rgba(255,255,255,0.15)',
                        cursor: 'pointer' 
                      }} 
                    />
                  ))}
                </div>
                <button
                  disabled={selectedInvestorSlide === 3}
                  onClick={() => setSelectedInvestorSlide(selectedInvestorSlide + 1)}
                  style={{
                    backgroundColor: selectedInvestorSlide === 3 ? 'transparent' : 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: selectedInvestorSlide === 3 ? 'rgba(255,255,255,0.2)' : '#FAF9F6',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '4px',
                    cursor: selectedInvestorSlide === 3 ? 'not-allowed' : 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}
                >
                  Next Slide →
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ==================== 12. EXPORT READINESS SCORE DASHBOARD ==================== */}
        {activeTab === 'readiness' && !presentationMode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }} className="animate-fade-in">
            
            {/* Top Row Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
              
              <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.2)', borderRadius: '16px', padding: '2rem' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Platform Export Readiness</span>
                <h2 style={{ fontSize: '2.5rem', color: '#C8A45D', margin: '0.5rem 0', fontFamily: 'var(--font-outfit)' }}>
                  {formatVal(92)}<span style={{ fontSize: '1.2rem', color: '#FAF9F6', opacity: 0.5 }}> / 100</span>
                </h2>
                <span style={{ fontSize: '0.8rem', color: '#81C784' }}>✓ Excellent Scale AQL</span>
              </div>

              <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.2)', borderRadius: '16px', padding: '2rem' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Crate Packing Compliance</span>
                <h2 style={{ fontSize: '2.2rem', color: '#FAF9F6', margin: '0.5rem 0', fontFamily: 'var(--font-outfit)' }}>
                  {formatVal(95, 'percent')}
                </h2>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Insulated organic timber</span>
              </div>

              <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.2)', borderRadius: '16px', padding: '2rem' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Customs Pre-Clearance Rate</span>
                <h2 style={{ fontSize: '2.2rem', color: '#FAF9F6', margin: '0.5rem 0', fontFamily: 'var(--font-outfit)' }}>
                  {formatVal(91, 'percent')}
                </h2>
                <span style={{ fontSize: '0.8rem', color: '#81C784' }}>Zero customs disputes</span>
              </div>

              <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.25)', borderRadius: '16px', padding: '2rem', borderTop: '4px solid #C8A45D' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Labor Ethics Verification</span>
                <h2 style={{ fontSize: '2.2rem', color: '#C8A45D', margin: '0.5rem 0', fontFamily: 'var(--font-outfit)' }}>
                  {formatVal(100, 'percent')}
                </h2>
                <span style={{ fontSize: '0.8rem', color: '#81C784' }}>100% Fair Wages verified</span>
              </div>

            </div>

            {/* Interactive Calculator and Leaderboard */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '3rem', alignItems: 'start' }}>
              
              {/* Calculator Section */}
              <div style={{ background: '#0F2C26', border: '1px solid rgba(200, 164, 93, 0.25)', borderRadius: '16px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#C8A45D', margin: 0, fontFamily: 'var(--font-outfit)', fontWeight: 'bold' }}>Artisan Export Readiness Calculator</h3>
                <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: 0, lineHeight: 1.5 }}>
                  Configure and verify individual artisan workshops against Britsync's compliance checklists. Score adjusts instantly based on inspection checkpoints.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Select Sourcing Studio</span>
                  <select 
                    value={selectedReadinessArtisan} 
                    onChange={(e: any) => setSelectedReadinessArtisan(e.target.value)}
                    style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(200, 164, 93, 0.3)', backgroundColor: '#050D0B', color: '#FAF9F6', fontSize: '0.9rem' }}
                  >
                    <option value="Aisha Heritage Textiles">Aisha Heritage Textiles (Pakistan)</option>
                    <option value="Atlas Woods Studio">Atlas Woods Studio (Morocco)</option>
                    <option value="Cusco Weavers Cooperative">Cusco Weavers Cooperative (Peru)</option>
                    <option value="Anatolian Heritage Guild">Anatolian Heritage Guild (Turkey)</option>
                    <option value="Bursa Ceramics Studio">Bursa Ceramics Studio (Turkey)</option>
                  </select>
                </div>

                {/* Checklist options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="checkbox" 
                      checked={readinessChecklist.crate} 
                      onChange={(e) => setReadinessChecklist({ ...readinessChecklist, crate: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#C8A45D' }} 
                    />
                    <div>
                      <strong>Custom Crate Packing Verified (+20%)</strong>
                      <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.6 }}>Insulated in solid organic timber crates for international haulage.</span>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="checkbox" 
                      checked={readinessChecklist.passport} 
                      onChange={(e) => setReadinessChecklist({ ...readinessChecklist, passport: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#C8A45D' }} 
                    />
                    <div>
                      <strong>Digital Product Passport Minted (+25%)</strong>
                      <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.6 }}>Cryptographic proof of origin and AQL quality checks.</span>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="checkbox" 
                      checked={readinessChecklist.customs} 
                      onChange={(e) => setReadinessChecklist({ ...readinessChecklist, customs: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#C8A45D' }} 
                    />
                    <div>
                      <strong>Port Customs Pre-Clearance Done (+20%)</strong>
                      <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.6 }}>HS codes, invoice registries, and customs declarations completed.</span>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="checkbox" 
                      checked={readinessChecklist.labor} 
                      onChange={(e) => setReadinessChecklist({ ...readinessChecklist, labor: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#C8A45D' }} 
                    />
                    <div>
                      <strong>Fair Trade Labor Certified (+20%)</strong>
                      <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.6 }}>Physical verification of fair wages, working hours, and zero child labor.</span>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="checkbox" 
                      checked={readinessChecklist.materials} 
                      onChange={(e) => setReadinessChecklist({ ...readinessChecklist, materials: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#C8A45D' }} 
                    />
                    <div>
                      <strong>Safe Raw Materials Inspected (+15%)</strong>
                      <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.6 }}>Sourced organic fibers, lead-free glazes, and non-toxic dyes.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Score Display Card */}
              <div style={{ background: '#050D0B', border: '1px solid rgba(200, 164, 93, 0.15)', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                <h4 style={{ color: '#C8A45D', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', margin: 0 }}>Simulated Scorecard</h4>
                <strong style={{ fontSize: '1.2rem', color: '#FAF9F6' }}>{selectedReadinessArtisan}</strong>
                
                {/* SVG Progress Ring */}
                {(() => {
                  const score = (readinessChecklist.crate ? 20 : 0) + 
                                (readinessChecklist.passport ? 25 : 0) + 
                                (readinessChecklist.customs ? 20 : 0) + 
                                (readinessChecklist.labor ? 20 : 0) + 
                                (readinessChecklist.materials ? 15 : 0);
                  const strokeDash = 2 * Math.PI * 55; 
                  const offset = strokeDash - (score / 100) * strokeDash;
                  let statusText = 'Transit Restrained';
                  let statusColor = 'var(--error)';
                  if (score >= 90) {
                    statusText = 'Ready for Export';
                    statusColor = '#4CAF50';
                  } else if (score >= 60) {
                    statusText = 'Needs Auditing';
                    statusColor = '#C8A45D';
                  }
                  
                  return (
                    <>
                      <div style={{ position: 'relative', width: '140px', height: '140px' }}>
                        <svg width="140" height="140" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                          <circle cx="60" cy="60" r="55" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                          <circle 
                            cx="60" 
                            cy="60" 
                            r="55" 
                            fill="none" 
                            stroke={statusColor} 
                            strokeWidth="6" 
                            strokeDasharray={strokeDash}
                            strokeDashoffset={offset}
                            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                          />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <strong style={{ fontSize: '2rem', color: '#FAF9F6' }}>{score}</strong>
                          <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>/ 100</span>
                        </div>
                      </div>
                      <div>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.4rem 1rem',
                          borderRadius: '20px',
                          backgroundColor: statusColor === 'var(--error)' ? 'rgba(211,47,47,0.15)' : statusColor === '#C8A45D' ? 'rgba(200,164,93,0.15)' : 'rgba(76,175,80,0.15)',
                          color: statusColor,
                          fontWeight: 'bold',
                          fontSize: '0.85rem'
                        }}>
                          {statusText}
                        </span>
                      </div>
                    </>
                  );
                })()}

                <button
                  onClick={() => alert(`Readiness passport locked for ${selectedReadinessArtisan}. Cryptographic tags published to customs blockchain.`)}
                  className="btn-primary"
                  style={{ padding: '0.75rem 2rem', fontSize: '0.85rem', width: '100%', marginTop: '1rem' }}
                >
                  Publish Readiness Passport
                </button>
              </div>

            </div>
          </div>
        )}

      </section>

    </div>
  );
}
