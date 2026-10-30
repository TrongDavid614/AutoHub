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
    <div className="relative w-full bg-[#060E20] text-[#DAE2FD] min-h-screen py-8 px-4 md:px-6 overflow-hidden">
      {/* Subtle Ambient Glow Orbs behind main content matching Figma Frame 20:13615 */}
      <div className="pointer-events-none absolute left-1/4 top-20 w-[500px] h-[500px] rounded-full bg-[#0EA5E9]/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 top-96 w-[450px] h-[450px] rounded-full bg-[#89CEFF]/8 blur-[100px]" />
      <div className="pointer-events-none absolute left-1/3 bottom-40 w-[600px] h-[600px] rounded-full bg-[#0EA5E9]/5 blur-[140px]" />

      {/* Centered Content Wrapper (Max-width 960px) */}
      <div className="max-w-[960px] mx-auto space-y-8 relative z-10">
        {/* Nút quay trở lại danh sách đơn hàng phụ kiện */}
        <div className="flex items-center justify-between pb-2 border-b border-[#2D3449]/40">
          <Link
            to="/customer/orders"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[4px] bg-[#171F33] hover:bg-[#222A3D] border border-[#2D3449] hover:border-[#89CEFF]/60 text-xs font-semibold text-[#89CEFF] transition-all cursor-pointer shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Quay lại danh sách đơn hàng phụ kiện</span>
          </Link>

          <Link
            to="/customer/orders"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#88929B] hover:text-[#DAE2FD] transition-colors"
          >
            <Package className="w-3.5 h-3.5 text-[#89CEFF]" />
            <span>Hub Quản Lý Đơn Hàng</span>
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
