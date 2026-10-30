import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/features/customer/services/auth.service';
import { Logo } from '@/components/Logo';

export const AdminStaffLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (inputUser: string, inputPass: string) => {
    setErrorMessage('');
    if (!inputUser.trim()) {
      setErrorMessage('Vui lòng nhập tài khoản hoặc email công vụ.');
      return;
    }
    if (!inputPass) {
      setErrorMessage('Vui lòng nhập mật khẩu xác thực.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await authService.login(inputUser, inputPass);
      login(res.accessToken, res.user);
      setIsLoading(false);

      if (res.user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else if (res.user.role === 'ROLE_STAFF') {
        navigate('/staff/consultations');
      } else {
        navigate('/');
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('Thông tin đăng nhập không hợp lệ hoặc tài khoản không có quyền quản trị.');
    }
  };

  const fillQuickAccount = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    handleLogin(user, pass);
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden text-slate-100">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Portal Header */}
        <div className="text-center mb-8">
          <div className="inline-flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-[11px] font-semibold text-slate-300 mb-2">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>CỔNG QUẢN TRỊ & VẬN HÀNH NỘI BỘ</span>
          </div>
          <p className="text-xs text-slate-400">
            Dành riêng cho Ban Quản Trị (Admin) & Nhân Viên Showroom (Staff)
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0F172A]/90 border border-slate-800 rounded-2xl p-7 shadow-2xl backdrop-blur-xl">
          {errorMessage && (
            <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(username, password);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Tài khoản / Email công vụ
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@autohub.vn hoặc staff@autohub.vn"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Mật khẩu xác thực
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-900/90 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Đăng Nhập Quản Trị</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Tài khoản kiểm thử nhanh (Demo):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillQuickAccount('admin@autohub.vn', 'admin123')}
                className="p-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 mb-0.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Master</span>
                </div>
                <div className="text-[11px] text-slate-400 group-hover:text-slate-200">
                  admin@autohub.vn
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Pass: admin123</div>
              </button>

              <button
                type="button"
                onClick={() => fillQuickAccount('staff@autohub.vn', 'staff123')}
                className="p-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 mb-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Staff Showroom</span>
                </div>
                <div className="text-[11px] text-slate-400 group-hover:text-slate-200">
                  staff@autohub.vn
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Pass: staff123</div>
              </button>
            </div>
          </div>
        </div>

        {/* Back to Client Store Link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Quay lại Trang Chủ AutoHub
          </a>
        </div>
      </div>
    </div>
  );
};
