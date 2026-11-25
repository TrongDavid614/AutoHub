import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
        setErrorMessage('Tài khoản này không có quyền truy cập cổng Quản Trị & Vận Hành Showroom.');
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const errRes = (err as { response?: { data?: { message?: string } } })?.response?.data;
      setErrorMessage(errRes?.message || 'Thông tin đăng nhập không hợp lệ hoặc tài khoản đã bị khóa bảo mật.');
    }
  };

  const fillQuickAccount = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    handleLogin(user, pass);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col justify-center items-center px-4 py-12 text-[var(--text)]">
      <div className="w-full max-w-md space-y-6">
        {/* Portal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex justify-center mb-2">
            <Link to="/">
              <Logo size="lg" />
            </Link>
          </div>
          <p className="text-xs font-medium text-[var(--accent)]">Cổng vận hành nội bộ</p>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">
            Đăng nhập nhân viên &amp; quản trị
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Dành cho Ban Quản Trị (Admin) và Tư vấn viên Showroom (Staff)
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-lg p-7 shadow-xs">
          {errorMessage && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
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
              <label className="block text-[13px] font-medium text-[var(--text)] mb-1.5">
                Tài khoản / Email công vụ
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@autohub.vn hoặc staff@autohub.vn"
                  className="w-full pl-9 pr-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[var(--text)] mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full pl-9 pr-10 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 mt-1 px-4 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Đăng nhập</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Credentials */}
          <div className="mt-6 pt-5 border-t border-[var(--line)]">
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-2.5">
              Tài khoản kiểm thử nhanh (Demo):
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => fillQuickAccount('admin.test@autohub.vn', 'Test@1234')}
                className="p-2.5 rounded-lg bg-[var(--surface-subtle)] hover:bg-[var(--line)]/50 border border-[var(--line)] text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text)] mb-0.5">
                  <Shield className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Admin Master</span>
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] truncate">
                  admin.test@autohub.vn
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillQuickAccount('staff.test@autohub.vn', 'Test@1234')}
                className="p-2.5 rounded-lg bg-[var(--surface-subtle)] hover:bg-[var(--line)]/50 border border-[var(--line)] text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text)] mb-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Staff Showroom</span>
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] truncate">
                  staff.test@autohub.vn
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation Links */}
        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] px-1">
          <Link to="/cars" className="hover:text-[var(--text)] transition-colors">
            ← Quay lại Showroom
          </Link>
          <Link to="/admin/login" className="hover:text-[var(--accent)] transition-colors font-medium">
            Cổng quản trị viên (Admin) →
          </Link>
        </div>
      </div>
    </div>
  );
};
