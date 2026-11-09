import { NextResponse } from 'next/server';
import { getStore } from '@/lib/db';

export async function GET() {
  const store = getStore();
  return NextResponse.json({
    reviews: store.reviews.filter((r) => r.isPublished),
  });
}
