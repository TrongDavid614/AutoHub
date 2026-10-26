import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useCarDetail } from '../hooks/useCarDetail';
import { CarStudioVisualizer } from '../components/detail/CarStudioVisualizer';
import { CarConfiguratorPanel } from '../components/detail/CarConfiguratorPanel';
import { CarDepositModal } from '../components/detail/CarDepositModal';
import { EXTERIOR_COLORS } from '../types/detail.types';
import { CarEngineeringSpecs } from '../components/detail/CarEngineeringSpecs';

export const CarDetailPage: React.FC = () => {
  const {
    activeTrim,
    setActiveTrim,
    activeColor,
    setActiveColor,
    isDepositOpen,
    setIsDepositOpen,
    currentTrimData,
  } = useCarDetail();

  const activeColorObj =
    EXTERIOR_COLORS.find((c) => c.id === activeColor) || EXTERIOR_COLORS[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-6">
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
          AutoHub GT-e Performance Sedan
        </span>
      </nav>

      {/* 2. Primary Interactive Showcase Studio Grid (12-Col Responsive Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Master Visualizer & Studio Gallery (7 Cols) */}
        <div className="lg:col-span-7 w-full">
          <CarStudioVisualizer
            carName="AutoHub GT-e"
            activeTrim={activeTrim}
            activeColorHex={activeColorObj.hex}
            activeColorName={activeColorObj.name}
          />
        </div>

        {/* Right Column: Interactive Vehicle Configurator Panel (5 Cols) */}
        <div className="lg:col-span-5 w-full">
          <CarConfiguratorPanel
            activeTrim={activeTrim}
            onSelectTrim={setActiveTrim}
            activeColor={activeColor}
            onSelectColor={setActiveColor}
            onOpenDeposit={() => setIsDepositOpen(true)}
          />
        </div>
      </div>

      {/* 3. Technical Telemetry & Engineering Specifications */}
      <CarEngineeringSpecs />

      {/* 4. Car Deposit Modal (72h Online Reservation) */}
      <CarDepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        carName="AutoHub GT-e"
        trimName={currentTrimData?.name || 'GT-e Performance'}
        colorName={activeColorObj.name}
        depositAmount={20000000}
      />
    </div>
  );
};
