import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { addressService } from '../services/address.service';
import { cartService } from '../services/cart.service';
import type { CheckoutAddress, CheckoutOrderItem } from '../mocks/checkout.mock';
import type { ShippingMethod } from '@/types/cart.types';

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
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShippingId, setSelectedShippingId] = useState<string>('standard');
  const [isLoadingShipping, setIsLoadingShipping] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    cartService.getShippingMethods().then((methods) => {
      if (isMounted && methods && methods.length > 0) {
        setShippingMethods(methods);
        const def = methods.find((m) => m.isDefault) || methods[0];
        if (def) {
          setSelectedShippingId(def.methodId || def.id || def.code.toLowerCase());
        }
      }
      if (isMounted) {
        setIsLoadingShipping(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Payment method selection (VNPAY | COD | SEPAY)
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
  const [voucherCode, setVoucherCode] = useState('AUTOHUBGT500');
  const [isVoucherApplied, setIsVoucherApplied] = useState(false);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
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
  const currentShippingMethod =
    shippingMethods.find(
      (s) =>
        s.id === selectedShippingId ||
        s.methodId === selectedShippingId ||
        s.code?.toLowerCase() === selectedShippingId?.toLowerCase()
    ) || shippingMethods[0];

  const baseShippingFee = currentShippingMethod?.price ?? 0;
  const isFreeByThreshold = Boolean(
    currentShippingMethod?.freeThreshold != null && rawSubtotal >= currentShippingMethod.freeThreshold
  );
  const shippingFee = isFreeByThreshold ? 0 : baseShippingFee;
  const discountAmount = isVoucherApplied ? Math.min(voucherDiscount, rawSubtotal) : 0;
  const grandTotal = Math.max(0, rawSubtotal + shippingFee - discountAmount);

  // Checkout submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [orderCode, setOrderCode] = useState('AH-ACC-2026-9952');

  const applyVoucher = async (code: string) => {
    setVoucherError('');
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setVoucherError('Vui lòng nhập mã ưu đãi.');
      return;
    }
    try {
      const res = await cartService.validateVoucher(trimmed, rawSubtotal);
      if (res.valid) {
        setIsVoucherApplied(true);
        setVoucherDiscount(res.discountAmount);
        setVoucherCode(res.code);
      } else {
        setIsVoucherApplied(false);
        setVoucherDiscount(0);
        setVoucherError(res.message || 'Mã ưu đãi không hợp lệ.');
      }
    } catch {
      setVoucherError('Không thể kiểm tra mã ưu đãi. Vui lòng thử lại sau.');
    }
  };

  const removeVoucher = () => {
    setIsVoucherApplied(false);
    setVoucherDiscount(0);
    setVoucherCode('');
    setVoucherError('');
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleProcessCheckout = async () => {
    setIsSubmitting(true);
    let finalCode = `AH-ACC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const customerId = user?.id || 5;
      const res = await cartService.checkout({
        customerId,
        recipientName: selectedAddress?.recipientName || user?.fullName || 'Khách hàng',
        phone: selectedAddress?.phone || user?.phoneNumber || '0912345678',
        shippingAddress: selectedAddress?.fullAddress || 'Showroom AutoHub',
        paymentMethod: selectedPaymentMethod.toUpperCase() as 'VNPAY' | 'COD',
        voucherCode: isVoucherApplied ? voucherCode : undefined,
        shippingMethodId: currentShippingMethod?.code || currentShippingMethod?.methodId || selectedShippingId,
        shippingFee,
        items: items.map((i) => ({ accessoryId: i.id, quantity: i.quantity, unitPrice: i.price })),
      });

      if (res.orderCode || res.maDonHang) {
        finalCode = res.orderCode || res.maDonHang || finalCode;
      }
      await clearCart(customerId);
    } catch {
      // Offline fallback
    }

    setOrderCode(finalCode);
    setIsSubmitting(false);
    setIsSuccessModalOpen(true);
  };

  const handleFinishOrder = () => {
    setIsSuccessModalOpen(false);
    clearCart(user?.id || 5);
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
    isLoadingShipping,
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
