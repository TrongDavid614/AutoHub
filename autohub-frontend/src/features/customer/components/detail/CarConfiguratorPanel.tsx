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
import { trackUserEvent } from '@/lib/tracker';
import type { MockCar } from '../../mocks/car.mock';

interface CarConfiguratorPanelProps {
  activeTrim: TrimType;
  onSelectTrim: (trim: TrimType) => void;
  activeColor: string;
  onSelectColor: (colorId: string) => void;
  onOpenDeposit?: () => void;
  car?: MockCar | null;
}

export const CarConfiguratorPanel: React.FC<CarConfiguratorPanelProps> = ({
  activeTrim,
  onSelectTrim,
  activeColor,
  onSelectColor,
  onOpenDeposit,
  car,
}) => {
  const navigate = useNavigate();

  const dynamicTrims = (car?.variants && car.variants.length > 0)
    ? car.variants.map((v) => ({
      id: String(v.id) as TrimType,
      name: v.variantName || v.tenPhienBan || 'Phiên bản',
      badge: v.badge || (v.listedPrice >= 2000000000 ? 'KHUYÊN DÙNG' : 'TIÊU CHUẨN'),
      power: v.desc || (car.power || '500 HP'),
      range: v.tamHoatDongKm ? `Phạm vi ${v.tamHoatDongKm} km` : (v.transmission || 'Tự động'),
      price: `${(v.listedPrice || v.giaNiemYet || 0).toLocaleString('vi-VN')} đ`,
      priceNum: v.listedPrice || v.giaNiemYet || 0,
      isRecommended: v.isCurrent || v.listedPrice >= 2000000000,
    }))
    : [
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

  const dynamicColors = (car?.availableColors && car.availableColors.length > 0)
    ? car.availableColors.map((c, idx) => ({
      id: String(c.id || idx + 1),
      name: c.name || c.colorName || 'Màu ngoại thất',
      hex: c.hex || c.colorCodeHex || '#0284C7',
    }))
    : EXTERIOR_COLORS;

  const selectedTrimObj = dynamicTrims.find((t) => t.id === activeTrim) || dynamicTrims[0];
  const selectedColorObj = dynamicColors.find((c) => c.id === activeColor) || dynamicColors[0];

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
            {car?.name || 'AutoHub GT-e Grand Touring'}
          </h1>
          <p className="text-sm text-text-muted leading-relaxed mt-0.5">
            {car?.subtitle || 'Sự giao thoa hoàn mỹ giữa sức mạnh siêu xe và đẳng cấp công nghệ di chuyển bền vững kiến trúc 800V SiC.'}
          </p>
        </div>

        {/* Official Pricing */}
        <div className="pt-3 border-t border-[var(--line)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>Giá niêm yết</span>
            <span className="text-emerald-700 font-medium">Đã bao gồm VAT</span>
          </div>

          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-bold text-[var(--text)] tabular-nums">
                {(car?.listedPrice || selectedTrimObj.priceNum).toLocaleString('vi-VN')} ₫
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate(car?.id ? `/car-estimator?carId=${car.id}` : '/car-estimator')}
              className="inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:underline font-medium cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Dự toán lăn bánh</span>
            </button>
          </div>
        </div>

        {/* Reservation Deposit Policy Note */}
        <div className="p-3.5 rounded-lg bg-[var(--accent-soft)] border border-[var(--accent)]/20 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent)]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="tabular-nums">
              Cọc giữ xe 72h: {(car?.depositAmount || 20000000).toLocaleString('vi-VN')} ₫
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Hoàn cọc 100% trong vòng 72 giờ nếu bạn đổi ý; giữ ưu đãi và số khung VIN trong thời gian chờ ký hợp đồng.
          </p>
        </div>
      </div>

      {/* 2. Configuration Step 1: Trim Selection */}
      <div className="p-5 rounded-lg bg-[var(--surface)] border border-[var(--line)] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--text)] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center text-xs tabular-nums">1</span>
            <span>Chọn phiên bản</span>
          </h3>
          <Link
            to="/car-comparison"
            className="text-xs text-[var(--accent)] hover:underline font-medium flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>So sánh 3 bản</span>
          </Link>
        </div>

        <div className="space-y-2">
          {dynamicTrims.map((trim) => {
            const isSelected = activeTrim === trim.id || String(car?.id) === String(trim.id);
            return (
              <div
                key={trim.id}
                onClick={() => {
                  onSelectTrim(trim.id);
                  trackUserEvent({
                    loaiHanhVi: 'CHANGE_TRIM',
                    loaiThucThe: 'CAR',
                    maThucThe: car?.id ? Number(car.id) || undefined : undefined,
                    duLieuBoSung: {
                      trimId: trim.id,
                      trimName: trim.name,
                      priceNum: trim.priceNum,
                      carName: car?.name,
                    },
                  });
                  if (car?.variants && car.variants.some((v) => String(v.id) === String(trim.id)) && String(car.id) !== String(trim.id)) {
                    navigate(`/cars/${trim.id}`);
                  }
                }}
                className={`p-3.5 rounded-lg border transition-colors cursor-pointer ${isSelected
                  ? 'bg-[var(--accent-soft)] border-[var(--accent)]'
                  : 'bg-[var(--surface)] border-[var(--line)] hover:border-[var(--line-strong)]'
                  }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[var(--text)]">{trim.name}</span>
                      {trim.isRecommended && (
                        <span className="px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--line)] text-[11px] font-medium text-[var(--accent)]">
                          {trim.badge || 'Phổ biến'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">{trim.range}</p>
                  </div>

                  <div className="text-right tabular-nums">
                    <div className="font-semibold text-sm text-[var(--text)]">{trim.price}</div>
                    <div className="text-xs text-emerald-700 font-medium">{trim.power}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Configuration Step 2: Exterior Color Swatches */}
      <div className="p-5 rounded-lg bg-[var(--surface)] border border-[var(--line)] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--text)] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center text-xs tabular-nums">2</span>
            <span>Màu ngoại thất</span>
          </h3>
          <span className="text-xs font-medium text-[var(--accent)]">
            {selectedColorObj.name}
          </span>
        </div>

        <div className="flex items-center gap-3 pt-1 flex-wrap">
          {dynamicColors.map((color) => {
            const isSelected = activeColor === color.id || activeColor === color.name;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => {
                  onSelectColor(color.id);
                  trackUserEvent({
                    loaiHanhVi: 'CHANGE_COLOR',
                    loaiThucThe: 'CAR',
                    maThucThe: car?.id ? Number(car.id) || undefined : undefined,
                    duLieuBoSung: {
                      colorId: color.id,
                      colorName: color.name,
                      colorHex: color.hex,
                      carName: car?.name,
                    },
                  });
                }}
                className={`relative w-9 h-9 rounded-full p-0.5 transition-transform cursor-pointer ${isSelected
                  ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--surface)]'
                  : 'hover:scale-105'
                  }`}
                title={color.name}
              >
                <span
                  className="block w-full h-full rounded-full border border-black/15"
                  style={{ backgroundColor: color.hex }}
                />
                {isSelected && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check className={`w-4 h-4 stroke-[3] ${color.hex?.toLowerCase() === '#ffffff' || color.hex?.toLowerCase() === '#f8fafc' ? 'text-[var(--text)]' : 'text-white'
                      }`} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Configuration Step 3: Trim Equipment Summary */}
      <div className="p-5 rounded-lg bg-[var(--surface)] border border-[var(--line)] space-y-3">
        <h3 className="text-sm font-semibold text-[var(--text)] flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center text-xs tabular-nums">3</span>
          <span>Mâm xe &amp; nội thất tiêu chuẩn</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--line)]">
          <div className="flex items-center gap-2.5">
            <Disc className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <div className="min-w-0 text-xs">
              <div className="text-[var(--text-muted)]">Mâm xe tiêu chuẩn</div>
              <div className="font-semibold text-[var(--text)] truncate">21&quot; Aero Turbine</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-2 sm:pt-0 sm:pl-3">
            <Layers className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <div className="min-w-0 text-xs">
              <div className="text-[var(--text-muted)]">Nội thất</div>
              <div className="font-semibold text-[var(--text)] truncate">Da Nappa &amp; ốp Carbon</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Primary & Secondary Actions */}
      <div className="space-y-2.5 pt-1">
        <button
          type="button"
          onClick={() => {
            trackUserEvent({
              loaiHanhVi: 'INITIATE_DEPOSIT',
              loaiThucThe: 'CAR',
              maThucThe: car?.id ? Number(car.id) || undefined : undefined,
              duLieuBoSung: {
                carName: car?.name,
                activeTrim,
                activeColor,
                depositAmount: 20000000,
              },
            });
            if (onOpenDeposit) {
              onOpenDeposit();
            } else {
              navigate('/customer/deposits');
            }
          }}
          className="w-full py-3 px-5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <CreditCard className="w-4 h-4" />
          <span>
            Đặt cọc giữ xe 72h ({(car?.depositAmount || 20000000).toLocaleString('vi-VN')} ₫)
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            trackUserEvent({
              loaiHanhVi: 'INITIATE_TEST_DRIVE',
              loaiThucThe: 'CAR',
              maThucThe: car?.id ? Number(car.id) || undefined : undefined,
              duLieuBoSung: {
                carName: car?.name,
                activeTrim,
              },
            });
            navigate(car?.id ? `/test-drive?carId=${car.id}` : '/test-drive');
          }}
          className="w-full py-2.5 px-5 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-subtle)] border border-[var(--line-strong)] text-[var(--text)] font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-[var(--accent)]" />
          <span>Đăng ký lái thử tận nhà (Miễn phí)</span>
        </button>
      </div>

      {/* 6. Brand Guarantees Strip */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--line)] text-center text-xs">
        <div className="py-2 space-y-0.5">
          <Truck className="w-4 h-4 text-[var(--accent)] mx-auto" />
          <div className="font-semibold text-[var(--text)]">Giao xe toàn quốc</div>
          <div className="text-[11px] text-[var(--text-muted)]">Hỗ trợ đăng ký</div>
        </div>

        <div className="py-2 space-y-0.5">
          <ShieldCheck className="w-4 h-4 text-[var(--accent)] mx-auto" />
          <div className="font-semibold text-[var(--text)]">Bảo hành 8 năm</div>
          <div className="text-[11px] text-[var(--text-muted)]">Hoặc 160.000 km</div>
        </div>

        <div className="py-2 space-y-0.5">
          <Zap className="w-4 h-4 text-[var(--accent)] mx-auto" />
          <div className="font-semibold text-[var(--text)]">Trạm sạc 350kW</div>
          <div className="text-[11px] text-[var(--text-muted)]">Mạng lưới toàn quốc</div>
        </div>
      </div>
    </div>
  );
};
