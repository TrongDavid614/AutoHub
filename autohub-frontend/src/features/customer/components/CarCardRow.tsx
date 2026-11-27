import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Scale, Zap } from 'lucide-react';
import type { MockCar } from '@/types/car.types';

interface CarCardRowProps {
  car: MockCar;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onCompare: (car: MockCar) => void;
  onDeposit: (car: MockCar) => void;
}

export const CarCardRow: React.FC<CarCardRowProps> = ({
  car,
  isFavorite,
  onToggleFavorite,
  onCompare,
  onDeposit,
}) => {
  return (
    <div className="group rounded-lg bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--line-strong)] overflow-hidden transition-colors p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      {/* Car Image + Badge */}
      <div className="lg:col-span-5 relative aspect-[16/10] rounded-lg overflow-hidden bg-[var(--surface-subtle)]">
        <Link to={`/cars/${car.id}`} className="block w-full h-full">
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
            loading="lazy"
          />
        </Link>
        {car.badge && (
          <div className="absolute top-2.5 left-2.5">
            <span className="px-2.5 py-0.5 text-[11px] font-medium rounded bg-[var(--surface)]/95 text-[var(--text)] border border-[var(--line)]">
              {car.badge}
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={(e) => onToggleFavorite(car.id, e)}
          className={`absolute top-2.5 right-2.5 p-2 rounded-lg border transition-colors cursor-pointer ${
            isFavorite
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'bg-[var(--surface)]/90 border-[var(--line)] text-[var(--text-secondary)] hover:text-[var(--text)]'
          }`}
          title="Lưu xe yêu thích"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Info & Specs */}
      <div className="lg:col-span-4 space-y-3">
        <div>
          <p className="text-xs text-[var(--text-muted)]">
            {car.segment} · {car.seats}
          </p>
          <Link to={`/cars/${car.id}`}>
            <h3 className="text-lg font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors mt-0.5">
              {car.name}
            </h3>
          </Link>
          <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-1">{car.subtitle}</p>
        </div>

        {/* Clean Key Specs (no card-in-card) */}
        <dl className="grid grid-cols-3 gap-3 py-2.5 border-y border-[var(--line)] text-xs">
          <div>
            <dt className="text-[var(--text-muted)]">0–100 km/h</dt>
            <dd className="font-semibold text-[var(--text)] tabular-nums mt-0.5">{car.acceleration}</dd>
          </div>
          <div>
            <dt className="text-[var(--text-muted)]">Công suất</dt>
            <dd className="font-semibold text-[var(--text)] tabular-nums mt-0.5">{car.power.split(' ')[0]} HP</dd>
          </div>
          <div>
            <dt className="text-[var(--text-muted)]">Tầm chạy</dt>
            <dd className="font-semibold text-[var(--text)] tabular-nums mt-0.5">{car.range.split(' ')[0]} km</dd>
          </div>
        </dl>

        <p className="text-xs text-[var(--text-secondary)]">
          {car.feature1} · {car.feature2}
        </p>
      </div>

      {/* Pricing & Actions */}
      <div className="lg:col-span-3 lg:border-l lg:border-[var(--line)] lg:pl-6 space-y-4 flex flex-col justify-between h-full">
        <div className="space-y-1">
          <p className="text-xs text-[var(--text-muted)]">Giá niêm yết</p>
          <p className="text-2xl font-bold text-[var(--text)] tabular-nums tracking-tight">
            {car.listedPrice.toLocaleString('vi-VN')} ₫
          </p>
          <p className="text-xs text-[var(--text-secondary)] tabular-nums">
            Lăn bánh dự kiến {car.estimatedOnRoad.toLocaleString('vi-VN')} ₫
          </p>
          {car.depositNote && (
            <p className="text-xs text-[var(--text-muted)] pt-0.5 tabular-nums">
              {car.depositNote}
            </p>
          )}
        </div>

        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => onDeposit(car)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-sm font-medium text-white transition-colors cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            Đặt cọc giữ suất
          </button>
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => onCompare(car)}
              className="inline-flex items-center gap-1 py-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              So sánh
            </button>
            <Link
              to={`/cars/${car.id}`}
              className="inline-flex items-center gap-1 py-1 text-xs font-medium text-[var(--accent)] hover:underline"
            >
              Xem chi tiết
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
