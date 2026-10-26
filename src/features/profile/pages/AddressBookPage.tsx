import React, { useState } from 'react';
import { MapPin, Plus, Check, AlertCircle } from 'lucide-react';
import { AddressCard, type ExtendedAddress } from '../components/AddressCard';
import { AddressModal } from '../components/AddressModal';

const INITIAL_ADDRESSES: ExtendedAddress[] = [
  {
    id: 1,
    userId: 1,
    recipientName: 'Nguyễn Văn A',
    phoneNumber: '0912345678',
    provinceCity: 'TP. Hồ Chí Minh',
    district: 'Quận Bình Thạnh',
    ward: 'Phường 22',
    detailedAddress: 'Tòa Landmark 81, 720A Điện Biên Phủ',
    isDefault: true,
    tag: 'NHÀ RIÊNG',
  },
  {
    id: 2,
    userId: 1,
    recipientName: 'Nguyễn Văn A (Văn phòng)',
    phoneNumber: '0912345678',
    provinceCity: 'TP. Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    detailedAddress: 'Tầng 25, Tòa nhà Bitexco Financial Tower, Số 2 Hải Triều',
    isDefault: false,
    tag: 'VĂN PHÒNG',
  },
];

export const AddressBookPage: React.FC = () => {
  const [addresses, setAddresses] = useState<ExtendedAddress[]>(INITIAL_ADDRESSES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal thêm/sửa địa chỉ
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ExtendedAddress | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (addr: ExtendedAddress) => {
    setEditingAddress(addr);
    setShowModal(true);
  };

  // 1. Lưu địa chỉ (Thêm mới hoặc Cập nhật)
  const handleSaveAddress = (data: {
    recipientName: string;
    phoneNumber: string;
    provinceCity: string;
    district: string;
    ward: string;
    detailedAddress: string;
    isDefault: boolean;
    tag: 'NHÀ RIÊNG' | 'VĂN PHÒNG' | 'SHOWROOM';
  }) => {
    if (!data.recipientName.trim() || !data.phoneNumber.trim() || !data.detailedAddress.trim()) {
      showError('Vui lòng điền đầy đủ các thông tin địa chỉ bắt buộc.');
      return;
    }

    if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(data.phoneNumber)) {
      showError('Số điện thoại không hợp lệ (yêu cầu 10 chữ số).');
      return;
    }

    if (editingAddress) {
      // Cập nhật địa chỉ
      setAddresses((prev) =>
        prev.map((addr) => {
          if (addr.id === editingAddress.id) {
            return {
              ...addr,
              ...data,
              isDefault: data.isDefault || (addr.isDefault && addresses.length === 1),
            };
          }
          // Nếu địa chỉ sửa được đặt làm mặc định thì bỏ cờ mặc định của các địa chỉ khác (DR06)
          return data.isDefault ? { ...addr, isDefault: false } : addr;
        })
      );
      showToast('Cập nhật địa chỉ nhận hàng thành công!');
    } else {
      // Thêm mới địa chỉ
      const newAddr: ExtendedAddress = {
        id: Math.floor(1000 + Math.random() * 9000),
        userId: 1,
        ...data,
        isDefault: data.isDefault || addresses.length === 0,
      };

      setAddresses((prev) => {
        if (newAddr.isDefault) {
          return [...prev.map((a) => ({ ...a, isDefault: false })), newAddr];
        }
        return [...prev, newAddr];
      });
      showToast('Đã thêm địa chỉ mới vào sổ địa chỉ thành công!');
    }

    setShowModal(false);
  };

  // 2. Thiết lập làm địa chỉ mặc định (DR06)
  const handleSetDefault = (id: number) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    showToast('Đã thiết lập địa chỉ mặc định mới cho giao hàng phụ kiện!');
  };

  // 3. Xóa địa chỉ (Bảo đảm ràng buộc ngoại lệ UC03)
  const handleDeleteAddress = (id: number) => {
    const target = addresses.find((a) => a.id === id);
    if (!target) return;

    // Ràng buộc ngoại lệ UC03: "Không thể xóa địa chỉ mặc định khi còn các địa chỉ khác"
    if (target.isDefault && addresses.length > 1) {
      showError(
        'Không thể xóa địa chỉ mặc định. Vui lòng thiết lập một địa chỉ khác làm mặc định trước khi xóa (Quy tắc UC03 & DR06).'
      );
      return;
    }

    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast('Đã xóa địa chỉ khỏi sổ địa chỉ thành công.');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-highlight">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-accent-primary" />
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Sổ Địa Chỉ Giao Hàng (UC03)</h1>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Quản lý danh sách địa chỉ nhận hàng phụ kiện ô tô và điểm hẹn kỹ thuật viên khảo sát trạm sạc tại nhà.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-accent-action hover:bg-accent-primary text-xs font-bold text-accent-contrast transition-all cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Địa Chỉ Mới</span>
        </button>
      </div>

      {/* Thông báo Toast / Error */}
      {toastMessage && (
        <div className="p-3 rounded bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-3.5 rounded bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2 animate-fadeIn shadow-lg">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 2. Danh sách địa chỉ dạng Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <AddressCard
            key={addr.id}
            addr={addr}
            onSetDefault={handleSetDefault}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteAddress}
          />
        ))}
      </div>

      {/* 3. Modal Thêm / Chỉnh sửa địa chỉ */}
      <AddressModal
        isOpen={showModal}
        editingAddress={editingAddress}
        onClose={() => setShowModal(false)}
        onSave={handleSaveAddress}
      />
    </div>
  );
};
