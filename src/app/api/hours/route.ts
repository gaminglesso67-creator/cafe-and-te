import { NextResponse } from 'next/server';
import { getStore } from '@/lib/db';
import { getLiveOpenStatus } from '@/lib/seed-data';

export async function GET() {
  const store = getStore();
  const status = getLiveOpenStatus(store.openingHours);
  return NextResponse.json({
    isOpen: status.isOpen,
    todaySlot: status.todaySlot,
    hours: store.openingHours,
  });
}

