import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import EmptyState from '../EmptyState';

describe('EmptyState', () => {
  it('displays the default empty state', () => {
    render(<EmptyState />);

    expect(screen.getByText('No data found')).toBeInTheDocument();
    expect(
      screen.getByText('There is nothing to display yet.'),
    ).toBeInTheDocument();
  });

  it('displays custom content', () => {
    render(
      <EmptyState
        title="No users found"
        message="Create your first user to get started."
      />,
    );

    expect(screen.getByText('No users found')).toBeInTheDocument();

    expect(
      screen.getByText('Create your first user to get started.'),
    ).toBeInTheDocument();
  });
});
