import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, FileCheck2, MapPin } from 'lucide-react';

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
    <div className="relative rounded-[4px] bg-[#131B2E] border border-[#2D3449] shadow-2xl overflow-hidden">
      {/* Subtle Top Specular / Ambient Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#0EA5E9] via-[#89CEFF] to-[#0EA5E9]" />

      <div className="p-6 md:p-8 space-y-8">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2D3449]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-[#89CEFF]" />
              <h2 className="text-xl font-bold text-[#DAE2FD]">Hóa đơn điện tử phụ kiện</h2>
              <span className="px-2 py-0.5 rounded-[2px] bg-[#222A3D] text-[#89CEFF] font-mono text-[10px] font-bold">
                E-INVOICE
              </span>
            </div>
            <div className="text-xs text-[#88929B]">
              CỔNG THANH TOÁN: <span className="text-[#DAE2FD] font-semibold">VNPay QR Gateway (Thẻ/TK Nội địa)</span> • Mã đối soát: <span className="font-mono text-[#89CEFF]">VNP-TXN-90291480-VN</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 rounded-[2px] bg-[#060E20] border border-[#2D3449] font-mono text-xs font-bold text-[#DAE2FD]">
              MÃ ĐƠN: <span className="text-[#89CEFF]">{orderCode}</span>
            </div>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-[2px] bg-[#222A3D] hover:bg-[#2D3449] text-[#DAE2FD] hover:text-[#89CEFF] transition-colors cursor-pointer"
              title="Sao chép mã đơn hàng"
            >
              {copied ? <Check className="w-4 h-4 text-[#34D399]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Customer & Delivery 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-[#2D3449]">
          {/* Column 1: Customer Profile */}
          <div className="space-y-3">
            <div className="text-[10px] font-mono font-bold tracking-[1.5px] text-[#88929B] uppercase">
              THÔNG TIN NGƯỜI ĐẶT HÀNG
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-[#DAE2FD]">Nguyễn Văn A</span>
                <span className="px-2 py-0.5 rounded-[2px] bg-[#222A3D] text-[#89CEFF] font-mono text-[9px] font-bold uppercase border border-[#2D3449]">
                  ★ GT-E VIP RESERVE
                </span>
              </div>
              <p className="font-mono text-xs text-[#BEC8D2]">0912 345 678</p>
              <p className="text-xs text-[#88929B]">nguyenvana@gmail.com</p>
            </div>
          </div>

          {/* Column 2: Destination Address & Shipment Specs */}
          <div className="space-y-3">
            <div className="text-[10px] font-mono font-bold tracking-[1.5px] text-[#88929B] uppercase">
              ĐỊA CHỈ GIAO HÀNG & KỸ THUẬT
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-1.5 text-xs text-[#BEC8D2] leading-relaxed">
                <MapPin className="w-3.5 h-3.5 text-[#89CEFF] shrink-0 mt-0.5" />
                <span>
                  Tòa Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-[2px] bg-[#222A3D] text-[#89CEFF] font-mono text-[9px] font-bold">
                  GIAO NHANH 24-48H
                </span>
                <span className="px-2 py-0.5 rounded-[2px] bg-[#222A3D] text-[#88929B] font-mono text-[9px] font-bold">
                  ĐÓNG GÓI CHỐNG SỐC SIC
                </span>
                <span className="px-2 py-0.5 rounded-[2px] bg-[#0EA5E9]/20 text-[#89CEFF] font-mono text-[9px] font-bold">
                  KỸ THUẬT VIÊN MIỄN PHÍ
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Itemized Table / Card Rows */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-[1.5px] text-[#88929B] uppercase">
              DANH MỤC SẢN PHẨM BÀN GIAO (02 MỤC)
            </span>
            <span className="text-[10px] font-mono text-[#34D399] font-bold uppercase">
              ✓ BẢO HÀNH ĐIỆN TỬ KÍCH HOẠT
            </span>
          </div>

          {/* Item 1 */}
          <div className="rounded-[2px] bg-[#060E20] border border-[#2D3449] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 flex-1">
              <div className="w-16 h-16 rounded-[2px] bg-[#171F33] border border-[#2D3449] overflow-hidden shrink-0 flex items-center justify-center">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/2926b27f7460ecb719ff769117d513328396db2a?width=160"
                  alt="Wallbox"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-1.5 py-0.5 rounded-[2px] bg-[#0EA5E9]/20 text-[#89CEFF] font-mono text-[9px] font-bold">
                    22kW
                  </span>
                  <span className="text-[10px] text-[#89CEFF]">✓ TƯƠNG THÍCH: AUTOHUB GT-E (2026)</span>
                  <span className="font-mono text-[10px] text-[#88929B]">SKU: AH-WB-22KW-SIC</span>
                </div>
                <h3 className="text-sm font-semibold text-[#DAE2FD]">
                  Bộ sạc treo tường AutoHub Ultra Wallbox 22kW
                </h3>
                <p className="text-xs text-[#88929B]">
                  Kiến trúc bán dẫn SiC, Cáp Type 2 dài 7m, Kết nối HubApp 4G/Wi-Fi tích hợp
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <div className="text-[11px] text-[#88929B] font-mono">18.500.000 Đ × 01</div>
              <div className="font-mono text-base font-bold text-[#DAE2FD]">18.500.000 ₫</div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="rounded-[2px] bg-[#060E20] border border-[#2D3449] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 flex-1">
              <div className="w-16 h-16 rounded-[2px] bg-[#171F33] border border-[#2D3449] overflow-hidden shrink-0 flex items-center justify-center">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/a712f51232d9d6c294236dff0fc46ebc4f3faabd?width=160"
                  alt="Mats"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-1.5 py-0.5 rounded-[2px] bg-[#31394D] text-[#DAE2FD] font-mono text-[9px] font-bold">
                    2 SET
                  </span>
                  <span className="text-[10px] text-[#89CEFF]">✓ THIẾT KẾ RIÊNG: GT-E SEDAN & GT</span>
                  <span className="font-mono text-[10px] text-[#88929B]">SKU: AH-MAT-TPE-3D</span>
                </div>
                <h3 className="text-sm font-semibold text-[#DAE2FD]">
                  Thảm lót sàn đúc TPE nguyên sinh GT-e
                </h3>
                <p className="text-xs text-[#88929B]">
                  Chống nước 100%, không mùi hữu cơ VOC, viền cao chắn bùn tuyết công thái học
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <div className="text-[11px] text-[#88929B] font-mono">3.200.000 Đ × 02</div>
              <div className="font-mono text-base font-bold text-[#DAE2FD]">6.400.000 ₫</div>
            </div>
          </div>
        </div>

        {/* Cost Breakdown & Summary */}
        <div className="pt-4 border-t border-[#2D3449] flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          {/* Security Seal Notice */}
          <div className="max-w-md space-y-1 text-xs text-[#88929B] leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-[#89CEFF] text-xs">
              <ShieldCheck className="w-4 h-4 text-[#89CEFF]" />
              <span>CHỨNG THƯ SỐ AUTOHUB SECURED</span>
            </div>
            <p>
              Đã bao gồm thuế VAT 10%. Hóa đơn điện tử có giá trị pháp lý đã được tự động lưu kho và ký số theo chuẩn Bộ Tài Chính.
            </p>
          </div>

          {/* Mathematical Computations */}
          <div className="w-full lg:w-80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-[#BEC8D2]">
              <span>Tạm tính linh kiện:</span>
              <span className="font-mono text-[#DAE2FD]">24.900.000 VNĐ</span>
            </div>
            <div className="flex items-center justify-between text-[#34D399]">
              <span>Voucher VIP (AUTO500):</span>
              <span className="font-mono">-500.000 VNĐ</span>
            </div>
            <div className="flex items-center justify-between text-[#89CEFF]">
              <span>Vận chuyển hỏa tốc:</span>
              <span className="font-mono font-bold">MIỄN PHÍ TOÀN QUỐC</span>
            </div>

            <div className="pt-3 border-t border-[#2D3449] flex items-baseline justify-between">
              <div>
                <div className="text-sm font-bold text-[#DAE2FD]">TỔNG THANH TOÁN:</div>
                <div className="text-[9px] font-mono text-[#34D399] uppercase font-bold">
                  ĐÃ QUYẾT TOÁN QUA VNPAY
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-2xl font-bold text-[#89CEFF]">24.400.000</span>
                <span className="font-mono text-xs font-bold text-[#89CEFF] ml-1">VNĐ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
