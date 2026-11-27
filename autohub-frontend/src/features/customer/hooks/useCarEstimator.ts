import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { TrimId, TrimOption, CityOption, CostBreakdown } from '../types/estimator.types';
import { carService, type EstimatorCalculationDto } from '../services/car.service';
import type { MockCar } from '@/types/car.types';

export const FIXED_FEES = {
  inspectionAndRoad: 1900000, // 340k dang kiem + 1560k duong bo
  mandatoryInsurance: 873400,  // TNDS bat buoc
  cashDiscountAmount: 50000000,
};

export const useCarEstimator = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const carIdParam = searchParams.get('carId');
  const trimIdParam = searchParams.get('trimId');

  const [allCars, setAllCars] = useState<MockCar[]>([]);
  const [currentCar, setCurrentCar] = useState<MockCar | null>(null);
  const [trims, setTrims] = useState<TrimOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);

  const [selectedTrimId, setSelectedTrimId] = useState<TrimId>('1');
  const [selectedCityId, setSelectedCityId] = useState<string>('1');

  const [apiCalculation, setApiCalculation] = useState<EstimatorCalculationDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Promos
  const [isTaxSupportChecked, setIsTaxSupportChecked] = useState<boolean>(true);
  const [isCashDiscountChecked, setIsCashDiscountChecked] = useState<boolean>(true);
  const [isRescuePackageChecked, setIsRescuePackageChecked] = useState<boolean>(false);

  // Modal state
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);

  // 1. Fetch real provinces on mount
  useEffect(() => {
    let isMounted = true;

    carService
      .getProvinces()
      .then((provinceList) => {
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
      })
      .catch(() => {
        if (isMounted) {
          setCities([]);
          setError('Chưa kết nối được Backend — không thể tải biểu phí tỉnh thành.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch all cars (for car switcher dropdown)
  useEffect(() => {
    let isMounted = true;
    carService
      .getAllCars()
      .then((carList) => {
        if (isMounted && carList && carList.length > 0) {
          setAllCars(carList);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAllCars([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 3. Fetch target car & its sibling variants/trims
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const targetCarId = carIdParam || trimIdParam || '1';

    carService
      .getCarById(targetCarId)
      .then((car) => {
        if (!isMounted) return;

        if (car) {
          setCurrentCar(car);

          if (car.variants && car.variants.length > 0) {
            const mappedTrims: TrimOption[] = car.variants.map((v, index) => {
              const price = v.listedPrice || v.giaNiemYet || car.listedPrice;
              return {
                id: String(v.id),
                name: v.variantName || v.tenPhienBan || v.name || car.name,
                spec: v.desc || (v.transmission || `${car.powertrain} • ${car.power}`),
                price,
                priceFormatted: `${price.toLocaleString('vi-VN')} đ`,
                wltp: v.tamHoatDongKm ? `${v.tamHoatDongKm} km` : car.range,
                isRecommended: Boolean(v.isCurrent) || index === 0,
                imageUrl: car.image,
              };
            });
            setTrims(mappedTrims);

            if (trimIdParam && mappedTrims.some((t) => t.id === trimIdParam)) {
              setSelectedTrimId(trimIdParam);
            } else if (carIdParam && mappedTrims.some((t) => t.id === carIdParam)) {
              setSelectedTrimId(carIdParam);
            } else {
              const currentVariant = car.variants.find((v) => v.isCurrent);
              setSelectedTrimId(currentVariant ? String(currentVariant.id) : mappedTrims[0].id);
            }
          } else {
            const singleTrim: TrimOption = {
              id: String(car.id),
              name: car.name,
              spec: `${car.powertrain} • ${car.power}`,
              price: car.listedPrice,
              priceFormatted: `${car.listedPrice.toLocaleString('vi-VN')} đ`,
              wltp: `${car.range} • ${car.acceleration}`,
              isRecommended: true,
              imageUrl: car.image,
            };
            setTrims([singleTrim]);
            setSelectedTrimId(singleTrim.id);
          }
          setLoading(false);
        } else {
          // Fallback: If not found, load from getAllCars
          carService
            .getAllCars()
            .then((carList) => {
              if (!isMounted) return;
              if (carList && carList.length > 0) {
                const fallbackCar = carList.find((c) => c.id === targetCarId) || carList[0];
                setCurrentCar(fallbackCar);
                const mappedTrims: TrimOption[] = carList.map((c, index) => ({
                  id: String(c.id),
                  name: c.name,
                  spec: `${c.powertrain} • ${c.power}`,
                  price: c.listedPrice,
                  priceFormatted: `${c.listedPrice.toLocaleString('vi-VN')} đ`,
                  wltp: `${c.range} • ${c.acceleration}`,
                  isRecommended: index === 0 || Boolean(c.badge?.includes('KHUYÊN DÙNG')),
                  imageUrl: c.image,
                }));
                setTrims(mappedTrims);
                const match = mappedTrims.find((t) => t.id === targetCarId);
                setSelectedTrimId(match ? match.id : mappedTrims[0].id);
              }
              setLoading(false);
            })
            .catch(() => {
              if (isMounted) {
                setError('Chưa kết nối được Backend — không thể tải danh sách phiên bản xe.');
                setLoading(false);
              }
            });
        }
      })
      .catch(() => {
        if (isMounted) {
          setCurrentCar(null);
          setTrims([]);
          setError('Chưa kết nối được Backend — không thể tải dữ liệu dự toán xe.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [carIdParam, trimIdParam]);

  // 4. Fetch calculation when variant or province changes
  useEffect(() => {
    let isMounted = true;
    const variantId = parseInt(selectedTrimId, 10);
    const tinhThanhId = parseInt(selectedCityId, 10) || 1;

    if (!isNaN(variantId)) {
      carService.calculateEstimator(variantId, tinhThanhId).then((calc) => {
        if (isMounted) {
          setApiCalculation(calc);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [selectedTrimId, selectedCityId]);

  const handleSelectCar = useCallback(
    (newCarId: string) => {
      setSearchParams({ carId: newCarId });
    },
    [setSearchParams]
  );

  const selectedTrim = useMemo(
    () => trims.find((t) => t.id === selectedTrimId) || trims[0] || null,
    [trims, selectedTrimId]
  );

  const selectedCity = useMemo(
    () => cities.find((c) => c.id === selectedCityId) || cities[0] || null,
    [cities, selectedCityId]
  );

  const breakdown: CostBreakdown = useMemo(() => {
    if (!selectedTrim || !selectedCity) {
      return {
        listPrice: 0,
        cashDiscount: 0,
        taxRate: 0,
        rawRegistrationTax: 0,
        finalRegistrationTax: 0,
        taxSaved: 0,
        plateFee: 0,
        inspectionFee: 0,
        insuranceFee: 0,
        totalRolloutCost: 0,
      };
    }

    const cashDiscount = isCashDiscountChecked ? FIXED_FEES.cashDiscountAmount : 0;

    if (apiCalculation) {
      const listPrice = apiCalculation.giaNiemYet || selectedTrim.price;
      const isElectric = Boolean(apiCalculation.isElectric);
      const rawRegistrationTax = isElectric ? 0 : apiCalculation.phiTruocBa;
      const taxSaved = isElectric
        ? (apiCalculation.phiTruocBaStandard || Math.round(listPrice * (apiCalculation.tyLePhiTruocBaStandard || 12) / 100))
        : (isTaxSupportChecked ? Math.round(rawRegistrationTax * 0.5) : 0);
      const finalRegistrationTax = isElectric ? 0 : (rawRegistrationTax - taxSaved);
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
        taxRate: isElectric ? 0 : (apiCalculation.tyLePhiTruocBa || 12) / 100,
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
    allCars,
    currentCar,
    loading,
    error,
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
  };
};
