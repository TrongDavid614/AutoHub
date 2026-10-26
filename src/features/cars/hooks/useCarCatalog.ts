import { useState, useMemo } from 'react';
import { MOCK_CARS } from '../mocks/car.mock';

export const useCarCatalog = () => {
  const [viewMode, setViewMode] = useState<'GRID' | 'ROW'>('GRID');
  const [selectedSegment, setSelectedSegment] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'PRICE_ASC' | 'PRICE_DESC' | 'POWER'>('PRICE_ASC');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const segments = useMemo(() => {
    const list = Array.from(new Set(MOCK_CARS.map((c) => c.segment)));
    return ['ALL', ...list];
  }, []);

  const filteredCars = useMemo(() => {
    return MOCK_CARS.filter((car) => {
      const matchSegment = selectedSegment === 'ALL' || car.segment === selectedSegment;
      const matchSearch =
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSegment && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.listedPrice - b.listedPrice;
      if (sortBy === 'PRICE_DESC') return b.listedPrice - a.listedPrice;
      if (sortBy === 'POWER') {
        const pA = parseInt(a.power) || 0;
        const pB = parseInt(b.power) || 0;
        return pB - pA;
      }
      return 0;
    });
  }, [selectedSegment, searchQuery, sortBy]);

  return {
    viewMode,
    setViewMode,
    selectedSegment,
    setSelectedSegment,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    segments,
    filteredCars,
  };
};
