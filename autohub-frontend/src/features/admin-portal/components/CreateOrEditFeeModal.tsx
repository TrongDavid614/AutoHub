import React, { useState, useEffect } from 'react';
import { X, Percent, MapPin, Calendar, DollarSign, FileText } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { cn } from '@/lib/utils';
import type {
  AdminRegistrationFee,
  CreateRegistrationFeePayload,
  UpdateRegistrationFeePayload,
} from '@/types/fee.types';
import type { ProvinceOption } from '@/types/showroom.types';

interface CreateOrEditFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateRegistrationFeePayload | UpdateRegistrationFeePayload) => Promise<void>;
  editingFee: AdminRegistrationFee | null;
  provinces: ProvinceOption[];
  isSubmitting: boolean;
}

export const CreateOrEditFeeModal: React.FC<CreateOrEditFeeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingFee,
  provinces,
  isSubmitting,
}) => {
  const { isDarkMode } = useAdminTheme();

  const [provinceId, setProvinceId] = useState<number | ''>('');
  const [taxRate, setTaxRate] = useState<number>(10.0);
  const [plateFee, setPlateFee] = useState<number>(20000000);
  const [inspectionFee, setInspectionFee] = useState<number>(340000);
  const [roadFee, setRoadFee] = useState<number>(1560000);
  const [insuranceFee, setInsuranceFee] = useState<number>(873400);
  const [effectiveDate, setEffectiveDate] = useState<string>('2026-01-01');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (editingFee) {
      setProvinceId(editingFee.provinceId);
      setTaxRate(editingFee.registrationTaxRate);
      setPlateFee(editingFee.licensePlateFee);
      setInspectionFee(editingFee.inspectionFee);
      setRoadFee(editingFee.roadMaintenanceFee);
      setInsuranceFee(editingFee.mandatoryInsuranceFee);
      setEffectiveDate(editingFee.effectiveDate || '2026-01-01');
      setExpiryDate(editingFee.expiryDate || '');
    } else {
      setProvinceId(provinces.length > 0 ? provinces[0].id : '');
      setTaxRate(10.0);
      setPlateFee(20000000);
      setInspectionFee(340000);
      setRoadFee(1560000);
      setInsuranceFee(873400);
      setEffectiveDate('2026-01-01');
      setExpiryDate('');
    }
    setErrorMsg(null);
  }, [editingFee, provinces, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!provinceId) {
      setErrorMsg('Vui lòng chọn tỉnh/thành phố');
      return;
    }
    if (taxRate < 0 || taxRate > 100) {
      setErrorMsg('Tỷ lệ lệ phí trước bạ phải từ 0% đến 100%');
      return;
    }

    const payload: CreateRegistrationFeePayload = {
      provinceId: Number(provinceId),
      registrationTaxRate: Number(taxRate),
      licensePlateFee: Number(plateFee),
      inspectionFee: Number(inspectionFee),
      roadMaintenanceFee: Number(roadFee),
      mandatoryInsuranceFee: Number(insuranceFee),
      effectiveDate: effectiveDate || undefined,
      expiryDate: expiryDate || undefined,
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
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {editingFee ? 'Chỉnh Sửa Biểu Phí Lăn Bánh' : 'Thêm Biểu Phí Lăn Bánh Tỉnh/Thành'}
              </h2>
              <p className={cn('text-xs mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                {editingFee
                  ? `Cập nhật cấu hình tính toán phí lăn bánh cho ${editingFee.provinceName}`
                  : 'Cấu hình tỷ lệ trước bạ, tiền biển số cho công cụ Dự Toán Lăn Bánh'}
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

          {/* Province selector */}
          <div className="space-y-1">
            <label className="text-xs font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>Tỉnh / Thành Phố</span>
              <span className="text-rose-500">*</span>
            </label>
            <select
              value={provinceId}
              disabled={!!editingFee}
              onChange={(e) => setProvinceId(Number(e.target.value))}
              className={cn(
                'w-full px-3.5 py-2 text-xs rounded-lg border transition-colors focus:outline-none disabled:opacity-60',
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

          {/* Tax Rates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-blue-500" />
                <span>Thuế Trước Bạ (Xăng / Hybrid %)</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className={cn(
                  'w-full px-3.5 py-2 text-xs rounded-lg border transition-colors focus:outline-none font-mono font-bold',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white focus:border-[#89CEFF]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'
                )}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-emerald-500" />
                <span>Trước Bạ Xe Điện (EV %)</span>
              </label>
              <input
                type="text"
                disabled
                value="0.0% (Miễn 100% theo Nghị định)"
                className={cn(
                  'w-full px-3.5 py-2 text-xs rounded-lg border font-mono font-bold opacity-80',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-emerald-400'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                )}
              />
            </div>
          </div>

          {/* Fees Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-500" />
                <span>Lệ Phí Cấp Biển Số (₫)</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="100000"
                min="0"
                value={plateFee}
                onChange={(e) => setPlateFee(Number(e.target.value))}
                placeholder="VD: 20000000"
                className={cn(
                  'w-full px-3.5 py-2 text-xs rounded-lg border transition-colors focus:outline-none font-mono',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white focus:border-[#89CEFF]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'
                )}
              />
              <span className="text-[10px] text-slate-400">
                {Number(plateFee).toLocaleString('vi-VN')} ₫
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                <span>Phí Đăng Kiểm (₫)</span>
              </label>
              <input
                type="number"
                step="10000"
                min="0"
                value={inspectionFee}
                onChange={(e) => setInspectionFee(Number(e.target.value))}
                className={cn(
                  'w-full px-3.5 py-2 text-xs rounded-lg border transition-colors focus:outline-none font-mono',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white focus:border-[#89CEFF]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'
                )}
              />
              <span className="text-[10px] text-slate-400">
                {Number(inspectionFee).toLocaleString('vi-VN')} ₫
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-sky-500" />
                <span>Phí Bảo Trì Đường Bộ (1 Năm ₫)</span>
              </label>
              <input
                type="number"
                step="10000"
                min="0"
                value={roadFee}
                onChange={(e) => setRoadFee(Number(e.target.value))}
                className={cn(
                  'w-full px-3.5 py-2 text-xs rounded-lg border transition-colors focus:outline-none font-mono',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white focus:border-[#89CEFF]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'
                )}
              />
              <span className="text-[10px] text-slate-400">
                {Number(roadFee).toLocaleString('vi-VN')} ₫
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-rose-500" />
                <span>Bảo Hiểm TNDS Bắt Buộc (₫)</span>
              </label>
              <input
                type="number"
                step="1000"
                min="0"
                value={insuranceFee}
                onChange={(e) => setInsuranceFee(Number(e.target.value))}
                className={cn(
                  'w-full px-3.5 py-2 text-xs rounded-lg border transition-colors focus:outline-none font-mono',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white focus:border-[#89CEFF]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'
                )}
              />
              <span className="text-[10px] text-slate-400">
                {Number(insuranceFee).toLocaleString('vi-VN')} ₫
              </span>
            </div>
          </div>

          {/* Effective Dates */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="space-y-1">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Ngày áp dụng</span>
              </label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
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
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Ngày hết hiệu lực (nếu có)</span>
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className={cn(
                  'w-full px-3.5 py-2 text-xs rounded-lg border transition-colors focus:outline-none font-mono',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white focus:border-[#89CEFF]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'
                )}
              />
            </div>
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
              {isSubmitting ? 'Đang lưu...' : editingFee ? 'Lưu Thay Đổi' : 'Tạo Biểu Phí'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
