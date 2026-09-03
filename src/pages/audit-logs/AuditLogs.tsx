import { useCallback, useEffect, useState } from 'react';
import type React from 'react';
import { useNavigate } from 'react-router';

import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import { getApiErrorMessage } from '../../utils/apiErrorUtils';
import EmptyState from '../../components/common/EmptyState';

import { auditLogsApi } from '../../api/auditLogs';

import AuditLogFilters from '../../components/audit-logs/AuditLogFilters';
import AuditLogTable from '../../components/audit-logs/AuditLogTable';

import Pagination from '../../components/common/Pagination';
import PageMeta from '../../components/common/PageMeta';

import type { AuditLog } from '../../types/auditLog';
import type { PaginationMeta } from '../../types/pagination';

import { routes } from '../../routes/routes';
import { permissions } from '../../auth/permissions';
import { useAuthorization } from '../../auth/useAuthorization';

export default function AuditLogs() {
  const { can } = useAuthorization();

  const canViewAuditLogs = can(permissions.auditLogs.view);

  const navigate = useNavigate();

  const [logs, setLogs] = useState<AuditLog[]>([]);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setPage(1);
  };

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [event, setEvent] = useState('');

  const [sort, setSort] = useState('created_at');
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc');

  const [meta, setMeta] = useState<PaginationMeta>({
    current_page: 1,
    per_page: perPage,
    total: 0,
    last_page: 1,
    from: null,
    to: null,
    path: '',
    links: {
      first: null,
      last: null,
      prev: null,
      next: null,
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAuditLogs = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await auditLogsApi.list({
        page,
        perPage: perPage,
        search: search || undefined,
        event: event || undefined,
        sort,
        direction,
      });

      setLogs(response.data);
      setMeta(response.meta);
    } catch (error: unknown) {
      setLogs([]);
      setError(
        getApiErrorMessage(
          error,
          'Unable to load audit logs. Please try again.',
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage, search, event, sort, direction]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAuditLogs();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadAuditLogs]);

  /*
   * Search
   */
  function handleSearchSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  }

  /*
   * Clear filters
   */
  function handleClearSearch() {
    setSearchInput('');
    setSearch('');
    setEvent('');
    setPage(1);
  }

  /*
   * Event filter
   */
  function handleEventChange(value: string) {
    setEvent(value);
    setPage(1);
  }

  /*
   * Sorting
   */
  function handleSort(field: string) {
    if (sort === field) {
      setDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
    } else {
      setSort(field);
      setDirection('asc');
    }

    setPage(1);
  }

  /*
   * View
   */
  function handleView(id: string) {
    navigate(routes.auditLogs.show(id));
  }
  if (!canViewAuditLogs) {
    return (
      <>
        <PageMeta
          title="Audit Logs"
          description="Review system activity and user actions."
        />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Access Denied
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            You do not have permission to view Audit Logs.
          </p>
        </div>
      </>
    );
  }
  return (
    <>
      <PageMeta
        title="Audit Logs"
        description="Review system activity and user actions."
      />

      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Audit Logs
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Review system activity and user actions.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 p-5 dark:border-gray-800">
            <AuditLogFilters
              searchInput={searchInput}
              search={search}
              event={event}
              onSearchInputChange={setSearchInput}
              onSearchSubmit={handleSearchSubmit}
              onEventChange={handleEventChange}
              onClearSearch={handleClearSearch}
              disabled={isLoading}
              perPage={perPage}
              onPerPageChange={handlePerPageChange}
            />
          </div>

          {isLoading && <LoadingState message="Loading audit logs..." />}
          {/* General Error */}
          {error && (
            <ErrorState message={error} onRetry={() => void loadAuditLogs()} />
          )}

          {/* Table */}
          {!error && (
            <>
              <div className="overflow-x-auto">
                <AuditLogTable
                  logs={logs}
                  isLoading={isLoading}
                  sort={sort}
                  direction={direction}
                  onSort={handleSort}
                  onView={handleView}
                />
              </div>

              {!isLoading && (
                <Pagination
                  meta={meta}
                  page={page}
                  onPageChange={setPage}
                  resourceLabel="audit logs"
                />
              )}
            </>
          )}
          {!isLoading && !error && logs.length === 0 && (
            <EmptyState
              title="No audit logs found"
              message="There are no audit log entries matching your current filters."
            />
          )}
        </div>
      </div>
    </>
  );
}
