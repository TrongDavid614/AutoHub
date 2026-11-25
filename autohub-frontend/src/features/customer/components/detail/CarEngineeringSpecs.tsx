import React from 'react';
import {
  Battery,
  Maximize2,
  ShieldCheck,
  Gauge,
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
    <section className="space-y-5 pt-6 border-t border-[var(--line)]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-[var(--text)] tracking-tight">
            Thông số kỹ thuật &amp; vận hành
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {car?.subtitle || 'Thông số tiêu chuẩn theo phiên bản niêm yết.'}
          </p>
        </div>
      </div>

      {/* 4-Pillar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Motor & Dynamics */}
        <div className="p-5 rounded-lg bg-[var(--surface)] border border-[var(--line)] space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text)]">Động cơ &amp; vận hành</span>
              <Gauge className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {car?.powertrain || 'Hệ truyền động hiệu suất cao.'}
            </p>
          </div>

          <dl className="space-y-2 pt-3 border-t border-[var(--line)] text-xs">
            <div className="flex justify-between items-center gap-2">
              <dt className="text-[var(--text-muted)]">Công suất:</dt>
              <dd className="font-semibold text-[var(--text)] tabular-nums text-right">{power}</dd>
            </div>
            <div className="flex justify-between items-center gap-2">
              <dt className="text-[var(--text-muted)]">Mô-men xoắn:</dt>
              <dd className="font-semibold text-[var(--accent)] tabular-nums">{torque}</dd>
            </div>
            <div className="flex justify-between items-center gap-2">
              <dt className="text-[var(--text-muted)]">Dẫn động:</dt>
              <dd className="font-medium text-[var(--text)]">{drivetrain}</dd>
            </div>
            <div className="flex justify-between items-center gap-2">
              <dt className="text-[var(--text-muted)]">Tốc độ tối đa:</dt>
              <dd className="font-medium text-[var(--text)] tabular-nums">{topSpeed}</dd>
            </div>
            <div className="flex justify-between items-center gap-2 pt-1.5 border-t border-[var(--line)]">
              <dt className="text-[var(--text-secondary)]">0–100 km/h:</dt>
              <dd className="font-semibold text-emerald-700 tabular-nums">{car?.acceleration || '3.2s'}</dd>
            </div>
          </dl>
        </div>

        {/* Card 2: Battery & Charging */}
        <div className="p-5 rounded-lg bg-[var(--surface)] border border-[var(--line)] space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text)]">
                {isElectric ? 'Pin & sạc' : 'Nhiên liệu & năng lượng'}
              </span>
              <Battery className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {isElectric
                ? 'Khối pin cấu trúc an toàn với quản lý nhiệt độ chủ động.'
                : 'Tối ưu tiêu hao nhiên liệu theo tiêu chuẩn khí thải hiện hành.'}
            </p>
          </div>

          <dl className="space-y-2 pt-3 border-t border-[var(--line)] text-xs">
            <div className="flex justify-between items-center gap-2">
              <dt className="text-[var(--text-muted)]">{isElectric ? 'Dung lượng pin:' : 'Dung tích:'}</dt>
              <dd className="font-semibold text-[var(--text)] tabular-nums">{batteryCapacity}</dd>
            </div>
            <div className="flex justify-between items-center gap-2">
              <dt className="text-[var(--text-muted)]">Tầm hoạt động:</dt>
              <dd className="font-semibold text-[var(--accent)] tabular-nums">{car?.range || '680 km'}</dd>
            </div>
            <div className="flex justify-between items-center gap-2">
              <dt className="text-[var(--text-muted)]">Thời gian nạp:</dt>
              <dd className="font-medium text-emerald-700 text-right">{chargingInfo}</dd>
            </div>
            <div className="flex justify-between items-center gap-2">
              <dt className="text-[var(--text-muted)]">Số chỗ ngồi:</dt>
              <dd className="font-medium text-[var(--text)]">{car?.seats || '5 chỗ'}</dd>
            </div>
            <div className="flex justify-between items-center gap-2 pt-1.5 border-t border-[var(--line)]">
              <dt className="text-[var(--text-secondary)]">Bảo hành pin:</dt>
              <dd className="font-semibold text-emerald-700 tabular-nums">10 năm / 200.000 km</dd>
            </div>
          </dl>
        </div>

        {/* Card 3: Dimensions */}
        <div className="p-5 rounded-lg bg-[var(--surface)] border border-[var(--line)] space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text)]">Kích thước &amp; khoang xe</span>
              <Maximize2 className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {car?.segment || 'Phân khúc tiêu chuẩn'} · Tối ưu không gian hành khách và hành lý.
            </p>
          </div>

          <dl className="space-y-2 pt-3 border-t border-[var(--line)] text-xs">
            <div className="flex justify-between items-center gap-2">
              <dt className="text-[var(--text-muted)]">DxRxC:</dt>
              <dd className="font-semibold text-[var(--text)] tabular-nums text-right">
                {car?.specs?.kich_thuoc || '4.980 x 1.965 x 1.410 mm'}
              </dd>
            </div>
            <div className="flex justify-between items-center gap-2">
              <dt className="text-[var(--text-muted)]">Chiều dài cơ sở:</dt>
              <dd className="font-medium text-[var(--text)] tabular-nums">
                {car?.specs?.chieu_dai_co_so || '2.990 mm'}
              </dd>
            </div>
            <div className="flex justify-between items-center gap-2">
              <dt className="text-[var(--text-muted)]">Khoảng sáng gầm:</dt>
              <dd className="font-semibold text-[var(--accent)] tabular-nums">
                {car?.specs?.khoang_sang_gam || '175 mm'}
              </dd>
            </div>
            <div className="flex justify-between items-center gap-2">
              <dt className="text-[var(--text-muted)]">Khoang hành lý:</dt>
              <dd className="font-medium text-[var(--text)] tabular-nums">
                {car?.specs?.khoang_hanh_ly || '520 L'}
              </dd>
            </div>
            <div className="flex justify-between items-center gap-2 pt-1.5 border-t border-[var(--line)]">
              <dt className="text-[var(--text-secondary)]">An toàn:</dt>
              <dd className="font-semibold text-emerald-700">5 sao ASEAN NCAP</dd>
            </div>
          </dl>
        </div>

        {/* Card 4: ADAS & Safety */}
        <div className="p-5 rounded-lg bg-[var(--surface)] border border-[var(--line)] space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text)]">An toàn &amp; hỗ trợ lái</span>
              <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Trang bị an toàn chủ động cùng camera quan sát toàn cảnh.
            </p>
          </div>

          <dl className="space-y-2 pt-3 border-t border-[var(--line)] text-xs">
            <div className="flex justify-between items-center gap-2">
              <dt className="text-[var(--text-muted)]">Gói trợ lái:</dt>
              <dd className="font-semibold text-[var(--accent)] truncate max-w-[150px]">
                {car?.feature1 || 'HubPilot 2+'}
              </dd>
            </div>
            <div className="flex justify-between items-center gap-2">
              <dt className="text-[var(--text-muted)]">Khung gầm:</dt>
              <dd className="font-medium text-[var(--text)] truncate max-w-[150px]">
                {car?.feature2 || 'Treo thích ứng điện tử'}
              </dd>
            </div>
            <div className="flex justify-between items-center gap-2">
              <dt className="text-[var(--text-muted)]">Túi khí:</dt>
              <dd className="font-medium text-[var(--text)]">11 túi khí</dd>
            </div>
            <div className="flex justify-between items-center gap-2">
              <dt className="text-[var(--text-muted)]">Camera:</dt>
              <dd className="font-medium text-emerald-700">Toàn cảnh 360°</dd>
            </div>
            <div className="flex justify-between items-center gap-2 pt-1.5 border-t border-[var(--line)]">
              <dt className="text-[var(--text-secondary)]">Kiểm định:</dt>
              <dd className="font-semibold text-emerald-700">Đạt chuẩn xuất xưởng</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};
