import { axiosClient } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type { Accessory, AccessoryCategory, AccessoryFilterParams } from '@/types/accessory.types';
import { MOCK_ACCESSORIES, MOCK_ACCESSORY_CATEGORIES, type CarModelInfo } from '../mocks/accessory.mock';
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

function filterAndSortAccessories(items: Accessory[], params?: AccessoryFilterParams): Accessory[] {
  let filtered = [...items];

  if (params?.categoryId) {
    filtered = filtered.filter((item) => item.categoryId === params.categoryId);
  }

  if (params?.search) {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(
      (item) => item.name.toLowerCase().includes(q) || item.brand.toLowerCase().includes(q)
    );
  }

  if (params?.minPrice !== undefined) {
    filtered = filtered.filter((item) => item.price >= params.minPrice!);
  }

  if (params?.maxPrice !== undefined) {
    filtered = filtered.filter((item) => item.price <= params.maxPrice!);
  }

  if (params?.carModelId) {
    const modelIdNum = Number(params.carModelId);
    filtered = filtered.filter(
      (item) =>
        Boolean(item.dungChung) ||
        Boolean(item.isUniversal) ||
        item.compatibilities?.some((c) => Number(c.carModelId) === modelIdNum)
    );
  }

  if (params?.readyInShowroom) {
    filtered = filtered.filter((item) => item.readyInShowroom);
  }

  if (params?.homeInstallation) {
    filtered = filtered.filter((item) => item.homeInstallation);
  }

  if (params?.isGenuine) {
    filtered = filtered.filter((item) => item.isGenuine);
  }

  if (params?.warrantyYears) {
    filtered = filtered.filter((item) => (item.warrantyYears || 0) >= params.warrantyYears!);
  }

  if (params?.sortBy) {
    switch (params.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => (b.stockQuantity || 0) - (a.stockQuantity || 0));
        break;
    }
  }

  return filtered;
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
      if (res?.data && Array.isArray(res.data)) {
        const hasServerQueryFilter = queryParts.length > 0;
        if (res.data.length > 0 || hasServerQueryFilter) {
          return filterAndSortAccessories(res.data, {
            carModelId: params?.carModelId,
            readyInShowroom: params?.readyInShowroom,
            homeInstallation: params?.homeInstallation,
            isGenuine: params?.isGenuine,
            warrantyYears: params?.warrantyYears,
            sortBy: params?.sortBy,
          });
        }
      }
    } catch {
      // Backend unavailable or network error - gracefully fall back to mock data
    }

    return filterAndSortAccessories(MOCK_ACCESSORIES, params);
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
      // Backend unavailable - fallback to mock item
    }

    const fallback = MOCK_ACCESSORIES.find((a) => a.id === id);
    return fallback ? { ...fallback } : null;
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
      // Backend unavailable - fallback to mock categories
    }
    return MOCK_ACCESSORY_CATEGORIES;
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
          thumbnailUrl: c.image || '/images/cars/gte-grand-touring.jpg',
          accessoryCount: 12,
        }));
      }
    } catch {
      // network error
    }
    return [];
  },
};
