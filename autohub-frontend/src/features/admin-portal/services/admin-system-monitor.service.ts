import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse } from '@/types/api.types';
import type {
  SystemMonitorHealth,
  SystemAuditLog,
  ProbeResult,
  TriggerCronResult,
} from '@/types/system-monitor.types';

export const adminSystemMonitorService = {
  async getHealth(signal?: AbortSignal): Promise<SystemMonitorHealth> {
    const res = await axiosClient.get<unknown, ApiResponse<SystemMonitorHealth>>(
      API_CONFIG.ENDPOINTS.ADMIN.SYSTEM_MONITOR_HEALTH,
      { signal }
    );
    return res.data;
  },

  async getAuditLogs(
    params?: {
      module?: string;
      status?: string;
      keyword?: string;
      limit?: number;
    },
    signal?: AbortSignal
  ): Promise<SystemAuditLog[]> {
    const res = await axiosClient.get<unknown, ApiResponse<SystemAuditLog[]>>(
      API_CONFIG.ENDPOINTS.ADMIN.SYSTEM_MONITOR_AUDIT_LOGS,
      { params, signal }
    );
    return res.data || [];
  },

  async probeOpenRouter(): Promise<ProbeResult> {
    const res = await axiosClient.post<unknown, ApiResponse<ProbeResult>>(
      API_CONFIG.ENDPOINTS.ADMIN.SYSTEM_MONITOR_PROBE_AI
    );
    return res.data;
  },

  async triggerCronJob(jobName: string): Promise<TriggerCronResult> {
    const res = await axiosClient.post<unknown, ApiResponse<TriggerCronResult>>(
      API_CONFIG.ENDPOINTS.ADMIN.SYSTEM_MONITOR_TRIGGER_CRON,
      { jobName }
    );
    return res.data;
  },

  async exportAuditLogs(params?: {
    module?: string;
    status?: string;
    keyword?: string;
  }): Promise<Blob> {
    const res = await axiosClient.get(API_CONFIG.ENDPOINTS.ADMIN.SYSTEM_MONITOR_EXPORT, {
      params,
      responseType: 'blob',
    });
    return res as unknown as Blob;
  },
};

