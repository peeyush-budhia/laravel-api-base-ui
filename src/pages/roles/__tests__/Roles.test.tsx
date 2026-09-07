import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Roles from '../Roles';
import { rolesApi } from '../../../api/roles';
import { useAuthorization } from '../../../auth/useAuthorization';
import { useToast } from '../../../components/common/useToast';
import type { Role } from '../../../types/role';

vi.mock('../../../api/roles', () => ({
  rolesApi: {
    list: vi.fn(),
    remove: vi.fn(),
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

vi.mock('../../../components/roles/RoleFilters', () => ({
  default: () => <div data-testid="role-filters" />,
}));

vi.mock('../../../components/common/Pagination', () => ({
  default: () => <div data-testid="pagination" />,
}));

vi.mock('../../../components/roles/RoleTable', () => ({
  default: ({ onDelete }: { onDelete: (role: Role) => void }) => (
    <div>
      <button type="button" onClick={() => onDelete(role)}>
        Trigger Delete
      </button>
    </div>
  ),
}));

const role: Role = {
  id: 'role-1',
  name: 'Manager',
  guard_name: 'web',
  created_at: null,
  updated_at: null,
};

describe('Roles', () => {
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

    vi.mocked(rolesApi.list).mockResolvedValue({
      success: true,
      status: 200,
      message: 'Roles retrieved successfully.',
      data: [role],
      errors: null,
      meta: {
        current_page: 1,
        per_page: 15,
        total: 1,
        last_page: 1,
        from: 1,
        to: 1,
        path: '/api/v1/roles',
        links: {
          first: null,
          last: null,
          prev: null,
          next: null,
        },
      },
    });
  });

  function renderRoles() {
    return render(
      <MemoryRouter>
        <Roles />
      </MemoryRouter>,
    );
  }

  it('shows a success toast after deleting a role', async () => {
    vi.mocked(rolesApi.remove).mockResolvedValue(undefined);

    renderRoles();

    await waitFor(() => {
      expect(rolesApi.list).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Trigger Delete' }));

    expect(
      await screen.findByRole('button', { name: 'Delete' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(rolesApi.remove).toHaveBeenCalledWith('role-1');
    });

    expect(showToast).toHaveBeenCalledWith({
      title: 'Role Deleted',
      message: 'The role has been deleted successfully.',
    });
  });
});
