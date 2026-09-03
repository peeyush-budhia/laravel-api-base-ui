import { describe, expect, it } from 'vitest';

import {
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from '../../auth/authorization';

import { permissions } from '../../auth/permissions';

import type { AuthUser } from '../../auth/types';

function createUser(userPermissions: string[] = []): AuthUser {
  return {
    id: 'user-id',
    first_name: 'Test',
    last_name: 'User',
    full_name: 'Test User',
    email: 'test@example.com',
    avatar: null,
    role: 'admin',
    permissions: userPermissions,
    status: 'active',
    must_change_password: false,
    email_verified_at: null,
    last_login_at: null,
    created_at: null,
    updated_at: null,
    deleted_at: null,
  };
}

describe('authorization', () => {
  describe('hasPermission', () => {
    it('returns true when the user has the permission', () => {
      const user = createUser([
        permissions.dashboard.view,
        permissions.auditLogs.view,
      ]);

      expect(hasPermission(user, permissions.dashboard.view)).toBe(true);
    });

    it('returns false when the user does not have the permission', () => {
      const user = createUser([permissions.dashboard.view]);

      expect(hasPermission(user, permissions.auditLogs.view)).toBe(false);
    });

    it('returns false for an unauthenticated user', () => {
      expect(hasPermission(null, permissions.dashboard.view)).toBe(false);
    });
  });

  describe('hasAnyPermission', () => {
    it('returns true when at least one permission matches', () => {
      const user = createUser([permissions.dashboard.view]);

      expect(
        hasAnyPermission(user, [
          permissions.dashboard.view,
          permissions.auditLogs.view,
        ]),
      ).toBe(true);
    });

    it('returns false when none of the permissions match', () => {
      const user = createUser([permissions.dashboard.view]);

      expect(
        hasAnyPermission(user, [
          permissions.auditLogs.view,
          permissions.users.view,
        ]),
      ).toBe(false);
    });

    it('returns false for an unauthenticated user', () => {
      expect(hasAnyPermission(null, [permissions.dashboard.view])).toBe(false);
    });

    it('returns false for an empty permission list', () => {
      const user = createUser([permissions.dashboard.view]);

      expect(hasAnyPermission(user, [])).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    it('returns true when all permissions match', () => {
      const user = createUser([
        permissions.dashboard.view,
        permissions.auditLogs.view,
      ]);

      expect(
        hasAllPermissions(user, [
          permissions.dashboard.view,
          permissions.auditLogs.view,
        ]),
      ).toBe(true);
    });

    it('returns false when one permission is missing', () => {
      const user = createUser([permissions.dashboard.view]);

      expect(
        hasAllPermissions(user, [
          permissions.dashboard.view,
          permissions.auditLogs.view,
        ]),
      ).toBe(false);
    });

    it('returns false for an unauthenticated user', () => {
      expect(hasAllPermissions(null, [permissions.dashboard.view])).toBe(false);
    });

    it('returns false for an empty permission list', () => {
      const user = createUser([permissions.dashboard.view]);

      expect(hasAllPermissions(user, [])).toBe(false);
    });
  });
});
