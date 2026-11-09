import { getStore, NotificationLogRecord } from '@/lib/db';

export type NotificationEventKey =
  | 'ORDER_PLACED'
  | 'PAYMENT_RECEIVED'
  | 'ORDER_ACCEPTED'
  | 'ORDER_READY'
  | 'ORDER_COMPLETED'
  | 'RESERVATION_RECEIVED'
  | 'RESERVATION_CONFIRMED'
  | 'RESERVATION_REMINDER'
  | 'RESERVATION_CANCELLED'
  | 'ADMIN_NEW_ORDER_ALERT'
  | 'ADMIN_NEW_RESERVATION_ALERT'
  | 'ADMIN_PAYMENT_FAILURE_ALERT'
  | 'ADMIN_NEW_ENQUIRY_ALERT';

/**
 * Notification Service Stub with Editable Content-Free Templates (`{{TEMPLATE_BODY}}`, PRD 8.4).
 * Logs every notification attempt to `NotificationLog` with delivery status and retry support.
 */
export async function dispatchNotification(params: {
  eventKey: NotificationEventKey;
  channel: NotificationLogRecord['channel'];
  recipient: string;
  variables?: Record<string, string | number>;
}): Promise<NotificationLogRecord> {
  const store = getStore();
  const varsToken = params.variables
    ? Object.entries(params.variables)
        .map(([k, v]) => `${k}=${v}`)
        .join('|')
    : '';

  // Templates are strictly content-free in the skeleton (`{{TEMPLATE_BODY}}`, PRD 8.4)
  const record: NotificationLogRecord = {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventKey: params.eventKey,
    channel: params.channel,
    recipient: params.recipient,
    templateBody: `{{TEMPLATE_BODY:${params.eventKey}${varsToken ? `:${varsToken}` : ''}}}`,
    status: 'SENT',
    createdAt: new Date().toISOString(),
  };

  store.notificationLogs.unshift(record);
  return record;
}

