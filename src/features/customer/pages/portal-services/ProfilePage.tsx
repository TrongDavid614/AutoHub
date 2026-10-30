import React from 'react';
import { User as UserIcon, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { ProfileStatsCards } from '@/features/customer/components/ProfileStatsCards';
import { ProfileInfoForm } from '@/features/customer/components/ProfileInfoForm';
import { ChangePasswordForm } from '@/features/customer/components/ChangePasswordForm';

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const avatarUrl =
    user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

  return (
    <div className="space-y-8">
      {/* 1. Header trang & Huy hiệu thành viên */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-highlight">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={avatarUrl}
              alt={user?.fullName || 'Avatar'}
              className="w-14 h-14 rounded-full object-cover border-2 border-accent-primary shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-canvas-primary flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <UserIcon className="w-6 h-6 text-accent-primary" />
              <h1 className="text-xl md:text-2xl font-bold text-text-primary">Hồ Sơ Cá Nhân & Định Danh</h1>
            </div>
            <p className="text-sm text-text-muted mt-0.5">
              Quản lý hồ sơ hội viên cá nhân, thông tin liên lạc và cập nhật mật khẩu bảo mật tài khoản.
            </p>
          </div>
        </div>
    
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] bg-accent-action/10 border border-accent-primary/30 text-accent-primary self-start sm:self-auto shadow-sm">
          <Sparkles className="w-4 h-4 animate-spin text-accent-primary" />
          <span className="text-xs font-mono font-bold tracking-wider">HẠNG THÀNH VIÊN: VIP TITANIUM</span>
        </div>
      </div>

      {/* 2. Thống kê tổng quan */}
      <ProfileStatsCards />

      {/* 3. Nội dung 2 cột: Thông tin cá nhân & Đổi mật khẩu */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileInfoForm />
        </div>
        <div className="lg:col-span-1">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
};
