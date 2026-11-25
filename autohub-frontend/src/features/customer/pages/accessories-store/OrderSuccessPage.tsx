import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { SuccessHeroBanner } from '@/features/customer/components/SuccessHeroBanner';
import { DigitalOrderReceiptCard } from '@/features/customer/components/DigitalOrderReceiptCard';
import { DeliveryTimelineTracker } from '@/features/customer/components/DeliveryTimelineTracker';
import { SuccessActionMatrix } from '@/features/customer/components/SuccessActionMatrix';
import { TrustAndSupportFooterCard } from '@/features/customer/components/TrustAndSupportFooterCard';

export const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderCode = searchParams.get('orderId') || '#AH-ACC-2026-9952';
  const transactionId = searchParams.get('vnp_TxnRef') || 'vnp_2489218';
  const now = new Date();
  const transactionTime = `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

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
          orderCode={orderCode}
          transactionTime={transactionTime}
          transactionId={transactionId}
        />

        {/* Section 2: Digital Order Receipt Card (Sleek Glassmorphic Invoice) */}
        <DigitalOrderReceiptCard orderCode={orderCode} />

        {/* Section 3: Estimated Delivery & Fulfillment Timeline Tracker */}
        <DeliveryTimelineTracker />

        {/* Section 4: Primary Call To Action (CTA) Action Matrix */}
        <SuccessActionMatrix />

        {/* Section 5: Extra Trust & Support Footer Card */}
        <TrustAndSupportFooterCard />
      </div>
    </div>
  );
};

export default OrderSuccessPage;
