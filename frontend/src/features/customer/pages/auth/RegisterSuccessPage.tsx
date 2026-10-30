import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Check, ShieldCheck, Mail, User, ArrowRight } from 'lucide-react';

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
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#060E20] overflow-hidden">
      {/* 1. Immersive Blurred Luxury Automotive Studio Background matching Figma 21:15394 */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/3bea387701c2ccce6c1ed0bcadd2b76f0f595bc6?width=2496"
          alt="AutoHub Studio Background"
          className="w-full h-full object-cover opacity-20 filter blur-[3px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060E20] via-[#060E20]/80 to-[#060E20]/90" />
      </div>

      {/* Cybernetic Radial Glow Layers */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#0EA5E9]/15 blur-[140px] z-0" />
      <div className="pointer-events-none absolute bottom-10 left-1/3 w-[500px] h-[500px] rounded-full bg-[#89CEFF]/10 blur-[130px] z-0" />

      {/* 2. Main Modal Container (Centered, max-w-[540px]) */}
      <div className="relative z-10 w-full max-w-[540px] rounded-[4px] bg-[#131B2E] border border-[#2D3449] shadow-2xl overflow-hidden my-8">
        {/* Specular ambient top glow bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#0EA5E9] via-[#89CEFF] to-[#0EA5E9]" />

        <div className="p-8 md:p-10 space-y-8 text-center">
          {/* Centerpiece Visual Success HUD Badge */}
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
            {/* Pulsing glow rings */}
            <div className="absolute inset-0 rounded-full bg-[#0EA5E9]/20 animate-ping opacity-60" />
            <div className="absolute -inset-2 rounded-full border border-[#89CEFF]/30 animate-pulse" />

            {/* Glowing Center Circle */}
            <div className="relative w-20 h-20 rounded-full bg-[#060E20] border-2 border-[#89CEFF] flex items-center justify-center text-[#89CEFF] shadow-[0_0_35px_rgba(137,206,255,0.4)]">
              <Check className="w-10 h-10 stroke-[3] text-[#89CEFF]" />
            </div>
          </div>

          {/* Heading 2 - Headline & Subtitle */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-[#DAE2FD] tracking-tight">
              Tạo tài khoản thành công!
            </h1>
            <p className="text-xs md:text-sm text-[#BEC8D2] leading-relaxed max-w-md mx-auto">
              Chào mừng quý khách gia nhập cộng đồng AutoHub. Tài khoản thành viên của bạn đã sẵn sàng hoạt động.
            </p>
          </div>

          {/* Account Summary Card */}
          <div className="rounded-[2px] bg-[#060E20] border border-[#2D3449] p-5 text-left space-y-3.5 shadow-inner">
            {/* Row 1: Full Name */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2D3449]/70 text-xs">
              <div className="flex items-center gap-2 text-[#88929B]">
                <User className="w-4 h-4 text-[#89CEFF]" />
                <span>Họ và tên</span>
              </div>
              <span className="font-bold text-[#DAE2FD]">{fullName}</span>
            </div>

            {/* Row 2: Registered Email */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#88929B]">
                <Mail className="w-4 h-4 text-[#89CEFF]" />
                <span>Email đăng ký</span>
              </div>
              <span className="font-mono text-[#89CEFF] font-semibold">{email}</span>
            </div>
          </div>

          {/* Info Notification Footnote */}
          <div className="p-3.5 rounded-[2px] bg-[#171F33] border border-[#2D3449] text-left text-xs text-[#88929B] leading-relaxed space-y-1">
            <p>
              Thư xác nhận kích hoạt tài khoản đã được gửi đến hộp thư của bạn qua Gmail SMTP. Giỏ hàng tạm thời sẽ tự động được hợp nhất khi đăng nhập.
            </p>
          </div>

          {/* Auto-redirect Countdown Indicator */}
          <div className="space-y-2 pt-2">
            {/* Visual Animated Progress Bar */}
            <div className="w-full bg-[#060E20] h-1.5 rounded-full overflow-hidden border border-[#2D3449]">
              <div
                className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#89CEFF] transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 3) * 100}%` }}
              />
            </div>

            <div className="text-xs text-[#88929B]">
              Đang tự động chuyển hướng đến màn hình Đăng nhập sau{' '}
              <span className="font-mono text-sm font-bold text-[#89CEFF]">{countdown}</span> s...
            </div>
          </div>

          {/* Action Buttons Cluster */}
          <div className="pt-2 space-y-3">
            <button
              type="button"
              onClick={() => navigate('/auth/login')}
              className="w-full py-3.5 px-4 rounded-[2px] bg-[#0EA5E9] hover:bg-[#89CEFF] text-[#003751] font-bold text-xs tracking-wider uppercase transition-all shadow-xl active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Chuyển đến Đăng nhập ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center">
              <Link to="/" className="text-xs text-[#88929B] hover:text-[#DAE2FD] transition-colors">
                Hoặc quay về trang chủ
              </Link>
            </div>
          </div>

          {/* Monospace Security & Encryption Seal */}
          <div className="pt-2 border-t border-[#2D3449] flex items-center justify-center gap-1.5 font-mono text-[10px] text-[#88929B]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#89CEFF]" />
            <span>AUTOHUB-IDENTITY-V2 // ENCRYPTED VIA ED25519 // SSL 256-BIT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccessPage;
