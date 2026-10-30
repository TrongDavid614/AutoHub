import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Eye,
  FileCheck,
  RefreshCw,
  X,
  Image as ImageIcon,
  CheckSquare,
  Info,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { MOCK_STAFF_RETURN_ITEMS, type StaffReturnItem } from '@/features/staff-operations/mocks/staff.mock';
import { cn } from '@/lib/utils';

export const ReturnManagementPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [returnItems, setReturnItems] = useState<StaffReturnItem[]>(MOCK_STAFF_RETURN_ITEMS);
  const [activeTab, setActiveTab] = useState<'ALL' | 'RETURN_REQUESTED' | 'INSPECTING' | 'RESOLVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<StaffReturnItem | null>(null);

  // Inspection drawer state
  const [checklist, setChecklist] = useState({
    intactSeal: true,
    noBurnMark: true,
    fullAccessories: true,
    defectConfirmed: true,
  });
  const [inspectionNote, setInspectionNote] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const filteredItems = useMemo(() => {
    return returnItems.filter((item) => {
      const matchTab = activeTab === 'ALL' ? true : item.status === activeTab;
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

  const counts = useMemo(() => {
    return {
      ALL: returnItems.length,
      RETURN_REQUESTED: returnItems.filter((i) => i.status === 'RETURN_REQUESTED').length,
      INSPECTING: returnItems.filter((i) => i.status === 'INSPECTING').length,
      RESOLVED: returnItems.filter((i) => i.status === 'RESOLVED').length,
      REJECTED: returnItems.filter((i) => i.status === 'REJECTED').length,
    };
  }, [returnItems]);

  const handleOpenInspection = (item: StaffReturnItem) => {
    setSelectedItem(item);
    setInspectionNote(item.inspectionNotes || '');
    if (item.status === 'RETURN_REQUESTED') {
      setReturnItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: 'INSPECTING' } : i))
      );
    }
  };

  const handleResolveAction = (resolution: 'REPLACE_NEW' | 'REFUND_MONEY' | 'REJECT') => {
    if (!selectedItem) return;

    if (resolution === 'REJECT' && !inspectionNote.trim()) {
      alert('Vui lòng ghi rõ lý do từ chối vào biên bản giám định!');
      return;
    }

    const updatedStatus = resolution === 'REJECT' ? 'REJECTED' : 'RESOLVED';

    setReturnItems((prev) =>
      prev.map((i) =>
        i.id === selectedItem.id
          ? {
              ...i,
              status: updatedStatus,
              resolution,
              inspectionNotes: inspectionNote || (resolution === 'REPLACE_NEW' ? 'Chấp nhận đổi hàng mới 0đ' : 'Chấp thuận hoàn tiền'),
            }
          : i
      )
    );

    const rma = selectedItem.rmaCode;
    setSelectedItem(null);

    if (resolution === 'REPLACE_NEW') {
      showToast(`Hồ sơ ${rma}: Đã tạo đơn phụ kiện mới 0đ xuất kho bàn giao khách!`);
    } else if (resolution === 'REFUND_MONEY') {
      showToast(`Hồ sơ ${rma}: Đã chuyển lệnh hoàn tiền và nhập phụ kiện về kho thanh lý!`);
    } else {
      showToast(`Hồ sơ ${rma}: Đã lập biên bản từ chối đổi trả kèm lý do chi tiết.`);
    }
  };

  return (
    <div className={cn('space-y-6 transition-colors duration-300', isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800')}>
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-3 px-4 py-3 bg-emerald-600 text-white text-sm font-medium rounded-xl shadow-xl border border-emerald-500 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div
        className={cn(
          'flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border transition-colors shadow-sm',
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
        )}
      >
        <div>
          <h1 className={cn('text-xl md:text-2xl font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
            Tiếp Nhận & Thẩm Định Đổi Trả Phụ Kiện
          </h1>
          <p className={cn('text-sm mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Giám định kiện hàng hoàn trả, đối soát bằng chứng hình ảnh và ra quyết định đổi mới / hoàn tiền
          </p>
        </div>

        {/* Quick status counters */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'px-3 py-2 rounded-xl border text-right',
              isDarkMode
                ? 'bg-[#171F33] border-amber-500/30 text-amber-400'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            )}
          >
            <div className="text-xs font-medium opacity-80">Chờ Tiếp Nhận</div>
            <div className="text-lg font-mono font-bold">{counts.RETURN_REQUESTED}</div>
          </div>
          <div
            className={cn(
              'px-3 py-2 rounded-xl border text-right',
              isDarkMode
                ? 'bg-[#171F33] border-blue-500/30 text-blue-400'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            )}
          >
            <div className="text-xs font-medium opacity-80">Đang Giám Định</div>
            <div className="text-lg font-mono font-bold">{counts.INSPECTING}</div>
          </div>
          <div
            className={cn(
              'px-3 py-2 rounded-xl border text-right',
              isDarkMode
                ? 'bg-[#171F33] border-emerald-500/30 text-emerald-400'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            )}
          >
            <div className="text-xs font-medium opacity-80">Đã Xử Lý Xong</div>
            <div className="text-lg font-mono font-bold">{counts.RESOLVED}</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div
          className={cn(
            'flex p-1 rounded-xl border overflow-x-auto transition-colors',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-slate-100 border-slate-200'
          )}
        >
          <button
            onClick={() => setActiveTab('ALL')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all',
              activeTab === 'ALL'
                ? isDarkMode
                  ? 'bg-[#171F33] text-white border border-[#3E4850]/50 shadow-sm'
                  : 'bg-white text-slate-900 shadow-sm'
                : isDarkMode
                ? 'text-[#88929B] hover:text-[#DAE2FD]'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Tất cả ({counts.ALL})
          </button>
          <button
            onClick={() => setActiveTab('RETURN_REQUESTED')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all',
              activeTab === 'RETURN_REQUESTED'
                ? isDarkMode
                  ? 'bg-[#171F33] text-amber-400 border border-amber-500/40 shadow-sm'
                  : 'bg-white text-amber-600 shadow-sm'
                : isDarkMode
                ? 'text-[#88929B] hover:text-[#DAE2FD]'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <span>Chờ tiếp nhận</span>
            <span
              className={cn(
                'px-1.5 py-0.2 rounded-full font-mono text-[10px]',
                isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
              )}
            >
              {counts.RETURN_REQUESTED}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('INSPECTING')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all',
              activeTab === 'INSPECTING'
                ? isDarkMode
                  ? 'bg-[#171F33] text-blue-400 border border-blue-500/40 shadow-sm'
                  : 'bg-white text-blue-600 shadow-sm'
                : isDarkMode
                ? 'text-[#88929B] hover:text-[#DAE2FD]'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <span>Đang giám định</span>
            <span
              className={cn(
                'px-1.5 py-0.2 rounded-full font-mono text-[10px]',
                isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
              )}
            >
              {counts.INSPECTING}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('RESOLVED')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all',
              activeTab === 'RESOLVED'
                ? isDarkMode
                  ? 'bg-[#171F33] text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'bg-white text-emerald-600 shadow-sm'
                : isDarkMode
                ? 'text-[#88929B] hover:text-[#DAE2FD]'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Đã giải quyết ({counts.RESOLVED})
          </button>
          <button
            onClick={() => setActiveTab('REJECTED')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all',
              activeTab === 'REJECTED'
                ? isDarkMode
                  ? 'bg-[#171F33] text-rose-400 border border-rose-500/40 shadow-sm'
                  : 'bg-white text-rose-600 shadow-sm'
                : isDarkMode
                ? 'text-[#88929B] hover:text-[#DAE2FD]'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Từ chối ({counts.REJECTED})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className={cn('w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm mã RMA, mã đơn, khách, phụ kiện..."
            className={cn(
              'w-full pl-10 pr-4 py-2 text-sm rounded-xl border focus:outline-none transition-colors',
              isDarkMode
                ? 'bg-[#0B1326] border-[#3E4850]/40 text-white placeholder:text-[#88929B] focus:border-[#89CEFF]'
                : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-rose-500/40'
            )}
          />
        </div>
      </div>

      {/* Datagrid */}
      <div
        className={cn(
          'rounded-2xl border overflow-hidden shadow-sm transition-colors',
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead
              className={cn(
                'text-xs uppercase tracking-wider border-b font-semibold transition-colors',
                isDarkMode
                  ? 'bg-[#131B2E] text-[#BEC8D2] border-[#3E4850]/40'
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              )}
            >
              <tr>
                <th className="py-3.5 px-4">Mã Yêu Cầu</th>
                <th className="py-3.5 px-4">Đơn Gốc / Khách Hàng</th>
                <th className="py-3.5 px-4">Phụ Kiện Hoàn Trả</th>
                <th className="py-3.5 px-4">Lý Do Đổi Trả</th>
                <th className="py-3.5 px-4">Ngày Gửi</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody
              className={cn(
                'divide-y transition-colors',
                isDarkMode ? 'divide-[#3E4850]/20' : 'divide-slate-200'
              )}
            >
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className={cn('py-12 text-center', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>
                    <RotateCcw className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    Không tìm thấy yêu cầu đổi trả nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className={cn(
                      'transition-colors',
                      isDarkMode ? 'hover:bg-[#171F33]' : 'hover:bg-slate-50'
                    )}
                  >
                    {/* RMA Code */}
                    <td className="py-4 px-4 font-mono font-bold text-rose-600 dark:text-rose-400">
                      {item.rmaCode}
                    </td>

                    {/* Original Order & Customer */}
                    <td className="py-4 px-4">
                      <div className="font-mono text-xs font-semibold text-blue-600 dark:text-[#89CEFF]">
                        {item.originalOrderCode}
                      </div>
                      <div className={cn('font-semibold mt-0.5', isDarkMode ? 'text-white' : 'text-slate-900')}>
                        {item.customerName}
                      </div>
                      <div className={cn('font-mono text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                        {item.customerPhone}
                      </div>
                    </td>

                    {/* Accessory */}
                    <td className="py-4 px-4">
                      <div className={cn('font-medium', isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-900')}>
                        {item.accessoryName}
                      </div>
                      <div className={cn('flex items-center gap-1 text-xs mt-1', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                        <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                        <span>{item.evidenceImages.length} ảnh bằng chứng</span>
                      </div>
                    </td>

                    {/* Reason */}
                    <td className="py-4 px-4 text-xs max-w-xs">
                      <div
                        className={cn(
                          'p-2 rounded-lg border',
                          isDarkMode
                            ? 'bg-[#171F33] border-[#3E4850]/50 text-[#DAE2FD]'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        )}
                      >
                        {item.reason}
                      </div>
                    </td>

                    {/* Date */}
                    <td className={cn('py-4 px-4 text-xs font-mono whitespace-nowrap', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                      {item.requestedAt}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      {item.status === 'RETURN_REQUESTED' && (
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border',
                            isDarkMode
                              ? 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          )}
                        >
                          <AlertTriangle className="w-3 h-3" />
                          Chờ tiếp nhận
                        </span>
                      )}
                      {item.status === 'INSPECTING' && (
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border',
                            isDarkMode
                              ? 'bg-blue-950/40 text-blue-400 border-blue-500/30'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          )}
                        >
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          Đang giám định
                        </span>
                      )}
                      {item.status === 'RESOLVED' && (
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border',
                            isDarkMode
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          )}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {item.resolution === 'REPLACE_NEW' ? 'Đã đổi mới 0đ' : 'Đã hoàn tiền'}
                        </span>
                      )}
                      {item.status === 'REJECTED' && (
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border',
                            isDarkMode
                              ? 'bg-rose-950/40 text-rose-400 border-rose-500/30'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          )}
                        >
                          <XCircle className="w-3 h-3" />
                          Bị từ chối
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleOpenInspection(item)}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors border',
                          isDarkMode
                            ? 'bg-[#171F33] text-[#DAE2FD] border-[#3E4850]/60 hover:bg-[#222A3D]'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        )}
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-500" />
                        <span>Giám định hàng</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 580px SLIDING DRAWER: Thẩm Định Kiện Hàng Hoàn Trả (<ReturnInspectionSheet>) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={cn(
              'w-full max-w-[580px] h-full shadow-2xl flex flex-col border-l overflow-hidden transition-colors',
              isDarkMode
                ? 'bg-[#0B1326] border-[#3E4850]/40 text-[#DAE2FD]'
                : 'bg-white border-slate-200 text-slate-900'
            )}
          >
            {/* Drawer Header */}
            <div
              className={cn(
                'p-5 border-b flex items-center justify-between transition-colors',
                isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200'
              )}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-base text-rose-600 dark:text-rose-400">
                    {selectedItem.rmaCode}
                  </span>
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded font-mono',
                      isDarkMode ? 'bg-[#1E293B] text-[#BEC8D2]' : 'bg-slate-200 text-slate-700'
                    )}
                  >
                    Đơn: {selectedItem.originalOrderCode}
                  </span>
                </div>
                <h3 className={cn('text-sm font-semibold mt-1', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-700')}>
                  Biên Bản Giám Định & Thẩm Định Đổi Trả Phụ Kiện
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className={cn('p-1.5 rounded-lg transition-colors', isDarkMode ? 'hover:bg-[#171F33] text-[#88929B]' : 'hover:bg-slate-200 text-slate-500')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
              {/* Customer and Product Details */}
              <div
                className={cn(
                  'p-4 rounded-xl border space-y-2 transition-colors',
                  isDarkMode ? 'bg-[#171F33] border-[#3E4850]/50' : 'bg-slate-50 border-slate-200'
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className={cn('text-xs block', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                      Khách hàng:
                    </span>
                    <span className={cn('font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                      {selectedItem.customerName}
                    </span>
                    <span className={cn('font-mono text-xs ml-2', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                      ({selectedItem.customerPhone})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={cn('text-xs block', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                      Ngày gửi đơn:
                    </span>
                    <span className={cn('font-mono text-xs', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-700')}>
                      {selectedItem.requestedAt}
                    </span>
                  </div>
                </div>

                <div className={cn('pt-2 border-t', isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-200')}>
                  <div className={cn('text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                    Phụ kiện yêu cầu đổi trả:
                  </div>
                  <div className="font-semibold text-blue-600 dark:text-[#89CEFF]">
                    {selectedItem.accessoryName}
                  </div>
                  <div className={cn('text-xs mt-1', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-600')}>
                    <strong>Lý do của khách:</strong> {selectedItem.reason}
                  </div>
                </div>
              </div>

              {/* MEDIA GALLERY: Proof Photos */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={cn('text-xs font-bold uppercase tracking-wider flex items-center gap-1.5', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-700')}>
                    <ImageIcon className="w-4 h-4 text-blue-500" />
                    Bằng chứng hình ảnh / video khách hàng gửi:
                  </label>
                  <span className={cn('text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                    {selectedItem.evidenceImages.length} ảnh
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {selectedItem.evidenceImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setPreviewImage(img)}
                      className={cn(
                        'group relative aspect-video rounded-xl overflow-hidden border cursor-pointer shadow-sm hover:border-blue-500 transition-all',
                        isDarkMode ? 'border-[#3E4850]/50 bg-[#171F33]' : 'border-slate-200 bg-slate-100'
                      )}
                    >
                      <img
                        src={img}
                        alt={`Bằng chứng ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                        <Eye className="w-4 h-4" />
                        <span>Phóng to</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Physical Condition Checklist */}
              <div
                className={cn(
                  'p-4 rounded-xl border space-y-3',
                  isDarkMode ? 'bg-[#171F33] border-[#3E4850]/50' : 'bg-blue-50/50 border-blue-200'
                )}
              >
                <div className={cn('text-xs font-bold uppercase tracking-wider flex items-center gap-1.5', isDarkMode ? 'text-[#89CEFF]' : 'text-blue-900')}>
                  <CheckSquare className="w-4 h-4" />
                  Biên bản kiểm tra thực tế kiện hàng tại Showroom:
                </div>

                <div className="space-y-2 text-xs">
                  <label className={cn('flex items-center gap-2 cursor-pointer', isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800')}>
                    <input
                      type="checkbox"
                      checked={checklist.intactSeal}
                      onChange={(e) => setChecklist({ ...checklist, intactSeal: e.target.checked })}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Tem mác, tem niêm phong bảo hành còn nguyên vẹn, không rách rời</span>
                  </label>

                  <label className={cn('flex items-center gap-2 cursor-pointer', isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800')}>
                    <input
                      type="checkbox"
                      checked={checklist.noBurnMark}
                      onChange={(e) => setChecklist({ ...checklist, noBurnMark: e.target.checked })}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Không có dấu hiệu va đập biến dạng, chập cháy nguồn điện do tự ý can thiệp</span>
                  </label>

                  <label className={cn('flex items-center gap-2 cursor-pointer', isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800')}>
                    <input
                      type="checkbox"
                      checked={checklist.fullAccessories}
                      onChange={(e) => setChecklist({ ...checklist, fullAccessories: e.target.checked })}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Đầy đủ phụ kiện, dây kết nối và sách hướng dẫn đi kèm trong hộp</span>
                  </label>

                  <label className={cn('flex items-center gap-2 cursor-pointer', isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800')}>
                    <input
                      type="checkbox"
                      checked={checklist.defectConfirmed}
                      onChange={(e) => setChecklist({ ...checklist, defectConfirmed: e.target.checked })}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Xác nhận lỗi kỹ thuật do nhà sản xuất (không nhận nguồn / thấu kính mờ)</span>
                  </label>
                </div>
              </div>

              {/* Technical notes */}
              <div>
                <label className={cn('block text-xs font-semibold mb-1.5', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-700')}>
                  Ghi chú kết luận kỹ thuật viên Showroom:
                </label>
                <textarea
                  rows={3}
                  value={inspectionNote}
                  onChange={(e) => setInspectionNote(e.target.value)}
                  placeholder="Nhập chi tiết biên bản kiểm tra thực tế phụ kiện hoàn trả..."
                  className={cn(
                    'w-full px-3 py-2 text-xs rounded-xl border focus:outline-none transition-colors',
                    isDarkMode
                      ? 'bg-[#171F33] border-[#3E4850]/50 text-white placeholder:text-[#88929B] focus:border-[#89CEFF]'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/40'
                  )}
                />
              </div>

              {/* Guidelines Info */}
              <div
                className={cn(
                  'p-3 rounded-xl border text-xs flex items-start gap-2',
                  isDarkMode
                    ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                )}
              >
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  Đổi trả được chấp thuận nếu gửi trong vòng <strong>7 ngày</strong> kể từ khi nhận hàng và thỏa mãn điều kiện tem bảo hành. Mọi quyết định giải quyết sẽ đồng bộ ngay lập tức vào hồ sơ đơn hàng của khách.
                </span>
              </div>
            </div>

            {/* Drawer Actions: 3 Resolution Pathways */}
            <div
              className={cn(
                'p-4 border-t space-y-2 transition-colors',
                isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200'
              )}
            >
              <div className={cn('text-xs font-bold uppercase tracking-wider mb-1', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                Hướng xử lý hồ sơ đổi trả:
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* 1. Replace new */}
                <button
                  onClick={() => handleResolveAction('REPLACE_NEW')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Đổi Hàng Mới 0đ</span>
                </button>

                {/* 2. Refund money */}
                <button
                  onClick={() => handleResolveAction('REFUND_MONEY')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-sm transition-colors"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Hoàn Tiền Cho Khách</span>
                </button>
              </div>

              {/* 3. Reject */}
              <button
                onClick={() => handleResolveAction('REJECT')}
                className={cn(
                  'w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors',
                  isDarkMode
                    ? 'border-rose-500/40 text-rose-400 hover:bg-rose-950/30'
                    : 'border-rose-300 text-rose-600 hover:bg-rose-50'
                )}
              >
                <XCircle className="w-4 h-4" />
                <span>Từ Chối Đổi Trả (Gửi hàng trả lại khách)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHOTO PREVIEW MODAL */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-zoom-out animate-in fade-in duration-200"
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img
              src={previewImage}
              alt="Bằng chứng phóng to"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-slate-700"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 shadow-lg border border-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
