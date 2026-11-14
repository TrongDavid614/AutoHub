import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { ComparisonHeader } from '@/features/customer/components/ComparisonHeader';
import { ComparisonActionBar } from '@/features/customer/components/ComparisonActionBar';
import { ComparisonVehicleCards } from '@/features/customer/components/ComparisonVehicleCards';
import { ComparisonMatrixTable } from '@/features/customer/components/ComparisonMatrixTable';
import { ComparisonRadarBenchmark } from '@/features/customer/components/ComparisonRadarBenchmark';
import { ComparisonBottomCta } from '@/features/customer/components/ComparisonBottomCta';
import { SelectCarCompareModal } from '@/features/customer/components/SelectCarCompareModal';
import { CarDepositModal } from '@/features/customer/components/detail/CarDepositModal';
import { TestDriveBookingModal } from '@/features/customer/components/TestDriveBookingModal';
import { carService } from '@/features/customer/services/car.service';
import { COMPARISON_TRIMS, COMPARISON_SPEC_GROUPS } from '@/features/customer/mocks/comparison.data';
import { useCompareStore } from '@/store/useCompareStore';
import type {
  CarComparisonData,
  VehicleComparisonTrim,
} from '@/features/customer/types/comparison.types';
import type { CarVariant } from '@/types/car.types';

