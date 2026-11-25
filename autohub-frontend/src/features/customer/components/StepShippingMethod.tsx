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
    <section className="rounded-xl bg-[var(--surface)] border border-[var(--line)] p-6 space-y-5">
      {/* Step Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[var(--line)]">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center text-xs font-bold tabular-nums">
            {stepNumber}
          </span>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="text-lg font-bold text-[var(--text)]">Phương thức vận chuyển & lắp đặt</h2>
          </div>
        </div>
        <span className="text-xs font-medium text-[var(--text-muted)]">
          AutoHub Logistics Express
        </span>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-8 flex flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
          <p className="text-xs">Đang tải các gói vận chuyển từ hệ thống...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && shippingMethods.length === 0 && (
        <div className="p-4 rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] text-center space-y-1">
          <AlertCircle className="w-5 h-5 text-[var(--text-muted)] mx-auto" />
          <p className="text-xs text-[var(--text-2)]">Chưa có gói vận chuyển khả dụng tại khu vực này.</p>
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
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[var(--accent-soft)]/50 border-[var(--accent)] ring-1 ring-[var(--accent)]/20'
                    : 'bg-[var(--surface)] border-[var(--line)] hover:bg-[var(--surface-subtle)]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                        isSelected
                          ? 'border-[var(--accent)] bg-[var(--accent)]'
                          : 'border-[var(--line)] bg-[var(--surface)]'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-[var(--text)]">{method.title}</span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                            methodKey === 'standard'
                              ? 'bg-[var(--surface-subtle)] text-[var(--text-2)]'
                              : 'bg-[var(--accent-soft)] text-[var(--accent)]'
                          }`}
                        >
                          {method.tag}
                        </span>
                        {isFreeQualified && method.price > 0 && (
                          <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Đủ điều kiện miễn phí
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-[var(--text-2)] leading-relaxed">
                        <span className="text-[var(--text)] font-medium">{method.estimatedDelivery}</span>
                        {method.subDescription && (
                          <>
                            <span className="mx-1.5 text-[var(--text-muted)]">•</span>
                            <span className="text-[var(--text-muted)]">{method.subDescription}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold tabular-nums text-[var(--accent)]">
                      {displayPrice ? 'Miễn phí' : `+${method.price.toLocaleString('vi-VN')} đ`}
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
