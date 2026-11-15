import React from 'react';
import { CheckCircle, Zap, ShieldCheck, ArrowRight, QrCode, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { SepayPaymentInfo } from '@/types/cart.types';

export interface OrderSuccessModalProps {
  isOpen: boolean;
  orderId: string;
  totalPayable: number;
  recipientName: string;
  sepayData?: SepayPaymentInfo;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  orderId,
  totalPayable,
  recipientName,
  sepayData,
  onClose,
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyContent = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060E20]/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg rounded-[4px] bg-[#131B2E] border border-[#89CEFF]/60 p-6 md:p-8 shadow-2xl text-center space-y-5 relative overflow-hidden my-8">
        {/* Glow */}
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#0EA5E9]/20 blur-[60px]" />

        <div className="w-14 h-14 rounded-full bg-[#0EA5E9]/20 border border-[#89CEFF] flex items-center justify-center mx-auto text-[#89CEFF] shadow-lg">
          <CheckCircle className="w-7 h-7 text-[#89CEFF]" />
        </div>

        <div className="space-y-1.5">
          <div className="inline-block px-3 py-1 rounded-[2px] bg-[#222A3D] text-[#89CEFF] font-mono text-xs font-bold uppercase tracking-wider">
            ĐẶT HÀNG THÀNH CÔNG • MÃ ĐƠN: #{orderId}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-[#DAE2FD]">
            Cảm ơn quý khách, {recipientName}!
          </h3>
          <p className="text-xs text-[#BEC8D2] leading-relaxed max-w-md mx-auto">
            Đơn hàng phụ kiện đã được lưu trữ thành công trên hệ thống máy chủ AutoHub và sẵn sàng điều chuyển xuất kho.
          </p>
        </div>

        {/* SePay QR Code Payment Block if SEPAY */}
        {sepayData && (
          <div className="p-4 rounded-[2px] bg-[#060E20] border border-[#0EA5E9]/40 space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-[#2D3449] pb-2">
              <div className="flex items-center gap-1.5 text-[#89CEFF] font-mono text-xs font-bold">
                <QrCode className="w-4 h-4" />
                <span>QUÉT MÃ VIETQR THANH TOÁN (SEPAY)</span>
              </div>
              <span className="text-[10px] font-mono text-[#34D399] font-bold">TỰ ĐỘNG XÁC NHẬN</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
              <div className="p-2 bg-white rounded-[2px] shrink-0 shadow-md">
                <img
                  src={sepayData.qrUrl}
                  alt={`VietQR SePay ${sepayData.transferContent}`}
                  className="w-32 h-32 object-contain"
                />
              </div>

              <div className="space-y-1.5 text-xs flex-1">
                <div className="flex justify-between text-[#88929B]">
                  <span>Ngân hàng:</span>
                  <span className="font-mono text-[#DAE2FD] font-bold">{sepayData.bankBrandName}</span>
                </div>
                <div className="flex justify-between text-[#88929B]">
                  <span>Số tài khoản:</span>
                  <span className="font-mono text-[#DAE2FD] font-bold">{sepayData.accountNumber}</span>
                </div>
                <div className="flex justify-between text-[#88929B]">
                  <span>Số tiền:</span>
                  <span className="font-mono text-[#89CEFF] font-bold">
                    {sepayData.transferAmount.toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="pt-1">
                  <div className="text-[10px] text-[#88929B] font-mono">NỘI DUNG CHUYỂN KHOẢN:</div>
                  <div className="flex items-center justify-between bg-[#171F33] p-1.5 rounded-[2px] mt-0.5 border border-[#2D3449]">
                    <span className="font-mono text-xs font-bold text-[#34D399]">
                      {sepayData.transferContent}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyContent(sepayData.transferContent)}
                      className="text-[#89CEFF] hover:text-white transition-colors cursor-pointer p-0.5"
                      title="Sao chép nội dung"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-[2px] bg-[#060E20] border border-[#2D3449] p-3 flex items-center justify-between text-xs font-mono">
          <span className="text-[#88929B]">TỔNG GIÁ TRỊ ĐƠN HÀNG:</span>
          <span className="text-lg font-bold text-[#89CEFF]">
            {totalPayable.toLocaleString('vi-VN')} đ
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="p-3 rounded-[2px] bg-[#171F33] border border-[#2D3449] space-y-1">
            <div className="flex items-center gap-1.5 text-[#89CEFF] font-bold text-[11px]">
              <Zap className="w-3.5 h-3.5" />
              <span>LẮP ĐẶT 24H</span>
            </div>
            <p className="text-[10px] text-[#88929B]">Kỹ sư liên hệ trước 30 phút theo lịch hẹn.</p>
          </div>
          <div className="p-3 rounded-[2px] bg-[#171F33] border border-[#2D3449] space-y-1">
            <div className="flex items-center gap-1.5 text-[#89CEFF] font-bold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>BẢO HÀNH CHÍNH HÃNG</span>
            </div>
            <p className="text-[10px] text-[#88929B]">Bảo hành 24-36 tháng tiêu chuẩn OEM.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/accessories');
            }}
            className="flex-1 py-3 px-4 rounded-[2px] bg-[#222A3D] hover:bg-[#2D3449] text-[#DAE2FD] text-xs font-semibold cursor-pointer transition-colors"
          >
            Tiếp tục mua sắm
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/customer/orders');
            }}
            className="flex-1 py-3 px-4 rounded-[2px] bg-[#0EA5E9] hover:bg-[#89CEFF] text-[#003751] font-bold text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-all"
          >
            <span>Quản lý đơn hàng</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
