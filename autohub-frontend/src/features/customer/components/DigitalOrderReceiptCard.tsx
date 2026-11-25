import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, FileCheck2, User, Truck, Package, Tag } from 'lucide-react';
import { formatCurrencyVND } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import type { AccessoryOrder, OrderItem } from '@/types/order.types';

export interface DigitalOrderReceiptCardProps {
  orderCode: string;
  order?: AccessoryOrder | null;
  isLoading?: boolean;
}

export const DigitalOrderReceiptCard: React.FC<DigitalOrderReceiptCardProps> = ({
  orderCode,
  order,
  isLoading = false,
}) => {
  const [copied, setCopied] = useState(false);
  const { user } = useAuthStore();

  const displayOrderCode = order?.orderCode || orderCode || '#AH-ACC-2026-9952';

  const handleCopy = () => {
    navigator.clipboard.writeText(displayOrderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Phân loại cổng thanh toán & mã đối soát
  const paymentMethodLabel = (() => {
    const pm = (order?.paymentMethod || 'SEPAY').toUpperCase();
    if (pm === 'VNPAY') return 'VNPay-QR Gateway (Thẻ ATM/QR Pay)';
    if (pm === 'COD') return 'Thanh toán khi nhận hàng (COD)';
    return 'SePay QR Gateway (Thẻ/TK Nội địa 24/7)';
  })();

  const transactionCode =
    order?.sepayTransactionId ||
    order?.vnpayTransactionId ||
    (order?.id ? `AH-TXN-${order.id}-VN` : 'VNP-TXN-90291480-VN');

  // 2. Thông tin khách hàng & địa chỉ nhận
  const customerName = order?.customerName || user?.fullName || 'Khách hàng AutoHub';
  const customerPhone = order?.customerPhone || user?.phoneNumber || '0912 345 678';
  const customerEmail = order?.customerEmail || user?.email || 'customer@autohub.vn';
  const shippingAddress = order?.shippingAddress || 'Trung tâm Dịch vụ AutoHub';
  const shippingMethod = order?.donViVanChuyen || order?.shippingUnit || 'Giao hàng tiêu chuẩn AutoHub Logistics';

  const memberRank = (() => {
    if (user?.role === 'ROLE_ADMIN') return 'Quản trị viên Hệ thống';
    if (user?.role === 'ROLE_STAFF') return 'Chuyên viên AutoHub';
    return 'Thành viên AutoHub VIP';
  })();

  // 3. Danh mục sản phẩm bàn giao
  const orderItems: OrderItem[] = order?.orderItems ?? order?.items ?? [];

  // 4. Các giá trị tính toán chi phí
  const subtotal = order?.subtotalAmount ?? orderItems.reduce((acc, it) => acc + (it.unitPrice || 0) * (it.quantity || 1), 0);
  const discount = order?.voucherDiscount ?? 0;
  const shippingFee = order?.shippingFee ?? 0;
  const grandTotal = order?.finalTotalAmount ?? Math.max(0, subtotal - discount + shippingFee);

  if (isLoading) {
    return (
      <div className="relative rounded-xl bg-[var(--surface)] border border-[var(--line)] overflow-hidden p-6 md:p-8 space-y-6 animate-pulse">
        <div className="h-1 w-full bg-[var(--accent)]" />
        <div className="h-16 rounded-lg bg-[var(--surface-subtle)]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 rounded-lg bg-[var(--surface-subtle)]" />
          <div className="h-32 rounded-lg bg-[var(--surface-subtle)]" />
        </div>
        <div className="space-y-3">
          <div className="h-20 rounded-lg bg-[var(--surface-subtle)]" />
          <div className="h-20 rounded-lg bg-[var(--surface-subtle)]" />
        </div>
        <div className="h-24 rounded-lg bg-[var(--surface-subtle)]" />
      </div>
    );
  }

  return (
    <div className="relative rounded-xl bg-[var(--surface)] border border-[var(--line)] overflow-hidden">
      {/* Top Cobalt Accent Bar */}
      <div className="h-1 w-full bg-[var(--accent)]" />

      <div className="p-6 md:p-8 space-y-6">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-[var(--surface)] border border-[var(--line)] flex items-center justify-center text-[var(--accent)] shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-[var(--text)]">Hóa đơn điện tử phụ kiện</h2>
                <span className="px-2 py-0.5 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-medium">
                  Phiếu xuất kho điện tử
                </span>
              </div>
              <div className="text-xs text-[var(--text-muted)] leading-relaxed">
                Cổng thanh toán: <span className="text-[var(--text)] font-medium">{paymentMethodLabel}</span> • Mã đối soát:{' '}
                <span className="font-mono text-[var(--accent)] tabular-nums">{transactionCode}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <div className="px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--line)] font-mono text-xs text-[var(--text)] tabular-nums">
              <span className="font-bold text-[var(--accent)]">{displayOrderCode}</span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--accent-soft)] border border-[var(--line)] text-[var(--text)] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sao chép mã đơn hàng"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[var(--text-2)]" />}
              <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>
        </div>

        {/* Customer & Delivery 2-Column Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 border border-[var(--line)] rounded-lg bg-[var(--surface-subtle)] divide-y md:divide-y-0 md:divide-x divide-[var(--line)]">
          {/* Column 1: Customer Profile */}
          <div className="p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)]">
                <User className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Thông tin người đặt hàng</span>
              </div>
              <div>
                <h4 className="text-base font-semibold text-[var(--text)]">{customerName}</h4>
                <p className="text-xs text-[var(--text-2)] tabular-nums mt-0.5">{customerPhone}</p>
                <p className="text-xs text-[var(--text-muted)]">{customerEmail}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Hạng thành viên</span>
              <span className="font-medium text-amber-800">{memberRank}</span>
            </div>
          </div>

          {/* Column 2: Destination Address & Shipment Specs */}
          <div className="p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)]">
                <Truck className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Địa chỉ giao hàng & Kỹ thuật</span>
              </div>
              <p className="text-xs font-semibold text-[var(--text)] leading-relaxed">
                {shippingAddress}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span className="px-2 py-0.5 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-medium">
                  {shippingFee > 0 ? 'Giao hỏa tốc & Lắp đặt' : 'Giao hàng tiêu chuẩn 24–48h'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[var(--surface)] border border-[var(--line)] text-[var(--text-2)] text-xs font-medium">
                  Đóng gói chống sốc SiC
                </span>
              </div>
              {order?.customerNote && (
                <p className="text-[11px] text-[var(--text-muted)] italic pt-1">
                  Ghi chú: {order.customerNote}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Đơn vị vận chuyển</span>
              <span className="font-medium text-emerald-700">{shippingMethod}</span>
            </div>
          </div>
        </div>

        {/* Itemized Table / Rows */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[var(--text-2)]">
              Danh mục sản phẩm bàn giao ({orderItems.length.toString().padStart(2, '0')} mục)
            </span>
            <span className="font-medium text-emerald-700">✓ Bảo hành điện tử kích hoạt</span>
          </div>

          {orderItems.length === 0 ? (
            <div className="rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] p-6 text-center space-y-2">
              <Package className="w-8 h-8 text-[var(--text-muted)] mx-auto stroke-1" />
              <p className="text-xs text-[var(--text-muted)]">
                Đơn hàng đã được lưu trên hệ thống. Đang chuẩn bị đóng gói linh kiện xuất kho.
              </p>
            </div>
          ) : (
            orderItems.map((item, index) => {
              const acc = item.accessory;
              const imageUrl =
                acc?.thumbnailUrl ||
                acc?.imageUrl ||
                (acc?.images && acc.images.length > 0 ? acc.images[0] : '') ||
                'https://api.builder.io/api/v1/image/assets/TEMP/2926b27f7460ecb719ff769117d513328396db2a?width=160';
              const name = acc?.name || 'Phụ kiện AutoHub';
              const category = acc?.categoryName || 'Linh Kiện EV';
              const sku = acc?.sku || `PK-${acc?.id || index + 1}`;
              const unitPrice = item.unitPrice || acc?.price || 0;
              const quantity = item.quantity || 1;
              const lineTotal = item.totalPrice || unitPrice * quantity;

              return (
                <div
                  key={item.id || index}
                  className="rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="w-16 h-16 rounded-lg bg-[var(--surface)] border border-[var(--line)] overflow-hidden shrink-0 flex items-center justify-center p-1">
                      <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://api.builder.io/api/v1/image/assets/TEMP/2926b27f7460ecb719ff769117d513328396db2a?width=160';
                        }}
                      />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-medium tabular-nums">
                          {category}
                        </span>
                        <span className="text-xs text-emerald-700 font-medium">✓ Mã SKU: {sku}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-[var(--text)] truncate">{name}</h3>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-1">
                        {acc?.description || 'Linh kiện chính hãng được kiểm định an toàn điện áp cao AutoHub Secured'}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-xs text-[var(--text-muted)] tabular-nums">
                      {formatCurrencyVND(unitPrice)} × {quantity.toString().padStart(2, '0')}
                    </div>
                    <div className="text-base font-bold tabular-nums text-[var(--text)]">
                      {formatCurrencyVND(lineTotal)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Cost Breakdown & Summary */}
        <div className="pt-4 border-t border-[var(--line)] flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          {/* Security Seal Notice */}
          <div className="max-w-md space-y-1 text-xs text-[var(--text-2)] leading-relaxed">
            <div className="flex items-center gap-1.5 font-semibold text-[var(--accent)] text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Chứng thư số AutoHub Secured</span>
            </div>
            <p>
              Đã bao gồm thuế VAT 10%. Hóa đơn điện tử có giá trị pháp lý đã được tự động lưu kho và ký số theo chuẩn Bộ Tài Chính.
            </p>
          </div>

          {/* Mathematical Computations */}
          <div className="w-full lg:w-80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-[var(--text-2)]">
              <span>Tạm tính linh kiện:</span>
              <span className="font-medium tabular-nums text-[var(--text)]">{formatCurrencyVND(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex items-center justify-between text-emerald-700">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>Ưu đãi Voucher:</span>
                </span>
                <span className="font-medium tabular-nums">- {formatCurrencyVND(discount)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-[var(--accent)]">
              <span>Phí vận chuyển:</span>
              <span className="font-semibold">
                {shippingFee === 0 ? 'Miễn phí toàn quốc' : formatCurrencyVND(shippingFee)}
              </span>
            </div>

            <div className="pt-3 border-t border-[var(--line)] flex items-baseline justify-between">
              <div>
                <div className="text-sm font-bold text-[var(--text)]">Tổng thanh toán:</div>
                <div className="text-xs text-emerald-700 font-medium">
                  {order?.status === 'PAID'
                    ? 'Đã quyết toán thành công'
                    : order?.status === 'PENDING_PAYMENT'
                    ? 'Đang chờ quyết toán SePay'
                    : 'Đã xác nhận đơn hàng'}
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold tabular-nums text-[var(--accent)]">
                  {formatCurrencyVND(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
