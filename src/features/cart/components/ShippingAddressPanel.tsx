import React from 'react';
import { MapPin, Plus, Edit2, CheckCircle2 } from 'lucide-react';
import type { ShippingAddress } from '../mocks/cart.mock';

export interface ShippingAddressPanelProps {
  address: ShippingAddress;
  onChangeAddressClick: () => void;
  onAddAddressClick: () => void;
}

export const ShippingAddressPanel: React.FC<ShippingAddressPanelProps> = ({
  address,
  onChangeAddressClick,
  onAddAddressClick,
}) => {
  return (
    <section className="rounded-[2px] bg-[#171F33] border border-[#2D3449] p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2D3449]">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold tracking-[1.5px] text-[#89CEFF] uppercase">
            02 / ĐỊA CHỈ NHẬN HÀNG & LẮP ĐẶT
          </span>
        </div>
        <button
          onClick={onChangeAddressClick}
          className="text-xs text-[#89CEFF] hover:underline font-medium cursor-pointer"
        >
          Thay đổi sổ địa chỉ
        </button>
      </div>

      {/* Active Selected Address Plate */}
      <div className="rounded-[2px] bg-[#060E20] border border-[#89CEFF]/60 p-5 shadow-lg relative overflow-hidden space-y-3">
        {/* Top Active Halo & Radio */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#89CEFF]" />
            <span className="font-bold text-sm text-[#DAE2FD]">{address.recipientName}</span>
            {address.tag && (
              <span className="px-2 py-0.5 rounded-[2px] bg-[#222A3D] text-[#89CEFF] font-mono text-[9px] font-bold tracking-wider uppercase border border-[#2D3449]">
                {address.tag}
              </span>
            )}
            {address.isDefault && (
              <span className="px-2 py-0.5 rounded-[2px] bg-[#31394D] text-[#DAE2FD] font-mono text-[9px] font-bold uppercase">
                MẶC ĐỊNH
              </span>
            )}
          </div>

          <button
            onClick={onChangeAddressClick}
            className="flex items-center gap-1 text-xs text-[#88929B] hover:text-[#89CEFF] transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Sửa địa chỉ</span>
          </button>
        </div>

        {/* Phone & Address details */}
        <div className="space-y-1.5 pl-6 text-xs text-[#BEC8D2]">
          <div className="font-mono text-[#DAE2FD] font-semibold">{address.phone}</div>
          <div className="flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#89CEFF] flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{address.fullAddress}</span>
          </div>
        </div>

        {/* Technical Instruction Note */}
        {address.technicalNote && (
          <div className="mt-3 ml-6 p-2.5 rounded-[2px] bg-[#171F33] border border-[#2D3449] text-[11px] leading-relaxed">
            <span className="text-[#89CEFF] font-semibold">Ghi chú kỹ thuật: </span>
            <span className="text-[#88929B]">{address.technicalNote}</span>
          </div>
        )}
      </div>

      {/* Button: Add Address Action */}
      <button
        onClick={onAddAddressClick}
        className="w-full py-3 px-4 rounded-[2px] border border-dashed border-[#3E4850] hover:border-[#89CEFF] text-[#DAE2FD] hover:text-[#89CEFF] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer bg-[#060E20]/40"
      >
        <Plus className="w-4 h-4" />
        <span>Thêm địa chỉ giao hàng / trạm đỗ xe mới</span>
      </button>
    </section>
  );
};
