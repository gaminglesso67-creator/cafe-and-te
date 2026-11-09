import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/db';
import { dispatchNotification } from '@/lib/notifications/service';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const found = getStore().reservations.find((r) => r.id === params.id);
  if (!found) {
    return NextResponse.json({ error: '{{RESERVATION_NOT_FOUND}}' }, { status: 404 });
  }
  return NextResponse.json({ reservation: found });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => ({}));
  const store = getStore();
  const target = store.reservations.find((r) => r.id === params.id);
  if (!target) {
    return NextResponse.json({ error: '{{RESERVATION_NOT_FOUND}}' }, { status: 404 });
  }

  if (body.status) {
    target.status = body.status;
    if (body.status === 'cancelled') {
      await dispatchNotification({
        eventKey: 'RESERVATION_CANCELLED',
        channel: 'SMS',
        recipient: target.guestPhone,
        variables: { id: target.id },
      });
    }
  }

  return NextResponse.json({ reservation: target });
}
