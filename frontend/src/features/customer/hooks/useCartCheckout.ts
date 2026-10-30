import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import {
  DEFAULT_SHIPPING_ADDRESS,
  MOCK_ADDRESS_BOOK,
  WALLBOX_SAMPLE_ACCESSORY,
  type ShippingAddress,
} from '../mocks/cart.mock';

export function useCartCheckout() {
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCartStore();

  // If cart is empty on fresh visit, seed with Wallbox sample item matching Figma
  useEffect(() => {
    if (cartItems.length === 0) {
      addToCart(WALLBOX_SAMPLE_ACCESSORY, 1);
    }
  }, [cartItems.length, addToCart]);

  // Address state
  const [addressBook, setAddressBook] = useState<ShippingAddress[]>(MOCK_ADDRESS_BOOK);
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress>(DEFAULT_SHIPPING_ADDRESS);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'sepay' | 'cod'>('sepay');

  // Voucher state
  const [voucherCode, setVoucherCode] = useState('AUTOHUBGT500');
  const [isVoucherApplied, setIsVoucherApplied] = useState(true);
  const [voucherDiscount, setVoucherDiscount] = useState(500000);
  const [voucherError, setVoucherError] = useState('');

  // Order submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('GT-8842');

  const applyVoucher = (code: string) => {
    setVoucherError('');
    if (code.trim().toUpperCase() === 'AUTOHUBGT500') {
      setIsVoucherApplied(true);
      setVoucherDiscount(500000);
    } else if (code.trim().toUpperCase() === 'AUTOHUB1000') {
      setIsVoucherApplied(true);
      setVoucherDiscount(1000000);
    } else {
      setVoucherError('Mã ưu đãi không hợp lệ hoặc đã hết lượt áp dụng.');
      setIsVoucherApplied(false);
      setVoucherDiscount(0);
    }
  };

  const removeVoucher = () => {
    setIsVoucherApplied(false);
    setVoucherDiscount(0);
    setVoucherCode('');
  };

  // Calculations
  const rawSubtotal = cartItems.reduce(
    (sum, item) => sum + (item.accessory.discountPrice || item.accessory.price) * item.quantity,
    0
  );

  const discountAmount = isVoucherApplied ? Math.min(voucherDiscount, rawSubtotal) : 0;
  const shippingFee = 0; // Free for 800V Wallbox accessories
  const installationFee = 0; // Free 24h Mobile Service
  const totalPayable = Math.max(0, rawSubtotal - discountAmount + shippingFee + installationFee);

  const handleCheckout = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setOrderId(`GT-${Math.floor(1000 + Math.random() * 9000)}`);
    setOrderSuccess(true);
  };

  return {
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
    voucherDiscount,
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
  };
}
