import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/db';

const BRIDGE_SECRET =
  process.env.POS_BRIDGE_TOKEN ?? 'pos_bridge_pull_secret_placeholder';

/**
 * Token-Authenticated Local POS Bridge Endpoint (`/api/bridge/orders`, PRD 10.1 #3 & 11.4):
 * Allows a local restaurant PC bridge agent to pull paid orders and acknowledge receipt.
 */
export async function GET(req: NextRequest) {
  const token = req.headers.get('x-bridge-token');
  if (token !== BRIDGE_SECRET) {
    return NextResponse.json({ error: '{{UNAUTHORIZED_BRIDGE_TOKEN}}' }, { status: 401 });
  }

  const pendingOrders = getStore().orders.filter(
    (o) => o.paymentStatus === 'CAPTURED' || o.paymentMethod === 'COD'
  );
  return NextResponse.json({ orders: pendingOrders });
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-bridge-token');
  if (token !== BRIDGE_SECRET) {
    return NextResponse.json({ error: '{{UNAUTHORIZED_BRIDGE_TOKEN}}' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const order = getStore().orders.find((o) => o.id === body.orderId);
  if (!order) {
    return NextResponse.json({ error: '{{ORDER_NOT_FOUND}}' }, { status: 404 });
  }

  order.posSyncStatus = 'SYNCED';
  order.status = 'accepted';
  return NextResponse.json({ acknowledged: true, orderId: order.id });
}
