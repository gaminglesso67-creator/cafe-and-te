import { NextResponse } from 'next/server';
import { getStore } from '@/lib/db';

export async function GET() {
  const store = getStore();
  return NextResponse.json({
    orderingEnabled: store.orderingEnabled,
    categories: store.categories,
    items: store.menuItems,
  });
}

