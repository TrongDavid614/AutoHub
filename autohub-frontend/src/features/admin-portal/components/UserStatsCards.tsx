import React from 'react';
import { Users, Shield, UserCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { cn } from '@/lib/utils';
import type { AdminUserStats } from '@/types/admin-user.types';

export interface UserStatsCardsProps {
  stats: AdminUserStats | null;
  selectedRole: string;
  onSelectRole: (roleId: string) => void;
}

export const UserStatsCards: React.FC<UserStatsCardsProps> = ({
  stats,
  selectedRole,
  onSelectRole,
}) => {
  const { isDarkMode } = useAdminTheme();

  const cards = [
    {
      id: 'ALL',
      title: 'Tổng Tài Khoản',
      count: stats?.totalUsers ?? 0,
      sub: `${stats?.activeCount ?? 0} đang hoạt động`,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      activeRing: 'border-blue-500',
    },
    {
      id: 'ROLE_ADMIN',
      title: 'Quản Trị Viên',
      count: stats?.adminCount ?? 0,
      sub: 'Toàn quyền cấu hình hệ thống',
      icon: Shield,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
      activeRing: 'border-rose-500',
    },
    {
      id: 'ROLE_STAFF',
      title: 'Nhân Viên Showroom',
      count: stats?.staffCount ?? 0,
      sub: 'Tư vấn bán hàng & điều phối',
      icon: UserCheck,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      activeRing: 'border-amber-500',
    },
    {
      id: 'ROLE_CUSTOMER',
      title: 'Khách Hàng',
      count: stats?.customerCount ?? 0,
      sub: 'Khách trực tuyến & cọc xe',
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      activeRing: 'border-emerald-500',
    },
    {
      id: 'LOCKED',
      title: 'Tài Khoản Bị Khóa',
      count: stats?.lockedCount ?? 0,
      sub: 'Tạm ngưng do vi phạm/bảo mật',
      icon: ShieldAlert,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      activeRing: 'border-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        const isSelected = selectedRole === c.id;

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectRole(c.id)}
            className={cn(
              'p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group',
              isDarkMode
                ? 'bg-[#0B1326] border-[#3E4850]/40 hover:border-[#89CEFF]/50'
                : 'bg-white border-slate-200 hover:border-blue-400 shadow-xs',
              isSelected &&
                (isDarkMode
                  ? 'border-[#89CEFF] ring-1 ring-[#89CEFF]/50 bg-[#131B2E]'
                  : 'border-blue-600 ring-1 ring-blue-500 bg-blue-50/30')
            )}
          >
            <div className="flex items-center justify-between w-full">
              <span
                className={cn(
                  'text-[11px] font-medium tracking-tight',
                  isDarkMode ? 'text-[#88929B]' : 'text-slate-500'
                )}
              >
                {c.title}
              </span>
              <div className={cn('p-1.5 rounded-lg', c.bgColor, c.color)}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-2">
              <div
                className={cn(
                  'text-xl font-bold font-mono',
                  isDarkMode ? 'text-white' : 'text-slate-900'
                )}
              >
                {c.count}
              </div>
              <div
                className={cn(
                  'text-[10px] mt-0.5 truncate',
                  isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
                )}
              >
                {c.sub}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
