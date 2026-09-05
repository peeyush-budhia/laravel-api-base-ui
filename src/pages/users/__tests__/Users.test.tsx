import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Users from '../Users';
import { usersApi } from '../../../api/users';
import { useAuthorization } from '../../../auth/useAuthorization';
import { useToast } from '../../../components/common/useToast';
import type { User } from '../../../types/user';

vi.mock('../../../api/users', () => ({
  usersApi: {
    list: vi.fn(),
    delete: vi.fn(),
    restore: vi.fn(),
    forceDelete: vi.fn(),
  },
}));

vi.mock('../../../auth/useAuthorization', () => ({
  useAuthorization: vi.fn(),
}));

vi.mock('../../../components/common/useToast', () => ({
  useToast: vi.fn(),
}));

vi.mock('../../../components/common/PageMeta', () => ({
  default: () => null,
}));

vi.mock('../../../components/users/UserFilters', () => ({
  default: () => <div data-testid="user-filters" />,
}));

vi.mock('../../../components/common/Pagination', () => ({
  default: () => <div data-testid="pagination" />,
}));

vi.mock('../../../components/users/UserTable', () => ({
  default: ({
    onDelete,
    onRestore,
    onForceDelete,
  }: {
    onDelete: (user: User) => void;
    onRestore: (user: User) => void;
    onForceDelete: (user: User) => void;
  }) => (
    <div>
      <button type="button" onClick={() => onDelete(activeUser)}>
        Trigger Delete
      </button>
      <button type="button" onClick={() => onRestore(trashedUser)}>
        Trigger Restore
      </button>
      <button type="button" onClick={() => onForceDelete(trashedUser)}>
        Trigger Force Delete
      </button>
    </div>
  ),
}));

const activeUser: User = {
  id: 'user-1',
  first_name: 'Jane',
  last_name: 'Doe',
  full_name: 'Jane Doe',
  email: 'jane@example.com',
  avatar: null,
  role: 'Editor',
  status: 'active',
  permissions: [],
  must_change_password: false,
  email_verified_at: null,
  last_login_at: null,
  created_at: null,
  updated_at: null,
  deleted_at: null,
};

const trashedUser: User = {
  ...activeUser,
  id: 'user-2',
  full_name: 'John Smith',
  first_name: 'John',
  last_name: 'Smith',
  email: 'john@example.com',
  deleted_at: '2026-09-05T12:00:00.000Z',
};

describe('Users', () => {
  const showToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuthorization).mockReturnValue({
      can: () => true,
      canAny: vi.fn(),
      canAll: vi.fn(),
    });

    vi.mocked(useToast).mockReturnValue({
      showToast,
      hideToast: vi.fn(),
    });

    vi.mocked(usersApi.list).mockResolvedValue({
      success: true,
      status: 200,
      message: 'Users retrieved successfully.',
      data: [activeUser, trashedUser],
      errors: null,
      meta: {
        current_page: 1,
        per_page: 15,
        total: 2,
        last_page: 1,
        from: 1,
        to: 2,
        path: '/api/v1/users',
        links: {
          first: null,
          last: null,
          prev: null,
          next: null,
        },
      },
    });
  });

  function renderUsers() {
    return render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>,
    );
  }

  it('shows a success toast after deleting a user', async () => {
    vi.mocked(usersApi.delete).mockResolvedValue(undefined);

    renderUsers();

    await waitFor(() => {
      expect(usersApi.list).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Trigger Delete' }));

    expect(
      await screen.findByRole('button', { name: 'Delete User' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Delete User' }));

    await waitFor(() => {
      expect(usersApi.delete).toHaveBeenCalledWith('user-1');
    });

    expect(showToast).toHaveBeenCalledWith({
      title: 'User Deleted',
      message: 'The user has been deleted successfully.',
    });
  });

  it('shows a success toast after restoring a user', async () => {
    vi.mocked(usersApi.restore).mockResolvedValue(activeUser);

    renderUsers();

    await waitFor(() => {
      expect(usersApi.list).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Trigger Restore' }));

    expect(
      await screen.findByRole('button', { name: 'Restore User' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Restore User' }));

    await waitFor(() => {
      expect(usersApi.restore).toHaveBeenCalledWith('user-2');
    });

    expect(showToast).toHaveBeenCalledWith({
      title: 'User Restored',
      message: 'The user has been restored successfully.',
    });
  });

  it('shows a success toast after permanently deleting a user', async () => {
    vi.mocked(usersApi.forceDelete).mockResolvedValue(undefined);

    renderUsers();

    await waitFor(() => {
      expect(usersApi.list).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Trigger Force Delete' }));

    expect(
      await screen.findByRole('button', { name: 'Permanently Delete' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Permanently Delete' }));

    await waitFor(() => {
      expect(usersApi.forceDelete).toHaveBeenCalledWith('user-2');
    });

    expect(showToast).toHaveBeenCalledWith({
      title: 'User Permanently Deleted',
      message: 'The user has been permanently deleted successfully.',
    });
  });
});
