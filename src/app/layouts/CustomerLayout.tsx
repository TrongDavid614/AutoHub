import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { User, MapPin, Calendar, CreditCard, Package } from 'lucide-react';
import { Header, Footer } from '@/components';

export const CustomerLayout: React.FC = () => {
  const navItems = [
    { to: '/customer/profile', label: 'Hồ Sơ Cá Nhân', icon: User },
    { to: '/customer/addresses', label: 'Sổ Địa Chỉ (UC03)', icon: MapPin },
    { to: '/customer/test-drives', label: 'Lịch Hẹn Lái Thử', icon: Calendar },
    { to: '/customer/deposits', label: 'Phiếu Đặt Cọc Xe (72h)', icon: CreditCard },
    { to: '/customer/orders', label: 'Đơn Hàng Phụ Kiện', icon: Package },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1326] text-[#DAE2FD]">
      {/* GLOBAL HEADER */}
      <Header />

      {/* CUSTOMER PORTAL WRAPPER */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col md:flex-row gap-6">
        {/* CUSTOMER SIDEBAR */}
        <aside className="w-full md:w-64 bg-[#131B2E] border border-[#3E4850]/50 rounded-[4px] p-4 shadow-xl flex flex-col gap-1 shrink-0 h-fit">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#88929B] mb-2 px-3">
            Tài khoản thành viên
          </h2>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-[2px] text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#171F33] text-[#89CEFF] border border-[#89CEFF]/40 shadow-sm'
                      : 'text-[#BEC8D2] hover:bg-[#171F33] hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-[#89CEFF]" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </aside>

        {/* CUSTOMER CONTENT OUTLET */}
        <div className="flex-1 bg-[#131B2E] border border-[#3E4850]/50 rounded-[4px] p-6 shadow-xl min-w-0">
          <Outlet />
        </div>
      </div>

      {/* GLOBAL FOOTER */}
      <Footer />
    </div>
  );
};
