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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ĐÃ THANH TOÁN (PAID)</span>
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>ĐÃ GIAO HÀNG (DELIVERED)</span>
          </span>
        );
      case 'SHIPPING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-purple-500/15 border border-purple-500/40 text-purple-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5 animate-bounce" />
            <span>ĐANG GIAO HÀNG (SHIPPING)</span>
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-indigo-500/15 border border-indigo-500/40 text-indigo-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <Package className="w-3.5 h-3.5" />
            <span>ĐANG XỬ LÝ (PROCESSING)</span>
          </span>
        );
      case 'PENDING_PAYMENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>CHỜ THANH TOÁN ({formatCountdown(timeLeft)})</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-sky-500/15 border border-sky-500/40 text-sky-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>CHỜ XỬ LÝ (PENDING COD)</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-rose-500/15 border border-rose-500/40 text-rose-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <XCircle className="w-3.5 h-3.5" />
            <span>ĐÃ HỦY (CANCELLED)</span>
          </span>
        );
      case 'RETURNED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-orange-500/15 border border-orange-500/40 text-orange-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>ĐỔI TRẢ (RETURNED)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-slate-500/15 border border-slate-500/40 text-slate-300 font-mono text-[11px] font-bold uppercase">
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
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <span className="text-border-subtle">•</span>
          <div className="text-xs text-text-secondary">
            Ngày đặt:{' '}
            <span className="font-mono text-text-primary">
              {new Date(order.createdAt).toLocaleDateString('vi-VN')} {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <span className="text-border-subtle">•</span>
          <div className="text-xs text-text-secondary">
            Phương thức:{' '}
            <span className="font-mono text-accent-primary font-semibold">
              {order.paymentMethod === 'SEPAY' ? 'SePay' : 'Tiền mặt khi nhận (COD)'}
            </span>
          </div>
        </div>

        <div>{renderStatusBadge(order.status)}</div>
      </div>

      {/* 2. Body của Row: Danh sách linh kiện phụ kiện & Địa chỉ giao hàng */}
      <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Cột trái: Danh sách các Item phụ kiện */}
        <div className="space-y-4 flex-1">
          {order.orderItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <img
                src={item.accessory.thumbnailUrl || item.accessory.images?.[0]}
                alt={item.accessory.name}
                className="w-16 h-16 rounded-[4px] bg-canvas-deep border border-surface-highlight object-cover shrink-0"
              />
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex px-1.5 py-0.5 rounded-[2px] bg-surface-interactive text-[10px] font-mono text-accent-primary font-semibold">
                    {item.accessory.categoryName || 'Linh Kiện EV'}
                  </span>
                  
                </div>
                <h4 className="text-sm font-bold text-text-primary hover:text-accent-primary transition-colors truncate">
                  <Link to={`/accessories/${item.accessory.id}`}>{item.accessory.name}</Link>
                </h4>
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span>
                    Số lượng: <strong className="text-text-primary font-mono">{item.quantity}</strong> x{' '}
                    {item.unitPrice.toLocaleString('vi-VN')} VNĐ
                  </span>
                  <span className="font-mono font-bold text-text-primary">
                    {item.totalPrice.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cột phải: Thông tin nhận hàng & Vận chuyển */}
        <div className="lg:w-80 shrink-0 p-3.5 rounded-[4px] bg-surface-container/70 border border-surface-highlight space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-surface-highlight pb-2">
            <span className="font-semibold text-text-primary flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-accent-primary" />
              <span>Địa chỉ nhận hàng (DR06)</span>
            </span>
            <span className="text-[10px] font-mono text-text-muted uppercase">
              {order.shippingFee > 40000 ? 'HỎA TỐC 2H' : 'TIÊU CHUẨN'}
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
            {order.finalTotalAmount.toLocaleString('vi-VN')} VNĐ
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
                className="px-3 py-2 rounded-[4px] bg-surface-elevated hover:bg-rose-950/40 border border-surface-highlight hover:border-rose-500/50 text-xs font-semibold text-rose-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Hủy đơn</span>
              </button>
              <Link
                to={`/checkout?orderCode=${order.orderCode}&retryPayment=true`}
                className="px-4 py-2 rounded-[4px] bg-amber-500 hover:bg-amber-400 text-xs font-bold text-canvas-deep flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
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
                className="px-3 py-2 rounded-[4px] bg-surface-elevated hover:bg-rose-950/40 border border-surface-highlight hover:border-rose-500/50 text-xs font-semibold text-rose-300 flex items-center gap-1 cursor-pointer transition-colors"
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
              className="px-3.5 py-2 rounded-[4px] bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight text-xs font-semibold text-indigo-300 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Xem tiến độ đóng gói kho</span>
            </button>
          )}

          {/* 6. Nếu là đơn SHIPPING -> Theo dõi định vị xe bưu bực (Tracking) & Xác nhận nhận hàng */}
          {order.status === 'SHIPPING' && (
            <>
              <button
                type="button"
                onClick={() => onOpenTracking(order)}
                className="px-3.5 py-2 rounded-[4px] bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight text-xs font-semibold text-purple-300 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Truck className="w-3.5 h-3.5 text-purple-400" />
                <span>Theo dõi đơn vận</span>
              </button>
              <button
                type="button"
                onClick={() => onConfirmDelivered(order.id)}
                className="px-3.5 py-2 rounded-[4px] bg-emerald-400 hover:bg-emerald-300 text-xs font-bold text-canvas-deep flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
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
                className="px-3.5 py-2 rounded-[4px] bg-surface-elevated hover:bg-amber-950/40 border border-surface-highlight hover:border-amber-400/50 text-xs font-semibold text-amber-400 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>Đánh giá</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenReturn(order)}
                className="px-3.5 py-2 rounded-[4px] bg-surface-elevated hover:bg-orange-950/40 border border-surface-highlight hover:border-orange-500/50 text-xs font-semibold text-orange-400 flex items-center gap-1.5 cursor-pointer transition-colors"
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
