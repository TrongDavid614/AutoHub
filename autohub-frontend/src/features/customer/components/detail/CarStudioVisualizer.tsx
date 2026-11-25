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
import { trackUserEvent } from '@/lib/tracker';
import type { MockCar } from '../../mocks/car.mock';

interface CarStudioVisualizerProps {
  carName: string;
  activeTrim: string;
  activeColorHex: string;
  activeColorName: string;
  carImages?: string[];
  car?: MockCar | null;
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
  carImages,
  car,
}) => {
  const [activeTab, setActiveTab] = useState<string>('exterior');
  const [activePerspective, setActivePerspective] = useState<number>(0);

  const dynamicPerspectives = (carImages && carImages.length > 0)
    ? carImages.map((img, idx) => {
      const labels = [
        { label: '3/4 TRƯỚC SANG TRỌNG', subLabel: 'Góc 3/4 trước thể thao' },
        { label: 'HÔNG KHÍ ĐỘNG HỌC', subLabel: 'Góc hông khí động học' },
        { label: 'BUỒNG LÁI DIGITAL HUD', subLabel: 'Buồng lái kỹ thuật số' },
        { label: 'GÓC CHI TIẾT ĐÈN LED', subLabel: 'Cụm đèn pha ma trận' },
      ];
      const item = labels[idx % labels.length];
      return {
        id: idx,
        label: item.label,
        subLabel: item.subLabel,
        image: img,
        mainImage: img,
      };
    })
    : PERSPECTIVES;

  const currentMainImage =
    dynamicPerspectives[activePerspective % dynamicPerspectives.length]?.mainImage ||
    PERSPECTIVES[0].mainImage;

  const accelVal = car?.gridSpecs?.s1Val || car?.acceleration || '3.2 giây';
  const rangeVal = car?.gridSpecs?.s2Val || car?.range || '680 km';
  const chargeVal = car?.gridSpecs?.s3Val || car?.charging || '18 phút (10-80%)';

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Main Stage Photo + View Angle Tabs */}
      <div className="rounded-lg bg-[var(--surface)] border border-[var(--line)] overflow-hidden">
        <div className="relative aspect-[16/10] w-full bg-[var(--surface-subtle)] overflow-hidden">
          <img
            src={currentMainImage}
            alt={`${carName} - ${activeTrim}`}
            className="w-full h-full object-cover object-center"
          />

          {/* Top View Angle Tabs */}
          <div className="absolute top-3 left-3 flex items-center gap-1 p-1 rounded-lg bg-[var(--surface)]/95 border border-[var(--line)] shadow-xs flex-wrap">
            {VIEW_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    trackUserEvent({
                      loaiHanhVi: 'INTERACT_360',
                      loaiThucThe: 'CAR',
                      maThucThe: car?.id ? Number(car.id) || undefined : undefined,
                      duLieuBoSung: {
                        tabId: tab.id,
                        tabLabel: tab.label,
                        carName,
                        activeTrim,
                      },
                    });
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${isActive
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-subtle)]'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Key Performance Summary Row (below image, clean dividers) */}
        <dl className="grid grid-cols-3 divide-x divide-[var(--line)] border-t border-[var(--line)] bg-[var(--surface)] text-center py-3.5">
          <div className="px-3">
            <dt className="text-xs text-[var(--text-muted)] flex items-center justify-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Tăng tốc 0–100</span>
            </dt>
            <dd className="text-base sm:text-lg font-bold text-[var(--text)] tabular-nums mt-0.5">
              {accelVal}
            </dd>
          </div>

          <div className="px-3">
            <dt className="text-xs text-[var(--text-muted)] flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Tầm hoạt động</span>
            </dt>
            <dd className="text-base sm:text-lg font-bold text-[var(--text)] tabular-nums mt-0.5">
              {rangeVal}
            </dd>
          </div>

          <div className="px-3">
            <dt className="text-xs text-[var(--text-muted)] flex items-center justify-center gap-1">
              <BatteryCharging className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Sạc / nhiên liệu</span>
            </dt>
            <dd className="text-sm sm:text-base font-bold text-[var(--text)] tabular-nums mt-0.5 truncate">
              {chargeVal}
            </dd>
          </div>
        </dl>
      </div>

      {/* 2. Thumbnails Array */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {dynamicPerspectives.map((item, index) => {
          const isSelected = activePerspective === index;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActivePerspective(index);
                trackUserEvent({
                  loaiHanhVi: 'GALLERY_SLIDE',
                  loaiThucThe: 'CAR',
                  maThucThe: car?.id ? Number(car.id) || undefined : undefined,
                  duLieuBoSung: {
                    perspectiveIndex: index,
                    perspectiveLabel: item.label,
                    carName,
                    activeTrim,
                  },
                });
              }}
              className={`rounded-lg p-2 text-left bg-[var(--surface)] border transition-colors cursor-pointer overflow-hidden ${isSelected
                ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]'
                : 'border-[var(--line)] hover:border-[var(--line-strong)]'
                }`}
            >
              <div className="aspect-[16/9] w-full rounded bg-[var(--surface-subtle)] overflow-hidden mb-1.5">
                <img
                  src={item.image}
                  alt={item.subLabel}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs font-medium text-[var(--text)] truncate">
                {item.subLabel}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Concise Technical Highlight */}
      <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--line)] flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shrink-0">
          <Wind className="w-4 h-4" />
        </div>
        <div className="space-y-0.5">
          <div className="text-xs font-semibold text-[var(--text)]">
            Thiết kế khí động học (Cd 0.205)
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Thân xe tối ưu luồng gió giúp giảm lực cản ở tốc độ cao và tăng hiệu quả vận hành.
          </p>
        </div>
      </div>
    </div>
  );
};
