import React, { useState } from 'react';
import { AlertCircle, RotateCw, Inbox } from 'lucide-react';

import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';
import { AdminWelcomeBanner } from '@/features/admin-portal/components/AdminWelcomeBanner';
import { AdminStatCards } from '@/features/admin-portal/components/AdminStatCards';
import { RevenueAndCashflowChart } from '@/features/admin-portal/components/RevenueAndCashflowChart';
import { RegionalBreakupCard } from '@/features/admin-portal/components/RegionalBreakupCard';
import { UrgentActionQueue } from '@/features/admin-portal/components/UrgentActionQueue';
import { AiEngineMonitorCard } from '@/features/admin-portal/components/AiEngineMonitorCard';
import { useAdminDashboard } from '@/features/admin-portal/hooks/useAdminDashboard';

export const AdminDashboardPage: React.FC = () => {
  const { overview, isLoading, error, refetch } = useAdminDashboard();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const isEmpty =
    !isLoading &&
    !error &&
    overview !== null &&
    overview.kpis.length === 0 &&
    overview.revenueChart.length === 0;

  return (
    <div className="w-full space-y-6 antialiased pb-12 text-[var(--text)]">
      {/* 1. EXECUTIVE DASHBOARD BANNER */}
      <AdminWelcomeBanner onRefresh={handleRefresh} isRefreshing={isRefreshing || isLoading} />

      {/* 2. ERROR STATE */}
      {error && (
        <div className="p-5 rounded-lg border border-red-200 bg-red-50 text-red-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold">Không thể tải dữ liệu Bảng điều khiển Admin</h3>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="border-red-300 text-red-700 hover:bg-red-100 flex items-center gap-2 cursor-pointer"
          >
            <RotateCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
            Thử lại
          </Button>
        </div>
      )}

      {/* 3. LOADING SKELETON */}
      {isLoading && !overview && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 flex flex-col justify-between"
              >
                <div className="w-24 h-4 rounded bg-[var(--surface-subtle)]" />
                <div className="space-y-2">
                  <div className="w-32 h-6 rounded bg-[var(--surface-subtle)]" />
                  <div className="w-40 h-3 rounded bg-[var(--surface-subtle)]" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 h-80 rounded-lg border border-[var(--line)] bg-[var(--surface)]" />
            <div className="lg:col-span-4 h-80 rounded-lg border border-[var(--line)] bg-[var(--surface)]" />
          </div>

          <div className="h-64 rounded-lg border border-[var(--line)] bg-[var(--surface)]" />
        </div>
      )}

      {/* 4. EMPTY STATE */}
      {isEmpty && (
        <div className="p-12 rounded-lg border border-[var(--line)] bg-[var(--surface)] text-center flex flex-col items-center justify-center space-y-3 text-[var(--text-secondary)]">
          <Inbox className="w-10 h-10 stroke-[1.5] text-[var(--text-muted)]" />
          <h3 className="text-base font-semibold text-[var(--text)]">
            Chưa có dữ liệu thống kê tổng quan
          </h3>
          <p className="text-xs max-w-md">
            Hệ thống chưa ghi nhận giao dịch phát sinh trong kỳ báo cáo.
          </p>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2">
            Làm mới
          </Button>
        </div>
      )}

      {/* 5. SUCCESS DATA DISPLAY */}
      {overview && (
        <>
          {/* STAT CARD GRID - 4 CORE KPIS */}
          <AdminStatCards kpis={overview.kpis} />

          {/* REVENUE & REGIONAL DISTRIBUTION SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 8-Cols: Dual Line Chart (Phụ Kiện vs Cọc Xe 72h) */}
            <div className="lg:col-span-8 flex flex-col h-full">
              <RevenueAndCashflowChart data={overview.revenueChart} className="h-full" />
            </div>

            {/* Right 4-Cols: Regional Showroom Revenue Donut & Breakdown */}
            <div className="lg:col-span-4 flex flex-col h-full">
              <RegionalBreakupCard revenues={overview.regionalRevenues} className="h-full" />
            </div>
          </div>

          {/* OPERATIONAL MATTERS: URGENT 72H ACTION QUEUE */}
          <div className="w-full">
            <UrgentActionQueue deposits={overview.urgentDeposits} />
          </div>
        </>
      )}

      {/* 6. INFRASTRUCTURE & AI OPENROUTER API ENGINE HEALTH MONITOR */}
      <AiEngineMonitorCard status={overview?.aiEngineStatus} />
    </div>
  );
};
