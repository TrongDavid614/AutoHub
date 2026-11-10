import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { AddressCard, type ExtendedAddress } from '@/features/customer/components/AddressCard';
import { AddressModal } from '@/features/customer/components/AddressModal';
import { addressService } from '@/features/customer/services/address.service';

export const AddressBookPage: React.FC = () => {
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState<ExtendedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal thêm/sửa địa chỉ
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ExtendedAddress | null>(null);

  const loadAddresses = async () => {
    setIsLoading(true);
    try {
      const data = await addressService.getMyAddresses(user?.id);
      setAddresses(data || []);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [user?.id]);

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
  const handleSaveAddress = async (data: {
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
      await addressService.updateAddress(editingAddress.id, {
        ...data,
        customerId: user?.id || 5,
      });
      showToast('Cập nhật địa chỉ nhận hàng thành công!');
    } else {
      await addressService.addAddress({
        ...data,
        customerId: user?.id || 5,
      });
      showToast('Đã thêm địa chỉ mới vào sổ địa chỉ thành công!');
    }

    await loadAddresses();
    setShowModal(false);
  };

  // 2. Thiết lập làm địa chỉ mặc định (DR06)
  const handleSetDefault = async (id: number) => {
    await addressService.setDefaultAddress(id);
    await loadAddresses();
    showToast('Đã thiết lập địa chỉ mặc định mới cho giao hàng phụ kiện!');
  };

  // 3. Xóa địa chỉ (Bảo đảm ràng buộc ngoại lệ UC03)
  const handleDeleteAddress = async (id: number) => {
    const target = addresses.find((a) => a.id === id);
    if (!target) return;

    if (target.isDefault && addresses.length > 1) {
      showError(
        'Không thể xóa địa chỉ mặc định. Vui lòng thiết lập một địa chỉ khác làm mặc định trước khi xóa.'
      );
      return;
    }

    await addressService.deleteAddress(id);
    await loadAddresses();
    showToast('Đã xóa địa chỉ khỏi sổ địa chỉ thành công.');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-highlight">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-accent-primary" />
            <h1 className="text-xl md:text-2xl font-bold text-text-primary">Sổ Địa Chỉ Giao Hàng</h1>
          </div>
          <p className="text-sm text-text-muted mt-0.5">
            Quản lý danh sách địa chỉ nhận hàng phụ kiện ô tô và điểm hẹn kỹ thuật viên khảo sát trạm sạc tại nhà.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadAddresses}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[4px] bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-accent-primary' : ''}`} />
            <span>Làm mới</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-accent-action hover:bg-accent-primary text-xs font-bold text-accent-contrast transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Địa Chỉ Mới</span>
          </button>
        </div>
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
