import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  RefreshCw,
  X,
  Loader2,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { staffService } from '@/features/staff-operations/services/staff.service';
import type { StaffReturnItem } from '@/types/staff.types';
import { cn } from '@/lib/utils';

export const ReturnManagementPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [returnItems, setReturnItems] = useState<StaffReturnItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'RETURN_REQUESTED' | 'INSPECTING' | 'RESOLVED' | 'REJECTED' | 'APPROVED' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<StaffReturnItem | null>(null);

  // Inspection drawer state
  const [inspectionNote, setInspectionNote] = useState('');

  const fetchReturns = async () => {
    try {
      const data = await staffService.getReturnItems();
      setReturnItems(data);
    } catch (err) {
      console.error('Lỗi tải danh sách đổi trả từ database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const filteredItems = useMemo(() => {
    return returnItems.filter((item) => {
      const matchTab = activeTab === 'ALL' || item.status === activeTab;
      const matchQuery =
        !searchQuery ||
        item.rmaCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.originalOrderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerPhone.includes(searchQuery) ||
        item.accessoryName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchQuery;
    });
  }, [returnItems, activeTab, searchQuery]);

  const handleResolve = async (id: string, resolution: 'REPLACE_NEW' | 'REFUND_MONEY' | 'REJECT') => {
    const cleanId = id.replace(/\D/g, '') || '1';
    try {
      await staffService.resolveReturnItem(cleanId, resolution, inspectionNote);
      setReturnItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: 'RESOLVED' as const,
                resolution,
                inspectionNotes: inspectionNote || 'Đã kiểm tra kỹ thuật tại kho.',
              }
            : item
        )
      );
      setSelectedItem(null);
      setInspectionNote('');
      alert('Đã lưu kết quả giám định và phương án xử lý đổi trả vào database!');
    } catch (err) {
      console.error('Lỗi xử lý đổi trả:', err);
    }
  };

  return (
    <div
      className={cn(
        'space-y-6 antialiased transition-colors duration-300',
        isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'
      )}
    >
      {/* Header Toolbar */}
      <div
        className={cn(
          'flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border transition-colors',
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg' : 'bg-white border-slate-200 shadow-sm'
        )}
      >
        <div>
          <h1 className={cn('text-xl md:text-2xl font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
            Kiểm Định & Xử Lý Đổi Trả Phụ Kiện (RMA - UC24)
          </h1>
          <p className={cn('text-sm mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Dữ liệu trực tiếp từ SQL Server: Tiếp nhận kiện hàng hoàn trả, đối soát tem bảo hành niêm phong và xuất kho đổi mới.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchReturns}
          className={cn(
            'px-3.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors',
            isDarkMode
              ? 'bg-[#131B2E] border-[#3E4850]/50 hover:bg-[#1C2640] text-slate-200'
              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
          )}
        >
          <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
          Làm mới
        </button>
      </div>

      {/* Search & Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã RMA, đơn gốc, tên khách hoặc phụ kiện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500',
              isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 text-white placeholder-[#88929B]' : 'bg-white border-slate-200'
            )}
          />
        </div>

        <div className="flex bg-slate-100 dark:bg-[#131B2E] p-1 rounded-xl border border-slate-200 dark:border-[#3E4850]/40 text-xs">
          {(['ALL', 'APPROVED', 'COMPLETED'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer',
                activeTab === tab ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500'
              )}
            >
              {tab === 'ALL' && 'Tất Cả'}
              {tab === 'APPROVED' && 'Đã Tiếp Nhận Kho'}
              {tab === 'COMPLETED' && 'Đã Đổi Mới / Hoàn Tất'}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-xs font-mono text-slate-400">Đang tải danh sách đổi trả từ cơ sở dữ liệu...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className={cn('p-12 text-center rounded-xl border text-sm font-mono', isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 text-slate-400' : 'bg-white border-slate-200 text-slate-500')}>
          Không tìm thấy yêu cầu đổi trả nào trong cơ sở dữ liệu.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                'p-5 rounded-xl border space-y-3 transition-all hover:shadow-md flex flex-col justify-between',
                isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
              )}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#3E4850]/30">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-[#89CEFF]">
                    {item.rmaCode} • Đơn gốc: {item.originalOrderCode}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{item.requestedAt}</span>
                </div>

                <div className="mt-3 space-y-1 text-xs">
                  <div className="font-bold text-sm">{item.customerName} - {item.customerPhone}</div>
                  <div className="font-semibold text-blue-600 dark:text-blue-400">{item.accessoryName}</div>
                </div>

                <div className="mt-2.5 p-3 rounded-lg bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-[#3E4850]/30 text-xs">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Lý do yêu cầu đổi trả:</span>
                  <p className="mt-0.5 text-slate-600 dark:text-slate-300 italic">{item.reason}</p>
                </div>

                {item.inspectionNotes && (
                  <div className="mt-2 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs text-emerald-800 dark:text-emerald-300">
                    <strong>Ghi chú kỹ thuật:</strong> {item.inspectionNotes}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#3E4850]/30 flex items-center justify-between">
                <span
                  className={cn(
                    'text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border',
                    item.status === 'APPROVED' && 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200',
                    item.status === 'COMPLETED' && 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200',
                    item.status === 'RESOLVED' && 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200'
                  )}
                >
                  {item.status === 'APPROVED' ? 'ĐÃ TIẾP NHẬN' : item.status === 'COMPLETED' ? 'ĐÃ ĐỔI MỚI' : item.status}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  Giám Định & Xử Lý
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal giám định kỹ thuật */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={cn('w-full max-w-lg p-6 rounded-2xl border space-y-4 shadow-2xl', isDarkMode ? 'bg-[#0B1326] border-[#3E4850]' : 'bg-white border-slate-200')}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#3E4850]/40">
              <h3 className={cn('text-base font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                Biên Bản Giám Định Kỹ Thuật {selectedItem.rmaCode}
              </h3>
              <button type="button" onClick={() => setSelectedItem(null)} className="p-1.5 rounded-lg border cursor-pointer border-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-[#3E4850]/40">
                <div><strong>Sản phẩm:</strong> {selectedItem.accessoryName}</div>
                <div><strong>Khách hàng:</strong> {selectedItem.customerName} ({selectedItem.customerPhone})</div>
                <div><strong>Lý do gửi trả:</strong> {selectedItem.reason}</div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Ghi chú kết quả giám định tại kho:</label>
                <textarea
                  rows={3}
                  value={inspectionNote}
                  onChange={(e) => setInspectionNote(e.target.value)}
                  placeholder="Kiểm tra bao bì, tem bảo hành, phụ kiện kèm theo..."
                  className="w-full p-2.5 rounded-xl border text-xs bg-white dark:bg-[#131B2E] border-slate-200 dark:border-[#3E4850]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleResolve(selectedItem.id, 'REJECT')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-red-300 text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  Từ Chối Đổi Trả
                </button>
                <button
                  type="button"
                  onClick={() => handleResolve(selectedItem.id, 'REPLACE_NEW')}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  Duyệt Đổi Hàng Mới
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
