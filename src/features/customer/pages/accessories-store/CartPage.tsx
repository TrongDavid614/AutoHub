import React from 'react';
import { useCartCheckout } from '@/features/customer/hooks/useCartCheckout';
import { CartSubHeaderBanner } from '@/features/customer/components/CartSubHeaderBanner';
import { CartItemListPanel } from '@/features/customer/components/CartItemListPanel';
import { ShippingAddressPanel } from '@/features/customer/components/ShippingAddressPanel';
import { PaymentMethodSelector } from '@/features/customer/components/PaymentMethodSelector';
import { ChargingTelemetryWidget } from '@/features/customer/components/ChargingTelemetryWidget';
import { OrderSummarySidebar } from '@/features/customer/components/OrderSummarySidebar';
import { AddressEditModal } from '@/features/customer/components/AddressEditModal';
import { OrderSuccessModal } from '@/features/customer/components/OrderSuccessModal';

export const CartPage: React.FC = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    addressBook,
    setAddressBook,
    selectedAddress,
    setSelectedAddress,
    isAddressModalOpen,
    setIsAddressModalOpen,
    paymentMethod,
    setPaymentMethod,
    voucherCode,
    setVoucherCode,
    isVoucherApplied,
    voucherError,
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
    handleCheckout,
  } = useCartCheckout();

  return (
    <div className="w-full bg-[#060E20] text-[#DAE2FD] min-h-screen">
      {/* 1. SUB-HEADER & CONTEXTUAL AMBIENT BANNER */}
      <CartSubHeaderBanner />

      {/* 2. MAIN 2-COLUMN SPLIT WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* LEFT COLUMN: Item Table, Address Book & Payment Options (Span 7-8) */}
          <main className="flex-1 w-full space-y-6">
            {/* Section A: Selected Cart Items */}
            <CartItemListPanel
              items={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
            />

            {/* Section B: Shipping & Installation Address Book */}
            <ShippingAddressPanel
              address={selectedAddress}
              onChangeAddressClick={() => setIsAddressModalOpen(true)}
              onAddAddressClick={() => setIsAddressModalOpen(true)}
            />

            {/* Section C: Payment Method Selector */}
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onSelectMethod={setPaymentMethod}
            />

            {/* Technical Specs Telemetry Widget */}
            <ChargingTelemetryWidget />
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
            onVoucherCodeChange={setVoucherCode}
            onApplyVoucher={() => applyVoucher(voucherCode)}
            onRemoveVoucher={removeVoucher}
            onCheckout={handleCheckout}
            isSubmitting={isSubmitting}
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
        recipientName={selectedAddress.recipientName}
        onClose={() => {
          setOrderSuccess(false);
          clearCart();
        }}
      />
    </div>
  );
};

export default CartPage;
