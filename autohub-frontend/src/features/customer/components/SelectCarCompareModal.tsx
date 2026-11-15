import React, { useState, useEffect, useMemo } from 'react';
import { X, Search, Check, Plus, RefreshCw, Car as CarIcon } from 'lucide-react';
import { carService } from '../services/car.service';
import type { MockCar } from '../mocks/car.mock';
import { formatCurrencyVND } from '@/lib/utils';

export interface SelectCarCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCar: (carId: number) => void;
  currentSelectedIds: number[];
  slotIndex?: number;
  replacingCarName?: string;
}

export const SelectCarCompareModal: React.FC<SelectCarCompareModalProps> = ({
  isOpen,
  onClose,
  onSelectCar,
  currentSelectedIds,
  replacingCarName,
}) => {
  const [cars, setCars] = useState<MockCar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoading(true);
    carService.getAllCars().then((data) => {
      if (isMounted) {
        setCars(data || []);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        car.name.toLowerCase().includes(q) ||
        car.subtitle.toLowerCase().includes(q) ||
        car.segment.toLowerCase().includes(q) ||
        car.powertrain.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (selectedCategory === 'sedan') {
        return car.segment.toLowerCase().includes('sedan');
      }
      if (selectedCategory === 'suv') {
        return car.segment.toLowerCase().includes('suv');
      }
      if (selectedCategory === 'electric') {
        return car.powertrain.toLowerCase().includes('điện') || car.powertrain.toLowerCase().includes('ev');
      }
      if (selectedCategory === 'hybrid') {
        return car.powertrain.toLowerCase().includes('hybrid') || car.powertrain.toLowerCase().includes('hev');
      }

      return true;
    });
  }, [cars, search, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#131B2E] border border-[#3E4850] rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#3E4850]/60 flex items-center justify-between bg-[#0F172A]/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent-primary">
                DANH MỤC XE SHOWROOM
              </span>
            </div>
            <h3 className="text-lg font-bold text-text-primary tracking-tight mt-0.5">
              {replacingCarName ? `Thay đổi phiên bản xe (${replacingCarName})` : 'Chọn xe thêm vào so sánh'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-[#1E293B] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-[#3E4850]/40 space-y-3 bg-[#11192C]">
          <div className="relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo tên xe, hãng xe, phân khúc (VF8, SantaFe, GT-e, Hybrid...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0A0F1D] border border-[#3E4850] text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors font-sans"
              autoFocus
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'sedan', label: 'Sedan' },
              { id: 'suv', label: 'SUV' },
              { id: 'electric', label: 'Thuần điện' },
              { id: 'hybrid', label: 'Hybrid' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-accent-action text-accent-contrast shadow-[0_0_12px_rgba(14,165,233,0.35)]'
                    : 'bg-[#1E293B] text-text-secondary hover:text-text-primary hover:bg-[#28354D]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cars List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-[#3E4850]/30">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-text-muted">
              <RefreshCw className="w-6 h-6 animate-spin text-accent-primary" />
              <span className="text-sm font-mono">Đang tải danh mục xe từ hệ thống...</span>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="py-16 text-center text-text-muted space-y-2">
              <CarIcon className="w-10 h-10 mx-auto text-text-muted/60" />
              <p className="text-sm font-medium">Không tìm thấy mẫu xe nào phù hợp với từ khóa.</p>
            </div>
          ) : (
            filteredCars.map((car) => {
              const carId = Number(car.id);
              const isAlreadySelected = currentSelectedIds.includes(carId);

              return (
                <div
                  key={car.id}
                  className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-lg hover:bg-[#17223A]/80 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-20 h-14 rounded-md overflow-hidden bg-black/40 border border-[#3E4850] shrink-0">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-primary/10 border border-accent-primary/20 text-accent-primary font-bold">
                          {car.segment}
                        </span>
                        <span className="text-xs text-text-muted font-mono">{car.powertrain}</span>
                      </div>
                      <h4 className="text-sm font-bold text-text-primary">{car.name}</h4>
                      <p className="text-xs font-mono font-bold text-accent-primary">
                        {formatCurrencyVND(car.listedPrice)}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center justify-end">
                    {isAlreadySelected ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                        <Check className="w-3.5 h-3.5" />
                        <span>Đang so sánh</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectCar(carId);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-accent-action hover:bg-accent-primary text-accent-contrast text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(14,165,233,0.3)] cursor-pointer"
                      >
                        {replacingCarName ? <RefreshCw className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        <span>{replacingCarName ? 'Đổi sang xe này' : 'Chọn so sánh'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
