import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  Search,
  X,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { staffService } from '@/features/staff-operations/services/staff.service';
import type { StaffFulfillmentOrder } from '@/types/staff.types';
import { cn, formatCurrencyVND } from '@/lib/utils';

export const OrderFulfillmentPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [orders, setOrders] = useState<StaffFulfillmentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'NEED_PACK' | 'PACKING' | 'SHIPPED'>('NEED_PACK');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForHandover, setSelectedOrderForHandover] = useState<StaffFulfillmentOrder | null>(null);

  // Handover modal form state
  const [courier, setCourier] = useState('Giao Hàng Nhanh (GHN Express)');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const fetchOrders = async () => {
    try {
      const data = await staffService.getFulfillmentOrders();
      setOrders(data);
    } catch (err) {
      console.error('Lỗi tải danh sách đơn hàng đóng gói từ database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const handleStartPacking = async (orderId: string) => {
    try {
      await staffService.packOrder(orderId);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'PACKING' as const } : o))
      );
      showToast(`Đơn hàng #${orderId} đã chuyển sang trạng thái: Đang nhặt hàng đóng gói`);
    } catch (err) {
      console.error('Lỗi bắt đầu đóng gói:', err);
    }
  };

  const handleConfirmHandover = async () => {
    if (!selectedOrderForHandover) return;
    if (!trackingNumber.trim()) {
      alert('Vui lòng nhập hoặc quét mã vận đơn (Waybill barcode)');
      return;
    }

    try {
      await staffService.handoverOrder(selectedOrderForHandover.id, courier, trackingNumber.trim());
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
      showToast(`Đã xuất kho bàn giao đơn hàng ${selectedOrderForHandover.orderCode} cho ${courier}`);
      setSelectedOrderForHandover(null);
      setTrackingNumber('');
    } catch (err) {
      console.error('Lỗi bàn giao bưu tá:', err);
    }
  };

  return (
    <div
      className={cn(
        'space-y-6 antialiased transition-colors duration-300',
        isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'
      )}
    >
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Toolbar */}
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
            Xử Lý & Đóng Gói Đơn Hàng Phụ Kiện (Fulfillment)
          </h1>
          <p className={cn('text-sm mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Dữ liệu trực tiếp từ SQL Server: Nhặt hàng theo vị trí kệ kho Showroom, in phiếu xuất kho và bàn giao bưu tá vận chuyển.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
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

      {/* Search & Status Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn, khách hàng, SĐT hoặc mã SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500',
              isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 text-white placeholder-[#88929B]' : 'bg-white border-slate-200'
            )}
          />
        </div>

        <div className="flex bg-slate-100 dark:bg-[#131B2E] p-1 rounded-xl border border-slate-200 dark:border-[#3E4850]/40 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('NEED_PACK')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5',
              activeTab === 'NEED_PACK' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500'
            )}
          >
            <span>Cần Nhặt Hàng</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-mono">{counts.NEED_PACK}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PACKING')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5',
              activeTab === 'PACKING' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500'
            )}
          >
            <span>Đang Đóng Gói</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-mono">{counts.PACKING}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SHIPPED')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5',
              activeTab === 'SHIPPED' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500'
            )}
          >
            <span>Đã Bàn Giao</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-mono">{counts.SHIPPED}</span>
          </button>
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-xs font-mono text-slate-400">Đang tải danh sách đơn hàng xuất kho từ database...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className={cn('p-12 text-center rounded-xl border text-sm font-mono', isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 text-slate-400' : 'bg-white border-slate-200 text-slate-500')}>
          Không có đơn hàng nào ở trạng thái này.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className={cn(
                'p-5 rounded-xl border space-y-4 transition-all hover:shadow-md flex flex-col justify-between',
                isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
              )}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#3E4850]/30">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-[#89CEFF]">
                    {order.orderCode}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{order.orderDate}</span>
                </div>

                <div className="mt-3 space-y-1 text-xs">
                  <div className="font-bold text-sm">{order.customerName} - {order.customerPhone}</div>
                  <div className="text-slate-500 line-clamp-1">{order.shippingAddress}</div>
                </div>

                <div className="mt-3.5 space-y-2">
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Danh mục nhặt hàng từ kho:</span>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        'p-2.5 rounded-lg border flex items-center justify-between text-xs',
                        isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200'
                      )}
                    >
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-[10px] font-mono text-blue-500">Vị trí: {item.shelfLocation} • SKU: {item.sku}</div>
                      </div>
                      <div className="font-mono font-bold text-sm">x{item.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#3E4850]/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">Tổng thanh toán</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                    {formatCurrencyVND(order.totalAmount)}
                  </strong>
                </div>

                <div className="flex gap-2">
                  {order.status === 'NEED_PACK' && (
                    <button
                      type="button"
                      onClick={() => handleStartPacking(order.id)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors"
                    >
                      Nhặt Hàng Đóng Gói
                    </button>
                  )}
                  {order.status === 'PACKING' && (
                    <button
                      type="button"
                      onClick={() => setSelectedOrderForHandover(order)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer transition-colors"
                    >
                      Bàn Giao Vận Chuyển
                    </button>
                  )}
                  {order.status === 'SHIPPED' && (
                    <div className="text-[11px] font-mono text-slate-400 text-right">
                      <div>Đã giao bưu tá: <span className="font-bold text-emerald-500">{order.courier || 'GHN'}</span></div>
                      <div>Vận đơn: <span className="font-bold text-blue-500">{order.trackingNumber || 'VNP-9952'}</span></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal bàn giao bưu tá */}
      {selectedOrderForHandover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={cn('w-full max-w-md p-6 rounded-2xl border space-y-4 shadow-2xl', isDarkMode ? 'bg-[#0B1326] border-[#3E4850]' : 'bg-white border-slate-200')}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#3E4850]/40">
              <h3 className={cn('text-base font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                Bàn Giao Đơn Hàng {selectedOrderForHandover.orderCode}
              </h3>
              <button type="button" onClick={() => setSelectedOrderForHandover(null)} className="p-1.5 rounded-lg border cursor-pointer border-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Đơn vị vận chuyển đối tác:</label>
                <select
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-[#131B2E] border-slate-200 dark:border-[#3E4850]"
                >
                  <option value="Giao Hàng Nhanh (GHN Express)">Giao Hàng Nhanh (GHN Express)</option>
                  <option value="Viettel Post Logistics">Viettel Post Logistics</option>
                  <option value="VNPost Nhanh">VNPost Nhanh</option>
                  <option value="AutoHub Express Delivery">AutoHub Express Delivery</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Mã vận đơn (Waybill Tracking ID):</label>
                <input
                  type="text"
                  placeholder="Quét hoặc nhập mã vận đơn..."
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs font-mono bg-white dark:bg-[#131B2E] border-slate-200 dark:border-[#3E4850]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmHandover}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                >
                  Xác Nhận Xuất Kho Bàn Giao
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
