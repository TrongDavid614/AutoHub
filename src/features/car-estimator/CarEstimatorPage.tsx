import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Car,
  ChevronDown,
  Info,
  CalendarCheck,
  Check
} from 'lucide-react';
import { TestDriveModal } from '@/features/test-drive/TestDriveModal';
import { DepositModal } from '@/features/car-deposit/DepositModal';

interface EstimatorTrim {
  id: string;
  name: string;
  specs: string;
  price: number;
  wltp: string;
  isPopular?: boolean;
}

export const CarEstimatorPage: React.FC = () => {
  const trims: EstimatorTrim[] = [
    {
      id: 'luxury',
      name: 'Luxury',
      specs: 'RWD • 450 HP',
      price: 2490000000,
      wltp: '620 km WLTP • 4.1s',
    },
    {
      id: 'grand-touring',
      name: 'Grand Touring',
      specs: 'AWD DUAL-MOTOR • 680 HP',
      price: 2890000000,
      wltp: '680 km WLTP • 3.2s (0-100)',
      isPopular: true,
    },
    {
      id: 'track-edition',
      name: 'Track Edition',
      specs: 'TRI-MOTOR TORQUE • 1.020 HP',
      price: 3290000000,
      wltp: '600 km WLTP • 2.1s Carbon',
    },
  ];

  const [selectedTrimId, setSelectedTrimId] = useState<string>('grand-touring');
  const [province, setProvince] = useState<string>('HCM');
  const [discountVoucher, setDiscountVoucher] = useState<boolean>(true);
  const [taxSupport, setTaxSupport] = useState<boolean>(true);
  const [freeMobileService, setFreeMobileService] = useState<boolean>(true);

  // Modals
  const [isTestDriveOpen, setIsTestDriveOpen] = useState<boolean>(false);
  const [isDepositOpen, setIsDepositOpen] = useState<boolean>(false);

  const selectedTrim = trims.find((t) => t.id === selectedTrimId) || trims[1];

  // Specific calculation matching Figma: 3.007.140.700 VNĐ
  const listedPrice = selectedTrim.price;
  const onlineDiscount = discountVoucher ? 50000000 : 0;
  // Standard EV tax 10% = 289M, after 50% AutoHub support = 144.5M
  const registrationTax = taxSupport ? Math.round(listedPrice * 0.1 * 0.5) : Math.round(listedPrice * 0.1);
  const plateFee = province === 'HCM' ? 20000000 : province === 'HN' ? 20000000 : 1000000;
  const inspectionRoadFee = 2160000; // 30 months fee
  const tndsInsurance = 480700;

  const totalCost = listedPrice - onlineDiscount + registrationTax + plateFee + inspectionRoadFee + tndsInsurance;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-100">
      {/* Breadcrumb matching Figma */}
      <nav className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        <Link to="/" className="hover:text-cyan-400">TRANG CHỦ</Link>
        <span>/</span>
        <span className="text-slate-400">DÒNG XE GT-E</span>
        <span>/</span>
        <span className="text-cyan-400 font-bold">DỰ TOÁN CHI PHÍ LĂN BÁNH</span>
      </nav>

      {/* Header matching Figma */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Dự Toán Chi Phí Lăn Bánh Ô Tô Điện <span className="text-cyan-400">AutoHub</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Minh bạch mọi khoản thuế, phí trước bạ, bảo hiểm bắt buộc và các chương trình ưu đãi độc quyền dành cho khách hàng AutoHub.
        </p>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: CẤU HÌNH DỰ TOÁN (Col 7) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Block 1: Dòng xe được chọn */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-cyan-400" />
                <span>DÒNG XE ĐƯỢC CHỌN</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[10px] font-extrabold uppercase">
                SEDAN THỂ THAO THUẦN ĐIỆN 800V
              </span>
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-base">
                  GT
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">AutoHub GT-e</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Kiến trúc điện áp cao 800V SiC • Sạc 10–80% trong 15 phút
                  </p>
                </div>
              </div>
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          {/* Block 2: Phiên bản & Hiệu năng */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                PHIÊN BẢN & HIỆU NĂNG
              </span>
              <span className="text-[10px] font-extrabold uppercase text-slate-500">
                BẢO HÀNH 8 NĂM PIN TOÀN DIỆN
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {trims.map((trim) => {
                const isSelected = selectedTrimId === trim.id;
                return (
                  <div
                    key={trim.id}
                    onClick={() => setSelectedTrimId(trim.id)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 ring-1 ring-cyan-500 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-800/50 border-slate-700/80 hover:bg-slate-800'
                    }`}
                  >
                    {trim.isPopular && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded bg-cyan-500 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                        KHUYÊN DÙNG
                      </span>
                    )}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-white">{trim.name}</span>
                        {isSelected ? (
                          <div className="w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-600" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">{trim.specs}</p>
                    </div>

                    <div className="pt-3">
                      <div className="text-[10px] text-slate-400">GIÁ NIÊM YẾT</div>
                      <div className="text-sm font-black text-cyan-400 font-mono">
                        {trim.price.toLocaleString('vi-VN')} đ
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{trim.wltp}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Block 3: Tỉnh / Thành phố đăng ký biển số */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                TỈNH / THÀNH PHỐ ĐĂNG KÝ BIỂN SỐ
              </span>
              <span className="text-[10px] font-extrabold uppercase text-slate-500">
                QUY ĐỊNH 2025
              </span>
            </div>

            <div className="relative">
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="HCM">TP. Hồ Chí Minh (Lệ phí trước bạ: 10% • Biển số: 20.000.000 đ)</option>
                <option value="HN">Hà Nội (Lệ phí trước bạ: 12% • Biển số: 20.000.000 đ)</option>
                <option value="OTHER">Tỉnh / Thành khác (Lệ phí trước bạ: 10% • Biển số: 1.000.000 đ)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-start gap-2 text-[11px] text-slate-400">
              <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>
                Theo Nghị định hiện hành, ô tô điện chạy pin được hưởng khung ưu đãi tỷ lệ thu lệ phí trước bạ lần đầu đặc biệt hỗ trợ chuyển dịch năng lượng xanh.
              </span>
            </div>
          </div>

          {/* Block 4: Ưu đãi & Khuyến mại đặc quyền */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                ƯU ĐÃI & KHUYẾN MẠI ĐẶC QUYỀN
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[10px] font-extrabold uppercase">
                AUTOHUB PRIVILEGE
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Promo 1 */}
              <label className="flex items-start justify-between p-3.5 bg-slate-800/40 border border-slate-700/80 rounded-xl cursor-pointer hover:bg-slate-800/70 transition-colors">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={taxSupport}
                    onChange={(e) => setTaxSupport(e.target.checked)}
                    className="mt-0.5 rounded text-cyan-500 focus:ring-cyan-400"
                  />
                  <div>
                    <span className="text-xs font-bold text-white">Hỗ trợ 50% lệ phí trước bạ từ AutoHub Vietnam</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Trừ trực tiếp vào nghĩa vụ tài chính khi làm thủ tục đăng ký xe tại đại diện cơ quan thuế.
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold whitespace-nowrap ml-2">
                  -50% THUẾ TB
                </span>
              </label>

              {/* Promo 2 */}
              <label className="flex items-start justify-between p-3.5 bg-slate-800/40 border border-slate-700/80 rounded-xl cursor-pointer hover:bg-slate-800/70 transition-colors">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={discountVoucher}
                    onChange={(e) => setDiscountVoucher(e.target.checked)}
                    className="mt-0.5 rounded text-cyan-500 focus:ring-cyan-400"
                  />
                  <div>
                    <span className="text-xs font-bold text-white">Giảm tiền mặt trực tiếp 50.000.000 đ</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Chương trình kích cầu đặc quyền khi hoàn tất cọc trực tuyến thông qua cổng thanh toán bảo mật.
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold whitespace-nowrap ml-2">
                  -50.000.000 đ
                </span>
              </label>

              {/* Promo 3 */}
              <label className="flex items-start justify-between p-3.5 bg-slate-800/40 border border-slate-700/80 rounded-xl cursor-pointer hover:bg-slate-800/70 transition-colors">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={freeMobileService}
                    onChange={(e) => setFreeMobileService(e.target.checked)}
                    className="mt-0.5 rounded text-cyan-500 focus:ring-cyan-400"
                  />
                  <div>
                    <span className="text-xs font-bold text-white">Gói cứu hộ di động AutoHub Mobile Service 24/7 (3 năm)</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Xe sạc lưu động khẩn cấp, hỗ trợ kỹ thuật tận nhà và vận chuyển cứu hộ toàn quốc không giới hạn.
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold whitespace-nowrap ml-2">
                  MIỄN PHÍ
                </span>
              </label>
            </div>
          </div>

          {/* Calculate Button matching Figma */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('breakdown-summary');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            <span>Tính toán & Cập nhật chi phí lăn bánh</span>
          </button>
        </div>

        {/* RIGHT COLUMN: BẢNG KÊ CHI PHÍ & CHỐT CỌC (Col 5) */}
        <div className="lg:col-span-5 space-y-5 sticky top-20" id="breakdown-summary">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            {/* Studio Card matching Figma */}
            <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 h-40">
              <img
                src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80"
                alt={selectedTrim.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-[9px] font-bold text-slate-300 uppercase">
                AUTOHUB GT-e STUDIO
              </span>
              <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between">
                <div>
                  <h3 className="text-base font-black text-white">AutoHub GT-e {selectedTrim.name}</h3>
                  <div className="text-[10px] text-slate-400">Khu vực đăng ký: TP. Hồ Chí Minh</div>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">VIN 2025</span>
              </div>
            </div>

            {/* Itemized Table matching Figma */}
            <div className="space-y-2.5 text-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-800">
                BẢNG KÊ CÁC KHOẢN CHI PHÍ HOÀN TẤT THỦ TỤC
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-300">Giá niêm yết (Đã gồm VAT & Pin)</span>
                <span className="font-mono font-bold text-white">{listedPrice.toLocaleString('vi-VN')} đ</span>
              </div>

              {discountVoucher && (
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60 text-cyan-400">
                  <span>Khuyến mại tiền mặt đặt cọc online</span>
                  <span className="font-mono font-bold">-50.000.000đ</span>
                </div>
              )}

              <div className="flex justify-between items-start py-1 border-b border-slate-800/60">
                <div>
                  <div className="text-slate-300">Lệ phí trước bạ (Sau hỗ trợ 50%)</div>
                  <div className="text-[10px] text-slate-500">
                    Được miễn giảm 50% từ mức 289.000.000 đ (10%) • <span className="text-emerald-400 font-semibold">Tiết kiệm 144.5tr</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-white">{registrationTax.toLocaleString('vi-VN')} đ</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-300">Phí cấp biển số TP. Hồ Chí Minh</span>
                <span className="font-mono font-bold text-white">{plateFee.toLocaleString('vi-VN')} đ</span>
              </div>

              <div className="flex justify-between items-start py-1 border-b border-slate-800/60">
                <div>
                  <div className="text-slate-300">Phí đăng kiểm & Bảo trì đường bộ</div>
                  <div className="text-[10px] text-slate-500">Kỳ hạn nộp 30 tháng cho phương tiện đăng ký mới lần đầu</div>
                </div>
                <span className="font-mono font-bold text-white">{inspectionRoadFee.toLocaleString('vi-VN')} đ</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-300">Bảo hiểm TNDS bắt buộc (1 năm)</span>
                <span className="font-mono font-bold text-white">{tndsInsurance.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            {/* Total Box matching Figma */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 via-slate-950 to-cyan-950/40 border border-cyan-500/30 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span>TỔNG CHI PHÍ LĂN BÁNH TẠM TÍNH</span>
                <span className="text-emerald-400">CHÍNH XÁC 100%</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono tracking-tight">
                {totalCost.toLocaleString('vi-VN')} <span className="text-sm font-semibold text-slate-300">VND</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed pt-1">
                Giá đã bao gồm toàn bộ thuế VAT, Pin công nghệ cao thế hệ mới và trọn gói phí dịch vụ thủ tục lưu hành hợp pháp.
              </p>
            </div>

            {/* 2 CTA Buttons matching Figma */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setIsDepositOpen(true)}
                className="py-3 px-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Lock className="w-4 h-4" />
                <span>Đặt cọc giữ xe 72h</span>
              </button>

              <button
                type="button"
                onClick={() => setIsTestDriveOpen(true)}
                className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <CalendarCheck className="w-4 h-4 text-cyan-400" />
                <span>Đăng ký lái thử</span>
              </button>
            </div>

            {/* 3 Commitments matching Figma */}
            <div className="pt-3 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Cam kết không phát sinh bất kỳ phụ phí nào tại đại lý showroom toàn quốc.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Hỗ trợ nhân viên giao nhận hồ sơ, bấm biển số tận nhà nhanh chóng trong ngày.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Hỗ trợ gói vay ngân hàng liên kết đối tác: Lãi suất cố định chỉ 5.9%/năm.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TestDriveModal
        isOpen={isTestDriveOpen}
        onClose={() => setIsTestDriveOpen(false)}
        initialCarName={`AutoHub GT-e ${selectedTrim.name}`}
      />

      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        carVariant={selectedTrim.name}
        exteriorColor="Xanh Phantom"
      />
    </div>
  );
};
