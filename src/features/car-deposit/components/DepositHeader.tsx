import React from 'react';
import { X } from 'lucide-react';

interface DepositHeaderProps {
  onClose?: () => void;
}

export const DepositHeader: React.FC<DepositHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex justify-between items-start p-6 pb-3 border-b border-[#2D3449]/60">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Đặt cọc giữ xe trực tuyến AutoHub GT-e
        </h2>
        <p className="text-xs text-[#BEC8D2]">
          Hoàn tất giữ số thứ tự ưu tiên giao xe đợt đầu và hưởng trọn bộ quyền lợi độc quyền.
        </p>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-[#88929B] hover:text-white bg-[#222A3D] hover:bg-[#2D3449] rounded transition-colors"
          title="Đóng modal"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
