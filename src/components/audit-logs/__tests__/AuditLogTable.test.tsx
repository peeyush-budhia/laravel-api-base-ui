import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import AuditLogTable from '../AuditLogTable';
import type { AuditLog } from '../../../types/auditLog';

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

describe('AuditLogTable', () => {
  it('links the event badge to the audit log details page', () => {
    render(
      <MemoryRouter>
        <AuditLogTable
          logs={[createLog()]}
          isLoading={false}
          sort="created_at"
          direction="desc"
          onSort={vi.fn()}
          onView={vi.fn()}
        />
      </MemoryRouter>,
    );

    const badgeLink = screen.getByRole('link', {
      name: 'View details for Created audit log',
    });

    expect(badgeLink).toHaveAttribute('href', '/audit-logs/log-1');
    expect(screen.getByText('Created')).toBeInTheDocument();
  });
});
