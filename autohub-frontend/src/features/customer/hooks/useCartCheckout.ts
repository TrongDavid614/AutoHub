import { useState, useEffect, useCallback } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { addressService } from '../services/address.service';
import { cartService } from '../services/cart.service';
import type { ShippingAddress } from '../mocks/cart.mock';
import type { ExtendedAddress } from '../components/AddressCard';
import type { AvailableVoucher, SepayPaymentInfo, ShippingMethod } from '@/types/cart.types';

const EMPTY_SHIPPING_ADDRESS: ShippingAddress = {
  id: '',
  recipientName: '',
  phone: '',
  fullAddress: 'Chưa có địa chỉ nhận hàng',
  isDefault: true,
};

export function useCartCheckout() {
  const {
    cartItems,
    savedItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    saveForLater,
    moveToCart,
    removeSavedItem,
    fetchCartFromServer,
    syncGuestCartWithServer,
  } = useCartStore();

  const { user } = useAuthStore();

  // Address state
  const [addressBook, setAddressBook] = useState<ShippingAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress>(EMPTY_SHIPPING_ADDRESS);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Vouchers state
  const [availableVouchers, setAvailableVouchers] = useState<AvailableVoucher[]>([]);
  const [voucherCode, setVoucherCode] = useState('');
  const [isVoucherApplied, setIsVoucherApplied] = useState(false);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherError, setVoucherError] = useState('');
  const [voucherSuccess, setVoucherSuccess] = useState('');
  const [isCheckingVoucher, setIsCheckingVoucher] = useState(false);

  // Shipping method state
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShippingId, setSelectedShippingId] = useState<string>('standard');
  const [isLoadingShipping, setIsLoadingShipping] = useState<boolean>(true);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'vnpay' | 'cod' | 'sepay'>('sepay');

  // Order submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [sepayData, setSepayData] = useState<SepayPaymentInfo | undefined>(undefined);
  const [checkoutError, setCheckoutError] = useState('');

  // 1. Tự động đồng bộ giỏ hàng từ máy chủ khi vào trang /cart hoặc khi user đổi
  useEffect(() => {
    let isMounted = true;
    if (user?.id) {
      syncGuestCartWithServer(user.id);
    } else {
      fetchCartFromServer(5);
    }

    // Tải danh sách voucher khả dụng
    cartService.getAvailableVouchers().then((vouchers) => {
      if (isMounted && vouchers && vouchers.length > 0) {
        setAvailableVouchers(vouchers);
      }
    });

    // Tải danh sách các gói vận chuyển từ cơ sở dữ liệu
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
  }, [user?.id, fetchCartFromServer, syncGuestCartWithServer]);

  // 2. Tải sổ địa chỉ của người dùng
  useEffect(() => {
    let isMounted = true;
    const customerId = user?.id || 5;
    addressService.getMyAddresses(customerId).then((list) => {
      if (isMounted && list && list.length > 0) {
        const mapped: ShippingAddress[] = list.map((a: ExtendedAddress) => ({
          id: String(a.id),
          recipientName: a.recipientName || user?.fullName || 'Nguyễn Văn A',
          phone: a.phoneNumber || user?.phoneNumber || '0912345678',
          fullAddress: `${a.detailedAddress || ''}, ${a.ward || ''}, ${a.district || ''}, ${a.provinceCity || ''}`.replace(/^,\s*|,\s*$/g, ''),
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

  // 3. Tính toán biểu phí và tạm tính
  const rawSubtotal = cartItems.reduce(
    (sum, item) => sum + (item.accessory.discountPrice || item.accessory.price) * item.quantity,
    0
  );

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
  const installationFee = 0; // Đã bao gồm trong chính sách gói kỹ thuật viên
  const discountAmount = isVoucherApplied ? Math.min(voucherDiscount, rawSubtotal) : 0;
  const totalPayable = Math.max(0, rawSubtotal - discountAmount + shippingFee + installationFee);

  // 4. Áp dụng mã Voucher gọi API kiểm tra thực tế
  const applyVoucher = useCallback(
    async (codeToApply?: string) => {
      const code = (codeToApply || voucherCode).trim().toUpperCase();
      if (!code) {
        setVoucherError('Vui lòng nhập mã ưu đãi trước khi áp dụng.');
        return;
      }

      setIsCheckingVoucher(true);
      setVoucherError('');
      setVoucherSuccess('');

      try {
        const result = await cartService.validateVoucher(code, rawSubtotal);
        if (result.valid) {
          setIsVoucherApplied(true);
          setVoucherDiscount(result.discountAmount);
          setVoucherCode(result.code);
          setVoucherSuccess(result.message || `Đã áp dụng mã ${result.code}`);
        } else {
          setIsVoucherApplied(false);
          setVoucherDiscount(0);
          setVoucherError(result.message || 'Mã ưu đãi không hợp lệ hoặc đã hết hạn.');
        }
      } catch {
        setVoucherError('Không thể kiểm tra mã ưu đãi. Vui lòng thử lại sau.');
      } finally {
        setIsCheckingVoucher(false);
      }
    },
    [voucherCode, rawSubtotal]
  );

  const removeVoucher = () => {
    setIsVoucherApplied(false);
    setVoucherDiscount(0);
    setVoucherCode('');
    setVoucherError('');
    setVoucherSuccess('');
  };

  // 5. Đặt hàng & Thanh toán (Checkout) thực tế xuống cơ sở dữ liệu
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setCheckoutError('Giỏ hàng đang trống. Vui lòng chọn ít nhất 1 phụ kiện.');
      return;
    }

    setIsSubmitting(true);
    setCheckoutError('');

    try {
      const customerId = user?.id || 5;
      const res = await cartService.checkout({
        customerId,
        recipientName: selectedAddress.recipientName || user?.fullName || 'Khách hàng AutoHub',
        phone: selectedAddress.phone || user?.phoneNumber || '0912345678',
        shippingAddress: selectedAddress.fullAddress || 'Showroom AutoHub TP.HCM',
        paymentMethod: paymentMethod.toUpperCase() as 'COD' | 'SEPAY' | 'VNPAY',
        voucherCode: isVoucherApplied ? voucherCode : undefined,
        shippingMethodId: currentShippingMethod?.code || currentShippingMethod?.methodId || selectedShippingId,
        shippingFee,
        items: cartItems.map((ci) => ({
          accessoryId: ci.accessory.id,
          quantity: ci.quantity,
          unitPrice: ci.accessory.discountPrice || ci.accessory.price,
        })),
      });

      const finalCode = res.orderCode || res.maDonHang || `AH-ACC-2026-${res.orderId}`;
      setOrderId(finalCode);
      if (res.sepay) {
        setSepayData(res.sepay);
      }

      setOrderSuccess(true);
      await clearCart(customerId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.';
      setCheckoutError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
    currentShippingMethod,
    isLoadingShipping,
    paymentMethod,
    setPaymentMethod,
    voucherCode,
    setVoucherCode,
    isVoucherApplied,
    voucherDiscount,
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
  };
}
