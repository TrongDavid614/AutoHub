import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, MapPin, Plus } from 'lucide-react';
import type { ShippingAddress } from '@/features/customer/mocks/cart.mock';

export interface AddressEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: ShippingAddress[];
  selectedAddress?: ShippingAddress | null;
  onSelectAddress: (address: ShippingAddress) => void;
  onAddNewAddress: (newAddr: ShippingAddress) => void;
}

export const AddressEditModal: React.FC<AddressEditModalProps> = ({
  isOpen,
  onClose,
  addresses,
  selectedAddress,
  onSelectAddress,
  onAddNewAddress,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [technicalNote, setTechnicalNote] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !phone || !fullAddress) return;

    const newAddr: ShippingAddress = {
      id: `addr-${Date.now()}`,
      recipientName,
      phone,
      fullAddress,
      technicalNote,
      isDefault: false,
      tag: 'TÙY CHỌN',
    };

    onAddNewAddress(newAddr);
    onSelectAddress(newAddr);
    setIsAddingNew(false);
    onClose();
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45"
    >
      <div className="w-full max-w-xl rounded-xl bg-[var(--surface)] border border-[var(--line)] p-6 shadow-xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="text-lg font-bold text-[var(--text)]">Sổ Địa Chỉ Giao Hàng & Lắp Đặt</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-subtle)] cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Address Selection List */}
        {!isAddingNew ? (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {addresses.length === 0 ? (
              <div className="p-6 text-center rounded-lg border border-dashed border-[var(--line)] bg-[var(--surface-subtle)] space-y-2">
                <p className="text-xs text-[var(--text-muted)]">
                  Chưa có địa chỉ nào trong sổ địa chỉ của bạn.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold cursor-pointer"
                >
                  Thêm địa chỉ ngay
                </button>
              </div>
            ) : (
              addresses.map((addr) => {
                const isSelected = selectedAddress?.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => {
                      onSelectAddress(addr);
                      onClose();
                    }}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors space-y-1.5 ${
                      isSelected
                        ? 'bg-[var(--accent-soft)]/50 border-[var(--accent)] ring-1 ring-[var(--accent)]/20'
                        : 'bg-[var(--surface)] border-[var(--line)] hover:bg-[var(--surface-subtle)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[var(--text)]">{addr.recipientName}</span>
                        {addr.tag && (
                          <span className="px-2 py-0.5 rounded-md bg-[var(--accent-soft)] text-xs font-medium text-[var(--accent)]">
                            {addr.tag}
                          </span>
                        )}
                      </div>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isSelected
                            ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                            : 'border-[var(--line)] bg-[var(--surface)]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <p className="text-xs font-medium tabular-nums text-[var(--accent)]">{addr.phone}</p>
                    <p className="text-xs text-[var(--text-2)] leading-relaxed">{addr.fullAddress}</p>
                    {addr.technicalNote && (
                      <p className="text-xs text-[var(--text-muted)] italic">Ghi chú: {addr.technicalNote}</p>
                    )}
                  </div>
                );
              })
            )}

            <button
              type="button"
              onClick={() => setIsAddingNew(true)}
              className="w-full py-2.5 rounded-lg border border-dashed border-[var(--line)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]/30 text-xs font-semibold text-[var(--accent)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm địa chỉ mới</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSaveNew} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-2)] block">Họ và tên người nhận</label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                className="w-full px-3 py-2 bg-[var(--surface-subtle)] border border-[var(--line)] rounded-lg text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-2)] block">Số điện thoại liên hệ</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ví dụ: 0912 345 678"
                className="w-full px-3 py-2 bg-[var(--surface-subtle)] border border-[var(--line)] rounded-lg text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-2)] block">Địa chỉ chi tiết (Số nhà, tòa nhà, đường, quận/huyện)</label>
              <textarea
                required
                rows={2}
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder="Nhập địa chỉ nhận phụ kiện và khảo sát trạm sạc..."
                className="w-full px-3 py-2 bg-[var(--surface-subtle)] border border-[var(--line)] rounded-lg text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-2)] block">Ghi chú kỹ thuật cho kỹ sư lắp đặt (tùy chọn)</label>
              <input
                type="text"
                value={technicalNote}
                onChange={(e) => setTechnicalNote(e.target.value)}
                placeholder="Ví dụ: Gọi trước 30p, kiểm tra CB nguồn điện 3 pha..."
                className="w-full px-3 py-2 bg-[var(--surface-subtle)] border border-[var(--line)] rounded-lg text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-subtle)] border border-[var(--line)] text-[var(--text)] text-xs font-medium cursor-pointer transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-xs cursor-pointer transition-colors"
              >
                Lưu địa chỉ
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};
