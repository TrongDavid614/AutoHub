import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { orderService } from '@/features/customer/services/order.service';
import { SuccessHeroBanner } from '@/features/customer/components/SuccessHeroBanner';
import { DigitalOrderReceiptCard } from '@/features/customer/components/DigitalOrderReceiptCard';
import { DeliveryTimelineTracker } from '@/features/customer/components/DeliveryTimelineTracker';
import { SuccessActionMatrix } from '@/features/customer/components/SuccessActionMatrix';
import { TrustAndSupportFooterCard } from '@/features/customer/components/TrustAndSupportFooterCard';
import type { AccessoryOrder } from '@/types/order.types';

export const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();

  const paramOrderId = searchParams.get('orderId');
  const paramOrderCode = searchParams.get('orderCode');
  const paramTxnRef = searchParams.get('vnp_TxnRef') || searchParams.get('txnRef');

  const queryIdentifier = paramOrderId || paramOrderCode;

  const [order, setOrder] = useState<AccessoryOrder | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchOrderData() {
      setIsLoading(true);
      try {
        let foundOrder: AccessoryOrder | null = null;

        // 1. Thử tìm đơn theo orderId hoặc orderCode truyền vào URL
        if (queryIdentifier) {
          foundOrder = await orderService.getOrderDetail(queryIdentifier);
        }

        // 2. Nếu chưa tìm được và người dùng đang đăng nhập, lấy đơn hàng mới nhất
        if (!foundOrder && user?.id) {
          const myOrders = await orderService.getMyOrders(user.id);
          if (myOrders && myOrders.length > 0) {
            if (queryIdentifier) {
              const cleanId = queryIdentifier.replace(/^#/, '').toLowerCase();
              foundOrder =
                myOrders.find(
                  (o) =>
                    String(o.id) === cleanId ||
                    o.orderCode?.replace(/^#/, '').toLowerCase() === cleanId
                ) || myOrders[0];
            } else {
              foundOrder = myOrders[0];
            }
          }
        }

        if (isMounted) {
          setOrder(foundOrder);
        }
      } catch (err) {
        console.warn('[OrderSuccessPage] Lỗi khi tải chi tiết đơn hàng:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchOrderData();

    return () => {
      isMounted = false;
    };
  }, [queryIdentifier, user?.id]);

  // Chuẩn bị thời gian giao dịch & mã đối soát
  const orderDate = order?.createdAt ? new Date(order.createdAt) : new Date();
  const transactionTime = `${orderDate.getHours().toString().padStart(2, '0')}:${orderDate
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${orderDate.getSeconds().toString().padStart(2, '0')}`;

  const finalOrderCode = order?.orderCode || queryIdentifier || '#AH-ACC-2026-9952';
  const transactionId =
    order?.sepayTransactionId ||
    order?.vnpayTransactionId ||
    paramTxnRef ||
    (order?.id ? `AH-TXN-${order.id}-VN` : 'SP_90291480');

  return (
    <div className="w-full bg-[var(--bg)] text-[var(--text)] min-h-screen py-8 px-4 md:px-6">
      <div className="max-w-[960px] mx-auto space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
          <Link
            to="/customer/orders"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-subtle)] border border-[var(--line-strong)] text-xs font-medium text-[var(--text)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách đơn hàng</span>
          </Link>

          <Link
            to="/customer/orders"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
          >
            <Package className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Quản lý đơn hàng</span>
          </Link>
        </div>

        {/* Section 1: Success Hero Banner */}
        <SuccessHeroBanner
          orderCode={finalOrderCode}
          transactionTime={transactionTime}
          transactionId={transactionId}
        />

        {/* Section 2: Digital Order Receipt Card (Sleek Glassmorphic Invoice) */}
        <DigitalOrderReceiptCard
          orderCode={finalOrderCode}
          order={order}
          isLoading={isLoading}
        />

        {/* Section 3: Estimated Delivery & Fulfillment Timeline Tracker */}
        <DeliveryTimelineTracker order={order} />

        {/* Section 4: Primary Call To Action (CTA) Action Matrix */}
        <SuccessActionMatrix />

        {/* Section 5: Extra Trust & Support Footer Card */}
        <TrustAndSupportFooterCard />
      </div>
    </div>
  );
};

export default OrderSuccessPage;
