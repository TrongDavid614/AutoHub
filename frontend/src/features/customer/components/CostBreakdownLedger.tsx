import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Calendar,
  Gift,
  ShieldCheck,
  FileCheck,
  Percent,
} from 'lucide-react';
import type { TrimOption, CityOption, CostBreakdown } from '@/features/customer/types/estimator.types';

interface CostBreakdownLedgerProps {
  selectedTrim: TrimOption;
  selectedCity: CityOption;
  breakdown: CostBreakdown;
  onOpenDepositModal: () => void;
}

export const CostBreakdownLedger: React.FC<CostBreakdownLedgerProps> = ({
  selectedTrim,
  selectedCity,
  breakdown,
  onOpenDepositModal,
}) => {
  const navigate = useNavigate();

  const formatCurrency = (val: number) => `${val.toLocaleString('vi-VN')} đ`;

  const taxSavedMillions = (breakdown.taxSaved / 1000000).toFixed(1);

  return (
    <div className="space-y-4">
      {/* 1. Car Visual & Designation Header */}
      <div className="rounded-lg bg-surface-container border border-surface-highlight overflow-hidden shadow-lg relative">
        <div className="relative aspect-video w-full bg-canvas-deep flex items-center justify-center overflow-hidden">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/87dca2c869ce8aeb0822dca506e4f3bd186b3ffa?width=913"
            alt={`AutoHub GT-e ${selectedTrim.name}`}
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
          />

          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/30 to-transparent" />

          {/* Floating Pill Badges on Visual */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-[2px] bg-canvas-deep/80 backdrop-blur-md border border-accent-primary/40 text-[10px] font-mono font-bold text-accent-primary">
              AUTOHUB GT-e STUDIO
            </span>
            <span className="px-2 py-0.5 rounded-[2px] bg-canvas-deep/80 backdrop-blur-md border border-surface-highlight text-[10px] font-mono text-text-muted">
              VIN 2025
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div className="space-y-0.5">
              <div className="text-lg font-bold text-text-primary tracking-tight">
                AutoHub GT-e {selectedTrim.name}
              </div>
              <div className="text-xs font-mono text-accent-primary flex items-center gap-1.5">
                <span>Khu vực đăng ký:</span>
                <span className="font-semibold text-text-primary">{selectedCity.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Detailed Itemized Ledger */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-surface-highlight/60">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-primary">
              BẢNG KÊ CÁC KHOẢN CHI PHÍ HOÀN TẤT THỦ TỤC
            </span>
          </div>

          <div className="space-y-3">
            {/* Row 1: Giá niêm yết */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-text-primary">Giá niêm yết (Đã gồm VAT & Pin)</span>
              <span className="font-mono font-bold text-text-primary">
                {formatCurrency(breakdown.listPrice)}
              </span>
            </div>

            {/* Row 2: Khuyến mại tiền mặt đặt cọc online */}
            {breakdown.cashDiscount > 0 && (
              <div className="flex items-center justify-between p-2 rounded bg-accent-primary/10 border border-accent-primary/20 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-accent-primary font-medium">
                  <Gift className="w-4 h-4 shrink-0" />
                  <span>Khuyến mại tiền mặt đặt cọc online</span>
                </div>
                <span className="font-mono font-bold text-accent-primary">
                  -{formatCurrency(breakdown.cashDiscount)}
                </span>
              </div>
            )}

            {/* Row 3: Lệ phí trước bạ */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-text-primary">
                  Lệ phí trước bạ {breakdown.taxSaved > 0 ? '(Sau hỗ trợ 50%)' : ''}
                </span>
                <span className="font-mono font-bold text-text-primary">
                  {formatCurrency(breakdown.finalRegistrationTax)}
                </span>
              </div>
              {breakdown.taxSaved > 0 && (
                <div className="flex items-center justify-between text-[11px] text-text-muted">
                  <span>
                    Được miễn giảm 50% từ mức {formatCurrency(breakdown.rawRegistrationTax)} ({(breakdown.taxRate * 100)}%)
                  </span>
                  <span className="font-mono text-accent-primary font-bold">
                    Tiết kiệm {taxSavedMillions}tr
                  </span>
                </div>
              )}
            </div>

            {/* Row 4: Phí cấp biển số */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-text-primary">Phí cấp biển số {selectedCity.name}</span>
              <span className="font-mono font-bold text-text-primary">
                {formatCurrency(breakdown.plateFee)}
              </span>
            </div>

            {/* Row 5: Phí đăng kiểm & Bảo trì đường bộ */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-text-primary">Phí đăng kiểm & Bảo trì đường bộ</span>
                <span className="font-mono font-bold text-text-primary">
                  {formatCurrency(breakdown.inspectionFee)}
                </span>
              </div>
              <div className="text-[11px] text-text-muted">
                Kỳ hạn nộp 30 tháng cho phương tiện đăng ký mới lần đầu
              </div>
            </div>

            {/* Row 6: Bảo hiểm TNDS bắt buộc */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-text-primary">Bảo hiểm TNDS bắt buộc (1 năm)</span>
              <span className="font-mono font-bold text-text-primary">
                {formatCurrency(breakdown.insuranceFee)}
              </span>
            </div>
          </div>

          {/* 3. Final Total Highlight HUD Card */}
          <div className="mt-4 p-5 rounded-lg bg-surface-elevated border border-accent-primary/40 space-y-3 relative overflow-hidden shadow-inner">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-primary to-transparent" />

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent-primary">
                TỔNG CHI PHÍ LĂN BÁNH TẠM TÍNH
              </span>
              <span className="px-2 py-0.5 rounded-[2px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                CHÍNH XÁC 100%
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black font-mono text-text-primary tracking-tight">
                {breakdown.totalRolloutCost.toLocaleString('vi-VN')}
              </span>
              <span className="text-sm font-mono font-bold text-accent-primary">VNĐ</span>
            </div>

            <p className="text-[11px] text-text-muted leading-relaxed">
              Giá đã bao gồm toàn bộ thuế VAT, Pin công nghệ cao thế hệ mới và trọn gói phí dịch vụ thủ tục lưu hành hợp pháp.
            </p>
          </div>

          {/* 4. Conversion Action Dual Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={onOpenDepositModal}
              className="w-full py-3.5 px-5 rounded-lg bg-accent-action hover:bg-accent-primary text-accent-contrast font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(14,165,233,0.35)] hover:shadow-[0_0_35px_rgba(137,206,255,0.5)] transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <CreditCard className="w-4 h-4 text-accent-contrast" />
              <span>Đặt cọc giữ xe 72h</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/test-drive')}
              className="w-full py-3 px-5 rounded-lg bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight hover:border-accent-primary/40 text-text-primary hover:text-accent-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-accent-primary" />
              <span>Đăng ký lái thử</span>
            </button>
          </div>

          {/* 5. Transparency & Financial Guarantees */}
          <div className="pt-3 border-t border-surface-highlight/50 space-y-2.5">
            <div className="flex items-start gap-2.5 text-xs text-text-muted leading-snug">
              <ShieldCheck className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
              <span>Cam kết không phát sinh bất kỳ phụ phí nào tại đại lý showroom toàn quốc.</span>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-text-muted leading-snug">
              <FileCheck className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
              <span>Hỗ trợ nhân viên giao nhận hồ sơ, bấm biển số tận nhà nhanh chóng trong ngày.</span>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-text-muted leading-snug">
              <Percent className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
              <span>Hỗ trợ gói vay ngân hàng liên kết đối tác: Lãi suất cố định chỉ 5.9%/năm.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
