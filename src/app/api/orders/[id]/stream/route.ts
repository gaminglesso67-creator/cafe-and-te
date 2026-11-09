import { NextRequest } from 'next/server';
import { getStore } from '@/lib/db';

/**
 * Server-Sent Events (SSE) stream for live Order Tracking (`GET /api/orders/[id]/stream`, PRD 8.2 & 11.1).
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const store = getStore();
  const order = store.orders.find((o) => o.id === params.id);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const payload = JSON.stringify({
        orderId: params.id,
        status: order?.status ?? 'accepted',
        posSyncStatus: order?.posSyncStatus ?? 'SYNCED',
        updatedAt: new Date().toISOString(),
      });
      controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}

