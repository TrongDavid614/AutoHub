import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CarVariant } from '@/types/car.types';
import { MAX_COMPARE_CARS } from '@/config/constants';

interface CompareStore {
  selectedVariants: CarVariant[];
  addVariantToCompare: (variant: CarVariant) => boolean;
  removeVariantFromCompare: (variantId: number) => void;
  clearCompareList: () => void;
  isInCompareList: (variantId: number) => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      selectedVariants: [],

      addVariantToCompare: (variant: CarVariant) => {
        const { selectedVariants } = get();
        if (selectedVariants.some((v) => v.id === variant.id)) {
          return false;
        }
        if (selectedVariants.length >= MAX_COMPARE_CARS) {
          return false;
        }
        set({ selectedVariants: [...selectedVariants, variant] });
        return true;
      },

      removeVariantFromCompare: (variantId: number) => {
        set((state) => ({
          selectedVariants: state.selectedVariants.filter((v) => v.id !== variantId),
        }));
      },

      clearCompareList: () => set({ selectedVariants: [] }),

      isInCompareList: (variantId: number) => {
        return get().selectedVariants.some((v) => v.id === variantId);
      },
    }),
    {
      name: 'autohub_car_compare',
    }
  )
);
