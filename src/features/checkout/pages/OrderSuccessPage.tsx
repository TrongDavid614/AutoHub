import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { SuccessHeroBanner } from '../components/SuccessHeroBanner';
import { DigitalOrderReceiptCard } from '../components/DigitalOrderReceiptCard';
import { DeliveryTimelineTracker } from '../components/DeliveryTimelineTracker';
import { SuccessActionMatrix } from '../components/SuccessActionMatrix';
import { TrustAndSupportFooterCard } from '../components/TrustAndSupportFooterCard';

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
    <div className="relative w-full bg-[#060E20] text-[#DAE2FD] min-h-screen py-10 px-4 md:px-6 overflow-hidden">
      {/* Subtle Ambient Glow Orbs behind main content matching Figma Frame 20:13615 */}
      <div className="pointer-events-none absolute left-1/4 top-20 w-[500px] h-[500px] rounded-full bg-[#0EA5E9]/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 top-96 w-[450px] h-[450px] rounded-full bg-[#89CEFF]/8 blur-[100px]" />
      <div className="pointer-events-none absolute left-1/3 bottom-40 w-[600px] h-[600px] rounded-full bg-[#0EA5E9]/5 blur-[140px]" />

      {/* Centered Content Wrapper (Max-width 960px) */}
      <div className="max-w-[960px] mx-auto space-y-10 relative z-10">
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
