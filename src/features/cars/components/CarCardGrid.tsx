import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Scale, Zap } from 'lucide-react';
import type { MockCar } from '../mocks/car.mock';

interface CarCardGridProps {
  car: MockCar;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onCompare: (car: MockCar) => void;
  onDeposit: (car: MockCar) => void;
}

export const CarCardGrid: React.FC<CarCardGridProps> = ({
  car,
  isFavorite,
  onToggleFavorite,
  onCompare,
  onDeposit,
}) => {
  return (
    <div className="group relative rounded-2xl bg-[#0B132B]/80 border border-[#3E4850]/30 hover:border-[#89CEFF]/50 backdrop-blur-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#00A6E0]/10 flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900/50">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider rounded-md bg-[#00A6E0]/20 text-[#89CEFF] border border-[#00A6E0]/30">
            {car.badge}
          </span>
          <button
            onClick={(e) => onToggleFavorite(car.id, e)}
            className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
              isFavorite ? 'bg-rose-500/20 text-rose-400' : 'bg-black/40 text-slate-400 hover:text-white'
            }`}
            title="Lưu yêu thích"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Quick Specs */}
        {car.gridSpecs && (
          <div className="absolute bottom-2 left-3 right-3 grid grid-cols-3 gap-1 px-2 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-center font-mono">
            <div>
              <p className="text-[9px] text-slate-400">{car.gridSpecs.s1Label}</p>
              <p className="text-xs font-bold text-white">{car.gridSpecs.s1Val}</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400">{car.gridSpecs.s2Label}</p>
              <p className="text-xs font-bold text-[#89CEFF]">{car.gridSpecs.s2Val}</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400">{car.gridSpecs.s3Label}</p>
              <p className="text-xs font-bold text-emerald-400">{car.gridSpecs.s3Val}</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1">
          <p className="text-[11px] font-mono text-[#89CEFF] uppercase tracking-wider">{car.segment}</p>
          <Link to={`/cars/${car.id}`} className="block">
            <h3 className="text-lg font-bold text-white group-hover:text-[#89CEFF] transition-colors">
              {car.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-400 line-clamp-1">{car.subtitle}</p>
        </div>

        <div className="pt-3 border-t border-[#3E4850]/30 flex items-baseline justify-between">
          <div>
            <p className="text-[10px] font-mono text-slate-400">GIÁ NIÊM YẾT</p>
            <p className="text-lg font-bold text-white font-mono">
              {car.listedPrice.toLocaleString('vi-VN')} <span className="text-xs text-slate-400 font-normal">đ</span>
            </p>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Lăn bánh ~ {Math.round(car.estimatedOnRoad / 1e9 * 100) / 100} tỷ
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onCompare(car)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Scale className="w-3.5 h-3.5 text-slate-400" />
            So sánh
          </button>
          <button
            onClick={() => onDeposit(car)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#00A6E0] to-[#0077b6] hover:brightness-110 text-xs font-bold text-white shadow-lg shadow-[#00A6E0]/20 transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            Đặt cọc ngay
          </button>
        </div>
      </div>
    </div>
  );
};
