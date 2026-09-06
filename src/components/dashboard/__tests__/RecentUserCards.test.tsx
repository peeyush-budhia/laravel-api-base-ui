import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import RecentUsers from '../RecentUsers';
import RecentlyActiveUsers from '../RecentlyActiveUsers';

const user = {
  id: 'user-1',
  first_name: '',
  last_name: '',
  full_name: null,
  email: 'jane@example.com',
  avatar: null,
  status: 'active' as const,
  email_verified_at: null,
  last_login_at: null,
  created_at: null,
  updated_at: null,
  deleted_at: null,
};

describe('Recent user cards', () => {
  it('renders a fallback display name in recent users', () => {
    render(<RecentUsers users={[user]} />);

    expect(screen.getAllByText('jane@example.com')).toHaveLength(2);
    expect(screen.getByText('Recent Users')).toBeInTheDocument();
  });

  it('renders a fallback display name in recently active users', () => {
    render(<RecentlyActiveUsers users={[user]} />);

    expect(screen.getAllByText('jane@example.com')).toHaveLength(2);
    expect(screen.getByText('Recently Active')).toBeInTheDocument();
  });

  it('shows an empty state when there are no recent users', () => {
    render(<RecentUsers users={[]} />);

    expect(screen.getByText('No recent users')).toBeInTheDocument();
  });

  it('shows an empty state when there are no recently active users', () => {
    render(<RecentlyActiveUsers users={[]} />);

    expect(screen.getByText('No recently active users')).toBeInTheDocument();
  });
});
