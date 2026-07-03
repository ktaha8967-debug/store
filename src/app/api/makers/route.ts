import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateSellingPrice } from '@/lib/pricing';

export async function GET(request: Request) {
  try {
    const makers = await prisma.makerProfile.findMany({
      include: {
        products: true,
      },
    });
    const mappedMakers = makers.map(maker => ({
      ...maker,
      products: maker.products.map(product => ({
        ...product,
        price: calculateSellingPrice(product.price)
      }))
    }));
    return NextResponse.json(mappedMakers);
  } catch (error) {
    console.error('Failed to fetch makers:', error);
    return NextResponse.json({ error: 'Failed to fetch makers' }, { status: 500 });
  }
}
