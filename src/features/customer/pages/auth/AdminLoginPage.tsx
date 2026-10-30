import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  KeyRound,
  Server,
  Zap,
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
    } catch {
      setIsLoading(false);
      setErrorMessage('Thông tin xác thực không chính xác hoặc tài khoản đã bị khóa bảo mật.');
    }
  };

  const fillQuickAdmin = () => {
    setUsername('admin@autohub.vn');
    setPassword('admin123');
    handleLogin('admin@autohub.vn', 'admin123');
  };

  return (
    <div className="min-h-screen bg-[#060E20] text-[#DAE2FD] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none">
      {/* Background Ambient Lighting & Luxury Grid */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#89CEFF]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-[#0EA5E9]/5 rounded-full blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(137, 206, 255, 0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Portal Header & Brand Identity */}
        <div className="text-center space-y-3">
          <div className="inline-flex justify-center mb-1 hover:opacity-90 transition-opacity">
            <Link to="/">
              <Logo size="lg" />
            </Link>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#131B2E] border border-[#89CEFF]/30 shadow-[0_0_16px_rgba(14,165,233,0.2)]">
            <ShieldCheck className="w-4 h-4 text-[#89CEFF]" />
            <span className="text-[11px] font-mono font-bold text-white tracking-wider uppercase">
              CỔNG QUẢN TRỊ ADMIN MASTER • RBAC F24
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Đăng Nhập Quản Trị Viên
            </h1>
            <p className="text-xs text-[#88929B] mt-1 max-w-sm mx-auto">
              Hệ thống giám sát điều hành doanh nghiệp, Master Data ô tô và cụm trí tuệ nhân tạo AutoHub
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="rounded-2xl bg-[#0B1326]/90 border border-[#3E4850]/60 p-7 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          {/* Error Alert Feedback */}
          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] text-xs flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(username, password);
            }}
            className="space-y-4"
          >
            {/* Input 1: Admin Account / Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#88929B] uppercase tracking-wider">
                Tài khoản / Email Quản Trị
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#88929B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@autohub.vn"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#060E20] border border-[#3E4850]/70 rounded-lg text-sm text-[#DAE2FD] placeholder-[#88929B] focus:outline-none focus:border-[#89CEFF] focus:ring-1 focus:ring-[#89CEFF] transition-all font-mono"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Input 2: Security Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono font-semibold text-[#88929B] uppercase tracking-wider">
                  Mật khẩu xác thực
                </label>
                <span className="text-[11px] text-[#89CEFF] font-mono">
                  HMAC-SHA512
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#88929B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-[#060E20] border border-[#3E4850]/70 rounded-lg text-sm text-[#DAE2FD] placeholder-[#88929B] focus:outline-none focus:border-[#89CEFF] focus:ring-1 focus:ring-[#89CEFF] transition-all font-mono"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#88929B] hover:text-[#DAE2FD] transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox & Security Info */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#BEC8D2]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#060E20] border-[#3E4850] text-[#0EA5E9] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-xs">Ghi nhớ phiên đăng nhập (30 ngày)</span>
              </label>

              <span className="text-[10px] font-mono text-[#88929B]">
                2FA Enabled
              </span>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3 px-4 rounded-lg bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] hover:from-[#38BDF8] hover:to-[#0EA5E9] text-[#00344D] font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_24px_rgba(14,165,233,0.4)] hover:shadow-[0_0_32px_rgba(14,165,233,0.7)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-[#00344D] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Xác Thực & Vào Bảng Điều Khiển</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Panel */}
          <div className="pt-4 mt-2 border-t border-[#3E4850]/50 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#88929B] uppercase tracking-wider">
              <span>Tài Khoản Kiểm Thử Nhanh (Demo):</span>
              <span className="text-[#89CEFF] flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#89CEFF]" />
                1-Click Login
              </span>
            </div>

            <button
              type="button"
              onClick={fillQuickAdmin}
              className="w-full p-3 rounded-xl bg-[#131B2E] hover:bg-[#171F33] border border-[#89CEFF]/30 hover:border-[#89CEFF]/70 text-left transition-all duration-300 group cursor-pointer shadow-md"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#89CEFF]">
                  <ShieldCheck className="w-4 h-4 text-[#89CEFF]" />
                  <span>Tài Khoản Admin Master (Toàn Quyền)</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#89CEFF]/15 text-[#89CEFF] font-bold">
                  Bấm Để Vào Ngay
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#88929B] group-hover:text-[#DAE2FD] transition-colors">
                <span>User: <strong>admin@autohub.vn</strong></span>
                <span>Pass: <strong>admin123</strong></span>
              </div>
            </button>
          </div>
        </div>

        {/* Security Audit Trail Warning */}
        <div className="p-3.5 rounded-xl bg-[#0B1326]/60 border border-[#3E4850]/40 text-center space-y-1.5">
          <div className="text-[11px] font-mono text-[#88929B] flex items-center justify-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Audit Trail Active: Ghi nhận địa chỉ IP & Nhật ký kiểm toán UC34</span>
          </div>
          <p className="text-[10px] text-[#88929B]">
            Mọi hành vi đăng nhập trái phép sẽ bị tự động khóa quyền truy cập theo chính sách an toàn thông tin AutoHub.
          </p>
        </div>

        {/* Footer Navigation Links */}
        <div className="flex items-center justify-between text-xs text-[#88929B] pt-2 px-2">
          <Link
            to="/cars"
            className="hover:text-[#89CEFF] transition-colors flex items-center gap-1"
          >
            ← Quay lại Showroom
          </Link>

          <Link
            to="/staff/login"
            className="hover:text-[#89CEFF] transition-colors flex items-center gap-1 font-medium"
          >
            <span>Cổng Nhân Viên Showroom (Staff)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
