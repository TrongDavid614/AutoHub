import React from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface RegisterSuccessModalProps {
  isOpen: boolean;
  fullName: string;
  email: string;
  onClose: () => void;
}

export const RegisterSuccessModal: React.FC<RegisterSuccessModalProps> = ({
  isOpen,
  fullName,
  email,
  onClose,
}) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060E20]/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-[4px] bg-[#131B2E] border border-[#89CEFF]/60 p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#0EA5E9]/20 blur-[60px]" />

        <div className="w-16 h-16 rounded-full bg-[#0EA5E9]/20 border border-[#89CEFF] flex items-center justify-center mx-auto text-[#89CEFF] shadow-lg">
          <CheckCircle2 className="w-8 h-8 text-[#89CEFF]" />
        </div>

        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-[2px] bg-[#222A3D] text-[#89CEFF] font-mono text-xs font-bold uppercase tracking-wider">
            KÍCH HOẠT THÀNH CÔNG • GT-E PRIVILEGE
          </div>
          <h3 className="text-2xl font-bold text-[#DAE2FD]">
            Chào mừng {fullName}!
          </h3>
          <p className="text-xs text-[#BEC8D2] leading-relaxed">
            Tài khoản định danh số <strong className="text-[#89CEFF]">{email}</strong> của bạn đã được kích hoạt thành công trên hệ thống AutoHub Platform.
          </p>
        </div>

        <div className="p-4 rounded-[2px] bg-[#060E20] border border-[#2D3449] space-y-2 text-left text-xs">
          <div className="flex items-center gap-2 text-[#89CEFF] font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>ĐẶC QUYỀN THÀNH VIÊN ĐÃ MỞ:</span>
          </div>
          <ul className="space-y-1 text-[#88929B] text-[11px] list-disc list-inside">
            <li>Ưu tiên xếp lịch lái thử xe điện cao cấp tại Showroom</li>
            <li>Đặt cọc giữ xe trực tuyến 72h hoàn tiền 100%</li>
            <li>Đồng bộ trạm sạc Wallbox và quản lý xe trên AutoOS</li>
          </ul>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              onClose();
              navigate('/cars');
            }}
            className="flex-1 py-3 px-4 rounded-[2px] bg-[#0EA5E9] hover:bg-[#89CEFF] text-[#003751] font-bold text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-all"
          >
            <Car className="w-4 h-4" />
            <span>Khám Phá Dòng Xe</span>
          </button>
          <button
            onClick={() => {
              onClose();
              navigate('/customer/profile');
            }}
            className="flex-1 py-3 px-4 rounded-[2px] bg-[#222A3D] hover:bg-[#2D3449] text-[#DAE2FD] text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Vào Hồ Sơ Cá Nhân</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
