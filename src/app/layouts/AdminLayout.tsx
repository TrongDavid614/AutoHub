import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, Car, PackageCheck, Receipt, Users, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const adminMenu = [
    { to: '/admin/dashboard', label: 'Báo Cáo Thống Kê (F19)', icon: BarChart3 },
    { to: '/admin/cars-master', label: 'Master Data Xe & Demo (F20)', icon: Car },
    { to: '/admin/accessories-master', label: 'Phụ Kiện & Tồn Kho (F21)', icon: PackageCheck },
    { to: '/admin/fees-vouchers', label: 'Biểu Phí Lăn Bánh & Voucher (F22)', icon: Receipt },
    { to: '/admin/users-rbac', label: 'Quản Trị Người Dùng RBAC (F24)', icon: Users },
  ];

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      {/* ADMIN BACK-OFFICE SIDEBAR */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-4">
        <div>
          <div className="mb-6 px-3">
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">AutoHub Master</span>
            <h1 className="text-lg font-black text-white">Administrator</h1>
            <p className="text-[11px] text-slate-400 mt-1">Admin: {user?.fullName}</p>
          </div>

          <nav className="space-y-1">
            {adminMenu.map((m) => {
              const Icon = m.icon;
              return (
                <NavLink
                  key={m.to}
                  to={m.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-red-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{m.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-3">
          <button
            onClick={() => {
              logout();
              navigate('/auth/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất Admin</span>
          </button>
        </div>
      </aside>

      {/* ADMIN MAIN OUTLET */}
      <main className="flex-1 bg-slate-900 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
