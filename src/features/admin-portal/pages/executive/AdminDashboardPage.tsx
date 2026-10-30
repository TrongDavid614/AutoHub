import React, { useState } from 'react';
import { AdminWelcomeBanner } from '@/features/admin-portal/components/AdminWelcomeBanner';
import { AdminStatCards } from '@/features/admin-portal/components/AdminStatCards';
import { RevenueAndCashflowChart } from '@/features/admin-portal/components/RevenueAndCashflowChart';
import { RegionalBreakupCard } from '@/features/admin-portal/components/RegionalBreakupCard';
import { UrgentActionQueue } from '@/features/admin-portal/components/UrgentActionQueue';
import { AiEngineMonitorCard } from '@/features/admin-portal/components/AiEngineMonitorCard';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { cn } from '@/lib/utils';

export const AdminDashboardPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div
      className={cn(
        'w-full space-y-6 antialiased pb-12 animate-fade-in transition-colors duration-300',
        isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'
      )}
    >
      {/* 1. EXECUTIVE DASHBOARD BANNER */}
      <AdminWelcomeBanner onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      {/* 2. STAT CARD GRID - 4 CORE KPIS (<StatCardGrid>) */}
      <AdminStatCards />

      {/* 3. REVENUE & REGIONAL DISTRIBUTION SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 8-Cols: Dual Line Chart (Phụ Kiện vs Cọc Xe 72h) */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <RevenueAndCashflowChart className="h-full" />
        </div>

        {/* Right 4-Cols: Regional Showroom Revenue Donut & Breakdown */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <RegionalBreakupCard className="h-full" />
        </div>
      </div>

      {/* 4. OPERATIONAL MATTERS: URGENT 72H ACTION QUEUE */}
      <div className="w-full">
        <UrgentActionQueue />
      </div>

      {/* 5. INFRASTRUCTURE & AI GEMINI API ENGINE HEALTH MONITOR */}
      <AiEngineMonitorCard />
    </div>
  );
};
