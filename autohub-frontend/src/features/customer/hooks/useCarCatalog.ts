import { useState, useMemo, useEffect } from 'react';
import type { MockCar } from '../mocks/car.mock';
import { carService } from '../services/car.service';

export const useCarCatalog = () => {
  const [viewMode, setViewMode] = useState<'GRID' | 'ROW'>('GRID');
  const [selectedSegment, setSelectedSegment] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'PRICE_ASC' | 'PRICE_DESC' | 'POWER'>('PRICE_ASC');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cars, setCars] = useState<MockCar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    carService.getAllCars().then((data) => {
      if (isMounted) {
        setCars(data || []);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const segments = useMemo(() => {
    const list = Array.from(new Set(cars.map((c) => c.segment)));
    return ['ALL', ...list];
  }, [cars]);

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
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
  }, [cars, selectedSegment, searchQuery, sortBy]);

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
    cars,
    loading,
  };
};
