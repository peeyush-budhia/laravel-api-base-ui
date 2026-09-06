import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import RoleActions from '../RoleActions';
import { SUPER_ADMIN_ROLE } from '../../../constants/roles';
import type { Role } from '../../../types/role';

vi.mock('../../common/ActionsDropdown', () => ({
  default: ({ items }: { items: Array<{ label: string; variant?: string }> }) => (
    <div data-testid="actions-dropdown">
      {items.map((item) => (
        <span key={item.label} data-variant={item.variant ?? 'default'}>
          {item.label}
        </span>
      ))}
    </div>
  ),
}));

function createRole(overrides: Partial<Role> = {}): Role {
  return {
    id: 'role-1',
    name: 'Manager',
    guard_name: 'web',
    created_at: null,
    updated_at: null,
    ...overrides,
  };
}

describe('RoleActions', () => {
  it('shows edit for manage-permissions users even without update permission', () => {
    render(
      <RoleActions
        role={createRole()}
        canView
        canUpdate={false}
        canDelete={false}
        canManagePermissions
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText('View')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('hides edit and delete for the super admin role', () => {
    render(
      <RoleActions
        role={createRole({ name: SUPER_ADMIN_ROLE })}
        canView
        canUpdate
        canDelete
        canManagePermissions
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText('View')).toBeInTheDocument();
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });
});
