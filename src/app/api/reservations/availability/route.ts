import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/db';

const MAX_SLOT_CAPACITY = 40;

/**
 * Reservation Slot Availability Check (`GET /api/reservations/availability`, PRD 8.1 & 11.4).
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date') ?? '2026-11-15';
  const timeSlot = searchParams.get('timeSlot') ?? '20:00';
  const partySize = Number(searchParams.get('partySize') ?? 2);

  const store = getStore();
  const bookedGuests = store.reservations
    .filter(
      (r) =>
        r.date === date &&
        r.timeSlot === timeSlot &&
        (r.status === 'confirmed' || r.status === 'pending')
    )
    .reduce((sum, r) => sum + r.partySize, 0);

  const remainingCapacity = Math.max(0, MAX_SLOT_CAPACITY - bookedGuests);
  const available = partySize <= 12 && remainingCapacity >= partySize;

  return NextResponse.json({
    date,
    timeSlot,
    partySize,
    available,
    remainingCapacity,
    maxSlotCapacity: MAX_SLOT_CAPACITY,
  });
}
