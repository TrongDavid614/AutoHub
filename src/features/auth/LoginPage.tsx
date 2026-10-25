import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserCheck, Car, ArrowRight, User } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('nguyenvana@gmail.com');
  const [password, setPassword] = useState('••••••••');

  const handleLoginCustomer = () => {
    login('demo-jwt-autohub-vip8899', {
      id: 8899,
      email: 'nguyenvana@gmail.com',
      fullName: 'Nguyễn Văn A',
      phoneNumber: '0912 345 678',
      identityCardNumber: '079090001234',
      role: 'ROLE_CUSTOMER',
      isActive: true,
      createdAt: '2026-01-15T08:00:00Z',
    });
    navigate('/customer/profile');
  };

  const handleLoginStaff = () => {
    login('demo-jwt-autohub-staff01', {
      id: 1001,
      email: 'staff@autohub.vn',
      fullName: 'Nguyễn Văn Quốc (CVTV)',
      phoneNumber: '0909 123 456',
      role: 'ROLE_STAFF',
      isActive: true,
      createdAt: '2026-01-10T08:00:00Z',
    });
    navigate('/staff/consultations');
  };

  const handleLoginAdmin = () => {
    login('demo-jwt-autohub-admin01', {
      id: 9999,
      email: 'admin@autohub.vn',
      fullName: 'Admin Hệ Thống AutoHub',
      phoneNumber: '0900 999 999',
      role: 'ROLE_ADMIN',
      isActive: true,
      createdAt: '2026-01-01T08:00:00Z',
    });
    navigate('/admin/dashboard');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLoginCustomer();
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Car className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">Đăng Nhập Hệ Thống AutoHub</h2>
          <p className="text-xs text-slate-400">
            Nền tảng giao dịch ô tô điện & phụ kiện trực tuyến cao cấp
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Email / Tài khoản</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all"
          >
            Đăng Nhập
          </button>
        </form>

        {/* Quick Demo Access Bar */}
        <div className="pt-4 border-t border-slate-800 space-y-2.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Chọn Nhanh Tài Khoản Demo Để Xem Giao Diện:</span>
          </div>

          <button
            type="button"
            onClick={handleLoginCustomer}
            className="w-full p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-cyan-500/40 text-left transition-all group flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-white text-xs flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Khách Hàng: Nguyễn Văn A (VIP Diamond)</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Xem Trung tâm giao dịch cọc xe 72h, biên lai PDF, lịch lái thử
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleLoginStaff}
              className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 text-left text-[11px] font-semibold transition-colors"
            >
              <div className="text-white">Tài khoản Staff</div>
              <div className="text-[10px] text-slate-400">Vận hành & Duyệt cọc</div>
            </button>

            <button
              type="button"
              onClick={handleLoginAdmin}
              className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 text-left text-[11px] font-semibold transition-colors"
            >
              <div className="text-white">Tài khoản Admin</div>
              <div className="text-[10px] text-slate-400">Master portal</div>
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center pt-1">
          <Link to="/cars" className="text-xs text-cyan-400 hover:underline font-semibold">
            ← Quay lại Showroom Xe Ô Tô
          </Link>
        </div>
      </div>
    </div>
  );
};
