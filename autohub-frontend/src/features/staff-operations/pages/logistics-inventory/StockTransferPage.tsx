import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { staffService } from '@/features/staff-operations/services/staff.service';
import type { CrossBranchStock, StockTransferTicket } from '@/types/staff.types';
import { cn } from '@/lib/utils';

export const StockTransferPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [stocks, setStocks] = useState<CrossBranchStock[]>([]);
  const [transfers, setTransfers] = useState<StockTransferTicket[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStockForTransfer, setSelectedStockForTransfer] = useState<CrossBranchStock | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transfer Modal Form
  const [fromBranch, setFromBranch] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('Khách đang có mặt tại showroom chờ lắp đặt ngay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingTicketId, setProcessingTicketId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [stockData, transferData] = await Promise.all([
        staffService.getCrossBranchStocks(),
        staffService.getStockTransfers(),
      ]);
      setStocks(stockData || []);
      setTransfers(transferData || []);
    } catch (err) {
      console.error('Lỗi tải tồn kho & phiếu điều chuyển phụ kiện:', err);
      setError('Không thể tải dữ liệu tồn kho và phiếu chuyển kho. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const currentShowroomName = stocks[0]?.currentShowroomName || 'Showroom hiện tại';

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

  const quickScanSkus = useMemo(() => stocks.slice(0, 3), [stocks]);

  const handleOpenTransfer = (stock: CrossBranchStock) => {
    setSelectedStockForTransfer(stock);
    const availableBranch = stock.branches.find((b) => b.stock > 0);
    setFromBranch(availableBranch ? availableBranch.branchName : '');
    setQuantity(1);
  };

  const handleSubmitTransfer = async () => {
    if (!selectedStockForTransfer || !fromBranch || isSubmitting) {
      if (!fromBranch) showToast('Vui lòng chọn chi nhánh xuất kho điều chuyển!', 'error');
      return;
    }

    const branch = selectedStockForTransfer.branches.find((b) => b.branchName === fromBranch);
    if (!branch || branch.stock < quantity) {
      showToast(`Số lượng chuyển (${quantity}) vượt quá tồn khả dụng của ${fromBranch}!`, 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await staffService.createStockTransfer({
        accessoryId: selectedStockForTransfer.accessoryId,
        sku: selectedStockForTransfer.sku,
        fromShowroomId: branch.showroomId,
        fromBranchName: branch.branchName,
        quantity,
        reason: reason.trim(),
      });
      setSelectedStockForTransfer(null);
      await fetchData();
      showToast(
        `Đã tạo phiếu điều chuyển ${created.transferCode}: Chuyển ${created.quantity} x ${created.sku} từ [${created.fromShowroomName}] về [${created.toShowroomName}]!`
      );
    } catch (err) {
      console.error('Lỗi lập phiếu điều chuyển kho:', err);
      const msg = err instanceof Error ? err.message : 'Không thể tạo phiếu điều chuyển kho.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmTicket = async (ticket: StockTransferTicket) => {
    if (processingTicketId) return;
    setProcessingTicketId(ticket.id);
    try {
      await staffService.confirmStockTransfer(ticket.id);
      await fetchData();
      showToast(`Đã xác nhận tiếp nhận phiếu ${ticket.transferCode} và cộng tồn kho thành công!`);
    } catch (err) {
      console.error('Lỗi xác nhận phiếu chuyển kho:', err);
      const msg = err instanceof Error ? err.message : 'Không thể xác nhận phiếu chuyển kho.';
      showToast(msg, 'error');
    } finally {
      setProcessingTicketId(null);
    }
  };

  const handleCancelTicket = async (ticket: StockTransferTicket) => {
    if (processingTicketId) return;
    setProcessingTicketId(ticket.id);
    try {
      await staffService.cancelStockTransfer(ticket.id);
      await fetchData();
      showToast(`Đã hủy phiếu ${ticket.transferCode} và hoàn lại tồn kho cho ${ticket.fromShowroomName}.`);
    } catch (err) {
      console.error('Lỗi hủy phiếu chuyển kho:', err);
      const msg = err instanceof Error ? err.message : 'Không thể hủy phiếu chuyển kho.';
      showToast(msg, 'error');
    } finally {
      setProcessingTicketId(null);
    }
  };

  const handleSimulateScan = (skuCode: string) => {
    setSearchQuery(skuCode);
    showToast(`Đã lọc theo mã SKU: "${skuCode}"!`);
  };

  return (
    <div className={cn('space-y-6 transition-colors duration-300', isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800')}>
      {/* Toast Notification */}
      {toast && (
        <div
          className={cn(
            'fixed top-20 right-8 z-50 flex items-center gap-3 px-4 py-3 text-white text-sm font-medium rounded-xl shadow-xl border animate-in fade-in slide-in-from-top-4 duration-300',
            toast.type === 'success' ? 'bg-emerald-600 border-emerald-500' : 'bg-rose-600 border-rose-500'
          )}
        >
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{toast.message}</span>
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
            Kiểm tra vị trí ngăn kệ tại chỗ, tồn kho liên chi nhánh và đồng bộ phiếu chuyển kho.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs transition-colors',
              isDarkMode ? 'bg-[#171F33] border-[#3E4850]/50 text-[#DAE2FD]' : 'bg-slate-100 border-slate-200 text-slate-800'
            )}
          >
            <Warehouse className="w-4 h-4 text-cyan-500" />
            <div>
              <div className={cn('text-[10px]', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>Kho hiện tại:</div>
              <div className={cn('font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>{currentShowroomName}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchData}
            className={cn(
              'px-3.5 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors',
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
              type="button"
              onClick={() => setSearchQuery('')}
              className={cn(
                'px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer',
                isDarkMode
                  ? 'border-[#3E4850]/50 text-[#88929B] hover:bg-[#171F33] hover:text-[#DAE2FD]'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100'
              )}
            >
              Xóa tìm kiếm
            </button>
          )}
        </div>

        {/* Quick barcode buttons derived from real DB items */}
        {quickScanSkus.length > 0 && (
          <div className={cn('flex items-center gap-2 flex-wrap text-xs pt-1', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            <span className="font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              Tra cứu nhanh SKU:
            </span>
            {quickScanSkus.map((item) => (
              <button
                key={item.sku}
                type="button"
                onClick={() => handleSimulateScan(item.sku)}
                className={cn(
                  'px-2.5 py-1 rounded-lg font-mono text-[11px] border transition-colors cursor-pointer',
                  isDarkMode
                    ? 'bg-[#171F33] border-[#3E4850]/50 text-[#DAE2FD] hover:bg-cyan-950/40 hover:text-cyan-400'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-cyan-50 hover:text-cyan-600'
                )}
              >
                {item.sku}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-1 text-xs">
        <div className="flex items-center gap-2">
          {isLoading ? (
            <span className="flex items-center gap-1.5 text-cyan-500 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Đang đồng bộ dữ liệu tồn kho...
            </span>
          ) : (
            <span className={cn('font-medium flex items-center gap-1.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              {!searchQuery.trim()
                ? `Hiển thị ${filteredStocks.length} phụ kiện trong kho hệ thống`
                : `Tìm thấy ${filteredStocks.length} phụ kiện khớp với từ khóa "${searchQuery}"`}
            </span>
          )}
        </div>
        <span className={cn('text-[11px]', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>
          Tổng danh mục: {stocks.length} phụ kiện • {transfers.length} phiếu điều chuyển
        </span>
      </div>

      {/* Error State */}
      {error ? (
        <div className={cn('p-10 text-center rounded-2xl border space-y-3', isDarkMode ? 'bg-[#0B1326] border-red-900/50 text-red-300' : 'bg-red-50 border-red-200 text-red-700')}>
          <p className="text-sm font-semibold">{error}</p>
          <button
            type="button"
            onClick={fetchData}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Thử lại
          </button>
        </div>
      ) : (
        <>
          {/* Datagrid: Inventory */}
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
                    <th className="py-3.5 px-4">Vị Trí Kệ</th>
                    <th className="py-3.5 px-4 text-center whitespace-nowrap">Tồn Tại Chỗ</th>
                    <th className="py-3.5 px-4">Tồn Tại Các Showroom Khác</th>
                    <th className="py-3.5 px-4 text-left whitespace-nowrap">Thao Tác</th>
                  </tr>
                </thead>
                <tbody
                  className={cn(
                    'divide-y transition-colors',
                    isDarkMode ? 'divide-[#3E4850]/20' : 'divide-slate-200'
                  )}
                >
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <Loader2 className="w-6 h-6 mx-auto animate-spin text-cyan-500" />
                      </td>
                    </tr>
                  ) : filteredStocks.length === 0 ? (
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
                          <td className="py-4 px-4 font-mono font-bold text-cyan-500 dark:text-cyan-400">
                            {stock.sku}
                          </td>
                          <td className="py-4 px-4">
                            <div className={cn('font-semibold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                              {stock.name}
                            </div>
                            <div className={cn('text-xs mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                              {stock.category}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={cn(
                                'px-2.5 py-1 rounded-lg font-mono text-xs font-semibold border',
                                isDarkMode
                                  ? 'bg-[#171F33] border-[#3E4850]/50 text-[#DAE2FD]'
                                  : 'bg-slate-100 border-slate-200 text-slate-700'
                              )}
                            >
                              {stock.shelfLocation}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center whitespace-nowrap">
                            {stock.localStock > 0 ? (
                              <span
                                className={cn(
                                  'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold font-mono whitespace-nowrap border',
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
                                  'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold font-mono whitespace-nowrap border',
                                  isDarkMode
                                    ? 'bg-rose-950/40 text-rose-400 border-rose-500/30'
                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                )}
                              >
                                Hết hàng (0)
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1.5 max-w-md">
                              {stock.branches.map((b) => (
                                <span
                                  key={b.showroomId ?? b.branchName}
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
                          <td className="py-4 px-4 text-left whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleOpenTransfer(stock)}
                              disabled={otherShowroomsTotal === 0}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded-xl bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-colors cursor-pointer"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5 shrink-0" />
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

          {/* Datagrid: Transfer Tickets History */}
          <div
            className={cn(
              'rounded-2xl border overflow-hidden shadow-sm transition-colors',
              isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
            )}
          >
            <div className={cn('p-4 border-b flex items-center justify-between', isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-200')}>
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-cyan-500" />
                <h2 className={cn('font-bold text-sm', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  Danh Sách Phiếu Điều Chuyển Kho Phụ Kiện
                </h2>
              </div>
              <span className={cn('text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                {transfers.length} phiếu
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead
                  className={cn(
                    'uppercase tracking-wider border-b font-semibold',
                    isDarkMode
                      ? 'bg-[#131B2E] text-[#BEC8D2] border-[#3E4850]/40'
                      : 'bg-slate-50 text-slate-500 border-slate-200'
                  )}
                >
                  <tr>
                    <th className="py-3 px-4">Mã Phiếu</th>
                    <th className="py-3 px-4">Phụ Kiện / SKU</th>
                    <th className="py-3 px-4">Tuyến Điều Chuyển</th>
                    <th className="py-3 px-4 text-center">SL</th>
                    <th className="py-3 px-4">Trạng Thái</th>
                    <th className="py-3 px-4">Thời Gian</th>
                    <th className="py-3 px-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className={cn('divide-y', isDarkMode ? 'divide-[#3E4850]/20' : 'divide-slate-200')}>
                  {transfers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className={cn('py-8 text-center', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>
                        Chưa có phiếu điều chuyển kho phụ kiện nào.
                      </td>
                    </tr>
                  ) : (
                    transfers.map((t) => (
                      <tr key={t.id} className={cn(isDarkMode ? 'hover:bg-[#171F33]' : 'hover:bg-slate-50')}>
                        <td className="py-3 px-4 font-mono font-bold text-cyan-500">{t.transferCode}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold">{t.accessoryName}</div>
                          <div className="font-mono text-[11px] text-slate-400">{t.sku}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span>{t.fromShowroomName}</span>
                          <span className="mx-1.5 text-cyan-500">→</span>
                          <span className="font-semibold">{t.toShowroomName}</span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold">{t.quantity}</td>
                        <td className="py-3 px-4">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase border',
                              t.status === 'DANG_VAN_CHUYEN' && 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200',
                              t.status === 'DA_TIEP_NHAN' && 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200',
                              t.status === 'DA_HUY' && 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200'
                            )}
                          >
                            {t.status === 'DANG_VAN_CHUYEN'
                              ? 'Đang vận chuyển'
                              : t.status === 'DA_TIEP_NHAN'
                              ? 'Đã tiếp nhận'
                              : 'Đã hủy'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{t.createdAt}</td>
                        <td className="py-3 px-4 text-right">
                          {t.status === 'DANG_VAN_CHUYEN' ? (
                            <div className="inline-flex gap-1.5">
                              <button
                                type="button"
                                disabled={processingTicketId === t.id}
                                onClick={() => handleConfirmTicket(t)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold cursor-pointer"
                              >
                                Xác nhận nhận
                              </button>
                              <button
                                type="button"
                                disabled={processingTicketId === t.id}
                                onClick={() => handleCancelTicket(t)}
                                className="px-2.5 py-1 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 disabled:opacity-50 font-semibold cursor-pointer"
                              >
                                Hủy
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400">{t.confirmedBy || '-'}</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* MODAL: Transfer Request Modal */}
      {selectedStockForTransfer && (
        <div
          onClick={() => setSelectedStockForTransfer(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'rounded-2xl max-w-lg w-full p-6 shadow-2xl border transition-colors',
              isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 text-[#DAE2FD]' : 'bg-white border-slate-200 text-slate-900'
            )}
          >
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
                type="button"
                onClick={() => setSelectedStockForTransfer(null)}
                className={cn('p-1 rounded-lg transition-colors cursor-pointer', isDarkMode ? 'hover:bg-[#171F33] text-[#88929B]' : 'hover:bg-slate-100 text-slate-500')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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
                  <span>Tồn tại {currentShowroomName}: <strong>{selectedStockForTransfer.localStock} chiếc</strong></span>
                  <span>Vị trí: <strong>{selectedStockForTransfer.shelfLocation}</strong></span>
                </div>
              </div>

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
                      <option key={b.showroomId ?? b.branchName} value={b.branchName}>
                        {b.branchName} (Khả dụng: {b.stock} chiếc)
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className={cn('block text-xs font-semibold mb-1.5', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-700')}>
                  Số lượng cần điều chuyển:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={selectedStockForTransfer.branches.find((b) => b.branchName === fromBranch)?.stock || 1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
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
                  Phiếu điều chuyển sẽ được ghi nhận vào hệ thống, trừ tồn khả dụng tại <strong>{fromBranch || 'chi nhánh nguồn'}</strong> và chờ xác nhận nhập kho tại <strong>{currentShowroomName}</strong>.
                </span>
              </div>
            </div>

            <div
              className={cn(
                'flex items-center justify-end gap-3 mt-6 pt-4 border-t',
                isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-200'
              )}
            >
              <button
                type="button"
                onClick={() => setSelectedStockForTransfer(null)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-xl border transition-colors cursor-pointer',
                  isDarkMode
                    ? 'border-[#3E4850]/60 text-[#DAE2FD] hover:bg-[#171F33]'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                )}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmitTransfer}
                disabled={!fromBranch || isSubmitting}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Đang gửi...' : 'Gửi Phiếu Điều Chuyển'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
