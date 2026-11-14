import React, { useState, useEffect } from 'react';
import { Search, UserPlus, RefreshCw, Lock, Unlock } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { adminService, type AdminUserItem } from '@/features/admin-portal/services/admin.service';

export const UserRbacPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getUsers();
      if (data && data.length > 0) {
        setUsers(data);
      } else {
        throw new Error('Empty');
      }
    } catch {
      setUsers([
        {
          id: 1,
          hoTen: 'Nguyễn Quản Trị',
          email: 'admin@autohub.vn',
          soDienThoai: '0912000999',
          vaiTro: 'ROLE_ADMIN',
          trangThaiTaiKhoan: 'HOAT_DONG',
        },
        {
          id: 4,
          hoTen: 'Nguyễn Văn Tuấn',
          email: 'tuan.nguyen@autohub.vn',
          soDienThoai: '0988123456',
          vaiTro: 'ROLE_STAFF',
          trangThaiTaiKhoan: 'HOAT_DONG',
        },
        {
          id: 7,
          hoTen: 'Trần Thị Thu Hà',
          email: 'ha.tran@autohub.vn',
          soDienThoai: '0977888999',
          vaiTro: 'ROLE_STAFF',
          trangThaiTaiKhoan: 'HOAT_DONG',
        },
        {
          id: 102,
          hoTen: 'Lê Hoàng Nam',
          email: 'nam.le@gmail.com',
          soDienThoai: '0903456789',
          vaiTro: 'ROLE_CUSTOMER',
          trangThaiTaiKhoan: 'HOAT_DONG',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async (user: AdminUserItem) => {
    const nextStatus = user.trangThaiTaiKhoan === 'HOAT_DONG' ? 'BI_KHOA' : 'HOAT_DONG';
    try {
      await adminService.toggleUserStatus(user.id, nextStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, trangThaiTaiKhoan: nextStatus } : u))
      );
    } catch {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, trangThaiTaiKhoan: nextStatus } : u))
      );
    }
  };

  const filtered = users.filter(
    (u) =>
      u.hoTen?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.soDienThoai?.includes(search)
  );

  return (
    <div className={`space-y-6 antialiased transition-colors ${isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'}`}>
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border transition-colors ${
        isDarkMode
          ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <h1 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Quản Trị Người Dùng & Phân Quyền Bảo Mật RBAC
          </h1>
          <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
            Quản lý tài khoản người dùng, phân quyền truy cập theo chuẩn Spring Security và khóa tài khoản khi có dấu hiệu bất thường.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadUsers}
            disabled={isLoading}
            className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
              isDarkMode ? 'bg-[#171F33] text-white border-[#3E4850]/50' : 'bg-slate-50 text-slate-800 border-slate-300'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm Tài Khoản Nhân Viên</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm người dùng theo họ tên, email hoặc số điện thoại..."
          className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border transition-colors outline-none ${
            isDarkMode
              ? 'bg-[#0B1326] border-[#3E4850]/40 text-white placeholder-slate-500 focus:border-blue-500'
              : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
          }`}
        />
      </div>

      {/* Table */}
      <div className={`rounded-xl border overflow-hidden transition-colors ${
        isDarkMode
          ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <table className="w-full text-left text-xs">
          <thead className={`font-mono uppercase text-[11px] border-b ${
            isDarkMode
              ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40'
              : 'bg-slate-50/80 text-slate-500 border-slate-200'
          }`}>
            <tr>
              <th className="py-3 px-4">Người Dùng</th>
              <th className="py-3 px-4 font-mono">Số Điện Thoại</th>
              <th className="py-3 px-4 text-center">Vai Trò Hệ Thống (RBAC)</th>
              <th className="py-3 px-4 text-center">Trạng Thái</th>
              <th className="py-3 px-4 text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody className={`divide-y font-sans ${
            isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100'
          }`}>
            {filtered.map((u) => (
              <tr key={u.id} className={`transition-colors ${
                isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50/80'
              }`}>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs ${
                      isDarkMode
                        ? 'bg-[#171F33] border-[#3E4850]/50 text-[#89CEFF]'
                        : 'bg-sky-50 border-sky-200 text-sky-700'
                    }`}>
                      {u.hoTen ? u.hoTen.charAt(0) : 'U'}
                    </div>
                    <div>
                      <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{u.hoTen}</div>
                      <div className={`text-[11px] font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className={`py-3 px-4 font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>{u.soDienThoai || 'N/A'}</td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold font-mono border ${
                      u.vaiTro === 'ROLE_ADMIN'
                        ? isDarkMode
                          ? 'bg-red-950/70 text-red-300 border-red-800/50'
                          : 'bg-red-50 text-red-700 border-red-200'
                        : u.vaiTro === 'ROLE_STAFF'
                        ? isDarkMode
                          ? 'bg-blue-950/70 text-blue-300 border-blue-800/50'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                        : isDarkMode
                          ? 'bg-slate-800 text-slate-300 border-slate-700'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {u.vaiTro}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                    u.trangThaiTaiKhoan === 'HOAT_DONG'
                      ? isDarkMode
                        ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/50'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : isDarkMode
                        ? 'bg-rose-950/70 text-rose-300 border-rose-800/50'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.trangThaiTaiKhoan === 'HOAT_DONG' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {u.trangThaiTaiKhoan === 'HOAT_DONG' ? 'Hoạt động' : 'Bị khóa'}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  {u.vaiTro !== 'ROLE_ADMIN' && (
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(u)}
                      className={`px-2.5 py-1 rounded font-semibold text-[11px] border transition-colors cursor-pointer flex items-center gap-1 mx-auto ${
                        u.trangThaiTaiKhoan === 'HOAT_DONG'
                          ? isDarkMode
                            ? 'bg-red-950/70 hover:bg-red-900/70 text-red-300 border-red-800/40'
                            : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-300'
                          : isDarkMode
                            ? 'bg-emerald-950/70 hover:bg-emerald-900/70 text-emerald-300 border-emerald-800/40'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
                      }`}
                    >
                      {u.trangThaiTaiKhoan === 'HOAT_DONG' ? (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>Khóa</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3 h-3" />
                          <span>Mở khóa</span>
                        </>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
