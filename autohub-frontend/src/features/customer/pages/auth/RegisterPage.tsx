import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Phone, Lock, Eye, EyeOff, X, Check } from 'lucide-react';
import { PasswordStrengthMeter } from '@/features/customer/components/PasswordStrengthMeter';
import { authService } from '@/features/customer/services/auth.service';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';

type RegisterField =
  | 'fullName'
  | 'phoneNumber'
  | 'email'
  | 'password'
  | 'confirmPassword'
  | 'agreeTerms';

type FieldErrors = Partial<Record<RegisterField, string>>;

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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearFieldError = (field: RegisterField) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

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
    setFieldErrors({});

    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // Chuẩn hóa số điện thoại
    let cleanPhone = phoneNumber.trim().replace(/[\s.-]/g, '');
    if (cleanPhone.startsWith('+84')) {
      cleanPhone = '0' + cleanPhone.slice(3);
    } else if (cleanPhone.startsWith('84') && cleanPhone.length === 11) {
      cleanPhone = '0' + cleanPhone.slice(2);
    } else if (!cleanPhone.startsWith('0') && cleanPhone.length === 9) {
      cleanPhone = '0' + cleanPhone;
    }

    const nextErrors: FieldErrors = {};

    if (!trimmedFullName) {
      nextErrors.fullName = 'Vui lòng nhập họ và tên.';
    }

    if (!cleanPhone) {
      nextErrors.phoneNumber = 'Vui lòng nhập số điện thoại.';
    } else if (!/^0[35789]\d{8}$/.test(cleanPhone)) {
      nextErrors.phoneNumber =
        'Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số (đầu số 03, 05, 07, 08, 09).';
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Vui lòng nhập địa chỉ email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Địa chỉ email không hợp lệ (VD: ten@gmail.com).';
    }

    if (!password) {
      nextErrors.password = 'Vui lòng nhập mật khẩu.';
    } else if (password.length < 8) {
      nextErrors.password = 'Mật khẩu phải có tối thiểu 8 ký tự.';
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Vui lòng nhập xác nhận mật khẩu.';
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Mật khẩu xác nhận không khớp với mật khẩu đã nhập.';
    }

    if (!agreeTerms) {
      nextErrors.agreeTerms = 'Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setError('Vui lòng kiểm tra lại các thông tin được đánh dấu đỏ bên dưới.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await authService.register({
        fullName: trimmedFullName,
        phoneNumber: cleanPhone,
        email: trimmedEmail,
        password,
        agreeTerms,
        receiveMarketing,
      });

      // Auto login user into store with real JWT token
      login(res.accessToken, res.user);
      setIsSubmitting(false);
      navigate(`/auth/register-success?name=${encodeURIComponent(trimmedFullName)}&email=${encodeURIComponent(trimmedEmail)}`);
    } catch (err: unknown) {
      setIsSubmitting(false);
      const errObj = err as {
        code?: string;
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };

      let resolvedError = errObj?.response?.data?.message || errObj?.response?.data?.error;
      if (!resolvedError && !errObj?.response) {
        if (errObj?.code === 'ECONNABORTED' || errObj?.message?.toLowerCase().includes('timeout')) {
          resolvedError = 'Máy chủ phản hồi quá chậm. Vui lòng thử lại sau.';
        } else {
          resolvedError =
            'Không thể kết nối đến máy chủ AutoHub. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.';
        }
      }

      const finalMsg =
        resolvedError || 'Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.';
      const lowerMsg = finalMsg.toLowerCase();
      const mappedErrors: FieldErrors = {};

      if (lowerMsg.includes('email')) {
        mappedErrors.email = finalMsg;
      } else if (
        lowerMsg.includes('số điện thoại') ||
        lowerMsg.includes('điện thoại') ||
        lowerMsg.includes('phonenumber')
      ) {
        mappedErrors.phoneNumber = finalMsg;
      } else if (lowerMsg.includes('họ và tên') || lowerMsg.includes('fullname')) {
        mappedErrors.fullName = finalMsg;
      } else if (lowerMsg.includes('mật khẩu') || lowerMsg.includes('password')) {
        mappedErrors.password = finalMsg;
      }

      setFieldErrors(mappedErrors);
      setError(finalMsg);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-10 px-4 bg-[var(--bg)] text-[var(--text)]">
      <div className="w-full max-w-[480px] rounded-lg bg-[var(--surface)] border border-[var(--line)] shadow-xs p-6 md:p-8 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">
              Đăng ký tài khoản
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Tạo tài khoản AutoHub để đặt lịch lái thử, theo dõi cọc xe và mua phụ kiện.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="p-1.5 rounded-md hover:bg-[var(--surface-subtle)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer shrink-0"
            title="Về trang chủ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-[var(--text)]">
              Họ và tên <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  clearFieldError('fullName');
                }}
                placeholder="Nguyễn Văn An"
                className={cn(
                  'w-full pl-9 pr-3 py-2 bg-[var(--surface)] border rounded-lg text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 transition-colors',
                  fieldErrors.fullName
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                    : 'border-[var(--line-strong)] focus:border-[var(--accent)] focus:ring-[var(--accent-soft)]'
                )}
              />
            </div>
            {fieldErrors.fullName && (
              <p className="text-xs text-red-600">{fieldErrors.fullName}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-[var(--text)]">
              Số điện thoại <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="px-3 py-2 rounded-lg bg-[var(--surface-subtle)] border border-[var(--line-strong)] text-sm font-medium text-[var(--text-secondary)] shrink-0 tabular-nums">
                +84
              </div>
              <div className="relative flex-1">
                <Phone className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    clearFieldError('phoneNumber');
                  }}
                  placeholder="0912 345 678"
                  className={cn(
                    'w-full pl-9 pr-3 py-2 bg-[var(--surface)] border rounded-lg text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 transition-colors tabular-nums',
                    fieldErrors.phoneNumber
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-[var(--line-strong)] focus:border-[var(--accent)] focus:ring-[var(--accent-soft)]'
                  )}
                />
              </div>
            </div>
            {fieldErrors.phoneNumber && (
              <p className="text-xs text-red-600">{fieldErrors.phoneNumber}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-[var(--text)]">
              Địa chỉ email <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError('email');
                }}
                placeholder="an.nguyen@autohub.vn"
                className={cn(
                  'w-full pl-9 pr-3 py-2 bg-[var(--surface)] border rounded-lg text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 transition-colors',
                  fieldErrors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                    : 'border-[var(--line-strong)] focus:border-[var(--accent)] focus:ring-[var(--accent-soft)]'
                )}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-xs text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-[var(--text)]">
              Mật khẩu <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError('password');
                }}
                placeholder="Tối thiểu 8 ký tự"
                className={cn(
                  'w-full pl-9 pr-10 py-2 bg-[var(--surface)] border rounded-lg text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 transition-colors',
                  fieldErrors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                    : 'border-[var(--line-strong)] focus:border-[var(--accent)] focus:ring-[var(--accent-soft)]'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-red-600">{fieldErrors.password}</p>
            )}

            <PasswordStrengthMeter score={passwordScore} />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-[var(--text)]">
                Xác nhận mật khẩu <span className="text-red-600">*</span>
              </label>
              {isPasswordMatch && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                  <Check className="w-3.5 h-3.5" />
                  <span>Khớp</span>
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearFieldError('confirmPassword');
                }}
                placeholder="Nhập lại mật khẩu"
                className={cn(
                  'w-full pl-9 pr-3 py-2 bg-[var(--surface)] border rounded-lg text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 transition-colors',
                  fieldErrors.confirmPassword
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                    : 'border-[var(--line-strong)] focus:border-[var(--accent)] focus:ring-[var(--accent-soft)]'
                )}
              />
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-xs text-red-600">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <div className="space-y-2.5 pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[var(--text-secondary)] select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  clearFieldError('agreeTerms');
                }}
                className="mt-0.5 rounded border-[var(--line-strong)] accent-[var(--accent)] cursor-pointer"
              />
              <span className="leading-relaxed">
                Tôi đồng ý với{' '}
                <Link to="#" className="text-[var(--accent)] hover:underline">
                  Điều khoản dịch vụ
                </Link>{' '}
                và{' '}
                <Link to="#" className="text-[var(--accent)] hover:underline">
                  Chính sách bảo mật
                </Link>{' '}
                của AutoHub.
              </span>
            </label>
            {fieldErrors.agreeTerms && (
              <p className="text-xs text-red-600">{fieldErrors.agreeTerms}</p>
            )}

            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[var(--text-muted)] select-none">
              <input
                type="checkbox"
                checked={receiveMarketing}
                onChange={(e) => setReceiveMarketing(e.target.checked)}
                className="mt-0.5 rounded border-[var(--line-strong)] accent-[var(--accent)] cursor-pointer"
              />
              <span className="leading-relaxed">
                Nhận thông báo lịch mở lái thử dòng xe mới và ưu đãi phụ kiện.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 px-4 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium text-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
          </button>
        </form>

        <div className="pt-4 text-center text-xs text-[var(--text-secondary)] border-t border-[var(--line)]">
          <span>Đã có tài khoản AutoHub? </span>
          <Link to="/auth/login" className="text-[var(--accent)] hover:underline font-medium">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
