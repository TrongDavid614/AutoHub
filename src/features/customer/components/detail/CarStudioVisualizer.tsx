import React, { useState } from 'react';
import {
  Rotate3d,
  Layers,
  Sparkles,
  Zap,
  Gauge,
  BatteryCharging,
  Maximize2,
  Wind,
} from 'lucide-react';

interface CarStudioVisualizerProps {
  carName: string;
  activeTrim: string;
  activeColorHex: string;
  activeColorName: string;
}

const VIEW_TABS = [
  { id: 'exterior', label: 'Ngoại thất 360°', icon: Rotate3d },
  { id: 'interior', label: 'Nội thất sang trọng', icon: Layers },
  { id: 'detail', label: 'Góc nhìn chi tiết', icon: Sparkles },
  { id: 'studio', label: 'STUDIO 4K HDR', icon: Maximize2 },
] as const;

const PERSPECTIVES = [
  {
    id: 0,
    label: '3/4 TRƯỚC SANG TRỌNG',
    subLabel: 'Góc 3/4 trước thể thao',
    image:
      'https://api.builder.io/api/v1/image/assets/TEMP/b4042794cbb44dd477a533f3afbdac804d099076?width=319',
    mainImage:
      'https://api.builder.io/api/v1/image/assets/TEMP/92adaf12b47c8a71c765e7742905d259732f1cba?width=1324',
  },
  {
    id: 1,
    label: 'HÔNG KHÍ ĐỘNG HỌC',
    subLabel: 'Góc hông khí động học',
    image:
      'https://api.builder.io/api/v1/image/assets/TEMP/61eb9cfe5a81a88c777dbbf85304d585791c488c?width=319',
    mainImage:
      'https://api.builder.io/api/v1/image/assets/TEMP/61eb9cfe5a81a88c777dbbf85304d585791c488c?width=1324',
  },
  {
    id: 2,
    label: 'BUỒNG LÁI DIGITAL HUD',
    subLabel: 'Buồng lái kỹ thuật số',
    image:
      'https://api.builder.io/api/v1/image/assets/TEMP/4cba40826ceb7eb2cb20399bb4284dc50a20e9c6?width=319',
    mainImage:
      'https://api.builder.io/api/v1/image/assets/TEMP/4cba40826ceb7eb2cb20399bb4284dc50a20e9c6?width=1324',
  },
  {
    id: 3,
    label: 'MA TRẬN MATRIX LED',
    subLabel: 'Cụm đèn pha Matrix LED',
    image:
      'https://api.builder.io/api/v1/image/assets/TEMP/42e426db9835f1382ff2231626bc0e44ed5ff3b5?width=319',
    mainImage:
      'https://api.builder.io/api/v1/image/assets/TEMP/42e426db9835f1382ff2231626bc0e44ed5ff3b5?width=1324',
  },
];

