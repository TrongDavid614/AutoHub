import React from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface CheckoutSuccessModalProps {
  isOpen: boolean;
  orderCode: string;
  grandTotal: number;
  recipientName: string;
  paymentMethod: 'sepay' | 'cod';
  onClose: () => void;
}

export const CheckoutSuccessModal: React.FC<CheckoutSuccessModalProps> = ({
  isOpen,
  orderCode,
  grandTotal,
  recipientName,
  paymentMethod,
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
          <CheckCircle2 className="w-8 h-8 text-[#89CEFF]" />
        </div>

        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-[2px] bg-[#222A3D] text-[#89CEFF] font-mono text-xs font-bold uppercase tracking-wider">
            {paymentMethod === 'sepay' ? 'GIAO DỊCH SEPAY THÀNH CÔNG' : 'ĐẶT HÀNG COD THÀNH CÔNG'} • #{orderCode}
          </div>
          <h3 className="text-2xl font-bold text-[#DAE2FD]">
            Cảm ơn quý khách, {recipientName}!
          </h3>
          <p className="text-xs text-[#BEC8D2] leading-relaxed max-w-md mx-auto">
            Đơn hàng phụ kiện xe điện của bạn đã được tiếp nhận. Đội ngũ kỹ thuật viên AutoHub Logistics đang chuẩn bị thùng hàng niêm phong chuyên dụng và lên lịch bàn giao.
          </p>
        </div>

        <div className="rounded-[2px] bg-[#060E20] border border-[#2D3449] p-4 flex items-center justify-between text-xs font-mono">
          <span className="text-[#88929B]">TỔNG THANH TOÁN:</span>
          <span className="text-lg font-bold text-[#89CEFF]">
            {grandTotal.toLocaleString('vi-VN')} đ
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="p-3 rounded-[2px] bg-[#171F33] border border-[#2D3449] space-y-1">
            <div className="flex items-center gap-1.5 text-[#89CEFF] font-bold text-[11px]">
              <Zap className="w-3.5 h-3.5" />
              <span>GIAO TIÊU CHUẨN</span>
            </div>
            <p className="text-[10px] text-[#88929B]">Bàn giao ngày mai, kiểm tra niêm phong.</p>
          </div>
          <div className="p-3 rounded-[2px] bg-[#171F33] border border-[#2D3449] space-y-1">
            <div className="flex items-center gap-1.5 text-[#89CEFF] font-bold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>BẢO HIỂM 100%</span>
            </div>
            <p className="text-[10px] text-[#88929B]">Bảo hiểm an toàn pin cao áp 800V.</p>
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
            Về Showroom Phụ Kiện
          </button>
          <button
            onClick={() => {
              onClose();
              navigate('/customer/orders');
            }}
            className="flex-1 py-3 px-4 rounded-[2px] bg-[#0EA5E9] hover:bg-[#89CEFF] text-[#003751] font-bold text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-all"
          >
            <span>Quản Lý Đơn Hàng</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
