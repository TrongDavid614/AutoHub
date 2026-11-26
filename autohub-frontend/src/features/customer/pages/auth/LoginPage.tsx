import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/features/customer/services/auth.service';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const login = useAuthStore((s) => s.login);

  const GOOGLE_CLIENT_ID =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    '833436348399-eka9dmurcvtflggm4fl30aud9sr1snj5.apps.googleusercontent.com';

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Submission & Validation states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [socialNotice, setSocialNotice] = useState<string | null>(null);

  // Tự động chuyển hướng từ IP thô sang domain sslip.io để đảm bảo bảo mật và tương thích Google OAuth
  useEffect(() => {
    if (window.location.hostname === '103.82.25.169') {
      const newUrl = window.location.href.replace('103.82.25.169', '103.82.25.169.sslip.io');
      window.location.replace(newUrl);
    }
  }, []);

  // Lắng nghe mã callback OAuth2 từ Google (khi Google chuyển hướng về kèm query param ?code=...)
  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) return;

    const exchangeGoogleCode = async () => {
      try {
        setIsLoading(true);
        setSocialNotice('Đang kết nối xác thực tài khoản Google với hệ thống AutoHub...');

        let currentOrigin = window.location.origin;
        if (currentOrigin.includes('103.82.25.169') && !currentOrigin.includes('sslip.io')) {
          currentOrigin = currentOrigin.replace('103.82.25.169', '103.82.25.169.sslip.io');
        }
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
        const errObj = err as { response?: { data?: { message?: string; error?: string } }; message?: string };
        const detailedMsg = errObj?.response?.data?.message || errObj?.response?.data?.error;
        setErrorMessage(
          detailedMsg || 'Đăng nhập bằng tài khoản Google thất bại. Vui lòng thử lại.'
        );
      }
    };

    exchangeGoogleCode();
  }, [searchParams, redirectUrl, login, navigate]);

  const handleGoogleRedirect = () => {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    let currentOrigin = window.location.origin;
    if (currentOrigin.includes('103.82.25.169') && !currentOrigin.includes('sslip.io')) {
      currentOrigin = currentOrigin.replace('103.82.25.169', '103.82.25.169.sslip.io');
    }
    const redirectUri = `${currentOrigin}/auth/login`;

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
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-10 px-4 bg-[var(--bg)] text-[var(--text)]">
      <div className="w-full max-w-[440px] space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex">
            <Logo size="md" />
          </Link>
          <Link
            to="/cars"
            className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
          >
            Xem showroom →
          </Link>
        </div>

        <div className="rounded-lg bg-[var(--surface)] border border-[var(--line)] p-7 sm:p-8 shadow-xs space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">
              Đăng nhập tài khoản
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Quản lý lịch lái thử, phiếu cọc xe 72 giờ và đơn hàng phụ kiện của bạn.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[var(--text)]">
                Địa chỉ email
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="khachhang@autohub.vn"
                  className="w-full h-10 pl-9 pr-3 bg-[var(--surface)] border border-[var(--line-strong)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] rounded-lg text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-medium text-[var(--text)]">Mật khẩu</label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-[var(--accent)] hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full h-10 pl-9 pr-10 bg-[var(--surface)] border border-[var(--line-strong)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] rounded-lg text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 p-1 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={rememberMe}
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    rememberMe
                      ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                      : 'bg-[var(--surface)] border-[var(--line-strong)]'
                  }`}
                >
                  {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <span className="text-[13px] text-[var(--text-secondary)]">Duy trì đăng nhập</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang đăng nhập...
                </span>
              ) : (
                <>
                  <span>Đăng nhập</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center gap-3 pt-2">
              <div className="h-[1px] flex-1 bg-[var(--line)]" />
              <span className="text-xs text-[var(--text-muted)] select-none">hoặc</span>
              <div className="h-[1px] flex-1 bg-[var(--line)]" />
            </div>

            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
              className="w-full h-10 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-subtle)] border border-[var(--line-strong)] text-sm font-medium text-[var(--text)] flex items-center justify-center gap-2.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Tiếp tục với Google</span>
            </button>

            {socialNotice && (
              <div className="p-2.5 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{socialNotice}</span>
              </div>
            )}
          </form>

          <div className="pt-4 border-t border-[var(--line)] text-center text-xs text-[var(--text-secondary)]">
            Chưa có tài khoản AutoHub?{' '}
            <Link to="/auth/register" className="text-[var(--accent)] font-medium hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
