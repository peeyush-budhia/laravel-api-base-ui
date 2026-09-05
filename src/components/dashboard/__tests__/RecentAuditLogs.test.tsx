import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import RecentAuditLogs from '../RecentAuditLogs';

describe('RecentAuditLogs', () => {
  it('renders invalid timestamps without crashing', () => {
    render(
      <RecentAuditLogs
        logs={[
          {
            id: '1',
            event: 'created',
            auditable_type: 'App\\Models\\User',
            user_id: null,
            created_at: 'not-a-date',
            updated_at: null,
            user: null,
          },
        ]}
      />,
    );

    expect(screen.getByText('Recent Audit Logs')).toBeInTheDocument();
    expect(screen.getByText('Never')).toBeInTheDocument();
  });

  it('uses a safe user display name when first and last names are missing', () => {
    render(
      <RecentAuditLogs
        logs={[
          {
            id: '1',
            event: 'updated',
            auditable_type: 'App\\Models\\User',
            user_id: 'user-1',
            created_at: '2026-09-03T10:15:00.000Z',
            updated_at: null,
            user: {
              id: 'user-1',
              full_name: 'Jane Smith',
              first_name: '' as string,
              last_name: '' as string,
              email: 'jane@example.com',
              avatar: null,
            },
          },
        ]}
      />,
    );

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('undefined undefined')).not.toBeInTheDocument();
  });
});
