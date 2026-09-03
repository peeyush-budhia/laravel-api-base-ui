import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import ErrorState from '../ErrorState';

describe('ErrorState', () => {
  it('displays the error message', () => {
    render(<ErrorState message="Unable to load users." />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Unable to load users.',
    );
  });

  it('displays a retry button when onRetry is provided', () => {
    const onRetry = vi.fn();

    render(<ErrorState message="Unable to load users." onRetry={onRetry} />);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Try Again',
      }),
    );

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('does not display a retry button without onRetry', () => {
    render(<ErrorState message="Unable to load users." />);

    expect(
      screen.queryByRole('button', {
        name: 'Try Again',
      }),
    ).not.toBeInTheDocument();
  });
});