export const CarStudioVisualizer: React.FC<CarStudioVisualizerProps> = ({
  carName,
  activeTrim,
}) => {
  const [activeTab, setActiveTab] = useState<string>('exterior');
  const [activePerspective, setActivePerspective] = useState<number>(0);

  const currentMainImage = PERSPECTIVES[activePerspective]?.mainImage || PERSPECTIVES[0].mainImage;

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Main Stage Container (3D Virtual Studio) */}
      <div className="relative aspect-[16/10] w-full rounded-lg bg-canvas-deep border border-surface-highlight overflow-hidden shadow-2xl group">
        {/* Main Car Image */}
        <img
          src={currentMainImage}
          alt={`${carName} - ${activeTrim}`}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Ambient Studio Lighting Scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-canvas-deep via-transparent to-canvas-deep/40 pointer-events-none" />

        {/* Top Camera & View Angle Switcher Pills */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-canvas-deep/80 backdrop-blur-md border border-surface-highlight pointer-events-auto shadow-lg">
            {VIEW_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-accent-action text-accent-contrast shadow-[0_0_12px_rgba(14,165,233,0.4)]'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-canvas-deep/80 backdrop-blur-md border border-surface-highlight text-[10px] font-mono font-bold text-accent-primary pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
            <span>INTERACTIVE 3D ENGINE</span>
          </div>
        </div>

        

        {/* Bottom Overlay: Floating Key Performance Metrics */}
        <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-lg bg-surface-container/85 backdrop-blur-md border border-surface-highlight/80 z-10 shadow-xl">
          <div className="grid grid-cols-3 divide-x divide-surface-highlight text-center">
            {/* Metric 1: 0-100 */}
            <div className="px-2 sm:px-4">
              <div className="text-[10px] font-mono text-text-muted flex items-center justify-center gap-1 uppercase">
                <Gauge className="w-3.5 h-3.5 text-accent-primary" />
                <span>TĂNG TỐC 0-100</span>
              </div>
              <div className="flex items-baseline justify-center gap-1 mt-0.5">
                <span className="text-xl sm:text-2xl font-black font-mono text-text-primary">3.2</span>
                <span className="text-[10px] font-mono font-bold text-accent-primary uppercase">GIÂY</span>
              </div>
            </div>

            {/* Metric 2: WLTP Range */}
            <div className="px-2 sm:px-4">
              <div className="text-[10px] font-mono text-text-muted flex items-center justify-center gap-1 uppercase">
                <Zap className="w-3.5 h-3.5 text-accent-primary" />
                <span>PHẠM VI WLTP</span>
              </div>
              <div className="flex items-baseline justify-center gap-1 mt-0.5">
                <span className="text-xl sm:text-2xl font-black font-mono text-text-primary">680</span>
                <span className="text-[10px] font-mono font-bold text-accent-primary uppercase">KM</span>
              </div>
            </div>

            {/* Metric 3: 800V Fast Charge */}
            <div className="px-2 sm:px-4">
              <div className="text-[10px] font-mono text-text-muted flex items-center justify-center gap-1 uppercase">
                <BatteryCharging className="w-3.5 h-3.5 text-accent-primary" />
                <span>SẠC NHANH 800V</span>
              </div>
              <div className="flex items-baseline justify-center gap-1 mt-0.5">
                <span className="text-xl sm:text-2xl font-black font-mono text-text-primary">18</span>
                <span className="text-[10px] font-mono font-bold text-accent-primary uppercase">PHÚT (10-80%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Thumbnails Array (4 Camera Perspectives) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {PERSPECTIVES.map((item, index) => {
          const isSelected = activePerspective === index;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActivePerspective(index)}
              className={`group relative rounded-[4px] p-2 text-left bg-surface-elevated/70 border transition-all cursor-pointer overflow-hidden ${
                isSelected
                  ? 'border-accent-primary bg-surface-container shadow-[0_0_15px_rgba(137,206,255,0.2)]'
                  : 'border-surface-highlight hover:border-border-subtle hover:bg-surface-elevated'
              }`}
            >
              <div className="aspect-[16/9] w-full rounded-[2px] bg-canvas-deep overflow-hidden mb-1.5 border border-surface-highlight/50">
                <img
                  src={item.image}
                  alt={item.subLabel}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="space-y-0.5">
                <div className={`text-[10px] font-mono font-bold tracking-tight uppercase ${
                  isSelected ? 'text-accent-primary' : 'text-text-primary'
                }`}>
                  {item.label}
                </div>
                <div className="text-[9px] text-text-muted truncate">
                  {item.subLabel}
                </div>
              </div>
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Quick Aerodynamic & Performance Visual Callout */}
      <div className="p-4 rounded-lg bg-surface-elevated/50 border border-surface-highlight flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded bg-accent-action/15 border border-accent-primary/30 flex items-center justify-center text-accent-primary shrink-0 mt-0.5">
            <Wind className="w-5 h-5 text-accent-primary" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-text-primary flex items-center gap-2">
              <span>Hệ số cản gió tối ưu Cd 0.205</span>
              <span className="px-1.5 py-0.5 rounded-[2px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] font-bold">
                TOP 1 PHÂN KHÚC
              </span>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Thiết kế thân xe dòng chảy khí động lưu thông minh với cánh gió thích ứng điện tử tự động nâng hạ theo dải tốc độ.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 sm:border-l sm:border-surface-highlight sm:pl-4">
          <div className="text-right">
            <div className="text-[10px] font-mono text-text-muted uppercase">AIRFLOW EFFICIENCY</div>
            <div className="text-sm font-black font-mono text-accent-primary">AERO DYNAMICS 98.4%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
