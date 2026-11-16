import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CarVariant } from '@/types/car.types';
import { MAX_COMPARE_CARS } from '@/config/constants';

interface CompareStore {
  selectedVariants: CarVariant[];
  addVariantToCompare: (variant: CarVariant) => boolean;
  removeVariantFromCompare: (variantId: number) => void;
  setVariantsToCompare: (variants: CarVariant[]) => void;
  clearCompareList: () => void;
  isInCompareList: (variantId: number) => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      selectedVariants: [],

      addVariantToCompare: (variant: CarVariant) => {
        const { selectedVariants } = get();
        // If already in list, do not duplicate
        if (selectedVariants.some((v) => Number(v.id) === Number(variant.id))) {
          return true;
        }
        // If already reached max capacity, replace the last car so user action always succeeds
        if (selectedVariants.length >= MAX_COMPARE_CARS) {
          const trimmed = selectedVariants.slice(0, MAX_COMPARE_CARS - 1);
          set({ selectedVariants: [...trimmed, variant] });
          return true;
        }
        set({ selectedVariants: [...selectedVariants, variant] });
        return true;
      },

      removeVariantFromCompare: (variantId: number) => {
        set((state) => ({
          selectedVariants: state.selectedVariants.filter((v) => Number(v.id) !== Number(variantId)),
        }));
      },

      setVariantsToCompare: (variants: CarVariant[]) => {
        set({ selectedVariants: variants.slice(0, MAX_COMPARE_CARS) });
      },

      clearCompareList: () => set({ selectedVariants: [] }),

      isInCompareList: (variantId: number) => {
        return get().selectedVariants.some((v) => Number(v.id) === Number(variantId));
      },
    }),
    {
      name: 'autohub_car_compare',
    }
  )
);
