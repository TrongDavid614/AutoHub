import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartCheckout } from '@/features/customer/hooks/useCartCheckout';
import { CartSubHeaderBanner } from '@/features/customer/components/CartSubHeaderBanner';
import { CartItemListPanel } from '@/features/customer/components/CartItemListPanel';
import { ShippingAddressPanel } from '@/features/customer/components/ShippingAddressPanel';
import { PaymentMethodSelector } from '@/features/customer/components/PaymentMethodSelector';
import { StepShippingMethod } from '@/features/customer/components/StepShippingMethod';
import { ChargingTelemetryWidget } from '@/features/customer/components/ChargingTelemetryWidget';
import { OrderSummarySidebar } from '@/features/customer/components/OrderSummarySidebar';
import { AddressEditModal } from '@/features/customer/components/AddressEditModal';
import { OrderSuccessModal } from '@/features/customer/components/OrderSuccessModal';

export const CartPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  const {
    cartItems,
    savedItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    saveForLater,
    moveToCart,
    removeSavedItem,
    addressBook,
    setAddressBook,
    selectedAddress,
    setSelectedAddress,
    isAddressModalOpen,
    setIsAddressModalOpen,
    shippingMethods,
    selectedShippingId,
    setSelectedShippingId,
    isLoadingShipping,
    paymentMethod,
    setPaymentMethod,
    voucherCode,
    setVoucherCode,
    isVoucherApplied,
    voucherError,
    voucherSuccess,
    isCheckingVoucher,
    availableVouchers,
    applyVoucher,
    removeVoucher,
    rawSubtotal,
    discountAmount,
    shippingFee,
    installationFee,
    totalPayable,
    isSubmitting,
    orderSuccess,
    setOrderSuccess,
    orderId,
    sepayData,
    checkoutError,
    handleCheckout,
  } = useCartCheckout();

  // Kiểm tra xem giỏ hàng có thiết bị sạc điện không để hiển thị widget telemetry phù hợp
  const hasChargingDevice = (cartItems ?? []).some(
    (item) =>
      Boolean(item?.accessory) &&
      (item.accessory.categoryId === 1 ||
        Boolean(item.accessory.name?.toLowerCase().includes('sạc')) ||
        Boolean(item.accessory.name?.toLowerCase().includes('wallbox')))
  );

  return (
    <div className="w-full bg-[#060E20] text-[#DAE2FD] min-h-screen">
      {/* 1. SUB-HEADER & CONTEXTUAL AMBIENT BANNER */}
      <CartSubHeaderBanner />

      {/* 2. MAIN 2-COLUMN SPLIT WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {checkoutError && (
          <div className="mb-6 p-4 rounded-[2px] bg-[#3B1219] border border-[#FF5353]/50 text-[#FFD7D7] flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#FF5353] shrink-0" />
            <p className="text-sm font-medium">{checkoutError}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* LEFT COLUMN: Item Table, Address Book & Payment Options (Span 7-8) */}
          <main className="flex-1 w-full space-y-6">
            {/* Section A: Selected Cart Items + Saved Items */}
            <CartItemListPanel
              items={cartItems}
              savedItems={savedItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
              onSaveForLater={saveForLater}
              onMoveToCart={moveToCart}
              onRemoveSavedItem={removeSavedItem}
            />

            {/* Section B: Shipping & Installation Address Book */}
            <ShippingAddressPanel
              address={selectedAddress}
              onChangeAddressClick={() => setIsAddressModalOpen(true)}
              onAddAddressClick={() => setIsAddressModalOpen(true)}
            />

            {/* Section C: Shipping Method & Installation Selection */}
            <StepShippingMethod
              shippingMethods={shippingMethods}
              selectedShippingId={selectedShippingId}
              onSelectShipping={setSelectedShippingId}
              subtotal={rawSubtotal}
              isLoading={isLoadingShipping}
              stepNumber="02"
            />

            {/* Section D: Payment Method Selector */}
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onSelectMethod={setPaymentMethod}
            />

            {/* Technical Specs Telemetry Widget */}
            <ChargingTelemetryWidget hasChargingDevice={hasChargingDevice} />
          </main>

          {/* RIGHT COLUMN: Sticky Order Summary & Checkout Card (Span 4-5) */}
          <OrderSummarySidebar
            orderId={orderId}
            itemCount={cartItems.length}
            rawSubtotal={rawSubtotal}
            discountAmount={discountAmount}
            shippingFee={shippingFee}
            installationFee={installationFee}
            totalPayable={totalPayable}
            voucherCode={voucherCode}
            isVoucherApplied={isVoucherApplied}
            voucherError={voucherError}
            voucherSuccess={voucherSuccess}
            isCheckingVoucher={isCheckingVoucher}
            availableVouchers={availableVouchers}
            onVoucherCodeChange={setVoucherCode}
            onApplyVoucher={() => applyVoucher(voucherCode)}
            onRemoveVoucher={removeVoucher}
            onCheckout={handleCheckout}
            isSubmitting={isSubmitting}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>

      {/* 3. MODAL: ADDRESS EDIT / SWITCH */}
      <AddressEditModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addresses={addressBook}
        selectedAddress={selectedAddress}
        onSelectAddress={setSelectedAddress}
        onAddNewAddress={(newAddr) => setAddressBook([...addressBook, newAddr])}
      />

      {/* 4. MODAL: ORDER SUCCESS CONFIRMATION */}
      <OrderSuccessModal
        isOpen={orderSuccess}
        orderId={orderId}
        totalPayable={totalPayable}
        recipientName={selectedAddress.recipientName || 'Khách hàng'}
        sepayData={sepayData}
        onClose={() => setOrderSuccess(false)}
      />
    </div>
  );
};

export default CartPage;
