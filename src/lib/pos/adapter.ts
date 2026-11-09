import { getStore, OrderRecord, PosSyncJobRecord } from '@/lib/db';
import { MenuItemSlot } from '@/lib/seed-data';

/**
 * Kitchen Billing System (POS) Adapter Interface (PRD Section 10.2)
 */
export interface PosAdapter {
  readonly name: 'manual' | 'api' | 'middleware' | 'bridge';
  pushOrder(order: OrderRecord, idempotencyKey: string): Promise<{
    success: boolean;
    posOrderId?: string;
    errorMessage?: string;
  }>;
  cancelOrder(orderId: string): Promise<{ success: boolean }>;
  fetchMenu(): Promise<MenuItemSlot[]>;
  fetchStock(): Promise<{ itemId: string; isAvailable: boolean }[]>;
  updateStock(item: { itemId: string; isAvailable: boolean }): Promise<{ success: boolean }>;
  getOrderStatus(orderId: string): Promise<{ status: OrderRecord['status'] }>;
  healthCheck(): Promise<{ healthy: boolean; adapter: string; details: string }>;
}

/**
 * 1. ManualAdapter (Working Default — PRD 10.1 #4 & 10.2):
 * Formats the order for the kitchen tablet board and printable Kitchen Order Ticket (KOT).
 */
export class ManualPosAdapter implements PosAdapter {
  readonly name = 'manual' as const;

  async pushOrder(order: OrderRecord, idempotencyKey: string) {
    return {
      success: true,
      posOrderId: `KOT-MANUAL-${order.orderNumber}-${idempotencyKey.slice(-4)}`,
    };
  }

  async cancelOrder(_orderId: string) {
    return { success: true };
  }

  async fetchMenu() {
    return getStore().menuItems;
  }

  async fetchStock() {
    return getStore().menuItems.map((i) => ({ itemId: i.id, isAvailable: i.isAvailable }));
  }

  async updateStock(item: { itemId: string; isAvailable: boolean }) {
    const store = getStore();
    store.menuItems = store.menuItems.map((m) =>
      m.id === item.itemId ? { ...m, isAvailable: item.isAvailable } : m
    );
    return { success: true };
  }

  async getOrderStatus(orderId: string) {
    const found = getStore().orders.find((o) => o.id === orderId);
    return { status: found?.status ?? 'placed' };
  }

  async healthCheck() {
    return {
      healthy: true,
      adapter: 'manual',
      details: '{{MANUAL_KITCHEN_PRINTER_AND_TABLET_READY}}',
    };
  }
}

/**
 * 2. ApiAdapter (Stub — PRD 10.1 #1 & 10.2):
 * Official REST API integration stub (e.g., Petpooja, Posist, Square, Toast).
 * TODO(PRD-19.1): Implement vendor-specific JSON payload mapping once the restaurant confirms its POS vendor.
 */
export class ApiPosAdapter implements PosAdapter {
  readonly name = 'api' as const;

  async pushOrder(order: OrderRecord, idempotencyKey: string) {
    // Stub: succeeds in test mode with a deterministic external ID
    return {
      success: true,
      posOrderId: `API-STUB-${order.orderNumber}-${idempotencyKey.slice(-4)}`,
    };
  }
  async cancelOrder(_orderId: string) {
    return { success: true };
  }
  async fetchMenu() {
    return getStore().menuItems;
  }
  async fetchStock() {
    return getStore().menuItems.map((i) => ({ itemId: i.id, isAvailable: i.isAvailable }));
  }
  async updateStock(_item: { itemId: string; isAvailable: boolean }) {
    return { success: true };
  }
  async getOrderStatus(orderId: string) {
    const found = getStore().orders.find((o) => o.id === orderId);
    return { status: found?.status ?? 'placed' };
  }
  async healthCheck() {
    return {
      healthy: true,
      adapter: 'api',
      details: '{{STUB_OFFICIAL_POS_API_READY_FOR_CREDENTIALS}}',
    };
  }
}

/**
 * 3. MiddlewareAdapter (Stub — PRD 10.1 #2 & 10.2):
 * Aggregator middleware stub (e.g., UrbanPiper).
 * TODO(PRD-19.1): Wire UrbanPiper webhook & catalog push endpoints if middleware approach is selected.
 */
export class MiddlewarePosAdapter extends ApiPosAdapter {
  // @ts-expect-error override literal type
  override readonly name = 'middleware' as const;
}

/**
 * 4. BridgeAdapter (Stub — PRD 10.1 #3 & 10.2):
 * Local PC database/file bridge stub polling `/api/bridge/orders`.
 * TODO(PRD-19.1): Configure local bridge polling agent if legacy desktop POS has no cloud API.
 */
export class BridgePosAdapter extends ApiPosAdapter {
  // @ts-expect-error override literal type
  override readonly name = 'bridge' as const;
}

export function getActivePosAdapter(): PosAdapter {
  const active = getStore().activePosAdapter;
  switch (active) {
    case 'api':
      return new ApiPosAdapter();
    case 'middleware':
      return new MiddlewarePosAdapter();
    case 'bridge':
      return new BridgePosAdapter();
    case 'manual':
    default:
      return new ManualPosAdapter();
  }
}

/**
 * Persistent POS Push Queue with Idempotency Keys & Retry Backoff (PRD 10.3 & 10.4).
 * Ensures the same order is never billed twice and failed pushes are queued for retry.
 */
export async function enqueueAndPushOrderToPos(order: OrderRecord): Promise<PosSyncJobRecord> {
  const store = getStore();
  const idempotencyKey = `pos-idem-${order.id}`;

  // Duplicate prevention check (PRD 10.4)
  const existingJob = store.posJobs.find((j) => j.idempotencyKey === idempotencyKey);
  if (existingJob && existingJob.status === 'SUCCEEDED') {
    return existingJob;
  }

  const adapter = getActivePosAdapter();
  const res = await adapter.pushOrder(order, idempotencyKey);

  const job: PosSyncJobRecord = {
    id: existingJob?.id ?? `pos-job-${Date.now()}`,
    idempotencyKey,
    orderId: order.id,
    adapter: adapter.name,
    status: res.success ? 'SUCCEEDED' : 'FAILED',
    attempts: (existingJob?.attempts ?? 0) + 1,
    maxAttempts: 5,
    lastError: res.errorMessage,
    updatedAt: new Date().toISOString(),
  };

  if (existingJob) {
    store.posJobs = store.posJobs.map((j) => (j.id === existingJob.id ? job : j));
  } else {
    store.posJobs.unshift(job);
  }

  order.posSyncStatus = res.success ? 'SYNCED' : 'FAILED';
  order.posAdapterUsed = adapter.name;
  return job;
}
