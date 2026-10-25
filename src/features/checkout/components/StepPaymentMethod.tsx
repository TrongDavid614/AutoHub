import React from 'react';
import { ShieldCheck, Clock } from 'lucide-react';

export interface StepPaymentMethodProps {
  selectedPaymentMethod: 'vnpay' | 'cod';
  onSelectPaymentMethod: (method: 'vnpay' | 'cod') => void;
  timeLeftFormatted: string;
}

export const StepPaymentMethod: React.FC<StepPaymentMethodProps> = ({
  selectedPaymentMethod,
  onSelectPaymentMethod,
  timeLeftFormatted,
}) => {
  return (
    <section className="rounded-[4px] bg-[#171F33] border border-[#2D3449] p-6 shadow-xl space-y-6">
      {/* Step Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2D3449]">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-[2px] bg-[#0EA5E9]/20 text-[#89CEFF] border border-[#0EA5E9]/30 flex items-center justify-center font-mono text-xs font-bold">
            03
          </span>
          <h2 className="text-lg font-bold text-[#DAE2FD]">Phương thức thanh toán</h2>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#88929B] uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-[#89CEFF]" />
          <span>CỔNG THANH TOÁN BẢO VỆ 100%</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Option 1: VNPAY (Highlighted) */}
        <div
          onClick={() => onSelectPaymentMethod('vnpay')}
          className={`rounded-[2px] border p-5 cursor-pointer transition-all space-y-4 ${
            selectedPaymentMethod === 'vnpay'
              ? 'bg-[#060E20] border-[#89CEFF] shadow-[0_0_20px_rgba(14,165,233,0.15)]'
              : 'bg-[#060E20]/60 border-[#2D3449] hover:bg-[#060E20] hover:border-[#3E4850]'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                  selectedPaymentMethod === 'vnpay'
                    ? 'border-[#89CEFF] bg-[#89CEFF]'
                    : 'border-[#3E4850] bg-[#171F33]'
                }`}
              >
                {selectedPaymentMethod === 'vnpay' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#060E20]" />
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-[#DAE2FD]">
                    Thanh toán qua cổng VNPAY
                  </span>
                  <span className="px-1.5 py-0.5 rounded-[2px] bg-[#0EA5E9] text-[#003751] font-mono text-[9px] font-bold uppercase">
                    KHUYÊN DÙNG
                  </span>
                  <span className="px-1.5 py-0.5 rounded-[2px] bg-[#0EA5E9]/20 text-[#89CEFF] font-mono text-[9px] font-bold uppercase border border-[#0EA5E9]/30">
                    ƯU ĐÃI GIẢM 500.000 Đ
                  </span>
                </div>

                <p className="text-xs text-[#BEC8D2] leading-relaxed">
                  Quét QR VNPAY-QR, Thẻ ATM nội địa (40+ Ngân hàng), Thẻ quốc tế Visa, Mastercard, JCB, Apple Pay.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Badges Tray */}
          <div className="flex items-center gap-2 pl-7 flex-wrap">
            {['VNPAY-QR', 'ATM 40+ BANK', 'VISA', 'Mastercard', 'JCB'].map((badge) => (
              <span
                key={badge}
                className="px-2 py-0.5 rounded-[2px] bg-[#222A3D] border border-[#2D3449] font-mono text-[9px] font-bold text-[#BEC8D2]"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Expandable VNPay Benefit Ribbon */}
          <div className="ml-7 p-3 rounded-[2px] bg-[#0EA5E9]/15 border border-[#0EA5E9]/30 text-xs text-[#DAE2FD] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#89CEFF] animate-pulse shrink-0" />
            <p className="leading-relaxed">
              <strong className="text-[#89CEFF]">Ưu đãi thanh toán: </strong>
              Tự động áp dụng chiết khấu voucher <strong className="font-mono text-[#89CEFF]">VNPAYAUTOHUB</strong> giảm thêm <strong className="font-mono text-[#89CEFF]">500.000 đ</strong> khi quét QR thành công.
            </p>
          </div>
        </div>

        {/* Option 2: COD */}
        <div
          onClick={() => onSelectPaymentMethod('cod')}
          className={`rounded-[2px] border p-5 cursor-pointer transition-all ${
            selectedPaymentMethod === 'cod'
              ? 'bg-[#060E20] border-[#89CEFF] shadow-lg'
              : 'bg-[#060E20]/60 border-[#2D3449] hover:bg-[#060E20] hover:border-[#3E4850]'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                selectedPaymentMethod === 'cod'
                  ? 'border-[#89CEFF] bg-[#89CEFF]'
                  : 'border-[#3E4850] bg-[#171F33]'
              }`}
            >
              {selectedPaymentMethod === 'cod' && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#060E20]" />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#DAE2FD]">
                  Thanh toán khi nhận hàng (COD)
                </span>
                <span className="px-1.5 py-0.5 rounded-[2px] bg-[#222A3D] text-[#88929B] font-mono text-[9px] font-bold uppercase">
                  THU HỘ
                </span>
              </div>
              <p className="text-xs text-[#BEC8D2] leading-relaxed">
                Áp dụng cho đơn hàng phụ kiện xe điện dưới 50.000.000 đ. Kiểm tra niêm phong, kiểm đếm linh kiện nguyên vẹn trước khi thanh toán tiền mặt.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Notice Callout with Live Countdown */}
      <div className="rounded-[2px] bg-[#060E20] border border-[#2D3449] p-4 flex items-start gap-3">
        <Clock className="w-4 h-4 text-[#89CEFF] shrink-0 mt-0.5" />
        <div className="text-xs text-[#88929B] leading-relaxed">
          <strong className="text-[#DAE2FD]">Lưu ý quan trọng: </strong>
          Đơn hàng thanh toán VNPay sẽ có thời hạn giữ kho độc quyền{' '}
          <span className="font-mono text-[#89CEFF] font-bold text-sm px-1.5 py-0.5 rounded bg-[#222A3D]">
            {timeLeftFormatted}
          </span>{' '}
          phút. Quý khách vui lòng chuẩn bị sẵn ứng dụng ngân hàng hoặc thẻ thanh toán để xác thực giao dịch nhanh chóng và an toàn.
        </div>
      </div>
    </section>
  );
};
