import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Check, Plus, RefreshCw, Car as CarIcon, AlertCircle } from 'lucide-react';
import { carService } from '../services/car.service';
import type { MockCar } from '@/types/car.types';
import { formatCurrencyVND, matchesSearchTerms } from '@/lib/utils';

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
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoading(true);
    setError(null);
    carService
      .getAllCars()
      .then((data) => {
        if (isMounted) {
          setCars(data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCars([]);
          setError('Chưa kết nối được Backend để tải danh mục xe.');
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchSearch = matchesSearchTerms(
        search,
        car.name,
        car.subtitle,
        car.segment,
        car.powertrain,
        car.seats
      );

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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45"
    >
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[var(--line)] flex items-center justify-between bg-[var(--surface)]">
          <div>
            <span className="text-xs font-semibold text-[var(--accent)] block">
              Danh mục xe Showroom
            </span>
            <h3 className="text-lg font-bold text-[var(--text)] tracking-tight mt-0.5">
              {replacingCarName ? `Thay đổi phiên bản xe (${replacingCarName})` : 'Chọn xe thêm vào so sánh'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-subtle)] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-[var(--line)] space-y-3 bg-[var(--surface-subtle)]">
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo tên xe, hãng xe, phân khúc (VF8, SantaFe, GT-e, Hybrid...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
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
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--surface)] border border-[var(--line)] text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface-subtle)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cars List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-[var(--line)]">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-[var(--text-muted)]">
              <RefreshCw className="w-6 h-6 animate-spin text-[var(--accent)]" />
              <span className="text-sm">Đang tải danh mục xe từ hệ thống...</span>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-700 space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto text-red-600" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="py-16 text-center text-[var(--text-muted)] space-y-2">
              <CarIcon className="w-10 h-10 mx-auto text-[var(--text-muted)]" />
              <p className="text-sm font-medium">Không tìm thấy mẫu xe nào phù hợp với từ khóa.</p>
            </div>
          ) : (
            filteredCars.map((car) => {
              const carId = Number(car.id);
              const isAlreadySelected = currentSelectedIds.includes(carId);

              return (
                <div
                  key={car.id}
                  className="py-3 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 rounded-lg hover:bg-[var(--surface-subtle)]/70 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-[var(--surface-subtle)] border border-[var(--line)] shrink-0">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] font-medium">
                          {car.segment}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">{car.powertrain}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-[var(--text)]">{car.name}</h4>
                      <p className="text-xs font-bold tabular-nums text-[var(--accent)]">
                        {formatCurrencyVND(car.listedPrice)}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center justify-end">
                    {isAlreadySelected ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
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
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold transition-colors cursor-pointer"
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
    </div>,
    document.body
  );
};
