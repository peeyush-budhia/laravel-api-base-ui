import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import { getApiErrorMessage } from '../../utils/apiErrorUtils';

import { auditLogsApi } from '../../api/auditLogs';

import type { AuditEvent, AuditLog } from '../../types/auditLog';

import { routes } from '../../routes/routes';

import PageMeta from '../../components/common/PageMeta';
import Badge from '../../components/ui/badge/Badge';
import UserAvatar from '../../components/users/UserAvatar';

import { formatDateTime } from '../../utils/dateTimeUtils';
import { auditEventLabels, auditEventColors } from '../../types/auditLog';

function getEventLabel(event: string): string {
  if (event in auditEventLabels) {
    return auditEventLabels[event as AuditEvent];
  }

  return event.replaceAll('_', ' ');
}

function getEventColor(
  event: string,
): 'success' | 'info' | 'error' | 'warning' | 'primary' {
  if (event in auditEventColors) {
    return auditEventColors[event as AuditEvent];
  }

  return 'primary';
}

function getResourceName(type: string): string {
  return type.split('\\').pop() ?? type;
}

function getUserName(log: AuditLog): string {
  if (!log.user) {
    return 'System';
  }

  return (
    `${log.user.first_name} ${log.user.last_name}`.trim() ||
    log.user.email ||
    'User'
  );
}

export default function AuditLogDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [log, setLog] = useState<AuditLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAuditLog = useCallback(async () => {
    if (!id) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await auditLogsApi.show(id);
      setLog(response);
    } catch (error: unknown) {
      setError(
        getApiErrorMessage(
          error,
          'Unable to load audit log details. Please try again.',
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }

    const timer = window.setTimeout(() => {
      void loadAuditLog();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [id, loadAuditLog]);

  function handleBack() {
    navigate(routes.auditLogs.index);
  }

  if (isLoading) {
    return (
      <>
        <PageMeta title="Audit Log" description="View audit log details." />

        <LoadingState message="Loading audit log..." />
      </>
    );
  }

  if (error || !log) {
    return (
      <>
        <PageMeta title="Audit Log" description="View audit log details." />

        <ErrorState
          message={error || 'Audit log not found.'}
          onRetry={() => void loadAuditLog()}
        />
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Audit Log Details"
        description="View audit log details"
      />

      <div className="space-y-6">
        <PageHeader onBack={handleBack} />

        {/* Overview */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 p-5 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Activity Details
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Information about this audit activity.
            </p>
          </div>

          <div className="grid gap-x-8 gap-y-6 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Event */}
            <DetailItem label="Event">
              <Badge size="sm" color={getEventColor(log.event)}>
                {getEventLabel(log.event)}
              </Badge>
            </DetailItem>

            {/* User */}
            <DetailItem label="User">
              {log.user ? (
                <div className="flex items-center gap-3">
                  <UserAvatar
                    user={{
                      id: log.user.id,
                      first_name: log.user.first_name,
                      last_name: log.user.last_name,
                      full_name:
                        `${log.user.first_name} ${log.user.last_name}`.trim(),
                      email: log.user.email,
                      avatar: log.user.avatar,
                      role: null,
                      permissions: [],
                      status: 'active',
                      must_change_password: false,
                      email_verified_at: null,
                      last_login_at: null,
                      created_at: null,
                      updated_at: null,
                      deleted_at: null,
                    }}
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                      {getUserName(log)}
                    </p>

                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {log.user.email}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    S
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      System
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      System action
                    </p>
                  </div>
                </div>
              )}
            </DetailItem>

            {/* Resource */}
            <DetailItem label="Resource">
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {getResourceName(log.auditable_type)}
              </p>

              <p className="mt-1 break-all text-xs text-gray-500 dark:text-gray-400">
                {log.auditable_id}
              </p>
            </DetailItem>

            {/* Date */}
            <DetailItem label="Date">
              <p className="text-sm text-gray-800 dark:text-white/90">
                {formatDateTime(log.created_at)}
              </p>
            </DetailItem>

            {/* Audit Log ID */}
            <DetailItem label="Audit Log ID">
              <p className="break-all text-sm text-gray-800 dark:text-white/90">
                {log.id}
              </p>
            </DetailItem>
          </div>
        </div>

        {/* Old / New Values */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ValuesCard title="Old Values" values={log.old_values} />

          <ValuesCard title="New Values" values={log.new_values} />
        </div>

        {/* Request Information */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 p-5 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Request Information
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Technical information captured when this activity occurred.
            </p>
          </div>

          <div className="space-y-6 p-5">
            <DetailItem label="IP Address">
              <p className="break-all text-sm text-gray-800 dark:text-white/90">
                {log.ip_address ?? '—'}
              </p>
            </DetailItem>

            <DetailItem label="URL">
              <p className="break-all text-sm text-gray-800 dark:text-white/90">
                {log.url ?? '—'}
              </p>
            </DetailItem>

            <DetailItem label="User Agent">
              <p className="break-all text-sm leading-6 text-gray-800 dark:text-white/90">
                {log.user_agent ?? '—'}
              </p>
            </DetailItem>
          </div>
        </div>
      </div>
    </>
  );
}

interface PageHeaderProps {
  onBack: () => void;
}

function PageHeader({ onBack }: PageHeaderProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center text-sm font-medium text-brand-500 transition hover:text-brand-600"
      >
        ← Back to Audit Logs
      </button>

      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Audit Log Details
      </h1>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        View detailed information about this system activity.
      </p>
    </div>
  );
}

interface DetailItemProps {
  label: string;
  children: React.ReactNode;
}

function DetailItem({ label, children }: DetailItemProps) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </p>

      {children}
    </div>
  );
}

interface ValuesCardProps {
  title: string;
  values: Record<string, unknown> | null;
}

function ValuesCard({ title, values }: ValuesCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b border-gray-200 p-5 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h2>
      </div>

      <div className="p-5">
        {!values || Object.keys(values).length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            No data.
          </div>
        ) : (
          <pre className="max-h-96 overflow-auto rounded-lg bg-gray-50 p-4 text-xs leading-6 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
            {JSON.stringify(values, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
