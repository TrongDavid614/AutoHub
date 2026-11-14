import React, { useState, useEffect } from 'react';
import { X, Landmark, Percent, Calendar, ShieldCheck } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { cn } from '@/lib/utils';
import type {
  AdminBankLoan,
  CreateBankLoanPayload,
  UpdateBankLoanPayload,
} from '@/types/fee.types';

interface CreateOrEditLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateBankLoanPayload | UpdateBankLoanPayload) => Promise<void>;
  editingLoan: AdminBankLoan | null;
  isSubmitting: boolean;
}

export const CreateOrEditLoanModal: React.FC<CreateOrEditLoanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingLoan,
  isSubmitting,
}) => {
  const { isDarkMode } = useAdminTheme();

  const [bankName, setBankName] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [firstYearRate, setFirstYearRate] = useState<number>(6.99);
  const [floatingRate, setFloatingRate] = useState<number>(10.5);
  const [maxTenorYears, setMaxTenorYears] = useState<number>(8);
  const [maxLtvPercent, setMaxLtvPercent] = useState<number>(80);
  const [note, setNote] = useState('');
  const [active, setActive] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (editingLoan) {
      setBankName(editingLoan.bankName);
      setBankCode(editingLoan.bankCode || '');
      setFirstYearRate(editingLoan.firstYearRate);
      setFloatingRate(editingLoan.floatingRate);
      setMaxTenorYears(editingLoan.maxTenorYears);
      setMaxLtvPercent(editingLoan.maxLtvPercent);
      setNote(editingLoan.note || '');
      setActive(editingLoan.active);
    } else {
      setBankName('');
      setBankCode('');
      setFirstYearRate(6.99);
      setFloatingRate(10.5);
      setMaxTenorYears(8);
      setMaxLtvPercent(80);
      setNote('');
      setActive(true);
    }
    setErrorMsg(null);
  }, [editingLoan, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!bankName.trim()) {
      setErrorMsg('Vui lòng nhập tên ngân hàng liên kết');
      return;
    }
    if (firstYearRate < 0 || firstYearRate > 50) {
      setErrorMsg('Lãi suất năm đầu phải từ 0% đến 50%');
      return;
    }
    if (floatingRate < 0 || floatingRate > 50) {
      setErrorMsg('Lãi suất thả nổi phải từ 0% đến 50%');
      return;
    }
    if (maxTenorYears < 1 || maxTenorYears > 30) {
      setErrorMsg('Kỳ hạn vay tối đa phải từ 1 đến 30 năm');
      return;
    }
    if (maxLtvPercent < 1 || maxLtvPercent > 100) {
      setErrorMsg('Hạn mức cho vay (LTV) phải từ 1% đến 100%');
      return;
    }

    const payload: CreateBankLoanPayload = {
      bankName: bankName.trim(),
      bankCode: bankCode.trim().toUpperCase() || undefined,
      firstYearRate: Number(firstYearRate),
      floatingRate: Number(floatingRate),
      maxTenorYears: Number(maxTenorYears),
      maxLtvPercent: Number(maxLtvPercent),
      note: note.trim() || undefined,
      active,
    };

    await onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className={cn(
          'w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors',
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
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {editingLoan ? 'Chỉnh Sửa Gói Vay Ngân Hàng' : 'Thêm Ngân Hàng Liên Kết Mới'}
              </h2>
              <p className={cn('text-xs mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                {editingLoan
                  ? `Cập nhật chính sách lãi suất và hạn mức của ${editingLoan.bankName}`
                  : 'Cấu hình gói tín dụng mua xe trả góp liên kết'}
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

          {/* Bank Name & Code */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1 col-span-2">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-blue-500" />
                <span>Tên Ngân Hàng</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="VD: Vietcombank, Shinhan Bank..."
                className={cn(
                  'w-full px-3.5 py-2 text-xs rounded-lg border transition-colors focus:outline-none',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white focus:border-[#89CEFF]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'
                )}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Mã Viết Tắt</label>
              <input
                type="text"
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
                placeholder="VD: VCB, SHB"
                className={cn(
                  'w-full px-3.5 py-2 text-xs rounded-lg border transition-colors focus:outline-none font-mono uppercase',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white focus:border-[#89CEFF]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'
                )}
              />
            </div>
          </div>

          {/* Interest Rates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-emerald-500" />
                <span>Lãi Suất Năm Đầu (%)</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="50"
                value={firstYearRate}
                onChange={(e) => setFirstYearRate(Number(e.target.value))}
                className={cn(
                  'w-full px-3.5 py-2 text-xs rounded-lg border transition-colors focus:outline-none font-mono font-bold text-emerald-500',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 focus:border-[#89CEFF]'
                    : 'bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white'
                )}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-amber-500" />
                <span>Lãi Suất Thả Nổi (%)</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="50"
                value={floatingRate}
                onChange={(e) => setFloatingRate(Number(e.target.value))}
                className={cn(
                  'w-full px-3.5 py-2 text-xs rounded-lg border transition-colors focus:outline-none font-mono font-bold text-amber-500',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 focus:border-[#89CEFF]'
                    : 'bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white'
                )}
              />
            </div>
          </div>

          {/* Tenor & LTV */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>Kỳ Hạn Vay Tối Đa (Năm)</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={maxTenorYears}
                onChange={(e) => setMaxTenorYears(Number(e.target.value))}
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
                <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                <span>Hạn Mức Vay Tối Đa (LTV %)</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={maxLtvPercent}
                onChange={(e) => setMaxLtvPercent(Number(e.target.value))}
                className={cn(
                  'w-full px-3.5 py-2 text-xs rounded-lg border transition-colors focus:outline-none font-mono',
                  isDarkMode
                    ? 'bg-[#131B2E] border-[#3E4850]/50 text-white focus:border-[#89CEFF]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'
                )}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-semibold">Ghi Chú Chính Sách & Ưu Đãi</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Miễn phí trả nợ trước hạn từ năm thứ 4, duyệt hồ sơ nhanh..."
              className={cn(
                'w-full px-3.5 py-2 text-xs rounded-lg border transition-colors focus:outline-none resize-none',
                isDarkMode
                  ? 'bg-[#131B2E] border-[#3E4850]/50 text-white focus:border-[#89CEFF]'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'
              )}
            />
          </div>

          {/* Active status */}
          <div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="text-xs font-semibold">Đang liên kết & áp dụng tính toán trả góp</span>
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
              {isSubmitting ? 'Đang lưu...' : editingLoan ? 'Lưu Thay Đổi' : 'Tạo Gói Vay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
