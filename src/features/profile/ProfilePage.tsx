import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  CreditCard,
  Lock,
  Sparkles,
  ShieldCheck,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Package,
  Calendar,
  Save,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();

  // Form thông tin cá nhân
  const [fullName, setFullName] = useState(user?.fullName || 'Nguyễn Văn A');
  const [phone, setPhone] = useState(user?.phoneNumber || '0912345678');
  const [identityCard, setIdentityCard] = useState(user?.identityCardNumber || '079204001234');
  const [avatarUrl] = useState(
    user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  );

  // Form đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Trạng thái thông báo
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Xử lý lưu thông tin cá nhân
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!fullName.trim()) {
      setProfileError('Họ và tên không được để trống.');
      return;
    }

    // Kiểm tra định dạng số điện thoại Việt Nam 10 chữ số
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(phone)) {
      setProfileError('Số điện thoại không hợp lệ (yêu cầu 10 chữ số đầu số nhà mạng Việt Nam).');
      return;
    }

    // Kiểm tra định dạng CCCD (12 chữ số) nếu có nhập
    if (identityCard && !/^[0-9]{12}$/.test(identityCard)) {
      setProfileError('Số Căn cước công dân (CCCD) phải bao gồm đúng 12 chữ số.');
      return;
    }

    setIsSavingProfile(true);
    setTimeout(() => {
      updateUser({
        fullName,
        phoneNumber: phone,
        identityCardNumber: identityCard,
      });
      setIsSavingProfile(false);
      setProfileSuccess('Cập nhật hồ sơ thành công! Thông tin định danh đã được đồng bộ.');
      setTimeout(() => setProfileSuccess(''), 3000);
    }, 600);
  };

  // Xử lý đổi mật khẩu
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Mật khẩu mới phải có tối thiểu 8 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Xác nhận mật khẩu mới không khớp.');
      return;
    }

    setIsSavingPassword(true);
    setTimeout(() => {
      setIsSavingPassword(false);
      setPasswordSuccess('Đổi mật khẩu tài khoản thành công! Vui lòng sử dụng mật khẩu mới cho lần đăng nhập tiếp theo.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 3500);
    }, 800);
  };

  return (
    <div className="space-y-8">
      {/* 1. Header trang & Huy hiệu thành viên */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2D3449]">
        <div>
          <div className="flex items-center gap-2">
            <UserIcon className="w-6 h-6 text-[#89CEFF]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#DAE2FD]">Hồ Sơ Thành Viên Cá Nhân</h1>
          </div>
          <p className="text-xs text-[#88929B] mt-1">
            Quản lý thông tin định danh Căn cước công dân (CCCD), tài khoản giao dịch và đặc quyền showroom AutoHub.
          </p>
        </div>

        {/* Badge VIP sang trọng */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] bg-[#171F33] border border-[#FFB86E]/40 shadow-sm self-start sm:self-auto">
          <Sparkles className="w-4 h-4 text-[#FFB86E]" />
          <div>
            <span className="font-mono text-xs font-bold text-[#FFB86E] uppercase tracking-wider block">
              ★ GT-E VIP RESERVE
            </span>
            <span className="text-[10px] text-[#88929B]">Thành viên từ: 2026</span>
          </div>
        </div>
      </div>

      {/* 2. Thống kê hoạt động cá nhân nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-[4px] bg-[#171F33]/60 border border-[#2D3449] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-[2px] bg-[#0EA5E9]/15 flex items-center justify-center text-[#89CEFF] shrink-0">
            <Package className="w-5 h-5 text-[#89CEFF]" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#88929B] uppercase">ĐƠN PHỤ KIỆN</div>
            <div className="text-lg font-bold text-[#DAE2FD] font-mono">08 Đơn hàng</div>
          </div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#171F33]/60 border border-[#2D3449] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-[2px] bg-[#FFB86E]/15 flex items-center justify-center text-[#FFB86E] shrink-0">
            <CreditCard className="w-5 h-5 text-[#FFB86E]" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#88929B] uppercase">PHIẾU CỌC XE 72H</div>
            <div className="text-lg font-bold text-[#FFB86E] font-mono">01 Đang giữ chỗ</div>
          </div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#171F33]/60 border border-[#2D3449] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-[2px] bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
            <Calendar className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#88929B] uppercase">LỊCH LÁI THỬ DEMO</div>
            <div className="text-lg font-bold text-emerald-400 font-mono">02 Đã hoàn tất</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột 1: Thông tin cá nhân & Định danh CCCD (2/3 chiều rộng) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[6px] bg-[#171F33]/80 border border-[#2D3449] p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#2D3449]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#89CEFF]" />
                <h2 className="text-base font-bold text-[#DAE2FD]">Thông Tin Định Danh Khách Hàng (UC03)</h2>
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
                className="w-16 h-16 rounded-full border-2 border-[#89CEFF] object-cover shadow-md"
              />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#DAE2FD]">{fullName}</h3>
                <p className="text-xs text-[#88929B] font-mono">{user?.email || 'nguyenvana@gmail.com'}</p>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#171F33] border border-[#FFB86E]/40 text-[10px] font-mono text-[#FFB86E] font-bold">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>★ GT-E VIP RESERVE</span>
                </div>
              </div>
            </div>

            {/* Thông báo thành công / lỗi profile */}
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
                {/* Họ và tên */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#DAE2FD]">
                    Họ và tên <span className="text-[#89CEFF]">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <UserIcon className="w-4 h-4 text-[#88929B] absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full h-10 pl-9 pr-3 bg-[#060E20] border border-[#2D3449] focus:border-[#89CEFF] rounded-[4px] text-xs text-[#DAE2FD] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email định danh (Bất biến) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#DAE2FD]">
                    Địa chỉ Email <span className="text-[#88929B] font-normal">(Định danh duy nhất)</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-[#88929B] absolute left-3 pointer-events-none" />
                    <input
                      type="email"
                      disabled
                      value={user?.email || 'nguyenvana@gmail.com'}
                      className="w-full h-10 pl-9 pr-3 bg-[#060E20]/60 border border-[#2D3449]/60 rounded-[4px] text-xs text-[#88929B] cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Số điện thoại */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#DAE2FD]">
                    Số điện thoại <span className="text-[#89CEFF]">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-[#88929B] absolute left-3 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912 345 678"
                      className="w-full h-10 pl-9 pr-3 bg-[#060E20] border border-[#2D3449] focus:border-[#89CEFF] rounded-[4px] text-xs text-[#DAE2FD] font-mono focus:outline-none"
                    />
                  </div>
                </div>

                {/* Số Căn cước công dân (CCCD) - Bắt buộc khi cọc xe theo BR01 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#DAE2FD]">
                      Số CCCD định danh <span className="text-[#FFB86E]">*</span>
                    </label>
                    <span className="text-[10px] text-[#FFB86E] font-mono">Dùng cho cọc xe 72h</span>
                  </div>
                  <div className="relative flex items-center">
                    <CreditCard className="w-4 h-4 text-[#88929B] absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      maxLength={12}
                      value={identityCard}
                      onChange={(e) => setIdentityCard(e.target.value)}
                      placeholder="12 chữ số CCCD gắn chip"
                      className="w-full h-10 pl-9 pr-3 bg-[#060E20] border border-[#2D3449] focus:border-[#FFB86E] rounded-[4px] text-xs text-[#DAE2FD] font-mono tracking-wider focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Ghi chú quy tắc nghiệp vụ BR01 */}
              <div className="p-3 rounded-[4px] bg-[#060E20] border border-[#2D3449]/70 text-xs text-[#88929B] leading-relaxed">
                <span className="text-[#89CEFF] font-semibold">Lưu ý quy chế AutoHub (BR01):</span> Số Căn cước công dân (CCCD) là trường thông tin pháp lý bắt buộc khi quý khách tiến hành Đặt cọc giữ xe ô tô trực tuyến 72 giờ và xuất hóa đơn thuế điện tử tại showroom.
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2.5 rounded-[2px] bg-[#0EA5E9] hover:bg-[#38BDF8] text-xs font-bold text-[#00344D] flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? 'Đang lưu...' : 'Lưu Thay Đổi Hồ Sơ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Cột 2: Đổi Mật Khẩu Bảo Mật (1/3 chiều rộng) */}
        <div className="space-y-6">
          <div className="rounded-[6px] bg-[#171F33]/80 border border-[#2D3449] p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-[#2D3449]">
              <Lock className="w-5 h-5 text-[#89CEFF]" />
              <h2 className="text-base font-bold text-[#DAE2FD]">Bảo Mật & Mật Khẩu</h2>
            </div>

            {/* Thông báo đổi mật khẩu */}
            {passwordSuccess && (
              <div className="p-3 rounded bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}
            {passwordError && (
              <div className="p-3 rounded bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Mật khẩu hiện tại */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#DAE2FD]">Mật khẩu hiện tại</label>
                <div className="relative flex items-center">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-10 px-3 pr-10 bg-[#060E20] border border-[#2D3449] focus:border-[#89CEFF] rounded-[4px] text-xs text-[#DAE2FD] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 text-[#88929B] hover:text-[#DAE2FD]"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Mật khẩu mới */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#DAE2FD]">Mật khẩu mới (Tối thiểu 8 ký tự)</label>
                <div className="relative flex items-center">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-10 px-3 pr-10 bg-[#060E20] border border-[#2D3449] focus:border-[#89CEFF] rounded-[4px] text-xs text-[#DAE2FD] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 text-[#88929B] hover:text-[#DAE2FD]"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Xác nhận mật khẩu mới */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#DAE2FD]">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-10 px-3 bg-[#060E20] border border-[#2D3449] focus:border-[#89CEFF] rounded-[4px] text-xs text-[#DAE2FD] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingPassword}
                className="w-full py-2.5 rounded-[2px] bg-[#171F33] hover:bg-[#222A3D] border border-[#2D3449] hover:border-[#89CEFF]/60 text-xs font-semibold text-[#89CEFF] transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isSavingPassword ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
