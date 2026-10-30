import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import {
  MOCK_CHECKOUT_ADDRESSES,
  MOCK_SHIPPING_METHODS,
  MOCK_CHECKOUT_ITEMS,
  type CheckoutAddress,
  type ShippingMethod,
  type CheckoutOrderItem,
} from '../mocks/checkout.mock';

export function useCheckoutFlow() {
  const { cartItems, clearCart } = useCartStore();

  // Address selection
  const [addresses, setAddresses] = useState<CheckoutAddress[]>(MOCK_CHECKOUT_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(MOCK_CHECKOUT_ADDRESSES[0].id);

  // Shipping method selection
  const [shippingMethods] = useState<ShippingMethod[]>(MOCK_SHIPPING_METHODS);
  const [selectedShippingId, setSelectedShippingId] = useState<'standard' | 'express-technician'>('standard');

  // Payment method selection
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'sepay' | 'cod'>('sepay');

  // 15-Minute countdown timer
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Voucher state
  const [voucherCode, setVoucherCode] = useState('AUTOHUBVIP');
  const [isVoucherApplied, setIsVoucherApplied] = useState(true);
  const [voucherDiscount, setVoucherDiscount] = useState(500000);
  const [voucherError, setVoucherError] = useState('');

  // Items
  const items: CheckoutOrderItem[] =
    cartItems.length > 0
      ? cartItems.map((ci) => ({
          id: ci.accessory.id,
          name: ci.accessory.name,
          subtitle: ci.accessory.description || 'Phụ kiện chính hãng AutoHub OEM',
          sku: ci.accessory.sku,
          price: ci.accessory.discountPrice || ci.accessory.price,
          quantity: ci.quantity,
          thumbnailUrl: ci.accessory.thumbnailUrl,
        }))
      : MOCK_CHECKOUT_ITEMS;

  // Pricing calculations
  const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const currentShippingMethod = shippingMethods.find((s) => s.id === selectedShippingId) || shippingMethods[0];
  const shippingFee = currentShippingMethod.price;
  const discountAmount = isVoucherApplied ? Math.min(voucherDiscount, rawSubtotal) : 0;
  const grandTotal = Math.max(0, rawSubtotal + shippingFee - discountAmount);

  // Checkout submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [orderCode, setOrderCode] = useState('GT-8842');

  const applyVoucher = (code: string) => {
    setVoucherError('');
    if (code.trim().toUpperCase() === 'AUTOHUBVIP' || code.trim().toUpperCase() === 'VNPAYAUTOHUB') {
      setIsVoucherApplied(true);
      setVoucherDiscount(500000);
    } else {
      setVoucherError('Mã ưu đãi không hợp lệ.');
      setIsVoucherApplied(false);
      setVoucherDiscount(0);
    }
  };

  const removeVoucher = () => {
    setIsVoucherApplied(false);
    setVoucherDiscount(0);
    setVoucherCode('');
  };

  const handleProcessCheckout = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setOrderCode(`GT-${Math.floor(1000 + Math.random() * 9000)}`);
    setIsSuccessModalOpen(true);
  };

  const handleFinishOrder = () => {
    setIsSuccessModalOpen(false);
    clearCart();
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  return {
    addresses,
    setAddresses,
    selectedAddressId,
    setSelectedAddressId,
    selectedAddress,
    shippingMethods,
    selectedShippingId,
    setSelectedShippingId,
    currentShippingMethod,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    timeLeftFormatted: formatTimer(timeLeft),
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
  };
}
