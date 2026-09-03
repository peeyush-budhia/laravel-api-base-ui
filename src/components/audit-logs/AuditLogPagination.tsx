interface AuditLogPaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  from: number | null;
  to: number | null;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export default function AuditLogPagination({
  currentPage,
  lastPage,
  total,
  from,
  to,
  onPageChange,
  disabled = false,
}: AuditLogPaginationProps) {
  if (total === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing {from ?? 0} to {to ?? 0} of {total} results
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled || currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
        >
          Previous
        </button>

        <span className="px-2 text-sm text-gray-600 dark:text-gray-300">
          {currentPage} / {lastPage}
        </span>

        <button
          type="button"
          disabled={disabled || currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
        >
          Next
        </button>
      </div>
    </div>
  );
}
