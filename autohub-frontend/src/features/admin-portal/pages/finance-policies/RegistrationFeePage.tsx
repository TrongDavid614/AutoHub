import React, { useState, useEffect, useCallback } from 'react';
import {
  Save,
  Info,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Inbox,
  Landmark,
  Percent,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { cn } from '@/lib/utils';
import { adminFeeService } from '../../services/admin-fee.service';
import type { RegistrationFee, BankLoanPackage } from '@/types/admin-fee.types';

export const RegistrationFeePage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [activeTab, setActiveTab] = useState<'fees' | 'loans'>('fees');

  const [provincialFees, setProvincialFees] = useState<RegistrationFee[]>([]);
  const [bankLoans, setBankLoans] = useState<BankLoanPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const fetchFees = useCallback(async () => {
    setLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const data = await adminFeeService.getOverview();
      setProvincialFees(data.provincialFees ?? []);
      setBankLoans(data.bankLoans ?? []);
    } catch (err) {
      console.error('[RegistrationFeePage] Lỗi tải biểu phí:', err);
      setError('Không thể kết nối đến máy chủ để tải biểu phí lăn bánh và lãi suất.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  const handleFeeChange = (
    id: number,
    field: keyof RegistrationFee,
    value: number
  ) => {
    setProvincialFees((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleLoanChange = (
    id: string,
    field: keyof BankLoanPackage,
    value: number
  ) => {
    setBankLoans((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const updated = await adminFeeService.batchUpdateFees({
        provincialFees,
        bankLoans,
      });
      setProvincialFees(updated.provincialFees ?? []);
      setBankLoans(updated.bankLoans ?? []);
      setFeedback({
        type: 'success',
        message: 'Lưu toàn bộ cấu hình biểu phí lăn bánh & trần lãi suất vay thành công! Dữ liệu đã đồng bộ sang công cụ Dự toán.',
      });
    } catch (err) {
      console.error('[RegistrationFeePage] Lỗi lưu cấu hình biểu phí:', err);
      setFeedback({
        type: 'error',
        message: 'Không thể lưu cấu hình. Vui lòng kiểm tra lại thông số đầu vào và thử lại.',
      });
    } finally {
      setSaving(false);
    }
  };

  const isFeeListEmpty = !loading && !error && (provincialFees ?? []).length === 0;
  const isLoanListEmpty = !loading && !error && (bankLoans ?? []).length === 0;

  return (
    <div
      className={cn(
        'space-y-6 antialiased transition-colors duration-300 pb-12',
        isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'
      )}
    >
      {/* 1. Header & Actions */}
      <div
        className={cn(
          'flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border transition-colors',
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
            : 'bg-white border-slate-200 shadow-sm'
        )}
      >
        <div>
          <h1
            className={cn(
              'text-xl md:text-2xl font-bold flex items-center gap-2',
              isDarkMode ? 'text-white' : 'text-slate-900'
            )}
          >
            <Landmark className="w-6 h-6 text-blue-500" />
            <span>Quản Lý Biểu Phí Lăn Bánh & Trần Lãi Suất Vay Trả Góp</span>
          </h1>
          <p className={cn('text-xs mt-1', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Cấu hình tỷ lệ trước bạ, lệ phí cấp biển số tỉnh thành và bảng lãi suất vay mua ô tô theo chuẩn CSDL AutoHubDB.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchFees}
            disabled={loading || saving}
            title="Làm mới dữ liệu"
            className={cn(
              'p-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5',
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/40 text-[#88929B] hover:text-white'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900',
              (loading || saving) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={loading || saving}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm',
              (loading || saving) && 'opacity-60 cursor-not-allowed'
            )}
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Đang lưu cấu hình...' : 'Lưu Cấu Hình Mới'}</span>
          </button>
        </div>
      </div>

      {/* 2. Feedback Banner */}
      {feedback && (
        <div
          className={cn(
            'p-4 rounded-xl border text-xs flex items-center justify-between gap-3 transition-colors',
            feedback.type === 'success'
              ? isDarkMode
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : isDarkMode
                ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                : 'bg-rose-50 border-rose-200 text-rose-800'
          )}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-[11px] underline opacity-70 hover:opacity-100 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* 3. Error Banner */}
      {!loading && error && (
        <div
          className={cn(
            'p-8 rounded-xl border flex flex-col items-center justify-center gap-3 text-center transition-colors',
            isDarkMode
              ? 'bg-rose-950/30 border-rose-800/50 text-rose-200'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          )}
        >
          <AlertTriangle className="w-8 h-8 text-rose-500" />
          <div className="text-sm font-semibold">{error}</div>
          <p className="text-xs opacity-80">
            Không thể tải biểu phí từ hệ thống. Vui lòng kiểm tra lại dịch vụ Backend.
          </p>
          <button
            type="button"
            onClick={fetchFees}
            className="flex items-center gap-1.5 px-4 py-2 mt-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-sm transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Thử lại (Retry)</span>
          </button>
        </div>
      )}

      {/* 4. Tabs Navigation */}
      <div
        className={cn(
          'flex border-b gap-4',
          isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-200'
        )}
      >
        <button
          type="button"
          onClick={() => setActiveTab('fees')}
          className={cn(
            'pb-3 text-xs font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5',
            activeTab === 'fees'
              ? isDarkMode
                ? 'text-[#89CEFF] border-[#89CEFF]'
                : 'text-blue-600 border-blue-600'
              : isDarkMode
                ? 'text-[#88929B] border-transparent hover:text-white'
                : 'text-slate-500 border-transparent hover:text-slate-800'
          )}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>Biểu Phí Lăn Bánh Theo Tỉnh/Thành</span>
          <span
            className={cn(
              'px-1.5 py-0.5 rounded-full text-[10px] font-mono',
              isDarkMode ? 'bg-[#131B2E] text-slate-300' : 'bg-slate-100 text-slate-600'
            )}
          >
            {(provincialFees ?? []).length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('loans')}
          className={cn(
            'pb-3 text-xs font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5',
            activeTab === 'loans'
              ? isDarkMode
                ? 'text-[#89CEFF] border-[#89CEFF]'
                : 'text-blue-600 border-blue-600'
              : isDarkMode
                ? 'text-[#88929B] border-transparent hover:text-white'
                : 'text-slate-500 border-transparent hover:text-slate-800'
          )}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>Gói Vay Ngân Hàng Liên Kết (Lãi Suất & Kỳ Hạn)</span>
          <span
            className={cn(
              'px-1.5 py-0.5 rounded-full text-[10px] font-mono',
              isDarkMode ? 'bg-[#131B2E] text-slate-300' : 'bg-slate-100 text-slate-600'
            )}
          >
            {(bankLoans ?? []).length}
          </span>
        </button>
      </div>

      {/* 5. Legal Information Alert */}
      <div
        className={cn(
          'p-3.5 rounded-lg border text-xs flex items-center gap-2.5 transition-colors',
          isDarkMode
            ? 'bg-[#0F172A] border-[#38BDF8]/40 text-[#BAE6FD]'
            : 'bg-sky-50 border-sky-200 text-sky-800'
        )}
      >
        <Info className="w-4 h-4 text-blue-500 shrink-0" />
        <span>
          Căn cứ Nghị định Bộ Tài Chính &amp; Nghị định 10/2022/NĐ-CP: Ô tô thuần điện (EV) được miễn 100% lệ phí trước bạ; lệ phí cấp biển số Hà Nội &amp; TP.HCM cố định 20.000.000 ₫/xe, các tỉnh còn lại 1.000.000 ₫/xe.
        </span>
      </div>

      {/* 6. Loading Skeleton */}
      {loading && (
        <div
          className={cn(
            'p-6 rounded-xl border animate-pulse space-y-4',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
          )}
        >
          <div className="h-5 w-56 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-slate-200 dark:bg-slate-800 rounded" />
            ))}
          </div>
        </div>
      )}

      {/* 7. Tab 1: Provincial Fees Table */}
      {!loading && !error && activeTab === 'fees' && (
        <>
          {isFeeListEmpty ? (
            <div
              className={cn(
                'p-16 rounded-xl border flex flex-col items-center justify-center gap-3 text-center transition-colors',
                isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
              )}
            >
              <Inbox className="w-8 h-8 text-slate-400" />
              <div className="text-sm font-bold">Chưa có dữ liệu biểu phí tỉnh thành</div>
              <p className="text-xs text-slate-400">
                Chưa tìm thấy tỉnh thành nào trong bảng dbo.tinh_thanh.
              </p>
            </div>
          ) : (
            <div
              className={cn(
                'rounded-xl border overflow-hidden transition-colors shadow-sm',
                isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
              )}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead
                    className={cn(
                      'font-mono uppercase text-[11px] border-b',
                      isDarkMode
                        ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40'
                        : 'bg-slate-50/80 text-slate-500 border-slate-200'
                    )}
                  >
                    <tr>
                      <th className="py-3 px-4">Tỉnh / Thành Phố</th>
                      <th className="py-3 px-4 text-center">Phân Vùng</th>
                      <th className="py-3 px-4 text-center">Trước Bạ (Xăng/Hybrid)</th>
                      <th className="py-3 px-4 text-center">Trước Bạ Xe Điện (EV)</th>
                      <th className="py-3 px-4 text-right">Lệ Phí Cấp Biển Số</th>
                      <th className="py-3 px-4 text-right">Đăng Kiểm</th>
                      <th className="py-3 px-4 text-right">Bảo Trì Đường Bộ (1 Năm)</th>
                      <th className="py-3 px-4 text-right">Bảo Hiểm TNDS Bắt Buộc</th>
                    </tr>
                  </thead>
                  <tbody
                    className={cn(
                      'divide-y font-sans',
                      isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100'
                    )}
                  >
                    {(provincialFees ?? []).map((row) => (
                      <tr
                        key={row.id}
                        className={cn(
                          'transition-colors',
                          isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50/80'
                        )}
                      >
                        <td className="py-3 px-4">
                          <span
                            className={cn(
                              'font-bold',
                              isDarkMode ? 'text-white' : 'text-slate-900'
                            )}
                          >
                            {row.tenTinhThanh}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded text-[10px] font-mono font-medium',
                              isDarkMode
                                ? 'bg-[#171F33] text-slate-300 border border-[#3E4850]/40'
                                : 'bg-slate-100 text-slate-700'
                            )}
                          >
                            {row.phanVungBienSo}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="100"
                              value={row.tyLePhiTruocBa ?? 10}
                              onChange={(e) =>
                                handleFeeChange(
                                  row.id,
                                  'tyLePhiTruocBa',
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className={cn(
                                'w-16 px-2 py-1 text-center font-mono font-bold rounded border text-xs',
                                isDarkMode
                                  ? 'bg-[#131B2E] border-[#3E4850]/50 text-[#89CEFF] focus:border-blue-500'
                                  : 'bg-white border-slate-300 text-blue-600 focus:border-blue-500'
                              )}
                            />
                            <span className="font-mono text-xs text-slate-400">%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-mono text-emerald-600 dark:text-[#10B981] font-bold">
                            0.0% (Miễn phí)
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <input
                            type="number"
                            step="100000"
                            min="0"
                            value={row.phiCapBienSo ?? 0}
                            onChange={(e) =>
                              handleFeeChange(
                                row.id,
                                'phiCapBienSo',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className={cn(
                              'w-28 px-2 py-1 text-right font-mono rounded border text-xs',
                              isDarkMode
                                ? 'bg-[#131B2E] border-[#3E4850]/50 text-white focus:border-blue-500'
                                : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                            )}
                          />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <input
                            type="number"
                            step="10000"
                            min="0"
                            value={row.phiDangKiem ?? 0}
                            onChange={(e) =>
                              handleFeeChange(
                                row.id,
                                'phiDangKiem',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className={cn(
                              'w-24 px-2 py-1 text-right font-mono rounded border text-xs',
                              isDarkMode
                                ? 'bg-[#131B2E] border-[#3E4850]/50 text-slate-300 focus:border-blue-500'
                                : 'bg-white border-slate-300 text-slate-700 focus:border-blue-500'
                            )}
                          />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <input
                            type="number"
                            step="10000"
                            min="0"
                            value={row.phiBaoTriDuongBo ?? 0}
                            onChange={(e) =>
                              handleFeeChange(
                                row.id,
                                'phiBaoTriDuongBo',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className={cn(
                              'w-28 px-2 py-1 text-right font-mono rounded border text-xs',
                              isDarkMode
                                ? 'bg-[#131B2E] border-[#3E4850]/50 text-slate-300 focus:border-blue-500'
                                : 'bg-white border-slate-300 text-slate-700 focus:border-blue-500'
                            )}
                          />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <input
                            type="number"
                            step="1000"
                            min="0"
                            value={row.phiBaoHiemTnds ?? 0}
                            onChange={(e) =>
                              handleFeeChange(
                                row.id,
                                'phiBaoHiemTnds',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className={cn(
                              'w-24 px-2 py-1 text-right font-mono rounded border text-xs',
                              isDarkMode
                                ? 'bg-[#131B2E] border-[#3E4850]/50 text-slate-300 focus:border-blue-500'
                                : 'bg-white border-slate-300 text-slate-700 focus:border-blue-500'
                            )}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* 8. Tab 2: Bank Loans Table */}
      {!loading && !error && activeTab === 'loans' && (
        <>
          {isLoanListEmpty ? (
            <div
              className={cn(
                'p-16 rounded-xl border flex flex-col items-center justify-center gap-3 text-center transition-colors',
                isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
              )}
            >
              <Inbox className="w-8 h-8 text-slate-400" />
              <div className="text-sm font-bold">Chưa có gói vay ngân hàng</div>
            </div>
          ) : (
            <div
              className={cn(
                'rounded-xl border overflow-hidden transition-colors shadow-sm',
                isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
              )}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead
                    className={cn(
                      'font-mono uppercase text-[11px] border-b',
                      isDarkMode
                        ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40'
                        : 'bg-slate-50/80 text-slate-500 border-slate-200'
                    )}
                  >
                    <tr>
                      <th className="py-3 px-4">Ngân Hàng Liên Kết</th>
                      <th className="py-3 px-4 text-center">Lãi Suất Ưu Đãi Năm Đầu</th>
                      <th className="py-3 px-4 text-center">Lãi Suất Thả Nổi Dự Kiến</th>
                      <th className="py-3 px-4 text-center">Kỳ Hạn Vay Tối Đa</th>
                      <th className="py-3 px-4 text-center">Hạn Mức Cho Vay (LTV)</th>
                    </tr>
                  </thead>
                  <tbody
                    className={cn(
                      'divide-y font-sans',
                      isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100'
                    )}
                  >
                    {(bankLoans ?? []).map((b) => (
                      <tr
                        key={b.id || b.bank}
                        className={cn(
                          'transition-colors',
                          isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50/80'
                        )}
                      >
                        <td className="py-3 px-4">
                          <span
                            className={cn(
                              'font-bold',
                              isDarkMode ? 'text-white' : 'text-slate-900'
                            )}
                          >
                            {b.bank}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="30"
                              value={b.firstYearRate ?? 0}
                              onChange={(e) =>
                                handleLoanChange(
                                  b.id,
                                  'firstYearRate',
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className={cn(
                                'w-20 px-2 py-1 text-center font-mono font-bold rounded border text-xs',
                                isDarkMode
                                  ? 'bg-[#131B2E] border-[#3E4850]/50 text-emerald-400 focus:border-emerald-500'
                                  : 'bg-white border-slate-300 text-emerald-600 focus:border-emerald-500'
                              )}
                            />
                            <span className="font-mono text-xs text-slate-400">%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="30"
                              value={b.floatRate ?? 0}
                              onChange={(e) =>
                                handleLoanChange(
                                  b.id,
                                  'floatRate',
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className={cn(
                                'w-20 px-2 py-1 text-center font-mono font-semibold rounded border text-xs',
                                isDarkMode
                                  ? 'bg-[#131B2E] border-[#3E4850]/50 text-amber-400 focus:border-amber-500'
                                  : 'bg-white border-slate-300 text-amber-600 focus:border-amber-500'
                              )}
                            />
                            <span className="font-mono text-xs text-slate-400">%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1">
                            <input
                              type="number"
                              step="1"
                              min="1"
                              max="20"
                              value={b.maxTenorYears ?? 8}
                              onChange={(e) =>
                                handleLoanChange(
                                  b.id,
                                  'maxTenorYears',
                                  parseInt(e.target.value, 10) || 1
                                )
                              }
                              className={cn(
                                'w-16 px-2 py-1 text-center font-mono rounded border text-xs',
                                isDarkMode
                                  ? 'bg-[#131B2E] border-[#3E4850]/50 text-white focus:border-blue-500'
                                  : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                              )}
                            />
                            <span className="font-sans text-xs text-slate-400">Năm</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1">
                            <span className="font-sans text-xs text-slate-400">Tối đa</span>
                            <input
                              type="number"
                              step="1"
                              min="10"
                              max="100"
                              value={b.maxLtvPercent ?? 80}
                              onChange={(e) =>
                                handleLoanChange(
                                  b.id,
                                  'maxLtvPercent',
                                  parseInt(e.target.value, 10) || 10
                                )
                              }
                              className={cn(
                                'w-16 px-2 py-1 text-center font-mono font-bold rounded border text-xs',
                                isDarkMode
                                  ? 'bg-[#131B2E] border-[#3E4850]/50 text-[#89CEFF] focus:border-blue-500'
                                  : 'bg-white border-slate-300 text-blue-600 focus:border-blue-500'
                              )}
                            />
                            <span className="font-mono text-xs text-slate-400">%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
