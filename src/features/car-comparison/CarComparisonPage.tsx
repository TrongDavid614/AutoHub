import React, { useState } from 'react';
import { ComparisonHeader } from './components/ComparisonHeader';
import { ComparisonActionBar } from './components/ComparisonActionBar';
import { ComparisonVehicleCards } from './components/ComparisonVehicleCards';
import { ComparisonMatrixTable } from './components/ComparisonMatrixTable';
import { ComparisonRadarBenchmark } from './components/ComparisonRadarBenchmark';
import { ComparisonBottomCta } from './components/ComparisonBottomCta';
import { COMPARISON_TRIMS, COMPARISON_SPEC_GROUPS } from './data/comparison.data';
import { CarDepositModal } from '@/features/cars';
import { TestDriveBookingModal } from '@/features/test-drive';

export const CarComparisonPage: React.FC = () => {
  const [onlyDifferences, setOnlyDifferences] = useState<boolean>(false);

  // Modals state
  const [depositModalOpen, setDepositModalOpen] = useState<boolean>(false);
  const [selectedDepositTrim, setSelectedDepositTrim] = useState<string>('AutoHub GT-e Grand Touring');

  const [testDriveModalOpen, setTestDriveModalOpen] = useState<boolean>(false);
  const [selectedTestDriveTrim, setSelectedTestDriveTrim] = useState<string>('AutoHub GT-e Grand Touring');

  const handleOpenDeposit = (trimName: string) => {
    setSelectedDepositTrim(trimName);
    setDepositModalOpen(true);
  };

  const handleOpenTestDrive = (trimName: string) => {
    setSelectedTestDriveTrim(trimName);
    setTestDriveModalOpen(true);
  };

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fadeIn">
      {/* 1. Top Meta & Breadcrumb Header */}
      <ComparisonHeader />

      {/* 2. Action Filter Bar */}
      <ComparisonActionBar
        onlyDifferences={onlyDifferences}
        onToggleDifferences={() => setOnlyDifferences((prev) => !prev)}
        onExportPdf={handleExportPdf}
      />

      {/* 3. Sticky Comparison Header Cards (Synchronized Viewport) */}
      <ComparisonVehicleCards
        trims={COMPARISON_TRIMS}
        onOpenDeposit={handleOpenDeposit}
        onOpenTestDrive={handleOpenTestDrive}
      />

      {/* 4. Detailed Specs Comparison Matrix */}
      <ComparisonMatrixTable
        specGroups={COMPARISON_SPEC_GROUPS}
        onlyDifferences={onlyDifferences}
      />

      {/* 5. Dynamic Benchmark: Telemetry Radar Breakdown */}
      <ComparisonRadarBenchmark />

      {/* 6. Bottom Decision CTA Banner */}
      <ComparisonBottomCta
        onOpenTestDriveModal={() => handleOpenTestDrive('AutoHub GT-e Grand Touring')}
      />

      {/* 7. Deposit Modal */}
      <CarDepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        carName="AutoHub GT-e"
        trimName={selectedDepositTrim}
        colorName="Xanh Công Nghệ Hyper Tech Blue"
        depositAmount={20000000}
      />

      {/* 8. Test Drive Modal */}
      <TestDriveBookingModal
        isOpen={testDriveModalOpen}
        onClose={() => setTestDriveModalOpen(false)}
        carModelName="AutoHub GT-e"
        variantName={selectedTestDriveTrim}
      />
    </div>
  );
};

export default CarComparisonPage;
