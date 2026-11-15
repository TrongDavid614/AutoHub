import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  X,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { staffService } from '@/features/staff-operations/services/staff.service';
import type { StaffRefundDocket } from '@/types/staff.types';
import { cn, formatCurrencyVND } from '@/lib/utils';

export const StaffRefundDocketPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [dockets, setDockets] = useState<StaffRefundDocket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'REFUND_REQUESTED' | 'VERIFIED' | 'REFUNDED' | 'REJECTED'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedDocket, setSelectedDocket] = useState<StaffRefundDocket | null>(null);
  const [rejectModal, setRejectModal] = useState<{ docketId: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchDockets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await staffService.getRefundDockets();
      setDockets(data);
    } catch (err) {
      console.error('Lỗi tải hồ sơ hoàn cọc từ database:', err);
      setError('Không thể tải danh sách hồ sơ hoàn cọc từ SQL Server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    staffService
      .getRefundDockets()
      .then((data) => {
        if (isMounted) {
          setDockets(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Lỗi tải hồ sơ hoàn cọc từ database:', err);
          setError('Không thể tải danh sách hồ sơ hoàn cọc từ SQL Server.');
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredDockets = (dockets ?? []).filter((d) => {
    const normalizedStatus = d.status === 'PENDING' ? 'REFUND_REQUESTED' : d.status;
    const matchTab = activeTab === 'ALL' || normalizedStatus === activeTab;
    const matchSearch =
      d.customerName.toLowerCase().includes(search.toLowerCase()) ||
      d.depositCode.toLowerCase().includes(search.toLowerCase()) ||
      d.identityCardNumber.includes(search);
    return matchTab && matchSearch;
  });

  const handleVerifyDocket = async (id: string) => {
    try {
      await staffService.verifyRefundDocket(id);
      await fetchDockets();
      showToast('success', 'Đã hoàn tất biên bản thẩm định đối soát và lưu vào database!');
      setSelectedDocket(null);
    } catch (err) {
      console.error('Lỗi thẩm định hoàn cọc:', err);
      showToast('error', 'Không thể cập nhật hồ sơ hoàn cọc. Vui lòng thử lại.');
    }
  };

  const executeRejectDocket = async () => {
    if (!rejectModal || !rejectReason.trim()) return;
    try {
      await staffService.rejectRefundDocket(rejectModal.docketId, rejectReason.trim());
      await fetchDockets();
      showToast('success', 'Đã bác bỏ hồ sơ hoàn cọc và lưu lý do vào database!');
      setRejectModal(null);
      setRejectReason('');
      setSelectedDocket(null);
    } catch (err) {
      console.error('Lỗi bác bỏ hồ sơ hoàn cọc:', err);
      showToast('error', 'Không thể bác bỏ hồ sơ hoàn cọc trên máy chủ. Vui lòng thử lại.');
    }
  };

  return (
    <div
      className={cn(
        'space-y-6 antialiased transition-colors duration-300',
        isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'
      )}
    >
      {/* 1. Header Toolbar */}
      <div
        className={cn(
          'flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border transition-colors',
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
            : 'bg-white border-slate-200 shadow-sm'
        )}
      >
        <div>
          <h1 className={cn('text-xl md:text-2xl font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
            Thẩm Định & Đối Soát Hồ Sơ Hoàn Cọc Xe (UC40)
          </h1>
          <p className={cn('text-sm mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Dữ liệu trực tiếp từ SQL Server: Thẩm tra lý do rút cọc, kiểm tra chứng từ ngân hàng từ chối tín dụng trước khi trình duyệt.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchDockets}
            className={cn(
              'px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors',
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/50 hover:bg-[#1C2640] text-slate-200'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
            )}
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
            Làm mới
          </button>
        </div>
      </div>

      {/* 2. Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên khách, mã cọc hoặc số CCCD..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              'w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500',
              isDarkMode
                ? 'bg-[#0B1326] border-[#3E4850]/40 text-white placeholder-[#88929B]'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
            )}
          />
        </div>
        <div className="flex bg-slate-100 dark:bg-[#131B2E] p-1 rounded-xl border border-slate-200 dark:border-[#3E4850]/40 text-xs">
          {(['ALL', 'REFUND_REQUESTED', 'VERIFIED', 'REFUNDED', 'REJECTED'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer',
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDarkMode
                    ? 'text-[#88929B] hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
              )}
            >
              {tab === 'ALL' && 'Tất Cả'}
              {tab === 'REFUND_REQUESTED' && 'Chờ Thẩm Định'}
              {tab === 'VERIFIED' && 'Đã Đối Soát'}
              {tab === 'REFUNDED' && 'Đã Hoàn Tiền'}
              {tab === 'REJECTED' && 'Từ Chối'}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Dockets List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-xs font-mono text-slate-400">Đang tải hồ sơ hoàn cọc từ cơ sở dữ liệu...</p>
        </div>
      ) : error ? (
        <div className={cn('p-10 text-center rounded-xl border space-y-3', isDarkMode ? 'bg-[#0B1326] border-red-900/50 text-red-300' : 'bg-red-50 border-red-200 text-red-700')}>
          <p className="text-sm font-semibold">{error}</p>
          <button
            type="button"
            onClick={fetchDockets}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      ) : filteredDockets.length === 0 ? (
        <div className={cn('p-12 text-center rounded-xl border text-sm font-mono', isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 text-slate-400' : 'bg-white border-slate-200 text-slate-500')}>
          Không tìm thấy hồ sơ hoàn cọc nào trong cơ sở dữ liệu.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDockets.map((item) => (
            <div
              key={item.id}
              className={cn(
                'p-5 rounded-xl border space-y-3 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between',
                isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
              )}
              onClick={() => setSelectedDocket(item)}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-[#89CEFF]">
                    {item.depositCode}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border',
                      (item.status === 'REFUND_REQUESTED' || item.status === 'PENDING') && 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200',
                      (item.status === 'VERIFIED' || item.status === 'APPROVED') && 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200',
                      item.status === 'REFUNDED' && 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200',
                      item.status === 'REJECTED' && 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border-red-200'
                    )}
                  >
                    {(item.status === 'REFUND_REQUESTED' || item.status === 'PENDING')
                      ? 'CHỜ ĐỐI SOÁT'
                      : item.status === 'VERIFIED'
                        ? 'ĐÃ ĐỐI SOÁT'
                        : item.status === 'APPROVED'
                          ? 'ĐÃ DUYỆT'
                          : item.status === 'REJECTED'
                            ? 'ĐÃ TỪ CHỐI'
                            : 'ĐÃ HOÀN TIỀN'}
                  </span>
                </div>

                <h3 className={cn('text-base font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  {item.customerName}
                </h3>
                <div className="text-xs font-mono text-slate-400">CCCD: {item.identityCardNumber}</div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">{item.carModel}</div>

                <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-[#3E4850]/30 text-xs">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Số tiền xin hoàn</span>
                  <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrencyVND(item.depositAmount)}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2 italic">
                  "{item.reason}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#3E4850]/30 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>{item.submittedAt}</span>
                <span className="text-blue-500 font-bold">Xem hồ sơ &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal chi tiết thẩm định */}
      {selectedDocket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={cn('w-full max-w-lg p-6 rounded-2xl border space-y-4 shadow-2xl', isDarkMode ? 'bg-[#0B1326] border-[#3E4850]' : 'bg-white border-slate-200')}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#3E4850]/40">
              <div>
                <span className="text-[10px] uppercase font-mono text-blue-500 font-bold block">Biên Bản Thẩm Định Hồ Sơ</span>
                <h3 className={cn('text-base font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  {selectedDocket.depositCode} • {selectedDocket.customerName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDocket(null)}
                className="p-1.5 rounded-lg border cursor-pointer border-slate-200 dark:border-[#3E4850]/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-[#3E4850]/40 space-y-1.5">
                <div><strong>Mẫu xe:</strong> {selectedDocket.carModel}</div>
                <div><strong>Tài khoản thụ hưởng:</strong> {selectedDocket.bankAccountNumber} ({selectedDocket.bankName})</div>
                <div><strong>Chủ tài khoản:</strong> {selectedDocket.bankAccountHolder}</div>
                <div><strong>Số tiền cọc:</strong> <span className="font-bold text-emerald-500">{formatCurrencyVND(selectedDocket.depositAmount)}</span></div>
              </div>

              <div>
                <span className="font-bold text-slate-400 text-[10px] uppercase block mb-1">Lý Do Đề Nghị Hoàn Cọc</span>
                <div className="p-3 rounded-xl border bg-slate-50 dark:bg-[#131B2E] border-slate-200 dark:border-[#3E4850]/40">
                  {selectedDocket.reason}
                </div>
              </div>

              {selectedDocket.rejectionReason && (
                <div>
                  <span className="font-bold text-red-400 text-[10px] uppercase block mb-1">Lý Do Từ Chối Đã Lưu</span>
                  <div className="p-3 rounded-xl border bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-300">
                    {selectedDocket.rejectionReason}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 dark:border-[#3E4850]/40 flex justify-end gap-2">
                {selectedDocket.status !== 'REFUNDED' && selectedDocket.status !== 'REJECTED' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setRejectModal({ docketId: selectedDocket.id })}
                      className="px-4 py-2 rounded-lg text-xs font-bold border border-red-300 dark:border-red-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                    >
                      Từ Chối
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVerifyDocket(selectedDocket.id)}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    >
                      Xác Nhận Thẩm Định
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Reject Reason Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={cn(
              'w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4',
              isDarkMode ? 'bg-[#171F33] border-[#3E4850]/60 text-[#DAE2FD]' : 'bg-white border-slate-200 text-slate-800'
            )}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-sm text-red-500">Bác Bỏ Hồ Sơ Hoàn Cọc</h3>
              <button
                type="button"
                onClick={() => {
                  setRejectModal(null);
                  setRejectReason('');
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Nhập lý do bác bỏ yêu cầu:</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ví dụ: Đã quá thời hạn 72h hoàn cọc theo quy định hoặc thiếu giấy xác nhận ngân hàng..."
                rows={3}
                className={cn(
                  'w-full p-2.5 rounded-xl border text-xs outline-none transition-colors resize-none',
                  isDarkMode ? 'bg-[#101726] border-[#3E4850] text-white focus:border-red-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-red-500'
                )}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setRejectModal(null);
                  setRejectReason('');
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={!rejectReason.trim()}
                onClick={executeRejectDocket}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white cursor-pointer shadow-sm"
              >
                Xác Nhận Bác Bỏ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-4 duration-200',
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
          )}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};
