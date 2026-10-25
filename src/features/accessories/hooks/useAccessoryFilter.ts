import { useState, useEffect } from 'react';
import type { Accessory, AccessoryCategory, AccessoryFilterParams } from '@/types/accessory.types';
import { accessoryService } from '../services/accessory.service';
import { MOCK_CAR_MODELS, type CarModelInfo } from '../mocks/accessory.mock';

export function useAccessoryFilter() {
  const [selectedCarModel, setSelectedCarModel] = useState<CarModelInfo>(MOCK_CAR_MODELS[0]);
  const [isCarModalOpen, setIsCarModalOpen] = useState<boolean>(false);

  const [categories, setCategories] = useState<AccessoryCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);

  const [readyInShowroom, setReadyInShowroom] = useState<boolean>(false);
  const [homeInstallation, setHomeInstallation] = useState<boolean>(false);
  const [isGenuine, setIsGenuine] = useState<boolean>(false);
  const [warrantyYears, setWarrantyYears] = useState<number | undefined>(undefined);

  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'newest'>('popular');
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;

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
      carModelId: selectedCarModel.id,
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

    accessoryService.getAccessories(params).then((items) => {
      if (isMounted) {
        setAccessories(items);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [
    selectedCarModel.id,
    selectedCategoryId,
    searchQuery,
    selectedPriceRange,
    readyInShowroom,
    homeInstallation,
    isGenuine,
    warrantyYears,
    sortBy,
  ]);

  const clearAllFilters = () => {
    setSelectedCategoryId(undefined);
    setSearchQuery('');
    setSelectedPriceRange(null);
    setReadyInShowroom(false);
    setHomeInstallation(false);
    setIsGenuine(false);
    setWarrantyYears(undefined);
    setSortBy('popular');
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
    categories,
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
