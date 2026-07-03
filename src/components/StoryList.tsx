"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function StoryList({ stories }: { stories: any[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredStories = stories.filter(story => {
    const matchesSearch = 
      story.title.toLowerCase().includes(search.toLowerCase()) ||
      story.country.toLowerCase().includes(search.toLowerCase()) ||
      story.craft.toLowerCase().includes(search.toLowerCase()) ||
      story.maker.businessName.toLowerCase().includes(search.toLowerCase());
      
    if (filter === "Elite Makers") return matchesSearch && story.maker.verificationStatus === "ELITE";
    if (filter === "GI Products") return matchesSearch && story.maker.verificationStatus === "GI";
    
    return matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <input 
          type="text" 
          placeholder="Search by Country, Craft, or Title..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '1rem 1.5rem', width: '100%', maxWidth: '500px', borderRadius: '50px', border: '1px solid #ccc', fontSize: '1.1rem' }}
        />
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem', flexWrap: 'wrap' }}>
        {["All", "Elite Makers", "GI Products", "Newest"].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            style={{ 
              padding: '0.75rem 1.5rem', 
              borderRadius: '20px', 
              border: 'none', 
              backgroundColor: filter === f ? 'var(--primary)' : 'var(--surface)',
              color: filter === f ? 'var(--background)' : 'var(--primary)',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.3s ease'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '3rem' }}>
        {filteredStories.map(story => (
          <Link href={`/stories/${story.id}`} key={story.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card story-card" style={{ padding: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.4s ease, box-shadow 0.4s ease' }}>
              <div style={{ height: '250px', overflow: 'hidden' }}>
                <img 
                  src={story.heroImage} 
                  alt={story.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                  className="story-img"
                />
              </div>
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
                    {story.country} • {story.craft}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1rem', lineHeight: 1.3 }}>{story.title}</h2>
                <p style={{ opacity: 0.8, lineHeight: 1.6, marginBottom: '2rem', flex: 1 }}>{story.excerpt}</p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--secondary)', backgroundImage: `url(${story.maker.founderPhoto || ''})`, backgroundSize: 'cover' }}></div>
                   <div>
                     <p style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--primary)' }}>{story.maker.businessName}</p>
                     <p style={{ fontSize: '0.8rem', color: '#666' }}>{story.village}</p>
                   </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .story-card:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow-lg) !important;
        }
        .story-card:hover .story-img {
          transform: scale(1.1);
        }
      `}} />
    </div>
  );
}
