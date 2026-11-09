import { NextResponse } from 'next/server';
import { getStore } from '@/lib/db';

export async function GET() {
  const store = getStore();
  return NextResponse.json({
    offers: store.offers.filter((o) => o.isActive),
    events: store.events,
  });
}

