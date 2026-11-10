import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { TrimId, TrimOption, CityOption, CostBreakdown } from '../types/estimator.types';
import { carService, type EstimatorCalculationDto } from '../services/car.service';

export const DEFAULT_TRIM_OPTIONS: TrimOption[] = [
  {
    id: '1',
    name: 'AutoHub GT-e Grand Touring',
    spec: 'Dual-Motor AWD • 680 HP',
    price: 2890000000,
    priceFormatted: '2.890.000.000 đ',
    wltp: '680 km WLTP • 3.2s (0-100)',
    isRecommended: true,
  },
  {
    id: '2',
    name: 'AutoHub GT-e Track Edition',
    spec: 'Tri-Motor Hyper AWD • 1.020 HP',
    price: 3490000000,
    priceFormatted: '3.490.000.000 đ',
    wltp: '600 km WLTP • 2.8s Hyper',
  },
  {
    id: '3',
    name: 'AutoHub GT-e Standard',
    spec: 'Single-Motor RWD • 450 HP',
    price: 2490000000,
    priceFormatted: '2.490.000.000 đ',
    wltp: '580 km WLTP • 4.5s',
  },
];

export const DEFAULT_CITY_OPTIONS: CityOption[] = [
  {
    id: '1',
    name: 'Hà Nội',
    taxRate: 0.12,
    plateFee: 20000000,
    displayLabel: 'Hà Nội (Vùng 1 - Biển số: 20.000.000 đ)',
  },
  {
    id: '2',
    name: 'TP. Hồ Chí Minh',
    taxRate: 0.12,
    plateFee: 20000000,
    displayLabel: 'TP. Hồ Chí Minh (Vùng 1 - Biển số: 20.000.000 đ)',
  },
  {
    id: '3',
    name: 'Đà Nẵng',
    taxRate: 0.10,
    plateFee: 1000000,
    displayLabel: 'Đà Nẵng (Vùng 2 - Biển số: 1.000.000 đ)',
  },
  {
    id: '4',
    name: 'Hải Phòng',
    taxRate: 0.10,
    plateFee: 1000000,
    displayLabel: 'Hải Phòng (Vùng 2 - Biển số: 1.000.000 đ)',
  },
];

export const FIXED_FEES = {
  inspectionAndRoad: 1900000, // 340k dang kiem + 1560k duong bo
  mandatoryInsurance: 873400,  // TNDS bat buoc
  cashDiscountAmount: 50000000,
};

export const useCarEstimator = () => {
  const [searchParams] = useSearchParams();
  const initialCarId = searchParams.get('carId') || searchParams.get('trimId') || '1';

  const [trims, setTrims] = useState<TrimOption[]>(DEFAULT_TRIM_OPTIONS);
  const [cities, setCities] = useState<CityOption[]>(DEFAULT_CITY_OPTIONS);

  const [selectedTrimId, setSelectedTrimId] = useState<TrimId>(initialCarId);
  const [selectedCityId, setSelectedCityId] = useState<string>('1');

  const [apiCalculation, setApiCalculation] = useState<EstimatorCalculationDto | null>(null);

  // Promos
  const [isTaxSupportChecked, setIsTaxSupportChecked] = useState<boolean>(true);
  const [isCashDiscountChecked, setIsCashDiscountChecked] = useState<boolean>(true);
  const [isRescuePackageChecked, setIsRescuePackageChecked] = useState<boolean>(false);

  // Modal state
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);

  // 1. Fetch real cars & provinces on mount
  useEffect(() => {
    let isMounted = true;

    // Load real cars from database
    carService.getAllCars().then((carList) => {
      if (isMounted && carList && carList.length > 0) {
        const mappedTrims: TrimOption[] = carList.slice(0, 6).map((c, index) => ({
          id: String(c.id),
          name: c.name,
          spec: `${c.powertrain} • ${c.power}`,
          price: c.listedPrice,
          priceFormatted: `${c.listedPrice.toLocaleString('vi-VN')} đ`,
          wltp: `${c.range} • ${c.acceleration}`,
          isRecommended: index === 0 || c.badge.includes('KHUYÊN DÙNG'),
        }));
        setTrims(mappedTrims);
        if (mappedTrims.some((t) => t.id === initialCarId)) {
          setSelectedTrimId(initialCarId);
        } else if (!mappedTrims.some((t) => t.id === selectedTrimId)) {
          setSelectedTrimId(mappedTrims[0].id);
        }
      }
    });

    // Load real provinces from database
    carService.getProvinces().then((provinceList) => {
      if (isMounted && provinceList && provinceList.length > 0) {
        const mappedCities: CityOption[] = provinceList.map((p) => {
          const isVung1 = p.phanVungBienSo.includes('1');
          const taxRate = isVung1 ? 0.12 : 0.10;
          const plateFee = isVung1 ? 20000000 : 1000000;
          return {
            id: String(p.id),
            name: p.tenTinh,
            taxRate,
            plateFee,
            displayLabel: `${p.tenTinh} (${p.phanVungBienSo} - Biển số: ${plateFee.toLocaleString('vi-VN')} đ)`,
          };
        });
        setCities(mappedCities);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch calculation when variant or province changes
  useEffect(() => {
    let isMounted = true;
    const variantId = parseInt(selectedTrimId, 10) || 1;
    const tinhThanhId = parseInt(selectedCityId, 10) || 1;

    carService.calculateEstimator(variantId, tinhThanhId).then((calc) => {
      if (isMounted) {
        setApiCalculation(calc);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedTrimId, selectedCityId]);

  const selectedTrim = useMemo(
    () => trims.find((t) => t.id === selectedTrimId) || trims[0] || DEFAULT_TRIM_OPTIONS[0],
    [trims, selectedTrimId]
  );

  const selectedCity = useMemo(
    () => cities.find((c) => c.id === selectedCityId) || cities[0] || DEFAULT_CITY_OPTIONS[0],
    [cities, selectedCityId]
  );

  const breakdown: CostBreakdown = useMemo(() => {
    const cashDiscount = isCashDiscountChecked ? FIXED_FEES.cashDiscountAmount : 0;

    if (apiCalculation) {
      const listPrice = apiCalculation.giaNiemYet || selectedTrim.price;
      const rawRegistrationTax = apiCalculation.phiTruocBa;
      const taxSaved = isTaxSupportChecked ? Math.round(rawRegistrationTax * 0.5) : 0;
      const finalRegistrationTax = rawRegistrationTax - taxSaved;
      const plateFee = apiCalculation.phiCapBienSo;
      const inspectionFee = (apiCalculation.phiDangKiem || 340000) + (apiCalculation.phiBaoTriDuongBo || 1560000);
      const insuranceFee = apiCalculation.phiBaoHiemTnds || FIXED_FEES.mandatoryInsurance;

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
        taxRate: (apiCalculation.tyLePhiTruocBa || 12) / 100,
        rawRegistrationTax,
        finalRegistrationTax,
        taxSaved,
        plateFee,
        inspectionFee,
        insuranceFee,
        totalRolloutCost,
      };
    }

    // Client-side fallback calculation
    const listPrice = selectedTrim.price;
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
    apiCalculation,
    selectedTrim,
    selectedCity,
    isTaxSupportChecked,
    isCashDiscountChecked,
  ]);

  return {
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
  };
};
