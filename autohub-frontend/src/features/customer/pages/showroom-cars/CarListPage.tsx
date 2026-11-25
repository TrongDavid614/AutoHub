import React, { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  X,
  Scale,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  Car,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { carService } from '@/features/customer/services/car.service';
import { useCompareStore } from '@/store/useCompareStore';
import { MAX_COMPARE_CARS } from '@/config/constants';
import { cn, matchesSearchTerms } from '@/lib/utils';
import type { MockCar } from '@/features/customer/mocks/car.mock';
import type { CarVariant } from '@/types/car.types';

type SortOption = 'PRICE_ASC' | 'PRICE_DESC' | 'POWER_DESC' | 'RANGE_DESC';
type PriceRangeOption = 'ALL' | 'UNDER_1B' | 'FROM_1B_TO_2B' | 'OVER_2B';

const ITEMS_PER_PAGE = 6;

const PRICE_RANGES: { value: PriceRangeOption; label: string }[] = [
  { value: 'ALL', label: 'Tất cả mức giá' },
  { value: 'UNDER_1B', label: 'Dưới 1 tỷ' },
  { value: 'FROM_1B_TO_2B', label: 'Từ 1 – 2 tỷ' },
  { value: 'OVER_2B', label: 'Trên 2 tỷ' },
];

const POWERTRAIN_OPTIONS = [
  { value: 'ALL', label: 'Tất cả hệ truyền động' },
  { value: 'EV', label: 'Thuần điện (EV)' },
  { value: 'HYBRID', label: 'Hybrid / Plug-in Hybrid' },
  { value: 'ICE', label: 'Động cơ xăng / dầu' },
];

const mapMockCarToVariant = (car: MockCar): CarVariant => ({
  id: Number(car.id) || 1,
  modelId: Number(car.id) || 1,
  variantName: car.name,
  engineSpecs: car.powertrain,
  horsepower: parseInt(car.power, 10) || undefined,
  fuelType: car.powertrain,
  listedPrice: car.listedPrice,
  depositPrice: car.depositAmount,
  images: [
    {
      id: 1,
      imageUrl: car.image,
      viewType: 'THUMBNAIL',
      displayOrder: 1,
    },
  ],
});

const getPowertrainCategory = (powertrain: string): 'EV' | 'HYBRID' | 'ICE' => {
  const normalized = powertrain.toLowerCase();
  if (normalized.includes('hybrid') || normalized.includes('phev')) return 'HYBRID';
  if (normalized.includes('điện') || normalized.includes('ev')) return 'EV';
  return 'ICE';
};

interface CarFilterPanelProps {
  segments: string[];
  selectedSegment: string;
  onSelectSegment: (segment: string) => void;
  selectedPowertrain: string;
  onSelectPowertrain: (powertrain: string) => void;
  selectedPriceRange: PriceRangeOption;
  onSelectPriceRange: (range: PriceRangeOption) => void;
  selectedSeats: string;
  onSelectSeats: (seats: string) => void;
  seatOptions: string[];
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

const CarFilterPanel: React.FC<CarFilterPanelProps> = ({
  segments,
  selectedSegment,
  onSelectSegment,
  selectedPowertrain,
  onSelectPowertrain,
  selectedPriceRange,
  onSelectPriceRange,
  selectedSeats,
  onSelectSeats,
  seatOptions,
  hasActiveFilters,
  onResetFilters,
}) => {
  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-lg p-5 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
        <h2 className="text-sm font-semibold text-[var(--text)]">Bộ lọc xe</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Kiểu dáng / Phân khúc */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-semibold text-[var(--text-secondary)]">Kiểu dáng</h3>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onSelectSegment('ALL')}
            className={cn(
              'w-full text-left px-2.5 py-1.5 rounded-md text-[13px] transition-colors cursor-pointer',
              selectedSegment === 'ALL'
                ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-medium'
                : 'text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text)]'
            )}
          >
            Tất cả kiểu dáng
          </button>
          {segments.map((seg) => (
            <button
              key={seg}
              type="button"
              onClick={() => onSelectSegment(seg)}
              className={cn(
                'w-full text-left px-2.5 py-1.5 rounded-md text-[13px] transition-colors cursor-pointer',
                selectedSegment === seg
                  ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-medium'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text)]'
              )}
            >
              {seg}
            </button>
          ))}
        </div>
      </div>

      {/* Hệ truyền động */}
      <div className="space-y-2.5 pt-4 border-t border-[var(--line)]">
        <h3 className="text-xs font-semibold text-[var(--text-secondary)]">Hệ truyền động</h3>
        <div className="space-y-1.5">
          {POWERTRAIN_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 py-1 text-[13px] text-[var(--text)] cursor-pointer select-none"
            >
              <input
                type="radio"
                name="powertrain"
                checked={selectedPowertrain === opt.value}
                onChange={() => onSelectPowertrain(opt.value)}
                className="w-3.5 h-3.5 accent-[var(--accent)] cursor-pointer"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Khoảng giá */}
      <div className="space-y-2.5 pt-4 border-t border-[var(--line)]">
        <h3 className="text-xs font-semibold text-[var(--text-secondary)]">Khoảng giá niêm yết</h3>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 py-1 text-[13px] text-[var(--text)] cursor-pointer select-none"
            >
              <input
                type="radio"
                name="priceRange"
                checked={selectedPriceRange === opt.value}
                onChange={() => onSelectPriceRange(opt.value)}
                className="w-3.5 h-3.5 accent-[var(--accent)] cursor-pointer"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Số chỗ ngồi */}
      {seatOptions.length > 0 && (
        <div className="space-y-2.5 pt-4 border-t border-[var(--line)]">
          <h3 className="text-xs font-semibold text-[var(--text-secondary)]">Số chỗ ngồi</h3>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => onSelectSeats('ALL')}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs border transition-colors cursor-pointer',
                selectedSeats === 'ALL'
                  ? 'bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--accent)] font-medium'
                  : 'bg-[var(--surface)] border-[var(--line)] text-[var(--text-secondary)] hover:border-[var(--line-strong)]'
              )}
            >
              Tất cả
            </button>
            {seatOptions.map((seat) => (
              <button
                key={seat}
                type="button"
                onClick={() => onSelectSeats(seat)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs border transition-colors cursor-pointer',
                  selectedSeats === seat
                    ? 'bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--accent)] font-medium'
                    : 'bg-[var(--surface)] border-[var(--line)] text-[var(--text-secondary)] hover:border-[var(--line-strong)]'
                )}
              >
                {seat}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const CarListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [cars, setCars] = useState<MockCar[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedSegment, setSelectedSegment] = useState<string>('ALL');
  const [selectedPowertrain, setSelectedPowertrain] = useState<string>('ALL');
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRangeOption>('ALL');
  const [selectedSeats, setSelectedSeats] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('PRICE_ASC');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  const selectedVariants = useCompareStore((s) => s.selectedVariants);
  const addVariantToCompare = useCompareStore((s) => s.addVariantToCompare);
  const removeVariantFromCompare = useCompareStore((s) => s.removeVariantFromCompare);
  const clearCompareList = useCompareStore((s) => s.clearCompareList);

  const fetchCars = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await carService.getAllCars();
      setCars(data || []);
    } catch {
      setError('Không thể tải danh sách xe lúc này. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    const paramSearch = searchParams.get('search') || '';
    if (paramSearch !== searchQuery) {
      setSearchQuery(paramSearch);
    }
    // Only sync when URL query changes externally (e.g., from header search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const segments = useMemo(() => {
    return Array.from(new Set(cars.map((c) => c.segment).filter(Boolean)));
  }, [cars]);

  const seatOptions = useMemo(() => {
    const extracted = cars
      .map((c) => {
        const match = c.seats.match(/\d+\s*chỗ/i);
        return match ? match[0] : c.seats;
      })
      .filter(Boolean);
    return Array.from(new Set(extracted));
  }, [cars]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const next = new URLSearchParams(searchParams);
    if (value.trim()) {
      next.set('search', value.trim());
    } else {
      next.delete('search');
    }
    setSearchParams(next, { replace: true });
  };

  const filteredCars = useMemo(() => {
    const query = searchQuery.trim();

    return cars
      .filter((car) => {
        if (query) {
          const matchesQuery = matchesSearchTerms(
            query,
            car.name,
            car.subtitle,
            car.segment,
            car.powertrain,
            car.seats,
            car.feature1,
            car.feature2,
            car.badge
          );
          if (!matchesQuery) return false;
        }

        if (selectedSegment !== 'ALL' && car.segment !== selectedSegment) {
          return false;
        }

        if (selectedPowertrain !== 'ALL' && getPowertrainCategory(car.powertrain) !== selectedPowertrain) {
          return false;
        }

        if (selectedPriceRange === 'UNDER_1B' && car.listedPrice >= 1_000_000_000) return false;
        if (
          selectedPriceRange === 'FROM_1B_TO_2B' &&
          (car.listedPrice < 1_000_000_000 || car.listedPrice > 2_000_000_000)
        ) {
          return false;
        }
        if (selectedPriceRange === 'OVER_2B' && car.listedPrice <= 2_000_000_000) return false;

        if (
          selectedSeats !== 'ALL' &&
          !car.seats.toLowerCase().includes(selectedSeats.toLowerCase())
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'PRICE_ASC') return a.listedPrice - b.listedPrice;
        if (sortBy === 'PRICE_DESC') return b.listedPrice - a.listedPrice;
        if (sortBy === 'POWER_DESC') {
          return (parseInt(b.power, 10) || 0) - (parseInt(a.power, 10) || 0);
        }
        if (sortBy === 'RANGE_DESC') {
          return (parseInt(b.range, 10) || 0) - (parseInt(a.range, 10) || 0);
        }
        return 0;
      });
  }, [
    cars,
    searchQuery,
    selectedSegment,
    selectedPowertrain,
    selectedPriceRange,
    selectedSeats,
    sortBy,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSegment, selectedPowertrain, selectedPriceRange, selectedSeats, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredCars.length / ITEMS_PER_PAGE));
  const paginatedCars = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCars.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCars, currentPage]);

  const activeFilterCount =
    (selectedSegment !== 'ALL' ? 1 : 0) +
    (selectedPowertrain !== 'ALL' ? 1 : 0) +
    (selectedPriceRange !== 'ALL' ? 1 : 0) +
    (selectedSeats !== 'ALL' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSegment('ALL');
    setSelectedPowertrain('ALL');
    setSelectedPriceRange('ALL');
    setSelectedSeats('ALL');
    if (searchParams.has('search')) {
      const next = new URLSearchParams(searchParams);
      next.delete('search');
      setSearchParams(next, { replace: true });
    }
  };

  const handleToggleCompare = (car: MockCar) => {
    const idNum = Number(car.id) || 1;
    const exists = selectedVariants.some((v) => Number(v.id) === idNum);
    if (exists) {
      removeVariantFromCompare(idNum);
    } else {
      addVariantToCompare(mapMockCarToVariant(car));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-20">
      {/* Page Header */}
      <div className="bg-[var(--surface)] border-b border-[var(--line)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-[28px] font-bold text-[var(--text)] tracking-tight">
                Xe sẵn sàng giao{' '}
                {!isLoading && (
                  <span className="text-lg font-medium text-[var(--text-muted)] tabular-nums">
                    ({filteredCars.length})
                  </span>
                )}
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Giá niêm yết minh bạch, ước tính lăn bánh theo tỉnh thành và hỗ trợ đặt cọc giữ xe trong 72 giờ.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <Link
                to="/car-estimator"
                className="px-3.5 py-2 rounded-lg border border-[var(--line-strong)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--text)] font-medium transition-colors"
              >
                Dự toán lăn bánh
              </Link>
              <Link
                to="/car-comparison"
                className="px-3.5 py-2 rounded-lg border border-[var(--line-strong)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--text)] font-medium transition-colors inline-flex items-center gap-1.5"
              >
                <Scale className="w-3.5 h-3.5 text-[var(--accent)]" />
                So sánh xe ({selectedVariants.length}/{MAX_COMPARE_CARS})
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Desktop Sidebar Filter */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-20">
            <CarFilterPanel
              segments={segments}
              selectedSegment={selectedSegment}
              onSelectSegment={setSelectedSegment}
              selectedPowertrain={selectedPowertrain}
              onSelectPowertrain={setSelectedPowertrain}
              selectedPriceRange={selectedPriceRange}
              onSelectPriceRange={setSelectedPriceRange}
              selectedSeats={selectedSeats}
              onSelectSeats={setSelectedSeats}
              seatOptions={seatOptions}
              hasActiveFilters={activeFilterCount > 0}
              onResetFilters={handleResetFilters}
            />
          </aside>

          {/* Catalog Column */}
          <div className="flex-1 min-w-0 w-full space-y-5">
            {/* Search & Sort Toolbar */}
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-lg p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-1">
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--line-strong)] text-xs font-medium text-[var(--text)] hover:bg-[var(--surface-subtle)] cursor-pointer shrink-0"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Bộ lọc
                  {activeFilterCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[var(--accent)] text-white text-[10px] tabular-nums">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Tìm theo tên xe, kiểu dáng, loại động cơ..."
                    className="w-full pl-9 pr-8 py-2 rounded-lg bg-[var(--surface)] border border-[var(--line-strong)] text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange('')}
                      aria-label="Xóa từ khóa tìm kiếm"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <span className="text-xs text-[var(--text-muted)] tabular-nums">
                  {filteredCars.length} kết quả
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Sắp xếp danh sách xe"
                  className="px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--line-strong)] text-xs font-medium text-[var(--text)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
                >
                  <option value="PRICE_ASC">Giá từ thấp đến cao</option>
                  <option value="PRICE_DESC">Giá từ cao đến thấp</option>
                  <option value="POWER_DESC">Công suất cao nhất</option>
                  <option value="RANGE_DESC">Tầm hoạt động xa nhất</option>
                </select>
              </div>
            </div>

            {/* State 1: Loading */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg bg-[var(--surface)] border border-[var(--line)] overflow-hidden"
                  >
                    <div className="aspect-[16/10] bg-[var(--surface-subtle)]" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 w-20 bg-[var(--surface-subtle)] rounded" />
                      <div className="h-5 w-3/4 bg-[var(--surface-subtle)] rounded" />
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="h-8 bg-[var(--surface-subtle)] rounded" />
                        <div className="h-8 bg-[var(--surface-subtle)] rounded" />
                      </div>
                      <div className="h-6 w-1/2 bg-[var(--surface-subtle)] rounded pt-2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* State 2: Error */}
            {!isLoading && error && (
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-lg p-10 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-[var(--danger)] mx-auto" />
                <p className="text-sm font-semibold text-[var(--text)]">{error}</p>
                <button
                  type="button"
                  onClick={fetchCars}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-sm font-medium text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Thử lại
                </button>
              </div>
            )}

            {/* State 3: Empty */}
            {!isLoading && !error && filteredCars.length === 0 && (
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-lg p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[var(--surface-subtle)] border border-[var(--line)] flex items-center justify-center mx-auto text-[var(--text-muted)]">
                  <Car className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-[var(--text)]">
                  Không tìm thấy mẫu xe phù hợp
                </h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
                  Thử điều chỉnh lại mức giá, kiểu dáng hoặc xóa bớt bộ lọc để xem thêm xe tại showroom.
                </p>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--line-strong)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-sm font-medium text-[var(--text)] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Xóa toàn bộ bộ lọc
                  </button>
                )}
              </div>
            )}

            {/* State 4: Car Grid */}
            {!isLoading && !error && paginatedCars.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {paginatedCars.map((car) => {
                  const isInCompare = selectedVariants.some(
                    (v) => Number(v.id) === (Number(car.id) || 1)
                  );
                  const shortRange = car.range ? car.range.split(' ')[0] + ' km' : '—';
                  const shortPower = car.power ? car.power.split('(')[0].trim() : '—';

                  return (
                    <article
                      key={car.id}
                      className="group bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--line-strong)] rounded-lg overflow-hidden transition-colors flex flex-col"
                    >
                      {/* Clean 16:10 Car Photo */}
                      <Link
                        to={`/cars/${car.id}`}
                        className="relative aspect-[16/10] bg-[var(--surface-subtle)] overflow-hidden block"
                      >
                        <img
                          src={car.image}
                          alt={car.name}
                          loading="lazy"
                          className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
                        />
                        {car.isUpcoming && (
                          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[var(--surface)]/95 border border-[var(--line)] text-[11px] font-medium text-[var(--text)]">
                            Sắp mở bán
                          </span>
                        )}
                      </Link>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-[var(--text-muted)]">{car.segment}</p>
                            <Link to={`/cars/${car.id}`} className="block mt-0.5">
                              <h3 className="text-[17px] font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                                {car.name}
                              </h3>
                            </Link>
                          </div>

                          {/* 4 Plain Specs without nested boxes */}
                          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs pt-2 border-t border-[var(--line)]">
                            <div>
                              <dt className="text-[var(--text-muted)]">Truyền động</dt>
                              <dd className="text-[var(--text)] font-medium mt-0.5 truncate">
                                {car.powertrain}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-[var(--text-muted)]">Công suất</dt>
                              <dd className="text-[var(--text)] font-medium tabular-nums mt-0.5 truncate">
                                {shortPower}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-[var(--text-muted)]">Tầm hoạt động</dt>
                              <dd className="text-[var(--text)] font-medium tabular-nums mt-0.5">
                                {shortRange}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-[var(--text-muted)]">Số chỗ</dt>
                              <dd className="text-[var(--text)] font-medium mt-0.5 truncate">
                                {car.seats}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        {/* Price & Single Primary CTA */}
                        <div className="pt-3 border-t border-[var(--line)] space-y-3">
                          <div>
                            <p className="text-xl font-bold text-[var(--text)] tabular-nums">
                              {car.listedPrice.toLocaleString('vi-VN')} ₫
                            </p>
                            <p className="text-xs text-[var(--text-secondary)] mt-0.5 tabular-nums">
                              {car.depositNote || `Cọc giữ xe 72h: ${car.depositAmount.toLocaleString('vi-VN')} ₫`}
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <Link
                              to={`/cars/${car.id}`}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-sm font-medium text-white transition-colors"
                            >
                              <span>Xem chi tiết</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleToggleCompare(car)}
                              className={cn(
                                'inline-flex items-center gap-1 py-2 px-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                                isInCompare
                                  ? 'text-[var(--accent)] bg-[var(--accent-soft)]'
                                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
                              )}
                            >
                              <Scale className="w-3.5 h-3.5" />
                              <span>{isInCompare ? 'Đã chọn' : 'So sánh'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && !error && totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-[var(--line)] text-xs text-[var(--text-secondary)]">
                <span className="tabular-nums">
                  Trang <strong className="text-[var(--text)]">{currentPage}</strong> / {totalPages}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Trước
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const page = idx + 1;
                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={cn(
                          'w-8 h-8 rounded-lg text-xs font-medium tabular-nums border cursor-pointer transition-colors',
                          currentPage === page
                            ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                            : 'bg-[var(--surface)] border-[var(--line)] text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]'
                        )}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Sau
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative z-10 w-80 max-w-full h-full bg-[var(--bg)] border-r border-[var(--line)] p-4 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--text)]">Lọc danh sách xe</span>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 rounded-md hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <CarFilterPanel
              segments={segments}
              selectedSegment={selectedSegment}
              onSelectSegment={setSelectedSegment}
              selectedPowertrain={selectedPowertrain}
              onSelectPowertrain={setSelectedPowertrain}
              selectedPriceRange={selectedPriceRange}
              onSelectPriceRange={setSelectedPriceRange}
              selectedSeats={selectedSeats}
              onSelectSeats={setSelectedSeats}
              seatOptions={seatOptions}
              hasActiveFilters={activeFilterCount > 0}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>
      )}

      {/* Compare Bar (visible only when user added at least 1 car) */}
      {selectedVariants.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-3xl bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg shadow-lg px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[var(--text)]">
            <Scale className="w-4 h-4 text-[var(--accent)]" />
            <span>
              Đang chọn{' '}
              <strong className="tabular-nums">
                {selectedVariants.length}/{MAX_COMPARE_CARS}
              </strong>{' '}
              xe để so sánh:
            </span>
            <span className="text-[var(--text-secondary)] truncate max-w-[260px] sm:max-w-sm">
              {selectedVariants.map((v) => v.variantName).join(', ')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearCompareList}
              className="px-2.5 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text)] cursor-pointer"
            >
              Xóa hết
            </button>
            <Link
              to="/car-comparison"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-xs font-medium text-white transition-colors"
            >
              So sánh ngay
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