export const CarComparisonPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const setVariantsToCompare = useCompareStore((s) => s.setVariantsToCompare);

  const [data, setData] = useState<CarComparisonData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [onlyDifferences, setOnlyDifferences] = useState<boolean>(false);

  // Modals state
  const [depositModalOpen, setDepositModalOpen] = useState<boolean>(false);
  const [selectedDepositTrim, setSelectedDepositTrim] = useState<VehicleComparisonTrim | null>(null);

  const [testDriveModalOpen, setTestDriveModalOpen] = useState<boolean>(false);
  const [selectedTestDriveTrim, setSelectedTestDriveTrim] = useState<VehicleComparisonTrim | null>(null);

  const [selectCarModalOpen, setSelectCarModalOpen] = useState<boolean>(false);
  const [replacingTrim, setReplacingTrim] = useState<VehicleComparisonTrim | null>(null);

  // Parse IDs from searchParams or fallback to compare store or default [1, 2, 3]
  const targetIds = useMemo<number[]>(() => {
    const rawIds = searchParams.get('ids');
    if (rawIds) {
      const parsed = rawIds
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => !isNaN(n) && n > 0);
      if (parsed.length > 0) {
        return parsed.slice(0, 3);
      }
    }
    const storeVariants = useCompareStore.getState().selectedVariants;
    if (storeVariants && storeVariants.length > 0) {
      return storeVariants.map((v) => Number(v.id)).slice(0, 3);
    }
    return [1, 2, 3];
  }, [searchParams]);

  // Fetch comparison data from backend
  const fetchComparison = useCallback(async (idsToFetch: number[]) => {
    setLoading(true);
    setError(null);
    try {
      const result = await carService.getCarComparison(idsToFetch);
      if (result && result.trims && result.trims.length > 0) {
        setData(result);

        // Sync URL query params with actual retrieved trims
        const resolvedIds = result.trims.map((t) => t.id).join(',');
        setSearchParams({ ids: resolvedIds }, { replace: true });

        // Sync useCompareStore so Header badge and store match 100%
        const storeVariants: CarVariant[] = result.trims.map((t) => ({
          id: Number(t.id),
          modelId: 1,
          variantName: t.name,
          engineSpecs: t.powertrain,
          listedPrice: t.price,
          depositPrice: t.depositAmount || 20000000,
          images: [{ id: 1, imageUrl: t.imageUrl, viewType: 'THUMBNAIL', displayOrder: 1 }],
        }));
        setVariantsToCompare(storeVariants);
      } else {
        // Fallback to mock data if API returns empty
        setData({
          trims: COMPARISON_TRIMS,
          specGroups: COMPARISON_SPEC_GROUPS,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải dữ liệu so sánh xe';
      setError(msg);
      // Resilient fallback to mock data
      setData({
        trims: COMPARISON_TRIMS,
        specGroups: COMPARISON_SPEC_GROUPS,
      });
    } finally {
      setLoading(false);
    }
  }, [setSearchParams, setVariantsToCompare]);

  useEffect(() => {
    fetchComparison(targetIds);
  }, [fetchComparison, targetIds]);

  // Statistics on differences
  const { totalDifferencesCount, totalSpecsCount } = useMemo(() => {
    if (!data?.specGroups) return { totalDifferencesCount: 0, totalSpecsCount: 0 };
    let diff = 0;
    let total = 0;
    for (const group of data.specGroups) {
      for (const row of group.rows) {
        total++;
        if (Boolean(row.isDifferent ?? (row as { different?: boolean }).different)) diff++;
      }
    }
    return { totalDifferencesCount: diff, totalSpecsCount: total };
  }, [data]);

  // Actions
  const handleOpenDeposit = (trim: VehicleComparisonTrim) => {
    setSelectedDepositTrim(trim);
    setDepositModalOpen(true);
  };

  const handleOpenTestDrive = (trim: VehicleComparisonTrim) => {
    setSelectedTestDriveTrim(trim);
    setTestDriveModalOpen(true);
  };

  const handleRemoveTrim = (trimId: string | number) => {
    if (!data || data.trims.length <= 1) return;
    const remainingIds = data.trims
      .filter((t) => String(t.id) !== String(trimId))
      .map((t) => Number(t.id));
    fetchComparison(remainingIds);
  };

  const handleOpenAddTrim = () => {
    setReplacingTrim(null);
    setSelectCarModalOpen(true);
  };

  const handleOpenChangeTrim = (trim: VehicleComparisonTrim) => {
    setReplacingTrim(trim);
    setSelectCarModalOpen(true);
  };

  const handleSelectCarFromModal = (newCarId: number) => {
    if (!data) {
      fetchComparison([newCarId]);
      return;
    }

    let updatedIds: number[];
    if (replacingTrim) {
      // Replace existing trim
      updatedIds = data.trims.map((t) =>
        String(t.id) === String(replacingTrim.id) ? newCarId : Number(t.id)
      );
    } else {
      // Add new trim
      const currentIds = data.trims.map((t) => Number(t.id));
      if (!currentIds.includes(newCarId)) {
        updatedIds = [...currentIds, newCarId].slice(0, 3);
      } else {
        updatedIds = currentIds;
      }
    }

    fetchComparison(updatedIds);
  };

  const handleResetDefault = () => {
    fetchComparison([1, 2, 3]);
  };

  const handleExportPdf = () => {
    window.print();
  };

  const currentSelectedNumericIds = useMemo(() => {
    return data?.trims.map((t) => Number(t.id)) || [];
  }, [data]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fadeIn print:p-0 print:m-0 print:space-y-4">
      {/* 1. Top Meta & Breadcrumb Header */}
      <ComparisonHeader />

      {/* Error notification banner if any */}
      {error && (
        <div className="no-print p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Đang hiển thị dữ liệu dự phòng: {error}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchComparison(targetIds)}
            className="underline font-bold hover:text-white transition-colors cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* 2. Action Filter Bar */}
      <ComparisonActionBar
        onlyDifferences={onlyDifferences}
        onToggleDifferences={() => setOnlyDifferences((prev) => !prev)}
        onExportPdf={handleExportPdf}
        carCount={data?.trims.length || 0}
        totalDifferencesCount={totalDifferencesCount}
        totalSpecsCount={totalSpecsCount}
        onResetDefault={handleResetDefault}
      />

      {loading && !data ? (
        <div className="py-24 flex flex-col items-center justify-center gap-4 text-text-muted">
          <RefreshCw className="w-8 h-8 animate-spin text-accent-primary" />
          <p className="text-sm font-mono">Đang tải bàn cân so sánh từ cơ sở dữ liệu...</p>
        </div>
      ) : data ? (
        <>
          {/* 3. Sticky Comparison Header Cards (Synchronized Viewport) */}
          <ComparisonVehicleCards
            trims={data.trims}
            onOpenDeposit={handleOpenDeposit}
            onOpenTestDrive={handleOpenTestDrive}
            onRemoveTrim={handleRemoveTrim}
            onChangeTrim={handleOpenChangeTrim}
            onAddTrim={handleOpenAddTrim}
          />

          {/* 4. Detailed Specs Comparison Matrix */}
          <ComparisonMatrixTable
            trims={data.trims}
            specGroups={data.specGroups}
            onlyDifferences={onlyDifferences}
          />

          {/* 5. Dynamic Benchmark: Telemetry Radar Breakdown */}
          <div className="no-print">
            <ComparisonRadarBenchmark
              trims={data.trims}
              benchmarkMetrics={data.benchmarkMetrics}
            />
          </div>

          {/* 6. Bottom Decision CTA Banner */}
          <div className="no-print">
            <ComparisonBottomCta
              onOpenTestDriveModal={() => {
                if (data.trims.length > 0) {
                  handleOpenTestDrive(data.trims[0]);
                }
              }}
            />
          </div>
        </>
      ) : (
        <div className="py-16 text-center space-y-3">
          <p className="text-sm text-text-muted">Không có thông tin xe để so sánh.</p>
          <button
            type="button"
            onClick={handleResetDefault}
            className="px-4 py-2 rounded bg-accent-action text-accent-contrast text-xs font-bold"
          >
            Tải mẫu xe mặc định
          </button>
        </div>
      )}

      {/* 7. Deposit Modal */}
      {selectedDepositTrim && (
        <CarDepositModal
          isOpen={depositModalOpen}
          onClose={() => setDepositModalOpen(false)}
          variantId={Number(selectedDepositTrim.id)}
          carName={selectedDepositTrim.modelName || selectedDepositTrim.name}
          trimName={selectedDepositTrim.name}
          colorName="Xanh Riviera"
          depositAmount={selectedDepositTrim.depositAmount || 20000000}
        />
      )}

      {/* 8. Test Drive Modal */}
      {selectedTestDriveTrim && (
        <TestDriveBookingModal
          isOpen={testDriveModalOpen}
          onClose={() => setTestDriveModalOpen(false)}
          carModelName={selectedTestDriveTrim.modelName || selectedTestDriveTrim.name}
          variantName={selectedTestDriveTrim.name}
        />
      )}

      {/* 9. Select / Change Car Modal */}
      <SelectCarCompareModal
        isOpen={selectCarModalOpen}
        onClose={() => {
          setSelectCarModalOpen(false);
          setReplacingTrim(null);
        }}
        onSelectCar={handleSelectCarFromModal}
        currentSelectedIds={currentSelectedNumericIds}
        replacingCarName={replacingTrim?.name}
      />
    </div>
  );
};

export default CarComparisonPage;
