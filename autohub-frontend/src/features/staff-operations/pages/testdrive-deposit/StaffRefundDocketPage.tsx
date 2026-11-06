import React, { useState, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState<'ALL' | 'REFUND_REQUESTED' | 'VERIFIED' | 'REFUNDED' | 'REJECTED'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedDocket, setSelectedDocket] = useState<StaffRefundDocket | null>(null);

  const fetchDockets = async () => {
    try {
      const data = await staffService.getRefundDockets();
      setDockets(data);
    } catch (err) {
      console.error('Lỗi tải hồ sơ hoàn cọc từ database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDockets();
  }, []);

  const filteredDockets = dockets.filter((d) => {
    const matchTab = activeTab === 'ALL' || d.status === activeTab;
    const matchSearch =
      d.customerName.toLowerCase().includes(search.toLowerCase()) ||
      d.depositCode.toLowerCase().includes(search.toLowerCase()) ||
      d.identityCardNumber.includes(search);
    return matchTab && matchSearch;
  });

  const handleVerifyDocket = async (id: string) => {
    try {
      // Extract numeric id if format is REF-DOC-0X
      const cleanId = id.replace(/\D/g, '') || '1';
      await staffService.verifyRefundDocket(cleanId);
      setDockets((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: 'VERIFIED' as const } : d))
      );
      alert('Đã hoàn tất biên bản thẩm định đối soát và lưu vào database!');
      setSelectedDocket(null);
    } catch (err) {
      console.error('Lỗi thẩm định hoàn cọc:', err);
      alert('Không thể cập nhật hồ sơ hoàn cọc. Vui lòng thử lại.');
    }
  };

  const handleRejectDocket = (id: string) => {
    const reason = prompt('Nhập lý do bác bỏ yêu cầu hoàn cọc:');
    if (!reason) return;
    setDockets((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'REJECTED' as const } : d))
    );
    setSelectedDocket(null);
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
          {(['ALL', 'REFUND_REQUESTED', 'VERIFIED', 'REFUNDED'] as const).map((tab) => (
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
                      item.status === 'REFUND_REQUESTED' && 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200',
                      item.status === 'VERIFIED' && 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200',
                      item.status === 'REFUNDED' && 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200'
                    )}
                  >
                    {item.status === 'REFUND_REQUESTED' ? 'CHỜ ĐỐI SOÁT' : item.status === 'VERIFIED' ? 'ĐÃ ĐỐI SOÁT' : 'ĐÃ HOÀN TIỀN'}
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

              <div className="pt-3 border-t border-slate-200 dark:border-[#3E4850]/40 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleRejectDocket(selectedDocket.id)}
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
