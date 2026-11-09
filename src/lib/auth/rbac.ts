export type AdminRole = 'OWNER' | 'MANAGER' | 'STAFF';

export type PermissionCapability =
  | 'orders_reservations:manage'
  | 'inventory:toggle_stock'
  | 'menu:edit'
  | 'content_offers_hours:edit'
  | 'reviews:moderate'
  | 'payments:refund'
  | 'analytics:view_basic'
  | 'analytics:view_full'
  | 'users:manage'
  | 'settings_payments_pos:manage';

/**
 * Exact Permission Matrix from PRD Section 9.9:
 * | Capability                          | Staff | Manager | Owner |
 * | View/update orders and reservations |  ✔    |    ✔    |   ✔   |
 * | Mark items out of stock             |  ✔    |    ✔    |   ✔   |
 * | Edit menu, prices                   |  ✖    |    ✔    |   ✔   |
 * | Edit offers, banners, hours, content|  ✖    |    ✔    |   ✔   |
 * | Moderate reviews                    |  ✖    |    ✔    |   ✔   |
 * | Refunds                             |  ✖    | ✔(limit)|   ✔   |
 * | View analytics                      |limited|    ✔    | ✔ full|
 * | Manage users and roles              |  ✖    |    ✖    |   ✔   |
 * | Payment and POS settings            |  ✖    |    ✖    |   ✔   |
 */
export const ROLE_PERMISSIONS: Record<AdminRole, PermissionCapability[]> = {
  STAFF: ['orders_reservations:manage', 'inventory:toggle_stock', 'analytics:view_basic'],
  MANAGER: [
    'orders_reservations:manage',
    'inventory:toggle_stock',
    'menu:edit',
    'content_offers_hours:edit',
    'reviews:moderate',
    'payments:refund',
    'analytics:view_basic',
    'analytics:view_full',
  ],
  OWNER: [
    'orders_reservations:manage',
    'inventory:toggle_stock',
    'menu:edit',
    'content_offers_hours:edit',
    'reviews:moderate',
    'payments:refund',
    'analytics:view_basic',
    'analytics:view_full',
    'users:manage',
    'settings_payments_pos:manage',
  ],
};

export const MANAGER_REFUND_LIMIT_INR = 2000;

export function hasPermission(role: AdminRole, capability: PermissionCapability): boolean {
  return ROLE_PERMISSIONS[role]?.includes(capability) ?? false;
}

export function canIssueRefund(role: AdminRole, amountInr: number): {
  allowed: boolean;
  reason?: string;
} {
  if (role === 'OWNER') return { allowed: true };
  if (role === 'MANAGER') {
    if (amountInr <= MANAGER_REFUND_LIMIT_INR) return { allowed: true };
    return {
      allowed: false,
      reason: `{{MANAGER_REFUND_EXCEEDS_LIMIT_INR_${MANAGER_REFUND_LIMIT_INR}}}`,
    };
  }
  return { allowed: false, reason: '{{STAFF_CANNOT_ISSUE_REFUNDS}}' };
}

export interface AdminUserAccount {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  failedLoginAttempts: number;
  lockedUntil?: string | null;
}

export const SEED_ADMIN_USERS: AdminUserAccount[] = [
  {
    id: 'usr-owner',
    email: 'owner@saanjh.local',
    name: '{{USER_OWNER_NAME}}',
    role: 'OWNER',
    isActive: true,
    failedLoginAttempts: 0,
  },
  {
    id: 'usr-manager',
    email: 'manager@saanjh.local',
    name: '{{USER_MANAGER_NAME}}',
    role: 'MANAGER',
    isActive: true,
    failedLoginAttempts: 0,
  },
  {
    id: 'usr-staff',
    email: 'staff@saanjh.local',
    name: '{{USER_STAFF_NAME}}',
    role: 'STAFF',
    isActive: true,
    failedLoginAttempts: 0,
  },
];
