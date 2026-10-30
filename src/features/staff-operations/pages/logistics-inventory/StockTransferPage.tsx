import React, { useState, useMemo } from 'react';
import {
  Boxes,
  ScanBarcode,
  ArrowRightLeft,
  CheckCircle2,
  Building2,
  X,
  Send,
  Warehouse,
  Sparkles,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { MOCK_CROSS_BRANCH_STOCKS, type CrossBranchStock } from '@/features/staff-operations/mocks/staff.mock';
import { cn } from '@/lib/utils';

export const StockTransferPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [stocks, setStocks] = useState<CrossBranchStock[]>(MOCK_CROSS_BRANCH_STOCKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStockForTransfer, setSelectedStockForTransfer] = useState<CrossBranchStock | null>(null);

  // Transfer Modal Form
  const [fromBranch, setFromBranch] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('Khách đang có mặt tại showroom chờ lắp đặt ngay');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const filteredStocks = useMemo(() => {
    if (!searchQuery.trim()) return stocks;
    const q = searchQuery.toLowerCase();
    return stocks.filter(
      (s) =>
        s.sku.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.shelfLocation.toLowerCase().includes(q)
    );
  }, [stocks, searchQuery]);

  const handleOpenTransfer = (stock: CrossBranchStock) => {
    setSelectedStockForTransfer(stock);
    const availableBranch = stock.branches.find((b) => b.stock > 0);
    setFromBranch(availableBranch ? availableBranch.branchName : '');
    setQuantity(1);
  };

  const handleSubmitTransfer = () => {
    if (!selectedStockForTransfer || !fromBranch) {
      alert('Vui lòng chọn chi nhánh xuất kho điều chuyển!');
      return;
    }

    const branch = selectedStockForTransfer.branches.find((b) => b.branchName === fromBranch);
    if (!branch || branch.stock < quantity) {
      alert(`Số lượng chuyển (${quantity}) vượt quá tồn khả dụng của ${fromBranch}!`);
      return;
    }

    setStocks((prev) =>
      prev.map((s) => {
        if (s.sku === selectedStockForTransfer.sku) {
          return {
            ...s,
            localStock: s.localStock + quantity,
            branches: s.branches.map((b) =>
              b.branchName === fromBranch ? { ...b, stock: b.stock - quantity } : b
            ),
          };
        }
        return s;
      })
    );

    const sku = selectedStockForTransfer.sku;
    setSelectedStockForTransfer(null);
    showToast(`Đã tạo phiếu điều chuyển #${Math.floor(1000 + Math.random() * 9000)}: Chuyển ${quantity} x ${sku} từ [${fromBranch}] về [Showroom Q.7] thành công!`);
  };

  const handleSimulateScan = (skuCode: string) => {
    setSearchQuery(skuCode);
    showToast(`Đã quét Barcode máy quét: "${skuCode}"!`);
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
            Tra Cứu Tồn Kho Thực Tế & Điều Chuyển Chi Nhánh
          </h1>
          <p className={cn('text-sm mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Kiểm tra tức thời vị trí ngăn kệ tại chỗ và kết nối số lượng tồn kho giữa toàn bộ Showroom hệ thống
          </p>
        </div>

        {/* Quick branch location badge */}
        <div
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs transition-colors',
            isDarkMode ? 'bg-[#171F33] border-[#3E4850]/50 text-[#DAE2FD]' : 'bg-slate-100 border-slate-200 text-slate-800'
          )}
        >
          <Warehouse className="w-4 h-4 text-cyan-500" />
          <div>
            <div className={cn('text-[10px]', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>Kho hiện tại:</div>
            <div className={cn('font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>Showroom TP.HCM - Q.7</div>
          </div>
        </div>
      </div>

      {/* Barcode Scanner & Search Bar */}
      <div
        className={cn(
          'p-4 rounded-2xl border shadow-sm space-y-3 transition-colors',
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
        )}
      >
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <ScanBarcode className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Quét mã vạch SKU phụ kiện (Barcode Scanner) hoặc nhập tên sản phẩm..."
              className={cn(
                'w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none transition-colors',
                isDarkMode
                  ? 'bg-[#171F33] border-[#3E4850]/50 text-white placeholder:text-[#88929B] focus:border-[#89CEFF]'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/40'
              )}
            />
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={cn(
                'px-3 py-2 text-xs font-semibold rounded-xl border transition-colors',
                isDarkMode
                  ? 'border-[#3E4850]/50 text-[#88929B] hover:bg-[#171F33] hover:text-[#DAE2FD]'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100'
              )}
            >
              Xóa tìm kiếm
            </button>
          )}
        </div>

        {/* Quick barcode simulation buttons */}
        <div className={cn('flex items-center gap-2 flex-wrap text-xs pt-1', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
          <span className="font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            Mã vạch mô phỏng:
          </span>
          <button
            onClick={() => handleSimulateScan('ACC-CAM-4K')}
            className={cn(
              'px-2.5 py-1 rounded-lg font-mono text-[11px] border transition-colors',
              isDarkMode
                ? 'bg-[#171F33] border-[#3E4850]/50 text-[#DAE2FD] hover:bg-cyan-950/40 hover:text-cyan-400'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-cyan-50 hover:text-cyan-600'
            )}
          >
            ACC-CAM-4K (Hết hàng tại Q.7)
          </button>
          <button
            onClick={() => handleSimulateScan('ACC-CHARGER-01')}
            className={cn(
              'px-2.5 py-1 rounded-lg font-mono text-[11px] border transition-colors',
              isDarkMode
                ? 'bg-[#171F33] border-[#3E4850]/50 text-[#DAE2FD] hover:bg-cyan-950/40 hover:text-cyan-400'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-cyan-50 hover:text-cyan-600'
            )}
          >
            ACC-CHARGER-01
          </button>
          <button
            onClick={() => handleSimulateScan('ACC-CARPET-5D')}
            className={cn(
              'px-2.5 py-1 rounded-lg font-mono text-[11px] border transition-colors',
              isDarkMode
                ? 'bg-[#171F33] border-[#3E4850]/50 text-[#DAE2FD] hover:bg-cyan-950/40 hover:text-cyan-400'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-cyan-50 hover:text-cyan-600'
            )}
          >
            ACC-CARPET-5D
          </button>
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
                <th className="py-3.5 px-4">Mã SKU</th>
                <th className="py-3.5 px-4">Tên Phụ Kiện & Danh Mục</th>
                <th className="py-3.5 px-4">Vị Trí Kệ Showroom Q.7</th>
                <th className="py-3.5 px-4 text-center">Tồn Tại Chỗ</th>
                <th className="py-3.5 px-4">Tồn Tại Các Showroom Khác</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody
              className={cn(
                'divide-y transition-colors',
                isDarkMode ? 'divide-[#3E4850]/20' : 'divide-slate-200'
              )}
            >
              {filteredStocks.length === 0 ? (
                <tr>
                  <td colSpan={6} className={cn('py-12 text-center', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>
                    <Boxes className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    Không tìm thấy phụ kiện khớp với mã vạch hoặc từ khóa
                  </td>
                </tr>
              ) : (
                filteredStocks.map((stock) => {
                  const otherShowroomsTotal = stock.branches.reduce((acc, b) => acc + b.stock, 0);

                  return (
                    <tr
                      key={stock.sku}
                      className={cn(
                        'transition-colors',
                        isDarkMode ? 'hover:bg-[#171F33]' : 'hover:bg-slate-50'
                      )}
                    >
                      {/* SKU */}
                      <td className="py-4 px-4 font-mono font-bold text-cyan-500 dark:text-cyan-400">
                        {stock.sku}
                      </td>

                      {/* Name & Category */}
                      <td className="py-4 px-4">
                        <div className={cn('font-semibold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                          {stock.name}
                        </div>
                        <div className={cn('text-xs mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                          {stock.category}
                        </div>
                      </td>

                      {/* Shelf location */}
                      <td className="py-4 px-4">
                        <span
                          className={cn(
                            'px-2.5 py-1 rounded-lg font-mono text-xs font-semibold border',
                            isDarkMode
                              ? 'bg-[#171F33] border-[#3E4850]/50 text-[#DAE2FD]'
                              : 'bg-slate-100 border-slate-200 text-slate-700'
                          )}
                        >
                          📍 {stock.shelfLocation}
                        </span>
                      </td>

                      {/* Local stock */}
                      <td className="py-4 px-4 text-center">
                        {stock.localStock > 0 ? (
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold font-mono border',
                              isDarkMode
                                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            )}
                          >
                            {stock.localStock} chiếc
                          </span>
                        ) : (
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold font-mono border',
                              isDarkMode
                                ? 'bg-rose-950/40 text-rose-400 border-rose-500/30'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            )}
                          >
                            Hết hàng (0)
                          </span>
                        )}
                      </td>

                      {/* Cross branch stocks */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5 max-w-md">
                          {stock.branches.map((b, idx) => (
                            <span
                              key={idx}
                              className={cn(
                                'text-xs px-2 py-0.5 rounded-lg border font-mono flex items-center gap-1',
                                b.stock > 0
                                  ? isDarkMode
                                    ? 'bg-[#171F33] border-[#3E4850]/50 text-[#DAE2FD]'
                                    : 'bg-slate-50 border-slate-200 text-slate-700'
                                  : isDarkMode
                                  ? 'bg-[#0B1326]/60 border-[#3E4850]/20 text-[#88929B]'
                                  : 'bg-slate-100/60 border-slate-200/50 text-slate-400'
                              )}
                            >
                              <span className="font-sans text-[11px]">{b.branchName}:</span>
                              <strong className={b.stock > 0 ? 'text-cyan-500 dark:text-cyan-400' : ''}>
                                {b.stock}
                              </strong>
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleOpenTransfer(stock)}
                          disabled={otherShowroomsTotal === 0}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-colors"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          <span>Yêu cầu chuyển kho</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Transfer Request Modal (<TransferRequestModal>) */}
      {selectedStockForTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={cn(
              'rounded-2xl max-w-lg w-full p-6 shadow-2xl border transition-colors',
              isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 text-[#DAE2FD]' : 'bg-white border-slate-200 text-slate-900'
            )}
          >
            {/* Header */}
            <div
              className={cn(
                'flex items-center justify-between pb-4 border-b',
                isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-200'
              )}
            >
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-cyan-500" />
                <h3 className="font-bold text-lg">Lập Phiếu Điều Chuyển Kho Showroom</h3>
              </div>
              <button
                onClick={() => setSelectedStockForTransfer(null)}
                className={cn('p-1 rounded-lg transition-colors', isDarkMode ? 'hover:bg-[#171F33] text-[#88929B]' : 'hover:bg-slate-100 text-slate-500')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="mt-4 space-y-4 text-sm">
              <div
                className={cn(
                  'p-3 rounded-xl border',
                  isDarkMode ? 'bg-[#171F33] border-[#3E4850]/50' : 'bg-slate-50 border-slate-200'
                )}
              >
                <div className="text-xs font-mono font-bold text-cyan-500 dark:text-cyan-400">
                  {selectedStockForTransfer.sku}
                </div>
                <div className={cn('font-semibold mt-0.5', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  {selectedStockForTransfer.name}
                </div>
                <div className={cn('text-xs mt-1 flex items-center justify-between', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                  <span>Tồn tại Showroom Q.7: <strong>{selectedStockForTransfer.localStock} chiếc</strong></span>
                  <span>Vị trí: <strong>{selectedStockForTransfer.shelfLocation}</strong></span>
                </div>
              </div>

              {/* Source Branch */}
              <div>
                <label className={cn('block text-xs font-semibold mb-1.5', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-700')}>
                  Chọn Showroom nguồn điều chuyển:
                </label>
                <select
                  value={fromBranch}
                  onChange={(e) => setFromBranch(e.target.value)}
                  className={cn(
                    'w-full px-3 py-2 text-sm rounded-xl border focus:outline-none transition-colors',
                    isDarkMode
                      ? 'bg-[#171F33] border-[#3E4850]/50 text-white focus:border-cyan-500'
                      : 'bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-cyan-500/40'
                  )}
                >
                  <option value="">-- Chọn chi nhánh xuất kho --</option>
                  {selectedStockForTransfer.branches
                    .filter((b) => b.stock > 0)
                    .map((b) => (
                      <option key={b.branchName} value={b.branchName}>
                        {b.branchName} (Khả dụng: {b.stock} chiếc)
                      </option>
                    ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className={cn('block text-xs font-semibold mb-1.5', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-700')}>
                  Số lượng cần điều chuyển:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={
                      selectedStockForTransfer.branches.find((b) => b.branchName === fromBranch)?.stock || 10
                    }
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className={cn(
                      'w-32 px-3 py-2 text-sm font-mono font-bold rounded-xl border focus:outline-none transition-colors',
                      isDarkMode
                        ? 'bg-[#171F33] border-[#3E4850]/50 text-white focus:border-cyan-500'
                        : 'bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-cyan-500/40'
                    )}
                  />
                  <span className={cn('text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>chiếc</span>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className={cn('block text-xs font-semibold mb-1.5', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-700')}>
                  Lý do yêu cầu điều chuyển:
                </label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Nhập lý do cần chuyển kho..."
                  className={cn(
                    'w-full px-3 py-2 text-xs rounded-xl border focus:outline-none transition-colors',
                    isDarkMode
                      ? 'bg-[#171F33] border-[#3E4850]/50 text-white placeholder:text-[#88929B] focus:border-cyan-500'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/40'
                  )}
                />
              </div>

              <div
                className={cn(
                  'p-3 rounded-xl border text-xs flex items-start gap-2',
                  isDarkMode
                    ? 'bg-cyan-950/30 border-cyan-500/30 text-cyan-300'
                    : 'bg-cyan-50 border-cyan-200 text-cyan-900'
                )}
              >
                <Building2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyan-500" />
                <span>
                  Phiếu điều chuyển sẽ được gửi thông báo tức thời đến Quản lý kho của <strong>{fromBranch || 'chi nhánh nguồn'}</strong> để chuẩn bị xuất hàng và bàn giao xe tải nội bộ trong ngày.
                </span>
              </div>
            </div>

            {/* Actions */}
            <div
              className={cn(
                'flex items-center justify-end gap-3 mt-6 pt-4 border-t',
                isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-200'
              )}
            >
              <button
                onClick={() => setSelectedStockForTransfer(null)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-xl border transition-colors',
                  isDarkMode
                    ? 'border-[#3E4850]/60 text-[#DAE2FD] hover:bg-[#171F33]'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                )}
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitTransfer}
                disabled={!fromBranch}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Gửi Phiếu Điều Chuyển</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
