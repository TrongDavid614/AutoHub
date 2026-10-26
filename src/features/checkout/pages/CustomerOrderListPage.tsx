import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  Check,
} from 'lucide-react';
import type { AccessoryOrder, AccessoryOrderStatus } from '@/types/order.types';
import { MOCK_CUSTOMER_ORDERS } from '../mocks/orders.mock';
import { useCartStore } from '@/store/useCartStore';
import { OrderFilterTabs, type FilterTab } from '../components/OrderFilterTabs';
import { CustomerOrderRowCard } from '../components/CustomerOrderRowCard';
import { OrderReviewModal } from '../components/OrderReviewModal';
import { OrderReturnModal } from '../components/OrderReturnModal';
import { OrderTrackingModal } from '../components/OrderTrackingModal';
import { OrderCancelModal } from '../components/OrderCancelModal';
import { OrderTimelineModal } from '../components/OrderTimelineModal';

export const CustomerOrderListPage: React.FC = () => {
  const addToCart = useCartStore((s) => s.addToCart);

  // Danh sách đơn hàng trong state để người dùng có thể tương tác (Hủy, Xác nhận nhận hàng...)
  const [orders, setOrders] = useState<AccessoryOrder[]>(MOCK_CUSTOMER_ORDERS);
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

  // Countdown timer cho đơn PENDING_PAYMENT (giả lập 15 phút theo UC34)
  const [timeLeft, setTimeLeft] = useState(12 * 60 + 45); // 12m 45s

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
  const handleConfirmDelivered = (orderId: number) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'DELIVERED' as AccessoryOrderStatus } : o))
    );
    showToast('Xác nhận đã nhận hàng thành công! Đơn hàng đã chuyển sang trạng thái ĐÃ GIAO HÀNG.');
  };

  // 3. Chức năng Hủy đơn hàng (Hoàn tồn kho theo UC34)
  const handleConfirmCancelOrder = () => {
    if (!selectedOrder) return;
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
  const handleSubmitReview = (orderId: number) => {
    setShowReviewModal(false);
    showToast(`Đã gửi đánh giá đơn hàng #${orderId} thành công! Đánh giá đang được kiểm duyệt trước khi hiển thị (UC14/UC32).`);
    setSelectedOrder(null);
  };

  // 5. Chức năng Gửi yêu cầu đổi trả (UC25)
  const handleSubmitReturn = (orderId: number) => {
    setShowReturnModal(false);
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
    <div className="space-y-6">
      {/* 1. Header trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-highlight">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-accent-primary" />
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Đơn Hàng Phụ Kiện Của Tôi</h1>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Theo dõi tình trạng đơn hàng linh kiện điện giải, xem hóa đơn điện tử E-Receipt và quản lý bảo hành.
          </p>
        </div>

        <Link
          to="/accessories"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight hover:border-accent-primary/50 text-xs font-semibold text-accent-primary transition-all cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Khám phá thêm phụ kiện</span>
        </Link>
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
