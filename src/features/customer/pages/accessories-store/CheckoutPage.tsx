import React, { useState } from 'react';
import { useCheckoutFlow } from '@/features/customer/hooks/useCheckoutFlow';
import { StepAddressSelection } from '@/features/customer/components/StepAddressSelection';
import { StepShippingMethod } from '@/features/customer/components/StepShippingMethod';
import { StepPaymentMethod } from '@/features/customer/components/StepPaymentMethod';
import { CheckoutOrderReviewSidebar } from '@/features/customer/components/CheckoutOrderReviewSidebar';
import { CheckoutSuccessModal } from '@/features/customer/components/CheckoutSuccessModal';
import { AddressEditModal } from '@/features/customer/components/AddressEditModal';

export const CheckoutPage: React.FC = () => {
  const {
    addresses,
    setAddresses,
    selectedAddressId,
    setSelectedAddressId,
    selectedAddress,
    shippingMethods,
    selectedShippingId,
    setSelectedShippingId,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    timeLeftFormatted,
    voucherCode,
    setVoucherCode,
    isVoucherApplied,
    discountAmount,
    voucherError,
    applyVoucher,
    removeVoucher,
    items,
    rawSubtotal,
    shippingFee,
    grandTotal,
    isSubmitting,
    isSuccessModalOpen,
    orderCode,
    handleProcessCheckout,
    handleFinishOrder,
  } = useCheckoutFlow();

  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);

  return (
    <div className="w-full bg-[#060E20] text-[#DAE2FD] min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Main 2-Column Split Workspace (60% / 40%) */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* LEFT COLUMN: Steps 1, 2, 3 (60%) */}
          <main className="flex-1 w-full space-y-6">
            {/* STEP 1: Địa chỉ nhận hàng */}
            <StepAddressSelection
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={setSelectedAddressId}
              onAddNewAddress={() => setIsAddAddressModalOpen(true)}
            />

            {/* STEP 2: Phương thức vận chuyển */}
            <StepShippingMethod
              shippingMethods={shippingMethods}
              selectedShippingId={selectedShippingId}
              onSelectShipping={setSelectedShippingId}
            />

            {/* STEP 3: Phương thức thanh toán */}
            <StepPaymentMethod
              selectedPaymentMethod={selectedPaymentMethod}
              onSelectPaymentMethod={setSelectedPaymentMethod}
              timeLeftFormatted={timeLeftFormatted}
            />
          </main>

          {/* RIGHT COLUMN: Order Review, Voucher & Sticky CTA (40%) */}
          <CheckoutOrderReviewSidebar
            items={items}
            rawSubtotal={rawSubtotal}
            shippingFee={shippingFee}
            discountAmount={discountAmount}
            grandTotal={grandTotal}
            voucherCode={voucherCode}
            isVoucherApplied={isVoucherApplied}
            voucherError={voucherError}
            onVoucherCodeChange={setVoucherCode}
            onApplyVoucher={() => applyVoucher(voucherCode)}
            onRemoveVoucher={removeVoucher}
            onProcessCheckout={handleProcessCheckout}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {/* Address Edit / Add Modal */}
      <AddressEditModal
        isOpen={isAddAddressModalOpen}
        onClose={() => setIsAddAddressModalOpen(false)}
        addresses={addresses.map((a) => ({
          id: a.id,
          recipientName: a.recipientName,
          phone: a.phone,
          fullAddress: a.fullAddress,
          tag: a.tag,
          isDefault: a.isDefault,
        }))}
        selectedAddress={{
          id: selectedAddress.id,
          recipientName: selectedAddress.recipientName,
          phone: selectedAddress.phone,
          fullAddress: selectedAddress.fullAddress,
          tag: selectedAddress.tag,
          isDefault: selectedAddress.isDefault,
        }}
        onSelectAddress={(addr) => setSelectedAddressId(addr.id)}
        onAddNewAddress={(newAddr) => {
          setAddresses([
            ...addresses,
            {
              id: newAddr.id,
              recipientName: newAddr.recipientName,
              phone: newAddr.phone,
              fullAddress: newAddr.fullAddress,
              tag: newAddr.tag || 'TÙY CHỌN',
              isDefault: false,
            },
          ]);
          setSelectedAddressId(newAddr.id);
        }}
      />

      {/* Checkout Success Confirmation Modal */}
      <CheckoutSuccessModal
        isOpen={isSuccessModalOpen}
        orderCode={orderCode}
        grandTotal={grandTotal}
        recipientName={selectedAddress.recipientName}
        paymentMethod={selectedPaymentMethod}
        onClose={handleFinishOrder}
      />
    </div>
  );
};

export default CheckoutPage;
