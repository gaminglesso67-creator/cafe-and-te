'use client';

import React, { useState } from 'react';
import { appendAuditLog, getStore } from '@/lib/db';
import { AdminRole, AdminUserAccount } from '@/lib/auth/rbac';
import { PermissionGuard, useAdminSession } from '@/components/admin/AdminShell';
import {
  Badge,
  Button,
  Card,
  EmailInput,
  ResponsiveTable,
  SelectInput,
  TextInput,
  useToast,
} from '@/components/ui';

/**
 * Staff Accounts & Roles Management (`/admin/users`, PRD 6.2, 9.7 & 9.9):
 * Strictly OWNER only (`users:manage`). Manager and Staff are blocked by PermissionGuard.
 */
export default function AdminUsersPage() {
  const store = getStore();
  const { email: actorEmail, role: actorRole } = useAdminSession();
  const { notify } = useToast();

  const [users, setUsers] = useState<AdminUserAccount[]>([...store.users]);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('STAFF');

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;
    const created: AdminUserAccount = {
      id: `usr-${Date.now()}`,
      name: newName,
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      isActive: true,
      failedLoginAttempts: 0,
    };
    const updated = [...users, created];
    store.users = updated;
    setUsers(updated);
    appendAuditLog({
      actorEmail,
      actorRole,
      action: 'USER_INVITED',
      entityType: 'User',
      entityId: created.id,
      detail: `Invited ${created.email} with role ${created.role}`,
    });
    setNewName('');
    setNewEmail('');
    notify('{{STAFF_ACCOUNT_CREATED_AND_LOGGED}}', 'success');
  };

  const handleRoleChange = (userId: string, nextRole: AdminRole) => {
    const updated = users.map((u) => (u.id === userId ? { ...u, role: nextRole } : u));
    store.users = updated;
    setUsers(updated);
    appendAuditLog({
      actorEmail,
      actorRole,
      action: 'USER_ROLE_CHANGED',
      entityType: 'User',
      entityId: userId,
      detail: `Changed role to ${nextRole}`,
    });
    notify(`Role updated to ${nextRole}`, 'success');
  };

  return (
    <PermissionGuard capability="users:manage">
      <div className="space-y-6">
        <div className="border-b border-gold/25 pb-4">
          <h1 className="font-serif text-3xl text-gold">{'{{STAFF_ACCOUNTS_AND_ROLES_OWNER_ONLY}}'}</h1>
        </div>

        <Card variant="surface">
          <form onSubmit={handleInviteUser} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-4">
              <TextInput
                id="invite-staff-name"
                label={'{{FIELD_STAFF_NAME}}'}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="sm:col-span-4">
              <EmailInput
                id="invite-staff-email"
                label={'{{FIELD_STAFF_EMAIL}}'}
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <SelectInput
                id="invite-staff-role"
                label={'{{FIELD_ROLE}}'}
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as AdminRole)}
                options={[
                  { value: 'STAFF', label: 'STAFF' },
                  { value: 'MANAGER', label: 'MANAGER' },
                  { value: 'OWNER', label: 'OWNER' },
                ]}
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" variant="primary" size="md" fullWidth>
                + {'{{INVITE}}'}
              </Button>
            </div>
          </form>
        </Card>

        <ResponsiveTable
          rowKey={(u) => u.id}
          data={users}
          columns={[
            { key: 'name', header: 'Name', render: (u) => u.name },
            { key: 'email', header: 'Email', render: (u) => <span className="font-mono">{u.email}</span> },
            { key: 'role', header: 'Current Role', render: (u) => <Badge kind="neutral" label={u.role} /> },
            {
              key: 'switch',
              header: 'Change Role',
              render: (u) => (
                <div className="flex gap-1.5 justify-end">
                  {(['STAFF', 'MANAGER', 'OWNER'] as AdminRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleChange(u.id, r)}
                      className="min-h-9 px-2 text-xs font-mono border border-gold/30 rounded-xs hover:border-gold"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </div>
    </PermissionGuard>
  );
}

