"use client";

import { useState } from 'react';
import Link from 'next/link';

interface MakerProfileWithCounts {
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
  products: { id: string }[];
  stories: { id: string }[];
}

export default function MakerList({ makers }: { makers: MakerProfileWithCounts[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("default");

  const filteredMakers = makers
    .filter(maker => {
      const matchesSearch = 
        maker.businessName.toLowerCase().includes(search.toLowerCase()) ||
        (maker.founderName && maker.founderName.toLowerCase().includes(search.toLowerCase())) ||
        maker.country.toLowerCase().includes(search.toLowerCase()) ||
        (maker.businessStory && maker.businessStory.toLowerCase().includes(search.toLowerCase()));
        
      const matchesStatus = 
        statusFilter === "ALL" || 
        maker.verificationStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "years") {
        return b.yearsInBusiness - a.yearsInBusiness;
      }
      if (sortBy === "employees") {
        return b.employeeCount - a.employeeCount;
      }
      if (sortBy === "products") {
        return b.products.length - a.products.length;
      }
      return 0; // default order from database
    });

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'ELITE':
        return { backgroundColor: 'var(--primary)', color: 'var(--accent)', border: '1px solid var(--accent)' };
      case 'GI':
        return { backgroundColor: 'var(--accent)', color: 'var(--primary)', fontWeight: 'bold' };
      case 'VERIFIED':
        return { backgroundColor: 'var(--secondary)', color: 'var(--primary)' };
      default:
        return { backgroundColor: 'rgba(0,0,0,0.05)', color: 'var(--text)' };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ELITE': return 'Elite Master';
      case 'GI': return 'GI Certified';
      case 'VERIFIED': return 'Verified Maker';
      default: return 'General Maker';
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
      
      {/* Search and Filters panel */}
      <div style={{ 
        display: 'flex', 
        gap: '1.5rem', 
        marginBottom: '4rem', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'var(--surface)',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search makers by name, country, or craft..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              padding: '1rem 1.5rem', 
              width: '100%', 
              borderRadius: '50px', 
              border: '1px solid var(--glass-border)', 
              backgroundColor: 'var(--background)',
              color: 'var(--text)',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.3s ease'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Status Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {["ALL", "VERIFIED", "ELITE", "GI"].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '0.5rem 1.2rem',
                  borderRadius: '20px',
                  backgroundColor: statusFilter === status ? 'var(--primary)' : 'var(--background)',
                  color: statusFilter === status ? 'var(--background)' : 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  border: statusFilter === status ? 'none' : '1px solid var(--glass-border)'
                }}
              >
                {status === "ALL" ? "All Status" : getStatusText(status)}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: '20px',
              border: '1px solid var(--glass-border)',
              backgroundColor: 'var(--surface)',
              color: 'var(--text)',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="default">Sort by: Default</option>
            <option value="years">Years in Business</option>
            <option value="employees">Artisans Employed</option>
            <option value="products">Number of Products</option>
          </select>
        </div>
      </div>

      {/* Grid of Makers */}
      {filteredMakers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.7 }}>
          <h3>No makers found matching your criteria.</h3>
          <p>Try resetting the search or filter settings.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '3rem' }}>
          {filteredMakers.map(maker => (
            <div key={maker.id} className="card maker-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Cover Banner background */}
              <div style={{ 
                height: '140px', 
                backgroundImage: maker.coverImage ? `url(${maker.coverImage})` : 'none', 
                backgroundColor: 'var(--primary)',
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4))'
                }} />
                
                {/* Verification Badge */}
                <span style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  padding: '0.4rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  boxShadow: 'var(--shadow-sm)',
                  ...getStatusBadgeStyles(maker.verificationStatus)
                }}>
                  {getStatusText(maker.verificationStatus)}
                </span>
              </div>

              {/* Card Body details */}
              <div style={{ padding: '2.5rem 2rem 2rem', position: 'relative', display: 'flex', flexDirection: 'column', flex: 1 }}>
                
                {/* Overlapping Rounded Photo */}
                <div style={{ 
                  width: '90px', 
                  height: '90px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--secondary)', 
                  backgroundImage: maker.founderPhoto ? `url(${maker.founderPhoto})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '4px solid var(--surface)',
                  boxShadow: 'var(--shadow-md)',
                  position: 'absolute',
                  top: '-45px',
                  left: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  fontSize: '2rem',
                  fontWeight: 'bold'
                }}>
                  {!maker.founderPhoto && maker.businessName.charAt(0)}
                </div>

                <div style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: '400' }}>{maker.businessName}</h2>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', opacity: 0.7, fontSize: '0.9rem' }}>
                    <span>📍 {maker.country}</span>
                    <span>•</span>
                    <span>Established {maker.yearsInBusiness} yrs ago</span>
                  </div>
                </div>

                {maker.founderName && (
                  <p style={{ fontSize: '0.95rem', color: 'var(--text)', opacity: 0.8, marginBottom: '1rem' }}>
                    <strong>Founder:</strong> {maker.founderName}
                  </p>
                )}

                <p style={{ 
                  fontSize: '0.95rem', 
                  lineHeight: 1.6, 
                  opacity: 0.85, 
                  marginBottom: '2rem',
                  flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  "{maker.founderStory || maker.businessStory || 'No story details provided yet.'}"
                </p>

                {/* Counts and details */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  borderTop: '1px solid var(--glass-border)', 
                  paddingTop: '1.5rem',
                  marginTop: 'auto'
                }}>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', opacity: 0.7, fontWeight: 'bold' }}>
                    <span>{maker.products.length} Products</span>
                    <span>•</span>
                    <span>{maker.stories.length} Stories</span>
                  </div>

                  <Link href={`/makers/${maker.id}`}>
                    <button className="btn-primary" style={{ padding: '0.6rem 1.5rem', borderRadius: '25px', fontSize: '0.85rem' }}>
                      View Profile
                    </button>
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .maker-card {
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .maker-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg) !important;
        }
      `}} />
    </div>
  );
}
