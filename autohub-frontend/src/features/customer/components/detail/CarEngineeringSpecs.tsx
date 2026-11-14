import React from 'react';
import {
  Battery,
  Maximize2,
  ShieldCheck,
  Gauge,
  Sparkles,
} from 'lucide-react';
import type { MockCar } from '../../mocks/car.mock';

interface CarEngineeringSpecsProps {
  car?: MockCar | null;
}

export const CarEngineeringSpecs: React.FC<CarEngineeringSpecsProps> = ({ car }) => {
  const isElectric = !car?.powertrain?.toLowerCase().includes('diesel') && !car?.powertrain?.toLowerCase().includes('xăng');
  const power = car?.power || '680 HP (500 kW)';
  const torque = car?.specs?.mo_men_xoan || (isElectric ? '850 Nm' : '500 Nm');
  const drivetrain = car?.specs?.dan_dong || (car?.powertrain?.includes('4x2') ? '4x2 Cầu sau' : 'AWD Toàn Thời Gian');
  const topSpeed = car?.specs?.toc_do_max || (isElectric ? '260 km/h' : '200 km/h');
  const batteryCapacity = car?.specs?.pin || (isElectric ? '100 kWh' : 'Pin Hybrid 1.49 kWh');
  const chargingInfo = car?.charging || (isElectric ? '18 Phút (10-80%)' : 'Tự nạp điện tái sinh');

  return (
    <section className="space-y-6 pt-4 border-t border-surface-highlight">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[2px] bg-accent-action/15 text-accent-primary font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-accent-primary" />
            <span>KỸ THUẬT & CÔNG NGHỆ CHẾ TÁC</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
            Thông Số Kỹ Thuật & Kiến Trúc Vận Hành
          </h2>
        </div>
        <div className="text-xs text-text-muted font-mono">
          {car?.subtitle || 'Nền tảng E-Platform 3.0 SiC • Chip xử lý 508 TOPS'}
        </div>
      </div>

      {/* 4-Pillar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Motor & Dynamics */}
        <div className="p-5 rounded-lg bg-surface-elevated/70 border border-surface-highlight hover:border-accent-primary/40 transition-all space-y-4 shadow-xl group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-accent-primary tracking-widest uppercase">
              POWERTRAIN
            </span>
            <div className="w-8 h-8 rounded bg-surface-interactive flex items-center justify-center text-accent-primary group-hover:scale-110 transition-transform">
              <Gauge className="w-4 h-4 text-accent-primary" />
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-text-primary">Động cơ & Vận hành</h3>
            <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
              {car?.powertrain || 'Cấu trúc truyền động kép Dual Motor AWD nam châm vĩnh cửu làm mát bằng dầu.'}
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-surface-highlight text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Công suất tối đa:</span>
              <span className="font-bold text-text-primary">{power}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Mô-men xoắn:</span>
              <span className="font-bold text-accent-primary">{torque}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Hệ dẫn động:</span>
              <span className="font-bold text-text-primary">{drivetrain}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Tốc độ tối đa:</span>
              <span className="font-bold text-text-primary">{topSpeed}</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-canvas-deep border border-surface-highlight text-[10px] font-mono text-emerald-400 flex items-center justify-between">
            <span>TĂNG TỐC 0-100:</span>
            <span className="font-bold">{car?.acceleration || '3.2s'}</span>
          </div>
        </div>

        {/* Card 2: Battery & Ultrafast Charging */}
        <div className="p-5 rounded-lg bg-surface-elevated/70 border border-surface-highlight hover:border-accent-primary/40 transition-all space-y-4 shadow-xl group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-accent-primary tracking-widest uppercase">
              ENERGY CELL
            </span>
            <div className="w-8 h-8 rounded bg-surface-interactive flex items-center justify-center text-accent-primary group-hover:scale-110 transition-transform">
              <Battery className="w-4 h-4 text-accent-primary" />
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-text-primary">{isElectric ? 'Pin & Sạc Siêu Tốc' : 'Nhiên Liệu & Năng Lượng'}</h3>
            <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
              {isElectric ? 'Khối pin cấu trúc Cell-to-Chassis tối ưu tản nhiệt chất lỏng đa luồng.' : 'Hệ thống tối ưu tiêu hao nhiên liệu thông minh đạt chuẩn khí thải Euro 5.'}
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-surface-highlight text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-text-muted">{isElectric ? 'Dung lượng danh định:' : 'Dung lượng Pin / Bình:'}</span>
              <span className="font-bold text-text-primary">{batteryCapacity}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Tầm hoạt động:</span>
              <span className="font-bold text-accent-primary">{car?.range || '680 km'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Cơ chế nạp:</span>
              <span className="font-bold text-emerald-400">{chargingInfo}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Số chỗ ngồi:</span>
              <span className="font-bold text-text-primary">{car?.seats || '5 Chỗ'}</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-canvas-deep border border-surface-highlight text-[10px] font-mono text-emerald-400 flex items-center justify-between">
            <span>BẢO HÀNH PIN:</span>
            <span className="font-bold">10 NĂM / 200.000 KM</span>
          </div>
        </div>

        {/* Card 3: Dimensions & Ergonomics */}
        <div className="p-5 rounded-lg bg-surface-elevated/70 border border-surface-highlight hover:border-accent-primary/40 transition-all space-y-4 shadow-xl group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-accent-primary tracking-widest uppercase">
              CHASSIS & ROOM
            </span>
            <div className="w-8 h-8 rounded bg-surface-interactive flex items-center justify-center text-accent-primary group-hover:scale-110 transition-transform">
              <Maximize2 className="w-4 h-4 text-accent-primary" />
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-text-primary">Kích thước & Trọng lượng</h3>
            <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
              {car?.segment || 'SUV Đa dụng'} • Phân bổ khối lượng tối ưu đầm chắc thể thao.
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-surface-highlight text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Kích thước DxRxC:</span>
              <span className="font-bold text-text-primary">{car?.specs?.kich_thuoc || '4.980 x 1.965 x 1.410 mm'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Chiều dài cơ sở:</span>
              <span className="font-bold text-text-primary">{car?.specs?.chieu_dai_co_so || '2.990 mm'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Khoảng sáng gầm:</span>
              <span className="font-bold text-accent-primary">{car?.specs?.khoang_sang_gam || '175 mm'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Thể tích hành lý:</span>
              <span className="font-bold text-text-primary">{car?.specs?.khoang_hanh_ly || '520L (+ 85L Frunk)'}</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-canvas-deep border border-surface-highlight text-[10px] font-mono text-emerald-400 flex items-center justify-between">
            <span>TIÊU CHUẨN AN TOÀN:</span>
            <span className="font-bold">5 SAO ASEAN NCAP</span>
          </div>
        </div>

        {/* Card 4: Intelligent ADAS & Safety Suite */}
        <div className="p-5 rounded-lg bg-surface-elevated/70 border border-surface-highlight hover:border-accent-primary/40 transition-all space-y-4 shadow-xl group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-accent-primary tracking-widest uppercase">
              SAFETY & ADAS
            </span>
            <div className="w-8 h-8 rounded bg-surface-interactive flex items-center justify-center text-accent-primary group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4 text-accent-primary" />
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-text-primary">An toàn & Trợ lái ADAS</h3>
            <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
              Trang bị hệ thống an toàn chủ động cao cấp cùng công nghệ hỗ trợ lái thế hệ mới.
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-surface-highlight text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Gói trợ lái:</span>
              <span className="font-bold text-accent-primary truncate max-w-[150px]">{car?.feature1 || 'HubPilot 2+ tự hành'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Khung gầm:</span>
              <span className="font-bold text-text-primary truncate max-w-[150px]">{car?.feature2 || 'Treo thích ứng điện tử'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Số túi khí:</span>
              <span className="font-bold text-text-primary">11 Túi khí toàn diện</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Camera toàn cảnh:</span>
              <span className="font-bold text-emerald-400">360° 3D Trong Suốt</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-canvas-deep border border-surface-highlight text-[10px] font-mono text-emerald-400 flex items-center justify-between">
            <span>KIỂM ĐỊNH KỸ THUẬT:</span>
            <span className="font-bold">ĐẠT 100% TIÊU CHUẨN</span>
          </div>
        </div>
      </div>
    </section>
  );
};
