import React from 'react';
import { MapPin, Plus, Edit2 } from 'lucide-react';
import type { CheckoutAddress } from '../mocks/checkout.mock';

export interface StepAddressSelectionProps {
  addresses: CheckoutAddress[];
  selectedAddressId: string;
  onSelectAddress: (id: string) => void;
  onAddNewAddress: () => void;
}

export const StepAddressSelection: React.FC<StepAddressSelectionProps> = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddNewAddress,
}) => {
  return (
    <section className="rounded-[4px] bg-[#171F33] border border-[#2D3449] p-6 shadow-xl space-y-6">
      {/* Step Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2D3449]">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-[2px] bg-[#0EA5E9]/20 text-[#89CEFF] border border-[#0EA5E9]/30 flex items-center justify-center font-mono text-xs font-bold">
            01
          </span>
          <h2 className="text-lg font-bold text-[#DAE2FD]">Địa chỉ nhận hàng</h2>
        </div>
        <span className="font-mono text-xs text-[#88929B] uppercase">
          {addresses.length} ĐỊA CHỈ ĐÃ LƯU
        </span>
      </div>

      {/* Address Cards Stack */}
      <div className="space-y-3">
        {addresses.map((addr) => {
          const isSelected = selectedAddressId === addr.id;
          return (
            <div
              key={addr.id}
              onClick={() => onSelectAddress(addr.id)}
              className={`p-4 rounded-[2px] border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#060E20] border-[#89CEFF] shadow-lg'
                  : 'bg-[#060E20]/60 border-[#2D3449] hover:bg-[#060E20] hover:border-[#3E4850]'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                      isSelected
                        ? 'border-[#89CEFF] bg-[#89CEFF]'
                        : 'border-[#3E4850] bg-[#171F33]'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#060E20]" />}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#DAE2FD]">{addr.recipientName}</span>
                      <span className="font-mono text-xs text-[#89CEFF] font-semibold">
                        {addr.phone}
                      </span>
                      {addr.isDefault && (
                        <span className="px-1.5 py-0.5 rounded-[2px] bg-[#31394D] text-[9px] font-mono text-[#DAE2FD] font-bold uppercase">
                          MẶC ĐỊNH
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 rounded-[2px] bg-[#222A3D] text-[9px] font-mono text-[#89CEFF] font-bold uppercase">
                        {addr.tag}
                      </span>
                    </div>

                    <div className="flex items-start gap-1.5 text-xs text-[#BEC8D2] leading-relaxed">
                      <MapPin className="w-3.5 h-3.5 text-[#88929B] shrink-0 mt-0.5" />
                      <span>{addr.fullAddress}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Optional edit hook
                  }}
                  className="flex items-center gap-1 text-xs text-[#88929B] hover:text-[#89CEFF] transition-colors shrink-0 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Chỉnh sửa</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Address Action */}
      <button
        type="button"
        onClick={onAddNewAddress}
        className="w-full py-3 px-4 rounded-[2px] border border-dashed border-[#3E4850] hover:border-[#89CEFF] text-xs font-semibold text-[#DAE2FD] hover:text-[#89CEFF] flex items-center justify-center gap-2 transition-colors cursor-pointer bg-[#060E20]/30"
      >
        <Plus className="w-4 h-4" />
        <span>Thêm địa chỉ nhận hàng mới</span>
      </button>
    </section>
  );
};
