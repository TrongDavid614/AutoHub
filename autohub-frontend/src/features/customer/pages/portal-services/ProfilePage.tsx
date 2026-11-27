import React, { useState } from 'react';
import { User as UserIcon, ShieldCheck, Camera } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { ProfileStatsCards } from '@/features/customer/components/ProfileStatsCards';
import { ProfileInfoForm } from '@/features/customer/components/ProfileInfoForm';
import { ChangePasswordForm } from '@/features/customer/components/ChangePasswordForm';
import { AvatarChangeModal } from '@/features/customer/components/AvatarChangeModal';

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const avatarUrl =
    user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

  return (
    <div className="space-y-8">
      {/* 1. Header trang & Huy hiệu thành viên */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-highlight">
        <div className="flex items-center gap-4">
          <div
            onClick={() => setIsAvatarModalOpen(true)}
            className="relative group cursor-pointer"
            title="Nhấp để đổi ảnh đại diện"
          >
            <img
              src={avatarUrl}
              alt={user?.fullName || 'Avatar'}
              className="w-16 h-16 rounded-full object-cover border-2 border-red-600 shadow-md group-hover:brightness-90 transition-all"
            />
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-600 border-2 border-[var(--surface)] flex items-center justify-center text-white shadow-sm">
              <Camera className="w-3 h-3" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <UserIcon className="w-6 h-6 text-red-600" />
              <h1 className="text-xl md:text-2xl font-bold text-text-primary">Hồ Sơ Cá Nhân & Định Danh</h1>
            </div>
            <p className="text-sm text-text-muted mt-0.5">
              Quản lý hồ sơ hội viên cá nhân, thông tin liên lạc và cập nhật mật khẩu bảo mật tài khoản.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[var(--accent-soft)] border border-[var(--accent)]/25 text-[var(--accent)] self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs font-semibold">Hạng thành viên: VIP Titanium</span>
        </div>
      </div>

      {/* 2. Thống kê tổng quan */}
      <ProfileStatsCards />

      {/* 3. Nội dung 2 cột: Thông tin cá nhân & Đổi mật khẩu */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileInfoForm onOpenAvatarModal={() => setIsAvatarModalOpen(true)} />
        </div>
        <div className="lg:col-span-1">
          <ChangePasswordForm />
        </div>
      </div>

      {/* 4. Modal Đổi Ảnh Đại Diện */}
      <AvatarChangeModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatarUrl={avatarUrl}
      />
    </div>
  );
};
