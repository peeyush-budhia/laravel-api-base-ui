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

  it('uses a safe user display name when names are missing', () => {
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
              full_name: null,
              first_name: '' as string,
              last_name: '' as string,
              email: 'jane@example.com',
              avatar: null,
            },
          },
        ]}
      />,
    );

    expect(screen.getAllByText('jane@example.com')).toHaveLength(2);
    expect(screen.queryByText('undefined undefined')).not.toBeInTheDocument();
  });

  it('renders a system fallback for logs without a user', () => {
    render(
      <RecentAuditLogs
        logs={[
          {
            id: '1',
            event: 'permissions_synced',
            auditable_type: 'App\\Models\\Role',
            user_id: null,
            created_at: '2026-09-03T10:15:00.000Z',
            updated_at: null,
            user: null,
          },
        ]}
      />,
    );

    expect(screen.getByText('System')).toBeInTheDocument();
    expect(screen.getByText('System action')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
  });

  it('shows an empty state message when there are no recent logs', () => {
    render(<RecentAuditLogs logs={[]} />);

    expect(screen.getByText('No recent audit logs')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Audit activity will appear here once the backend records events.',
      ),
    ).toBeInTheDocument();
  });
});
