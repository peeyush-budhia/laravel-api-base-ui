import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import AuditLogUserDisplay from '../AuditLogUserDisplay';

describe('AuditLogUserDisplay', () => {
  it('renders the user display with email', () => {
    render(
      <AuditLogUserDisplay
        user={{
          id: 'user-1',
          first_name: 'Jane',
          last_name: 'Doe',
          full_name: 'Jane Doe',
          email: 'jane@example.com',
          avatar: null,
        }}
      />,
    );

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('renders the system fallback when no user is present', () => {
    render(<AuditLogUserDisplay user={null} />);

    expect(screen.getByText('System')).toBeInTheDocument();
    expect(screen.getByText('System action')).toBeInTheDocument();
  });
});
