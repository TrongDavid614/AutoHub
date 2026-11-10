import type { Accessory, AccessoryCategory, AccessoryFilterParams } from '@/types/accessory.types';
import { type CarModelInfo } from '../mocks/accessory.mock';
import { carService } from './car.service';

const API_BASE = 'http://localhost:8080/api';

export const accessoryService = {
  /**
   * Get list of accessories based on filter criteria
   */
  async getAccessories(params?: AccessoryFilterParams): Promise<Accessory[]> {
    try {
      const queryParts: string[] = [];
      if (params?.categoryId) queryParts.push(`categoryId=${params.categoryId}`);
      if (params?.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
      if (params?.minPrice !== undefined) queryParts.push(`minPrice=${params.minPrice}`);
      if (params?.maxPrice !== undefined) queryParts.push(`maxPrice=${params.maxPrice}`);

      const url = `${API_BASE}/customer/accessories${queryParts.length ? '?' + queryParts.join('&') : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          let items: Accessory[] = json.data;
          if (params?.carModelId) {
            items = items.filter((item: any) =>
              Boolean(item.dungChung) ||
              Boolean(item.isUniversal) ||
              item.compatibilities?.some((c: any) => String(c.carModelId) === String(params.carModelId))
            );
          }
          if (params?.sortBy) {
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
                items.sort((a, b) => (b.stockQuantity || 0) - (a.stockQuantity || 0));
                break;
            }
          }
          return items;
        }
      }
    } catch {
      // network error
    }

    return [];
  },

  /**
   * Get single accessory by ID
   */
  async getAccessoryById(id: number): Promise<Accessory | undefined> {
    try {
      const res = await fetch(`${API_BASE}/customer/accessories/${id}`);
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          return json.data;
        }
      }
    } catch {
      // network error
    }
    return undefined;
  },

  /**
   * Get all categories with counts
   */
  async getCategories(): Promise<AccessoryCategory[]> {
    try {
      const res = await fetch(`${API_BASE}/customer/accessories/categories`);
      if (res.ok) {
        const json = await res.json();
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          return json.data.map((c: any) => ({
            id: c.id,
            categoryName: c.categoryName || c.tenDanhMuc || c.name || 'Phụ kiện',
            slug: c.slug || (c.id === 1 ? 'charging-energy' : c.id === 2 ? 'camera-sensors' : c.id === 3 ? 'window-films' : 'floor-mats'),
            count: c.count || 3,
          }));
        }
      }
    } catch {
      // network error
    }
    return [];
  },

  /**
   * Get all compatible car models from database
   */
  async getCarModels(): Promise<CarModelInfo[]> {
    try {
      const cars = await carService.getAllCars();
      if (cars && cars.length > 0) {
        return cars.map((c) => ({
          id: Number(c.id),
          name: c.name,
          yearRange: '2024 – 2026',
          architecture: c.powertrain || '800V ARCHITECTURE',
          thumbnailUrl: c.image,
          accessoryCount: 6,
        }));
      }
    } catch {
      // network error
    }
    return [];
  },
};

