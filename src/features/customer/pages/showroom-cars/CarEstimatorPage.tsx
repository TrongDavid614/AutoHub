import React, { useRef } from 'react';
import { EstimatorHeader } from '@/features/customer/components/EstimatorHeader';
import { ModelRibbon } from '@/features/customer/components/ModelRibbon';
import { TrimSelector } from '@/features/customer/components/TrimSelector';
import { CitySelector } from '@/features/customer/components/CitySelector';
import { PromoSelector } from '@/features/customer/components/PromoSelector';
import { CostBreakdownLedger } from '@/features/customer/components/CostBreakdownLedger';
import { useCarEstimator, TRIM_OPTIONS, CITY_OPTIONS } from '@/features/customer/hooks/useCarEstimator';
import { CarDepositModal } from '@/features/customer';

export const CarEstimatorPage: React.FC = () => {
  const {
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

  const handleTriggerCalculate = () => {
    if (ledgerRef.current) {
      ledgerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* 1. Header & Breadcrumbs */}
      <EstimatorHeader />

      {/* 2. Primary Dynamic Calculator Two-Column Layout (7 Cols + 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Calculator Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Model Selector Ribbon */}
          <ModelRibbon />

          {/* Section 2: Trim Switcher & Performance Spec Tiles */}
          <TrimSelector
            trims={TRIM_OPTIONS}
            selectedTrimId={selectedTrimId}
            onSelectTrim={setSelectedTrimId}
          />

          {/* Section 3: City Registration Selector */}
          <CitySelector
            cities={CITY_OPTIONS}
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
          />
        </div>
      </div>

      {/* 3. Car Deposit Modal (72H Reservation Flow) */}
      <CarDepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        carName="AutoHub GT-e"
        trimName={selectedTrim.name}
        colorName="Xanh Công Nghệ Hyper Tech Blue"
        depositAmount={20000000}
      />
    </div>
  );
};

export default CarEstimatorPage;
