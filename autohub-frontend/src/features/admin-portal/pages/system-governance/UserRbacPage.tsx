import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Shield,
  ShieldAlert,
  RotateCw,
  AlertCircle,
  Inbox,
  CheckCircle2,
  Lock,
  Unlock,
  KeyRound,
  Filter,
  X,
} from 'lucide-react';

import { useAdminTheme } from '@/context/AdminThemeContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';
import type { AdminUser, VaiTroNguoiDung, TrangThaiTaiKhoan } from '@/types/admin-user.types';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import { UserStatsCards } from '../../components/UserStatsCards';
import { CreateUserModal } from '../../components/CreateUserModal';
import { UpdateUserRoleModal } from '../../components/UpdateUserRoleModal';

export const UserRbacPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();

  const {
    users,
    stats,
    isLoading,
    error,
    keyword,
    roleFilter,
    statusFilter,
    toastMessage,
    setKeyword,
    setRoleFilter,
    setStatusFilter,
    refetch,
    toggleStatus,
    updateRole,
    createUser,
    clearToast,
  } = useAdminUsers();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [lockingUser, setLockingUser] = useState<AdminUser | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleConfirmToggleLock = async () => {
    if (!lockingUser) return;
    setIsActionLoading(true);
    try {
      await toggleStatus(lockingUser.id);
      setLockingUser(null);
    } finally {
      setIsActionLoading(false);
    }
  };

  const isEmpty = !isLoading && !error && users.length === 0;

  return (
    <div
      className={cn(
        'space-y-5 antialiased transition-colors duration-300 pb-12',
        isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'
      )}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-md">
          <div className="p-3.5 rounded-xl bg-emerald-600 text-white shadow-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="font-medium">{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={clearToast}
              className="p-1 hover:bg-emerald-700 rounded transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 1. Header Banner */}
      <div
        className={cn(
          'flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border transition-colors',
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
            : 'bg-white border-slate-200 shadow-sm'
        )}
      >
        <div>
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-blue-500" />
            <h1 className={cn('text-xl md:text-2xl font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
              Quản Trị Người Dùng & Phân Quyền Bảo Mật RBAC
            </h1>
          </div>
          <p className={cn('text-xs mt-1', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Quản lý tài khoản hệ thống, phân quyền truy cập theo chuẩn Spring Security và khóa tài khoản khi có dấu hiệu bất thường.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
            className={cn(
              'p-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5',
              isDarkMode
                ? 'border-[#3E4850]/50 hover:bg-[#1E293B] text-slate-300'
                : 'border-slate-200 hover:bg-slate-100 text-slate-700'
            )}
            title="Tải lại danh sách"
          >
            <RotateCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm Tài Khoản Nhân Viên</span>
          </button>
        </div>
      </div>

      {/* 2. Stat Cards Grid */}
      <UserStatsCards
        stats={stats}
        selectedRole={roleFilter}
        onSelectRole={(roleId: string) => {
          if (roleId === 'LOCKED') {
            setStatusFilter(statusFilter === 'BI_KHOA' ? 'ALL' : 'BI_KHOA');
          } else {
            setRoleFilter(roleId as VaiTroNguoiDung | 'ALL');
          }
        }}
      />

      {/* 3. Search & Filter Bar */}
      <div
        className={cn(
          'flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border transition-colors',
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200 shadow-xs'
        )}
      >
        <div className="relative w-full sm:w-80">
          <Search className={cn('w-4 h-4 absolute left-3 top-2.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')} />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo họ tên, email, SĐT, CCCD..."
            className={cn(
              'w-full pl-9 pr-3 py-1.5 text-xs border rounded-md focus:outline-none transition-colors',
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/50 text-white placeholder-slate-500 focus:border-[#89CEFF]'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
            )}
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className={cn('w-3.5 h-3.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')} />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as VaiTroNguoiDung | 'ALL')}
              className={cn(
                'px-2.5 py-1 text-xs rounded-md border focus:outline-none transition-colors',
                isDarkMode
                  ? 'bg-[#131B2E] border-[#3E4850]/50 text-white'
                  : 'bg-white border-slate-200 text-slate-800'
              )}
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="ROLE_ADMIN">Quản Trị Viên (ROLE_ADMIN)</option>
              <option value="ROLE_STAFF">Tư Vấn Showroom (ROLE_STAFF)</option>
              <option value="ROLE_CUSTOMER">Khách Hàng (ROLE_CUSTOMER)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TrangThaiTaiKhoan | 'ALL')}
              className={cn(
                'px-2.5 py-1 text-xs rounded-md border focus:outline-none transition-colors',
                isDarkMode
                  ? 'bg-[#131B2E] border-[#3E4850]/50 text-white'
                  : 'bg-white border-slate-200 text-slate-800'
              )}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="HOAT_DONG">Đang hoạt động</option>
              <option value="BI_KHOA">Bị khóa</option>
            </select>
          </div>

          <div className={cn('text-xs font-mono pl-2 border-l border-slate-200 dark:border-[#3E4850]/50', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Hiển thị: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{users.length}</strong>
          </div>
        </div>
      </div>

      {/* 4. Error State */}
      {error && (
        <div
          className={cn(
            'p-4 rounded-xl border flex items-center justify-between gap-3 text-xs',
            isDarkMode
              ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          )}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="cursor-pointer text-xs">
            Thử lại kết nối
          </Button>
        </div>
      )}

      {/* 5. Loading Skeleton */}
      {isLoading && (
        <div
          className={cn(
            'rounded-xl border overflow-hidden p-6 space-y-4 animate-pulse',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
          )}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-[#3E4850]/20">
              <div className="flex items-center gap-3">
                <div className={cn('w-8 h-8 rounded-full', isDarkMode ? 'bg-[#1A233A]' : 'bg-slate-200')} />
                <div className="space-y-1.5">
                  <div className={cn('w-32 h-3.5 rounded', isDarkMode ? 'bg-[#1A233A]' : 'bg-slate-200')} />
                  <div className={cn('w-44 h-2.5 rounded', isDarkMode ? 'bg-[#1A233A]' : 'bg-slate-200')} />
                </div>
              </div>
              <div className={cn('w-24 h-5 rounded', isDarkMode ? 'bg-[#1A233A]' : 'bg-slate-200')} />
              <div className={cn('w-28 h-4 rounded', isDarkMode ? 'bg-[#1A233A]' : 'bg-slate-200')} />
              <div className={cn('w-16 h-5 rounded', isDarkMode ? 'bg-[#1A233A]' : 'bg-slate-200')} />
            </div>
          ))}
        </div>
      )}

      {/* 6. Empty State */}
      {isEmpty && (
        <div
          className={cn(
            'p-12 rounded-xl border text-center flex flex-col items-center justify-center space-y-3',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 text-[#88929B]' : 'bg-white border-slate-200 text-slate-500'
          )}
        >
          <Inbox className="w-10 h-10 stroke-[1.5] text-slate-400" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Không tìm thấy tài khoản người dùng
          </h3>
          <p className="text-xs max-w-sm">
            Không có kết quả nào khớp với bộ lọc & từ khóa tìm kiếm &quot;{keyword}&quot;. Vui lòng thử lại với từ khóa khác.
          </p>
          <button
            type="button"
            onClick={() => {
              setKeyword('');
              setRoleFilter('ALL');
              setStatusFilter('ALL');
            }}
            className="text-xs text-blue-600 dark:text-[#89CEFF] font-semibold hover:underline cursor-pointer pt-1"
          >
            Xóa toàn bộ bộ lọc
          </button>
        </div>
      )}

      {/* 7. Data Table */}
      {!isLoading && users.length > 0 && (
        <div
          className={cn(
            'rounded-xl border overflow-hidden transition-colors',
            isDarkMode
              ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
              : 'bg-white border-slate-200 shadow-sm'
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className={cn(
                  'font-mono uppercase text-[11px] border-b',
                  isDarkMode
                    ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40'
                    : 'bg-slate-50/80 text-slate-500 border-slate-200'
                )}
              >
                <tr>
                  <th className="py-3 px-4">Mã / Người Dùng</th>
                  <th className="py-3 px-4 font-mono">Số Điện Thoại / CCCD</th>
                  <th className="py-3 px-4 text-center">Vai Trò Hệ Thống (RBAC)</th>
                  <th className="py-3 px-4">Showroom Trực Thuộc</th>
                  <th className="py-3 px-4 text-center">Trạng Thái</th>
                  <th className="py-3 px-4 text-right">Thao Tác Quản Trị</th>
                </tr>
              </thead>
              <tbody
                className={cn(
                  'divide-y font-sans',
                  isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100'
                )}
              >
                {users.map((u) => {
                  const isAdmin = u.vaiTro === 'ROLE_ADMIN';
                  const isStaff = u.vaiTro === 'ROLE_STAFF';

                  return (
                    <tr
                      key={u.id}
                      className={cn(
                        'transition-colors',
                        isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50/80'
                      )}
                    >
                      {/* Name & Email */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={cn(
                              'w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs shrink-0',
                              isAdmin
                                ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                                : isStaff
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                                : 'bg-blue-500/10 border-blue-500/30 text-blue-500'
                            )}
                          >
                            {u.hoTen ? u.hoTen.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className={cn('font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                                {u.hoTen}
                              </span>
                              <span className="font-mono text-[10px] text-slate-400">({u.userCode})</span>
                            </div>
                            <div className={cn('text-[11px] font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone & CCCD */}
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <div className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>{u.soDienThoai}</div>
                        <div className={cn('text-[10px]', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>
                          CCCD: {u.soCCCD}
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border',
                            isAdmin &&
                              (isDarkMode
                                ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                                : 'bg-rose-50 border-rose-200 text-rose-700'),
                            isStaff &&
                              (isDarkMode
                                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                                : 'bg-amber-50 border-amber-200 text-amber-700'),
                            !isAdmin &&
                              !isStaff &&
                              (isDarkMode
                                ? 'bg-blue-500/15 border-blue-500/30 text-[#89CEFF]'
                                : 'bg-blue-50 border-blue-200 text-blue-700')
                          )}
                        >
                          <Shield className="w-3 h-3" />
                          <span>{u.vaiTroLabel}</span>
                        </span>
                      </td>

                      {/* Showroom */}
                      <td className={cn('py-3 px-4 text-[11px]', isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-700')}>
                        {u.tenShowroom}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono',
                            u.dangHoatDong
                              ? 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400'
                              : 'bg-red-500/15 text-red-500 dark:text-red-400'
                          )}
                        >
                          <span
                            className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              u.dangHoatDong ? 'bg-emerald-500' : 'bg-red-500'
                            )}
                          />
                          {u.dangHoatDong ? 'HOẠT ĐỘNG' : 'BỊ KHÓA'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Role edit button */}
                          <button
                            type="button"
                            onClick={() => setEditingUser(u)}
                            className={cn(
                              'px-2 py-1 text-[11px] font-semibold rounded border transition-colors cursor-pointer flex items-center gap-1',
                              isDarkMode
                                ? 'border-[#3E4850]/60 hover:bg-[#1E293B] text-slate-300'
                                : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                            )}
                            title="Đổi vai trò phân quyền"
                          >
                            <Shield className="w-3 h-3 text-blue-500" />
                            <span>Đổi Quyền</span>
                          </button>

                          {/* Lock / Unlock button */}
                          <button
                            type="button"
                            onClick={() => setLockingUser(u)}
                            disabled={u.id === 1}
                            className={cn(
                              'px-2 py-1 text-[11px] font-semibold rounded border transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed',
                              u.dangHoatDong
                                ? isDarkMode
                                  ? 'border-red-900/40 text-red-400 hover:bg-red-950/40'
                                  : 'border-red-200 text-red-700 hover:bg-red-50'
                                : isDarkMode
                                ? 'border-emerald-900/40 text-emerald-400 hover:bg-emerald-950/40'
                                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                            )}
                            title={u.dangHoatDong ? 'Khóa tài khoản' : 'Kích hoạt lại'}
                          >
                            {u.dangHoatDong ? (
                              <>
                                <Lock className="w-3 h-3 text-red-500" />
                                <span>Khóa</span>
                              </>
                            ) : (
                              <>
                                <Unlock className="w-3 h-3 text-emerald-500" />
                                <span>Mở Khóa</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. Modals */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createUser}
      />

      <UpdateUserRoleModal
        user={editingUser}
        isOpen={editingUser !== null}
        onClose={() => setEditingUser(null)}
        onSubmit={updateRole}
      />

      {/* Confirm Lock / Unlock Dialog */}
      {lockingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            className={cn(
              'w-full max-w-sm rounded-xl border p-5 space-y-4 shadow-2xl transition-all',
              isDarkMode
                ? 'bg-[#0B1326] border-[#3E4850]/60 text-[#DAE2FD]'
                : 'bg-white border-slate-200 text-slate-800'
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'p-2 rounded-xl shrink-0',
                  lockingUser.dangHoatDong
                    ? 'bg-red-500/10 text-red-500'
                    : 'bg-emerald-500/10 text-emerald-500'
                )}
              >
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className={cn('text-sm font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  {lockingUser.dangHoatDong ? 'Xác nhận khóa tài khoản?' : 'Kích hoạt lại tài khoản?'}
                </h3>
                <p className={cn('text-[11px] mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                  {lockingUser.hoTen} ({lockingUser.email})
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              {lockingUser.dangHoatDong
                ? 'Tài khoản sau khi bị khóa sẽ không thể đăng nhập vào hệ thống AutoHub hay thực hiện bất kỳ giao dịch nào cho tới khi được mở lại.'
                : 'Tài khoản sẽ được cấp lại quyền đăng nhập và các quyền hạn theo vai trò đã được thiết lập.'}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#3E4850]/40">
              <button
                type="button"
                onClick={() => setLockingUser(null)}
                disabled={isActionLoading}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer',
                  isDarkMode
                    ? 'border-[#3E4850]/60 text-slate-300 hover:bg-[#1E293B]'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                )}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmToggleLock}
                disabled={isActionLoading}
                className={cn(
                  'px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white transition-colors cursor-pointer disabled:opacity-60',
                  lockingUser.dangHoatDong
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                )}
              >
                {isActionLoading
                  ? 'Đang xử lý...'
                  : lockingUser.dangHoatDong
                  ? 'Khóa Tài Khoản'
                  : 'Mở Khóa Ngay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
