import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, X, ArrowRight, ArrowUpRight, Check, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from './services/auth.service';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const login = useAuthStore((s) => s.login);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Submission & Validation states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Vui lòng nhập địa chỉ email của bạn.');
      return;
    }

    if (!password) {
      setErrorMessage('Vui lòng nhập mật khẩu.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await authService.login(email);

      // Cập nhật vào Zustand auth store (tự động đồng bộ localStorage)
      login(res.accessToken, res.user);

      setIsLoading(false);
      // Chuyển hướng tới trang đích hoặc trang chủ
      navigate(redirectUrl);
    } catch {
      setIsLoading(false);
      setErrorMessage('Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.');
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      login(`mock_google_oauth_${Date.now()}`, {
        id: 99,
        email: 'google.user@autohub.vn',
        fullName: 'Nguyễn Thành Google',
        phoneNumber: '0988776655',
        role: 'ROLE_CUSTOMER',
        isActive: true,
        createdAt: new Date().toISOString(),
      });
      setIsLoading(false);
      navigate(redirectUrl);
    }, 600);
  };

  const handleSendForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setShowForgotPasswordModal(false);
      setForgotEmail('');
    }, 2500);
  };

  return (
    <div className="relative min-h-[920px] h-screen w-full flex items-center justify-center p-4 bg-[#0B1326] overflow-hidden select-none">
      {/* 1. Immersive Automotive Studio Ambient Stage (Layer matching Figma Frame 20:14260) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Vehicle backdrop with atmospheric darkening */}
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/f8563407750402a5ec748ad5da036903aa27d5e0?width=2496"
          alt="AutoHub EV Cockpit Stage"
          className="w-full h-full object-cover opacity-25 filter blur-[1px] scale-105"
        />

        {/* Architectural Monochromatic Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1326] via-[#0B1326]/85 to-[#060E20]/90" />

        {/* Radial highlight glow centered on modal */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(60% 80% at 50% 45%, rgba(14, 165, 233, 0.08) 0%, rgba(14, 165, 233, 0.00) 75%)',
          }}
        />

        {/* Precision Telemetry Grid Lines (Cockpit Projection Feel) */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(137, 206, 255, 0.05) 1.56%, transparent 1.56%),
                              linear-gradient(180deg, rgba(137, 206, 255, 0.05) 1.56%, transparent 1.56%)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Ambient Glow Orbs */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[620px] h-[340px] rounded-xl bg-[#00A6E0]/10 blur-[55px]" />
      </div>

      {/* 2. Section - Glassmorphic Auth Modal Container (Tier 2 / Floating Instrumentation) */}
      <div className="relative z-10 w-full max-w-[480px] rounded-xl bg-[#171F33]/90 border border-[#2D3449]/70 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.85),0_0_36px_-6px_rgba(14,165,233,0.18)] backdrop-blur-xl p-8 overflow-hidden transition-all duration-300">
        {/* Top Specular Highlight Band */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#7BD0FF]/40 to-transparent" />

        {/* Top subtle blue bloom overlay */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-20 rounded-xl bg-[#7BD0FF]/15 blur-[20px] pointer-events-none" />

        {/* Modal Header */}
        <div className="relative pb-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-[24px] font-semibold text-[#DAE2FD] tracking-tight leading-8 font-sans">
              Đăng nhập tài khoản
            </h1>

            {/* Button - Đóng cửa sổ (Navigate to Home) */}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-8 h-8 rounded bg-[#131B2E] border border-[#2D3449]/50 hover:border-[#7BD0FF]/40 hover:bg-[#1A233A] text-[#BEC8D2] hover:text-[#DAE2FD] flex items-center justify-center transition-all duration-200 cursor-pointer"
              title="Đóng cửa sổ"
              aria-label="Đóng cửa sổ"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="mt-2 text-[13px] text-[#BEC8D2] leading-[21px] font-sans">
            Truy cập để quản lý đơn phụ kiện, theo dõi cọc xe 72h và mở khóa đặc quyền showroom cá nhân.
          </p>
        </div>

        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="pt-2 flex flex-col gap-5">
          {/* Field 1: Email / Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#DAE2FD]">
              Địa chỉ Email <span className="text-[#7BD0FF]">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-[#BEC8D2] pointer-events-none">
                <Mail className="w-[15px] h-[15px]" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="khachhang@autohub.vn"
                className="w-full h-11 pl-10 pr-4 bg-[#060E20] border border-[#2D3449] focus:border-[#00A6E0] rounded text-[#DAE2FD] text-[14px] placeholder:text-[#88929B]/60 focus:outline-none transition-colors duration-200"
              />
            </div>
          </div>

          {/* Field 2: Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-[#DAE2FD]">
                Mật khẩu <span className="text-[#7BD0FF]">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-[12px] text-[#7BD0FF] hover:underline focus:outline-none transition-colors"
              >
                Quên mật khẩu?
              </button>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-[#BEC8D2] pointer-events-none">
                <Lock className="w-[15px] h-[15px]" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 pl-10 pr-11 bg-[#060E20] border border-[#2D3449] focus:border-[#00A6E0] rounded text-[#DAE2FD] text-[14px] placeholder:text-[#88929B]/60 tracking-wider focus:outline-none transition-colors duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 text-[#BEC8D2] hover:text-[#DAE2FD] focus:outline-none transition-colors cursor-pointer"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Checkbox: Duy trì đăng nhập an toàn 30 ngày */}
          <div className="flex items-center pt-0.5">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <button
                type="button"
                role="checkbox"
                aria-checked={rememberMe}
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-4 h-4 rounded-[2.5px] border flex items-center justify-center transition-all ${
                  rememberMe
                    ? 'bg-[#00A6E0] border-[#00A6E0] text-[#060E20]'
                    : 'bg-[#060E20] border-[#2D3449] group-hover:border-[#7BD0FF]/60'
                }`}
              >
                {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
              <span className="text-[13px] text-[#BEC8D2] group-hover:text-[#DAE2FD] transition-colors">
                Duy trì đăng nhập
              </span>
            </label>
          </div>

          {/* Primary Action CTA Button: Đăng Nhập Ngay */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 mt-1 rounded bg-[#00A6E0] hover:bg-[#0EA5E9] text-[#060E20] font-semibold text-[14px] flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(0,166,224,0.30)] hover:shadow-[0_0_32px_rgba(0,166,224,0.50)] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#060E20] border-t-transparent rounded-full animate-spin" />
                Đang xác thực...
              </span>
            ) : (
              <>
                <span>Đăng Nhập Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Visual Segment Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="h-[1px] flex-1 bg-[#2D3449]" />
            <span className="font-mono text-[10px] text-[#88929B] tracking-[1.6px] uppercase">
              HOẶC TIẾP TỤC VỚI
            </span>
            <div className="h-[1px] flex-1 bg-[#2D3449]" />
          </div>

          {/* Social Login Buttons Row (Google SSO) */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-10 rounded bg-[#131B2E] border border-[#2D3449] hover:border-[#7BD0FF]/50 hover:bg-[#1A243D] text-[#DAE2FD] text-[13px] flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer"
          >
            {/* SVG Google chuẩn xác từ Figma */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 3.33317C9.06666 3.33317 10 3.73317 10.7333 4.39984L12.8 2.33317C11.5333 1.19984 9.86666 0.666504 8 0.666504C5 0.666504 2.46666 2.39984 1.26666 4.8665L3.73333 6.79984C4.33333 4.93317 6 3.33317 8 3.33317V3.33317"
                fill="#EA4335"
              />
              <path
                d="M15.6667 8.19984C15.6667 7.6665 15.6 7.13317 15.5333 6.6665H8V9.6665H12.3333C12.1333 10.6665 11.6 11.5332 10.7333 12.1332L13.2 14.0665C14.6667 12.7332 15.6667 10.6665 15.6667 8.19984V8.19984"
                fill="#4285F4"
              />
              <path
                d="M3.73333 9.86686C3.6 9.4002 3.46667 8.86686 3.46667 8.0002C3.46667 7.13353 3.6 6.6002 3.73333 6.13353L1.26667 4.2002C0.466667 5.8002 0 6.86686 0 8.0002C0 9.13353 0.466667 10.2002 1.26667 11.8002L3.73333 9.86686V9.86686"
                fill="#FBBC05"
              />
              <path
                d="M8 15.3334C10.1333 15.3334 12 14.6001 13.3333 13.3334L10.8667 11.4001C10.1333 11.8667 9.2 12.2001 8 12.2001C6 12.2001 4.33333 10.6001 3.73333 8.7334L1.26666 10.6667C2.46666 13.6001 5 15.3334 8 15.3334V15.3334"
                fill="#34A853"
              />
            </svg>
            <span>Google</span>
          </button>
        </form>

        {/* Modal Footer Section */}
        <div className="pt-6 flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-1.5 text-[13px]">
            <span className="text-[#BEC8D2]">Chưa có tài khoản AutoHub?</span>
            <Link
              to="/auth/register"
              className="text-[#7BD0FF] font-semibold hover:underline flex items-center gap-0.5 group"
            >
              <span>Đăng ký thành viên</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>


      </div>

      {/* Forgot Password Modal (Glassmorphic EV Popup) */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-[420px] rounded-xl bg-[#171F33] border border-[#2D3449] shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#2D3449]">
              <h3 className="text-lg font-semibold text-[#DAE2FD]">Khôi phục mật khẩu</h3>
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(false)}
                className="w-7 h-7 rounded bg-[#131B2E] text-[#BEC8D2] hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSuccess ? (
              <div className="py-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#34D399]/10 text-[#34D399] flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-[#DAE2FD]">Đã gửi mã khôi phục!</h4>
                <p className="text-xs text-[#BEC8D2] mt-1">
                  Vui lòng kiểm tra hộp thư đến của bạn để thiết lập mật khẩu mới.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendForgotPassword} className="mt-4 flex flex-col gap-4">
                <p className="text-xs text-[#BEC8D2]">
                  Nhập địa chỉ email đăng ký của bạn. Hệ thống sẽ gửi mã telemetry OTP xác thực tài khoản 1 chạm.
                </p>
                <div>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="khachhang@autohub.vn"
                    className="w-full h-10 px-3 bg-[#060E20] border border-[#2D3449] focus:border-[#00A6E0] rounded text-sm text-[#DAE2FD] placeholder:text-[#88929B]/60 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="px-4 py-2 rounded bg-[#131B2E] text-xs text-[#BEC8D2] hover:text-white"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-[#00A6E0] hover:bg-[#0EA5E9] text-xs font-semibold text-[#060E20]"
                  >
                    Gửi liên kết OTP
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
