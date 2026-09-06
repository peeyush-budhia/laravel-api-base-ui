import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import UserActions from '../UserActions';
import { SUPER_ADMIN_ROLE } from '../../../constants/roles';
import type { User } from '../../../types/user';

vi.mock('../../common/ActionsDropdown', () => ({
  default: ({
    items,
  }: {
    items: Array<{ label: string; variant?: string }>;
  }) => (
    <div data-testid="actions-dropdown">
      {items.map((item) => (
        <span key={item.label} data-variant={item.variant ?? 'default'}>
          {item.label}
        </span>
      ))}
    </div>
  ),
}));

function createUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    first_name: 'Jane',
    last_name: 'Doe',
    full_name: 'Jane Doe',
    email: 'jane@example.com',
    avatar: null,
    role: 'Editor',
    status: 'active',
    permissions: [],
    email_verified_at: null,
    last_login_at: null,
    created_at: null,
    updated_at: null,
    deleted_at: null,
    ...overrides,
  };
}

describe('UserActions', () => {
  it('shows view, edit, and delete actions for an active user', () => {
    render(
      <UserActions
        user={createUser()}
        canView
        canUpdate
        canDelete
        canRestore={false}
        onDelete={vi.fn()}
        onRestore={vi.fn()}
        onForceDelete={vi.fn()}
      />,
    );

    expect(screen.getByText('View')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.queryByText('Restore')).not.toBeInTheDocument();
    expect(screen.queryByText('Permanently Delete')).not.toBeInTheDocument();
  });

  it('shows restore and permanent delete actions for a trashed user when allowed', () => {
    render(
      <UserActions
        user={createUser({ deleted_at: '2026-09-05T12:00:00.000Z' })}
        canView
        canUpdate
        canDelete
        canRestore
        onDelete={vi.fn()}
        onRestore={vi.fn()}
        onForceDelete={vi.fn()}
      />,
    );

    expect(screen.queryByText('View')).not.toBeInTheDocument();
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    expect(screen.getByText('Restore')).toBeInTheDocument();
    expect(screen.getByText('Permanently Delete')).toBeInTheDocument();
  });

  it('does not render actions for a super admin', () => {
    render(
      <UserActions
        user={createUser({ role: SUPER_ADMIN_ROLE })}
        canView
        canUpdate
        canDelete
        canRestore
        onDelete={vi.fn()}
        onRestore={vi.fn()}
        onForceDelete={vi.fn()}
      />,
    );

    expect(screen.queryByTestId('actions-dropdown')).not.toBeInTheDocument();
  });
});
