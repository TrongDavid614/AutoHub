import React from 'react';
import { Truck, AlertCircle, Loader2 } from 'lucide-react';
import type { ShippingMethod } from '@/types/cart.types';

export interface StepShippingMethodProps {
  shippingMethods: ShippingMethod[];
  selectedShippingId: string;
  onSelectShipping: (id: string) => void;
  subtotal?: number;
  isLoading?: boolean;
  stepNumber?: string;
}

export const StepShippingMethod: React.FC<StepShippingMethodProps> = ({
  shippingMethods,
  selectedShippingId,
  onSelectShipping,
  subtotal = 0,
  isLoading = false,
  stepNumber = '02',
}) => {
  return (
    <section className="rounded-[4px] bg-[#171F33] border border-[#2D3449] p-6 shadow-xl space-y-6">
      {/* Step Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2D3449]">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-[2px] bg-[#0EA5E9]/20 text-[#89CEFF] border border-[#0EA5E9]/30 flex items-center justify-center font-mono text-xs font-bold">
            {stepNumber}
          </span>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#89CEFF]" />
            <h2 className="text-lg font-bold text-[#DAE2FD]">Phương thức vận chuyển & lắp đặt</h2>
          </div>
        </div>
        <span className="font-mono text-xs text-[#88929B] uppercase tracking-wider">
          AUTOHUB LOGISTICS EXPRESS
        </span>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-8 flex flex-col items-center justify-center gap-2 text-[#88929B]">
          <Loader2 className="w-6 h-6 animate-spin text-[#89CEFF]" />
          <p className="text-xs font-mono">Đang tải các gói vận chuyển từ hệ thống...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && shippingMethods.length === 0 && (
        <div className="p-4 rounded-[2px] bg-[#060E20] border border-[#2D3449] text-center space-y-1">
          <AlertCircle className="w-5 h-5 text-[#88929B] mx-auto" />
          <p className="text-xs text-[#BEC8D2]">Chưa có gói vận chuyển khả dụng tại khu vực này.</p>
        </div>
      )}

      {/* Shipping Options */}
      {!isLoading && shippingMethods.length > 0 && (
        <div className="space-y-3">
          {shippingMethods.map((method) => {
            const methodKey = method.methodId || method.id || method.code?.toLowerCase() || 'standard';
            const isSelected =
              selectedShippingId === methodKey ||
              selectedShippingId === method.id ||
              selectedShippingId === method.code;

            const isFreeQualified =
              Boolean(method.freeThreshold && subtotal >= method.freeThreshold);

            const displayPrice = isFreeQualified || method.price === 0;

            return (
              <div
                key={method.id || method.code}
                onClick={() => onSelectShipping(methodKey)}
                className={`p-4 rounded-[2px] border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#060E20] border-[#89CEFF] shadow-lg ring-1 ring-[#89CEFF]/30'
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
                            methodKey === 'standard'
                              ? 'bg-[#222A3D] text-[#89CEFF]'
                              : 'bg-[#0EA5E9]/20 text-[#89CEFF] border border-[#0EA5E9]/30'
                          }`}
                        >
                          {method.tag}
                        </span>
                        {isFreeQualified && method.price > 0 && (
                          <span className="px-1.5 py-0.5 rounded-[2px] text-[9px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            ĐỦ ĐIỀU KIỆN MIỄN PHÍ
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-[#BEC8D2] leading-relaxed">
                        <span className="text-[#DAE2FD] font-medium">{method.estimatedDelivery}</span>
                        {method.subDescription && (
                          <>
                            <span className="mx-1.5 text-[#88929B]">•</span>
                            <span className="text-[#88929B]">{method.subDescription}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-sm font-bold text-[#89CEFF]">
                      {displayPrice ? 'MIỄN PHÍ' : `+${method.price.toLocaleString('vi-VN')} đ`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
