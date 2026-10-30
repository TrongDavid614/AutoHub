import React, { useState, useMemo } from 'react';
import {
  Package,
  Printer,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  CheckSquare,
  X,
  Info,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { MOCK_STAFF_FULFILLMENT_ORDERS, type StaffFulfillmentOrder } from '@/features/staff-operations/mocks/staff.mock';
import { cn, formatCurrencyVND } from '@/lib/utils';

export const OrderFulfillmentPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [orders, setOrders] = useState<StaffFulfillmentOrder[]>(MOCK_STAFF_FULFILLMENT_ORDERS);
  const [activeTab, setActiveTab] = useState<'NEED_PACK' | 'PACKING' | 'SHIPPED'>('NEED_PACK');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<StaffFulfillmentOrder | null>(null);
  const [selectedOrderForHandover, setSelectedOrderForHandover] = useState<StaffFulfillmentOrder | null>(null);

  // Handover modal form state
  const [courier, setCourier] = useState('Giao Hàng Nhanh (GHN Express)');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchTab = order.status === activeTab;
      const matchQuery =
        !searchQuery ||
        order.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone.includes(searchQuery) ||
        order.items.some(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchTab && matchQuery;
    });
  }, [orders, activeTab, searchQuery]);

  const counts = useMemo(() => {
    return {
      NEED_PACK: orders.filter((o) => o.status === 'NEED_PACK').length,
      PACKING: orders.filter((o) => o.status === 'PACKING').length,
      SHIPPED: orders.filter((o) => o.status === 'SHIPPED').length,
    };
  }, [orders]);

  const handleStartPacking = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'PACKING' as const } : o))
    );
    showToast('Đã chuyển đơn hàng sang trạng thái Đang đóng gói (PACKING)!');
  };

  const handleConfirmHandover = () => {
    if (!selectedOrderForHandover || !trackingNumber.trim()) {
      alert('Vui lòng nhập mã vận đơn tracking!');
      return;
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrderForHandover.id
          ? {
              ...o,
              status: 'SHIPPED' as const,
              courier,
              trackingNumber: trackingNumber.trim(),
            }
          : o
      )
    );

    const code = selectedOrderForHandover.orderCode;
    setSelectedOrderForHandover(null);
    setTrackingNumber('');
    showToast(`Đã bàn giao bưu tá đơn ${code}! Email tracking mã ${trackingNumber.trim()} đã được gửi đến khách hàng.`);
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
            Xử Lý Xuất Kho & Đóng Gói Phụ Kiện
          </h1>
          <p className={cn('text-sm mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Quy trình nhặt hàng theo kệ kho, in phiếu đóng gói A5 và bàn giao bưu tá vận chuyển
          </p>
        </div>

        {/* Quick summary stats */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'px-3 py-2 rounded-xl border text-right',
              isDarkMode
                ? 'bg-[#171F33] border-amber-500/30 text-amber-400'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            )}
          >
            <div className="text-xs font-medium opacity-80">Cần Đóng Gói</div>
            <div className="text-lg font-mono font-bold">{counts.NEED_PACK} đơn</div>
          </div>
          <div
            className={cn(
              'px-3 py-2 rounded-xl border text-right',
              isDarkMode
                ? 'bg-[#171F33] border-blue-500/30 text-blue-400'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            )}
          >
            <div className="text-xs font-medium opacity-80">Đang Đóng Gói</div>
            <div className="text-lg font-mono font-bold">{counts.PACKING} đơn</div>
          </div>
          <div
            className={cn(
              'px-3 py-2 rounded-xl border text-right',
              isDarkMode
                ? 'bg-[#171F33] border-emerald-500/30 text-emerald-400'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            )}
          >
            <div className="text-xs font-medium opacity-80">Đã Bàn Giao</div>
            <div className="text-lg font-mono font-bold">{counts.SHIPPED} đơn</div>
          </div>
        </div>
      </div>

      {/* Process Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div
          className={cn(
            'flex p-1 rounded-xl border transition-colors',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-slate-100 border-slate-200'
          )}
        >
          <button
            onClick={() => setActiveTab('NEED_PACK')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all',
              activeTab === 'NEED_PACK'
                ? isDarkMode
                  ? 'bg-[#171F33] text-amber-400 border border-amber-500/40 shadow-sm'
                  : 'bg-white text-amber-600 shadow-sm'
                : isDarkMode
                ? 'text-[#88929B] hover:text-[#DAE2FD]'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <Clock className="w-4 h-4" />
            <span>Cần đóng gói</span>
            <span
              className={cn(
                'px-1.5 py-0.5 text-xs font-mono font-bold rounded-full',
                isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
              )}
            >
              {counts.NEED_PACK}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('PACKING')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all',
              activeTab === 'PACKING'
                ? isDarkMode
                  ? 'bg-[#171F33] text-blue-400 border border-blue-500/40 shadow-sm'
                  : 'bg-white text-blue-600 shadow-sm'
                : isDarkMode
                ? 'text-[#88929B] hover:text-[#DAE2FD]'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <Package className="w-4 h-4" />
            <span>Đang đóng gói</span>
            <span
              className={cn(
                'px-1.5 py-0.5 text-xs font-mono font-bold rounded-full',
                isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
              )}
            >
              {counts.PACKING}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('SHIPPED')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all',
              activeTab === 'SHIPPED'
                ? isDarkMode
                  ? 'bg-[#171F33] text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'bg-white text-emerald-600 shadow-sm'
                : isDarkMode
                ? 'text-[#88929B] hover:text-[#DAE2FD]'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <Truck className="w-4 h-4" />
            <span>Đã bàn giao bưu tá</span>
            <span
              className={cn(
                'px-1.5 py-0.5 text-xs font-mono font-bold rounded-full',
                isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
              )}
            >
              {counts.SHIPPED}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className={cn('w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm mã đơn, tên khách, SKU..."
            className={cn(
              'w-full pl-10 pr-4 py-2 text-sm rounded-xl border focus:outline-none transition-colors',
              isDarkMode
                ? 'bg-[#0B1326] border-[#3E4850]/40 text-white placeholder:text-[#88929B] focus:border-[#89CEFF]'
                : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/40'
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
                <th className="py-3.5 px-4">Mã Đơn Hàng</th>
                <th className="py-3.5 px-4">Khách Hàng & Địa Chỉ</th>
                <th className="py-3.5 px-4">Chi Tiết Mặt Hàng & Vị Trí Kệ</th>
                <th className="py-3.5 px-4">Tổng Tiền / Thanh Toán</th>
                <th className="py-3.5 px-4">Thời Điểm</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody
              className={cn(
                'divide-y transition-colors',
                isDarkMode ? 'divide-[#3E4850]/20' : 'divide-slate-200'
              )}
            >
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className={cn('py-12 text-center', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    Không có đơn hàng nào trong trạng thái này
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={cn(
                      'transition-colors',
                      isDarkMode ? 'hover:bg-[#171F33]' : 'hover:bg-slate-50'
                    )}
                  >
                    {/* Order Code */}
                    <td className="py-4 px-4 align-top">
                      <div className="font-mono font-bold text-blue-600 dark:text-[#89CEFF]">
                        {order.orderCode}
                      </div>
                      {order.trackingNumber && (
                        <div
                          className={cn(
                            'mt-1 flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded border',
                            isDarkMode
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          )}
                        >
                          <Truck className="w-3 h-3" />
                          <span>{order.trackingNumber}</span>
                        </div>
                      )}
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4 align-top">
                      <div className={cn('font-semibold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                        {order.customerName}
                      </div>
                      <div className={cn('font-mono text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                        {order.customerPhone}
                      </div>
                      <div
                        className={cn(
                          'text-xs mt-1 max-w-xs line-clamp-2',
                          isDarkMode ? 'text-[#88929B]' : 'text-slate-500'
                        )}
                      >
                        {order.shippingAddress}
                      </div>
                    </td>

                    {/* Items & Shelf Location */}
                    <td className="py-4 px-4 align-top">
                      <div className="space-y-1.5 max-w-sm">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              'p-2 rounded-lg border text-xs transition-colors',
                              isDarkMode
                                ? 'bg-[#171F33] border-[#3E4850]/50 text-[#DAE2FD]'
                                : 'bg-slate-50 border-slate-200 text-slate-800'
                            )}
                          >
                            <div className="font-medium flex items-center justify-between">
                              <span>{item.name}</span>
                              <span className="font-mono font-bold text-blue-600 dark:text-[#89CEFF] ml-2">
                                x{item.quantity}
                              </span>
                            </div>
                            <div
                              className={cn(
                                'flex items-center gap-2 mt-1 text-[11px]',
                                isDarkMode ? 'text-[#88929B]' : 'text-slate-500'
                              )}
                            >
                              <span className="font-mono">{item.sku}</span>
                              <span>•</span>
                              <span
                                className={cn(
                                  'px-1.5 py-0.5 rounded font-mono font-medium',
                                  isDarkMode
                                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                                )}
                              >
                                📍 {item.shelfLocation}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total & Payment */}
                    <td className="py-4 px-4 align-top">
                      <div className={cn('font-mono font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                        {formatCurrencyVND(order.totalAmount)}
                      </div>
                      <div className="mt-1">
                        {order.paymentMethod === 'SEPAY' ? (
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border',
                              isDarkMode
                                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            )}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Đã TT qua SePay
                          </span>
                        ) : (
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border',
                              isDarkMode
                                ? 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            )}
                          >
                            Thu hộ COD
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Created at */}
                    <td className={cn('py-4 px-4 align-top text-xs font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                      {order.createdAt}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 align-top text-right space-y-2">
                      <div className="flex items-center justify-end gap-2">
                        {/* Print packing slip */}
                        <button
                          onClick={() => setSelectedOrderForPrint(order)}
                          className={cn(
                            'flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors border',
                            isDarkMode
                              ? 'bg-[#171F33] text-[#DAE2FD] border-[#3E4850]/60 hover:bg-[#222A3D]'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          )}
                          title="In phiếu nhặt hàng A5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Phiếu A5</span>
                        </button>

                        {/* Status transitions */}
                        {order.status === 'NEED_PACK' && (
                          <button
                            onClick={() => handleStartPacking(order.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 shadow-sm transition-colors"
                          >
                            <Package className="w-3.5 h-3.5" />
                            <span>Đóng gói</span>
                          </button>
                        )}

                        {order.status === 'PACKING' && (
                          <button
                            onClick={() => {
                              setSelectedOrderForHandover(order);
                              setTrackingNumber(`GHN-${Math.floor(10000000 + Math.random() * 90000000)}`);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm transition-colors"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Bàn giao bưu tá</span>
                          </button>
                        )}

                        {order.status === 'SHIPPED' && (
                          <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Đã giao vận chuyển
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: A5 Pick-list Print Modal (<PrintPackingSlipModal>) */}
      {selectedOrderForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-lg text-slate-900">
                  Xem Trước Phiếu Nhặt Hàng & Đóng Gói (A5 Pick-list)
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForPrint(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable A5 Document Preview */}
            <div className="mt-4 p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 space-y-4">
              <div className="flex justify-between items-start border-b pb-3">
                <div>
                  <div className="text-base font-black tracking-wider uppercase text-slate-900">
                    AUTOHUB SHOWROOM LOGISTICS
                  </div>
                  <div className="text-xs text-slate-500">Chi nhánh TP.HCM - Q.7 • Kho Phụ Kiện Tầng 1</div>
                  <div className="text-xs text-slate-500">Hotline xuất kho: 1900.8888 (Phím 3)</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-lg text-slate-900">
                    {selectedOrderForPrint.orderCode}
                  </div>
                  <div className="text-xs text-slate-500">Ngày in: {new Date().toLocaleDateString('vi-VN')}</div>
                  <div className="inline-block mt-1 font-mono text-[10px] tracking-widest bg-slate-200 px-2 py-0.5 rounded">
                    ||||| ||| ||||||| |||| ||||
                  </div>
                </div>
              </div>

              {/* Customer Box */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Người nhận hàng:</span>
                  <span className="font-bold text-slate-900">{selectedOrderForPrint.customerName}</span>
                  <div className="font-mono text-slate-600">{selectedOrderForPrint.customerPhone}</div>
                </div>
                <div>
                  <span className="text-slate-500 block">Địa chỉ giao:</span>
                  <span className="text-slate-800">{selectedOrderForPrint.shippingAddress}</span>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Danh mục phụ kiện cần nhặt kho:
                </div>
                <table className="w-full text-xs text-left border-collapse border border-slate-200">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-2 border border-slate-200">STT</th>
                      <th className="p-2 border border-slate-200">Tên Phụ Kiện</th>
                      <th className="p-2 border border-slate-200">Mã SKU</th>
                      <th className="p-2 border border-slate-200">Vị Trí Kệ</th>
                      <th className="p-2 border border-slate-200 text-center">SL</th>
                      <th className="p-2 border border-slate-200 text-center">Kiểm Đếm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrderForPrint.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-200">
                        <td className="p-2 border border-slate-200 text-center font-mono">{idx + 1}</td>
                        <td className="p-2 border border-slate-200 font-semibold">{item.name}</td>
                        <td className="p-2 border border-slate-200 font-mono text-slate-600">{item.sku}</td>
                        <td className="p-2 border border-slate-200 font-mono font-bold text-blue-700">
                          {item.shelfLocation}
                        </td>
                        <td className="p-2 border border-slate-200 text-center font-mono font-bold">
                          {item.quantity}
                        </td>
                        <td className="p-2 border border-slate-200 text-center">
                          <span className="inline-block w-4 h-4 border border-slate-400 rounded-sm"></span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-4 pt-6 text-center text-xs text-slate-600">
                <div>
                  <div className="font-medium text-slate-800">Nhân viên nhặt kho</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">(Ký và ghi rõ họ tên)</div>
                  <div className="h-12"></div>
                  <div className="border-t border-slate-300 w-32 mx-auto"></div>
                </div>
                <div>
                  <div className="font-medium text-slate-800">Nhân viên đóng gói & Bưu tá</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">(Ký và ghi rõ họ tên)</div>
                  <div className="h-12"></div>
                  <div className="border-t border-slate-300 w-32 mx-auto"></div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={() => setSelectedOrderForPrint(null)}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  window.print();
                  showToast('Đang kết nối máy in phiếu nhặt hàng A5...');
                }}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-md transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>In Phiếu Ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Courier Handover Modal (<HandoverModal>) */}
      {selectedOrderForHandover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
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
                <Truck className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-lg">Bàn Giao Cho Đơn Vị Vận Chuyển</h3>
              </div>
              <button
                onClick={() => setSelectedOrderForHandover(null)}
                className={cn('p-1 rounded-lg transition-colors', isDarkMode ? 'hover:bg-[#171F33] text-[#88929B]' : 'hover:bg-slate-100 text-slate-500')}
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
                <div className={cn('flex justify-between items-center text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                  <span>Mã đơn hàng</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-[#89CEFF]">
                    {selectedOrderForHandover.orderCode}
                  </span>
                </div>
                <div className={cn('mt-1 font-semibold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  {selectedOrderForHandover.customerName} - {selectedOrderForHandover.customerPhone}
                </div>
                <div className={cn('text-xs mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                  {selectedOrderForHandover.shippingAddress}
                </div>
              </div>

              {/* Courier selection */}
              <div>
                <label className={cn('block text-xs font-semibold mb-1.5', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-700')}>
                  Đơn vị vận chuyển lấy hàng:
                </label>
                <select
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className={cn(
                    'w-full px-3 py-2 text-sm rounded-xl border focus:outline-none transition-colors',
                    isDarkMode
                      ? 'bg-[#171F33] border-[#3E4850]/50 text-white focus:border-emerald-500'
                      : 'bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-500/40'
                  )}
                >
                  <option value="Giao Hàng Nhanh (GHN Express)">Giao Hàng Nhanh (GHN Express)</option>
                  <option value="Viettel Post Logistics">Viettel Post Logistics</option>
                  <option value="VNPost (Bưu Điện Việt Nam)">VNPost (Bưu Điện Việt Nam)</option>
                  <option value="J&T Express Fast Delivery">J&T Express Fast Delivery</option>
                </select>
              </div>

              {/* Tracking code */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className={cn('block text-xs font-semibold', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-700')}>
                    Mã vận đơn bưu tá cung cấp (Tracking No.):
                  </label>
                  <button
                    type="button"
                    onClick={() => setTrackingNumber(`GHN-${Math.floor(10000000 + Math.random() * 90000000)}`)}
                    className="text-xs text-blue-600 dark:text-[#89CEFF] hover:underline"
                  >
                    Tạo mã mẫu
                  </button>
                </div>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Ví dụ: GHN-88219920"
                  className={cn(
                    'w-full px-3 py-2 text-sm font-mono rounded-xl border focus:outline-none transition-colors',
                    isDarkMode
                      ? 'bg-[#171F33] border-[#3E4850]/50 text-white focus:border-emerald-500'
                      : 'bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-500/40'
                  )}
                />
              </div>

              <div
                className={cn(
                  'p-3 rounded-xl border text-xs flex items-start gap-2',
                  isDarkMode
                    ? 'bg-blue-950/30 border-blue-500/30 text-blue-300'
                    : 'bg-blue-50 border-blue-200 text-blue-800'
                )}
              >
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  Ngay sau khi xác nhận bàn giao, hệ thống sẽ tự động cập nhật trạng thái đơn thành <strong>SHIPPED</strong> và gửi tin nhắn Zalo ZNS / Email kèm link tra cứu tiến trình vận chuyển cho khách.
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div
              className={cn(
                'flex items-center justify-end gap-3 mt-6 pt-4 border-t',
                isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-200'
              )}
            >
              <button
                onClick={() => setSelectedOrderForHandover(null)}
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
                onClick={handleConfirmHandover}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-md transition-colors"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Xác Nhận Bàn Giao</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
