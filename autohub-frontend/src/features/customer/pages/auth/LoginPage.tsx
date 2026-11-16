import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, X, ArrowRight, ArrowUpRight, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/features/customer/services/auth.service';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const login = useAuthStore((s) => s.login);

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Submission & Validation states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [socialNotice, setSocialNotice] = useState<string | null>(null);

  // Lắng nghe mã callback OAuth2 từ Google (khi Google chuyển hướng về kèm query param ?code=...)
  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) return;

    const exchangeGoogleCode = async () => {
      try {
        setIsLoading(true);
        setSocialNotice('Đang kết nối xác thực tài khoản Google với hệ thống AutoHub...');

        const currentOrigin = window.location.origin;
        const res = await authService.loginGoogle({
          code,
          redirectUri: `${currentOrigin}/auth/login`,
        });

        login(res.accessToken, res.user);
        setIsLoading(false);
        setSocialNotice(null);

        // Chuyển hướng tới trang đích hoặc dựa vào phân quyền role
        if (redirectUrl && redirectUrl !== '/') {
          navigate(redirectUrl);
        } else if (res.user.role === 'ROLE_ADMIN') {
          navigate('/admin/dashboard');
        } else if (res.user.role === 'ROLE_STAFF') {
          navigate('/staff/consultations');
        } else {
          navigate('/');
        }
      } catch (err: unknown) {
        setIsLoading(false);
        setSocialNotice(null);
        const errRes = (err as { response?: { data?: { message?: string } } })?.response?.data;
        setErrorMessage(
          errRes?.message || 'Đăng nhập bằng tài khoản Google thất bại. Vui lòng thử lại.'
        );
      }
    };

    exchangeGoogleCode();
  }, [searchParams, redirectUrl, login, navigate]);

  const handleGoogleRedirect = () => {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const redirectUri = `${window.location.origin}/auth/login`;

    const options = {
      redirect_uri: redirectUri,
      client_id: GOOGLE_CLIENT_ID,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'select_account',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
    };

    const qs = new URLSearchParams(options);
    window.location.href = `${rootUrl}?${qs.toString()}`;
  };

  const handleSocialLogin = (provider: 'Google' | 'Facebook' | 'Apple') => {
    if (provider === 'Google') {
      handleGoogleRedirect();
      return;
    }

    setSocialNotice(`Cổng đăng nhập an toàn ${provider} OAuth2 đang trong lộ trình tích hợp tiếp theo.`);
    setTimeout(() => {
      setSocialNotice(null);
    }, 3500);
  };

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
      const res = await authService.login(email, password);

      // Cập nhật vào Zustand auth store (tự động đồng bộ localStorage)
      login(res.accessToken, res.user);

      setIsLoading(false);
      // Chuyển hướng tới trang đích hoặc dựa vào phân quyền role
      if (redirectUrl && redirectUrl !== '/') {
        navigate(redirectUrl);
      } else if (res.user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else if (res.user.role === 'ROLE_STAFF') {
        navigate('/staff/consultations');
      } else {
        navigate('/');
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const errRes = (err as { response?: { data?: { message?: string } } })?.response?.data;
      setErrorMessage(errRes?.message || 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.');
    }
  };


  return (
    <div className="relative min-h-screen w-full flex items-center justify-center py-10 px-4 bg-[#0B1326] overflow-y-auto select-none">
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
              <Link
                to="/forgot-password"
                className="text-[12px] text-[#7BD0FF] hover:underline focus:outline-none transition-colors"
              >
                Quên mật khẩu?
              </Link>
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

          {/* Visual Divider: HOẶC ĐĂNG NHẬP VỚI */}
          <div className="flex items-center gap-3 pt-3">
            <div className="h-[1px] flex-1 bg-[#2D3449]" />
            <span className="font-mono text-[10px] text-[#88929B] tracking-[1.6px] uppercase select-none">
              HOẶC ĐĂNG NHẬP VỚI
            </span>
            <div className="h-[1px] flex-1 bg-[#2D3449]" />
          </div>

          {/* 3 Circular Social Login Options: Google, Facebook, Apple */}
          <div className="flex items-center justify-center gap-4 pt-1">
            {/* 1. Google Circle Button */}
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
              title="Đăng nhập với Google"
              aria-label="Đăng nhập với Google"
              className="w-11 h-11 rounded-full bg-[#060E20] border border-[#2D3449] hover:border-[#4285F4] hover:bg-[#131B2E] text-[#DAE2FD] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:shadow-[0_0_16px_rgba(66,133,244,0.35)] hover:scale-110 active:scale-95 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </button>

            {/* 2. Facebook Circle Button */}
            <button
              type="button"
              onClick={() => handleSocialLogin('Facebook')}
              disabled={isLoading}
              title="Đăng nhập với Facebook"
              aria-label="Đăng nhập với Facebook"
              className="w-11 h-11 rounded-full bg-[#060E20] border border-[#2D3449] hover:border-[#1877F2] hover:bg-[#131B2E] text-[#1877F2] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:shadow-[0_0_16px_rgba(24,119,242,0.35)] hover:scale-110 active:scale-95 disabled:opacity-50"
            >
              <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>

            {/* 3. Apple Circle Button */}
            <button
              type="button"
              onClick={() => handleSocialLogin('Apple')}
              disabled={isLoading}
              title="Đăng nhập với Apple"
              aria-label="Đăng nhập với Apple"
              className="w-11 h-11 rounded-full bg-[#060E20] border border-[#2D3449] hover:border-white hover:bg-[#131B2E] text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:shadow-[0_0_16px_rgba(255,255,255,0.30)] hover:scale-110 active:scale-95 disabled:opacity-50"
            >
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.76 1.05-1.81.93-2.87-.9.04-2 .6-2.65 1.36-.57.66-.99 1.73-.86 2.76 1.01.08 2.01-.52 2.58-1.25z" />
              </svg>
            </button>
          </div>

          {/* Social Notice / Notification */}
          {socialNotice && (
            <div className="p-2.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <ShieldCheck className="w-4 h-4 shrink-0 text-sky-400" />
              <span>{socialNotice}</span>
            </div>
          )}
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
    </div>
  );
};
