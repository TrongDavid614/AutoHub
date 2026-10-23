import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { User, MapPin, Calendar, CreditCard, Package } from 'lucide-react';

export const CustomerLayout: React.FC = () => {
  const navItems = [
    { to: '/customer/profile', label: 'Hồ Sơ Cá Nhân', icon: User },
    { to: '/customer/addresses', label: 'Sổ Địa Chỉ (UC03)', icon: MapPin },
    { to: '/customer/test-drives', label: 'Lịch Hẹn Lái Thử', icon: Calendar },
    { to: '/customer/deposits', label: 'Phiếu Đặt Cọc Xe (72h)', icon: CreditCard },
    { to: '/customer/orders', label: 'Đơn Hàng Phụ Kiện', icon: Package },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="max-w-7xl w-full mx-auto px-6 py-6 flex gap-6">
        {/* CUSTOMER SIDEBAR */}
        <aside className="w-64 bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-3">
            Tài khoản thành viên
          </h2>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </aside>

        {/* CUSTOMER CONTENT OUTLET */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
