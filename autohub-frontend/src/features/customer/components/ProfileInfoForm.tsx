import React, { useState } from 'react';
import { ShieldCheck, Check, AlertCircle, User as UserIcon, Mail, Phone, CreditCard, Save, Camera } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { profileService } from '@/features/customer/services/profile.service';
import { AvatarChangeModal } from '@/features/customer/components/AvatarChangeModal';

export interface ProfileInfoFormProps {
  onOpenAvatarModal?: () => void;
}

export const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({ onOpenAvatarModal }) => {
  const { user, updateUser } = useAuthStore();

  const [fullName, setFullName] = useState(user?.fullName || 'Nguyễn Văn A');
  const [phone, setPhone] = useState(user?.phoneNumber || '0912345678');
  const [identityCard, setIdentityCard] = useState(user?.identityCardNumber || '079204001234');
  const [isInternalModalOpen, setIsInternalModalOpen] = useState(false);

  const currentAvatarUrl =
    user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenModal = () => {
    if (onOpenAvatarModal) {
      onOpenAvatarModal();
    } else {
      setIsInternalModalOpen(true);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!fullName.trim()) {
      setProfileError('Họ và tên không được để trống.');
      return;
    }

    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(phone)) {
      setProfileError('Số điện thoại không hợp lệ (yêu cầu 10 chữ số đầu số nhà mạng Việt Nam).');
      return;
    }

    if (identityCard && !/^[0-9]{12}$/.test(identityCard)) {
      setProfileError('Số Căn cước công dân (CCCD) phải bao gồm đúng 12 chữ số.');
      return;
    }

    setIsSaving(true);
    try {
      const success = await profileService.updateProfile({
        customerId: user?.id,
        fullName,
        phoneNumber: phone,
        identityCardNumber: identityCard || undefined,
        avatarUrl: user?.avatarUrl,
      });
      if (!success) {
        setProfileError('Không thể lưu thay đổi lúc này. Vui lòng thử lại sau.');
        return;
      }
      updateUser({
        fullName,
        phoneNumber: phone,
        identityCardNumber: identityCard,
      });
      setProfileSuccess('Cập nhật hồ sơ thành công! Thông tin định danh đã được lưu vào cơ sở dữ liệu.');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch {
      setProfileError('Lỗi kết nối máy chủ. Vui lòng kiểm tra lại.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-[6px] bg-surface-elevated/80 border border-surface-highlight p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-surface-highlight">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-accent-primary" />
          <h2 className="text-base font-bold text-text-primary">Thông Tin Định Danh Khách Hàng</h2>
        </div>
      </div>

      {/* Avatar và thông tin tóm tắt kèm nút đổi ảnh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)]">
        <div className="flex items-center gap-4">
          <div
            onClick={handleOpenModal}
            className="relative group cursor-pointer"
            title="Nhấp để đổi ảnh đại diện"
          >
            <img
              src={currentAvatarUrl}
              alt={fullName}
              className="w-16 h-16 rounded-full border-2 border-red-600 object-cover shadow-md group-hover:brightness-90 transition-all"
            />
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-600 border-2 border-[var(--surface)] flex items-center justify-center text-white shadow-sm">
              <Camera className="w-3 h-3" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-text-primary">Ảnh đại diện tài khoản</p>
            <p className="text-xs text-text-muted">Định dạng hỗ trợ: JPG, PNG, WebP hoặc Bộ sưu tập VIP (Tối đa 5MB)</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="px-3.5 py-2 rounded-lg border border-red-600/30 bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold text-red-600 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Thay đổi ảnh đại diện</span>
        </button>
      </div>

      {profileSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{profileSuccess}</span>
        </div>
      )}
      {profileError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{profileError}</span>
        </div>
      )}

      {/* Form chỉnh sửa thông tin */}
      <form onSubmit={handleSaveProfile} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-accent-primary" />
              <span>Họ và tên *</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-surface-highlight bg-surface text-text-primary focus:outline-none focus:border-accent-primary"
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-text-muted" />
              <span>Email liên hệ (Cố định theo tài khoản)</span>
            </label>
            <input
              type="email"
              disabled
              value={user?.email || 'customer@autohub.vn'}
              className="w-full px-3 py-2 text-xs rounded-lg border border-surface-highlight bg-surface-subtle text-text-muted cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-accent-primary" />
              <span>Số điện thoại *</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-surface-highlight bg-surface text-text-primary focus:outline-none focus:border-accent-primary"
              placeholder="0912345678"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-accent-primary" />
              <span>Số CCCD / CMND (12 chữ số)</span>
            </label>
            <input
              type="text"
              value={identityCard}
              onChange={(e) => setIdentityCard(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-surface-highlight bg-surface text-text-primary focus:outline-none focus:border-accent-primary"
              placeholder="079204001234"
              maxLength={12}
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-lg bg-accent-primary hover:bg-accent-primary/90 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Đang lưu hồ sơ...' : 'Lưu Thay Đổi Hồ Sơ'}</span>
          </button>
        </div>
      </form>

      {/* Internal Modal fallback */}
      {!onOpenAvatarModal && (
        <AvatarChangeModal
          isOpen={isInternalModalOpen}
          onClose={() => setIsInternalModalOpen(false)}
          currentAvatarUrl={currentAvatarUrl}
        />
      )}
    </div>
  );
};
