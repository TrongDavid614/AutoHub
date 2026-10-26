import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Filter, 
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Lock,
  ChevronRight,
  LayoutGrid,
  List,
  Heart,
  Scale,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { MOCK_CARS, type MockCar } from '../mocks/car.mock';
import { useCompareStore } from '@/store/useCompareStore';

export const CarListPage: React.FC = () => {
  const navigate = useNavigate();
  const { addVariantToCompare } = useCompareStore();

  // View Mode: 'row' (Bộ Sưu tập dòng xe dạng row) vs 'grid' (Bộ Sưu tập dòng xe)
  const [viewMode, setViewMode] = useState<'row' | 'grid'>('row');

  // Filters state matching Figma
  const [selectedSegment, setSelectedSegment] = useState<string>('Sedan thể thao');
  const [priceRange, setPriceRange] = useState<string>('2 - 3 tỷ');
  const [selectedPowertrains, setSelectedPowertrains] = useState<string[]>(['Thuần điện EV 800V SiC']);
  const [selectedSeats, setSelectedSeats] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recommended');

  // Modal State
  const [favorites, setFavorites] = useState<string[]>(['gt-e-grand-touring']);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filterSegments = [
    { label: 'Sedan thể thao', count: 4 },
    { label: 'SUV Đa dụng', count: 2 },
    { label: 'GT Hypercar', count: 1 },
    { label: 'Shooting Brake', count: 1 },
  ];

  const powertrains = [
    'Thuần điện EV 800V SiC',
    'Dual-Motor AWD',
    'Tri-Motor Hyper AWD',
  ];

  const colors = [
    { name: 'Xanh Phantom', hex: '#00A6E0' },
    { name: 'Đen Obsidian', hex: '#060E20' },
    { name: 'Trắng Ngọc Trai', hex: '#DAE2FD' },
    { name: 'Bạc Titanium', hex: '#88929B' },
  ];

  const handleResetFilters = () => {
    setSelectedSegment('all');
    setPriceRange('all');
    setSelectedPowertrains([]);
    setSelectedSeats('all');
    setSelectedColor('all');
  };

  const togglePowertrain = (pt: string) => {
    setSelectedPowertrains((prev) =>
      prev.includes(pt) ? prev.filter((p) => p !== pt) : [...prev, pt]
    );
  };

  const filteredCars = useMemo(() => {
    return MOCK_CARS.filter((car) => {
      if (selectedSegment !== 'all' && car.segment !== selectedSegment) return false;
      if (selectedPowertrains.length > 0 && !selectedPowertrains.includes(car.powertrain)) return false;
      return true;
    });
  }, [selectedSegment, selectedPowertrains]);

  const handleCompare = (car: MockCar) => {
    addVariantToCompare({
      id: Math.abs(car.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)),
      modelId: 1,
      variantName: car.name,
      engineSpecs: car.powertrain,
      horsepower: parseInt(car.power.replace(/\D/g, ''), 10) || 500,
      transmission: 'AUTOMATIC',
      fuelType: 'ELECTRIC',
      listedPrice: car.listedPrice,
      depositPrice: car.depositAmount,
      colors: car.availableColors.map((c, i) => ({ id: i + 1, colorName: c.name, colorCodeHex: c.hex })),
      images: [{ id: 1, imageUrl: car.image, viewType: 'THUMBNAIL', displayOrder: 1 }],
    });
    navigate('/car-comparison');
  };

  return (
    <div className="w-full space-y-6 text-[#DAE2FD] antialiased">
      {/* BREADCRUMB & HEADER SECTION */}
      <div className="space-y-3 pb-4 border-b border-[#3E4850]/40">
        <nav className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#88929B] uppercase tracking-wider">
          <Link to="/" className="hover:text-[#89CEFF] transition-colors">TRANG CHỦ</Link>
          <span className="text-[#2D3449]">/</span>
          <span className="text-[#88929B]">DÒNG XE</span>
          <span className="text-[#2D3449]">/</span>
          <span className="text-[#89CEFF]">
            {viewMode === 'row' ? 'DANH MỤC XE ĐIỆN AUTOHUB (DẠNG ROW)' : 'BỘ SƯU TẬP DÒNG XE (GRID VIEW)'}
          </span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            {viewMode === 'row' ? (
              <>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#DAE2FD] tracking-tight">
                  Bộ Sưu Tập Xe Điện Hiệu Năng Cao <span className="text-[#89CEFF] drop-shadow-[0_0_16px_rgba(14,165,233,0.35)]">AutoHub GT-e</span>
                </h1>
                <p className="text-xs text-[#BEC8D2] mt-1 max-w-3xl">
                  Khám phá các dòng sedan thể thao thuần điện kiến trúc sạc siêu nhanh 800V SiC và công nghệ tự hành HubPilot thế hệ mới.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#DAE2FD] tracking-tight">
                  Bộ Sưu Tập Dòng Xe Điện & Thể Thao <span className="text-[#89CEFF] drop-shadow-[0_0_16px_rgba(14,165,233,0.35)]">Cao Cấp AutoHub</span>
                </h1>
                <p className="text-xs text-[#BEC8D2] mt-1 max-w-3xl">
                  Khám phá danh mục xe thuần điện đỉnh cao 800V và hybrid hiệu năng vượt trội với công nghệ tự hành LiDAR.
                </p>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-[4px] bg-[#131B2E] border border-[#3E4850]/50 shadow-sm">
              <div className="text-right">
                <span className="text-[10px] font-mono font-bold text-[#88929B] uppercase tracking-wider block">
                  NỀN TẢNG KIẾN TRÚC
                </span>
                <span className="text-xs font-mono font-bold text-[#89CEFF] uppercase tracking-wider block">
                  800V SiC ULTRA
                </span>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#89CEFF] shadow-[0_0_8px_#89CEFF]" />
            </div>

            {viewMode === 'grid' && (
              <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-[4px] bg-[#131B2E] border border-[#3E4850]/50 shadow-sm">
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold text-[#88929B] uppercase tracking-wider block">
                    CÔNG NGHỆ CỐT LÕI
                  </span>
                  <span className="text-xs font-mono font-bold text-[#89CEFF] uppercase tracking-wider block">
                    LiDAR + HubOS
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN 2-COLUMN CATALOG CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: MULTI-FACET FILTER SIDEBAR (Col 3) */}
        <aside className="lg:col-span-3 bg-[#131B2E] border border-[#3E4850]/50 rounded-[4px] p-4 shadow-xl space-y-4 sticky top-20 text-xs">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#3E4850]/50">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#DAE2FD]">
              <Filter className="w-4 h-4 text-[#89CEFF]" />
              <span className="font-mono text-xs">BỘ LỌC TÌM KIẾM</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-[10px] font-mono font-bold text-[#89CEFF] underline hover:text-white transition-colors"
            >
              Xóa bộ lọc (3)
            </button>
          </div>

          {/* Section 1: Phân khúc xe (Segment) */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#88929B]">
              PHÂN KHÚC XE (SEGMENT)
            </label>
            <div className="space-y-1">
              {filterSegments.map((seg) => {
                const isSelected = selectedSegment === seg.label;
                return (
                  <div
                    key={seg.label}
                    onClick={() => setSelectedSegment(isSelected ? 'all' : seg.label)}
                    className={`flex items-center justify-between p-2 rounded-[2px] cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#171F33] text-[#89CEFF] border border-[#89CEFF]/30'
                        : 'hover:bg-[#171F33]/60 text-[#BEC8D2]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3.5 h-3.5 rounded-[2px] flex items-center justify-center border transition-all ${
                          isSelected ? 'bg-[#89CEFF] border-[#89CEFF]' : 'border-[#3E4850] bg-[#0B1326]'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#00344D]" />}
                      </div>
                      <span className="text-xs font-medium">{seg.label}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#2D3449] text-[#BEC8D2]">
                      {seg.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Khoảng giá dự toán VNĐ */}
          <div className="space-y-1.5 p-2 rounded-[2px] bg-[#171F33]/40 border border-[#3E4850]/30">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-wider">
              <span className="text-[#88929B]">KHOẢNG GIÁ DỰ TOÁN</span>
              <span className="text-[#89CEFF]">VNĐ</span>
            </div>
            <div className="text-sm font-mono font-bold text-[#89CEFF]">
              1.5 tỷ – 3.5 tỷ VNĐ
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1">
              {['< 2 tỷ', '2 - 3 tỷ', '> 3 tỷ'].map((pr) => (
                <button
                  key={pr}
                  type="button"
                  onClick={() => setPriceRange(pr)}
                  className={`py-1.5 px-1 rounded-[2px] text-[10px] font-mono font-bold transition-all text-center ${
                    priceRange === pr
                      ? 'bg-[#89CEFF] text-[#00344D] shadow-[0_0_8px_rgba(14,165,233,0.4)]'
                      : 'bg-[#171F33] text-[#BEC8D2] hover:bg-[#222A3D]'
                  }`}
                >
                  {pr}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Hệ truyền động & Pin */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#88929B]">
              HỆ TRUYỀN ĐỘNG & PIN
            </label>
            <div className="space-y-1">
              {powertrains.map((pt) => {
                const checked = selectedPowertrains.includes(pt);
                return (
                  <div
                    key={pt}
                    onClick={() => togglePowertrain(pt)}
                    className={`flex items-center gap-2 p-2 rounded-[2px] cursor-pointer transition-colors ${
                      checked
                        ? 'bg-[#171F33] text-[#89CEFF] border border-[#89CEFF]/30'
                        : 'hover:bg-[#171F33]/60 text-[#BEC8D2]'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-[2px] flex items-center justify-center border transition-all ${
                        checked ? 'bg-[#89CEFF] border-[#89CEFF]' : 'border-[#3E4850] bg-[#0B1326]'
                      }`}
                    >
                      {checked && <span className="w-1.5 h-1.5 rounded-full bg-[#00344D]" />}
                    </div>
                    <span className="text-xs font-medium">{pt}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Số chỗ ngồi (Seats) */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#88929B]">
              SỐ CHỖ NGỒI (SEATS)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedSeats('4')}
                className={`py-2 px-2 rounded-[2px] text-center text-xs font-semibold transition-all ${
                  selectedSeats === '4'
                    ? 'bg-[#171F33] text-[#89CEFF] border border-[#89CEFF]/50 shadow-sm'
                    : 'bg-[#2D3449]/40 text-[#BEC8D2] hover:bg-[#2D3449]/70'
                }`}
              >
                4 chỗ VIP
              </button>
              <button
                type="button"
                onClick={() => setSelectedSeats('5')}
                className={`py-2 px-2 rounded-[2px] text-center text-xs font-semibold transition-all ${
                  selectedSeats === '5'
                    ? 'bg-[#171F33] text-[#89CEFF] border border-[#89CEFF]/50 shadow-sm'
                    : 'bg-[#2D3449]/40 text-[#BEC8D2] hover:bg-[#2D3449]/70'
                }`}
              >
                5 chỗ tiêu chuẩn
              </button>
            </div>
          </div>

          {/* Section 5: Màu ngoại thất đề xuất */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#88929B]">
              MÀU NGOẠI THẤT ĐỀ XUẤT
            </label>
            <div className="flex items-center gap-2.5">
              {colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  title={c.name}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setSelectedColor(c.name)}
                  className={`w-6 h-6 rounded-full transition-all ${
                    selectedColor === c.name
                      ? 'ring-2 ring-[#89CEFF] ring-offset-2 ring-offset-[#131B2E] scale-110'
                      : 'border border-[#3E4850] hover:scale-105'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Apply Filter Button */}
          <button
            type="button"
            className="w-full py-2.5 px-3 rounded-[4px] bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-[#00344D] font-bold text-xs uppercase tracking-wider shadow-[0_0_18px_rgba(14,165,233,0.35)] transition-all flex items-center justify-center gap-2"
          >
            <span>ÁP DỤNG BỘ LỌC ({filteredCars.length} XE)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </aside>

        {/* RIGHT COLUMN: MAIN CATALOG CONTENT (Col 9) */}
        <section className="lg:col-span-9 space-y-4">
          {/* Top Control Bar matching Figma */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#131B2E] border border-[#3E4850]/50 rounded-[4px] shadow-sm text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-[#171F33]">
                <div className="w-2 h-2 rounded-full bg-[#00A6E0]" />
                <span className="font-semibold text-[#DAE2FD]">
                  Hiển thị {filteredCars.length} mẫu xe sẵn sàng giao
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-[2px] bg-[#171F33] text-[#89CEFF] text-[10px] font-mono font-bold flex items-center gap-1.5">
                Sedan thể thao <span className="cursor-pointer hover:text-white">✕</span>
              </span>
              <span className="px-2 py-0.5 rounded-[2px] bg-[#171F33] text-[#89CEFF] text-[10px] font-mono font-bold flex items-center gap-1.5">
                Thuần điện EV 800V <span className="cursor-pointer hover:text-white">✕</span>
              </span>
              <span className="px-2 py-0.5 rounded-[2px] bg-[#171F33] text-[#89CEFF] text-[10px] font-mono font-bold flex items-center gap-1.5">
                1.5 - 3.5 tỷ <span className="cursor-pointer hover:text-white">✕</span>
              </span>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[#171F33]">
                <span className="text-[#88929B] text-[11px]">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-[#89CEFF] text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="recommended" className="bg-[#171F33] text-[#DAE2FD]">Mới nhất & Khuyên dùng</option>
                  <option value="price-asc" className="bg-[#171F33] text-[#DAE2FD]">Giá: Thấp đến Cao</option>
                  <option value="price-desc" className="bg-[#171F33] text-[#DAE2FD]">Giá: Cao đến Thấp</option>
                </select>
              </div>

              {/* View Switcher Toggle */}
              <div className="flex items-center gap-1 bg-[#171F33] p-1 rounded-[2px] border border-[#3E4850]/40">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-[2px] transition-all ${
                    viewMode === 'grid'
                      ? 'bg-[#0EA5E9] text-[#00344D] shadow-[0_0_12px_rgba(14,165,233,0.5)]'
                      : 'text-[#BEC8D2] hover:text-white'
                  }`}
                  title="Chế độ lưới (Grid View)"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('row')}
                  className={`p-1.5 rounded-[2px] transition-all ${
                    viewMode === 'row'
                      ? 'bg-[#0EA5E9] text-[#00344D] shadow-[0_0_12px_rgba(14,165,233,0.5)]'
                      : 'text-[#BEC8D2] hover:text-white'
                  }`}
                  title="Chế độ hàng ngang (Row View)"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* VIEW MODE 1: ROW VIEW (BỘ SƯU TẬP DÒNG XE DẠNG ROW) */}
          {viewMode === 'row' && (
            <div className="space-y-4">
              {filteredCars.map((car) => {
                return (
                  <div
                    key={car.id}
                    className="bg-[#131B2E] border border-[#3E4850]/50 hover:border-[#89CEFF]/50 rounded-[4px] p-4 shadow-xl transition-all group"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                      {/* Col 4: Image & Badges */}
                      <div className="md:col-span-4 relative rounded-[4px] overflow-hidden bg-[#060E20] border border-[#3E4850]/40 flex flex-col justify-between p-3 min-h-[190px]">
                        <span className="self-start px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[rgba(137,206,255,0.2)] text-[#89CEFF] backdrop-blur-sm border border-[#89CEFF]/30">
                          ● {car.badge}
                        </span>

                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-32 object-cover rounded my-auto group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Color Dots */}
                        <div className="flex items-center justify-center gap-1.5 pt-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#00A6E0] ring-1 ring-[#89CEFF]" />
                          <span className="w-2 h-2 rounded-full bg-[#1E293B]" />
                          <span className="w-2 h-2 rounded-full bg-[#E2E8F0]" />
                          <span className="w-2 h-2 rounded-full bg-[#94A3B8]" />
                        </div>
                      </div>

                      {/* Col 5: Car Name & 2x2 Specs Grid */}
                      <div className="md:col-span-5 flex flex-col justify-between space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-[#DAE2FD] tracking-tight group-hover:text-[#89CEFF] transition-colors">
                            {car.name}
                          </h3>
                          <p className="text-xs text-[#BEC8D2] mt-0.5">{car.subtitle}</p>
                        </div>

                        {/* 2x2 Specs Matrix */}
                        <div className="grid grid-cols-2 gap-2.5 p-3 bg-[rgba(34,42,61,0.3)] border border-[#3E4850]/40 rounded-[4px] text-xs">
                          <div>
                            <div className="text-[10px] font-mono font-bold uppercase text-[#88929B]">TĂNG TỐC 0-100</div>
                            <div className="text-sm font-mono font-bold text-[#89CEFF] mt-0.5">{car.acceleration}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-mono font-bold uppercase text-[#88929B]">CÔNG SUẤT CỰC ĐẠI</div>
                            <div className="text-xs font-mono font-bold text-[#DAE2FD] mt-0.5">{car.power}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-mono font-bold uppercase text-[#88929B]">TẦM HOẠT ĐỘNG</div>
                            <div className="text-xs font-mono font-bold text-[#DAE2FD] mt-0.5">{car.range}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-mono font-bold uppercase text-[#88929B]">SẠC NHANH 800V</div>
                            <div className="text-xs font-mono font-bold text-[#DAE2FD] mt-0.5">{car.charging}</div>
                          </div>
                        </div>

                        {/* 2 Feature Badges */}
                        <div className="flex items-center gap-3 text-[11px] text-[#89CEFF]">
                          <span className="flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5" />
                            <span>{car.feature1}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5" />
                            <span>{car.feature2}</span>
                          </span>
                        </div>
                      </div>

                      {/* Col 3: Pricing & Action Buttons */}
                      <div className="md:col-span-3 flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#3E4850]/50 pt-3 md:pt-0 md:pl-5 space-y-3">
                        <div>
                          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#88929B]">
                            GIÁ NIÊM YẾT CHÍNH THỨC
                          </div>
                          <div className="text-xl font-mono font-bold text-white tracking-tight mt-0.5">
                            {car.listedPrice.toLocaleString('vi-VN')} <span className="text-xs font-normal text-[#88929B]">VND</span>
                          </div>
                        </div>

                        {/* 72H Deposit Callout Box */}
                        <div className="p-2.5 bg-[#171F33] border border-[#3E4850]/60 rounded-[4px] space-y-1">
                          <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-[#89CEFF]">
                            <Lock className="w-3 h-3 flex-shrink-0" />
                            <span>Cọc giữ xe 72h: {car.depositAmount.toLocaleString('vi-VN')} đ</span>
                          </div>
                          <p className="text-[10px] text-[#BEC8D2] leading-tight">
                            {car.depositNote}
                          </p>
                        </div>

                        {/* Link to Cost Estimator */}
                        <Link
                          to="/car-estimator"
                          className="text-xs text-[#89CEFF] hover:underline flex items-center justify-between font-medium"
                        >
                          <span>Dự toán lăn bánh từ {car.estimatedOnRoad.toLocaleString('vi-VN')} đ</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>

                        {/* Action Buttons */}
                        <div className="space-y-2 pt-1">
                          <Link
                            to={`/cars/${car.id}`}
                            className="w-full py-2.5 px-3 rounded-[2px] bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-[#00344D] font-bold text-xs uppercase tracking-wider shadow-[0_0_14px_rgba(14,165,233,0.35)] transition-all flex items-center justify-center gap-1.5 text-center"
                          >
                            <span>Xem chi tiết & Cọc ngay</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleCompare(car)}
                            className="w-full py-2 px-3 rounded-[2px] bg-[#171F33] hover:bg-[#222A3D] border border-[#3E4850]/60 text-[#BEC8D2] hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#89CEFF]" />
                            <span>+ So sánh đối đầu</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW MODE 2: GRID VIEW (BỘ SƯU TẬP DÒNG XE 3 CỘT) */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCars.map((car) => {
                const isFavorite = favorites.includes(car.id);
                return (
                  <div
                    key={car.id}
                    className="bg-[#131B2E] border border-[#3E4850]/50 hover:border-[#89CEFF]/50 rounded-[4px] overflow-hidden shadow-xl transition-all group flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Image & Overlay Badges */}
                      <div className="relative h-48 bg-[#060E20] overflow-hidden p-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between z-10">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#131B2E]/90 text-[#89CEFF] border border-[#89CEFF]/30">
                            ● {car.badge}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => toggleFavorite(car.id, e)}
                            className="p-1.5 rounded-full bg-[#131B2E]/80 hover:bg-[#131B2E] text-[#BEC8D2] hover:text-rose-500 transition-colors"
                            title="Lưu yêu thích"
                          >
                            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-[#BEC8D2]'}`} />
                          </button>
                        </div>

                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-32 object-cover rounded my-auto group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Carousel Dots */}
                        <div className="flex items-center justify-center gap-1.5 z-10">
                          <span className="w-2 h-2 rounded-full bg-[#89CEFF]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3E4850]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3E4850]" />
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h4 className="text-base font-bold text-[#DAE2FD] tracking-tight group-hover:text-[#89CEFF] transition-colors">
                            {car.name}
                          </h4>
                          <p className="text-[11px] text-[#BEC8D2] mt-0.5 line-clamp-1">{car.subtitle}</p>
                        </div>

                        {/* 3 Metric Boxes */}
                        <div className="grid grid-cols-3 gap-2 py-1 text-center font-mono">
                          <div className="p-2 rounded-[2px] bg-[#060E20] border border-[#3E4850]/40">
                            <div className="text-[9px] uppercase text-[#88929B]">0-100 KM/H</div>
                            <div className="text-sm font-bold text-[#89CEFF] mt-0.5">
                              {car.gridSpecs?.s1Val || car.acceleration}
                            </div>
                          </div>

                          <div className="p-2 rounded-[2px] bg-[#060E20] border border-[#3E4850]/40">
                            <div className="text-[9px] uppercase text-[#88929B] truncate">
                              {car.gridSpecs?.s2Label.replace(' (WLTP)', '') || 'TẦM CHẠY'}
                            </div>
                            <div className="text-xs font-bold text-[#DAE2FD] mt-0.5">
                              {car.gridSpecs?.s2Val || car.range}
                            </div>
                          </div>

                          <div className="p-2 rounded-[2px] bg-[#060E20] border border-[#3E4850]/40">
                            <div className="text-[9px] uppercase text-[#88929B] truncate">
                              {car.gridSpecs?.s3Label || 'SẠC 800V'}
                            </div>
                            <div className="text-xs font-bold text-[#DAE2FD] mt-0.5 truncate">
                              {car.gridSpecs?.s3Val || '15 phút'}
                            </div>
                          </div>
                        </div>

                        {/* Price Details */}
                        <div className="pt-2 border-t border-[#3E4850]/40">
                          <div className="flex items-baseline justify-between font-mono">
                            <span className="text-[10px] uppercase text-[#88929B]">
                              {car.isUpcoming ? 'GIÁ DỰ KIẾN' : 'GIÁ NIÊM YẾT'}
                            </span>
                            <div className="text-base font-bold text-white">
                              <span className="text-xs font-normal text-[#88929B] mr-1">Từ</span>
                              {car.listedPrice.toLocaleString('vi-VN')} <span className="text-xs text-[#88929B]">đ</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-[#89CEFF]">
                            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{car.depositNote}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Buttons in Grid View */}
                    <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleCompare(car)}
                        className="py-2 px-2 rounded-[2px] bg-[#171F33] hover:bg-[#222A3D] border border-[#3E4850]/60 text-[#BEC8D2] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Scale className="w-3.5 h-3.5 text-[#89CEFF]" />
                        <span>So sánh xe</span>
                      </button>

                      {car.isUpcoming ? (
                        <Link
                          to="/test-drive"
                          className="py-2 px-2 rounded-[2px] bg-[#171F33] hover:bg-[#222A3D] border border-[#89CEFF]/40 text-[#89CEFF] font-semibold text-xs flex items-center justify-center gap-1 transition-colors text-center"
                        >
                          <span>Đăng ký lái thử</span>
                        </Link>
                      ) : (
                        <Link
                          to={`/cars/${car.id}`}
                          className="py-2 px-2 rounded-[2px] bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-[#00344D] font-bold text-xs uppercase tracking-wider shadow-[0_0_12px_rgba(14,165,233,0.35)] transition-all flex items-center justify-center gap-1 text-center"
                        >
                          <span>Xem chi tiết & Cọc</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PAGINATION BAR MATCHING FIGMA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#131B2E] border border-[#3E4850]/50 rounded-[4px] text-xs text-[#88929B]">
            <div>
              Hiển thị <strong className="text-[#DAE2FD]">1 - 6</strong> trên tổng số{' '}
              <strong className="text-[#DAE2FD]">{filteredCars.length}</strong> mẫu xe
            </div>

            <div className="flex items-center gap-1.5 font-mono">
              <button
                type="button"
                className="w-8 h-8 rounded-[2px] bg-[#171F33] border border-[#3E4850]/50 flex items-center justify-center text-[#BEC8D2] hover:text-white transition-colors"
              >
                ‹
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-[2px] bg-[#0EA5E9] text-[#00344D] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(14,165,233,0.4)]"
              >
                1
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-[2px] bg-[#171F33] border border-[#3E4850]/50 flex items-center justify-center text-[#BEC8D2] hover:text-white transition-colors"
              >
                2
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-[2px] bg-[#171F33] border border-[#3E4850]/50 flex items-center justify-center text-[#BEC8D2] hover:text-white transition-colors"
              >
                ›
              </button>
            </div>

            <div className="text-[11px] font-mono">
              SỐ LƯỢNG: <span className="font-semibold text-[#DAE2FD]">Hiển thị 6 / trang</span>
            </div>
          </div>

          {/* SUPERCHARGE 350KW NETWORK BANNER MATCHING FIGMA */}
          <div className="p-5 rounded-[4px] bg-gradient-to-r from-[#171F33] to-[#131B2E] border border-[#3E4850]/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-[2px] bg-[rgba(137,206,255,0.15)] text-[#89CEFF] border border-[#89CEFF]/30 flex-shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#DAE2FD]">Mạng lưới sạc SuperCharge 350kW độc quyền</h4>
                <p className="text-xs text-[#BEC8D2] mt-0.5">
                  Miễn phí 1 năm sạc không giới hạn tại hơn 850 trạm sạc cao tốc trên toàn quốc khi đặt xe trực tuyến.
                </p>
              </div>
            </div>

            <a
              href="#charging-network"
              className="px-4 py-2 rounded-[2px] bg-[#171F33] hover:bg-[#222A3D] border border-[#3E4850]/60 text-xs font-semibold text-[#89CEFF] flex items-center gap-1.5 whitespace-nowrap transition-colors flex-shrink-0"
            >
              <span>Khám phá bản đồ trạm sạc</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#89CEFF]" />
            </a>
          </div>
        </section>
      </div>

      </div>
  );
};
