import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, MapPin, Plus, Loader2, AlertCircle } from 'lucide-react';
import type { ShippingAddress } from '@/features/customer/mocks/cart.mock';
import { addressService } from '@/features/customer/services/address.service';
import { useAuthStore } from '@/store/useAuthStore';

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
  const { user } = useAuthStore();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [technicalNote, setTechnicalNote] = useState('');
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  const [addressTag, setAddressTag] = useState<'NHÀ RIÊNG' | 'VĂN PHÒNG' | 'SHOWROOM'>('NHÀ RIÊNG');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Khi mở form thêm mới, điền sẵn họ tên & sđt của tài khoản hiện tại nếu có
  useEffect(() => {
    if (isAddingNew) {
      if (!recipientName && user?.fullName) {
        setRecipientName(user.fullName);
      }
      if (!phone && user?.phoneNumber) {
        setPhone(user.phoneNumber);
      }
      setIsDefaultAddress(addresses.length === 0);
      setErrorMessage(null);
    }
  }, [isAddingNew, user?.fullName, user?.phoneNumber, addresses.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSaveNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !phone.trim() || !fullAddress.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng.');
      return;
    }

    const cleanPhone = phone.trim().replace(/[\s.-]+/g, '');
    if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(cleanPhone)) {
      setErrorMessage('Số điện thoại không hợp lệ (yêu cầu 10 chữ số bắt đầu bằng 03, 05, 07, 08, 09).');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const shouldBeDefault = isDefaultAddress || addresses.length === 0;
    let savedId = `addr-${Date.now()}`;

    try {
      const saved = await addressService.addAddress({
        customerId: user?.id,
        recipientName: recipientName.trim(),
        phoneNumber: cleanPhone,
        detailedAddress: fullAddress.trim(),
        provinceCity: '',
        district: '',
        ward: '',
        isDefault: shouldBeDefault,
        tag: addressTag,
      });

      if (saved && saved.id) {
        savedId = String(saved.id);
      }
    } catch (err) {
      console.warn('[AddressEditModal] Lỗi khi lưu địa chỉ lên máy chủ:', err);
    } finally {
      setIsSaving(false);
    }

    const newAddr: ShippingAddress = {
      id: savedId,
      recipientName: recipientName.trim(),
      phone: cleanPhone,
      fullAddress: fullAddress.trim(),
      technicalNote: technicalNote.trim(),
      isDefault: shouldBeDefault,
      tag: shouldBeDefault ? 'MẶC ĐỊNH' : addressTag,
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
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-2)] block">Họ và tên người nhận *</label>
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
              <label className="text-xs font-medium text-[var(--text-2)] block">Số điện thoại liên hệ *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ví dụ: 0912 345 678"
                className="w-full px-3 py-2 bg-[var(--surface-subtle)] border border-[var(--line)] rounded-lg text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-2)] block">Địa chỉ nhận hàng đầy đủ *</label>
              <textarea
                required
                rows={2}
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                className="w-full px-3 py-2 bg-[var(--surface-subtle)] border border-[var(--line)] rounded-lg text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-2)] block">Loại địa chỉ</label>
              <div className="flex items-center gap-2">
                {(['NHÀ RIÊNG', 'VĂN PHÒNG', 'SHOWROOM'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAddressTag(t)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                      addressTag === t
                        ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                        : 'bg-[var(--surface-subtle)] border-[var(--line)] text-[var(--text-2)] hover:border-[var(--accent)]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
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

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isDefaultAddress}
                onChange={(e) => setIsDefaultAddress(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--accent)] border-[var(--line)] focus:ring-[var(--accent)] cursor-pointer"
              />
              <span className="text-xs text-[var(--text)] font-medium">
                Đặt làm địa chỉ nhận hàng mặc định cho các đơn sau
              </span>
            </label>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-subtle)] border border-[var(--line)] text-[var(--text)] text-xs font-medium cursor-pointer transition-colors disabled:opacity-60"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-xs cursor-pointer transition-colors flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <span>Lưu vào sổ địa chỉ</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};
