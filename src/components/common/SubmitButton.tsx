import type React from 'react';

interface SubmitButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
}

export default function SubmitButton({
  children,
  loading = false,
  loadingText = 'Saving...',
  disabled = false,
  type = 'submit',
  className = '',
  onClick,
}: SubmitButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 ${className}`}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}

      <span>{loading ? loadingText : children}</span>
    </button>
  );
}
