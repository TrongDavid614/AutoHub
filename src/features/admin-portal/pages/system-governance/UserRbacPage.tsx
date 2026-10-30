import React, { useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';

export const UserRbacPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [search, setSearch] = useState('');

  const users = [
    {
      id: 'USR-001',
      name: 'Nguyễn Quản Trị',
      email: 'admin@autohub.vn',
      phone: '0912.000.999',
      role: 'ROLE_ADMIN',
      roleLabel: 'Quản Trị Viên (Admin)',
      showroom: 'Toàn Hệ Thống',
      lastLogin: 'Hôm nay 14:20 (IP: 14.225.2.10)',
      status: 'HOAT_DONG',
    },
    {
      id: 'USR-004',
      name: 'Nguyễn Văn Tuấn',
      email: 'tuan.nguyen@autohub.vn',
      phone: '0988.123.456',
      role: 'ROLE_STAFF',
      roleLabel: 'Tư Vấn Showroom (Staff)',
      showroom: 'Showroom Sài Gòn Central - Q.7',
      lastLogin: 'Hôm nay 08:15 (IP: 118.69.12.8)',
      status: 'HOAT_DONG',
    },
    {
      id: 'USR-007',
      name: 'Trần Thị Thu Hà',
      email: 'ha.tran@autohub.vn',
      phone: '0977.888.999',
      role: 'ROLE_STAFF',
      roleLabel: 'Thủ Kho Vận Hành (Staff)',
      showroom: 'Showroom Cầu Giấy - Hà Nội',
      lastLogin: 'Hôm qua 17:30 (IP: 14.161.4.12)',
      status: 'HOAT_DONG',
    },
    {
      id: 'USR-102',
      name: 'Lê Hoàng Nam',
      email: 'nam.le@gmail.com',
      phone: '0903.456.789',
      role: 'ROLE_CUSTOMER',
      roleLabel: 'Khách Hàng (Customer)',
      showroom: 'Khách Trực Tuyến',
      lastLogin: '2 ngày trước (IP: 171.244.8.9)',
      status: 'HOAT_DONG',
    },
  ];

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

        <button
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Thêm Tài Khoản Nhân Viên</span>
        </button>
      </div>

      {/* Filter */}
      <div className={`flex items-center justify-between gap-3 p-3 rounded-lg border transition-colors ${
        isDarkMode
          ? 'bg-[#0B1326] border-[#3E4850]/40'
          : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="relative w-full sm:w-80">
          <Search className={`w-4 h-4 absolute left-3 top-2.5 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo họ tên, email, SĐT..."
            className={`w-full pl-9 pr-3 py-1.5 text-xs border rounded-md focus:outline-none transition-colors ${
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/50 text-white placeholder-[#88929B] focus:border-[#89CEFF]'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
            }`}
          />
        </div>
        <div className={`text-xs font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
          Tổng tài khoản: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{users.length}</strong>
        </div>
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
              <th className="py-3 px-4">Chi Nhánh Showroom</th>
              <th className="py-3 px-4">Lần Đăng Nhập Cuối</th>
              <th className="py-3 px-4 text-center">Trạng Thái</th>
            </tr>
          </thead>
          <tbody className={`divide-y font-sans ${
            isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100'
          }`}>
            {users.map((u) => (
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
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{u.name}</div>
                      <div className={`text-[11px] font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className={`py-3 px-4 font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>{u.phone}</td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold font-mono border ${
                      u.role === 'ROLE_ADMIN'
                        ? isDarkMode
                          ? 'bg-red-950/70 text-red-300 border-red-800/50'
                          : 'bg-red-50 text-red-700 border-red-200'
                        : u.role === 'ROLE_STAFF'
                        ? isDarkMode
                          ? 'bg-blue-950/70 text-blue-300 border-blue-800/50'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                        : isDarkMode
                          ? 'bg-slate-800 text-slate-300 border-slate-700'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {u.roleLabel}
                  </span>
                </td>
                <td className={`py-3 px-4 ${isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-700'}`}>{u.showroom}</td>
                <td className={`py-3 px-4 font-mono text-[11px] ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`}>{u.lastLogin}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                    isDarkMode
                      ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/50'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Đang hoạt động
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
