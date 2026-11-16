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
    <div className="p-5 rounded-xl bg-[#131B2E] border border-cyan-500/30 shadow-lg text-[#DAE2FD] space-y-4 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#3E4850]/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#222A3D] text-[#89CEFF] flex items-center justify-center border border-[#3E4850]/60 shadow-sm">
            <Calculator className="w-4 h-4 text-[#89CEFF]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">{data.tenPhienBan}</h4>
            <p className="text-xs text-[#88929B]">
              Dự toán chi phí lăn bánh thực tế tại{' '}
              <span className="text-[#89CEFF] font-semibold">{data.tinhThanh}</span>
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#222A3D] text-[#89CEFF] border border-cyan-500/30">
          ƯU ĐÃI THÁNG
        </span>
      </div>

      {/* Chi tiết từng khoản phí */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center py-1 border-b border-[#3E4850]/30">
          <span className="text-[#BEC8D2]">Giá niêm yết (VAT):</span>
          <span className="font-mono font-medium text-white">{formatCurrencyVND(data.giaNiemYet)}</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-[#3E4850]/30">
          <span className="text-[#BEC8D2]">
            Lệ phí trước bạ ({data.tyLePhiTruocBa}%):
          </span>
          <span className="font-mono font-medium text-emerald-400">
            {data.phiTruocBa === 0
              ? '0 VNĐ (Ưu đãi 100% xe điện)'
              : formatCurrencyVND(data.phiTruocBa)}
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-[#3E4850]/30">
          <span className="text-[#BEC8D2]">Phí cấp biển số:</span>
          <span className="font-mono font-medium text-white">
            {formatCurrencyVND(data.phiCapBienSo)}
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-[#3E4850]/30">
          <span className="text-[#BEC8D2]">Phí đăng kiểm cơ giới:</span>
          <span className="font-mono font-medium text-white">
            {formatCurrencyVND(data.phiDangKiem)}
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-[#3E4850]/30">
          <span className="text-[#BEC8D2]">Phí bảo trì đường bộ (1 năm):</span>
          <span className="font-mono font-medium text-white">
            {formatCurrencyVND(data.phiBaoTriDuongBo)}
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-[#3E4850]/30">
          <span className="text-[#BEC8D2]">Bảo hiểm TNDS bắt buộc:</span>
          <span className="font-mono font-medium text-white">
            {formatCurrencyVND(data.phiBaoHiemTNDS)}
          </span>
        </div>
      </div>

      {/* Tổng lăn bánh */}
      <div className="p-3.5 rounded-lg bg-[#0B1326] border border-cyan-500/40 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#88929B] font-medium">
            Tổng chi phí lăn bánh dự kiến
          </span>
          <div className="text-lg font-bold font-mono text-[#89CEFF]">
            {formatCurrencyVND(data.tongChiPhiLanBanh)}
          </div>
        </div>

        <button
          type="button"
          onClick={handleDeposit}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
        >
          <span>Khóa giá & Cọc 72h</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Ghi chú chính sách */}
      {data.ghiChuChinhSach && (
        <div className="flex items-start gap-2 pt-1 text-[11px] text-[#88929B]">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>{data.ghiChuChinhSach}</span>
        </div>
      )}
    </div>
  );
};
