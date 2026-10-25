import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Filter, 
  RotateCcw, 
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
import { MOCK_CARS, type MockCar } from '@/mock/mockData';
import { useCompareStore } from '@/store/useCompareStore';
import { DepositModal } from '@/features/car-deposit/DepositModal';

export const CarListPage: React.FC = () => {
  const navigate = useNavigate();
  const { addVariantToCompare } = useCompareStore();

  // View Mode: 'grid' (Bộ Sưu tập dòng xe) vs 'row' (Bộ Sưu tập dòng xe dạng row)
  const [viewMode, setViewMode] = useState<'grid' | 'row'>('row');

  // Filters state matching Figma
  const [selectedSegment, setSelectedSegment] = useState<string>('Sedan thể thao');
  const [priceRange, setPriceRange] = useState<string>('2 - 3 tỷ');
  const [selectedPowertrains, setSelectedPowertrains] = useState<string[]>(['Thuần điện EV 800V SiC']);
  const [selectedSeats, setSelectedSeats] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recommended');

  // Modal State
  const [depositCar, setDepositCar] = useState<MockCar | null>(null);
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
    { name: 'Xanh Riviera', hex: '#0284C7' },
    { name: 'Trắng Ceramic', hex: '#F8FAFC' },
    { name: 'Xám Liquid', hex: '#94A3B8' },
    { name: 'Đen Obsidian', hex: '#0F172A' },
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-100">
      {/* Breadcrumb matching Figma */}
      <nav className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        <Link to="/" className="hover:text-cyan-400">TRANG CHỦ</Link>
        <span>/</span>
        <span className="text-slate-400">DÒNG XE</span>
        <span>/</span>
        <span className="text-cyan-400 font-bold">
          {viewMode === 'row' ? 'BỘ SƯU TẬP DÒNG XE DẠNG ROW' : 'BỘ SƯU TẬP DÒNG XE (GRID VIEW)'}
        </span>
      </nav>

      {/* Title & Tagline matching Figma */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          {viewMode === 'row' ? (
            <>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Bộ Sưu Tập Xe Điện Hiệu Năng Cao <span className="text-cyan-400">AutoHub GT-e</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                Nền tảng kiến trúc điện SiC 800V thế hệ mới • Phân phối & bảo hành chính hãng toàn quốc.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Bộ Sưu Tập Dòng Xe Điện & Thể Thao <span className="text-cyan-400">Cao Cấp AutoHub</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                Khám phá danh mục xe thuần điện đỉnh cao 800V và hybrid hiệu năng vượt trội với công nghệ tự hành LiDAR.
              </p>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] font-bold text-cyan-400">
            <span>NỀN TẢNG KIẾN TRÚC 800V SiC ULTRA</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          {viewMode === 'grid' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] font-bold text-slate-300">
              <span className="text-slate-500 text-[10px]">CÔNG NGHỆ CỐT LÕI:</span>
              <span className="text-cyan-300">LiDAR + HubOS</span>
            </div>
          )}
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT SIDEBAR: BỘ LỌC TÌM KIẾM (Col 3) */}
        <aside className="lg:col-span-3 bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5 sticky top-20 text-xs">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 font-black uppercase tracking-wider text-white">
              <Filter className="w-4 h-4 text-cyan-400" />
              <span>BỘ LỌC TÌM KIẾM</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Xóa bộ lọc (3)</span>
            </button>
          </div>

          {/* Section 1: Phân khúc xe (Segment) */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              PHÂN KHÚC XE (SEGMENT)
            </label>
            <div className="space-y-1.5">
              {filterSegments.map((seg) => {
                const isSelected = selectedSegment === seg.label;
                return (
                  <label
                    key={seg.label}
                    onClick={() => setSelectedSegment(isSelected ? 'all' : seg.label)}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 cursor-pointer border border-transparent hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="rounded text-cyan-500 focus:ring-cyan-400"
                      />
                      <span className={`text-xs ${isSelected ? 'text-white font-bold' : 'text-slate-300'}`}>
                        {seg.label}
                      </span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">
                      {seg.count}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 2: Khoảng giá dự toán VNĐ */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
              <span className="text-slate-400">KHOẢNG GIÁ DỰ TOÁN</span>
              <span className="text-cyan-400">VNĐ</span>
            </div>
            <div className="text-base font-black text-cyan-400 font-mono">
              1.5 tỷ – 3.5 tỷ VNĐ
            </div>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {['< 2 tỷ', '2 - 3 tỷ', '> 3 tỷ'].map((pr) => (
                <button
                  key={pr}
                  type="button"
                  onClick={() => setPriceRange(pr)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all text-center border ${
                    priceRange === pr
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {pr}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Hệ truyền động & Pin */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              HỆ TRUYỀN ĐỘNG & PIN
            </label>
            <div className="space-y-1.5">
              {powertrains.map((pt) => {
                const checked = selectedPowertrains.includes(pt);
                return (
                  <label
                    key={pt}
                    onClick={() => togglePowertrain(pt)}
                    className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 cursor-pointer border border-transparent hover:border-slate-700 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      readOnly
                      className="rounded text-cyan-500 focus:ring-cyan-400"
                    />
                    <span className={`text-xs ${checked ? 'text-white font-bold' : 'text-slate-300'}`}>
                      {pt}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 4: Số chỗ ngồi (Seats) */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              SỐ CHỖ NGỒI (SEATS)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedSeats('4')}
                className={`py-2 px-3 rounded-xl text-center text-xs font-bold transition-all border ${
                  selectedSeats === '4'
                    ? 'bg-slate-950 text-cyan-300 border-cyan-500 shadow-inner'
                    : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                4 chỗ VIP
              </button>
              <button
                type="button"
                onClick={() => setSelectedSeats('5')}
                className={`py-2 px-3 rounded-xl text-center text-xs font-bold transition-all border ${
                  selectedSeats === '5'
                    ? 'bg-slate-950 text-cyan-300 border-cyan-500 shadow-inner'
                    : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                5 chỗ tiêu chuẩn
              </button>
            </div>
          </div>

          {/* Section 5: Màu ngoại thất đề xuất */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              MÀU NGOẠI THẤT ĐỀ XUẤT
            </label>
            <div className="flex items-center gap-3">
              {colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  title={c.name}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setSelectedColor(c.name)}
                  className={`w-6 h-6 rounded-full border transition-all ${
                    selectedColor === c.name
                      ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900 scale-110'
                      : 'border-slate-600 hover:scale-105'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Apply Filter Button */}
          <button
            type="button"
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>ÁP DỤNG BỘ LỌC ({filteredCars.length} XE)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </aside>

        {/* RIGHT CONTENT: DANH SÁCH THẺ XE NẰM NGANG (Col 9) */}
        <section className="lg:col-span-9 space-y-4">
          {/* Top Filter Chips Bar matching Figma */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-300">
                Hiển thị <strong className="text-cyan-400">{filteredCars.length}</strong> mẫu xe sẵn sàng giao
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700 flex items-center gap-1">
                Sedan thể thao <span className="cursor-pointer hover:text-cyan-400">✕</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700 flex items-center gap-1">
                Thuần điện EV 800V <span className="cursor-pointer hover:text-cyan-400">✕</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700 flex items-center gap-1">
                1.5 - 3.5 tỷ <span className="cursor-pointer hover:text-cyan-400">✕</span>
              </span>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[11px]">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs font-semibold focus:outline-none"
                >
                  <option value="recommended">Mới nhất & Khuyên dùng</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                </select>
              </div>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 p-1 rounded-xl shadow-inner">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-[#0094FF] text-white shadow-md shadow-[#0094FF]/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Chuyển sang chế độ lưới (Grid View)"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('row')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'row'
                      ? 'bg-[#0094FF] text-white shadow-md shadow-[#0094FF]/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Chuyển sang chế độ hàng ngang (Row View)"
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
                    className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl transition-all group"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-5 items-stretch">
                      {/* Col 4: Image & Badges */}
                      <div className="md:col-span-4 relative rounded-xl overflow-hidden bg-slate-950 flex flex-col justify-between min-h-[190px]">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider backdrop-blur-md bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                          ● {car.badge}
                        </span>
                        {/* Carousel Indicator Dots */}
                        <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400/60" />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400/60" />
                        </div>
                      </div>

                      {/* Col 5: Car Name & 2x2 Specs Grid */}
                      <div className="md:col-span-5 flex flex-col justify-between space-y-3">
                        <div>
                          <h2 className="text-lg font-black text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                            {car.name}
                          </h2>
                          <p className="text-xs text-slate-400 mt-0.5">{car.subtitle}</p>
                        </div>

                        {/* 2x2 Specs Grid */}
                        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl text-xs">
                          <div>
                            <div className="text-[10px] uppercase font-bold text-slate-400">TĂNG TỐC 0-100 KM/H</div>
                            <div className="text-sm font-black text-cyan-400 mt-0.5 font-mono">{car.acceleration}</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase font-bold text-slate-400">CÔNG SUẤT CỰC ĐẠI</div>
                            <div className="text-xs font-black text-white mt-0.5">{car.power}</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase font-bold text-slate-400">TẦM HOẠT ĐỘNG (WLTP)</div>
                            <div className="text-xs font-bold text-slate-200 mt-0.5">{car.range}</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase font-bold text-slate-400">SẠC NHANH 800V</div>
                            <div className="text-xs font-bold text-slate-200 mt-0.5">{car.charging}</div>
                          </div>
                        </div>

                        {/* 2 Feature Badges */}
                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{car.feature1}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{car.feature2}</span>
                          </span>
                        </div>
                      </div>

                      {/* Col 3: Pricing & Action Buttons */}
                      <div className="md:col-span-3 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800/80 pt-3 md:pt-0 md:pl-5 space-y-3">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            GIÁ NIÊM YẾT CHÍNH THỨC
                          </div>
                          <div className="text-xl font-black text-white font-mono tracking-tight mt-0.5">
                            {car.listedPrice.toLocaleString('vi-VN')} <span className="text-xs font-bold text-slate-300">VND</span>
                          </div>
                        </div>

                        {/* 72H Deposit Callout Box */}
                        <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-cyan-400">
                            <Lock className="w-3 h-3 flex-shrink-0" />
                            <span>Cọc giữ xe 72h: {car.depositAmount.toLocaleString('vi-VN')} VNĐ</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight">
                            {car.depositNote}
                          </p>
                        </div>

                        {/* Link to Cost Estimator */}
                        <Link
                          to="/car-estimator"
                          className="text-xs text-cyan-400 hover:underline flex items-center justify-between font-semibold"
                        >
                          <span>Dự toán lăn bánh từ {car.estimatedOnRoad.toLocaleString('vi-VN')} VND</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>

                        {/* Action Buttons */}
                        <div className="space-y-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setDepositCar(car)}
                            className="w-full py-2.5 px-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>Xem chi tiết & Cọc ngay</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCompare(car)}
                            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
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
                    className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden shadow-xl transition-all group flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Image & Overlay Badges */}
                      <div className="relative h-48 bg-slate-950 overflow-hidden">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Badge left */}
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider backdrop-blur-md bg-slate-950/80 text-cyan-300 border border-cyan-500/30">
                          ● {car.badge}
                        </span>

                        {/* Heart Favorite Button right */}
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(car.id, e)}
                          className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-rose-500 transition-colors"
                          title="Lưu mẫu xe yêu thích"
                        >
                          <Heart
                            className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-300'}`}
                          />
                        </button>

                        {/* Carousel Dots */}
                        <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400/60" />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400/60" />
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="text-base font-black text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                            {car.name}
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{car.subtitle}</p>
                        </div>

                        {/* 3 Metric Boxes */}
                        <div className="grid grid-cols-3 gap-2 py-1 text-center">
                          <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                            <div className="text-[9px] uppercase font-bold text-slate-400">0-100 KM/H</div>
                            <div className="text-sm font-black text-cyan-400 font-mono mt-0.5">
                              {car.gridSpecs?.s1Val || car.acceleration}
                            </div>
                          </div>

                          <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                            <div className="text-[9px] uppercase font-bold text-slate-400">
                              {car.gridSpecs?.s2Label.replace(' (WLTP)', '') || 'TẦM CHẠY'}
                            </div>
                            <div className="text-xs font-black text-white font-mono mt-0.5">
                              {car.gridSpecs?.s2Val || car.range}
                            </div>
                          </div>

                          <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                            <div className="text-[9px] uppercase font-bold text-slate-400 truncate">
                              {car.gridSpecs?.s3Label || 'SẠC NHANH'}
                            </div>
                            <div className="text-xs font-bold text-slate-200 mt-0.5 truncate">
                              {car.gridSpecs?.s3Val || '15 phút'}
                            </div>
                          </div>
                        </div>

                        {/* Price Details */}
                        <div className="pt-2 border-t border-slate-800/80">
                          <div className="flex items-baseline justify-between">
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                              {car.isUpcoming ? 'GIÁ DỰ KIẾN' : 'GIÁ NIÊM YẾT'}
                            </span>
                            <div className="text-base font-black text-white font-mono">
                              <span className="text-xs font-normal text-slate-400 mr-1">Từ</span>
                              {car.listedPrice.toLocaleString('vi-VN')} <span className="text-xs text-slate-300">đ</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-slate-400">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
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
                        className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Scale className="w-3.5 h-3.5 text-cyan-400" />
                        <span>So sánh xe</span>
                      </button>

                      {car.isUpcoming ? (
                        <Link
                          to="/test-drive/booking"
                          className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1 transition-colors text-center"
                        >
                          <span>Đăng ký lái thử</span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDepositCar(car)}
                          className="py-2 px-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-1 text-center"
                        >
                          <span>Xem chi tiết & Cọc</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PAGINATION BAR MATCHING FIGMA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-xs text-slate-400">
            <div>
              Hiển thị <strong className="text-white">1 - 6</strong> trên tổng số{' '}
              <strong className="text-white">{filteredCars.length}</strong> mẫu xe
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                ‹
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-[#0094FF] text-white font-bold flex items-center justify-center shadow-md shadow-[#0094FF]/30"
              >
                1
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                2
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                ›
              </button>
            </div>

            <div className="text-[11px] text-slate-400">
              SỐ LƯỢNG: <span className="font-semibold text-slate-200">Hiển thị 6 / trang</span>
            </div>
          </div>

          {/* SUPERCHARGE 350KW NETWORK BANNER MATCHING FIGMA */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex-shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Mạng lưới sạc SuperCharge 350kW độc quyền</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Miễn phí 1 năm sạc không giới hạn tại hơn 850 trạm sạc cao tốc trên toàn quốc khi đặt xe trực tuyến.
                </p>
              </div>
            </div>

            <a
              href="#charging-network"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 whitespace-nowrap transition-colors flex-shrink-0"
            >
              <span>Khám phá bản đồ trạm sạc</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </a>
          </div>
        </section>
      </div>

      {/* Deposit Modal matching Figma */}
      <DepositModal
        isOpen={!!depositCar}
        onClose={() => setDepositCar(null)}
        carVariant={depositCar?.name.replace('AutoHub GT-e ', '')}
        exteriorColor="Xanh Phantom"
      />
    </div>
  );
};
