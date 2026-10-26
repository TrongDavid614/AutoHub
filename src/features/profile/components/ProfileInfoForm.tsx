import React, { useState } from 'react';
import { ShieldCheck, Check, AlertCircle, User as UserIcon, Mail, Phone, CreditCard, Save, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export const ProfileInfoForm: React.FC = () => {
  const { user, updateUser } = useAuthStore();

  const [fullName, setFullName] = useState(user?.fullName || 'Nguyễn Văn A');
  const [phone, setPhone] = useState(user?.phoneNumber || '0912345678');
  const [identityCard, setIdentityCard] = useState(user?.identityCardNumber || '079204001234');
  const [avatarUrl] = useState(
    user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  );

  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
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
    setTimeout(() => {
      updateUser({
        fullName,
        phoneNumber: phone,
        identityCardNumber: identityCard,
      });
      setIsSaving(false);
      setProfileSuccess('Cập nhật hồ sơ thành công! Thông tin định danh đã được đồng bộ.');
      setTimeout(() => setProfileSuccess(''), 3000);
    }, 600);
  };

  return (
    <div className="rounded-[6px] bg-surface-elevated/80 border border-surface-highlight p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-surface-highlight">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-accent-primary" />
          <h2 className="text-base font-bold text-text-primary">Thông Tin Định Danh Khách Hàng (UC03)</h2>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          <span>Đã xác thực OTP</span>
        </span>
      </div>

      {/* Avatar và thông tin tóm tắt */}
      <div className="flex items-center gap-4 pb-2">
        <img
          src={avatarUrl}
          alt={fullName}
          className="w-16 h-16 rounded-full border-2 border-accent-primary object-cover shadow-md"
        />
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-text-primary">{fullName}</h3>
          <p className="text-xs text-text-muted font-mono">{user?.email || 'nguyenvana@gmail.com'}</p>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-surface-container border border-amber-400/40 text-[10px] font-mono text-amber-300 font-bold">
            <Sparkles className="w-2.5 h-2.5" />
            <span>★ GT-E VIP RESERVE</span>
          </div>
        </div>
      </div>

      {profileSuccess && (
        <div className="p-3 rounded bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{profileSuccess}</span>
        </div>
      )}
      {profileError && (
        <div className="p-3 rounded bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{profileError}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary">
              Họ và tên <span className="text-accent-primary">*</span>
            </label>
            <div className="relative flex items-center">
              <UserIcon className="w-4 h-4 text-text-muted absolute left-3 pointer-events-none" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full h-10 pl-9 pr-3 bg-canvas-deep border border-surface-highlight focus:border-accent-primary rounded-[4px] text-xs text-text-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary">
              Địa chỉ Email <span className="text-text-muted font-normal">(Định danh duy nhất)</span>
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-text-muted absolute left-3 pointer-events-none" />
              <input
                type="email"
                disabled
                value={user?.email || 'nguyenvana@gmail.com'}
                className="w-full h-10 pl-9 pr-3 bg-canvas-deep/60 border border-surface-highlight/60 rounded-[4px] text-xs text-text-muted cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary">
              Số điện thoại <span className="text-accent-primary">*</span>
            </label>
            <div className="relative flex items-center">
              <Phone className="w-4 h-4 text-text-muted absolute left-3 pointer-events-none" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912 345 678"
                className="w-full h-10 pl-9 pr-3 bg-canvas-deep border border-surface-highlight focus:border-accent-primary rounded-[4px] text-xs text-text-primary font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-text-primary">
                Số CCCD định danh <span className="text-amber-400">*</span>
              </label>
              <span className="text-[10px] text-amber-300 font-mono">Dùng cho cọc xe 72h</span>
            </div>
            <div className="relative flex items-center">
              <CreditCard className="w-4 h-4 text-text-muted absolute left-3 pointer-events-none" />
              <input
                type="text"
                maxLength={12}
                value={identityCard}
                onChange={(e) => setIdentityCard(e.target.value)}
                placeholder="12 chữ số CCCD gắn chip"
                className="w-full h-10 pl-9 pr-3 bg-canvas-deep border border-surface-highlight focus:border-amber-400 rounded-[4px] text-xs text-text-primary font-mono tracking-wider focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="p-3 rounded-[4px] bg-canvas-deep border border-surface-highlight/70 text-xs text-text-muted leading-relaxed">
          <span className="text-accent-primary font-semibold">Lưu ý quy chế AutoHub (BR01):</span> Số Căn cước công dân (CCCD) là trường thông tin pháp lý bắt buộc khi quý khách tiến hành Đặt cọc giữ xe ô tô trực tuyến 72 giờ và xuất hóa đơn thuế điện tử tại showroom.
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-[2px] bg-accent-action hover:bg-accent-primary text-xs font-bold text-accent-contrast flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi Hồ Sơ'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
