import React, { useState } from 'react';
import { MapPin, X, User, Phone } from 'lucide-react';
import type { ExtendedAddress } from './AddressCard';

interface AddressModalProps {
  isOpen: boolean;
  editingAddress: ExtendedAddress | null;
  onClose: () => void;
  onSave: (data: {
    recipientName: string;
    phoneNumber: string;
    provinceCity: string;
    district: string;
    ward: string;
    detailedAddress: string;
    isDefault: boolean;
    tag: 'NHÀ RIÊNG' | 'VĂN PHÒNG' | 'SHOWROOM';
  }) => void;
}

interface AddressFormContentProps {
  editingAddress: ExtendedAddress | null;
  onClose: () => void;
  onSave: AddressModalProps['onSave'];
}

const AddressFormContent: React.FC<AddressFormContentProps> = ({
  editingAddress,
  onClose,
  onSave,
}) => {
  const [recipientName, setRecipientName] = useState(editingAddress?.recipientName || '');
  const [phoneNumber, setPhoneNumber] = useState(editingAddress?.phoneNumber || '');
  const [provinceCity, setProvinceCity] = useState(editingAddress?.provinceCity || 'TP. Hồ Chí Minh');
  const [district, setDistrict] = useState(editingAddress?.district || 'Quận Bình Thạnh');
  const [ward, setWard] = useState(editingAddress?.ward || 'Phường 22');
  const [detailedAddress, setDetailedAddress] = useState(editingAddress?.detailedAddress || '');
  const [isDefault, setIsDefault] = useState(editingAddress?.isDefault || false);
  const [tag, setTag] = useState<'NHÀ RIÊNG' | 'VĂN PHÒNG' | 'SHOWROOM'>(
    editingAddress?.tag || 'NHÀ RIÊNG'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      recipientName,
      phoneNumber,
      provinceCity,
      district,
      ward,
      detailedAddress,
      isDefault,
      tag,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="pt-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Họ tên người nhận */}
        <div className="space-y-1">
          <label className="text-xs text-text-muted">Họ tên người nhận *</label>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-text-muted absolute left-3 pointer-events-none" />
            <input
              type="text"
              required
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full h-10 pl-9 pr-3 bg-canvas-deep border border-surface-highlight focus:border-accent-primary rounded text-xs text-text-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Số điện thoại */}
        <div className="space-y-1">
          <label className="text-xs text-text-muted">Số điện thoại liên hệ *</label>
          <div className="relative flex items-center">
            <Phone className="w-4 h-4 text-text-muted absolute left-3 pointer-events-none" />
            <input
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="0912 345 678"
              className="w-full h-10 pl-9 pr-3 bg-canvas-deep border border-surface-highlight focus:border-accent-primary rounded text-xs text-text-primary font-mono focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Tỉnh/Thành & Quận/Huyện */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-text-muted">Tỉnh / Thành phố *</label>
          <select
            value={provinceCity}
            onChange={(e) => setProvinceCity(e.target.value)}
            className="w-full h-10 px-2 bg-canvas-deep border border-surface-highlight rounded text-xs text-text-primary focus:outline-none"
          >
            <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Bình Dương">Bình Dương</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-text-muted">Quận / Huyện *</label>
          <input
            type="text"
            required
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            placeholder="Quận Bình Thạnh"
            className="w-full h-10 px-3 bg-canvas-deep border border-surface-highlight rounded text-xs text-text-primary focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-text-muted">Phường / Xã *</label>
          <input
            type="text"
            required
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            placeholder="Phường 22"
            className="w-full h-10 px-3 bg-canvas-deep border border-surface-highlight rounded text-xs text-text-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Địa chỉ chi tiết */}
      <div className="space-y-1">
        <label className="text-xs text-text-muted">Số nhà, tên đường, tòa nhà *</label>
        <input
          type="text"
          required
          value={detailedAddress}
          onChange={(e) => setDetailedAddress(e.target.value)}
          placeholder="Ví dụ: Căn hộ 1204, Landmark 81, 720A Điện Biên Phủ"
          className="w-full h-10 px-3 bg-canvas-deep border border-surface-highlight rounded text-xs text-text-primary focus:outline-none"
        />
      </div>

      {/* Nhãn loại địa chỉ */}
      <div className="space-y-1">
        <label className="text-xs text-text-muted">Nhãn phân loại địa chỉ:</label>
        <div className="flex gap-2">
          {(['NHÀ RIÊNG', 'VĂN PHÒNG', 'SHOWROOM'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(t)}
              className={`px-3 py-1.5 rounded-[2px] text-xs font-mono font-bold transition-colors cursor-pointer ${
                tag === t
                  ? 'bg-accent-action text-accent-contrast'
                  : 'bg-surface-elevated text-text-secondary border border-surface-highlight'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Checkbox Đặt làm mặc định */}
      <label className="flex items-center gap-2 pt-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
          className="w-4 h-4 rounded text-accent-action bg-canvas-deep border-surface-highlight"
        />
        <span className="text-xs text-text-secondary">Đặt làm địa chỉ nhận hàng mặc định (DR06)</span>
      </label>

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-highlight">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded bg-surface-elevated text-xs text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          className="px-5 py-2 rounded bg-accent-action hover:bg-accent-primary text-xs font-bold text-accent-contrast cursor-pointer transition-colors"
        >
          {editingAddress ? 'Lưu Thay Đổi' : 'Thêm Địa Chỉ'}
        </button>
      </div>
    </form>
  );
};

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  editingAddress,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas-deep/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-xl bg-surface-container border border-surface-highlight p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-surface-highlight">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent-primary" />
            <h3 className="text-base font-bold text-text-primary">
              {editingAddress ? 'Chỉnh Sửa Địa Chỉ Nhận Hàng' : 'Thêm Địa Chỉ Nhận Hàng Mới'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded bg-surface-elevated text-text-secondary hover:text-text-primary flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <AddressFormContent
          key={editingAddress?.id ?? 'new-address'}
          editingAddress={editingAddress}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
};
