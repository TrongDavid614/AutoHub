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
import type { MockCar } from '@/types/car.types';

interface CostBreakdownLedgerProps {
  selectedTrim: TrimOption;
  selectedCity: CityOption;
  breakdown: CostBreakdown;
  onOpenDepositModal: () => void;
  currentCar?: MockCar | null;
}

export const CostBreakdownLedger: React.FC<CostBreakdownLedgerProps> = ({
  selectedTrim,
  selectedCity,
  breakdown,
  onOpenDepositModal,
  currentCar,
}) => {
  const navigate = useNavigate();

  const formatCurrency = (val: number) => `${val.toLocaleString('vi-VN')} đ`;

  const taxSavedMillions = (breakdown.taxSaved / 1000000).toFixed(1);

  const carImageUrl = currentCar?.image || selectedTrim.imageUrl || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200';
  const displayTitle = selectedTrim.name;

  return (
    <div className="space-y-4">
      {/* 1. Car Visual & Designation Header */}
      <div className="rounded-xl bg-[var(--surface)] border border-[var(--line)] overflow-hidden">
        <div className="relative aspect-video w-full bg-[var(--surface-subtle)] flex items-center justify-center overflow-hidden border-b border-[var(--line)]">
          <img
            src={carImageUrl}
            alt={displayTitle}
            className="w-full h-full object-cover object-center"
          />

          {/* Floating Pill Badges on Visual */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-white/95 border border-[var(--line)] text-xs font-semibold text-[var(--accent)] shadow-sm">
              {currentCar?.name || displayTitle} Studio
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white/95 border border-[var(--line)] text-xs font-medium text-[var(--text-2)] tabular-nums shadow-sm">
              VIN 2025
            </span>
          </div>
        </div>

        <div className="px-5 pt-4 pb-2 border-b border-[var(--line)] bg-[var(--surface-subtle)] flex items-center justify-between gap-2">
          <div className="text-base font-bold text-[var(--text)] tracking-tight">
            {displayTitle}
          </div>
          <div className="text-xs text-[var(--text-2)] flex items-center gap-1">
            <span>Khu vực:</span>
            <span className="font-semibold text-[var(--accent)]">{selectedCity.name}</span>
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
                  Lệ phí trước bạ {breakdown.finalRegistrationTax === 0 ? '(Ưu đãi 0% Xe điện)' : breakdown.taxSaved > 0 ? '(Sau hỗ trợ 50%)' : ''}
                </span>
                <span className="font-mono font-bold text-text-primary">
                  {formatCurrency(breakdown.finalRegistrationTax)}
                </span>
              </div>
              {breakdown.taxSaved > 0 && (
                <div className="flex items-center justify-between text-[11px] text-text-muted">
                  <span>
                    {breakdown.finalRegistrationTax === 0
                      ? 'Miễn 100% lệ phí trước bạ cho ô tô điện (Nghị định 10/2022/NĐ-CP)'
                      : `Được miễn giảm 50% từ mức ${formatCurrency(breakdown.rawRegistrationTax)} (${(breakdown.taxRate * 100)}%)`}
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

          {/* 3. Final Total Summary Card */}
          <div className="mt-4 p-5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] space-y-2.5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--accent)]" />

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-[var(--accent)]">
                Tổng chi phí lăn bánh tạm tính
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                Chính xác 100%
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tabular-nums text-[var(--text)] tracking-tight">
                {breakdown.totalRolloutCost.toLocaleString('vi-VN')}
              </span>
              <span className="text-sm font-bold text-[var(--accent)]">VNĐ</span>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Giá đã bao gồm toàn bộ thuế VAT, Pin công nghệ cao thế hệ mới và trọn gói phí dịch vụ thủ tục lưu hành hợp pháp.
            </p>
          </div>

          {/* 4. Conversion Action Dual Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={onOpenDepositModal}
              className="w-full py-3.5 px-5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Đặt cọc giữ xe 72h</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(currentCar?.id ? `/test-drive?carId=${currentCar.id}` : '/test-drive')}
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
