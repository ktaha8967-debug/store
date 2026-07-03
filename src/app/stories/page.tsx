import { prisma } from '@/lib/prisma';
import StoryList from '@/components/StoryList';

export default async function StoriesPage() {
  const stories = await prisma.story.findMany({
    include: {
      maker: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <main className="animate-fade-in" style={{ backgroundColor: 'var(--background)', minHeight: '100vh', paddingTop: '8rem', paddingBottom: '6rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', color: 'var(--primary)', marginBottom: '1rem' }}>Maker Stories</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '4rem', lineHeight: 1.8 }}>
          Every product on Britsync Market carries a story. Discover the incredible journeys of our artisans, the challenges they overcome, and the heritage they protect.
        </p>
      </div>
      
      <StoryList stories={stories} />
    </main>
  );
}
