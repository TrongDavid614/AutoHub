import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  Check,
  RefreshCw,
} from 'lucide-react';
import type { AccessoryOrder, AccessoryOrderStatus } from '@/types/order.types';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { orderService } from '@/features/customer/services/order.service';
import { OrderFilterTabs, type FilterTab } from '@/features/customer/components/OrderFilterTabs';
import { CustomerOrderRowCard } from '@/features/customer/components/CustomerOrderRowCard';
import { OrderReviewModal } from '@/features/customer/components/OrderReviewModal';
import { OrderReturnModal } from '@/features/customer/components/OrderReturnModal';
import { OrderTrackingModal } from '@/features/customer/components/OrderTrackingModal';
import { OrderCancelModal } from '@/features/customer/components/OrderCancelModal';
import { OrderTimelineModal } from '@/features/customer/components/OrderTimelineModal';

export const CustomerOrderListPage: React.FC = () => {
  const addToCart = useCartStore((s) => s.addToCart);
  const { user } = useAuthStore();

  const [orders, setOrders] = useState<AccessoryOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<AccessoryOrder | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);

  // Countdown timer cho đơn PENDING_PAYMENT (15 phút)
  const [timeLeft, setTimeLeft] = useState(12 * 60 + 45);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getMyOrders(user?.id);
      if (data && data.length > 0) {
        setOrders(data);
      }
    } catch {
      // offline fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user?.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // 1. Chức năng Mua Lại (Reorder): Thêm sản phẩm vào giỏ hàng
  const handleReorder = (order: AccessoryOrder) => {
    order.orderItems.forEach((item) => {
      addToCart(item.accessory, item.quantity);
    });
    showToast(`Đã thêm ${order.orderItems.length} sản phẩm của đơn ${order.orderCode} vào giỏ hàng!`);
  };

  // 2. Chức năng Xác nhận đã nhận hàng (Chuyển sang DELIVERED)
  const handleConfirmDelivered = async (orderId: number) => {
    await orderService.confirmDelivered(orderId);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'DELIVERED' as AccessoryOrderStatus } : o))
    );
    showToast('Xác nhận đã nhận hàng thành công! Đơn hàng đã chuyển sang trạng thái ĐÃ GIAO HÀNG.');
  };

  // 3. Chức năng Hủy đơn hàng (Hoàn tồn kho theo UC34)
  const handleConfirmCancelOrder = async () => {
    if (!selectedOrder) return;
    await orderService.cancelOrder(selectedOrder.id);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id ? { ...o, status: 'CANCELLED' as AccessoryOrderStatus } : o
      )
    );
    setShowCancelModal(false);
    showToast(`Đã hủy đơn hàng ${selectedOrder.orderCode}. Tồn kho linh kiện đã được tự động hoàn lại.`);
    setSelectedOrder(null);
  };

  // 4. Chức năng Gửi đánh giá sản phẩm (UC14)
  const handleSubmitReview = async (orderId: number, rating: number, comment: string) => {
    setShowReviewModal(false);
    await orderService.submitReview(orderId, rating, comment);
    showToast(`Đã gửi đánh giá đơn hàng #${orderId} (${rating} sao) thành công! Đánh giá đang được kiểm duyệt trước khi hiển thị.`);
    setSelectedOrder(null);
  };

  // 5. Chức năng Gửi yêu cầu đổi trả (UC25)
  const handleSubmitReturn = async (orderId: number, reason?: string, note?: string) => {
    setShowReturnModal(false);
    const returnReasonText = reason ? `${reason}${note ? ': ' + note : ''}` : 'Đổi trả phụ kiện kỹ thuật';
    await orderService.requestReturn(orderId, returnReasonText);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: 'RETURNED' as AccessoryOrderStatus } : o
      )
    );
    showToast('Đã gửi hồ sơ yêu cầu đổi trả thành công. Chuyên viên kỹ thuật sẽ liên hệ trong 24h.');
    setSelectedOrder(null);
  };

  // Lọc đơn hàng theo tab enum
  const filteredOrders =
    activeTab === 'ALL' ? orders : orders.filter((order) => order.status === activeTab);

  // Đếm số lượng đơn cho từng trạng thái
  const getOrderCount = (status: FilterTab) => {
    if (status === 'ALL') return orders.length;
    return orders.filter((o) => o.status === status).length;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Header trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-highlight">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-accent-primary" />
            <h1 className="text-xl md:text-2xl font-bold text-text-primary">Đơn Hàng Phụ Kiện Của Tôi</h1>
          </div>
          <p className="text-sm text-text-muted mt-0.5">
            Theo dõi trạng thái đơn hàng phụ kiện, hành trình vận chuyển bưu tá và quản lý đổi trả bảo hành.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadOrders}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[4px] bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-accent-primary' : ''}`} />
            <span>Làm mới</span>
          </button>

          <Link
            to="/accessories"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight hover:border-accent-primary/50 text-xs font-semibold text-accent-primary transition-all cursor-pointer shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Khám phá thêm</span>
          </Link>
        </div>
      </div>

      {/* 2. Menu Bộ lọc ngang hiển thị các chức năng theo Enum TrangThaiDonHang */}
      <OrderFilterTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        getOrderCount={getOrderCount}
      />

      {/* Toast thông báo */}
      {toastMessage && (
        <div className="p-3.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn shadow-lg">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. Danh sách đơn hàng dạng ROW (Row Card) */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center rounded-[4px] bg-surface-elevated/30 border border-surface-highlight space-y-3">
            <Package className="w-12 h-12 text-text-muted mx-auto opacity-50" />
            <h3 className="text-base font-semibold text-text-primary">Không tìm thấy đơn hàng nào</h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              Không có đơn hàng phụ kiện nào ở trạng thái này. Bạn có thể chọn danh mục khác hoặc mua sắm phụ kiện mới.
            </p>
            <Link
              to="/accessories"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[4px] bg-accent-action hover:bg-accent-primary text-xs font-bold text-accent-contrast mt-2 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Xem danh mục phụ kiện</span>
            </Link>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <CustomerOrderRowCard
              key={order.id}
              order={order}
              copiedCode={copiedCode}
              timeLeft={timeLeft}
              formatCountdown={formatCountdown}
              onCopyCode={handleCopyCode}
              onReorder={handleReorder}
              onConfirmDelivered={handleConfirmDelivered}
              onOpenReview={(o) => {
                setSelectedOrder(o);
                setShowReviewModal(true);
              }}
              onOpenReturn={(o) => {
                setSelectedOrder(o);
                setShowReturnModal(true);
              }}
              onOpenTracking={(o) => {
                setSelectedOrder(o);
                setShowTrackingModal(true);
              }}
              onOpenCancel={(o) => {
                setSelectedOrder(o);
                setShowCancelModal(true);
              }}
              onOpenProgress={(o) => {
                setSelectedOrder(o);
                setShowProgressModal(true);
              }}
            />
          ))
        )}
      </div>

      {/* 4. Các Modals Nghiệp Vụ */}
      <OrderReviewModal
        order={selectedOrder}
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setSelectedOrder(null);
        }}
        onSubmitReview={handleSubmitReview}
      />

      <OrderReturnModal
        order={selectedOrder}
        isOpen={showReturnModal}
        onClose={() => {
          setShowReturnModal(false);
          setSelectedOrder(null);
        }}
        onSubmitReturn={handleSubmitReturn}
      />

      <OrderTrackingModal
        order={selectedOrder}
        isOpen={showTrackingModal}
        onClose={() => {
          setShowTrackingModal(false);
          setSelectedOrder(null);
        }}
      />

      <OrderCancelModal
        order={selectedOrder}
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setSelectedOrder(null);
        }}
        onConfirmCancel={handleConfirmCancelOrder}
      />

      <OrderTimelineModal
        order={selectedOrder}
        isOpen={showProgressModal}
        onClose={() => {
          setShowProgressModal(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
};
