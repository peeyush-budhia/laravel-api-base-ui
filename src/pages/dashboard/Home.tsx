import { useCallback, useEffect, useState } from 'react';

import { permissions } from '../../auth/permissions';
import { useAuthorization } from '../../auth/useAuthorization';
import DashboardMetrics from '../../components/dashboard/DashboardMetrics';
import AuditEventCard from '../../components/dashboard/AuditEventCard';
import RecentAuditLogs from '../../components/dashboard/RecentAuditLogs';
import RecentlyActiveUsers from '../../components/dashboard/RecentlyActiveUsers';
import RecentUsers from '../../components/dashboard/RecentUsers';
import UserStatusCard from '../../components/dashboard/UserStatusCard';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import PageMeta from '../../components/common/PageMeta';
import { dashboardApi } from '../../api/dashboard';
import type { DashboardData } from '../../types/dashboard';
import { getApiErrorMessage } from '../../utils/apiErrorUtils';
import Unauthorized from '../errors/Unauthorized';

export default function Home() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const { can } = useAuthorization();

  const canViewDashboard = can(permissions.dashboard.view);
  const canViewAuditLogs = can(permissions.auditLogs.view);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await dashboardApi.get();

      setDashboard(response);
    } catch (error: unknown) {
      setDashboard(null);

      setError(
        getApiErrorMessage(
          error,
          'Unable to load dashboard data. Please try again.',
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadDashboard]);

  if (!canViewDashboard) {
    return <Unauthorized />;
  }

  return (
    <>
      <PageMeta title="Dashboard" description="Application dashboard" />

      {isLoading && <LoadingState message="Loading dashboard..." />}

      {!isLoading && error && (
        <ErrorState
          title="Unable to load dashboard"
          message={error}
          onRetry={() => {
            void loadDashboard();
          }}
        />
      )}

      {!isLoading && !error && !dashboard && (
        <EmptyState
          title="Dashboard data unavailable"
          message="There is currently no dashboard data to display."
          action={
            <button
              type="button"
              onClick={() => {
                void loadDashboard();
              }}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
            >
              Reload Dashboard
            </button>
          }
        />
      )}

      {!isLoading && !error && dashboard && (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12">
            <DashboardMetrics summary={dashboard.summary} />
          </div>

          <div className="col-span-12 xl:col-span-4">
            <UserStatusCard statistics={dashboard.users} />
          </div>

          <div className="col-span-12 xl:col-span-4">
            <RecentUsers users={dashboard.users.recent} />
          </div>

          <div className="col-span-12 xl:col-span-4">
            <RecentlyActiveUsers users={dashboard.users.recently_active} />
          </div>

          {canViewAuditLogs && (
            <div className="col-span-12 xl:col-span-4">
              <AuditEventCard statistics={dashboard.audit} />
            </div>
          )}

          {canViewAuditLogs && (
            <div className="col-span-12 xl:col-span-8">
              <RecentAuditLogs logs={dashboard.audit.recent} />
            </div>
          )}
        </div>
      )}
    </>
  );
}
