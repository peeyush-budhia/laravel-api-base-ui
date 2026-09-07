import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AuditLogs from '../AuditLogs';
import { auditLogsApi } from '../../../api/auditLogs';
import { useAuthorization } from '../../../auth/useAuthorization';
import { permissions } from '../../../auth/permissions';
import type { AuditLog } from '../../../types/auditLog';

vi.mock('../../../api/auditLogs', () => ({
  auditLogsApi: {
    list: vi.fn(),
  },
}));

vi.mock('../../../auth/useAuthorization', () => ({
  useAuthorization: vi.fn(),
}));

vi.mock('../../../components/common/PageMeta', () => ({
  default: () => null,
}));

vi.mock('../../../components/audit-logs/AuditLogFilters', () => ({
  default: () => <div data-testid="audit-log-filters" />,
}));

vi.mock('../../../components/audit-logs/AuditLogTable', () => ({
  default: () => <div data-testid="audit-log-table" />,
}));

vi.mock('../../../components/common/Pagination', () => ({
  default: () => <div data-testid="pagination" />,
}));

function createLog(overrides: Partial<AuditLog> = {}): AuditLog {
  return {
    id: 'log-1',
    event: 'created',
    auditable_type: 'App\\Models\\User',
    auditable_id: 'user-1',
    user_id: null,
    old_values: null,
    new_values: null,
    url: null,
    ip_address: null,
    user_agent: null,
    created_at: '2026-09-06T10:15:00.000Z',
    updated_at: null,
    user: null,
    ...overrides,
  };
}

describe('AuditLogs', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuthorization).mockReturnValue({
      can: (permission) => permission === permissions.auditLogs.view,
      canAny: vi.fn(),
      canAll: vi.fn(),
    });
  });

  function renderAuditLogs() {
    return render(
      <MemoryRouter>
        <AuditLogs />
      </MemoryRouter>,
    );
  }

  it('renders the loading state before logs arrive', () => {
    vi.mocked(auditLogsApi.list).mockImplementation(
      () => new Promise(() => undefined),
    );

    renderAuditLogs();

    expect(screen.getByText('Loading audit logs...')).toBeInTheDocument();
  });

  it('renders the empty state when there are no logs', async () => {
    vi.mocked(auditLogsApi.list).mockResolvedValue({
      success: true,
      status: 200,
      message: 'Audit logs retrieved successfully.',
      data: [],
      errors: null,
      meta: {
        current_page: 1,
        per_page: 15,
        total: 0,
        last_page: 1,
        from: null,
        to: null,
        path: '/api/v1/audit-logs',
        links: {
          first: null,
          last: null,
          prev: null,
          next: null,
        },
      },
    });

    renderAuditLogs();

    expect(await screen.findByText('No audit logs found')).toBeInTheDocument();
  });

  it('renders an error state when loading fails', async () => {
    vi.mocked(auditLogsApi.list).mockRejectedValue(new Error('Server error.'));

    renderAuditLogs();

    expect(
      await screen.findByText('Unable to load audit logs'),
    ).toBeInTheDocument();
    expect(screen.getByText('Server error.')).toBeInTheDocument();
  });

  it('passes loaded logs to the table when data is available', async () => {
    vi.mocked(auditLogsApi.list).mockResolvedValue({
      success: true,
      status: 200,
      message: 'Audit logs retrieved successfully.',
      data: [createLog()],
      errors: null,
      meta: {
        current_page: 1,
        per_page: 15,
        total: 1,
        last_page: 1,
        from: 1,
        to: 1,
        path: '/api/v1/audit-logs',
        links: {
          first: null,
          last: null,
          prev: null,
          next: null,
        },
      },
    });

    renderAuditLogs();

    expect(await screen.findByTestId('audit-log-table')).toBeInTheDocument();

    await waitFor(() => {
      expect(auditLogsApi.list).toHaveBeenCalled();
    });
  });
});
