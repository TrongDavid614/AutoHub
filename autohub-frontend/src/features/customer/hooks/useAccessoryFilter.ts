import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Accessory, AccessoryCategory, AccessoryFilterParams } from '@/types/accessory.types';
import { accessoryService } from '../services/accessory.service';
import type { CarModelInfo } from '../mocks/accessory.mock';

const ACCESSORIES_PER_PAGE = 12;

export function useAccessoryFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryCarId = searchParams.get('carModelId') || searchParams.get('carId');
  const querySearch = searchParams.get('search') || '';

  const [selectedCarModel, setSelectedCarModel] = useState<CarModelInfo | null>(null);
  const [isCarModalOpen, setIsCarModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (queryCarId) {
      accessoryService.getCarModels().then((models) => {
        const found = models.find((m) => String(m.id) === queryCarId);
        if (found) setSelectedCarModel(found);
      });
    }
  }, [queryCarId]);

  const [categories, setCategories] = useState<AccessoryCategory[]>([]);
  const [categoryCountsMap, setCategoryCountsMap] = useState<Record<number, number> | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);

  const [draftSearch, setDraftSearch] = useState<{ urlSearch: string; value: string } | null>(null);
  const searchQuery = draftSearch?.urlSearch === querySearch ? draftSearch.value : querySearch;
  const setSearchQuery = useCallback(
    (value: string) => {
      setDraftSearch({ urlSearch: querySearch, value });
    },
    [querySearch]
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);

  const [readyInShowroom, setReadyInShowroom] = useState<boolean>(false);
  const [homeInstallation, setHomeInstallation] = useState<boolean>(false);
  const [isGenuine, setIsGenuine] = useState<boolean>(false);
  const [warrantyYears, setWarrantyYears] = useState<number | undefined>(undefined);

  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'newest'>('popular');
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loadedFilterKey, setLoadedFilterKey] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = ACCESSORIES_PER_PAGE;
  const selectedCarModelId = selectedCarModel?.id;

  const activeFilterKey = useMemo(
    () =>
      JSON.stringify([
        selectedCarModelId ?? null,
        selectedCategoryId ?? null,
        searchQuery,
        selectedPriceRange,
        readyInShowroom,
        homeInstallation,
        isGenuine,
        warrantyYears ?? null,
        sortBy,
      ]),
    [
      selectedCarModelId,
      selectedCategoryId,
      searchQuery,
      selectedPriceRange,
      readyInShowroom,
      homeInstallation,
      isGenuine,
      warrantyYears,
      sortBy,
    ]
  );
  const isLoading = loadedFilterKey !== activeFilterKey;

  // Load initial categories
  useEffect(() => {
    let isMounted = true;
    accessoryService.getCategories().then((cats) => {
      if (isMounted) {
        setCategories(cats);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch accessories when filters change
  useEffect(() => {
    let isMounted = true;

    let minPrice: number | undefined;
    let maxPrice: number | undefined;

    if (selectedPriceRange === 'under-5m') {
      maxPrice = 5000000;
    } else if (selectedPriceRange === '5m-20m') {
      minPrice = 5000000;
      maxPrice = 20000000;
    } else if (selectedPriceRange === 'above-20m') {
      minPrice = 20000000;
    }

    const params: AccessoryFilterParams = {
      carModelId: selectedCarModelId,
      categoryId: selectedCategoryId,
      search: searchQuery,
      minPrice,
      maxPrice,
      readyInShowroom: readyInShowroom ? true : undefined,
      homeInstallation: homeInstallation ? true : undefined,
      isGenuine: isGenuine ? true : undefined,
      warrantyYears,
      sortBy,
    };

    const isUnfiltered =
      !selectedCarModelId &&
      selectedCategoryId === undefined &&
      !searchQuery.trim() &&
      minPrice === undefined &&
      maxPrice === undefined &&
      !readyInShowroom &&
      !homeInstallation &&
      !isGenuine &&
      warrantyYears === undefined;

    accessoryService.getAccessories(params).then((items) => {
      if (isMounted) {
        setAccessories(items);
        setCurrentPage(1);
        if (isUnfiltered) {
          const counts: Record<number, number> = {};
          for (const item of items) {
            counts[item.categoryId] = (counts[item.categoryId] || 0) + 1;
          }
          setCategoryCountsMap(counts);
        }
        setLoadedFilterKey(activeFilterKey);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [
    activeFilterKey,
    selectedCarModelId,
    selectedCategoryId,
    searchQuery,
    selectedPriceRange,
    readyInShowroom,
    homeInstallation,
    isGenuine,
    warrantyYears,
    sortBy,
  ]);

  const resolvedCategories = useMemo<AccessoryCategory[]>(() => {
    if (!categoryCountsMap) return categories;
    return categories.map((cat) => ({
      ...cat,
      count: categoryCountsMap[cat.id] ?? 0,
    }));
  }, [categories, categoryCountsMap]);

  const clearAllFilters = () => {
    setSelectedCarModel(null);
    setSelectedCategoryId(undefined);
    setDraftSearch(null);
    setSelectedPriceRange(null);
    setReadyInShowroom(false);
    setHomeInstallation(false);
    setIsGenuine(false);
    setWarrantyYears(undefined);
    setSortBy('popular');
    setCurrentPage(1);
    if (searchParams.has('search')) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('search');
      setSearchParams(nextParams, { replace: true });
    }
  };

  // Pagination calculation
  const totalCount = accessories.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
  const paginatedAccessories = accessories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    selectedCarModel,
    setSelectedCarModel,
    isCarModalOpen,
    setIsCarModalOpen,
    categories: resolvedCategories,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    selectedPriceRange,
    setSelectedPriceRange,
    readyInShowroom,
    setReadyInShowroom,
    homeInstallation,
    setHomeInstallation,
    isGenuine,
    setIsGenuine,
    warrantyYears,
    setWarrantyYears,
    sortBy,
    setSortBy,
    accessories: paginatedAccessories,
    rawAccessories: accessories,
    totalCount,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    isLoading,
    clearAllFilters,
  };
}
