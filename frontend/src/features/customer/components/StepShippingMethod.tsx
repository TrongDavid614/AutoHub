import React from 'react';
import type { ShippingMethod } from '@/features/customer/mocks/checkout.mock';

export interface StepShippingMethodProps {
  shippingMethods: ShippingMethod[];
  selectedShippingId: 'standard' | 'express-technician';
  onSelectShipping: (id: 'standard' | 'express-technician') => void;
}

export const StepShippingMethod: React.FC<StepShippingMethodProps> = ({
  shippingMethods,
  selectedShippingId,
  onSelectShipping,
}) => {
  return (
    <section className="rounded-[4px] bg-[#171F33] border border-[#2D3449] p-6 shadow-xl space-y-6">
      {/* Step Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2D3449]">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-[2px] bg-[#0EA5E9]/20 text-[#89CEFF] border border-[#0EA5E9]/30 flex items-center justify-center font-mono text-xs font-bold">
            02
          </span>
          <h2 className="text-lg font-bold text-[#DAE2FD]">Phương thức vận chuyển</h2>
        </div>
        <span className="font-mono text-xs text-[#88929B] uppercase">
          AUTOHUB LOGISTICS EXPRESS
        </span>
      </div>

      {/* Shipping Options */}
      <div className="space-y-3">
        {shippingMethods.map((method) => {
          const isSelected = selectedShippingId === method.id;
          return (
            <div
              key={method.id}
              onClick={() => onSelectShipping(method.id)}
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
                      <span className="font-bold text-sm text-[#DAE2FD]">{method.title}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-[2px] text-[9px] font-mono font-bold uppercase ${
                          method.id === 'standard'
                            ? 'bg-[#222A3D] text-[#89CEFF]'
                            : 'bg-[#0EA5E9]/20 text-[#89CEFF] border border-[#0EA5E9]/30'
                        }`}
                      >
                        {method.tag}
                      </span>
                    </div>

                    <div className="text-xs text-[#BEC8D2] leading-relaxed">
                      <span className="text-[#DAE2FD] font-medium">{method.estimatedDelivery}</span>
                      <span className="mx-1.5 text-[#88929B]">•</span>
                      <span className="text-[#88929B]">{method.subDescription}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-sm font-bold text-[#89CEFF]">
                    {method.price === 0 ? 'MIỄN PHÍ' : `+${method.price.toLocaleString('vi-VN')} đ`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
