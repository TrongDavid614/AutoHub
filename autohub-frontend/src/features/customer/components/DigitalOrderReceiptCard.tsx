import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, FileCheck2, User, Truck } from 'lucide-react';

export interface DigitalOrderReceiptCardProps {
  orderCode: string;
}

export const DigitalOrderReceiptCard: React.FC<DigitalOrderReceiptCardProps> = ({ orderCode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
                  Hóa đơn điện tử
                </span>
              </div>
              <div className="text-xs text-[var(--text-muted)] leading-relaxed">
                Cổng thanh toán: <span className="text-[var(--text)] font-medium">SePay QR Gateway (Thẻ/TK Nội địa)</span> • Mã đối soát:{' '}
                <span className="font-mono text-[var(--accent)] tabular-nums">VNP-TXN-90291480-VN</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <div className="px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--line)] font-mono text-xs text-[var(--text)] tabular-nums">
              <span className="font-bold text-[var(--accent)]">{orderCode}</span>
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
                <h4 className="text-base font-semibold text-[var(--text)]">Nguyễn Văn A</h4>
                <p className="text-xs text-[var(--text-2)] tabular-nums mt-0.5">0912 345 678</p>
                <p className="text-xs text-[var(--text-muted)]">nguyenvana@gmail.com</p>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Hạng thành viên</span>
              <span className="font-medium text-amber-800">Thành viên AutoHub</span>
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
                Tòa Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh
              </p>
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span className="px-2 py-0.5 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-medium">
                  Giao nhanh 24–48h
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[var(--surface)] border border-[var(--line)] text-[var(--text-2)] text-xs font-medium">
                  Đóng gói chống sốc SiC
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Hỗ trợ lắp đặt</span>
              <span className="font-medium text-emerald-700">Kỹ thuật viên miễn phí</span>
            </div>
          </div>
        </div>

        {/* Itemized Table / Rows */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[var(--text-2)]">Danh mục sản phẩm bàn giao (02 mục)</span>
            <span className="font-medium text-emerald-700">✓ Bảo hành điện tử kích hoạt</span>
          </div>

          {/* Item 1: Wallbox Charger */}
          <div className="rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 flex-1">
              <div className="w-16 h-16 rounded-lg bg-[var(--surface)] border border-[var(--line)] overflow-hidden shrink-0 flex items-center justify-center">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/2926b27f7460ecb719ff769117d513328396db2a?width=160"
                  alt="Bộ sạc treo tường AutoHub Ultra Wallbox 22kW"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-medium tabular-nums">
                    22kW
                  </span>
                  <span className="text-xs text-emerald-700 font-medium">✓ Tương thích: AutoHub GT-e (2026)</span>
                </div>
                <h3 className="text-sm font-semibold text-[var(--text)]">
                  Bộ sạc treo tường AutoHub Ultra Wallbox 22kW
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Kiến trúc bán dẫn SiC, Cáp Type 2 dài 7m, Kết nối HubApp 4G/Wi-Fi tích hợp
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <div className="text-xs text-[var(--text-muted)] tabular-nums">18.500.000 đ × 01</div>
              <div className="text-base font-bold tabular-nums text-[var(--text)]">18.500.000 ₫</div>
            </div>
          </div>

          {/* Item 2: Floor Mats */}
          <div className="rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 flex-1">
              <div className="w-16 h-16 rounded-lg bg-[var(--surface)] border border-[var(--line)] overflow-hidden shrink-0 flex items-center justify-center">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/a712f51232d9d6c294236dff0fc46ebc4f3faabd?width=160"
                  alt="Thảm lót sàn đúc TPE nguyên sinh GT-e"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-[var(--surface)] border border-[var(--line)] text-[var(--text-2)] text-xs font-medium tabular-nums">
                    2 set
                  </span>
                  <span className="text-xs text-emerald-700 font-medium">✓ Thiết kế riêng: GT-e Sedan & GT</span>
                </div>
                <h3 className="text-sm font-semibold text-[var(--text)]">
                  Thảm lót sàn đúc TPE nguyên sinh GT-e
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Chống nước 100%, không mùi hữu cơ VOC, viền cao chắn bùn tuyết công thái học
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <div className="text-xs text-[var(--text-muted)] tabular-nums">3.200.000 đ × 02</div>
              <div className="text-base font-bold tabular-nums text-[var(--text)]">6.400.000 ₫</div>
            </div>
          </div>
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
              <span className="font-medium tabular-nums text-[var(--text)]">24.900.000 VNĐ</span>
            </div>
            <div className="flex items-center justify-between text-emerald-700">
              <span>Voucher VIP (AUTO500):</span>
              <span className="font-medium tabular-nums">-500.000 VNĐ</span>
            </div>
            <div className="flex items-center justify-between text-[var(--accent)]">
              <span>Vận chuyển hỏa tốc:</span>
              <span className="font-semibold">Miễn phí toàn quốc</span>
            </div>

            <div className="pt-3 border-t border-[var(--line)] flex items-baseline justify-between">
              <div>
                <div className="text-sm font-bold text-[var(--text)]">Tổng thanh toán:</div>
                <div className="text-xs text-emerald-700 font-medium">
                  Đã quyết toán qua SePay
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold tabular-nums text-[var(--accent)]">24.400.000</span>
                <span className="text-xs font-bold text-[var(--accent)] ml-1">VNĐ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
