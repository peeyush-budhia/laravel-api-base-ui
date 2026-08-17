interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

interface PaginationProps {
  meta: PaginationMeta;
  page: number;
  onPageChange: (page: number) => void;
  resourceLabel?: string;
}

export default function Pagination({
  meta,
  page,
  onPageChange,
  resourceLabel = 'results',
}: PaginationProps) {
  if (meta.total === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing {meta.from}–{meta.to} of {meta.total} {resourceLabel}
      </p>

      {meta.last_page > 1 && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300"
          >
            Previous
          </button>

          <span className="px-2 text-sm text-gray-500 dark:text-gray-400">
            Page {meta.current_page} of {meta.last_page}
          </span>

          <button
            type="button"
            disabled={page >= meta.last_page}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
