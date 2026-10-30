import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle,
  Clock,
  FileCheck,
  X,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import {
  MOCK_STAFF_REFUND_DOCKETS,
  type StaffRefundDocket,
} from '@/features/staff-operations/mocks/staff.mock';
import { cn, formatCurrencyVND } from '@/lib/utils';

export const StaffRefundDocketPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [dockets, setDockets] = useState<StaffRefundDocket[]>(MOCK_STAFF_REFUND_DOCKETS);
  const [activeTab, setActiveTab] = useState<'ALL' | 'REFUND_REQUESTED' | 'VERIFIED' | 'REJECTED'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedDocket, setSelectedDocket] = useState<StaffRefundDocket | null>(null);

  const filteredDockets = dockets.filter((d) => {
    const matchTab = activeTab === 'ALL' || d.status === activeTab;
    const matchSearch =
      d.customerName.toLowerCase().includes(search.toLowerCase()) ||
      d.depositCode.toLowerCase().includes(search.toLowerCase()) ||
      d.identityCardNumber.includes(search);
    return matchTab && matchSearch;
  });

  const handleVerifyDocket = (id: string) => {
    setDockets((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'VERIFIED' as const } : d))
    );
    alert('Đã hoàn tất biên bản thẩm định và chuyển hồ sơ lên Admin để duyệt giải ngân!');
    setSelectedDocket(null);
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
            Tiếp Nhận & Thẩm Định Hồ Sơ Xin Hoàn Tiền Cọc Xe 72 Giờ
          </h1>
          <p className={cn('text-sm mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Thẩm tra văn bản ngân hàng từ chối cho vay, đối soát 3 điều kiện rút cọc hợp đồng trước khi trình Admin giải ngân.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              'px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5',
              isDarkMode
                ? 'bg-amber-950/70 border-amber-800/40 text-amber-300'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            )}
          >
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Thẩm Định Trong 12h Kể Từ Khi Nhận Đơn</span>
          </span>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div
        className={cn(
          'p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors',
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-sm'
            : 'bg-white border-slate-200 shadow-xs'
        )}
      >
        <div className="flex items-center gap-2">
          {[
            { id: 'ALL', label: 'Tất Cả' },
            { id: 'REFUND_REQUESTED', label: 'Chờ Thẩm Định' },
            { id: 'VERIFIED', label: 'Đã Trình Admin' },
            { id: 'REJECTED', label: 'Đã Bác Bỏ' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                activeTab === tab.id
                  ? isDarkMode
                    ? 'bg-[#171F33] text-[#89CEFF] border border-[#89CEFF]/30'
                    : 'bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs'
                  : isDarkMode
                  ? 'text-[#88929B] hover:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            className={cn(
              'w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2',
              isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
            )}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã cọc, CCCD, tên khách..."
            className={cn(
              'w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border outline-none transition-colors',
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/50 text-white placeholder-[#88929B] focus:border-[#89CEFF]'
                : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500'
            )}
          />
        </div>
      </div>

      {/* 3. Dockets Table (<Datagrid>) */}
      <div
        className={cn(
          'rounded-xl border overflow-hidden transition-colors',
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
            : 'bg-white border-slate-200 shadow-sm'
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className={cn(
                'font-mono uppercase text-[11px] border-b',
                isDarkMode ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40' : 'bg-slate-50 text-slate-500 border-slate-200'
              )}
            >
              <tr>
                <th className="py-3 px-4">Mã Phiếu Cọc</th>
                <th className="py-3 px-4">Khách Hàng & CCCD</th>
                <th className="py-3 px-4">Dòng Xe</th>
                <th className="py-3 px-4 text-right">Số Tiền Hoàn Cọc</th>
                <th className="py-3 px-4">Lý Do Đề Nghị Rút</th>
                <th className="py-3 px-4 text-center">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className={cn('divide-y font-sans', isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100')}>
              {filteredDockets.map((d) => (
                <tr
                  key={d.id}
                  className={cn(
                    'transition-colors',
                    isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50'
                  )}
                >
                  <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-[#89CEFF]">
                    {d.depositCode}
                  </td>
                  <td className="py-3 px-4">
                    <div className={cn('font-semibold', isDarkMode ? 'text-white' : 'text-slate-900')}>{d.customerName}</div>
                    <div className={cn('text-[11px] font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                      CCCD: {d.identityCardNumber}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={cn('font-medium', isDarkMode ? 'text-white' : 'text-slate-800')}>{d.carModel}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-red-600 dark:text-red-400">
                    {formatCurrencyVND(d.depositAmount)}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <span className={cn('text-xs line-clamp-1', isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-700')}>{d.reason}</span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                        d.status === 'REFUND_REQUESTED' &&
                          (isDarkMode
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'),
                        d.status === 'VERIFIED' &&
                          (isDarkMode
                            ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'),
                        d.status === 'REJECTED' &&
                          (isDarkMode
                            ? 'bg-red-950/70 text-red-300 border border-red-800/40'
                            : 'bg-red-50 text-red-700 border border-red-200')
                      )}
                    >
                      {d.status === 'REFUND_REQUESTED' ? 'Chờ Thẩm Định' : d.status === 'VERIFIED' ? 'Đã Trình Admin' : 'Bác Bỏ'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedDocket(d)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm"
                    >
                      Thẩm Tra Hồ Sơ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Ngăn kéo Thẩm định chứng từ (<DocketDetailSheet> 580px) */}
      {selectedDocket && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            className={cn(
              'w-full max-w-xl h-full overflow-y-auto border-l p-6 space-y-5 shadow-2xl transition-colors',
              isDarkMode ? 'bg-[#0B1326] border-[#3E4850] text-[#DAE2FD]' : 'bg-white border-slate-200 text-slate-800'
            )}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#3E4850]/40">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-blue-500 uppercase font-bold">Thẩm Định Hồ Sơ Rút Cọc</span>
                <h3 className={cn('text-base font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  Hồ Sơ Rút Cọc {selectedDocket.depositCode}
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

            {/* Refund Info */}
            <div className={cn('p-4 rounded-xl border space-y-2 text-xs', isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200')}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className={cn('text-[10px] uppercase font-mono block', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>Khách hàng</span>
                  <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{selectedDocket.customerName}</strong>
                  <div className="text-[11px] font-mono">CCCD: {selectedDocket.identityCardNumber}</div>
                </div>
                <div>
                  <span className={cn('text-[10px] uppercase font-mono block', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>Số tiền cọc cần hoàn</span>
                  <span className="font-mono font-bold text-red-500 text-sm">
                    {formatCurrencyVND(selectedDocket.depositAmount)}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-[#3E4850]/40">
                <span className={cn('text-[10px] uppercase font-mono block', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>Tài khoản thụ hưởng nhận lại cọc</span>
                <div className="font-bold">{selectedDocket.bankAccountHolder} • STK: {selectedDocket.bankAccountNumber}</div>
                <div className="text-[11px] text-blue-500">{selectedDocket.bankName}</div>
              </div>
            </div>

            {/* Rejection Letter Preview (<PDFViewer>) */}
            <div className={cn('p-4 rounded-xl border space-y-2', isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200')}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase font-mono flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>Văn Bản Ngân Hàng Từ Chối Cấp Tín Dụng</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-500 font-bold">MỘC ĐỎ HỢP LỆ</span>
              </div>
              <div className={cn('p-3 rounded-lg border flex items-center justify-between text-xs', isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200')}>
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-blue-500" />
                  <span className="font-mono text-[11px]">{selectedDocket.rejectionLetterFileName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Đang mở xem tài liệu đính kèm: ${selectedDocket.rejectionLetterFileName}`)}
                  className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold cursor-pointer"
                >
                  Xem PDF
                </button>
              </div>
            </div>

            {/* Checklist 3 Điều Kiện Bắt Buộc */}
            <div className={cn('p-4 rounded-xl border space-y-2 text-xs', isDarkMode ? 'bg-[#0F172A] border-blue-500/30' : 'bg-sky-50 border-sky-200')}>
              <div className="font-bold text-blue-600 dark:text-[#89CEFF] uppercase font-mono">
                Checklist 3 Điều Kiện Thẩm Định Bắt Buộc:
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>(1) Khách hàng gửi đơn trong hạn hiệu lực 72 giờ kể từ lúc cọc</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>(2) Văn bản từ chối cấp tín dụng từ Ngân hàng có mộc đỏ hợp lệ</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>(3) Xe vật lý trong kho chưa xuất Hóa đơn Giá trị Gia tăng (VAT)</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-[#3E4850]/40">
              <button
                type="button"
                onClick={() => handleRejectDocket(selectedDocket.id)}
                className="flex-1 py-2.5 rounded-lg border border-red-300 dark:border-red-800/40 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-xs font-bold cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors"
              >
                Bác Bỏ Yêu Cầu
              </button>
              <button
                type="button"
                onClick={() => handleVerifyDocket(selectedDocket.id)}
                className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
              >
                Trình Admin Phê Duyệt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
