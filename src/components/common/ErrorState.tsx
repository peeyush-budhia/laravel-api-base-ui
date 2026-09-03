interface ErrorStateProps {
  message?: string;
  title?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export default function ErrorState({
  message = 'Something went wrong.',
  title = 'Unable to load data',
  onRetry,
  retryLabel = 'Try Again',
  className = '',
}: ErrorStateProps) {
  return (
    <div
      className={`flex min-h-[180px] items-center justify-center px-4 py-8 ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-error-500/10">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 9V13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12 17H12.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M10.3 4.3L2.9 17.1C2.2 18.3 3.1 19.8 4.5 19.8H19.5C20.9 19.8 21.8 18.3 21.1 17.1L13.7 4.3C13 3.1 11 3.1 10.3 4.3Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="text-sm font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h2>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {message}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
          >
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
}
