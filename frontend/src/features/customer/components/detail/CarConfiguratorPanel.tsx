import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  ShieldCheck,
  Check,
  Star,
  Sparkles,
  Calculator,
  Compass,
  Truck,
  Zap,
  Disc,
  Layers,
  Calendar,
} from 'lucide-react';
import type { TrimType } from '../../hooks/useCarDetail';
import { EXTERIOR_COLORS } from '../../types/detail.types';

interface CarConfiguratorPanelProps {
  activeTrim: TrimType;
  onSelectTrim: (trim: TrimType) => void;
  activeColor: string;
  onSelectColor: (colorId: string) => void;
  onOpenDeposit?: () => void;
}

export const CarConfiguratorPanel: React.FC<CarConfiguratorPanelProps> = ({
  activeTrim,
  onSelectTrim,
  activeColor,
  onSelectColor,
  onOpenDeposit,
}) => {
  const navigate = useNavigate();

  const trims = [
    {
      id: 'standard' as TrimType,
      name: 'Standard GT',
      badge: 'TIÊU CHUẨN',
      power: '520 HP',
      range: 'Phạm vi 580 km • RWD Dual Mode',
      price: '2.490.000.000 đ',
      priceNum: 2490000000,
    },
    {
      id: 'performance' as TrimType,
      name: 'GT-e Performance',
      badge: 'KHUYÊN DÙNG',
      power: '680 HP',
      range: 'Phạm vi 680 km • Dual Motor AWD',
      price: '2.890.000.000 đ',
      priceNum: 2890000000,
      isRecommended: true,
    },
    {
      id: 'track' as TrimType,
      name: 'Track Edition RS',
      badge: 'HYPER TRACK',
      power: '820 HP',
      range: 'Phạm vi 620 km • Tri-Motor Torque Vectoring',
      price: '3.490.000.000 đ',
      priceNum: 3490000000,
    },
  ];

  const selectedTrimObj = trims.find((t) => t.id === activeTrim) || trims[1];
  const selectedColorObj = EXTERIOR_COLORS.find((c) => c.id === activeColor) || EXTERIOR_COLORS[0];

  return (
    <div className="flex flex-col gap-5">
      {/* 1. Vehicle Hero Header & Pricing Module */}
      <div className="p-5 rounded-lg bg-surface-elevated/80 border border-surface-highlight shadow-xl space-y-4">
        {/* Top Badges: Category & Rating */}
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-accent-action/15 border border-accent-primary/30 text-accent-primary font-mono text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-accent-primary" />
            <span>FLAGSHIP ELECTRIC LUXURY</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-accent-primary font-mono font-semibold">
            <Star className="w-3.5 h-3.5 fill-accent-primary text-accent-primary" />
            <span>5.0</span>
            <span className="text-text-muted">(98 đánh giá)</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">
            AutoHub GT-e Grand Touring
          </h1>
          <p className="text-sm text-text-muted leading-relaxed mt-0.5">
            Sự giao thoa hoàn mỹ giữa sức mạnh siêu xe và đẳng cấp công nghệ di chuyển bền vững kiến trúc 800V SiC.
          </p>
        </div>

        {/* Official Pricing */}
        <div className="p-4 rounded-lg bg-canvas-deep/80 border border-surface-highlight space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-text-muted uppercase">
            <span>GIÁ NIÊM YẾT CHÍNH THỨC</span>
            <span className="text-emerald-400 font-bold">ĐÃ BAO GỒM VAT & PIN</span>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black font-mono text-accent-primary">
                {selectedTrimObj.priceNum.toLocaleString('vi-VN')}
              </span>
              <span className="text-xs font-mono font-bold text-text-muted">VNĐ</span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/car-estimator')}
              className="inline-flex items-center gap-1 text-xs text-accent-primary hover:underline font-semibold cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Dự toán chi phí lăn bánh</span>
            </button>
          </div>
        </div>

        {/* Prominent Reservation Deposit Banner (BR05) */}
        <div className="p-3.5 rounded-lg bg-accent-action/10 border border-accent-primary/30 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-accent-primary">
              <ShieldCheck className="w-4 h-4 text-accent-primary" />
              <span>Mức tiền cọc cố định: 20.000.000 VNĐ</span>
            </div>
            <span className="px-2 py-0.5 rounded-[2px] bg-accent-action text-[10px] font-mono text-accent-contrast font-bold">
              QUY CHẾ BR05
            </span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Cam kết hoàn cọc 100% trong vòng 72h nếu khách hàng thay đổi quyết định mà không phải chịu bất kỳ chi phí nào. Suất xe được tự động khóa số VIN.
          </p>
        </div>
      </div>

      {/* 2. Configuration Step 1: Trim Selection */}
      <div className="p-5 rounded-lg bg-surface-elevated/80 border border-surface-highlight shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary font-mono flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-accent-action/20 text-accent-primary flex items-center justify-center text-[10px]">1</span>
            <span>LỰA CHỌN PHIÊN BẢN (TRIM)</span>
          </h3>
          <Link
            to="/car-comparison"
            className="text-xs text-accent-primary hover:underline font-semibold flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>So sánh 3 bản</span>
          </Link>
        </div>

        <div className="space-y-2.5">
          {trims.map((trim) => {
            const isSelected = activeTrim === trim.id;
            return (
              <div
                key={trim.id}
                onClick={() => onSelectTrim(trim.id)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-surface-container border-accent-primary shadow-[0_0_15px_rgba(137,206,255,0.2)]'
                    : 'bg-canvas-deep/60 border-surface-highlight hover:border-border-subtle hover:bg-surface-elevated/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-text-primary">{trim.name}</span>
                      {trim.isRecommended && (
                        <span className="px-1.5 py-0.5 rounded-[2px] bg-accent-action text-[9px] font-mono font-bold text-accent-contrast">
                          KHUYÊN DÙNG
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-text-muted">{trim.range}</p>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-accent-primary">{trim.price}</div>
                    <div className="text-[10px] font-mono text-emerald-400 font-semibold">{trim.power}</div>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-primary" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Configuration Step 2: Exterior Color Swatches */}
      <div className="p-5 rounded-lg bg-surface-elevated/80 border border-surface-highlight shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary font-mono flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-accent-action/20 text-accent-primary flex items-center justify-center text-[10px]">2</span>
            <span>MÀU SẮC NGOẠI THẤT CAO CẤP</span>
          </h3>
          <span className="text-[11px] font-semibold text-accent-primary font-mono">
            {selectedColorObj.name}
          </span>
        </div>

        <div className="flex items-center gap-3 pt-1">
          {EXTERIOR_COLORS.map((color) => {
            const isSelected = activeColor === color.id;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => onSelectColor(color.id)}
                className={`group relative w-10 h-10 rounded-full p-0.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-accent-primary ring-offset-2 ring-offset-canvas-deep scale-110 shadow-[0_0_15px_rgba(137,206,255,0.4)]'
                    : 'hover:scale-105'
                }`}
                title={color.name}
              >
                <span
                  className="block w-full h-full rounded-full border border-white/20 shadow-inner"
                  style={{ backgroundColor: color.hex }}
                />
                {isSelected && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check className={`w-4 h-4 stroke-[3] ${
                      color.id === 'white' ? 'text-canvas-deep' : 'text-white'
                    }`} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Configuration Step 3: Wheels & Interior Quick Toggles */}
      <div className="p-5 rounded-lg bg-surface-elevated/80 border border-surface-highlight shadow-xl space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary font-mono flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-accent-action/20 text-accent-primary flex items-center justify-center text-[10px]">3</span>
          <span>TRANG BỊ MÂM XE & NỘI THẤT</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Wheel */}
          <div className="p-3 rounded-lg bg-canvas-deep/60 border border-surface-highlight flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-surface-interactive flex items-center justify-center text-accent-primary shrink-0">
              <Disc className="w-5 h-5 text-accent-primary" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="text-[10px] font-mono text-text-muted uppercase">LA-ZĂNG TIÊU CHUẨN</div>
              <div className="text-xs font-bold text-text-primary truncate">21" Aero Turbine Forged</div>
              <div className="text-[10px] text-emerald-400 font-semibold">Bao gồm trong giá</div>
            </div>
          </div>

          {/* Interior */}
          <div className="p-3 rounded-lg bg-canvas-deep/60 border border-surface-highlight flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-surface-interactive flex items-center justify-center text-accent-primary shrink-0">
              <Layers className="w-5 h-5 text-accent-primary" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="text-[10px] font-mono text-text-muted uppercase">KHÔNG GIAN NỘI THẤT</div>
              <div className="text-xs font-bold text-text-primary truncate">Nappa Cognac & Carbon</div>
              <div className="text-[10px] text-accent-primary font-semibold">Gói Premium Suite</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Action CTA Cluster (Đặt cọc giữ xe 72h & Lái thử tận nhà) */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={() => {
            if (onOpenDeposit) {
              onOpenDeposit();
            } else {
              navigate('/customer/deposits');
            }
          }}
          className="w-full py-4 px-6 rounded-lg bg-accent-action hover:bg-accent-primary text-accent-contrast font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(14,165,233,0.4)] hover:shadow-[0_0_35px_rgba(137,206,255,0.6)] flex items-center justify-center gap-2.5 transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          <CreditCard className="w-5 h-5 text-accent-contrast" />
          <div className="text-left">
            <div className="text-sm font-black uppercase">ĐẶT CỌC GIỮ XE 72H</div>
            <div className="text-[10px] font-mono font-medium opacity-90">
              Chỉ 20.000.000 VNĐ • Giữ số thứ tự xe và khuyến mãi độc quyền
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/test-drive')}
          className="w-full py-3.5 px-6 rounded-lg bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight hover:border-accent-primary/50 text-text-primary hover:text-accent-primary font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-accent-primary" />
          <span>Đăng ký lái thử tận nhà (Miễn phí)</span>
        </button>
      </div>

      {/* 6. Brand Guarantees Strip */}
      <div className="grid grid-cols-3 gap-2 pt-2">
        <div className="p-3 rounded bg-canvas-deep border border-surface-highlight text-center space-y-1">
          <Truck className="w-4 h-4 text-accent-primary mx-auto" />
          <div className="text-[9px] font-mono font-bold text-text-primary uppercase leading-tight">
            GIAO XE 14 NGÀY
          </div>
          <div className="text-[8px] text-text-muted uppercase">TOÀN QUỐC</div>
        </div>

        <div className="p-3 rounded bg-canvas-deep border border-surface-highlight text-center space-y-1">
          <ShieldCheck className="w-4 h-4 text-accent-primary mx-auto" />
          <div className="text-[9px] font-mono font-bold text-text-primary uppercase leading-tight">
            BẢO HÀNH 8 NĂM
          </div>
          <div className="text-[8px] text-text-muted uppercase">HOẶC 160.000 KM</div>
        </div>

        <div className="p-3 rounded bg-canvas-deep border border-surface-highlight text-center space-y-1">
          <Zap className="w-4 h-4 text-accent-primary mx-auto" />
          <div className="text-[9px] font-mono font-bold text-text-primary uppercase leading-tight">
            SẠC SIÊU NHANH
          </div>
          <div className="text-[8px] text-text-muted uppercase">MIỄN PHÍ TRỌN ĐỜI</div>
        </div>
      </div>
    </div>
  );
};
