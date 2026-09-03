import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import LoadingState from '../LoadingState';

describe('LoadingState', () => {
  it('displays the loading message', () => {
    render(<LoadingState message="Loading users..." />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading users...');
  });

  it('uses the default loading message', () => {
    render(<LoadingState />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
  });
});
