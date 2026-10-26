import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Check,
  Star,
  AlertCircle,
  X,
  Phone,
  User,
  Building,
  Home,
} from 'lucide-react';
import type { Address } from '@/types/auth.types';

interface ExtendedAddress extends Address {
  tag?: 'NHÀ RIÊNG' | 'VĂN PHÒNG' | 'SHOWROOM';
}

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

  // Form states
  const [recipientName, setRecipientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [provinceCity, setProvinceCity] = useState('TP. Hồ Chí Minh');
  const [district, setDistrict] = useState('Quận Bình Thạnh');
  const [ward, setWard] = useState('Phường 22');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [tag, setTag] = useState<'NHÀ RIÊNG' | 'VĂN PHÒNG' | 'SHOWROOM'>('NHÀ RIÊNG');

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
    setRecipientName('Nguyễn Văn A');
    setPhoneNumber('0912345678');
    setProvinceCity('TP. Hồ Chí Minh');
    setDistrict('Quận Bình Thạnh');
    setWard('Phường 22');
    setDetailedAddress('');
    setIsDefault(addresses.length === 0);
    setTag('NHÀ RIÊNG');
    setShowModal(true);
  };

  const handleOpenEditModal = (addr: ExtendedAddress) => {
    setEditingAddress(addr);
    setRecipientName(addr.recipientName);
    setPhoneNumber(addr.phoneNumber);
    setProvinceCity(addr.provinceCity);
    setDistrict(addr.district);
    setWard(addr.ward);
    setDetailedAddress(addr.detailedAddress);
    setIsDefault(addr.isDefault);
    setTag(addr.tag || 'NHÀ RIÊNG');
    setShowModal(true);
  };

  // 1. Lưu địa chỉ (Thêm mới hoặc Cập nhật)
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !phoneNumber.trim() || !detailedAddress.trim()) {
      showError('Vui lòng điền đầy đủ các thông tin địa chỉ bắt buộc.');
      return;
    }

    if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(phoneNumber)) {
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
              recipientName,
              phoneNumber,
              provinceCity,
              district,
              ward,
              detailedAddress,
              isDefault: isDefault || (addr.isDefault && addresses.length === 1),
              tag,
            };
          }
          // Nếu địa chỉ sửa được đặt làm mặc định thì bỏ cờ mặc định của các địa chỉ khác (DR06)
          return isDefault ? { ...addr, isDefault: false } : addr;
        })
      );
      showToast('Cập nhật địa chỉ nhận hàng thành công!');
    } else {
      // Thêm mới địa chỉ
      const newAddr: ExtendedAddress = {
        id: Math.floor(1000 + Math.random() * 9000),
        userId: 1,
        recipientName,
        phoneNumber,
        provinceCity,
        district,
        ward,
        detailedAddress,
        isDefault: isDefault || addresses.length === 0,
        tag,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2D3449]">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#89CEFF]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#DAE2FD]">Sổ Địa Chỉ Giao Hàng (UC03)</h1>
          </div>
          <p className="text-xs text-[#88929B] mt-1">
            Quản lý danh sách địa chỉ nhận hàng phụ kiện ô tô và điểm hẹn kỹ thuật viên khảo sát trạm sạc tại nhà.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-[#0EA5E9] hover:bg-[#38BDF8] text-xs font-bold text-[#00344D] transition-all cursor-pointer shadow-md self-start sm:self-auto"
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
          <div
            key={addr.id}
            className={`rounded-[6px] p-5 border transition-all duration-200 flex flex-col justify-between space-y-4 ${
              addr.isDefault
                ? 'bg-[#171F33] border-[#89CEFF] shadow-[0_0_20px_rgba(137,206,255,0.15)]'
                : 'bg-[#131B2E]/90 border-[#2D3449] hover:border-[#3E4850]'
            }`}
          >
            {/* Header Card: Tên & Tag */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#DAE2FD]">{addr.recipientName}</span>
                  {addr.tag && (
                    <span className="px-2 py-0.5 rounded-[2px] bg-[#222A3D] text-[10px] font-mono text-[#89CEFF] font-bold">
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
              <div className="flex items-center gap-1.5 text-xs text-[#BEC8D2] font-mono">
                <Phone className="w-3.5 h-3.5 text-[#88929B]" />
                <span>{addr.phoneNumber}</span>
              </div>

              {/* Địa chỉ chi tiết */}
              <div className="flex items-start gap-1.5 text-xs text-[#DAE2FD] leading-relaxed pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#89CEFF] shrink-0 mt-0.5" />
                <span>
                  {addr.detailedAddress}, {addr.ward}, {addr.district}, {addr.provinceCity}
                </span>
              </div>
            </div>

            {/* Footer Card: Nút thao tác */}
            <div className="pt-3 border-t border-[#2D3449] flex items-center justify-between gap-2">
              <div>
                {!addr.isDefault ? (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs text-[#89CEFF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>Đặt làm mặc định</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-[#88929B] font-mono">Địa chỉ giao hàng chính</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(addr)}
                  className="p-1.5 rounded-[2px] bg-[#171F33] hover:bg-[#222A3D] text-[#BEC8D2] hover:text-[#89CEFF] border border-[#2D3449] transition-colors cursor-pointer"
                  title="Chỉnh sửa địa chỉ"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="p-1.5 rounded-[2px] bg-[#171F33] hover:bg-rose-950/40 text-[#BEC8D2] hover:text-rose-400 border border-[#2D3449] hover:border-rose-500/40 transition-colors cursor-pointer"
                  title="Xóa địa chỉ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Modal Thêm / Chỉnh sửa địa chỉ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-xl bg-[#131B2E] border border-[#2D3449] p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#2D3449]">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#89CEFF]" />
                <h3 className="text-base font-bold text-[#DAE2FD]">
                  {editingAddress ? 'Chỉnh Sửa Địa Chỉ Nhận Hàng' : 'Thêm Địa Chỉ Nhận Hàng Mới'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded bg-[#171F33] text-[#BEC8D2] hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Họ tên người nhận */}
                <div className="space-y-1">
                  <label className="text-xs text-[#88929B]">Họ tên người nhận *</label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-[#88929B] absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full h-10 pl-9 pr-3 bg-[#060E20] border border-[#2D3449] focus:border-[#89CEFF] rounded text-xs text-[#DAE2FD] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Số điện thoại */}
                <div className="space-y-1">
                  <label className="text-xs text-[#88929B]">Số điện thoại liên hệ *</label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-[#88929B] absolute left-3 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="0912 345 678"
                      className="w-full h-10 pl-9 pr-3 bg-[#060E20] border border-[#2D3449] focus:border-[#89CEFF] rounded text-xs text-[#DAE2FD] font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Tỉnh/Thành & Quận/Huyện */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-[#88929B]">Tỉnh / Thành phố *</label>
                  <select
                    value={provinceCity}
                    onChange={(e) => setProvinceCity(e.target.value)}
                    className="w-full h-10 px-2 bg-[#060E20] border border-[#2D3449] rounded text-xs text-[#DAE2FD] focus:outline-none"
                  >
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Bình Dương">Bình Dương</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#88929B]">Quận / Huyện *</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Quận Bình Thạnh"
                    className="w-full h-10 px-3 bg-[#060E20] border border-[#2D3449] rounded text-xs text-[#DAE2FD] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#88929B]">Phường / Xã *</label>
                  <input
                    type="text"
                    required
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    placeholder="Phường 22"
                    className="w-full h-10 px-3 bg-[#060E20] border border-[#2D3449] rounded text-xs text-[#DAE2FD] focus:outline-none"
                  />
                </div>
              </div>

              {/* Địa chỉ chi tiết */}
              <div className="space-y-1">
                <label className="text-xs text-[#88929B]">Số nhà, tên đường, tòa nhà *</label>
                <input
                  type="text"
                  required
                  value={detailedAddress}
                  onChange={(e) => setDetailedAddress(e.target.value)}
                  placeholder="Ví dụ: Căn hộ 1204, Landmark 81, 720A Điện Biên Phủ"
                  className="w-full h-10 px-3 bg-[#060E20] border border-[#2D3449] rounded text-xs text-[#DAE2FD] focus:outline-none"
                />
              </div>

              {/* Nhãn loại địa chỉ */}
              <div className="space-y-1">
                <label className="text-xs text-[#88929B]">Nhãn phân loại địa chỉ:</label>
                <div className="flex gap-2">
                  {(['NHÀ RIÊNG', 'VĂN PHÒNG', 'SHOWROOM'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTag(t)}
                      className={`px-3 py-1.5 rounded-[2px] text-xs font-mono font-bold transition-colors cursor-pointer ${
                        tag === t
                          ? 'bg-[#0EA5E9] text-[#00344D]'
                          : 'bg-[#171F33] text-[#BEC8D2] border border-[#2D3449]'
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
                  className="w-4 h-4 rounded text-[#0EA5E9] bg-[#060E20] border-[#2D3449]"
                />
                <span className="text-xs text-[#BEC8D2]">Đặt làm địa chỉ nhận hàng mặc định (DR06)</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2D3449]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-[#171F33] text-xs text-[#BEC8D2] hover:text-white"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#0EA5E9] hover:bg-[#38BDF8] text-xs font-bold text-[#00344D]"
                >
                  {editingAddress ? 'Lưu Thay Đổi' : 'Thêm Địa Chỉ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
