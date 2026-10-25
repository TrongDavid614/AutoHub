import React, { useState } from 'react';
import { X, Check, MapPin, Plus } from 'lucide-react';
import type { ShippingAddress } from '../mocks/cart.mock';

export interface AddressEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: ShippingAddress[];
  selectedAddress: ShippingAddress;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060E20]/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl rounded-[4px] bg-[#131B2E] border border-[#2D3449] p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2D3449]">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#89CEFF]" />
            <h3 className="text-lg font-bold text-[#DAE2FD]">Sổ Địa Chỉ Giao Hàng & Lắp Đặt</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#88929B] hover:text-[#DAE2FD] hover:bg-[#222A3D] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Address Selection List */}
        {!isAddingNew ? (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {addresses.map((addr) => {
              const isSelected = selectedAddress.id === addr.id;
              return (
                <div
                  key={addr.id}
                  onClick={() => {
                    onSelectAddress(addr);
                    onClose();
                  }}
                  className={`p-4 rounded-[2px] border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'bg-[#171F33] border-[#89CEFF] shadow-lg'
                      : 'bg-[#171F33]/40 border-[#2D3449] hover:bg-[#171F33] hover:border-[#3E4850]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#DAE2FD]">{addr.recipientName}</span>
                      {addr.tag && (
                        <span className="px-1.5 py-0.5 rounded-[2px] bg-[#222A3D] text-[9px] font-mono text-[#89CEFF]">
                          {addr.tag}
                        </span>
                      )}
                    </div>
                    <div
                      className={`w-4 h-4 rounded-[2px] border flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#89CEFF] border-[#89CEFF] text-[#060E20]'
                          : 'border-[#3E4850] bg-[#060E20]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  <p className="font-mono text-xs text-[#89CEFF]">{addr.phone}</p>
                  <p className="text-xs text-[#BEC8D2] leading-relaxed">{addr.fullAddress}</p>
                  {addr.technicalNote && (
                    <p className="text-[11px] text-[#88929B] italic">Ghi chú: {addr.technicalNote}</p>
                  )}
                </div>
              );
            })}

            <button
              onClick={() => setIsAddingNew(true)}
              className="w-full py-2.5 rounded-[2px] border border-dashed border-[#3E4850] hover:border-[#89CEFF] text-xs font-semibold text-[#89CEFF] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm địa chỉ mới</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSaveNew} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-[#88929B]">Họ và tên người nhận</label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                className="w-full px-3 py-2 bg-[#060E20] border border-[#2D3449] rounded-[2px] text-xs text-[#DAE2FD] focus:outline-none focus:border-[#89CEFF]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#88929B]">Số điện thoại liên hệ</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ví dụ: 0912 345 678"
                className="w-full px-3 py-2 bg-[#060E20] border border-[#2D3449] rounded-[2px] text-xs text-[#DAE2FD] focus:outline-none focus:border-[#89CEFF]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#88929B]">Địa chỉ chi tiết (Số nhà, tòa nhà, đường, quận/huyện)</label>
              <textarea
                required
                rows={2}
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder="Nhập địa chỉ nhận phụ kiện và khảo sát trạm sạc..."
                className="w-full px-3 py-2 bg-[#060E20] border border-[#2D3449] rounded-[2px] text-xs text-[#DAE2FD] focus:outline-none focus:border-[#89CEFF]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#88929B]">Ghi chú kỹ thuật cho kỹ sư lắp đặt (tùy chọn)</label>
              <input
                type="text"
                value={technicalNote}
                onChange={(e) => setTechnicalNote(e.target.value)}
                placeholder="Ví dụ: Gọi trước 30p, kiểm tra CB nguồn điện 3 pha..."
                className="w-full px-3 py-2 bg-[#060E20] border border-[#2D3449] rounded-[2px] text-xs text-[#DAE2FD] focus:outline-none focus:border-[#89CEFF]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2D3449]">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 rounded-[2px] bg-[#222A3D] text-[#DAE2FD] text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-[2px] bg-[#0EA5E9] hover:bg-[#89CEFF] text-[#003751] font-bold text-xs uppercase cursor-pointer"
              >
                Lưu địa chỉ
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
