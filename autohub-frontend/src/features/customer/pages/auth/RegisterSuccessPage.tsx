import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Check, Mail, User, ArrowRight } from 'lucide-react';

export const RegisterSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const fullName = searchParams.get('name') || 'Nguyễn Văn A';
  const email = searchParams.get('email') || 'nguyenvana@gmail.com';

  const [countdown, setCountdown] = useState(3);

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown <= 0) {
      navigate('/auth/login');
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[var(--bg)] text-[var(--text)]">
      <div className="w-full max-w-[460px] rounded-lg bg-[var(--surface)] border border-[var(--line)] shadow-xs p-7 sm:p-8 space-y-6 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
          <Check className="w-7 h-7 stroke-[2.5]" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">
            Tạo tài khoản thành công
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Tài khoản thành viên AutoHub của bạn đã sẵn sàng sử dụng.
          </p>
        </div>

        {/* Account Summary (hairline divider rows, no nested dark cards) */}
        <div className="border-y border-[var(--line)] py-3 text-left space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[var(--text-secondary)]">
              <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              Họ và tên
            </span>
            <span className="font-semibold text-[var(--text)]">{fullName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[var(--text-secondary)]">
              <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              Email đăng ký
            </span>
            <span className="font-medium text-[var(--accent)]">{email}</span>
          </div>
        </div>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Thư xác nhận kích hoạt tài khoản đã được gửi đến hộp thư của bạn.
        </p>

        {/* Auto-redirect Countdown */}
        <div className="space-y-2">
          <div className="w-full bg-[var(--surface-subtle)] h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] transition-all duration-1000 ease-linear"
              style={{ width: `${(countdown / 3) * 100}%` }}
            />
          </div>
          <div className="text-xs text-[var(--text-muted)] tabular-nums">
            Tự động chuyển sang Đăng nhập sau <strong className="text-[var(--text)]">{countdown}s</strong>...
          </div>
        </div>

        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={() => navigate('/auth/login')}
            className="w-full h-10 px-4 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Đăng nhập ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            to="/"
            className="block text-xs text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccessPage;
