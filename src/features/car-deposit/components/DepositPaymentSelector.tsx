import React from 'react';
import { QrCode, CreditCard, Lock, ArrowRight } from 'lucide-react';

interface DepositPaymentSelectorProps {
  paymentMethod: 'VNPAY_QR' | 'ATM_CARD';
  setPaymentMethod: (method: 'VNPAY_QR' | 'ATM_CARD') => void;
  agreed: boolean;
  setAgreed: (agreed: boolean) => void;
  isProcessing: boolean;
  onCancel?: () => void;
}

export const DepositPaymentSelector: React.FC<DepositPaymentSelectorProps> = ({
  paymentMethod,
  setPaymentMethod,
  agreed,
  setAgreed,
  isProcessing,
  onCancel,
}) => {
  return (
    <div className="space-y-4">
      {/* Payment Method Selector */}
      <div className="space-y-2 pt-1">
        <span className="text-[10px] font-mono font-bold text-[#DAE2FD] uppercase tracking-wider">
          CỔNG THANH TOÁN BẢO MẬT (VNPAY HMAC-SHA512)
        </span>

        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => setPaymentMethod('VNPAY_QR')}
            className={`p-3 rounded border cursor-pointer transition-all flex items-center gap-2.5 ${
              paymentMethod === 'VNPAY_QR'
                ? 'bg-[#222A3D] border-[#0EA5E9] shadow-[0_0_12px_rgba(14,165,233,0.2)]'
                : 'bg-[#171F33] border-[#3E4850]/40'
            }`}
          >
            <QrCode className="w-5 h-5 text-[#89CEFF]" />
            <div>
              <div className="font-bold text-[#DAE2FD]">VNPay-QR Siêu Tốc</div>
              <div className="text-[10px] text-[#BEC8D2]">Quét mã tức thì</div>
            </div>
          </div>

          <div
            onClick={() => setPaymentMethod('ATM_CARD')}
            className={`p-3 rounded border cursor-pointer transition-all flex items-center gap-2.5 ${
              paymentMethod === 'ATM_CARD'
                ? 'bg-[#222A3D] border-[#0EA5E9] shadow-[0_0_12px_rgba(14,165,233,0.2)]'
                : 'bg-[#171F33] border-[#3E4850]/40'
            }`}
          >
            <CreditCard className="w-5 h-5 text-[#89CEFF]" />
            <div>
              <div className="font-bold text-[#DAE2FD]">Thẻ ATM / Quốc tế</div>
              <div className="text-[10px] text-[#BEC8D2]">Visa, Mastercard, JCB</div>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Agreement */}
      <div className="p-3 rounded bg-[#171F33] border border-[#3E4850]/40 flex items-start gap-2.5 text-xs">
        <input
          type="checkbox"
          id="depositTermsAgreement"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 w-3.5 h-3.5 rounded border-[#3E4850] bg-[#222A3D] text-[#0EA5E9]"
        />
        <label htmlFor="depositTermsAgreement" className="text-[#BEC8D2] leading-relaxed cursor-pointer">
          Tôi xác nhận thông tin chính xác và đồng ý với{' '}
          <span className="text-[#89CEFF] font-semibold">
            Quy chế đặt cọc và chính sách hoàn tiền 100% trong 72 giờ
          </span>{' '}
          của AutoHub Việt Nam.
        </label>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-[#3E4850]/40">
        <div className="text-[11px] text-[#BEC8D2] flex items-center gap-1">
          <Lock className="w-3.5 h-3.5 text-[#0EA5E9]" />
          <span>Bảo mật SSL 256-bit</span>
        </div>

        <div className="flex items-center gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded border border-[#3E4850]/60 text-xs font-semibold text-[#BEC8D2] hover:text-[#DAE2FD] hover:bg-[#222A3D] transition-colors"
            >
              Hủy bỏ
            </button>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="flex items-center gap-2 px-5 py-2.5 rounded bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold shadow-[0_0_20px_rgba(14,165,233,0.4)] disabled:opacity-50 transition-all cursor-pointer"
          >
            {isProcessing ? (
              <span>Đang kết nối cổng VNPay...</span>
            ) : (
              <>
                <span>Tiến hành thanh toán VNPay 20.000.000 đ</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
