export interface OpenRouterHealth {
  model: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  apiEndpoint: string;
  responseTimeMs: number;
  contextWindow: string;
  successRate: number;
  lastChecked: string;
}

export interface VectorDbHealth {
  engine: string;
  status: 'CONNECTED' | 'DISCONNECTED';
  indexedEmbeddingsCount: number;
  queryLatencyMs: number;
  lastSync: string;
}

export interface PaymentGatewayHealth {
  name: string;
  status: 'LIVE' | 'MAINTENANCE';
  securityMethod: string;
  uptimePercent: number;
  processed24h: number;
  lastWebhookAt: string;
}

export interface CronJobHealth {
  name: string;
  description: string;
  schedule: string;
  lastRun: string;
  nextRun: string;
  status: 'HEALTHY' | 'RUNNING' | 'WARNING' | 'FAILED';
  executionCount: number;
}

export interface ServerMetrics {
  jvmUsedMemoryMb: number;
  jvmMaxMemoryMb: number;
  jvmMemoryUsagePercent: number;
  activeDbConnections: number;
  maxDbConnections: number;
  databaseDialect: string;
  serverUptime: string;
}

export interface SystemMonitorHealth {
  openRouter: OpenRouterHealth;
  vectorDb: VectorDbHealth;
  paymentGateway: PaymentGatewayHealth;
  cronJobs: CronJobHealth[];
  serverMetrics: ServerMetrics;
}

export interface SystemAuditLog {
  id: string;
  time: string;
  timestamp?: string;
  module:
    | 'AI_COPILOT'
    | 'AI_SENTIMENT'
    | 'SEPAY_WEBHOOK'
    | 'STAFF_ACTION'
    | 'CRON_JOB'
    | 'SECURITY_AUTH'
    | 'INVENTORY_AUDIT'
    | 'DEPOSIT_AUDIT'
    | string;
  operator: string;
  action: string;
  result: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR' | string;
  ipAddress?: string;
  details?: string;
}

export interface ProbeResult {
  status: string;
  model: string;
  responseTimeMs: number;
  endpoint: string;
  message: string;
  probedAt: string;
}

export interface TriggerCronResult {
  jobName: string;
  status: string;
  message: string;
  executionTimeMs: number;
  executedAt: string;
}

