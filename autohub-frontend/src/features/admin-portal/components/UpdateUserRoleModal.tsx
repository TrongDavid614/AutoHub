import React, { useState, useEffect } from 'react';
import { X, Shield, AlertCircle } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { cn } from '@/lib/utils';
import type { AdminUser, UpdateUserRolePayload, VaiTroNguoiDung } from '@/types/admin-user.types';

export interface UpdateUserRoleModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, payload: UpdateUserRolePayload) => Promise<boolean>;
}

export const UpdateUserRoleModal: React.FC<UpdateUserRoleModalProps> = ({
  user,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { isDarkMode } = useAdminTheme();

  const [vaiTro, setVaiTro] = useState<VaiTroNguoiDung>('ROLE_STAFF');
  const [showroomId, setShowroomId] = useState<number>(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setVaiTro(user.vaiTro);
      setShowroomId(user.showroomId ?? 2);
      setError(null);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Prevent demoting primary admin
    if (user.id === 1 && vaiTro !== 'ROLE_ADMIN') {
      setError('Không thể hạ quyền tài khoản Quản Trị Viên hệ thống gốc!');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSubmit(user.id, {
        vaiTro,
        showroomId: vaiTro === 'ROLE_STAFF' ? showroomId : undefined,
      });

      if (success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className={cn(
          'w-full max-w-md rounded-xl border shadow-2xl overflow-hidden transition-all duration-200',
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
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className={cn('text-sm font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                Phân Quyền Vai Trò RBAC
              </h3>
              <p className={cn('text-[11px]', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                {user.hoTen} ({user.userCode})
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
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 rounded-lg border text-xs space-y-1 bg-slate-50/50 dark:bg-[#131B2E]/50 dark:border-[#3E4850]/30 border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Email:</span>
              <span className="font-mono font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Vai trò hiện tại:</span>
              <span className="font-semibold text-blue-600 dark:text-[#89CEFF]">
                {user.vaiTroLabel}
              </span>
            </div>
          </div>

          <div>
            <label className={cn('block text-xs font-semibold mb-1', isDarkMode ? 'text-slate-300' : 'text-slate-700')}>
              Chọn Vai Trò Mới
            </label>
            <select
              value={vaiTro}
              onChange={(e) => setVaiTro(e.target.value as VaiTroNguoiDung)}
              className={cn(
                'w-full px-3 py-2 text-xs rounded-md border focus:outline-none transition-colors',
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

          {vaiTro === 'ROLE_STAFF' && (
            <div>
              <label className={cn('block text-xs font-semibold mb-1', isDarkMode ? 'text-slate-300' : 'text-slate-700')}>
                Gán Chi Nhánh Showroom
              </label>
              <select
                value={showroomId}
                onChange={(e) => setShowroomId(Number(e.target.value))}
                className={cn(
                  'w-full px-3 py-2 text-xs rounded-md border focus:outline-none transition-colors',
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
              <Shield className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Đang cập nhật...' : 'Lưu Thay Đổi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
