import { NextRequest, NextResponse } from 'next/server';
import { getStore, ReservationRecord } from '@/lib/db';
import { reservationSchema } from '@/lib/validations/schemas';
import { checkRateLimit, isHoneypotTriggered } from '@/lib/security/spam-guard';
import { dispatchNotification } from '@/lib/notifications/service';
import { syncReservationToSanity } from '@/sanity/lib/fetchers';

const MAX_SLOT_CAPACITY = 40;

export async function GET() {
  return NextResponse.json({ reservations: getStore().reservations });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'local';
  const rate = checkRateLimit(`reservations:${ip}`, 10, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: '{{RATE_LIMIT_EXCEEDED}}' },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: '{{INVALID_JSON_PAYLOAD}}' }, { status: 400 });
  }

  if (isHoneypotTriggered(body.honeypot)) {
    return NextResponse.json({ status: 'ignored' }, { status: 200 });
  }

  const parsed = reservationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: '{{RESERVATION_VALIDATION_FAILED}}', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const store = getStore();

  // Check slot capacity (PRD 8.1)
  const currentBooked = store.reservations
    .filter(
      (r) =>
        r.date === data.date &&
        r.timeSlot === data.timeSlot &&
        (r.status === 'confirmed' || r.status === 'pending')
    )
    .reduce((sum, r) => sum + r.partySize, 0);

  if (currentBooked + data.partySize > MAX_SLOT_CAPACITY) {
    return NextResponse.json(
      { error: '{{RESERVATION_SLOT_AT_CAPACITY}}' },
      { status: 409 }
    );
  }

  const status: ReservationRecord['status'] = store.autoConfirmReservations
    ? 'confirmed'
    : 'pending';

  const record: ReservationRecord = {
    id: `RES-${Date.now().toString().slice(-4)}`,
    reservationCode: `BK-${Date.now().toString().slice(-4)}`,
    guestName: data.name,
    guestPhone: data.phone,
    guestEmail: data.email || undefined,
    date: data.date,
    timeSlot: data.timeSlot,
    partySize: data.partySize,
    occasion: data.occasion,
    specialRequests: data.specialRequests,
    status,
    createdAt: new Date().toISOString(),
  };

  store.reservations.unshift(record);
  await syncReservationToSanity(record);

  // Dispatch Customer & Restaurant notifications (PRD 8.1 & 8.4)
  await dispatchNotification({
    eventKey: status === 'confirmed' ? 'RESERVATION_CONFIRMED' : 'RESERVATION_RECEIVED',
    channel: 'WHATSAPP',
    recipient: record.guestPhone,
    variables: { id: record.id, date: record.date, time: record.timeSlot },
  });

  await dispatchNotification({
    eventKey: 'ADMIN_NEW_RESERVATION_ALERT',
    channel: 'ADMIN_ALERT',
    recipient: 'admin@caffete.local',
    variables: { id: record.id, partySize: record.partySize },
  });

  return NextResponse.json({ reservation: record }, { status: 201 });
}

