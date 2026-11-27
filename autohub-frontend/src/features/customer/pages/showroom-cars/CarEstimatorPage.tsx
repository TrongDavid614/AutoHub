import React, { useRef, useEffect } from 'react';
import { EstimatorHeader } from '@/features/customer/components/EstimatorHeader';
import { ModelRibbon } from '@/features/customer/components/ModelRibbon';
import { TrimSelector } from '@/features/customer/components/TrimSelector';
import { CitySelector } from '@/features/customer/components/CitySelector';
import { PromoSelector } from '@/features/customer/components/PromoSelector';
import { CostBreakdownLedger } from '@/features/customer/components/CostBreakdownLedger';
import { useCarEstimator } from '@/features/customer/hooks/useCarEstimator';
import { CarDepositModal } from '@/features/customer';
import { usePageTracking } from '@/hooks/usePageTracking';

export const CarEstimatorPage: React.FC = () => {
  const {
    allCars,
    currentCar,
    loading,
    handleSelectCar,
    trims,
    cities,
    selectedTrimId,
    setSelectedTrimId,
    selectedTrim,
    selectedCityId,
    setSelectedCityId,
    selectedCity,
    isTaxSupportChecked,
    setIsTaxSupportChecked,
    isCashDiscountChecked,
    setIsCashDiscountChecked,
    isRescuePackageChecked,
    setIsRescuePackageChecked,
    isDepositModalOpen,
    setIsDepositModalOpen,
    breakdown,
  } = useCarEstimator();

  const ledgerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef<boolean>(true);

  const { trackAction } = usePageTracking({
    loaiThucThe: 'ESTIMATOR',
    maThucThe: Number(selectedTrimId) || undefined,
    metadata: {
      trimName: selectedTrim?.name,
      cityName: selectedCity?.name,
      totalRolloutCost: breakdown?.totalRolloutCost,
    },
    autoTrackView: true,
  });

  // Telemetry: Ghi nhận sự kiện khi khách tùy chỉnh thông số dự toán lăn bánh / trả góp
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    trackAction('CALCULATE_ESTIMATOR', {
      selectedTrimId,
      trimName: selectedTrim?.name,
      selectedCityId,
      cityName: selectedCity?.name,
      totalRolloutCost: breakdown?.totalRolloutCost,
      isTaxSupportChecked,
      isCashDiscountChecked,
      isRescuePackageChecked,
    });
  }, [
    selectedTrimId,
    selectedCityId,
    isTaxSupportChecked,
    isCashDiscountChecked,
    isRescuePackageChecked,
    trackAction,
  ]);

  const handleTriggerCalculate = () => {
    if (ledgerRef.current) {
      ledgerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  if (loading && !currentCar) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-text-muted text-sm font-mono">Đang tải biểu phí và dự toán chi tiết...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* 1. Header & Breadcrumbs */}
      <EstimatorHeader carName={currentCar?.name} />

      {/* 2. Primary Dynamic Calculator Two-Column Layout (7 Cols + 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Calculator Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Model Selector Ribbon */}
          <ModelRibbon
            currentCar={currentCar}
            allCars={allCars}
            onSelectCar={handleSelectCar}
          />

          {/* Section 2: Trim Switcher & Performance Spec Tiles */}
          <TrimSelector
            trims={trims}
            selectedTrimId={selectedTrimId}
            onSelectTrim={setSelectedTrimId}
          />

          {/* Section 3: City Registration Selector */}
          <CitySelector
            cities={cities}
            selectedCityId={selectedCityId}
            onSelectCity={setSelectedCityId}
          />

          {/* Section 4: Incentive & Exclusive Promos Module */}
          <PromoSelector
            isTaxSupportChecked={isTaxSupportChecked}
            onToggleTaxSupport={setIsTaxSupportChecked}
            isCashDiscountChecked={isCashDiscountChecked}
            onToggleCashDiscount={setIsCashDiscountChecked}
            isRescuePackageChecked={isRescuePackageChecked}
            onToggleRescuePackage={setIsRescuePackageChecked}
            onTriggerCalculate={handleTriggerCalculate}
          />
        </div>

        {/* Right Column: Detailed Breakdown & Action Hub (5 Cols) */}
        <div ref={ledgerRef} className="lg:col-span-5 sticky top-20">
          <CostBreakdownLedger
            selectedTrim={selectedTrim}
            selectedCity={selectedCity}
            breakdown={breakdown}
            onOpenDepositModal={() => setIsDepositModalOpen(true)}
            currentCar={currentCar}
          />
        </div>
      </div>

      {/* 3. Car Deposit Modal (72H Reservation Flow) */}
      <CarDepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        variantId={selectedTrimId}
        carName={currentCar?.name || selectedTrim.name}
        trimName={selectedTrim.spec}
        colorName="Xanh Công Nghệ Hyper Tech Blue"
        depositAmount={currentCar?.depositAmount || 20000000}
      />
    </div>
  );
};

export default CarEstimatorPage;
