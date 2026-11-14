import React, { useState } from 'react';
import { X, UserPlus, AlertCircle } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { cn } from '@/lib/utils';
import type { CreateStaffUserPayload, VaiTroNguoiDung } from '@/types/admin-user.types';

export interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateStaffUserPayload) => Promise<boolean>;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { isDarkMode } = useAdminTheme();

  const [hoTen, setHoTen] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('AutoHub@2026');
  const [soDienThoai, setSoDienThoai] = useState('');
  const [soCCCD, setSoCCCD] = useState('');
  const [vaiTro, setVaiTro] = useState<VaiTroNguoiDung>('ROLE_STAFF');
  const [showroomId, setShowroomId] = useState<number>(2); // Default TP.HCM
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!hoTen.trim()) {
      setValidationError('Vui lòng nhập họ và tên nhân viên');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setValidationError('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setValidationError('Mật khẩu tối thiểu phải từ 6 ký tự');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSubmit({
        hoTen: hoTen.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        soDienThoai: soDienThoai.trim() || undefined,
        soCCCD: soCCCD.trim() || undefined,
        vaiTro,
        showroomId: vaiTro === 'ROLE_STAFF' ? showroomId : undefined,
      });

      if (success) {
        onClose();
        // Reset form
        setHoTen('');
        setEmail('');
        setPassword('AutoHub@2026');
        setSoDienThoai('');
        setSoCCCD('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className={cn(
          'w-full max-w-lg rounded-xl border shadow-2xl overflow-hidden transition-all duration-200',
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/60 text-[#DAE2FD]'
            : 'bg-white border-slate-200 text-slate-800'
        )}
      >
        {/* Header */}
        <div
          className={cn(
            'flex items-center justify-between p-4 border-b',
            isDarkMode ? 'border-[#3E4850]/40 bg-[#131B2E]' : 'border-slate-100 bg-slate-50'
          )}
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600/10 text-blue-600">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className={cn('text-sm font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                Thêm Tài Khoản Nhân Sự / Phân Quyền Mới
              </h3>
              <p className={cn('text-[11px]', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                Cấp tài khoản đăng nhập và gán vai trò RBAC theo chuẩn Spring Security
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'p-1.5 rounded-lg transition-colors cursor-pointer',
              isDarkMode ? 'hover:bg-[#1E293B] text-slate-400' : 'hover:bg-slate-200 text-slate-500'
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          {validationError && (
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={cn('block text-xs font-semibold mb-1', isDarkMode ? 'text-slate-300' : 'text-slate-700')}>
                Họ và Tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={hoTen}
                onChange={(e) => setHoTen(e.target.value)}
                placeholder="Nguyễn Văn A"
                className={cn(
                  'w-full px-3 py-1.5 text-xs rounded-md border focus:outline-none transition-colors',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white placeholder-slate-500 focus:border-[#89CEFF]'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                )}
              />
            </div>

            <div>
              <label className={cn('block text-xs font-semibold mb-1', isDarkMode ? 'text-slate-300' : 'text-slate-700')}>
                Email Đăng Nhập <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@autohub.vn"
                className={cn(
                  'w-full px-3 py-1.5 text-xs rounded-md border focus:outline-none transition-colors',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white placeholder-slate-500 focus:border-[#89CEFF]'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={cn('block text-xs font-semibold mb-1', isDarkMode ? 'text-slate-300' : 'text-slate-700')}>
                Mật Khẩu Khởi Tạo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  'w-full px-3 py-1.5 text-xs rounded-md border font-mono focus:outline-none transition-colors',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white placeholder-slate-500 focus:border-[#89CEFF]'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                )}
              />
            </div>

            <div>
              <label className={cn('block text-xs font-semibold mb-1', isDarkMode ? 'text-slate-300' : 'text-slate-700')}>
                Số Điện Thoại
              </label>
              <input
                type="text"
                value={soDienThoai}
                onChange={(e) => setSoDienThoai(e.target.value)}
                placeholder="0912.345.678"
                className={cn(
                  'w-full px-3 py-1.5 text-xs rounded-md border font-mono focus:outline-none transition-colors',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white placeholder-slate-500 focus:border-[#89CEFF]'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={cn('block text-xs font-semibold mb-1', isDarkMode ? 'text-slate-300' : 'text-slate-700')}>
                Số CCCD / Định Danh (12 số)
              </label>
              <input
                type="text"
                value={soCCCD}
                onChange={(e) => setSoCCCD(e.target.value)}
                placeholder="079198001234"
                className={cn(
                  'w-full px-3 py-1.5 text-xs rounded-md border font-mono focus:outline-none transition-colors',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white placeholder-slate-500 focus:border-[#89CEFF]'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                )}
              />
            </div>

            <div>
              <label className={cn('block text-xs font-semibold mb-1', isDarkMode ? 'text-slate-300' : 'text-slate-700')}>
                Vai Trò Phân Quyền (RBAC) <span className="text-red-500">*</span>
              </label>
              <select
                value={vaiTro}
                onChange={(e) => setVaiTro(e.target.value as VaiTroNguoiDung)}
                className={cn(
                  'w-full px-3 py-1.5 text-xs rounded-md border focus:outline-none transition-colors',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white focus:border-[#89CEFF]'
                    : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'
                )}
              >
                <option value="ROLE_STAFF">Tư Vấn Showroom (ROLE_STAFF)</option>
                <option value="ROLE_ADMIN">Quản Trị Viên (ROLE_ADMIN)</option>
                <option value="ROLE_CUSTOMER">Khách Hàng (ROLE_CUSTOMER)</option>
              </select>
            </div>
          </div>

          {vaiTro === 'ROLE_STAFF' && (
            <div>
              <label className={cn('block text-xs font-semibold mb-1', isDarkMode ? 'text-slate-300' : 'text-slate-700')}>
                Showroom Công Tác
              </label>
              <select
                value={showroomId}
                onChange={(e) => setShowroomId(Number(e.target.value))}
                className={cn(
                  'w-full px-3 py-1.5 text-xs rounded-md border focus:outline-none transition-colors',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white focus:border-[#89CEFF]'
                    : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'
                )}
              >
                <option value={1}>Showroom Cầu Giấy (Hà Nội)</option>
                <option value={2}>Showroom Sài Gòn Central (Q.7, TP.HCM)</option>
                <option value={3}>Showroom Đà Nẵng Riverside (Đà Nẵng)</option>
              </select>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#3E4850]/40">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={cn(
                'px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer',
                isDarkMode
                  ? 'border-[#3E4850]/60 text-slate-300 hover:bg-[#1E293B]'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              )}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-1.5 shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Đang tạo...' : 'Tạo Tài Khoản'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
