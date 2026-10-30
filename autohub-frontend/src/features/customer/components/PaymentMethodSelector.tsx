import React from 'react';
import { ShieldCheck, Check } from 'lucide-react';

export interface PaymentMethodSelectorProps {
  selectedMethod: 'sepay' | 'cod';
  onSelectMethod: (method: 'sepay' | 'cod') => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  return (
    <section className="rounded-[2px] bg-[#171F33] border border-[#2D3449] p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2D3449]">
        <span className="font-mono text-xs font-bold tracking-[1.5px] text-[#89CEFF] uppercase">
          03 / PHƯƠNG THỨC THANH TOÁN
        </span>
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider text-[#88929B] uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-[#89CEFF]" />
          <span>MÃ HÓA CỔNG AN TOÀN</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Option 1: SEPAY */}
        <label
          onClick={() => onSelectMethod('sepay')}
          className={`block rounded-[2px] border p-5 cursor-pointer transition-all ${
            selectedMethod === 'sepay'
              ? 'bg-[#060E20] border-[#89CEFF] shadow-lg'
              : 'bg-[#060E20]/60 border-[#2D3449] hover:bg-[#060E20] hover:border-[#3E4850]'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-5 h-5 rounded-[2px] border flex items-center justify-center mt-0.5 transition-colors ${
                  selectedMethod === 'sepay'
                    ? 'bg-[#89CEFF] border-[#89CEFF] text-[#060E20]'
                    : 'border-[#3E4850] bg-[#171F33]'
                }`}
              >
                {selectedMethod === 'sepay' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-[#DAE2FD]">Cổng thanh toán tự động SePay (Chuyển khoản QR)</span>
                  <span className="px-2 py-0.5 rounded-[2px] bg-[#0EA5E9]/20 text-[#89CEFF] font-mono text-[9px] font-bold uppercase border border-[#0EA5E9]/30">
                    KHUYÊN DÙNG • XÁC NHẬN TỨC THÌ
                  </span>
                </div>
                <p className="text-xs text-[#BEC8D2] leading-relaxed">
                  Quét mã VietQR tự động khớp giao dịch tức thì qua SePay, xác nhận đơn hàng thành công trong 3 giây không cần nhân viên duyệt.
                </p>
                <p className="text-[11px] text-[#89CEFF]">
                  ✓ Kích hoạt lệnh đóng gói & phân công kỹ thuật viên tự động ngay khi thanh toán.
                </p>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-[2px] bg-[#222A3D] border border-[#2D3449] font-mono text-[10px] font-bold text-[#89CEFF] tracking-wider uppercase shrink-0">
              SEPAY
            </div>
          </div>
        </label>

        {/* Option 2: COD */}
        <label
          onClick={() => onSelectMethod('cod')}
          className={`block rounded-[2px] border p-5 cursor-pointer transition-all ${
            selectedMethod === 'cod'
              ? 'bg-[#060E20] border-[#89CEFF] shadow-lg'
              : 'bg-[#060E20]/60 border-[#2D3449] hover:bg-[#060E20] hover:border-[#3E4850]'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-5 h-5 rounded-[2px] border flex items-center justify-center mt-0.5 transition-colors ${
                  selectedMethod === 'cod'
                    ? 'bg-[#89CEFF] border-[#89CEFF] text-[#060E20]'
                    : 'border-[#3E4850] bg-[#171F33]'
                }`}
              >
                {selectedMethod === 'cod' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-[#DAE2FD]">
                    Thanh toán khi nghiệm thu lắp đặt (COD)
                  </span>
                  <span className="px-2 py-0.5 rounded-[2px] bg-[#222A3D] text-[#88929B] font-mono text-[9px] font-bold uppercase">
                    NỘI THÀNH TP.HCM & HN
                  </span>
                </div>
                <p className="text-xs text-[#BEC8D2] leading-relaxed">
                  Kỹ thuật viên giao thiết bị, khảo sát công suất trạm sạc, gắn hoàn thiện và kích hoạt trên AutoOS rồi mới thu tiền.
                </p>
                <p className="text-[11px] text-[#88929B]">
                  • Chấp nhận quẹt thẻ máy POS di động không phụ phí hoặc tiền mặt có hóa đơn điện tử VAT.
                </p>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-[2px] bg-[#222A3D] border border-[#2D3449] font-mono text-[10px] font-bold text-[#BEC8D2] tracking-wider uppercase shrink-0">
              POS DI ĐỘNG
            </div>
          </div>
        </label>
      </div>
    </section>
  );
};
