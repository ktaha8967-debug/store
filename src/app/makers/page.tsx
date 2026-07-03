import { prisma } from '@/lib/prisma';
import MakerList from '@/components/MakerList';

export default async function MakersPage() {
  const makers = await prisma.makerProfile.findMany({
    include: {
      user: true,
      products: {
        select: { id: true }
      },
      stories: {
        select: { id: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <main className="animate-fade-in" style={{ backgroundColor: 'var(--background)', minHeight: '100vh', paddingTop: '8rem', paddingBottom: '6rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', color: 'var(--primary)', marginBottom: '1rem' }}>Meet Our Makers</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '4rem', lineHeight: 1.8 }}>
          Discover the artisans behind the authentic pieces. Britsync connects you directly with local studios preserving heritage craft traditions worldwide.
        </p>
      </div>
      
      <MakerList makers={makers} />
    </main>
  );
}

