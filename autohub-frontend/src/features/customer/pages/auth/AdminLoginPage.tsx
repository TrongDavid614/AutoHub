import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/features/customer/services/auth.service';
import { Logo } from '@/components/Logo';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (inputUser: string, inputPass: string) => {
    setErrorMessage('');
    if (!inputUser.trim()) {
      setErrorMessage('Vui lòng nhập tài khoản hoặc email quản trị viên.');
      return;
    }
    if (!inputPass) {
      setErrorMessage('Vui lòng nhập mật khẩu xác thực bảo mật.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await authService.login(inputUser, inputPass);
      login(res.accessToken, res.user);
      setIsLoading(false);

      if (res.user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        setErrorMessage('Tài khoản này không có quyền truy cập cổng Quản Trị Viên (ROLE_ADMIN).');
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const errRes = (err as { response?: { data?: { message?: string } } })?.response?.data;
      setErrorMessage(errRes?.message || 'Thông tin xác thực không chính xác hoặc tài khoản đã bị khóa bảo mật.');
    }
  };

  const fillQuickAdmin = () => {
    setUsername('admin.test@autohub.vn');
    setPassword('Test@1234');
    handleLogin('admin.test@autohub.vn', 'Test@1234');
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header & Brand */}
        <div className="text-center space-y-3">
          <div className="inline-flex justify-center">
            <Link to="/">
              <Logo size="lg" />
            </Link>
          </div>

          <div>
            <p className="text-xs font-medium text-[var(--accent)]">Cổng quản trị hệ thống</p>
            <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight mt-0.5">
              Đăng nhập quản trị viên
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-sm mx-auto">
              Quản lý dữ liệu xe, phụ kiện, đơn đặt cọc và phân quyền nhân sự AutoHub.
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="rounded-lg bg-[var(--surface)] border border-[var(--line)] p-7 shadow-xs space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(username, password);
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[var(--text)]">
                Tài khoản / Email quản trị
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@autohub.vn"
                  className="w-full pl-9 pr-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-colors"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[var(--text)]">
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
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--line-strong)] accent-[var(--accent)] cursor-pointer"
                />
                <span>Ghi nhớ phiên đăng nhập</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Đăng nhập bảng điều khiển</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-[var(--line)] space-y-2">
            <p className="text-xs font-medium text-[var(--text-secondary)]">
              Tài khoản kiểm thử nhanh (Demo):
            </p>
            <button
              type="button"
              onClick={fillQuickAdmin}
              className="w-full px-3 py-2.5 rounded-lg bg-[var(--surface-subtle)] hover:bg-[var(--line)]/50 border border-[var(--line)] text-left transition-colors cursor-pointer flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-semibold text-[var(--text)] block">Admin Master</span>
                <span className="text-[var(--text-secondary)]">admin.test@autohub.vn · Test@1234</span>
              </div>
              <span className="text-[var(--accent)] font-medium">Dùng thử →</span>
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] px-1">
          <Link to="/cars" className="hover:text-[var(--text)] transition-colors">
            ← Quay lại Showroom
          </Link>

          <Link to="/staff/login" className="hover:text-[var(--accent)] transition-colors font-medium">
            Cổng nhân viên (Staff) →
          </Link>
        </div>
      </div>
    </div>
  );
};
