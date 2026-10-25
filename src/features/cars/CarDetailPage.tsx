import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Zap, 
  Navigation, 
  RotateCw, 
  ArrowRight, 
  Star, 
  Gauge, 
  BatteryCharging, 
  Maximize2, 
  ShieldAlert 
} from 'lucide-react';
import { DepositModal } from '@/features/car-deposit/DepositModal';
import { TestDriveModal } from '@/features/test-drive/TestDriveModal';

export const CarDetailPage: React.FC = () => {
  // Active States
  const [activeTrim, setActiveTrim] = useState<'standard' | 'performance' | 'track'>('performance');
  const [activeColor, setActiveColor] = useState<string>('silver');
  const [activeViewAngle, setActiveViewAngle] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'exterior' | 'interior' | 'detail'>('exterior');

  // Modals
  const [isDepositOpen, setIsDepositOpen] = useState<boolean>(false);
  const [isTestDriveOpen, setIsTestDriveOpen] = useState<boolean>(false);

  const trimData = {
    standard: {
      name: 'Standard GT',
      hp: '520 HP',
      range: '580 km • RWD Dual Mode',
      price: 2490000000,
      priceFormatted: '2.490.000.000',
      installment: 'từ 25.000.000 đ/tháng',
      acceleration: '4.1',
      battery: '90 kWh',
    },
    performance: {
      name: 'GT-e Performance',
      hp: '680 HP',
      range: '680 km • Dual Motor AWD',
      price: 2890000000,
      priceFormatted: '2.890.000.000',
      installment: 'từ 29.500.000 đ/tháng',
      acceleration: '3.2',
      battery: '105 kWh',
    },
    track: {
      name: 'GT-e Track Edition',
      hp: '820 HP',
      range: '620 km • Tri-Motor Torque Vectoring',
      price: 3450000000,
      priceFormatted: '3.450.000.000',
      installment: 'từ 35.000.000 đ/tháng',
      acceleration: '2.4',
      battery: '115 kWh',
    },
  };

  const colors = [
    { id: 'silver', name: 'Metallic Silver', hex: '#B0BCC7' },
    { id: 'black', name: 'Obsidian Black', hex: '#0F1115' },
    { id: 'white', name: 'Arctic Glacier White', hex: '#ECEFF4' },
    { id: 'blue', name: 'Hyper Tech Blue', hex: '#0284C7' },
    { id: 'grey', name: 'Nardo Titanium Grey', hex: '#4B5563' },
  ];

  const galleryImages = [
    { title: '3/4 TRƯỚC SANG TRỌNG', src: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80' },
    { title: 'HÔNG KHÍ ĐỘNG HỌC', src: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80' },
    { title: 'BUỒNG LÁI DIGITAL HUD', src: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80' },
    { title: 'MA TRẬN MATRIX LED', src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
  ];

  const currentTrim = trimData[activeTrim];
  const currentColor = colors.find((c) => c.id === activeColor) || colors[0];

  return (
    <div className="min-h-screen bg-[#0B1326] text-[#DAE2FD] font-sans pb-28">
      {/* Container 1440px */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 pt-8 space-y-8">
        
        {/* Top Meta & Navigation Path */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-[#3E4850]/40">
          <nav className="flex items-center gap-2 text-xs text-[#BEC8D2]">
            <Link to="/" className="hover:text-[#89CEFF]">Trang chủ</Link>
            <span className="text-[#3E4850]">/</span>
            <Link to="/cars" className="hover:text-[#89CEFF]">Dòng xe</Link>
            <span className="text-[#3E4850]">/</span>
            <span className="text-[#DAE2FD] font-semibold">AutoHub GT-e Performance Sedan</span>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#222A3D] text-[#89CEFF] text-[10px] font-mono font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#0EA5E9] shadow-[0_0_8px_#0EA5E9]" />
              <span>PHIÊN BẢN 2025 • SẴN SÀNG GIAO NGAY</span>
            </div>
            <span className="text-xs font-mono text-[#88929B]">VIN: VN-2025-GTE-992</span>
          </div>
        </div>

        {/* Primary Interactive Showcase Studio Grid (12 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Master Visualizer & Studio Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Stage Container */}
            <div className="relative aspect-[8/5] w-full rounded-lg bg-[#060E20] border border-[#3E4850]/50 overflow-hidden shadow-2xl group">
              <img
                src={galleryImages[activeViewAngle].src}
                alt={galleryImages[activeViewAngle].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060E20] via-transparent to-[#060E20]/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#060E20]/50 via-transparent to-transparent" />

              {/* Top Camera Switcher Pills */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                <div className="flex items-center gap-1 p-1 rounded bg-[#131B2E]/85 backdrop-blur-md border border-[#3E4850]/40 text-[10px] font-mono font-bold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('exterior')}
                    className={`px-3 py-1 rounded transition-all ${
                      activeTab === 'exterior'
                        ? 'bg-[#0EA5E9] text-[#00344D] shadow-[0_1px_2px_rgba(0,0,0,0.1)]'
                        : 'text-[#DAE2FD] hover:bg-[#222A3D]'
                    }`}
                  >
                    Ngoại thất 360°
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('interior')}
                    className={`px-3 py-1 rounded transition-all ${
                      activeTab === 'interior'
                        ? 'bg-[#0EA5E9] text-[#00344D]'
                        : 'text-[#DAE2FD] hover:bg-[#222A3D]'
                    }`}
                  >
                    Nội thất sang trọng
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('detail')}
                    className={`px-3 py-1 rounded transition-all ${
                      activeTab === 'detail'
                        ? 'bg-[#0EA5E9] text-[#00344D]'
                        : 'text-[#DAE2FD] hover:bg-[#222A3D]'
                    }`}
                  >
                    Góc nhìn chi tiết
                  </button>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#131B2E]/80 backdrop-blur-md border border-[#3E4850]/40 text-[11px] font-mono text-[#DAE2FD]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A6E0]" />
                  <span>STUDIO 4K HDR</span>
                </div>
              </div>

              {/* Bottom Floating Key Performance Metrics */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="p-4 rounded bg-[#131B2E]/90 backdrop-blur-md border border-[#3E4850]/50 flex items-center justify-between shadow-2xl">
                  {/* Metric 1 */}
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono font-bold text-[#88929B] uppercase tracking-wider">
                      TĂNG TỐC 0-100
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-2xl font-bold text-[#89CEFF]">{currentTrim.acceleration}</span>
                      <span className="font-mono text-[11px] text-[#DAE2FD]">GIÂY</span>
                    </div>
                  </div>

                  <div className="w-[1px] h-8 bg-[#2D3449]" />

                  {/* Metric 2 */}
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono font-bold text-[#88929B] uppercase tracking-wider">
                      PHẠM VI WLTP
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-2xl font-bold text-[#DAE2FD]">680</span>
                      <span className="font-mono text-[11px] text-[#DAE2FD]">KM</span>
                    </div>
                  </div>

                  <div className="w-[1px] h-8 bg-[#2D3449]" />

                  {/* Metric 3 */}
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono font-bold text-[#88929B] uppercase tracking-wider">
                      SẠC NHANH 800V
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-2xl font-bold text-[#7BD0FF]">18</span>
                      <span className="font-mono text-[11px] text-[#DAE2FD]">PHÚT (10-80%)</span>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 text-[#00A6E0] font-mono text-[10px] font-bold tracking-wider uppercase">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>3D ENGINE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnails Array (4 Camera Perspectives) */}
            <div className="grid grid-cols-4 gap-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={img.title}
                  type="button"
                  onClick={() => setActiveViewAngle(idx)}
                  className={`relative aspect-[8/5] rounded overflow-hidden border transition-all text-left ${
                    activeViewAngle === idx
                      ? 'border-[#0EA5E9] ring-2 ring-[#0EA5E9]/50 shadow-[0_0_12px_rgba(14,165,233,0.3)]'
                      : 'border-[#3E4850]/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.src} alt={img.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 p-1 bg-[#060E20]/80 backdrop-blur-sm text-center">
                    <span className="font-mono text-[9px] font-bold text-[#DAE2FD] block truncate">
                      {img.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Aerodynamic Callout */}
            <div className="p-4 rounded-lg bg-[#131B2E] border border-[#3E4850]/40 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-[#222A3D] flex items-center justify-center text-[#89CEFF] flex-shrink-0">
                  <WindIcon />
                </div>
                <div>
                  <div className="font-bold text-base text-[#DAE2FD]">Hệ số cản gió tối ưu Cd 0.205</div>
                  <div className="text-xs text-[#BEC8D2]">Thiết kế thân xe dòng chảy khí động lưu thông minh với cánh gió thích ứng điện tử tự động.</div>
                </div>
              </div>
              <div className="hidden sm:block text-right font-mono flex-shrink-0 pl-4">
                <div className="text-[10px] text-[#7BD0FF] font-bold tracking-wider uppercase">AIRFLOW EFFICIENCY</div>
                <div className="text-sm font-bold text-[#DAE2FD]">AERO 98.4%</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Vehicle Configurator Panel (5 Cols) */}
          <div className="lg:col-span-5 p-6 rounded-lg bg-[#131B2E] border border-[#3E4850]/50 space-y-6 shadow-2xl">
            
            {/* Header & Rating */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-mono font-bold tracking-wider uppercase">
                <span className="text-[#89CEFF]">FLAGSHIP ELECTRIC LUXURY</span>
                <span className="text-[#DAE2FD] flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-[#FFB86E] text-[#FFB86E]" />
                  5.0 (98 đánh giá)
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-[#DAE2FD] tracking-tight">
                AutoHub GT-e Grand Touring
              </h1>
              <p className="text-xs text-[#BEC8D2] leading-relaxed">
                Sự giao thoa hoàn mỹ giữa sức mạnh siêu xe và đẳng cấp công nghệ di chuyển bền vững.
              </p>
            </div>

            {/* Official Listed Price Card */}
            <div className="p-4 rounded bg-[#171F33] border border-[#3E4850]/40 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-[#88929B] uppercase tracking-wider">
                  GIÁ NIÊM YẾT CHÍNH THỨC
                </span>
                <span className="px-2 py-0.5 rounded bg-[#222A3D] text-[#C4E7FF] text-[10px] font-mono">
                  ĐÃ BAO GỒM VAT & PIN
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-extrabold text-[#89CEFF]">
                    {currentTrim.priceFormatted}
                  </span>
                  <span className="font-mono text-lg font-bold text-[#DAE2FD]">VNĐ</span>
                </div>
                <Link
                  to="/car-estimator"
                  className="px-3.5 py-1.5 rounded bg-gradient-to-r from-[#0EA5E9] via-[#00A6E0] to-[#89CEFF] text-[#0B1326] font-bold text-xs shadow-[0_0_16px_rgba(14,165,233,0.35)] hover:brightness-110 transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Dự toán chi phí lăn bánh</span>
                </Link>
              </div>
              <div className="flex justify-between items-center text-xs text-[#DAE2FD] pt-1 border-t border-[#3E4850]/30">
                <span className="text-[#BEC8D2]">Ước tính trả góp linh hoạt:</span>
                <span className="font-mono font-bold">{currentTrim.installment}</span>
              </div>
            </div>

            {/* Reservation Deposit Guarantee Banner */}
            <div className="p-3.5 rounded bg-[#222A3D] border border-[#89CEFF]/30 space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#7BD0FF] flex-shrink-0" />
                <span className="font-bold text-sm text-[#DAE2FD]">
                  Mức tiền cọc cố định: 20.000.000 VNĐ
                </span>
              </div>
              <p className="text-xs text-[#89CEFF] pl-7 leading-relaxed">
                Cam kết hoàn cọc 100% trong vòng 72h nếu thay đổi quyết định mà không chịu bất kỳ chi phí nào.
              </p>
            </div>

            {/* Step 1: Trim Selection */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-[#DAE2FD] tracking-wider uppercase">
                  1. LỰA CHỌN PHIÊN BẢN (TRIM)
                </span>
                <span className="text-[10px] font-mono font-bold text-[#89CEFF]">So sánh 3 bản</span>
              </div>

              <div className="space-y-2">
                {/* Trim 1: Standard GT */}
                <div
                  onClick={() => setActiveTrim('standard')}
                  className={`p-3 rounded border cursor-pointer transition-all flex items-center justify-between ${
                    activeTrim === 'standard'
                      ? 'bg-[#222A3D] border-[#0EA5E9] shadow-[0_0_12px_rgba(14,165,233,0.2)]'
                      : 'bg-[#171F33] border-[#3E4850]/40 hover:bg-[#222A3D]/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${activeTrim === 'standard' ? 'border-[#0EA5E9]' : 'border-[#BEC8D2]'}`}>
                      {activeTrim === 'standard' && <div className="w-2 h-2 rounded-full bg-[#0EA5E9]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#DAE2FD]">Standard GT</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#060E20] text-[#88929B] text-[9px] font-mono">520 HP</span>
                      </div>
                      <div className="text-xs text-[#BEC8D2]">Phạm vi 580 km • RWD Dual Mode</div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-sm text-[#DAE2FD]">2.490.000.000 đ</div>
                </div>

                {/* Trim 2: GT-e Performance (Active Default) */}
                <div
                  onClick={() => setActiveTrim('performance')}
                  className={`p-3 rounded border cursor-pointer transition-all flex items-center justify-between ${
                    activeTrim === 'performance'
                      ? 'bg-[#222A3D] border-[#0EA5E9] shadow-[0_0_12px_rgba(14,165,233,0.3)] ring-1 ring-[#0EA5E9]'
                      : 'bg-[#171F33] border-[#3E4850]/40 hover:bg-[#222A3D]/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${activeTrim === 'performance' ? 'border-[#0EA5E9]' : 'border-[#BEC8D2]'}`}>
                      {activeTrim === 'performance' && <div className="w-2 h-2 rounded-full bg-[#0EA5E9]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#89CEFF]">GT-e Performance</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#89CEFF] text-[#00344D] text-[9px] font-mono font-bold uppercase">
                          KHUYÊN DÙNG
                        </span>
                      </div>
                      <div className="text-xs text-[#DAE2FD]">680 HP • 680 km • Dual Motor AWD</div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-sm text-[#89CEFF]">2.890.000.000 đ</div>
                </div>

                {/* Trim 3: Track Edition */}
                <div
                  onClick={() => setActiveTrim('track')}
                  className={`p-3 rounded border cursor-pointer transition-all flex items-center justify-between ${
                    activeTrim === 'track'
                      ? 'bg-[#222A3D] border-[#0EA5E9] shadow-[0_0_12px_rgba(14,165,233,0.2)]'
                      : 'bg-[#171F33] border-[#3E4850]/40 hover:bg-[#222A3D]/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${activeTrim === 'track' ? 'border-[#0EA5E9]' : 'border-[#BEC8D2]'}`}>
                      {activeTrim === 'track' && <div className="w-2 h-2 rounded-full bg-[#0EA5E9]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#DAE2FD]">GT-e Track Edition</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#DE8712]/30 text-[#FFB86E] text-[9px] font-mono font-bold">820 HP</span>
                      </div>
                      <div className="text-xs text-[#BEC8D2]">Phạm vi 620 km • Tri-Motor Torque Vectoring</div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-sm text-[#DAE2FD]">3.450.000.000 đ</div>
                </div>
              </div>
            </div>

            {/* Step 2: Exterior Color Swatches */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-[#DAE2FD] tracking-wider uppercase">
                  2. MÀU SẮC NGOẠI THẤT
                </span>
                <span className="text-xs font-mono font-bold text-[#89CEFF]">
                  {currentColor.name}
                </span>
              </div>
              <div className="p-3 rounded bg-[#171F33] border border-[#3E4850]/40 flex items-center gap-3">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveColor(c.id)}
                    title={c.name}
                    className={`w-8 h-8 rounded-full transition-all relative ${
                      activeColor === c.id
                        ? 'ring-2 ring-[#171F33] ring-offset-2 ring-offset-[#89CEFF] scale-110 shadow-lg'
                        : 'opacity-80 hover:opacity-100 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Step 3: Wheels & Interior Quick Toggles */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded bg-[#171F33] border border-[#3E4850]/40 space-y-1">
                <div className="text-[9px] font-mono font-bold text-[#88929B] uppercase">LA-ZĂNG TIÊU CHUẨN</div>
                <div className="font-bold text-xs text-[#DAE2FD]">21" Aero Turbine Forged</div>
                <div className="text-[11px] font-mono text-[#7BD0FF]">Bao gồm trong giá</div>
              </div>
              <div className="p-3 rounded bg-[#171F33] border border-[#3E4850]/40 space-y-1">
                <div className="text-[9px] font-mono font-bold text-[#88929B] uppercase">KHÔNG GIAN NỘI THẤT</div>
                <div className="font-bold text-xs text-[#DAE2FD]">Nappa Cognac & Carbon</div>
                <div className="text-[11px] font-mono text-[#7BD0FF]">Gói Premium Suite</div>
              </div>
            </div>

            {/* Action CTA Cluster */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDepositOpen(true)}
                className="w-full py-3.5 px-4 rounded bg-gradient-to-r from-[#0EA5E9] via-[#00A6E0] to-[#89CEFF] text-[#0B1326] font-bold text-base shadow-[0_0_28px_rgba(14,165,233,0.35)] hover:brightness-110 transition-all flex flex-col items-center justify-center"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 fill-current" />
                  <span>ĐẶT CỌC GIỮ XE 72H</span>
                </div>
                <span className="text-[11px] font-normal text-[#00374D] mt-0.5">
                  Chỉ 20.000.000 VNĐ • Giữ số thứ tự xe và khuyến mại đặc quyền
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsTestDriveOpen(true)}
                className="w-full py-3 px-4 rounded bg-[#222A3D] hover:bg-[#2D3449] border border-[#3E4850]/60 text-sm font-semibold text-[#DAE2FD] transition-all flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4 text-[#89CEFF]" />
                <span>Đăng ký lái thử tận nhà (Miễn phí)</span>
              </button>
            </div>

            {/* Brand Guarantees Strip */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px]">
              <div className="p-2 rounded bg-[#060E20] border border-[#3E4850]/30 space-y-0.5">
                <div className="font-mono font-bold text-[#DAE2FD]">GIAO XE 14 NGÀY</div>
                <div className="text-[#88929B]">TOÀN QUỐC</div>
              </div>
              <div className="p-2 rounded bg-[#060E20] border border-[#3E4850]/30 space-y-0.5">
                <div className="font-mono font-bold text-[#DAE2FD]">BẢO HÀNH 8 NĂM</div>
                <div className="text-[#88929B]">HOẶC 160.000 KM</div>
              </div>
              <div className="p-2 rounded bg-[#060E20] border border-[#3E4850]/30 space-y-0.5">
                <div className="font-mono font-bold text-[#DAE2FD]">SẠC SIÊU NHANH</div>
                <div className="text-[#88929B]">MIỄN PHÍ TRỌN ĐỜI</div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Telemetry & Engineering Specifications (4-Pillar Grid) */}
        <div className="pt-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#3E4850]/40">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#89CEFF] tracking-wider uppercase">
                <span className="w-2 h-2 rounded bg-[#89CEFF]" />
                <span>KỸ THUẬT & CÔNG NGHỆ CHẾ TÁC</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#DAE2FD]">
                Bảng thông số kỹ thuật toàn diện
              </h2>
            </div>
            <div className="font-mono text-xs text-[#88929B]">
              Kiến trúc điện toán siêu phân giải 800V E-Platform 3.0
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Powertrain */}
            <div className="p-5 rounded-lg bg-[#131B2E] border border-[#3E4850]/50 space-y-4">
              <div className="flex justify-between items-center">
                <Gauge className="w-6 h-6 text-[#89CEFF]" />
                <span className="px-2 py-0.5 rounded bg-[#171F33] text-[#7BD0FF] text-[10px] font-mono font-bold">POWERTRAIN</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-[#DAE2FD]">Động cơ & Vận hành</h3>
                <p className="text-xs text-[#BEC8D2] mt-0.5">Cấu trúc truyền động kép Dual Motor AWD nam châm vĩnh cửu.</p>
              </div>
              <div className="space-y-2 text-xs border-t border-[#3E4850]/30 pt-3">
                <div className="flex justify-between">
                  <span className="text-[#88929B]">Công suất tối đa:</span>
                  <span className="font-mono font-bold text-[#DAE2FD]">680 HP (500 kW)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#88929B]">Mô-men xoắn tức thì:</span>
                  <span className="font-mono font-bold text-[#DAE2FD]">850 Nm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#88929B]">Hệ dẫn động:</span>
                  <span className="font-mono font-bold text-[#89CEFF]">AWD Toàn Thời Gian</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#88929B]">Tốc độ tối đa:</span>
                  <span className="font-mono font-bold text-[#DAE2FD]">265 km/h</span>
                </div>
              </div>
            </div>

            {/* Card 2: Battery & Charging */}
            <div className="p-5 rounded-lg bg-[#131B2E] border border-[#3E4850]/50 space-y-4">
              <div className="flex justify-between items-center">
                <BatteryCharging className="w-6 h-6 text-[#89CEFF]" />
                <span className="px-2 py-0.5 rounded bg-[#171F33] text-[#7BD0FF] text-[10px] font-mono font-bold">ENERGY CELL</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-[#DAE2FD]">Pin & Sạc 800V Siêu Tốc</h3>
                <p className="text-xs text-[#BEC8D2] mt-0.5">Khối pin LFP cấu trúc Cell-to-Chassis tối ưu tản nhiệt chất lỏng.</p>
              </div>
              <div className="space-y-2 text-xs border-t border-[#3E4850]/30 pt-3">
                <div className="flex justify-between">
                  <span className="text-[#88929B]">Dung lượng danh định:</span>
                  <span className="font-mono font-bold text-[#DAE2FD]">105 kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#88929B]">Kiến trúc điện:</span>
                  <span className="font-mono font-bold text-[#7BD0FF]">800V Siêu Cấp</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#88929B]">Thời gian nạp 10-80%:</span>
                  <span className="font-mono font-bold text-[#89CEFF]">18 Phút</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#88929B]">Công suất nạp DC Max:</span>
                  <span className="font-mono font-bold text-[#DAE2FD]">350 kW Peak</span>
                </div>
              </div>
            </div>

            {/* Card 3: Dimensions */}
            <div className="p-5 rounded-lg bg-[#131B2E] border border-[#3E4850]/50 space-y-4">
              <div className="flex justify-between items-center">
                <Maximize2 className="w-6 h-6 text-[#89CEFF]" />
                <span className="px-2 py-0.5 rounded bg-[#171F33] text-[#7BD0FF] text-[10px] font-mono font-bold">CHASSIS & ROOM</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-[#DAE2FD]">Kích thước & Trọng lượng</h3>
                <p className="text-xs text-[#BEC8D2] mt-0.5">Phân bổ khối lượng tỷ lệ vàng 50:50 trọng tâm thấp thể thao.</p>
              </div>
              <div className="space-y-2 text-xs border-t border-[#3E4850]/30 pt-3">
                <div className="flex justify-between">
                  <span className="text-[#88929B]">Dài x Rộng x Cao:</span>
                  <span className="font-mono font-bold text-[#DAE2FD]">4.980 x 1.965 x 1.410 mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#88929B]">Chiều dài cơ sở:</span>
                  <span className="font-mono font-bold text-[#DAE2FD]">2.990 mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#88929B]">Khoảng sáng gầm:</span>
                  <span className="font-mono font-bold text-[#DAE2FD]">145 mm (Air-Suspension)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#88929B]">Khoang hành lý:</span>
                  <span className="font-mono font-bold text-[#89CEFF]">520L (+ 85L Frunk)</span>
                </div>
              </div>
            </div>

            {/* Card 4: Autonomous */}
            <div className="p-5 rounded-lg bg-[#131B2E] border border-[#3E4850]/50 space-y-4">
              <div className="flex justify-between items-center">
                <ShieldAlert className="w-6 h-6 text-[#89CEFF]" />
                <span className="px-2 py-0.5 rounded bg-[#171F33] text-[#7BD0FF] text-[10px] font-mono font-bold">AUTONOMOUS</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-[#DAE2FD]">Công nghệ & An toàn</h3>
                <p className="text-xs text-[#BEC8D2] mt-0.5">Bộ vi xử lý thần kinh kép 508 TOPS xử lý dữ liệu thời gian thực.</p>
              </div>
              <div className="space-y-2 text-xs border-t border-[#3E4850]/30 pt-3">
                <div className="flex justify-between">
                  <span className="text-[#88929B]">Hỗ trợ tự hành:</span>
                  <span className="font-mono font-bold text-[#89CEFF]">AutoPilot Level 2+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#88929B]">Cảm biến & LiDAR:</span>
                  <span className="font-mono font-bold text-[#DAE2FD]">12 Camera + 1 LiDAR 360°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#88929B]">Hệ thống phanh:</span>
                  <span className="font-mono font-bold text-[#DAE2FD]">Gốm Carbon Brembo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#88929B]">Euro NCAP:</span>
                  <span className="font-mono font-bold text-[#FFB86E]">5 SAO TOÀN DIỆN</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Aside - Sticky Bottom HUD Bar for Conversion Flow */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0B1326]/95 backdrop-blur-xl border-t border-[#2D3449] shadow-[0_-8px_30px_rgba(0,0,0,0.6)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-[#DAE2FD]">AutoHub GT-e</span>
                <span className="px-2 py-0.5 rounded bg-[#0EA5E9] text-[#00344D] text-[9px] font-mono font-bold uppercase">
                  PERFORMANCE
                </span>
              </div>
              <div className="text-xs text-[#BEC8D2]">Thời gian nhận bàn giao dự kiến: Tháng 05/2025</div>
            </div>

            <div className="hidden md:block w-[1px] h-8 bg-[#2D3449]" />

            <div className="hidden md:block">
              <div className="text-[10px] font-mono font-bold text-[#88929B] uppercase">GIÁ HOÀN THIỆN (ĐÃ GỒM PIN & VAT)</div>
              <div className="font-mono text-2xl font-bold text-[#89CEFF]">
                {currentTrim.priceFormatted} <span className="text-xs text-[#DAE2FD]">VNĐ</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:block text-right">
              <div className="text-[10px] font-mono font-bold text-[#7BD0FF] uppercase">CỌC TRỰC TUYẾN 100% HOÀN LẠI</div>
              <div className="text-xs text-[#88929B]">Giữ suất xe chỉ với 20.000.000 đ</div>
            </div>

            <button
              type="button"
              onClick={() => setIsDepositOpen(true)}
              className="px-6 py-3 rounded bg-[#89CEFF] hover:bg-[#a6dbff] text-[#00344D] font-bold text-sm shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-all flex items-center gap-2"
            >
              <span>Đặt cọc ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        carVariant={currentTrim.name}
        exteriorColor={currentColor.name}
      />

      {/* Test Drive Modal */}
      <TestDriveModal
        isOpen={isTestDriveOpen}
        onClose={() => setIsTestDriveOpen(false)}
        initialCarName={`AutoHub GT-e ${currentTrim.name}`}
      />
    </div>
  );
};

// Simple Wind Icon
const WindIcon = () => (
  <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.5 17C8.66667 17 7.95833 16.7083 7.375 16.125C6.79167 15.5417 6.5 14.8333 6.5 14H8.5C8.5 14.2833 8.59583 14.5208 8.7875 14.7125C8.97917 14.9042 9.21667 15 9.5 15C9.78333 15 10.0208 14.9042 10.2125 14.7125C10.4042 14.5208 10.5 14.2833 10.5 14C10.5 13.7167 10.4042 13.4792 10.2125 13.2875C10.0208 13.0958 9.78333 13 9.5 13H0V11H9.5C10.3333 11 11.0417 11.2917 11.625 11.875C12.2083 12.4583 12.5 13.1667 12.5 14C12.5 14.8333 12.2083 15.5417 11.625 16.125C11.0417 16.7083 10.3333 17 9.5 17V17M0 7V5H13.5C13.9333 5 14.2917 4.85833 14.575 4.575C14.8583 4.29167 15 3.93333 15 3.5C15 3.06667 14.8583 2.70833 14.575 2.425C14.2917 2.14167 13.9333 2 13.5 2C13.0667 2 12.7083 2.14167 12.425 2.425C12.1417 2.70833 12 3.06667 12 3.5H10C10 2.51667 10.3375 1.6875 11.0125 1.0125C11.6875 0.3375 12.5167 0 13.5 0C14.4833 0 15.3125 0.3375 15.9875 1.0125C16.6625 1.6875 17 2.51667 17 3.5C17 4.48333 16.6625 5.3125 15.9875 5.9875C15.3125 6.6625 14.4833 7 13.5 7H0V7M16.5 15V13C16.9333 13 17.2917 12.8583 17.575 12.575C17.8583 12.2917 18 11.9333 18 11.5C18 11.0667 17.8583 10.7083 17.575 10.425C17.2917 10.1417 16.9333 10 16.5 10H0V8H16.5C17.4833 8 18.3125 8.3375 18.9875 9.0125C19.6625 9.6875 20 10.5167 20 11.5C20 12.4833 19.6625 13.3125 18.9875 13.9875C18.3125 14.6625 17.4833 15 16.5 15V15" fill="#89CEFF"/>
  </svg>
);
