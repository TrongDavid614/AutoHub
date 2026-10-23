import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { MessageSquare, CalendarClock, ShieldCheck, Box, RotateCcw, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export const StaffLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const menu = [
    { to: '/staff/consultations', label: 'Tiếp Nhận Tư Vấn (UC20)', icon: MessageSquare },
    { to: '/staff/test-drives', label: 'Điều Phối Lái Thử (UC21)', icon: CalendarClock },
    { to: '/staff/deposit-audit', label: 'Đối Soát Cọc & Gán VIN (UC22)', icon: ShieldCheck },
    { to: '/staff/fulfillment', label: 'Đóng Gói Vận Chuyển (UC23)', icon: Box },
    { to: '/staff/returns', label: 'Xử Lý Đổi Trả (UC24)', icon: RotateCcw },
  ];

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      {/* STAFF BACK-OFFICE SIDEBAR */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-4">
        <div>
          <div className="mb-6 px-3">
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">AutoHub Operation</span>
            <h1 className="text-lg font-black text-white">Staff Portal</h1>
            <p className="text-[11px] text-slate-400 mt-1">Xin chào, {user?.fullName}</p>
          </div>

          <nav className="space-y-1">
            {menu.map((m) => {
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
            <span>Đăng xuất Staff</span>
          </button>
        </div>
      </aside>

      {/* STAFF MAIN OUTLET */}
      <main className="flex-1 bg-slate-900 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
