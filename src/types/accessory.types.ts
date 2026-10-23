export interface AccessoryCategory {
  id: number;
  categoryName: string;
  slug: string;
}

export interface AccessoryCompatibility {
  carModelId: number;
  carModelName: string;
  manufactureYearStart: number;
  manufactureYearEnd: number;
}

export interface Accessory {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  sku: string;
  brand: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  thumbnailUrl: string;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  compatibilities: AccessoryCompatibility[];
  isActive: boolean;
}

export interface AccessoryFilterParams {
  categoryId?: number;
  carModelId?: number;
  year?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}
