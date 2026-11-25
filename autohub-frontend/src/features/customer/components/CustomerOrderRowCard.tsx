import React from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Copy,
  Check,
  Eye,
  Repeat,
  CreditCard,
  Truck,
  Star,
  RefreshCcw,
  XCircle,
  Clock,
  ShieldCheck,
  MapPin,
  Phone,
} from 'lucide-react';
import type { AccessoryOrder, AccessoryOrderStatus } from '@/types/order.types';

interface CustomerOrderRowCardProps {
  order: AccessoryOrder;
  copiedCode: string | null;
  timeLeft: number;
  formatCountdown: (seconds: number) => string;
  onCopyCode: (code: string) => void;
  onReorder: (order: AccessoryOrder) => void;
  onConfirmDelivered: (orderId: number) => void;
  onOpenReview: (order: AccessoryOrder) => void;
  onOpenReturn: (order: AccessoryOrder) => void;
  onOpenTracking: (order: AccessoryOrder) => void;
  onOpenCancel: (order: AccessoryOrder) => void;
  onOpenProgress: (order: AccessoryOrder) => void;
}

export const CustomerOrderRowCard: React.FC<CustomerOrderRowCardProps> = ({
  order,
  copiedCode,
  timeLeft,
  formatCountdown,
  onCopyCode,
  onReorder,
  onConfirmDelivered,
  onOpenReview,
  onOpenReturn,
  onOpenTracking,
  onOpenCancel,
  onOpenProgress,
}) => {
  const renderStatusBadge = (status: AccessoryOrderStatus) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Đã thanh toán</span>
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Đã giao hàng</span>
          </span>
        );
      case 'SHIPPING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold">
            <Truck className="w-3.5 h-3.5" />
            <span>Đang giao hàng</span>
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Package className="w-3.5 h-3.5" />
            <span>Đang xử lý</span>
          </span>
        );
      case 'PENDING_PAYMENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold tabular-nums">
            <Clock className="w-3.5 h-3.5" />
            <span>Chờ thanh toán ({formatCountdown(timeLeft)})</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Chờ xử lý (COD)</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" />
            <span>Đã hủy</span>
          </span>
        );
      case 'RETURNED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold">
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Đổi trả</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
            {status}
          </span>
        );
    }
  };

  const isSuccessOrder = order.status === 'PAID' || order.status === 'DELIVERED';

  return (
    <div className="rounded-[6px] bg-surface-elevated/80 border border-surface-highlight hover:border-accent-primary/40 shadow-xl overflow-hidden transition-all duration-200">
      {/* 1. Header của Row: Mã đơn, Thời gian, Badge trạng thái */}
      <div className="p-4 bg-surface-container border-b border-surface-highlight flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            
            <span className="font-mono text-sm font-bold text-accent-primary">{order.orderCode}</span>
            <button
              type="button"
              onClick={() => onCopyCode(order.orderCode)}
              className="p-1 rounded hover:bg-surface-interactive text-text-muted hover:text-accent-primary transition-colors cursor-pointer"
              title="Sao chép mã đơn"
            >
              {copiedCode === order.orderCode ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <span className="text-border-subtle">•</span>
          <div className="text-xs text-text-secondary">
            Ngày đặt:{' '}
            <span className="font-mono text-text-primary">
              {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : 'Mới cập nhật'}{' '}
              {order.createdAt ? new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}
            </span>
          </div>

          <span className="text-border-subtle">•</span>
          <div className="text-xs text-text-secondary">
            Phương thức:{' '}
            <span className="font-mono text-accent-primary font-semibold">
              {order.paymentMethod === 'SEPAY' ? 'SePay' : order.paymentMethod === 'VNPAY' ? 'VNPay' : 'Tiền mặt khi nhận (COD)'}
            </span>
          </div>
        </div>

        <div>{renderStatusBadge(order.status)}</div>
      </div>

      {/* 2. Body của Row: Danh sách linh kiện phụ kiện & Địa chỉ giao hàng */}
      <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Cột trái: Danh sách các Item phụ kiện */}
        <div className="space-y-4 flex-1">
          {(() => {
            const items = order.orderItems ?? order.items ?? [];
            if (items.length === 0) {
              return (
                <div className="text-xs text-text-muted italic py-2">
                  Chưa có chi tiết phụ kiện cho đơn hàng này.
                </div>
              );
            }
            return items.map((item, idx) => {
              const acc = item.accessory;
              const thumb = acc?.thumbnailUrl || acc?.imageUrl || acc?.images?.[0] || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=300';
              const name = acc?.name || 'Phụ kiện AutoHub';
              const catName = acc?.categoryName || (acc as unknown as { category?: string })?.category || 'Linh Kiện EV';
              const accId = acc?.id ?? item.accessoryId;
              const unitPrice = item.unitPrice ?? acc?.price ?? 0;
              const qty = item.quantity ?? 1;
              const totalPrice = item.totalPrice ?? (unitPrice * qty);

              return (
                <div key={item.id ?? idx} className="flex items-start gap-4">
                  <img
                    src={thumb}
                    alt={name}
                    className="w-16 h-16 rounded-[4px] bg-canvas-deep border border-surface-highlight object-cover shrink-0"
                  />
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex px-1.5 py-0.5 rounded-[2px] bg-surface-interactive text-[10px] font-mono text-accent-primary font-semibold">
                        {catName}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-text-primary hover:text-accent-primary transition-colors truncate">
                      {accId ? (
                        <Link to={`/accessories/${accId}`}>{name}</Link>
                      ) : (
                        <span>{name}</span>
                      )}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-text-secondary">
                      <span>
                        Số lượng: <strong className="text-text-primary font-mono">{qty}</strong> x{' '}
                        {unitPrice.toLocaleString('vi-VN')} VNĐ
                      </span>
                      <span className="font-mono font-bold text-text-primary">
                        {totalPrice.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>

        {/* Cột phải: Thông tin nhận hàng & Vận chuyển */}
        <div className="lg:w-80 shrink-0 p-3.5 rounded-[4px] bg-surface-container/70 border border-surface-highlight space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-surface-highlight pb-2">
            <span className="font-semibold text-text-primary flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-accent-primary" />
              <span>Địa chỉ nhận hàng (DR06)</span>
            </span>
            <span className="text-[10px] font-mono text-text-muted uppercase">
              {(order.shippingFee ?? 0) > 40000 ? 'HỎA TỐC 2H' : 'TIÊU CHUẨN'}
            </span>
          </div>

          <div className="space-y-1 text-text-secondary">
            <div className="flex items-center justify-between">
              <span className="font-bold text-text-primary">{order.customerName}</span>
              <span className="font-mono text-text-muted flex items-center gap-1">
                <Phone className="w-3 h-3 text-text-muted" />
                {order.customerPhone}
              </span>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">
              {order.shippingAddress}
            </p>
          </div>

          {order.trackingNumber && (
            <div className="pt-2 border-t border-surface-highlight flex items-center justify-between text-[11px]">
              <span className="text-text-muted">Mã vận đơn:</span>
              <span className="font-mono font-bold text-accent-primary">{order.trackingNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Footer của Row: Tổng tiền & CÁC CHỨC NĂNG NGHIỆP VỤ */}
      <div className="p-4 bg-surface-container/90 border-t border-surface-highlight flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tổng tiền thanh toán */}
        <div>
          <div className="text-[11px] text-text-muted font-mono uppercase">Tổng giá trị đơn hàng (Đã gồm VAT):</div>
          <div className="font-mono text-lg font-bold text-accent-primary">
            {(order.finalTotalAmount ?? 0).toLocaleString('vi-VN')} VNĐ
          </div>
        </div>

        {/* CÁC NÚT HÀNH ĐỘNG HỢP LÝ THEO QUY TRÌNH NGHIỆP VỤ FILE WORD */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* A. Đối với đơn hàng thành công (PAID hoặc DELIVERED):
              User yêu cầu: có 2 chức năng là "Mua lại" và "Xem chi tiết" (hiển thị page success) */}
          {isSuccessOrder && (
            <>
              {/* 1. Nút Mua Lại */}
              <button
                type="button"
                onClick={() => onReorder(order)}
                className="px-3.5 py-2 rounded-[4px] bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight hover:border-accent-primary text-xs font-semibold text-accent-primary flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Thêm các sản phẩm trong đơn này vào giỏ hàng để mua lại"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Mua lại</span>
              </button>

              <Link
                to={`/order-success?orderCode=${order.orderCode}&status=success`}
                className="px-4 py-2 rounded-[4px] bg-accent-action hover:bg-accent-primary text-xs font-bold text-accent-contrast flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                title="Xem chi tiết đơn hàng dạng E-Receipt & Hóa đơn điện tử tại Order Success Page"
              >
                <Eye className="w-3.5 h-3.5 text-accent-contrast" />
                <span>Xem chi tiết</span>
              </Link>
            </>
          )}

          {/* B. Đối với các Enum còn lại: Thêm các chức năng nghiệp vụ hợp lý */}
          {/* 3. Nếu là đơn PENDING_PAYMENT -> Cần Thanh toán ngay (15 phút BR04/UC34) & Hủy đơn */}
          {order.status === 'PENDING_PAYMENT' && (
            <>
              <button
                type="button"
                onClick={() => onOpenCancel(order)}
                className="px-3 py-2 rounded-lg bg-[var(--surface)] hover:bg-red-50 border border-[var(--line)] hover:border-red-200 text-xs font-semibold text-red-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Hủy đơn</span>
              </button>
              <Link
                to={`/checkout?orderCode=${order.orderCode}&retryPayment=true`}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer transition-colors tabular-nums"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Thanh toán ngay ({formatCountdown(timeLeft)})</span>
              </Link>
            </>
          )}

          {/* 4. Nếu là đơn PENDING (COD chờ duyệt) -> Có thể Hủy đơn trước khi kho duyệt */}
          {order.status === 'PENDING' && (
            <>
              <button
                type="button"
                onClick={() => onOpenCancel(order)}
                className="px-3 py-2 rounded-lg bg-[var(--surface)] hover:bg-red-50 border border-[var(--line)] hover:border-red-200 text-xs font-semibold text-red-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Hủy đơn hàng</span>
              </button>
            </>
          )}

          {/* 5. Nếu là đơn PROCESSING -> Đang đóng gói & kiểm định SiC, xem tiến trình */}
          {order.status === 'PROCESSING' && (
            <button
              type="button"
              onClick={() => onOpenProgress(order)}
              className="px-3.5 py-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-subtle)] border border-[var(--line)] text-xs font-semibold text-indigo-700 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Xem tiến độ đóng gói kho</span>
            </button>
          )}

          {/* 6. Nếu là đơn SHIPPING -> Theo dõi định vị xe bưu cục (Tracking) & Xác nhận nhận hàng */}
          {order.status === 'SHIPPING' && (
            <>
              <button
                type="button"
                onClick={() => onOpenTracking(order)}
                className="px-3.5 py-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-subtle)] border border-[var(--line)] text-xs font-semibold text-violet-700 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Truck className="w-3.5 h-3.5 text-violet-600" />
                <span>Theo dõi đơn vận</span>
              </button>
              <button
                type="button"
                onClick={() => onConfirmDelivered(order.id)}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Đã nhận được hàng</span>
              </button>
            </>
          )}

          {/* 7. Nếu là đơn DELIVERED -> Có thêm Đánh giá sao (UC14) và Yêu cầu 1 Đổi 1 trong 30 ngày (UC25) */}
          {order.status === 'DELIVERED' && (
            <>
              <button
                type="button"
                onClick={() => onOpenReview(order)}
                className="px-3.5 py-2 rounded-lg bg-[var(--surface)] hover:bg-amber-50 border border-[var(--line)] hover:border-amber-200 text-xs font-semibold text-amber-700 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Đánh giá</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenReturn(order)}
                className="px-3.5 py-2 rounded-lg bg-[var(--surface)] hover:bg-orange-50 border border-[var(--line)] hover:border-orange-200 text-xs font-semibold text-orange-700 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Đổi trả 30 ngày</span>
              </button>
            </>
          )}

          {/* 8. Nếu là đơn CANCELLED -> Mua lại */}
          {order.status === 'CANCELLED' && (
            <button
              type="button"
              onClick={() => onReorder(order)}
              className="px-3.5 py-2 rounded-[4px] bg-accent-action hover:bg-accent-primary text-xs font-bold text-accent-contrast flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Đặt mua lại đơn này</span>
            </button>
          )}

          {/* 9. Nếu là đơn RETURNED -> Mua lại */}
          {order.status === 'RETURNED' && (
            <button
              type="button"
              onClick={() => onReorder(order)}
              className="px-3.5 py-2 rounded-[4px] bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight text-xs font-semibold text-accent-primary flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Mua lại phụ kiện</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
