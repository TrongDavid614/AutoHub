import { useState, useMemo } from 'react';
import type { TrimId, TrimOption, CityOption, CostBreakdown } from '../types/estimator.types';

export const TRIM_OPTIONS: TrimOption[] = [
  {
    id: 'luxury',
    name: 'Luxury',
    spec: 'RWD • 450 HP',
    price: 2490000000,
    priceFormatted: '2.490.000.000 đ',
    wltp: '620 km WLTP • 4.1s',
  },
  {
    id: 'grand_touring',
    name: 'Grand Touring',
    spec: 'AWD DUAL-MOTOR • 680 HP',
    price: 2890000000,
    priceFormatted: '2.890.000.000 đ',
    wltp: '680 km WLTP • 3.2s (0-100)',
    isRecommended: true,
  },
  {
    id: 'track',
    name: 'Track Edition',
    spec: 'TRI-MOTOR TORQUE • 1.020 HP',
    price: 3290000000,
    priceFormatted: '3.290.000.000 đ',
    wltp: '600 km WLTP • 2.1s Carbon',
  },
];

export const CITY_OPTIONS: CityOption[] = [
  {
    id: 'hcm',
    name: 'TP. Hồ Chí Minh',
    taxRate: 0.1,
    plateFee: 20000000,
    displayLabel: 'TP. Hồ Chí Minh (Lệ phí trước bạ: 10% • Biển số: 20.000.000 đ)',
  },
  {
    id: 'hn',
    name: 'Hà Nội',
    taxRate: 0.12,
    plateFee: 20000000,
    displayLabel: 'Hà Nội (Lệ phí trước bạ: 12% • Biển số: 20.000.000 đ)',
  },
  {
    id: 'danang',
    name: 'Đà Nẵng / Cần Thơ / Hải Phòng',
    taxRate: 0.1,
    plateFee: 1000000,
    displayLabel: 'Đà Nẵng / Cần Thơ / Hải Phòng (Lệ phí trước bạ: 10% • Biển số: 1.000.000 đ)',
  },
  {
    id: 'other',
    name: 'Tỉnh / Thành phố khác',
    taxRate: 0.1,
    plateFee: 1000000,
    displayLabel: 'Tỉnh / Thành phố khác (Khu vực II/III: Biển số 1.000.000 đ)',
  },
];

export const FIXED_FEES = {
  inspectionAndRoad: 2160000,
  mandatoryInsurance: 480700,
  cashDiscountAmount: 50000000,
};

export const useCarEstimator = () => {
  const [selectedTrimId, setSelectedTrimId] = useState<TrimId>('grand_touring');
  const [selectedCityId, setSelectedCityId] = useState<string>('hcm');

  // Promos
  const [isTaxSupportChecked, setIsTaxSupportChecked] = useState<boolean>(true);
  const [isCashDiscountChecked, setIsCashDiscountChecked] = useState<boolean>(true);
  const [isRescuePackageChecked, setIsRescuePackageChecked] = useState<boolean>(false);

  // Modal state
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);

  const selectedTrim = useMemo(
    () => TRIM_OPTIONS.find((t) => t.id === selectedTrimId) || TRIM_OPTIONS[1],
    [selectedTrimId]
  );

  const selectedCity = useMemo(
    () => CITY_OPTIONS.find((c) => c.id === selectedCityId) || CITY_OPTIONS[0],
    [selectedCityId]
  );

  const breakdown: CostBreakdown = useMemo(() => {
    const listPrice = selectedTrim.price;
    const cashDiscount = isCashDiscountChecked ? FIXED_FEES.cashDiscountAmount : 0;

    const rawRegistrationTax = listPrice * selectedCity.taxRate;
    const taxSaved = isTaxSupportChecked ? rawRegistrationTax * 0.5 : 0;
    const finalRegistrationTax = rawRegistrationTax - taxSaved;

    const plateFee = selectedCity.plateFee;
    const inspectionFee = FIXED_FEES.inspectionAndRoad;
    const insuranceFee = FIXED_FEES.mandatoryInsurance;

    const totalRolloutCost =
      listPrice -
      cashDiscount +
      finalRegistrationTax +
      plateFee +
      inspectionFee +
      insuranceFee;

    return {
      listPrice,
      cashDiscount,
      taxRate: selectedCity.taxRate,
      rawRegistrationTax,
      finalRegistrationTax,
      taxSaved,
      plateFee,
      inspectionFee,
      insuranceFee,
      totalRolloutCost,
    };
  }, [
    selectedTrim,
    selectedCity,
    isTaxSupportChecked,
    isCashDiscountChecked,
  ]);

  return {
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
  };
};
