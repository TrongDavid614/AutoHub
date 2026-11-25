import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  RefreshCw,
  Clock,
  KeyRound,
} from 'lucide-react';
import { authService } from '../../services/auth.service';

type Step = 'EMAIL' | 'OTP' | 'NEW_PASSWORD' | 'SUCCESS';

// Helper to extract clean Vietnamese error message from Axios / backend response
const extractErrorMessage = (err: unknown, fallback: string): string => {
  if (err && typeof err === 'object') {
    const resData = (err as { response?: { data?: { message?: string } } })?.response?.data;
    if (resData?.message && typeof resData.message === 'string') {
      return resData.message;
    }
    if ('message' in err && typeof (err as { message: unknown }).message === 'string') {
      const msg = (err as { message: string }).message;
      if (!msg.toLowerCase().includes('status code')) {
        return msg;
      }
    }
  }
  return fallback;
};

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  // Step State
  const [step, setStep] = useState<Step>('EMAIL');

  // Form Fields
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // OTP Countdown (5 minutes = 300s)
  const [countdown, setCountdown] = useState<number>(300);
  const [canResend, setCanResend] = useState(false);

  // OTP Input Refs
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown Timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (step === 'OTP' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Step 1: Submit Email to get OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Vui lòng nhập địa chỉ email của bạn.');
      return;
    }

    setIsLoading(true);
    try {
      const msg = await authService.forgotPassword(cleanEmail);
      setSuccessMessage(msg || 'Mã OTP 6 số đã được gửi đến email của bạn.');
      setCountdown(300);
      setCanResend(false);
      setStep('OTP');
      // Focus on first OTP input after transition
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
    } catch (err: unknown) {
      setErrorMessage(extractErrorMessage(err, 'Không thể gửi mã OTP. Vui lòng kiểm tra lại email hoặc thử lại sau.'));
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle OTP input changes
  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...otpDigits];
    newOtp[index] = val.slice(-1);
    setOtpDigits(newOtp);

    // Auto-advance focus
    if (val && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      } else if (otpDigits[index]) {
        const newOtp = [...otpDigits];
        newOtp[index] = '';
        setOtpDigits(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newOtp = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || '';
    }
    setOtpDigits(newOtp);

    const nextIndex = Math.min(pasted.length, 5);
    otpInputRefs.current[nextIndex]?.focus();
  };

  // Step 2: Submit OTP for verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setErrorMessage('Vui lòng nhập đủ 6 chữ số mã OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.verifyOtp(email, fullOtp);
      setResetToken(res.resetToken);
      setSuccessMessage('Xác thực mã OTP thành công! Vui lòng thiết lập mật khẩu mới.');
      setStep('NEW_PASSWORD');
    } catch (err: unknown) {
      setErrorMessage(extractErrorMessage(err, 'Mã OTP không chính xác hoặc đã hết hạn.'));
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setSuccessMessage('Mã OTP mới đã được gửi lại vào email của bạn.');
      setCountdown(300);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } catch (err: unknown) {
      setErrorMessage(extractErrorMessage(err, 'Không thể gửi lại mã OTP. Vui lòng thử lại sau.'));
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Submit New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage('Mật khẩu mới phải có tối thiểu 8 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp với mật khẩu mới.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        email,
        resetToken,
        newPassword,
      });
      setStep('SUCCESS');
    } catch (err: unknown) {
      setErrorMessage(extractErrorMessage(err, 'Không thể đặt lại mật khẩu. Vui lòng thử lại.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center p-4 font-sans text-[var(--text)]">
      <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--line)] shadow-xs rounded-lg p-6 sm:p-8 space-y-5">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] mx-auto">
            <KeyRound className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
            Khôi phục mật khẩu
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            {step === 'EMAIL' && 'Nhập email để nhận mã xác thực OTP gồm 6 chữ số'}
            {step === 'OTP' && 'Nhập mã OTP gồm 6 chữ số đã được gửi qua email'}
            {step === 'NEW_PASSWORD' && 'Thiết lập mật khẩu mới cho tài khoản của bạn'}
            {step === 'SUCCESS' && 'Mật khẩu mới đã được cập nhật'}
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Global Success Banner */}
        {successMessage && step !== 'SUCCESS' && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* STEP 1: REQUEST OTP VIA EMAIL */}
        {step === 'EMAIL' && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-[var(--text)] mb-1.5">
                Địa chỉ email đã đăng ký
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nhap.email@example.com"
                  className="w-full bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg pl-9 pr-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-colors"
                />
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1.5">
                Mã OTP gồm 6 chữ số có hiệu lực trong 5 phút.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 rounded-lg text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
              <span>{isLoading ? 'Đang gửi mã OTP...' : 'Gửi mã xác thực OTP'}</span>
            </button>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại đăng nhập</span>
              </Link>
            </div>
          </form>
        )}

        {/* STEP 2: VERIFY 6-DIGIT OTP */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="text-center">
              <p className="text-xs text-[var(--text-secondary)]">
                Mã xác thực đã được gửi tới email:
              </p>
              <p className="text-xs font-semibold text-[var(--accent)] mt-0.5">{email}</p>
            </div>

            <div
              className="flex items-center justify-center gap-2 sm:gap-2.5 my-2"
              onPaste={handleOtpPaste}
            >
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpInputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  onPaste={handleOtpPaste}
                  className="w-10 sm:w-12 h-12 text-center text-lg sm:text-xl font-bold tabular-nums bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-colors"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Hiệu lực còn:</span>
                <span className="font-semibold text-amber-700 tabular-nums">{formatTime(countdown)}</span>
              </div>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || isLoading}
                className={`font-medium transition-colors cursor-pointer ${
                  canResend
                    ? 'text-[var(--accent)] hover:underline'
                    : 'text-[var(--text-muted)] cursor-not-allowed'
                }`}
              >
                Gửi lại OTP
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || otpDigits.join('').length !== 6}
              className="w-full h-10 rounded-lg text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
              <span>{isLoading ? 'Đang xác thực...' : 'Xác nhận mã OTP'}</span>
            </button>

            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => setStep('EMAIL')}
                className="text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors cursor-pointer"
              >
                Đổi email khác
              </button>
              <Link to="/login" className="text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">
                Đăng nhập
              </Link>
            </div>
          </form>
        )}

        {/* STEP 3: ENTER NEW PASSWORD */}
        {step === 'NEW_PASSWORD' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-[var(--text)] mb-1.5">
                Mật khẩu mới
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 8 ký tự"
                  className="w-full bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg pl-9 pr-10 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[var(--text)] mb-1.5">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg pl-9 pr-10 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 rounded-lg text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
              <span>{isLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu mới'}</span>
            </button>
          </form>
        )}

        {/* STEP 4: SUCCESS STATE */}
        {step === 'SUCCESS' && (
          <div className="text-center py-4 space-y-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">Đặt lại mật khẩu thành công</h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                Mật khẩu cho tài khoản <strong className="text-[var(--text)]">{email}</strong> đã được thay đổi. Bạn có thể đăng nhập ngay.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full h-10 rounded-lg text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors cursor-pointer"
            >
              Đăng nhập ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
