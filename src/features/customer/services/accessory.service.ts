import type { Accessory, AccessoryCategory, AccessoryFilterParams } from '@/types/accessory.types';
import {
  MOCK_ACCESSORIES,
  MOCK_ACCESSORY_CATEGORIES,
  MOCK_CAR_MODELS,
  type CarModelInfo,
} from '../mocks/accessory.mock';

export const accessoryService = {
  /**
   * Get list of accessories based on filter criteria
   */
  async getAccessories(params?: AccessoryFilterParams): Promise<Accessory[]> {
    // Simulate real network delay
    await new Promise((resolve) => setTimeout(resolve, 150));

    let items = [...MOCK_ACCESSORIES];

    if (!params) return items;

    // Filter by car model
    if (params.carModelId) {
      items = items.filter((item) =>
        item.compatibilities.some((c) => c.carModelId === params.carModelId)
      );
    }

    // Filter by category
    if (params.categoryId) {
      items = items.filter((item) => item.categoryId === params.categoryId);
    }

    // Filter by search query
    if (params.search?.trim()) {
      const q = params.search.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.categoryName.toLowerCase().includes(q) ||
          item.specPills?.some((p) => p.toLowerCase().includes(q))
      );
    }

    // Filter by price range
    if (params.minPrice !== undefined) {
      items = items.filter((item) => item.price >= (params.minPrice ?? 0));
    }
    if (params.maxPrice !== undefined) {
      items = items.filter((item) => item.price <= (params.maxPrice ?? Infinity));
    }

    // Filter by stock / delivery
    if (params.readyInShowroom) {
      items = items.filter((item) => item.readyInShowroom);
    }
    if (params.homeInstallation) {
      items = items.filter((item) => item.homeInstallation);
    }

    // Filter by certification / warranty
    if (params.isGenuine) {
      items = items.filter((item) => item.isGenuine);
    }
    if (params.warrantyYears) {
      items = items.filter((item) => (item.warrantyYears ?? 0) >= (params.warrantyYears ?? 0));
    }

    // Sorting
    if (params.sortBy) {
      switch (params.sortBy) {
        case 'price-asc':
          items.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          items.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          items.sort((a, b) => b.id - a.id);
          break;
        case 'popular':
        default:
          items.sort((a, b) => b.stockQuantity - a.stockQuantity);
          break;
      }
    }

    return items;
  },

  /**
   * Get single accessory by ID
   */
  async getAccessoryById(id: number): Promise<Accessory | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return MOCK_ACCESSORIES.find((item) => item.id === id);
  },

  /**
   * Get all categories with counts
   */
  async getCategories(): Promise<AccessoryCategory[]> {
    return MOCK_ACCESSORY_CATEGORIES;
  },

  /**
   * Get all compatible car models
   */
  async getCarModels(): Promise<CarModelInfo[]> {
    return MOCK_CAR_MODELS;
  },
};
