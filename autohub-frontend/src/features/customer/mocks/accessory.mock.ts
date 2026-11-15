import type { Accessory, AccessoryCategory } from '@/types/accessory.types';

export interface CarModelInfo {
  id: number;
  name: string;
  yearRange: string;
  architecture: string;
  thumbnailUrl: string;
  accessoryCount: number;
}

export const MOCK_CAR_MODELS: CarModelInfo[] = [];

export const MOCK_ACCESSORY_CATEGORIES: AccessoryCategory[] = [];

export const MOCK_ACCESSORIES: Accessory[] = [];
