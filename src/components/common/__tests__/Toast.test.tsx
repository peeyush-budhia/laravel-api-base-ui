import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Toast from '../Toast';
import { ToastProvider } from '../ToastContext';
import { useToast } from '../useToast';

describe('Toast', () => {
  it('renders the toast title and message', () => {
    render(
      <Toast
        title="Saved"
        message="Your changes were saved."
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Saved');
    expect(screen.getByText('Your changes were saved.')).toBeInTheDocument();
  });
});

describe('ToastProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows and dismisses a toast', () => {
    function Harness() {
      const { showToast, hideToast } = useToast();

      return (
        <div>
          <button
            type="button"
            onClick={() =>
              showToast({
                title: 'Saved',
                message: 'User created successfully.',
                durationMs: 1000,
              })
            }
          >
            Show
          </button>
          <button type="button" onClick={hideToast}>
            Hide
          </button>
        </div>
      );
    }

    render(
      <ToastProvider>
        <Harness />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Show' }));

    expect(screen.getByRole('status')).toHaveTextContent(
      'User created successfully.',
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Dismiss notification' }),
    );

    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Show' }));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
