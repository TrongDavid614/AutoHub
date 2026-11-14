import React, { useState } from 'react';
import { AlertCircle, RotateCw, Inbox } from 'lucide-react';

import { Button } from '@/components/Button';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { cn } from '@/lib/utils';
import { AdminWelcomeBanner } from '@/features/admin-portal/components/AdminWelcomeBanner';
import { AdminStatCards } from '@/features/admin-portal/components/AdminStatCards';
import { RevenueAndCashflowChart } from '@/features/admin-portal/components/RevenueAndCashflowChart';
import { RegionalBreakupCard } from '@/features/admin-portal/components/RegionalBreakupCard';
import { UrgentActionQueue } from '@/features/admin-portal/components/UrgentActionQueue';
import { AiEngineMonitorCard } from '@/features/admin-portal/components/AiEngineMonitorCard';
import { useAdminDashboard } from '@/features/admin-portal/hooks/useAdminDashboard';

export const AdminDashboardPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
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
    <div
      className={cn(
        'w-full space-y-6 antialiased pb-12 animate-fade-in transition-colors duration-300',
        isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'
      )}
    >
      {/* 1. EXECUTIVE DASHBOARD BANNER */}
      <AdminWelcomeBanner onRefresh={handleRefresh} isRefreshing={isRefreshing || isLoading} />

      {/* 2. ERROR STATE */}
      {error && (
        <div
          className={cn(
            'p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300',
            isDarkMode
              ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          )}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-500">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Không thể tải dữ liệu Bảng Điều Khiển Admin</h3>
              <p className="text-xs opacity-90 mt-0.5">{error}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className={cn(
              'border-rose-300 text-rose-700 hover:bg-rose-100 flex items-center gap-2 cursor-pointer',
              isDarkMode && 'border-rose-700/60 text-rose-300 hover:bg-rose-900/40'
            )}
          >
            <RotateCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
            Thử lại kết nối
          </Button>
        </div>
      )}

      {/* 3. LOADING SKELETON */}
      {isLoading && !overview && (
        <div className="space-y-6 animate-pulse">
          {/* Skeleton 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  'h-36 rounded-xl border p-5 flex flex-col justify-between',
                  isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-100 border-slate-200'
                )}
              >
                <div className="flex justify-between items-start">
                  <div className={cn('w-10 h-10 rounded-lg', isDarkMode ? 'bg-[#1A233A]' : 'bg-slate-200')} />
                  <div className={cn('w-20 h-5 rounded', isDarkMode ? 'bg-[#1A233A]' : 'bg-slate-200')} />
                </div>
                <div className="space-y-2">
                  <div className={cn('w-32 h-6 rounded', isDarkMode ? 'bg-[#1A233A]' : 'bg-slate-200')} />
                  <div className={cn('w-44 h-3 rounded', isDarkMode ? 'bg-[#1A233A]' : 'bg-slate-200')} />
                </div>
              </div>
            ))}
          </div>

          {/* Skeleton Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div
              className={cn(
                'lg:col-span-8 h-80 rounded-xl border p-6',
                isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-100 border-slate-200'
              )}
            />
            <div
              className={cn(
                'lg:col-span-4 h-80 rounded-xl border p-6',
                isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-100 border-slate-200'
              )}
            />
          </div>

          {/* Skeleton Queue */}
          <div
            className={cn(
              'h-64 rounded-xl border p-6',
              isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-100 border-slate-200'
            )}
          />
        </div>
      )}

      {/* 4. EMPTY STATE */}
      {isEmpty && (
        <div
          className={cn(
            'p-12 rounded-xl border text-center flex flex-col items-center justify-center space-y-3',
            isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40 text-[#88929B]' : 'bg-white border-slate-200 text-slate-500'
          )}
        >
          <Inbox className="w-12 h-12 stroke-[1.5] text-slate-400" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
            Chưa có dữ liệu thống kê tổng quan
          </h3>
          <p className="text-xs max-w-md">
            Hệ thống chưa ghi nhận giao dịch phát sinh trong kỳ báo cáo hoặc kết nối dữ liệu đang được đồng bộ.
          </p>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2">
            Làm mới trang
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

      {/* 6. INFRASTRUCTURE & AI GEMINI API ENGINE HEALTH MONITOR */}
      <AiEngineMonitorCard />
    </div>
  );
};
