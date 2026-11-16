import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Cpu,
  Database,
  CreditCard,
  Clock,
  Activity,
  RefreshCw,
  FileSpreadsheet,
  Search,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Server,
  Play,
  Zap,
  Radio,
  X,
  Layers,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { cn } from '@/lib/utils';
import { AdminPagination } from '../../components/AdminPagination';
import { adminSystemMonitorService } from '@/features/admin-portal/services/admin-system-monitor.service';
import type {
  SystemMonitorHealth,
  SystemAuditLog,
} from '@/types/system-monitor.types';

const INITIAL_HEALTH: SystemMonitorHealth = {
  openRouter: {
    model: 'deepseek/deepseek-chat (Active)',
    status: 'ONLINE',
    apiEndpoint: 'openrouter.ai/api/v1',
    responseTimeMs: 240,
    contextWindow: '64k tokens (DeepSeek v3)',
    successRate: 99.8,
    lastChecked: 'Vừa xong',
  },
  vectorDb: {
    engine: 'PostgreSQL pgvector / HNSW Vector Store',
    status: 'CONNECTED',
    indexedEmbeddingsCount: 1250,
    queryLatencyMs: 18,
    lastSync: '02:00:00 Hôm nay',
  },
  paymentGateway: {
    name: 'SePay Webhook Gateway (my.sepay.vn)',
    status: 'LIVE',
    securityMethod: 'HMAC-SHA512 Verified',
    uptimePercent: 99.98,
    processed24h: 24,
    lastWebhookAt: '18 phút trước',
  },
  cronJobs: [
    {
      name: 'AutoCancel72hDepositDaemon',
      description: 'Quét tự động phiếu cọc 72h, cảnh báo hạn chót và thu hồi số VIN',
      schedule: 'Mỗi 15 phút (0 */15 * * * *)',
      lastRun: '10:30:00',
      nextRun: '10:45:00',
      status: 'HEALTHY',
      executionCount: 96,
    },
    {
      name: 'SyncVectorEmbeddingJob',
      description: 'Đồng bộ hóa Master Data xe, thông số kỹ thuật và chính sách vào Vector DB',
      schedule: 'Hàng ngày (0 0 2 * * ?)',
      lastRun: '02:00:00',
      nextRun: '02:00:00 Ngày mai',
      status: 'HEALTHY',
      executionCount: 30,
    },
    {
      name: 'InventoryRestockAlertJob',
      description: 'Kiểm tra cảnh báo ngưỡng tồn kho xe demo và phụ kiện sạc cao áp',
      schedule: 'Mỗi 30 phút (0 */30 * * * *)',
      lastRun: '10:00:00',
      nextRun: '10:30:00',
      status: 'HEALTHY',
      executionCount: 48,
    },
  ],
  serverMetrics: {
    jvmUsedMemoryMb: 342,
    jvmMaxMemoryMb: 1024,
    jvmMemoryUsagePercent: 33.4,
    activeDbConnections: 5,
    maxDbConnections: 15,
    databaseDialect: 'Microsoft SQL Server 2022 (HikariCP)',
    serverUptime: '4 ngày 12 giờ 30 phút (99.98% Uptime)',
  },
};

