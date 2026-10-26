import React from 'react';
import { User, Phone, MessageSquare, ShieldCheck } from 'lucide-react';

interface CustomerInfoFormProps {
  fullName: string;
  setFullName: (val: string) => void;
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  note: string;
  setNote: (val: string) => void;
  licenseAgreed: boolean;
  setLicenseAgreed: (val: boolean) => void;
}

export const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({
  fullName,
  setFullName,
  phoneNumber,
  setPhoneNumber,
  note,
  setNote,
  licenseAgreed,
  setLicenseAgreed,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Header */}
      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-primary block">
        THÔNG TIN KHÁCH HÀNG ĐĂNG KÝ
      </span>

      {/* 2. Customer Fields */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Họ và tên */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-text-primary">
                Họ và tên quý khách <span className="text-accent-primary">*</span>
              </label>
              <span className="text-[10px] font-mono font-bold text-accent-primary uppercase">
                BẮT BUỘC
              </span>
            </div>
            <div className="relative flex items-center">
              <User className="w-3.5 h-3.5 text-text-muted absolute left-3 pointer-events-none" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full h-10 pl-9 pr-3 bg-canvas-deep border border-surface-highlight focus:border-accent-primary rounded text-xs text-text-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Số điện thoại */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-text-primary">
                Số điện thoại liên hệ <span className="text-accent-primary">*</span>
              </label>
              <span className="text-[10px] font-mono font-bold text-accent-primary uppercase">
                XÁC MINH SMS
              </span>
            </div>
            <div className="relative flex items-center">
              <Phone className="w-3.5 h-3.5 text-text-muted absolute left-3 pointer-events-none" />
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0912 345 678"
                className="w-full h-10 pl-9 pr-3 bg-canvas-deep border border-surface-highlight focus:border-accent-primary rounded text-xs text-text-primary font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Ghi chú / Yêu cầu trải nghiệm chuyên sâu */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-text-primary">
              Ghi chú / Yêu cầu trải nghiệm chuyên sâu
            </label>
            <span className="text-[10px] font-mono text-text-muted uppercase">
              TÙY CHỌN
            </span>
          </div>
          <div className="relative flex items-start">
            <MessageSquare className="w-3.5 h-3.5 text-text-muted absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Muốn trải nghiệm tính năng tự hành ADAS LiDAR trên cao tốc Long Thành..."
              className="w-full h-10 pl-9 pr-3 bg-canvas-deep border border-surface-highlight focus:border-accent-primary rounded text-xs text-text-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Section 6: Mandatory License Compliance Checkbox */}
      <div className="p-3.5 sm:p-4 rounded bg-surface-container border border-surface-highlight">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={licenseAgreed}
            onChange={(e) => setLicenseAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 rounded text-accent-action bg-canvas-deep border-surface-highlight focus:ring-accent-primary shrink-0"
          />
          <div className="space-y-0.5 text-xs text-text-secondary leading-relaxed">
            <div className="font-semibold text-text-primary flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Cam kết tuân thủ điều kiện cấp phép lái thử</span>
            </div>
            <p>
              Tôi cam kết hiện đang sở hữu{' '}
              <strong className="text-text-primary">Giấy phép lái xe (GPLX) ô tô Hạng B2 trở lên</strong> còn hiệu lực pháp luật và đồng ý xuất trình bản gốc đối chiếu tại địa điểm trước khi tiếp nhận chìa khóa điều khiển AutoHub GT-e.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};
