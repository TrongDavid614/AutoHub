import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse } from '@/types/api.types';
import type {
  BackendCartResponse,
  VoucherValidationResponse,
  AvailableVoucher,
  ShippingMethod,
  CheckoutOrderRequest,
  CheckoutOrderResponse,
} from '@/types/cart.types';

export const cartService = {
  /**
   * Lấy dữ liệu giỏ hàng hiện tại từ cơ sở dữ liệu
   */
  async getCart(customerId?: number): Promise<BackendCartResponse | null> {
    try {
      const url = customerId ? `/customer/cart?customerId=${customerId}` : `/customer/cart`;
      const res = await axiosClient.get<unknown, ApiResponse<BackendCartResponse>>(url);
      if (res?.data) {
        return res.data;
      }
    } catch (err) {
      console.warn('[CartService] Lỗi khi lấy giỏ hàng từ máy chủ:', err);
    }
    return null;
  },

  /**
   * Thêm phụ kiện vào giỏ hàng trên DB
   */
  async addItem(
    accessoryId: number,
    quantity: number = 1,
    customerId?: number
  ): Promise<BackendCartResponse | null> {
    try {
      const res = await axiosClient.post<unknown, ApiResponse<BackendCartResponse>>(
        '/customer/cart/items',
        {
          accessoryId,
          quantity,
          customerId,
        }
      );
      if (res?.data) {
        return res.data;
      }
    } catch (err: unknown) {
      const errMsg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      throw new Error(errMsg || 'Không thể thêm sản phẩm vào giỏ hàng');
    }
    return null;
  },

  /**
   * Cập nhật số lượng (+ / -) của mục trong giỏ
   */
  async updateQuantity(
    accessoryId: number,
    quantity: number,
    customerId?: number
  ): Promise<BackendCartResponse | null> {
    try {
      const res = await axiosClient.put<unknown, ApiResponse<BackendCartResponse>>(
        `/customer/cart/items/${accessoryId}`,
        {
          quantity,
          customerId,
        }
      );
      if (res?.data) {
        return res.data;
      }
    } catch (err: unknown) {
      const errMsg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      throw new Error(errMsg || 'Không thể cập nhật số lượng');
    }
    return null;
  },

  /**
   * Xóa một phụ kiện khỏi giỏ hàng
   */
  async removeItem(
    accessoryId: number,
    customerId?: number
  ): Promise<BackendCartResponse | null> {
    try {
      const url = customerId
        ? `/customer/cart/items/${accessoryId}?customerId=${customerId}`
        : `/customer/cart/items/${accessoryId}`;
      const res = await axiosClient.delete<unknown, ApiResponse<BackendCartResponse>>(url);
      if (res?.data) {
        return res.data;
      }
    } catch (err) {
      console.warn('[CartService] Lỗi khi xóa mục khỏi giỏ hàng:', err);
    }
    return null;
  },

  /**
   * Xóa toàn bộ giỏ hàng
   */
  async clearCart(customerId?: number): Promise<boolean> {
    try {
      const url = customerId ? `/customer/cart?customerId=${customerId}` : `/customer/cart`;
      await axiosClient.delete<unknown, ApiResponse<unknown>>(url);
      return true;
    } catch (err) {
      console.warn('[CartService] Lỗi khi làm trống giỏ hàng:', err);
      return false;
    }
  },

  /**
   * Đồng bộ giỏ hàng vãng lai (guest) lên database người dùng sau khi đăng nhập
   */
  async syncGuestCart(
    items: Array<{ accessoryId: number; quantity: number }>,
    customerId?: number
  ): Promise<BackendCartResponse | null> {
    try {
      const res = await axiosClient.post<unknown, ApiResponse<BackendCartResponse>>(
        '/customer/cart/sync',
        {
          items,
          customerId,
        }
      );
      if (res?.data) {
        return res.data;
      }
    } catch (err) {
      console.warn('[CartService] Lỗi khi đồng bộ giỏ hàng vãng lai:', err);
    }
    return null;
  },

  /**
   * Kiểm tra và tính toán giảm giá của mã voucher từ DB
   */
  async validateVoucher(
    code: string,
    subtotal: number
  ): Promise<VoucherValidationResponse> {
    try {
      const res = await axiosClient.post<unknown, ApiResponse<VoucherValidationResponse>>(
        '/customer/vouchers/validate',
        {
          code: code.trim().toUpperCase(),
          subtotal,
        }
      );
      if (res?.data) {
        return res.data;
      }
    } catch (err: unknown) {
      const errMsg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      return {
        valid: false,
        code,
        discountAmount: 0,
        message: errMsg || 'Mã ưu đãi không hợp lệ hoặc đã hết lượt áp dụng.',
      };
    }

    return {
      valid: false,
      code,
      discountAmount: 0,
      message: 'Không thể xác thực mã ưu đãi lúc này.',
    };
  },

  /**
   * Lấy danh sách các mã voucher đang hoạt động
   */
  async getAvailableVouchers(): Promise<AvailableVoucher[]> {
    try {
      const res = await axiosClient.get<unknown, ApiResponse<AvailableVoucher[]>>(
        '/customer/vouchers/available'
      );
      if (res?.data && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (err) {
      console.warn('[CartService] Lỗi lấy danh sách voucher:', err);
    }
    return [];
  },

  /**
   * Lấy danh sách các phương thức vận chuyển thực tế từ máy chủ
   */
  async getShippingMethods(): Promise<ShippingMethod[]> {
    try {
      const res = await axiosClient.get<unknown, ApiResponse<ShippingMethod[]>>(
        API_CONFIG.ENDPOINTS.CART.SHIPPING_METHODS
      );
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (err) {
      console.warn('[CartService] Lỗi khi lấy phương thức vận chuyển:', err);
    }
    return [
      {
        id: 'standard',
        methodId: 'standard',
        code: 'STANDARD',
        title: 'Giao hàng tiêu chuẩn AutoHub Logistics',
        tag: 'BẢO HIỂM HÀNG HÓA 100%',
        price: 0,
        estimatedDelivery: '1 - 2 ngày làm việc',
        subDescription: 'Bàn giao niêm phong thùng chuyên dụng, kiểm tra hàng trước khi nhận',
        isDefault: true,
      },
      {
        id: 'express-technician',
        methodId: 'express-technician',
        code: 'EXPRESS_TECHNICIAN',
        title: 'Hỏa tốc & Kỹ thuật viên hỗ trợ lắp đặt tại chỗ',
        tag: 'VIP ON-SITE TECH',
        price: 150000,
        estimatedDelivery: 'Trong ngày (2 - 4h)',
        subDescription: 'Bao gồm khảo sát đường dây điện, kích hoạt sạc thông minh và kiểm tra an toàn tải điện',
        freeThreshold: 50000000,
        isDefault: false,
      },
      {
        id: 'showroom-pickup',
        methodId: 'showroom-pickup',
        code: 'SHOWROOM_PICKUP',
        title: 'Nhận trực tiếp tại Hệ thống Showroom AutoHub',
        tag: 'TRẢI NGHIỆM SHOWROOM',
        price: 0,
        estimatedDelivery: 'Sẵn sàng trong 2 giờ',
        subDescription: 'Hỗ trợ kỹ thuật viên hướng dẫn lắp đặt trực tiếp và thử nghiệm thiết bị tại Showroom',
        isDefault: false,
      },
    ];
  },

  /**
   * Đặt hàng và thanh toán giỏ hàng (Checkout)
   */
  async checkout(payload: CheckoutOrderRequest): Promise<CheckoutOrderResponse> {
    const res = await axiosClient.post<unknown, ApiResponse<CheckoutOrderResponse>>(
      '/customer/orders/checkout',
      payload
    );
    if (!res?.data) {
      throw new Error(res?.message || 'Không thể tạo đơn hàng');
    }
    return res.data;
  },
};
