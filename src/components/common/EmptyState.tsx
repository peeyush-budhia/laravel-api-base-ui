import type React from 'react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  title = 'No data found',
  message = 'There is nothing to display yet.',
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex min-h-[180px] items-center justify-center px-4 py-8 ${className}`}
    >
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M8 10H16"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M8 14H13"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <rect
              x="4"
              y="3"
              width="16"
              height="18"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          </svg>
        </div>

        <h2 className="text-sm font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h2>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {message}
        </p>

        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
}
