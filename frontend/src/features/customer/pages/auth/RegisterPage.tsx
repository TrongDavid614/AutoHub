import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Phone, Lock, Eye, EyeOff, X, ShieldCheck, Check } from 'lucide-react';
import { PasswordStrengthMeter } from '@/features/customer/components/PasswordStrengthMeter';
import { authService } from '@/features/customer/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [receiveMarketing, setReceiveMarketing] = useState(false);

  // Form validation / error
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password score calculation (0 - 4)
  const calculateScore = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const passwordScore = calculateScore(password);
  const isPasswordMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !phoneNumber.trim() || !email.trim() || !password) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    if (password.length < 8) {
      setError('Mật khẩu phải có tối thiểu 8 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (!agreeTerms) {
      setError('Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.');
      return;
    }

    try {
      setIsSubmitting(true);
      const user = await authService.register({
        fullName,
        phoneNumber,
        email,
        password,
        agreeTerms,
        receiveMarketing,
      });

      // Auto login user into store
      login(`jwt_mock_token_${Date.now()}`, user);
      setIsSubmitting(false);
      navigate(`/auth/register-success?name=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}`);
    } catch {
      setIsSubmitting(false);
      setError('Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#060E20] overflow-hidden">
      {/* 1. Atmospheric Background Visual Layer matching Figma Frame 20:14405 */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/a4e599e935e4de5485bb5c63599144d10a0fbd57?width=2560"
          alt="AutoHub EV Background"
          className="w-full h-full object-cover opacity-25 filter blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060E20] via-[#060E20]/85 to-[#060E20]/90" />
      </div>

      {/* Ambient Glow Orbs */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#0EA5E9]/15 blur-[120px] z-0" />

      {/* 2. Main Registration Card (520px standard) */}
      <div className="relative z-10 w-full max-w-[520px] rounded-[4px] bg-[#131B2E] border border-[#2D3449] shadow-2xl overflow-hidden my-8">
        {/* Specular ambient top glow bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#0EA5E9] via-[#89CEFF] to-[#0EA5E9]" />

        <div className="p-6 md:p-8 space-y-6">
          {/* Modal Header Section */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-[#DAE2FD] tracking-tight">
                Đăng ký tài khoản
              </h1>
              <p className="text-xs text-[#BEC8D2] leading-relaxed">
                Thiết lập danh tính số trong 30 giây để kích hoạt đặc quyền lái thử, đặt cọc và ưu đãi độc quyền.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="p-1.5 rounded-[2px] bg-[#222A3D] hover:bg-[#2D3449] text-[#88929B] hover:text-[#DAE2FD] transition-colors cursor-pointer shrink-0"
              title="Đóng cửa sổ"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Error notice */}
          {error && (
            <div className="p-3 rounded-[2px] bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Họ và tên */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#BEC8D2] flex items-center gap-1">
                <span>Họ và tên</span>
                <span className="text-[#89CEFF]">*</span>
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#88929B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#060E20] border border-[#2D3449] rounded-[2px] text-xs text-[#DAE2FD] placeholder-[#88929B] focus:outline-none focus:border-[#89CEFF] focus:ring-1 focus:ring-[#89CEFF] transition-all"
                />
              </div>
            </div>

            {/* 2. Số điện thoại di động */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#BEC8D2] flex items-center gap-1">
                <span>Số điện thoại di động</span>
                <span className="text-[#89CEFF]">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="px-3 py-2.5 rounded-[2px] bg-[#222A3D] border border-[#2D3449] text-xs font-mono font-bold text-[#89CEFF] shrink-0">
                  +84
                </div>
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 text-[#88929B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#060E20] border border-[#2D3449] rounded-[2px] text-xs font-mono text-[#DAE2FD] placeholder-[#88929B] focus:outline-none focus:border-[#89CEFF] focus:ring-1 focus:ring-[#89CEFF] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 3. Email định danh */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#BEC8D2] flex items-center gap-1">
                <span>Email định danh</span>
                <span className="text-[#89CEFF]">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#88929B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="an.nguyen@autohub.vn"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#060E20] border border-[#2D3449] rounded-[2px] text-xs text-[#DAE2FD] placeholder-[#88929B] focus:outline-none focus:border-[#89CEFF] focus:ring-1 focus:ring-[#89CEFF] transition-all"
                />
              </div>
            </div>

            {/* 4. Mật khẩu & Strength Meter */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#BEC8D2] flex items-center gap-1">
                <span>Mật khẩu tài khoản</span>
                <span className="text-[#89CEFF]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#88929B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 8 ký tự kèm số & ký hiệu"
                  className="w-full pl-9 pr-10 py-2.5 bg-[#060E20] border border-[#2D3449] rounded-[2px] text-xs text-[#DAE2FD] placeholder-[#88929B] focus:outline-none focus:border-[#89CEFF] focus:ring-1 focus:ring-[#89CEFF] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#88929B] hover:text-[#DAE2FD] cursor-pointer"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Meter matching Figma Frame 20:14537 */}
              <PasswordStrengthMeter score={passwordScore} />
            </div>

            {/* 5. Xác nhận mật khẩu */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#BEC8D2] flex items-center gap-1">
                  <span>Xác nhận mật khẩu</span>
                  <span className="text-[#89CEFF]">*</span>
                </label>
                {isPasswordMatch && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#34D399]">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>KHỚP</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#88929B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại chính xác mật khẩu"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#060E20] border border-[#2D3449] rounded-[2px] text-xs text-[#DAE2FD] placeholder-[#88929B] focus:outline-none focus:border-[#89CEFF] focus:ring-1 focus:ring-[#89CEFF] transition-all"
                />
              </div>
            </div>

            {/* Legal Checkboxes */}
            <div className="space-y-2.5 pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#BEC8D2] select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded-[2px] bg-[#060E20] border-[#3E4850] text-[#0EA5E9] focus:ring-0 cursor-pointer"
                />
                <span className="leading-relaxed">
                  Tôi đồng ý với{' '}
                  <Link to="#" className="text-[#89CEFF] hover:underline">
                    Điều khoản Dịch vụ
                  </Link>{' '}
                  và{' '}
                  <Link to="#" className="text-[#89CEFF] hover:underline">
                    Chính sách Bảo mật
                  </Link>{' '}
                  của AutoHub.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-[#88929B] select-none">
                <input
                  type="checkbox"
                  checked={receiveMarketing}
                  onChange={(e) => setReceiveMarketing(e.target.checked)}
                  className="mt-0.5 rounded-[2px] bg-[#060E20] border-[#3E4850] text-[#0EA5E9] focus:ring-0 cursor-pointer"
                />
                <span className="leading-relaxed">
                  Nhận thông báo lịch mở lái thử dòng xe điện mới, phụ kiện độc quyền và cập nhật phần mềm OTA.
                </span>
              </label>
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-[2px] bg-[#0EA5E9] hover:bg-[#89CEFF] text-[#003751] font-bold text-xs tracking-wider uppercase transition-all shadow-xl active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'ĐANG KHỞI TẠO TÀI KHOẢN...' : 'Tạo Tài Khoản & Kích Hoạt'}
              </button>
            </div>
          </form>

          {/* Social Registration Divider */}
          <div className="space-y-4 pt-2">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2D3449]" />
              </div>
              <span className="relative px-3 bg-[#131B2E] text-[10px] font-mono font-bold tracking-[1.5px] text-[#88929B] uppercase">
                HOẶC ĐĂNG KÝ NHANH
              </span>
            </div>

            {/* Google SSO Button */}
            <button
              type="button"
              onClick={() => {
                // Mock Google OAuth redirect or sign-in
                login(`jwt_google_${Date.now()}`, {
                  id: 999,
                  email: 'an.nguyen@gmail.com',
                  fullName: 'Nguyễn Văn An (Google)',
                  phoneNumber: '0912345678',
                  role: 'ROLE_CUSTOMER',
                  isActive: true,
                  createdAt: new Date().toISOString(),
                });
                navigate('/');
              }}
              className="w-full py-2.5 px-4 rounded-[2px] bg-[#060E20] hover:bg-[#171F33] border border-[#2D3449] hover:border-[#89CEFF] text-xs font-semibold text-[#DAE2FD] flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-sm"
            >
              {/* Google G logo */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>Google ID</span>
            </button>
          </div>

          {/* Bottom Account Switcher */}
          <div className="pt-2 text-center text-xs text-[#88929B] border-t border-[#2D3449]">
            <span>Đã sở hữu tài khoản AutoHub? </span>
            <Link to="/auth/login" className="text-[#89CEFF] hover:underline font-semibold">
              Đăng nhập ngay
            </Link>
          </div>

          {/* Security & Encryption Badge */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#88929B]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#89CEFF]" />
            <span>BẢO MẬT SSL 256-BIT • CHUẨN ĐỊNH DANH AN TOÀN</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
