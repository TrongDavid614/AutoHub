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
    <div className="relative rounded-[8px] bg-[#131B2E] border border-[#2D3449] shadow-2xl overflow-hidden">
      {/* 1. Subtle Top Specular / Ambient Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#0EA5E9] via-[#89CEFF] to-[#0EA5E9]" />

      {/* 2. Watermark Element (Tia sét EV Lighting Bolt SVG - Opacity 0.05) */}
      <div className="absolute right-[-32px] top-[-32px] pointer-events-none select-none opacity-5 z-0">
        <svg width="214" height="273" viewBox="0 0 214 273" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M87.3333 216L156.333 133.333H103L112.667 57.6667L51 146.667H97.3333L87.3333 216V216M53.3333 266.667L66.6667 173.333H0L120 0H146.667L133.333 106.667H213.333L80 266.667H53.3333V266.667"
            fill="#DAE2FD"
          />
        </svg>
      </div>

      <div className="p-6 md:p-8 space-y-6 relative z-10">
        {/* 3. Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[4px] bg-[#131B2E]/60 border border-[#2D3449]/50">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-[2px] bg-[#222A3D] border border-[#2D3449] flex items-center justify-center text-[#89CEFF] shrink-0">
              <FileCheck2 className="w-6 h-6 text-[#89CEFF]" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-[#DAE2FD]">Hóa đơn điện tử phụ kiện</h2>
                <span className="px-2 py-0.5 rounded-[2px] bg-[#222A3D] text-[#89CEFF] font-mono text-[10px] font-bold uppercase tracking-wider">
                  E-INVOICE
                </span>
              </div>
              <div className="text-xs text-[#88929B] leading-relaxed">
                CỔNG THANH TOÁN: <span className="text-[#DAE2FD] font-semibold">VNPay QR Gateway (Thẻ/TK Nội địa)</span> • Mã đối soát:{' '}
                <span className="font-mono text-[#89CEFF]">VNP-TXN-90291480-VN</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <div className="px-3 py-1.5 rounded-[2px] bg-[#060E20] border border-[#2D3449] font-mono text-xs text-[#DAE2FD]">
              <span className="text-[#88929B] font-bold">MÃ ĐƠN: </span>
              <span className="font-bold text-[#89CEFF]">{orderCode}</span>
            </div>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1.5 rounded-[2px] bg-[#222A3D] hover:bg-[#2D3449] text-[#89CEFF] font-mono text-[10px] font-bold uppercase tracking-[1.5px] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sao chép mã đơn hàng"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'ĐÃ CHÉP' : 'SAO CHÉP'}</span>
            </button>
          </div>
        </div>

        {/* 4. Customer & Delivery 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Column 1: Customer Profile */}
          <div className="p-4 rounded-[8px] bg-[#131B2E]/60 border border-[#2D3449]/50 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-[0.5px] text-[#BEC8D2] uppercase">
                <User className="w-3.5 h-3.5 text-[#89CEFF]" />
                <span>THÔNG TIN NGƯỜI ĐẶT HÀNG</span>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-[#DAE2FD]">Nguyễn Văn A</h4>
                <p className="font-mono text-xs text-[#BEC8D2] mt-0.5">0912 345 678</p>
                <p className="text-xs text-[#88929B]">nguyenvana@gmail.com</p>
              </div>
            </div>

            {/* Column 1 Footer Overlay Bar: Hạng thành viên */}
            <div className="p-1.5 rounded-[2px] bg-[#2D3449]/30 flex items-center justify-between text-[10px] font-mono font-bold">
              <span className="text-[#BEC8D2] tracking-[1.5px] uppercase">HẠNG THÀNH VIÊN</span>
              <span className="text-[#FFB86E] tracking-[1px] uppercase">★ GT-E VIP RESERVE</span>
            </div>
          </div>

          {/* Column 2: Destination Address & Shipment Specs */}
          <div className="p-4 rounded-[8px] bg-[#131B2E]/60 border border-[#2D3449]/50 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-[0.5px] text-[#BEC8D2] uppercase">
                <Truck className="w-3.5 h-3.5 text-[#89CEFF]" />
                <span>ĐỊA CHỈ GIAO HÀNG & KỸ THUẬT</span>
              </div>
              <p className="text-xs font-semibold text-[#DAE2FD] leading-[21px]">
                Tòa Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh
              </p>
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span className="px-1.5 py-0.5 rounded-[2px] bg-[#171F33] text-[#7BD0FF] font-mono text-[10px] font-bold tracking-[1.5px] uppercase">
                  GIAO NHANH 24-48H
                </span>
                <span className="px-1.5 py-0.5 rounded-[2px] bg-[#171F33] text-[#BEC8D2] font-mono text-[10px] font-bold tracking-[1.5px] uppercase">
                  ĐÓNG GÓI CHỐNG SỐC SIC
                </span>
              </div>
            </div>

            {/* Column 2 Footer Overlay Bar: Hỗ trợ lắp đặt */}
            <div className="p-1.5 rounded-[2px] bg-[#2D3449]/30 flex items-center justify-between text-[10px] font-mono font-bold">
              <span className="text-[#BEC8D2] tracking-[1.5px] uppercase">HỖ TRỢ LẮP ĐẶT</span>
              <span className="text-[#89CEFF] tracking-[1.5px] uppercase">KỸ THUẬT VIÊN MIỄN PHÍ</span>
            </div>
          </div>
        </div>

        {/* 5. Itemized Table / Card Rows */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-[1.5px]">
            <span className="text-[#88929B]">DANH MỤC SẢN PHẨM BÀN GIAO (02 MỤC)</span>
            <span className="text-[#34D399]">✓ BẢO HÀNH ĐIỆN TỬ KÍCH HOẠT</span>
          </div>

          {/* Item 1: Wallbox Charger */}
          <div className="rounded-[4px] bg-[#060E20] border border-[#2D3449] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 flex-1">
              <div className="w-16 h-16 rounded-[4px] bg-[#171F33] border border-[#2D3449] overflow-hidden shrink-0 flex items-center justify-center">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/2926b27f7460ecb719ff769117d513328396db2a?width=160"
                  alt="Bộ sạc treo tường AutoHub Ultra Wallbox 22kW"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-1.5 py-0.5 rounded-[2px] bg-[#0EA5E9]/20 text-[#89CEFF] font-mono text-[9px] font-bold">
                    22kW
                  </span>
                  <span className="text-[10px] text-[#89CEFF] font-semibold">✓ TƯƠNG THÍCH: AUTOHUB GT-E (2026)</span>
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

          {/* Item 2: Floor Mats */}
          <div className="rounded-[4px] bg-[#060E20] border border-[#2D3449] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 flex-1">
              <div className="w-16 h-16 rounded-[4px] bg-[#171F33] border border-[#2D3449] overflow-hidden shrink-0 flex items-center justify-center">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/a712f51232d9d6c294236dff0fc46ebc4f3faabd?width=160"
                  alt="Thảm lót sàn đúc TPE nguyên sinh GT-e"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-1.5 py-0.5 rounded-[2px] bg-[#31394D] text-[#DAE2FD] font-mono text-[9px] font-bold">
                    2 SET
                  </span>
                  <span className="text-[10px] text-[#89CEFF] font-semibold">✓ THIẾT KẾ RIÊNG: GT-E SEDAN & GT</span>
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

        {/* 6. Cost Breakdown & Summary */}
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
