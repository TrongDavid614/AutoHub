import React from 'react';
import {
  MapPin,
  Trash2,
  Edit2,
  Check,
  Star,
  Phone,
  Building,
  Home,
} from 'lucide-react';
import type { Address } from '@/types/auth.types';

export interface ExtendedAddress extends Address {
  tag?: 'NHÀ RIÊNG' | 'VĂN PHÒNG' | 'SHOWROOM';
}

interface AddressCardProps {
  addr: ExtendedAddress;
  onSetDefault: (id: number) => void;
  onEdit: (addr: ExtendedAddress) => void;
  onDelete: (id: number) => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  addr,
  onSetDefault,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={`rounded-[6px] p-5 border transition-all duration-200 flex flex-col justify-between space-y-4 ${
        addr.isDefault
          ? 'bg-surface-elevated border-accent-primary shadow-[0_0_20px_rgba(137,206,255,0.15)]'
          : 'bg-surface-container border-surface-highlight hover:border-border-subtle'
      }`}
    >
      {/* Header Card: Tên & Tag */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-text-primary">{addr.recipientName}</span>
            {addr.tag && (
              <span className="px-2 py-0.5 rounded-[2px] bg-surface-interactive text-[10px] font-mono text-accent-primary font-bold">
                {addr.tag === 'NHÀ RIÊNG' ? (
                  <span className="flex items-center gap-1">
                    <Home className="w-3 h-3" /> NHÀ RIÊNG
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3" /> VĂN PHÒNG
                  </span>
                )}
              </span>
            )}
          </div>

          {addr.isDefault && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-emerald-500/20 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/40">
              <Check className="w-3 h-3" />
              <span>MẶC ĐỊNH</span>
            </span>
          )}
        </div>

        {/* SĐT */}
        <div className="flex items-center gap-1.5 text-xs text-text-secondary font-mono">
          <Phone className="w-3.5 h-3.5 text-text-muted" />
          <span>{addr.phoneNumber}</span>
        </div>

        {/* Địa chỉ chi tiết */}
        <div className="flex items-start gap-1.5 text-xs text-text-primary leading-relaxed pt-1">
          <MapPin className="w-3.5 h-3.5 text-accent-primary shrink-0 mt-0.5" />
          <span>
            {addr.detailedAddress}, {addr.ward}, {addr.district}, {addr.provinceCity}
          </span>
        </div>
      </div>

      {/* Footer Card: Nút thao tác */}
      <div className="pt-3 border-t border-surface-highlight flex items-center justify-between gap-2">
        <div>
          {!addr.isDefault ? (
            <button
              type="button"
              onClick={() => onSetDefault(addr.id)}
              className="text-xs text-accent-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Star className="w-3.5 h-3.5" />
              <span>Đặt làm mặc định</span>
            </button>
          ) : (
            <span className="text-[11px] text-text-muted font-mono">Địa chỉ giao hàng chính</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(addr)}
            className="p-1.5 rounded-[2px] bg-surface-elevated hover:bg-surface-interactive text-text-secondary hover:text-accent-primary border border-surface-highlight transition-colors cursor-pointer"
            title="Chỉnh sửa địa chỉ"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(addr.id)}
            className="p-1.5 rounded-[2px] bg-surface-elevated hover:bg-rose-950/40 text-text-secondary hover:text-rose-400 border border-surface-highlight hover:border-rose-500/40 transition-colors cursor-pointer"
            title="Xóa địa chỉ"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
