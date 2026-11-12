import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { addressService } from '../services/address.service';
import {
  MOCK_SHIPPING_METHODS,
  type CheckoutAddress,
  type ShippingMethod,
  type CheckoutOrderItem,
} from '../mocks/checkout.mock';

export function useCheckoutFlow() {
  const { cartItems, clearCart } = useCartStore();
  const { user } = useAuthStore();

  // Address selection
  const [addresses, setAddresses] = useState<CheckoutAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    addressService.getMyAddresses(user?.id).then((list) => {
      if (isMounted && list && list.length > 0) {
        const mapped: CheckoutAddress[] = list.map((a: any) => ({
          id: String(a.id),
          recipientName: a.recipientName || user?.fullName || 'Khách hàng',
          phone: a.phoneNumber || user?.phoneNumber || '0912345678',
          fullAddress: `${a.detailedAddress || a.addressLine || ''}, ${a.ward || ''}, ${a.district || ''}, ${a.provinceCity || a.province || ''}`.replace(/^,\s*|,\s*$/g, ''),
          tag: a.tag || (a.isDefault ? 'MẶC ĐỊNH' : 'ĐỊA CHỈ'),
          isDefault: !!a.isDefault,
        }));
        setAddresses(mapped);
        const defaultAddr = mapped.find((m) => m.isDefault) || mapped[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [user?.id, user?.fullName, user?.phoneNumber]);

  // Shipping method selection
  const [shippingMethods] = useState<ShippingMethod[]>(MOCK_SHIPPING_METHODS);
  const [selectedShippingId, setSelectedShippingId] = useState<'standard' | 'express-technician'>('standard');

  // Payment method selection (VNPAY | COD)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'vnpay' | 'cod'>('vnpay');

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
  const items: CheckoutOrderItem[] = cartItems.map((ci) => ({
    id: ci.accessory.id,
    name: ci.accessory.name,
    subtitle: ci.accessory.description || 'Phụ kiện chính hãng AutoHub OEM',
    sku: ci.accessory.sku,
    price: ci.accessory.discountPrice || ci.accessory.price,
    quantity: ci.quantity,
    thumbnailUrl: ci.accessory.thumbnailUrl,
  }));

  // Pricing calculations
  const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const currentShippingMethod = shippingMethods.find((s) => s.id === selectedShippingId) || shippingMethods[0];
  const shippingFee = currentShippingMethod.price;
  const discountAmount = isVoucherApplied ? Math.min(voucherDiscount, rawSubtotal) : 0;
  const grandTotal = Math.max(0, rawSubtotal + shippingFee - discountAmount);

  // Checkout submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [orderCode, setOrderCode] = useState('AH-ACC-2026-9952');

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

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleProcessCheckout = async () => {
    setIsSubmitting(true);
    let newCode = `AH-ACC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderCode(newCode);

    // Gửi request lưu đơn hàng trực tiếp tới database backend
    try {
      const res = await fetch('http://localhost:8080/api/customer/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user?.id || 5,
          recipientName: selectedAddress.recipientName,
          phone: selectedAddress.phone,
          shippingAddress: selectedAddress.fullAddress,
          paymentMethod: selectedPaymentMethod.toUpperCase(),
          voucherCode: isVoucherApplied ? voucherCode : '',
          shippingFee,
          items: items.map((i) => ({ accessoryId: i.id, quantity: i.quantity, unitPrice: i.price })),
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.data?.maDonHang) {
          newCode = json.data.maDonHang;
        }
      }
    } catch {
      // Offline fallback
    }

    setOrderCode(newCode);
    setIsSubmitting(false);
    setIsSuccessModalOpen(true);
  };

  const handleFinishOrder = () => {
    setIsSuccessModalOpen(false);
    clearCart();
  };

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
