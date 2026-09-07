import StateMessage from './StateMessage';

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
    <StateMessage
      role="alert"
      ariaLive="assertive"
      title={title}
      message={message}
      className={className}
      surfaceClassName="border-error-200 bg-error-50 dark:border-error-500/30 dark:bg-error-500/10"
      iconWrapperClassName="bg-error-500/10 text-error-600 dark:text-error-400"
      titleClassName="text-error-700 dark:text-error-300"
      messageClassName="text-error-600 dark:text-error-400"
      icon={
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
      }
    >
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center rounded-lg border border-error-200 bg-white px-4 py-2 text-sm font-medium text-error-700 transition hover:bg-error-50 focus:outline-none focus:ring-2 focus:ring-error-500/30 dark:border-error-500/30 dark:bg-gray-900 dark:text-error-300 dark:hover:bg-error-500/10"
        >
          {retryLabel}
        </button>
      )}
    </StateMessage>
  );
}
