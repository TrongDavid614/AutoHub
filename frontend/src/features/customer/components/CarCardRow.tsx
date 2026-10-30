import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Scale, Zap, Shield, Sparkles } from 'lucide-react';
import type { MockCar } from '@/features/customer/mocks/car.mock';

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
    <div className="group rounded-2xl bg-[#0B132B]/70 border border-[#3E4850]/30 hover:border-[#89CEFF]/50 backdrop-blur-md overflow-hidden transition-all duration-300 p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      {/* Car Image + Badges */}
      <div className="lg:col-span-5 relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900/50">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider rounded-md bg-[#00A6E0]/20 text-[#89CEFF] border border-[#00A6E0]/30">
            {car.badge}
          </span>
        </div>
        <button
          onClick={(e) => onToggleFavorite(car.id, e)}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-colors ${
            isFavorite ? 'bg-rose-500/20 text-rose-400' : 'bg-black/40 text-slate-400 hover:text-white'
          }`}
          title="Lưu xe yêu thích"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Info & Specs */}
      <div className="lg:col-span-4 space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#89CEFF] uppercase tracking-wider">{car.segment}</span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] font-mono text-slate-400">{car.seats}</span>
          </div>
          <Link to={`/cars/${car.id}`}>
            <h3 className="text-xl font-bold text-white group-hover:text-[#89CEFF] transition-colors mt-0.5">
              {car.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-400 mt-1">{car.subtitle}</p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 px-3.5 rounded-xl bg-slate-900/50 border border-white/5 font-mono">
          <div>
            <p className="text-[10px] text-slate-400">0-100 KM/H</p>
            <p className="text-sm font-bold text-white mt-0.5">{car.acceleration}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400">CÔNG SUẤT</p>
            <p className="text-sm font-bold text-white mt-0.5">{car.power.split(' ')[0]} HP</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400">TẦM HOẠT ĐỘNG</p>
            <p className="text-sm font-bold text-[#89CEFF] mt-0.5">{car.range.split(' ')[0]} km</p>
          </div>
        </div>

        {/* Highlight features */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/80 text-[11px]">
            <Sparkles className="w-3 h-3 text-[#00A6E0]" />
            {car.feature1}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/80 text-[11px]">
            <Shield className="w-3 h-3 text-emerald-400" />
            {car.feature2}
          </span>
        </div>
      </div>

      {/* Pricing & Actions */}
      <div className="lg:col-span-3 lg:border-l lg:border-[#3E4850]/30 lg:pl-6 space-y-4 flex flex-col justify-between h-full">
        <div className="space-y-1">
          <p className="text-[11px] font-mono text-slate-400 uppercase">GIÁ NIÊM YẾT</p>
          <p className="text-2xl font-black text-white font-mono tracking-tight">
            {car.listedPrice.toLocaleString('vi-VN')} <span className="text-sm font-normal text-slate-400">đ</span>
          </p>
          <p className="text-xs text-slate-400">
            Lăn bánh tạm tính: <span className="text-slate-200 font-mono font-medium">{car.estimatedOnRoad.toLocaleString('vi-VN')} đ</span>
          </p>
          <p className="text-[11px] text-[#89CEFF] font-medium pt-1">
            {car.depositNote}
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={() => onDeposit(car)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#00A6E0] to-[#0077b6] hover:brightness-110 text-sm font-bold text-white shadow-lg shadow-[#00A6E0]/20 transition-all"
          >
            <Zap className="w-4 h-4" />
            Đặt cọc giữ suất
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onCompare(car)}
              className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Scale className="w-3.5 h-3.5 text-slate-400" />
              So sánh
            </button>
            <Link
              to={`/cars/${car.id}`}
              className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl border border-slate-700 hover:border-slate-500 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
            >
              Chi tiết
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
