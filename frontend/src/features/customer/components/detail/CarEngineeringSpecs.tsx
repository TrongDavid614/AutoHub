import React from 'react';
import {
  Battery,
  Maximize2,
  ShieldCheck,
  Gauge,
  Sparkles,
} from 'lucide-react';

export const CarEngineeringSpecs: React.FC = () => {
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
            Thông Số Kỹ Thuật & Kiến Trúc Thuần Điện 800V
          </h2>
        </div>
        <div className="text-xs text-text-muted font-mono">
          Nền tảng E-Platform 3.0 SiC • Chip xử lý 508 TOPS
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
              Cấu trúc truyền động kép Dual Motor AWD nam châm vĩnh cửu làm mát bằng dầu.
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-surface-highlight text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Công suất tối đa:</span>
              <span className="font-bold text-text-primary">680 HP (500 kW)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Mô-men xoắn tức thời:</span>
              <span className="font-bold text-accent-primary">850 Nm</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Hệ dẫn động:</span>
              <span className="font-bold text-text-primary">AWD Toàn Thời Gian</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Tốc độ tối đa:</span>
              <span className="font-bold text-text-primary">265 km/h</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-canvas-deep border border-surface-highlight text-[10px] font-mono text-emerald-400 flex items-center justify-between">
            <span>TOÀN TẢI ĐỘNG CƠ:</span>
            <span className="font-bold">100% ĐẠT 0.1S</span>
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
            <h3 className="text-base font-bold text-text-primary">Pin & Sạc 800V Siêu Tốc</h3>
            <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
              Khối pin LFP cấu trúc Cell-to-Chassis tối ưu tản nhiệt chất lỏng đa luồng.
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-surface-highlight text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Dung lượng danh định:</span>
              <span className="font-bold text-text-primary">105 kWh</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Kiến trúc điện:</span>
              <span className="font-bold text-accent-primary">800V SiC Siêu Cấp</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Thời gian nạp 10-80%:</span>
              <span className="font-bold text-emerald-400">18 Phút</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Công suất nạp DC Max:</span>
              <span className="font-bold text-text-primary">350 kW Peak</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-canvas-deep border border-surface-highlight text-[10px] font-mono text-emerald-400 flex items-center justify-between">
            <span>DUY TRÌ PIN:</span>
            <span className="font-bold">92% SAU 500K KM</span>
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
              Phân bổ khối lượng tỷ lệ vàng 50:50 trọng tâm thấp đầm chắc thể thao.
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-surface-highlight text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Dài x Rộng x Cao:</span>
              <span className="font-bold text-text-primary">4.980 x 1.965 x 1.410 mm</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Chiều dài cơ sở:</span>
              <span className="font-bold text-text-primary">2.990 mm</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Khoảng sáng gầm:</span>
              <span className="font-bold text-accent-primary">145 mm (Air-Suspension)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Thể tích hành lý:</span>
              <span className="font-bold text-text-primary">520L (+ 85L Frunk)</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-canvas-deep border border-surface-highlight text-[10px] font-mono text-accent-primary flex items-center justify-between">
            <span>TỶ LỆ TRỌNG LƯỢNG:</span>
            <span className="font-bold">50% TRƯỚC / 50% SAU</span>
          </div>
        </div>

        {/* Card 4: Intelligent Safety & LiDAR */}
        <div className="p-5 rounded-lg bg-surface-elevated/70 border border-surface-highlight hover:border-accent-primary/40 transition-all space-y-4 shadow-xl group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-accent-primary tracking-widest uppercase">
              AUTONOMOUS
            </span>
            <div className="w-8 h-8 rounded bg-surface-interactive flex items-center justify-center text-accent-primary group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4 text-accent-primary" />
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-text-primary">Công nghệ & An toàn</h3>
            <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
              Bộ vi xử lý thần kinh kép 508 TOPS xử lý dữ liệu cảm biến thời gian thực.
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-surface-highlight text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Hỗ trợ tự hành:</span>
              <span className="font-bold text-accent-primary">AutoPilot Level 2+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Cảm biến & LiDAR:</span>
              <span className="font-bold text-text-primary">12 Camera + 1 LiDAR 360°</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Hệ thống phanh:</span>
              <span className="font-bold text-text-primary">Carbon Brembo 6-piston</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Túi khí an toàn:</span>
              <span className="font-bold text-text-primary">10 Túi khí đa hướng</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-canvas-deep border border-surface-highlight text-[10px] font-mono text-emerald-400 flex items-center justify-between">
            <span>EURO NCAP:</span>
            <span className="font-bold">5 SAO TOÀN DIỆN</span>
          </div>
        </div>
      </div>
    </section>
  );
};
