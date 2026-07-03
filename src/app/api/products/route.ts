import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateSellingPrice } from '@/lib/pricing';

export async function GET(request: Request) {
  try {
    const products = await prisma.product.findMany({
      include: {
        maker: true,
      },
    });
    const mappedProducts = products.map(product => ({
      ...product,
      price: calculateSellingPrice(product.price)
    }));
    return NextResponse.json(mappedProducts);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
