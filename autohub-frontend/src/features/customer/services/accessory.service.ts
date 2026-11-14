import { axiosClient } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type { Accessory, AccessoryCategory, AccessoryFilterParams, AccessoryCompatibility } from '@/types/accessory.types';
import { type CarModelInfo } from '../mocks/accessory.mock';
import { carService } from './car.service';

interface RawCategoryDto {
  id: number;
  categoryName?: string;
  tenDanhMuc?: string;
  name?: string;
  slug?: string;
  count?: number;
}

interface RawAccessoryDto extends Accessory {
  dungChung?: boolean;
  isUniversal?: boolean;
}

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

      const url = `/customer/accessories${queryParts.length ? '?' + queryParts.join('&') : ''}`;
      const res = await axiosClient.get<unknown, ApiResponse<RawAccessoryDto[]>>(url);
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        let items: Accessory[] = res.data;
        if (params?.carModelId) {
          const modelIdStr = String(params.carModelId);
          items = items.filter((item: RawAccessoryDto) =>
            Boolean(item.dungChung) ||
            Boolean(item.isUniversal) ||
            item.compatibilities?.some((c: AccessoryCompatibility) => String(c.carModelId) === modelIdStr)
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
    } catch {
      // network error
    }

    return [];
  },

  /**
   * Get accessory details by id
   */
  async getAccessoryById(id: number): Promise<Accessory | null> {
    try {
      const res = await axiosClient.get<unknown, ApiResponse<Accessory>>(`/customer/accessories/${id}`);
      if (res?.data) {
        const item = res.data;
        const compatibilities = item.compatibilities ?? item.compatibility ?? [];
        const images = (item.images && item.images.length > 0)
          ? item.images
          : (item.galleryUrls && item.galleryUrls.length > 0)
            ? item.galleryUrls
            : (item.thumbnailUrl ? [item.thumbnailUrl] : []);
        return {
          ...item,
          images,
          galleryUrls: images,
          compatibilities,
          compatibility: compatibilities,
          specifications: item.specifications ?? {},
          specPills: item.specPills ?? [],
          reviews: item.reviews ?? [],
        };
      }
    } catch {
      // network error
    }

    return null;
  },

  /**
   * Get all categories from database
   */
  async getCategories(): Promise<AccessoryCategory[]> {
    try {
      const res = await axiosClient.get<unknown, ApiResponse<RawCategoryDto[]>>('/customer/accessories/categories');
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map((c) => ({
          id: c.id,
          categoryName: c.categoryName || c.tenDanhMuc || c.name || 'Phụ kiện',
          slug: c.slug || (c.id === 1 ? 'charging-energy' : c.id === 2 ? 'camera-sensors' : c.id === 3 ? 'window-films' : 'floor-mats'),
          count: c.count || 3,
        }));
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
          architecture: c.powertrain || 'Thuần điện 800V SiC',
          thumbnailUrl: c.image || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200',
          accessoryCount: 12,
        }));
      }
    } catch {
      // network error
    }
    return [];
  },
};
