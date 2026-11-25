import React from 'react';
import { Calculator, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { RolloutFeeData } from '@/types/ai.types';
import { formatCurrencyVND } from '@/lib/utils';

export interface RolloutFeeCardProps {
  data: RolloutFeeData;
}

export const RolloutFeeCard: React.FC<RolloutFeeCardProps> = ({ data }) => {
  const navigate = useNavigate();

  const handleDeposit = () => {
    navigate('/customer/deposit-records');
  };

  return (
    <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] space-y-4 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--text)]">{data.tenPhienBan}</h4>
            <p className="text-xs text-[var(--text-muted)]">
              Dự toán chi phí lăn bánh thực tế tại{' '}
              <span className="text-[var(--accent)] font-medium">{data.tinhThanh}</span>
            </p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-[var(--accent-soft)] text-[var(--accent)]">
          Ưu đãi tháng
        </span>
      </div>

      {/* Chi tiết từng khoản phí */}
      <div className="space-y-1 text-xs">
        <div className="flex justify-between items-center py-1.5 border-b border-[var(--line)]">
          <span className="text-[var(--text-2)]">Giá niêm yết (VAT):</span>
          <span className="font-medium tabular-nums text-[var(--text)]">{formatCurrencyVND(data.giaNiemYet)}</span>
        </div>

        <div className="flex justify-between items-center py-1.5 border-b border-[var(--line)]">
          <span className="text-[var(--text-2)]">
            Lệ phí trước bạ ({data.tyLePhiTruocBa}%):
          </span>
          <span className="font-medium tabular-nums text-emerald-700">
            {data.phiTruocBa === 0
              ? '0 VNĐ (Ưu đãi 100% xe điện)'
              : formatCurrencyVND(data.phiTruocBa)}
          </span>
        </div>

        <div className="flex justify-between items-center py-1.5 border-b border-[var(--line)]">
          <span className="text-[var(--text-2)]">Phí cấp biển số:</span>
          <span className="font-medium tabular-nums text-[var(--text)]">
            {formatCurrencyVND(data.phiCapBienSo)}
          </span>
        </div>

        <div className="flex justify-between items-center py-1.5 border-b border-[var(--line)]">
          <span className="text-[var(--text-2)]">Phí đăng kiểm cơ giới:</span>
          <span className="font-medium tabular-nums text-[var(--text)]">
            {formatCurrencyVND(data.phiDangKiem)}
          </span>
        </div>

        <div className="flex justify-between items-center py-1.5 border-b border-[var(--line)]">
          <span className="text-[var(--text-2)]">Phí bảo trì đường bộ (1 năm):</span>
          <span className="font-medium tabular-nums text-[var(--text)]">
            {formatCurrencyVND(data.phiBaoTriDuongBo)}
          </span>
        </div>

        <div className="flex justify-between items-center py-1.5 border-b border-[var(--line)]">
          <span className="text-[var(--text-2)]">Bảo hiểm TNDS bắt buộc:</span>
          <span className="font-medium tabular-nums text-[var(--text)]">
            {formatCurrencyVND(data.phiBaoHiemTNDS)}
          </span>
        </div>
      </div>

      {/* Tổng lăn bánh */}
      <div className="p-3.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-medium text-[var(--text-muted)]">
            Tổng chi phí lăn bánh dự kiến
          </span>
          <div className="text-lg font-bold tabular-nums text-[var(--accent)]">
            {formatCurrencyVND(data.tongChiPhiLanBanh)}
          </div>
        </div>

        <button
          type="button"
          onClick={handleDeposit}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          <span>Khóa giá & Cọc 72h</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Ghi chú chính sách */}
      {data.ghiChuChinhSach && (
        <div className="flex items-start gap-2 pt-1 text-xs text-[var(--text-2)]">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <span>{data.ghiChuChinhSach}</span>
        </div>
      )}
    </div>
  );
};
