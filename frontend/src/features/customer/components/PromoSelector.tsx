import React from 'react';
import { Calculator } from 'lucide-react';

interface PromoSelectorProps {
  isTaxSupportChecked: boolean;
  onToggleTaxSupport: (checked: boolean) => void;
  isCashDiscountChecked: boolean;
  onToggleCashDiscount: (checked: boolean) => void;
  isRescuePackageChecked: boolean;
  onToggleRescuePackage: (checked: boolean) => void;
  onTriggerCalculate?: () => void;
}

export const PromoSelector: React.FC<PromoSelectorProps> = ({
  isTaxSupportChecked,
  onToggleTaxSupport,
  isCashDiscountChecked,
  onToggleCashDiscount,
  isRescuePackageChecked,
  onToggleRescuePackage,
  onTriggerCalculate,
}) => {
  return (
    <div className="p-5 sm:p-6 rounded-lg bg-surface-container border border-surface-highlight shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-primary">
          ƯU ĐÃI & KHUYẾN MẠI ĐẶC QUYỀN
        </span>
        <div className="px-2 py-0.5 rounded-[2px] bg-accent-primary/10 border border-accent-primary/30 text-accent-primary font-mono text-[10px] font-bold tracking-wider">
          AUTOHUB PRIVILEGE
        </div>
      </div>

      {/* Promos List */}
      <div className="space-y-3">
        {/* Promo 1: 50% Tax Support */}
        <label
          className={`flex items-start gap-3 p-3.5 rounded border transition-colors cursor-pointer ${
            isTaxSupportChecked
              ? 'bg-surface-elevated/90 border-accent-primary/50'
              : 'bg-surface-elevated/40 border-surface-highlight hover:border-surface-interactive'
          }`}
        >
          <input
            type="checkbox"
            checked={isTaxSupportChecked}
            onChange={(e) => onToggleTaxSupport(e.target.checked)}
            className="mt-1 w-4 h-4 rounded text-accent-action bg-canvas-deep border-surface-highlight focus:ring-accent-primary shrink-0"
          />
          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-bold text-text-primary">
                Hỗ trợ 50% lệ phí trước bạ từ AutoHub Vietnam
              </span>
              <span className="px-2 py-0.5 rounded-[2px] bg-accent-action/20 border border-accent-primary/30 text-accent-primary font-mono text-[10px] font-bold">
                -50% THUẾ TB
              </span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Trừ trực tiếp vào nghĩa vụ tài chính khi làm thủ tục đăng ký xe tại đại diện cơ quan thuế.
            </p>
          </div>
        </label>

        {/* Promo 2: Cash discount 50M */}
        <label
          className={`flex items-start gap-3 p-3.5 rounded border transition-colors cursor-pointer ${
            isCashDiscountChecked
              ? 'bg-surface-elevated/90 border-accent-primary/50'
              : 'bg-surface-elevated/40 border-surface-highlight hover:border-surface-interactive'
          }`}
        >
          <input
            type="checkbox"
            checked={isCashDiscountChecked}
            onChange={(e) => onToggleCashDiscount(e.target.checked)}
            className="mt-1 w-4 h-4 rounded text-accent-action bg-canvas-deep border-surface-highlight focus:ring-accent-primary shrink-0"
          />
          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-bold text-text-primary">
                Giảm tiền mặt trực tiếp 50.000.000 đ
              </span>
              <span className="px-2 py-0.5 rounded-[2px] bg-accent-action/20 border border-accent-primary/30 text-accent-primary font-mono text-[10px] font-bold">
                -50.000.000 đ
              </span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Chương trình kích cầu đặc quyền khi hoàn tất cọc trực tuyến thông qua cổng thanh toán bảo mật.
            </p>
          </div>
        </label>

        {/* Promo 3: Rescue Package (Free Addon) */}
        <label
          className={`flex items-start gap-3 p-3.5 rounded border transition-colors cursor-pointer ${
            isRescuePackageChecked
              ? 'bg-surface-elevated/90 border-accent-primary/50'
              : 'bg-surface-elevated/40 border-surface-highlight hover:border-surface-interactive'
          }`}
        >
          <input
            type="checkbox"
            checked={isRescuePackageChecked}
            onChange={(e) => onToggleRescuePackage(e.target.checked)}
            className="mt-1 w-4 h-4 rounded text-accent-action bg-canvas-deep border-surface-highlight focus:ring-accent-primary shrink-0"
          />
          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-bold text-text-primary">
                Gói cứu hộ di động AutoHub Mobile Service 24/7 (3 năm)
              </span>
              <span className="px-2 py-0.5 rounded-[2px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                MIỄN PHÍ
              </span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Xe sạc lưu động khẩn cấp, hỗ trợ kỹ thuật tận nhà và vận chuyển cứu hộ toàn quốc không giới hạn.
            </p>
          </div>
        </label>
      </div>

      {/* Button 5: CTA Trigger */}
      <button
        type="button"
        onClick={onTriggerCalculate}
        className="w-full py-3.5 px-4 rounded-lg bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight hover:border-accent-primary/50 text-text-primary hover:text-accent-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow"
      >
        <Calculator className="w-4 h-4 text-accent-primary" />
        <span>Tính toán & Cập nhật chi phí lăn bánh</span>
      </button>
    </div>
  );
};
