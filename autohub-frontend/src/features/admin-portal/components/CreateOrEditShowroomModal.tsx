import React, { useState, useEffect } from 'react';
import { X, Building2, MapPin, Phone, Clock, Globe } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { cn } from '@/lib/utils';
import type {
  AdminShowroomItem,
  ProvinceOption,
  CreateShowroomPayload,
  UpdateShowroomPayload,
} from '@/types/showroom.types';

interface CreateOrEditShowroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateShowroomPayload | UpdateShowroomPayload) => Promise<void>;
  editingShowroom: AdminShowroomItem | null;
  provinces: ProvinceOption[];
  isSubmitting: boolean;
}

export const CreateOrEditShowroomModal: React.FC<CreateOrEditShowroomModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingShowroom,
  provinces,
  isSubmitting,
}) => {
  const { isDarkMode } = useAdminTheme();

  const [name, setName] = useState('');
  const [provinceId, setProvinceId] = useState<number | ''>('');
  const [address, setAddress] = useState('');
  const [hotline, setHotline] = useState('');
  const [openTime, setOpenTime] = useState('08:00');
  const [closeTime, setCloseTime] = useState('19:00');
  const [active, setActive] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (editingShowroom) {
      setName(editingShowroom.name);
      setProvinceId(editingShowroom.provinceId);
      setAddress(editingShowroom.address);
      setHotline(editingShowroom.hotline);
      setOpenTime(editingShowroom.openTime ? editingShowroom.openTime.substring(0, 5) : '08:00');
      setCloseTime(editingShowroom.closeTime ? editingShowroom.closeTime.substring(0, 5) : '19:00');
      setActive(editingShowroom.active);
    } else {
      setName('');
      setProvinceId(provinces.length > 0 ? provinces[0].id : '');
      setAddress('');
      setHotline('');
      setOpenTime('08:00');
      setCloseTime('19:00');
      setActive(true);
    }
    setErrorMsg(null);
  }, [editingShowroom, provinces, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập tên showroom');
      return;
    }
    if (!provinceId) {
      setErrorMsg('Vui lòng chọn tỉnh / thành phố');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Vui lòng nhập địa chỉ chi tiết');
      return;
    }
    if (!hotline.trim()) {
      setErrorMsg('Vui lòng nhập số điện thoại hotline');
      return;
    }

    const payload: CreateShowroomPayload = {
      name: name.trim(),
      provinceId: Number(provinceId),
      address: address.trim(),
      hotline: hotline.trim(),
      openTime: openTime ? `${openTime}:00` : '08:00:00',
      closeTime: closeTime ? `${closeTime}:00` : '19:00:00',
      active,
    };

    await onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className={cn(
          'w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors',
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/50 text-white' : 'bg-white border-slate-200 text-slate-900'
        )}
      >
        {/* Header */}
        <div
          className={cn(
            'flex items-center justify-between px-6 py-4 border-b',
            isDarkMode ? 'border-[#3E4850]/30 bg-[#131B2E]' : 'border-slate-100 bg-slate-50'
          )}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600/10 text-blue-600 dark:text-[#89CEFF]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {editingShowroom ? 'Chỉnh Sửa Chi Nhánh Showroom' : 'Thêm Chi Nhánh Showroom Mới'}
              </h2>
              <p className={cn('text-xs mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                {editingShowroom
                  ? `Cập nhật thông tin chi nhánh ${editingShowroom.code}`
                  : 'Mở rộng mạng lưới điểm trải nghiệm và phân bổ tồn kho ô tô'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'p-1.5 rounded-lg transition-colors cursor-pointer',
              isDarkMode ? 'hover:bg-slate-800 text-[#88929B]' : 'hover:bg-slate-100 text-slate-400'
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Showroom Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold flex items-center gap-1.5">
              <span>Tên Showroom</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: AutoHub Flagship Mỹ Đình - Hà Nội"
              className={cn(
                'w-full px-3.5 py-2 text-xs rounded-lg border transition-colors focus:outline-none',
                isDarkMode
                  ? 'bg-[#131B2E] border-[#3E4850]/50 text-white placeholder-[#88929B] focus:border-[#89CEFF]'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
              )}
            />
          </div>

          {/* Province & Hotline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span>Tỉnh / Thành phố</span>
                <span className="text-rose-500">*</span>
              </label>
              <select
                value={provinceId}
                onChange={(e) => setProvinceId(Number(e.target.value))}
                className={cn(
                  'w-full px-3.5 py-2 text-xs rounded-lg border transition-colors focus:outline-none',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white focus:border-[#89CEFF]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'
                )}
              >
                <option value="" disabled>
                  -- Chọn tỉnh thành --
                </option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id} className={isDarkMode ? 'bg-[#0B1326]' : 'bg-white'}>
                    {p.name} ({p.region})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>Hotline / Số điện thoại</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                placeholder="VD: 02438889999 hoặc 19008888"
                className={cn(
                  'w-full px-3.5 py-2 text-xs rounded-lg border transition-colors focus:outline-none font-mono',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white placeholder-[#88929B] focus:border-[#89CEFF]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
                )}
              />
            </div>
          </div>

          {/* Detailed Address */}
          <div className="space-y-1">
            <label className="text-xs font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Địa chỉ chi tiết</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="VD: Số 8 Lê Quang Đạo, P. Mễ Trì, Q. Nam Từ Liêm, TP. Hà Nội"
              className={cn(
                'w-full px-3.5 py-2 text-xs rounded-lg border transition-colors focus:outline-none',
                isDarkMode
                  ? 'bg-[#131B2E] border-[#3E4850]/50 text-white placeholder-[#88929B] focus:border-[#89CEFF]'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
              )}
            />
          </div>

          {/* Working Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Giờ mở cửa</span>
              </label>
              <input
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className={cn(
                  'w-full px-3.5 py-2 text-xs rounded-lg border transition-colors focus:outline-none font-mono',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white focus:border-[#89CEFF]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'
                )}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Giờ đóng cửa</span>
              </label>
              <input
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className={cn(
                  'w-full px-3.5 py-2 text-xs rounded-lg border transition-colors focus:outline-none font-mono',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white focus:border-[#89CEFF]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'
                )}
              />
            </div>
          </div>

          {/* Status Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <div>
                <span className="text-xs font-semibold">Đang hoạt động (Phục vụ khách hàng)</span>
                <p className={cn('text-[11px]', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                  Cho phép đặt lịch lái thử, điều chuyển xe và hiển thị trên bản đồ showroom công khai
                </p>
              </div>
            </label>
          </div>

          {/* Footer Actions */}
          <div
            className={cn(
              'pt-4 border-t flex items-center justify-end gap-3',
              isDarkMode ? 'border-[#3E4850]/30' : 'border-slate-100'
            )}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={cn(
                'px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer',
                isDarkMode ? 'hover:bg-slate-800 text-[#88929B]' : 'hover:bg-slate-100 text-slate-600'
              )}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? 'Đang lưu...' : editingShowroom ? 'Lưu Thay Đổi' : 'Tạo Showroom'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
