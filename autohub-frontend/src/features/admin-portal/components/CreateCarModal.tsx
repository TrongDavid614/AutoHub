import React, { useState } from 'react';
import { X, Car, Plus, Sparkles, AlertCircle } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import type { CreateCarMasterPayload } from '@/types/car.types';

interface CreateCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateCarMasterPayload) => Promise<boolean>;
  isSubmitting: boolean;
}

export const CreateCarModal: React.FC<CreateCarModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const { isDarkMode } = useAdminTheme();

  const [brandName, setBrandName] = useState('VinFast');
  const [modelName, setModelName] = useState('');
  const [versionName, setVersionName] = useState('');
  const [segment, setSegment] = useState('D-SUV');
  const [fuelType, setFuelType] = useState('Thuần Điện');
  const [transmission, setTransmission] = useState('Tự động 1 cấp');
  const [seats, setSeats] = useState(5);
  const [price, setPrice] = useState('1499000000');
  const [deposit, setDeposit] = useState('20000000');
  const [tamHoatDongKm, setTamHoatDongKm] = useState('471');
  const [dungLuongPinKwh, setDungLuongPinKwh] = useState('87.7');
  const [demoCount, setDemoCount] = useState(2);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!modelName.trim()) {
      setValidationError('Vui lòng nhập tên dòng xe (ví dụ: VinFast VF8, Honda CR-V)');
      return;
    }
    if (!versionName.trim()) {
      setValidationError('Vui lòng nhập tên phiên bản cấu hình (ví dụ: Plus AWD (402 HP))');
      return;
    }

    const numPrice = Number(price);
    const numDeposit = Number(deposit);

    if (isNaN(numPrice) || numPrice <= 0) {
      setValidationError('Giá niêm yết không hợp lệ');
      return;
    }

    const payload: CreateCarMasterPayload = {
      brandName: brandName.trim(),
      modelName: modelName.trim(),
      versionName: versionName.trim(),
      segment,
      origin: 'Lắp ráp trong nước',
      fuelType,
      transmission,
      seats,
      price: numPrice,
      deposit: numDeposit,
      tamHoatDongKm: tamHoatDongKm ? Number(tamHoatDongKm) : undefined,
      dungLuongPinKwh: dungLuongPinKwh ? Number(dungLuongPinKwh) : undefined,
      specs: JSON.stringify({
        cong_suat: fuelType.includes('Điện') ? '402 HP' : '204 HP',
        tam_chay: tamHoatDongKm ? `${tamHoatDongKm} km` : '500 km',
        sac: fuelType.includes('Điện') ? '10-80% trong 24 phút' : 'Tự sạc hybrid',
      }),
      imageUrl: imageUrl.trim() || undefined,
      demoCount,
      releaseYear: 2026,
    };

    const ok = await onSubmit(payload);
    if (ok) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/50 text-[#DAE2FD]'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between p-5 border-b ${
            isDarkMode ? 'border-[#3E4850]/40 bg-[#131B2E]' : 'border-slate-100 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                isDarkMode ? 'bg-[#171F33] text-[#89CEFF]' : 'bg-blue-50 text-blue-600'
              }`}
            >
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Thêm Dòng Xe & Phiên Bản Mới
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
                Nhập thông số kỹ thuật, giá niêm yết và số xe demo tại showroom
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDarkMode
                ? 'text-[#88929B] hover:text-white hover:bg-[#1E293B]'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {validationError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hãng xe */}
            <div>
              <label className="block text-xs font-semibold mb-1">Hãng Xe</label>
              <select
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <option value="VinFast">VinFast</option>
                <option value="Honda">Honda</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Ford">Ford</option>
                <option value="AutoHub EV">AutoHub EV</option>
              </select>
            </div>

            {/* Tên dòng xe */}
            <div>
              <label className="block text-xs font-semibold mb-1">
                Tên Dòng Xe <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="Ví dụ: VinFast VF8, Honda CR-V"
                className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white placeholder-[#88929B]'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
            </div>

            {/* Tên phiên bản cấu hình */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold mb-1">
                Phiên Bản Cấu Hình <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
                placeholder="Ví dụ: Plus AWD (402 HP), e:HEV RS Hybrid, Calligraphy"
                className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white placeholder-[#88929B]'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
            </div>

            {/* Phân khúc */}
            <div>
              <label className="block text-xs font-semibold mb-1">Phân Khúc</label>
              <select
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <option value="C-SUV">C-SUV</option>
                <option value="D-SUV">D-SUV</option>
                <option value="E-SUV">E-SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="E-Sedan">E-Sedan</option>
                <option value="SUV">SUV</option>
                <option value="MPV">MPV</option>
                <option value="Bán tải">Bán tải</option>
              </select>
            </div>

            {/* Hệ truyền động */}
            <div>
              <label className="block text-xs font-semibold mb-1">Hệ Truyền Động / Nhiên Liệu</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <option value="Thuần Điện">Thuần Điện</option>
                <option value="Hybrid Xăng-Điện">Hybrid Xăng-Điện</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Xăng 1.5L VTEC Turbo">Xăng 1.5L Turbo</option>
                <option value="Dầu Bi-Turbo">Dầu Bi-Turbo</option>
              </select>
            </div>

            {/* Hộp số */}
            <div>
              <label className="block text-xs font-semibold mb-1">Hộp Số</label>
              <input
                type="text"
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                placeholder="Ví dụ: Tự động 1 cấp, e-CVT"
                className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
            </div>

            {/* Số chỗ ngồi */}
            <div>
              <label className="block text-xs font-semibold mb-1">Số Chỗ Ngồi</label>
              <select
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <option value={5}>5 Chỗ</option>
                <option value={6}>6 Chỗ (Ghế cơ trưởng)</option>
                <option value={7}>7 Chỗ</option>
              </select>
            </div>

            {/* Giá niêm yết */}
            <div>
              <label className="block text-xs font-semibold mb-1">
                Giá Niêm Yết (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1499000000"
                className={`w-full px-3 py-2 text-xs font-mono border rounded-lg focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
            </div>

            {/* Mức cọc 72h */}
            <div>
              <label className="block text-xs font-semibold mb-1">
                Mức Cọc Giữ Xe 72h (DR08)
              </label>
              <select
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className={`w-full px-3 py-2 text-xs font-mono font-semibold border rounded-lg focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-[#89CEFF]'
                    : 'bg-white border-slate-200 text-blue-600'
                }`}
              >
                <option value="10000000">10.000.000 ₫ (Xe dưới 1.4 tỷ)</option>
                <option value="20000000">20.000.000 ₫ (Xe cao cấp từ 1.4 tỷ)</option>
              </select>
            </div>

            {/* Xe Demo sẵn sàng */}
            <div>
              <label className="block text-xs font-semibold mb-1">Số Lượng Xe Demo Khởi Tạo</label>
              <input
                type="number"
                min={0}
                max={10}
                value={demoCount}
                onChange={(e) => setDemoCount(Number(e.target.value))}
                className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
            </div>

            {/* Tầm hoạt động */}
            <div>
              <label className="block text-xs font-semibold mb-1">Tầm Hoạt Động (km)</label>
              <input
                type="number"
                value={tamHoatDongKm}
                onChange={(e) => setTamHoatDongKm(e.target.value)}
                placeholder="471"
                className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
            </div>

            {/* Dung lượng pin */}
            <div>
              <label className="block text-xs font-semibold mb-1">Dung Lượng Pin (kWh)</label>
              <input
                type="number"
                step="0.1"
                value={dungLuongPinKwh}
                onChange={(e) => setDungLuongPinKwh(e.target.value)}
                placeholder="87.7"
                className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
            </div>
          </div>

          {/* Ảnh xe */}
          <div>
            <label className="block text-xs font-semibold mb-1">URL Ảnh Ngoại Thất Xe</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none ${
                isDarkMode
                  ? 'bg-[#131B2E] border-[#3E4850]/50 text-white'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            />
          </div>

          {/* Modal Footer */}
          <div
            className={`flex items-center justify-end gap-3 pt-4 border-t ${
              isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-100'
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                isDarkMode
                  ? 'border-[#3E4850]/50 hover:bg-[#1E293B] text-[#88929B]'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Đang lưu vào SQL Server...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Lưu Dòng Xe Mới</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
