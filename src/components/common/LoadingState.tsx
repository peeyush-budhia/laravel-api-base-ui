interface LoadingStateProps {
  message?: string;
  className?: string;
}

export default function LoadingState({
  message = 'Loading...',
  className = '',
}: LoadingStateProps) {
  return (
    <div
      className={`flex min-h-[180px] items-center justify-center px-4 py-8 ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-3">
        <span
          className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-brand-500 dark:border-gray-700 dark:border-t-brand-400"
          aria-hidden="true"
        />

        <span className="text-sm text-gray-500 dark:text-gray-400">
          {message}
        </span>
      </div>
    </div>
  );
}
