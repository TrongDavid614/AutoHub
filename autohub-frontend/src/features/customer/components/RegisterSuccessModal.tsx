import React from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface RegisterSuccessModalProps {
  isOpen: boolean;
  fullName: string;
  email: string;
  onClose: () => void;
}

export const RegisterSuccessModal: React.FC<RegisterSuccessModalProps> = ({
  isOpen,
  fullName,
  email,
  onClose,
}) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45">
      <div className="w-full max-w-md rounded-xl bg-[var(--surface)] border border-[var(--line)] p-7 shadow-xl text-center space-y-5">
        <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            Kích hoạt tài khoản thành công
          </div>
          <h3 className="text-2xl font-bold text-[var(--text)]">
            Chào mừng {fullName}!
          </h3>
          <p className="text-xs text-[var(--text-2)] leading-relaxed">
            Tài khoản <strong className="text-[var(--accent)]">{email}</strong> của bạn đã được kích hoạt thành công trên hệ thống AutoHub Platform.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] space-y-2 text-left text-xs">
          <div className="flex items-center gap-2 text-[var(--accent)] font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Đặc quyền thành viên đã mở:</span>
          </div>
          <ul className="space-y-1 text-[var(--text-2)] text-xs list-disc list-inside">
            <li>Ưu tiên xếp lịch lái thử xe điện tại Showroom</li>
            <li>Đặt cọc giữ xe trực tuyến 72h hoàn tiền 100%</li>
            <li>Đồng bộ trạm sạc Wallbox và quản lý xe trên AutoOS</li>
          </ul>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/cars');
            }}
            className="flex-1 py-2.5 px-4 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Car className="w-4 h-4" />
            <span>Khám phá dòng xe</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/customer/profile');
            }}
            className="flex-1 py-2.5 px-4 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-subtle)] border border-[var(--line)] text-[var(--text)] text-xs font-medium cursor-pointer transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Vào hồ sơ cá nhân</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
