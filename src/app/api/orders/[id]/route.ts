import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const found = getStore().orders.find((o) => o.id === params.id);
  if (!found) {
    return NextResponse.json({ error: '{{ORDER_NOT_FOUND}}' }, { status: 404 });
  }
  return NextResponse.json({ order: found });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => ({}));
  const found = getStore().orders.find((o) => o.id === params.id);
  if (!found) {
    return NextResponse.json({ error: '{{ORDER_NOT_FOUND}}' }, { status: 404 });
  }
  if (body.status) {
    found.status = body.status;
  }
  return NextResponse.json({ order: found });
}

