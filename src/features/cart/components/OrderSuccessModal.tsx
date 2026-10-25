import React from 'react';
import { CheckCircle, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface OrderSuccessModalProps {
  isOpen: boolean;
  orderId: string;
  totalPayable: number;
  recipientName: string;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  orderId,
  totalPayable,
  recipientName,
  onClose,
}) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060E20]/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-[4px] bg-[#131B2E] border border-[#89CEFF]/60 p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#0EA5E9]/20 blur-[60px]" />

        <div className="w-16 h-16 rounded-full bg-[#0EA5E9]/20 border border-[#89CEFF] flex items-center justify-center mx-auto text-[#89CEFF] shadow-lg">
          <CheckCircle className="w-8 h-8 text-[#89CEFF]" />
        </div>

        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-[2px] bg-[#222A3D] text-[#89CEFF] font-mono text-xs font-bold uppercase tracking-wider">
            ĐẶT HÀNG THÀNH CÔNG • MÃ ĐƠN: #{orderId}
          </div>
          <h3 className="text-2xl font-bold text-[#DAE2FD]">
            Cảm ơn quý khách, {recipientName}!
          </h3>
          <p className="text-xs text-[#BEC8D2] leading-relaxed max-w-md mx-auto">
            Hệ thống AutoHub đã ghi nhận đơn hàng và kích hoạt lệnh điều động kỹ thuật viên Mobile Service chuẩn bị trạm sạc & khảo sát hạ tầng điện 3 pha cho bạn trong 24 giờ.
          </p>
        </div>

        <div className="rounded-[2px] bg-[#060E20] border border-[#2D3449] p-4 flex items-center justify-between text-xs font-mono">
          <span className="text-[#88929B]">TỔNG GIÁ TRỊ THANH TOÁN:</span>
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
              <span>BẢO HÀNH 3 NĂM</span>
            </div>
            <p className="text-[10px] text-[#88929B]">Đổi mới linh kiện chính hãng 1:1.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              onClose();
              navigate('/accessories');
            }}
            className="flex-1 py-3 px-4 rounded-[2px] bg-[#222A3D] hover:bg-[#2D3449] text-[#DAE2FD] text-xs font-semibold cursor-pointer transition-colors"
          >
            Tiếp tục mua sắm
          </button>
          <button
            onClick={() => {
              onClose();
              navigate('/customer/orders');
            }}
            className="flex-1 py-3 px-4 rounded-[2px] bg-[#0EA5E9] hover:bg-[#89CEFF] text-[#003751] font-bold text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-all"
          >
            <span>Xem đơn hàng</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
