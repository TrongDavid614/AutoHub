import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { addressService } from '../services/address.service';
import type { ShippingAddress } from '../mocks/cart.mock';

const EMPTY_SHIPPING_ADDRESS: ShippingAddress = {
  id: '',
  recipientName: '',
  phone: '',
  fullAddress: 'Chưa có địa chỉ nhận hàng',
  isDefault: true,
};

export function useCartCheckout() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const { user } = useAuthStore();

  // Address state
  const [addressBook, setAddressBook] = useState<ShippingAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress>(EMPTY_SHIPPING_ADDRESS);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    addressService.getMyAddresses(user?.id).then((list) => {
      if (isMounted && list && list.length > 0) {
        const mapped: ShippingAddress[] = list.map((a: any) => ({
          id: String(a.id),
          recipientName: a.recipientName || user?.fullName || 'Khách hàng',
          phone: a.phoneNumber || user?.phoneNumber || '0912345678',
          fullAddress: `${a.detailedAddress || a.addressLine || ''}, ${a.ward || ''}, ${a.district || ''}, ${a.provinceCity || a.province || ''}`.replace(/^,\s*|,\s*$/g, ''),
          tag: a.tag || (a.isDefault ? 'MẶC ĐỊNH' : 'ĐỊA CHỈ'),
          isDefault: !!a.isDefault,
        }));
        setAddressBook(mapped);
        setSelectedAddress(mapped.find((m) => m.isDefault) || mapped[0] || EMPTY_SHIPPING_ADDRESS);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [user?.id, user?.fullName, user?.phoneNumber]);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'vnpay' | 'cod' | 'sepay'>('vnpay');

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