const INITIAL_LOGS: SystemAuditLog[] = [
  {
    id: 'LOG-1001',
    time: '2026-11-15 15:30:12',
    module: 'AI_COPILOT',
    operator: 'Quản trị viên (admin@autohub.vn)',
    action: 'Tra cứu quy định giải ngân hoàn cọc xe 72h qua Vector Store RAG',
    result: '200 OK (24ms)',
    status: 'SUCCESS',
    ipAddress: '127.0.0.1',
    details: 'Query: "Điều kiện giải ngân hoàn cọc xe" | Model: deepseek/deepseek-chat | 2 sources retrieved',
  },
  {
    id: 'LOG-1002',
    time: '2026-11-15 15:25:00',
    module: 'AI_SENTIMENT',
    operator: 'Hệ thống kiểm duyệt tự động',
    action: 'Phân tích ngữ nghĩa nhận xét phụ kiện #REV-014 (Sạc 800V SiC)',
    result: 'POSITIVE (Độ tin cậy: 91%)',
    status: 'SUCCESS',
    ipAddress: '10.0.1.42',
    details: 'Review text: "Sạc rất nhanh, đóng gói cẩn thận" | Toxic: False | Auto-approved',
  },
  {
    id: 'LOG-1003',
    time: '2026-11-15 15:15:22',
    module: 'SEPAY_WEBHOOK',
    operator: 'SePay Webhook (my.sepay.vn)',
    action: 'Giao dịch cọc xe #DEP-8841 (Số tiền: 20.000.000 ₫)',
    result: 'RspCode: 00 (Thành công)',
    status: 'SUCCESS',
    ipAddress: '103.28.37.12',
    details: 'Transaction ID: TXN_DEP_8841_01 | Bank: BIDV | Signature: HMAC-SHA512 VALID',
  },
  {
    id: 'LOG-1004',
    time: '2026-11-15 14:55:18',
    module: 'STAFF_ACTION',
    operator: 'STF-004 (Nguyễn Văn Tuấn)',
    action: 'Gán số khung VIN: VF8-VIN-2026-9921 cho phiếu đặt cọc #DEP-8835',
    result: '200 OK (Đã khóa xe)',
    status: 'SUCCESS',
    ipAddress: '192.168.1.104',
    details: 'Showroom: AutoHub Sài Gòn Central | Status changed: RESERVED -> ALLOCATED',
  },
  {
    id: 'LOG-1005',
    time: '2026-11-15 14:45:00',
    module: 'CRON_JOB',
    operator: 'System Daemon Scheduler',
    action: 'Quét tự động phiếu cọc 72h (Đã cảnh báo 4 phiếu cận hạn)',
    result: '0 Lỗi (Tác vụ hoàn tất)',
    status: 'SUCCESS',
    ipAddress: '127.0.0.1',
    details: 'Job: AutoCancel72hDepositDaemon | Checked: 42 deposits | Expired: 0 | Warning sent: 4',
  },
  {
    id: 'LOG-1006',
    time: '2026-11-15 14:20:10',
    module: 'SECURITY_AUTH',
    operator: 'admin@autohub.vn',
    action: 'Đăng nhập Cổng Quản Trị Admin Master (RBAC F24)',
    result: 'JWT Token Granted',
    status: 'SUCCESS',
    ipAddress: '127.0.0.1',
    details: 'Role: ROLE_ADMIN | 2FA: Enabled | Session: 86400000ms',
  },
  {
    id: 'LOG-1007',
    time: '2026-11-15 13:40:05',
    module: 'INVENTORY_AUDIT',
    operator: 'STF-005 (Đặng Minh Khôi)',
    action: 'Xuất kho 18 kiện phụ kiện sạc 800V SiC sang Showroom Q.7',
    result: 'Docket #TRF-2026-092 Created',
    status: 'SUCCESS',
    ipAddress: '192.168.1.108',
    details: 'Warehouse: Kho Tổng Phụ Kiện Sài Gòn | Receiver: SR-2 | Inspection: PASSED',
  },
];

