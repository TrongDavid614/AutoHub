import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Zap } from 'lucide-react';
import type { MockCar } from '@/features/customer/mocks/car.mock';

interface CarCardGridProps {
  car: MockCar;
  onCompare: (car: MockCar) => void;
  onDeposit: (car: MockCar) => void;
}

export const CarCardGrid: React.FC<CarCardGridProps> = ({
  car,
  onCompare,
  onDeposit,
}) => {
  return (
    <div className="group rounded-lg bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--line-strong)] overflow-hidden transition-colors flex flex-col">
      <Link to={`/cars/${car.id}`} className="relative aspect-[16/10] overflow-hidden bg-[var(--surface-subtle)] block">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
          loading="lazy"
        />
        {car.badge && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[11px] font-medium rounded bg-[var(--surface)]/95 text-[var(--text)] border border-[var(--line)]">
            {car.badge}
          </span>
        )}
      </Link>

      <div className="p-4 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-xs text-[var(--text-muted)]">{car.segment}</p>
          <Link to={`/cars/${car.id}`} className="block">
            <h3 className="text-base font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors line-clamp-1">
              {car.name}
            </h3>
          </Link>
          <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
            {[car.range, car.power, car.seats].filter(Boolean).join(' · ')}
          </p>
        </div>

        <div className="pt-3 border-t border-[var(--line)] space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-lg font-bold text-[var(--text)] tabular-nums">
              {car.listedPrice.toLocaleString('vi-VN')} ₫
            </p>
            <p className="text-xs text-[var(--text-muted)] tabular-nums">
              Lăn bánh ~{(car.estimatedOnRoad / 1e9).toFixed(2)} tỷ
            </p>
          </div>
          {car.depositNote && (
            <p className="text-xs text-[var(--text-secondary)] tabular-nums">{car.depositNote}</p>
          )}

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => onDeposit(car)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-xs font-medium text-white transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              Đặt cọc ngay
            </button>
            <button
              type="button"
              onClick={() => onCompare(car)}
              className="inline-flex items-center gap-1 py-2 px-2.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              So sánh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
