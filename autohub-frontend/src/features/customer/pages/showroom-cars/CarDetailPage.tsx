import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useCarDetail } from '@/features/customer/hooks/useCarDetail';
import { CarStudioVisualizer } from '@/features/customer/components/detail/CarStudioVisualizer';
import { CarConfiguratorPanel } from '@/features/customer/components/detail/CarConfiguratorPanel';
import { CarDepositModal } from '@/features/customer/components/detail/CarDepositModal';
import { EXTERIOR_COLORS } from '@/features/customer/types/detail.types';
import { CarEngineeringSpecs } from '@/features/customer/components/detail/CarEngineeringSpecs';
import { carService } from '@/features/customer/services/car.service';
import { trackUserEvent } from '@/lib/tracker';
import type { MockCar } from '@/features/customer/mocks/car.mock';

export const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<MockCar | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {
    activeTrim,
    setActiveTrim,
    activeColor,
    setActiveColor,
    isDepositOpen,
    setIsDepositOpen,
    currentTrimData,
  } = useCarDetail();

  const fetchCarDetail = () => {
    setLoading(true);
    setError(null);
    carService.getCarById(id || '1')
      .then((data) => {
        if (!data) {
          setError('Không tìm thấy thông tin phiên bản xe yêu cầu.');
        } else {
          setCar(data);
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Không thể tải chi tiết xe.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCarDetail();
  }, [id]);

  useEffect(() => {
    if (car) {
      trackUserEvent({
        loaiHanhVi: 'VIEW_PRODUCT',
        loaiThucThe: 'CAR',
        maThucThe: Number(car.id) || 1,
        duLieuBoSung: {
          model: car.name,
          referrer: window.location.pathname,
        },
      });

      const startTime = Date.now();
      return () => {
        const dwellSeconds = Math.round((Date.now() - startTime) / 1000);
        if (dwellSeconds >= 2) {
          trackUserEvent({
            loaiHanhVi: 'DWELL_TIME',
            loaiThucThe: 'CAR',
            maThucThe: Number(car.id) || 1,
            thoiGianDungXem: dwellSeconds,
            duLieuBoSung: {
              model: car.name,
              dwellSeconds,
            },
          });
        }
      };
    }
  }, [car]);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-text-muted text-sm font-mono">Đang tải thông số kỹ thuật xe...</p>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-6 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-300 space-y-3">
          <p className="font-semibold text-base">{error || 'Không tìm thấy xe yêu cầu'}</p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={fetchCarDetail}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded transition-colors cursor-pointer"
            >
              Thử lại
            </button>
            <button
              type="button"
              onClick={() => navigate('/cars')}
              className="px-4 py-2 bg-surface-container hover:bg-surface-highlight text-text-primary font-bold text-xs rounded transition-colors cursor-pointer"
            >
              Quay lại danh sách xe
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeColorObj =
    (car?.availableColors && car.availableColors.length > 0)
      ? car.availableColors.find((c) => String(c.id) === activeColor || c.name === activeColor) || car.availableColors[0]
      : EXTERIOR_COLORS.find((c) => c.id === activeColor) || EXTERIOR_COLORS[0];

  const carName = car?.name || 'AutoHub GT-e Performance Sedan';
  const trimName = car?.subtitle || currentTrimData?.name || 'GT-e Performance';
  const depositAmount = car?.depositAmount || 20000000;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-6 animate-fadeIn">
      {/* 1. Top Meta & Breadcrumb Navigation Path */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-text-muted py-2 border-b border-surface-highlight/50">
        <Link
          to="/"
          className="text-text-secondary hover:text-accent-primary transition-colors font-medium"
        >
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-border-subtle" />
        <Link
          to="/cars"
          className="text-text-secondary hover:text-accent-primary transition-colors font-medium"
        >
          Dòng xe
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-border-subtle" />
        <span className="text-text-primary font-semibold truncate">
          {carName}
        </span>
      </nav>

      {/* 2. Primary Interactive Showcase Studio Grid (12-Col Responsive Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Master Visualizer & Studio Gallery (7 Cols) */}
        <div className="lg:col-span-7 w-full">
          <CarStudioVisualizer
            carName={carName}
            activeTrim={activeTrim}
            activeColorHex={activeColorObj.hex || '#0284C7'}
            activeColorName={activeColorObj.name}
            carImages={car?.images}
            car={car}
          />
        </div>

        {/* Right Column: Interactive Vehicle Configurator Panel (5 Cols) */}
        <div className="lg:col-span-5 w-full">
          <CarConfiguratorPanel
            activeTrim={activeTrim}
            onSelectTrim={setActiveTrim}
            activeColor={activeColor}
            onSelectColor={setActiveColor}
            onOpenDeposit={() => {
              const targetId = car?.id || activeTrim || '1';
              const cName = encodeURIComponent(activeColorObj.name);
              const cHex = encodeURIComponent(activeColorObj.hex || '#0284C7');
              navigate(`/deposit/${targetId}?color=${cName}&colorHex=${cHex}`);
            }}
            car={car}
          />
        </div>
      </div>

      {/* 3. Technical Telemetry & Engineering Specifications */}
      <CarEngineeringSpecs car={car} />

      {/* 4. Car Deposit Modal (72h Online Reservation) */}
      <CarDepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        variantId={car?.id || activeTrim}
        carName={carName}
        trimName={trimName}
        colorName={activeColorObj.name}
        depositAmount={depositAmount}
      />
    </div>
  );
};
