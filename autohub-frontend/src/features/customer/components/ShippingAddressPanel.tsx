import React from 'react';
import { MapPin, Plus, Edit2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ShippingAddress } from '@/features/customer/mocks/cart.mock';

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
  const hasValidAddress = Boolean(
    address &&
      address.id &&
      address.fullAddress &&
      address.fullAddress !== 'Chưa có địa chỉ nhận hàng' &&
      address.recipientName
  );

  return (
    <section className="rounded-lg bg-[var(--surface)] border border-[var(--line)] p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
        <span className="text-sm font-semibold text-[var(--text)]">
          02. Địa chỉ nhận hàng &amp; lắp đặt
        </span>
        <button
          type="button"
          onClick={onChangeAddressClick}
          className="text-xs text-[var(--accent)] hover:underline font-medium cursor-pointer"
        >
          Thay đổi sổ địa chỉ
        </button>
      </div>

      {/* Selected Address Box */}
      {hasValidAddress ? (
        <div className="rounded-lg bg-[var(--accent-soft)] border border-[var(--accent)]/40 p-4 space-y-2.5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
              <span className="font-semibold text-sm text-[var(--text)]">{address.recipientName}</span>
              {address.tag && (
                <span className="px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--line)] text-[11px] font-medium text-[var(--accent)]">
                  {address.tag}
                </span>
              )}
              {address.isDefault && (
                <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium">
                  Mặc định
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onChangeAddressClick}
              className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors cursor-pointer shrink-0"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Sửa địa chỉ</span>
            </button>
          </div>

          <div className="space-y-1 pl-6 text-xs text-[var(--text-secondary)]">
            <div className="font-semibold text-[var(--text)] tabular-nums">{address.phone}</div>
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{address.fullAddress}</span>
            </div>
          </div>

          {address.technicalNote && (
            <div className="ml-6 pt-2 border-t border-[var(--line)] text-xs text-[var(--text-secondary)]">
              <span className="font-medium text-[var(--text)]">Ghi chú kỹ thuật: </span>
              <span>{address.technicalNote}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-4 space-y-2.5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-semibold text-sm text-amber-800">Chưa thiết lập địa chỉ nhận hàng</span>
            </div>
            <button
              type="button"
              onClick={onAddAddressClick}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline cursor-pointer"
            >
              Thêm địa chỉ ngay
            </button>
          </div>
          <p className="text-xs text-amber-700/90 leading-relaxed pl-6">
            Vui lòng thêm địa chỉ nhận hàng và số điện thoại liên hệ để đội ngũ AutoHub có thể giao hàng và hỗ trợ kỹ thuật tận nơi.
          </p>
        </div>
      )}

      {/* Add Address Button */}
      <button
        type="button"
        onClick={onAddAddressClick}
        className="w-full py-2.5 px-4 rounded-lg border border-dashed border-[var(--line-strong)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--accent)] text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer bg-[var(--surface)]"
      >
        <Plus className="w-4 h-4" />
        <span>Thêm địa chỉ giao hàng mới</span>
      </button>
    </section>
  );
};
