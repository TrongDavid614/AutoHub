import React from 'react';
import { MapPin, Plus, Edit2 } from 'lucide-react';
import type { CheckoutAddress } from '@/types/cart.types';

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
    <section className="rounded-lg bg-[var(--surface)] border border-[var(--line)] p-6 space-y-5">
      {/* Step Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center text-xs font-semibold tabular-nums">
            01
          </span>
          <h2 className="text-base font-semibold text-[var(--text)]">Địa chỉ nhận hàng</h2>
        </div>
        <span className="text-xs text-[var(--text-muted)] tabular-nums">
          {addresses.length} địa chỉ đã lưu
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
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-[var(--accent-soft)] border-[var(--accent)]'
                  : 'bg-[var(--surface)] border-[var(--line)] hover:border-[var(--line-strong)]'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                      isSelected
                        ? 'border-[var(--accent)] bg-[var(--accent)]'
                        : 'border-[var(--line-strong)] bg-[var(--surface)]'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-[var(--text)]">{addr.recipientName}</span>
                      <span className="text-xs text-[var(--accent)] font-medium tabular-nums">
                        {addr.phone}
                      </span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-700 font-medium">
                          Mặc định
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--line)] text-[11px] text-[var(--text-secondary)] font-medium">
                        {addr.tag}
                      </span>
                    </div>

                    <div className="flex items-start gap-1.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                      <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0 mt-0.5" />
                      <span>{addr.fullAddress}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors shrink-0 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Sửa</span>
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
        className="w-full py-2.5 px-4 rounded-lg border border-dashed border-[var(--line-strong)] hover:border-[var(--accent)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] flex items-center justify-center gap-2 transition-colors cursor-pointer bg-[var(--surface)]"
      >
        <Plus className="w-4 h-4" />
        <span>Thêm địa chỉ nhận hàng mới</span>
      </button>
    </section>
  );
};
