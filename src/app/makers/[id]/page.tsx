import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import MakerDetailsClient from '@/components/MakerDetailsClient';

export default async function MakerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const maker = await prisma.makerProfile.findUnique({
    where: { id },
    include: {
      user: true,
      products: true,
      stories: true
    }
  });

  if (!maker) {
    notFound();
  }

  return (
    <main className="animate-fade-in" style={{ backgroundColor: 'var(--background)' }}>
      <MakerDetailsClient 
        maker={maker} 
        products={maker.products} 
        stories={maker.stories} 
      />
    </main>
  );
}

