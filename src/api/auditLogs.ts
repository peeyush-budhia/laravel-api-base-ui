import { apiClient } from './client';
import { endpoints } from './endpoints';

import type { ApiResponse } from './types';
import type {
  AuditLog,
  AuditLogListParams,
  AuditLogListResponse,
} from '../types/auditLog';

export const auditLogsApi = {
  async list(params: AuditLogListParams = {}): Promise<AuditLogListResponse> {
    const response = await apiClient.get<AuditLogListResponse>(
      endpoints.auditLogs.index,
      {
        params: {
          page: params.page,
          per_page: params.perPage,

          search: params.search || undefined,

          event: params.event || undefined,
          user_id: params.userId || undefined,
          auditable_type: params.auditableType || undefined,
          auditable_id: params.auditableId || undefined,

          sort: params.sort,
          direction: params.direction,
        },
      },
    );

    return response.data;
  },

  async show(id: string): Promise<AuditLog> {
    const response = await apiClient.get<ApiResponse<AuditLog>>(
      endpoints.auditLogs.show(id),
    );

    return response.data.data;
  },
};