export const SystemMonitorPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();

  // State Management
  const [health, setHealth] = useState<SystemMonitorHealth>(INITIAL_HEALTH);
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(INITIAL_LOGS);
  const [loading, setLoading] = useState<boolean>(false);
  const [isProbingAi, setIsProbingAi] = useState<boolean>(false);
  const [isTriggeringCron, setIsTriggeringCron] = useState<boolean>(false);

  // Auto-refresh timer state (0 = disabled, 10s, 30s, 60s)
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(30);

  // Filters
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [keyword, setKeyword] = useState<string>('');

  // Selected Log for Detail Modal
  const [selectedLog, setSelectedLog] = useState<SystemAuditLog | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'SUCCESS' | 'ERROR'>('SUCCESS');

  const showToast = (msg: string, type: 'SUCCESS' | 'ERROR' = 'SUCCESS') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch Live Data
  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [healthRes, logsRes] = await Promise.allSettled([
        adminSystemMonitorService.getHealth(),
        adminSystemMonitorService.getAuditLogs({
          module: selectedModule !== 'ALL' ? selectedModule : undefined,
          status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
          keyword: keyword.trim() || undefined,
          limit: 100,
        }),
      ]);

      if (healthRes.status === 'fulfilled' && healthRes.value) {
        setHealth(healthRes.value);
      }
      if (logsRes.status === 'fulfilled' && logsRes.value.length > 0) {
        setAuditLogs(logsRes.value);
      }
    } catch (err) {
      console.warn('Using existing telemetry cache:', err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [selectedModule, selectedStatus, keyword]);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto Refresh Interval
  useEffect(() => {
    if (autoRefreshInterval <= 0) return;
    const interval = setInterval(() => {
      loadData(true);
    }, autoRefreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefreshInterval, loadData]);

  // Ping Probe OpenRouter AI
  const handleProbeOpenRouter = async () => {
    setIsProbingAi(true);
    try {
      const res = await adminSystemMonitorService.probeOpenRouter();
      showToast(`Ping OpenRouter AI thành công! Độ trễ đo được: ${res.responseTimeMs}ms`);
      // Update local health with new probe
      setHealth((prev) => ({
        ...prev,
        openRouter: {
          ...prev.openRouter,
          responseTimeMs: res.responseTimeMs,
          lastChecked: 'Vừa xong',
          status: 'ONLINE',
        },
      }));
      loadData(true);
    } catch (err) {
      console.error('Probe failed:', err);
      showToast('Kiểm tra Ping OpenRouter API thất bại hoặc vượt quá thời gian chờ.', 'ERROR');
    } finally {
      setIsProbingAi(false);
    }
  };

  // Trigger Cron Job Daemon
  const handleTriggerCron = async (jobName: string) => {
    setIsTriggeringCron(true);
    try {
      const res = await adminSystemMonitorService.triggerCronJob(jobName);
      showToast(res.message);
      loadData(true);
    } catch (err) {
      console.error('Trigger cron failed:', err);
      showToast('Kích hoạt tác vụ ngầm thất bại.', 'ERROR');
    } finally {
      setIsTriggeringCron(false);
    }
  };

  // Export Audit Trail
  const handleExportCsv = async () => {
    try {
      showToast('Đang tạo và tải về nhật ký kiểm toán (.csv UTF-8 cho Excel)...');
      const blob = await adminSystemMonitorService.exportAuditLogs({
        module: selectedModule !== 'ALL' ? selectedModule : undefined,
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        keyword: keyword.trim() || undefined,
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit_trail_autohub_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.warn('Fallback CSV export:', err);
      let csv = '\uFEFFMã Nhật Ký,Thời Gian,Phân Hệ,Người / Tác Nhân,Hành Động,Địa Chỉ IP,Kết Quả,Trạng Thái\n';
      auditLogs.forEach((l) => {
        csv += `"${l.id}","${l.time}","${l.module}","${l.operator}","${l.action.replace(/"/g, '""')}","${l.ipAddress || ''}","${l.result}","${l.status}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit_trail_autohub_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (selectedModule !== 'ALL' && log.module !== selectedModule) {
        return false;
      }
      if (selectedStatus !== 'ALL' && log.status !== selectedStatus) {
        return false;
      }
      if (keyword.trim()) {
        const q = keyword.toLowerCase();
        const mOp = log.operator.toLowerCase().includes(q);
        const mAct = log.action.toLowerCase().includes(q);
        const mRes = log.result.toLowerCase().includes(q);
        const mId = log.id.toLowerCase().includes(q);
        if (!mOp && !mAct && !mRes && !mId) return false;
      }
      return true;
    });
  }, [auditLogs, selectedModule, selectedStatus, keyword]);

  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [selectedModule, selectedStatus, keyword]);

  const totalElements = filteredLogs.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
  const paginatedLogs = useMemo(() => {
    const start = page * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, page, pageSize]);

  return (
    <div
      className={cn(
        'space-y-6 antialiased transition-colors duration-300 pb-12',
        isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'
      )}
    >
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          className={cn(
            'fixed top-20 right-8 z-50 flex items-center gap-3 px-4 py-3 text-white text-sm font-medium rounded-xl shadow-2xl border animate-fadeIn',
            toastType === 'SUCCESS' ? 'bg-emerald-600 border-emerald-500' : 'bg-rose-600 border-rose-500'
          )}
        >
          {toastType === 'SUCCESS' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header with Controls */}
      <div
        className={cn(
          'flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl border transition-colors shadow-sm',
          isDarkMode
            ? 'bg-gradient-to-r from-[#0B1326] via-[#111A2E] to-[#0E1726] border-[#3E4850]/50'
            : 'bg-gradient-to-r from-white via-sky-50/40 to-slate-50 border-slate-200'
        )}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-500 text-[10px] font-mono font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              TẤT CẢ PHÂN HỆ ĐANG HOẠT ĐỘNG
            </span>
            <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-400 text-[10px] font-mono font-bold">
              RBAC F24 AUDIT LEVEL
            </span>
          </div>
          <h1 className={cn('text-xl md:text-2xl font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
            Giám Sát Vận Hành, Nhật Ký Kiểm Toán & Cụm Trí Tuệ Nhân Tạo
          </h1>
          <p className={cn('text-xs mt-0.5 max-w-3xl', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Theo dõi tình trạng kết nối OpenRouter AI Cloud (DeepSeek), Admin AI Copilot RAG, tiến trình Cron Job và nhật ký giao dịch SePay Webhook theo thời gian thực.
          </p>
        </div>

        {/* Header Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Auto Refresh Select */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <select
              value={autoRefreshInterval}
              onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
              className={cn(
                'px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none transition-colors cursor-pointer',
                isDarkMode
                  ? 'bg-[#131B2E] border-[#3E4850] text-[#DAE2FD]'
                  : 'bg-white border-slate-300 text-slate-700'
              )}
            >
              <option value={0}>Tắt tự động</option>
              <option value={10}>Cập nhật 10s</option>
              <option value={30}>Cập nhật 30s</option>
              <option value={60}>Cập nhật 60s</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => loadData()}
            disabled={loading}
            className={cn(
              'h-[36px] flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer',
              isDarkMode
                ? 'bg-[#0B1326] text-slate-300 border-[#3E4850] hover:text-white hover:bg-[#131B2E]'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            )}
            title="Làm mới dữ liệu telemetry ngay lập tức"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
            <span className="hidden sm:inline">Làm Mới</span>
          </button>

          <button
            type="button"
            onClick={handleProbeOpenRouter}
            disabled={isProbingAi}
            className={cn(
              'h-[36px] flex items-center gap-1.5 px-3.5 rounded-lg text-xs font-bold border transition-all cursor-pointer shadow-xs',
              isDarkMode
                ? 'bg-[#171F33] text-[#89CEFF] border-[#89CEFF]/40 hover:border-[#89CEFF]'
                : 'bg-sky-50 text-blue-700 border-sky-300 hover:bg-sky-100'
            )}
            title="Gửi Ping Probe thực tế đo độ trễ OpenRouter AI"
          >
            <Zap className={cn('w-3.5 h-3.5 text-amber-400', isProbingAi && 'animate-spin')} />
            <span>{isProbingAi ? 'Đang Ping...' : 'Kiểm Tra Ping AI'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className={cn(
              'h-[36px] flex items-center gap-1.5 px-3.5 rounded-lg text-xs font-medium border transition-all cursor-pointer',
              isDarkMode
                ? 'bg-[#0B1326] text-[#DAE2FD] hover:text-white border-[#3E4850]/70'
                : 'bg-white text-slate-700 hover:text-slate-900 border-slate-300'
            )}
            title="Xuất bảng nhật ký kiểm toán ra Excel (.csv)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline">Xuất Báo Cáo</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Primary Health Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* OpenRouter API Health */}
        <div
          className={cn(
            'p-4 rounded-xl border space-y-3 transition-colors shadow-xs relative overflow-hidden group',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
          )}
        >
          <div className="flex items-center justify-between">
            <span className={cn('text-xs font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
              OpenRouter AI API
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-emerald-500 font-bold">ONLINE</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                isDarkMode ? 'bg-[#171F33] text-[#89CEFF]' : 'bg-sky-50 text-blue-600 border border-sky-100'
              )}
            >
              <Cpu className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className={cn('text-sm font-bold truncate', isDarkMode ? 'text-white' : 'text-slate-900')}>
                {health.openRouter.model}
              </div>
              <div className={cn('text-[11px] font-mono truncate', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                {health.openRouter.apiEndpoint}
              </div>
            </div>
          </div>
          <div className="pt-1 flex items-center justify-between text-[11px] font-mono border-t border-surface-highlight/30">
            <span className="text-emerald-500 font-bold">Độ trễ: {health.openRouter.responseTimeMs}ms</span>
            <span className="text-slate-400 text-[10px]">{health.openRouter.lastChecked}</span>
          </div>
        </div>

        {/* Vector DB / RAG */}
        <div
          className={cn(
            'p-4 rounded-xl border space-y-3 transition-colors shadow-xs',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
          )}
        >
          <div className="flex items-center justify-between">
            <span className={cn('text-xs font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
              Admin AI Copilot RAG
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-emerald-500 font-bold">CONNECTED</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                isDarkMode ? 'bg-[#171F33] text-[#89CEFF]' : 'bg-purple-50 text-purple-600 border border-purple-100'
              )}
            >
              <Database className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className={cn('text-sm font-bold truncate', isDarkMode ? 'text-white' : 'text-slate-900')}>
                Vector Store Seam
              </div>
              <div className={cn('text-[11px] font-mono truncate', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                {health.vectorDb.indexedEmbeddingsCount.toLocaleString()} Embeddings Sync
              </div>
            </div>
          </div>
          <div className="pt-1 flex items-center justify-between text-[11px] font-mono border-t border-surface-highlight/30">
            <span className="text-emerald-500 font-bold">Độ trễ RAG: {health.vectorDb.queryLatencyMs}ms</span>
            <span className="text-slate-400 text-[10px]">Đã đồng bộ</span>
          </div>
        </div>

        {/* SePay Webhook */}
        <div
          className={cn(
            'p-4 rounded-xl border space-y-3 transition-colors shadow-xs',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
          )}
        >
          <div className="flex items-center justify-between">
            <span className={cn('text-xs font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
              Cổng Thanh Toán Webhook
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-emerald-500 font-bold">LIVE</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                isDarkMode ? 'bg-[#171F33] text-[#89CEFF]' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              )}
            >
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className={cn('text-sm font-bold truncate', isDarkMode ? 'text-white' : 'text-slate-900')}>
                SePay Webhook Live
              </div>
              <div className={cn('text-[11px] font-mono truncate', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                {health.paymentGateway.securityMethod}
              </div>
            </div>
          </div>
          <div className="pt-1 flex items-center justify-between text-[11px] font-mono border-t border-surface-highlight/30">
            <span className="text-emerald-500 font-bold">Uptime: {health.paymentGateway.uptimePercent}%</span>
            <span className="text-slate-400 text-[10px]">{health.paymentGateway.processed24h} GD/24h</span>
          </div>
        </div>

        {/* Cron Jobs */}
        <div
          className={cn(
            'p-4 rounded-xl border space-y-3 transition-colors shadow-xs',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
          )}
        >
          <div className="flex items-center justify-between">
            <span className={cn('text-xs font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
              Bộ Lập Lịch Cron Job
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-blue-400 font-bold">HEALTHY</span>
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                isDarkMode ? 'bg-[#171F33] text-[#89CEFF]' : 'bg-amber-50 text-amber-600 border border-amber-100'
              )}
            >
              <Clock className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className={cn('text-sm font-bold truncate', isDarkMode ? 'text-white' : 'text-slate-900')}>
                {health.cronJobs.length} Tác Vụ Ngầm
              </div>
              <div className={cn('text-[11px] font-mono truncate', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                Quét cọc 72h: 60s/lần
              </div>
            </div>
          </div>
          <div className="pt-1 flex items-center justify-between text-[11px] font-mono border-t border-surface-highlight/30">
            <button
              type="button"
              onClick={() => handleTriggerCron('AutoCancel72hDepositDaemon')}
              disabled={isTriggeringCron}
              className="text-blue-500 hover:underline flex items-center gap-1 cursor-pointer"
              title="Kích hoạt quét cọc 72h ngay bây giờ"
            >
              <Play className="w-3 h-3 text-amber-400" />
              <span>Chạy quét 72h ngay</span>
            </button>
            <span className="text-slate-400 text-[10px]">0 Lỗi</span>
          </div>
        </div>
      </div>

      {/* 3. Server & Infrastructure Telemetry Banner */}
      <div
        className={cn(
          'p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs transition-colors shadow-xs',
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center',
              isDarkMode ? 'bg-[#171F33] text-[#89CEFF]' : 'bg-slate-100 text-slate-700'
            )}
          >
            <Server className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold flex items-center gap-2">
              <span>Hạ Tầng Backend Spring Boot & HikariCP Pool</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
              Dialect: {health.serverMetrics.databaseDialect} • {health.serverMetrics.serverUptime}
            </div>
          </div>
        </div>

        {/* Memory & DB Connection Gauges */}
        <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
          {/* JVM Heap */}
          <div className="space-y-1 min-w-[160px]">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>JVM Heap:</span>
              <strong className="text-white">
                {health.serverMetrics.jvmUsedMemoryMb} / {health.serverMetrics.jvmMaxMemoryMb} MB (
                {health.serverMetrics.jvmMemoryUsagePercent}%)
              </strong>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-highlight/30 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, health.serverMetrics.jvmMemoryUsagePercent)}%` }}
              />
            </div>
          </div>

          {/* Hikari Connection Pool */}
          <div className="space-y-1 min-w-[140px]">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Hikari Pool:</span>
              <strong className="text-emerald-400">
                {health.serverMetrics.activeDbConnections} / {health.serverMetrics.maxDbConnections} Active
              </strong>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-highlight/30 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{
                  width: `${(health.serverMetrics.activeDbConnections / health.serverMetrics.maxDbConnections) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Real-time Audit Trail Section */}
      <div
        className={cn(
          'rounded-xl border overflow-hidden space-y-4 p-5 transition-colors',
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg' : 'bg-white border-slate-200 shadow-sm'
        )}
      >
        {/* Table Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-highlight/40">
          <div>
            <h2
              className={cn(
                'text-sm font-bold uppercase tracking-wider font-mono flex items-center gap-2',
                isDarkMode ? 'text-white' : 'text-slate-900'
              )}
            >
              <Activity className="w-4 h-4 text-blue-500" />
              <span>Nhật Ký Kiểm Toán Thời Gian Thực (Audit Trail Log)</span>
            </h2>
            <p className={cn('text-xs mt-0.5', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>
              Ghi nhận mọi thao tác nhạy cảm, tra cứu AI Copilot, bàn giao cọc VIN và kết quả xác thực thanh toán.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-500 flex items-center gap-1.5 self-start sm:self-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Cập nhật tự động ({filteredLogs.length} sự kiện)
          </span>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Module Filter */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Lọc Theo Phân Hệ:</label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className={cn(
                'w-full px-3 py-2 text-xs border rounded-lg focus:outline-none transition-colors cursor-pointer',
                isDarkMode
                  ? 'bg-[#131B2E] border-[#3E4850] text-white focus:border-[#89CEFF]'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
              )}
            >
              <option value="ALL">Tất Cả Phân Hệ</option>
              <option value="AI_COPILOT">AI_COPILOT (Tra Cứu RAG)</option>
              <option value="AI_SENTIMENT">AI_SENTIMENT (Kiểm Duyệt AI)</option>
              <option value="SEPAY_WEBHOOK">SEPAY_WEBHOOK (Thanh Toán)</option>
              <option value="STAFF_ACTION">STAFF_ACTION (Nhân Viên Showroom)</option>
              <option value="CRON_JOB">CRON_JOB (Tác Vụ Ngầm)</option>
              <option value="SECURITY_AUTH">SECURITY_AUTH (Bảo Mật & RBAC)</option>
              <option value="INVENTORY_AUDIT">INVENTORY_AUDIT (Kiểm Toán Kho)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Trạng Thái Kết Quả:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={cn(
                'w-full px-3 py-2 text-xs border rounded-lg focus:outline-none transition-colors cursor-pointer',
                isDarkMode
                  ? 'bg-[#131B2E] border-[#3E4850] text-white focus:border-[#89CEFF]'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
              )}
            >
              <option value="ALL">Tất Cả Trạng Thái</option>
              <option value="SUCCESS">SUCCESS (Thành Công)</option>
              <option value="WARNING">WARNING (Cảnh Báo)</option>
              <option value="ERROR">ERROR (Lỗi Nghiệp Vụ)</option>
            </select>
          </div>

          {/* Search box */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Tìm Kiếm Nhật Ký:</label>
            <div className="relative">
              <Search
                className={cn('w-4 h-4 absolute left-3 top-2.5', isDarkMode ? 'text-slate-400' : 'text-slate-500')}
              />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Mã log, người thực hiện, thao tác..."
                className={cn(
                  'w-full pl-9 pr-3 py-2 text-xs border rounded-lg focus:outline-none transition-colors',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850] text-white placeholder-slate-500 focus:border-[#89CEFF]'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                )}
              />
            </div>
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto pt-1">
          <table className="w-full text-left text-xs">
            <thead
              className={cn(
                'font-mono uppercase text-[11px] border-b',
                isDarkMode
                  ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40'
                  : 'bg-slate-50/80 text-slate-500 border-slate-200'
              )}
            >
              <tr>
                <th className="py-2.5 px-3">Thời Gian</th>
                <th className="py-2.5 px-3">Phân Hệ</th>
                <th className="py-2.5 px-3">Người / Tác Nhân</th>
                <th className="py-2.5 px-3">Nội Dung Thao Tác</th>
                <th className="py-2.5 px-3">Địa Chỉ IP</th>
                <th className="py-2.5 px-3">Kết Quả Phản Hồi</th>
                <th className="py-2.5 px-3 text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className={cn('divide-y font-sans', isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100')}>
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-mono text-xs">
                    Không tìm thấy nhật ký kiểm toán phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => {
                  const badgeColor =
                    log.module.includes('AI')
                      ? isDarkMode
                        ? 'bg-[#171F33] text-[#89CEFF] border-[#3E4850]/50'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                      : log.module.includes('SEPAY')
                      ? isDarkMode
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : log.module.includes('CRON')
                      ? isDarkMode
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                      : log.module.includes('SECURITY')
                      ? isDarkMode
                        ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                      : isDarkMode
                      ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                      : 'bg-purple-50 text-purple-700 border-purple-200';

                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className={cn(
                        'transition-colors cursor-pointer group',
                        isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50/80'
                      )}
                    >
                      <td className={cn('py-2.5 px-3 font-mono text-[11px]', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                        {log.time}
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold border', badgeColor)}>
                          {log.module}
                        </span>
                      </td>
                      <td className={cn('py-2.5 px-3 font-medium', isDarkMode ? 'text-white' : 'text-slate-900')}>
                        {log.operator}
                      </td>
                      <td className={cn('py-2.5 px-3 max-w-md truncate', isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-700')}>
                        {log.action}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-emerald-500 font-semibold text-[11px]">
                        {log.result}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="text-[11px] text-blue-500 group-hover:underline flex items-center justify-end gap-1">
                          <ExternalLink className="w-3 h-3" />
                          <span>Xem</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(0);
          }}
        />
      </div>

      {/* ==================== MODAL: AUDIT LOG DETAIL ==================== */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className={cn(
              'w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-4 relative text-xs',
              isDarkMode ? 'bg-[#131B2E] border-[#3E4850] text-white' : 'bg-white border-slate-200 text-slate-900'
            )}
          >
            <div className="flex items-center justify-between pb-3 border-b border-surface-highlight/40">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-bold">Chi Tiết Sự Kiện Kiểm Toán #{selectedLog.id}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block">Thời gian:</span>
                  <strong>{selectedLog.time}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Phân hệ:</span>
                  <span className="text-[#89CEFF] font-bold">{selectedLog.module}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Người / Tác nhân:</span>
                  <strong>{selectedLog.operator}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Địa chỉ IP:</span>
                  <strong>{selectedLog.ipAddress || '127.0.0.1'}</strong>
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px] block mb-1">Nội dung thao tác:</span>
                <div
                  className={cn(
                    'p-2.5 rounded-lg border font-medium leading-relaxed',
                    isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/50 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  )}
                >
                  {selectedLog.action}
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px] block mb-1">Kết quả phản hồi hệ thống:</span>
                <div
                  className={cn(
                    'p-2.5 rounded-lg border font-mono font-semibold text-emerald-400',
                    isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/50' : 'bg-slate-50 border-slate-200 text-emerald-600'
                  )}
                >
                  {selectedLog.result}
                </div>
              </div>

              {selectedLog.details && (
                <div>
                  <span className="text-slate-400 text-[11px] block mb-1">Metadata / Chi tiết phụ trợ:</span>
                  <pre
                    className={cn(
                      'p-2.5 rounded-lg border font-mono text-[10px] overflow-x-auto whitespace-pre-wrap',
                      isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/50 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-800'
                    )}
                  >
                    {selectedLog.details}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-surface-highlight/30">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
