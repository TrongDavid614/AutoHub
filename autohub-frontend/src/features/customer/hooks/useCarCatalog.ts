import { useState, useMemo, useEffect } from 'react';
import type { MockCar } from '@/types/car.types';
import { carService } from '../services/car.service';
import { matchesSearchTerms } from '@/lib/utils';

export const useCarCatalog = () => {
  const [viewMode, setViewMode] = useState<'GRID' | 'ROW'>('GRID');
  const [selectedSegment, setSelectedSegment] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'PRICE_ASC' | 'PRICE_DESC' | 'POWER'>('PRICE_ASC');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cars, setCars] = useState<MockCar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    carService
      .getAllCars()
      .then((data) => {
        if (isMounted) {
          setCars(data || []);
          setError(null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCars([]);
          setError('Chưa kết nối được Backend để tải danh sách xe.');
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
      const matchSearch = matchesSearchTerms(
        searchQuery,
        car.name,
        car.subtitle,
        car.segment,
        car.powertrain,
        car.seats
      );
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
    error,
  };
};
